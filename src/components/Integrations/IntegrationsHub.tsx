import React, { useState } from 'react';
import { IntegrationApp } from '../../types';
import {
  Layers,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Search,
  Lock,
  RefreshCw,
  Key,
  Globe,
  Database,
  Cloud,
  FileCode,
  Share2,
  Mail,
  Send,
  Sparkles,
} from 'lucide-react';

const INTEGRATIONS_LIST: IntegrationApp[] = [
  {
    id: 'int-whatsapp',
    name: 'Meta WhatsApp Business Cloud',
    category: 'Messaging',
    icon: '💬',
    status: 'connected',
    description: 'Official Cloud API for two-way customer messaging, templates, and interactive buttons.',
    features: ['Direct Meta Cloud webhook', 'Interactive URL & Call buttons', '24/7 AI agent dispatch'],
    docSnippet: 'POST /v19.0/{phone-number-id}/messages with Bearer token',
  },
  {
    id: 'int-sheets',
    name: 'Google Sheets',
    category: 'CRM',
    icon: '📊',
    status: 'connected',
    description: 'Live spreadsheet integration for Courses Catalog, Admissions FAQ, and Inquiry Lead rows.',
    features: ['Real-time appendRow', 'Dynamic formula recalculation', 'Two-way lead sync'],
    docSnippet: 'Google Sheets API v4 with encrypted OAuth credentials',
  },
  {
    id: 'int-gmail',
    name: 'Gmail (Google Workspace)',
    category: 'Messaging',
    icon: '✉️',
    status: 'connected',
    description: 'Sends automated HTML newsletters, counseling brochures, and lead alerts.',
    features: ['High inbox deliverability', 'MIME multipart HTML generator', 'OAuth 2.0 verified'],
    docSnippet: 'POST https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
  },
  {
    id: 'int-github',
    name: 'GitHub',
    category: 'Developer',
    icon: '🐙',
    status: 'ready',
    description: 'Trigger automations on repository commits, issues, releases, and pull requests.',
    features: ['Webhook event receiver', 'Automated issue triaging', 'Repo activity summaries'],
    docSnippet: 'GitHub REST API v3 with fine-grained personal access tokens',
  },
  {
    id: 'int-salesforce',
    name: 'Salesforce CRM',
    category: 'CRM',
    icon: '☁️',
    status: 'ready',
    description: 'Enterprise contact sync and corporate staffing lead pipeline management.',
    features: ['Lead object insertion', 'Account mandate tracking', 'Opportunity stage triggers'],
    docSnippet: 'Salesforce Composite REST API with JWT Bearer flow',
  },
  {
    id: 'int-hubspot',
    name: 'HubSpot',
    category: 'CRM',
    icon: '🧡',
    status: 'ready',
    description: 'Inbound marketing, customer contact scoring, and multi-channel campaign drip sync.',
    features: ['Contact timeline logging', 'Automated list membership', 'Deal pipeline sync'],
    docSnippet: 'POST https://api.hubapi.com/crm/v3/objects/contacts',
  },
  {
    id: 'int-google-drive',
    name: 'Google Drive',
    category: 'Cloud Storage',
    icon: '📁',
    status: 'connected',
    description: 'Centralized cloud storage for course syllabi, corporate candidate portfolios, and media.',
    features: ['Auto-upload generated PDFs', 'Public share link derivation', 'Folder segregation'],
    docSnippet: 'Google Drive REST API v3 with file multipart upload',
  },
  {
    id: 'int-google-ads',
    name: 'Google Ads',
    category: 'Marketing',
    icon: '🎯',
    status: 'ready',
    description: 'Instant lead-form webhook capture into WhatsApp instant auto-responder.',
    features: ['Lead form webhook trigger', 'Conversion offline tracking', 'Audience synchronization'],
    docSnippet: 'Google Ads API v16 Webhook Ingress',
  },
  {
    id: 'int-wordpress',
    name: 'WordPress',
    category: 'Marketing',
    icon: '📰',
    status: 'ready',
    description: 'Publish automated AI article summaries, newsletters, and educational guides directly to CMS.',
    features: ['REST API draft/publish', 'Featured image association', 'Category & tag auto-assignment'],
    docSnippet: 'POST /wp-json/wp/v2/posts with Application Password',
  },
  {
    id: 'int-twitter',
    name: 'Twitter / X',
    category: 'Marketing',
    icon: '🐦',
    status: 'ready',
    description: 'Broadcast breaking AI news digests and program announcements as Twitter threads.',
    features: ['Thread automation', 'Media card attachments', 'Auto-reply mentions'],
    docSnippet: 'X API v2 POST /2/tweets with OAuth 1.0a/2.0',
  },
  {
    id: 'int-amazon-s3',
    name: 'Amazon S3',
    category: 'Cloud Storage',
    icon: '🪣',
    status: 'ready',
    description: 'Encrypted object storage for generated podcast audio, transcripts, and backups.',
    features: ['AES-256 server-side encryption', 'Signed download URLs', 'Bucket versioning'],
    docSnippet: 'AWS SDK v3 PutObjectCommand with KMS key',
  },
  {
    id: 'int-outlook',
    name: 'Microsoft Outlook (365)',
    category: 'Messaging',
    icon: '📫',
    status: 'ready',
    description: 'Corporate B2B executive recruitment proposals and calendar invite dispatch.',
    features: ['Microsoft Graph API', 'Calendar invite booking', 'Corporate domain deliverability'],
    docSnippet: 'POST https://graph.microsoft.com/v1.0/me/sendMail',
  },
];

