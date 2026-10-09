'use client';

import React, { useState, useRef } from 'react';
import { useTranslation } from '@/lib/i18n/context';
import { ParsedMedicineItem } from '@/lib/types';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, MousePointer } from 'lucide-react';

interface DualPanelViewerProps {
  imageUrl: string;
  items: ParsedMedicineItem[];
  selectedItemId: string | null;
  onSelectItem: (id: string) => void;
}

export function DualPanelViewer({
  imageUrl,
  items,
  selectedItemId,
  onSelectItem,
}: DualPanelViewerProps) {
  const { t } = useTranslation();
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3.0));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.75));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="flex flex-col h-full rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
      
      {/* Header Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/50">
        <div className="flex items-center gap-2">
          <MousePointer className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <h3 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
            {t('review.leftPanelTitle')}
          </h3>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleZoomIn}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100"
            title={t('review.zoomIn')}
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100"
            title={t('review.zoomOut')}
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleResetZoom}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100"
            title={t('review.resetZoom')}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-semibold text-slate-500 ml-1">
            {Math.round(zoom * 100)}%
          </span>
        </div>
      </div>

      {/* Prescription Zoomable Viewport */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`relative flex-1 min-h-[500px] overflow-hidden bg-slate-900 flex items-center justify-center p-4 select-none ${
          zoom > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
        }`}
      >
        <div
          style={{
            transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
            transition: isDragging ? 'none' : 'transform 0.15s ease-out',
          }}
          className="relative max-h-[75vh] w-auto max-w-full inline-block shadow-2xl rounded-lg"
        >
          {/* Base Prescription Image */}
          <img
            src={imageUrl}
            alt="Prescription Scan"
            className="max-h-[75vh] w-auto object-contain block rounded-lg pointer-events-none"
          />

          {/* Interactive Bounding Boxes Overlay */}
          {items.map((item, idx) => {
            if (!item.boundingBox) return null;
            const isSelected = selectedItemId === item.id;
            const box = item.boundingBox;

            return (
              <div
                key={item.id || idx}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectItem(item.id);
                }}
                style={{
                  top: `${box.y}%`,
                  left: `${box.x}%`,
                  width: `${box.width}%`,
                  height: `${box.height}%`,
                }}
                className={`absolute rounded transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? 'border-2 border-sky-500 bg-sky-500/30 ring-4 ring-sky-400/40 shadow-lg'
                    : 'border-2 border-brand-500/70 bg-brand-500/15 hover:bg-brand-500/25 hover:border-brand-400'
                }`}
                title={`Line ${idx + 1}: ${item.matchedBrand}`}
              >
                {/* Index tag */}
                <div
                  className={`absolute -top-3 -left-1 px-1.5 py-0.2 text-[10px] font-bold rounded shadow-xs ${
                    isSelected ? 'bg-sky-600 text-white' : 'bg-brand-600 text-white'
                  }`}
                >
                  #{idx + 1}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Viewer Footer Instructions */}
      <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-700 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
        <span>{t('review.clickBoxHint')}</span>
        <span className="font-semibold text-brand-600 dark:text-brand-400">
          {items.length} lines highlighted
        </span>
      </div>

    </div>
  );
}
