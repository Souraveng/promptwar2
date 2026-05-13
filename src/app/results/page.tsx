"use client";

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import LiveResultsDashboard from '@/components/LiveResultsDashboard';
import NationalSummarySection from '@/components/NationalSummarySection';

// Mock data for the table
const initialTableData = [
  { constituency: "Varanasi", state: "Uttar Pradesh", candidate: "Narendra Modi", party: "BJP", margin: "152,513", partyColor: "#FF9933" },
  { constituency: "Wayanad", state: "Kerala", candidate: "Rahul Gandhi", party: "INC", margin: "364,422", partyColor: "#138808" },
  { constituency: "Noida", state: "Uttar Pradesh", candidate: "Mahesh Sharma", party: "BJP", margin: "337,214", partyColor: "#FF9933" },
  { constituency: "Lucknow", state: "Uttar Pradesh", candidate: "Rajnath Singh", party: "BJP", margin: "135,167", partyColor: "#FF9933" },
  { constituency: "Chennai South", state: "Tamil Nadu", candidate: "Thamizhachi Thangapandian", party: "DMK", margin: "225,945", partyColor: "#E71D36" },
  { constituency: "Bangalore South", state: "Karnataka", candidate: "Tejasvi Surya", party: "BJP", margin: "277,083", partyColor: "#FF9933" },
  { constituency: "Kolkata North", state: "West Bengal", candidate: "Sudip Bandyopadhyay", party: "AITC", margin: "92,560", partyColor: "#20C67A" },
];

export default function Results() {
  const [tableSearch, setTableSearch] = useState("");

  const filteredData = initialTableData.filter(item => 
    item.constituency.toLowerCase().includes(tableSearch.toLowerCase()) ||
    item.state.toLowerCase().includes(tableSearch.toLowerCase()) ||
    item.candidate.toLowerCase().includes(tableSearch.toLowerCase()) ||
    item.party.toLowerCase().includes(tableSearch.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <main className="flex-1 lg:ml-72 p-8 pt-24 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <header className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20">Official Data</span>
              <span className="text-[10px] font-bold text-outline uppercase tracking-widest">Election Year 2026</span>
            </div>
            <h1 className="text-[48px] font-black text-on-surface leading-tight mb-2">Election Results</h1>
            <p className="text-[18px] text-on-surface-variant max-w-2xl">Live dashboard tracking the latest counting trends and declared results across all constituencies.</p>
          </header>

          <LiveResultsDashboard />

          <NationalSummarySection />

          {/* Detailed Analysis Section */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-8 shadow-sm">
               <h3 className="text-[24px] font-bold text-on-surface mb-6">National Seat Share</h3>
               <div className="aspect-square max-w-sm mx-auto relative rounded-full border-[16px] border-surface-container-highest flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-[12px] font-bold uppercase text-outline">Total Lok Sabha</span>
                    <div className="text-[48px] font-black">543</div>
                  </div>
               </div>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-8 shadow-sm">
               <h3 className="text-[24px] font-bold text-on-surface mb-6">Key Performance Metrics</h3>
               <div className="space-y-8">
                 <div>
                   <div className="flex justify-between text-sm mb-2">
                     <span className="font-bold">Incumbency Strike Rate</span>
                     <span className="text-primary font-black">62%</span>
                   </div>
                   <div className="h-2 rounded-full bg-surface-container-highest overflow-hidden">
                     <div className="bg-primary h-full" style={{ width: '62%' }}></div>
                   </div>
                 </div>
                 <div>
                   <div className="flex justify-between text-sm mb-2">
                     <span className="font-bold">Voter Turnout (National)</span>
                     <span className="text-[#138808] font-black">66.4%</span>
                   </div>
                   <div className="h-2 rounded-full bg-surface-container-highest overflow-hidden">
                     <div className="bg-[#138808] h-full" style={{ width: '66.4%' }}></div>
                   </div>
                 </div>
                 <div>
                   <div className="flex justify-between text-sm mb-2">
                     <span className="font-bold">Counting Progress</span>
                     <span className="text-error font-black">100%</span>
                   </div>
                   <div className="h-2 rounded-full bg-surface-container-highest overflow-hidden">
                     <div className="bg-error h-full" style={{ width: '100%' }}></div>
                   </div>
                 </div>
               </div>
            </div>
          </section>

          {/* Results Table */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-3xl shadow-sm overflow-hidden mb-12">
            <div className="p-8 border-b border-outline-variant flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="text-[24px] font-bold text-on-surface">Constituency Analysis</h3>
              <div className="relative w-full sm:w-80">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
                <input 
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-surface border border-outline-variant rounded-xl text-on-surface focus:ring-2 focus:ring-primary outline-none" 
                  placeholder="Search constituency, state or candidate..." 
                  type="text"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant">
                    <th className="p-6 text-[12px] font-black uppercase text-outline tracking-widest">Constituency</th>
                    <th className="p-6 text-[12px] font-black uppercase text-outline tracking-widest">State</th>
                    <th className="p-6 text-[12px] font-black uppercase text-outline tracking-widest">Candidate</th>
                    <th className="p-6 text-[12px] font-black uppercase text-outline tracking-widest">Party</th>
                    <th className="p-6 text-[12px] font-black uppercase text-outline tracking-widest text-right">Margin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {filteredData.length > 0 ? filteredData.map((item, index) => (
                    <tr key={index} className="hover:bg-slate-50 transition-colors">
                      <td className="p-6 font-bold">{item.constituency}</td>
                      <td className="p-6 text-on-surface-variant text-sm font-medium">{item.state}</td>
                      <td className="p-6 text-sm font-bold">{item.candidate}</td>
                      <td className="p-6">
                        <span 
                          style={{ backgroundColor: `${item.partyColor}15`, borderColor: `${item.partyColor}30`, color: item.partyColor }}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase"
                        >
                          {item.party}
                        </span>
                      </td>
                      <td className="p-6 text-right text-sm font-black">{item.margin}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-outline font-bold italic">
                        No matches found for "{tableSearch}"
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
