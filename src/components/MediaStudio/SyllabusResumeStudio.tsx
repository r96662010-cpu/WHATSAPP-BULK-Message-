import React, { useState } from 'react';
import { CourseSyllabus, CandidateResume, YouTubeVideoProject } from '../../types';
import confetti from 'canvas-confetti';
import {
  FileText,
  Briefcase,
  Sparkles,
  Download,
  Copy,
  CheckCircle2,
  Video,
  Send,
  BookOpen,
  Award,
  Layers,
  ChevronRight,
  TrendingUp,
  Share2,
  RefreshCw,
  Printer,
  Wand2,
  GraduationCap,
  Star,
} from 'lucide-react';

const PRESET_SYLLABUSES: CourseSyllabus[] = [
  {
    id: 'syl-ai-masterclass-2026',
    courseTitle: 'Master AI & Low-Code Automation Technologies (2026 Edition)',
    category: 'AI & Machine Learning',
    targetAudience: 'Software Engineers, Technical Founders & Growth Marketers',
    durationWeeks: 6,
    totalHours: 48,
    overview:
      'A comprehensive production-grade immersion covering Generative AI, Gemini 3.8 Flash LLMs, Prompt Engineering, Autonomous Multi-Tool Agents, and Multi-SIM WhatsApp Automation Infrastructure.',
    careerOutcomes: [
      'Certified Generative AI Automation Architect',
      'Deploy 24/7 autonomous lead capture agents on WhatsApp',
      'Build end-to-end multi-tool pipelines with Google Sheets CRM integration',
      'Earn ₹18 - ₹35 LPA in high-demand Enterprise Automation roles',
    ],
    videoPitchScript:
      'Hey everyone! Ready to 10x your software output? In our flagship 6-Week Masterclass in AI and Automation, you will build real autonomous agents that capture 10,000+ leads without code. Tap below to download the syllabus or chat with counselor Rashmi Sondhi!',
    createdAt: '2026-10-18',
    modules: [
      {
        week: 1,
        title: 'Foundations of Modern AI & Prompt Engineering',
        description: 'Master system instructions, few-shot conditioning, temperature tuning, and structured JSON generation.',
        topics: ['Gemini 3.8 Flash Models', 'Few-Shot Conditioning', 'JSON Schema Enforcement', 'Prompt Optimization'],
        practicalProject: 'Build an automated lead qualification prompt engine',
        durationHours: 8,
      },
      {
        week: 2,
        title: 'Autonomous Multi-Tool Agents & Grounding',
        description: 'Connect LLMs to external APIs, Google Search grounding, and session memory stores.',
        topics: ['Function Calling Tools', 'Google Search Grounding', 'Conversation Memory', 'Error Fallback Chains'],
        practicalProject: 'Deploy a 24/7 WhatsApp consultation bot with live course lookups',
        durationHours: 8,
      },
      {
        week: 3,
        title: 'Multi-Account WhatsApp Blaster & Anti-Ban Architecture',
        description: 'Understand official Cloud APIs, multi-device QR pairing, round-robin SIM rotation, and deliverability.',
        topics: ['3-SIM Round Robin', 'Human Jitter Delay Algorithms', 'Message Template Variables', 'Health Score Auditing'],
        practicalProject: 'Dispatch a 1,000-message bulk blast with zero account restrictions',
        durationHours: 8,
      },
      {
        week: 4,
        title: 'Veo 3 & Grok Generative Media Production',
        description: 'Generate viral YouTube Shorts, animated storyboards, and commercial video ads using Veo 3 & Grok styling.',
        topics: ['Text-to-Video Storyboarding', 'Image-to-Video Parallax', 'Kinetic Typography', 'High-CTR Thumbnails'],
        practicalProject: 'Produce and render a 60-second animated commercial video ad',
        durationHours: 8,
      },
      {
        week: 5,
        title: 'Full-Stack Workflow Architecture & Security Vaults',
        description: 'Build production gateways with Express, Vite, and hardware-accelerated AES-256-GCM encryption.',
        topics: ['AES-256-GCM Vaults', 'Bearer JWT Verification', 'Rate Limiting & Webhooks', 'Disaster Recovery'],
        practicalProject: 'Deploy an enterprise production gateway with cryptographic key rotation',
        durationHours: 8,
      },
      {
        week: 6,
        title: 'Capstone Project & Client Placement',
        description: 'Deliver an enterprise client automation mandate with live demonstration and corporate certification.',
        topics: ['Client SLAs & Mandates', 'Live Production Rollout', 'Corporate Portfolio Review', 'Job Placement Prep'],
        practicalProject: 'Live demonstration of full pipeline to hiring partners and corporate sponsors',
        durationHours: 8,
      },
    ],
  },
  {
    id: 'syl-corporate-recruitment',
    courseTitle: 'Executive Tech Staffing & AI Talent Acquisition Matrix',
    category: 'Corporate Training',
    targetAudience: 'HR Directors, Talent Acquisition Leads & Recruitment Agency Owners',
    durationWeeks: 4,
    totalHours: 32,
    overview:
      'Master specialized engineering headhunting, AI candidate screening matrices, ATS keyword ranking, and automated candidate nurturing on WhatsApp.',
    careerOutcomes: [
      'Fill senior engineering mandates within 72 hours',
      'Deploy automated WhatsApp interview scheduling pipelines',
      'Build ATS-optimized candidate benchmark scoring engines',
    ],
    videoPitchScript:
      'Finding senior AI and full-stack talent should not take months. Shri Shyam Consulting teaches talent partners how to leverage autonomous candidate matrices to close mandates in 72 hours. Download the curriculum today!',
    createdAt: '2026-10-15',
    modules: [
      {
        week: 1,
        title: 'Technical Role Deconstruction & Boolean Talent Sourcing',
        description: 'Deconstruct complex engineering job descriptions into precise talent search strings.',
        topics: ['AI Engineer Competencies', 'GitHub & LinkedIn X-Ray', 'Salary Benchmarking', 'Candidate Filtering'],
        practicalProject: 'Source 50 pre-qualified senior engineer profiles for an active mandate',
        durationHours: 8,
      },
      {
        week: 2,
        title: 'WhatsApp Automation for Candidate Outreach',
        description: 'High-response recruiter templates, automated pre-screening questionnaires, and calendar booking.',
        topics: ['Personalized Variable Outreach', 'Interactive Quick-Reply Screening', 'Interview Calendar Sync'],
        practicalProject: 'Launch candidate outreach campaign achieving 65%+ response rate',
        durationHours: 8,
      },
      {
        week: 3,
        title: 'ATS Scoring, Verification & Candidate Matrices',
        description: 'Score resumes against technical benchmarks, verify credentials, and prepare one-page matrices.',
        topics: ['ATS Parsing Algorithms', 'Skill Fit Ratio', 'Client Presentation Formats', 'Reference Verification'],
        practicalProject: 'Create a client-ready candidate matrix with video portfolio links',
        durationHours: 8,
      },
      {
        week: 4,
        title: 'Corporate Mandate Closing & Offer Negotiation',
        description: 'Manage counter-offers, notice period buyouts, and client SLA guarantees.',
        topics: ['Offer Letter Structuring', 'Retention Strategies', 'Post-Placement Follow-ups'],
        practicalProject: 'Execute simulated executive placement with full corporate documentation',
        durationHours: 8,
      },
    ],
  },
];

