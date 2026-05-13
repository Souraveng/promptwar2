"use client";

import React from 'react';

export const eciNews = [
  {
    "title": "ECI Introduces QR-Based ID System to Strengthen Security at Counting Centres",
    "date": "Thursday, 30th April 2026, 4:17 PM",
    "link": "https://www.eci.gov.in/press-releases/"
  },
  {
    "title": "West Bengal records highest-ever poll-participation since Independence 91.66% poll-participation recorded in Phase-II",
    "date": "Wednesday, 29th April 2026, 8:28 PM",
    "link": "https://www.eci.gov.in/press-releases/"
  },
  {
    "title": "General Elections and bye-elections 2026: Seizures surpass Rs 510 crores in WB",
    "date": "Monday, 27th April 2026, 3:32 PM",
    "link": "https://www.eci.gov.in/press-releases/"
  },
  {
    "title": "IEVP 2026: World watches India’s Festival of Democracy",
    "date": "Sunday, 26th April 2026, 3:17 PM",
    "link": "https://www.eci.gov.in/press-releases/"
  },
  {
    "title": "General Elections and Bye-elections, 2026 Scrutiny of Form 17A completed in Tamil Nadu and West Bengal (Phase-I)",
    "date": "Saturday, 25th April 2026, 11:19 AM",
    "link": "https://www.eci.gov.in/press-releases/"
  }
];

export default function LiveNewsTicker() {
  return (
    <div className="bg-error text-on-error px-4 py-2 flex items-center gap-4 overflow-hidden whitespace-nowrap relative group">
      <div className="flex items-center gap-2 shrink-0 z-10 bg-error pr-4 border-r border-white/20">
        <span className="material-symbols-outlined text-sm animate-pulse">campaign</span>
        <span className="text-[10px] font-black uppercase tracking-widest">Official ECI Bulletin</span>
      </div>
      
      <div className="flex gap-12 animate-scroll-text hover:pause">
        {eciNews.map((news, i) => (
          <a 
            key={i} 
            href={news.link} 
            target="_blank" 
            className="text-[11px] font-medium hover:underline flex items-center gap-3"
          >
            <span className="opacity-70">[{news.date.split(',')[0]}]</span>
            {news.title}
            <span className="text-white/30">•</span>
          </a>
        ))}
        {/* Duplicate for seamless scroll */}
        {eciNews.map((news, i) => (
          <a 
            key={`dup-${i}`} 
            href={news.link} 
            target="_blank" 
            className="text-[11px] font-medium hover:underline flex items-center gap-3"
          >
            <span className="opacity-70">[{news.date.split(',')[0]}]</span>
            {news.title}
            <span className="text-white/30">•</span>
          </a>
        ))}
      </div>

      <style jsx>{`
        @keyframes scroll-text {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll-text {
          animation: scroll-text 40s linear infinite;
        }
        .pause:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
