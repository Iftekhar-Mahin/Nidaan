'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/context';
import { ShieldCheck, PhoneCall, AlertTriangle, Stethoscope, Heart } from 'lucide-react';

export function Footer() {
  const { t, language } = useTranslation();

  return (
    <footer className="mt-auto bg-slate-900 text-slate-300 border-t border-slate-800">
      
      {/* Medical Safety Disclaimer Banner */}
      <div className="bg-amber-950/70 border-b border-amber-800/60 px-4 py-3 text-amber-200">
        <div className="max-w-7xl mx-auto flex items-start gap-3 text-xs sm:text-sm">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="font-semibold text-amber-300">{language === 'bn' ? 'সতর্কতা: ' : 'Notice: '}</strong>
            {t('app.disclaimer')}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <Stethoscope className="w-5 h-5" />
              </div>
              <span className="font-heading font-bold text-lg text-white">Nidaan (নিদান)</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              {t('app.tagline')}. Built specifically for the healthcare landscape in Bangladesh to make essential medicines accessible, transparent, and affordable through AI vision and clinical NLP.
            </p>
            <div className="flex items-center gap-2 pt-2 text-[11px] text-brand-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Compliant with DGDA Bangladesh Generic Drug Classification</span>
            </div>
          </div>

          {/* Emergency Bangladesh Health Hotlines */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-brand-400" />
              <span>{language === 'bn' ? 'জরুরি স্বাস্থ্যসেবা নম্বর' : 'Emergency Hotlines'}</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center justify-between border-b border-slate-800 pb-1">
                <span>Shastho Batayan (স্বাস্থ্য বাতায়ন):</span>
                <span className="font-bold text-brand-400">16263</span>
              </li>
              <li className="flex items-center justify-between border-b border-slate-800 pb-1">
                <span>National Emergency Service:</span>
                <span className="font-bold text-brand-400">999</span>
              </li>
              <li className="flex items-center justify-between border-b border-slate-800 pb-1">
                <span>IEDCR Corona Helpline:</span>
                <span className="font-bold text-brand-400">10655</span>
              </li>
            </ul>
          </div>

          {/* Quick Links & Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              {language === 'bn' ? 'প্রয়োজনীয় লিংক' : 'Quick Navigation'}
            </h4>
            <div className="flex flex-col space-y-1.5 text-xs text-slate-400">
              <Link href="/dashboard" className="hover:text-brand-400 transition-colors">
                {t('nav.dashboard')}
              </Link>
              <Link href="/scan" className="hover:text-brand-400 transition-colors">
                {t('nav.scan')}
              </Link>
              <Link href="/admin" className="hover:text-brand-400 transition-colors">
                {t('nav.admin')}
              </Link>
              <Link href="/profile" className="hover:text-brand-400 transition-colors">
                {t('nav.profile')}
              </Link>
            </div>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Nidaan (নিদান) Bangladesh. All rights reserved.</p>
          <div className="flex items-center gap-1 text-[11px]">
            <span>Developed with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 inline fill-rose-500" />
            <span>for the people of Bangladesh</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
