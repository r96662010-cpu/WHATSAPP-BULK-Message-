import React, { useState, useMemo, useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from 'recharts';
import {
  Briefcase,
  Users,
  Award,
  Clock,
  TrendingUp,
  MapPin,
  Calendar,
  Phone,
  Mail,
  ChevronRight,
  Filter,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  ExternalLink,
  PlusCircle,
  BarChart3,
  PieChart as PieIcon,
  Layers,
  Zap,
  Download,
  FileDown,
  Image,
  Loader2,
  ChevronDown,
  Check,
  MessageSquare,
  Send,
} from 'lucide-react';
import { RecruitmentCandidate } from '../../types';
import { JOB_POSITIONS } from '../../data/recruitmentData';

interface RecruitmentPipelineDashboardProps {
  candidates: RecruitmentCandidate[];
  companyName: string;
  onNavigateToCRM?: (roleFilter?: string) => void;
  onNavigateToForm?: () => void;
  onSendWhatsApp?: (candidate: RecruitmentCandidate, template: 'ack' | 'interview' | 'shortlist') => void;
  onAddCandidate?: (candidate: RecruitmentCandidate) => void;
}

// Color palette for charts
const ROLE_COLORS = [
  '#8b5cf6', // purple-500
  '#3b82f6', // blue-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#ec4899', // pink-500
  '#06b6d4', // cyan-500
  '#6366f1', // indigo-500
  '#14b8a6', // teal-500
  '#f97316', // orange-500
  '#a855f7', // violet-500
  '#84cc16', // lime-500
  '#64748b', // slate-500
];

const STAGE_COLORS: Record<string, string> = {
  new: '#38bdf8', // sky-400
  reviewed: '#fbbf24', // amber-400
  shortlisted: '#a855f7', // purple-500
  interview_scheduled: '#10b981', // emerald-500
  offered: '#14b8a6', // teal-500
  rejected: '#64748b', // slate-500
};

export const RecruitmentPipelineDashboard: React.FC<RecruitmentPipelineDashboardProps> = ({
  candidates,
  companyName,
  onNavigateToCRM,
  onNavigateToForm,
  onSendWhatsApp,
  onAddCandidate,
}) => {
  const distributionChartCardRef = useRef<HTMLDivElement>(null);
  const dashboardContainerRef = useRef<HTMLDivElement>(null);

  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'count_desc' | 'count_asc' | 'alpha'>('count_desc');
  const [chartView, setChartView] = useState<'both' | 'bars' | 'stages'>('both');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportDropdownOpen, setExportDropdownOpen] = useState<boolean>(false);
  const [exportMessage, setExportMessage] = useState<string | null>(null);

  const triggerDownload = (dataUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const showExportNotice = (msg: string) => {
    setExportMessage(msg);
    setTimeout(() => setExportMessage(null), 4000);
  };

  // Export Candidate Distribution Chart as PNG or PDF
  const handleExportChart = async (format: 'png' | 'pdf') => {
    if (!distributionChartCardRef.current) {
      showExportNotice('⚠️ Chart container not found.');
      return;
    }

    try {
      setIsExporting(true);
      setExportDropdownOpen(false);

      // Brief pause to allow rendering to settle
      await new Promise((r) => setTimeout(r, 120));

      const element = distributionChartCardRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#0f172a',
        useCORS: true,
        logging: false,
      });

      const dateStr = new Date().toISOString().slice(0, 10);
      const companySlug = companyName.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 20);

      if (format === 'png') {
        const imgData = canvas.toDataURL('image/png');
        triggerDownload(imgData, `Candidate_Distribution_Chart_${companySlug}_${dateStr}.png`);
        showExportNotice('✅ Candidate distribution chart exported as PNG!');
      } else {
        // PDF Report Generation using jsPDF
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
        });

        // Top Header Banner
        pdf.setFillColor(15, 23, 42); // slate-900
        pdf.rect(0, 0, 210, 30, 'F');

        // Document Title
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(15);
        pdf.setFont('helvetica', 'bold');
        pdf.text('CANDIDATE DISTRIBUTION & PIPELINE REPORT', 14, 13);

        // Subtitle
        pdf.setTextColor(192, 132, 252); // purple-400
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`${companyName} • Talent Acquisition & Recruitment Pipeline`, 14, 21);

        // Date & Metrics Right Side
        pdf.setTextColor(148, 163, 184); // slate-400
        pdf.setFontSize(8);
        pdf.text(`Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 196, 13, { align: 'right' });
        pdf.text(`Total Applicants: ${totalApplicants} | Active Roles: ${activeRolesCount}`, 196, 21, { align: 'right' });

        // Executive KPI summary box
        pdf.setFillColor(248, 250, 252);
        pdf.setDrawColor(226, 232, 240);
        pdf.roundedRect(14, 34, 182, 17, 2, 2, 'FD');

        pdf.setFontSize(7.5);
        pdf.setTextColor(100, 116, 139);
        pdf.setFont('helvetica', 'bold');
        pdf.text('TOTAL CANDIDATES', 18, 40);
        pdf.text('TOP APPLIED ROLE', 62, 40);
        pdf.text('SHORTLISTED / INTERVIEWS', 115, 40);
        pdf.text('IMMEDIATE JOINERS', 165, 40);

        pdf.setFontSize(10.5);
        pdf.setTextColor(15, 23, 42);
        pdf.setFont('helvetica', 'bold');
        pdf.text(String(totalApplicants), 18, 46.5);
        pdf.text(`${topRole.position.substring(0, 20)} (${topRole.total})`, 62, 46.5);
        pdf.text(`${shortlistedCount} (${shortlistRate}%)`, 115, 46.5);
        pdf.text(String(immediateCount), 165, 46.5);

        // Chart image
        const imgData = canvas.toDataURL('image/png');
        pdf.setFontSize(10);
        pdf.setTextColor(30, 41, 59);
        pdf.setFont('helvetica', 'bold');
        pdf.text("Candidate Distribution by 'Position Applied For'", 14, 57);

        // Scaled height for chart
        const chartWidth = 182;
        const chartHeight = (canvas.height * chartWidth) / canvas.width;
        const renderedHeight = Math.min(chartHeight, 95);
        pdf.addImage(imgData, 'PNG', 14, 61, chartWidth, renderedHeight);

        // Table Breakdown
        const tableStartY = 61 + renderedHeight + 8;
        pdf.setFontSize(10);
        pdf.setTextColor(30, 41, 59);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Detailed Role Distribution Breakdown', 14, tableStartY);

        // Table Header
        const headerY = tableStartY + 3;
        pdf.setFillColor(241, 245, 249);
        pdf.rect(14, headerY, 182, 6.5, 'F');
        pdf.setFontSize(8);
        pdf.setTextColor(51, 65, 85);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Position Applied For', 17, headerY + 4.5);
        pdf.text('Total', 105, headerY + 4.5, { align: 'right' });
        pdf.text('% Pool', 128, headerY + 4.5, { align: 'right' });
        pdf.text('Shortlisted', 155, headerY + 4.5, { align: 'right' });
        pdf.text('Immediate', 190, headerY + 4.5, { align: 'right' });

        // Table Rows
        let rowY = headerY + 6.5;
        const activeDistribution = positionDistribution.filter((p) => p.total > 0);
        const displayRows = activeDistribution.length > 0 ? activeDistribution.slice(0, 8) : positionDistribution.slice(0, 8);

        displayRows.forEach((row, i) => {
          if (i % 2 === 1) {
            pdf.setFillColor(248, 250, 252);
            pdf.rect(14, rowY, 182, 5.5, 'F');
          }
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(7.5);
          pdf.setTextColor(71, 85, 105);

          const roleName = row.position.length > 40 ? row.position.substring(0, 38) + '…' : row.position;
          pdf.text(roleName, 17, rowY + 4);

          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(15, 23, 42);
          pdf.text(String(row.total), 105, rowY + 4, { align: 'right' });

          const pct = totalApplicants > 0 ? ((row.total / totalApplicants) * 100).toFixed(1) + '%' : '0%';
          pdf.text(pct, 128, rowY + 4, { align: 'right' });

          pdf.setTextColor(126, 34, 206);
          pdf.text(String(row.shortlisted), 155, rowY + 4, { align: 'right' });

          pdf.setTextColor(13, 148, 136);
          pdf.text(String(row.immediateJoiners), 190, rowY + 4, { align: 'right' });

          rowY += 5.5;
        });

        // Footer
        pdf.setFontSize(7);
        pdf.setTextColor(148, 163, 184);
        pdf.setFont('helvetica', 'normal');
        pdf.text('Confidential Hiring Report • Generated via FlowPulse AI Google Form & Recruitment ATS', 14, 290);
        pdf.text('Page 1 of 1', 196, 290, { align: 'right' });

        pdf.save(`Candidate_Distribution_Report_${companySlug}_${dateStr}.pdf`);
        showExportNotice('✅ Executive PDF report generated and downloaded!');
      }
    } catch (err) {
      console.error('Export error:', err);
      showExportNotice('⚠️ Export error. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Full Dashboard Snapshot
  const handleExportDashboard = async (format: 'png' | 'pdf') => {
    if (!dashboardContainerRef.current) {
      showExportNotice('⚠️ Dashboard container not found.');
      return;
    }

    try {
      setIsExporting(true);
      setExportDropdownOpen(false);

      await new Promise((r) => setTimeout(r, 120));

      const element = dashboardContainerRef.current;
      const canvas = await html2canvas(element, {
        scale: 1.5,
        backgroundColor: '#0b0f19',
        useCORS: true,
        logging: false,
      });

      const dateStr = new Date().toISOString().slice(0, 10);
      const companySlug = companyName.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 20);

      const imgData = canvas.toDataURL('image/png');
      triggerDownload(imgData, `Full_Recruitment_Dashboard_${companySlug}_${dateStr}.png`);
      showExportNotice('✅ Full recruitment dashboard exported as PNG!');
    } catch (err) {
      console.error('Dashboard export error:', err);
      showExportNotice('⚠️ Export error. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Compute distribution of candidates by 'Position Applied For'
  const positionDistribution = useMemo(() => {
    const map: Record<
      string,
      {
        position: string;
        total: number;
        shortlisted: number;
        interviewScheduled: number;
        new: number;
        reviewed: number;
        offered: number;
        immediateJoiners: number;
      }
    > = {};

    // Initialize all known job positions to guarantee visibility even if 0 applicants
    JOB_POSITIONS.forEach((pos) => {
      map[pos] = {
        position: pos,
        total: 0,
        shortlisted: 0,
        interviewScheduled: 0,
        new: 0,
        reviewed: 0,
        offered: 0,
        immediateJoiners: 0,
      };
    });

    // Tally actual candidates
    candidates.forEach((cand) => {
      const pos = cand.positionApplied || 'Unspecified';
      if (!map[pos]) {
        map[pos] = {
          position: pos,
          total: 0,
          shortlisted: 0,
          interviewScheduled: 0,
          new: 0,
          reviewed: 0,
          offered: 0,
          immediateJoiners: 0,
        };
      }
      map[pos].total += 1;
      if (cand.status === 'shortlisted') map[pos].shortlisted += 1;
      if (cand.status === 'interview_scheduled') map[pos].interviewScheduled += 1;
      if (cand.status === 'new') map[pos].new += 1;
      if (cand.status === 'reviewed') map[pos].reviewed += 1;
      if (cand.status === 'offered') map[pos].offered += 1;
      if (cand.noticePeriod?.toLowerCase().includes('immediate')) {
        map[pos].immediateJoiners += 1;
      }
    });

    let list = Object.values(map);

    // Sorting
    if (sortBy === 'count_desc') {
      list.sort((a, b) => b.total - a.total);
    } else if (sortBy === 'count_asc') {
      list.sort((a, b) => a.total - b.total);
    } else {
      list.sort((a, b) => a.position.localeCompare(b.position));
    }

    return list;
  }, [candidates, sortBy]);

  // Pie chart data (only roles with total > 0)
  const pieData = useMemo(() => {
    return positionDistribution
      .filter((item) => item.total > 0)
      .map((item, idx) => ({
        name: item.position,
        value: item.total,
        color: ROLE_COLORS[idx % ROLE_COLORS.length],
      }));
  }, [positionDistribution]);

  // Experience breakdown per position
  const experienceDistribution = useMemo(() => {
    const rolesWithCandidates = positionDistribution.filter((item) => item.total > 0);
    return rolesWithCandidates.map((item) => {
      const roleCandidates = candidates.filter((c) => c.positionApplied === item.position);
      const fresher = roleCandidates.filter((c) => c.totalExperience.includes('Fresher')).length;
      const mid = roleCandidates.filter((c) => c.totalExperience.includes('1–2') || c.totalExperience.includes('1-2')).length;
      const senior = roleCandidates.filter((c) => c.totalExperience.includes('3–5') || c.totalExperience.includes('3-5')).length;
      const lead = roleCandidates.filter((c) => c.totalExperience.includes('5+')).length;

      return {
        position: item.position.length > 18 ? item.position.substring(0, 16) + '…' : item.position,
        fullPosition: item.position,
        fresher,
        mid,
        senior,
        lead,
        total: item.total,
      };
    });
  }, [candidates, positionDistribution]);

  // Key KPI calculations
  const totalApplicants = candidates.length;
  const activeRolesCount = positionDistribution.filter((p) => p.total > 0).length;
  const totalOpenings = JOB_POSITIONS.length;

  const topRole = useMemo(() => {
    if (positionDistribution.length === 0 || totalApplicants === 0) return { position: 'N/A', total: 0, pct: 0 };
    const top = [...positionDistribution].sort((a, b) => b.total - a.total)[0];
    const pct = totalApplicants > 0 ? Math.round((top.total / totalApplicants) * 100) : 0;
    return { position: top.position, total: top.total, pct };
  }, [positionDistribution, totalApplicants]);

  const shortlistedCount = candidates.filter(
    (c) => c.status === 'shortlisted' || c.status === 'interview_scheduled' || c.status === 'offered'
  ).length;
  const shortlistRate = totalApplicants > 0 ? Math.round((shortlistedCount / totalApplicants) * 100) : 0;

  const immediateCount = candidates.filter((c) => c.noticePeriod?.toLowerCase().includes('immediate')).length;

  // Filtered candidates for the selected drill-down role
  const roleCandidates = useMemo(() => {
    if (selectedRole === 'all') return candidates;
    return candidates.filter((c) => c.positionApplied === selectedRole);
  }, [candidates, selectedRole]);

  // Quick Mock Candidate generator for instant chart responsiveness testing
  const handleSimulateApplicant = () => {
    if (!onAddCandidate) return;
    const sampleRoles = JOB_POSITIONS;
    const randomRole = sampleRoles[Math.floor(Math.random() * sampleRoles.length)];
    const names = ['Aditya Verma', 'Sneha Kulkarni', 'Tanmay Joshi', 'Ananya Gupta', 'Deepak Nambiar', 'Pooja Chawla'];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const cities = ['Bangalore', 'Mumbai', 'Delhi NCR', 'Hyderabad', 'Pune', 'Chennai'];
    const randomCity = cities[Math.floor(Math.random() * cities.length)];

    const newCand: RecruitmentCandidate = {
      id: `cand-${Date.now()}`,
      fullName: `${randomName} (${Math.floor(100 + Math.random() * 900)})`,
      email: `${randomName.toLowerCase().replace(/\s+/g, '.')}.${Math.floor(Math.random() * 100)}@example.com`,
      contactNumber: `+91 98${Math.floor(10000000 + Math.random() * 90000000)}`,
      currentLocation: randomCity,
      preferredLocations: ['PAN India', randomCity, 'Work from Home (Remote)'],
      positionApplied: randomRole,
      keySkills: 'TypeScript, React, Python, Cloud Microservices, Problem Solving',
      totalExperience: '1–2 Years',
      relevantExperience: '1.5 years in rapid production scaling',
      currentCtc: '₹8.5 LPA',
      expectedCtc: '₹12.5 LPA',
      noticePeriod: Math.random() > 0.5 ? 'Immediate' : '15 Days',
      reasonForChange: 'Seeking career progression in fast moving engineering teams.',
      resumeFileName: `${randomName.replace(/\s+/g, '_')}_CV.pdf`,
      resumeFileSize: '1.8 MB',
      submittedAt: new Date().toISOString(),
      status: 'new',
      notes: 'Real-time test candidate submitted to verify hiring pipeline chart updates.',
    };

    onAddCandidate(newCand);
  };

  return (
    <div ref={dashboardContainerRef} className="space-y-6">
      {/* Export Notification Toast */}
      {exportMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 border border-emerald-500/50 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-200">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{exportMessage}</span>
        </div>
      )}

      {/* Top Banner & Quick Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <BarChart3 className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">Hiring Pipeline & Position Distribution</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Recharts Analytics
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Real-time visualization of applicant volume, pipeline stages, and talent distribution across all open
              positions for <span className="text-purple-300 font-semibold">{companyName}</span>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* EXPORT CHART / REPORT BUTTON */}
            <div className="relative">
              <button
                onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
                disabled={isExporting}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-lg shadow-emerald-600/25 disabled:opacity-50"
                title="Export candidate distribution chart as PNG or PDF report"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Exporting...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Chart</span>
                    <ChevronDown className="w-3 h-3 ml-0.5 opacity-80" />
                  </>
                )}
              </button>

              {exportDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-slate-950/95 border border-slate-700/80 rounded-xl shadow-2xl p-2 z-50 space-y-1 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-2.5 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Export Candidate Chart
                  </div>
                  <button
                    onClick={() => handleExportChart('png')}
                    disabled={isExporting}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-xs text-slate-200 flex items-center justify-between transition group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Image className="w-4 h-4 text-emerald-400" />
                      <div>
                        <div className="font-semibold text-white">Chart as PNG Image</div>
                        <div className="text-[10px] text-slate-400">Crisp 2x .png for slides & emails</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                      .PNG
                    </span>
                  </button>

                  <button
                    onClick={() => handleExportChart('pdf')}
                    disabled={isExporting}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-xs text-slate-200 flex items-center justify-between transition group"
                  >
                    <div className="flex items-center gap-2.5">
                      <FileDown className="w-4 h-4 text-rose-400" />
                      <div>
                        <div className="font-semibold text-white">Executive PDF Report</div>
                        <div className="text-[10px] text-slate-400">A4 document with chart, table & KPIs</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
                      .PDF
                    </span>
                  </button>

                  <div className="pt-1 border-t border-slate-800">
                    <button
                      onClick={() => handleExportDashboard('png')}
                      disabled={isExporting}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-xs text-slate-200 flex items-center justify-between transition group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Layers className="w-4 h-4 text-purple-400" />
                        <div>
                          <div className="font-semibold text-white">Full Dashboard Snapshot</div>
                          <div className="text-[10px] text-slate-400">Overview of all hiring charts</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-purple-300 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20">
                        .PNG
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                const firstCand = roleCandidates[0] || candidates[0];
                window.dispatchEvent(
                  new CustomEvent('flowpulse_open_whatsapp_dispatcher', {
                    detail: {
                      phone: firstCand?.contactNumber || '7869515615',
                      name: firstCand?.fullName || 'Candidate',
                      roleOrCompany: selectedRole === 'all' ? firstCand?.positionApplied || 'Engineering' : selectedRole,
                      templateType: 'interview',
                    },
                  })
                );
              }}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
              title="Allow Message to go in WhatsApp for candidates"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Send WhatsApp</span>
            </button>

            <button
              onClick={handleSimulateApplicant}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
              title="Add a sample applicant to verify chart live re-rendering"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Simulate Applicant</span>
            </button>

            {onNavigateToForm && (
              <button
                onClick={onNavigateToForm}
                className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-lg shadow-purple-600/20"
              >
                <span>Open Google Form</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}

            {onNavigateToCRM && (
              <button
                onClick={() => onNavigateToCRM('all')}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Users className="w-3.5 h-3.5" />
                <span>View ATS Table</span>
              </button>
            )}
          </div>
        </div>

        {/* KPI Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-6 pt-5 border-t border-slate-800/80">
          {/* Metric 1 */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Candidates</span>
              <Users className="w-4 h-4 text-purple-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-white">{totalApplicants}</span>
              <span className="text-[10px] text-purple-400 font-medium">applications</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Across all recruitment openings</p>
          </div>

          {/* Metric 2 */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Roles</span>
              <Briefcase className="w-4 h-4 text-blue-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-blue-400">{activeRolesCount}</span>
              <span className="text-xs text-slate-400 font-semibold">/ {totalOpenings} roles</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Receiving candidate submissions</p>
          </div>

          {/* Metric 3 */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Top Applied Role</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-2 truncate">
              <span className="text-sm font-extrabold text-emerald-300 block truncate" title={topRole.position}>
                {topRole.position}
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-lg font-black text-white">{topRole.total}</span>
                <span className="text-[10px] text-emerald-400 font-semibold">({topRole.pct}% share)</span>
              </div>
            </div>
          </div>

          {/* Metric 4 */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pipeline Health</span>
              <Award className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-amber-300">{shortlistedCount}</span>
              <span className="text-[10px] text-amber-400/90 font-semibold">({shortlistRate}% shortlisted)</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Shortlisted & interview rounds</p>
          </div>

          {/* Metric 5 */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Immediate Joiners</span>
              <Zap className="w-4 h-4 text-teal-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-teal-300">{immediateCount}</span>
              <span className="text-[10px] text-teal-400 font-medium">candidates</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">0 Notice period / fast onboard</p>
          </div>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* CHART 1: Candidate Distribution by Position Applied For (Bar Chart) */}
        <div
          ref={distributionChartCardRef}
          className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between"
        >
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-purple-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">Candidates by 'Position Applied For'</h3>
                  <p className="text-[11px] text-slate-400">Total volume of applications received per opening</p>
                </div>
              </div>

              {/* Sorting Filter & Quick Export */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                    <Filter className="w-3 h-3" /> Sort:
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1 focus:ring-1 focus:ring-purple-500 focus:outline-none"
                  >
                    <option value="count_desc">Highest Volume First</option>
                    <option value="count_asc">Lowest Volume First</option>
                    <option value="alpha">Alphabetical Order</option>
                  </select>
                </div>

                {/* Quick Chart Export Buttons */}
                <div className="flex items-center gap-1 pl-2 border-l border-slate-800">
                  <button
                    onClick={() => handleExportChart('png')}
                    disabled={isExporting}
                    title="Export Candidate Distribution Chart as PNG Image"
                    className="px-2 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-emerald-400 border border-slate-800 hover:border-emerald-500/40 text-[11px] font-bold flex items-center gap-1 transition shadow-sm disabled:opacity-50"
                  >
                    <Image className="w-3 h-3 text-emerald-400" />
                    <span>PNG</span>
                  </button>

                  <button
                    onClick={() => handleExportChart('pdf')}
                    disabled={isExporting}
                    title="Export Executive PDF Report with Chart & Data Table"
                    className="px-2 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-rose-400 border border-slate-800 hover:border-rose-500/40 text-[11px] font-bold flex items-center gap-1 transition shadow-sm disabled:opacity-50"
                  >
                    <FileDown className="w-3 h-3 text-rose-400" />
                    <span>PDF</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Recharts Bar Chart */}
            <div className="mt-4 h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={positionDistribution}
                  layout="vertical"
                  margin={{ top: 10, right: 25, left: 20, bottom: 5 }}
                  onClick={(state) => {
                    if (state && state.activeLabel) {
                      setSelectedRole(state.activeLabel === selectedRole ? 'all' : String(state.activeLabel));
                    }
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} opacity={0.5} />
                  <XAxis
                    type="number"
                    stroke="#94a3b8"
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    allowDecimals={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="position"
                    stroke="#94a3b8"
                    tick={{ fill: '#cbd5e1', fontSize: 11 }}
                    width={130}
                    tickFormatter={(val: string) => (val.length > 16 ? val.substring(0, 15) + '…' : val)}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-950/95 border border-purple-500/40 rounded-xl p-3 shadow-2xl text-xs space-y-1.5 backdrop-blur-md">
                            <p className="font-bold text-white text-sm border-b border-slate-800 pb-1">{label}</p>
                            <div className="flex justify-between gap-4 text-slate-300">
                              <span>Total Candidates:</span>
                              <span className="font-extrabold text-purple-400">{data.total}</span>
                            </div>
                            <div className="flex justify-between gap-4 text-slate-300">
                              <span>Shortlisted:</span>
                              <span className="font-bold text-emerald-400">{data.shortlisted}</span>
                            </div>
                            <div className="flex justify-between gap-4 text-slate-300">
                              <span>Interview Scheduled:</span>
                              <span className="font-bold text-blue-400">{data.interviewScheduled}</span>
                            </div>
                            <div className="flex justify-between gap-4 text-slate-300">
                              <span>Immediate Joiners:</span>
                              <span className="font-bold text-teal-400">{data.immediateJoiners}</span>
                            </div>
                            <div className="pt-1 border-t border-slate-800/80 text-[10px] text-purple-300">
                              👉 Click bar to inspect candidates for this role
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="total" radius={[0, 6, 6, 0]} barSize={18}>
                    {positionDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          selectedRole === entry.position
                            ? '#a855f7'
                            : selectedRole === 'all'
                            ? ROLE_COLORS[index % ROLE_COLORS.length]
                            : '#475569'
                        }
                        cursor="pointer"
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" />
              Tip: Click any bar or role to filter the pipeline explorer below
            </span>
            {selectedRole !== 'all' && (
              <button
                onClick={() => setSelectedRole('all')}
                className="text-purple-400 hover:text-purple-300 font-semibold"
              >
                Reset Role Filter
              </button>
            )}
          </div>
        </div>

        {/* CHART 2: Talent Pool Share by Position (Donut Chart) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-blue-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">Talent Pool Market Share</h3>
                  <p className="text-[11px] text-slate-400">Percentage distribution across candidate preferences</p>
                </div>
              </div>
            </div>

            {/* Recharts Pie / Donut Chart */}
            <div className="mt-4 h-80 w-full relative flex items-center justify-center">
              {pieData.length === 0 ? (
                <div className="text-center text-slate-500 py-12 text-xs">
                  No applicants registered yet. Submit applications via the Google Form.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={105}
                      paddingAngle={3}
                      onClick={(entry) => {
                        if (entry && entry.name) {
                          setSelectedRole(entry.name === selectedRole ? 'all' : String(entry.name));
                        }
                      }}
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`pie-cell-${index}`}
                          fill={entry.color}
                          stroke="#0f172a"
                          strokeWidth={2}
                          cursor="pointer"
                          opacity={selectedRole === 'all' || selectedRole === entry.name ? 1 : 0.4}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0];
                          const total = totalApplicants || 1;
                          const pct = ((Number(data.value) / total) * 100).toFixed(1);
                          return (
                            <div className="bg-slate-950/95 border border-blue-500/40 rounded-xl p-3 shadow-2xl text-xs space-y-1 backdrop-blur-md">
                              <p className="font-bold text-white text-sm">{data.name}</p>
                              <div className="flex justify-between gap-4 text-slate-300">
                                <span>Applicants:</span>
                                <span className="font-black text-blue-400">{data.value} candidates</span>
                              </div>
                              <div className="flex justify-between gap-4 text-slate-300">
                                <span>Share of Total:</span>
                                <span className="font-black text-emerald-400">{pct}%</span>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}

              {/* Center Stat Overlay in Donut */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-extrabold text-white">{totalApplicants}</span>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Candidates</span>
              </div>
            </div>
          </div>

          {/* Quick Legend Chips */}
          <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
            {pieData.map((item) => (
              <button
                key={item.name}
                onClick={() => setSelectedRole(selectedRole === item.name ? 'all' : item.name)}
                className={`text-[10px] px-2 py-1 rounded-lg border flex items-center gap-1.5 transition ${
                  selectedRole === item.name
                    ? 'bg-purple-600/30 text-white border-purple-500 font-bold'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="truncate max-w-[120px]">{item.name}</span>
                <span className="font-bold text-slate-400">({item.value})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CHART 3: Hiring Pipeline Stages by Position (Stacked Bar Chart) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Pipeline Stage Funnel by Position</h3>
              <p className="text-[11px] text-slate-400">
                Tracking candidate progress from submission to interview & offers for each opening
              </p>
            </div>
          </div>

          {/* Stage Legend Indicators */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-sky-300">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400" /> New
            </span>
            <span className="flex items-center gap-1.5 text-amber-300">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Reviewed
            </span>
            <span className="flex items-center gap-1.5 text-purple-300">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Shortlisted
            </span>
            <span className="flex items-center gap-1.5 text-emerald-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Interview Scheduled
            </span>
            <span className="flex items-center gap-1.5 text-teal-300">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500" /> Offered
            </span>
          </div>
        </div>

        {/* Stacked Bar Chart */}
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={positionDistribution.filter((p) => p.total > 0)}
              margin={{ top: 15, right: 20, left: 10, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis
                dataKey="position"
                stroke="#94a3b8"
                tick={{ fill: '#cbd5e1', fontSize: 10 }}
                interval={0}
                angle={-15}
                textAnchor="end"
                tickFormatter={(val: string) => (val.length > 15 ? val.substring(0, 13) + '…' : val)}
              />
              <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} allowDecimals={false} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-950/95 border border-emerald-500/40 rounded-xl p-3 shadow-2xl text-xs space-y-1.5 backdrop-blur-md">
                        <p className="font-bold text-white text-sm border-b border-slate-800 pb-1">{label}</p>
                        <div className="flex justify-between gap-4 text-sky-400">
                          <span>New Applications:</span>
                          <span className="font-bold">{data.new}</span>
                        </div>
                        <div className="flex justify-between gap-4 text-amber-400">
                          <span>Under Review:</span>
                          <span className="font-bold">{data.reviewed}</span>
                        </div>
                        <div className="flex justify-between gap-4 text-purple-400">
                          <span>Shortlisted:</span>
                          <span className="font-bold">{data.shortlisted}</span>
                        </div>
                        <div className="flex justify-between gap-4 text-emerald-400">
                          <span>Interview Scheduled:</span>
                          <span className="font-bold">{data.interviewScheduled}</span>
                        </div>
                        <div className="flex justify-between gap-4 text-teal-400">
                          <span>Offered:</span>
                          <span className="font-bold">{data.offered}</span>
                        </div>
                        <div className="pt-1 border-t border-slate-800 flex justify-between font-extrabold text-white">
                          <span>Total Pipeline:</span>
                          <span>{data.total} candidates</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="new" name="New" stackId="pipeline" fill="#38bdf8" radius={[0, 0, 0, 0]} />
              <Bar dataKey="reviewed" name="Reviewed" stackId="pipeline" fill="#fbbf24" />
              <Bar dataKey="shortlisted" name="Shortlisted" stackId="pipeline" fill="#a855f7" />
              <Bar
                dataKey="interviewScheduled"
                name="Interview Scheduled"
                stackId="pipeline"
                fill="#10b981"
              />
              <Bar dataKey="offered" name="Offered" stackId="pipeline" fill="#14b8a6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CHART 4: Experience Spectrum per Position Applied For */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-12 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <div>
                <h3 className="text-sm font-bold text-white">Experience Level Distribution by Position</h3>
                <p className="text-[11px] text-slate-400">
                  Fresher vs 1–2 Years vs 3–5 Years vs 5+ Years across candidates in each role
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-cyan-300">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Fresher (&lt;1 Yr)
              </span>
              <span className="flex items-center gap-1.5 text-blue-300">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> 1–2 Years
              </span>
              <span className="flex items-center gap-1.5 text-purple-300">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> 3–5 Years
              </span>
              <span className="flex items-center gap-1.5 text-emerald-300">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> 5+ Years
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={experienceDistribution} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis
                  dataKey="position"
                  stroke="#94a3b8"
                  tick={{ fill: '#cbd5e1', fontSize: 10 }}
                  interval={0}
                  angle={-10}
                  textAnchor="end"
                />
                <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} allowDecimals={false} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-950/95 border border-amber-500/40 rounded-xl p-3 shadow-2xl text-xs space-y-1 backdrop-blur-md">
                          <p className="font-bold text-white text-sm border-b border-slate-800 pb-1">
                            {data.fullPosition}
                          </p>
                          <div className="flex justify-between gap-4 text-cyan-400">
                            <span>Fresher / &lt;1 Year:</span>
                            <span className="font-bold">{data.fresher}</span>
                          </div>
                          <div className="flex justify-between gap-4 text-blue-400">
                            <span>1–2 Years:</span>
                            <span className="font-bold">{data.mid}</span>
                          </div>
                          <div className="flex justify-between gap-4 text-purple-400">
                            <span>3–5 Years:</span>
                            <span className="font-bold">{data.senior}</span>
                          </div>
                          <div className="flex justify-between gap-4 text-emerald-400">
                            <span>5+ Years:</span>
                            <span className="font-bold">{data.lead}</span>
                          </div>
                          <div className="pt-1 border-t border-slate-800 font-bold text-white flex justify-between">
                            <span>Total Candidates:</span>
                            <span>{data.total}</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="fresher" name="Fresher" stackId="exp" fill="#06b6d4" />
                <Bar dataKey="mid" name="1–2 Years" stackId="exp" fill="#3b82f6" />
                <Bar dataKey="senior" name="3–5 Years" stackId="exp" fill="#8b5cf6" />
                <Bar dataKey="lead" name="5+ Years" stackId="exp" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Interactive Candidate Pipeline Drilldown */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white">Pipeline Drilldown & Candidate Profiles</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-500/20 text-purple-300 font-bold">
                {roleCandidates.length} candidate{roleCandidates.length !== 1 ? 's' : ''}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Showing candidates filtered by role:{' '}
              <span className="text-purple-300 font-bold">{selectedRole === 'all' ? 'All Openings' : selectedRole}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-purple-500 focus:outline-none"
            >
              <option value="all">🌟 All Positions ({candidates.length})</option>
              {JOB_POSITIONS.map((pos) => {
                const count = candidates.filter((c) => c.positionApplied === pos).length;
                return (
                  <option key={pos} value={pos}>
                    {pos} ({count})
                  </option>
                );
              })}
            </select>

            {onNavigateToCRM && (
              <button
                onClick={() => onNavigateToCRM(selectedRole)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <span>Open in ATS CRM</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Candidate Cards Grid */}
        {roleCandidates.length === 0 ? (
          <div className="text-center py-10 bg-slate-950/50 rounded-xl border border-slate-800/80">
            <Users className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-xs text-slate-400 font-medium">No candidates currently in this pipeline.</p>
            <p className="text-[11px] text-slate-500 mt-1">
              Submit a test applicant via the Google Form Simulator or use "Simulate Applicant" above.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {roleCandidates.map((cand) => {
              const statusBadgeColor =
                cand.status === 'shortlisted'
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                  : cand.status === 'interview_scheduled'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : cand.status === 'offered'
                  ? 'bg-teal-500/20 text-teal-300 border-teal-500/30'
                  : cand.status === 'reviewed'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : 'bg-sky-500/20 text-sky-300 border-sky-500/30';

              return (
                <div
                  key={cand.id}
                  className="bg-slate-950/80 border border-slate-800 hover:border-purple-500/40 rounded-xl p-4 transition shadow-md flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-bold text-white hover:text-purple-300 transition">
                          {cand.fullName}
                        </h4>
                        <p className="text-[11px] text-purple-400 font-semibold">{cand.positionApplied}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase border ${statusBadgeColor}`}>
                        {cand.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="mt-2.5 space-y-1.5 text-xs text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate">{cand.currentLocation} • {cand.preferredLocations[0] || 'PAN India'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>Exp: {cand.totalExperience} ({cand.relevantExperience})</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>Notice: <span className="text-slate-200 font-semibold">{cand.noticePeriod}</span></span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <span className="text-slate-500">Expected:</span>
                        <span className="text-emerald-400 font-bold">{cand.expectedCtc}</span>
                        <span className="text-slate-600">|</span>
                        <span className="text-slate-500">Current:</span>
                        <span className="text-slate-300">{cand.currentCtc}</span>
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-900">
                      <p className="text-[10px] text-slate-400 line-clamp-2 italic">
                        "{cand.keySkills}"
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-slate-500">
                      Applied {new Date(cand.submittedAt).toLocaleDateString()}
                    </span>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            window.dispatchEvent(
                              new CustomEvent('flowpulse_open_whatsapp_dispatcher', {
                                detail: {
                                  phone: cand.contactNumber,
                                  name: cand.fullName,
                                  roleOrCompany: cand.positionApplied,
                                  templateType: 'interview',
                                },
                              })
                            );
                          }}
                          className="px-2 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-white border border-emerald-500/30 text-[10px] font-bold transition flex items-center gap-1"
                          title="Allow Message to go in WhatsApp (wa.me Click-to-Chat)"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </button>

                        {onSendWhatsApp && (
                          <>
                            <button
                              onClick={() => onSendWhatsApp(cand, 'interview')}
                              className="px-2 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 text-[10px] font-bold transition flex items-center gap-1"
                              title="Invite for Interview via WhatsApp"
                            >
                              <Phone className="w-3 h-3" />
                              <span>Invite</span>
                            </button>
                            <button
                              onClick={() => onSendWhatsApp(cand, 'ack')}
                              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold transition"
                              title="Send Acknowledgment"
                            >
                              <Mail className="w-3 h-3" />
                              <span>Ack</span>
                            </button>
                          </>
                        )}
                      </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
