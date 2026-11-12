'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from '@/lib/i18n/context';
import { enhanceImageCanvas } from '@/lib/ocr/preprocessor';
import {
  X,
  RotateCw,
  Sun,
  Contrast,
  Sliders,
  Check,
  Crop,
  Maximize2,
  Undo2,
  FileText,
} from 'lucide-react';

interface ImageEditorModalProps {
  imageSrc: string;
  isOpen: boolean;
  onClose: () => void;
  onApply: (enhancedDataUrl: string) => void;
}

interface CropBox {
  x: number; // 0 to 1 percentage
  y: number;
  width: number;
  height: number;
}

export function ImageEditorModal({ imageSrc, isOpen, onClose, onApply }: ImageEditorModalProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'crop' | 'adjust'>('crop');

  // Adjustment filters
  const [brightness, setBrightness] = useState<number>(0);
  const [contrast, setContrast] = useState<number>(20);
  const [rotation, setRotation] = useState<number>(0);
  const [binarize, setBinarize] = useState<boolean>(false);

  // Original image state and base working image (before/after crop)
  const [currentImageSrc, setCurrentImageSrc] = useState<string>(imageSrc);
  const [originalImageSrc] = useState<string>(imageSrc);

  // Crop box state in percentages (0 to 1) of image dimensions
  const [cropBox, setCropBox] = useState<CropBox>({
    x: 0.05,
    y: 0.15,
    width: 0.90,
    height: 0.75,
  });

  const [isDragging, setIsDragging] = useState(false);
  const [dragHandle, setDragHandle] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [startCropBox, setStartCropBox] = useState<CropBox | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Reset when modal opens with new imageSrc
  useEffect(() => {
    if (isOpen && imageSrc) {
      setCurrentImageSrc(imageSrc);
      setBrightness(0);
      setContrast(20);
      setRotation(0);
      setBinarize(false);
      setCropBox({
        x: 0.05,
        y: 0.15,
        width: 0.90,
        height: 0.75,
      });
      setActiveTab('crop');
    }
  }, [isOpen, imageSrc]);

  // Render main preview canvas
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !currentImageSrc) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
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
    img.src = currentImageSrc;
  }, [currentImageSrc, brightness, contrast, rotation, binarize]);

  useEffect(() => {
    if (!isOpen) return;
    renderCanvas();
  }, [isOpen, renderCanvas]);

  // Crop execution on current canvas
  const handleApplyCrop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const cropX = Math.max(0, Math.floor(cropBox.x * canvas.width));
    const cropY = Math.max(0, Math.floor(cropBox.y * canvas.height));
    const cropW = Math.min(canvas.width - cropX, Math.floor(cropBox.width * canvas.width));
    const cropH = Math.min(canvas.height - cropY, Math.floor(cropBox.height * canvas.height));

    if (cropW < 20 || cropH < 20) return;

    const croppedCanvas = document.createElement('canvas');
    croppedCanvas.width = cropW;
    croppedCanvas.height = cropH;
    const ctx = croppedCanvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(canvas, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
    const croppedUrl = croppedCanvas.toDataURL('image/jpeg', 0.95);

    setCurrentImageSrc(croppedUrl);
    setCropBox({ x: 0.05, y: 0.05, width: 0.9, height: 0.9 });
    setRotation(0);
  };

  const handleResetToOriginal = () => {
    setCurrentImageSrc(originalImageSrc);
    setBrightness(0);
    setContrast(20);
    setRotation(0);
    setBinarize(false);
    setCropBox({ x: 0.05, y: 0.15, width: 0.9, height: 0.75 });
  };

  // Crop box presets
  const handlePresetRxSection = () => {
    // Focus on middle-to-bottom right side where doctors write medicines
    setCropBox({
      x: 0.25,
      y: 0.22,
      width: 0.72,
      height: 0.72,
    });
  };

  const handlePresetFull = () => {
    setCropBox({
      x: 0.02,
      y: 0.02,
      width: 0.96,
      height: 0.96,
    });
  };

  // Pointer event handlers for crop box dragging and resizing
  const handlePointerDown = (e: React.PointerEvent, handle: string) => {
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setIsDragging(true);
    setDragHandle(handle);
    setDragStart({ x: e.clientX, y: e.clientY });
    setStartCropBox({ ...cropBox });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !dragStart || !startCropBox || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    const deltaX = (e.clientX - dragStart.x) / rect.width;
    const deltaY = (e.clientY - dragStart.y) / rect.height;

    let { x, y, width, height } = { ...startCropBox };

    if (dragHandle === 'move') {
      x = Math.max(0, Math.min(1 - width, x + deltaX));
      y = Math.max(0, Math.min(1 - height, y + deltaY));
    } else if (dragHandle === 'nw') {
      const newX = Math.max(0, Math.min(x + width - 0.1, x + deltaX));
      const newY = Math.max(0, Math.min(y + height - 0.1, y + deltaY));
      width = width + (x - newX);
      height = height + (y - newY);
      x = newX;
      y = newY;
    } else if (dragHandle === 'ne') {
      const newY = Math.max(0, Math.min(y + height - 0.1, y + deltaY));
      width = Math.max(0.1, Math.min(1 - x, width + deltaX));
      height = height + (y - newY);
      y = newY;
    } else if (dragHandle === 'sw') {
      const newX = Math.max(0, Math.min(x + width - 0.1, x + deltaX));
      width = width + (x - newX);
      height = Math.max(0.1, Math.min(1 - y, height + deltaY));
      x = newX;
    } else if (dragHandle === 'se') {
      width = Math.max(0.1, Math.min(1 - x, width + deltaX));
      height = Math.max(0.1, Math.min(1 - y, height + deltaY));
    }

    setCropBox({ x, y, width, height });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
      setIsDragging(false);
      setDragHandle(null);
    }
  };

  const handleFinalSave = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      onApply(canvas.toDataURL('image/jpeg', 0.95));
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-4xl w-full border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400">
              <Crop className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Prescription Crop & Enhancement Studio
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Crop out borders or doctor headers to focus AI Vision directly on prescribed medicines
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center justify-between px-5 py-2.5 bg-slate-100/70 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('crop')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'crop'
                  ? 'bg-brand-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800'
              }`}
            >
              <Crop className="w-3.5 h-3.5" />
              <span>Crop Prescription</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('adjust')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'adjust'
                  ? 'bg-brand-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Brightness & Contrast</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleResetToOriginal}
            className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <Undo2 className="w-3 h-3" />
            <span>Reset to Original Image</span>
          </button>
        </div>

        {/* Interactive Workspace Canvas */}
        <div
          ref={containerRef}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="flex-1 overflow-hidden p-4 bg-slate-950 flex items-center justify-center relative min-h-[360px] select-none"
        >
          {/* Main Rendering Canvas */}
          <canvas
            ref={canvasRef}
            className="max-h-[50vh] max-w-full object-contain rounded-lg shadow-xl"
          />

          {/* Interactive Crop Overlay (Visible only when in Crop mode) */}
          {activeTab === 'crop' && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div
                className="relative"
                style={{
                  width: canvasRef.current?.offsetWidth || '100%',
                  height: canvasRef.current?.offsetHeight || '100%',
                }}
              >
                {/* Dark Mask Top */}
                <div
                  className="absolute bg-slate-950/65 backdrop-blur-[1px]"
                  style={{
                    top: 0,
                    left: 0,
                    right: 0,
                    height: `${cropBox.y * 100}%`,
                  }}
                />
                {/* Dark Mask Bottom */}
                <div
                  className="absolute bg-slate-950/65 backdrop-blur-[1px]"
                  style={{
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: `${(1 - (cropBox.y + cropBox.height)) * 100}%`,
                  }}
                />
                {/* Dark Mask Left */}
                <div
                  className="absolute bg-slate-950/65 backdrop-blur-[1px]"
                  style={{
                    top: `${cropBox.y * 100}%`,
                    bottom: `${(1 - (cropBox.y + cropBox.height)) * 100}%`,
                    left: 0,
                    width: `${cropBox.x * 100}%`,
                  }}
                />
                {/* Dark Mask Right */}
                <div
                  className="absolute bg-slate-950/65 backdrop-blur-[1px]"
                  style={{
                    top: `${cropBox.y * 100}%`,
                    bottom: `${(1 - (cropBox.y + cropBox.height)) * 100}%`,
                    right: 0,
                    width: `${(1 - (cropBox.x + cropBox.width)) * 100}%`,
                  }}
                />

                {/* Active Resizable Crop Box */}
                <div
                  onPointerDown={(e) => handlePointerDown(e, 'move')}
                  className="absolute border-2 border-brand-400 shadow-[0_0_15px_rgba(13,148,136,0.5)] cursor-move pointer-events-auto"
                  style={{
                    left: `${cropBox.x * 100}%`,
                    top: `${cropBox.y * 100}%`,
                    width: `${cropBox.width * 100}%`,
                    height: `${cropBox.height * 100}%`,
                  }}
                >
                  {/* Rule of Thirds Guidelines */}
                  <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-30">
                    <div className="border-r border-b border-brand-200" />
                    <div className="border-r border-b border-brand-200" />
                    <div className="border-b border-brand-200" />
                    <div className="border-r border-b border-brand-200" />
                    <div className="border-r border-b border-brand-200" />
                    <div className="border-b border-brand-200" />
                    <div className="border-r border-brand-200" />
                    <div className="border-r border-brand-200" />
                    <div />
                  </div>

                  {/* Corner Handles */}
                  <div
                    onPointerDown={(e) => handlePointerDown(e, 'nw')}
                    className="absolute -top-2.5 -left-2.5 w-5 h-5 bg-white border-2 border-brand-600 rounded-full shadow-md cursor-nw-resize"
                  />
                  <div
                    onPointerDown={(e) => handlePointerDown(e, 'ne')}
                    className="absolute -top-2.5 -right-2.5 w-5 h-5 bg-white border-2 border-brand-600 rounded-full shadow-md cursor-ne-resize"
                  />
                  <div
                    onPointerDown={(e) => handlePointerDown(e, 'sw')}
                    className="absolute -bottom-2.5 -left-2.5 w-5 h-5 bg-white border-2 border-brand-600 rounded-full shadow-md cursor-sw-resize"
                  />
                  <div
                    onPointerDown={(e) => handlePointerDown(e, 'se')}
                    className="absolute -bottom-2.5 -right-2.5 w-5 h-5 bg-white border-2 border-brand-600 rounded-full shadow-md cursor-se-resize"
                  />

                  {/* Helper pill */}
                  <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-xs text-[10px] text-white px-2 py-0.5 rounded pointer-events-none font-mono">
                    Drag box or corners to select text
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Controls Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 space-y-4">
          
          {activeTab === 'crop' ? (
            /* Quick Crop Tools */
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mr-1">
                  Quick Presets:
                </span>
                <button
                  type="button"
                  onClick={handlePresetRxSection}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-2xs"
                >
                  <FileText className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                  <span>Rx / Treatment Area</span>
                </button>
                <button
                  type="button"
                  onClick={handlePresetFull}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-2xs"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Entire Document</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleApplyCrop}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-xs transition-colors"
              >
                <Crop className="w-3.5 h-3.5" />
                <span>Crop Selection Now</span>
              </button>
            </div>
          ) : (
            /* Brightness & Contrast Sliders */
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <Sun className="w-3.5 h-3.5 text-amber-500" />
                      <span>{t('scan.brightness')}</span>
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

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <Contrast className="w-3.5 h-3.5 text-sky-500" />
                      <span>{t('scan.contrast')}</span>
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

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setRotation((prev) => (prev + 90) % 360)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Rotate 90°</span>
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
                  Ink Boost (Binarize)
                </button>
              </div>
            </div>
          )}

          {/* Action Footer Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              {currentImageSrc !== originalImageSrc ? '✓ Image cropped & ready for AI scan' : 'Drag corners to crop'}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                type="button"
                onClick={handleFinalSave}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-sm transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Apply to Prescription</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
