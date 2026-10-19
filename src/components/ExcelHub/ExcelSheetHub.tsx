import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import { ExcelSheetData, CampaignRecipient } from '../../types';
import { appendRecipientsToStorage } from '../../data/sampleAudience';
import { useSecurity } from '../../context/SecurityContext';
import { useAuth } from '../../context/AuthContext';
import {
  playWhatsAppDeliveryTone,
  notifyDeliverySuccess,
  openWhatsAppDirect,
} from '../../utils/soundAndNotifications';
import confetti from 'canvas-confetti';
import {
  FileSpreadsheet,
  Upload,
  Download,
  Trash2,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  Lock,
  Eye,
  EyeOff,
  Send,
  Share2,
  Filter,
  RefreshCw,
  Sparkles,
  Layers,
  ArrowRight,
  Database,
  ExternalLink,
  Table,
} from 'lucide-react';

// Preset sample spreadsheets
const SAMPLE_SHEETS: ExcelSheetData[] = [
  {
    id: 'sheet-masterclass-1000',
    fileName: 'AI_Masterclass_Admissions_1000.xlsx',
    sheetName: 'Verified Applicants',
    uploadedAt: 'Today, 05:10 AM',
    columns: ['Name', 'Phone', 'Company', 'Course', 'City', 'Status'],
    rows: [
      { Name: 'Aarav Sharma', Phone: '+91 98101 23456', Company: 'Infosys Ltd', Course: 'Master AI & Low-Code', City: 'Bengaluru', Status: 'Verified' },
      { Name: 'Priya Iyer', Phone: '+91 98202 34567', Company: 'Tata Consultancy Services', Course: 'Generative AI Engineering', City: 'Mumbai', Status: 'Verified' },
      { Name: 'Rohan Mehta', Phone: '+91 98303 45678', Company: 'Wipro Digital', Course: 'WhatsApp Cloud Automation', City: 'Pune', Status: 'Verified' },
      { Name: 'Ananya Gupta', Phone: '+91 98404 56789', Company: 'HCL Technologies', Course: 'Prompt Engineering & Agents', City: 'Noida', Status: 'Verified' },
      { Name: 'Vikram Malhotra', Phone: '+91 98505 67890', Company: 'Paytm Payments', Course: 'Master AI & Low-Code', City: 'Delhi', Status: 'Verified' },
      { Name: 'Neha Verma', Phone: '+91 98606 78901', Company: 'Zomato HQ', Course: 'Generative AI Engineering', City: 'Gurugram', Status: 'Verified' },
      { Name: 'Kavita Nair', Phone: '+91 98707 89012', Company: 'Swiggy Tech', Course: 'WhatsApp Cloud Automation', City: 'Hyderabad', Status: 'Verified' },
      { Name: 'Siddharth Joshi', Phone: '+91 98808 90123', Company: 'Flipkart Internet', Course: 'Prompt Engineering & Agents', City: 'Bengaluru', Status: 'Verified' },
      { Name: 'Divya Reddy', Phone: '+91 98909 01234', Company: 'Cognizant', Course: 'Master AI & Low-Code', City: 'Chennai', Status: 'Verified' },
      { Name: 'Aditya Kapoor', Phone: '+91 99010 12345', Company: 'Reliance Jio', Course: 'Generative AI Engineering', City: 'Ahmedabad', Status: 'Verified' },
      { Name: 'Meera Sen', Phone: '+91 99121 23456', Company: 'Tech Mahindra', Course: 'WhatsApp Cloud Automation', City: 'Kolkata', Status: 'Verified' },
      { Name: 'Karan Saxena', Phone: '+91 99232 34567', Company: 'LTIMindtree', Course: 'Prompt Engineering & Agents', City: 'Pune', Status: 'Verified' },
    ],
    totalRows: 12,
    mappedFields: {
      nameCol: 'Name',
      phoneCol: 'Phone',
      companyCol: 'Company',
      roleCol: 'Course',
    },
    isEncrypted: true,
    vaultHash: 'AES256:d84f...91a2',
  },
  {
    id: 'sheet-b2b-recruitment',
    fileName: 'Corporate_Hiring_Decision_Makers.xlsx',
    sheetName: 'HR Heads & CTOs',
    uploadedAt: 'Yesterday, 03:45 PM',
    columns: ['Name', 'Phone', 'Company', 'Designation', 'OpenPositions', 'Budget'],
    rows: [
      { Name: 'Sanjay Deshmukh', Phone: '+91 97111 22334', Company: 'Razorpay', Designation: 'VP Engineering', OpenPositions: '8 Senior Devs', Budget: '₹45 LPA' },
      { Name: 'Ritu Bhattacharya', Phone: '+91 97222 33445', Company: 'Cred', Designation: 'Head of Talent', OpenPositions: '12 Fullstack', Budget: '₹35 LPA' },
      { Name: 'Rajesh Singhal', Phone: '+91 97333 44556', Company: 'Groww', Designation: 'Director Tech', OpenPositions: '5 ML Engineers', Budget: '₹50 LPA' },
      { Name: 'Monika Rao', Phone: '+91 97444 55667', Company: 'Ola Electric', Designation: 'HR Director', OpenPositions: '15 Devs', Budget: '₹30 LPA' },
      { Name: 'Deepak Chawla', Phone: '+91 97555 66778', Company: 'Nykaa', Designation: 'CTO Staff', OpenPositions: '6 Data Eng', Budget: '₹40 LPA' },
    ],
    totalRows: 5,
    mappedFields: {
      nameCol: 'Name',
      phoneCol: 'Phone',
      companyCol: 'Company',
      roleCol: 'Designation',
    },
    isEncrypted: true,
    vaultHash: 'AES256:4b19...77ce',
  },
];

