'use client';

import React from 'react';
import { useTranslation } from '@/lib/i18n/context';
import {
  ShieldAlert,
  CheckCircle,
  AlertCircle,
  Database,
  BarChart3,
  Sparkles,
} from 'lucide-react';

interface AuditLogEntry {
  id: string;
  rawOcrText: string;
  correctedBrand: string;
  genericName: string;
  confidence: number;
  date: string;
  status: 'RESOLVED' | 'UNDER_REVIEW';
}

const SAMPLE_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'audit-1',
    rawOcrText: 'Cap Sec1o 20mg',
    correctedBrand: 'Seclo 20',
    genericName: 'Omeprazole',
    confidence: 0.88,
    date: '2026-08-14',
    status: 'RESOLVED',
  },
  {
    id: 'audit-2',
    rawOcrText: 'Tab Moxac1av 625',
    correctedBrand: 'Moxaclav 625',
    genericName: 'Amoxicillin + Clavulanic Acid',
    confidence: 0.82,
    date: '2026-08-14',
    status: 'RESOLVED',
  },
  {
    id: 'audit-3',
    rawOcrText: 'Tab Napa Extar',
    correctedBrand: 'Napa Extra',
    genericName: 'Paracetamol + Caffeine',
    confidence: 0.79,
    date: '2026-08-12',
    status: 'RESOLVED',
  },
  {
    id: 'audit-4',
    rawOcrText: 'Tab Rostar 10mg (noisy ink)',
    correctedBrand: 'Rostar 10',
    genericName: 'Rosuvastatin',
    confidence: 0.74,
    date: '2026-08-11',
    status: 'UNDER_REVIEW',
  },
];

export function OcrAuditViewer() {
  const { t, formatPercent, toBangla } = useTranslation();

  return (
    <div className="space-y-6">
      
      {/* Analytics KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold uppercase">{t('admin.totalGenerics')}</span>
          <p className="text-2xl font-extrabold text-brand-600 dark:text-brand-400 mt-1">{toBangla(20)}</p>
          <span className="text-[11px] text-slate-400">Classified by DGDA</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold uppercase">{t('admin.totalBrands')}</span>
          <p className="text-2xl font-extrabold text-sky-600 dark:text-sky-400 mt-1">{toBangla(107)}</p>
          <span className="text-[11px] text-slate-400">Across 12 BD Pharma companies</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold uppercase">{t('admin.avgConfidence')}</span>
          <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{formatPercent(91.4)}</p>
          <span className="text-[11px] text-slate-400">Trigram & Levenshtein Match</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold uppercase">{t('admin.totalAudits')}</span>
          <p className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 mt-1">{toBangla(4)}</p>
          <span className="text-[11px] text-slate-400">Continuous model refinement</span>
        </div>

      </div>

      {/* Flagged OCR Logs Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-700/80">
          <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            <span>{t('admin.tabAudit')}</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Audit flagged OCR misreadings to train and improve handwriting fuzzy matching algorithms
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/60 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                <th className="py-3 px-4">{t('admin.auditRawOcr')}</th>
                <th className="py-3 px-4">{t('admin.auditCorrected')}</th>
                <th className="py-3 px-4">Generic API</th>
                <th className="py-3 px-4">{t('admin.auditConfidence')}</th>
                <th className="py-3 px-4">{t('admin.auditDate')}</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {SAMPLE_AUDIT_LOGS.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-750/50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-amber-700 dark:text-amber-300">
                    &quot;{log.rawOcrText}&quot;
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                    {log.correctedBrand}
                  </td>
                  <td className="py-3 px-4 text-brand-600 dark:text-brand-400 font-semibold">
                    {log.genericName}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {formatPercent(log.confidence * 100)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    {toBangla(log.date)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                      log.status === 'RESOLVED'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                    }`}>
                      <CheckCircle className="w-3 h-3" />
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
