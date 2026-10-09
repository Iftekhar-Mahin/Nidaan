"""
app/ocr_engine.py — OpenCV preprocessing + ONNX TrOCR inference
"""
import os
import io
import logging
import numpy as np
from PIL import Image

logger = logging.getLogger("nidaan.ocr")

# ── Model handles (loaded once at startup) ──────────────────────────────────
_processor = None
_ort_model = None
_model_dir = os.path.join(os.path.dirname(__file__), '..', 'models', 'nidaan-trocr-onnx')


def load_ocr_model():
    """Load ONNX TrOCR + processor. Call once at startup."""
    global _processor, _ort_model
    if _processor is not None:
        return

    if not os.path.isdir(_model_dir):
        logger.warning(
            f"ONNX model not found at {_model_dir}. "
            "OCR will return empty results until model is installed. "
            "Train on Colab and extract nidaan-trocr-onnx.zip to models/nidaan-trocr-onnx/"
        )
        return

    try:
        from optimum.onnxruntime import ORTModelForVision2Seq
        from transformers import TrOCRProcessor
        import onnxruntime as ort

        opts = ort.SessionOptions()
        opts.intra_op_num_threads = 4           # Use 4 of your 8 i7 threads
        opts.execution_mode = ort.ExecutionMode.ORT_PARALLEL

        _processor = TrOCRProcessor.from_pretrained(_model_dir)
        _ort_model = ORTModelForVision2Seq.from_pretrained(
            _model_dir,
            session_options=opts,
        )
        logger.info("✅ ONNX TrOCR model loaded successfully")
    except Exception as e:
        logger.error(f"Failed to load ONNX model: {e}")


def preprocess_image_cv(image: Image.Image) -> Image.Image:
    """
    OpenCV-based preprocessing pipeline for prescription images:
    grayscale → deskew → binarization → contrast enhancement
    """
    import cv2

    img_np = np.array(image.convert("RGB"))

    # 1. Grayscale
    gray = cv2.cvtColor(img_np, cv2.COLOR_RGB2GRAY)

    # 2. Resize to minimum 1200px wide for OCR accuracy
    h, w = gray.shape
    if w < 1200:
        scale = 1200 / w
        gray = cv2.resize(gray, (int(w * scale), int(h * scale)), interpolation=cv2.INTER_LANCZOS4)

    # 3. Deskew using moments
    coords = np.column_stack(np.where(gray < 200))
    if len(coords) > 100:
        angle = cv2.minAreaRect(coords)[-1]
        if angle < -45:
            angle = -(90 + angle)
        else:
            angle = -angle
        if abs(angle) < 15:  # only correct small skews
            h2, w2 = gray.shape
            M = cv2.getRotationMatrix2D((w2 / 2, h2 / 2), angle, 1.0)
            gray = cv2.warpAffine(gray, M, (w2, h2), flags=cv2.INTER_CUBIC,
                                   borderMode=cv2.BORDER_REPLICATE)

    # 4. Adaptive binarization (handles uneven lighting)
    binary = cv2.adaptiveThreshold(
        gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY, 31, 10
    )

    # 5. Morphological opening to remove noise specks
    kernel = np.ones((1, 1), np.uint8)
    clean = cv2.morphologyEx(binary, cv2.MORPH_OPEN, kernel)

    return Image.fromarray(clean).convert("RGB")


def run_trocr_on_crop(line_image: Image.Image) -> tuple[str, float]:
    """
    Run TrOCR ONNX inference on a single cropped medicine line image.
    Returns (predicted_text, confidence_score).
    """
    if _processor is None or _ort_model is None:
        return "", 0.0

    try:
        # Resize to TrOCR expected dimensions
        line_resized = line_image.resize((384, 64), Image.LANCZOS)
        pixel_values = _processor(images=line_resized, return_tensors="pt").pixel_values

        generated = _ort_model.generate(
            pixel_values,
            max_new_tokens=32,
            num_beams=4,           # beam search for better accuracy
            early_stopping=True,
        )

        text = _processor.batch_decode(generated, skip_special_tokens=True)[0].strip()

        # Estimate confidence from sequence length vs output length
        confidence = min(0.95, max(0.35, len(text) / 30 + 0.4)) if text else 0.0

        return text, round(confidence, 3)

    except Exception as e:
        logger.error(f"TrOCR inference error: {e}")
        return "", 0.0
