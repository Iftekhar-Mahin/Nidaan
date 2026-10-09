import {
  PrescriptionRecord,
  ParsedMedicineItem,
  BrandMedicine,
  GenericDrug,
  AlternativeComparison,
  PrescriptionSavingsSummary,
} from './types';
import { INITIAL_PRESCRIPTIONS, INITIAL_BRAND_MEDICINES, INITIAL_GENERIC_DRUGS } from './sample-data';

const STORAGE_KEY = 'nidaan_prescriptions_list';
const DRUGS_STORAGE_KEY = 'nidaan_custom_drugs_list';
const GENERICS_STORAGE_KEY = 'nidaan_custom_generics_list';

/**
 * Gets all brand medicines (initial + any admin added)
 */
export function getAllBrandMedicines(): BrandMedicine[] {
  if (typeof window === 'undefined') return INITIAL_BRAND_MEDICINES;
  const saved = localStorage.getItem(DRUGS_STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading brand medicines:', e);
    }
  }
  return INITIAL_BRAND_MEDICINES;
}

/**
 * Gets all generic drugs
 */
export function getAllGenericDrugs(): GenericDrug[] {
  if (typeof window === 'undefined') return INITIAL_GENERIC_DRUGS;
  const saved = localStorage.getItem(GENERICS_STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading generic drugs:', e);
    }
  }
  return INITIAL_GENERIC_DRUGS;
}

/**
 * Saves new brand medicine (for Admin/Pharmacist)
 */
export function saveBrandMedicine(drug: BrandMedicine): void {
  const current = getAllBrandMedicines();
  const existingIdx = current.findIndex((d) => d.id === drug.id);
  let updated: BrandMedicine[];
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = drug;
  } else {
    updated = [drug, ...current];
  }
  localStorage.setItem(DRUGS_STORAGE_KEY, JSON.stringify(updated));
}

/**
 * Deletes brand medicine (Admin)
 */
export function deleteBrandMedicine(id: string): void {
  const current = getAllBrandMedicines();
  const updated = current.filter((d) => d.id !== id);
  localStorage.setItem(DRUGS_STORAGE_KEY, JSON.stringify(updated));
}

/**
 * Gets all prescriptions
 */
export function getAllPrescriptions(): PrescriptionRecord[] {
  if (typeof window === 'undefined') return INITIAL_PRESCRIPTIONS;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Error reading prescriptions:', e);
    }
  }
  return INITIAL_PRESCRIPTIONS;
}

/**
 * Gets a single prescription by ID
 */
export function getPrescriptionById(id: string): PrescriptionRecord | null {
  const all = getAllPrescriptions();
  return all.find((p) => p.id === id) || null;
}

/**
 * Saves or updates a prescription
 */
