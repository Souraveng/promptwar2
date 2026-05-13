"use client";

import React, { useState } from 'react';

export default function VoterVerificationSection() {
  const [isOpen, setIsOpen] = useState(false);

  const openECI = () => {
    // Opening in a specific window size to feel like an app integration
    const width = 1000;
    const height = 800;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    
    window.open(
      'https://electoralsearch.eci.gov.in/',
      'ECIVerification',
      `width=${width},height=${height},top=${top},left=${left},status=no,menubar=no,toolbar=no`
    );
    setIsOpen(false);
  };

  return (
    <div className="mt-8 bg-surface-container-lowest border border-outline-variant rounded-3xl p-8 shadow-sm">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-[40px] text-primary">verified_user</span>
        </div>
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-[22px] font-bold text-on-surface mb-2">National Voter Registry Verification</h3>
          <p className="text-on-surface-variant text-sm max-w-xl">
            Access the official Election Commission of India database to verify your voter status, 
            download your digital EPIC card, and confirm your polling station in real-time.
          </p>
        </div>
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-primary text-white px-8 py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-lg hover:scale-105 active:scale-95"
        >
          Verify My Status
        </button>
      </div>

      {/* Verification Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsOpen(false)}></div>
          <div className="bg-white rounded-[40px] w-full max-w-2xl overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-300">
            <div className="p-10 text-center">
              <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
                 <img 
                   src="https://upload.wikimedia.org/wikipedia/en/thumb/8/84/Election_Commission_of_India_Logo.svg/1200px-Election_Commission_of_India_Logo.svg.png" 
                   alt="ECI Logo" 
                   className="w-16 h-16 object-contain"
                 />
              </div>
              <h2 className="text-[32px] font-black text-on-surface mb-4">Connecting to ECI Servers</h2>
              <p className="text-on-surface-variant mb-8 leading-relaxed">
                You are being redirected to the **Official Electoral Search Portal** of India. 
                This ensures you are accessing **real-time, encrypted government data** for 
                maximum security and privacy.
              </p>
              
              <div className="space-y-4">
                <button 
                  onClick={openECI}
                  className="w-full bg-primary text-white py-5 rounded-2xl font-black text-[14px] tracking-widest uppercase hover:bg-black transition-all shadow-xl"
                >
                  Confirm & Open Secure Portal
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-full py-4 text-[12px] font-bold text-outline uppercase tracking-widest hover:text-on-surface transition-colors"
                >
                  Go Back
                </button>
              </div>

              <div className="mt-10 pt-8 border-t border-slate-100 flex items-center justify-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-500 text-sm">lock</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">SSL Encrypted</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-500 text-sm">verified</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Official Source</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
