import { ParsedMedicineItem, BrandMedicine } from '../types';
import { matchDrugAgainstDatabase } from '../fuzzy-matcher';
import { toEnglishNumber } from '../i18n/utils';
import { INITIAL_GENERIC_DRUGS } from '../sample-data';

interface RawOcrLine {
  text: string;
  box?: { x: number; y: number; width: number; height: number };
}

/**
 * Parses raw OCR lines from a medical prescription into structured clinical entities
 */
export function parsePrescriptionText(
  lines: (string | RawOcrLine)[],
  database: BrandMedicine[]
): ParsedMedicineItem[] {
  const parsedItems: ParsedMedicineItem[] = [];

  const rawLines: RawOcrLine[] = lines.map((line, idx) => {
    if (typeof line === 'string') {
      return {
        text: line,
        box: {
          x: 8,
          y: 30 + idx * 13,
          width: 84,
          height: 11,
        },
      };
    }
    return line;
  });

  for (let i = 0; i < rawLines.length; i++) {
    const item = rawLines[i];
    const text = item.text.trim();
    if (!text || text.length < 3) continue;

    // Filter out common non-drug lines
    if (/^(dr\.|prof\.|hospital|clinic|patient|age|gender|date|bmdc|advice|উপদেশ|o\/e|bp:|investigation)/i.test(text)) {
      continue;
    }

    const structured = extractMedicineEntities(text, database);
    if (structured) {
      parsedItems.push({
        id: `parsed-item-${i + 1}-${Date.now()}`,
        rawOcrText: text,
        matchedBrand: structured.matchedBrand,
        matchedGeneric: structured.matchedGeneric,
        strength: structured.strength,
        form: structured.form,
        dosageSchedule: structured.dosageSchedule,
        duration: structured.duration,
        instructions: structured.instructions,
        confidence: structured.confidence,
        isUserVerified: structured.confidence >= 0.85,
        boundingBox: item.box,
        topSuggestions: structured.topSuggestions,
      });
    }
  }

  return parsedItems;
}

/**
 * Helper to resolve Generic Name from genericId or generic object
 */
function resolveGenericName(brand: BrandMedicine): string {
  if (brand.generic?.genericName) return brand.generic.genericName;
  const found = INITIAL_GENERIC_DRUGS.find((g) => g.id === brand.genericId);
  return found ? found.genericName : 'Generic Compound';
}

/**
 * Extracts entities from a single prescription line using clinical NLP rules
 */
