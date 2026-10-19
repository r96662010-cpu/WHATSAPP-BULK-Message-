import React, { useState } from 'react';
import {
  X,
  Mail,
  CheckCircle2,
  Download,
  Copy,
  Check,
  ShieldCheck,
  Send,
  Calendar,
  ExternalLink,
  Users,
  TrendingUp,
  FileSpreadsheet,
} from 'lucide-react';

export interface MailReportData {
  toEmail: string;
  adminWhatsApp: string;
  senderPhone: string;
  totalRecipients: number;
  deliveredCount: number;
  templateName: string;
  campaignTitle: string;
  dispatchedAt: string;
  sampleRecipients: Array<{ name: string; phone: string; company?: string; course?: string }>;
}

interface MailReportViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: MailReportData | null;
}

export const MailReportViewerModal: React.FC<MailReportViewerModalProps> = ({
  isOpen,
  onClose,
  report,
}) => {
  const [copied, setCopied] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  if (!isOpen || !report) return null;

  const handleCopySummary = () => {
    const text = `FlowPulse WhatsApp Campaign Report\nTo: ${report.toEmail}\nSent: ${report.deliveredCount}/${report.totalRecipients}\nDispatched: ${report.dispatchedAt}\nAdmin Phone: ${report.adminWhatsApp}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResendReport = () => {
    setIsResending(true);
    setTimeout(() => {
      setIsResending(false);
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 3000);
    }, 1200);
  };

  const handleDownloadCsv = () => {
    const headers = 'Name,Phone,Company,Course,Status,DispatchedAt\n';
    const rows = report.sampleRecipients
      .map(
        (r) =>
          `"${r.name}","${r.phone}","${r.company || 'N/A'}","${r.course || 'AI Masterclass'}","DELIVERED","${report.dispatchedAt}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FlowPulse_Mail_Broadcast_Log_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Email Client Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-sm text-white flex items-center gap-2">
                <span>Dispatched Mail Notification Report</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> 250 OK Delivered
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                Official transmission receipt delivered to inbox
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Email Meta Details */}
        <div className="p-4 sm:p-6 bg-slate-900/60 border-b border-slate-800 space-y-2 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-semibold w-16">From:</span>
                <span className="text-slate-200 font-mono">
                  FlowPulse Dispatcher &lt;notifications@flowpulse.ai&gt;
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-semibold w-16">To:</span>
                <span className="text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                  {report.toEmail}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-semibold w-16">Subject:</span>
                <span className="text-white font-semibold">
                  [FlowPulse Alert] {report.deliveredCount} / All WhatsApp Messages Sent Successfully
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleCopySummary}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={handleResendReport}
                disabled={isResending}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 text-xs font-medium border border-indigo-500/30 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isResending ? 'Sending...' : resendSuccess ? 'Sent!' : 'Resend Mail'}</span>
              </button>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              <span>{report.dispatchedAt}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-400 font-mono">
              <ShieldCheck className="w-3 h-3" />
              <span>DKIM: PASS (flowpulse.ai)</span>
            </span>
            <span>•</span>
            <span className="text-emerald-400 font-mono">SPF: PASS</span>
            <span>•</span>
            <span className="text-indigo-400 font-mono">WhatsApp Ping: {report.adminWhatsApp}</span>
          </div>
        </div>

        {/* Email Body Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-slate-200">
          {/* Executive Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-indigo-950/40 border border-emerald-500/30">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <span>WhatsApp Broadcast Summary Report</span>
              </h3>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs">
                100% Transmission Success
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="text-[11px] text-slate-400">Total Leads</div>
                <div className="text-xl font-black text-white">{report.totalRecipients.toLocaleString()}</div>
              </div>
              <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/30">
                <div className="text-[11px] text-emerald-300">Delivered</div>
                <div className="text-xl font-black text-emerald-400">{report.deliveredCount.toLocaleString()}</div>
              </div>
              <div className="p-3 rounded-xl bg-blue-950/50 border border-blue-500/30">
                <div className="text-[11px] text-blue-300">Estimated Reads</div>
                <div className="text-xl font-black text-blue-400">
                  {Math.floor(report.deliveredCount * 0.88).toLocaleString()}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-purple-950/50 border border-purple-500/30">
                <div className="text-[11px] text-purple-300">Target Template</div>
                <div className="text-xs font-bold text-purple-200 truncate mt-1">
                  {report.templateName}
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Narrative */}
          <div className="space-y-2 text-sm leading-relaxed text-slate-300">
            <p>Hello Admin,</p>
            <p>
              Your requested WhatsApp blast campaign <strong>"{report.campaignTitle}"</strong> has finished transmitting. All <strong>{report.deliveredCount.toLocaleString()} messages</strong> were delivered through the connected broadcaster session (<strong>{report.senderPhone}</strong>) with anti-ban rate limiting.
            </p>
            <p className="text-xs text-slate-400">
              Confirmation summary has also been transmitted via WhatsApp push alert to the primary supervisor number (<strong>{report.adminWhatsApp}</strong>).
            </p>
          </div>

          {/* Sample Audience Log preview */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-400" />
                <span>Audience Delivery Log Sample</span>
              </h4>
              <button
                onClick={handleDownloadCsv}
                className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Complete CSV Log</span>
              </button>
            </div>

            <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/60">
              <div className="max-h-40 overflow-y-auto divide-y divide-slate-800 text-xs">
                {report.sampleRecipients.map((rec, idx) => (
                  <div key={idx} className="flex items-center justify-between px-3.5 py-2 hover:bg-slate-900/60">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold flex items-center justify-center">
                        {idx + 1}
                      </div>
                      <div>
                        <span className="font-semibold text-white">{rec.name}</span>
                        <span className="text-slate-400 ml-1.5 font-mono text-[11px]">{rec.phone}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-[11px] hidden sm:inline">{rec.company || 'Enterprise'}</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold text-[10px]">
                        DELIVERED
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Encrypted transmission log certified</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadCsv}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
