export type UserRole = 'superadmin' | 'admin' | 'manager' | 'operator';

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  credits: number;
  token: string;
  role: UserRole;
  isGoogleUser?: boolean;
  googleSub?: string;
  emailVerified?: boolean;
  status: 'active' | 'suspended' | 'pending';
  dailyBlastLimit: number;
  dailyAdBudgetLimit: number; // in INR
  canRunAds: boolean;
  canExportData: boolean;
  canManageUsers: boolean;
  encryptionFingerprint?: string;
  createdAt: string;
  lastLoginAt: string;
}

export interface SecuritySettings {
  isEncryptionActive: boolean;
  algorithm: 'AES-GCM-256';
  keyFingerprint: string;
  isLocked: boolean;
  showCiphertext: boolean;
  requirePinOnResume: boolean;
  lastRotatedAt: string;
}

export type NodeType =
  | 'trigger'
  | 'search'
  | 'llm'
  | 'memory'
  | 'sheets'
  | 'email'
  | 'whatsapp'
  | 'delay';

export interface WorkflowNode {
  id: string;
  title: string;
  type: NodeType;
  provider: string;
  x: number;
  y: number;
  config: Record<string, any>;
  description: string;
  status?: 'idle' | 'running' | 'success' | 'error';
  lastOutput?: any;
}

export interface WorkflowConnection {
  id: string;
  from: string;
  to: string;
  label?: string;
}

export interface WorkflowPlan {
  id?: string;
  workflowTitle: string;
  summary: string;
  estimatedCredits: number;
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  sampleExecutionLog: string[];
}

export interface WhatsAppAccount {
  id: string;
  phone: string;
  displayName: string;
  status: 'active' | 'warming' | 'resting' | 'disconnected';
  healthScore: number; // 0 - 100%
  sentToday: number;
  dailyLimit: number;
  warmupDay?: number;
  qrCodeUrl?: string;
}

export interface BroadcastButton {
  id: string;
  type: 'url' | 'call' | 'quick_reply';
  text: string;
  value?: string;
}

export interface BroadcastTemplate {
  id: string;
  title: string;
  category: 'Masterclass' | 'Recruitment' | 'Special Announcement' | 'Event' | 'FollowUp' | 'Billing' | 'Offer' | 'Media' | 'Custom' | string;
  description?: string;
  body: string;
  buttons: BroadcastButton[];
  variables: string[];
  tags?: string[];
  mediaType?: 'none' | 'image' | 'video' | 'pdf';
  mediaUrl?: string;
}

export interface CampaignRecipient {
  id: string;
  name: string;
  phone: string;
  company?: string;
  course?: string;
  status: 'pending' | 'delivered' | 'read' | 'replied' | 'failed';
}

export interface Campaign {
  id: string;
  title: string;
  templateId: string;
  totalRecipients: number;
  sentCount: number;
  deliveredCount: number;
  replyCount: number;
  status: 'draft' | 'running' | 'completed' | 'paused';
  createdAt: string;
  antiBan: {
    minDelaySeconds: number;
    maxDelaySeconds: number;
    rotateAccounts: boolean;
    batchPauseEvery: number;
    batchPauseSeconds: number;
  };
}

export interface GoogleSheetLead {
  id: string;
  fullName: string;
  phone: string;
  courseOrMandate: string;
  leadType: 'Course Admission' | 'Corporate Hiring' | 'General FAQ';
  timestamp: string;
  status: 'New Lead' | 'Counselor Contacted' | 'Enrolled' | 'Client Call Scheduled';
  notes: string;
}

