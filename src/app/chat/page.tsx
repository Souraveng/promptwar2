'use client';

import ChatAssistant from '@/components/ChatAssistant';
import Sidebar from '@/components/Sidebar';

export default function ChatPage() {
  return (
    <div className="flex h-screen bg-surface-container-lowest overflow-hidden">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-4 md:p-8 flex flex-col items-center">
        <div className="w-full max-w-4xl h-full flex flex-col">
          <div className="mb-8 mt-4">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined text-[32px]">smart_toy</span>
              </div>
              <div>
                <h1 className="text-3xl font-black text-on-surface tracking-tight">AI Civic Assistant</h1>
                <p className="text-on-surface-variant font-bold text-xs uppercase tracking-widest opacity-70">Official Election Guidance System</p>
              </div>
            </div>
          </div>
          
          <div className="flex-1 min-h-0 bg-white rounded-[40px] shadow-2xl shadow-black/5 border border-outline-variant overflow-hidden">
            <ChatAssistant isPage={true} />
          </div>
        </div>
      </main>
    </div>
  );
}
