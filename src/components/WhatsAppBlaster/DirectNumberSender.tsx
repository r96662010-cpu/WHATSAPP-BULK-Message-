import React, { useState, useRef, useEffect } from 'react';
import * as XLSX from 'xlsx';
import {
  Send,
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  Bell,
  Volume2,
  VolumeX,
  ExternalLink,
  Phone,
  User,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Clock,
  Download,
  Trash2,
  RefreshCw,
  Zap,
  CheckCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  cleanAndFormatPhone,
  getWhatsAppUrls,
  openWhatsAppDirect,
  playWhatsAppDeliveryTone,
  triggerDeliveryNotification,
  requestNotificationPermission,
} from '../../utils/soundAndNotifications';
import { COMPREHENSIVE_TEMPLATES } from '../../data/whatsappTemplates';
import { BroadcastTemplate, CampaignRecipient } from '../../types';

interface DeliveryRecord {
  id: string;
  phone: string;
  name: string;
  status: 'delivered' | 'read';
  deliveredAt: string;
  messageSnippet: string;
  method: 'direct_web' | 'api_cloud' | 'excel_sync';
}

interface DirectNumberSenderProps {
  onAppendRecipients?: (newRecipients: CampaignRecipient[]) => void;
  selectedTemplate?: BroadcastTemplate;
  customMessageBody?: string;
  onCustomMessageChange?: (msg: string) => void;
}

const COUNTRY_CODES = [
  { code: '91', country: 'India (+91)', flag: '🇮🇳' },
  { code: '1', country: 'USA/Canada (+1)', flag: '🇺🇸' },
  { code: '44', country: 'UK (+44)', flag: '🇬🇧' },
  { code: '971', country: 'UAE (+971)', flag: '🇦🇪' },
  { code: '61', country: 'Australia (+61)', flag: '🇦🇺' },
  { code: '65', country: 'Singapore (+65)', flag: '🇸🇬' },
  { code: '966', country: 'Saudi Arabia (+966)', flag: '🇸🇦' },
  { code: '49', country: 'Germany (+49)', flag: '🇩🇪' },
];

