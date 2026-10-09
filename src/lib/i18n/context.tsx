'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language } from '../types';
import en from './en.json';
import bn from './bn.json';
import { toBanglaNumber, formatCurrency, formatDosage, formatDuration, formatPercentage } from './utils';

type TranslationData = typeof en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (keyPath: string, params?: Record<string, string | number>) => string;
  toBangla: (val: number | string) => string;
  formatMoney: (amount: number) => string;
  formatDose: (dosage: string) => string;
  formatTime: (duration: string) => string;
  formatPercent: (percent: number) => string;
}

const translations: Record<Language, TranslationData> = {
  en,
  bn,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('bn'); // default to bn per spec or fallback

  useEffect(() => {
    const saved = localStorage.getItem('nidaan_lang') as Language;
    if (saved && (saved === 'en' || saved === 'bn')) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('nidaan_lang', lang);
    document.documentElement.lang = lang;
  };

  const toggleLanguage = () => {
    const next = language === 'bn' ? 'en' : 'bn';
    setLanguage(next);
  };

  const t = (keyPath: string, params?: Record<string, string | number>): string => {
    const currentDict = translations[language] || translations.en;
    const keys = keyPath.split('.');
    
    let result: any = currentDict;
    for (const key of keys) {
      if (result && typeof result === 'object' && key in result) {
        result = result[key];
      } else {
        // Fallback to English
        let fallbackResult: any = translations.en;
        for (const fKey of keys) {
          if (fallbackResult && typeof fallbackResult === 'object' && fKey in fallbackResult) {
            fallbackResult = fallbackResult[fKey];
          } else {
            return keyPath;
          }
        }
        result = fallbackResult;
        break;
      }
    }

    if (typeof result !== 'string') {
      return keyPath;
    }

    if (params) {
      let templated = result;
      for (const [pKey, pVal] of Object.entries(params)) {
        const valStr = language === 'bn' && typeof pVal === 'number' 
          ? toBanglaNumber(pVal) 
          : pVal.toString();
        templated = templated.replace(new RegExp(`{${pKey}}`, 'g'), valStr);
      }
      return templated;
    }

    return result;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        toBangla: toBanglaNumber,
        formatMoney: (amt: number) => formatCurrency(amt, language),
        formatDose: (dose: string) => formatDosage(dose, language),
        formatTime: (dur: string) => formatDuration(dur, language),
        formatPercent: (pct: number) => formatPercentage(pct, language),
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}
