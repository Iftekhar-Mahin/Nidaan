'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/context';
import { useTheme } from '@/lib/theme/context';
import { useAuth } from '@/lib/auth/context';
import {
  Scan,
  LayoutDashboard,
  Pill,
  ShieldAlert,
  Sun,
  Moon,
  Globe,
  User,
  LogOut,
  Menu,
  X,
  Stethoscope,
  ChevronDown,
} from 'lucide-react';

export function Navbar() {
  const { t, language, toggleLanguage } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { user, logout, loginDemo } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { href: '/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
    { href: '/scan', label: t('nav.scan'), icon: Scan },
    { href: '/admin', label: t('nav.admin'), icon: ShieldAlert, requiresRole: ['ADMIN', 'PHARMACIST'] },
  ];

  const filteredLinks = navLinks.filter(
    (link) => !link.requiresRole || (user && link.requiresRole.includes(user.role))
  );

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                  Nidaan
                </span>
                <span className="font-bangla font-bold text-lg text-brand-600 dark:text-brand-400">
                  (নিদান)
                </span>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 tracking-wider uppercase font-semibold hidden sm:inline-block">
                AI Rx Scanner &amp; Generics
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {filteredLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls: Language, Theme, User */}
          <div className="flex items-center gap-2">
            
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              title={language === 'bn' ? 'Switch to English' : 'বাংলায় দেখুন'}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-brand-500 transition-colors shadow-xs"
            >
              <Globe className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              <span>{language === 'bn' ? 'বাং' : 'EN'}</span>
            </button>

            {/* Dark/Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              title="Toggle Theme"
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 transition-colors shadow-xs"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* User Account / Profile Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pl-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 hover:border-brand-500 transition-colors shadow-xs"
                >
                  <div className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center text-[10px] font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline-block max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase ${
                    user.role === 'ADMIN' ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300' :
                    user.role === 'PHARMACIST' ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300' :
                    'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                  }`}>
                    {user.role}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div
                    onMouseLeave={() => setUserDropdownOpen(false)}
                    className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                  >
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email || user.phone}</p>
                    </div>
                    
                    <Link
                      href="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      <User className="w-3.5 h-3.5" />
                      {t('nav.profile')}
                    </Link>

                    {/* Quick Role Switcher for seamless demo testing */}
                    <div className="px-4 py-1.5 border-t border-slate-100 dark:border-slate-700">
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Switch Role</p>
                      <div className="grid grid-cols-3 gap-1 text-[10px]">
                        <button
                          onClick={() => { loginDemo('PATIENT'); setUserDropdownOpen(false); }}
                          className={`px-1.5 py-1 rounded text-center font-medium ${user.role === 'PATIENT' ? 'bg-brand-600 text-white font-bold' : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200'}`}
                        >
                          Patient
                        </button>
                        <button
                          onClick={() => { loginDemo('PHARMACIST'); setUserDropdownOpen(false); }}
                          className={`px-1.5 py-1 rounded text-center font-medium ${user.role === 'PHARMACIST' ? 'bg-blue-600 text-white font-bold' : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200'}`}
                        >
                          Pharm
                        </button>
                        <button
                          onClick={() => { loginDemo('ADMIN'); setUserDropdownOpen(false); }}
                          className={`px-1.5 py-1 rounded text-center font-medium ${user.role === 'ADMIN' ? 'bg-purple-600 text-white font-bold' : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200'}`}
                        >
                          Admin
                        </button>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-700 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="flex items-center gap-2 w-full px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        {t('nav.logout')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link
                  href="/login"
                  className="px-3 py-1.5 text-xs font-semibold text-brand-700 dark:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-950/60 rounded-lg transition-colors"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  href="/register"
                  className="px-3 py-1.5 text-xs font-semibold bg-brand-600 text-white hover:bg-brand-700 rounded-lg transition-colors shadow-xs"
                >
                  {t('nav.register')}
                </Link>
              </div>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-4 space-y-1">
          {filteredLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 font-semibold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