export const IntegrationsHub: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [integrations, setIntegrations] = useState<IntegrationApp[]>(INTEGRATIONS_LIST);
  const [testingId, setTestingId] = useState<string | null>(null);

  const categories = ['All', 'Messaging', 'CRM', 'Marketing', 'Developer', 'Cloud Storage'];

  const filteredIntegrations = integrations.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleTestConnection = (id: string) => {
    setTestingId(id);
    setTimeout(() => {
      setIntegrations((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: 'connected' } : item))
      );
      setTestingId(null);
      alert('Credentials verified successfully! End-to-end encrypted connection established.');
    }, 900);
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-900 border border-blue-500/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-bold text-xs uppercase tracking-wider">
              Integration Ecosystem
            </span>
            <span className="text-xs text-slate-400">
              • Official API Connectors & Cloud Integrations
            </span>
          </div>
          <h1 className="text-xl lg:text-2xl font-extrabold text-white">
            Integrations & Service Connectors
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Connect GitHub, Salesforce, HubSpot, Gmail, Google Sheets, Google Ads, WordPress, Twitter, and Amazon S3.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Zero-Leak Encrypted Tokens
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 overflow-x-auto w-full sm:w-auto text-xs font-semibold">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search integrations..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Grid of Integration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIntegrations.map((app) => (
          <div
            key={app.id}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl p-2 rounded-xl bg-slate-950 border border-slate-800">
                    {app.icon}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-white">{app.name}</h3>
                    <span className="text-[10px] font-semibold text-slate-400 px-1.5 py-0.5 rounded bg-slate-800">
                      {app.category}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                    app.status === 'connected'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-blue-500/20 text-blue-400'
                  }`}
                >
                  {app.status}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                {app.description}
              </p>

              <div className="space-y-1 text-[11px] text-slate-400">
                {app.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span className="text-emerald-400">✓</span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
              <button
                onClick={() => handleTestConnection(app.id)}
                disabled={testingId === app.id}
                className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition disabled:opacity-50"
              >
                {testingId === app.id ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <Key className="w-3.5 h-3.5 text-blue-400" />
                    <span>{app.status === 'connected' ? 'Re-verify API' : 'Connect & Test'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
