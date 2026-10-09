import { BrandMedicine } from './types';

/**
 * Calculates standard Levenshtein distance between two strings
 */
export function levenshteinDistance(a: string, b: string): number {
  const an = a ? a.length : 0;
  const bn = b ? b.length : 0;
  if (an === 0) return bn;
  if (bn === 0) return an;

  const matrix: number[][] = [];
  for (let i = 0; i <= bn; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= an; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= bn; i++) {
    for (let j = 1; j <= an; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[bn][an];
}

/**
 * Calculates Levenshtein Similarity normalized from 0.0 to 1.0
 */
export function levenshteinSimilarity(a: string, b: string): number {
  const s1 = a.toLowerCase().trim();
  const s2 = b.toLowerCase().trim();
  if (s1 === s2) return 1.0;
  const maxLen = Math.max(s1.length, s2.length);
  if (maxLen === 0) return 1.0;
  const dist = levenshteinDistance(s1, s2);
  return Math.max(0, 1 - dist / maxLen);
}

/**
 * Generates trigrams for a given string (equivalent to pg_trgm)
 */
export function getTrigrams(str: string): Set<string> {
  const padded = `  ${str.toLowerCase().trim()} `;
  const trigrams = new Set<string>();
  for (let i = 0; i < padded.length - 2; i++) {
    trigrams.add(padded.substring(i, i + 3));
  }
  return trigrams;
}

/**
 * Calculates Trigram Similarity (Dice-Sørensen coefficient on trigrams)
 */
export function trigramSimilarity(a: string, b: string): number {
  const s1 = a.toLowerCase().trim();
  const s2 = b.toLowerCase().trim();
  if (s1 === s2) return 1.0;
  
  const tri1 = getTrigrams(s1);
  const tri2 = getTrigrams(s2);
  
  if (tri1.size === 0 || tri2.size === 0) return 0.0;
  
  let intersection = 0;
  for (const t of tri1) {
    if (tri2.has(t)) {
      intersection++;
    }
  }
  
  return (2 * intersection) / (tri1.size + tri2.size);
}

/**
 * Normalizes common OCR misreadings in medical handwriting
 */
export function cleanOcrText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[|1]/g, 'l')
    .replace(/[0]/g, 'o')
    .replace(/[@]/g, 'a')
    .replace(/[$5]/g, 's')
    .replace(/[^a-z0-9\s/+-]/g, '')
    .trim();
}

function getRootWord(text: string): string {
  return text
    .replace(/\b\d+(\.\d+)?\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Calculates combined drug name similarity score
 */
export function calculateDrugSimilarity(query: string, target: string): number {
  const q = query.toLowerCase().trim();
  const t = target.toLowerCase().trim();
  
  if (q === t) return 1.0;

  const lev = levenshteinSimilarity(q, t);
  const tri = trigramSimilarity(q, t);
  
  // Cleaned OCR check (replaces 1 with l, 0 with o, etc.)
  const cleanQ = cleanOcrText(q);
  const cleanT = cleanOcrText(t);
  const cleanLev = levenshteinSimilarity(cleanQ, cleanT);
  const cleanTri = trigramSimilarity(cleanQ, cleanT);

  // Root word comparison
  const rootQ = getRootWord(cleanQ);
  const rootT = getRootWord(cleanT);
  const rootLev = levenshteinSimilarity(rootQ, rootT);

  // If roots are exact (e.g., "Comet" & "Comet" for "Comet 500")
  if (rootQ === rootT && rootQ.length >= 3) {
    return 0.95;
  }

  // Weight full string distance and root similarity
  const score = Math.max(
    0.40 * lev + 0.30 * tri + 0.30 * cleanLev,
    0.35 * rootLev + 0.35 * cleanTri + 0.30 * cleanLev
  );

  return Math.min(1.0, Math.round(score * 100) / 100);
}

export interface MatchCandidate {
  brand: BrandMedicine;
  confidence: number;
  genericName: string;
}

/**
 * Searches and ranks brand medicines by similarity to an OCR string
 */
export function matchDrugAgainstDatabase(
  rawQuery: string,
  database: BrandMedicine[],
  topK: number = 3
): {
  bestMatch: BrandMedicine | null;
  confidence: number;
  topSuggestions: {
    brandName: string;
    genericName: string;
    manufacturer: string;
    unitPrice: number;
    similarity: number;
  }[];
} {
  if (!rawQuery || database.length === 0) {
    return { bestMatch: null, confidence: 0, topSuggestions: [] };
  }

  const queryToUse = rawQuery.trim();

  const scored: MatchCandidate[] = database.map((item) => {
    const score = calculateDrugSimilarity(queryToUse, item.brandName);
    return {
      brand: item,
      confidence: score,
      genericName: item.generic?.genericName || '',
    };
  });

  // Sort descending by confidence
  scored.sort((a, b) => b.confidence - a.confidence);

  const best = scored[0];
  const topSuggestions = scored.slice(0, topK).map((s) => ({
    brandName: s.brand.brandName,
    genericName: s.genericName || s.brand.generic?.genericName || '',
    manufacturer: s.brand.manufacturer,
    unitPrice: s.brand.unitPrice,
    similarity: s.confidence,
  }));

  return {
    bestMatch: best && best.confidence >= 0.45 ? best.brand : null,
    confidence: best ? best.confidence : 0,
    topSuggestions,
  };
}
