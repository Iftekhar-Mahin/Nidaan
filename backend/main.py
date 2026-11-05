"""
app/main.py — Nidaan FastAPI Backend
=====================================
Exposes:
  POST /api/v1/ocr   — Prescription image → YOLOv8 line detection → TrOCR ONNX → extracted lines
  POST /api/v1/match — OCR text → RapidFuzz + pg_trgm → top-K drug matches with BDT prices
  GET  /api/v1/health

Run:
  cd D:\\Nidaan
  python -m uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
"""

import io
import os
import re
import logging
from contextlib import asynccontextmanager
from typing import Optional

import uvicorn
from fastapi import FastAPI, File, UploadFile, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image

from backend.ocr_engine import load_ocr_model, preprocess_image_cv, run_trocr_on_crop
from backend.matcher import load_brand_cache, match_drug
from backend.db import engine, search_brands_trgm

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(name)s  %(levelname)s  %(message)s",
)
logger = logging.getLogger("nidaan.api")

# ── Non-drug line filter ─────────────────────────────────────────────────────
NON_DRUG_RE = re.compile(
    r"^(dr\.|prof\.|md\.?|patient|name|age|sex|date|hospital|clinic|bmdc|"
    r"advice|investigation|o/e|bp:|diagnosis|signature|follow|next)",
    re.IGNORECASE,
)


def is_drug_line(text: str) -> bool:
    t = text.strip()
    if len(t) < 3:
        return False
    if NON_DRUG_RE.match(t):
        return False
    if not re.search(r"[a-zA-Z\u0980-\u09FF]", t):
        return False
    return True


# ── YOLOv8 layout detector (optional — falls back to EasyOCR) ────────────────
_yolo_model = None
_yolo_path = os.path.join(os.path.dirname(__file__), '..', 'models', 'yolov8_rx_lines.pt')


def load_yolo():
    global _yolo_model
    if os.path.exists(_yolo_path):
        try:
            from ultralytics import YOLO
            _yolo_model = YOLO(_yolo_path)
            logger.info("✅ YOLOv8 layout detector loaded")
        except Exception as e:
            logger.warning(f"YOLOv8 load failed: {e} — falling back to EasyOCR")


# ── EasyOCR fallback ─────────────────────────────────────────────────────────
_easy_reader = None


def get_easy_reader():
    global _easy_reader
    if _easy_reader is None:
        import easyocr
        logger.info("Loading EasyOCR (first load ~30s)...")
        _easy_reader = easyocr.Reader(["en", "bn"], gpu=False)
        logger.info("✅ EasyOCR loaded")
    return _easy_reader


# ── App lifespan: load all models once at startup ───────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🚀 Nidaan FastAPI starting up...")
    load_ocr_model()
    load_yolo()

    # Pre-load brand cache from PostgreSQL for RapidFuzz
    try:
        from sqlalchemy import text
        with engine.connect() as conn:
            rows = conn.execute(text("""
                SELECT bm.id, bm."brandName", bm.strength, bm.form,
                       bm.manufacturer, bm."unitPrice", bm."packSize",
                       gd."genericName", gd.category
                FROM "BrandMedicine" bm
                JOIN "GenericDrug" gd ON bm."genericId" = gd.id
                WHERE bm."isAvailable" = true
            """)).fetchall()

        brands = [
            {
                "id": r.id,
                "brandName": r.brandName,
                "strength": r.strength,
                "form": r.form,
                "manufacturer": r.manufacturer,
                "unitPrice": r.unitPrice,
                "packSize": r.packSize,
                "genericName": r.genericName,
                "category": r.category,
            }
            for r in rows
        ]
        load_brand_cache(brands)
        logger.info(f"✅ Brand cache loaded: {len(brands)} medicines from PostgreSQL")
    except Exception as e:
        logger.error(f"DB brand cache load failed: {e}. Run `npx prisma db push && npm run db:seed` first.")

    yield
    logger.info("Nidaan FastAPI shutting down.")


