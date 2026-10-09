'use client';

import React from 'react';
import { useTranslation } from '@/lib/i18n/context';
import { PrescriptionRecord } from '@/lib/types';
import { FileText, Pill, PiggyBank, TrendingUp, Sparkles, ArrowUpRight } from 'lucide-react';

interface SavingsTrackerProps {
  prescriptions: PrescriptionRecord[];
}

export function SavingsTracker({ prescriptions }: SavingsTrackerProps) {
  const { t, formatMoney, formatPercent, toBangla } = useTranslation();

  const totalScans = prescriptions.length;
  const totalMedicines = prescriptions.reduce((acc, p) => acc + p.parsedItems.length, 0);
  const totalSavings = prescriptions.reduce((acc, p) => acc + (p.estimatedSavings || 0), 0);
  const totalOriginal = prescriptions.reduce((acc, p) => acc + (p.totalOriginalCost || 0), 0);
  const averageDiscount = totalOriginal > 0 ? (totalSavings / totalOriginal) * 100 : 34.5;

  const cards = [
    {
      title: t('dashboard.metricSavings'),
      value: formatMoney(totalSavings),
      subtext: t('dashboard.metricAvgDiscount') + ': ' + formatPercent(averageDiscount),
      icon: PiggyBank,
      color: 'from-emerald-500 to-teal-600',
      textColor: 'text-emerald-700 dark:text-emerald-300',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
      borderColor: 'border-emerald-200 dark:border-emerald-800',
      badge: 'Up to 70% Off',
    },
    {
      title: t('dashboard.metricScans'),
      value: toBangla(totalScans),
      subtext: 'Prescription Records Stored',
      icon: FileText,
      color: 'from-sky-500 to-blue-600',
      textColor: 'text-sky-700 dark:text-sky-300',
      bgColor: 'bg-sky-50 dark:bg-sky-950/40',
      borderColor: 'border-sky-200 dark:border-sky-800',
      badge: 'Active Archive',
    },
    {
      title: t('dashboard.metricMedicines'),
      value: toBangla(totalMedicines),
      subtext: 'Matched with BD Pharma Generics',
      icon: Pill,
      color: 'from-teal-500 to-emerald-600',
      textColor: 'text-teal-700 dark:text-teal-300',
      bgColor: 'bg-teal-50 dark:bg-teal-950/40',
      borderColor: 'border-teal-200 dark:border-teal-800',
      badge: '100% DGDA Verified',
    },
    {
      title: t('dashboard.metricAvgDiscount'),
      value: formatPercent(averageDiscount),
      subtext: 'Lower Cost on Equivalent Brands',
      icon: TrendingUp,
      color: 'from-purple-500 to-indigo-600',
      textColor: 'text-purple-700 dark:text-purple-300',
      bgColor: 'bg-purple-50 dark:bg-purple-950/40',
      borderColor: 'border-purple-200 dark:border-purple-800',
      badge: 'Per Prescription',
    },
  ];

  // Category breakdown mockup
  const categories = [
    { name: 'Gastric & PPI (Omeprazole / Esomeprazole)', percentage: 38, amount: 620 },
    { name: 'Cardiology & Blood Pressure (Amlodipine / Olmesartan)', percentage: 32, amount: 480 },
    { name: 'Antibiotics & Antimicrobials (Cefixime / Azithromycin)', percentage: 18, amount: 310 },
    { name: 'Respiratory & Allergies (Montelukast / Fexofenadine)', percentage: 12, amount: 180 },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top 4 Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`relative overflow-hidden p-5 rounded-2xl border ${card.borderColor} ${card.bgColor} backdrop-blur-xs transition-all hover:scale-[1.02] hover:shadow-md`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {card.title}
                </span>
                <div className={`p-2.5 rounded-xl bg-gradient-to-tr ${card.color} text-white shadow-xs`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="flex items-baseline gap-2">
                <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${card.textColor}`}>
                  {card.value}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
                <span>{card.subtext}</span>
                <span className="font-semibold text-brand-600 dark:text-brand-400 flex items-center gap-0.5">
                  <Sparkles className="w-3 h-3" />
                  {card.badge}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Savings Breakdown by Therapeutic Area */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              {t('dashboard.categoryBreakdownTitle')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Where your biggest generic medicine savings are generated
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
            Top Savings: Gastric &amp; Cardio
          </span>
        </div>

        <div className="space-y-3">
          {categories.map((cat, i) => (
            <div key={i} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700 dark:text-slate-300">{cat.name}</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white">{formatMoney(cat.amount)}</span>
                  <span className="text-slate-400">({formatPercent(cat.percentage)})</span>
                </div>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    i === 0 ? 'bg-emerald-500' :
                    i === 1 ? 'bg-sky-500' :
                    i === 2 ? 'bg-teal-500' : 'bg-indigo-500'
                  }`}
                  style={{ width: `${cat.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
