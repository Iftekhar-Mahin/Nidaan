'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/lib/i18n/context';
import { ParsedMedicineItem, AlternativeComparison } from '@/lib/types';
import { getAlternativeComparison, parseDailyDoseCount, parseDurationDays } from '@/lib/prescription-store';
import {
  Pill,
  Sparkles,
  Award,
  CheckCircle,
  Building2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  TrendingDown,
} from 'lucide-react';

interface ComparisonMatrixProps {
  items: ParsedMedicineItem[];
  selectedDurationDays?: number;
}

export function ComparisonMatrix({ items, selectedDurationDays }: ComparisonMatrixProps) {
  const { t, formatMoney, formatPercent, formatDose, formatTime, toBangla } = useTranslation();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0); // expand first by default

  return (
    <div className="space-y-6">
      {items.map((item, idx) => {
        const comparison = getAlternativeComparison(item.matchedGeneric, item.matchedBrand);
        const dailyDose = parseDailyDoseCount(item.dosageSchedule);
        const durationDays = selectedDurationDays || parseDurationDays(item.duration);
        const totalUnits = dailyDose * durationDays;
        const isExpanded = expandedIndex === idx;

        if (!comparison) {
          return (
            <div
              key={item.id || idx}
              className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                <AlertCircle className="w-5 h-5" />
                <span className="font-bold text-sm">
                  {item.matchedBrand} ({item.matchedGeneric}): Generic database details not loaded.
                </span>
              </div>
            </div>
          );
        }

        const { prescribedBrand, generic, allAlternatives, lowestPriceBrand, maxSavingsPercentage } = comparison;

        return (
          <div
            key={item.id || idx}
            className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden transition-all"
          >
            {/* Header: Prescribed Medicine & Generic Compound Banner */}
            <div
              onClick={() => setExpandedIndex(isExpanded ? null : idx)}
              className="p-5 cursor-pointer bg-slate-50/80 dark:bg-slate-900/50 hover:bg-slate-100/80 dark:hover:bg-slate-900/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-bold">
                    {toBangla(idx + 1)}
                  </span>
                  <h3 className="font-heading font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                    {item.matchedBrand}
                  </h3>
                  <span className="text-xs px-2 py-0.5 rounded-md font-semibold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {item.strength} {item.form}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-md font-semibold bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                    Dose: {formatDose(item.dosageSchedule)} ({formatTime(durationDays + ' days')})
                  </span>
                </div>

                {/* Active Chemical Compound (Generic API) */}
                <div className="flex items-center gap-1.5 text-xs text-brand-600 dark:text-brand-400 font-medium">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    <strong>{t('results.activeIngredient')}:</strong> {generic.genericName} ({generic.category})
                  </span>
                </div>
              </div>

              {/* Savings Highlight Pill */}
              <div className="flex items-center gap-3">
                {maxSavingsPercentage > 0 && (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                    <TrendingDown className="w-3.5 h-3.5" />
                    <span>Save up to {formatPercent(maxSavingsPercentage)}</span>
                  </div>
                )}

                <div className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </div>
            </div>

            {/* Expanded Table of Bangladeshi Alternative Brands */}
            {isExpanded && (
              <div className="p-5 space-y-4 border-t border-slate-200 dark:border-slate-700 animate-in fade-in duration-150">
                
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {generic.description}
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900/60 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                        <th className="py-3 px-4">{t('results.tableBrand')}</th>
                        <th className="py-3 px-4">{t('results.tableManufacturer')}</th>
                        <th className="py-3 px-4">{t('results.tableUnitPrice')}</th>
                        <th className="py-3 px-4">{t('results.tableCourseCost')} ({toBangla(totalUnits)} units)</th>
                        <th className="py-3 px-4">{t('results.tableSavings')}</th>
                        <th className="py-3 px-4 text-right">{t('results.tableAction')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                      {allAlternatives.map((alt) => {
                        const courseCost = alt.unitPrice * totalUnits;
                        const originalCourseCost = prescribedBrand.unitPrice * totalUnits;
                        const totalSavedBDT = Math.max(0, originalCourseCost - courseCost);

                        return (
                          <tr
                            key={alt.id}
                            className={`transition-colors ${
                              alt.isPrescribedBrand
                                ? 'bg-sky-50/50 dark:bg-sky-950/30'
                                : alt.isLowestPrice
                                ? 'bg-emerald-50/50 dark:bg-emerald-950/30 font-medium'
                                : 'hover:bg-slate-50 dark:hover:bg-slate-750'
                            }`}
                          >
                            {/* Brand Name */}
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 dark:text-white text-sm">
                                  {alt.brandName}
                                </span>
                                {alt.isLowestPrice && !alt.isPrescribedBrand && (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-600 text-white flex items-center gap-1 shadow-xs">
                                    <Award className="w-3 h-3" />
                                    Lowest Price
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-slate-400">{alt.strength} {alt.form}</span>
                            </td>

                            {/* Manufacturer */}
                            <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                              <div className="flex items-center gap-1.5">
                                <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span className="truncate max-w-[180px]">{alt.manufacturer}</span>
                              </div>
                            </td>

                            {/* Unit Price */}
                            <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                              {formatMoney(alt.unitPrice)}
                            </td>

                            {/* Course Total Cost */}
                            <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                              {formatMoney(courseCost)}
                            </td>

                            {/* Savings */}
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              {alt.isPrescribedBrand ? (
                                <span className="text-slate-400 font-normal">Base Reference</span>
                              ) : totalSavedBDT > 0 ? (
                                <div className="flex flex-col">
                                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                    Save {formatMoney(totalSavedBDT)}
                                  </span>
                                  <span className="text-[10px] text-emerald-700/80 dark:text-emerald-300/80">
                                    ({formatPercent(alt.savingsPercentage)})
                                  </span>
                                </div>
                              ) : (
                                <span className="text-slate-400">Same Price</span>
                              )}
                            </td>

                            {/* Status Badge */}
                            <td className="py-3.5 px-4 text-right whitespace-nowrap">
                              {alt.isPrescribedBrand ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                                  <CheckCircle className="w-3 h-3" />
                                  {t('results.badgePrescribed')}
                                </span>
                              ) : alt.isLowestPrice ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                  <Sparkles className="w-3 h-3" />
                                  Best Generic
                                </span>
                              ) : (
                                <span className="text-[11px] text-slate-500 font-medium">
                                  Equivalent
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
