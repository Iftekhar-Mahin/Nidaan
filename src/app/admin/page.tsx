'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/lib/i18n/context';
import { useAuth } from '@/lib/auth/context';
import { DrugManager } from '@/components/admin/DrugManager';
import { OcrAuditViewer } from '@/components/admin/OcrAuditViewer';
import {
  ShieldAlert,
  Database,
  FileCheck2,
  Sparkles,
  Lock,
  UserCheck,
} from 'lucide-react';

export default function AdminPage() {
  const { t } = useTranslation();
  const { user, loginDemo } = useAuth();
  const [activeTab, setActiveTab] = useState<'DRUGS' | 'AUDIT'>('DRUGS');

  const isStaff = user && (user.role === 'ADMIN' || user.role === 'PHARMACIST');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title & Role Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">
              {t('admin.title')}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t('admin.subtitle')}
          </p>
        </div>

        {/* Current Role / Quick Grant */}
        {!isStaff ? (
          <div className="flex items-center gap-2 p-2 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-xs">
            <Lock className="w-4 h-4 text-amber-600" />
            <span className="text-amber-800 dark:text-amber-200 font-semibold">Demo Staff Access:</span>
            <button
              type="button"
              onClick={() => loginDemo('ADMIN')}
              className="px-2.5 py-1 rounded-lg bg-purple-600 text-white font-bold hover:bg-purple-700 shadow-2xs"
            >
              Switch to Admin
            </button>
            <button
              type="button"
              onClick={() => loginDemo('PHARMACIST')}
              className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-2xs"
            >
              Switch to Pharmacist
            </button>
          </div>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
            <UserCheck className="w-4 h-4" />
            <span>Logged in as {user.role}: {user.name}</span>
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex rounded-2xl bg-slate-100 dark:bg-slate-900 p-1 max-w-md">
        <button
          type="button"
          onClick={() => setActiveTab('DRUGS')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'DRUGS'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Database className="w-4 h-4 text-brand-600" />
          <span>{t('admin.tabDrugs')}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('AUDIT')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'AUDIT'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <FileCheck2 className="w-4 h-4 text-amber-500" />
          <span>{t('admin.tabAudit')}</span>
        </button>
      </div>

      {/* Content */}
      {activeTab === 'DRUGS' ? <DrugManager /> : <OcrAuditViewer />}

    </div>
  );
}
