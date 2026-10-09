"""
NIDAAN (নিদান) - Custom Prescription OCR Training Script for Google Colab
========================================================================
Run this script on Google Colab with GPU Runtime (T4 GPU - Free Tier).
"""

# STEP 1: Install Dependencies
# Run in Colab: !pip install torch torchvision transformers datasets evaluate jiwer albumentations optimum[onnxruntime] pillow

import os
import random
import torch
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import pandas as pd
from datasets import Dataset
from transformers import (
    TrOCRProcessor,
    VisionEncoderDecoderModel,
    Seq2SeqTrainer,
    Seq2SeqTrainingArguments,
    default_data_collator
)
import evaluate

# =====================================================================
# STEP 2: Generate Synthetic Bangladeshi Prescription Lines
# =====================================================================
print("📦 Generating synthetic Bangladeshi prescription training dataset...")

OUTPUT_DIR = "synthetic_rx_dataset"
os.makedirs(OUTPUT_DIR, exist_ok=True)

DRUG_NAMES = [
    "Tab. Napa Extra", "Cap. Seclo 20mg", "Tab. Moxaclav 625", "Tab. Monas 10mg",
    "Tab. Bizoran 5/20", "Tab. Rostar 10mg", "Tab. Sergel 20mg", "Tab. Comet 500mg",
    "Tab. Sitaglip 50", "Cap. Pantonix 20mg", "Tab. Fexo 120", "Tab. Cef-3 200mg",
    "Tab. Coral-D", "Tab. Thyrox 50mcg", "Cap. Losectil 20", "Tab. Ace Plus",
    "Tab. Angilock 50", "Tab. Maxpro 20", "Tab. Bilatin 20", "Cap. Cefim 200"
]

DOSAGES = [
    "1+0+1 7 days pc", "1-0-1 (ac) 14 days", "1+0+0 30 days", "0+0+1 90 days",
    "১+০+১ ৭ দিন (খাওয়ার পর)", "১+০+১ (খাবারের পূর্বে) ১৪ দিন", "০+০+১ ১ মাস",
    "1 tab twice daily for 5 days", "1 cap before breakfast", "1+1+1 3 days"
]

# Download handwriting font if not present
os.system("wget -q https://github.com/google/fonts/raw/main/ofl/caveat/Caveat-Bold.ttf -O Caveat-Bold.ttf")
font_path = "Caveat-Bold.ttf" if os.path.exists("Caveat-Bold.ttf") else None

records = []
NUM_SAMPLES = 10000  # Set to 10,000 for fast training or 50,000 for maximum accuracy

for i in range(NUM_SAMPLES):
    drug = random.choice(DRUG_NAMES)
    dose = random.choice(DOSAGES)
    text = f"{drug} - {dose}"

    width = random.randint(650, 850)
    height = random.randint(70, 100)
    bg_color = (random.randint(245, 255), random.randint(240, 252), random.randint(235, 250))
    img = Image.new("RGB", (width, height), bg_color)
    draw = ImageDraw.Draw(img)

    ink_color = random.choice([(15, 23, 42), (30, 58, 138), (3, 105, 161), (17, 24, 39)])
    
    if font_path:
        font = ImageFont.truetype(font_path, random.randint(28, 38))
        draw.text((random.randint(15, 30), random.randint(10, 20)), text, fill=ink_color, font=font)
    else:
        draw.text((20, 20), text, fill=ink_color)

    if random.random() > 0.6:
        img = img.filter(ImageFilter.GaussianBlur(radius=random.uniform(0.3, 0.7)))

    file_name = f"rx_{i:06d}.jpg"
    file_path = os.path.join(OUTPUT_DIR, file_name)
    img.save(file_path, quality=85)
    records.append({"file_name": file_path, "text": text})

df = pd.DataFrame(records)
train_df = df.sample(frac=0.9, random_state=42)
test_df = df.drop(train_df.index)

print(f"✅ Generated {len(train_df)} train samples and {len(test_df)} test samples.")

# =====================================================================
# STEP 3: Fine-Tune Microsoft TrOCR
# =====================================================================
print("🚀 Loading TrOCR and configuring GPU trainer...")

MODEL_NAME = "microsoft/trocr-base-handwritten"
processor = TrOCRProcessor.from_pretrained(MODEL_NAME)
model = VisionEncoderDecoderModel.from_pretrained(MODEL_NAME)

model.config.decoder_start_token_id = processor.tokenizer.cls_token_id
model.config.pad_token_id = processor.tokenizer.pad_token_id
model.config.vocab_size = model.config.decoder.vocab_size

def preprocess_fn(examples):
    images = [Image.open(f).convert("RGB") for f in examples["file_name"]]
    pixel_values = processor(images, return_tensors="pt").pixel_values
    labels = processor.tokenizer(examples["text"], padding="max_length", max_length=64).input_ids
    labels = [[(l if l != processor.tokenizer.pad_token_id else -100) for l in label] for label in labels]
    return {"pixel_values": pixel_values, "labels": labels}

train_dataset = Dataset.from_pandas(train_df).map(preprocess_fn, batched=True, batch_size=8)
eval_dataset = Dataset.from_pandas(test_df).map(preprocess_fn, batched=True, batch_size=8)

cer_metric = evaluate.load("cer")

def compute_metrics(pred):
    labels_ids = pred.label_ids
    pred_ids = pred.predictions
    pred_str = processor.batch_decode(pred_ids, skip_special_tokens=True)
    labels_ids[labels_ids == -100] = processor.tokenizer.pad_token_id
    label_str = processor.batch_decode(labels_ids, skip_special_tokens=True)
    cer = cer_metric.compute(predictions=pred_str, references=label_str)
    return {"cer": cer}

training_args = Seq2SeqTrainingArguments(
    output_dir="./trocr_checkpoints",
    per_device_train_batch_size=8,
    per_device_eval_batch_size=8,
    fp16=True,  # Fast 16-bit precision on T4 GPU
    num_train_epochs=8,
    learning_rate=5e-5,
    warmup_steps=300,
    eval_strategy="epoch",
    save_strategy="epoch",
    save_total_limit=1,
    logging_steps=100,
    report_to="none"
)

trainer = Seq2SeqTrainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=eval_dataset,
    data_collator=default_data_collator,
    compute_metrics=compute_metrics,
)

print("⚡ Starting TrOCR Training on GPU...")
trainer.train()

# Save final PyTorch model
trainer.save_model("./nidaan-trocr-final")
processor.save_pretrained("./nidaan-trocr-final")

# =====================================================================
# STEP 4: Export to Optimized ONNX (For Fast Intel CPU on your HP Laptop)
# =====================================================================
print("📦 Exporting to ONNX format for fast Intel CPU execution...")
from optimum.onnxruntime import ORTModelForVision2Seq

onnx_model = ORTModelForVision2Seq.from_pretrained("./nidaan-trocr-final", export=True)
onnx_model.save_pretrained("./nidaan-trocr-onnx")
processor.save_pretrained("./nidaan-trocr-onnx")

# Zip the model for easy 1-click download to your laptop
os.system("zip -r nidaan-trocr-onnx.zip ./nidaan-trocr-onnx")
print("🎉 All done! Download 'nidaan-trocr-onnx.zip' to your laptop.")
