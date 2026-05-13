"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import Sidebar from '@/components/Sidebar';
import Countdown from '@/components/Countdown';
import ECIResources from '@/components/ECIResources';
import ConstituencyLookup from '@/components/ConstituencyLookup';
import VotingReminder from '@/components/VotingReminder';
import ElectionStatusBar from '@/components/ElectionStatusBar';

export default function Dashboard() {
  const { user, userProfile, loading } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [liveData, setLiveData] = useState<any>(null);
  const [homeConstituency, setHomeConstituency] = useState<any>(null);
  const userState = (userProfile as any)?.homeState;

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    fetch('/api/live')
      .then(res => res.json())
      .then(data => setLiveData(data))
      .catch(err => console.error("Failed to fetch live data:", err));
  }, []);

  useEffect(() => {
    const fetchHomeDetails = async () => {
      if (userProfile?.constituencyCode) {
        const { doc, getDoc } = await import('firebase/firestore');
        const { db } = await import('@/lib/firebase');
        const docRef = doc(db, 'constituencies', userProfile.constituencyCode);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setHomeConstituency(docSnap.data());
        }
      }
    };
    fetchHomeDetails();
  }, [userProfile?.constituencyCode]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-on-surface-variant font-medium">Verifying Credentials...</p>
        </div>
      </div>
    );
  }

  const hasHome = userProfile?.constituency && userProfile.constituency !== 'Not Set';

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="bg-white text-[#0F172A] border-b border-slate-200 flex justify-end items-center w-full px-6 py-3 sticky top-0 z-40 bg-white/90 backdrop-blur-md md:hidden h-14">
          <div className="flex items-center gap-4">
            <button className="text-slate-600">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-surface-container overflow-hidden border border-outline-variant">
               {user.photoURL ? (
                 <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
               ) : (
                 <span className="material-symbols-outlined flex items-center justify-center h-full">account_circle</span>
               )}
            </div>
          </div>
        </header>

        <ElectionStatusBar userState={userState} />

        <div className="flex-1 flex flex-col lg:flex-row p-6 gap-6 max-w-[1200px] mx-auto w-full">
          {/* Center Canvas */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Welcome Section */}
            <div className="mb-2 flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-[28px] font-bold text-on-surface">
                  {t('welcome_back')}, {userProfile?.displayName?.split(' ')[0] || user.displayName?.split(' ')[0] || 'Voter'}
                </h1>
                <div className="flex flex-wrap gap-3 mt-1">
                  {userProfile?.age && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-400 px-2 py-1 rounded-md">
                      <span className="material-symbols-outlined text-[14px]">cake</span>
                      {userProfile.age} Yrs
                    </span>
                  )}
                  {userProfile?.voterId && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">
                      <span className="material-symbols-outlined text-[14px]">verified</span>
                      ID: {userProfile.voterId}
                    </span>
                  )}
                </div>
              </div>
              {hasHome && (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 border border-primary/20 rounded-full">
                    <span className="material-symbols-outlined text-primary text-sm">home</span>
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{userProfile.constituency}</span>
                  </div>
                  {(userProfile as any).homeState && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-secondary/5 border border-secondary/20 rounded-full">
                      <span className="material-symbols-outlined text-secondary text-sm">map</span>
                      <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">{(userProfile as any).homeState}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Hero Countdown */}
            <section className="bg-primary-container text-on-primary-container rounded-lg p-12 relative overflow-hidden flex flex-col items-center text-center">
              <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center"></div>
              <div className="relative z-10">
                <h1 className="text-[12px] font-semibold uppercase tracking-widest mb-3 text-primary-fixed">
                  {hasHome ? `${userProfile.constituency} - Voting Day` : 'General Elections 2026'}
                </h1>
                <Countdown targetDate={homeConstituency?.votingDate} />
                <p className="text-[18px] text-inverse-primary max-w-2xl mx-auto mt-6">
                  {hasHome 
                    ? `Your constituency goes to polls on ${new Date(homeConstituency?.votingDate || "2026-05-07").toLocaleDateString(undefined, { dateStyle: 'long' })}.`
                    : t('verified_eci_subtitle')}
                </p>
                {(userProfile as any).homeState === 'West Bengal' && (
                  <div className="mt-6 flex items-center justify-center gap-4">
                    <span className="px-3 py-1 bg-white/20 rounded text-[10px] font-bold uppercase backdrop-blur-sm ring-1 ring-white/30">Bengal 2026 LIVE</span>
                    <span className="px-3 py-1 bg-green-500 rounded text-[10px] font-bold uppercase animate-pulse">ACTIVE PHASE</span>
                  </div>
                )}
              </div>
            </section>

            {/* Live Stats Row */}
            {liveData && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-bold text-on-surface uppercase tracking-wider">{t('live_trend_analysis')}</span>
                  </div>
                  <a href={liveData.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1">
                    SOURCE: {liveData.source} <span className="material-symbols-outlined text-[10px]">open_in_new</span>
                  </a>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant">
                    <p className="text-[12px] font-semibold text-on-surface-variant uppercase mb-1">{t('national_turnout')}</p>
                    <p className="text-[24px] font-bold text-primary">{liveData.nationalTurnout}</p>
                  </div>
                  <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant">
                    <p className="text-[12px] font-semibold text-on-surface-variant uppercase mb-1">{t('total_votes_polled')}</p>
                    <p className="text-[24px] font-bold text-secondary">{liveData.totalVotesPolled}</p>
                  </div>
                  <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant">
                    <p className="text-[12px] font-semibold text-on-surface-variant uppercase mb-1">{t('status')}</p>
                    <p className="text-[18px] font-bold text-on-surface">{liveData.status}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Grid */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <a className="group bg-surface-container-lowest border border-outline-variant rounded-lg p-6 flex flex-col items-start hover:-translate-y-1 hover:shadow-lg transition-all duration-300" href="/candidates">
                <div className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">person_search</span>
                </div>
                <h3 className="text-[24px] font-semibold text-on-surface mb-1">{t('candidates')}</h3>
                <p className="text-[16px] text-on-surface-variant flex-1 mb-4">{t('know_candidates_desc')}</p>
                <span className="text-[16px] font-semibold text-primary flex items-center gap-2 group-hover:gap-3 transition-all">
                  {t('browse_list')} <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </span>
              </a>
              {/* Card 2 */}
              <a 
                className="group bg-surface-container-lowest border border-outline-variant rounded-lg p-6 flex flex-col items-start hover:-translate-y-1 hover:shadow-lg transition-all duration-300" 
                href="https://electoralsearch.eci.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="w-12 h-12 rounded-full bg-error-container text-on-error-container flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">badge</span>
                </div>
                <h3 className="text-[24px] font-semibold text-on-surface mb-1">{t('res_voter_search_title')}</h3>
                <p className="text-[16px] text-on-surface-variant flex-1 mb-4">{t('voter_search_desc')}</p>
                <span className="text-[16px] font-semibold text-error flex items-center gap-2 group-hover:gap-3 transition-all">
                  {t('search_name')} <span className="material-symbols-outlined text-sm">open_in_new</span>
                </span>
              </a>
              {/* Card 3 */}
              <a 
                className="group bg-surface-container-lowest border border-outline-variant rounded-lg p-6 flex flex-col items-start hover:-translate-y-1 hover:shadow-lg transition-all duration-300" 
                href="https://voters.eci.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="w-12 h-12 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">how_to_reg</span>
                </div>
                <h3 className="text-[24px] font-semibold text-on-surface mb-1">{t('voter_services')}</h3>
                <p className="text-[16px] text-on-surface-variant flex-1 mb-4">{t('voter_services_desc')}</p>
                <span className="text-[16px] font-semibold text-tertiary flex items-center gap-2 group-hover:gap-3 transition-all">
                  {t('open_portal')} <span className="material-symbols-outlined text-sm">open_in_new</span>
                </span>
              </a>
            </section>

            {/* Constituency Lookup */}
            <ConstituencyLookup />

            {/* Official ECI Resources */}
            <ECIResources />
          </div>

          {/* Side Panel: Live News & Phase Timeline */}
          <aside className="w-full lg:w-80 flex flex-col gap-6">
            {/* Live Updates Card */}
            <div className="bg-surface-container-low rounded-lg border border-outline-variant flex flex-col h-[400px]">
              <div className="p-4 border-b border-outline-variant flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-error animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>campaign</span>
                  <h2 className="text-[18px] font-bold text-on-surface">{t('live_results')}</h2>
                </div>
                <span className="text-[10px] font-bold bg-error/10 text-error px-2 py-1 rounded">2026 LIVE TRENDS</span>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {liveData?.topParties.map((party: any, i: number) => (
                  <div key={i} className="p-3 bg-white rounded-xl border border-outline-variant shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-sm text-on-surface">{party.name}</span>
                      <span className="text-primary font-bold text-sm">{party.seats}</span>
                    </div>
                    <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                      <div className="bg-primary h-full transition-all duration-1000" style={{ width: `${(party.seats / 543) * 100}%` }}></div>
                    </div>
                    <p className="text-[10px] text-on-surface-variant mt-2 font-bold uppercase tracking-widest">{party.status}</p>
                  </div>
                ))}
              </div>
              <div className="p-3 bg-surface-container px-4 border-t border-outline-variant">
                <p className="text-[9px] text-on-surface-variant font-medium italic">{t('eci_disclaimer').split('.')[0]}.</p>
              </div>
            </div>

            {/* Voting Day Reminder */}
            <VotingReminder />

            {/* Phase Timeline Card */}
            <div className="bg-surface-container-low rounded-lg border border-outline-variant p-4">
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-primary">event_note</span>
                <h2 className="text-[18px] font-bold text-on-surface">{t('election_timeline')}</h2>
              </div>
              <div className="relative pl-4 border-l-2 border-outline-variant space-y-6">
                {liveData?.upcomingPhases.map((phase: any, i: number) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[25px] top-1 w-4 h-4 rounded-full bg-primary border-4 border-surface-container-low shadow-sm"></div>
                    <div>
                      <p className="text-xs font-bold text-primary mb-1">{phase.phase} • {phase.date}</p>
                      <p className="text-[13px] text-on-surface-variant leading-relaxed">{phase.states.join(', ')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Action Card */}
            <div className="bg-primary text-on-primary rounded-xl p-4 shadow-lg hover:shadow-primary/20 transition-shadow">
               <h4 className="font-bold mb-1">{t('need_help')}</h4>
               <p className="text-xs opacity-90 mb-3">{t('ai_help_desc')}</p>
               <button 
                 onClick={() => {
                   const fab = document.querySelector('button[title="' + t('chat_title') + '"]') as HTMLButtonElement;
                   if (fab) fab.click();
                 }}
                 className="w-full py-2 bg-white text-primary rounded-lg text-xs font-bold hover:bg-opacity-90 transition-colors"
               >
                 {t('start_chat')}
               </button>
            </div>
          </aside>
        </div>


      </main>
    </div>
  );
}
