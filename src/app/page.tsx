"use client";

import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { user, setIsAuthModalOpen, setAuthMode, loading } = useAuth();
  const router = useRouter();

  // Auto-redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleProtectedAction = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (user) {
      router.push('/dashboard');
    } else {
      setAuthMode('signup');
      setIsAuthModalOpen(true);
    }
  };
  return (
    <>
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="max-w-[1200px] mx-auto px-6 py-12 md:py-24 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <h1 className="text-[36px] leading-[1.2] font-bold text-primary">Your Trusted Guide to the Indian Democratic Process</h1>
            <p className="text-[18px] leading-[1.6] text-on-surface-variant max-w-lg">
              Navigate the electoral process with confidence. Bharat Nirvachan provides personalized insights, unbiased candidate information, and essential tools for every voter.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button 
                onClick={handleProtectedAction}
                className="bg-error text-on-error px-6 py-3 rounded shadow-sm font-semibold hover:opacity-90 transition-all"
              >
                Register to Vote
              </button>
              <button 
                onClick={handleProtectedAction}
                className="bg-surface-container text-on-surface px-6 py-3 rounded border border-outline-variant font-semibold hover:bg-surface-container-high transition-all"
              >
                Explore Process
              </button>
            </div>
          </div>
          <div className="relative h-[400px] w-full rounded-xl overflow-hidden bg-surface-variant shadow-sm border border-outline-variant">
            <img 
              alt="Indian Parliament building" 
              className="absolute inset-0 w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            />
          </div>
        </section>

        {/* Features Bento Grid */}
        <section className="bg-surface-container-low py-12 border-y border-outline-variant">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="text-center mb-12 space-y-2">
              <h2 className="text-[24px] leading-[1.3] font-semibold text-primary">Comprehensive Electoral Support</h2>
              <p className="text-[16px] leading-[1.5] text-on-surface-variant max-w-2xl mx-auto">Everything you need to participate effectively in the democratic process, all in one secure platform.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1: Dashboard */}
              <button 
                onClick={handleProtectedAction}
                className="md:col-span-2 text-left bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between group hover:border-primary-fixed-dim transition-colors"
              >
                <div>
                  <span className="material-symbols-outlined text-4xl text-secondary mb-4">dashboard_customize</span>
                  <h3 className="text-[20px] font-semibold text-primary mb-2">Personalized Dashboard</h3>
                  <p className="text-on-surface-variant">Track your registration status, find upcoming local election dates, and manage your voter profile in a secure environment.</p>
                </div>
                <div className="mt-6 h-32 w-full bg-surface-container rounded-lg border border-outline-variant flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-secondary-container to-primary-fixed opacity-30"></div>
                  <span className="text-[12px] font-semibold uppercase tracking-widest text-on-surface-variant relative z-10">Interactive Status Tracker Preview</span>
                </div>
              </button>
              {/* Feature 2: Candidates */}
              <button 
                onClick={handleProtectedAction}
                className="text-left bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm flex flex-col group hover:border-primary-fixed-dim transition-colors"
              >
                <span className="material-symbols-outlined text-4xl text-secondary mb-4">group</span>
                <h3 className="text-[20px] font-semibold text-primary mb-2">Candidate Research</h3>
                <p className="text-on-surface-variant">Access in-depth, unbiased profiles and read official manifestos to make informed decisions at the ballot box.</p>
              </button>
              {/* Feature 3: Polling Station */}
              <button 
                onClick={handleProtectedAction}
                className="text-left bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm flex flex-col group hover:border-primary-fixed-dim transition-colors"
              >
                <span className="material-symbols-outlined text-4xl text-secondary mb-4">location_on</span>
                <h3 className="text-[20px] font-semibold text-primary mb-2">Polling Station Locator</h3>
                <p className="text-on-surface-variant">Find your designated voting center, view accessible routes, and check estimated wait times on election day.</p>
              </button>
              {/* Feature 4: AI Assistant */}
              <button 
                onClick={handleProtectedAction}
                className="md:col-span-2 text-left bg-primary-container p-6 rounded-xl border border-outline-variant shadow-sm flex flex-col md:flex-row items-center gap-6"
              >
                <div className="flex-1 text-on-primary">
                  <span className="material-symbols-outlined text-4xl text-secondary-fixed mb-4">smart_toy</span>
                  <h3 className="text-[20px] font-semibold text-on-primary mb-2">AI Civic Assistant</h3>
                  <p className="text-on-primary-container">Get immediate, accurate answers to your election queries 24/7. From documentation requirements to voting procedures, our AI is here to help.</p>
                </div>
                <div className="w-full md:w-1/3 bg-surface-container-lowest p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2 text-on-surface">
                    <span className="material-symbols-outlined text-sm text-secondary">face</span>
                    <div className="bg-surface-container px-3 py-1 rounded-full text-[12px]">What ID do I need?</div>
                  </div>
                  <div className="flex items-center gap-2 justify-end text-on-surface">
                    <div className="bg-primary-fixed px-3 py-1 rounded-full text-[12px]">You need your Voter ID...</div>
                    <span className="material-symbols-outlined text-sm text-primary">smart_toy</span>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
