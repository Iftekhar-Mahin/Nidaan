'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/context';
import {
  Scan,
  Sparkles,
  ArrowRight,
  TrendingDown,
  ShieldCheck,
  CheckCircle2,
  Stethoscope,
  Pill,
  FileSearch,
  Building2,
  HeartPulse,
} from 'lucide-react';

export default function HomePage() {
  const { t, formatPercent, toBangla } = useTranslation();

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 bg-gradient-to-b from-brand-50/60 via-slate-50 to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left 7 Cols: Hero Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100 dark:bg-brand-950/80 text-brand-800 dark:text-brand-300 text-xs font-bold border border-brand-200 dark:border-brand-800 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                <span>{t('home.heroBadge')}</span>
              </div>

              <h1 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl text-slate-900 dark:text-white tracking-tight leading-[1.15]">
                {t('home.heroTitle1')}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-teal-500 dark:from-brand-400 dark:to-teal-300 block sm:inline">
                  {t('home.heroTitle2')}
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-bangla">
                {t('home.heroDesc')}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/scan"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-brand-600 to-teal-600 hover:from-brand-700 hover:to-teal-700 text-white shadow-lg hover:shadow-brand-500/20 active:scale-98 transition-all"
                >
                  <Scan className="w-4 h-4" />
                  <span>{t('home.startScanning')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 shadow-xs transition-colors"
                >
                  <HeartPulse className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                  <span>{t('home.exploreDashboard')}</span>
                </Link>
              </div>

              {/* Trust badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Square, Beximco, Incepta Generics</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-brand-500" />
                  <span>DGDA Approved Formulas</span>
                </div>
              </div>

            </div>

            {/* Right 5 Cols: Live Interactive Prescription Preview Card */}
            <div className="lg:col-span-5">
              <div className="relative p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl space-y-4">
                
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                      Live AI Recognition Demo
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-bold">
                    DMCH Dhaka
                  </span>
                </div>

                {/* Scanned Sample Line */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-mono">Raw OCR: &quot;Tab Napa Extra 1+0+1&quot;</span>
                    <span className="text-emerald-600 font-bold">96% Conf</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm text-slate-900 dark:text-white">Napa Extra (Beximco)</p>
                      <p className="text-[11px] text-brand-600 font-medium">Paracetamol + Caffeine (500/65mg)</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 line-through">৳ 2.50 / tab</span>
                      <p className="text-xs font-bold text-emerald-600">৳ 2.10 (Feva Plus)</p>
                    </div>
                  </div>
                </div>

                {/* Second Scanned Sample Line */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-mono">Raw OCR: &quot;Cap Sec1o 20mg 1-0-1&quot;</span>
                    <span className="text-emerald-600 font-bold">88% Conf</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm text-slate-900 dark:text-white">Seclo 20 (Square)</p>
                      <p className="text-[11px] text-brand-600 font-medium">Omeprazole 20mg (PPI)</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 line-through">৳ 6.00 / cap</span>
                      <p className="text-xs font-bold text-emerald-600">৳ 4.50 (Ocid / Xeldrin)</p>
                    </div>
                  </div>
                </div>

                {/* Savings summary pill */}
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 dark:text-emerald-200">
                    <TrendingDown className="w-4 h-4 text-emerald-600" />
                    <span>Average Rx Savings</span>
                  </div>
                  <span className="text-sm font-extrabold text-emerald-700 dark:text-emerald-300">
                    Save ~৳ 450 (38%)
                  </span>
                </div>

                <Link
                  href="/scan"
                  className="w-full block text-center py-2.5 rounded-xl text-xs font-bold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950 hover:bg-brand-100 border border-brand-200 dark:border-brand-800 transition-colors"
                >
                  {t('home.trySample')} &rarr;
                </Link>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3 Step Workflow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            Frictionless &amp; Transparent
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">
            {t('home.howItWorksTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t('home.howItWorksSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <Scan className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              {t('home.step1Title')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-bangla">
              {t('home.step1Desc')}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <FileSearch className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              {t('home.step2Title')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-bangla">
              {t('home.step2Desc')}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <TrendingDown className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              {t('home.step3Title')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-bangla">
              {t('home.step3Desc')}
            </p>
          </div>

        </div>

      </section>

      {/* Built for Bangladesh Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">
            {t('home.featuresTitle')}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-2">
            <Stethoscope className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">{t('home.feature1Title')}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-bangla">{t('home.feature1Desc')}</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-2">
            <Building2 className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">{t('home.feature2Title')}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-bangla">{t('home.feature2Desc')}</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-2">
            <Sparkles className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">{t('home.feature3Title')}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-bangla">{t('home.feature3Desc')}</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-2">
            <TrendingDown className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">{t('home.feature4Title')}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-bangla">{t('home.feature4Desc')}</p>
          </div>

        </div>

      </section>

    </div>
  );
}
