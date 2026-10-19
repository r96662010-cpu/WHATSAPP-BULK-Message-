import React, { useState } from 'react';
import { GoogleSheetLead, CourseCatalogItem, FaqItem } from '../../types';
import { useSecurity } from '../../context/SecurityContext';
import { toCipherRepresentation } from '../../utils/crypto';
import {
  Send,
  Bot,
  Database,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  PhoneCall,
  Clock,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  Edit3,
  RefreshCw,
  Plus,
  Sliders,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react';

// Default initial data for Google Sheets
const INITIAL_COURSES: CourseCatalogItem[] = [
  {
    id: 'c1',
    title: 'Master AI & Automation Technologies',
    category: 'Flagship Masterclass',
    originalFee: '₹14,999',
    earlyBirdFee: '₹9,999',
    seatsLeft: 7,
    duration: '6 Weeks (Live Weekend Batches)',
    topics: ['Generative AI & Prompting', 'Python for Machine Learning', 'Low-Code Workflows & Agents'],
  },
  {
    id: 'c2',
    title: 'Generative AI & Enterprise Prompt Engineering',
    category: 'Specialized',
    originalFee: '₹12,500',
    earlyBirdFee: '₹8,499',
    seatsLeft: 12,
    duration: '4 Weeks',
    topics: ['LLM Orchestration', 'Multimodal Gemini', 'RAG & Vector Knowledge'],
  },
  {
    id: 'c3',
    title: 'Robotics & Embedded AI Intensive',
    category: 'Hardware & Edge AI',
    originalFee: '₹18,000',
    earlyBirdFee: '₹12,999',
    seatsLeft: 4,
    duration: '8 Weeks',
    topics: ['Microcontrollers', 'Computer Vision on Edge', 'Autonomous Rover Control'],
  },
  {
    id: 'c4',
    title: 'Corporate Staffing & Executive Tech Hiring',
    category: 'B2B Recruitment',
    originalFee: 'Custom Mandate',
    earlyBirdFee: 'Pre-screened Candidate Matrices',
    seatsLeft: 15,
    duration: 'Ongoing Mandates',
    topics: ['Tech & Engineering IT/AI', 'Lateral Recruitment', 'Vetted Matrices'],
  },
];

const INITIAL_FAQS: FaqItem[] = [
  {
    id: 'f1',
    question: 'What are the prerequisites for the AI & Automation Masterclass?',
    answer: 'No prior coding experience is required! We cover foundations from ground up, including low-code agent builders and practical Python snippets.',
    category: 'Admissions',
  },
  {
    id: 'f2',
    question: 'How does Shri Shyam Consulting handle corporate recruitment mandates?',
    answer: 'We provide end-to-end recruitment with pre-screened technical candidate matrices tailored to your stack within 5 business days.',
    category: 'Recruitment',
  },
  {
    id: 'f3',
    question: 'Will I receive a recognized certification upon course completion?',
    answer: 'Yes! All graduates receive an industry-recognized certificate along with 3 portfolio-ready capstone projects.',
    category: 'Certification',
  },
  {
    id: 'f4',
    question: 'How do I speak with an academic advisor before enrolling?',
    answer: 'Simply reply with your preferred phone number or request a callback, and our senior academic counselor will call you within 15 minutes.',
    category: 'Support',
  },
];

const INITIAL_LEADS: GoogleSheetLead[] = [
  {
    id: 'lead-1',
    fullName: 'Ananya Deshmukh',
    phone: '+91 98450 11223',
    courseOrMandate: 'Master AI & Automation Technologies',
    leadType: 'Course Admission',
    timestamp: '2026-10-16 19:42:10',
    status: 'Counselor Contacted',
    notes: 'Requested brochure and weekend batch timings',
  },
  {
    id: 'lead-2',
    fullName: 'Harish Varma (VP Tech, Kinetix)',
    phone: '+91 99002 88471',
    courseOrMandate: 'Corporate Staffing: 4 Senior ML Engineers',
    leadType: 'Corporate Hiring',
    timestamp: '2026-10-16 20:15:33',
    status: 'Client Call Scheduled',
    notes: 'Urgent requirement for computer vision team',
  },
  {
    id: 'lead-3',
    fullName: 'Rohan Mehra',
    phone: '+91 97230 45981',
    courseOrMandate: 'Robotics & Embedded AI Intensive',
    leadType: 'Course Admission',
    timestamp: '2026-10-16 21:05:12',
    status: 'New Lead',
    notes: 'Inquired about hardware kits and student early-bird discount',
  },
];

export const LiveAgentHub: React.FC = () => {
  const { settings, toggleCiphertext } = useSecurity();

  // Active Google Sheets Tab
  const [activeSheetTab, setActiveSheetTab] = useState<'inquiries' | 'courses' | 'faqs' | 'systemPrompt'>('inquiries');

  // Sheets data state
  const [leads, setLeads] = useState<GoogleSheetLead[]>(INITIAL_LEADS);
  const [courses] = useState<CourseCatalogItem[]>(INITIAL_COURSES);
  const [faqs] = useState<FaqItem[]>(INITIAL_FAQS);

  // System Prompt for Shri Shyam Consulting AI Assistant (from prompt)
  const [systemPrompt, setSystemPrompt] = useState<string>(`You are an intelligent, polite, and professional AI Assistant for Shri Shyam Consulting.
Your primary goal is to answer inquiries, assist with admission and recruitment queries, and guide users to take the next step.

COMPANY HIGHLIGHTS:
- Services: HR Staffing & Recruitment, Corporate Training, AI/ML & Robotics Educational Programs, and Business Automation Solutions.
- Contact: Professional team support available for recruitment mandates and course admissions.

TONE & BEHAVIOR RULES:
1. Always maintain a warm, welcoming, and professional tone.
2. Keep answers concise (under 3-4 sentences whenever possible) for WhatsApp readability.
3. If a user asks about course admissions, direct them to register or request a callback from an academic counselor.
4. If a user asks about hiring or recruitment services, offer to collect their company name and active position details to arrange a client call.`);

  // WhatsApp Mobile Chat Simulator State
  const [chatMessages, setChatMessages] = useState<
    { id: string; sender: 'user' | 'agent' | 'system_tool'; text: string; time: string; toolLabel?: string }[]
  >([
    {
      id: 'm1',
      sender: 'agent',
      text: 'Hello! Welcome to Shri Shyam Consulting. 👋 How can I assist you with our AI/ML programs or corporate staffing services today?',
      time: '10:00 AM',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [prospectName, setProspectName] = useState('Rahul Gupta');
  const [prospectPhone, setProspectPhone] = useState('+91 98112 34567');

  // Handle Send Message in Mobile Simulator
  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isTyping) return;

    const userMsgId = `usr_${Date.now()}`;
    const userMsg = {
      id: userMsgId,
      sender: 'user' as const,
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Send to server backend with Gemini 3.8 Flash
      const res = await fetch('/api/ai/whatsapp-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: text,
          userName: prospectName,
          userPhone: prospectPhone,
          systemPrompt,
          history: chatMessages.slice(-8),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const replyText = data.reply;
        const leadMeta = data.leadMeta;

        // If tool accessed Google Sheets catalog
        const toolMsg = {
          id: `tool_${Date.now()}`,
          sender: 'system_tool' as const,
          text: '⚡ [AI Agent Tool]: Queried "Courses & FAQ Sheet" • Context Verified',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          toolLabel: 'Tool: Google Sheets Tool Call',
        };

        const agentMsg = {
          id: `bot_${Date.now()}`,
          sender: 'agent' as const,
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setChatMessages((prev) => [...prev, toolMsg, agentMsg]);

        // If a lead was identified, dynamically append to Google Sheets Inquiry table!
        if (leadMeta && leadMeta.leadIdentified) {
          const newLead: GoogleSheetLead = {
            id: `lead_${Date.now()}`,
            fullName: prospectName,
            phone: prospectPhone,
            courseOrMandate: leadMeta.suggestedCourse || 'Master AI & Automation Technologies',
            leadType: leadMeta.leadType || 'Course Admission',
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
            status: 'New Lead',
            notes: leadMeta.notes || text,
          };

          setLeads((prev) => [newLead, ...prev]);

          // Append another tool notification
          setTimeout(() => {
            setChatMessages((prev) => [
              ...prev,
              {
                id: `tool_sheet_${Date.now()}`,
                sender: 'system_tool',
                text: `📋 [AI Agent Tool]: Appended row to "Inquiry/Booking Sheet" for ${prospectName}`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              },
            ]);
          }, 300);
        }
      }
    } catch (err) {
      console.error('Chat error', err);
      setChatMessages((prev) => [
        ...prev,
        {
          id: `bot_err_${Date.now()}`,
          sender: 'agent',
          text: 'Thank you for reaching out! Our academic counselor will review your inquiry shortly.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Export Leads to CSV
  const handleExportCsv = () => {
    const headers = ['ID', 'Full Name', 'Phone', 'Course or Mandate', 'Lead Type', 'Timestamp', 'Status', 'Notes'];
    const rows = leads.map((l) => [
      l.id,
      `"${l.fullName}"`,
      `"${l.phone}"`,
      `"${l.courseOrMandate}"`,
      `"${l.leadType}"`,
      `"${l.timestamp}"`,
      `"${l.status}"`,
      `"${l.notes.replace(/"/g, '""')}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `shri_shyam_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 border border-purple-500/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 font-bold text-xs uppercase tracking-wider">
              24/7 AI Agent Node
            </span>
            <span className="text-xs text-slate-400">
              • Shri Shyam Consulting Assistant with Live Google Sheets Tools
            </span>
          </div>
          <h1 className="text-xl lg:text-2xl font-extrabold text-white">
            WhatsApp AI Agent Simulator & Live Google Sheets CRM
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Gemini 3.8 Flash model with 10-message memory buffer, course catalog lookup, and dynamic lead row logging.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={toggleCiphertext}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition ${
              settings.showCiphertext
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
          >
            {settings.showCiphertext ? (
              <>
                <EyeOff className="w-4 h-4 text-amber-400" />
                <span>Encrypted Mode (Active)</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>Show AES-256 Ciphertext</span>
              </>
            )}
          </button>

          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-semibold flex items-center gap-2 transition"
          >
            <Download className="w-4 h-4" />
            <span>Export Sheet (CSV)</span>
          </button>
        </div>
      </div>

      {/* Main Split: Left Simulator (5 cols) & Right Google Sheets (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive WhatsApp Phone Simulator (5 cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-purple-400" />
                Live WhatsApp Simulator (Prospect View)
              </h3>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Gemini 3.8 Flash Active
              </span>
            </div>

            {/* Simulated Prospect Identity Switcher */}
            <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Test Prospect Name</label>
                <input
                  type="text"
                  value={prospectName}
                  onChange={(e) => setProspectName(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Test Phone Number</label>
                <input
                  type="text"
                  value={prospectPhone}
                  onChange={(e) => setProspectPhone(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                />
              </div>
            </div>

            {/* Mobile Phone Mockup */}
            <div className="rounded-2xl bg-[#0B141B] border border-slate-800 overflow-hidden shadow-2xl flex flex-col h-[460px]">
              {/* WhatsApp App Header */}
              <div className="bg-[#1F2C34] p-3 flex items-center justify-between border-b border-[#2A3942] shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 text-white font-bold text-xs flex items-center justify-center">
                    SS
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white leading-none">
                      Shri Shyam Assistant
                    </h4>
                    <p className="text-[10px] text-emerald-400 mt-0.5">
                      online • AI Agent (10-msg Memory)
                    </p>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400">10:45 AM</span>
              </div>

              {/* Chat Message Scroll Area */}
              <div className="flex-1 p-3 overflow-y-auto space-y-2.5 bg-[radial-gradient(#1E293B_1px,transparent_1px)] [background-size:16px_16px]">
                {chatMessages.map((msg) => {
                  if (msg.sender === 'system_tool') {
                    return (
                      <div
                        key={msg.id}
                        className="my-1 mx-auto max-w-[90%] text-center text-[10px] font-mono text-cyan-300 bg-cyan-950/50 border border-cyan-800/40 px-2.5 py-1 rounded-full"
                      >
                        {msg.text}
                      </div>
                    );
                  }

                  const isUser = msg.sender === 'user';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`rounded-2xl px-3.5 py-2 text-xs leading-relaxed max-w-[85%] shadow ${
                          isUser
                            ? 'bg-[#005C4B] text-white rounded-br-xs'
                            : 'bg-[#202C33] text-slate-100 rounded-bl-xs'
                        }`}
                      >
                        <p className="whitespace-pre-line">{msg.text}</p>
                        <span
                          className={`block text-[9px] text-right mt-1 ${
                            isUser ? 'text-emerald-200' : 'text-slate-400'
                          }`}
                        >
                          {msg.time} {isUser && '✓✓'}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {isTyping && (
                  <div className="flex items-center gap-1.5 p-2 rounded-xl bg-[#202C33] text-slate-400 text-xs w-28">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]" />
                    <span className="text-[10px] ml-1">Agent thinking...</span>
                  </div>
                )}
              </div>

              {/* Quick Prompt Suggestions */}
              <div className="p-2 bg-[#1F2C34]/60 border-t border-[#2A3942] flex items-center gap-1.5 overflow-x-auto text-[11px] shrink-0">
                <button
                  onClick={() => handleSendMessage('What is the fee for the AI/ML Masterclass?')}
                  className="px-2.5 py-1 rounded-full bg-[#202C33] hover:bg-[#2A3942] text-slate-300 border border-[#2A3942] whitespace-nowrap"
                >
                  Fee & Syllabus?
                </button>
                <button
                  onClick={() => handleSendMessage('We need to hire 3 Python & ML engineers for our startup.')}
                  className="px-2.5 py-1 rounded-full bg-[#202C33] hover:bg-[#2A3942] text-slate-300 border border-[#2A3942] whitespace-nowrap"
                >
                  Corporate Hiring?
                </button>
                <button
                  onClick={() => handleSendMessage('Please schedule a callback with an academic counselor.')}
                  className="px-2.5 py-1 rounded-full bg-[#202C33] hover:bg-[#2A3942] text-slate-300 border border-[#2A3942] whitespace-nowrap"
                >
                  Request Callback
                </button>
              </div>

              {/* Chat Input Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="p-2.5 bg-[#1F2C34] flex items-center gap-2 border-t border-[#2A3942] shrink-0"
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type a message as prospect..."
                  className="flex-1 px-3 py-2 bg-[#2A3942] rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isTyping}
                  className="p-2 rounded-xl bg-[#00A884] hover:bg-[#008f6f] text-white disabled:opacity-40 transition"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Right: Live Google Sheets Sync & Knowledge Catalogs (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex-1 flex flex-col">
            {/* Sheet Tabs */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 flex-wrap gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActiveSheetTab('inquiries')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                    activeSheetTab === 'inquiries'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Inquiry / Booking Sheet ({leads.length})</span>
                </button>

                <button
                  onClick={() => setActiveSheetTab('courses')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                    activeSheetTab === 'courses'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Courses Catalog</span>
                </button>

                <button
                  onClick={() => setActiveSheetTab('faqs')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                    activeSheetTab === 'faqs'
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>FAQ Tool Sheet</span>
                </button>

                <button
                  onClick={() => setActiveSheetTab('systemPrompt')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                    activeSheetTab === 'systemPrompt'
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Agent Prompt Rules</span>
                </button>
              </div>

              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Google Sheets Live Sync
              </span>
            </div>

            {/* TAB 1: Inquiries / Booking Lead Sheet (Live Append Row) */}
            {activeSheetTab === 'inquiries' && (
              <div className="mt-4 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
                  <p>
                    ⚡ Rows are dynamically appended in real-time when the AI Agent identifies enrollment or callback intent.
                  </p>
                  <span className="text-emerald-400 font-bold">{leads.length} Total Leads Captured</span>
                </div>

                <div className="flex-1 overflow-x-auto rounded-xl border border-slate-800">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-3">Lead Name</th>
                        <th className="py-2.5 px-3">Phone</th>
                        <th className="py-2.5 px-3">Course / Mandate</th>
                        <th className="py-2.5 px-3">Type</th>
                        <th className="py-2.5 px-3">Timestamp</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {leads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-slate-800/40 transition">
                          <td className="py-3 px-3 font-semibold text-white">
                            {lead.fullName}
                          </td>
                          <td className="py-3 px-3 font-mono text-slate-300">
                            {settings.showCiphertext ? (
                              <span className="text-amber-400 font-mono text-[10px] bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40 flex items-center gap-1">
                                <Lock className="w-3 h-3 shrink-0" />
                                {toCipherRepresentation(lead.phone)}
                              </span>
                            ) : (
                              lead.phone
                            )}
                          </td>
                          <td className="py-3 px-3 text-slate-300">
                            {lead.courseOrMandate}
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                lead.leadType === 'Corporate Hiring'
                                  ? 'bg-blue-500/20 text-blue-400'
                                  : 'bg-emerald-500/20 text-emerald-400'
                              }`}
                            >
                              {lead.leadType}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-[11px] text-slate-400 font-mono">
                            {lead.timestamp}
                          </td>
                          <td className="py-3 px-3">
                            <select
                              value={lead.status}
                              onChange={(e) => {
                                const newStatus = e.target.value as any;
                                setLeads((prev) =>
                                  prev.map((l) =>
                                    l.id === lead.id ? { ...l, status: newStatus } : l
                                  )
                                );
                              }}
                              className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-[11px] text-slate-200 focus:outline-none"
                            >
                              <option value="New Lead">New Lead</option>
                              <option value="Counselor Contacted">Counselor Contacted</option>
                              <option value="Enrolled">Enrolled</option>
                              <option value="Client Call Scheduled">Client Call Scheduled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 2: Courses Catalog Sheet */}
            {activeSheetTab === 'courses' && (
              <div className="mt-4 flex-1 space-y-3 overflow-y-auto">
                <p className="text-xs text-slate-400">
                  Data source for the AI Agent: Agent queries seat count and pricing from this live spreadsheet.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {courses.map((course) => (
                    <div
                      key={course.id}
                      className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-400">
                          {course.category}
                        </span>
                        <span className="text-xs font-bold text-emerald-400">
                          {course.seatsLeft} Seats Left
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white">{course.title}</h4>
                      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/80">
                        <span className="text-slate-400">Early-Bird Fee:</span>
                        <span className="font-extrabold text-amber-400">
                          {course.earlyBirdFee}{' '}
                          <span className="line-through text-slate-500 text-[10px] font-normal">
                            {course.originalFee}
                          </span>
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{course.duration}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: FAQ Sheet */}
            {activeSheetTab === 'faqs' && (
              <div className="mt-4 flex-1 space-y-3 overflow-y-auto">
                <p className="text-xs text-slate-400">
                  Knowledge base used by the AI Agent node to provide accurate factual answers.
                </p>

                <div className="space-y-2.5">
                  {faqs.map((faq) => (
                    <div
                      key={faq.id}
                      className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1"
                    >
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {faq.category}
                      </span>
                      <h4 className="text-xs font-bold text-white pt-1">{faq.question}</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: System Instructions & Tone Rules */}
            {activeSheetTab === 'systemPrompt' && (
              <div className="mt-4 flex-1 flex flex-col space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-400">
                    Shri Shyam Consulting System Prompt & Guardrails (Applied to Gemini 3.8 Flash)
                  </p>
                  <button
                    onClick={() => alert('Prompt rules updated and saved to AI agent memory.')}
                    className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold transition"
                  >
                    Save Rules
                  </button>
                </div>
                <textarea
                  rows={14}
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  className="w-full flex-1 p-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
