# Guide: Annotating Full Prescriptions for YOLOv8 Line Detection

## Overview
To train **YOLOv8** to automatically crop medicine lines from full prescription slips:
- We have **182 full prescription images** in `datasets/images/` (`1.jpeg` to `182.jpeg`).
- We need bounding boxes around each **medicine line** (e.g. `Tab Napa Extra 1+0+1 7 days`).

---

## Tool: Label Studio (Free, Runs Locally)

### 1. Install & Launch Label Studio
Run in PowerShell:
```powershell
pip install label-studio
label-studio start
```
Label Studio opens automatically in your browser at `http://localhost:8080`.

---

### 2. Setup Project
1. Click **Create Project** -> Name it `Nidaan-Rx-Layout`.
2. In **Labeling Setup**, select **Object Detection with Bounding Boxes**.
3. Set one label name:
   - `medicine_line`
4. Click **Save**.

---

### 3. Import Prescription Images
1. Click **Import**.
2. Drag and drop all images from `D:\Nidaan\datasets\images\` (182 files).

---

### 4. How to Draw Bounding Boxes
For each prescription slip:
- Draw a rectangle around **each individual medicine line** written by the doctor (the line starting with `Tab...`, `Cap...`, `Syr...` including its dosage and frequency).
- **Do not include:** The doctor's clinic header at top, patient personal info, clinical diagnosis (O/E), or general lifestyle advice at the bottom.
- Takes approximately **30–45 seconds per prescription**.

---

### 5. Export Annotations
1. Once you annotate the images, click **Export** (top right).
2. Select **YOLO** format.
3. It downloads a `.zip` file containing `.txt` files with bounding box coordinates.
4. Rename that zip file to `annotations.zip`.

---

### 6. Training on Google Colab
1. Zip `datasets/images/` as `prescription_images.zip`.
2. Open [`scripts/nidaan_yolov8_training.ipynb`](file:///d:/Nidaan/scripts/nidaan_yolov8_training.ipynb) in Google Colab with GPU runtime.
3. Upload `prescription_images.zip` and `annotations.zip`.
4. Run all cells -> Downloads `yolov8_rx_lines.pt`.
5. Place `yolov8_rx_lines.pt` in `D:\Nidaan\models\`.
