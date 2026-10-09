'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/context';
import { useAuth } from '@/lib/auth/context';
import { getAllPrescriptions } from '@/lib/prescription-store';
import { PrescriptionRecord } from '@/lib/types';
import { SavingsTracker } from '@/components/dashboard/SavingsTracker';
import { RecentScans } from '@/components/dashboard/RecentScans';
import {
  Scan,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  Plus,
} from 'lucide-react';

export default function DashboardPage() {
  const { t, language } = useTranslation();
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState<PrescriptionRecord[]>([]);

  useEffect(() => {
    setPrescriptions(getAllPrescriptions());
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Welcome & Quick Scan Hero Card */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-brand-900 via-teal-900 to-slate-900 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-400/30 text-brand-300 text-xs font-semibold">
              <Stethoscope className="w-3.5 h-3.5" />
              <span>{t('dashboard.greeting')}, {user?.name || 'Patient'}</span>
            </div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
              {t('dashboard.quickScanTitle')}
            </h1>
            <p className="text-xs sm:text-sm text-brand-200 leading-relaxed font-bangla">
              {t('dashboard.quickScanDesc')}
            </p>
          </div>

          <Link
            href="/scan"
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-brand-500 to-teal-400 hover:from-brand-600 hover:to-teal-500 text-white shadow-lg active:scale-98 transition-all shrink-0"
          >
            <Scan className="w-4 h-4" />
            <span>{t('dashboard.scanNow')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Savings Tracker Metrics */}
      <SavingsTracker prescriptions={prescriptions} />

      {/* Recent Scans Table */}
      <RecentScans prescriptions={prescriptions} />

    </div>
  );
}
