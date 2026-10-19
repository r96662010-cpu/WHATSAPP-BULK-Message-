import React, { useState } from 'react';
import { GroupScrapedContact, CampaignAttachment, CampaignRecipient } from '../../types';
import { appendRecipientsToStorage } from '../../data/sampleAudience';
import {
  Users,
  Filter,
  Flame,
  FileText,
  Download,
  CheckCircle2,
  AlertCircle,
  Copy,
  Plus,
  Trash2,
  Send,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

const INITIAL_SCRAPED: GroupScrapedContact[] = [
  { id: 'sc-1', phone: '+91 98450 99812', groupName: 'Bangalore Tech Founders & AI Club', status: 'active', extractedAt: '2026-10-17 01:20' },
  { id: 'sc-2', phone: '+91 97110 33421', groupName: 'Bangalore Tech Founders & AI Club', status: 'active', extractedAt: '2026-10-17 01:20' },
  { id: 'sc-3', phone: '+91 98231 77610', groupName: 'Bangalore Tech Founders & AI Club', status: 'active', extractedAt: '2026-10-17 01:20' },
  { id: 'sc-4', phone: '+91 99001 55432', groupName: 'Delhi-NCR HR Leaders Network', status: 'active', extractedAt: '2026-10-17 01:35' },
  { id: 'sc-5', phone: '+91 96540 12890', groupName: 'Delhi-NCR HR Leaders Network', status: 'active', extractedAt: '2026-10-17 01:35' },
];

const INITIAL_ATTACHMENTS: CampaignAttachment[] = [
  {
    id: 'att-1',
    type: 'pdf',
    name: 'Master_AI_Automation_Syllabus_2026.pdf',
    size: '2.4 MB',
    url: 'https://shrishyam.edu/assets/syllabus.pdf',
    description: 'Complete 6-week curriculum with Python, LLMs, and Robotics modules',
  },
  {
    id: 'att-2',
    type: 'pdf',
    name: 'Shri_Shyam_Corporate_Staffing_Brochure.pdf',
    size: '1.8 MB',
    url: 'https://shrishyam.edu/assets/staffing_brochure.pdf',
    description: 'Executive hiring matrices, client case studies, and SLA guarantees',
  },
  {
    id: 'att-3',
    type: 'image',
    name: 'Early_Bird_Masterclass_Flyer.png',
    size: '850 KB',
    url: 'https://shrishyam.edu/assets/early_bird_banner.png',
    description: 'Promotional graphic highlighting the 50-seat limited batch offer',
  },
];

export const BlasterUtilitiesHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'scraper' | 'filter' | 'warmer' | 'attachments'>('scraper');

  // Scraper State
  const [groupLinkInput, setGroupLinkInput] = useState('');
  const [isScraping, setIsScraping] = useState(false);
  const [scrapedContacts, setScrapedContacts] = useState<GroupScrapedContact[]>(INITIAL_SCRAPED);

  // Number Filter State
  const [rawNumbersInput, setRawNumbersInput] = useState(
    `+91 98450 11223\n+91 98765 00000\n+91 99002 88471\n+91 97230 45981\n+91 98112 34567\n011 2345 6789\n+91 98000 00001`
  );
  const [filteredResult, setFilteredResult] = useState<{ active: string[]; inactive: string[] } | null>(null);

  // Attachments State
  const [attachments, setAttachments] = useState<CampaignAttachment[]>(INITIAL_ATTACHMENTS);

  // Handle Group Scraping
  const handleStartScrape = () => {
    if (!groupLinkInput.trim()) return;
    setIsScraping(true);

    setTimeout(() => {
      const generated = [
        { id: `sc_${Date.now()}_1`, phone: `+91 ${Math.floor(9000000000 + Math.random() * 999999999)}`, groupName: groupLinkInput, status: 'active' as const, extractedAt: 'Just now' },
        { id: `sc_${Date.now()}_2`, phone: `+91 ${Math.floor(9000000000 + Math.random() * 999999999)}`, groupName: groupLinkInput, status: 'active' as const, extractedAt: 'Just now' },
        { id: `sc_${Date.now()}_3`, phone: `+91 ${Math.floor(9000000000 + Math.random() * 999999999)}`, groupName: groupLinkInput, status: 'active' as const, extractedAt: 'Just now' },
      ];
      setScrapedContacts((prev) => [...generated, ...prev]);
      setIsScraping(false);
      setGroupLinkInput('');
    }, 1200);
  };

  // Handle Number Filter
  const handleFilterNumbers = () => {
    const list = rawNumbersInput
      .split('\n')
      .map((n) => n.trim())
      .filter(Boolean);

    const active: string[] = [];
    const inactive: string[] = [];

    list.forEach((num) => {
      if (num.startsWith('+91 9') || num.startsWith('+91 8') || num.startsWith('+91 7')) {
        active.push(num);
      } else {
        inactive.push(num);
      }
    });

    setFilteredResult({ active, inactive });
  };

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Add All Scraped to Campaign
  const handleAddAllScraped = () => {
    if (scrapedContacts.length === 0) return;
    const newItems: CampaignRecipient[] = scrapedContacts.map((sc, i) => ({
      id: `sc-lead-${Date.now()}-${i}`,
      name: `Member ${sc.phone.slice(-4)}`,
      phone: sc.phone,
      company: sc.groupName,
      course: 'WhatsApp Group Outreach',
      status: 'pending',
    }));

    const updated = appendRecipientsToStorage(newItems);
    showToast(`⚡ Added ALL ${scrapedContacts.length} scraped contacts to WhatsApp Blaster queue! (Total now: ${updated.length})`);
  };

  // Add All Active Cleaned Numbers to Campaign
  const handleAddAllActiveNumbers = () => {
    if (!filteredResult || filteredResult.active.length === 0) return;
    const newItems: CampaignRecipient[] = filteredResult.active.map((num, i) => ({
      id: `filter-lead-${Date.now()}-${i}`,
      name: `Verified Contact ${i + 1}`,
      phone: num,
      company: 'Validated WhatsApp User',
      course: 'AI Masterclass Offer',
      status: 'pending',
    }));

    const updated = appendRecipientsToStorage(newItems);
    showToast(`⚡ Added ALL ${filteredResult.active.length} verified active numbers to WhatsApp Blaster queue! (Total now: ${updated.length})`);
  };

  // Add All Attachments to Campaign
  const handleAddAllAttachments = () => {
    showToast(`⚡ Added ALL ${attachments.length} brochures & PDFs to WhatsApp Campaign templates!`);
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-900 border border-cyan-500/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-xs uppercase tracking-wider">
              WP Blaster Plus Suite
            </span>
            <span className="text-xs text-slate-400">
              • Group Scraper, Number Filter, SIM Warmer & Rich Attachments
            </span>
          </div>
          <h1 className="text-xl lg:text-2xl font-extrabold text-white">
            WhatsApp Marketing Utilities & Growth Suite
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Extract members from WhatsApp groups, cleanse landlines, warm accounts safely, and attach syllabus PDFs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Anti-Ban Compliance Active
          </span>
        </div>
      </div>

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-900/90 to-teal-900/90 border border-emerald-500/50 text-white text-xs font-bold flex items-center justify-between shadow-xl animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-300 animate-pulse" />
            <span>{toastMessage}</span>
          </div>
          <span className="text-[10px] text-emerald-200 bg-emerald-950/60 px-2 py-0.5 rounded-full font-mono">
            Synced to WhatsApp Blaster
          </span>
        </div>
      )}

      {/* Utilities Navigation Tabs */}
      <div className="flex items-center bg-slate-900 p-1.5 rounded-xl border border-slate-800 gap-1 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab('scraper')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition whitespace-nowrap ${
            activeTab === 'scraper'
              ? 'bg-cyan-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Group Scraper & Extractor ({scrapedContacts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('filter')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition whitespace-nowrap ${
            activeTab === 'filter'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Filter className="w-4 h-4" />
          <span>Number Filter & Validator</span>
        </button>

        <button
          onClick={() => setActiveTab('warmer')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition whitespace-nowrap ${
            activeTab === 'warmer'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Flame className="w-4 h-4 text-amber-400" />
          <span>Account Warmer Suite</span>
        </button>

        <button
          onClick={() => setActiveTab('attachments')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition whitespace-nowrap ${
            activeTab === 'attachments'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Rich Attachments (PDFs & Media)</span>
        </button>
      </div>

      {/* TAB 1: GROUP SCRAPER */}
      {activeTab === 'scraper' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              Extract Numbers from WhatsApp Groups
            </h3>
            <p className="text-xs text-slate-400">
              Paste public WhatsApp group invite links (e.g. <code>https://chat.whatsapp.com/...</code>) or group name to extract verified member numbers.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Group Invite Link or Title
                </label>
                <input
                  type="text"
                  value={groupLinkInput}
                  onChange={(e) => setGroupLinkInput(e.target.value)}
                  placeholder="https://chat.whatsapp.com/invite/..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <button
                onClick={handleStartScrape}
                disabled={!groupLinkInput.trim() || isScraping}
                className="w-full py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition disabled:opacity-40"
              >
                {isScraping ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Extracting Active Members...</span>
                  </>
                ) : (
                  <>
                    <Users className="w-3.5 h-3.5" />
                    <span>Scrape Group Members</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <p className="font-semibold text-white">Anti-Spam Scraper Guidelines:</p>
              <p>• Only extracts public participant IDs without joining notice</p>
              <p>• Automatically formats country codes (+91, +1, +44)</p>
            </div>
          </div>

          <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Extracted Contact Numbers ({scrapedContacts.length})
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAddAllScraped}
                  className="px-3 py-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition"
                  title="Add all scraped contacts to WhatsApp Blaster broadcast queue"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
                  <span>⚡ Add All ({scrapedContacts.length}) to Blaster</span>
                </button>
                <button
                  onClick={() => alert(`Exported ${scrapedContacts.length} numbers to CSV!`)}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                >
                  <Download className="w-3 h-3" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Phone Number</th>
                    <th className="py-2.5 px-3">Extracted Group</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Extracted At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {scrapedContacts.map((sc) => (
                    <tr key={sc.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-2.5 px-3 font-mono font-bold text-white">{sc.phone}</td>
                      <td className="py-2.5 px-3 text-slate-300">{sc.groupName}</td>
                      <td className="py-2.5 px-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                          {sc.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-400 text-[11px] font-mono">{sc.extractedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: NUMBER FILTER */}
      {activeTab === 'filter' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Filter className="w-4 h-4 text-indigo-400" />
              Raw Numbers Input (One per line)
            </h3>
            <textarea
              rows={10}
              value={rawNumbersInput}
              onChange={(e) => setRawNumbersInput(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleFilterNumbers}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Validate & Clean Numbers</span>
            </button>
          </div>

          <div className="lg:col-span-6 p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white">Validation Results</h3>

            {filteredResult ? (
              <div className="space-y-4 animate-in fade-in">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Active WhatsApp Accounts ({filteredResult.active.length})
                    </span>
                    <button
                      onClick={handleAddAllActiveNumbers}
                      className="px-3 py-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition"
                      title="Add all active validated numbers to WhatsApp Blaster queue"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
                      <span>⚡ Add All ({filteredResult.active.length}) to Blaster</span>
                    </button>
                  </div>
                  <pre className="p-2.5 rounded-lg bg-slate-950 text-xs font-mono text-emerald-300 max-h-36 overflow-y-auto">
                    {filteredResult.active.join('\n')}
                  </pre>
                </div>

                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
                  <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5 mb-2">
                    <AlertCircle className="w-4 h-4 text-rose-400" />
                    Inactive / Landlines Removed ({filteredResult.inactive.length})
                  </span>
                  <pre className="p-2.5 rounded-lg bg-slate-950 text-xs font-mono text-rose-300 max-h-28 overflow-y-auto">
                    {filteredResult.inactive.join('\n')}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-500">
                Click "Validate & Clean Numbers" to scan active WhatsApp accounts vs. invalid numbers.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: ACCOUNT WARMER */}
      {activeTab === 'warmer' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400" />
              Automated WhatsApp Account Warmer Curve
            </h3>
            <span className="text-xs text-amber-400 font-semibold">Stage: Day 3 of 5 (Active)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-emerald-400">Day 1</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <p className="font-extrabold text-white text-base">20 Msgs</p>
              <p className="text-[11px] text-slate-400 mt-1">Peer conversational exchange</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-emerald-400">Day 2</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <p className="font-extrabold text-white text-base">50 Msgs</p>
              <p className="text-[11px] text-slate-400 mt-1">Small group join & replies</p>
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-amber-400">Day 3 (Current)</span>
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              </div>
              <p className="font-extrabold text-white text-base">150 Msgs</p>
              <p className="text-[11px] text-amber-300 mt-1">Initial safe outreach batch</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-slate-400">Day 4</span>
                <span className="text-[10px] text-slate-500">Upcoming</span>
              </div>
              <p className="font-extrabold text-slate-300 text-base">500 Msgs</p>
              <p className="text-[11px] text-slate-500 mt-1">Expanded marketing blast</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-slate-400">Day 5+</span>
                <span className="text-[10px] text-slate-500">Upcoming</span>
              </div>
              <p className="font-extrabold text-slate-300 text-base">1,000+ Msgs</p>
              <p className="text-[11px] text-slate-500 mt-1">Unconstrained scale broadcast</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: RICH ATTACHMENTS */}
      {activeTab === 'attachments' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-400" />
              Campaign Media & PDF Attachments
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={handleAddAllAttachments}
                className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md shadow-purple-600/20 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-200" />
                <span>⚡ Add All ({attachments.length}) to Campaign</span>
              </button>
              <button
                onClick={() => alert('New document attached to campaign templates.')}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Upload PDF / Media</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {attachments.map((att) => (
              <div
                key={att.id}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-purple-500/20 text-purple-400 font-mono">
                      {att.type}
                    </span>
                    <span className="text-[10px] text-slate-400">{att.size}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white truncate">{att.name}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">{att.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <a
                    href={att.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
                  >
                    <span>Preview</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <span className="text-emerald-400 text-[10px] font-bold">✓ Ready to Send</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
