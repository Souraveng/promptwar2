'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function VotingReminder() {
  const { t } = useLanguage();
  const { userProfile } = useAuth();
  const [isReminderSet, setIsReminderSet] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [votingDate, setVotingDate] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('voting_reminder_set');
    if (saved === 'true') {
      setIsReminderSet(true);
    }

    const fetchVotingDate = async () => {
      if (userProfile?.constituencyCode) {
        const docRef = doc(db, 'constituencies', userProfile.constituencyCode);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setVotingDate(docSnap.data().votingDate);
        }
      }
    };
    fetchVotingDate();
  }, [userProfile?.constituencyCode]);

  const formattedDate = votingDate 
    ? new Date(votingDate).toLocaleDateString(undefined, { dateStyle: 'long' })
    : "June 1, 2024";

  const toggleReminder = () => {
    const newState = !isReminderSet;
    setIsReminderSet(newState);
    localStorage.setItem('voting_reminder_set', newState.toString());
    
    if (newState) {
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }
  };

  return (
    <div className="bg-surface-container-low rounded-3xl p-6 border border-outline-variant shadow-sm relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined">notifications_active</span>
          </div>
          <div>
            <h3 className="font-bold text-on-surface">{t('voting_reminders')}</h3>
            <p className="text-xs text-on-surface-variant">Don't miss your chance to vote.</p>
          </div>
        </div>
        <button 
          onClick={toggleReminder}
          className={`
            relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none
            ${isReminderSet ? 'bg-primary' : 'bg-slate-300'}
          `}
        >
          <span
            className={`
              inline-block h-4 w-4 transform rounded-full bg-white transition-transform
              ${isReminderSet ? 'translate-x-6' : 'translate-x-1'}
            `}
          />
        </button>
      </div>

      <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined text-primary text-[20px]">info</span>
          <p className="text-[12px] text-on-surface-variant leading-relaxed">
            {isReminderSet 
              ? `Notification scheduled for ${formattedDate}. You will receive a browser alert on voting day.` 
              : "Enable reminders to get notified when your constituency goes to polls."}
          </p>
        </div>
      </div>

      {showNotification && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-on-surface text-surface px-4 py-2 rounded-full text-xs font-bold animate-in fade-in slide-in-from-bottom-2">
          Reminder set successfully! 🗳️
        </div>
      )}
    </div>
  );
}
