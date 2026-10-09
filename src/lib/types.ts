export type Role = 'PATIENT' | 'ADMIN' | 'PHARMACIST';
export type Language = 'en' | 'bn';
export type ThemeMode = 'light' | 'dark';

export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: Role;
  language: Language;
  theme: ThemeMode;
  createdAt: string;
}

export interface GenericDrug {
  id: string;
  genericName: string;
  category?: string;
  description?: string;
  brands?: BrandMedicine[];
}

export interface BrandMedicine {
  id: string;
  brandName: string;
  strength: string;
  form: string; // 'Tablet', 'Capsule', 'Syrup', 'Injection', 'Drop', 'Ointment'
  manufacturer: string;
  unitPrice: number; // in BDT (৳)
  genericId: string;
  generic?: GenericDrug;
}

export interface PrescriptionBoundingBox {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number; // percentage 0-100
  height: number; // percentage 0-100
}

export interface ParsedMedicineItem {
  id: string;
  rawOcrText: string;
  matchedBrand: string;
  matchedGeneric: string;
  strength: string;
  form: string;
  dosageSchedule: string; // e.g., "1-0-1", "1+0+1"
  duration: string; // e.g., "7 days", "1 month"
  instructions?: string; // e.g., "After meal", "খাবার পর"
  confidence: number; // 0.0 - 1.0
  isUserVerified: boolean;
  boundingBox?: PrescriptionBoundingBox;
  topSuggestions?: {
    brandName: string;
    genericName: string;
    manufacturer: string;
    unitPrice: number;
    similarity: number;
  }[];
}

export interface PrescriptionRecord {
  id: string;
  userId: string;
  patientName?: string;
  doctorName?: string;
  clinicHospital?: string;
  date: string;
  imageUrl: string;
  status: 'PENDING' | 'REVIEWED' | 'COMPLETED';
  parsedItems: ParsedMedicineItem[];
  totalOriginalCost: number;
  totalGenericCost: number;
  estimatedSavings: number;
  savingsPercentage: number;
  createdAt: string;
}

export interface ImageQualityReport {
  isAcceptable: boolean;
  blurScore: number; // 0 to 100 (higher = sharper)
  brightnessScore: number; // 0 to 100 (ideal 40-70)
  contrastScore: number; // 0 to 100 (higher = better contrast)
  issues: string[];
  suggestions: string[];
}

export interface AlternativeComparison {
  prescribedBrand: BrandMedicine;
  generic: GenericDrug;
  allAlternatives: (BrandMedicine & {
    savingsPerUnit: number;
    savingsPercentage: number;
    isPrescribedBrand: boolean;
    isLowestPrice: boolean;
  })[];
  lowestPriceBrand: BrandMedicine;
  maxSavingsPercentage: number;
}

export interface PrescriptionSavingsSummary {
  prescriptionId: string;
  totalPrescribedCost: number;
  totalOptimalGenericCost: number;
  totalSavingsBDT: number;
  savingsPercentage: number;
  itemCount: number;
  itemsComparison: {
    item: ParsedMedicineItem;
    prescribedBrand?: BrandMedicine;
    optimalAlternative?: BrandMedicine;
    dailyDoseUnits: number;
    durationDays: number;
    totalUnits: number;
    originalCost: number;
    alternativeCost: number;
    itemSavingsBDT: number;
  }[];
}
