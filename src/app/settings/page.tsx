"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import Sidebar from '@/components/Sidebar';

export default function Settings() {
  const { user, userProfile, updateProfile, loading, logout } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    displayName: '',
    age: 0,
    voterId: '',
    constituency: '',
    homeState: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (userProfile) {
      setFormData({
        displayName: userProfile.displayName || '',
        age: userProfile.age || 0,
        voterId: userProfile.voterId || '',
        constituency: userProfile.constituency || '',
        homeState: (userProfile as any).homeState || ''
      });
    }
  }, [userProfile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage('');
    try {
      await updateProfile(formData);
      setSaveMessage('Profile updated successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error("Failed to update profile:", error);
      setSaveMessage('Error updating profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'ta', name: 'தமிழ்' },
    { code: 'te', name: 'తెలుగు' },
    { code: 'bn', name: 'বাংলা' },
  ];

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
    "Maharashtra", "Manipur", "Meghalayas", "Mizoram", "Nagaland", "Odisha", "Punjab", 
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background text-on-surface">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-6 lg:p-10 max-w-4xl mx-auto w-full">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">{t('account_settings')}</h1>
          <p className="text-on-surface-variant text-lg">{t('manage_profile')}</p>
        </header>

        <div className="grid gap-8">
          {/* Profile Section */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center overflow-hidden border-2 border-primary/20">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-4xl">account_circle</span>
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold">{userProfile?.displayName || user.displayName || 'Voter'}</h2>
                <p className="text-sm text-on-surface-variant">{user.email}</p>
              </div>
            </div>

            <form onSubmit={handleSave} className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-on-surface-variant px-1">{t('full_name')}</label>
                <input 
                  type="text" 
                  value={formData.displayName}
                  onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                  className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder="Enter your full name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-on-surface-variant px-1">{t('age')}</label>
                <input 
                  type="number" 
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: parseInt(e.target.value) || 0})}
                  className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-on-surface-variant px-1">{t('voter_id')}</label>
                <input 
                  type="text" 
                  value={formData.voterId}
                  onChange={(e) => setFormData({...formData, voterId: e.target.value})}
                  className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder="ABC1234567"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-on-surface-variant px-1">{t('home_constituency')}</label>
                <input 
                  type="text" 
                  value={formData.constituency}
                  onChange={(e) => setFormData({...formData, constituency: e.target.value})}
                  className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder="Enter constituency name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-on-surface-variant px-1">{t('home_state')}</label>
                <select 
                  value={formData.homeState}
                  onChange={(e) => setFormData({...formData, homeState: e.target.value})}
                  className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none"
                >
                  <option value="">Select State</option>
                  {indianStates.map(state => <option key={state} value={state}>{state}</option>)}
                </select>
              </div>
              
              <div className="md:col-span-2 flex items-center justify-between mt-2">
                <p className={`text-sm font-medium ${saveMessage.includes('Error') ? 'text-error' : 'text-primary'}`}>
                  {saveMessage}
                </p>
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="px-8 py-3 bg-primary text-on-primary font-bold rounded-xl hover:shadow-lg hover:shadow-primary/20 disabled:opacity-50 transition-all flex items-center gap-2"
                >
                  {isSaving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                  {isSaving ? 'Saving...' : t('save_changes')}
                </button>
              </div>
            </form>
          </section>

          {/* Preferences Section */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">translate</span>
              {t('lang_regional')}
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code as any)}
                  className={`
                    flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all gap-1
                    ${language === lang.code 
                      ? 'bg-primary/5 border-primary text-primary shadow-inner' 
                      : 'bg-surface-container border-transparent text-on-surface-variant hover:border-outline-variant'}
                  `}
                >
                  <span className="text-lg font-bold">{lang.name}</span>
                  <span className="text-[10px] uppercase tracking-tighter opacity-70">{lang.code}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Danger Zone */}
          <section className="bg-error-container/10 border border-error/20 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-error mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined">warning</span>
              {t('account_security')}
            </h3>
            <p className="text-on-surface-variant mb-6 text-sm">
              {t('logout_desc')}
            </p>
            <button 
              onClick={() => logout()}
              className="px-6 py-3 bg-error text-on-error font-bold rounded-xl hover:shadow-lg hover:shadow-error/20 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined">logout</span>
              {t('logout')}
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}