export function savePrescription(prescription: PrescriptionRecord): void {
  const current = getAllPrescriptions();
  const index = current.findIndex((p) => p.id === prescription.id);
  let updated: PrescriptionRecord[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = prescription;
  } else {
    updated = [prescription, ...current];
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

/**
 * Helper to parse daily dose count from schedule (e.g., "1-0-1" -> 2, "1-1-1" -> 3)
 */
export function parseDailyDoseCount(schedule: string): number {
  if (!schedule) return 2;
  const parts = schedule.split(/[-+–]/).map((s) => parseInt(s.trim(), 10) || 0);
  const sum = parts.reduce((acc, val) => acc + val, 0);
  return sum > 0 ? sum : 2;
}

/**
 * Helper to parse duration days from string (e.g. "7 days" -> 7, "1 month" -> 30)
 */
export function parseDurationDays(durationStr: string): number {
  if (!durationStr) return 7;
  const match = durationStr.match(/^(\d+)\s*(days?|months?|weeks?|দিন|মাস|সপ্তাহ)?/i);
  if (!match) return 7;
  const num = parseInt(match[1], 10);
  const unit = (match[2] || 'days').toLowerCase();

  if (unit.startsWith('m') || unit.includes('মাস')) return num * 30;
  if (unit.startsWith('w') || unit.includes('সপ্তাহ')) return num * 7;
  return num || 7;
}

/**
 * Computes alternative generic comparison matrix for a specific medicine item
 */
export function getAlternativeComparison(
  genericNameOrId: string,
  prescribedBrandName: string
): AlternativeComparison | null {
  const allBrands = getAllBrandMedicines();
  const allGenerics = getAllGenericDrugs();

  // Find Generic
  const generic = allGenerics.find(
    (g) =>
      g.id === genericNameOrId ||
      g.genericName.toLowerCase() === genericNameOrId.toLowerCase() ||
      genericNameOrId.toLowerCase().includes(g.genericName.toLowerCase())
  );

  // Find Prescribed Brand
  let prescribed = allBrands.find(
    (b) => b.brandName.toLowerCase() === prescribedBrandName.toLowerCase()
  );

  if (!prescribed && generic) {
    prescribed = allBrands.find((b) => b.genericId === generic.id) || {
      id: `temp-${Date.now()}`,
      brandName: prescribedBrandName,
      strength: 'Standard',
      form: 'Tablet',
      manufacturer: 'Prescribed Pharma',
      unitPrice: 10.0,
      genericId: generic.id,
    };
  }

  if (!generic || !prescribed) return null;

  // Find all brands belonging to this generic compound
  const matchingBrands = allBrands.filter((b) => b.genericId === generic.id);

  if (matchingBrands.length === 0) return null;

  // Find lowest price
  const lowestPrice = Math.min(...matchingBrands.map((b) => b.unitPrice));
  const lowestBrand = matchingBrands.find((b) => b.unitPrice === lowestPrice) || matchingBrands[0];

  const prescribedPrice = prescribed.unitPrice;

  const allAlternatives = matchingBrands.map((b) => {
    const savingsPerUnit = Math.max(0, prescribedPrice - b.unitPrice);
    const savingsPercentage = prescribedPrice > 0 ? Math.round((savingsPerUnit / prescribedPrice) * 100) : 0;

    return {
      ...b,
      savingsPerUnit: Math.round(savingsPerUnit * 100) / 100,
      savingsPercentage,
      isPrescribedBrand: b.brandName.toLowerCase() === prescribed.brandName.toLowerCase(),
      isLowestPrice: b.unitPrice === lowestPrice,
    };
  });

  // Sort: prescribed brand first, then cheapest alternatives
  allAlternatives.sort((a, b) => {
    if (a.isPrescribedBrand) return -1;
    if (b.isPrescribedBrand) return 1;
    return a.unitPrice - b.unitPrice;
  });

  const maxSavingsPercentage =
    prescribedPrice > 0 ? Math.round(((prescribedPrice - lowestPrice) / prescribedPrice) * 100) : 0;

  return {
    prescribedBrand: prescribed,
    generic,
    allAlternatives,
    lowestPriceBrand: lowestBrand,
    maxSavingsPercentage,
  };
}

/**
 * Calculates comprehensive prescription savings summary across all items
 */
export function calculatePrescriptionSavings(
  prescription: PrescriptionRecord,
  overrideDurationDays?: number
): PrescriptionSavingsSummary {
  const allBrands = getAllBrandMedicines();
  const allGenerics = getAllGenericDrugs();

  let totalPrescribedCost = 0;
  let totalOptimalGenericCost = 0;

  const itemsComparison = prescription.parsedItems.map((item) => {
    const dailyDoseUnits = parseDailyDoseCount(item.dosageSchedule);
    const durationDays = overrideDurationDays || parseDurationDays(item.duration);
    const totalUnits = dailyDoseUnits * durationDays;

    // Find prescribed brand
    const prescribedBrand =
      allBrands.find(
        (b) => b.brandName.toLowerCase() === item.matchedBrand.toLowerCase()
      ) ||
      allBrands.find((b) =>
        item.matchedBrand.toLowerCase().includes(b.brandName.toLowerCase())
      );

    const generic = allGenerics.find(
      (g) =>
        g.genericName.toLowerCase() === item.matchedGeneric.toLowerCase() ||
        (prescribedBrand && prescribedBrand.genericId === g.id)
    );

    let optimalAlternative: BrandMedicine | undefined;
    if (generic) {
      const candidates = allBrands.filter((b) => b.genericId === generic.id);
      if (candidates.length > 0) {
        optimalAlternative = candidates.reduce((min, b) => (b.unitPrice < min.unitPrice ? b : min), candidates[0]);
      }
    }

    const unitPricePrescribed = prescribedBrand ? prescribedBrand.unitPrice : 8.0;
    const unitPriceAlternative = optimalAlternative ? optimalAlternative.unitPrice : unitPricePrescribed;

    const originalCost = Math.round(unitPricePrescribed * totalUnits * 100) / 100;
    const alternativeCost = Math.round(unitPriceAlternative * totalUnits * 100) / 100;
    const itemSavingsBDT = Math.max(0, Math.round((originalCost - alternativeCost) * 100) / 100);

    totalPrescribedCost += originalCost;
    totalOptimalGenericCost += alternativeCost;

    return {
      item,
      prescribedBrand,
      optimalAlternative,
      dailyDoseUnits,
      durationDays,
      totalUnits,
      originalCost,
      alternativeCost,
      itemSavingsBDT,
    };
  });

  const totalSavingsBDT = Math.max(0, Math.round((totalPrescribedCost - totalOptimalGenericCost) * 100) / 100);
  const savingsPercentage =
    totalPrescribedCost > 0 ? Math.round((totalSavingsBDT / totalPrescribedCost) * 1000) / 10 : 0;

  return {
    prescriptionId: prescription.id,
    totalPrescribedCost: Math.round(totalPrescribedCost * 100) / 100,
    totalOptimalGenericCost: Math.round(totalOptimalGenericCost * 100) / 100,
    totalSavingsBDT,
    savingsPercentage,
    itemCount: prescription.parsedItems.length,
    itemsComparison,
  };
}
