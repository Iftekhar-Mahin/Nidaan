'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/context';
import { useAuth } from '@/lib/auth/context';
import { Role } from '@/lib/types';
import {
  Stethoscope,
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  ShieldCheck,
  Building2,
  FileBadge,
  KeyRound,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

// Institutional verification codes for authorized doctors and pharmacists
const AUTHORIZED_PRO_CODES = ['PHARMA-2026', 'NIDAAN-PRO-2026', 'BMDC-2026', 'PCB-2026'];

export default function RegisterPage() {
  const { t } = useTranslation();
  const { register } = useAuth();
  const router = useRouter();

  const [accountType, setAccountType] = useState<'PATIENT' | 'PHARMACIST'>('PATIENT');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  // Professional verification fields
  const [councilRegNo, setCouncilRegNo] = useState('');
  const [institutionName, setInstitutionName] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Safeguard verification for Pharmacist / Doctor
    if (accountType === 'PHARMACIST') {
      if (!councilRegNo.trim() || councilRegNo.trim().length < 4) {
        setErrorMsg('Valid PCB (Pharmacy Council of Bangladesh) or BMDC registration number is required.');
        return;
      }
      if (!institutionName.trim()) {
        setErrorMsg('Please specify your affiliated pharmacy, clinic, or hospital name.');
        return;
      }
      const normalizedCode = verificationCode.trim().toUpperCase();
      if (!AUTHORIZED_PRO_CODES.includes(normalizedCode)) {
        setErrorMsg('Invalid Professional Verification Code. To prevent unauthorized clinical access, a valid healthcare institutional code is required to register as a Pharmacist/Doctor.');
        return;
      }
    }

    setLoading(true);
    try {
      await register(name, email, phone, accountType);
      router.push('/dashboard');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-teal-500 text-white flex items-center justify-center mx-auto shadow-md">
            <Stethoscope className="w-6 h-6" />
          </div>
          <h2 className="font-heading font-extrabold text-2xl text-slate-900 dark:text-white">
            {t('auth.signUpTitle')}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t('auth.signUpSubtitle')}
          </p>
        </div>

        {/* Account Type Selector Tabs */}
        <div className="flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => {
              setAccountType('PATIENT');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              accountType === 'PATIENT'
                ? 'bg-white dark:bg-slate-700 text-brand-700 dark:text-brand-300 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {t('auth.patient')} / General User
          </button>
          <button
            type="button"
            onClick={() => {
              setAccountType('PHARMACIST');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              accountType === 'PHARMACIST'
                ? 'bg-white dark:bg-slate-700 text-sky-700 dark:text-sky-300 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Pharmacist / Doctor</span>
          </button>
        </div>

        {/* Card Form */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl space-y-4">
          
          {/* Safeguard Notice for Professional Role */}
          {accountType === 'PHARMACIST' ? (
            <div className="p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-900 dark:text-sky-200 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <ShieldCheck className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                <span>Professional Healthcare Verification Required</span>
              </div>
              <p className="text-[11px] text-sky-700 dark:text-sky-300">
                To protect patient health and prevent misuse of medicine substitution guidelines, clinical accounts require verified PCB / BMDC credentials and an authorized institutional verification PIN.
              </p>
            </div>
          ) : null}

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            {/* Full Name */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                {t('auth.fullName')} *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={accountType === 'PHARMACIST' ? 'e.g. Dr. Tanvir Hasan (Pharm.D)' : 'e.g. Kazi Farhan Ahmed'}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                {t('auth.email')} *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                {t('auth.phone')} *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Professional Only Fields: Council Reg, Institution, Verification Code */}
            {accountType === 'PHARMACIST' && (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-700 space-y-3">
                
                {/* PCB / BMDC Registration Number */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>PCB / BMDC License Number *</span>
                    <span className="text-[10px] text-slate-400">DGDA Compliant</span>
                  </label>
                  <div className="relative">
                    <FileBadge className="w-4 h-4 text-sky-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={councilRegNo}
                      onChange={(e) => setCouncilRegNo(e.target.value)}
                      placeholder="e.g. PCB-A-12845 or BMDC-A-45920"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-sky-300 dark:border-sky-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Institution / Pharmacy Name */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Hospital, Clinic, or Pharmacy Affiliation *
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-sky-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={institutionName}
                      onChange={(e) => setInstitutionName(e.target.value)}
                      placeholder="e.g. Lazz Pharma Dhanmondi / Square Hospital"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-sky-300 dark:border-sky-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Verification PIN Code */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                      Professional Verification Code *
                    </label>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      Demo PIN: <code className="font-mono font-bold text-sky-600 dark:text-sky-400">PHARMA-2026</code>
                    </span>
                  </div>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-sky-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="Enter institutional invitation code"
                      className="w-full pl-9 pr-3 py-2.5 uppercase font-mono tracking-wider rounded-xl border border-sky-300 dark:border-sky-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                    />
                  </div>
                </div>

              </div>
            )}

            {/* Password */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                {t('auth.password')} *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white shadow-md transition-all active:scale-98 ${
                accountType === 'PHARMACIST'
                  ? 'bg-sky-600 hover:bg-sky-700'
                  : 'bg-brand-600 hover:bg-brand-700'
              }`}
            >
              <span>{t('auth.signUpBtn')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-500">
            <span>{t('auth.haveAccount')} </span>
            <Link
              href="/login"
              className="font-bold text-brand-600 dark:text-brand-400 hover:underline"
            >
              {t('auth.signInBtn')}
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