export interface CourseCatalogItem {
  id: string;
  title: string;
  category: string;
  originalFee: string;
  earlyBirdFee: string;
  seatsLeft: number;
  duration: string;
  topics: string[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface IntegrationApp {
  id: string;
  name: string;
  category: 'Developer' | 'CRM' | 'Messaging' | 'Cloud Storage' | 'Marketing' | 'AI & LLM';
  icon: string;
  status: 'connected' | 'ready' | 'pending';
  description: string;
  features: string[];
  docSnippet: string;
}

export interface GroupScrapedContact {
  id: string;
  phone: string;
  groupName: string;
  status: 'active' | 'unknown' | 'filtered';
  extractedAt: string;
}

export interface CampaignAttachment {
  id: string;
  type: 'pdf' | 'image' | 'catalog';
  name: string;
  size: string;
  url: string;
  description: string;
}

export interface VideoScene {
  id: string;
  sceneNumber: number;
  durationSeconds: number;
  title: string;
  narration: string;
  visualPrompt: string;
  onScreenText: string;
  bgGradient: string;
  cameraMovement: 'zoom_in' | 'pan_left' | 'pan_right' | 'pulse';
}

export interface YouTubeVideoProject {
  id: string;
  title: string;
  aspectRatio: '16:9' | '9:16' | '1:1';
  targetPlatform: 'YouTube Video' | 'YouTube Shorts' | 'TikTok / Reels' | 'Instagram Feed Ad';
  durationSeconds: number;
  description: string;
  tags: string[];
  scenes: VideoScene[];
  thumbnailPrompt: string;
}

export interface GeneratedImageItem {
  id: string;
  prompt: string;
  aspectRatio: '16:9' | '9:16' | '1:1' | '4:3';
  style: string;
  dataUrl: string;
  createdAt: string;
  title: string;
  category?: 'festival' | 'ad' | 'thumbnail' | 'concept';
}

// AI Video Engine Selection (Veo 3, Grok Imagine, Gemini)
export type VideoEngineType = 'veo3' | 'grok' | 'gemini';

// Syllabus Management Types
export interface SyllabusModule {
  week: number;
  title: string;
  description: string;
  topics: string[];
  practicalProject: string;
  durationHours: number;
}

export interface CourseSyllabus {
  id: string;
  courseTitle: string;
  category: 'AI & Machine Learning' | 'Low-Code Automation' | 'Full-Stack Engineering' | 'Corporate Training';
  targetAudience: string;
  durationWeeks: number;
  totalHours: number;
  overview: string;
  modules: SyllabusModule[];
  careerOutcomes: string[];
  videoPitchScript: string;
  createdAt: string;
  downloadUrl?: string;
}

// Candidate Resume & ATS Types
export interface CandidateResume {
  id: string;
  fullName: string;
  targetRole: string;
  contact: {
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
  };
  professionalSummary: string;
  atsScore: number; // 0 - 100
  matchedSyllabusId?: string;
  coreSkills: string[];
  toolsAndFrameworks: string[];
  workExperience: {
    company: string;
    role: string;
    duration: string;
    highlights: string[];
  }[];
  education: string;
  certifications: string[];
  videoPortfolioScript: string;
  createdAt: string;
}

// Image to Video Motion Project
export interface ImageToVideoProject {
  id: string;
  sourceImageUrl: string;
  sourceImageTitle: string;
  motionPrompt: string;
  cameraEffect: 'cinematic_dolly' | '3d_parallax' | 'pan_zoom' | 'festive_particles' | 'light_rays';
  engine: VideoEngineType;
  aspectRatio: '9:16' | '16:9' | '1:1';
  durationSeconds: number;
  outputVideoUrl: string;
  status: 'ready' | 'rendering' | 'completed';
  createdAt: string;
}

// Festival & Ad Video Preset
export interface FestivalAdPreset {
  id: string;
  name: string;
  category: 'festival' | 'commercial_ad';
  festivalOrBrand: string;
  tagline: string;
  visualPrompt: string;
  narrationScript: string;
  recommendedRatio: '9:16' | '16:9' | '1:1';
  accentGradient: string;
  sampleMediaUrl: string;
  whatsappCtaText: string;
}


// Excel Sheet & Leads Management Types
export interface ExcelColumnMapping {
  nameCol?: string;
  phoneCol?: string;
  emailCol?: string;
  companyCol?: string;
  roleCol?: string;
  customTagCol?: string;
}

export interface ExcelSheetData {
  id: string;
  fileName: string;
  sheetName: string;
  uploadedAt: string;
  columns: string[];
  rows: Record<string, any>[];
  totalRows: number;
  mappedFields: ExcelColumnMapping;
  isEncrypted: boolean;
  vaultHash: string;
}

// Social Media Multi-Platform Types
export type SocialPlatform =
  | 'facebook'
  | 'instagram'
  | 'linkedin'
  | 'twitter'
  | 'youtube'
  | 'tiktok'
  | 'pinterest'
  | 'whatsapp';

export interface SocialPost {
  id: string;
  title: string;
  content: string;
  platforms: SocialPlatform[];
  mediaType: 'image' | 'video' | 'none';
  mediaUrl?: string;
  mediaName?: string;
  status: 'published' | 'scheduled' | 'draft';
  scheduledFor?: string;
  publishedAt?: string;
  metrics: {
    likes: number;
    comments: number;
    shares: number;
    reach: number;
    clicks: number;
  };
  authorName: string;
  authorEmail: string;
}

// Social Media Ads Campaign Types
export type AdNetwork = 'meta' | 'google_youtube' | 'linkedin' | 'twitter';
export type AdObjective =
  | 'click_to_whatsapp'
  | 'lead_generation'
  | 'traffic'
  | 'video_views'
  | 'conversions';

export interface SocialAdCampaign {
  id: string;
  name: string;
  network: AdNetwork;
  objective: AdObjective;
  status: 'active' | 'paused' | 'completed' | 'draft';
  dailyBudget: number; // in INR
  currency: 'INR' | 'USD';
  targetLocations: string[];
  targetAgeRange: string;
  targetInterests: string[];
  headline: string;
  primaryText: string;
  mediaType: 'image' | 'video';
  mediaUrl: string;
  callToAction: 'Send WhatsApp Message' | 'Learn More' | 'Sign Up' | 'Apply Now' | 'Download';
  destinationUrl?: string;
  leadsGenerated: number;
  impressions: number;
  clicks: number;
  spend: number;
  cpl: number; // cost per lead
  roas: number; // return on ad spend
  createdAt: string;
  syncedWithAudience?: string; // Excel sheet ID or custom audience
}

// Admin Audit Log
export interface AdminAuditLog {
  id: string;
  timestamp: string;
  actorEmail: string;
  actorRole: UserRole;
  action: string;
  targetResource: string;
  details: string;
  ipAddress?: string;
  status: 'success' | 'warning' | 'denied';
}

// Broadcast Notifications & Delivery Reports
export interface BroadcastNotification {
  id: string;
  timestamp: string;
  title: string;
  message: string;
  type: 'broadcast_complete' | 'mail_dispatched' | 'whatsapp_sent' | 'security_alert';
  recipientsCount: number;
  senderPhone: string;
  recipientEmail: string;
  adminWhatsApp: string;
  mailSubject: string;
  deliveryStatus: 'delivered' | 'pending' | 'failed';
  read: boolean;
  sampleRecipient?: {
    name: string;
    phone: string;
    message: string;
    company?: string;
  };
}

export interface MailDeliveryReport {
  id: string;
  broadcastId: string;
  dispatchedAt: string;
  toEmail: string;
  subject: string;
  senderName: string;
  recipientsTotal: number;
  deliveredCount: number;
  openRateEstimated: string;
  templateName: string;
  senderPhone: string;
  dkimSignature: string;
  spfStatus: string;
  htmlBody: string;
}

export interface RecruitmentCandidate {
  id: string;
  fullName: string;
  email: string;
  contactNumber: string;
  currentLocation: string;
  preferredLocations: string[];
  positionApplied: string;
  keySkills: string;
  totalExperience: string;
  relevantExperience: string;
  currentCtc: string;
  expectedCtc: string;
  noticePeriod: string;
  reasonForChange: string;
  resumeFileName?: string;
  resumeFileSize?: string;
  submittedAt: string;
  status: 'new' | 'reviewed' | 'shortlisted' | 'interview_scheduled' | 'offered' | 'rejected';
  notes?: string;
}

export interface RecruitmentFormConfig {
  companyName: string;
  formTitle: string;
  formDescription: string;
  contactEmail: string;
  linkedSheetName: string;
  googleFormUrl?: string;
  googleSheetUrl?: string;
}


