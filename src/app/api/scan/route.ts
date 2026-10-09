import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { parsePrescriptionText } from '@/lib/ocr/parser';
import { INITIAL_BRAND_MEDICINES } from '@/lib/sample-data';

const OCR_SERVICE_URL = process.env.OCR_SERVICE_URL || 'http://localhost:8000';
const GEMINI_API_KEY  = process.env.GEMINI_API_KEY  || '';

/** POST /api/scan
 *
 * Accepts multipart/form-data with an `image` file field.
 * Also accepts JSON body with `lines` or `rawText` for direct text input.
 *
 * Flow:
 *  1. If image file is uploaded → forward to Python OCR microservice (EasyOCR + Gemini)
 *  2. OCR microservice returns extracted medicine lines with confidence scores
 *  3. Lines are passed to clinical NLP parser + fuzzy drug matcher
 *  4. Returns structured ParsedMedicineItem[]
 */
export async function POST(request: Request) {
  try {
    // ── Load drug database ──
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

      // Check if OCR service is available
      let ocrServiceAvailable = false;
      try {
        const healthCheck = await fetch(`${OCR_SERVICE_URL}/health`, { signal: AbortSignal.timeout(2000) });
        ocrServiceAvailable = healthCheck.ok;
      } catch {
        ocrServiceAvailable = false;
      }

      let ocrLines: { text: string; confidence: number; source: string; box: any }[] = [];

      if (ocrServiceAvailable) {
        // Forward image to Python OCR microservice
        const ocrForm = new FormData();
        ocrForm.append('file', imageFile);
        if (GEMINI_API_KEY) ocrForm.append('gemini_api_key', GEMINI_API_KEY);

        const ocrResponse = await fetch(`${OCR_SERVICE_URL}/ocr`, {
          method: 'POST',
          body: ocrForm,
          signal: AbortSignal.timeout(30000), // 30s timeout
        });

        if (!ocrResponse.ok) {
          const err = await ocrResponse.text();
          return NextResponse.json(
            { error: `OCR service error: ${err}`, hint: 'Make sure ocr_server.py is running' },
            { status: 502 }
          );
        }

        const ocrResult = await ocrResponse.json();
        ocrLines = ocrResult.lines || [];
      } else {
        // OCR service not running — return friendly error
        return NextResponse.json(
          {
            error: 'OCR service is not running',
            hint: 'Start the OCR service first: run `python scripts/ocr_server.py` in a separate terminal',
            ocrServiceUrl: OCR_SERVICE_URL,
          },
          { status: 503 }
        );
      }

      // Parse OCR lines through clinical NLP + fuzzy matcher
      const parsedMedicines = parsePrescriptionText(
        ocrLines.map((l) => ({ text: l.text, box: l.box })),
        database
      );

      return NextResponse.json({
        success: true,
        ocrEngine: ocrLines[0]?.source || 'easyocr',
        lineCount: ocrLines.length,
        itemCount: parsedMedicines.length,
        parsedMedicines,
        rawOcrLines: ocrLines,
      });
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
      // Demo fallback — sample prescription
      inputLines = [
        'Tab Napa Extra (500/65mg) 1+0+1 7 days pc',
        'Cap Seclo 20mg 1-0-1 14 days ac',
        'Tab Moxaclav 625 1+0+1 5 days',
        'Tab Monas 10mg 0-0-1 30 days',
      ];
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