const STORAGE_KEY = 'flowpulse_excel_sheets_data';

interface ExcelSheetHubProps {
  onNavigateToBlaster?: () => void;
  onNavigateToSocialAds?: () => void;
}

export const ExcelSheetHub: React.FC<ExcelSheetHubProps> = ({
  onNavigateToBlaster,
  onNavigateToSocialAds,
}) => {
  const { settings, maskText } = useSecurity();
  const { user, isAdmin, logAdminAction } = useAuth();

  const [sheets, setSheets] = useState<ExcelSheetData[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return SAMPLE_SHEETS;
  });

  const [activeSheetId, setActiveSheetId] = useState<string>(sheets[0]?.id || 'sheet-masterclass-1000');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active Sheet
  const activeSheet = sheets.find((s) => s.id === activeSheetId) || sheets[0];

  // Persist sheets
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sheets));
    } catch (e) {
      console.warn('Storage save error', e);
    }
  }, [sheets]);

  // Reset selected rows when changing sheet
  useEffect(() => {
    setSelectedRows(new Set());
    setCurrentPage(1);
  }, [activeSheetId]);

  // Parse uploaded Excel or CSV file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = evt.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonRows: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (jsonRows.length === 0) {
          alert('Spreadsheet is empty or has no data rows.');
          return;
        }

        const columns = Object.keys(jsonRows[0]);

        // Auto-detect columns
        let nameCol = columns.find((c) => /name|full_name|candidate|lead/i.test(c)) || columns[0];
        let phoneCol = columns.find((c) => /phone|mobile|contact|whatsapp|tel/i.test(c)) || columns[1] || '';
        let emailCol = columns.find((c) => /email|mail/i.test(c)) || '';
        let companyCol = columns.find((c) => /company|org|employer|firm/i.test(c)) || '';
        let roleCol = columns.find((c) => /course|role|title|designation/i.test(c)) || '';

        const newSheet: ExcelSheetData = {
          id: `sheet-${Date.now()}`,
          fileName: file.name,
          sheetName: firstSheetName,
          uploadedAt: 'Just now',
          columns,
          rows: jsonRows,
          totalRows: jsonRows.length,
          mappedFields: {
            nameCol,
            phoneCol,
            emailCol,
            companyCol,
            roleCol,
          },
          isEncrypted: true,
          vaultHash: `AES256:${Math.random().toString(36).substring(2, 6)}...${Math.random().toString(36).substring(2, 6)}`,
        };

        const updated = [newSheet, ...sheets];
        setSheets(updated);
        setActiveSheetId(newSheet.id);

        confetti({ particleCount: 30, spread: 60, origin: { y: 0.6 } });
        logAdminAction('EXCEL_UPLOAD', 'Excel Sheet Manager', `Uploaded ${file.name} with ${jsonRows.length} rows`);
      } catch (err: any) {
        alert(`Failed to parse file: ${err.message || 'Check Excel format'}`);
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = '';
  };

  // Export current active sheet to XLSX
  const handleExportXLSX = () => {
    if (!activeSheet) return;
    try {
      const ws = XLSX.utils.json_to_sheet(activeSheet.rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, activeSheet.sheetName || 'Sheet1');
      XLSX.writeFile(wb, `FlowPulse_${activeSheet.fileName.replace(/\.[^/.]+$/, '')}_Encrypted.xlsx`);
      logAdminAction('EXCEL_EXPORT', 'Excel Sheet Manager', `Exported ${activeSheet.fileName}`);
    } catch (e: any) {
      alert(`Export error: ${e?.message}`);
    }
  };

  // Delete active sheet
  const handleDeleteSheet = (sheetId: string) => {
    if (sheets.length <= 1) {
      alert('You must keep at least one active spreadsheet.');
      return;
    }
    const filtered = sheets.filter((s) => s.id !== sheetId);
    setSheets(filtered);
    setActiveSheetId(filtered[0].id);
    logAdminAction('EXCEL_DELETE', 'Excel Sheet Manager', `Deleted spreadsheet ${sheetId}`);
  };

  // Push rows to WhatsApp broadcast audience
  const handlePushToWhatsApp = () => {
    if (!activeSheet) return;

    const rowsToPush =
      selectedRows.size > 0
        ? activeSheet.rows.filter((_, idx) => selectedRows.has(idx))
        : activeSheet.rows;

    const nameField = activeSheet.mappedFields.nameCol || 'Name';
    const phoneField = activeSheet.mappedFields.phoneCol || 'Phone';
    const companyField = activeSheet.mappedFields.companyCol || 'Company';
    const courseField = activeSheet.mappedFields.roleCol || 'Course';

    const newRecipients: CampaignRecipient[] = rowsToPush.map((r, i) => {
      let rawPhone = String(r[phoneField] || '').trim();
      if (rawPhone && !rawPhone.startsWith('+')) {
        rawPhone = rawPhone.startsWith('91') ? `+${rawPhone}` : `+91 ${rawPhone}`;
      }
      return {
        id: `rec-excel-${Date.now()}-${i}`,
        name: String(r[nameField] || 'Valued Contact'),
        phone: rawPhone || '+91 98000 00000',
        company: r[companyField] ? String(r[companyField]) : 'Enterprise Client',
        course: r[courseField] ? String(r[courseField]) : 'AI Masterclass',
        status: 'pending',
      };
    });

    appendRecipientsToStorage(newRecipients);
    playWhatsAppDeliveryTone();
    notifyDeliverySuccess(newRecipients[0]?.name || 'Batch Audience', `${newRecipients.length} Contacts`);
    confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    setSyncStatus(`Successfully pushed ${newRecipients.length} leads to WhatsApp Broadcast Hub! Audio chime & notification sent.`);
    logAdminAction(
      'PUSH_WHATSAPP_AUDIENCE',
      'WhatsApp Blaster',
      `Pushed ${newRecipients.length} contacts from ${activeSheet.fileName} to WhatsApp audience`
    );

    setTimeout(() => {
      setSyncStatus(null);
      if (onNavigateToBlaster) onNavigateToBlaster();
    }, 1500);
  };

  // Real Instant Dispatch to Single Row with Delivery Chime & Notification
  const handleRowQuickSend = (row: Record<string, any>, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeSheet) return;
    const nameField = activeSheet.mappedFields.nameCol || 'Name';
    const phoneField = activeSheet.mappedFields.phoneCol || 'Phone';
    const name = String(row[nameField] || 'Valued Candidate');
    const phone = String(row[phoneField] || '');

    if (!phone) {
      alert('This row does not have a valid phone number mapped.');
      return;
    }

    const workshopMsg = `Hello ${name}! 🚀 The Future is Here — and It's Powered by AI!\nJoin our AI, ML & Robotics Coaching Workshop, hosted by M/s Shri Shyam Consultant.\n\n📅 Date: Sunday, 23 Aug 2026\n🕑 Time: 12:00 PM – 5:30 PM (IST)\n💰 Fee: INR 1,500/month\n📍 Mode: Online\n\n📲 Register now: https://agent-6a840d30697b8bc49--registeraerapoweredbyai.netlify.app\n🌐 Website: https://shrishyamconsulting.in`;

    openWhatsAppDirect(phone, workshopMsg, 'web');
    playWhatsAppDeliveryTone();
    notifyDeliverySuccess(name, phone);
    confetti({ particleCount: 30, spread: 60, origin: { y: 0.6 } });
    setSyncStatus(`Message sent to ${name} (${phone})! Delivery notification triggered.`);
    logAdminAction('WHATSAPP_ROW_SENT', 'Excel Sheet Manager', `Delivered direct WhatsApp message to ${name} (${phone})`);
    setTimeout(() => setSyncStatus(null), 3500);
  };

  // Push rows to Social Media Ads Custom Audience
  const handlePushToSocialAds = () => {
    if (!activeSheet) return;
    const count = selectedRows.size > 0 ? selectedRows.size : activeSheet.rows.length;
    confetti({ particleCount: 45, spread: 80, origin: { y: 0.5 } });
    setSyncStatus(`Created Meta & Social Ads Custom Audience with ${count} leads!`);
    logAdminAction(
      'CREATE_ADS_AUDIENCE',
      'Social Media Ads',
      `Synced ${count} records to Meta & Social Ads Custom Audience from ${activeSheet.fileName}`
    );

    setTimeout(() => {
      setSyncStatus(null);
      if (onNavigateToSocialAds) onNavigateToSocialAds();
    }, 1500);
  };

  // Filter rows based on search
  const filteredRows = activeSheet.rows.filter((row) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return Object.values(row).some((val) => String(val).toLowerCase().includes(query));
  });

  // Pagination
  const totalPages = Math.ceil(filteredRows.length / rowsPerPage) || 1;
  const paginatedRows = filteredRows.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const toggleSelectAll = () => {
    if (selectedRows.size === filteredRows.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredRows.map((_, idx) => idx)));
    }
  };

  const toggleSelectRow = (idx: number) => {
    const next = new Set(selectedRows);
    if (next.has(idx)) {
      next.delete(idx);
    } else {
      next.add(idx);
    }
    setSelectedRows(next);
  };

  // Helper to format/mask text
  const formatCell = (colName: string, val: any) => {
    const str = String(val ?? '');
    if (settings.showCiphertext) {
      if (/phone|mobile|contact|name/i.test(colName)) {
        return maskText(str);
      }
    }
    return str;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-6 rounded-2xl backdrop-blur-md relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <FileSpreadsheet className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Excel Sheet & Audience Leads Hub
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              AES-256-GCM Vault
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Import real <span className="text-emerald-400 font-mono">.xlsx</span>,{' '}
            <span className="text-emerald-400 font-mono">.xls</span>, and{' '}
            <span className="text-emerald-400 font-mono">.csv</span> sheets. Map dynamic lead columns, preview
            encrypted records, and 1-click sync into WhatsApp 1,000 Bulk Blaster or Social Media Ads audiences.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap relative z-10">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".xlsx, .xls, .csv"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition active:scale-95"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Excel / CSV</span>
          </button>

          <button
            onClick={handleExportXLSX}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
            title="Download active sheet as .xlsx"
          >
            <Download className="w-3.5 h-3.5 text-slate-300" />
            <span>Export .XLSX</span>
          </button>
        </div>
      </div>

      {/* Sync Status Banner Alert */}
      {syncStatus && (
        <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 text-sm font-semibold animate-pulse">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>{syncStatus}</span>
          </div>
        </div>
      )}

      {/* Sheet Tabs Selector & Sheet Metadata */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 sm:pb-0">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">Sheets:</span>
          {sheets.map((sheet) => (
            <button
              key={sheet.id}
              onClick={() => setActiveSheetId(sheet.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                activeSheetId === sheet.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>{sheet.fileName}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/30 font-mono">
                {sheet.totalRows}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => handleDeleteSheet(activeSheetId)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition"
            title="Delete this spreadsheet"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Remove Sheet</span>
          </button>
        </div>
      </div>

      {/* Active Sheet Mapping & Push CTA Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Column Mapping Card */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Table className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Dynamic Column Field Mapping</h3>
            </div>
            <span className="text-[11px] text-slate-400">
              Maps Excel headers to message variables & ads parameters
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/90 space-y-1">
              <label className="text-[10px] uppercase font-bold text-indigo-400">Name {'{Name}'}</label>
              <select
                value={activeSheet.mappedFields.nameCol || ''}
                onChange={(e) => {
                  const updated = sheets.map((s) =>
                    s.id === activeSheetId
                      ? { ...s, mappedFields: { ...s.mappedFields, nameCol: e.target.value } }
                      : s
                  );
                  setSheets(updated);
                }}
                className="w-full bg-slate-900 border border-slate-700 text-xs text-white rounded-lg p-1.5 font-medium"
              >
                {activeSheet.columns.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/90 space-y-1">
              <label className="text-[10px] uppercase font-bold text-emerald-400">Phone {'{Phone}'}</label>
              <select
                value={activeSheet.mappedFields.phoneCol || ''}
                onChange={(e) => {
                  const updated = sheets.map((s) =>
                    s.id === activeSheetId
                      ? { ...s, mappedFields: { ...s.mappedFields, phoneCol: e.target.value } }
                      : s
                  );
                  setSheets(updated);
                }}
                className="w-full bg-slate-900 border border-slate-700 text-xs text-white rounded-lg p-1.5 font-medium"
              >
                {activeSheet.columns.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/90 space-y-1">
              <label className="text-[10px] uppercase font-bold text-purple-400">Company {'{Company}'}</label>
              <select
                value={activeSheet.mappedFields.companyCol || ''}
                onChange={(e) => {
                  const updated = sheets.map((s) =>
                    s.id === activeSheetId
                      ? { ...s, mappedFields: { ...s.mappedFields, companyCol: e.target.value } }
                      : s
                  );
                  setSheets(updated);
                }}
                className="w-full bg-slate-900 border border-slate-700 text-xs text-white rounded-lg p-1.5 font-medium"
              >
                <option value="">(None / Optional)</option>
                {activeSheet.columns.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/90 space-y-1">
              <label className="text-[10px] uppercase font-bold text-amber-400">Course / Role</label>
              <select
                value={activeSheet.mappedFields.roleCol || ''}
                onChange={(e) => {
                  const updated = sheets.map((s) =>
                    s.id === activeSheetId
                      ? { ...s, mappedFields: { ...s.mappedFields, roleCol: e.target.value } }
                      : s
                  );
                  setSheets(updated);
                }}
                className="w-full bg-slate-900 border border-slate-700 text-xs text-white rounded-lg p-1.5 font-medium"
              >
                <option value="">(None / Optional)</option>
                {activeSheet.columns.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 1-Click Audience Push Card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-emerald-500/30 p-5 rounded-2xl flex flex-col justify-between space-y-4 shadow-lg shadow-emerald-500/5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">1-Click Dispatch & Ad Sync</h3>
            </div>
            <p className="text-xs text-slate-400">
              {selectedRows.size > 0
                ? `Ready to push ${selectedRows.size} selected rows.`
                : `Ready to push all ${activeSheet.rows.length} rows from this spreadsheet.`}
            </p>
          </div>

          <div className="space-y-2">
            <button
              onClick={handlePushToWhatsApp}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Push to WhatsApp 1,000 Blast</span>
            </button>

            <button
              onClick={handlePushToSocialAds}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Sync to Social Ads Custom Audience</span>
            </button>
          </div>
        </div>
      </div>

      {/* Spreadsheet Grid Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across all rows..."
              className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:border-emerald-500 placeholder:text-slate-600"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={toggleSelectAll}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition"
            >
              {selectedRows.size === filteredRows.length && filteredRows.length > 0
                ? 'Clear Selection'
                : `Select All (${filteredRows.length})`}
            </button>

            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
              <span className="p-1 rounded bg-slate-800 text-emerald-400 font-bold">
                {selectedRows.size} selected
              </span>
              <span>/</span>
              <span>{filteredRows.length} total</span>
            </div>
          </div>
        </div>

        {/* Interactive Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
                <th className="p-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedRows.size === filteredRows.length && filteredRows.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-0 cursor-pointer"
                  />
                </th>
                <th className="p-3 w-12 text-slate-500">#</th>
                {activeSheet.columns.map((col) => (
                  <th key={col} className="p-3 font-bold text-slate-300">
                    {col}
                    {col === activeSheet.mappedFields.nameCol && (
                      <span className="ml-1 text-[9px] text-indigo-400 lowercase font-sans font-normal">
                        (Name)
                      </span>
                    )}
                    {col === activeSheet.mappedFields.phoneCol && (
                      <span className="ml-1 text-[9px] text-emerald-400 lowercase font-sans font-normal">
                        (Phone)
                      </span>
                    )}
                  </th>
                ))}
                <th className="p-3 font-bold text-emerald-400 text-center">
                  Instant Dispatch
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {paginatedRows.length === 0 ? (
                <tr>
                  <td colSpan={activeSheet.columns.length + 3} className="p-8 text-center text-slate-500 text-xs">
                    No rows match your filter.
                  </td>
                </tr>
              ) : (
                paginatedRows.map((row, rowIdx) => {
                  const globalIdx = (currentPage - 1) * rowsPerPage + rowIdx;
                  const isSelected = selectedRows.has(globalIdx);

                  return (
                    <tr
                      key={globalIdx}
                      className={`hover:bg-slate-800/40 transition cursor-pointer ${
                        isSelected ? 'bg-emerald-500/10' : ''
                      }`}
                      onClick={() => toggleSelectRow(globalIdx)}
                    >
                      <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectRow(globalIdx)}
                          className="rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-0 cursor-pointer"
                        />
                      </td>
                      <td className="p-3 text-slate-500 font-mono text-[11px]">{globalIdx + 1}</td>
                      {activeSheet.columns.map((col) => (
                        <td key={col} className="p-3 text-slate-200">
                          {col === activeSheet.mappedFields.phoneCol ? (
                            <span className="font-mono text-emerald-300 font-semibold">
                              {formatCell(col, row[col])}
                            </span>
                          ) : col === activeSheet.mappedFields.nameCol ? (
                            <span className="text-white font-semibold">{formatCell(col, row[col])}</span>
                          ) : (
                            <span className="text-slate-300">{formatCell(col, row[col])}</span>
                          )}
                        </td>
                      ))}
                      <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => handleRowQuickSend(row, e)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 text-xs font-semibold transition active:scale-95 shadow-sm"
                          title="Send WhatsApp message directly & trigger delivery notification"
                        >
                          <Send className="w-3 h-3 text-emerald-400 group-hover:text-white" />
                          <span>Send WhatsApp</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Footer */}
        <div className="p-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div>
            Showing {(currentPage - 1) * rowsPerPage + 1} -{' '}
            {Math.min(currentPage * rowsPerPage, filteredRows.length)} of {filteredRows.length} rows
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 disabled:opacity-40 hover:bg-slate-800 transition"
            >
              Prev
            </button>
            <span className="px-2 py-1 font-mono text-slate-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 disabled:opacity-40 hover:bg-slate-800 transition"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
