'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/lib/i18n/context';
import { useTheme } from '@/lib/theme/context';
import { useAuth } from '@/lib/auth/context';
import {
  User,
  Mail,
  Phone,
  Shield,
  Globe,
  Sun,
  Moon,
  Check,
  Building2,
  Calendar,
} from 'lucide-react';

export default function ProfilePage() {
  const { t, language, setLanguage, toBangla } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || 'Kazi Farhan Ahmed');
  const [email, setEmail] = useState(user?.email || 'patient@nidaan.bd');
  const [phone, setPhone] = useState(user?.phone || '01711223344');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, email, phone });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title */}
      <div className="space-y-1 border-b border-slate-200 dark:border-slate-800 pb-4">
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">
          {t('nav.profile')} &amp; Preferences
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Manage your personal information, preferred language, theme, and security settings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left 4 Cols: Avatar & Summary */}
        <div className="md:col-span-4 space-y-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center space-y-3 shadow-xs">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-brand-600 to-teal-500 text-white flex items-center justify-center text-2xl font-extrabold mx-auto shadow-md">
              {name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">{name}</h3>
              <p className="text-xs text-slate-500">{email || phone}</p>
            </div>

            <div className="pt-2">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                user?.role === 'ADMIN' ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300' :
                user?.role === 'PHARMACIST' ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300' :
                'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
              }`}>
                {user?.role || 'PATIENT'} ACCOUNT
              </span>
            </div>
          </div>
        </div>

        {/* Right 8 Cols: Edit Settings Form */}
        <div className="md:col-span-8 space-y-6">
          
          <form onSubmit={handleSave} className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-5">
            
            <h3 className="font-bold text-sm text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2">
              Personal Information
            </h3>

            <div className="space-y-4 text-xs">
              
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  {t('auth.fullName')}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-750 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  {t('auth.email')}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-750 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  {t('auth.phone')}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-750 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

            </div>

            {/* Language & Theme Controls */}
            <h3 className="font-bold text-sm text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pt-3 pb-2">
              Application Appearance &amp; Localization
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              {/* Language Selection */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-brand-600" />
                  <span>Preferred Language (ভাষা)</span>
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setLanguage('bn')}
                    className={`flex-1 py-2 rounded-xl font-bold border transition-colors ${
                      language === 'bn'
                        ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-750 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    বাংলা (Bangla)
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('en')}
                    className={`flex-1 py-2 rounded-xl font-bold border transition-colors ${
                      language === 'en'
                        ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-750 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>

              {/* Theme Selection */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>Color Theme</span>
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setTheme('light')}
                    className={`flex-1 py-2 rounded-xl font-bold border transition-colors ${
                      theme === 'light'
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-750 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Light
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme('dark')}
                    className={`flex-1 py-2 rounded-xl font-bold border transition-colors ${
                      theme === 'dark'
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-750 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Dark
                  </button>
                </div>
              </div>

            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
              {savedSuccess ? (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  Settings saved successfully!
                </span>
              ) : (
                <div />
              )}

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl font-bold text-xs bg-brand-600 hover:bg-brand-700 text-white shadow-md transition-colors"
              >
                {t('common.saveChanges')}
              </button>
            </div>

          </form>

        </div>

      </div>

    </div>
  );
}
