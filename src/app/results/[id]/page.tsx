'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/context';
import { getPrescriptionById } from '@/lib/prescription-store';
import { PrescriptionRecord } from '@/lib/types';
import { SavingsCalculator } from '@/components/results/SavingsCalculator';
import { ComparisonMatrix } from '@/components/results/ComparisonMatrix';
import {
  ArrowLeft,
  Sparkles,
  Building2,
  Calendar,
  AlertCircle,
  FileCheck,
  Edit3,
} from 'lucide-react';

export default function ResultsPage() {
  const { t, toBangla } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [prescription, setPrescription] = useState<PrescriptionRecord | null>(null);
  const [durationDays, setDurationDays] = useState<number>(30); // default to 1 month course
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const rx = getPrescriptionById(id);
    if (rx) {
      setPrescription(rx);
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-500">
        Loading generic drug comparison...
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
          Could not find prescription records for this ID.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-600"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Go to Dashboard</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4 no-print">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              href={`/scan/review/${prescription.id}`}
              className="p-1 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Back to Review Screen"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">
              {t('results.title')}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t('results.subtitle')}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <Link
            href={`/scan/review/${prescription.id}`}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-500" />
            <span>Edit Prescription</span>
          </Link>
        </div>
      </div>

      {/* Printable Clinical Prescription Header (shown when printing) */}
      <div className="hidden print:block p-4 border-b-2 border-black space-y-2 mb-6">
        <h2 className="text-xl font-bold">Nidaan (নিদান) Generic Medicine Alternative Report</h2>
        <p className="text-sm">Patient: {prescription.patientName} | Doctor: {prescription.doctorName} ({prescription.clinicHospital})</p>
        <p className="text-xs text-gray-600">Generated on {new Date().toLocaleDateString()}</p>
      </div>

      {/* Savings Summary Banner & Duration Selector */}
      <SavingsCalculator
        prescription={prescription}
        durationDays={durationDays}
        onDurationChange={(days) => setDurationDays(days)}
      />

      {/* Bangladeshi Brand & Generic Comparison Matrix */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <span>Detailed Medicine-by-Medicine Alternative Comparison</span>
          </h3>
          <span className="text-xs font-semibold text-slate-500">
            {toBangla(prescription.parsedItems.length)} items analyzed
          </span>
        </div>

        <ComparisonMatrix
          items={prescription.parsedItems}
          selectedDurationDays={durationDays}
        />
      </div>

    </div>
  );
}
