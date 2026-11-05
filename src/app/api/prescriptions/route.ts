import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const prescriptions = await prisma.prescription.findMany({
      include: {
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    const formatted = prescriptions.map((p) => ({
      ...p,
      parsedItems: p.items,
    }));
    return NextResponse.json({ prescriptions: formatted });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, imageUrl, status, parsedItems, items } = body;
    const itemsToCreate = parsedItems || items || [];

    const newRx = await prisma.prescription.create({
      data: {
        id: `rx-${Date.now()}`,
        userId: userId || 'user-patient-1',
        imageUrl: imageUrl || '/samples/prescription_dmch.svg',
        status: status || 'PENDING',
        items: {
          create: itemsToCreate.map((item: any) => ({
            id: `item-${Date.now()}-${Math.random().toString(36).substring(7)}`,
            rawOcrText: item.rawOcrText || '',
            matchedBrand: item.matchedBrand || null,
            matchedGeneric: item.matchedGeneric || null,
            strength: item.strength || null,
            dosageSchedule: item.dosageSchedule || null,
            duration: item.duration || null,
            confidence: item.confidence || 0.85,
            isUserVerified: item.isUserVerified || false,
          })),
        },
      },
      include: { items: true },
    });

    const responseRx = {
      ...newRx,
      parsedItems: newRx.items,
    };

    return NextResponse.json({ success: true, prescription: responseRx });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
