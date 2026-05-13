"use client";

import React from 'react';
import { useLanguage, Language } from '@/context/LanguageContext';

const languages: { code: Language; name: string; nativeName: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
];

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-low border border-outline-variant hover:border-primary/50 transition-all">
        <span className="material-symbols-outlined text-[18px] text-primary">language</span>
        <span className="text-xs font-bold uppercase tracking-wider text-on-surface">
          {languages.find(l => l.code === language)?.nativeName}
        </span>
        <span className="material-symbols-outlined text-[14px] text-on-surface-variant">expand_more</span>
      </button>

      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-outline-variant rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100] overflow-hidden">
        <div className="p-2 border-b border-outline-variant bg-slate-50 dark:bg-slate-800">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest px-2">Select Language</span>
        </div>
        <div className="p-1">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                language === lang.code 
                  ? 'bg-primary/10 text-primary font-bold' 
                  : 'hover:bg-surface-container-low text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <div className="flex flex-col items-start">
                <span className={`text-sm ${language === lang.code ? 'text-primary dark:text-white' : 'text-slate-700 dark:text-slate-200'}`}>
                  {lang.nativeName}
                </span>
                <span className={`text-[10px] uppercase tracking-tighter ${language === lang.code ? 'text-primary/70 dark:text-white/70' : 'text-slate-500 dark:text-slate-400'}`}>
                  {lang.name}
                </span>
              </div>
              {language === lang.code && (
                <span className="material-symbols-outlined text-[18px] text-primary dark:text-white">check_circle</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
