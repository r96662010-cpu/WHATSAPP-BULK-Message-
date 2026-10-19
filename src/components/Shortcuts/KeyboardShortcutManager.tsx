import React, { useState, useEffect, useCallback } from 'react';
import { ActiveTab } from '../Navbar';
import {
  Keyboard,
  X,
  Search,
  Sparkles,
  Send,
  Users,
  Layers,
  Lock,
  Flame,
  Filter,
  LayoutDashboard,
  Workflow,
  Bot,
  Video,
  Webhook,
  Globe,
  CheckCircle2,
  Phone,
  FileSpreadsheet,
  Share2,
  ShieldCheck,
  ClipboardList,
} from 'lucide-react';

export interface ShortcutItem {
  id: string;
  keys: string[];
  label: string;
  description: string;
  category: 'Navigation' | 'WhatsApp Campaigns' | 'System & Security';
  icon: React.ReactNode;
  action: () => void;
}

interface KeyboardShortcutManagerProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenAuth?: () => void;
  onOpenGoogleAuth?: () => void;
  onOpenMessageAll?: () => void;
  onOpenTemplateManager?: () => void;
  onOpenWarmer?: () => void;
  onOpenFilter?: () => void;
  onOpen1000Blast?: () => void;
  onLockApp?: () => void;
}

