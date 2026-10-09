"""
scripts/zip_dataset_for_colab.py
=================================
Zips the RxHandBD dataset folder for upload to Google Colab.
"""
import os
import zipfile

DATASET_DIR = os.path.join(os.path.dirname(__file__), '..', 'datasets', 'RxHandBD')
OUTPUT_ZIP  = os.path.join(os.path.dirname(__file__), '..', 'RxHandBD.zip')

print("Zipping RxHandBD dataset...")
print(f"Source: {os.path.abspath(DATASET_DIR)}")
print(f"Output: {os.path.abspath(OUTPUT_ZIP)}")

total_files = 0
with zipfile.ZipFile(OUTPUT_ZIP, 'w', zipfile.ZIP_DEFLATED) as zf:
    for root, dirs, files in os.walk(DATASET_DIR):
        for file in files:
            abs_path = os.path.join(root, file)
            arc_name = os.path.join('RxHandBD', os.path.relpath(abs_path, DATASET_DIR))
            zf.write(abs_path, arc_name)
            total_files += 1
            if total_files % 1000 == 0:
                print(f"Added {total_files} files...")

size_mb = os.path.getsize(OUTPUT_ZIP) / (1024 * 1024)
print(f"\nDone! {total_files} files written to RxHandBD.zip ({size_mb:.1f} MB)")
