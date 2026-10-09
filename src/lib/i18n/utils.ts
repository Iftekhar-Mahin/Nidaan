import { Language } from '../types';

const banglaDigits: Record<string, string> = {
  '0': '০',
  '1': '১',
  '2': '২',
  '3': '৩',
  '4': '৪',
  '5': '৫',
  '6': '৬',
  '7': '৭',
  '8': '৮',
  '9': '৯',
};

const englishDigits: Record<string, string> = {
  '০': '0',
  '১': '1',
  '২': '2',
  '৩': '3',
  '৪': '4',
  '৫': '5',
  '৬': '6',
  '৭': '7',
  '৮': '8',
  '৯': '9',
};

/**
 * Converts English digits (0-9) to Bangla digits (০-৯)
 */
export function toBanglaNumber(value: number | string): string {
  if (value === null || value === undefined) return '';
  return value.toString().replace(/[0-9]/g, (digit) => banglaDigits[digit] || digit);
}

/**
 * Converts Bangla digits to English digits
 */
export function toEnglishNumber(value: string): string {
  if (!value) return '';
  return value.replace(/[০-৯]/g, (digit) => englishDigits[digit] || digit);
}

/**
 * Formats a currency amount according to active language (e.g. '৳ 15.00' vs '১৫.০০ টাকা')
 */
export function formatCurrency(amount: number, lang: Language = 'en'): string {
  const formattedNumber = amount.toFixed(2);
  if (lang === 'bn') {
    return `${toBanglaNumber(formattedNumber)} টাকা`;
  }
  return `৳ ${formattedNumber}`;
}

/**
 * Formats dosage notation according to language
 * E.g. '1-0-1' or '1+0+1' -> '১+০+১' in Bangla
 */
export function formatDosage(schedule: string, lang: Language = 'en'): string {
  if (!schedule) return '-';
  const normalized = schedule.replace(/[-]/g, '+');
  if (lang === 'bn') {
    return toBanglaNumber(normalized);
  }
  return normalized;
}

/**
 * Formats duration (e.g. '7 days' or '7' -> '৭ দিন' vs '7 days')
 */
export function formatDuration(durationStr: string, lang: Language = 'en'): string {
  if (!durationStr) return '-';
  
  // Extract number and unit
  const match = durationStr.match(/^(\d+)\s*(days?|months?|weeks?|দিন|মাস|সপ্তাহ)?/i);
  if (!match) {
    return lang === 'bn' ? toBanglaNumber(durationStr) : durationStr;
  }

  const num = match[1];
  const unit = (match[2] || 'days').toLowerCase();

  if (lang === 'bn') {
    const bnNum = toBanglaNumber(num);
    if (unit.startsWith('m') || unit.includes('মাস')) return `${bnNum} মাস`;
    if (unit.startsWith('w') || unit.includes('সপ্তাহ')) return `${bnNum} সপ্তাহ`;
    return `${bnNum} দিন`;
  } else {
    if (unit.startsWith('m') || unit.includes('মাস')) return `${num} month${num === '1' ? '' : 's'}`;
    if (unit.startsWith('w') || unit.includes('সপ্তাহ')) return `${num} week${num === '1' ? '' : 's'}`;
    return `${num} day${num === '1' ? '' : 's'}`;
  }
}

/**
 * Formats percentage
 */
export function formatPercentage(percent: number, lang: Language = 'en'): string {
  const formatted = Math.round(percent);
  if (lang === 'bn') {
    return `${toBanglaNumber(formatted)}%`;
  }
  return `${formatted}%`;
}
