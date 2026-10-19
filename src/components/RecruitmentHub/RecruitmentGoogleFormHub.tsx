import React, { useState, useEffect } from 'react';
import {
  FileText,
  CheckCircle2,
  Copy,
  ExternalLink,
  Plus,
  Send,
  UploadCloud,
  FileCheck,
  Trash2,
  Search,
  Filter,
  Download,
  Share2,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Clock,
  Sparkles,
  AlertCircle,
  HelpCircle,
  Code,
  Layers,
  ChevronRight,
  UserCheck,
  MessageSquare,
  Bot,
  Settings,
  BarChart3,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { RecruitmentCandidate } from '../../types';
import {
  INITIAL_CANDIDATES,
  JOB_POSITIONS,
  EXPERIENCE_RANGES,
  NOTICE_PERIODS,
  PREFERRED_LOCATION_OPTIONS,
  generateGoogleAppsScript,
} from '../../data/recruitmentData';
import {
  playWhatsAppDeliveryTone,
  notifyDeliverySuccess,
  openWhatsAppDirect,
} from '../../utils/soundAndNotifications';
import { appendRecipientsToStorage } from '../../data/sampleAudience';
import { RecruitmentPipelineDashboard } from './RecruitmentPipelineDashboard';

const STORAGE_KEY = 'flowpulse_recruitment_candidates_v1';

export const RecruitmentGoogleFormHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'form' | 'crm' | 'script' | 'guide' | 'templates'>('pipeline');
  const [companyName, setCompanyName] = useState('M/s Shri Shyam Consultant');
  const [candidates, setCandidates] = useState<RecruitmentCandidate[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_CANDIDATES;
  });

  // Candidate Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('all');
  const [selectedLocationFilter, setSelectedLocationFilter] = useState('all');
  const [selectedNoticeFilter, setSelectedNoticeFilter] = useState('all');

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [currentLocation, setCurrentLocation] = useState('');
  const [preferredLocations, setPreferredLocations] = useState<string[]>(['PAN India', 'Work from Home (Remote)']);
  const [positionApplied, setPositionApplied] = useState(JOB_POSITIONS[0]);
  const [keySkills, setKeySkills] = useState('');
  const [totalExperience, setTotalExperience] = useState(EXPERIENCE_RANGES[1]);
  const [relevantExperience, setRelevantExperience] = useState('');
  const [currentCtc, setCurrentCtc] = useState('');
  const [expectedCtc, setExpectedCtc] = useState('');
  const [noticePeriod, setNoticePeriod] = useState(NOTICE_PERIODS[0]);
  const [reasonForChange, setReasonForChange] = useState('');
  const [uploadedResumeName, setUploadedResumeName] = useState<string | null>(null);
  const [uploadedResumeSize, setUploadedResumeSize] = useState<string | null>(null);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedHeader, setCopiedHeader] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(candidates));
    } catch {
      // ignore
    }
  }, [candidates]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const togglePreferredLocation = (loc: string) => {
    if (preferredLocations.includes(loc)) {
      setPreferredLocations(preferredLocations.filter((l) => l !== loc));
    } else {
      setPreferredLocations([...preferredLocations, loc]);
    }
  };

  const handleResumeDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFileSelected(file);
    }
  };

  const handleFileSelected = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, resume: 'File exceeds maximum 10MB limit' }));
      return;
    }
    const validExts = ['.pdf', '.doc', '.docx'];
    const hasValidExt = validExts.some((ext) => file.name.toLowerCase().endsWith(ext));
    if (!hasValidExt) {
      setErrors((prev) => ({ ...prev, resume: 'Only PDF or Document files are allowed.' }));
      return;
    }
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy.resume;
      return copy;
    });
    setUploadedResumeName(file.name);
    setUploadedResumeSize((file.size / (1024 * 1024)).toFixed(1) + ' MB');
  };

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = 'Full Name is required.';
    
    // Email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      errs.email = 'Email ID is required.';
    } else if (!emailRegex.test(email)) {
      errs.email = 'Please enter a valid email address.';
    }

    // Phone number validation
    const digitsOnly = contactNumber.replace(/\D/g, '');
    if (!contactNumber.trim()) {
      errs.contactNumber = 'Contact Number is required.';
    } else if (digitsOnly.length < 10) {
      errs.contactNumber = 'Enter a valid 10-digit mobile number.';
    }

    if (!currentLocation.trim()) errs.currentLocation = 'Current Location is required.';
    if (preferredLocations.length === 0) errs.preferredLocations = 'Select at least one preferred location.';
    if (!positionApplied) errs.positionApplied = 'Position applied for is required.';
    if (!keySkills.trim()) errs.keySkills = 'Key skills description is required.';
    if (!totalExperience) errs.totalExperience = 'Total work experience is required.';
    if (!relevantExperience.trim()) errs.relevantExperience = 'Relevant experience is required.';
    if (!currentCtc.trim()) errs.currentCtc = 'Current CTC is required (or N/A for Fresher).';
    if (!expectedCtc.trim()) errs.expectedCtc = 'Expected CTC is required.';
    if (!noticePeriod) errs.noticePeriod = 'Notice period is required.';
    if (!reasonForChange.trim()) errs.reasonForChange = 'Reason for change is required.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('⚠️ Please correct the highlighted errors before submitting.');
      return;
    }

    const newCandidate: RecruitmentCandidate = {
      id: `cand-${Date.now()}`,
      fullName: fullName.trim(),
      email: email.trim(),
      contactNumber: contactNumber.trim(),
      currentLocation: currentLocation.trim(),
      preferredLocations,
      positionApplied,
      keySkills: keySkills.trim(),
      totalExperience,
      relevantExperience: relevantExperience.trim(),
      currentCtc: currentCtc.trim(),
      expectedCtc: expectedCtc.trim(),
      noticePeriod,
      reasonForChange: reasonForChange.trim(),
      resumeFileName: uploadedResumeName || `${fullName.replace(/\s+/g, '_')}_Resume.pdf`,
      resumeFileSize: uploadedResumeSize || '1.5 MB',
      submittedAt: new Date().toISOString(),
      status: 'new',
      notes: 'Submitted via Recruitment Google Form.',
    };

    setCandidates([newCandidate, ...candidates]);
    setIsSubmitted(true);
    playWhatsAppDeliveryTone();
    notifyDeliverySuccess(newCandidate.fullName, newCandidate.contactNumber);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    showToast(`✅ Application recorded! Candidate added to CRM.`);
  };

  const handleResetForm = () => {
    setFullName('');
    setEmail('');
    setContactNumber('');
    setCurrentLocation('');
    setPreferredLocations(['PAN India', 'Work from Home (Remote)']);
    setPositionApplied(JOB_POSITIONS[0]);
    setKeySkills('');
    setTotalExperience(EXPERIENCE_RANGES[1]);
    setRelevantExperience('');
    setCurrentCtc('');
    setExpectedCtc('');
    setNoticePeriod(NOTICE_PERIODS[0]);
    setReasonForChange('');
    setUploadedResumeName(null);
    setUploadedResumeSize(null);
    setErrors({});
    setIsSubmitted(false);
  };

  // Quick WhatsApp Dispatch to Candidate (Universal Click-to-Chat via Meta wa.me)
  const handleSendCandidateWhatsApp = (cand: RecruitmentCandidate, templateType: 'ack' | 'interview' | 'shortlist') => {
    let msg = '';
    if (templateType === 'ack') {
      msg = `Hello ${cand.fullName},\n\nThank you for applying for the *${cand.positionApplied}* opening at *${companyName}*!\n\nWe have received your application, resume (${cand.resumeFileName || 'attached'}), and career preferences (${cand.preferredLocations.join(', ')}).\n\nOur Talent Acquisition team is reviewing your profile and will update you shortly on next steps.\n\nBest Regards,\nHR Talent Team\n${companyName}`;
    } else if (templateType === 'interview') {
      msg = `Dear ${cand.fullName},\n\nCongratulations! Your profile has been shortlisted for the *${cand.positionApplied}* position at *${companyName}*.\n\nWe would like to invite you for an Online Technical Interview:\n🗓️ Date: Tomorrow / Mutual convenient slot\n📍 Mode: Online (Google Meet)\n⏱️ Duration: 45 Minutes\n\nPlease reply with your preferred time slot between 11:00 AM – 6:00 PM IST.\n\nWarm Regards,\nRecruitment Team\n${companyName}`;
    } else {
      msg = `Hi ${cand.fullName},\n\nGreat news from *${companyName}*! Your application for *${cand.positionApplied}* has successfully advanced to the Final Review Round.\n\nExpected CTC: ${cand.expectedCtc}\nNotice Period: ${cand.noticePeriod}\n\nOur senior hiring manager will connect with you shortly for discussion.\n\nBest,\nHR Operations`;
    }

    const res = openWhatsAppDirect(cand.contactNumber, msg, 'wa_me');
    playWhatsAppDeliveryTone();
    notifyDeliverySuccess(cand.fullName, cand.contactNumber);
    showToast(`📱 WhatsApp message launched for ${cand.fullName} (${cand.contactNumber})!`);
  };

  // Open Full WhatsApp Custom Dispatcher for Candidate
  const handleOpenCandidateDispatcher = (cand: RecruitmentCandidate, templateType: 'ack' | 'interview' | 'shortlist' = 'interview') => {
    window.dispatchEvent(
      new CustomEvent('flowpulse_open_whatsapp_dispatcher', {
        detail: {
          phone: cand.contactNumber,
          name: cand.fullName,
          roleOrCompany: cand.positionApplied,
          templateType,
        },
      })
    );
  };

  // Push all filtered candidates to WhatsApp Blaster / Excel Hub
  const handlePushCandidatesToBlaster = () => {
    const formattedRecipients = filteredCandidates.map((c) => ({
      id: c.id,
      name: c.fullName,
      phone: c.contactNumber,
      company: companyName,
      course: `${c.positionApplied} Candidate (Exp: ${c.totalExperience})`,
      status: 'pending' as const,
    }));

    appendRecipientsToStorage(formattedRecipients);
    playWhatsAppDeliveryTone();
    notifyDeliverySuccess('Recruitment Batch', `${formattedRecipients.length} Candidates`);
    confetti({ particleCount: 50, spread: 60 });
    showToast(`🚀 Successfully pushed ${formattedRecipients.length} candidates to WhatsApp Broadcast Hub!`);
  };

  // Filtering candidates
  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch =
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.keySkills.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.currentLocation.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = selectedRoleFilter === 'all' || c.positionApplied === selectedRoleFilter;
    const matchesLoc =
      selectedLocationFilter === 'all' ||
      c.currentLocation.toLowerCase().includes(selectedLocationFilter.toLowerCase()) ||
      c.preferredLocations.some((l) => l.toLowerCase().includes(selectedLocationFilter.toLowerCase()));
    const matchesNotice = selectedNoticeFilter === 'all' || c.noticePeriod === selectedNoticeFilter;

    return matchesSearch && matchesRole && matchesLoc && matchesNotice;
  });

  const appsScriptCode = generateGoogleAppsScript(companyName);

  const formDescriptionText = `[${companyName}] – Job Application Form

Thank you for your interest in joining our team! Please fill out the details below accurately and attach your updated resume. Our talent acquisition team will review your application and reach out if your profile matches our requirements.`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-indigo-400/40 animate-in fade-in slide-in-from-bottom-3 font-medium text-sm">
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner & Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border border-purple-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-purple-400" />
                Google Forms Enterprise Suite
              </span>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                PAN INDIA RECRUITMENT
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              Recruitment Google Form & ATS Tracker
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Full Google Form structure for new openings across PAN India. Includes interactive candidate form,
              1-click Google Apps Script generator, candidate CRM tracker, and direct WhatsApp interview dispatch.
            </p>
          </div>

          {/* Quick Company Switcher & Stats */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="text-left">
              <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Company Name
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none w-52"
                placeholder="Enter Company Name"
              />
            </div>
            <div className="border-l border-slate-800 pl-3 flex flex-col justify-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Applicants</span>
              <span className="text-lg font-extrabold text-purple-400">{candidates.length} Received</span>
            </div>
            <div className="border-l border-slate-800 pl-3 flex items-center">
              <button
                onClick={() => {
                  setActiveTab('pipeline');
                  showToast('📊 Viewing Hiring Pipeline & Chart Export tools (PNG/PDF)');
                }}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm hover:shadow-emerald-500/20"
                title="Export candidate distribution chart as PNG or PDF report"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Chart</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-5 border-t border-slate-800/80">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'pipeline'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-purple-300" />
            <span>Hiring Pipeline Dashboard</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-purple-500/30 text-purple-200 font-extrabold">
              Recharts
            </span>
          </button>

          <button
            onClick={() => setActiveTab('form')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'form'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Interactive Google Form</span>
          </button>

          <button
            onClick={() => setActiveTab('crm')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition relative ${
              activeTab === 'crm'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Candidate CRM & Submissions</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-purple-500/30 text-purple-300 font-bold">
              {candidates.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'guide'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Form Structure & Setup Guide</span>
          </button>

          <button
            onClick={() => setActiveTab('script')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'script'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>1-Click Google Apps Script</span>
          </button>

          <button
            onClick={() => setActiveTab('templates')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'templates'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp & Email Auto-Responders</span>
          </button>
        </div>
      </div>

      {/* TAB 0: RECHARTS HIRING PIPELINE & POSITION DISTRIBUTION DASHBOARD */}
      {activeTab === 'pipeline' && (
        <RecruitmentPipelineDashboard
          candidates={candidates}
          companyName={companyName}
          onNavigateToCRM={(role) => {
            if (role && role !== 'all') {
              setSelectedRoleFilter(role);
            }
            setActiveTab('crm');
          }}
          onNavigateToForm={() => setActiveTab('form')}
          onSendWhatsApp={handleSendCandidateWhatsApp}
          onAddCandidate={(newCand) => {
            setCandidates((prev) => [newCand, ...prev]);
            showToast(`✅ Candidate "${newCand.fullName}" simulated and added to pipeline!`);
          }}
        />
      )}

      {/* TAB 1: INTERACTIVE GOOGLE FORM (LIVE APPLICANT PORTAL) */}
      {activeTab === 'form' && (
        <div className="space-y-6">
          {/* Quick Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live Application Form Simulator matching official Google Forms spec.</span>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => {
                  setFullName('Vikramaditya Sengupta');
                  setEmail('vikram.sengupta@example.com');
                  setContactNumber('+91 98301 99221');
                  setCurrentLocation('Kolkata');
                  setPreferredLocations(['PAN India', 'Bangalore', 'Work from Home (Remote)']);
                  setPositionApplied('AI/ML Science Specialist');
                  setKeySkills('PyTorch, LangChain, Transformers, Python, RAG pipelines, FastAPI');
                  setTotalExperience('3–5 Years');
                  setRelevantExperience('3.5 years in enterprise GenAI & computer vision');
                  setCurrentCtc('₹11 LPA');
                  setExpectedCtc('₹16 LPA');
                  setNoticePeriod('15 Days');
                  setReasonForChange('Seeking fast-paced AI product engineering and robotics work.');
                  setUploadedResumeName('Vikram_Sengupta_AI_Lead.pdf');
                  setUploadedResumeSize('2.1 MB');
                  showToast('⚡ Pre-filled sample applicant profile for testing!');
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-purple-300 border border-purple-500/30 flex items-center gap-1.5 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                Fill Sample Candidate
              </button>
              <button
                onClick={handleResetForm}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-400 hover:text-white transition"
              >
                Clear Form
              </button>
            </div>
          </div>

          {/* Submission Success Screen */}
          {isSubmitted ? (
            <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-8 sm:p-12 text-center space-y-6 shadow-2xl max-w-3xl mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">Your response has been recorded.</h2>
                <p className="text-slate-300 text-sm max-w-md mx-auto">
                  Thank you for applying to <span className="font-semibold text-purple-400">{companyName}</span>.
                  Your application for <span className="font-semibold text-white">{positionApplied}</span> has been logged into the candidate database.
                </p>
              </div>

              {/* Action buttons on completion */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    const latest = candidates[0];
                    if (latest) handleSendCandidateWhatsApp(latest, 'ack');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition"
                >
                  <Send className="w-4 h-4" />
                  Send Instant WhatsApp Acknowledgment
                </button>
                <button
                  onClick={() => setActiveTab('crm')}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition"
                >
                  <UserCheck className="w-4 h-4" />
                  View in Candidate CRM
                </button>
                <button
                  onClick={handleResetForm}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition"
                >
                  Submit Another Response
                </button>
              </div>
            </div>
          ) : (
            /* Google Form Container */
            <form onSubmit={handleFormSubmit} className="max-w-3xl mx-auto space-y-4">
              {/* Form Header Card (Google Forms Signature Top Card) */}
              <div className="bg-slate-900 border-t-8 border-t-purple-600 border-x border-b border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                    {companyName} – Job Application Form
                  </h2>
                  <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                    {formDescriptionText}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-rose-400 font-semibold">
                  <span>* Indicates required question</span>
                  <span className="text-slate-400">Response validation enabled</span>
                </div>
              </div>

              {/* Question 1: Full Name */}
              <div className={`bg-slate-900 border ${errors.fullName ? 'border-rose-500' : 'border-slate-800'} rounded-2xl p-6 space-y-3 shadow-md transition`}>
                <label className="block text-sm font-bold text-white">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <p className="text-xs text-slate-400">Enter your full legal name as per government records</p>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your answer"
                  className="w-full bg-slate-950 border-b-2 border-slate-700 focus:border-purple-500 px-3 py-2 text-sm text-white focus:outline-none transition rounded-t-lg"
                />
                {errors.fullName && (
                  <p className="text-xs text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.fullName}
                  </p>
                )}
              </div>

              {/* Question 2: Email ID */}
              <div className={`bg-slate-900 border ${errors.email ? 'border-rose-500' : 'border-slate-800'} rounded-2xl p-6 space-y-3 shadow-md transition`}>
                <label className="block text-sm font-bold text-white">
                  Email ID <span className="text-rose-500">*</span>
                </label>
                <p className="text-xs text-slate-400">
                  Response validation: Text → Email (We will send interview invites to this address)
                </p>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@domain.com"
                  className="w-full bg-slate-950 border-b-2 border-slate-700 focus:border-purple-500 px-3 py-2 text-sm text-white focus:outline-none transition rounded-t-lg"
                />
                {errors.email && (
                  <p className="text-xs text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Question 3: Contact Number */}
              <div className={`bg-slate-900 border ${errors.contactNumber ? 'border-rose-500' : 'border-slate-800'} rounded-2xl p-6 space-y-3 shadow-md transition`}>
                <label className="block text-sm font-bold text-white">
                  Contact Number <span className="text-rose-500">*</span>
                </label>
                <p className="text-xs text-slate-400">
                  Response validation: Number (10-digit WhatsApp enabled mobile number)
                </p>
                <input
                  type="tel"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-slate-950 border-b-2 border-slate-700 focus:border-purple-500 px-3 py-2 text-sm text-white focus:outline-none transition rounded-t-lg"
                />
                {errors.contactNumber && (
                  <p className="text-xs text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.contactNumber}
                  </p>
                )}
              </div>

              {/* Question 4: Current Location */}
              <div className={`bg-slate-900 border ${errors.currentLocation ? 'border-rose-500' : 'border-slate-800'} rounded-2xl p-6 space-y-3 shadow-md transition`}>
                <label className="block text-sm font-bold text-white">
                  Current Location <span className="text-rose-500">*</span>
                </label>
                <p className="text-xs text-slate-400">e.g., Mumbai, Bangalore, Delhi NCR, Remote</p>
                <input
                  type="text"
                  value={currentLocation}
                  onChange={(e) => setCurrentLocation(e.target.value)}
                  placeholder="Your current city"
                  className="w-full bg-slate-950 border-b-2 border-slate-700 focus:border-purple-500 px-3 py-2 text-sm text-white focus:outline-none transition rounded-t-lg"
                />
                {errors.currentLocation && (
                  <p className="text-xs text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.currentLocation}
                  </p>
                )}
              </div>

              {/* Question 5: Preferred Location(s) */}
              <div className={`bg-slate-900 border ${errors.preferredLocations ? 'border-rose-500' : 'border-slate-800'} rounded-2xl p-6 space-y-3 shadow-md transition`}>
                <label className="block text-sm font-bold text-white">
                  Preferred Location(s) <span className="text-rose-500">*</span>
                </label>
                <p className="text-xs text-slate-400">Select all locations you are open to work (PAN India, Remote, or Major Hubs)</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  {PREFERRED_LOCATION_OPTIONS.map((loc) => {
                    const isChecked = preferredLocations.includes(loc);
                    return (
                      <label
                        key={loc}
                        onClick={() => togglePreferredLocation(loc)}
                        className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-medium cursor-pointer transition select-none ${
                          isChecked
                            ? 'bg-purple-600/20 border-purple-500 text-purple-200'
                            : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          readOnly
                          className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 bg-slate-900 border-slate-700"
                        />
                        <span>{loc}</span>
                      </label>
                    );
                  })}
                </div>
                {errors.preferredLocations && (
                  <p className="text-xs text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.preferredLocations}
                  </p>
                )}
              </div>

              {/* Question 6: Position Applied For */}
              <div className={`bg-slate-900 border ${errors.positionApplied ? 'border-rose-500' : 'border-slate-800'} rounded-2xl p-6 space-y-3 shadow-md transition`}>
                <label className="block text-sm font-bold text-white">
                  Position Applied For <span className="text-rose-500">*</span>
                </label>
                <p className="text-xs text-slate-400">Choose from available open roles</p>
                <select
                  value={positionApplied}
                  onChange={(e) => setPositionApplied(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-purple-500 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none transition"
                >
                  {JOB_POSITIONS.map((pos) => (
                    <option key={pos} value={pos} className="bg-slate-900 text-white">
                      {pos}
                    </option>
                  ))}
                </select>
                {errors.positionApplied && (
                  <p className="text-xs text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.positionApplied}
                  </p>
                )}
              </div>

              {/* Question 7: Key Skills */}
              <div className={`bg-slate-900 border ${errors.keySkills ? 'border-rose-500' : 'border-slate-800'} rounded-2xl p-6 space-y-3 shadow-md transition`}>
                <label className="block text-sm font-bold text-white">
                  Key Skills <span className="text-rose-500">*</span>
                </label>
                <p className="text-xs text-slate-400">
                  Help text: List your primary skills, tech stack, frameworks, tools, and technical proficiencies
                </p>
                <textarea
                  rows={3}
                  value={keySkills}
                  onChange={(e) => setKeySkills(e.target.value)}
                  placeholder="e.g. Python, AI/ML, React, Node.js, Prompt Engineering, SQL, Cloud Architecture..."
                  className="w-full bg-slate-950 border-b-2 border-slate-700 focus:border-purple-500 px-3 py-2 text-sm text-white focus:outline-none transition rounded-t-lg"
                />
                {errors.keySkills && (
                  <p className="text-xs text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.keySkills}
                  </p>
                )}
              </div>

              {/* Question 8: Total Work Experience */}
              <div className={`bg-slate-900 border ${errors.totalExperience ? 'border-rose-500' : 'border-slate-800'} rounded-2xl p-6 space-y-3 shadow-md transition`}>
                <label className="block text-sm font-bold text-white">
                  Total Work Experience <span className="text-rose-500">*</span>
                </label>
                <p className="text-xs text-slate-400">e.g., Fresher, 1–2 Years, 3–5 Years, 5+ Years</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  {EXPERIENCE_RANGES.map((range) => {
                    const isSelected = totalExperience === range;
                    return (
                      <button
                        type="button"
                        key={range}
                        onClick={() => setTotalExperience(range)}
                        className={`p-3 rounded-xl border text-xs font-semibold transition ${
                          isSelected
                            ? 'bg-purple-600 text-white border-purple-500 shadow-md'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
                        }`}
                      >
                        {range}
                      </button>
                    );
                  })}
                </div>
                {errors.totalExperience && (
                  <p className="text-xs text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.totalExperience}
                  </p>
                )}
              </div>

              {/* Question 9: Relevant Experience */}
              <div className={`bg-slate-900 border ${errors.relevantExperience ? 'border-rose-500' : 'border-slate-800'} rounded-2xl p-6 space-y-3 shadow-md transition`}>
                <label className="block text-sm font-bold text-white">
                  Relevant Experience <span className="text-rose-500">*</span>
                </label>
                <p className="text-xs text-slate-400">
                  Help text: Years/Months of experience relevant to this specific role
                </p>
                <input
                  type="text"
                  value={relevantExperience}
                  onChange={(e) => setRelevantExperience(e.target.value)}
                  placeholder="e.g. 2.5 years in AI/ML & Python or 6 months internship"
                  className="w-full bg-slate-950 border-b-2 border-slate-700 focus:border-purple-500 px-3 py-2 text-sm text-white focus:outline-none transition rounded-t-lg"
                />
                {errors.relevantExperience && (
                  <p className="text-xs text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.relevantExperience}
                  </p>
                )}
              </div>

              {/* Questions 10 & 11: Current CTC & Expected CTC */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className={`bg-slate-900 border ${errors.currentCtc ? 'border-rose-500' : 'border-slate-800'} rounded-2xl p-6 space-y-3 shadow-md transition`}>
                  <label className="block text-sm font-bold text-white">
                    Current CTC (per annum) <span className="text-rose-500">*</span>
                  </label>
                  <p className="text-xs text-slate-400">e.g., ₹8 LPA or N/A (Fresher)</p>
                  <input
                    type="text"
                    value={currentCtc}
                    onChange={(e) => setCurrentCtc(e.target.value)}
                    placeholder="e.g. ₹6.5 LPA or N/A"
                    className="w-full bg-slate-950 border-b-2 border-slate-700 focus:border-purple-500 px-3 py-2 text-sm text-white focus:outline-none transition rounded-t-lg"
                  />
                  {errors.currentCtc && (
                    <p className="text-xs text-rose-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.currentCtc}
                    </p>
                  )}
                </div>

                <div className={`bg-slate-900 border ${errors.expectedCtc ? 'border-rose-500' : 'border-slate-800'} rounded-2xl p-6 space-y-3 shadow-md transition`}>
                  <label className="block text-sm font-bold text-white">
                    Expected CTC (per annum) <span className="text-rose-500">*</span>
                  </label>
                  <p className="text-xs text-slate-400">e.g., ₹10 LPA or Negotiable</p>
                  <input
                    type="text"
                    value={expectedCtc}
                    onChange={(e) => setExpectedCtc(e.target.value)}
                    placeholder="e.g. ₹10 LPA"
                    className="w-full bg-slate-950 border-b-2 border-slate-700 focus:border-purple-500 px-3 py-2 text-sm text-white focus:outline-none transition rounded-t-lg"
                  />
                  {errors.expectedCtc && (
                    <p className="text-xs text-rose-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.expectedCtc}
                    </p>
                  )}
                </div>
              </div>

              {/* Question 12: Notice Period */}
              <div className={`bg-slate-900 border ${errors.noticePeriod ? 'border-rose-500' : 'border-slate-800'} rounded-2xl p-6 space-y-3 shadow-md transition`}>
                <label className="block text-sm font-bold text-white">
                  Notice Period <span className="text-rose-500">*</span>
                </label>
                <p className="text-xs text-slate-400">Joining availability after offer acceptance</p>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                  {NOTICE_PERIODS.map((np) => {
                    const isSelected = noticePeriod === np;
                    return (
                      <button
                        type="button"
                        key={np}
                        onClick={() => setNoticePeriod(np)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold transition ${
                          isSelected
                            ? 'bg-purple-600 text-white border-purple-500 shadow-md'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
                        }`}
                      >
                        {np}
                      </button>
                    );
                  })}
                </div>
                {errors.noticePeriod && (
                  <p className="text-xs text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.noticePeriod}
                  </p>
                )}
              </div>

              {/* Question 13: Reason for Change */}
              <div className={`bg-slate-900 border ${errors.reasonForChange ? 'border-rose-500' : 'border-slate-800'} rounded-2xl p-6 space-y-3 shadow-md transition`}>
                <label className="block text-sm font-bold text-white">
                  Reason for Change <span className="text-rose-500">*</span>
                </label>
                <p className="text-xs text-slate-400">
                  Help text: Briefly explain why you are looking for a job change and what excites you about this role
                </p>
                <textarea
                  rows={3}
                  value={reasonForChange}
                  onChange={(e) => setReasonForChange(e.target.value)}
                  placeholder="Your answer"
                  className="w-full bg-slate-950 border-b-2 border-slate-700 focus:border-purple-500 px-3 py-2 text-sm text-white focus:outline-none transition rounded-t-lg"
                />
                {errors.reasonForChange && (
                  <p className="text-xs text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.reasonForChange}
                  </p>
                )}
              </div>

              {/* Question 14: Resume Upload */}
              <div className={`bg-slate-900 border ${errors.resume ? 'border-rose-500' : 'border-slate-800'} rounded-2xl p-6 space-y-3 shadow-md transition`}>
                <label className="block text-sm font-bold text-white">
                  Resume Upload <span className="text-rose-500">*</span>
                </label>
                <p className="text-xs text-slate-400">
                  Allow specific file types: PDF, Document (.doc, .docx) • Max file size: 10 MB
                </p>

                {uploadedResumeName ? (
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/40 text-purple-200">
                    <div className="flex items-center gap-3">
                      <FileCheck className="w-5 h-5 text-purple-400" />
                      <div>
                        <p className="text-xs font-bold text-white">{uploadedResumeName}</p>
                        <p className="text-[10px] text-purple-300">{uploadedResumeSize} • Verified Document</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setUploadedResumeName(null);
                        setUploadedResumeSize(null);
                      }}
                      className="p-1.5 rounded-lg hover:bg-purple-800/50 text-purple-300 hover:text-white transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleResumeDrop}
                    className="border-2 border-dashed border-slate-700 hover:border-purple-500 rounded-xl p-6 text-center space-y-2 cursor-pointer bg-slate-950/40 transition group"
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = '.pdf,.doc,.docx';
                      input.onchange = (e: any) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileSelected(e.target.files[0]);
                        }
                      };
                      input.click();
                    }}
                  >
                    <UploadCloud className="w-8 h-8 text-slate-500 group-hover:text-purple-400 mx-auto transition" />
                    <div>
                      <p className="text-xs font-bold text-slate-300 group-hover:text-white">
                        Click to upload or drag & drop resume
                      </p>
                      <p className="text-[10px] text-slate-500">PDF, DOC, DOCX up to 10 MB</p>
                    </div>
                  </div>
                )}
                {errors.resume && (
                  <p className="text-xs text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.resume}
                  </p>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-between pt-4 pb-12">
                <button
                  type="submit"
                  className="px-8 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-sm shadow-xl shadow-purple-600/30 flex items-center gap-2 transition"
                >
                  <Send className="w-4 h-4" />
                  Submit Application
                </button>

                <button
                  type="button"
                  onClick={handleResetForm}
                  className="text-xs text-slate-400 hover:text-slate-200 transition font-medium"
                >
                  Clear form
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* TAB 2: CANDIDATE CRM & SUBMISSIONS TRACKER */}
      {activeTab === 'crm' && (
        <div className="space-y-6">
          {/* Filter Bar & Export Actions */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by name, skills, location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={handlePushCandidatesToBlaster}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition"
                  title="Push candidate contacts to WhatsApp 1,000 Blast for bulk interview scheduling"
                >
                  <Send className="w-3.5 h-3.5" />
                  Push to WhatsApp 1,000 Blast ({filteredCandidates.length})
                </button>

                <button
                  onClick={() => {
                    const csvContent =
                      'data:text/csv;charset=utf-8,' +
                      [
                        'Full Name,Email,Phone,Current Location,Preferred Locations,Position,Skills,Total Exp,Relevant Exp,Current CTC,Expected CTC,Notice Period,Reason,Status,Date',
                        ...filteredCandidates.map(
                          (c) =>
                            `"${c.fullName}","${c.email}","${c.contactNumber}","${c.currentLocation}","${c.preferredLocations.join('; ')}","${c.positionApplied}","${c.keySkills.replace(/"/g, '""')}","${c.totalExperience}","${c.relevantExperience.replace(/"/g, '""')}","${c.currentCtc}","${c.expectedCtc}","${c.noticePeriod}","${c.reasonForChange.replace(/"/g, '""')}","${c.status}","${c.submittedAt}"`
                        ),
                      ].join('\n');
                    const encodedUri = encodeURI(csvContent);
                    const link = document.createElement('a');
                    link.setAttribute('href', encodedUri);
                    link.setAttribute('download', `Candidate_Applications_${companyName.replace(/\s+/g, '_')}.csv`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    showToast('📊 Exported candidate CSV file successfully!');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-400" />
                  Export CSV
                </button>
              </div>
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-800 text-xs">
              <div className="flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-400 font-medium">Filter by:</span>
              </div>

              {/* Role */}
              <select
                value={selectedRoleFilter}
                onChange={(e) => setSelectedRoleFilter(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none"
              >
                <option value="all">All Positions</option>
                {JOB_POSITIONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>

              {/* Location */}
              <select
                value={selectedLocationFilter}
                onChange={(e) => setSelectedLocationFilter(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none"
              >
                <option value="all">All Locations (PAN India)</option>
                {PREFERRED_LOCATION_OPTIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>

              {/* Notice */}
              <select
                value={selectedNoticeFilter}
                onChange={(e) => setSelectedNoticeFilter(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none"
              >
                <option value="all">All Notice Periods</option>
                {NOTICE_PERIODS.map((np) => (
                  <option key={np} value={np}>
                    {np}
                  </option>
                ))}
              </select>

              {(selectedRoleFilter !== 'all' || selectedLocationFilter !== 'all' || selectedNoticeFilter !== 'all' || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedRoleFilter('all');
                    setSelectedLocationFilter('all');
                    setSelectedNoticeFilter('all');
                    setSearchQuery('');
                  }}
                  className="text-indigo-400 hover:text-indigo-300 text-xs font-semibold ml-auto"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>

          {/* Candidates Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">Applications ({filteredCandidates.length})</span>
                <span className="text-xs text-slate-400">• Sorted by most recent</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Candidate</th>
                    <th className="p-3.5">Position Applied</th>
                    <th className="p-3.5">Experience & CTC</th>
                    <th className="p-3.5">Location & Notice</th>
                    <th className="p-3.5">Key Skills</th>
                    <th className="p-3.5">Resume</th>
                    <th className="p-3.5 text-right">Instant WhatsApp & Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredCandidates.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500">
                        No candidates match your current search criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredCandidates.map((cand) => (
                      <tr key={cand.id} className="hover:bg-slate-800/40 transition">
                        {/* Candidate info */}
                        <td className="p-3.5">
                          <div className="space-y-0.5">
                            <span className="font-bold text-white block text-sm">{cand.fullName}</span>
                            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                              <Mail className="w-3 h-3 text-indigo-400" />
                              <span>{cand.email}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                              <Phone className="w-3 h-3 text-emerald-400" />
                              <span className="font-mono text-emerald-300">{cand.contactNumber}</span>
                            </div>
                          </div>
                        </td>

                        {/* Position */}
                        <td className="p-3.5">
                          <span className="font-semibold text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/30 inline-block">
                            {cand.positionApplied}
                          </span>
                        </td>

                        {/* Exp & CTC */}
                        <td className="p-3.5">
                          <div className="space-y-1">
                            <span className="text-white font-medium block">Exp: {cand.totalExperience}</span>
                            <span className="text-[11px] text-slate-400 block">Rel: {cand.relevantExperience}</span>
                            <div className="text-[11px] font-mono text-amber-300">
                              <span>Cur: {cand.currentCtc}</span> → <span className="font-bold">Exp: {cand.expectedCtc}</span>
                            </div>
                          </div>
                        </td>

                        {/* Location & Notice */}
                        <td className="p-3.5">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-slate-300">
                              <MapPin className="w-3 h-3 text-rose-400" />
                              <span>{cand.currentLocation}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 block">
                              Pref: {cand.preferredLocations.slice(0, 2).join(', ')}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-indigo-300 border border-slate-700 inline-block">
                              Notice: {cand.noticePeriod}
                            </span>
                          </div>
                        </td>

                        {/* Key Skills */}
                        <td className="p-3.5 max-w-xs">
                          <p className="line-clamp-2 text-slate-300 text-[11px]">{cand.keySkills}</p>
                        </td>

                        {/* Resume */}
                        <td className="p-3.5">
                          <div className="flex items-center gap-1.5 text-indigo-300 bg-indigo-950/40 px-2 py-1 rounded border border-indigo-500/20 max-w-[130px]">
                            <FileCheck className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="truncate text-[10px] font-medium" title={cand.resumeFileName}>
                              {cand.resumeFileName || 'Resume.pdf'}
                            </span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenCandidateDispatcher(cand, 'interview')}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-white font-bold text-[11px] flex items-center gap-1 border border-emerald-500/30 transition shadow-xs"
                              title="Open Customizable WhatsApp Message Dispatcher"
                            >
                              <MessageSquare className="w-3 h-3" />
                              <span>WhatsApp</span>
                            </button>
                            <button
                              onClick={() => handleSendCandidateWhatsApp(cand, 'interview')}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 transition shadow-sm"
                              title="Send WhatsApp Interview Invite"
                            >
                              <Send className="w-3 h-3" />
                              Invite
                            </button>
                            <button
                              onClick={() => handleSendCandidateWhatsApp(cand, 'ack')}
                              className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition"
                              title="Send WhatsApp Acknowledgment"
                            >
                              Ack
                            </button>
                            <button
                              onClick={() => {
                                const subject = encodeURIComponent(`Application Update: ${cand.positionApplied} at ${companyName}`);
                                const body = encodeURIComponent(
                                  `Dear ${cand.fullName},\n\nThank you for applying for the ${cand.positionApplied} opening at ${companyName}.\n\nWe would like to invite you for an online interview.\n\nBest Regards,\nHR Team`
                                );
                                window.open(`mailto:${cand.email}?subject=${subject}&body=${body}`, '_blank');
                              }}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                              title="Send Email"
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FORM STRUCTURE & STEP-BY-STEP SETUP GUIDE */}
      {activeTab === 'guide' && (
        <div className="space-y-6">
          {/* Header Description Box to Copy */}
          <div className="bg-slate-900 border border-purple-500/30 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-400" />
                <h3 className="text-base font-bold text-white">Suggested Form Description Header</h3>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(formDescriptionText);
                  setCopiedHeader(true);
                  showToast('📋 Copied Form Header Description to clipboard!');
                  setTimeout(() => setCopiedHeader(false), 2000);
                }}
                className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 transition"
              >
                {copiedHeader ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedHeader ? 'Copied!' : 'Copy Header Text'}</span>
              </button>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed font-mono whitespace-pre-line">
              {formDescriptionText}
            </div>
          </div>

          {/* Form Structure Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 bg-slate-950/80 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Google Form Structure & Field Setup</h3>
              <p className="text-xs text-slate-400">
                Exact field layout, question types, validation rules, and help text for clean candidate data collection.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Field Name</th>
                    <th className="p-3.5">Question Type</th>
                    <th className="p-3.5">Required?</th>
                    <th className="p-3.5">Options / Help Text / Settings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  <tr>
                    <td className="p-3.5 font-bold text-white">Full Name</td>
                    <td className="p-3.5 text-purple-300">Short answer</td>
                    <td className="p-3.5"><span className="text-rose-400 font-bold">Required</span></td>
                    <td className="p-3.5 text-slate-400">Full legal name as per government ID</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-white">Email ID</td>
                    <td className="p-3.5 text-purple-300">Short answer</td>
                    <td className="p-3.5"><span className="text-rose-400 font-bold">Required</span></td>
                    <td className="p-3.5 text-emerald-400 font-medium">Enable response validation: Text → Email</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-white">Contact Number</td>
                    <td className="p-3.5 text-purple-300">Short answer</td>
                    <td className="p-3.5"><span className="text-rose-400 font-bold">Required</span></td>
                    <td className="p-3.5 text-emerald-400 font-medium">Enable response validation: Number (10 digits)</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-white">Current Location</td>
                    <td className="p-3.5 text-purple-300">Short answer</td>
                    <td className="p-3.5"><span className="text-rose-400 font-bold">Required</span></td>
                    <td className="p-3.5 text-slate-400">e.g., Mumbai, Bangalore, Delhi NCR, Remote</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-white">Preferred Location(s)</td>
                    <td className="p-3.5 text-purple-300">Checkboxes / Short answer</td>
                    <td className="p-3.5"><span className="text-rose-400 font-bold">Required</span></td>
                    <td className="p-3.5 text-slate-300">PAN India, Work from Home (Remote), Delhi NCR, Bangalore, Mumbai, etc.</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-white">Position Applied For</td>
                    <td className="p-3.5 text-purple-300">Dropdown</td>
                    <td className="p-3.5"><span className="text-rose-400 font-bold">Required</span></td>
                    <td className="p-3.5 text-slate-300">Software Engineer, AI/ML Specialist, Full Stack Developer, Python, HR, Sales</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-white">Key Skills</td>
                    <td className="p-3.5 text-purple-300">Paragraph</td>
                    <td className="p-3.5"><span className="text-rose-400 font-bold">Required</span></td>
                    <td className="p-3.5 text-slate-400">Help text: List your primary skills and technical stack</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-white">Total Work Experience</td>
                    <td className="p-3.5 text-purple-300">Dropdown / Short answer</td>
                    <td className="p-3.5"><span className="text-rose-400 font-bold">Required</span></td>
                    <td className="p-3.5 text-slate-300">Fresher / &lt;1 Year, 1–2 Years, 3–5 Years, 5+ Years</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-white">Relevant Experience</td>
                    <td className="p-3.5 text-purple-300">Short answer</td>
                    <td className="p-3.5"><span className="text-rose-400 font-bold">Required</span></td>
                    <td className="p-3.5 text-slate-400">Help text: Years/Months of experience relevant to this specific role</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-white">Current CTC (per annum)</td>
                    <td className="p-3.5 text-purple-300">Short answer</td>
                    <td className="p-3.5"><span className="text-rose-400 font-bold">Required</span></td>
                    <td className="p-3.5 text-slate-400">e.g., ₹8 LPA or N/A (Fresher)</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-white">Expected CTC (per annum)</td>
                    <td className="p-3.5 text-purple-300">Short answer</td>
                    <td className="p-3.5"><span className="text-rose-400 font-bold">Required</span></td>
                    <td className="p-3.5 text-slate-400">e.g., ₹12 LPA or Negotiable</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-white">Notice Period</td>
                    <td className="p-3.5 text-purple-300">Dropdown</td>
                    <td className="p-3.5"><span className="text-rose-400 font-bold">Required</span></td>
                    <td className="p-3.5 text-slate-300">Immediate, 15 Days, 30 Days, 60 Days, 90 Days</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-white">Reason for Change</td>
                    <td className="p-3.5 text-purple-300">Paragraph</td>
                    <td className="p-3.5"><span className="text-rose-400 font-bold">Required</span></td>
                    <td className="p-3.5 text-slate-400">Help text: Briefly explain why you are looking for a job change</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-white">Resume Upload</td>
                    <td className="p-3.5 text-purple-300">File upload</td>
                    <td className="p-3.5"><span className="text-rose-400 font-bold">Required</span></td>
                    <td className="p-3.5 text-indigo-400 font-medium">Specific file types: PDF, Document • Max file size: 10 MB</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Step-by-Step Instructions */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5 shadow-xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Step-by-Step Instructions to Build It in Google Forms
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-xs">1</span>
                <h4 className="font-bold text-white text-sm">Create New Blank Form</h4>
                <p className="text-slate-400 leading-relaxed">
                  Go to <a href="https://forms.new" target="_blank" rel="noreferrer" className="text-purple-400 underline font-semibold">forms.new</a>.
                  Title the form: <code className="bg-slate-900 px-1 py-0.5 rounded text-purple-300">Job Application Form - {companyName}</code>.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-xs">2</span>
                <h4 className="font-bold text-white text-sm">Paste Header Description</h4>
                <p className="text-slate-400 leading-relaxed">
                  Click the form description box right beneath the title and paste the suggested intro text provided above.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-xs">3</span>
                <h4 className="font-bold text-white text-sm">Add Each Field & Toggle Required</h4>
                <p className="text-slate-400 leading-relaxed">
                  Click the <strong>+</strong> button on the right sidebar to add each question. Toggle the <strong>Required</strong> switch to ON for all 14 fields.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-xs">4</span>
                <h4 className="font-bold text-white text-sm">Enable Response Validation</h4>
                <p className="text-slate-400 leading-relaxed">
                  For <strong>Email</strong> and <strong>Contact Number</strong>, click the three dots (⋮) on the bottom right → select <strong>Response validation</strong> (Email → Text is email, Contact → Number).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 md:col-span-2">
                <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-xs">5</span>
                <h4 className="font-bold text-white text-sm">Link Responses to Google Sheets</h4>
                <p className="text-slate-400 leading-relaxed">
                  Click on the <strong>Responses</strong> tab at the top → click the green <strong>Link to Sheets</strong> icon. Every new submission will automatically populate a real-time Google Sheet spreadsheet!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: 1-CLICK GOOGLE APPS SCRIPT BUILDER */}
      {activeTab === 'script' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Code className="w-5 h-5 text-amber-400" />
                  1-Click Auto-Generate Form via Google Apps Script
                </h3>
                <p className="text-xs text-slate-300">
                  Run this single Google Apps Script to automatically build the complete Recruitment Google Form and link it to Google Sheets in 5 seconds!
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <a
                  href="https://script.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                  Open script.google.com
                </a>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(appsScriptCode);
                    setCopiedScript(true);
                    showToast('⚡ Copied complete Google Apps Script to clipboard!');
                    setTimeout(() => setCopiedScript(false), 2500);
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-amber-600/30 transition"
                >
                  {copiedScript ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedScript ? 'Copied Code!' : 'Copy Complete Script'}</span>
                </button>
              </div>
            </div>

            {/* Code Box */}
            <div className="relative">
              <pre className="bg-slate-950 p-4 sm:p-6 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono overflow-x-auto max-h-[500px] leading-relaxed">
                {appsScriptCode}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: WHATSAPP & EMAIL AUTO-RESPONDER TEMPLATES */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Template 1: Application Received */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  TEMPLATE 1: AUTO-ACKNOWLEDGE
                </span>
                <span className="text-xs text-slate-400">WhatsApp & Email</span>
              </div>
              <h4 className="font-bold text-white text-base">Application Received Acknowledgment</h4>
              <p className="text-xs text-slate-400">Triggered immediately upon Google Form submission.</p>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono whitespace-pre-line leading-relaxed">
{`Hello {CandidateName},

Thank you for applying for the *{Position}* opening at *${companyName}*!

We have successfully received your application, resume, and preferences (PAN India / Remote).

Our Talent Acquisition team is currently reviewing your profile against our open requirements. We will update you on the next round within 24–48 hours.

Warm Regards,
Talent Acquisition Team
${companyName}`}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => {
                  const text = `Hello {CandidateName},\n\nThank you for applying for the opening at ${companyName}! We have received your application and will review it shortly.`;
                  navigator.clipboard.writeText(text);
                  showToast('📋 Copied acknowledgment template!');
                }}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <Copy className="w-3.5 h-3.5" />
                Copy Template
              </button>
            </div>
          </div>

          {/* Template 2: Interview Invitation */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  TEMPLATE 2: SHORTLIST & INVITE
                </span>
                <span className="text-xs text-slate-400">Google Meet & WhatsApp</span>
              </div>
              <h4 className="font-bold text-white text-base">Online Technical Interview Invitation</h4>
              <p className="text-xs text-slate-400">Sent to shortlisted candidates for technical rounds.</p>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono whitespace-pre-line leading-relaxed">
{`Dear {CandidateName},

Congratulations! We are pleased to inform you that your profile has been shortlisted for the *{Position}* opening at *${companyName}*.

We would like to invite you for a 45-Minute Online Video Interview:
🗓️ Date: Tomorrow or mutual convenient slot
⏰ Time: 2:00 PM – 5:30 PM (IST)
📍 Mode: Google Meet
🎯 Agenda: Technical Discussion, Architecture, Problem Solving

Please reply to confirm your availability or propose an alternative time slot.

Warm Regards,
Recruitment Team
${companyName}`}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => {
                  const text = `Dear {CandidateName},\n\nCongratulations! Your profile has been shortlisted for the opening at ${companyName}. Please confirm your availability for an online interview.`;
                  navigator.clipboard.writeText(text);
                  showToast('📋 Copied interview invitation template!');
                }}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <Copy className="w-3.5 h-3.5" />
                Copy Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
