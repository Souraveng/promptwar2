"use client";

import React from 'react';

export const electionSchedule = [
  { phase: 1, date: "2026-04-19", states: ["Tamil Nadu", "Rajasthan", "Uttar Pradesh", "Madhya Pradesh", "Uttarakhand", "Assam"] },
  { phase: 2, date: "2026-04-26", states: ["Kerala", "Karnataka", "Rajasthan", "Maharashtra", "Uttar Pradesh", "Bihar"] },
  { phase: 3, date: "2026-05-07", states: ["Gujarat", "Karnataka", "Maharashtra", "Uttar Pradesh", "Bihar", "West Bengal", "Goa"] },
  { phase: 4, date: "2026-05-13", states: ["Andhra Pradesh", "Telangana", "Odisha", "Uttar Pradesh", "Bihar", "Jharkhand"] },
  { phase: 5, date: "2026-05-20", states: ["Maharashtra", "Uttar Pradesh", "Bihar", "Jharkhand", "West Bengal", "Ladakh"] },
  { phase: 6, date: "2026-05-25", states: ["Delhi", "Haryana", "Uttar Pradesh", "Bihar", "West Bengal", "Odisha"] },
  { phase: 7, date: "2026-06-01", states: ["Punjab", "Uttar Pradesh", "Bihar", "West Bengal", "Himachal Pradesh", "Chandigarh"] },
];

const stateNextElections: Record<string, string> = {
  "Tamil Nadu": "2026",
  "West Bengal": "2026",
  "Kerala": "2026",
  "Assam": "2026",
  "Uttar Pradesh": "2027",
  "Gujarat": "2027",
  "Punjab": "2027",
  "Karnataka": "2028",
  "Rajasthan": "2028",
  "Madhya Pradesh": "2028",
  "Telangana": "2028",
};

export default function ElectionStatusBar({ userState }: { userState?: string }) {
  const today = new Date("2026-05-07"); // Treating today as Phase 3 for demo
  
  const activeInState = userState ? electionSchedule.find(p => p.states.includes(userState)) : null;
  const nextYear = userState ? (stateNextElections[userState] || "2029") : "2026";

  return (
    <div className="bg-surface border-b border-outline-variant px-6 py-3 flex items-center gap-6 overflow-x-auto custom-scrollbar">
      <div className="flex flex-col shrink-0 min-w-[140px]">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${activeInState ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}></div>
          <span className="text-[10px] font-bold text-on-surface uppercase tracking-wider">
            {userState ? `${userState} Status` : 'National Status'}
          </span>
        </div>
        {!activeInState && userState && (
          <p className="text-[9px] font-bold text-slate-500 uppercase mt-1">Next Election: {nextYear}</p>
        )}
        {activeInState && (
          <p className="text-[9px] font-bold text-primary uppercase mt-1">Election Active {nextYear}</p>
        )}
      </div>
      
      <div className="h-8 w-px bg-outline-variant shrink-0"></div>

      <div className="flex gap-4 items-center flex-nowrap whitespace-nowrap">
        {electionSchedule.map((p) => {
          const pDate = new Date(p.date);
          const isPast = pDate < today;
          const isToday = pDate.toDateString() === today.toDateString();
          const isUserState = userState && p.states.includes(userState);
          
          return (
            <div 
              key={p.phase} 
              className={`flex flex-col gap-0.5 min-w-[120px] p-2 rounded-lg border transition-all ${
                isToday ? 'bg-primary/5 border-primary shadow-sm ring-1 ring-primary/20' : 
                isPast ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-surface border-outline-variant'
              } ${isUserState ? 'border-primary/50 bg-primary/5' : ''}`}
            >
              <div className="flex justify-between items-center">
                <span className={`text-[8px] font-bold uppercase tracking-tighter ${isToday ? 'text-primary' : 'text-slate-500'}`}>Phase {p.phase}</span>
                {isToday && <span className="text-[7px] font-bold bg-primary text-white px-1.5 py-0.5 rounded-full">VOTING</span>}
                {isPast && <span className="text-[7px] font-bold text-slate-400">DONE</span>}
                {isUserState && !isToday && !isPast && <span className="text-[7px] font-bold text-primary animate-bounce">YOUR PHASE</span>}
              </div>
              <span className="text-[10px] font-bold text-on-surface">{pDate.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</span>
              <span className="text-[8px] text-on-surface-variant truncate w-24">
                {isUserState ? <strong>{userState}</strong> : p.states.join(', ')}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