export function extractMedicineEntities(
  lineText: string,
  database: BrandMedicine[]
): {
  matchedBrand: string;
  matchedGeneric: string;
  strength: string;
  form: string;
  dosageSchedule: string;
  duration: string;
  instructions: string;
  confidence: number;
  topSuggestions: {
    brandName: string;
    genericName: string;
    manufacturer: string;
    unitPrice: number;
    similarity: number;
  }[];
} {
  // Convert any Bangla digits to English for regex processing
  const normalizedText = toEnglishNumber(lineText);

  // 1. Extract Form (Tab, Cap, Syr, Inj, Drop, etc.)
  let form = 'Tablet';
  if (/\b(cap|capsule|ক্যাপসুল)\b/i.test(normalizedText)) {
    form = 'Capsule';
  } else if (/\b(syr|syrup|সিরাপ)\b/i.test(normalizedText)) {
    form = 'Syrup';
  } else if (/\b(inj|injection|ইনজেকশন)\b/i.test(normalizedText)) {
    form = 'Injection';
  } else if (/\b(drop|eye drop|ড্রপ)\b/i.test(normalizedText)) {
    form = 'Drop';
  } else if (/\b(oint|ointment|মলম)\b/i.test(normalizedText)) {
    form = 'Ointment';
  }

  // 2. Extract Strength (e.g., 500mg, 20mg, 5/20mg, 500/65mg, 50mcg, 100ml)
  let strength = '';
  const strengthMatch = normalizedText.match(/\b(\d+(?:\/\d+)?(?:\.\d+)?)\s*(mg|mcg|gm|ml|iu)\b/i);
  if (strengthMatch) {
    strength = `${strengthMatch[1]}${strengthMatch[2].toLowerCase()}`;
  }

  // 3. Extract Dosage Schedule (e.g. 1+0+1, 1-0-1, 1-0-0, 0-0-1, 1+1+1, BD, TDS, OD)
  let dosageSchedule = '1-0-1'; // fallback default
  const scheduleMatch = normalizedText.match(/\b([0-3])\s*[+\-–]\s*([0-3])\s*[+\-–]\s*([0-3])(?:\s*[+\-–]\s*([0-3]))?\b/);
  if (scheduleMatch) {
    if (scheduleMatch[4]) {
      dosageSchedule = `${scheduleMatch[1]}-${scheduleMatch[2]}-${scheduleMatch[3]}-${scheduleMatch[4]}`;
    } else {
      dosageSchedule = `${scheduleMatch[1]}-${scheduleMatch[2]}-${scheduleMatch[3]}`;
    }
  } else if (/\b(od|once daily|১ বার)\b/i.test(normalizedText)) {
    dosageSchedule = '1-0-0';
  } else if (/\b(bd|bid|twice daily|২ বার)\b/i.test(normalizedText)) {
    dosageSchedule = '1-0-1';
  } else if (/\b(tds|tid|thrice daily|৩ বার)\b/i.test(normalizedText)) {
    dosageSchedule = '1-1-1';
  } else if (/\b(hs|at night|রাতে)\b/i.test(normalizedText)) {
    dosageSchedule = '0-0-1';
  }

  // 4. Extract Duration (e.g. 7 days, 14 days, 1 month, 3 months, ৭ দিন, ১ মাস)
  let duration = '7 days';
  const durationMatch = normalizedText.match(/\b(\d+)\s*(days?|months?|weeks?|দিন|মাস|সপ্তাহ)\b/i);
  if (durationMatch) {
    const num = durationMatch[1];
    const unit = durationMatch[2].toLowerCase();
    if (unit.startsWith('m') || unit.includes('মাস')) {
      duration = `${parseInt(num, 10) * 30} days`;
    } else if (unit.startsWith('w') || unit.includes('সপ্তাহ')) {
      duration = `${parseInt(num, 10) * 7} days`;
    } else {
      duration = `${num} days`;
    }
  }

  // 5. Extract Instructions (e.g. pc, ac, after meal, before meal, খাওয়ার পর, খালি পেটে)
  let instructions = 'After meal';
  if (/\b(ac|before meal|খাবারের আগে|খালি পেটে)\b/i.test(normalizedText)) {
    instructions = 'Before meal';
  } else if (/\b(pc|after meal|খাওয়ার পর|ভরা পেটে)\b/i.test(normalizedText)) {
    instructions = 'After meal';
  } else if (/\b(with meals?|খাবারের সাথে)\b/i.test(normalizedText)) {
    instructions = 'With meals';
  } else if (/\b(night|bedtime|শোবার আগে)\b/i.test(normalizedText)) {
    instructions = 'At bedtime';
  }

  // 6. Extract Drug Name and Match Against Localized Database
  // Remove numbers, dosage formats, instructions, and prefixes
  let candidateName = normalizedText
    .replace(/^\s*\d+[\.\)]\s*/, '')
    .replace(/\b(tab|cap|syr|inj|tablets?|capsules?)\b\.?/gi, '')
    .replace(/\b\d+(?:\/\d+)?(?:\.\d+)?\s*(mg|mcg|gm|ml|iu)\b/gi, '')
    .replace(/\b[0-3]\s*[+\-–]\s*[0-3]\s*[+\-–]\s*[0-3]\b/g, '')
    .replace(/\b\d+\s*(days?|months?|weeks?|দিন|মাস)\b/gi, '')
    .replace(/\b(pc|ac|od|bd|tds|hs|continue|before|after|meal|meals|daily|night|with|breakfast|lunch|dinner)\b/gi, '')
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .trim();

  // Clean extra spaces
  candidateName = candidateName.replace(/\s+/g, ' ').trim();

  // Match with fuzzy matching engine
  const matchResult = matchDrugAgainstDatabase(candidateName, database, 3);

  const bestMatch = matchResult.bestMatch;
  const matchedBrand = bestMatch ? bestMatch.brandName : candidateName || 'Unknown Medicine';
  const matchedGeneric = bestMatch ? resolveGenericName(bestMatch) : 'Generic Not Identified';
  const finalStrength = strength || bestMatch?.strength || 'Standard Dose';
  const finalForm = form || bestMatch?.form || 'Tablet';

  const topSuggestions = matchResult.topSuggestions.map((sug) => {
    const dbItem = database.find((b) => b.brandName === sug.brandName);
    return {
      ...sug,
      genericName: dbItem ? resolveGenericName(dbItem) : sug.genericName,
    };
  });

  return {
    matchedBrand,
    matchedGeneric,
    strength: finalStrength,
    form: finalForm,
    dosageSchedule,
    duration,
    instructions,
    confidence: matchResult.confidence || 0.75,
    topSuggestions,
  };
}
