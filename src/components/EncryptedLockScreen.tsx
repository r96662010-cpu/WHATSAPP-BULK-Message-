import React, { useState } from 'react';
import { useSecurity } from '../context/SecurityContext';
import { useAuth } from '../context/AuthContext';
import { Lock, ShieldCheck, KeyRound, Unlock, Sparkles, ArrowRight } from 'lucide-react';

export const EncryptedLockScreen: React.FC = () => {
  const { settings, unlockApp, masterPin } = useSecurity();
  const { user } = useAuth();
  const [pinInput, setPinInput] = useState('');
  const [error, setError] = useState(false);

  if (!settings.isLocked) return null;

  const handleUnlock = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const ok = unlockApp(pinInput);
    if (!ok) {
      setError(true);
      setTimeout(() => setError(false), 2000);
    } else {
      setPinInput('');
    }
  };

  const handleQuickUnlockGoogle = () => {
    unlockApp(masterPin);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-2xl animate-in fade-in duration-200 text-slate-100">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl text-center overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute -top-20 -right-20 w-52 h-52 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-52 h-52 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Lock Icon Badge */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shadow-lg">
          <Lock className="w-8 h-8 text-indigo-400 animate-pulse" />
        </div>

        <h2 className="text-xl font-extrabold text-white">
          Encrypted Vault Locked
        </h2>
        <p className="text-xs text-slate-400 mt-1 mb-4">
          All workflows, WhatsApp numbers & leads are secured with{' '}
          <span className="text-emerald-400 font-semibold">AES-256-GCM</span>
        </p>

        {/* Key Fingerprint Badge */}
        <div className="mb-6 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
          <span>Active Cipher Key:</span>
          <span className="text-indigo-400 font-bold">{settings.keyFingerprint}</span>
        </div>

        {/* 1-Click Google Unlock */}
        <button
          onClick={handleQuickUnlockGoogle}
          className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-center gap-2.5 shadow-md transition mb-4"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Unlock as {user ? user.name : 'Rashmi Sondhi'}</span>
        </button>

        <div className="relative my-4 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <span className="relative px-3 bg-slate-900 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            or enter master PIN
          </span>
        </div>

        {/* PIN Form */}
        <form onSubmit={handleUnlock} className="space-y-3">
          <div className="relative">
            <KeyRound className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="password"
              maxLength={8}
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="Enter PIN (Default: 1234)"
              className={`w-full pl-10 pr-4 py-2 bg-slate-950 border rounded-xl text-center text-sm font-mono tracking-widest text-white focus:outline-none focus:ring-2 ${
                error
                  ? 'border-rose-500 focus:ring-rose-500'
                  : 'border-slate-700 focus:ring-indigo-500'
              }`}
            />
          </div>

          {error && (
            <p className="text-xs text-rose-400 font-medium">
              Incorrect PIN. Use default 1234 or Unlock with Google.
            </p>
          )}

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
          >
            <Unlock className="w-3.5 h-3.5" />
            <span>Decrypt & Unlock App</span>
          </button>
        </form>

        <div className="mt-5 text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Zero-Knowledge Architecture: Keys never leave your device</span>
        </div>
      </div>
    </div>
  );
};
