"use client";

import Sidebar from '@/components/Sidebar';
import PollingMap from '@/components/PollingMap';
import ElectionStatusBar from '@/components/ElectionStatusBar';
import VoterVerificationSection from '@/components/VoterVerificationSection';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';

export default function Polling() {
  const { userProfile } = useAuth();
  const userState = (userProfile as any)?.homeState;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen w-full relative">
        {/* Mobile Header */}
        <header className="bg-white text-[#0F172A] border-b border-slate-200 flex justify-end items-center w-full px-6 py-3 sticky top-0 z-40 bg-white/90 backdrop-blur-md md:hidden h-14">
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined">notifications</span>
            <span className="material-symbols-outlined">account_circle</span>
          </div>
        </header>
        
        <ElectionStatusBar userState={userState} />

        <div className="flex-1 flex flex-col md:flex-row h-full w-full relative overflow-hidden">
          {/* Left Panel: Search & Results */}
          <section className="w-full md:w-[420px] lg:w-[480px] h-[512px] md:h-full bg-surface border-r border-outline-variant flex flex-col shadow-sm z-10 shrink-0 overflow-hidden">
            {/* Fixed Header Area */}
            <div className="p-6 pb-4 border-b border-outline-variant bg-surface shrink-0">
              <h2 className="text-[30px] font-bold text-on-surface mb-1">Find Your Booth</h2>
              <p className="text-sm text-on-surface-variant mb-6">Enter details to locate your designated polling station.</p>
              
              {/* Search Input */}
              <div className="relative w-full mb-6">
                <label className="block text-[12px] font-semibold uppercase tracking-wider text-on-surface-variant mb-1 ml-1">EPIC NUMBER OR ADDRESS</label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-outline">search</span>
                  <input 
                    className="w-full bg-surface-container text-on-surface text-sm pl-10 pr-12 py-3 rounded-t outline-none border-b-2 border-outline focus:border-primary transition-colors" 
                    placeholder="e.g., ABC1234567 or Sector 14" 
                    type="text"
                  />
                  <button className="absolute right-1 bg-primary text-on-primary rounded p-1.5 hover:bg-black transition-colors flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                  </button>
                </div>
              </div>

              {/* Quick Filters */}
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 custom-scrollbar">
                <button className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-outline-variant bg-surface-container-low text-[10px] font-bold uppercase tracking-wider hover:bg-surface-container transition-colors">
                  <span className="material-symbols-outlined text-[16px]">accessible</span>
                  WHEELCHAIR
                </button>
                <button className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-outline-variant bg-surface-container-low text-[10px] font-bold uppercase tracking-wider hover:bg-surface-container transition-colors">
                  <span className="material-symbols-outlined text-[16px]">timer</span>
                  SHORT WAIT
                </button>
                <button className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-outline-variant bg-surface-container-low text-[10px] font-bold uppercase tracking-wider hover:bg-surface-container transition-colors">
                  <span className="material-symbols-outlined text-[16px]">local_parking</span>
                  PARKING
                </button>
              </div>
            </div>

            {/* Scrollable Results List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-surface-bright">
              {/* Result Card: Active */}
              <article className="bg-surface rounded-xl border border-outline-variant p-5 cursor-pointer hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                <div className="flex justify-between items-start mb-2 pl-2">
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container text-[10px] font-bold tracking-wider mb-2 uppercase">RECOMMENDED MATCH</span>
                    <h3 className="text-[18px] font-bold text-on-surface leading-tight">Government Primary School</h3>
                    <p className="text-[14px] text-on-surface-variant mt-1">Sector 14, Near Rose Garden</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[24px] font-bold text-primary">0.8</span>
                    <span className="text-[10px] font-bold text-outline">KM AWAY</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-5 pt-4 border-t border-outline-variant pl-2">
                  <div>
                    <p className="text-[10px] font-bold text-outline mb-1 uppercase tracking-wider">CURRENT WAIT</p>
                    <div className="flex items-center gap-1 text-on-surface">
                      <span className="material-symbols-outlined text-[18px] text-secondary">schedule</span>
                      <span className="text-sm font-bold">12 mins</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-outline mb-1 uppercase tracking-wider">FACILITIES</p>
                    <div className="flex gap-2 text-on-surface-variant">
                      <span className="material-symbols-outlined text-[18px]">accessible</span>
                      <span className="material-symbols-outlined text-[18px]">water_drop</span>
                      <span className="material-symbols-outlined text-[18px]">wc</span>
                    </div>
                  </div>
                </div>
                <button className="w-full mt-5 bg-error text-on-error font-bold py-3 rounded flex items-center justify-center gap-2 hover:opacity-90 transition-colors">
                  <span className="material-symbols-outlined">directions</span>
                  Get Directions
                </button>
              </article>

              {/* Result Card: Inactive */}
              <article className="bg-surface rounded-xl border border-outline-variant p-5 cursor-pointer hover:border-primary hover:shadow-sm transition-all">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-[18px] font-bold text-on-surface leading-tight">Community Center Hall B</h3>
                    <p className="text-[14px] text-on-surface-variant mt-1">Block C, Residential Complex</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[24px] font-bold text-on-surface-variant opacity-80">2.1</span>
                    <span className="text-[10px] font-bold text-outline">KM AWAY</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-5 pt-4 border-t border-outline-variant">
                  <div>
                    <p className="text-[10px] font-bold text-outline mb-1 uppercase tracking-wider">CURRENT WAIT</p>
                    <div className="flex items-center gap-1 text-on-surface">
                      <span className="material-symbols-outlined text-[18px] text-error">warning</span>
                      <span className="text-sm font-bold">45 mins</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-outline mb-1 uppercase tracking-wider">FACILITIES</p>
                    <div className="flex gap-2 text-on-surface-variant opacity-70">
                      <span className="material-symbols-outlined text-[18px]">accessible</span>
                      <span className="material-symbols-outlined text-[18px]">local_parking</span>
                    </div>
                  </div>
                </div>
              </article>
            </div>

            <div className="p-6 pt-0">
              <VoterVerificationSection />
            </div>
          </section>

          {/* Right Panel: Interactive Map */}
          <section className="flex-1 relative bg-slate-200 dark:bg-slate-900 overflow-hidden flex flex-col">
            <div className="flex-1 relative min-h-[400px]">
              <PollingMap userState={userState} />
            </div>
            
            <div className="absolute top-4 left-4 z-10 bg-white/80 dark:bg-slate-800/80 backdrop-blur px-3 py-1.5 rounded-lg border border-outline-variant shadow-sm md:hidden">
              <p className="text-[10px] font-bold text-primary">LIVE MAP ACCESS</p>
            </div>

            {/* Legend */}
            <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md border border-outline-variant rounded-lg p-4 shadow-lg z-10 hidden md:block">
              <h4 className="text-[10px] font-bold text-outline mb-3 uppercase tracking-wider">MAP LEGEND</h4>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="text-[12px] font-medium text-on-surface">Polling Booth</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-white border border-outline-variant"></div>
                  <span className="text-[12px] font-medium text-on-surface">Alternative</span>
                </div>
              </div>
            </div>
          </section>

          {/* Mobile Bottom Nav */}
          <nav className="bg-white/95 backdrop-blur-md border-t border-outline-variant fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 md:hidden">
            <button className="flex flex-col items-center text-slate-500">
              <span className="material-symbols-outlined mb-1">bar_chart</span>
              <span className="text-[10px]">Results</span>
            </button>
            <button className="flex flex-col items-center text-primary font-bold">
              <span className="material-symbols-outlined mb-1">near_me</span>
              <span className="text-[10px]">Locator</span>
            </button>
            <button className="flex flex-col items-center text-slate-500">
              <span className="material-symbols-outlined mb-1">import_contacts</span>
              <span className="text-[10px]">Guide</span>
            </button>
          </nav>
        </div>
      </main>
    </div>
  );
}
