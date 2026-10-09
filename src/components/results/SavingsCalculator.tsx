'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/lib/i18n/context';
import { PrescriptionRecord } from '@/lib/types';
import { calculatePrescriptionSavings } from '@/lib/prescription-store';
import {
  PiggyBank,
  TrendingDown,
  Printer,
  Share2,
  AlertTriangle,
  ShieldCheck,
  Calendar,
  Check,
} from 'lucide-react';

interface SavingsCalculatorProps {
  prescription: PrescriptionRecord;
  durationDays: number;
  onDurationChange: (days: number) => void;
}

export function SavingsCalculator({
  prescription,
  durationDays,
  onDurationChange,
}: SavingsCalculatorProps) {
  const { t, formatMoney, formatPercent, toBangla, language } = useTranslation();
  const [copied, setCopied] = useState(false);

  const summary = calculatePrescriptionSavings(prescription, durationDays);

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const text = language === 'bn'
      ? `প্রেসক্রিপশন সাশ্রয় রিপোর্ট (নিদান): মূল খরচ ${formatMoney(summary.totalPrescribedCost)}, জেনেরিক বিকল্প গ্রহণ করে মোট সাশ্রয় ${formatMoney(summary.totalSavingsBDT)} (${formatPercent(summary.savingsPercentage)})!`
      : `Nidaan Prescription Savings Report: Original cost ${formatMoney(summary.totalPrescribedCost)}, save ${formatMoney(summary.totalSavingsBDT)} (${formatPercent(summary.savingsPercentage)}) by switching to certified generic alternatives!`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const durations = [
    { label: t('results.days7'), days: 7 },
    { label: t('results.days14'), days: 14 },
    { label: t('results.month1'), days: 30 },
    { label: t('results.months3'), days: 90 },
  ];

  return (
    <div className="space-y-6">
      
      {/* Course Duration Selector Pills */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
            {t('results.courseDuration')}
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {durations.map((d) => (
            <button
              key={d.days}
              type="button"
              onClick={() => onDurationChange(d.days)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                durationDays === d.days
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Prescription Savings Banner */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-tr from-brand-900 via-teal-900 to-slate-900 text-white shadow-xl">
        <div className="relative z-10 space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-800/80 pb-4">
            <div>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-brand-500/20 text-brand-300 border border-brand-400/30">
                <PiggyBank className="w-3.5 h-3.5" />
                {t('results.savingsBannerTitle')}
              </span>
              <h2 className="font-heading font-extrabold text-xl sm:text-2xl mt-2 text-white">
                {t('results.savingsBannerDesc')}
              </h2>
            </div>

            {/* Print & Share Actions */}
            <div className="flex items-center gap-2 self-start sm:self-auto no-print">
              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/10 backdrop-blur-xs transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{t('results.printReport')}</span>
              </button>

              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Pricing KPI Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Original Cost */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <span className="text-xs text-slate-300 font-medium">{t('results.originalTotal')}</span>
              <div className="text-xl sm:text-2xl font-bold text-slate-300 line-through mt-1">
                {formatMoney(summary.totalPrescribedCost)}
              </div>
              <span className="text-[10px] text-slate-400">Standard brand prices</span>
            </div>

            {/* Optimal Generic Cost */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <span className="text-xs text-brand-300 font-medium">{t('results.genericTotal')}</span>
              <div className="text-xl sm:text-2xl font-bold text-brand-300 mt-1">
                {formatMoney(summary.totalOptimalGenericCost)}
              </div>
              <span className="text-[10px] text-brand-200">With top generic alternatives</span>
            </div>

            {/* Net Savings */}
            <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 backdrop-blur-xs">
              <span className="text-xs text-emerald-300 font-bold">{t('results.netSavings')}</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-300 mt-1 flex items-baseline gap-2">
                <span>{formatMoney(summary.totalSavingsBDT)}</span>
              </div>
              <span className="text-xs font-bold text-emerald-400">
                Save {formatPercent(summary.savingsPercentage)} per {toBangla(durationDays)} days course
              </span>
            </div>

          </div>

        </div>
      </div>

      {/* Mandatory Patient Safety Advisory Box */}
      <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 space-y-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
          <h4 className="font-bold text-sm text-amber-900 dark:text-amber-100">
            {t('results.disclaimerBoxTitle')}
          </h4>
        </div>
        <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-300">
          {t('results.disclaimerBoxText')}
        </p>
      </div>

    </div>
  );
}
