'use client';

import React, { useState, useRef, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/context';
import { ImageQualityReport } from '@/lib/types';
import { analyzeImageQuality } from '@/lib/ocr/preprocessor';
import { parsePrescriptionText } from '@/lib/ocr/parser';
import { getAllBrandMedicines, savePrescription } from '@/lib/prescription-store';
import { SAMPLE_PRESETS } from '@/lib/sample-data';
import { ImageEditorModal } from './ImageEditorModal';
import { CameraCapture } from './CameraCapture';
import {
  UploadCloud,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  Sparkles,
  ArrowRight,
  Loader2,
  FileImage,
  RefreshCw,
  Crop,
} from 'lucide-react';

export function ImageUploader() {
  const { t, language, toBangla } = useTranslation();
  const router = useRouter();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('');
  const [qualityReport, setQualityReport] = useState<ImageQualityReport | null>(null);
  const [isAnalyzingQuality, setIsAnalyzingQuality] = useState(false);
  const [isProcessingOcr, setIsProcessingOcr] = useState(false);
  const [ocrStep, setOcrStep] = useState<number>(0);

  const [scanError, setScanError] = useState<string | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Downscale and compress image to avoid hitting Vercel payload limits and localStorage quotas
  const downscaleImageFile = async (file: File, maxDim = 1600, quality = 0.82): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const img = new Image();
        img.onload = () => {
          const w = img.naturalWidth || img.width;
          const h = img.naturalHeight || img.height;
          if (w <= maxDim && h <= maxDim && file.size < 600000) {
            resolve(dataUrl);
            return;
          }
          let targetW = w;
          let targetH = h;
          if (w > h) {
            if (w > maxDim) {
              targetW = maxDim;
              targetH = Math.round((h * maxDim) / w);
            }
          } else {
            if (h > maxDim) {
              targetH = maxDim;
              targetW = Math.round((w * maxDim) / h);
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = targetW;
          canvas.height = targetH;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(dataUrl);
            return;
          }
          ctx.drawImage(img, 0, 0, targetW, targetH);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = () => resolve(dataUrl);
        img.src = dataUrl;
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  };

  // Convert base64 data URL to Blob directly without network fetch
  const dataURLtoBlob = (dataurl: string): Blob => {
    try {
      const arr = dataurl.split(',');
      const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    } catch {
      return new Blob([], { type: 'image/jpeg' });
    }
  };

  // Handle File Selection with auto-compression
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setScanError(null);
    const optimizedDataUrl = await downscaleImageFile(file);
    if (optimizedDataUrl) {
      setSelectedImage(optimizedDataUrl);
      setSelectedPresetId('');
      await runQualityCheck(optimizedDataUrl);
    }
  };

  const runQualityCheck = async (imgSource: string) => {
    setIsAnalyzingQuality(true);
    try {
      const report = await analyzeImageQuality(imgSource);
      setQualityReport(report);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzingQuality(false);
    }
  };

  // Select Sample Preset
  const handleSelectPreset = async (presetId: string) => {
    const preset = SAMPLE_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setScanError(null);
    setSelectedPresetId(presetId);
    setSelectedImage(preset.imageUrl);
    await runQualityCheck(preset.imageUrl);
  };

  // OCR Processing Pipeline
  const handleStartOcr = async () => {
    if (!selectedImage) return;

    setScanError(null);
    setIsProcessingOcr(true);
    setOcrStep(1);

    // Step 1: Preprocessing
    await new Promise((resolve) => setTimeout(resolve, 400));
    setOcrStep(2);

    const database = getAllBrandMedicines();
    const newId = `rx-${Date.now()}`;

    // Check if preset selected
    const activePreset = SAMPLE_PRESETS.find((p) => p.id === selectedPresetId);

    let parsedItems: any[] = [];
    if (activePreset) {
      parsedItems = activePreset.medicines.map((m, idx) => ({
        id: `item-${idx + 1}-${Date.now()}`,
        rawOcrText: m.rawOcr,
        matchedBrand: m.brand,
        matchedGeneric:
          database.find((b) => b.brandName.toLowerCase() === m.brand.toLowerCase())?.generic?.genericName ||
          'Generic Compound',
        strength: m.strength,
        form: m.form,
        dosageSchedule: m.schedule,
        duration: m.duration,
        instructions: m.instructions,
        confidence: m.confidence,
        isUserVerified: m.confidence >= 0.85,
        boundingBox: m.box,
      }));
    } else {
      // Step 2: Clinical Vision Extraction
      try {
        const blob = dataURLtoBlob(selectedImage);
        const formData = new FormData();
        formData.append('image', blob, 'prescription.jpg');

        const scanRes = await fetch('/api/scan', {
          method: 'POST',
          body: formData,
        });

        const scanData = await scanRes.json().catch(() => ({}));

        if (scanRes.ok && Array.isArray(scanData.parsedMedicines) && scanData.parsedMedicines.length > 0) {
          parsedItems = scanData.parsedMedicines;
        } else {
          const errMsg =
            scanData.error ||
            'Could not clearly recognize medicines from this prescription. Please use the Crop tool to frame the medicine area and retry.';
          setScanError(errMsg);
          setIsProcessingOcr(false);
          return;
        }
      } catch (err: any) {
        console.error('Scan API call failed:', err);
        setScanError('Connection to OCR engine failed. Please verify your internet connection and retry.');
        setIsProcessingOcr(false);
        return;
      }
    }

    setOcrStep(3);
    await new Promise((resolve) => setTimeout(resolve, 300));

    const newPrescription = {
      id: newId,
      userId: 'user-patient-1',
      patientName: 'Kazi Farhan Ahmed',
      doctorName: activePreset?.doctorName || 'Senior Consultant Physician',
      clinicHospital: activePreset?.clinic || 'Dhaka Outpatient Clinic',
      date: new Date().toISOString().split('T')[0],
      imageUrl: selectedImage,
      status: 'PENDING' as const,
      parsedItems,
      totalOriginalCost: 1200.0,
      totalGenericCost: 750.0,
      estimatedSavings: 450.0,
      savingsPercentage: 37.5,
      createdAt: new Date().toISOString(),
    };

    savePrescription(newPrescription);

    // Sync to PostgreSQL database in background
    fetch('/api/prescriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: newId,
        imageUrl: selectedImage.startsWith('data:') ? '/samples/prescription_dmch.svg' : selectedImage,
        status: 'PENDING',
        items: parsedItems.map((item: any) => ({
          rawOcrText: item.rawOcrText || '',
          matchedBrand: item.matchedBrand || null,
          matchedGeneric: item.matchedGeneric || null,
          strength: item.strength || null,
          dosageSchedule: item.dosageSchedule || null,
          duration: item.duration || null,
          confidence: item.confidence || 0.85,
        })),
      }),
    }).catch((err) => console.warn('Could not sync prescription to DB:', err));

    setIsProcessingOcr(false);
    router.push(`/scan/review/${newId}`);
  };

  return (
    <div className="space-y-6">
      
      {/* Main Upload / Camera & Quality Inspection Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Cols: Image Preview or Dropzone */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-brand-500 dark:hover:border-brand-500 transition-colors flex flex-col items-center justify-center min-h-[380px] text-center relative overflow-hidden group">
            
            {selectedImage ? (
              <div className="relative w-full flex flex-col items-center">
                <div className="relative max-h-[340px] w-full flex items-center justify-center bg-slate-100 dark:bg-slate-900/60 rounded-xl overflow-hidden p-2">
                  <img
                    src={selectedImage}
                    alt="Prescription Preview"
                    className="max-h-[320px] w-auto object-contain rounded-lg shadow-sm"
                  />

                  {/* OCR Scan Line Animation when processing */}
                  {isProcessingOcr && (
                    <div className="absolute inset-x-0 h-1 bg-brand-500 shadow-[0_0_12px_#0d9488] animate-scan-line pointer-events-none" />
                  )}
                </div>

                {/* Floating Actions on Preview */}
                <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setEditorOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-xs transition-colors"
                  >
                    <Crop className="w-3.5 h-3.5" />
                    <span>Crop Prescription Area</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditorOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 shadow-xs"
                  >
                    <Sliders className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                    <span>Adjust Contrast</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 shadow-xs"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                    <span>Change Image</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 max-w-sm">
                <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto shadow-xs">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-slate-900 dark:text-white">
                    {t('scan.dropzoneTitle')}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {t('scan.dropzoneSubtitle')}
                  </p>
                </div>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-xs transition-colors"
                  >
                    Browse Files
                  </button>
                  <button
                    type="button"
                    onClick={() => setCameraOpen(true)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-200 transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                    <span>{t('scan.useCamera')}</span>
                  </button>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>

        {/* Right 5 Cols: Quality Diagnostic & OCR Launch Action */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          
          {/* Quality Diagnostic Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <FileImage className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                <span>{t('scan.qualityCheckTitle')}</span>
              </h4>
              {isAnalyzingQuality ? (
                <Loader2 className="w-4 h-4 text-brand-600 animate-spin" />
              ) : qualityReport?.isAcceptable ? (
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                  Optimal Quality
                </span>
              ) : (
                <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full">
                  Needs Check
                </span>
              )}
            </div>

            {/* Quality Gauges */}
            <div className="space-y-3 pt-1">
              
              {/* Blur / Sharpness Gauge */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-300 font-medium">Text Sharpness</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {qualityReport ? toBangla(qualityReport.blurScore) : '--'}/১০০
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                    style={{ width: `${qualityReport?.blurScore || 75}%` }}
                  />
                </div>
              </div>

              {/* Lighting & Contrast Gauge */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-300 font-medium">Lighting & Contrast</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {qualityReport ? toBangla(qualityReport.contrastScore) : '--'}/১০০
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full bg-sky-500 rounded-full transition-all duration-300"
                    style={{ width: `${qualityReport?.contrastScore || 80}%` }}
                  />
                </div>
              </div>

            </div>

            {/* Diagnostic advice */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 space-y-1">
              <p className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t('scan.blurGood')}</span>
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {t('scan.lightingGood')}
              </p>
            </div>

          </div>

          {/* Scan Error Banner */}
          {scanError && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs space-y-2 animate-in fade-in">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-xs">{scanError}</p>
                  <p className="text-[11px] text-rose-600 dark:text-rose-300">
                    Doctor handwriting is often easier for the AI to recognize when you crop out extra headers and background.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setEditorOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-colors"
                >
                  <Crop className="w-3.5 h-3.5" />
                  <span>Crop Medicine Area</span>
                </button>
                <button
                  type="button"
                  onClick={() => setScanError(null)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {/* Start OCR Button & Status */}
          <div className="p-5 rounded-2xl bg-gradient-to-tr from-brand-900/90 to-slate-900 text-white shadow-md space-y-4">
            <div>
              <h4 className="font-bold text-base text-white">
                {isProcessingOcr ? t('scan.processingOcr') : 'Ready for AI Medicine Extraction'}
              </h4>
              <p className="text-xs text-brand-200 mt-1">
                {isProcessingOcr
                  ? ocrStep === 1
                    ? t('scan.processingStep1')
                    : ocrStep === 2
                    ? t('scan.processingStep2')
                    : t('scan.processingStep3')
                  : 'Execute TrOCR, entity extraction, and fuzzy drug matching in seconds.'}
              </p>
            </div>

            <button
              type="button"
              disabled={isProcessingOcr || !selectedImage}
              onClick={handleStartOcr}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-brand-500 to-teal-400 hover:from-brand-600 hover:to-teal-500 text-white shadow-lg active:scale-98 transition-all disabled:opacity-50"
            >
              {isProcessingOcr ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing (Step {ocrStep}/3)...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{t('scan.startOcr')}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

        </div>

      </div>

      {/* Editor Modal */}
      {selectedImage && (
        <ImageEditorModal
          imageSrc={selectedImage}
          isOpen={editorOpen}
          onClose={() => setEditorOpen(false)}
          onApply={(enhanced) => {
            setSelectedImage(enhanced);
            runQualityCheck(enhanced);
          }}
        />
      )}

      {/* Camera Capture Modal */}
      <CameraCapture
        isOpen={cameraOpen}
        onClose={() => setCameraOpen(false)}
        onCapture={(img) => {
          setSelectedImage(img);
          setSelectedPresetId('');
          runQualityCheck(img);
        }}
      />

    </div>
  );
}
