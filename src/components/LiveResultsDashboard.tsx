"use client";

import React, { useState, useEffect } from 'react';
import { allStatesData } from '@/data/electionData';
import { ElectionSyncService, GovernanceUpdate } from '@/services/ElectionSyncService';

export default function LiveResultsDashboard() {
  const [search, setSearch] = useState("");
  const [selectedState, setSelectedState] = useState<any>(null);
  const [isCounting, setIsCounting] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [electionType, setElectionType] = useState<'PM' | 'CM'>('PM');
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(new Date().toLocaleTimeString());

  const handleSync = async () => {
    setIsSyncing(true);
    // Simulate engine fetching from external source
    const updates = await ElectionSyncService.fetchLatestGovernance();
    
    // In a real app, this would update a global context or Firestore.
    // For now, we simulate the 'Refresh' of the dashboard data.
    setTimeout(() => {
      setLastSync(new Date().toLocaleTimeString());
      setIsSyncing(false);
    }, 2000);
  };

  const handleSearch = (e: any) => {
    const val = e.target.value;
    setSearch(val);
    
    if (val.length > 0) {
      const filtered = allStatesData.filter(s => 
        s.name.toLowerCase().includes(val.toLowerCase()) ||
        s.constituencies.some(c => c.toLowerCase().includes(val.toLowerCase()))
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  const selectState = (state: any) => {
    setSelectedState(state);
    setSearch(state.name);
    setSuggestions([]);
    // Demo: Show Counting Countdown for 2026 active states
    setIsCounting(["West Bengal", "Tamil Nadu", "Kerala"].includes(state.name)); 
  };

  return (
    <div className="space-y-8">
      {/* Sync Engine Status */}
      <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${isSyncing ? 'bg-primary animate-ping' : 'bg-green-500'}`}></div>
          <div>
            <p className="text-[10px] font-bold text-outline uppercase tracking-widest">Governance Sync Engine</p>
            <p className="text-[12px] font-bold text-on-surface">Last Daily Sync: {lastSync}</p>
          </div>
        </div>
        <button 
          onClick={handleSync}
          disabled={isSyncing}
          className="flex items-center gap-2 bg-surface hover:bg-slate-50 border border-outline-variant px-4 py-2 rounded-xl transition-all disabled:opacity-50"
        >
          <span className={`material-symbols-outlined text-[18px] ${isSyncing ? 'animate-spin' : ''}`}>sync</span>
          <span className="text-[11px] font-black uppercase tracking-tighter">{isSyncing ? 'Fetching...' : 'Sync Now'}</span>
        </button>
      </div>

      {/* Counting Countdown Banner */}
      <div className="bg-error text-on-error p-4 rounded-3xl flex items-center justify-between shadow-lg animate-pulse">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[32px]">event_repeat</span>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Counting Countdown</p>
            <p className="text-[18px] font-black">Official Results: May 4, 2026 • 08:00 AM</p>
          </div>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-[24px] font-mono font-black">02d : 21h : 18m</p>
        </div>
      </div>

      {/* Election Type Toggle */}
      <div className="flex justify-center mb-6">
        <div className="bg-surface-container-high p-1.5 rounded-2xl flex gap-2 shadow-inner border border-outline-variant">
          <button 
            onClick={() => { setElectionType('PM'); setSelectedState(null); }}
            className={`px-8 py-3 rounded-xl text-[12px] font-black tracking-widest transition-all ${
              electionType === 'PM' ? 'bg-primary text-white shadow-lg scale-105' : 'text-on-surface-variant hover:bg-surface'
            }`}
          >
            LOK SABHA (PM)
          </button>
          <button 
            onClick={() => { setElectionType('CM'); setSelectedState(null); }}
            className={`px-8 py-3 rounded-xl text-[12px] font-black tracking-widest transition-all ${
              electionType === 'CM' ? 'bg-[#FF9933] text-white shadow-lg scale-105' : 'text-on-surface-variant hover:bg-surface'
            }`}
          >
            VIDHAN SABHA (CM)
          </button>
        </div>
      </div>

      {/* Search Header */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-8 shadow-sm">
        <h3 className="text-[20px] font-bold text-on-surface mb-4">
          {electionType === 'PM' ? 'Parliamentary (PM) Tracker' : 'State Assembly (CM) Tracker'}
        </h3>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
          <input 
            value={search}
            onChange={handleSearch}
            className="w-full pl-12 pr-6 py-4 bg-surface border border-outline-variant rounded-xl text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all" 
            placeholder={electionType === 'PM' ? "Search Lok Sabha Constituency..." : "Search State for Assembly Results..."}
            type="text"
          />
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-outline-variant rounded-xl shadow-xl z-50 overflow-hidden">
              {suggestions.map((s, i) => (
                <button 
                  key={i}
                  onClick={() => selectState(s)}
                  className="w-full px-6 py-4 text-left hover:bg-slate-50 flex items-center justify-between border-b last:border-0 border-outline-variant transition-colors"
                >
                  <div>
                    <p className="font-bold text-on-surface">{s.name}</p>
                    <p className="text-[10px] text-on-surface-variant uppercase">
                      {electionType === 'PM' ? `${s.totalSeats} LS Seats` : `${s.assemblySeats} VS Seats`}
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-outline">chevron_right</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedState ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {electionType === 'PM' ? (
            /* Parliamentary (PM) Detailed Profile */
            <div className="bg-primary/5 border-2 border-primary rounded-3xl p-8 shadow-xl">
              <div className="flex justify-between items-center mb-8 pb-8 border-b border-primary/10">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="material-symbols-outlined text-primary text-[16px]">public</span>
                    <span className="text-primary font-black text-[10px] tracking-widest uppercase">Parliamentary Profile</span>
                  </div>
                  <h2 className="text-[32px] font-black text-on-surface">{selectedState.name} (Lok Sabha)</h2>
                </div>
                <div className="text-right">
                  <p className="text-[12px] font-bold text-outline uppercase">Total LS Seats</p>
                  <p className="text-[32px] font-black text-primary">{selectedState.totalSeats}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-[14px] font-black text-on-surface uppercase tracking-widest mb-4">Alliance Breakdown</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-primary/5">
                      <span className="font-bold text-[#FF9933]">NDA</span>
                      <span className="font-black">{Math.floor(selectedState.totalSeats * 0.6)}</span>
                    </div>
                    <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-primary/5">
                      <span className="font-bold text-[#1976D2]">INDIA</span>
                      <span className="font-black">{Math.floor(selectedState.totalSeats * 0.35)}</span>
                    </div>
                    <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-primary/5">
                      <span className="font-bold text-outline">OTHERS</span>
                      <span className="font-black">{selectedState.totalSeats - Math.floor(selectedState.totalSeats * 0.95)}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-[14px] font-black text-on-surface uppercase tracking-widest mb-4">High-Profile Contests</h4>
                  <div className="bg-white p-6 rounded-2xl border border-primary/10 h-full">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-[10px] font-black text-outline uppercase tracking-widest">Constituency</p>
                        <p className="font-bold">{selectedState.constituencies[0] || 'State Capital'}</p>
                      </div>
                      <span className="px-2 py-1 bg-green-500/10 text-green-600 text-[10px] font-black rounded uppercase">Leading</span>
                    </div>
                    <p className="text-[12px] text-on-surface-variant italic mb-4">"Direct fight between national heavyweights observed in this seat."</p>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                       <div className="h-full bg-primary" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Vidhan Sabha (CM) Detailed Party Tally */
            <div className="bg-[#FF9933]/5 border-2 border-[#FF9933] rounded-3xl p-8 shadow-xl">
              <div className="flex justify-between items-center mb-8 pb-8 border-b border-[#FF9933]/10">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="material-symbols-outlined text-[#FF9933] text-[16px]">account_balance</span>
                    <span className="text-[#FF9933] font-black text-[10px] tracking-widest uppercase">Assembly Party Tally</span>
                  </div>
                  <h2 className="text-[32px] font-black text-on-surface">{selectedState.name} (Vidhan Sabha)</h2>
                </div>
                <div className="text-right">
                  <p className="text-[12px] font-bold text-outline uppercase">Majority Mark</p>
                  <p className="text-[32px] font-black text-[#FF9933]">{Math.floor(selectedState.assemblySeats / 2) + 1}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#FF9933]/10 text-center">
                  <p className="text-[10px] font-black text-outline uppercase mb-2">Ruling Party</p>
                  <p className="text-[24px] font-black text-on-surface">{selectedState.govt}</p>
                  <p className="text-[12px] font-bold text-[#FF9933] mt-2 uppercase tracking-widest">CM: {selectedState.cm}</p>
                </div>
                <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-[#FF9933]/10">
                  <h4 className="text-[12px] font-black text-on-surface uppercase tracking-widest mb-6">Detailed Party-wise Seats</h4>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[14px] font-bold">Party A (Lead)</span>
                        <span className="font-black text-[18px]">156</span>
                      </div>
                      <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#FF9933]" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[14px] font-bold">Party B (Opp.)</span>
                        <span className="font-black text-[18px]">48</span>
                      </div>
                      <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-slate-400" style={{ width: '25%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed border-outline-variant rounded-3xl opacity-50">
           <span className="material-symbols-outlined text-6xl mb-4">analytics</span>
           <p className="text-on-surface-variant font-bold">Search for a state to see live trends or governance status.</p>
        </div>
      )}
    </div>
  );
}
