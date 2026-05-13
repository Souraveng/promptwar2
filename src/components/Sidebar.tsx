'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  // Close sidebar on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: '/dashboard', label: t('dashboard'), icon: 'dashboard' },
    { href: '/chat', label: t('chat_title'), icon: 'smart_toy' },
    { href: '/candidates', label: t('candidates'), icon: 'person_search' },
    { href: '/polling', label: t('polling_stations'), icon: 'where_to_vote' },
    { href: '/results', label: t('results'), icon: 'analytics' },
    { href: '/simulator', label: t('vvpat_simulator'), icon: 'smart_toy' },
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'ta', name: 'தமிழ்' },
    { code: 'te', name: 'తెలుగు' },
    { code: 'bn', name: 'বাংলা' },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed top-3 left-4 z-50 md:hidden p-2 bg-white rounded-md border border-slate-200 shadow-sm"
      >
        <span className="material-symbols-outlined">menu</span>
      </button>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <nav 
        className={`
          fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-slate-200 flex flex-col pt-10 pb-6 transition-transform duration-300 overflow-y-auto custom-scrollbar
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        {/* Close button for mobile */}
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 md:hidden p-2 hover:bg-slate-100 rounded-full"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="px-6 mb-8 mt-4">
          <h2 className="text-[24px] font-bold text-primary mb-1">Bharat Nirvachan</h2>
          <p className="text-xs font-semibold text-secondary uppercase tracking-widest">{t('official_links')}</p>
        </div>

        <div className="space-y-1 px-2 mb-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.href}
                href={link.href} 
                className={`
                  flex items-center gap-3 px-4 py-3 transition-all rounded-lg
                  ${isActive 
                    ? 'bg-primary-container text-on-primary-container font-bold border-r-4 border-primary' 
                    : 'text-slate-500 hover:bg-slate-100'}
                `}
              >
                <span className={`material-symbols-outlined ${isActive ? 'fill-1' : ''}`}>{link.icon}</span>
                <span className="text-[16px]">{link.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="px-4 mb-6">
          <button className="w-full bg-error text-white text-[16px] font-bold py-3 px-4 rounded-xl hover:opacity-90 transition-colors flex justify-center items-center gap-2 shadow-sm">
            {t('verify_voter_id')}
          </button>
        </div>

        <div className="px-4 mb-8">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-2">{t('language')}</p>
          <div className="grid grid-cols-2 gap-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code as any)}
                className={`
                  text-[12px] py-1.5 px-2 rounded-md transition-all border
                  ${language === lang.code 
                    ? 'bg-primary text-white border-primary font-bold' 
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}
                `}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>

        <div className="px-2 space-y-1 border-t border-slate-100 pt-4 mt-auto">
          <Link href="/settings" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-100 transition-all rounded-lg">
            <span className="material-symbols-outlined">settings</span>
            <span className="text-[16px]">{t('settings')}</span>
          </Link>
          <Link href="/support" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-100 transition-all rounded-lg">
            <span className="material-symbols-outlined">contact_support</span>
            <span className="text-[16px]">{t('support')}</span>
          </Link>
        </div>
      </nav>
    </>
  );
}
