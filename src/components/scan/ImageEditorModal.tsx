'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n/context';
import { enhanceImageCanvas } from '@/lib/ocr/preprocessor';
import { X, RotateCw, Sun, Contrast, Sliders, Check } from 'lucide-react';

interface ImageEditorModalProps {
  imageSrc: string;
  isOpen: boolean;
  onClose: () => void;
  onApply: (enhancedDataUrl: string) => void;
}

export function ImageEditorModal({ imageSrc, isOpen, onClose, onApply }: ImageEditorModalProps) {
  const { t } = useTranslation();
  const [brightness, setBrightness] = useState<number>(0);
  const [contrast, setContrast] = useState<number>(20); // slight boost default
  const [rotation, setRotation] = useState<number>(0);
  const [binarize, setBinarize] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!isOpen || !imageSrc) return;
    renderCanvas();
  }, [isOpen, imageSrc, brightness, contrast, rotation, binarize]);

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // Source temp canvas
      const srcCanvas = document.createElement('canvas');
      srcCanvas.width = img.naturalWidth || img.width;
      srcCanvas.height = img.naturalHeight || img.height;
      const srcCtx = srcCanvas.getContext('2d');
      if (!srcCtx) return;
      srcCtx.drawImage(img, 0, 0);

      const enhancedDataUrl = enhanceImageCanvas(srcCanvas, {
        brightness,
        contrast,
        binarize,
        rotationDegrees: rotation,
      });

      const previewImg = new Image();
      previewImg.onload = () => {
        canvas.width = previewImg.width;
        canvas.height = previewImg.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(previewImg, 0, 0);
        }
      };
      previewImg.src = enhancedDataUrl;
    };
    img.src = imageSrc;
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleReset = () => {
    setBrightness(0);
    setContrast(0);
    setRotation(0);
    setBinarize(false);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      onApply(canvas.toDataURL('image/jpeg', 0.95));
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-3xl w-full border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              {t('scan.editorTitle')}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Canvas Workspace */}
        <div className="flex-1 overflow-auto p-4 bg-slate-950 flex items-center justify-center min-h-[300px]">
          <canvas
            ref={canvasRef}
            className="max-h-[50vh] max-w-full object-contain rounded-lg shadow-lg border border-slate-800"
          />
        </div>

        {/* Adjustments Toolbars */}
        <div className="p-5 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Brightness */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  {t('scan.brightness')}
                </span>
                <span>{brightness}</span>
              </div>
              <input
                type="range"
                min="-60"
                max="60"
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                className="w-full accent-brand-600 cursor-pointer"
              />
            </div>

            {/* Contrast */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Contrast className="w-3.5 h-3.5 text-sky-500" />
                  {t('scan.contrast')}
                </span>
                <span>{contrast}</span>
              </div>
              <input
                type="range"
                min="-50"
                max="80"
                value={contrast}
                onChange={(e) => setContrast(Number(e.target.value))}
                className="w-full accent-brand-600 cursor-pointer"
              />
            </div>

          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRotate}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100"
              >
                <RotateCw className="w-3.5 h-3.5" />
                {t('scan.rotate')}
              </button>

              <button
                type="button"
                onClick={() => setBinarize(!binarize)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                  binarize
                    ? 'bg-brand-600 text-white border-brand-600'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                }`}
              >
                High Contrast Binarize
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              >
                {t('scan.resetImage')}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                {t('common.cancel')}
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md"
              >
                <Check className="w-3.5 h-3.5" />
                {t('scan.applyEnhancement')}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
