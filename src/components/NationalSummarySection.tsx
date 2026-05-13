"use client";

import React, { useState, useEffect } from 'react';
import { ElectionSyncService, NationalData } from '@/services/ElectionSyncService';

export default function NationalSummarySection() {
  const [data, setData] = useState<NationalData | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const syncData = async () => {
    setIsSyncing(true);
    const summary = await ElectionSyncService.fetchNationalSummary();
    setTimeout(() => {
      setData(summary);
      setIsSyncing(false);
    }, 1500);
  };

  useEffect(() => {
    syncData();
    // Re-sync every 30 seconds for live feel
    const interval = setInterval(syncData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!data) return null;

  return (
    <section className="mt-12">
      <div className="flex items-center justify-between mb-8 border-b border-outline-variant pb-2">
        <h2 className="text-[20px] font-bold text-on-surface uppercase tracking-widest flex items-center gap-2">
          National Summary
          {isSyncing && <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>}
        </h2>
        <span className="text-[10px] font-black text-outline uppercase tracking-widest">
          {isSyncing ? 'Refreshing...' : `Source: ${data.status}`}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Total Seats Card */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-8 flex flex-col justify-between row-span-2 shadow-sm">
          <div>
            <p className="text-[12px] font-bold text-outline uppercase tracking-widest mb-2">Total Seats</p>
            <h3 className="text-[64px] font-black text-on-surface leading-none">{data.totalSeats}</h3>
          </div>
          <div className="mt-8 pt-8 border-t border-outline-variant">
            <p className="text-on-surface-variant text-sm font-medium">Majority Mark: <span className="font-black text-on-surface">272</span></p>
            <div className="mt-2 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-primary" style={{ width: '50%' }}></div>
            </div>
          </div>
        </div>

        {/* NDA Card */}
        <div className="bg-[#FF9933]/5 border border-[#FF9933]/20 rounded-3xl p-8 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[12px] font-bold text-[#FF9933] uppercase tracking-widest mb-1">NDA Alliance</p>
              <h3 className="text-[40px] font-black text-on-surface leading-none">{data.nda}</h3>
            </div>
            <span className="material-symbols-outlined text-[#FF9933]">trending_up</span>
          </div>
          <p className="mt-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">Status: Majority Declared</p>
        </div>

        {/* INDIA Card */}
        <div className="bg-[#1976D2]/5 border border-[#1976D2]/20 rounded-3xl p-8 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[12px] font-bold text-[#1976D2] uppercase tracking-widest mb-1">INDIA Alliance</p>
              <h3 className="text-[40px] font-black text-on-surface leading-none">{data.india}</h3>
            </div>
            <span className="material-symbols-outlined text-[#1976D2]">group</span>
          </div>
          <p className="mt-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">Status: Leading in 24 Seats</p>
        </div>

        {/* Others Card */}
        <div className="bg-surface-container-high border border-outline-variant rounded-3xl p-8 shadow-sm md:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[12px] font-bold text-outline uppercase tracking-widest mb-1">Others / Independent</p>
              <h3 className="text-[28px] font-black text-on-surface">{data.others}</h3>
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="w-10 h-10 rounded-full bg-white border border-outline-variant flex items-center justify-center text-[10px] font-bold">PTY</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
