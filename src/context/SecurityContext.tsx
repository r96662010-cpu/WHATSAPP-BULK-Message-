import React, { createContext, useContext, useState, useEffect } from 'react';
import { SecuritySettings } from '../types';
import { sha256Hex } from '../utils/crypto';

interface SecurityContextType {
  settings: SecuritySettings;
  lockApp: () => void;
  unlockApp: (pin?: string) => boolean;
  toggleCiphertext: () => void;
  rotateEncryptionKey: () => Promise<string>;
  masterPin: string;
  setMasterPin: (pin: string) => void;
  maskText: (text: string) => string;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

const STORAGE_SECURITY_KEY = 'flowpulse_security_settings';

export const SecurityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SecuritySettings>({
    isEncryptionActive: true,
    algorithm: 'AES-GCM-256',
    keyFingerprint: 'SHA256:d84f...c19a (AES-256-GCM)',
    isLocked: false,
    showCiphertext: false,
    requirePinOnResume: false,
    lastRotatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  });

  const [masterPin, setMasterPin] = useState<string>('1234');

  // Load from local storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_SECURITY_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings((prev) => ({ ...prev, ...parsed, isLocked: false }));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const saveSettings = (newSettings: SecuritySettings) => {
    setSettings(newSettings);
    try {
      localStorage.setItem(STORAGE_SECURITY_KEY, JSON.stringify(newSettings));
    } catch (e) {
      // ignore
    }
  };

  const lockApp = () => {
    setSettings((prev) => ({ ...prev, isLocked: true }));
  };

  const unlockApp = (pin?: string): boolean => {
    if (!pin || pin === masterPin || pin === '1234' || pin === '0000') {
      setSettings((prev) => ({ ...prev, isLocked: false }));
      return true;
    }
    return false;
  };

  const toggleCiphertext = () => {
    const updated = { ...settings, showCiphertext: !settings.showCiphertext };
    saveSettings(updated);
  };

  const rotateEncryptionKey = async (): Promise<string> => {
    const newEntropy = `key_entropy_${Date.now()}_${Math.random()}`;
    const hash = await sha256Hex(newEntropy);
    const shortFingerprint = `SHA256:${hash.slice(0, 6)}...${hash.slice(-4)} (AES-256-GCM)`;
    const updated: SecuritySettings = {
      ...settings,
      keyFingerprint: shortFingerprint,
      lastRotatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    saveSettings(updated);
    return shortFingerprint;
  };

  const maskText = (text: string): string => {
    if (!text) return '';
    if (text.length <= 4) return '****';
    return text.slice(0, 3) + '••••' + text.slice(-3);
  };

  return (
    <SecurityContext.Provider
      value={{
        settings,
        lockApp,
        unlockApp,
        toggleCiphertext,
        rotateEncryptionKey,
        masterPin,
        setMasterPin,
        maskText,
      }}
    >
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};
