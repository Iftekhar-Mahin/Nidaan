'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/context';
import { ParsedMedicineItem, PrescriptionRecord } from '@/lib/types';
import { getAllBrandMedicines, savePrescription } from '@/lib/prescription-store';
import {
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  Sparkles,
  ArrowRight,
  Pill,
  Clock,
  Layers,
} from 'lucide-react';

interface MedicineEditFormProps {
  prescription: PrescriptionRecord;
  items: ParsedMedicineItem[];
  selectedItemId: string | null;
  onSelectItem: (id: string) => void;
  onUpdateItems: (items: ParsedMedicineItem[]) => void;
}

export function MedicineEditForm({
  prescription,
  items,
  selectedItemId,
  onSelectItem,
  onUpdateItems,
}: MedicineEditFormProps) {
  const { t, formatMoney, formatPercent, toBangla } = useTranslation();
  const router = useRouter();
  const allBrands = getAllBrandMedicines();

  const handleFieldChange = (index: number, field: keyof ParsedMedicineItem, value: any) => {
    const updated = [...items];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    // If brand name changed, recalculate generic mapping
    if (field === 'matchedBrand') {
      const match = allBrands.find(
        (b) => b.brandName.toLowerCase() === value.toLowerCase()
      );
      if (match) {
        updated[index].matchedGeneric = match.generic?.genericName || updated[index].matchedGeneric;
        updated[index].confidence = 0.98;
      }
    }

    onUpdateItems(updated);
  };

  const handleApplySuggestion = (index: number, suggestion: { brandName: string; genericName: string }) => {
    const updated = [...items];
    updated[index] = {
      ...updated[index],
      matchedBrand: suggestion.brandName,
      matchedGeneric: suggestion.genericName,
      confidence: 0.95,
      isUserVerified: true,
    };
    onUpdateItems(updated);
  };

  const handleAddItem = () => {
    const newItem: ParsedMedicineItem = {
      id: `item-${Date.now()}`,
      rawOcrText: 'Manual Entry',
      matchedBrand: 'Napa 500',
      matchedGeneric: 'Paracetamol',
      strength: '500mg',
      form: 'Tablet',
      dosageSchedule: '1-0-1',
      duration: '7 days',
      instructions: 'After meal',
      confidence: 1.0,
      isUserVerified: true,
      boundingBox: { x: 8, y: 80, width: 84, height: 10 },
    };
    const updated = [...items, newItem];
    onUpdateItems(updated);
    onSelectItem(newItem.id);
  };

  const handleRemoveItem = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    onUpdateItems(updated);
  };

  const handleFindAlternatives = () => {
    // Lock verified items and update prescription
    const updatedRx: PrescriptionRecord = {
      ...prescription,
      status: 'REVIEWED',
      parsedItems: items.map((it) => ({ ...it, isUserVerified: true })),
    };
    savePrescription(updatedRx);
    router.push(`/results/${prescription.id}`);
  };

  return (
    <div className="flex flex-col h-full rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/50">
        <div>
          <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Pill className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <span>{t('review.rightPanelTitle')}</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {items.length} medicines extracted from prescription
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddItem}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 hover:bg-brand-100 border border-brand-200 dark:border-brand-800 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t('review.addMedicine')}</span>
        </button>
      </div>

      {/* Items Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[65vh]">
        {items.map((item, idx) => {
          const isSelected = selectedItemId === item.id;
          const isHighConfidence = item.confidence >= 0.8;

          return (
            <div
              key={item.id || idx}
              onClick={() => onSelectItem(item.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'border-brand-500 bg-brand-50/40 dark:bg-brand-950/40 ring-2 ring-brand-500/20 shadow-sm'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300'
              }`}
            >
              {/* Item Header with Confidence badge */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-bold">
                    {toBangla(idx + 1)}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate max-w-[180px]">
                    OCR: &quot;{item.rawOcrText}&quot;
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {isHighConfidence ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{formatPercent(item.confidence * 100)} Match</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                      <AlertTriangle className="w-3 h-3" />
                      <span>{formatPercent(item.confidence * 100)} Check</span>
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveItem(idx);
                    }}
                    className="p-1 rounded text-slate-400 hover:text-rose-500 transition-colors"
                    title={t('review.removeMedicine')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                
                {/* Brand Name Input */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    {t('review.medicineName')}
                  </label>
                  <input
                    type="text"
                    value={item.matchedBrand}
                    onChange={(e) => handleFieldChange(idx, 'matchedBrand', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
                  />
                </div>

                {/* Generic Name (Resolved) */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-brand-500" />
                    <span>Generic Compound (API)</span>
                  </label>
                  <input
                    type="text"
                    value={item.matchedGeneric}
                    onChange={(e) => handleFieldChange(idx, 'matchedGeneric', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-750 text-brand-700 dark:text-brand-300 font-semibold focus:outline-hidden"
                  />
                </div>

                {/* Strength & Form */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                      {t('review.strength')}
                    </label>
                    <input
                      type="text"
                      value={item.strength}
                      onChange={(e) => handleFieldChange(idx, 'strength', e.target.value)}
                      placeholder="e.g. 500mg"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                      {t('review.form')}
                    </label>
                    <select
                      value={item.form}
                      onChange={(e) => handleFieldChange(idx, 'form', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-medium"
                    >
                      <option value="Tablet">Tablet</option>
                      <option value="Capsule">Capsule</option>
                      <option value="Syrup">Syrup</option>
                      <option value="Injection">Injection</option>
                      <option value="Drop">Drop</option>
                      <option value="Ointment">Ointment</option>
                    </select>
                  </div>
                </div>

                {/* Dosage Schedule & Duration */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                      {t('review.schedule')}
                    </label>
                    <input
                      type="text"
                      value={item.dosageSchedule}
                      onChange={(e) => handleFieldChange(idx, 'dosageSchedule', e.target.value)}
                      placeholder="1-0-1"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                      {t('review.duration')}
                    </label>
                    <input
                      type="text"
                      value={item.duration}
                      onChange={(e) => handleFieldChange(idx, 'duration', e.target.value)}
                      placeholder="7 days"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-medium"
                    />
                  </div>
                </div>

              </div>

              {/* Low Confidence Auto-Suggestions Dropdown Bar */}
              {(!isHighConfidence || (item.topSuggestions && item.topSuggestions.length > 0)) && (
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                  <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 block mb-1.5">
                    {t('review.suggestedMatches')}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.topSuggestions?.map((sug, sIdx) => (
                      <button
                        key={sIdx}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApplySuggestion(idx, sug);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 dark:bg-slate-700 hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-brand-950 border border-slate-200 dark:border-slate-600 transition-colors"
                      >
                        <span className="font-bold text-slate-900 dark:text-white">{sug.brandName}</span>
                        <span className="text-slate-400">({sug.manufacturer.split(' ')[0]})</span>
                        <span className="text-emerald-600 font-bold ml-0.5">{formatMoney(sug.unitPrice)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* Footer Action CTA */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-700">
        <button
          type="button"
          onClick={handleFindAlternatives}
          className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-brand-600 to-teal-500 hover:from-brand-700 hover:to-teal-600 text-white shadow-lg active:scale-98 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>{t('review.findAlternativesBtn')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