app = FastAPI(
    title="Nidaan OCR & Drug Matching API",
    version="2.0.0",
    description="Prescription OCR + Bangladeshi drug fuzzy matching for Nidaan (নিদান)",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Request / Response schemas ───────────────────────────────────────────────
class MatchRequest(BaseModel):
    text: str
    top_k: int = 5


class OcrLine(BaseModel):
    text: str
    confidence: float
    source: str
    box: Optional[dict] = None


# ── POST /api/v1/ocr (and alias /ocr) ────────────────────────────────────────
@app.post("/api/v1/ocr")
@app.post("/ocr")
async def run_ocr(file: UploadFile = File(...)):
    """
    Accepts a prescription image file.
    Returns extracted medicine lines with bounding boxes and confidence scores.

    Pipeline:
      1. OpenCV preprocessing (grayscale → deskew → binarize → denoise)
      2a. YOLOv8 line detection (if model installed)
         → Crop each line → TrOCR ONNX inference
      2b. EasyOCR fallback (if YOLOv8 not installed)
      3. Filter non-drug lines
    """
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(400, "File must be an image (JPEG, PNG, WEBP)")

    raw = await file.read()
    image = Image.open(io.BytesIO(raw)).convert("RGB")

    # Preprocess
    processed = preprocess_image_cv(image)
    img_np = __import__('numpy').array(processed)
    w, h = processed.size

    lines: list[OcrLine] = []

    # ── Branch A: YOLOv8 + TrOCR ────────────────────────────────────────
    if _yolo_model is not None:
        results = _yolo_model(img_np, conf=0.30, verbose=False)
        boxes = results[0].boxes.xyxy.cpu().numpy() if results[0].boxes else []

        for box in boxes:
            x1, y1, x2, y2 = map(int, box)
            crop = processed.crop((x1, y1, x2, y2))
            text, conf = run_trocr_on_crop(crop)
            if text and is_drug_line(text):
                lines.append(OcrLine(
                    text=text,
                    confidence=conf,
                    source="yolov8+trocr",
                    box={
                        "x": round(x1 / w * 100, 2),
                        "y": round(y1 / h * 100, 2),
                        "width": round((x2 - x1) / w * 100, 2),
                        "height": round((y2 - y1) / h * 100, 2),
                    },
                ))

    # ── Branch B: EasyOCR fallback ───────────────────────────────────────
    if not lines:
        reader = get_easy_reader()
        raw_results = reader.readtext(
            img_np, detail=1, paragraph=False,
            width_ths=0.7, decoder="beamsearch"
        )
        for (bbox, text, conf) in raw_results:
            if not text or not is_drug_line(text):
                continue
            x1 = min(p[0] for p in bbox)
            y1 = min(p[1] for p in bbox)
            x2 = max(p[0] for p in bbox)
            y2 = max(p[1] for p in bbox)
            lines.append(OcrLine(
                text=text.strip(),
                confidence=round(float(conf), 3),
                source="easyocr",
                box={
                    "x": round(x1 / w * 100, 2),
                    "y": round(y1 / h * 100, 2),
                    "width": round((x2 - x1) / w * 100, 2),
                    "height": round((y2 - y1) / h * 100, 2),
                },
            ))

    avg_conf = round(sum(l.confidence for l in lines) / len(lines), 3) if lines else 0.0

    return {
        "success": True,
        "engine": lines[0].source if lines else "none",
        "lineCount": len(lines),
        "avgConfidence": avg_conf,
        "lines": [l.model_dump() for l in lines],
    }


# ── POST /api/v1/match (and alias /match) ───────────────────────────────────
@app.post("/api/v1/match")
@app.post("/match")
async def match_medicine(req: MatchRequest):
    """
    Accepts a raw OCR text string (drug name, possibly misspelled).
    Returns top-K Bangladeshi brand medicines with generic names and BDT prices.

    Matching strategy:
      1. RapidFuzz WRatio against in-memory brand cache (fast)
      2. pg_trgm fallback for short/ambiguous queries
    """
    if not req.text or len(req.text.strip()) < 2:
        raise HTTPException(400, "Query text must be at least 2 characters")

    result = match_drug(req.text.strip(), top_k=req.top_k)

    return {
        "query": req.text,
        "bestMatch": result["bestMatch"],
        "confidence": result["confidence"],
        "topSuggestions": result["topSuggestions"],
    }


# ── GET /api/v1/health (and alias /health) ───────────────────────────────────
@app.get("/api/v1/health")
@app.get("/health")
def health():
    from backend.ocr_engine import _model, _processor
    return {
        "status": "ok",
        "trocr_loaded": _model is not None,
        "yolov8_loaded": _yolo_model is not None,
        "version": "2.0.0",
    }


if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("  🩺 Nidaan FastAPI Backend  v2.0")
    print("  OCR : http://localhost:8001/api/v1/ocr")
    print("  Match: http://localhost:8001/api/v1/match")
    print("  Docs : http://localhost:8001/docs")
    print("=" * 60 + "\n")
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8001, reload=True)
