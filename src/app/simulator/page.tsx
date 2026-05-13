'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { useLanguage } from '@/context/LanguageContext';

export default function SimulatorPage() {
  const { t } = useLanguage();
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [slipVisible, setSlipVisible] = useState(false);

  const candidates = [
    { id: 1, name: "Candidate A", symbol: "☀", color: "bg-orange-500" },
    { id: 2, name: "Candidate B", symbol: "✋", color: "bg-blue-500" },
    { id: 3, name: "Candidate C", symbol: "🚲", color: "bg-green-500" },
    { id: 4, name: "Candidate D", symbol: "🐘", color: "bg-slate-500" },
  ];

  const handleVote = (candidate: any) => {
    setSelectedCandidate(candidate.name);
    setIsVoting(true);
    
    // Simulate EVM beep and VVPAT processing
    setTimeout(() => {
      setIsVoting(false);
      setSlipVisible(true);
      
      // Auto hide slip after 7 seconds (ECI standard)
      setTimeout(() => {
        setSlipVisible(false);
        setSelectedCandidate(null);
      }, 7000);
    }, 1500);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-12 text-center">
            <h1 className="text-[40px] font-bold text-on-surface mb-2">{t('simulator_title')}</h1>
            <p className="text-on-surface-variant text-lg">{t('simulator_desc')}</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* EVM Control Unit */}
            <div className="bg-[#1E293B] rounded-[40px] p-8 shadow-2xl border-4 border-[#334155]">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-4 h-4 rounded-full bg-red-500 shadow-[0_0_10px_red]"></div>
                  <span className="text-white font-bold text-xs tracking-widest uppercase">{t('evm_unit')}</span>
                </div>
                <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-[10px] font-bold border border-green-500/30">READY</div>
              </div>

              <div className="space-y-4">
                {candidates.map((c) => (
                  <div key={c.id} className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-2xl border border-slate-700">
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-3xl shadow-inner">
                      {c.symbol}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-bold">{c.name}</p>
                      <p className="text-slate-400 text-[10px] font-bold uppercase">Political Party</p>
                    </div>
                    <button 
                      onClick={() => handleVote(c)}
                      disabled={isVoting || slipVisible}
                      className={`
                        w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all
                        ${isVoting || slipVisible ? 'bg-slate-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 active:scale-95 shadow-blue-500/20'}
                      `}
                    >
                      <div className="w-6 h-6 rounded-full bg-white opacity-20"></div>
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-center">
                <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                  {isVoting && <div className="h-full bg-blue-500 animate-progress w-full"></div>}
                </div>
              </div>
            </div>

            {/* VVPAT Unit */}
            <div className="flex flex-col gap-6">
              <div className="bg-[#CBD5E1] rounded-[32px] p-8 shadow-xl border-4 border-slate-400 h-[500px] relative overflow-hidden">
                <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                  <span className="text-slate-700 font-bold text-[10px] uppercase tracking-widest">{t('vvpat_verifier')}</span>
                </div>

                {/* Slip Window */}
                <div className="mt-12 bg-white rounded-xl h-[300px] shadow-inner flex flex-col items-center justify-center relative overflow-hidden border-8 border-slate-500/20">
                  {slipVisible ? (
                    <div className="bg-white p-6 shadow-md border border-slate-200 w-48 animate-in slide-in-from-top duration-1000">
                      <div className="text-center mb-4 border-b border-dashed border-slate-300 pb-2">
                        <p className="text-[10px] font-bold text-slate-400">VOTER SLIP</p>
                        <p className="text-[8px] text-slate-400">2026 GENERAL ELECTIONS</p>
                      </div>
                      <div className="flex flex-col items-center gap-4">
                        <div className="text-5xl">{candidates.find(c => c.name === selectedCandidate)?.symbol}</div>
                        <div className="text-center">
                          <p className="text-xs font-bold text-slate-800 uppercase">{selectedCandidate}</p>
                          <p className="text-[10px] text-slate-500">Candidate Selected</p>
                        </div>
                      </div>
                      <div className="mt-6 flex justify-center opacity-20">
                        <span className="material-symbols-outlined text-4xl">qr_code_2</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-8">
                       <span className="material-symbols-outlined text-slate-300 text-6xl mb-4">description</span>
                       <p className="text-slate-400 text-sm italic">The slip will appear here for 7 seconds after you vote.</p>
                    </div>
                  )}
                  
                  {/* Glass Effect Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent pointer-events-none"></div>
                </div>

                <div className="mt-8 flex justify-center gap-4">
                  <div className="px-4 py-2 bg-slate-300 rounded-full text-[10px] font-bold text-slate-600">BATTERY: 100%</div>
                  <div className="px-4 py-2 bg-slate-300 rounded-full text-[10px] font-bold text-slate-600">PAPER: READY</div>
                </div>
              </div>

              <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
                <h4 className="font-bold text-primary mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">verified</span>
                  Why VVPAT?
                </h4>
                <p className="text-xs text-on-surface-variant leading-relaxed mb-6">
                  Voter Verifiable Paper Audit Trail (VVPAT) allows voters to verify that their vote was cast as intended. 
                  When a vote is cast on the EVM, a slip is printed containing the candidate's serial number, name, and symbol. 
                  This slip is visible for 7 seconds behind a transparent window before being automatically cut and falling into a sealed box.
                </p>

                {/* YouTube API Integration */}
                <div className="mt-4 border-t border-primary/10 pt-6">
                  <h5 className="text-[12px] font-bold text-on-surface uppercase tracking-wider mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-red-600">play_circle</span>
                    How to Vote: Official Guide
                  </h5>
                  <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg bg-black ring-1 ring-white/10">
                    <iframe 
                      width="100%" 
                      height="100%" 
                      src="https://www.youtube.com/embed/S_8qK2hFq8s" 
                      title="ECI EVM VVPAT Awareness" 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                      allowFullScreen
                    ></iframe>
                  </div>
                  <p className="mt-3 text-[10px] text-slate-500 italic">
                    Source: Official Election Commission of India Educational Channel
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes progress {
          from { width: 0; }
          to { width: 100%; }
        }
        .animate-progress {
          animation: progress 1.5s linear infinite;
        }
      `}</style>
    </div>
  );
}