const PRESET_RESUMES: CandidateResume[] = [
  {
    id: 'res-rashmi-sondhi',
    fullName: 'Rashmi Sondhi',
    targetRole: 'Lead AI Automation Architect & Consultant',
    contact: {
      email: 'sondhirashmi5@gmail.com',
      phone: '+91 78695 15615',
      location: 'Bengaluru / Delhi NCR, India',
      linkedin: 'linkedin.com/in/rashmi-sondhi-ai',
    },
    atsScore: 98,
    matchedSyllabusId: 'syl-ai-masterclass-2026',
    professionalSummary:
      'Distinguished AI Automation Architect with 6+ years designing enterprise low-code pipelines, autonomous LLM agents with Gemini 3.8 Flash, and high-throughput multi-SIM WhatsApp marketing systems. Built systems processing 100,000+ monthly interactions with 99.4% deliverability and AES-256 data protection.',
    coreSkills: [
      'Generative AI & LLM Agents',
      'WhatsApp Cloud API Automation',
      'Prompt Optimization & Grounding',
      'Veo 3 & Grok Video Synthesis',
      'AES-256 Cryptographic Architecture',
      'High-Speed Conversion Funnels',
    ],
    toolsAndFrameworks: [
      'Gemini 3.8 Flash',
      'TypeScript / React / Vite',
      'Node.js / Express',
      'Google Sheets CRM & Cloud SQL',
      'Tailwind CSS',
      'Canvas Confetti & Motion',
    ],
    workExperience: [
      {
        company: 'Shri Shyam Consulting',
        role: 'Founder & Principal AI Systems Architect',
        duration: '2023 - Present',
        highlights: [
          'Architected 24/7 AI WhatsApp lead capture agent with zero-delay intent detection and live Sheets CRM sync.',
          'Engineered multi-SIM broadcast engine delivering 1,000 bulk messages in one go with anti-ban human jitter.',
          'Built generative video maker creating viral YouTube Shorts and commercial ads in Veo 3 / Grok styling.',
        ],
      },
      {
        company: 'Apex Digital Solutions',
        role: 'Senior Enterprise Automation Consultant',
        duration: '2020 - 2023',
        highlights: [
          'Spearheaded enterprise low-code workflow adoptions saving client operations 20+ manual hours weekly.',
          'Designed secure OAuth 2.0 and API integration gateways across 12+ cloud SaaS platforms.',
        ],
      },
    ],
    education: 'Bachelor of Technology (B.Tech) in Computer Science & Engineering',
    certifications: [
      'Google Cloud Certified Professional Machine Learning Engineer',
      'Meta Certified Marketing & WhatsApp Business Developer',
      'DeepLearning.AI Certified Prompt Engineering Specialist',
    ],
    videoPortfolioScript:
      'Hi there! I am Rashmi Sondhi, an AI Automation Architect. I help modern organizations bridge the gap between breakthrough foundation models and real revenue growth. In my portfolio, you will see how I engineered a 1,000-message WhatsApp blaster and 24/7 AI lead capture agents. Let’s connect on WhatsApp at 78695 15615!',
    createdAt: '2026-10-18',
  },
  {
    id: 'res-arjun-patel',
    fullName: 'Arjun Patel',
    targetRole: 'Senior Fullstack AI Engineer',
    contact: {
      email: 'arjun.patel@techfoundry.io',
      phone: '+91 98450 11223',
      location: 'Pune, Maharashtra',
      linkedin: 'linkedin.com/in/arjun-patel-dev',
    },
    atsScore: 94,
    matchedSyllabusId: 'syl-ai-masterclass-2026',
    professionalSummary:
      'High-velocity Fullstack Engineer specialized in React, TypeScript, and AI workflow integration. Experienced in connecting LLM agent backends with real-time responsive frontends, encrypted vaults, and multi-channel campaign dispatchers.',
    coreSkills: [
      'React 19 & TypeScript',
      'Vite & Express Full-Stack',
      'REST & Webhook Gateways',
      'Tailwind CSS UI/UX',
      'State Management & Performance',
    ],
    toolsAndFrameworks: [
      'React',
      'TypeScript',
      'Vite',
      'Tailwind CSS',
      'Express',
      'Lucide React',
      'SheetJS (XLSX)',
    ],
    workExperience: [
      {
        company: 'TechFoundry Labs',
        role: 'Senior Frontend & Automation Engineer',
        duration: '2022 - Present',
        highlights: [
          'Built responsive Excel sheet viewer with drag-and-drop parsing and instant audience dispatch.',
          'Integrated multi-platform social composer supporting Facebook, Instagram, LinkedIn, and X.',
        ],
      },
    ],
    education: 'B.E. in Information Technology',
    certifications: ['AWS Certified Developer Associate', 'React Core Certified Specialist'],
    videoPortfolioScript:
      'Hello! My name is Arjun Patel. As a fullstack engineer, I specialize in building ultra-fast React applications powered by generative AI. Watch my live demos below!',
    createdAt: '2026-10-16',
  },
];

