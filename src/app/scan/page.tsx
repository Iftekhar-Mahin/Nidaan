'use client';

import React from 'react';
import { useTranslation } from '@/lib/i18n/context';
import { ImageUploader } from '@/components/scan/ImageUploader';
import { Scan, Sparkles } from 'lucide-react';

export default function ScanPage() {
  const { t } = useTranslation();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Title */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400">
            <Scan className="w-5 h-5" />
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">
            {t('scan.title')}
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {t('scan.subtitle')}
        </p>
      </div>

      {/* Image Uploader & Preprocessor Studio */}
      <ImageUploader />

    </div>
  );
}
