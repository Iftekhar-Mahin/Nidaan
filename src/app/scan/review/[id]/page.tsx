'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/context';
import { getPrescriptionById, savePrescription } from '@/lib/prescription-store';
import { PrescriptionRecord, ParsedMedicineItem } from '@/lib/types';
import { DualPanelViewer } from '@/components/review/DualPanelViewer';
import { MedicineEditForm } from '@/components/review/MedicineEditForm';
import {
  ArrowLeft,
  CheckCircle2,
  FileSearch,
  Building2,
  Calendar,
  AlertCircle,
} from 'lucide-react';

export default function ReviewPage() {
  const { t, toBangla } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [prescription, setPrescription] = useState<PrescriptionRecord | null>(null);
  const [items, setItems] = useState<ParsedMedicineItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const rx = getPrescriptionById(id);
    if (rx) {
      setPrescription(rx);
      setItems(rx.parsedItems);
      if (rx.parsedItems.length > 0) {
        setSelectedItemId(rx.parsedItems[0].id);
      }
    }
    setLoading(false);
  }, [id]);

  const handleUpdateItems = (updatedItems: ParsedMedicineItem[]) => {
    setItems(updatedItems);
    if (prescription) {
      const updatedRx = {
        ...prescription,
        parsedItems: updatedItems,
      };
      setPrescription(updatedRx);
      savePrescription(updatedRx);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-500">
        Loading prescription review...
      </div>
    );
  }

  if (!prescription) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="font-bold text-lg text-slate-900 dark:text-white">
          Prescription Not Found
        </h2>
        <p className="text-xs text-slate-500">
          The requested prescription ID could not be loaded.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-600"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Header with Breadcrumbs & Meta */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="p-1 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-white">
              {t('review.title')}
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t('review.subtitle')}
          </p>
        </div>

        {/* Prescription Metadata Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
            <Building2 className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span className="font-semibold">{prescription.doctorName || 'Senior Consultant'}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{toBangla(prescription.date || '2026-08-10')}</span>
          </div>
        </div>
      </div>

      {/* Dual Panel Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
        
        {/* Left 6 Cols: Pan & Zoom Prescription Viewer */}
        <div className="lg:col-span-6 h-full">
          <DualPanelViewer
            imageUrl={prescription.imageUrl}
            items={items}
            selectedItemId={selectedItemId}
            onSelectItem={(id) => setSelectedItemId(id)}
          />
        </div>

        {/* Right 6 Cols: Editable Medicine Form */}
        <div className="lg:col-span-6 h-full">
          <MedicineEditForm
            prescription={prescription}
            items={items}
            selectedItemId={selectedItemId}
            onSelectItem={(id) => setSelectedItemId(id)}
            onUpdateItems={handleUpdateItems}
          />
        </div>

      </div>

    </div>
  );
}
