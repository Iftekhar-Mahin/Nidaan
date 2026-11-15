import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { parsePrescriptionText } from '@/lib/ocr/parser';
import { matchDrugAgainstDatabase } from '@/lib/fuzzy-matcher';
import { INITIAL_BRAND_MEDICINES, INITIAL_GENERIC_DRUGS } from '@/lib/sample-data';

export const maxDuration = 60;

const OCR_SERVICE_URL = process.env.OCR_SERVICE_URL || 'http://localhost:8001';
const GEMINI_API_KEY  = process.env.GEMINI_API_KEY  || '';

interface GeminiExtractedMedicine {
  rawText: string;
  brandName: string;
  genericName: string;
  strength?: string;
  form?: string;
  dosageSchedule?: string;
  duration?: string;
  instructions?: string;
  confidence?: number;
}

/**
 * Extracts structured clinical medicine details directly from prescription images using Google Gemini Vision.
 */
async function extractMedicinesWithGeminiVision(
  imageBuffer: Buffer,
  mimeType: string,
  apiKey: string
): Promise<{ medicines: GeminiExtractedMedicine[]; model: string }> {
  const base64Data = imageBuffer.toString('base64');
  const prompt = `You are an expert Bangladeshi medical prescription clinical pharmacist and OCR AI.
Examine this prescription image carefully.
Extract each prescribed medicine line as written by the physician, along with its active generic compound name.

For each medicine, return a JSON object with:
- "rawText": the complete line text as written on the prescription
- "brandName": the trade/brand name (e.g. "Dimerol", "Dialiptin-M", "Empatab", "Thyrox", "Bisopro", "Rosutin", "Napa Extra", "Seclo")
- "genericName": the standard chemical/generic pharmacological name (e.g. "Gliclazide", "Vildagliptin + Metformin Hydrochloride", "Empagliflozin", "Levothyroxine Sodium", "Bisoprolol Hemifumarate", "Rosuvastatin", "Paracetamol + Caffeine")
- "strength": e.g. "80mg", "50/500mg", "10mg", "175mcg", "2.5/5mg", "5mg", "500mg", "20mg"
- "form": "Tablet", "Capsule", "Syrup", "Injection", etc.
- "dosageSchedule": e.g. "1-0-0", "1-0-1", "0-1-0", "0-0-1", "1-1-1"
- "duration": e.g. "Continuous", "1 month", "14 days", "7 days"
- "instructions": e.g. "Before meal", "After meal", "At bedtime", "Empty stomach", "Morning"
- "confidence": confidence score between 0.85 and 0.99

Return strictly a JSON array of objects. Output ONLY the raw JSON array without markdown formatting.`;

  const models = ['gemini-3.5-flash', 'gemini-3-flash-preview', 'gemini-flash-latest'];

  for (const model of models) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inline_data: {
                    mime_type: mimeType || 'image/jpeg',
                    data: base64Data,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.1,
          },
        }),
        signal: AbortSignal.timeout(28000),
      });

      if (!res.ok) continue;

      const data = await res.json();
      let rawText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';

      const jsonMatch = rawText.match(/\[[\s\S]*\]/);
      if (!jsonMatch) continue;

      const parsed = JSON.parse(jsonMatch[0]);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return {
          medicines: parsed.map((item: any) => ({
            rawText: String(item.rawText || item.text || item.brandName || '').trim(),
            brandName: String(item.brandName || item.brand || '').trim(),
            genericName: String(item.genericName || item.generic || 'Generic Not Identified').trim(),
            strength: item.strength ? String(item.strength).trim() : 'Standard Dose',
            form: item.form ? String(item.form).trim() : 'Tablet',
            dosageSchedule: item.dosageSchedule ? String(item.dosageSchedule).trim() : '1-0-1',
            duration: item.duration ? String(item.duration).trim() : '7 days',
            instructions: item.instructions ? String(item.instructions).trim() : 'After meal',
            confidence: typeof item.confidence === 'number' ? item.confidence : 0.95,
          })),
          model,
        };
      }
    } catch (err) {
      console.warn(`[Gemini OCR ${model}] Error:`, err);
    }
  }

  return { medicines: [], model: '' };
}

/** POST /api/scan
 *
 * Accepts multipart/form-data with an `image` file field.
 * Also accepts JSON body with `lines` or `rawText` for direct text input.
 */
