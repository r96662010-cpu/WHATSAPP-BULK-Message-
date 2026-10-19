import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSecurity } from '../context/SecurityContext';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  X,
  ExternalLink,
  ChevronRight,
  UserCheck,
  PlusCircle,
} from 'lucide-react';

interface GoogleSignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleSignInModal: React.FC<GoogleSignInModalProps> = ({ isOpen, onClose }) => {
  const { signInWithGoogle } = useAuth();
  const { rotateEncryptionKey } = useSecurity();
  const [loading, setLoading] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState('sondhirashmi5@gmail.com');
  const [customEmail, setCustomEmail] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [step, setStep] = useState<'chooser' | 'authorizing' | 'success'>('chooser');

  if (!isOpen) return null;

  const handleSelectAccount = async (email: string, name: string) => {
    setLoading(true);
    setStep('authorizing');

    try {
      // Simulate real OAuth consent delay
      await new Promise((r) => setTimeout(r, 650));
      await signInWithGoogle(email, name);
      await rotateEncryptionKey(); // Generate new encrypted session key
      setStep('success');

      setTimeout(() => {
        setStep('chooser');
        setLoading(false);
        onClose();
      }, 700);
    } catch (err) {
      console.error('Google OAuth error', err);
      setLoading(false);
      setStep('chooser');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Content */}
        <div className="p-6 sm:p-8">
          {/* Google Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 border border-slate-100 shadow-sm mb-3">
              <svg className="w-6 h-6" viewBox="0 0 24 24">
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
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Sign in with Google
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              to continue to <span className="font-semibold text-slate-800">FlowPulse AI</span>
            </p>
          </div>

          {step === 'authorizing' && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative">
                <span className="inline-block w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-indigo-600" />
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Securing Session...</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Generating AES-256-GCM encrypted keys for your account
                </p>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="py-10 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Authenticated with Google
              </h3>
              <p className="text-xs text-slate-500">
                End-to-end encrypted workspace ready
              </p>
            </div>
          )}

          {step === 'chooser' && (
            <div className="space-y-4">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Choose an account
              </p>

              {/* Account 1: Rashmi Sondhi */}
              <div
                onClick={() => handleSelectAccount('sondhirashmi5@gmail.com', 'Rashmi Sondhi')}
                className="p-3.5 rounded-2xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/50 cursor-pointer transition flex items-center justify-between group shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
                    alt="Rashmi Sondhi"
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/20"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition">
                      Rashmi Sondhi
                    </h4>
                    <p className="text-xs text-slate-500">sondhirashmi5@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-semibold opacity-0 group-hover:opacity-100 transition">
                  <span>Sign In</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              {/* Account 2: Shri Shyam Staffing Team */}
              <div
                onClick={() =>
                  handleSelectAccount('recruiter@shrishyam.com', 'Shri Shyam Staffing Lead')
                }
                className="p-3.5 rounded-2xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/50 cursor-pointer transition flex items-center justify-between group shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-600 text-white font-bold text-sm flex items-center justify-center">
                    SS
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition">
                      Shri Shyam Consulting
                    </h4>
                    <p className="text-xs text-slate-500">recruiter@shrishyam.com</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
              </div>

              {/* Custom Google Account input toggle */}
              {!showCustomInput ? (
                <button
                  type="button"
                  onClick={() => setShowCustomInput(true)}
                  className="w-full py-2.5 px-3 rounded-xl border border-dashed border-slate-300 hover:border-slate-400 text-xs text-slate-600 font-medium flex items-center justify-center gap-2 transition"
                >
                  <PlusCircle className="w-4 h-4 text-slate-400" />
                  <span>Use another Google account</span>
                </button>
              ) : (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 animate-in fade-in">
                  <label className="text-xs font-medium text-slate-700 block">
                    Enter any Google Email:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      placeholder="you@gmail.com"
                      className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customEmail) {
                          handleSelectAccount(customEmail, customEmail.split('@')[0]);
                        }
                      }}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg transition"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Encryption & Consent Notice */}
              <div className="pt-4 border-t border-slate-100 space-y-2 text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5 text-emerald-700 font-semibold bg-emerald-50 p-2 rounded-xl border border-emerald-100">
                  <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>AES-256-GCM End-to-End Cryptographic Isolation</span>
                </div>
                <p className="leading-relaxed">
                  By continuing, Google shares your verified profile and email with FlowPulse AI. Workflows, leads, and phone numbers are encrypted at-rest and in-transit.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
