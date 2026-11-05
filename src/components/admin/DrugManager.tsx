'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/lib/i18n/context';
import { BrandMedicine, GenericDrug } from '@/lib/types';
import {
  getAllBrandMedicines,
  getAllGenericDrugs,
  saveBrandMedicine,
  deleteBrandMedicine,
} from '@/lib/prescription-store';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Building2,
  Pill,
  Check,
  X,
  Sparkles,
} from 'lucide-react';

export function DrugManager() {
  const { t, formatMoney, toBangla } = useTranslation();
  const [brands, setBrands] = useState<BrandMedicine[]>(getAllBrandMedicines());
  const [generics, setGenerics] = useState<GenericDrug[]>(getAllGenericDrugs());
  const [searchQuery, setSearchQuery] = useState('');
  const [manufacturerFilter, setManufacturerFilter] = useState('ALL');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingDrug, setEditingDrug] = useState<BrandMedicine | null>(null);

  // Form State
  const [formBrandName, setFormBrandName] = useState('');
  const [formGenericId, setFormGenericId] = useState(generics[0]?.id || '');
  const [formStrength, setFormStrength] = useState('500mg');
  const [formForm, setFormForm] = useState('Tablet');
  const [formManufacturer, setFormManufacturer] = useState('Square Pharmaceuticals Ltd.');
  const [formUnitPrice, setFormUnitPrice] = useState('5.00');

  const manufacturers = [
    'ALL',
    'Square Pharmaceuticals Ltd.',
    'Beximco Pharmaceuticals Ltd.',
    'Incepta Pharmaceuticals Ltd.',
    'Healthcare Pharmaceuticals Ltd.',
    'Renata Limited',
    'Eskayef Pharmaceuticals Ltd. (SK-F)',
    'The Acme Laboratories Ltd.',
    'Aristopharma Ltd.',
    'ACI Limited',
    'Opsonin Pharma Ltd.',
    'Radiant Pharmaceuticals (Sanofi/GSK)',
  ];

  const filteredBrands = brands.filter((b) => {
    const matchesSearch =
      b.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      generics.find((g) => g.id === b.genericId)?.genericName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesManufacturer =
      manufacturerFilter === 'ALL' || b.manufacturer === manufacturerFilter;

    return matchesSearch && matchesManufacturer;
  });

  const handleOpenAddModal = () => {
    setEditingDrug(null);
    setFormBrandName('');
    setFormGenericId(generics[0]?.id || '');
    setFormStrength('500mg');
    setFormForm('Tablet');
    setFormManufacturer('Square Pharmaceuticals Ltd.');
    setFormUnitPrice('5.00');
    setModalOpen(true);
  };

  const handleOpenEditModal = (drug: BrandMedicine) => {
    setEditingDrug(drug);
    setFormBrandName(drug.brandName);
    setFormGenericId(drug.genericId);
    setFormStrength(drug.strength);
    setFormForm(drug.form);
    setFormManufacturer(drug.manufacturer);
    setFormUnitPrice(drug.unitPrice.toString());
    setModalOpen(true);
  };

  const handleSaveDrug = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formBrandName || !formGenericId) return;

    const drugToSave: BrandMedicine = {
      id: editingDrug ? editingDrug.id : `drug-${Date.now()}`,
      brandName: formBrandName,
      genericId: formGenericId,
      strength: formStrength,
      form: formForm,
      manufacturer: formManufacturer,
      unitPrice: parseFloat(formUnitPrice) || 1.0,
    };

    saveBrandMedicine(drugToSave);
    setBrands(getAllBrandMedicines());
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this medicine?')) {
      deleteBrandMedicine(id);
      setBrands(getAllBrandMedicines());
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Search & Filter Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
        
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('admin.searchPlaceholder')}
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Manufacturer Filter */}
        <select
          value={manufacturerFilter}
          onChange={(e) => setManufacturerFilter(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium"
        >
          {manufacturers.map((m, i) => (
            <option key={i} value={m}>
              {m === 'ALL' ? t('admin.filterManufacturer') : m}
            </option>
          ))}
        </select>

        {/* Add Drug Button */}
        <button
          type="button"
          onClick={handleOpenAddModal}
          className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-xs transition-colors whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>{t('admin.addDrug')}</span>
        </button>
      </div>

      {/* Drug Records Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/60 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                <th className="py-3 px-4">{t('admin.brandName')}</th>
                <th className="py-3 px-4">{t('admin.genericName')}</th>
                <th className="py-3 px-4">{t('admin.strength')} & {t('admin.form')}</th>
                <th className="py-3 px-4">{t('admin.manufacturer')}</th>
                <th className="py-3 px-4">{t('admin.unitPrice')}</th>
                <th className="py-3 px-4 text-right">{t('admin.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {filteredBrands.map((drug) => {
                const generic = generics.find((g) => g.id === drug.genericId);
                return (
                  <tr key={drug.id} className="hover:bg-slate-50 dark:hover:bg-slate-750/50 transition-colors">
                    
                    {/* Brand */}
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                      {drug.brandName}
                    </td>

                    {/* Generic */}
                    <td className="py-3 px-4 text-brand-600 dark:text-brand-400 font-semibold whitespace-nowrap">
                      {generic?.genericName || drug.genericId}
                    </td>

                    {/* Strength & Form */}
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-[11px] font-medium">
                        {drug.strength} {drug.form}
                      </span>
                    </td>

                    {/* Manufacturer */}
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[200px]">{drug.manufacturer}</span>
                      </div>
                    </td>

                    {/* Unit Price */}
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                      {formatMoney(drug.unitPrice)}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(drug)}
                          className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                          title={t('admin.edit')}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(drug.id)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                          title={t('admin.delete')}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Drug Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden">
            
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {editingDrug ? 'Edit Brand Medicine' : t('admin.addDrug')}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveDrug} className="p-5 space-y-4 text-xs">
              
              {/* Brand Name */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  {t('admin.brandName')} *
                </label>
                <input
                  type="text"
                  required
                  value={formBrandName}
                  onChange={(e) => setFormBrandName(e.target.value)}
                  placeholder="e.g. Napa Extra, Seclo 20"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-medium"
                />
              </div>

              {/* Generic ID */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  {t('admin.genericName')} (Active API) *
                </label>
                <select
                  value={formGenericId}
                  onChange={(e) => setFormGenericId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-medium"
                >
                  {generics.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.genericName} ({g.category})
                    </option>
                  ))}
                </select>
              </div>

              {/* Strength & Form */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    {t('admin.strength')}
                  </label>
                  <input
                    type="text"
                    value={formStrength}
                    onChange={(e) => setFormStrength(e.target.value)}
                    placeholder="e.g. 500mg, 20mg"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    {t('admin.form')}
                  </label>
                  <select
                    value={formForm}
                    onChange={(e) => setFormForm(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="Tablet">Tablet</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Syrup">Syrup</option>
                    <option value="Injection">Injection</option>
                    <option value="Drop">Drop</option>
                  </select>
                </div>
              </div>

              {/* Manufacturer */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  {t('admin.manufacturer')}
                </label>
                <select
                  value={formManufacturer}
                  onChange={(e) => setFormManufacturer(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                >
                  {manufacturers.filter((m) => m !== 'ALL').map((m, i) => (
                    <option key={i} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              {/* Unit Price */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  {t('admin.unitPrice')} (BDT ৳) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  required
                  value={formUnitPrice}
                  onChange={(e) => setFormUnitPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  {t('admin.cancel')}
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{t('admin.save')}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
