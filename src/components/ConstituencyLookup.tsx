"use client";

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';

interface Constituency {
  name: string;
  state: string;
  code: string;
  pinCodes: string[];
  affidavitUrl: string;
}

export default function ConstituencyLookup() {
  const { userProfile, updateProfile } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [result, setResult] = useState<Constituency | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  const handleSetHome = async () => {
    if (!result) return;
    try {
      await updateProfile({ 
        constituency: result.name,
        constituencyCode: result.code 
      });
    } catch (e) {
      console.error("Error setting home:", e);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setSearched(true);
    setResult(null);
    
    try {
      const constituenciesRef = collection(db, 'constituencies');
      
      // Try searching by name (starts with)
      const qName = query(
        constituenciesRef, 
        where('name', '>=', searchQuery), 
        where('name', '<=', searchQuery + '\uf8ff'),
        limit(1)
      );
      
      let querySnapshot = await getDocs(qName);
      
      // If no name match, try searching by PIN code (exact match in array)
      if (querySnapshot.empty) {
        const qPin = query(
          constituenciesRef, 
          where('pinCodes', 'array-contains', searchQuery),
          limit(1)
        );
        querySnapshot = await getDocs(qPin);
      }

      if (!querySnapshot.empty) {
        setResult(querySnapshot.docs[0].data() as Constituency);
      }
    } catch (error) {
      console.error("Firestore Search Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-surface-container-low rounded-3xl p-8 border border-outline-variant shadow-sm mt-8">
      <div className="max-w-2xl mx-auto text-center mb-8">
        <h2 className="text-[28px] font-bold text-on-surface mb-2">{t('lookup_title')}</h2>
        <p className="text-on-surface-variant">{t('lookup_subtitle')}</p>
      </div>

      <form onSubmit={handleSearch} className="max-w-xl mx-auto flex flex-col sm:flex-row gap-3 mb-8">
        <div className="flex-1 relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('lookup_placeholder')}
            className="w-full pl-12 pr-4 py-4 bg-white border border-outline-variant rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-on-surface"
          />
        </div>
        <button 
          type="submit"
          disabled={loading}
          className="px-8 py-4 bg-primary text-on-primary rounded-2xl font-bold hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              {t('lookup_btn')} <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </>
          )}
        </button>
      </form>

      {searched && !loading && (
        <div className="max-w-xl mx-auto animate-in fade-in slide-in-from-top-4 duration-500">
          {result ? (
            <div className="bg-white border border-primary/20 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                 <span className="material-symbols-outlined text-[120px]">how_to_vote</span>
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full uppercase tracking-widest">{result.state}</span>
                    <span className="px-3 py-1 bg-surface-container text-on-surface-variant text-[10px] font-bold rounded-full uppercase tracking-widest">Code: {result.code}</span>
                  </div>
                  
                  {userProfile?.constituency === result.name ? (
                    <div className="flex items-center gap-1 text-primary font-bold text-xs">
                      <span className="material-symbols-outlined text-sm">home</span> Home
                    </div>
                  ) : (
                    <button 
                      onClick={handleSetHome}
                      className="text-[10px] font-bold text-on-surface-variant hover:text-primary flex items-center gap-1 transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">add_home</span> {t('set_as_home')}
                    </button>
                  )}
                </div>
                
                <h3 className="text-2xl font-bold text-on-surface mb-4">{result.name} {t('constituency_suffix')}</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <a 
                    href={result.affidavitUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex flex-col p-4 bg-surface-container-lowest border border-outline-variant rounded-xl hover:border-primary/50 transition-colors group"
                  >
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase mb-1">{t('official_document')}</span>
                    <span className="font-bold text-primary flex items-center gap-2">
                      {t('view_affidavits')} <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">description</span>
                    </span>
                  </a>
                  
                  <a 
                    href={`https://affidavit.eci.gov.in/candidate-search?constituency=${result.name}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex flex-col p-4 bg-surface-container-lowest border border-outline-variant rounded-xl hover:border-primary/50 transition-colors group"
                  >
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase mb-1">{t('candidate_list')}</span>
                    <span className="font-bold text-primary flex items-center gap-2">
                      {t('know_candidates')} <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">person_search</span>
                    </span>
                  </a>
                </div>
                
                <p className="mt-6 text-[11px] text-on-surface-variant leading-relaxed">
                  {t('eci_portal_note')}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-surface-container p-8 rounded-2xl text-center border border-dashed border-outline-variant">
              <span className="material-symbols-outlined text-on-surface-variant text-[48px] mb-4">search_off</span>
              <p className="font-bold text-on-surface mb-1">{t('no_match_title')} "{searchQuery}"</p>
              <p className="text-sm text-on-surface-variant mb-6">{t('no_match_subtitle')}</p>
              <a 
                href="https://electoralsearch.eci.gov.in/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary font-bold hover:underline"
              >
                {t('go_to_official_search')} <span className="material-symbols-outlined text-[18px]">open_in_new</span>
              </a>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
