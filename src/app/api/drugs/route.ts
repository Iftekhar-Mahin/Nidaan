import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { matchDrugAgainstDatabase } from '@/lib/fuzzy-matcher';
import { INITIAL_BRAND_MEDICINES } from '@/lib/sample-data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  try {
    const brands = await prisma.brandMedicine.findMany({
      include: { generic: true },
    });

    if (!query) {
      return NextResponse.json({ drugs: brands });
    }

    // Run fuzzy matching against database
    const matchResult = matchDrugAgainstDatabase(query, brands as any, 5);

    return NextResponse.json({
      query,
      bestMatch: matchResult.bestMatch,
      confidence: matchResult.confidence,
      topSuggestions: matchResult.topSuggestions,
    });
  } catch (error) {
    // Fallback to sample data if DB connection error
    const matchResult = matchDrugAgainstDatabase(query || '', INITIAL_BRAND_MEDICINES, 5);
    return NextResponse.json({
      query,
      bestMatch: matchResult.bestMatch,
      confidence: matchResult.confidence,
      topSuggestions: matchResult.topSuggestions,
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { brandName, strength, form, manufacturer, unitPrice, genericId } = body;

    const newDrug = await prisma.brandMedicine.create({
      data: {
        id: `brand-${Date.now()}`,
        brandName,
        strength,
        form,
        manufacturer,
        unitPrice: parseFloat(unitPrice) || 1.0,
        genericId,
      },
      include: { generic: true },
    });

    return NextResponse.json({ success: true, drug: newDrug });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
