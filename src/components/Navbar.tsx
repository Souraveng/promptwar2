"use client";

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import AuthModal from './AuthModal';
import ProfileModal from './ProfileModal';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout, isAuthModalOpen, setIsAuthModalOpen, authMode, setAuthMode } = useAuth();
  const { t } = useLanguage();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  return (
    <nav className="bg-white/95 dark:bg-slate-950/95 backdrop-blur-md text-slate-900 dark:text-slate-50 font-sans text-sm tracking-tight border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
      <div className="max-w-[1200px] mx-auto flex justify-between items-center px-6 h-16">
        <Link href="/" className="text-xl font-bold tracking-tighter text-slate-900 dark:text-white flex items-center gap-2">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>how_to_vote</span>
          {t('portal_name')}
        </Link>
        
        <div className="flex items-center space-x-4">
          <LanguageSwitcher />
          
          {!user ? (
            <>
              <button 
                onClick={() => { setAuthMode('signin'); setIsAuthModalOpen(true); }}
                className="text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                {t('sign_in')}
              </button>
              <button 
                onClick={() => { setAuthMode('signup'); setIsAuthModalOpen(true); }}
                className="bg-primary text-on-primary px-4 py-2 rounded text-sm font-semibold hover:opacity-90 transition-all"
              >
                {t('sign_up')}
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-4 pl-4 border-l border-slate-200 dark:border-slate-800">
                <button 
                  onClick={() => setIsProfileModalOpen(true)}
                  className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">account_circle</span>
                  {t('profile') || 'Profile'}
                </button>
                <button 
                  onClick={logout}
                  className="text-xs font-bold text-error uppercase tracking-wider hover:opacity-70 transition-opacity"
                >
                  {t('logout')}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <ProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
      />
    </nav>
  );
}