interface SyllabusResumeStudioProps {
  onSendToVideoStudio?: (script: string, title: string) => void;
  onSendToWhatsAppBlaster?: (syllabus: CourseSyllabus) => void;
}

export const SyllabusResumeStudio: React.FC<SyllabusResumeStudioProps> = ({
  onSendToVideoStudio,
  onSendToWhatsAppBlaster,
}) => {
  const [activeTab, setActiveTab] = useState<'syllabus' | 'resume'>('syllabus');

  // Syllabus state
  const [syllabuses, setSyllabuses] = useState<CourseSyllabus[]>(PRESET_SYLLABUSES);
  const [selectedSyllabusId, setSelectedSyllabusId] = useState<string>(PRESET_SYLLABUSES[0].id);
  const [newSyllabusTopic, setNewSyllabusTopic] = useState('');
  const [newSyllabusWeeks, setNewSyllabusWeeks] = useState(6);
  const [isGeneratingSyllabus, setIsGeneratingSyllabus] = useState(false);

  // Resume state
  const [resumes, setResumes] = useState<CandidateResume[]>(PRESET_RESUMES);
  const [selectedResumeId, setSelectedResumeId] = useState<string>(PRESET_RESUMES[0].id);
  const [newCandidateName, setNewCandidateName] = useState('');
  const [newTargetRole, setNewTargetRole] = useState('');
  const [isGeneratingResume, setIsGeneratingResume] = useState(false);

  // Copied alert
  const [copiedNotice, setCopiedNotice] = useState<string | null>(null);

  const activeSyllabus = syllabuses.find((s) => s.id === selectedSyllabusId) || syllabuses[0];
  const activeResume = resumes.find((r) => r.id === selectedResumeId) || resumes[0];

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNotice(`${label} copied to clipboard!`);
    setTimeout(() => setCopiedNotice(null), 2500);
  };

  // Generate Syllabus with AI
  const handleGenerateSyllabus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSyllabusTopic.trim()) return;

    setIsGeneratingSyllabus(true);
    try {
      const res = await fetch('/api/career/generate-syllabus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: newSyllabusTopic,
          weeks: Number(newSyllabusWeeks),
        }),
      });

      const data = await res.json();
      if (data.syllabus) {
        const newEntry: CourseSyllabus = {
          ...data.syllabus,
          id: `syl-${Date.now()}`,
          createdAt: new Date().toISOString().split('T')[0],
        };
        setSyllabuses([newEntry, ...syllabuses]);
        setSelectedSyllabusId(newEntry.id);
        confetti({ particleCount: 40, spread: 70, origin: { y: 0.6 } });
        setNewSyllabusTopic('');
      }
    } catch (err) {
      alert('Error generating syllabus. Please try again.');
    } finally {
      setIsGeneratingSyllabus(false);
    }
  };

  // Generate Resume with AI
  const handleGenerateResume = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCandidateName.trim() || !newTargetRole.trim()) return;

    setIsGeneratingResume(true);
    try {
      const res = await fetch('/api/career/generate-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCandidateName,
          role: newTargetRole,
          syllabusTopic: activeSyllabus?.courseTitle || '',
        }),
      });

      const data = await res.json();
      if (data.resume) {
        const newEntry: CandidateResume = {
          ...data.resume,
          id: `res-${Date.now()}`,
          contact: {
            email: `${newCandidateName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
            phone: '+91 98000 12345',
            location: 'India',
          },
          createdAt: new Date().toISOString().split('T')[0],
        };
        setResumes([newEntry, ...resumes]);
        setSelectedResumeId(newEntry.id);
        confetti({ particleCount: 40, spread: 70, origin: { y: 0.6 } });
        setNewCandidateName('');
        setNewTargetRole('');
      }
    } catch (err) {
      alert('Error generating resume. Please try again.');
    } finally {
      setIsGeneratingResume(false);
    }
  };

  // Print / PDF download trigger
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-6 rounded-2xl backdrop-blur-md relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <BookOpen className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Syllabus & Resume Studio
            </h2>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              AI Powered • ATS Ready
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Build industry-certified course syllabuses and ATS-optimized candidate resumes. 1-Click convert into{' '}
            <span className="text-purple-400 font-semibold">Veo 3 & Grok Video Pitches</span> or attach directly to{' '}
            <span className="text-emerald-400 font-semibold">WhatsApp Blaster</span> campaigns.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-950 rounded-xl border border-slate-800 relative z-10">
          <button
            onClick={() => setActiveTab('syllabus')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === 'syllabus' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Course Syllabus Builder</span>
          </button>
          <button
            onClick={() => setActiveTab('resume')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === 'resume' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>ATS Resume & Video Pitch</span>
          </button>
        </div>
      </div>

      {copiedNotice && (
        <div className="p-3.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-200 text-xs font-semibold flex items-center gap-2 animate-pulse">
          <CheckCircle2 className="w-4 h-4 text-purple-400" />
          <span>{copiedNotice}</span>
        </div>
      )}

      {/* SYLLABUS BUILDER TAB */}
      {activeTab === 'syllabus' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Selector & AI Generator */}
          <div className="space-y-5">
            {/* AI Generator Form */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Generate New Course Syllabus
                </h3>
              </div>

              <form onSubmit={handleGenerateSyllabus} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300">Course / Training Topic</label>
                  <input
                    type="text"
                    required
                    value={newSyllabusTopic}
                    onChange={(e) => setNewSyllabusTopic(e.target.value)}
                    placeholder="e.g. Master Prompt Engineering & AI Agents 2026"
                    className="w-full mt-1 bg-slate-950 border border-slate-800 text-xs text-white rounded-xl p-2.5 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300">Duration (Weeks)</label>
                  <select
                    value={newSyllabusWeeks}
                    onChange={(e) => setNewSyllabusWeeks(Number(e.target.value))}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 text-xs text-white rounded-xl p-2.5 focus:outline-none"
                  >
                    <option value={4}>4 Weeks (Fast-Track Bootcamp)</option>
                    <option value={6}>6 Weeks (Comprehensive Masterclass)</option>
                    <option value={8}>8 Weeks (Enterprise Deep Dive)</option>
                    <option value={12}>12 Weeks (Executive Placement Program)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isGeneratingSyllabus}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-purple-600/20 transition active:scale-95"
                >
                  {isGeneratingSyllabus ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Structuring Curriculum...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Generate Full Syllabus</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Syllabuses List */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-xl">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Available Curriculums ({syllabuses.length})
              </span>

              <div className="space-y-2">
                {syllabuses.map((syl) => {
                  const isSelected = syl.id === selectedSyllabusId;
                  return (
                    <button
                      key={syl.id}
                      onClick={() => setSelectedSyllabusId(syl.id)}
                      className={`w-full text-left p-3 rounded-xl border transition ${
                        isSelected
                          ? 'bg-purple-600/15 border-purple-500 text-white shadow-xs'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/40 text-purple-300">
                          {syl.category}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">{syl.durationWeeks} Weeks</span>
                      </div>
                      <h4 className="text-xs font-bold line-clamp-1">{syl.courseTitle}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{syl.overview}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Syllabus Document & Action Toolbar */}
          <div className="lg:col-span-2 space-y-4">
            {/* Quick Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">{activeSyllabus.courseTitle}</span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() =>
                    onSendToVideoStudio
                      ? onSendToVideoStudio(activeSyllabus.videoPitchScript, activeSyllabus.courseTitle)
                      : handleCopyText(activeSyllabus.videoPitchScript, 'Video Script')
                  }
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition shadow-xs"
                  title="Generate Veo 3 / Grok video script from syllabus"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Convert to Video Ad</span>
                </button>

                <button
                  onClick={() =>
                    onSendToWhatsAppBlaster
                      ? onSendToWhatsAppBlaster(activeSyllabus)
                      : handleCopyText(
                          `Official Syllabus: ${activeSyllabus.courseTitle}\n\n${activeSyllabus.overview}\n\nCall/WhatsApp +91 78695 15615 for enrollment.`,
                          'WhatsApp Syllabus message'
                        )
                  }
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Attach to WhatsApp</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
                  title="Print or Save as PDF"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-300" />
                  <span>Print / PDF</span>
                </button>
              </div>
            </div>

            {/* Structured Syllabus Sheet */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl">
              {/* Header */}
              <div className="border-b border-slate-800 pb-5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">
                    Shri Shyam Consulting • Official Curriculum
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Total: {activeSyllabus.totalHours || activeSyllabus.durationWeeks * 8} Hours • {activeSyllabus.durationWeeks} Weeks
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-white">{activeSyllabus.courseTitle}</h1>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{activeSyllabus.overview}</p>

                <div className="pt-2 flex items-center gap-4 text-xs text-slate-400">
                  <span>
                    <strong>Target Audience:</strong> {activeSyllabus.targetAudience}
                  </span>
                </div>
              </div>

              {/* Video Pitch Script Box */}
              <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                    <Video className="w-4 h-4" />
                    Auto-Generated Video Pitch & Ad Script (Veo 3 / Grok Format)
                  </span>
                  <button
                    onClick={() => handleCopyText(activeSyllabus.videoPitchScript, 'Video Script')}
                    className="text-[11px] text-purple-400 hover:text-purple-300 font-semibold"
                  >
                    Copy Script
                  </button>
                </div>
                <p className="text-xs text-slate-200 italic font-mono leading-relaxed">
                  "{activeSyllabus.videoPitchScript}"
                </p>
              </div>

              {/* Modules Accordion / List */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-400" />
                  Weekly Curriculum & Practical Projects
                </h3>

                <div className="space-y-3">
                  {activeSyllabus.modules.map((mod) => (
                    <div
                      key={mod.week}
                      className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 space-y-2 hover:border-slate-700 transition"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-purple-400">
                          Week {mod.week} • {mod.title}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">{mod.durationHours || 8} Hours</span>
                      </div>

                      <p className="text-xs text-slate-300">{mod.description}</p>

                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        {mod.topics.map((topic, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>

                      <div className="pt-2 text-xs text-emerald-400 flex items-center gap-1.5 font-medium">
                        <Award className="w-3.5 h-3.5" />
                        <span>
                          <strong>Hands-on Project:</strong> {mod.practicalProject}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Career Outcomes */}
              <div className="pt-4 border-t border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Guaranteed Career Outcomes
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeSyllabus.careerOutcomes.map((outcome, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span>{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RESUME BUILDER TAB */}
      {activeTab === 'resume' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Generate Resume & List */}
          <div className="space-y-5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  AI Resume & ATS Optimizer
                </h3>
              </div>

              <form onSubmit={handleGenerateResume} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300">Candidate Name</label>
                  <input
                    type="text"
                    required
                    value={newCandidateName}
                    onChange={(e) => setNewCandidateName(e.target.value)}
                    placeholder="e.g. Rashmi Sondhi"
                    className="w-full mt-1 bg-slate-950 border border-slate-800 text-xs text-white rounded-xl p-2.5 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300">Target Role</label>
                  <input
                    type="text"
                    required
                    value={newTargetRole}
                    onChange={(e) => setNewTargetRole(e.target.value)}
                    placeholder="e.g. Lead AI Systems & WhatsApp Architect"
                    className="w-full mt-1 bg-slate-950 border border-slate-800 text-xs text-white rounded-xl p-2.5 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isGeneratingResume}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition active:scale-95"
                >
                  {isGeneratingResume ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Optimizing ATS Resume...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Generate ATS Resume</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Resume Selection List */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-xl">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Saved Resumes ({resumes.length})
              </span>

              <div className="space-y-2">
                {resumes.map((res) => {
                  const isSelected = res.id === selectedResumeId;
                  return (
                    <button
                      key={res.id}
                      onClick={() => setSelectedResumeId(res.id)}
                      className={`w-full text-left p-3 rounded-xl border transition ${
                        isSelected
                          ? 'bg-indigo-600/15 border-indigo-500 text-white shadow-xs'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-white">{res.fullName}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400">
                          ATS: {res.atsScore}%
                        </span>
                      </div>
                      <p className="text-[11px] text-indigo-300 truncate">{res.targetRole}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: ATS Resume Preview */}
          <div className="lg:col-span-2 space-y-4">
            {/* Header Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-white">{activeResume.fullName}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  ATS Score: {activeResume.atsScore}/100
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    onSendToVideoStudio
                      ? onSendToVideoStudio(activeResume.videoPortfolioScript, `${activeResume.fullName} - Video Resume`)
                      : handleCopyText(activeResume.videoPortfolioScript, 'Video Portfolio Script')
                  }
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition shadow-xs"
                  title="Turn this resume into a 60-second video portfolio"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Make Video Resume</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-300" />
                  <span>Print / Save PDF</span>
                </button>
              </div>
            </div>

            {/* Resume Document Sheet */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl">
              {/* Candidate Info Header */}
              <div className="border-b border-slate-800 pb-5 space-y-2">
                <h1 className="text-2xl font-black text-white">{activeResume.fullName}</h1>
                <h2 className="text-sm font-bold text-indigo-400">{activeResume.targetRole}</h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono pt-1">
                  <span>{activeResume.contact.email}</span>
                  <span>•</span>
                  <span>{activeResume.contact.phone}</span>
                  <span>•</span>
                  <span>{activeResume.contact.location}</span>
                </div>
              </div>

              {/* Video Portfolio Script Card */}
              <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                    <Video className="w-4 h-4" />
                    60-Second Video Resume Script (Veo 3 & Grok Format)
                  </span>
                  <button
                    onClick={() => handleCopyText(activeResume.videoPortfolioScript, 'Portfolio Script')}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold"
                  >
                    Copy
                  </button>
                </div>
                <p className="text-xs text-slate-200 italic font-mono leading-relaxed">
                  "{activeResume.videoPortfolioScript}"
                </p>
              </div>

              {/* Summary */}
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Professional Summary
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {activeResume.professionalSummary}
                </p>
              </div>

              {/* Core Skills & Tools */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-purple-400 uppercase">Core Competencies</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {activeResume.coreSkills.map((s, i) => (
                      <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-indigo-400 uppercase">Tools & Frameworks</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {activeResume.toolsAndFrameworks.map((t, i) => (
                      <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 font-mono">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Experience */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Professional Experience
                </h3>
                <div className="space-y-4">
                  {activeResume.workExperience.map((exp, i) => (
                    <div key={i} className="space-y-1.5 border-l-2 border-indigo-500/40 pl-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{exp.role}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{exp.duration}</span>
                      </div>
                      <div className="text-xs text-indigo-300 font-semibold">{exp.company}</div>
                      <ul className="list-disc list-inside text-xs text-slate-300 space-y-1 pt-1 leading-relaxed">
                        {exp.highlights.map((hl, j) => (
                          <li key={j}>{hl}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications & Education */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-slate-400 uppercase">Education</h4>
                  <p className="text-xs text-slate-200">{activeResume.education}</p>
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-slate-400 uppercase">Certifications</h4>
                  <ul className="text-xs text-slate-300 space-y-1">
                    {activeResume.certifications.map((c, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
