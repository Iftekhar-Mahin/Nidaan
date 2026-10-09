'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/context';
import { PrescriptionRecord } from '@/lib/types';
import {
  FileText,
  Calendar,
  Building2,
  Pill,
  CheckCircle2,
  Clock,
  ArrowRight,
  Eye,
  Edit3,
} from 'lucide-react';

interface RecentScansProps {
  prescriptions: PrescriptionRecord[];
}

export function RecentScans({ prescriptions }: RecentScansProps) {
  const { t, formatMoney, toBangla } = useTranslation();

  if (prescriptions.length === 0) {
    return (
      <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
          {t('dashboard.noScans')}
        </p>
        <Link
          href="/scan"
          className="inline-flex items-center gap-2 mt-4 px-4 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-colors shadow-xs"
        >
          {t('dashboard.scanNow')}
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
      <div className="p-5 border-b border-slate-100 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            {t('dashboard.recentScansTitle')}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t('dashboard.recentScansSubtitle')}
          </p>
        </div>
        <Link
          href="/scan"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/60 hover:bg-brand-100 rounded-lg transition-colors border border-brand-200 dark:border-brand-800"
        >
          <span>{t('dashboard.scanNow')}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-900/40 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
              <th className="py-3 px-4">{t('dashboard.tableDate')}</th>
              <th className="py-3 px-4">{t('dashboard.tableHospital')}</th>
              <th className="py-3 px-4">{t('dashboard.tableItems')}</th>
              <th className="py-3 px-4">{t('dashboard.tableSavings')}</th>
              <th className="py-3 px-4">{t('dashboard.tableStatus')}</th>
              <th className="py-3 px-4 text-right">{t('dashboard.tableAction')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-xs">
            {prescriptions.map((rx) => {
              const isPending = rx.status === 'PENDING';
              return (
                <tr
                  key={rx.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-750/50 transition-colors group"
                >
                  {/* Date */}
                  <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-slate-100 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{toBangla(rx.date || '2026-08-10')}</span>
                    </div>
                  </td>

                  {/* Doctor & Hospital */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 shrink-0" />
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white truncate max-w-[200px]">
                          {rx.doctorName || 'Senior Consultant Physician'}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
                          {rx.clinicHospital || 'Hospital / Clinic'}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Medicines count */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Pill className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {toBangla(rx.parsedItems.length)}
                      </span>
                      <span className="text-slate-400 text-[11px]">meds</span>
                    </div>
                  </td>

                  {/* Estimated savings */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {formatMoney(rx.estimatedSavings || 350)}
                      </span>
                      <span className="text-[10px] text-emerald-700/80 dark:text-emerald-300/80">
                        Save ~{toBangla(Math.round(rx.savingsPercentage || 35))}%
                      </span>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {isPending ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                        <Clock className="w-3 h-3" />
                        {t('dashboard.statusPending')}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="w-3 h-3" />
                        {t('dashboard.statusCompleted')}
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/scan/review/${rx.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
                        title="Review / Edit OCR"
                      >
                        <Edit3 className="w-3 h-3 text-slate-500" />
                        <span>{t('dashboard.reviewScan')}</span>
                      </Link>

                      <Link
                        href={`/results/${rx.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-xs transition-colors"
                        title="View Alternative Medicines"
                      >
                        <Eye className="w-3 h-3" />
                        <span>{t('dashboard.viewReport')}</span>
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
