'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/context';
import { useAuth } from '@/lib/auth/context';
import {
  Stethoscope,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';

export default function LoginPage() {
  const { t, language } = useTranslation();
  const { loginWithCredentials, loginWithOtp, loginDemo } = useAuth();
  const router = useRouter();

  const [mode, setMode] = useState<'PASSWORD' | 'OTP'>('PASSWORD');
  const [emailOrPhone, setEmailOrPhone] = useState('patient@nidaan.bd');
  const [password, setPassword] = useState('demo12345');
  const [otpPhone, setOtpPhone] = useState('01711223344');
  const [otpCode, setOtpCode] = useState('123456');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await loginWithCredentials(emailOrPhone, password);
    setLoading(false);
    router.push('/dashboard');
  };

  const handleSendOtp = () => {
    if (!otpPhone) return;
    setOtpSent(true);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await loginWithOtp(otpPhone, otpCode);
    setLoading(false);
    router.push('/dashboard');
  };

  const handleQuickDemo = (role: 'PATIENT' | 'PHARMACIST' | 'ADMIN') => {
    loginDemo(role);
    if (role === 'ADMIN' || role === 'PHARMACIST') {
      router.push('/admin');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-teal-500 text-white flex items-center justify-center mx-auto shadow-md">
            <Stethoscope className="w-6 h-6" />
          </div>
          <h2 className="font-heading font-extrabold text-2xl text-slate-900 dark:text-white">
            {t('auth.signInTitle')}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t('auth.signInSubtitle')}
          </p>
        </div>

        {/* Quick 1-Click Demo Login Bar */}
        <div className="p-4 rounded-2xl bg-brand-50/80 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-800 dark:text-brand-300 block text-center">
            {t('auth.orContinueWith')}
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('PATIENT')}
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-700 hover:bg-brand-100 dark:hover:bg-slate-700 shadow-2xs transition-colors truncate"
            >
              Patient
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('PHARMACIST')}
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-700 hover:bg-sky-100 dark:hover:bg-slate-700 shadow-2xs transition-colors truncate"
            >
              Pharmacist
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('ADMIN')}
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700 hover:bg-purple-100 dark:hover:bg-slate-700 shadow-2xs transition-colors truncate"
            >
              Admin
            </button>
          </div>
        </div>

        {/* Card Form */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl space-y-5">
          
          {/* Auth Method Tabs: Password vs Mobile OTP */}
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-900 p-1">
            <button
              type="button"
              onClick={() => setMode('PASSWORD')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                mode === 'PASSWORD'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Email & Password
            </button>
            <button
              type="button"
              onClick={() => setMode('OTP')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                mode === 'OTP'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Mobile OTP (বাং)
            </button>
          </div>

          {mode === 'PASSWORD' ? (
            <form onSubmit={handleSubmitPassword} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  {t('auth.emailOrPhone')}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-750 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    {t('auth.password')}
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                  >
                    {t('auth.forgotPassword')}
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-750 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm bg-brand-600 hover:bg-brand-700 text-white shadow-md transition-all active:scale-98"
              >
                <span>{t('auth.signInBtn')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  {t('auth.phone')}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={otpPhone}
                    onChange={(e) => setOtpPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-750 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {!otpSent ? (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="w-full py-2.5 rounded-xl font-bold text-xs bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-200 transition-colors"
                >
                  {t('auth.sendOtp')}
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                      {t('auth.enterOtp')}
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        maxLength={6}
                        required
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        placeholder="123456"
                        className="w-full pl-9 pr-3 py-2.5 tracking-widest text-center text-sm font-bold rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-750 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm bg-brand-600 hover:bg-brand-700 text-white shadow-md"
                  >
                    <span>{t('auth.verifyOtp')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </form>
          )}

          <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-500">
            <span>{t('auth.noAccount')} </span>
            <Link
              href="/register"
              className="font-bold text-brand-600 dark:text-brand-400 hover:underline"
            >
              {t('auth.signUpBtn')}
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
