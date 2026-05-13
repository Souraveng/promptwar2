'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Sidebar from '@/components/Sidebar';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();
  const { userProfile } = useAuth();

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'candidates'));
        setCandidates(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching candidates:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <header className="mb-12">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-2">
              <h1 className="text-[40px] font-bold text-on-surface">{t('candidates')}</h1>
              <div className="flex gap-4">
                <a 
                  href="https://voters.eci.gov.in/" 
                  target="_blank" 
                  className="px-4 py-2 bg-error/10 text-error rounded-full text-xs font-bold flex items-center gap-2 hover:bg-error/20 transition-all ring-1 ring-error/20"
                >
                  <span className="material-symbols-outlined text-sm">description</span>
                  PARTY MANIFESTOS 2026
                </a>
              </div>
            </div>
            <p className="text-on-surface-variant text-lg">Verified profiles and promises for General Elections 2026.</p>
          </header>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {candidates
                .sort((a, b) => {
                  const aMatch = a.constituency === userProfile?.constituency;
                  const bMatch = b.constituency === userProfile?.constituency;
                  return aMatch === bMatch ? 0 : aMatch ? -1 : 1;
                })
                .map((candidate) => {
                  const isHome = candidate.constituency === userProfile?.constituency;
                  return (
                    <div key={candidate.id} className={`bg-surface-container-lowest border rounded-3xl overflow-hidden hover:shadow-xl transition-all group ${isHome ? 'border-primary ring-1 ring-primary/20' : 'border-outline-variant'}`}>
                      <div className="h-32 bg-primary/10 relative">
                        {isHome && (
                          <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-md">
                            <span className="material-symbols-outlined text-[12px]">home</span> YOUR AREA
                          </div>
                        )}
                        <div className="absolute -bottom-10 left-6 w-20 h-20 rounded-2xl bg-white border-4 border-white shadow-lg overflow-hidden">
                           <span className="material-symbols-outlined text-[60px] text-slate-300 flex items-center justify-center h-full">account_circle</span>
                        </div>
                      </div>
                      <div className="pt-12 p-6">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-bold text-on-surface">{candidate.name}</h3>
                          <span className="px-2 py-1 bg-secondary-container text-on-secondary-container text-[10px] font-bold rounded-md uppercase">{candidate.party}</span>
                        </div>
                        <p className="text-sm text-primary font-semibold mb-4">{candidate.constituency} {t('constituency_suffix')}</p>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-sm text-on-surface-variant mt-0.5">school</span>
                        <p className="text-xs text-on-surface-variant"><b>Education:</b> {candidate.education}</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-sm text-on-surface-variant mt-0.5">account_balance_wallet</span>
                        <p className="text-xs text-on-surface-variant"><b>Assets:</b> {candidate.assets}</p>
                      </div>
                    </div>

                    <div className="border-t border-outline-variant pt-4">
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase mb-2">Key Promises</p>
                      <div className="flex flex-wrap gap-2">
                        {candidate.promises?.map((promise: string, i: number) => (
                          <span key={i} className="px-2 py-1 bg-surface-container-high text-on-surface text-[10px] rounded-full border border-outline-variant">
                            {promise}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 mt-6">
                      <a 
                        href={`https://affidavit.eci.gov.in/candidate-search?candidate=${candidate.name}`} 
                        target="_blank"
                        className="w-full py-2.5 bg-surface-container-high text-primary font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors border border-outline-variant"
                      >
                        ECI Affidavit <span className="material-symbols-outlined text-sm">open_in_new</span>
                      </a>
                      <a 
                        href={`https://voters.eci.gov.in/search-candidate?candidate=${candidate.name}`} 
                        target="_blank"
                        className="w-full py-2.5 bg-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                      >
                        <span className="material-symbols-outlined text-sm">menu_book</span>
                        View Manifesto
                      </a>
                    </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
