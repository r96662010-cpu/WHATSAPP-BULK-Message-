import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  X,
  Phone,
  CheckCircle2,
  CheckCheck,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Briefcase,
  User,
  Clock,
  Laptop,
  Smartphone,
  ChevronRight,
  RotateCcw,
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

export interface WhatsAppDispatcherPayload {
  phone?: string;
  name?: string;
  roleOrCompany?: string;
  templateType?: 'interview' | 'ack' | 'shortlist' | 'offer' | 'custom';
  customMessage?: string;
}

const COUNTRY_CODES = [
  { code: '91', country: 'India (+91)', flag: '🇮🇳' },
  { code: '1', country: 'USA/Canada (+1)', flag: '🇺🇸' },
  { code: '44', country: 'UK (+44)', flag: '🇬🇧' },
  { code: '971', country: 'UAE (+971)', flag: '🇦🇪' },
  { code: '65', country: 'Singapore (+65)', flag: '🇸🇬' },
  { code: '61', country: 'Australia (+61)', flag: '🇦🇺' },
  { code: '966', country: 'Saudi Arabia (+966)', flag: '🇸🇦' },
  { code: '49', country: 'Germany (+49)', flag: '🇩🇪' },
];

export const WhatsAppQuickDispatcherModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [countryCode, setCountryCode] = useState('91');
  const [phoneNumber, setPhoneNumber] = useState('7869515615');
  const [recipientName, setRecipientName] = useState('Rashmi Sondhi');
  const [companyOrRole, setCompanyOrRole] = useState('HR & Talent Acquisition Lead');
  const [activeTemplate, setActiveTemplate] = useState<string>('interview');
  const [messageBody, setMessageBody] = useState('');
  const [copied, setCopied] = useState(false);
  const [lastDispatchedUrl, setLastDispatchedUrl] = useState<string | null>(null);

  // Floating notification state for dispatches across the whole app
  const [floatingNotice, setFloatingNotice] = useState<{
    phone: string;
    waMeUrl: string;
    timestamp: string;
  } | null>(null);

  // Generate templates dynamically
  const getTemplateContent = (
    type: string,
    name: string,
    role: string,
    phone: string
  ): string => {
    const safeName = name.trim() || 'Candidate';
    const safeRole = role.trim() || 'Open Position';
    const safeCompany = 'M/s Shri Shyam Consultant';

    switch (type) {
      case 'interview':
        return `Dear ${safeName},

🎉 Congratulations! Your application for the *${safeRole}* role at *${safeCompany}* has been shortlisted.

We would like to invite you for an Online Technical Interview:
🗓️ Date: Tomorrow / Mutual convenient slot
📍 Mode: Online (Google Meet)
⏱️ Duration: 45 Minutes

Please reply to this WhatsApp message with your preferred time slot between 11:00 AM – 6:00 PM IST.

Warm Regards,
Talent Acquisition Team
${safeCompany}`;

      case 'ack':
        return `Hello ${safeName},

Thank you for applying for the *${safeRole}* position at *${safeCompany}*!

We have successfully received your application, resume, and career details. Our talent acquisition committee is evaluating your background and will update you shortly on next steps.

For any queries, feel free to reply directly to this chat.

Best Regards,
HR Recruitment Cell
${safeCompany}`;

      case 'shortlist':
        return `Hi ${safeName},

Great news from *${safeCompany}*! 🚀

Your profile for *${safeRole}* has successfully advanced to the *Final Review & CTC Discussion Round*.

Our Senior Hiring Director will connect with you via phone/meet shortly. Please keep your updated salary slips and portfolio handy.

Best wishes,
HR Operations`;

      case 'offer':
        return `Hi ${safeName}! 🎁

Exclusive Festive Update from *${safeCompany}*:
We are delighted to share special career tracks & AI Automation workshop privileges with you for *${safeRole}*.

Reply *YES* to receive your official registration pack and joining guidelines.

Regards,
Shri Shyam Consulting Group`;

      case 'custom':
      default:
        return `Hello ${safeName},

We are reaching out to you from *${safeCompany}* regarding your application and profile for *${safeRole}*.

Please let us know when would be a good time to connect.

Best Regards,
HR Team`;
    }
  };

  // Sync initial message body on mount
  useEffect(() => {
    setMessageBody(getTemplateContent(activeTemplate, recipientName, companyOrRole, phoneNumber));
  }, []);

  // Listen to global open dispatcher event
  useEffect(() => {
    const handleOpenEvent = (e: Event) => {
      const customEv = e as CustomEvent<WhatsAppDispatcherPayload>;
      const detail = customEv.detail || {};

      if (detail.phone) {
        // Strip country code if +91
        const clean = detail.phone.replace(/\D/g, '');
        if (clean.startsWith('91') && clean.length > 10) {
          setCountryCode('91');
          setPhoneNumber(clean.slice(2));
        } else if (clean.length === 10) {
          setPhoneNumber(clean);
        } else {
          setPhoneNumber(detail.phone);
        }
      }
      if (detail.name) setRecipientName(detail.name);
      if (detail.roleOrCompany) setCompanyOrRole(detail.roleOrCompany);
      if (detail.templateType) setActiveTemplate(detail.templateType);

      if (detail.customMessage) {
        setMessageBody(detail.customMessage);
      } else {
        const tpl = detail.templateType || activeTemplate;
        setMessageBody(
          getTemplateContent(
            tpl,
            detail.name || recipientName,
            detail.roleOrCompany || companyOrRole,
            detail.phone || phoneNumber
          )
        );
      }

      setIsOpen(true);
    };

    const handleDispatchedEvent = (e: Event) => {
      const customEv = e as CustomEvent<{
        phone: string;
        waMeUrl: string;
        timestamp: string;
      }>;
      if (customEv.detail) {
        setFloatingNotice({
          phone: customEv.detail.phone,
          waMeUrl: customEv.detail.waMeUrl,
          timestamp: customEv.detail.timestamp,
        });

        // Auto-dismiss floating banner after 8 seconds
        setTimeout(() => {
          setFloatingNotice((curr) =>
            curr?.timestamp === customEv.detail.timestamp ? null : curr
          );
        }, 8000);
      }
    };

    window.addEventListener('flowpulse_open_whatsapp_dispatcher', handleOpenEvent);
    window.addEventListener('flowpulse_whatsapp_message_dispatched', handleDispatchedEvent);

    return () => {
      window.removeEventListener('flowpulse_open_whatsapp_dispatcher', handleOpenEvent);
      window.removeEventListener('flowpulse_whatsapp_message_dispatched', handleDispatchedEvent);
    };
  }, [activeTemplate, recipientName, companyOrRole, phoneNumber]);

  // Handle template switch
  const handleSelectTemplate = (type: string) => {
    setActiveTemplate(type);
    setMessageBody(getTemplateContent(type, recipientName, companyOrRole, phoneNumber));
  };

  // URL calculation
  const urls = getWhatsAppUrls(`${countryCode}${phoneNumber}`, messageBody);

  // Send action
  const handleDeliverMessage = (mode: 'wa_me' | 'api' | 'web' | 'app' = 'wa_me') => {
    if (!urls.isValid) return;

    playWhatsAppDeliveryTone();
    triggerDeliveryNotification({
      phone: urls.formattedPhone,
      name: recipientName,
      title: `✅ WhatsApp Delivered to ${urls.formattedPhone}! ✓✓`,
      body: `Message launched to ${recipientName} (${companyOrRole}). Double checkmark verified.`,
    });

    const res = openWhatsAppDirect(urls.cleanPhone, messageBody, mode);
    setLastDispatchedUrl(res.url);

    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#22C55E', '#10B981', '#38BDF8', '#8B5CF6'],
      });
    } catch {
      // ignore
    }
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(messageBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Floating Global Dispatch Bar (Always catches messages and gives 1-click wa.me link) */}
      {floatingNotice && !isOpen && (
        <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-5 duration-300 max-w-sm">
          <div className="bg-slate-900 border-2 border-emerald-500/70 rounded-2xl shadow-2xl p-4 flex items-start gap-3 backdrop-blur-xl">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
              <CheckCheck className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-white flex items-center gap-1">
                  <span>Message Sent to WhatsApp</span>
                  <span className="text-emerald-400">✓✓</span>
                </span>
                <button
                  onClick={() => setFloatingNotice(null)}
                  className="text-slate-400 hover:text-white p-0.5 rounded"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5 truncate font-mono">
                {floatingNotice.phone}
              </p>
              <div className="mt-2.5 flex items-center gap-2">
                <a
                  href={floatingNotice.waMeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open WhatsApp (wa.me)</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main WhatsApp Quick Dispatcher Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-[1px] shadow-lg shadow-emerald-500/20">
                  <div className="w-full h-full bg-slate-950 rounded-[15px] flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-emerald-400" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">
                      Allow Message to Go in WhatsApp
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      Official Meta Direct (wa.me)
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Direct universal Click-to-Chat dispatch with sent notifications, audio chime & instant WhatsApp launch
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: 2 Columns (Form & WhatsApp Chat Preview) */}
            <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
              {/* Left Column: Form & Template Controls (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                {/* Recipient Details */}
                <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                    <span className="flex items-center gap-1.5 text-purple-400">
                      <User className="w-3.5 h-3.5" />
                      Recipient & Contact Info
                    </span>
                    <button
                      onClick={() => {
                        setPhoneNumber('7869515615');
                        setRecipientName('Rashmi Sondhi');
                        setCompanyOrRole('Primary Broadcaster (+91 78695 15615)');
                      }}
                      className="text-[11px] text-emerald-400 hover:underline"
                    >
                      Fill Default Lead
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">
                        Recipient Name
                      </label>
                      <input
                        type="text"
                        value={recipientName}
                        onChange={(e) => {
                          setRecipientName(e.target.value);
                          setMessageBody(
                            getTemplateContent(activeTemplate, e.target.value, companyOrRole, phoneNumber)
                          );
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                        placeholder="e.g. Rahul Sharma"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">
                        Applied Position / Role
                      </label>
                      <input
                        type="text"
                        value={companyOrRole}
                        onChange={(e) => {
                          setCompanyOrRole(e.target.value);
                          setMessageBody(
                            getTemplateContent(activeTemplate, recipientName, e.target.value, phoneNumber)
                          );
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                        placeholder="e.g. Software Engineer"
                      />
                    </div>
                  </div>

                  {/* Phone with Country Code */}
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">
                      WhatsApp Mobile Number
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                      >
                        {COUNTRY_CODES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.flag} +{c.code}
                          </option>
                        ))}
                      </select>
                      <div className="relative flex-1">
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className={`w-full bg-slate-900 border rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none ${
                            urls.isValid
                              ? 'border-emerald-500/60 focus:border-emerald-500'
                              : 'border-rose-500/60 focus:border-rose-500'
                          }`}
                          placeholder="10-digit mobile number"
                        />
                        {urls.isValid && (
                          <span className="absolute right-3 top-2.5 text-[10px] text-emerald-400 font-bold">
                            ✓ Valid
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Template Preset Selector */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-300">
                    Select Quick Message Template
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'interview', label: '💼 Interview Invite', color: 'emerald' },
                      { id: 'ack', label: '🎓 Application Ack', color: 'blue' },
                      { id: 'shortlist', label: '🏆 Shortlist Offer', color: 'purple' },
                      { id: 'offer', label: '🎁 Festive AI Offer', color: 'amber' },
                      { id: 'custom', label: '✍️ Freeform Custom', color: 'slate' },
                    ].map((tpl) => (
                      <button
                        key={tpl.id}
                        onClick={() => handleSelectTemplate(tpl.id)}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold text-left transition border ${
                          activeTemplate === tpl.id
                            ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 shadow-sm'
                            : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        {tpl.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message Body Editor */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-300">
                      WhatsApp Message Body (Supports *bold*, _italics_)
                    </label>
                    <button
                      onClick={handleCopyMessage}
                      className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Text</span>
                        </>
                      )}
                    </button>
                  </div>
                  <textarea
                    rows={6}
                    value={messageBody}
                    onChange={(e) => setMessageBody(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-3 text-xs text-white leading-relaxed placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-sans"
                    placeholder="Type WhatsApp message..."
                  />
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>{messageBody.length} characters</span>
                    <span className="text-emerald-400">✓ Ready to send via Click-to-Chat</span>
                  </div>
                </div>
              </div>

              {/* Right Column: WhatsApp Live Chat Simulation Preview (5 cols) */}
              <div className="lg:col-span-5 flex flex-col">
                <div className="text-xs font-bold text-slate-300 mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Live WhatsApp Recipient View
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Meta Client Preview</span>
                </div>

                {/* Phone Shell */}
                <div className="flex-1 bg-[#0b141a] border border-[#202c33] rounded-3xl shadow-xl overflow-hidden flex flex-col justify-between">
                  {/* WhatsApp Header */}
                  <div className="bg-[#202c33] px-3.5 py-2.5 flex items-center justify-between text-white border-b border-[#2d3a43]">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-bold text-xs text-white shrink-0">
                        {recipientName.charAt(0) || 'R'}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold truncate flex items-center gap-1">
                          <span>{recipientName || 'Candidate'}</span>
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        </div>
                        <div className="text-[10px] text-[#8696a0] truncate font-mono">
                          +{countryCode} {phoneNumber || '...'} • <span className="text-emerald-400">online</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-slate-400">
                      <Phone className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Chat Wallpaper Area */}
                  <div
                    className="flex-1 p-3.5 overflow-y-auto space-y-2 text-slate-100"
                    style={{
                      backgroundImage: `radial-gradient(#1f2c34 1px, transparent 1px)`,
                      backgroundSize: '16px 16px',
                    }}
                  >
                    {/* Encryption notice */}
                    <div className="p-1.5 rounded-lg bg-[#182229] border border-[#222e35] text-[9px] text-[#ffd279] text-center flex items-center justify-center gap-1 shadow-xs">
                      <ShieldCheck className="w-3 h-3 shrink-0" />
                      <span>End-to-end encrypted message</span>
                    </div>

                    {/* Sent Bubble */}
                    <div className="flex justify-end">
                      <div className="max-w-[92%] rounded-2xl rounded-tr-xs bg-[#005c4b] p-3 text-white shadow-md space-y-1.5 border border-[#005c4b]/50">
                        <div className="text-xs leading-relaxed whitespace-pre-wrap font-sans">
                          {messageBody}
                        </div>
                        <div className="flex items-center justify-end gap-1 text-[10px] text-emerald-200/70 pt-0.5">
                          <span>
                            {new Date().toLocaleTimeString('en-IN', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          <CheckCheck className="w-3.5 h-3.5 text-cyan-300" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Guaranteed Action Buttons for Going in WhatsApp */}
                  <div className="p-3 bg-[#111b21] border-t border-[#202c33] space-y-2">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">
                      Launch & Allow Message in WhatsApp
                    </div>

                    {/* Primary Universal Click-to-Chat Link (wa.me) */}
                    <a
                      href={urls.waMeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleDeliverMessage('wa_me')}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition transform active:scale-98 text-center"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Open in WhatsApp (wa.me Direct)</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                    </a>

                    {/* Alternative Channels (Web & App) */}
                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={urls.webUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleDeliverMessage('web')}
                        className="py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition text-center border border-slate-700"
                        title="Open WhatsApp Web on Desktop"
                      >
                        <Laptop className="w-3 h-3 text-emerald-400" />
                        <span>WhatsApp Web</span>
                      </a>

                      <a
                        href={urls.deepLinkUrl}
                        onClick={() => handleDeliverMessage('app')}
                        className="py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition text-center border border-slate-700"
                        title="Launch WhatsApp Native App on Mobile or Mac/PC"
                      >
                        <Smartphone className="w-3 h-3 text-cyan-400" />
                        <span>WhatsApp App</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Audio chime & sent notification triggers automatically upon dispatch</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition"
                >
                  Close
                </button>

                <a
                  href={urls.waMeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    handleDeliverMessage('wa_me');
                    setIsOpen(false);
                  }}
                  className="px-5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow-md transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send & Close</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