export const KeyboardShortcutManager: React.FC<KeyboardShortcutManagerProps> = ({
  activeTab,
  onTabChange,
  onOpenAuth,
  onOpenGoogleAuth,
  onOpenMessageAll,
  onOpenTemplateManager,
  onOpenWarmer,
  onOpenFilter,
  onOpen1000Blast,
  onLockApp,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hudMessage, setHudMessage] = useState<string | null>(null);

  const showHud = useCallback((msg: string) => {
    setHudMessage(msg);
    setTimeout(() => {
      setHudMessage((prev) => (prev === msg ? null : prev));
    }, 2200);
  }, []);

  // Define full list of shortcuts
  const shortcuts: ShortcutItem[] = [
    // Navigation
    {
      id: 'nav-overview',
      keys: ['Alt', '1'],
      label: 'Go to Overview',
      description: 'Command Center, live metrics & campaign stats',
      category: 'Navigation',
      icon: <LayoutDashboard className="w-4 h-4 text-cyan-400" />,
      action: () => {
        onTabChange('overview');
        showHud('Navigated to: Overview');
      },
    },
    {
      id: 'nav-canvas',
      keys: ['Alt', '2'],
      label: 'Workflow Canvas',
      description: 'Visual automation pipeline and node builder',
      category: 'Navigation',
      icon: <Workflow className="w-4 h-4 text-purple-400" />,
      action: () => {
        onTabChange('canvas');
        showHud('Navigated to: Workflow Canvas');
      },
    },
    {
      id: 'nav-blaster',
      keys: ['Alt', '3'],
      label: 'WhatsApp Blaster',
      description: 'Connected numbers, templates & bulk campaign broadcast',
      category: 'Navigation',
      icon: <Send className="w-4 h-4 text-emerald-400" />,
      action: () => {
        onTabChange('blaster');
        showHud('Navigated to: WhatsApp Blaster');
      },
    },
    {
      id: 'nav-agent',
      keys: ['Alt', '4'],
      label: 'Live Agent Simulator',
      description: 'Interactive AI WhatsApp responder & prompt simulator',
      category: 'Navigation',
      icon: <Bot className="w-4 h-4 text-amber-400" />,
      action: () => {
        onTabChange('agent');
        showHud('Navigated to: Live Agent Simulator');
      },
    },
    {
      id: 'nav-media',
      keys: ['Alt', '5'],
      label: 'Media Studio',
      description: 'YouTube animated video maker & free image generators',
      category: 'Navigation',
      icon: <Video className="w-4 h-4 text-rose-400" />,
      action: () => {
        onTabChange('media');
        showHud('Navigated to: Media Studio');
      },
    },
    {
      id: 'nav-utilities',
      keys: ['Alt', '6'],
      label: 'Blaster Utilities',
      description: 'Group contact scraper, number validator & file attachments',
      category: 'Navigation',
      icon: <Filter className="w-4 h-4 text-teal-400" />,
      action: () => {
        onTabChange('utilities');
        showHud('Navigated to: Blaster Utilities');
      },
    },
    {
      id: 'nav-integrations',
      keys: ['Alt', '7'],
      label: 'Integrations Hub',
      description: 'Connect Google Sheets, Zapier, Webhooks & Meta API',
      category: 'Navigation',
      icon: <Webhook className="w-4 h-4 text-indigo-400" />,
      action: () => {
        onTabChange('integrations');
        showHud('Navigated to: Integrations');
      },
    },
    {
      id: 'nav-excel',
      keys: ['Alt', 'E'],
      label: 'Excel Sheet & Leads Hub',
      description: 'Upload .xlsx, view spreadsheet grid & push to WhatsApp audience',
      category: 'Navigation',
      icon: <FileSpreadsheet className="w-4 h-4 text-emerald-400" />,
      action: () => {
        onTabChange('excel');
        showHud('Navigated to: Excel Sheet & Leads Hub');
      },
    },
    {
      id: 'nav-social',
      keys: ['Alt', 'S'],
      label: 'Social Media & Ads Platform',
      description: 'Cross-post to Facebook & run Click-to-WhatsApp social ads',
      category: 'Navigation',
      icon: <Share2 className="w-4 h-4 text-blue-400" />,
      action: () => {
        onTabChange('social');
        showHud('Navigated to: Social Media & Ads');
      },
    },
    {
      id: 'nav-recruitment',
      keys: ['Alt', 'R'],
      label: 'Recruitment Google Form & ATS',
      description: 'Job application Google Form, PAN India candidates & WhatsApp invite',
      category: 'Navigation',
      icon: <ClipboardList className="w-4 h-4 text-purple-400" />,
      action: () => {
        onTabChange('recruitment');
        showHud('Navigated to: Recruitment Google Form');
      },
    },
    {
      id: 'nav-admin',
      keys: ['Alt', 'A'],
      label: 'Admin Control Center',
      description: 'Google SSO team management, RBAC roles & audit logs',
      category: 'Navigation',
      icon: <ShieldCheck className="w-4 h-4 text-indigo-400" />,
      action: () => {
        onTabChange('admin');
        showHud('Navigated to: Admin Control Center');
      },
    },
    {
      id: 'nav-gateway',
      keys: ['Alt', '8'],
      label: 'Production Gateway',
      description: 'Live production endpoints, webhooks & API keys',
      category: 'Navigation',
      icon: <Globe className="w-4 h-4 text-blue-400" />,
      action: () => {
        onTabChange('gateway');
        showHud('Navigated to: Production Gateway');
      },
    },

    // WhatsApp Campaigns
    {
      id: 'action-1000-blast',
      keys: ['Ctrl', 'Shift', 'B'],
      label: '1,000 Bulk Blast in One Go',
      description: 'Direct dispatch 1,000 messages via connected +91 78695 15615',
      category: 'WhatsApp Campaigns',
      icon: <Phone className="w-4 h-4 text-emerald-400" />,
      action: () => {
        if (onOpen1000Blast) {
          onOpen1000Blast();
          showHud('Opened: 1,000 Bulk Blast (+91 78695 15615)');
        } else {
          onTabChange('blaster');
          showHud('Switched to WhatsApp Blaster for 1,000 Blast');
        }
      },
    },
    {
      id: 'action-message-all',
      keys: ['Alt', 'B'],
      label: 'Message All Contacts',
      description: 'Launch multi-contact campaign broadcast modal',
      category: 'WhatsApp Campaigns',
      icon: <Send className="w-4 h-4 text-teal-400" />,
      action: () => {
        if (onOpenMessageAll) {
          onOpenMessageAll();
          showHud('Opened: Message All Contacts');
        } else {
          onTabChange('blaster');
          showHud('Switched to WhatsApp Blaster');
        }
      },
    },
    {
      id: 'action-templates',
      keys: ['Alt', 'T'],
      label: 'Templates Library',
      description: 'Browse, create and inject high-converting WhatsApp templates',
      category: 'WhatsApp Campaigns',
      icon: <Layers className="w-4 h-4 text-indigo-400" />,
      action: () => {
        if (onOpenTemplateManager) {
          onOpenTemplateManager();
          showHud('Opened: Templates Library');
        } else {
          onTabChange('blaster');
          showHud('Switched to WhatsApp Blaster');
        }
      },
    },
    {
      id: 'action-warmer',
      keys: ['Alt', 'W'],
      label: 'SIM Warmer Engine',
      description: 'Anti-ban warming schedules for new WhatsApp numbers',
      category: 'WhatsApp Campaigns',
      icon: <Flame className="w-4 h-4 text-amber-400" />,
      action: () => {
        if (onOpenWarmer) {
          onOpenWarmer();
          showHud('Opened: SIM Warmer');
        } else {
          onTabChange('blaster');
          showHud('Switched to WhatsApp Blaster');
        }
      },
    },
    {
      id: 'action-filter',
      keys: ['Alt', 'F'],
      label: 'WhatsApp Number Filter',
      description: 'Scan and remove inactive contacts or landlines',
      category: 'WhatsApp Campaigns',
      icon: <Filter className="w-4 h-4 text-cyan-400" />,
      action: () => {
        if (onOpenFilter) {
          onOpenFilter();
          showHud('Opened: Number Filter');
        } else {
          onTabChange('utilities');
          showHud('Switched to Utilities Filter');
        }
      },
    },

    // System & Security
    {
      id: 'system-shortcuts',
      keys: ['?'],
      label: 'Keyboard Shortcuts Cheat Sheet',
      description: 'Open this modal with all global hotkeys and fast actions',
      category: 'System & Security',
      icon: <Keyboard className="w-4 h-4 text-slate-300" />,
      action: () => setIsOpen(true),
    },
    {
      id: 'system-lock',
      keys: ['Ctrl', 'L'],
      label: 'Lock Workspace',
      description: 'Engage AES-256 encrypted vault lock overlay immediately',
      category: 'System & Security',
      icon: <Lock className="w-4 h-4 text-rose-400" />,
      action: () => {
        if (onLockApp) {
          onLockApp();
          showHud('Locked Workspace [AES-GCM-256]');
        }
      },
    },
    {
      id: 'system-google',
      keys: ['Alt', 'G'],
      label: 'Google Sign-In / Account',
      description: 'Open official Google OAuth modal & workspace sync',
      category: 'System & Security',
      icon: <Users className="w-4 h-4 text-blue-400" />,
      action: () => {
        if (onOpenGoogleAuth) {
          onOpenGoogleAuth();
          showHud('Opened Google Sign-In');
        }
      },
    },
  ];

  // Global Keydown Handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if user is typing in an input, textarea, or contentEditable
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable);

      // Escape always closes open modals
      if (e.key === 'Escape') {
        if (isOpen) {
          e.preventDefault();
          setIsOpen(false);
          return;
        }
      }

      // '?' opens shortcuts modal when NOT typing in an input
      if (e.key === '?' && !isInput) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        return;
      }

      // Cmd+K or Ctrl+K opens shortcut palette
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        return;
      }

      // Ctrl + Shift + B -> 1,000 Bulk Blast
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        if (onOpen1000Blast) {
          onOpen1000Blast();
          showHud('Triggered 1,000 Bulk Blast (+91 78695 15615)');
        } else {
          onTabChange('blaster');
        }
        return;
      }

      // Ctrl + L -> Lock Vault
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        if (onLockApp) {
          onLockApp();
          showHud('Workspace Locked');
        }
        return;
      }

      // Alt + Key combinations for rapid navigation and actions (works even if inside inputs)
      if (e.altKey) {
        switch (e.key) {
          case '1':
            e.preventDefault();
            onTabChange('overview');
            showHud('Navigated to Overview [Alt+1]');
            break;
          case '2':
            e.preventDefault();
            onTabChange('canvas');
            showHud('Navigated to Workflow Canvas [Alt+2]');
            break;
          case '3':
            e.preventDefault();
            onTabChange('blaster');
            showHud('Navigated to WhatsApp Blaster [Alt+3]');
            break;
          case '4':
            e.preventDefault();
            onTabChange('agent');
            showHud('Navigated to Live Agent Simulator [Alt+4]');
            break;
          case '5':
            e.preventDefault();
            onTabChange('media');
            showHud('Navigated to Media Studio [Alt+5]');
            break;
          case '6':
            e.preventDefault();
            onTabChange('utilities');
            showHud('Navigated to Blaster Utilities [Alt+6]');
            break;
          case '7':
            e.preventDefault();
            onTabChange('integrations');
            showHud('Navigated to Integrations Hub [Alt+7]');
            break;
          case '8':
            e.preventDefault();
            onTabChange('gateway');
            showHud('Navigated to Production Gateway [Alt+8]');
            break;
          case 'b':
          case 'B':
            e.preventDefault();
            if (onOpenMessageAll) onOpenMessageAll();
            else onTabChange('blaster');
            showHud('Triggered Message All [Alt+B]');
            break;
          case 't':
          case 'T':
            e.preventDefault();
            if (onOpenTemplateManager) onOpenTemplateManager();
            else onTabChange('blaster');
            showHud('Triggered Templates Library [Alt+T]');
            break;
          case 'w':
          case 'W':
            e.preventDefault();
            if (onOpenWarmer) onOpenWarmer();
            else onTabChange('blaster');
            showHud('Triggered SIM Warmer [Alt+W]');
            break;
          case 'f':
          case 'F':
            e.preventDefault();
            if (onOpenFilter) onOpenFilter();
            else onTabChange('utilities');
            showHud('Triggered Number Filter [Alt+F]');
            break;
          case 'g':
          case 'G':
            e.preventDefault();
            if (onOpenGoogleAuth) onOpenGoogleAuth();
            showHud('Opened Google Auth [Alt+G]');
            break;
          default:
            break;
        }
        return;
      }

      // Single-key navigation (1-8) when outside form controls
      if (!isInput && !e.metaKey && !e.ctrlKey && !e.altKey) {
        if (e.key >= '1' && e.key <= '8') {
          const tabMap: Record<string, { tab: ActiveTab; name: string }> = {
            '1': { tab: 'overview', name: 'Overview' },
            '2': { tab: 'canvas', name: 'Workflow Canvas' },
            '3': { tab: 'blaster', name: 'WhatsApp Blaster' },
            '4': { tab: 'agent', name: 'Live Agent Simulator' },
            '5': { tab: 'media', name: 'Media Studio' },
            '6': { tab: 'utilities', name: 'Blaster Utilities' },
            '7': { tab: 'integrations', name: 'Integrations Hub' },
            '8': { tab: 'gateway', name: 'Production Gateway' },
          };
          const match = tabMap[e.key];
          if (match) {
            e.preventDefault();
            onTabChange(match.tab);
            showHud(`Navigated to ${match.name} [Key ${e.key}]`);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isOpen,
    onTabChange,
    onOpenAuth,
    onOpenGoogleAuth,
    onOpenMessageAll,
    onOpenTemplateManager,
    onOpenWarmer,
    onOpenFilter,
    onOpen1000Blast,
    onLockApp,
    showHud,
  ]);

  // Filter shortcuts based on user search
  const filteredShortcuts = shortcuts.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      s.label.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.keys.join(' ').toLowerCase().includes(q)
    );
  });

  const categories: Array<'Navigation' | 'WhatsApp Campaigns' | 'System & Security'> = [
    'Navigation',
    'WhatsApp Campaigns',
    'System & Security',
  ];

  return (
    <>
      {/* Floating HUD Feedback Notification */}
      {hudMessage && (
        <div className="fixed bottom-14 right-6 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="px-3.5 py-2 rounded-xl bg-slate-900/95 border border-indigo-500/40 text-white text-xs font-semibold flex items-center gap-2 shadow-2xl backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{hudMessage}</span>
          </div>
        </div>
      )}

      {/* Floating Shortcut Quick-Access Button (Bottom Right) */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-40 px-3 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-indigo-500/50 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-2 shadow-xl backdrop-blur-md transition group"
        title="View Keyboard Shortcuts (? or ⌘K)"
      >
        <Keyboard className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition" />
        <span className="hidden sm:inline">Shortcuts</span>
        <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-400">
          ?
        </kbd>
      </button>

      {/* Keyboard Shortcuts Cheat Sheet Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between gap-3 bg-slate-950/60">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                  <Keyboard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    Keyboard Shortcuts & Quick Actions
                    <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono">
                      ⌘K / ?
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Switch tabs instantly and trigger high-speed campaign workflows
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="p-3 sm:px-5 sm:py-3 border-b border-slate-800/80 bg-slate-900/50">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search shortcuts (e.g., 1000 blast, blaster, lock, templates)..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                  autoFocus
                />
              </div>
            </div>

            {/* Shortcuts List Categorized */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-6 flex-1">
              {categories.map((category) => {
                const categoryShortcuts = filteredShortcuts.filter(
                  (s) => s.category === category
                );
                if (categoryShortcuts.length === 0) return null;

                return (
                  <div key={category} className="space-y-2">
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <span>{category}</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        ({categoryShortcuts.length})
                      </span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {categoryShortcuts.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            item.action();
                            setIsOpen(false);
                          }}
                          className="p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800/70 border border-slate-800/80 hover:border-slate-700 cursor-pointer transition flex items-center justify-between gap-3 group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center shrink-0 border border-slate-800 group-hover:border-slate-700">
                              {item.icon}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-white truncate group-hover:text-indigo-300 transition">
                                {item.label}
                              </p>
                              <p className="text-[10px] text-slate-400 truncate">
                                {item.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            {item.keys.map((k, idx) => (
                              <kbd
                                key={idx}
                                className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-300 font-bold shadow-sm"
                              >
                                {k}
                              </kbd>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {filteredShortcuts.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                  <Keyboard className="w-10 h-10 mx-auto text-slate-600 mb-2 opacity-50" />
                  <p className="text-xs">No shortcuts match "{searchQuery}"</p>
                </div>
              )}
            </div>

            {/* Footer with Tips */}
            <div className="p-3 sm:px-5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Tip: Press numbers 1–8 while viewing any page to switch tabs instantly</span>
              </span>
              <kbd className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-300 border border-slate-700">
                Esc to close
              </kbd>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
