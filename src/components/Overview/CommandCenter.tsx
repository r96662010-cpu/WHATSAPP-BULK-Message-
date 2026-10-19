import React, { useState } from 'react';
import { ActiveTab } from '../Navbar';
import { useAuth } from '../../context/AuthContext';
import { useSecurity } from '../../context/SecurityContext';
import confetti from 'canvas-confetti';
import {
  Layers,
  Workflow,
  Send,
  Bot,
  Users,
  Globe,
  Webhook,
  Sparkles,
  ShieldCheck,
  Play,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  FileSpreadsheet,
  Activity,
  Zap,
  Lock,
  RefreshCw,
  Video,
  Film,
  Share2,
  Megaphone,
  ClipboardList,
} from 'lucide-react';

interface CommandCenterProps {
  onNavigate: (tab: ActiveTab) => void;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({ onNavigate }) => {
  const { user, consumeCredits } = useAuth();
  const { settings } = useSecurity();

  // Full Pipeline Execution Demo State
  const [isRunningPipeline, setIsRunningPipeline] = useState(false);
  const [pipelineStep, setPipelineStep] = useState(0);
  const [pipelineLogs, setPipelineLogs] = useState<string[]>([]);

  const handleRunFullPipeline = async () => {
    if (isRunningPipeline) return;

    consumeCredits(5);
    setIsRunningPipeline(true);
    setPipelineStep(1);
    setPipelineLogs(['🚀 Initiating End-to-End Master Pipeline: Prompt-to-WhatsApp-to-Sheets CRM']);

    // Step 1: Prompt planner
    await new Promise((r) => setTimeout(r, 700));
    setPipelineStep(2);
    setPipelineLogs((prev) => [
      '🤖 [Step 1/5] Gami AI Planner parsed prompt: "WhatsApp Lead Capture & AI Course Counselor"',
      ...prev,
    ]);

    // Step 2: Inbound WhatsApp trigger
    await new Promise((r) => setTimeout(r, 800));
    setPipelineStep(3);
    setPipelineLogs((prev) => [
      '💬 [Step 2/5] Inbound WhatsApp message received from Rahul Gupta (+91 98112 34567)',
      ...prev,
    ]);

    // Step 3: Gemini 3.8 Flash + Memory + Tools
    await new Promise((r) => setTimeout(r, 900));
    setPipelineStep(4);
    setPipelineLogs((prev) => [
      '⚡ [Step 3/5] Gemini 3.8 Flash analyzed intent • Verified seat availability in Courses Catalog Sheet',
      ...prev,
    ]);

    // Step 4: Google Sheets CRM Append
    await new Promise((r) => setTimeout(r, 800));
    setPipelineStep(5);
    setPipelineLogs((prev) => [
      '📊 [Step 4/5] Lead row appended to "Inquiry/Booking Sheet" • Status: Counselor Contacted',
      ...prev,
    ]);

    // Step 5: Anti-Ban Outbound Broadcast
    await new Promise((r) => setTimeout(r, 700));
    setPipelineStep(6);
    setPipelineLogs((prev) => [
      '🛡️ [Step 5/5] Anti-ban throttled reply dispatched with Brochure PDF & Interactive Buttons',
      '🎉 End-to-End Pipeline Executed Successfully • 0 Errors • 5 Credits Deducted',
      ...prev,
    ]);

    setIsRunningPipeline(false);

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#4F46E5', '#10B981', '#06B6D4', '#F59E0B'],
      });
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Hero Welcome Cockpit */}
      <div className="relative overflow-hidden p-6 lg:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                All Systems Active
              </span>
              <span className="text-xs text-slate-400">
                Logged in as <strong className="text-white">{user ? user.name : 'Rashmi Sondhi'}</strong> ({user ? user.email : 'sondhirashmi5@gmail.com'})
              </span>
            </div>
            <h1 className="text-2xl lg:text-4xl font-extrabold text-white tracking-tight">
              FlowPulse AI Command Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Unified workspace for prompt-driven AI workflow automation (Gumloop engine), multi-account WhatsApp broadcast blaster (WP Blaster), 24/7 Shri Shyam AI assistant, and AES-256 encrypted production gateway.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleRunFullPipeline}
              disabled={isRunningPipeline}
              className="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2.5 shadow-xl shadow-emerald-600/25 transition disabled:opacity-50"
            >
              {isRunningPipeline ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Executing Pipeline ({pipelineStep}/5)...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Execute End-to-End Master Pipeline</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Pipeline Execution Progress */}
        {pipelineStep > 0 && (
          <div className="mt-6 pt-5 border-t border-slate-800/80 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                <Activity className="w-4 h-4 animate-pulse" />
                Pipeline Execution Status
              </span>
              <span className="font-mono text-slate-400">
                {pipelineStep === 6 ? 'Completed (100%)' : `Stage ${pipelineStep} of 5`}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-teal-400 to-emerald-400 transition-all duration-500 rounded-full"
                style={{ width: `${Math.min(100, (pipelineStep / 5) * 100)}%` }}
              />
            </div>

            {/* Live Logs ticker */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-slate-300 max-h-24 overflow-y-auto space-y-1">
              {pipelineLogs.map((log, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* KPI Metric Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Workflows</span>
            <Workflow className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-xl font-extrabold text-white">7 Active</p>
          <span className="text-[10px] text-emerald-400 font-semibold">Ready to run</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Broadcasters</span>
            <Send className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xl font-extrabold text-white">3 Accounts</p>
          <span className="text-[10px] text-emerald-400 font-semibold">98% Health Safe</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase">CRM Leads</span>
            <FileSpreadsheet className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-xl font-extrabold text-white">48 Captured</p>
          <span className="text-[10px] text-purple-400 font-semibold">Live Sheets Sync</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Free Credits</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-xl font-extrabold text-white">{user ? user.credits : 2000}</p>
          <span className="text-[10px] text-amber-400 font-semibold">Monthly Reset</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Encryption</span>
            <Lock className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xl font-extrabold text-white">AES-256</p>
          <span className="text-[10px] text-emerald-400 font-semibold">Zero-Knowledge</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Integrations</span>
            <Globe className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-xl font-extrabold text-white">12 Connected</p>
          <span className="text-[10px] text-blue-400 font-semibold">APIs Verified</span>
        </div>
      </div>

      {/* 6 Workspace Hub Launchers */}
      <div>
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-400" />
          All Platform Workspaces & Capabilities
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 1. Workflow Builder */}
          <div
            onClick={() => onNavigate('canvas')}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500 hover:bg-slate-850 cursor-pointer transition flex flex-col justify-between group shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                  <Workflow className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-400">
                  GUMLOOP ENGINE
                </span>
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-indigo-400 transition">
                AI Workflow Builder & Gami Planner
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Chat-to-build prompt automation. Designs, connects, and configures Perplexity Sonar search, Gemini 3.8 Flash LLMs, and email dispatch nodes.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-indigo-400 font-semibold">
              <span>Open Visual Canvas</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* 2. WhatsApp Blaster */}
          <div
            onClick={() => onNavigate('blaster')}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500 hover:bg-slate-850 cursor-pointer transition flex flex-col justify-between group shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <Send className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400">
                  WP BLASTER PLUS
                </span>
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition">
                WhatsApp Message All & 12+ Templates Library
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Launch instant "Message All" broadcasts using 12+ High-Converting Templates (Masterclass, Staffing, Flash Offers, Webinars) with 3-SIM round-robin rotation & anti-ban human jitter.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-emerald-400 font-semibold">
              <span>⚡ Message All & Templates</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* 3. Excel Sheet & Leads Hub */}
          <div
            onClick={() => onNavigate('excel')}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-600 hover:bg-slate-850 cursor-pointer transition flex flex-col justify-between group shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300">
                  XLSX / CSV VAULT
                </span>
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition">
                Excel Sheet & Audience Leads Hub
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Import real .xlsx and .csv files, preview spreadsheet grid with column mapper, and 1-click push into WhatsApp 1,000 Bulk Blaster or Social Ads audiences with AES-256 encryption.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-emerald-400 font-semibold">
              <span>Open Excel Sheet Hub</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* 4. Social Media Cross-Sharer & Ads Platform */}
          <div
            onClick={() => onNavigate('social')}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500 hover:bg-slate-850 cursor-pointer transition flex flex-col justify-between group shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                  <Share2 className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/15 text-blue-400">
                  MULTI-CHANNEL
                </span>
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition">
                Cross-Platform Social & Meta Ads Manager
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Simultaneously broadcast images & videos to Facebook, Instagram, LinkedIn, and X. Run targeted Meta & YouTube Ads with Click-to-WhatsApp (+91 78695 15615) lead routing.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-blue-400 font-semibold">
              <span>Open Social & Ads Platform</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* 5. Recruitment Google Form & Candidate ATS */}
          <div
            onClick={() => onNavigate('recruitment')}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500 hover:bg-slate-850 cursor-pointer transition flex flex-col justify-between group shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/15 text-purple-300">
                  PAN INDIA RECRUITMENT
                </span>
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-purple-400 transition">
                Recruitment Form & Hiring Pipeline
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Full Google Form structure for new openings across PAN India. Features interactive Recharts dashboard visualizing candidate distribution by 'Position Applied For', ATS pipeline tracker, and 1-click Google Apps Script generator.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-purple-400 font-semibold">
              <span>Open Hiring Pipeline & Google Form</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* 5. Admin Control & Governance */}
          <div
            onClick={() => onNavigate('admin')}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500 hover:bg-slate-850 cursor-pointer transition flex flex-col justify-between group shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300">
                  GOOGLE SSO RBAC
                </span>
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-indigo-400 transition">
                Admin Control & Team Governance
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Manage team members signed in with Google, grant/revoke Admin rights, allocate WhatsApp daily quotas and ad budgets, and inspect encrypted system audit logs.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-indigo-400 font-semibold">
              <span>Open Admin Control</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* 3. AI Agent Simulator */}
          <div
            onClick={() => onNavigate('agent')}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500 hover:bg-slate-850 cursor-pointer transition flex flex-col justify-between group shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/15 text-purple-400">
                  24/7 AI AGENT
                </span>
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-purple-400 transition">
                Shri Shyam AI Assistant & Phone Simulator
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Interactive real-time phone simulator. Gemini 3.8 Flash answers inquiries, queries course catalogs, and appends rows to Google Sheets CRM.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-purple-400 font-semibold">
              <span>Open Simulator & Sheets</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* 4. Blaster Utilities */}
          <div
            onClick={() => onNavigate('utilities')}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500 hover:bg-slate-850 cursor-pointer transition flex flex-col justify-between group shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-400">
                  GROWTH UTILITIES
                </span>
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition">
                Group Scraper, Number Filter & SIM Warmer
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Scrape participant numbers from WhatsApp groups, clean invalid contacts, and warm up new numbers with automated peer conversations.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-cyan-400 font-semibold">
              <span>Open Growth Utilities</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* 5. Integrations */}
          <div
            onClick={() => onNavigate('integrations')}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500 hover:bg-slate-850 cursor-pointer transition flex flex-col justify-between group shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                  <Globe className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/15 text-blue-400">
                  12 CONNECTORS
                </span>
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition">
                Integrations Ecosystem & API Keys
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Connect GitHub, Salesforce, HubSpot, Gmail, Google Sheets, Google Ads, WordPress, Twitter, and Amazon S3 with encrypted credential vaults.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-blue-400 font-semibold">
              <span>Manage Integrations</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* 6. Production & Encryption Gateway */}
          <div
            onClick={() => onNavigate('gateway')}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-600 hover:bg-slate-850 cursor-pointer transition flex flex-col justify-between group shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center border border-slate-700">
                  <Webhook className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  AES-256 E2EE
                </span>
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-slate-200 transition">
                Webhooks, Security & Disaster Recovery
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Production architecture specs, Bearer JWT validation, rate limiting, interactive webhook test runner, and AES-256 encryption key rotation.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300 font-semibold">
              <span>View Security Specs</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* 7. YouTube Free Video & Image Studio */}
          <div
            onClick={() => onNavigate('media')}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-red-500 hover:bg-slate-850 cursor-pointer transition flex flex-col justify-between group shadow-sm md:col-span-2 lg:col-span-3 bg-gradient-to-r from-red-950/25 via-slate-900 to-purple-950/25 border-red-500/30"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center border border-red-500/30">
                  <Film className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    100% FREE • NO CHARGE APPLICABLE
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/15 text-red-400 border border-red-500/30">
                    YOUTUBE SHORTS & ANIMATED VIDEOS
                  </span>
                </div>
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-red-400 transition flex items-center gap-2">
                <span>Free YouTube Video Maker, Animated Videos & AI Image Generator</span>
                <span className="text-xs text-emerald-400 font-normal">($0 / Free Forever)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Generate YouTube Shorts (9:16) & Landscape (16:9) video storyboards, record and download animated scenes with smooth kinetic typography & voiceover narration, and generate high-CTR thumbnail graphics with zero subscription fees and commercial rights included.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-red-400 font-semibold">
              <span>Launch Free Video Maker & Image Generator</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>
        </div>
      </div>

      {/* System Latency & Operational Health Monitor */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            Real-Time System Health & Service Telemetry
          </h3>
          <span className="text-[11px] text-emerald-400 font-mono">100% Operational</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-[11px]">Gemini 3.8 Flash</p>
              <p className="font-bold text-white mt-0.5">280ms Latency</p>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-[11px]">WhatsApp Cloud API</p>
              <p className="font-bold text-white mt-0.5">410ms Delivery</p>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-[11px]">Google Sheets Sync</p>
              <p className="font-bold text-white mt-0.5">Real-Time Row Append</p>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-[11px]">E2EE Vault Engine</p>
              <p className="font-bold text-white mt-0.5">AES-256-GCM Active</p>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </div>
        </div>
      </div>
    </div>
  );
};
