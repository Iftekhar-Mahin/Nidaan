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
  Sparkles,
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
  const [originalImageSrc, setOriginalImageSrc] = useState<string>(imageSrc);
  const [cropSuccessToast, setCropSuccessToast] = useState<string | null>(null);

  // Crop box state in percentages (0 to 1) of image dimensions
  const [cropBox, setCropBox] = useState<CropBox>({
    x: 0.1,
    y: 0.15,
    width: 0.8,
    height: 0.7,
  });

  // Track natural image aspect ratio & display size for 1:1 pixel overlay mapping
  const [imageAspect, setImageAspect] = useState<number>(3 / 4);
  const [displayDimensions, setDisplayDimensions] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  const [isDragging, setIsDragging] = useState(false);
  const [dragHandle, setDragHandle] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [startCropBox, setStartCropBox] = useState<CropBox | null>(null);

  const workspaceRef = useRef<HTMLDivElement | null>(null);
  const cropContainerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Reset when modal opens with new imageSrc
  useEffect(() => {
    if (isOpen && imageSrc) {
      setCurrentImageSrc(imageSrc);
      setOriginalImageSrc(imageSrc);
      setBrightness(0);
      setContrast(20);
      setRotation(0);
      setBinarize(false);
      setCropBox({
        x: 0.1,
        y: 0.15,
        width: 0.8,
        height: 0.7,
      });
      setActiveTab('crop');
      setCropSuccessToast(null);
    }
  }, [isOpen, imageSrc]);

  // Recalculate display dimensions to fit image perfectly inside workspace
  const updateDisplayDimensions = useCallback(() => {
    if (!workspaceRef.current || imageAspect <= 0) return;
    const pad = 24;
    const availW = Math.max(100, workspaceRef.current.clientWidth - pad);
    const availH = Math.max(100, workspaceRef.current.clientHeight - pad);

    let w = availW;
    let h = w / imageAspect;
    if (h > availH) {
      h = availH;
      w = h * imageAspect;
    }
    setDisplayDimensions({
      width: Math.round(w),
      height: Math.round(h),
    });
  }, [imageAspect]);

  // ResizeObserver on workspace container
  useEffect(() => {
    if (!isOpen || !workspaceRef.current) return;
    const ro = new ResizeObserver(() => {
      updateDisplayDimensions();
    });
    ro.observe(workspaceRef.current);
    updateDisplayDimensions();
    return () => ro.disconnect();
  }, [isOpen, updateDisplayDimensions]);

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
        const aspect = previewImg.width / previewImg.height;
        setImageAspect(aspect);
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
    setCropBox({ x: 0.02, y: 0.02, width: 0.96, height: 0.96 });
    setRotation(0);
    setCropSuccessToast('Area cropped! Focus is now on selected section.');
    setTimeout(() => setCropSuccessToast(null), 3000);
  };

  const handleResetToOriginal = () => {
    setCurrentImageSrc(originalImageSrc);
    setBrightness(0);
    setContrast(20);
    setRotation(0);
    setBinarize(false);
    setCropBox({ x: 0.1, y: 0.15, width: 0.8, height: 0.7 });
    setCropSuccessToast(null);
  };

  // Crop box presets
  const handlePresetRxSection = () => {
    // Focus on medicine list / Rx body
    setCropBox({
      x: 0.15,
      y: 0.2,
      width: 0.8,
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
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setIsDragging(true);
    setDragHandle(handle);
    setDragStart({ x: e.clientX, y: e.clientY });
    setStartCropBox({ ...cropBox });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !dragStart || !startCropBox || !cropContainerRef.current) return;

    const rect = cropContainerRef.current.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    const deltaX = (e.clientX - dragStart.x) / rect.width;
    const deltaY = (e.clientY - dragStart.y) / rect.height;

    let { x, y, width, height } = { ...startCropBox };
    const MIN_SIZE = 0.08;

    if (dragHandle === 'move') {
      x = Math.max(0, Math.min(1 - width, startCropBox.x + deltaX));
      y = Math.max(0, Math.min(1 - height, startCropBox.y + deltaY));
    } else if (dragHandle === 'nw') {
      const clampedX = Math.max(0, Math.min(startCropBox.x + startCropBox.width - MIN_SIZE, startCropBox.x + deltaX));
      const clampedY = Math.max(0, Math.min(startCropBox.y + startCropBox.height - MIN_SIZE, startCropBox.y + deltaY));
      width = startCropBox.width + (startCropBox.x - clampedX);
      height = startCropBox.height + (startCropBox.y - clampedY);
      x = clampedX;
      y = clampedY;
    } else if (dragHandle === 'ne') {
      const clampedY = Math.max(0, Math.min(startCropBox.y + startCropBox.height - MIN_SIZE, startCropBox.y + deltaY));
      const clampedW = Math.max(MIN_SIZE, Math.min(1 - startCropBox.x, startCropBox.width + deltaX));
      height = startCropBox.height + (startCropBox.y - clampedY);
      y = clampedY;
      width = clampedW;
    } else if (dragHandle === 'sw') {
      const clampedX = Math.max(0, Math.min(startCropBox.x + startCropBox.width - MIN_SIZE, startCropBox.x + deltaX));
      const clampedH = Math.max(MIN_SIZE, Math.min(1 - startCropBox.y, startCropBox.height + deltaY));
      width = startCropBox.width + (startCropBox.x - clampedX);
      height = clampedH;
      x = clampedX;
    } else if (dragHandle === 'se') {
      width = Math.max(MIN_SIZE, Math.min(1 - startCropBox.x, startCropBox.width + deltaX));
      height = Math.max(MIN_SIZE, Math.min(1 - startCropBox.y, startCropBox.height + deltaY));
    } else if (dragHandle === 'n') {
      const clampedY = Math.max(0, Math.min(startCropBox.y + startCropBox.height - MIN_SIZE, startCropBox.y + deltaY));
      height = startCropBox.height + (startCropBox.y - clampedY);
      y = clampedY;
    } else if (dragHandle === 's') {
      height = Math.max(MIN_SIZE, Math.min(1 - startCropBox.y, startCropBox.height + deltaY));
    } else if (dragHandle === 'w') {
      const clampedX = Math.max(0, Math.min(startCropBox.x + startCropBox.width - MIN_SIZE, startCropBox.x + deltaX));
      width = startCropBox.width + (startCropBox.x - clampedX);
      x = clampedX;
    } else if (dragHandle === 'e') {
      width = Math.max(MIN_SIZE, Math.min(1 - startCropBox.x, startCropBox.width + deltaX));
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

  // Final apply handler: If crop box is actively framing a subregion, auto-slice it before applying
  const handleFinalSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isSubregion =
      cropBox.width < 0.94 ||
      cropBox.height < 0.94 ||
      cropBox.x > 0.04 ||
      cropBox.y > 0.04;

    if (activeTab === 'crop' && isSubregion) {
      const cropX = Math.max(0, Math.floor(cropBox.x * canvas.width));
      const cropY = Math.max(0, Math.floor(cropBox.y * canvas.height));
      const cropW = Math.min(canvas.width - cropX, Math.floor(cropBox.width * canvas.width));
      const cropH = Math.min(canvas.height - cropY, Math.floor(cropBox.height * canvas.height));

      if (cropW >= 20 && cropH >= 20) {
        const croppedCanvas = document.createElement('canvas');
        croppedCanvas.width = cropW;
        croppedCanvas.height = cropH;
        const ctx = croppedCanvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(canvas, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
          onApply(croppedCanvas.toDataURL('image/jpeg', 0.95));
          onClose();
          return;
        }
      }
    }

    onApply(canvas.toDataURL('image/jpeg', 0.95));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col h-[90vh] max-h-[720px] overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-2.5 sm:px-5 sm:py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 sm:p-2 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400">
              <Crop className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-tight">
                Crop & Enhance Prescription
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                Focus AI Vision directly on doctor handwriting & medicine names
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher & Quick Reset */}
        <div className="flex items-center justify-between px-4 py-1.5 sm:py-2 bg-slate-100/70 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold shrink-0">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTab('crop')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'crop'
                  ? 'bg-teal-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800'
              }`}
            >
              <Crop className="w-3.5 h-3.5" />
              <span>Crop Area</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('adjust')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'adjust'
                  ? 'bg-teal-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Contrast & Rotate</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleResetToOriginal}
            className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <Undo2 className="w-3 h-3" />
            <span>Reset Original</span>
          </button>
        </div>

        {/* Interactive Workspace Area */}
        <div
          ref={workspaceRef}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="flex-1 min-h-0 bg-slate-950 flex items-center justify-center relative select-none p-2 sm:p-3 overflow-hidden"
        >
          {/* Toast Notification */}
          {cropSuccessToast && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 bg-emerald-600 text-white text-xs px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 animate-in fade-in slide-in-from-top-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{cropSuccessToast}</span>
            </div>
          )}

          {/* Canvas & Overlay Container — sized exactly to the rendered image */}
          <div
            ref={cropContainerRef}
            className="relative flex items-center justify-center"
            style={{
              width: displayDimensions.width ? `${displayDimensions.width}px` : 'auto',
              height: displayDimensions.height ? `${displayDimensions.height}px` : 'auto',
              maxWidth: '100%',
              maxHeight: '100%',
            }}
          >
            {/* Canvas */}
            <canvas
              ref={canvasRef}
              className="w-full h-full object-contain rounded-lg shadow-2xl block"
            />

            {/* Interactive Crop Overlay */}
            {activeTab === 'crop' && (
              <div className="absolute inset-0 pointer-events-none">
                {/* Dark Mask Top */}
                <div
                  className="absolute bg-slate-950/70 backdrop-blur-[1px]"
                  style={{
                    top: 0,
                    left: 0,
                    right: 0,
                    height: `${cropBox.y * 100}%`,
                  }}
                />
                {/* Dark Mask Bottom */}
                <div
                  className="absolute bg-slate-950/70 backdrop-blur-[1px]"
                  style={{
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: `${Math.max(0, (1 - (cropBox.y + cropBox.height)) * 100)}%`,
                  }}
                />
                {/* Dark Mask Left */}
                <div
                  className="absolute bg-slate-950/70 backdrop-blur-[1px]"
                  style={{
                    top: `${cropBox.y * 100}%`,
                    bottom: `${Math.max(0, (1 - (cropBox.y + cropBox.height)) * 100)}%`,
                    left: 0,
                    width: `${cropBox.x * 100}%`,
                  }}
                />
                {/* Dark Mask Right */}
                <div
                  className="absolute bg-slate-950/70 backdrop-blur-[1px]"
                  style={{
                    top: `${cropBox.y * 100}%`,
                    bottom: `${Math.max(0, (1 - (cropBox.y + cropBox.height)) * 100)}%`,
                    right: 0,
                    width: `${Math.max(0, (1 - (cropBox.x + cropBox.width)) * 100)}%`,
                  }}
                />

                {/* Active Resizable Crop Box */}
                <div
                  onPointerDown={(e) => handlePointerDown(e, 'move')}
                  className="absolute border-2 border-teal-400 shadow-[0_0_15px_rgba(20,184,166,0.6)] cursor-move pointer-events-auto"
                  style={{
                    left: `${cropBox.x * 100}%`,
                    top: `${cropBox.y * 100}%`,
                    width: `${cropBox.width * 100}%`,
                    height: `${cropBox.height * 100}%`,
                  }}
                >
                  {/* Floating Action Button directly on top of crop box */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApplyCrop();
                    }}
                    className="absolute -top-9 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-md bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs shadow-lg transition-all cursor-pointer pointer-events-auto whitespace-nowrap active:scale-95"
                  >
                    <Crop className="w-3.5 h-3.5" />
                    <span>✂️ Crop Selection</span>
                  </button>

                  {/* Rule of Thirds Guidelines */}
                  <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-30">
                    <div className="border-r border-b border-teal-200" />
                    <div className="border-r border-b border-teal-200" />
                    <div className="border-b border-teal-200" />
                    <div className="border-r border-b border-teal-200" />
                    <div className="border-r border-b border-teal-200" />
                    <div className="border-b border-teal-200" />
                    <div className="border-r border-teal-200" />
                    <div className="border-r border-teal-200" />
                    <div />
                  </div>

                  {/* 4 Corner Handles with large tactile touch areas */}
                  <div
                    onPointerDown={(e) => handlePointerDown(e, 'nw')}
                    className="absolute -top-2.5 -left-2.5 w-5 h-5 bg-white border-2 border-teal-600 rounded-full shadow-md cursor-nw-resize"
                  />
                  <div
                    onPointerDown={(e) => handlePointerDown(e, 'ne')}
                    className="absolute -top-2.5 -right-2.5 w-5 h-5 bg-white border-2 border-teal-600 rounded-full shadow-md cursor-ne-resize"
                  />
                  <div
                    onPointerDown={(e) => handlePointerDown(e, 'sw')}
                    className="absolute -bottom-2.5 -left-2.5 w-5 h-5 bg-white border-2 border-teal-600 rounded-full shadow-md cursor-sw-resize"
                  />
                  <div
                    onPointerDown={(e) => handlePointerDown(e, 'se')}
                    className="absolute -bottom-2.5 -right-2.5 w-5 h-5 bg-white border-2 border-teal-600 rounded-full shadow-md cursor-se-resize"
                  />

                  {/* Edge Drag Handles */}
                  <div
                    onPointerDown={(e) => handlePointerDown(e, 'n')}
                    className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-2 bg-teal-400 rounded-full cursor-n-resize opacity-75 hover:opacity-100"
                  />
                  <div
                    onPointerDown={(e) => handlePointerDown(e, 's')}
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-2 bg-teal-400 rounded-full cursor-s-resize opacity-75 hover:opacity-100"
                  />
                  <div
                    onPointerDown={(e) => handlePointerDown(e, 'w')}
                    className="absolute top-1/2 -translate-y-1/2 -left-1 w-2 h-8 bg-teal-400 rounded-full cursor-w-resize opacity-75 hover:opacity-100"
                  />
                  <div
                    onPointerDown={(e) => handlePointerDown(e, 'e')}
                    className="absolute top-1/2 -translate-y-1/2 -right-1 w-2 h-8 bg-teal-400 rounded-full cursor-e-resize opacity-75 hover:opacity-100"
                  />

                  {/* Helper pill */}
                  <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-xs text-[10px] text-white px-2 py-0.5 rounded pointer-events-none font-mono">
                    Drag box or corners to select
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Controls Footer — Always Visible & Fixed at bottom */}
        <div className="shrink-0 p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex flex-col gap-2.5">
          {activeTab === 'crop' ? (
            <div className="flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1 hidden sm:inline">
                  Presets:
                </span>
                <button
                  type="button"
                  onClick={handlePresetRxSection}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-2xs"
                >
                  <FileText className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>Rx / Treatment Area</span>
                </button>
                <button
                  type="button"
                  onClick={handlePresetFull}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-2xs"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Entire Document</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRotation((prev) => (prev + 90) % 360)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-2xs"
                  title="Rotate 90 degrees"
                >
                  <RotateCw className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">Rotate</span>
                </button>
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={handleApplyCrop}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition-colors"
                >
                  <Crop className="w-3.5 h-3.5" />
                  <span>Crop Box</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="button"
                  onClick={handleFinalSave}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-sm transition-all"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Apply to Prescription</span>
                </button>
              </div>
            </div>
          ) : (
            /* Adjust controls + buttons */
            <div className="flex flex-col gap-2.5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 items-center">
                {/* Brightness */}
                <div className="space-y-0.5">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    <span className="flex items-center gap-1">
                      <Sun className="w-3 h-3 text-amber-500" />
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
                    className="w-full accent-teal-600 cursor-pointer h-1.5"
                  />
                </div>

                {/* Contrast */}
                <div className="space-y-0.5">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    <span className="flex items-center gap-1">
                      <Contrast className="w-3 h-3 text-sky-500" />
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
                    className="w-full accent-teal-600 cursor-pointer h-1.5"
                  />
                </div>

                {/* Rotate */}
                <button
                  type="button"
                  onClick={() => setRotation((prev) => (prev + 90) % 360)}
                  className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Rotate ({rotation}°)</span>
                </button>

                {/* Ink Boost */}
                <button
                  type="button"
                  onClick={() => setBinarize(!binarize)}
                  className={`flex items-center justify-center px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                    binarize
                      ? 'bg-teal-600 text-white border-teal-600'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  Ink Boost
                </button>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="button"
                  onClick={handleFinalSave}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-sm transition-all"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Apply to Prescription</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
