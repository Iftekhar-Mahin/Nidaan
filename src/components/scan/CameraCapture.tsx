'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n/context';
import { Camera, X, RefreshCw, Check, AlertCircle } from 'lucide-react';

interface CameraCaptureProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageDataUrl: string) => void;
}

export function CameraCapture({ isOpen, onClose, onCapture }: CameraCaptureProps) {
  const { t, language } = useTranslation();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const startCamera = async () => {
    setError(null);
    try {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setError('Unable to access camera. Please allow camera permissions or upload an image file.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    stopCamera();
    onCapture(dataUrl);
    onClose();
  };

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              {t('scan.useCamera')}
            </h3>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport */}
        <div className="relative bg-black min-h-[350px] sm:min-h-[420px] flex items-center justify-center overflow-hidden">
          {error ? (
            <div className="p-6 text-center text-rose-300 max-w-sm space-y-2">
              <AlertCircle className="w-10 h-10 mx-auto text-rose-400" />
              <p className="text-xs">{error}</p>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover max-h-[60vh]"
              />

              {/* Prescription Alignment Frame Overlay */}
              <div className="absolute inset-6 border-2 border-brand-400/70 border-dashed rounded-xl pointer-events-none flex flex-col justify-between p-4">
                <span className="text-[11px] font-semibold bg-brand-900/80 text-brand-200 px-2.5 py-1 rounded w-fit backdrop-blur-xs">
                  {language === 'bn' ? 'প্রেসক্রিপশন ফ্রেমের মাঝে রাখুন' : 'Align prescription inside box'}
                </span>
                <span className="text-[10px] text-white/80 self-center bg-black/60 px-2 py-0.5 rounded">
                  Hold camera steady for sharp focus
                </span>
              </div>
            </>
          )}
        </div>

        {/* Controls */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 flex items-center justify-between">
          <button
            type="button"
            onClick={toggleFacingMode}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Switch Camera</span>
          </button>

          <button
            type="button"
            onClick={capturePhoto}
            disabled={!!error}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 active:scale-95 transition-all shadow-md disabled:opacity-50"
          >
            <Camera className="w-4 h-4" />
            <span>Capture Prescription</span>
          </button>

          <button
            type="button"
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          >
            {t('common.cancel')}
          </button>
        </div>

      </div>
    </div>
  );
}