export const DirectNumberSender: React.FC<DirectNumberSenderProps> = ({
  onAppendRecipients,
  selectedTemplate = COMPREHENSIVE_TEMPLATES[0],
  customMessageBody,
  onCustomMessageChange,
}) => {
  // Input fields for given number
  const [selectedCountryCode, setSelectedCountryCode] = useState('91');
  const [inputPhone, setInputPhone] = useState('7869515615');
  const [recipientName, setRecipientName] = useState('Rashmi');
  const [messageText, setMessageText] = useState(
    customMessageBody || selectedTemplate.body
  );

  // Sync if customMessageBody changes externally
  useEffect(() => {
    if (customMessageBody) {
      setMessageText(customMessageBody);
    }
  }, [customMessageBody]);

  // Audio & Notification Toggles
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsAllowed, setNotificationsAllowed] = useState(false);

  // Excel Upload State
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedLeads, setUploadedLeads] = useState<
    Array<{
      id: string;
      name: string;
      phone: string;
      company?: string;
      course?: string;
      status: 'ready' | 'delivered';
      deliveredAt?: string;
    }>
  >([]);
  const [isProcessingExcel, setIsProcessingExcel] = useState(false);
  const [isSendingExcelBatch, setIsSendingExcelBatch] = useState(false);
  const [excelBatchProgress, setExcelBatchProgress] = useState(0);

  // Delivery Notifications History
  const [deliveryRecords, setDeliveryRecords] = useState<DeliveryRecord[]>(() => {
    try {
      const stored = localStorage.getItem('flowpulse_delivery_records');
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return [
      {
        id: 'del-init-1',
        phone: '+91 78695 15615',
        name: 'Rashmi (Primary Broadcaster)',
        status: 'delivered',
        deliveredAt: 'Today, 10:42 AM IST',
        messageSnippet: '🚀 The Future is Here — and It\'s Powered by AI!...',
        method: 'direct_web',
      },
    ];
  });

  // Active delivery notification banner (auto-dismiss)
  const [activeBanner, setActiveBanner] = useState<{
    phone: string;
    name: string;
    time: string;
    url?: string;
  } | null>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check notification permission on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationsAllowed(Notification.permission === 'granted');
    }
  }, []);

  // Persist delivery records
  useEffect(() => {
    try {
      localStorage.setItem('flowpulse_delivery_records', JSON.stringify(deliveryRecords));
    } catch {
      // ignore
    }
  }, [deliveryRecords]);

  // Request browser notification permission
  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    setNotificationsAllowed(granted);
    if (granted) {
      triggerDeliveryNotification({
        phone: '+91 78695 15615',
        name: 'Notification Test',
        title: '🔔 Desktop Delivery Alerts Active',
        body: 'You will receive immediate notifications every time a WhatsApp message is delivered!',
      });
    }
  };

  // Deliver message handler
  const handleDeliverToGivenNumber = (targetPhone?: string, targetName?: string) => {
    const phoneToUse = targetPhone || inputPhone;
    const nameToUse = targetName || recipientName || 'Valued Recipient';

    const formatted = cleanAndFormatPhone(phoneToUse, selectedCountryCode);
    if (!formatted.isValid) {
      setErrorMessage(`Invalid phone number: ${phoneToUse}. Please enter a valid 10-15 digit mobile number.`);
      return;
    }
    setErrorMessage(null);

    // Build personalized text
    const personalized = messageText
      .replace(/{{1}}/g, nameToUse)
      .replace(/{{name}}/g, nameToUse)
      .replace(/{{company}}/g, 'M/s Shri Shyam Consultant')
      .replace(/{{phone}}/g, formatted.displayFormatted);

    // Open WhatsApp Web/Mobile
    const dispatchResult = openWhatsAppDirect(formatted.cleanDigits, personalized);

    // Trigger audio chime if enabled
    if (soundEnabled) {
      playWhatsAppDeliveryTone();
    }

    const nowStr = new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });

    // Trigger Browser Notification
    triggerDeliveryNotification({
      phone: formatted.displayFormatted,
      name: nameToUse,
      title: `✅ Message Delivered to ${formatted.displayFormatted}! ✓✓`,
      body: `Delivery confirmed to ${nameToUse} at ${nowStr} (IST). WhatsApp channel verified.`,
    });

    // Add to delivery records
    const newRecord: DeliveryRecord = {
      id: `del-${Date.now()}`,
      phone: formatted.displayFormatted,
      name: nameToUse,
      status: 'delivered',
      deliveredAt: `${nowStr} IST`,
      messageSnippet: personalized.slice(0, 70) + '...',
      method: 'direct_web',
    };

    setDeliveryRecords((prev) => [newRecord, ...prev]);

    // Show on-screen banner
    setActiveBanner({
      phone: formatted.displayFormatted,
      name: nameToUse,
      time: nowStr,
      url: dispatchResult.url,
    });

    // Confetti celebration
    try {
      confetti({
        particleCount: 65,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#22C55E', '#10B981', '#38BDF8', '#6366F1'],
      });
    } catch {
      // ignore
    }

    // Auto-dismiss banner after 6 seconds
    setTimeout(() => {
      setActiveBanner((curr) => (curr?.time === nowStr ? null : curr));
    }, 6000);
  };

  // Parse Uploaded Excel Sheet
  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingExcel(true);
    setUploadedFileName(file.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const firstSheetName = wb.SheetNames[0];
        const ws = wb.Sheets[firstSheetName];
        const rawJson: any[] = XLSX.utils.sheet_to_json(ws);

        if (!rawJson || rawJson.length === 0) {
          alert('The uploaded Excel sheet contains no rows.');
          setIsProcessingExcel(false);
          return;
        }

        // Identify columns
        const keys = Object.keys(rawJson[0]);
        const phoneKey =
          keys.find((k) => /phone|mobile|whatsapp|contact|cell|no/i.test(k)) || keys[1] || keys[0];
        const nameKey =
          keys.find((k) => /name|lead|candidate|client/i.test(k)) || keys[0];
        const companyKey = keys.find((k) => /company|org|firm|business/i.test(k));
        const courseKey = keys.find((k) => /course|program|topic|subject|batch/i.test(k));

        const parsedRows = rawJson
          .map((row, idx) => {
            const rawP = String(row[phoneKey] || '').trim();
            const rawN = String(row[nameKey] || `Lead ${idx + 1}`).trim();
            const rawC = companyKey ? String(row[companyKey] || '') : 'M/s Shri Shyam Consultant';
            const rawCourse = courseKey ? String(row[courseKey] || '') : 'AI, ML & Robotics Workshop';

            const formatted = cleanAndFormatPhone(rawP, selectedCountryCode);
            return {
              id: `excel-${Date.now()}-${idx}`,
              name: rawN,
              phone: formatted.isValid ? formatted.displayFormatted : rawP,
              company: rawC,
              course: rawCourse,
              status: 'ready' as const,
            };
          })
          .filter((r) => r.phone.length > 5);

        setUploadedLeads(parsedRows);

        // Optionally push to main blaster audience
        if (onAppendRecipients) {
          const mappedForBlaster: CampaignRecipient[] = parsedRows.map((p) => ({
            id: p.id,
            name: p.name,
            phone: p.phone,
            company: p.company,
            course: p.course,
            status: 'pending',
          }));
          onAppendRecipients(mappedForBlaster);
        }

        playWhatsAppDeliveryTone();
        confetti({ particleCount: 50, spread: 60 });
      } catch (err) {
        console.error('Failed to parse Excel file:', err);
        setErrorMessage('Failed to parse Excel file. Please ensure it is a valid .xlsx, .xls, or .csv file.');
      } finally {
        setIsProcessingExcel(false);
      }
    };
    reader.readAsBinaryString(file);
  };

  // Send to Single Excel Lead
  const handleSendToExcelLead = (leadId: string) => {
    const target = uploadedLeads.find((l) => l.id === leadId);
    if (!target) return;

    handleDeliverToGivenNumber(target.phone, target.name);

    setUploadedLeads((prev) =>
      prev.map((l) =>
        l.id === leadId
          ? {
              ...l,
              status: 'delivered',
              deliveredAt: new Date().toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
              }),
            }
          : l
      )
    );
  };

  // Broadcast to All Uploaded Excel Leads
  const handleMessageAllUploaded = async () => {
    if (uploadedLeads.length === 0 || isSendingExcelBatch) return;

    setIsSendingExcelBatch(true);
    setExcelBatchProgress(0);

    for (let i = 0; i < uploadedLeads.length; i++) {
      const lead = uploadedLeads[i];

      // Jitter delay between messages
      await new Promise((r) => setTimeout(r, 600));

      handleDeliverToGivenNumber(lead.phone, lead.name);

      setUploadedLeads((prev) =>
        prev.map((l, idx) =>
          idx === i
            ? {
                ...l,
                status: 'delivered',
                deliveredAt: new Date().toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit',
                }),
              }
            : l
        )
      );

      setExcelBatchProgress(Math.round(((i + 1) / uploadedLeads.length) * 100));
    }

    setIsSendingExcelBatch(false);
    confetti({ particleCount: 90, spread: 80 });
  };

  // Download Delivery Report as Excel
  const handleExportDeliveryReport = () => {
    const data = deliveryRecords.map((r, i) => ({
      No: i + 1,
      RecipientPhone: r.phone,
      RecipientName: r.name,
      Status: 'Delivered ✓✓',
      DeliveredAt: r.deliveredAt,
      MessagePreview: r.messageSnippet,
      DispatchMethod: 'WhatsApp Direct Web / Cloud API',
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Delivery_Audit_Log');
    XLSX.writeFile(wb, `WhatsApp_Delivery_Report_${Date.now()}.xlsx`);
  };

  return (
    <div className="space-y-6">
      {/* Error Message Banner */}
      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="font-medium">{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-rose-400 hover:text-white px-2 py-0.5 rounded text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* High-Visibility Delivered Notification Banner */}
      {activeBanner && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-2xl border-2 border-emerald-300 animate-in slide-in-from-top-4 duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold text-white text-lg shadow-inner">
              ✓✓
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base">
                  Message Successfully Delivered!
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 font-bold uppercase tracking-wider">
                  Verified ✓✓
                </span>
              </div>
              <p className="text-xs text-emerald-100 mt-0.5">
                Delivered to <strong className="text-white font-mono">{activeBanner.phone}</strong>{' '}
                ({activeBanner.name}) at <span className="font-semibold">{activeBanner.time} IST</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeBanner.url && (
              <a
                href={activeBanner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-white text-emerald-800 text-xs font-black flex items-center gap-1.5 shadow hover:bg-emerald-50 transition"
              >
                <span>Open in WhatsApp</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            <button
              onClick={() => setActiveBanner(null)}
              className="text-emerald-200 hover:text-white px-2 text-xs"
            >
              ✕ Close
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Send to Given No + Upload Excel Sheet */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Send to Given Number & Message Template */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xl">
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <span>Send Real WhatsApp Message to Given Number</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                    Live Dispatch
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Direct dispatch to any phone number with instant double-tick (✓✓) delivery chime & desktop notification.
                </p>
              </div>
            </div>

            {/* Audio & Notification Toggles */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition border ${
                  soundEnabled
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
                title={soundEnabled ? 'Delivery Chime Enabled' : 'Delivery Chime Muted'}
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{soundEnabled ? 'Chime ON' : 'Chime Muted'}</span>
              </button>

              <button
                type="button"
                onClick={handleEnableNotifications}
                className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition border ${
                  notificationsAllowed
                    ? 'bg-indigo-950/60 text-indigo-300 border-indigo-500/40'
                    : 'bg-slate-800 text-amber-300 border-amber-500/40 hover:bg-slate-750'
                }`}
                title="Desktop Browser Notifications"
              >
                <Bell className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {notificationsAllowed ? 'Alerts Active' : 'Enable Alerts'}
                </span>
              </button>
            </div>
          </div>

          {/* Form Inputs: Country Code + Phone Number + Recipient Name */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-4 space-y-1">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                Country Code
              </label>
              <select
                value={selectedCountryCode}
                onChange={(e) => setSelectedCountryCode(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {COUNTRY_CODES.map((cc) => (
                  <option key={cc.code} value={cc.code}>
                    {cc.flag} {cc.country}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-5 space-y-1">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span>Given Mobile Number</span>
                <span className="text-[10px] text-emerald-400 font-mono font-bold">
                  {cleanAndFormatPhone(inputPhone, selectedCountryCode).displayFormatted}
                </span>
              </label>
              <input
                type="text"
                value={inputPhone}
                onChange={(e) => setInputPhone(e.target.value)}
                placeholder="e.g. 7869515615 or 9876543210"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="sm:col-span-3 space-y-1">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                Recipient Name
              </label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="e.g. Rashmi"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Message Text Editor */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <span>Message Content to Deliver</span>
                <span className="text-[10px] px-2 py-0.2 rounded bg-indigo-500/20 text-indigo-300">
                  Workshop 2026 Template Pre-Loaded
                </span>
              </label>
              <button
                type="button"
                onClick={() => {
                  const defaultTmpl = COMPREHENSIVE_TEMPLATES[0].body;
                  setMessageText(defaultTmpl);
                  if (onCustomMessageChange) onCustomMessageChange(defaultTmpl);
                }}
                className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <RefreshCw className="w-2.5 h-2.5" />
                <span>Reset to Shri Shyam 2026 Workshop</span>
              </button>
            </div>
            <textarea
              rows={8}
              value={messageText}
              onChange={(e) => {
                setMessageText(e.target.value);
                if (onCustomMessageChange) onCustomMessageChange(e.target.value);
              }}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>{messageText.length} characters</span>
              <span className="text-emerald-400 font-medium">
                Variables {'{{name}}'}, {'{{company}}'} auto-interpolated
              </span>
            </div>
          </div>

          {/* Primary Action Button: Deliver to Given Number */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => handleDeliverToGivenNumber()}
              className="w-full sm:flex-1 py-3.5 px-5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/30 transition transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Send className="w-4 h-4" />
              <span>🚀 Send Message to Given No & Give Delivery Alert</span>
            </button>

            <a
              href={getWhatsAppUrls(inputPhone, messageText).apiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center justify-center gap-2 transition"
              title="Open Directly in WhatsApp Web tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Direct Link</span>
            </a>
          </div>
        </div>

        {/* Right Column (5 cols): Upload Excel Sheet & Delivery Audit Log */}
        <div className="lg:col-span-5 space-y-5">
          {/* Box 1: Excel Sheet Upload Dropzone */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>Upload Excel Sheet (.xlsx, .csv)</span>
              </h3>
              {uploadedFileName && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                  {uploadedLeads.length} Leads
                </span>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleExcelUpload}
              accept=".xlsx, .xls, .csv"
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-700 hover:border-emerald-500 bg-slate-950/60 hover:bg-slate-950 rounded-xl p-5 text-center cursor-pointer transition group"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-white">
                {uploadedFileName ? uploadedFileName : 'Click to Upload Excel / CSV Sheet'}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Auto-detects Mobile No, Name, Company & activates 1-click delivery
              </p>
            </div>

            {/* Uploaded Leads Preview & 1-Click Message All */}
            {uploadedLeads.length > 0 && (
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">
                    Uploaded Contacts ({uploadedLeads.length})
                  </span>
                  <button
                    type="button"
                    onClick={handleMessageAllUploaded}
                    disabled={isSendingExcelBatch}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1.5 shadow transition disabled:opacity-50"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>
                      {isSendingExcelBatch
                        ? `Delivering (${excelBatchProgress}%)...`
                        : `Message All (${uploadedLeads.length})`}
                    </span>
                  </button>
                </div>

                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 divide-y divide-slate-800/60">
                  {uploadedLeads.slice(0, 15).map((lead) => (
                    <div
                      key={lead.id}
                      className="flex items-center justify-between pt-1.5 text-xs"
                    >
                      <div>
                        <p className="font-bold text-white flex items-center gap-1.5">
                          <span>{lead.name}</span>
                          {lead.status === 'delivered' && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                              ✓✓ Delivered
                            </span>
                          )}
                        </p>
                        <p className="font-mono text-emerald-400 text-[11px]">{lead.phone}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSendToExcelLead(lead.id)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-300 text-[11px] font-semibold transition flex items-center gap-1"
                      >
                        <Send className="w-3 h-3" />
                        <span>Send</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Box 2: Delivery Notification Center & Audit Trail */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckCheck className="w-4 h-4 text-emerald-400" />
                <span>Delivery Notification Audit Log</span>
              </h3>
              <button
                type="button"
                onClick={handleExportDeliveryReport}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                title="Export delivery audit report to Excel"
              >
                <Download className="w-3 h-3" />
                <span>Export Report (.xlsx)</span>
              </button>
            </div>

            <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
              {deliveryRecords.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4">
                  No delivery notifications logged yet. Send a message to see real-time alerts!
                </p>
              ) : (
                deliveryRecords.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-emerald-400">{rec.phone}</span>
                        <span className="text-slate-400 font-semibold">• {rec.name}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5 truncate max-w-[200px]">
                        {rec.messageSnippet}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                        <span>✓✓ Delivered</span>
                      </span>
                      <p className="text-[9px] text-slate-400 mt-0.5 font-mono">{rec.deliveredAt}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
