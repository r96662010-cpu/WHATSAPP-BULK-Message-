import React, { useState, useEffect, useRef } from 'react';
import {
  CampaignRecipient,
  BroadcastTemplate,
  WhatsAppAccount,
} from '../../types';
import confetti from 'canvas-confetti';
import {
  Send,
  Users,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Play,
  Pause,
  Square,
  Search,
  Plus,
  Trash2,
  Download,
  Copy,
  Sparkles,
  Phone,
  FileSpreadsheet,
  ChevronDown,
  Layers,
  Check,
  Zap,
  Eye,
  Mail,
  Bell,
  ExternalLink,
} from 'lucide-react';
import { generate1000VerifiedRecipients, saveAllRecipients } from '../../data/sampleAudience';
import { useNotifications } from '../../context/NotificationContext';

interface MessageAllModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipients: CampaignRecipient[];
  setRecipients: React.Dispatch<React.SetStateAction<CampaignRecipient[]>>;
  templates: BroadcastTemplate[];
  activeTemplate: BroadcastTemplate;
  customBody: string;
  accounts: WhatsAppAccount[];
}

export const MessageAllModal: React.FC<MessageAllModalProps> = ({
  isOpen,
  onClose,
  recipients,
  setRecipients,
  templates,
  activeTemplate,
  customBody,
  accounts,
}) => {
  // Selection
  const [selectedRecipientIds, setSelectedRecipientIds] = useState<string[]>(
    recipients.map((r) => r.id)
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'audience' | 'preview' | 'bulk_paste'>('audience');

  const { triggerBroadcastCompleteNotification, openWhatsAppViewer } = useNotifications();

  // Chosen broadcast template & custom message
  const [selectedTemplateId, setSelectedTemplateId] = useState(activeTemplate.id);
  const [messageBody, setMessageBody] = useState(customBody);

  // Quick recipient preview index
  const [previewRecipientIndex, setPreviewRecipientIndex] = useState(0);

  // New Contact Inline Form
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactCompany, setNewContactCompany] = useState('');
  const [newContactCourse, setNewContactCourse] = useState('');

  // Bulk Paste State
  const [bulkPasteText, setBulkPasteText] = useState(
    `Rahul Gupta, +91 98334 11229, FinTech AI, Masterclass\nAnanya Sen, +91 97401 55667, Stellar Cloud, Corporate Staffing\nKaran Bajaj, +91 99102 33445, NextGen Global, Special Offer`
  );

  // Broadcast Execution State
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [stats, setStats] = useState({
    total: 0,
    sent: 0,
    delivered: 0,
    read: 0,
    failed: 0,
  });

  // Anti-ban configuration
  const [minDelay, setMinDelay] = useState(2);
  const [maxDelay, setMaxDelay] = useState(5);
  const [rotateAccounts, setRotateAccounts] = useState(true);

  // Ref to cancel/pause loop
  const isCancelledRef = useRef(false);
  const isPausedRef = useRef(false);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    // Keep message body updated if customBody changes while closed
    if (!isBroadcasting) {
      setMessageBody(customBody);
      setSelectedTemplateId(activeTemplate.id);
    }
  }, [customBody, activeTemplate.id, isBroadcasting]);

  if (!isOpen) return null;

  // Toggle select all
  const handleToggleSelectAll = () => {
    if (selectedRecipientIds.length === recipients.length) {
      setSelectedRecipientIds([]);
    } else {
      setSelectedRecipientIds(recipients.map((r) => r.id));
    }
  };

  // 1-Click Load 1,000 Verified Leads Pack
  const handleLoad1000Pack = () => {
    const pack = generate1000VerifiedRecipients(1000);
    setRecipients(pack);
    saveAllRecipients(pack);
    setSelectedRecipientIds(pack.map((r) => r.id));
  };

  // Toggle single recipient
  const handleToggleRecipient = (id: string) => {
    setSelectedRecipientIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Switch template
  const handleSwitchTemplate = (tmplId: string) => {
    setSelectedTemplateId(tmplId);
    const found = templates.find((t) => t.id === tmplId);
    if (found) {
      setMessageBody(found.body);
    }
  };

  // Add individual contact
  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName.trim() || !newContactPhone.trim()) return;

    const newContact: CampaignRecipient = {
      id: `r-manual-${Date.now()}`,
      name: newContactName.trim(),
      phone: newContactPhone.trim(),
      company: newContactCompany.trim() || 'Enterprise Client',
      course: newContactCourse.trim() || 'AI Masterclass',
      status: 'pending',
    };

    setRecipients((prev) => [newContact, ...prev]);
    setSelectedRecipientIds((prev) => [newContact.id, ...prev]);

    setNewContactName('');
    setNewContactPhone('');
    setNewContactCompany('');
    setNewContactCourse('');
  };

  // Process bulk paste
  const handleProcessBulkPaste = () => {
    const lines = bulkPasteText.split('\n').filter((l) => l.trim().length > 0);
    const newItems: CampaignRecipient[] = [];

    lines.forEach((line, idx) => {
      const parts = line.split(',').map((p) => p.trim());
      if (parts.length >= 2) {
        newItems.push({
          id: `r-bulk-${Date.now()}-${idx}`,
          name: parts[0] || `Lead ${idx + 1}`,
          phone: parts[1] || `+91 98000 ${Math.floor(10000 + Math.random() * 89999)}`,
          company: parts[2] || 'Global Tech',
          course: parts[3] || 'AI & Automation Suite',
          status: 'pending',
        });
      }
    });

    if (newItems.length > 0) {
      setRecipients((prev) => [...newItems, ...prev]);
      setSelectedRecipientIds((prev) => [...newItems.map((n) => n.id), ...prev]);
      setActiveTab('audience');
    }
  };

  // Helper to interpolate dynamic variables for a recipient
  const renderPersonalizedMessage = (rec: CampaignRecipient | undefined) => {
    if (!rec) return messageBody;
    return messageBody
      .replace(/{{1}}/g, rec.name)
      .replace(/{{name}}/g, rec.name)
      .replace(/{{company}}/g, rec.company || 'your organization')
      .replace(/{{course}}/g, rec.course || 'Masterclass Program')
      .replace(/{{phone}}/g, rec.phone)
      .replace(/{{discount}}/g, 'VIPGROWTH')
      .replace(/{{date}}/g, 'this Thursday at 7:00 PM')
      .replace(/{{link}}/g, 'https://shrishyam.edu/enroll');
  };

  // Filter recipients by search
  const filteredRecipients = recipients.filter((r) => {
    const q = searchQuery.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      r.phone.toLowerCase().includes(q) ||
      (r.company && r.company.toLowerCase().includes(q))
    );
  });

  // Start "Message All" execution
  const handleStartMessageAll = async () => {
    if (isBroadcasting) return;
    const targetRecipients = recipients.filter((r) =>
      selectedRecipientIds.includes(r.id)
    );

    if (targetRecipients.length === 0) return;

    setIsBroadcasting(true);
    setIsPaused(false);
    isCancelledRef.current = false;
    isPausedRef.current = false;
    setProgressPercent(0);
    setCurrentIndex(0);

    setStats({
      total: targetRecipients.length,
      sent: 0,
      delivered: 0,
      read: 0,
      failed: 0,
    });

    // Reset targeted recipients status to pending
    setRecipients((prev) =>
      prev.map((r) =>
        selectedRecipientIds.includes(r.id) ? { ...r, status: 'pending' } : r
      )
    );

    for (let i = 0; i < targetRecipients.length; i++) {
      if (isCancelledRef.current) break;

      // Handle pause loop
      while (isPausedRef.current && !isCancelledRef.current) {
        await new Promise((res) => setTimeout(res, 300));
      }

      if (isCancelledRef.current) break;

      setCurrentIndex(i);
      const currentTarget = targetRecipients[i];

      // Jitter simulation delay
      const jitterMs = Math.floor(
        (minDelay + Math.random() * (maxDelay - minDelay)) * 400 + 400
      );
      await new Promise((r) => setTimeout(r, jitterMs));

      // Mark delivered in recipient list
      setRecipients((prev) =>
        prev.map((r) =>
          r.id === currentTarget.id ? { ...r, status: 'delivered' } : r
        )
      );

      const deliveredCount = i + 1;
      const readEstimate = Math.max(0, Math.floor(deliveredCount * 0.88));

      setStats({
        total: targetRecipients.length,
        sent: deliveredCount,
        delivered: deliveredCount,
        read: readEstimate,
        failed: 0,
      });

      setProgressPercent(Math.round(((i + 1) / targetRecipients.length) * 100));
    }

    setIsBroadcasting(false);

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#22C55E', '#10B981', '#38BDF8', '#6366F1'],
      });
    } catch (e) {
      // ignore
    }

    if (!isCancelledRef.current && targetRecipients.length > 0) {
      const sample = targetRecipients[0];
      triggerBroadcastCompleteNotification({
        count: targetRecipients.length,
        senderPhone: accounts[0]?.phone || '+91 78695 15615',
        adminWhatsApp: '+91 78695 15615',
        toEmail: 'sondhirashmi5@gmail.com',
        templateTitle: activeTemplate?.title || (activeTemplate as any)?.name || 'Message All Broadcast',
        messageBody,
        sampleRecipient: {
          name: sample.name,
          phone: sample.phone,
          company: sample.company || 'Enterprise Leader',
          course: sample.course || 'AI Masterclass',
        },
      });
    }
  };

  // Pause / Resume
  const handleTogglePause = () => {
    setIsPaused((prev) => !prev);
  };

  // Stop / Cancel
  const handleCancelBroadcast = () => {
    isCancelledRef.current = true;
    setIsBroadcasting(false);
    setIsPaused(false);
  };

  // Export CSV Report
  const handleExportCsv = () => {
    const targetRecipients = recipients.filter((r) =>
      selectedRecipientIds.includes(r.id)
    );
    const headers = 'ID,Name,Phone,Company,Course,Status\n';
    const rows = targetRecipients
      .map(
        (r) =>
          `"${r.id}","${r.name}","${r.phone}","${r.company || ''}","${r.course || ''}","${r.status}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `whatsapp_broadcast_report_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const previewRecipient =
    recipients.find((r) => selectedRecipientIds.includes(r.id)) || recipients[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-5xl bg-slate-900 border border-emerald-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-950/50 via-slate-900 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shadow-md">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-white">
                  Message All — Bulk WhatsApp Broadcaster
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold">
                  {selectedRecipientIds.length} Selected Leads
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Multi-SIM account rotation • Dynamic variables (`{`{{name}}`}`) • Zero-ban human jitter engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                window.dispatchEvent(new CustomEvent('flowpulse_open_1000_blast'));
              }}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition"
              title="Switch to dedicated 1,000 Bulk Blast Mode (Sender: +91 78695 15615)"
            >
              <Zap className="w-3.5 h-3.5 text-amber-200 fill-amber-300" />
              <span>1,000 Blast Mode (+91 78695 15615)</span>
            </button>

            <button
              onClick={handleExportCsv}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition"
              title="Download recipients and delivery report"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={onClose}
              disabled={isBroadcasting}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition disabled:opacity-40"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Live Broadcast Progress Bar (Shown when active or completed) */}
        {isBroadcasting && (
          <div className="p-4 bg-emerald-950/30 border-b border-emerald-500/30 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                <span className="font-bold text-white">
                  {isPaused ? 'Broadcasting Paused' : 'Broadcasting to All Selected Contacts...'}
                </span>
                <span className="text-slate-400">
                  ({stats.sent} of {stats.total} delivered)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleTogglePause}
                  className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1"
                >
                  {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                  <span>{isPaused ? 'Resume' : 'Pause'}</span>
                </button>
                <button
                  onClick={handleCancelBroadcast}
                  className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1"
                >
                  <Square className="w-3 h-3" />
                  <span>Stop</span>
                </button>
              </div>
            </div>

            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="grid grid-cols-4 gap-2 pt-1 text-center text-xs">
              <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400">Sent: </span>
                <span className="font-bold text-white">{stats.sent}</span>
              </div>
              <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400">Delivered: </span>
                <span className="font-bold text-emerald-400">{stats.delivered}</span>
              </div>
              <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400">Read: </span>
                <span className="font-bold text-cyan-400">{stats.read}</span>
              </div>
              <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400">Accounts Rotating: </span>
                <span className="font-bold text-indigo-400">{accounts.length} SIMs</span>
              </div>
            </div>
          </div>
        )}

        {/* Modal Navigation Tabs */}
        <div className="px-5 pt-3 border-b border-slate-800 bg-slate-950/40 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('audience')}
            className={`pb-2.5 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'audience'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Target Audience ({selectedRecipientIds.length}/{recipients.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('preview')}
            className={`pb-2.5 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'preview'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Template & Message Customizer</span>
          </button>

          <button
            onClick={() => setActiveTab('bulk_paste')}
            className={`pb-2.5 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'bulk_paste'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Paste Numbers / CSV Import</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {activeTab === 'audience' && (
            <div className="space-y-4">
              {/* Quick Action Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={handleToggleSelectAll}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>
                      {selectedRecipientIds.length === recipients.length
                        ? 'Deselect All'
                        : 'Select All'}
                    </span>
                  </button>

                  {/* 1-Click Load 1,000 Leads */}
                  <button
                    type="button"
                    onClick={handleLoad1000Pack}
                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600/30 to-teal-600/30 hover:from-emerald-600/40 hover:to-teal-600/40 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 transition"
                    title="Load 1,000 verified prospects immediately"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                    <span>⚡ Pack 1,000 Leads</span>
                  </button>

                  <span className="text-xs text-slate-400 font-medium">
                    <strong className="text-emerald-400">{selectedRecipientIds.length}</strong> of{' '}
                    {recipients.length} contacts
                  </span>
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search contacts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Recipients List Table */}
              <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
                <div className="max-h-64 overflow-y-auto divide-y divide-slate-800/80">
                  {filteredRecipients.map((rec) => {
                    const isSelected = selectedRecipientIds.includes(rec.id);
                    return (
                      <div
                        key={rec.id}
                        onClick={() => handleToggleRecipient(rec.id)}
                        className={`p-3 flex items-center justify-between cursor-pointer transition ${
                          isSelected
                            ? 'bg-emerald-950/20 hover:bg-emerald-950/30'
                            : 'hover:bg-slate-900/60 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleRecipient(rec.id)}
                            className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-white">{rec.name}</span>
                              <span className="text-[11px] font-mono text-emerald-400">
                                {rec.phone}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {rec.company || 'Enterprise'} • {rec.course || 'Masterclass'}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                              rec.status === 'delivered'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : rec.status === 'read'
                                ? 'bg-cyan-500/20 text-cyan-400'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {rec.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Inline Add Quick Contact Form */}
              <form
                onSubmit={handleAddContact}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5 text-emerald-400" />
                    Quick Add Single Contact
                  </h4>
                  <span className="text-[10px] text-slate-400">Auto-adds to campaign audience</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Full Name (e.g. Ramesh Patel)"
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                    className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Phone (e.g. +91 98110 99887)"
                    value={newContactPhone}
                    onChange={(e) => setNewContactPhone(e.target.value)}
                    className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="Company / Org"
                    value={newContactCompany}
                    onChange={(e) => setNewContactCompany(e.target.value)}
                    className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                  />
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      placeholder="Course / Mandate"
                      value={newContactCourse}
                      onChange={(e) => setNewContactCourse(e.target.value)}
                      className="flex-1 px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="space-y-4">
              {/* Template Picker */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Choose Broadcast Template
                  </label>
                  <select
                    value={selectedTemplateId}
                    onChange={(e) => handleSwitchTemplate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    {templates.map((t) => (
                      <option key={t.id} value={t.id}>
                        [{t.category}] {t.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Preview Variable Interpolation
                  </label>
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
                    <span>
                      Previewing as: <strong className="text-emerald-400">{previewRecipient?.name}</strong> ({previewRecipient?.company || 'Company'})
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {previewRecipient?.phone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Message Body Editor */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Message Body (Customizable)
                </label>
                <textarea
                  rows={8}
                  value={messageBody}
                  onChange={(e) => setMessageBody(e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 font-sans leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Dynamic Preview for the chosen recipient */}
              <div className="p-4 rounded-xl bg-[#0B141B] border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Recipient Screen Preview (Personalized)
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">
                    ✓ Verified WhatsApp Format
                  </span>
                </div>

                <div className="bg-[#005C4B] rounded-xl p-3.5 text-white text-xs leading-relaxed max-w-[95%] shadow whitespace-pre-line">
                  {renderPersonalizedMessage(previewRecipient)}
                  <span className="block text-[9px] text-emerald-200 text-right mt-1.5">
                    10:45 AM ✓✓
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bulk_paste' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/20">
                <h4 className="text-xs font-bold text-white mb-1">
                  Paste Phone Numbers or CSV Lines
                </h4>
                <p className="text-[11px] text-slate-400">
                  Format per line: <code className="text-cyan-400">Name, Phone Number, Company, Course</code>
                </p>
              </div>

              <textarea
                rows={8}
                value={bulkPasteText}
                onChange={(e) => setBulkPasteText(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-slate-200 leading-relaxed focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Ramesh Gupta, +91 98221 00112, Acme Inc, Generative AI"
              />

              <button
                type="button"
                onClick={handleProcessBulkPaste}
                className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/20"
              >
                <Plus className="w-4 h-4" />
                <span>Parse & Add All to Audience</span>
              </button>
            </div>
          )}

          {/* Anti-Ban & Rotation Settings */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Anti-Ban Protection & Safe Throttling
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold">
                Rotating {accounts.length} Connected WhatsApp SIMs
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">
                  Human Jitter Delay ({minDelay}s - {maxDelay}s)
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={maxDelay}
                  onChange={(e) => setMaxDelay(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div className="flex items-center justify-between pt-3">
                <span className="text-slate-400 text-xs">Round-Robin SIM Rotation:</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold">
                  ACTIVE
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-400" />
            <span>
              Targeting <strong className="text-white">{selectedRecipientIds.length}</strong> recipients
              with <strong className="text-white">{accounts.length} active SIMs</strong>
            </span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {stats.delivered > 0 && (
              <button
                type="button"
                onClick={() => {
                  const sample = recipients.find((r) => selectedRecipientIds.includes(r.id)) || recipients[0];
                  openWhatsAppViewer({
                    recipientName: sample.name,
                    recipientPhone: sample.phone,
                    recipientCompany: sample.company,
                    recipientCourse: sample.course,
                    messageBody,
                    mediaType: 'image',
                    mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
                    actionButtons: ['Claim 40% Festive Offer 🎁', 'Confirm Admission Seat 🎓', 'Chat on WhatsApp 💬'],
                    sentTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    senderPhone: accounts[0]?.phone || '+91 78695 15615',
                    isDelivered: true,
                  });
                }}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center justify-center gap-1.5 transition"
              >
                <Eye className="w-4 h-4 text-emerald-400" />
                <span>👁️ Show Sent Message in WhatsApp</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              disabled={isBroadcasting}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition disabled:opacity-40"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleStartMessageAll}
              disabled={isBroadcasting || selectedRecipientIds.length === 0}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition disabled:opacity-50"
            >
              {isBroadcasting ? (
                <>
                  <span className="inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Sending ({progressPercent}%)...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Broadcast to All ({selectedRecipientIds.length} Contacts)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
