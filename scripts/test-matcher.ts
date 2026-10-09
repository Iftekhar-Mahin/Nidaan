import { matchDrugAgainstDatabase, calculateDrugSimilarity } from '../src/lib/fuzzy-matcher';
import { extractMedicineEntities } from '../src/lib/ocr/parser';
import { INITIAL_BRAND_MEDICINES } from '../src/lib/sample-data';

console.log('🧪 Starting Nidaan Fuzzy Matcher & OCR Entity Extraction Tests...\n');

const testCases = [
  { rawOcr: 'Tab Napa Extar (500/65mg) 1+0+1 7 days pc', expectedBrand: 'Napa Extra', expectedGeneric: 'Paracetamol + Caffeine' },
  { rawOcr: 'Cap Sec1o 20mg 1-0-1 14 days ac', expectedBrand: 'Seclo 20', expectedGeneric: 'Omeprazole' },
  { rawOcr: 'Tab Moxac1av 625 1+0+1 5 days', expectedBrand: 'Moxaclav 625', expectedGeneric: 'Amoxicillin + Clavulanic Acid' },
  { rawOcr: 'Tab Monas 10mg 0-0-1 1 month', expectedBrand: 'Monas 10', expectedGeneric: 'Montelukast Sodium' },
  { rawOcr: 'Tab. Bizoran 5/20 mg - 1+0+0 - 90 Days', expectedBrand: 'Bizoran 5/20', expectedGeneric: 'Amlodipine + Olmesartan Medoxomil' },
  { rawOcr: 'Tab. Rostar 10 mg - 0+0+1 - 90 Days', expectedBrand: 'Rostar 10', expectedGeneric: 'Rosuvastatin' },
  { rawOcr: 'Tab. Sergel 20 mg - 1+0+1 - 30 Days', expectedBrand: 'Sergel 20', expectedGeneric: 'Esomeprazole' },
  { rawOcr: 'Tab Comet 500mg 1+0+1 with meals 30 days', expectedBrand: 'Comet 500', expectedGeneric: 'Metformin Hydrochloride' },
];

let passedCount = 0;

for (const tc of testCases) {
  const extracted = extractMedicineEntities(tc.rawOcr, INITIAL_BRAND_MEDICINES);
  const brandMatched = extracted.matchedBrand.toLowerCase() === tc.expectedBrand.toLowerCase();
  const genericMatched = extracted.matchedGeneric.toLowerCase() === tc.expectedGeneric.toLowerCase();

  const isSuccess = brandMatched && genericMatched;
  if (isSuccess) passedCount++;

  console.log(`[${isSuccess ? 'PASS' : 'FAIL'}] Raw OCR: "${tc.rawOcr}"`);
  console.log(`       -> Matched Brand: "${extracted.matchedBrand}" (Expected: "${tc.expectedBrand}")`);
  console.log(`       -> Matched Generic: "${extracted.matchedGeneric}" (Expected: "${tc.expectedGeneric}")`);
  console.log(`       -> Extracted Dose: ${extracted.dosageSchedule} | Duration: ${extracted.duration} | Confidence: ${(extracted.confidence * 100).toFixed(1)}%\n`);
}

console.log(`=========================================`);
console.log(`Result: ${passedCount}/${testCases.length} tests passed (${Math.round((passedCount / testCases.length) * 100)}% accuracy)`);
if (passedCount === testCases.length) {
  console.log('🎉 All OCR fuzzy matching tests passed successfully!');
} else {
  console.log('⚠️ Some tests failed.');
}
