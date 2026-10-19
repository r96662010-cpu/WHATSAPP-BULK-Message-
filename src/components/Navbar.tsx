import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSecurity } from '../context/SecurityContext';
import {
  Workflow,
  Send,
  Bot,
  Webhook,
  Sparkles,
  ShieldCheck,
  LogOut,
  LogIn,
  Layers,
  ChevronDown,
  Lock,
  Eye,
  EyeOff,
  RefreshCw,
  KeyRound,
  Flame,
  Globe,
  LayoutDashboard,
  Video,
  Keyboard,
  FileSpreadsheet,
  Share2,
  Megaphone,
  ClipboardList,
  MessageSquare,
  Bell,
  ExternalLink,
  CheckCheck,
} from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

export type ActiveTab =
  | 'overview'
  | 'canvas'
  | 'blaster'
  | 'excel'
  | 'social'
  | 'recruitment'
  | 'agent'
  | 'media'
  | 'admin'
  | 'utilities'
  | 'integrations'
  | 'gateway';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenAuth: () => void;
  onOpenGoogleAuth: () => void;
  onOpenShortcuts?: () => void;
  activeAccountsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  onOpenAuth,
  onOpenGoogleAuth,
  onOpenShortcuts,
  activeAccountsCount,
}) => {
  const { user, isAdmin, isSuperAdmin, signOut } = useAuth();
  const { settings, lockApp, toggleCiphertext, rotateEncryptionKey } = useSecurity();
  const { notifications, unreadCount, markAllAsRead, openWhatsAppViewer } = useNotifications();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [securityDropdownOpen, setSecurityDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [rotating, setRotating] = useState(false);

  const handleRotateKey = async () => {
    setRotating(true);
    await rotateEncryptionKey();
    setTimeout(() => setRotating(false), 500);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-3 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand */}
        <div
          onClick={() => onTabChange('overview')}
          className="flex items-center gap-2.5 cursor-pointer group flex-shrink-0"
          title="Go to Command Center"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <Layers className="w-4 h-4 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm sm:text-base tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                FlowPulse AI
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-500/15 text-indigo-400 border border-indigo-500/25">
                STUDIO
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden xl:block">
              Excel, Social Ads & WhatsApp 1000 Blaster
            </p>
          </div>
        </div>

        {/* Workspace Navigation Tabs */}
        <nav className="hidden lg:flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800/80 text-xs font-medium overflow-x-auto max-w-2xl">
          <button
            onClick={() => onTabChange('overview')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span className="font-bold">All</span>
          </button>

          <button
            onClick={() => onTabChange('blaster')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeTab === 'blaster'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>WhatsApp (1,000 Blast)</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </button>

          <button
            onClick={() => onTabChange('excel')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeTab === 'excel'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-bold text-emerald-300">Excel Sheet</span>
          </button>

          <button
            onClick={() => onTabChange('social')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeTab === 'social'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Share2 className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-bold text-blue-300">Social & Ads</span>
          </button>

          <button
            onClick={() => onTabChange('recruitment')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeTab === 'recruitment'
                ? 'bg-purple-700 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5 text-purple-400" />
            <span className="font-bold text-purple-300">Recruitment Form</span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
              NEW
            </span>
          </button>

          <button
            onClick={() => onTabChange('agent')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeTab === 'agent'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>AI Agent</span>
          </button>

          <button
            onClick={() => onTabChange('media')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeTab === 'media'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-red-400" />
            <span className="font-bold text-red-300">Veo 3 & Grok Video</span>
          </button>

          <button
            onClick={() => onTabChange('canvas')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeTab === 'canvas'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Workflow className="w-3.5 h-3.5" />
            <span>Workflow Builder</span>
          </button>

          <button
            onClick={() => onTabChange('admin')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeTab === 'admin'
                ? 'bg-indigo-700 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-bold text-indigo-300">Admin Control</span>
            {isAdmin && (
              <span className="text-[9px] px-1 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                ADMIN
              </span>
            )}
          </button>

          {/* More Dropdown for Utilities, Integrations, Gateway */}
          <div className="relative">
            <button
              onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            >
              <span>More</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {moreDropdownOpen && (
              <div
                className="absolute left-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in"
                onClick={() => setMoreDropdownOpen(false)}
              >
                <button
                  onClick={() => onTabChange('utilities')}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 text-left"
                >
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>Blaster Utilities</span>
                </button>
                <button
                  onClick={() => onTabChange('integrations')}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 text-left"
                >
                  <Globe className="w-3.5 h-3.5 text-blue-400" />
                  <span>Integrations Hub</span>
                </button>
                <button
                  onClick={() => onTabChange('gateway')}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 text-left"
                >
                  <Webhook className="w-3.5 h-3.5 text-slate-400" />
                  <span>Webhooks & Gateway</span>
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile quick tabs switch */}
        <div className="flex lg:hidden items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => onTabChange('overview')}
            className={`p-1.5 rounded-lg ${activeTab === 'overview' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
          >
            <LayoutDashboard className="w-4 h-4" />
          </button>
          <button
            onClick={() => onTabChange('blaster')}
            className={`p-1.5 rounded-lg ${activeTab === 'blaster' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
          >
            <Send className="w-4 h-4" />
          </button>
          <button
            onClick={() => onTabChange('excel')}
            className={`p-1.5 rounded-lg ${activeTab === 'excel' ? 'bg-emerald-700 text-white' : 'text-slate-400'}`}
          >
            <FileSpreadsheet className="w-4 h-4" />
          </button>
          <button
            onClick={() => onTabChange('social')}
            className={`p-1.5 rounded-lg ${activeTab === 'social' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onTabChange('recruitment')}
            className={`p-1.5 rounded-lg ${activeTab === 'recruitment' ? 'bg-purple-700 text-white' : 'text-slate-400'}`}
            title="Recruitment Form"
          >
            <ClipboardList className="w-4 h-4" />
          </button>
          <button
            onClick={() => onTabChange('admin')}
            className={`p-1.5 rounded-lg ${activeTab === 'admin' ? 'bg-indigo-700 text-white' : 'text-slate-400'}`}
          >
            <ShieldCheck className="w-4 h-4" />
          </button>
        </div>

        {/* Right Section: Encryption Status, Google Auth & User Profile */}
        <div className="flex items-center gap-2">
          {/* Global Keyboard Shortcuts Cheat Sheet Button */}
          <button
            onClick={() => {
              if (onOpenShortcuts) onOpenShortcuts();
              else window.dispatchEvent(new KeyboardEvent('keydown', { key: '?' }));
            }}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 text-slate-300 hover:text-white text-xs font-medium transition group"
            title="Global Keyboard Shortcuts (Press ? or ⌘K)"
          >
            <Keyboard className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition" />
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[9px] font-mono text-slate-400 border border-slate-700">
              ?
            </kbd>
          </button>

          {/* Encryption Badge & Quick Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setSecurityDropdownOpen(!securityDropdownOpen);
                setProfileDropdownOpen(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20 transition shadow-xs"
              title="AES-256-GCM End-to-End Encryption"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="hidden md:inline font-mono">AES-256</span>
              <Lock className="w-3 h-3 text-emerald-400 hidden sm:inline" />
            </button>

            {securityDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-4 z-50 space-y-3 animate-in fade-in zoom-in-95 duration-100">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Encryption Engine
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                    AES-GCM-256
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px]">
                    <span className="text-slate-500 block text-[10px]">Key Fingerprint:</span>
                    <span className="text-indigo-400 font-semibold">{settings.keyFingerprint}</span>
                  </div>

                  <button
                    onClick={handleRotateKey}
                    disabled={rotating}
                    className="w-full py-1.5 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center justify-between transition"
                  >
                    <span>Rotate Master Key</span>
                    <RefreshCw className={`w-3.5 h-3.5 ${rotating ? 'animate-spin text-indigo-400' : 'text-slate-400'}`} />
                  </button>

                  <button
                    onClick={toggleCiphertext}
                    className="w-full py-1.5 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center justify-between transition"
                  >
                    <span>{settings.showCiphertext ? 'Hide Ciphertext Mask' : 'View Masked Ciphertext'}</span>
                    {settings.showCiphertext ? (
                      <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <button
                    onClick={() => {
                      setSecurityDropdownOpen(false);
                      lockApp();
                    }}
                    className="w-full py-2 px-3 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:bg-rose-500/25 font-bold flex items-center justify-center gap-1.5 transition"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Lock Vault / Encrypt Screen</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick "Allow Message in WhatsApp" Dispatcher Button */}
          <button
            onClick={() => {
              window.dispatchEvent(
                new CustomEvent('flowpulse_open_whatsapp_dispatcher', {
                  detail: {
                    phone: '7869515615',
                    name: 'Rashmi Sondhi',
                    roleOrCompany: 'Talent Acquisition & Recruitment Lead',
                    templateType: 'interview',
                  },
                })
              );
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition active:scale-95"
            title="Allow Message to go in WhatsApp (wa.me Click-to-Chat)"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Send WhatsApp</span>
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          </button>

          {/* WhatsApp Sent Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setNotifDropdownOpen(!notifDropdownOpen);
                setSecurityDropdownOpen(false);
                setProfileDropdownOpen(false);
                if (!notifDropdownOpen && unreadCount > 0) {
                  markAllAsRead();
                }
              }}
              className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition"
              title="WhatsApp Sent Notifications & Delivery Reports"
            >
              <Bell className="w-3.5 h-3.5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 font-black text-[9px] flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-4 z-50 space-y-3 animate-in fade-in zoom-in-95 duration-100">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      WhatsApp Sent Notifications
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                    {notifications.length} Sent
                  </span>
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                  {notifications.length === 0 ? (
                    <div className="text-center py-6 text-slate-500 text-xs">
                      No sent notifications yet. Send a message to WhatsApp to see records.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/40 transition space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-white truncate max-w-[200px] flex items-center gap-1">
                            <CheckCheck className="w-3 h-3 text-emerald-400" />
                            {n.title}
                          </span>
                          <span className="text-[10px] text-slate-500">{n.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                          {n.message}
                        </p>
                        {n.sampleRecipient && (
                          <div className="pt-1 flex items-center justify-between text-[10px]">
                            <span className="text-emerald-400 font-mono">
                              {n.sampleRecipient.phone}
                            </span>
                            <button
                              onClick={() => {
                                setNotifDropdownOpen(false);
                                openWhatsAppViewer({
                                  recipientName: n.sampleRecipient?.name || 'Recipient',
                                  recipientPhone: n.sampleRecipient?.phone || n.senderPhone,
                                  recipientCompany: n.sampleRecipient?.company,
                                  messageBody: n.sampleRecipient?.message || n.message,
                                  sentTimestamp: n.timestamp,
                                  senderPhone: n.senderPhone,
                                  isDelivered: true,
                                });
                              }}
                              className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                            >
                              <span>View Chat</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setNotifDropdownOpen(false);
                      window.dispatchEvent(
                        new CustomEvent('flowpulse_open_whatsapp_dispatcher', {
                          detail: {
                            phone: '7869515615',
                            name: 'Rashmi Sondhi',
                            templateType: 'interview',
                          },
                        })
                      );
                    }}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>Compose New Message</span>
                  </button>
                  <button
                    onClick={() => {
                      markAllAsRead();
                      setNotifDropdownOpen(false);
                    }}
                    className="text-xs text-slate-400 hover:text-slate-200"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Prominent Official Google Sign-In Button */}
          <button
            onClick={onOpenGoogleAuth}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs transition shadow-sm active:scale-95"
            title="Sign in with Google OAuth"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
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
            <span className="hidden sm:inline">Sign in with Google</span>
            <span className="sm:hidden">Google</span>
          </button>

          {/* User Profile Dropdown */}
          {user && (
            <div className="relative">
              <button
                onClick={() => {
                  setProfileDropdownOpen(!profileDropdownOpen);
                  setSecurityDropdownOpen(false);
                }}
                className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 transition"
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-700"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 mr-1" />
              </button>

              {profileDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-3.5 z-50 animate-in fade-in zoom-in-95 duration-100 space-y-3"
                  onClick={() => setProfileDropdownOpen(false)}
                >
                  <div className="pb-3 border-b border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-white truncate max-w-[150px]">
                        {user.name}
                      </p>
                      <span className="text-[9px] font-black px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {user.role ? user.role.toUpperCase() : 'USER'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate font-mono">
                      {user.email}
                    </p>
                    {user.isGoogleUser && (
                      <span className="inline-block text-[9px] font-bold text-emerald-400">
                        ✓ Verified Google Identity
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    {isAdmin && (
                      <button
                        onClick={() => onTabChange('admin')}
                        className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-semibold transition"
                      >
                        <span className="flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                          Open Admin Control Center
                        </span>
                        <span className="text-[10px]">→</span>
                      </button>
                    )}

                    <div className="flex items-center justify-between text-[11px] bg-slate-950 p-2 rounded-lg border border-slate-800">
                      <span className="text-slate-400">Daily WhatsApp Blast Limit:</span>
                      <span className="font-bold text-emerald-400">
                        {user.dailyBlastLimit?.toLocaleString() || '1,000'}/day
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] bg-slate-950 p-2 rounded-lg border border-slate-800">
                      <span className="text-slate-400">Daily Ad Budget Limit:</span>
                      <span className="font-bold text-white">
                        ₹{user.dailyAdBudgetLimit?.toLocaleString() || '10,000'}/day
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => onOpenAuth()}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                    >
                      Auth Settings
                    </button>
                    <button
                      onClick={() => signOut()}
                      className="text-xs flex items-center gap-1.5 text-rose-400 hover:text-rose-300 font-bold"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