export async function POST(request: Request) {
  try {
    // ── Load drug database from PostgreSQL or memory cache ──
    let database: any[] = [];
    try {
      database = await prisma.brandMedicine.findMany({ include: { generic: true } });
    } catch {
      database = INITIAL_BRAND_MEDICINES;
    }
    if (!database || database.length === 0) database = INITIAL_BRAND_MEDICINES;

    const contentType = request.headers.get('content-type') || '';

    // ── PATH A: Image file upload → Real OCR ──
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const imageFile = formData.get('image') as File | null;

      if (!imageFile) {
        return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
      }

      const imageBytes = await imageFile.arrayBuffer();
      const imageBuffer = Buffer.from(imageBytes);
      const mimeType = imageFile.type || 'image/jpeg';

      // 1. Primary Engine: Google Gemini Vision with Structured Clinical Parsing
      if (GEMINI_API_KEY) {
        try {
          const { medicines, model } = await extractMedicinesWithGeminiVision(imageBuffer, mimeType, GEMINI_API_KEY);

          if (medicines.length > 0) {
            const parsedMedicines = medicines.map((med, idx) => {
              // Fuzzy match against database
              const matchResult = matchDrugAgainstDatabase(med.brandName, database, 3);
              const bestMatch = matchResult.bestMatch;

              let matchedBrand = med.brandName;
              let matchedGeneric = med.genericName;

              if (bestMatch && matchResult.confidence >= 0.70) {
                matchedBrand = bestMatch.brandName;
                if (bestMatch.generic?.genericName) {
                  matchedGeneric = bestMatch.generic.genericName;
                }
              }

              // Build top generic alternative suggestions
              let topSuggestions: any[] = [];
              if (matchedGeneric && matchedGeneric !== 'Generic Not Identified') {
                const sameGenericBrands = database.filter(
                  (b) =>
                    b.generic?.genericName?.toLowerCase() === matchedGeneric.toLowerCase() ||
                    matchedGeneric.toLowerCase().includes(b.generic?.genericName?.toLowerCase() || '')
                );

                if (sameGenericBrands.length > 0) {
                  topSuggestions = sameGenericBrands.slice(0, 3).map((b) => ({
                    brandName: b.brandName,
                    genericName: b.generic?.genericName || matchedGeneric,
                    manufacturer: b.manufacturer,
                    unitPrice: b.unitPrice,
                    similarity: 0.95,
                  }));
                }
              }

              if (topSuggestions.length === 0 && matchResult.topSuggestions.length > 0) {
                topSuggestions = matchResult.topSuggestions;
              }

              return {
                id: `parsed-item-${idx + 1}-${Date.now()}`,
                rawOcrText: med.rawText,
                matchedBrand,
                matchedGeneric,
                strength: med.strength || 'Standard Dose',
                form: med.form || 'Tablet',
                dosageSchedule: med.dosageSchedule || '1-0-1',
                duration: med.duration || 'Continuous',
                instructions: med.instructions || 'After meal',
                confidence: Math.max(med.confidence || 0.9, matchResult.confidence || 0.85),
                isUserVerified: false,
                boundingBox: null,
                topSuggestions,
              };
            });

            return NextResponse.json({
              success: true,
              ocrEngine: `gemini-vision (${model})`,
              lineCount: parsedMedicines.length,
              itemCount: parsedMedicines.length,
              parsedMedicines,
              rawOcrLines: medicines.map((m) => ({
                text: m.rawText,
                confidence: m.confidence || 0.95,
                source: `gemini-vision (${model})`,
                box: null,
              })),
            });
          }
        } catch (e) {
          console.error('[Gemini Vision Extraction Error]:', e);
        }
      }

      // 2. Secondary Engine: Python FastAPI Microservice (Railway / Local)
      let microserviceLines: { text: string; confidence: number; source: string; box?: any }[] = [];
      try {
        const ocrEndpoint = `${OCR_SERVICE_URL}/ocr`;
        const healthCheck = await fetch(`${OCR_SERVICE_URL}/health`, { signal: AbortSignal.timeout(2000) });
        if (healthCheck.ok) {
          const ocrForm = new FormData();
          ocrForm.append('file', new Blob([imageBuffer], { type: mimeType }));

          const ocrResponse = await fetch(ocrEndpoint, {
            method: 'POST',
            body: ocrForm,
            signal: AbortSignal.timeout(25000),
          });

          if (ocrResponse.ok) {
            const ocrResult = await ocrResponse.json();
            microserviceLines = ocrResult.lines || [];
          }
        }
      } catch (microserviceErr) {
        console.warn('[Microservice OCR Fallback Failed]:', microserviceErr);
      }

      if (microserviceLines.length > 0) {
        const parsedMedicines = parsePrescriptionText(
          microserviceLines.map((l) => ({ text: l.text, box: l.box })),
          database
        );
        return NextResponse.json({
          success: true,
          ocrEngine: 'fastapi-trocr',
          lineCount: microserviceLines.length,
          itemCount: parsedMedicines.length,
          parsedMedicines,
          rawOcrLines: microserviceLines,
        });
      }

      // 3. Clean error response when image cannot be read — NO FAKE DEMO MEDICINES!
      return NextResponse.json({
        success: false,
        error: 'No prescribed medicines could be detected clearly from this image. Please crop the medicine area using the Crop tool and ensure the prescription is well-lit.',
        parsedMedicines: [],
        lineCount: 0,
        itemCount: 0,
      }, { status: 422 });
    }

    // ── PATH B: JSON body with pre-extracted lines (manual input / demo) ──
    const body = await request.json();
    const { lines, rawText } = body;

    let inputLines: string[] = [];
    if (Array.isArray(lines)) {
      inputLines = lines;
    } else if (typeof rawText === 'string') {
      inputLines = rawText.split('\n').filter((l) => l.trim().length > 0);
    } else {
      inputLines = [];
    }

    if (inputLines.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No lines provided for scanning.',
        parsedMedicines: [],
      }, { status: 400 });
    }

    const parsedMedicines = parsePrescriptionText(inputLines, database);

    return NextResponse.json({
      success: true,
      ocrEngine: 'manual',
      lineCount: inputLines.length,
      itemCount: parsedMedicines.length,
      parsedMedicines,
    });

  } catch (error: any) {
    console.error('[/api/scan] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
