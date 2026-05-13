"use client";

import { useAuth } from '@/context/AuthContext';
import AuthModal from './AuthModal';

export default function GlobalModals() {
  const { isAuthModalOpen, setIsAuthModalOpen, authMode } = useAuth();

  return (
    <AuthModal 
      isOpen={isAuthModalOpen} 
      onClose={() => setIsAuthModalOpen(false)} 
      initialMode={authMode} 
    />
  );
}
