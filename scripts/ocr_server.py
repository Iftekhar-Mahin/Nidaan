"""
Nidaan OCR Microservice
=======================
Runs on your HP EliteBook at http://localhost:8000
EasyOCR reads real Bengali+English prescription images.
Falls back to Gemini Vision API for low-confidence results.

Setup (one-time):
    pip install fastapi uvicorn easyocr pillow python-multipart google-generativeai

Run:
    python scripts/ocr_server.py
"""

import io
import os
import json
import base64
import logging
from typing import Optional

import uvicorn
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, ImageFilter, ImageEnhance

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("nidaan-ocr")

app = FastAPI(title="Nidaan OCR Engine", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────
# Load EasyOCR (runs on CPU, first load ~30s)
# ─────────────────────────────────────────────
ocr_reader = None

def get_ocr_reader():
    global ocr_reader
    if ocr_reader is None:
        import easyocr
        logger.info("Loading EasyOCR model (first load takes ~30 seconds)...")
        # Supports both Bengali ('bn') and English ('en') simultaneously
        ocr_reader = easyocr.Reader(['en', 'bn'], gpu=False)
        logger.info("✅ EasyOCR model loaded successfully")
    return ocr_reader


# ─────────────────────────────────────────────
# Image Preprocessing (improves OCR accuracy)
# ─────────────────────────────────────────────
def preprocess_image(image: Image.Image) -> Image.Image:
    """Enhances prescription image for better OCR accuracy."""
    # Convert to RGB
    image = image.convert("RGB")

    # Resize if too small (EasyOCR works best at 1200+ px width)
    w, h = image.size
    if w < 1200:
        scale = 1200 / w
        image = image.resize((int(w * scale), int(h * scale)), Image.LANCZOS)

    # Slight sharpening
    enhancer = ImageEnhance.Sharpness(image)
    image = enhancer.enhance(1.5)

    # Contrast boost
    enhancer = ImageEnhance.Contrast(image)
    image = enhancer.enhance(1.3)

    return image


# ─────────────────────────────────────────────
# Gemini Vision Fallback
# ─────────────────────────────────────────────
def run_gemini_ocr(image: Image.Image, api_key: str) -> list[dict]:
    """
    Uses Gemini 1.5 Flash Vision API to extract prescription lines.
    Returns list of {text, confidence, box} dicts.
    """
    try:
        import google.generativeai as genai
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-1.5-flash")

        # Convert image to bytes
        buf = io.BytesIO()
        image.save(buf, format="JPEG", quality=90)
        img_bytes = buf.getvalue()

        prompt = """You are a medical prescription OCR system for Bangladesh.
Extract all medicine lines from this prescription image.
For each medicine line, return ONLY the raw text as written by the doctor.
Include: medicine name, strength, dosage (e.g. 1+0+1), duration, and instructions.
Ignore: doctor name, hospital name, patient name, date, and advice sections.
Return as JSON array: [{"text": "Tab. Napa Extra 500mg 1+0+1 7 days pc"}, ...]
Only return the JSON array, nothing else."""

        response = model.generate_content([
            prompt,
            {"mime_type": "image/jpeg", "data": base64.b64encode(img_bytes).decode()}
        ])

        raw = response.text.strip()
        # Strip markdown code block if present
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        raw = raw.strip()

        lines_json = json.loads(raw)
        return [
            {
                "text": item.get("text", ""),
                "confidence": 0.92,
                "source": "gemini",
                "box": None
            }
            for item in lines_json
            if item.get("text", "").strip()
        ]

    except Exception as e:
        logger.error(f"Gemini OCR failed: {e}")
        return []


# ─────────────────────────────────────────────
# Filter: Keep Only Likely Medicine Lines
# ─────────────────────────────────────────────
NON_DRUG_PATTERNS = [
    r"^(dr\.|prof\.|md\.|professor)",
    r"^(hospital|clinic|chamber|health)",
    r"^(patient|name|age|sex|gender|weight|bp|date|bmdc)",
    r"^(advice|উপদেশ|next visit|follow|investigation|o/e|diagnosis)",
    r"^(signature|seal|stamp)",
    r"^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}$",   # date only
    r"^[0-9]{4,}$",                               # phone number
    r"^.{0,2}$",                                  # too short
]

import re

def is_likely_medicine_line(text: str) -> bool:
    t = text.strip().lower()
    for pattern in NON_DRUG_PATTERNS:
        if re.match(pattern, t, re.IGNORECASE):
            return False
    # Must contain a letter
    if not re.search(r"[a-zA-Z\u0980-\u09FF]", t):
        return False
    return True


# ─────────────────────────────────────────────
# Main OCR Endpoint
# ─────────────────────────────────────────────
@app.post("/ocr")
async def run_ocr(
    file: UploadFile = File(...),
    gemini_api_key: Optional[str] = None
):
    """
    Accepts a prescription image.
    Returns extracted medicine lines with confidence scores.
    EasyOCR runs first. Gemini fallback fires if avg confidence < 0.60.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image (JPEG, PNG, WEBP)")

    img_bytes = await file.read()
    image = Image.open(io.BytesIO(img_bytes))
    image = preprocess_image(image)

    # ── Stage 1: EasyOCR ──
    reader = get_ocr_reader()
    logger.info(f"Running EasyOCR on image {image.size}...")

    # EasyOCR returns list of (bbox, text, confidence)
    raw_results = reader.readtext(
        image,
        detail=1,
        paragraph=False,
        width_ths=0.7,
        height_ths=0.5,
        decoder="beamsearch"
    )

    lines = []
    total_confidence = 0.0

    for (bbox, text, conf) in raw_results:
        if not text or not text.strip():
            continue
        if not is_likely_medicine_line(text):
            continue

        # Convert EasyOCR bbox [[x1,y1],[x2,y1],[x2,y2],[x1,y2]] to %
        w, h = image.size
        x1 = min(p[0] for p in bbox)
        y1 = min(p[1] for p in bbox)
        x2 = max(p[0] for p in bbox)
        y2 = max(p[1] for p in bbox)

        lines.append({
            "text": text.strip(),
            "confidence": round(float(conf), 3),
            "source": "easyocr",
            "box": {
                "x": round((x1 / w) * 100, 2),
                "y": round((y1 / h) * 100, 2),
                "width": round(((x2 - x1) / w) * 100, 2),
                "height": round(((y2 - y1) / h) * 100, 2),
            }
        })
        total_confidence += float(conf)

    avg_confidence = total_confidence / len(lines) if lines else 0.0
    logger.info(f"EasyOCR found {len(lines)} medicine lines, avg confidence: {avg_confidence:.2f}")

    # ── Stage 2: Gemini Fallback ──
    use_gemini = avg_confidence < 0.60 or len(lines) == 0
    gemini_key = gemini_api_key or os.environ.get("GEMINI_API_KEY", "")

    if use_gemini and gemini_key:
        logger.info("Confidence too low — running Gemini Vision fallback...")
        gemini_lines = run_gemini_ocr(image, gemini_key)
        if gemini_lines:
            lines = gemini_lines
            avg_confidence = 0.92
            logger.info(f"Gemini returned {len(lines)} lines")

    return {
        "success": True,
        "engine": "gemini" if (use_gemini and gemini_key and avg_confidence > 0.80) else "easyocr",
        "lineCount": len(lines),
        "avgConfidence": round(avg_confidence, 3),
        "lines": lines
    }


@app.get("/health")
def health():
    return {"status": "ok", "message": "Nidaan OCR Engine is running"}


if __name__ == "__main__":
    print("\n" + "="*55)
    print("  🩺 Nidaan OCR Engine")
    print("  Running at: http://localhost:8000")
    print("  Health check: http://localhost:8000/health")
    print("  Upload endpoint: POST http://localhost:8000/ocr")
    print("="*55 + "\n")
    uvicorn.run(app, host="0.0.0.0", port=8000)
