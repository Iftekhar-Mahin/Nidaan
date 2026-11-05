import { PrismaClient } from '@prisma/client';
import { INITIAL_GENERIC_DRUGS, INITIAL_BRAND_MEDICINES } from '../src/lib/sample-data';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Nidaan database seeding...');

  // Create Users
  await prisma.user.upsert({
    where: { email: 'patient@nidaan.bd' },
    update: {},
    create: {
      id: 'user-patient-1',
      name: 'Kazi Farhan Ahmed',
      email: 'patient@nidaan.bd',
      phone: '01711223344',
      passwordHash: 'demo12345',
      role: 'PATIENT',
      language: 'bn',
    },
  });

  await prisma.user.upsert({
    where: { email: 'pharmacist@nidaan.bd' },
    update: {},
    create: {
      id: 'user-pharmacist-1',
      name: 'Dr. Tanvir Hasan (Pharm.D)',
      email: 'pharmacist@nidaan.bd',
      phone: '01811223344',
      passwordHash: 'demo12345',
      role: 'PHARMACIST',
      language: 'en',
    },
  });

  await prisma.user.upsert({
    where: { email: 'admin@nidaan.bd' },
    update: {},
    create: {
      id: 'user-admin-1',
      name: 'Admin System Lead',
      email: 'admin@nidaan.bd',
      phone: '01911223344',
      passwordHash: 'demo12345',
      role: 'ADMIN',
      language: 'en',
    },
  });

  console.log('✅ Demo users seeded.');

  // Seed Generic Drugs
  for (const generic of INITIAL_GENERIC_DRUGS) {
    await prisma.genericDrug.upsert({
      where: { genericName: generic.genericName },
      update: {
        category: generic.category || 'General',
        description: generic.description,
      },
      create: {
        id: generic.id,
        genericName: generic.genericName,
        category: generic.category || 'General',
        description: generic.description,
      },
    });
  }
  console.log(`✅ Seeded ${INITIAL_GENERIC_DRUGS.length} generic compounds.`);

  // Seed Brand Medicines
  for (const brand of INITIAL_BRAND_MEDICINES) {
    await prisma.brandMedicine.upsert({
      where: { id: brand.id },
      update: {
        brandName: brand.brandName,
        strength: brand.strength,
        form: brand.form,
        manufacturer: brand.manufacturer,
        unitPrice: brand.unitPrice,
        genericId: brand.genericId,
      },
      create: {
        id: brand.id,
        brandName: brand.brandName,
        strength: brand.strength,
        form: brand.form,
        manufacturer: brand.manufacturer,
        unitPrice: brand.unitPrice,
        genericId: brand.genericId,
      },
    });
  }
  console.log(`✅ Seeded ${INITIAL_BRAND_MEDICINES.length} brand medicines.`);

  // Seed sample prescription and items
  const demoPrescription = await prisma.prescription.upsert({
    where: { id: 'rx-demo-1' },
    update: {},
    create: {
      id: 'rx-demo-1',
      userId: 'user-patient-1',
      imageUrl: '/samples/prescription_dmch.svg',
      status: 'COMPLETED',
      createdAt: new Date('2026-08-10T11:20:00Z'),
    },
  });

  await prisma.prescriptionItem.deleteMany({
    where: { prescriptionId: 'rx-demo-1' },
  });

  await prisma.prescriptionItem.createMany({
    data: [
      {
        id: 'item-1',
        prescriptionId: 'rx-demo-1',
        rawOcrText: 'Tab Napa Extra (500/65mg) 1+0+1 7 days',
        matchedBrand: 'Napa Extra',
        matchedGeneric: 'Paracetamol + Caffeine',
        strength: '500mg+65mg',
        dosageSchedule: '1-0-1',
        duration: '7 days',
        confidence: 0.96,
        isUserVerified: true,
      },
      {
        id: 'item-2',
        prescriptionId: 'rx-demo-1',
        rawOcrText: 'Cap Sec1o 20mg 1-0-1 14 days',
        matchedBrand: 'Seclo 20',
        matchedGeneric: 'Omeprazole',
        strength: '20mg',
        dosageSchedule: '1-0-1',
        duration: '14 days',
        confidence: 0.88,
        isUserVerified: true,
      },
      {
        id: 'item-3',
        prescriptionId: 'rx-demo-1',
        rawOcrText: 'Tab Moxac1av 625 1+0+1 5 days',
        matchedBrand: 'Moxaclav 625',
        matchedGeneric: 'Amoxicillin + Clavulanic Acid',
        strength: '625mg',
        dosageSchedule: '1-0-1',
        duration: '5 days',
        confidence: 0.82,
        isUserVerified: true,
      },
      {
        id: 'item-4',
        prescriptionId: 'rx-demo-1',
        rawOcrText: 'Tab Monas 10mg 0-0-1 1 month',
        matchedBrand: 'Monas 10',
        matchedGeneric: 'Montelukast Sodium',
        strength: '10mg',
        dosageSchedule: '0-0-1',
        duration: '30 days',
        confidence: 0.94,
        isUserVerified: true,
      },
    ],
  });

  console.log('✅ Demo prescriptions and items seeded successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
