"use client";

/**
 * @file ChatAssistant.tsx
 * @description A premium AI-powered civic assistant using Google Gemini 3 Flash.
 * Features multi-language support, ECI grounding, and a step-by-step voter guide.
 * Optimized for React 19 performance and Web Accessibility (WCAG 2.1).
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

/**
 * Interface representing a single message in the chat history.
 */
interface Message {
  /** The source of the message */
  role: 'user' | 'ai';
  /** The textual content of the message */
  text: string;
  /** Whether the information was verified against ECI records */
  isSourcedFromECI?: boolean;
}

/**
 * Properties for the ChatAssistant component.
 */
interface ChatAssistantProps {
  /** Optional message to trigger the assistant with immediately */
  initialMessage?: string | null;
  /** If true, renders as a full-page component rather than a floating window */
  isPage?: boolean;
}

/** Available operation modes for the assistant */
type Mode = 'chat' | 'guide';

/**
 * ChatAssistant Component
 * 
 * Provides a conversational interface for election-related queries and 
 * a structured, interactive guide for the voting process.
 * 
 * @param {ChatAssistantProps} props - Component properties.
 * @returns {React.ReactElement} The rendered ChatAssistant.
 */
export default function ChatAssistant({ initialMessage, isPage = false }: ChatAssistantProps) {
  // --- State Management ---
  const [isOpen, setIsOpen] = useState(isPage);
  const [mode, setMode] = useState<Mode>('chat');
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const { userProfile } = useAuth();
  const router = useRouter();

  /**
   * Suggestions for the user to start a conversation.
   * Memoized to prevent unnecessary recalculations on re-renders.
   */
  const SUGGESTIONS = useMemo(() => [
    t('suggestion_1'),
    t('suggestion_2'),
    t('suggestion_3'),
    t('suggestion_4'),
  ], [t]);

  // --- Effects & Lifecycle ---

  /**
   * Initializes the component state from localStorage.
   */
  useEffect(() => {
    setIsMounted(true);
    const savedState = localStorage.getItem('chat_assistant_state');
    if (savedState) {
      try {
        const { mode: savedMode, history } = JSON.parse(savedState);
        if (savedMode) setMode(savedMode);
        if (history) setChatHistory(history);
      } catch (e) {
        console.error("Failed to load chat state", e);
      }
    }
  }, []);

  /**
   * Persists the current chat mode and history to localStorage.
   */
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('chat_assistant_state', JSON.stringify({
        mode,
        history: chatHistory.slice(-20) 
      }));
    }
  }, [mode, chatHistory, isMounted]);

  /**
   * Triggers the initial message if provided via props.
   */
  useEffect(() => {
    if (initialMessage && isMounted) {
      setIsOpen(true);
      setMode('chat');
      autoSend(initialMessage);
    }
  }, [initialMessage, isMounted]);

  /**
   * Ensures the chat history view stays scrolled to the most recent message.
   */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, loading, mode]);

  // --- Logic & Actions ---

  /**
   * Determines the completion status of a specific voter journey step.
   * 
   * @param {number} index - The index of the step to check.
   * @returns {'pending' | 'complete'} The current status of the step.
   */
  const getStepStatus = useCallback((index: number) => {
    if (!userProfile) return 'pending';
    switch (index) {
      case 0: return userProfile.email ? 'complete' : 'pending';
      case 1: return userProfile.voterIdVerified ? 'complete' : 'pending';
      case 2: return userProfile.constituency !== 'Not Set' ? 'complete' : 'pending';
      case 3: return (userProfile.savedCandidates?.length || 0) > 0 ? 'complete' : 'pending';
      default: return 'pending';
    }
  }, [userProfile]);

  /**
   * Definition of steps for the Voter Journey Guide.
   */
  const STEPS = useMemo(() => [
    { 
      title: t('step_1_title'), 
      desc: t('step_1_desc'), 
      icon: 'person_add', 
      color: 'bg-blue-100 text-blue-600',
      action: t('go_to_registration'),
      path: 'https://voters.eci.gov.in/',
      isExternal: true,
      status: getStepStatus(0)
    },
    { 
      title: t('step_2_title'), 
      desc: t('step_2_desc'), 
      icon: 'fingerprint', 
      color: 'bg-orange-100 text-orange-600',
      action: t('verify_now'),
      path: '/polling',
      isExternal: false,
      status: getStepStatus(1)
    },
    { 
      title: t('step_3_title'), 
      desc: t('step_3_desc'), 
      icon: 'map', 
      color: 'bg-green-100 text-green-600',
      action: t('locate_booth'),
      path: '/polling',
      isExternal: false,
      status: getStepStatus(2)
    },
    { 
      title: t('step_4_title'), 
      desc: t('step_4_desc'), 
      icon: 'description', 
      color: 'bg-purple-100 text-purple-600',
      action: t('browse_candidates'),
      path: '/candidates',
      isExternal: false,
      status: getStepStatus(3)
    },
    { 
      title: t('step_5_title'), 
      desc: t('step_5_desc'), 
      icon: 'how_to_vote', 
      color: 'bg-red-100 text-red-600',
      action: t('how_to_vote'),
      path: '/simulator',
      isExternal: false,
      status: 'pending' as const
    },
  ], [t, getStepStatus]);

  /**
   * Internal function to send a message to the AI backend and update local history.
   * 
   * @param {string} text - The user's query text.
   */
  async function autoSend(text: string) {
    if (!text.trim()) return;
    
    const userMsg: Message = { role: 'user', text };
    setChatHistory(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: text,
          history: chatHistory.slice(-5).map(h => ({ role: h.role, text: h.text }))
        }),
      });
      
      if (!response.ok) throw new Error("API failure");
      
      const data = await response.json();
      const aiMsg: Message = { 
        role: 'ai', 
        text: data.text, 
        isSourcedFromECI: data.sourcedFromECI 
      };
      setChatHistory(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("Chat Error:", error);
      setChatHistory(prev => [...prev, { role: 'ai', text: t('chat_error') }]);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Handles the manual send button click or 'Enter' key press.
   */
  const handleSend = useCallback(() => {
    if (!message.trim()) return;
    const msg = message;
    setMessage('');
    autoSend(msg);
  }, [message]);

  /**
   * Handles navigation or external links from the Voter Guide.
   * 
   * @param {typeof STEPS[0]} step - The step object to act upon.
   */
  const handleStepAction = useCallback((step: typeof STEPS[0]) => {
    if (step.isExternal) {
      window.open(step.path, '_blank', 'noopener,noreferrer');
    } else {
      router.push(step.path);
      if (!isPage) setIsOpen(false); 
    }
  }, [router, isPage]);

  if (!isMounted) return null;

  const chatWindowClasses = isPage 
    ? "w-full h-full bg-surface flex flex-col overflow-hidden"
    : "fixed bottom-24 right-8 w-[90vw] md:w-[420px] h-[650px] bg-surface rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] border border-outline-variant flex flex-col z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-300";

  return (
    <>
      {/* --- Floating Action Button (FAB) --- */}
      {!isPage && (
        <button 
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close Assistant" : "Open AI Civic Assistant"}
          aria-expanded={isOpen}
          aria-haspopup="true"
          title={t('chat_title')}
          className={`fixed bottom-8 right-8 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all z-50 hover:scale-110 active:scale-95 ${
            isOpen ? 'bg-error-container text-on-error-container' : 'bg-primary text-on-primary'
          }`}
        >
          <span className="material-symbols-outlined text-[28px]" aria-hidden="true">
            {isOpen ? 'close' : 'smart_toy'}
          </span>
          {!isOpen && !loading && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-error rounded-full border-2 border-white animate-bounce"></div>
          )}
        </button>
      )}

      {/* --- Chat Window --- */}
      {(isOpen || isPage) && (
        <div className={chatWindowClasses} role="dialog" aria-labelledby="chat-header-title">
          
          {/* Header */}
          <div className="bg-primary p-6 text-on-primary relative overflow-hidden shrink-0">
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-inner">
                  <span className="material-symbols-outlined text-[28px]" aria-hidden="true">smart_toy</span>
                </div>
                <div>
                  <h3 id="chat-header-title" className="font-bold text-xl leading-tight">{t('chat_title')}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" aria-hidden="true"></div>
                    <p className="text-[10px] opacity-90 uppercase tracking-widest font-black">{t('system_ready')}</p>
                  </div>
                </div>
              </div>
              {!isPage && (
                <button 
                  onClick={() => setIsOpen(false)}
                  aria-label="Minimize Chat"
                  className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
                >
                  <span className="material-symbols-outlined" aria-hidden="true">expand_more</span>
                </button>
              )}
            </div>

            {/* Mode Switcher */}
            <div className="flex gap-2 mt-6 bg-black/15 p-1 rounded-2xl backdrop-blur-sm border border-white/10" role="tablist">
              <button 
                role="tab"
                aria-selected={mode === 'chat'}
                onClick={() => setMode('chat')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black transition-all ${
                  mode === 'chat' ? 'bg-white text-primary shadow-lg scale-[1.02]' : 'text-white/70 hover:bg-white/10'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]" aria-hidden="true">forum</span>
                {t('dashboard')}
              </button>
              <button 
                role="tab"
                aria-selected={mode === 'guide'}
                onClick={() => setMode('guide')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black transition-all ${
                  mode === 'guide' ? 'bg-white text-primary shadow-lg scale-[1.02]' : 'text-white/70 hover:bg-white/10'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]" aria-hidden="true">auto_stories</span>
                {t('voter_guide')}
              </button>
            </div>
          </div>
          
          {/* Content Area */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-5 space-y-6 bg-surface-container-lowest scroll-smooth custom-scrollbar"
            aria-live="polite"
          >
            {mode === 'chat' ? (
              <>
                {chatHistory.length === 0 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500 text-center">
                    <div className="py-8 px-6 bg-primary/5 rounded-[32px] border border-primary/10 relative overflow-hidden group">
                      <div className="w-20 h-20 bg-primary/10 text-primary rounded-[24px] flex items-center justify-center mx-auto mb-5 shadow-inner">
                        <span className="material-symbols-outlined text-[40px]" aria-hidden="true">how_to_vote</span>
                      </div>
                      <h4 className="font-bold text-on-surface text-lg mb-2">{t('assistant_welcome')}</h4>
                      <p className="text-xs text-on-surface-variant italic px-4 opacity-80 italic">"Empowering your democratic voice."</p>
                      
                      <button 
                        onClick={() => setMode('guide')}
                        className="mt-6 w-full py-3.5 bg-primary text-on-primary rounded-2xl font-bold text-xs shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined text-[18px]" aria-hidden="true">rocket_launch</span>
                        {t('start_journey')}
                      </button>
                    </div>
                    
                    <nav className="space-y-3" aria-label="Suggested Queries">
                      <p className="text-[10px] text-outline font-black uppercase px-2 tracking-widest">{t('quick_enquiries')}</p>
                      <div className="grid gap-3">
                        {SUGGESTIONS.map((s, i) => (
                          <button 
                            key={i}
                            onClick={() => autoSend(s)}
                            className="text-left p-4 text-xs bg-white border border-outline-variant rounded-2xl hover:bg-primary/5 hover:border-primary hover:shadow-md transition-all group"
                          >
                            <span className="font-bold pr-4 group-hover:text-primary">{s}</span>
                          </button>
                        ))}
                      </div>
                    </nav>
                  </div>
                )}
                
                {chatHistory.map((chat, i) => (
                  <div key={i} className={`flex flex-col ${chat.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                    <div 
                      className={`max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed shadow-sm ${
                        chat.role === 'user' 
                        ? 'bg-primary text-on-primary rounded-tr-none' 
                        : 'bg-white text-on-surface rounded-tl-none border border-outline-variant'
                      }`}
                    >
                      {chat.text}
                    </div>
                    {chat.role === 'ai' && chat.isSourcedFromECI && (
                      <div className="mt-2 flex items-center gap-1.5 px-1 bg-green-50 rounded-full py-1 pr-3 border border-green-100">
                        <span className="material-symbols-outlined text-green-600 text-[16px] font-bold" aria-hidden="true">verified</span>
                        <span className="text-[9px] font-black text-green-700 uppercase tracking-tighter">{t('verified_eci')}</span>
                      </div>
                    )}
                  </div>
                ))}
                
                {loading && (
                  <div className="flex justify-start" aria-busy="true" aria-label="Assistant is typing">
                    <div className="bg-surface-container-high px-5 py-4 rounded-3xl rounded-tl-none flex gap-2">
                      <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce"></div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-4">
                <h4 className="font-black text-on-surface uppercase tracking-widest text-[10px] px-2">{t('process_timeline')}</h4>
                <div className="space-y-4 relative">
                  <div className="absolute left-[23px] top-6 bottom-6 w-[2px] bg-outline-variant/30 z-0" aria-hidden="true"></div>
                  {STEPS.map((step, i) => (
                    <article 
                      key={i} 
                      className={`group bg-white p-5 rounded-[32px] border transition-all relative z-10 ${
                        step.status === 'complete' ? 'border-green-200 bg-green-50/10' : 'border-outline-variant hover:border-primary hover:shadow-xl'
                      }`}
                    >
                      <div className="flex gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                          step.status === 'complete' ? 'bg-green-100 text-green-600' : step.color
                        }`}>
                          <span className="material-symbols-outlined text-[24px] font-bold" aria-hidden="true">
                            {step.status === 'complete' ? 'check_circle' : step.icon}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h5 className="font-bold text-[15px] text-on-surface">{step.title}</h5>
                          <p className="text-xs text-on-surface-variant leading-relaxed opacity-80 mb-4">{step.desc}</p>
                          <button 
                            onClick={() => handleStepAction(step)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                              step.status === 'complete' ? 'bg-green-600 text-white' : 'bg-primary text-on-primary'
                            }`}
                          >
                            {step.action}
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-5 bg-white border-t border-outline-variant shrink-0">
            {mode === 'chat' && (
              <div className="relative flex items-center gap-2">
                <input 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={t('ask_placeholder')}
                  aria-label="Message text"
                  className="w-full pl-6 pr-14 py-4.5 bg-surface-container-low rounded-[24px] border border-outline-variant focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm font-medium"
                />
                <button 
                  onClick={handleSend}
                  disabled={loading || !message.trim()}
                  aria-label="Send message"
                  className="absolute right-2 top-2 w-11 h-11 bg-primary text-on-primary rounded-[18px] flex items-center justify-center hover:opacity-95 transition-all disabled:opacity-30 shadow-lg shadow-primary/20"
                >
                  <span className="material-symbols-outlined text-[22px] font-bold" aria-hidden="true">arrow_upward</span>
                </button>
              </div>
            )}
            
            <div className="flex items-center justify-center gap-4 mt-5">
               <p className="text-[9px] text-outline font-black uppercase tracking-tighter">© 2026 Bharat Nirvachan Portal</p>
               <a href="https://eci.gov.in" target="_blank" rel="noopener noreferrer" className="text-[9px] text-primary font-black uppercase tracking-tighter hover:underline">
                {t('official_links')}
               </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
