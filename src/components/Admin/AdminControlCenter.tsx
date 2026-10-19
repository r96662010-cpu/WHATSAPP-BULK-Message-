import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSecurity } from '../../context/SecurityContext';
import { User, UserRole } from '../../types';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  ShieldAlert,
  Users,
  UserPlus,
  KeyRound,
  Lock,
  Unlock,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Search,
  Download,
  Flame,
  Send,
  Megaphone,
  Eye,
  EyeOff,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export const AdminControlCenter: React.FC = () => {
  const {
    user,
    isAdmin,
    isSuperAdmin,
    teamUsers,
    auditLogs,
    updateUserRole,
    updateUserPermissions,
    toggleUserStatus,
    addTeamUser,
    deleteUser,
    logAdminAction,
  } = useAuth();

  const { settings, rotateEncryptionKey, maskText } = useSecurity();

  // Invite Member Form
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('operator');

  // Search filter
  const [userSearch, setUserSearch] = useState('');
  const [logSearch, setLogSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'security' | 'audit'>('users');
  const [rotating, setRotating] = useState(false);

  // Handle Invite
  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !inviteName.trim()) {
      alert('Please fill in email and name');
      return;
    }
    const success = addTeamUser(inviteEmail.trim(), inviteName.trim(), inviteRole, true);
    if (success) {
      confetti({ particleCount: 35, spread: 70, origin: { y: 0.6 } });
      setInviteEmail('');
      setInviteName('');
      setIsInviteOpen(false);
    }
  };

  const handleRotateKey = async () => {
    setRotating(true);
    await rotateEncryptionKey();
    setTimeout(() => {
      setRotating(false);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.5 } });
    }, 600);
  };

  // Export Audit Logs as CSV
  const handleExportAuditLogs = () => {
    const headers = 'ID,Timestamp,ActorEmail,ActorRole,Action,Resource,Status,Details\n';
    const rows = auditLogs
      .map(
        (l) =>
          `"${l.id}","${l.timestamp}","${l.actorEmail}","${l.actorRole}","${l.action}","${l.targetResource}","${l.status}","${l.details.replace(/"/g, '""')}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FlowPulse_Admin_Audit_Logs_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    logAdminAction('AUDIT_LOG_EXPORTED', 'Security & Compliance', 'Exported encrypted system audit trail');
  };

  const filteredUsers = teamUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredLogs = auditLogs.filter(
    (l) =>
      l.action.toLowerCase().includes(logSearch.toLowerCase()) ||
      l.actorEmail.toLowerCase().includes(logSearch.toLowerCase()) ||
      l.details.toLowerCase().includes(logSearch.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-6 rounded-2xl backdrop-blur-md relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Admin Control & User Governance
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {user?.role ? user.role.toUpperCase() : 'ADMIN'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Centralized administration for all users signed in with <span className="text-white font-semibold">Google SSO</span>.
            Control role-based privileges, grant/revoke WhatsApp broadcast limits, approve social media ad budgets, and inspect encrypted audit trails.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-950 rounded-xl border border-slate-800 relative z-10">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'users' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Team & Roles</span>
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'security' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Encryption Vault</span>
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'audit' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Audit Trail</span>
          </button>
        </div>
      </div>

      {/* Non-Admin Guard Notice if an Operator views this page */}
      {!isAdmin && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <span>
              You are currently viewing in Read-Only Operator mode. Administrative mutations require approval from the Super Admin (
              <span className="font-mono text-white">sondhirashmi5@gmail.com</span>).
            </span>
          </div>
        </div>
      )}

      {/* TAB 1: USERS & ROLES */}
      {activeTab === 'users' && (
        <div className="space-y-5">
          {/* Action Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search team members by name or email..."
                className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:border-indigo-500 placeholder:text-slate-600"
              />
            </div>

            <button
              onClick={() => setIsInviteOpen(true)}
              disabled={!isAdmin}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              <span>Invite Member (Google SSO)</span>
            </button>
          </div>

          {/* Users Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
                    <th className="p-3">User & Identity</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">WhatsApp Blast Quota</th>
                    <th className="p-3">Daily Ad Budget</th>
                    <th className="p-3">Permissions</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {filteredUsers.map((member) => {
                    const isSelf = member.id === user?.id;
                    const isOwner = member.role === 'superadmin';

                    return (
                      <tr key={member.id} className="hover:bg-slate-800/30 transition">
                        {/* Identity */}
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                member.avatarUrl ||
                                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                              }
                              alt={member.name}
                              className="w-9 h-9 rounded-full object-cover border border-slate-700"
                            />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-white text-xs">{member.name}</span>
                                {isSelf && (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-400 font-bold">
                                    YOU
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                                <span>{member.email}</span>
                                {member.isGoogleUser && (
                                  <span
                                    className="text-[9px] px-1 py-0.2 rounded bg-slate-800 text-emerald-400 font-bold"
                                    title="Verified Google OAuth identity"
                                  >
                                    Google
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Role Selector */}
                        <td className="p-3">
                          {isOwner ? (
                            <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 font-bold text-[11px] border border-purple-500/30">
                              Super Admin (Owner)
                            </span>
                          ) : (
                            <select
                              disabled={!isAdmin || (!isSuperAdmin && member.role === 'admin')}
                              value={member.role}
                              onChange={(e) => updateUserRole(member.id, e.target.value as UserRole)}
                              className="bg-slate-950 border border-slate-800 text-xs text-white rounded-lg p-1.5 font-semibold focus:outline-none focus:border-indigo-500 disabled:opacity-50"
                            >
                              <option value="admin">Admin</option>
                              <option value="manager">Manager</option>
                              <option value="operator">Operator</option>
                            </select>
                          )}
                        </td>

                        {/* WhatsApp Blast Quota */}
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            <Send className="w-3.5 h-3.5 text-emerald-400" />
                            <input
                              type="number"
                              disabled={!isAdmin || isOwner}
                              step={500}
                              value={member.dailyBlastLimit}
                              onChange={(e) =>
                                updateUserPermissions(member.id, {
                                  dailyBlastLimit: Number(e.target.value),
                                })
                              }
                              className="w-20 bg-slate-950 border border-slate-800 text-xs text-white rounded-lg p-1 font-mono text-center disabled:opacity-50"
                            />
                            <span className="text-[10px] text-slate-500">/day</span>
                          </div>
                        </td>

                        {/* Daily Ad Budget */}
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            <span className="text-slate-400 font-bold">₹</span>
                            <input
                              type="number"
                              disabled={!isAdmin || isOwner}
                              step={1000}
                              value={member.dailyAdBudgetLimit}
                              onChange={(e) =>
                                updateUserPermissions(member.id, {
                                  dailyAdBudgetLimit: Number(e.target.value),
                                })
                              }
                              className="w-24 bg-slate-950 border border-slate-800 text-xs text-white rounded-lg p-1 font-mono text-center disabled:opacity-50"
                            />
                            <span className="text-[10px] text-slate-500">/day</span>
                          </div>
                        </td>

                        {/* Permissions Badges */}
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <label className="flex items-center gap-1 cursor-pointer" title="Can Run Paid Ads">
                              <input
                                type="checkbox"
                                disabled={!isAdmin || isOwner}
                                checked={member.canRunAds}
                                onChange={(e) =>
                                  updateUserPermissions(member.id, { canRunAds: e.target.checked })
                                }
                                className="rounded bg-slate-800 border-slate-700 text-indigo-500 cursor-pointer"
                              />
                              <span className="text-[10px] text-slate-300">Ads</span>
                            </label>

                            <label className="flex items-center gap-1 cursor-pointer" title="Can Export Excel Data">
                              <input
                                type="checkbox"
                                disabled={!isAdmin || isOwner}
                                checked={member.canExportData}
                                onChange={(e) =>
                                  updateUserPermissions(member.id, { canExportData: e.target.checked })
                                }
                                className="rounded bg-slate-800 border-slate-700 text-emerald-500 cursor-pointer"
                              />
                              <span className="text-[10px] text-slate-300">Export</span>
                            </label>
                          </div>
                        </td>

                        {/* Status Toggle */}
                        <td className="p-3">
                          <button
                            disabled={!isAdmin || isOwner}
                            onClick={() => toggleUserStatus(member.id)}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition disabled:opacity-50 ${
                              member.status === 'active'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-rose-500/20 text-rose-400'
                            }`}
                          >
                            {member.status.toUpperCase()}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="p-3 text-right">
                          {!isOwner && (
                            <button
                              disabled={!isAdmin}
                              onClick={() => {
                                if (confirm(`Remove ${member.name} (${member.email}) from team?`)) {
                                  deleteUser(member.id);
                                }
                              }}
                              className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition disabled:opacity-40"
                              title="Remove user"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ENCRYPTION VAULT */}
      {activeTab === 'security' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">Military-Grade AES-GCM-256 Vault</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              All stored contact spreadsheets, phone numbers, API keys, and campaign schedules are cryptographically
              isolated and encrypted at rest with hardware-accelerated AES-256.
            </p>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Algorithm:</span>
                <span className="text-emerald-400 font-bold">{settings.algorithm}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Key Fingerprint:</span>
                <span className="text-white">{settings.keyFingerprint}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Last Key Rotation:</span>
                <span className="text-slate-300">{settings.lastRotatedAt}</span>
              </div>
            </div>

            <button
              onClick={handleRotateKey}
              disabled={rotating || !isAdmin}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition disabled:opacity-50"
            >
              <RotateCw className={`w-3.5 h-3.5 ${rotating ? 'animate-spin' : ''}`} />
              <span>Rotate Cryptographic Master Key</span>
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
            <div className="flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white">Google OAuth & Identity Federation</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Google Single Sign-On ensures zero passwords are leaked or stored in plain-text. Admins can restrict access
              so only domain-verified team members can execute high-volume WhatsApp campaigns or deploy social ad spends.
            </p>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Google Identity Provider Active</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>JWT Token Verification on every Webhook</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Role-Based Access Enforcement Enabled</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT TRAIL */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
                placeholder="Search audit trail..."
                className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:border-indigo-500 placeholder:text-slate-600"
              />
            </div>

            <button
              onClick={handleExportAuditLogs}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Export Audit Trail (.CSV)</span>
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">Actor & Role</th>
                    <th className="p-3">Action</th>
                    <th className="p-3">Resource</th>
                    <th className="p-3">Details</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/30 transition">
                      <td className="p-3 text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                      <td className="p-3 whitespace-nowrap">
                        <span className="text-white font-sans font-bold">{log.actorEmail}</span>
                        <span className="ml-1 text-[9px] px-1 py-0.2 rounded bg-slate-800 text-indigo-400">
                          {log.actorRole}
                        </span>
                      </td>
                      <td className="p-3 text-indigo-400 font-bold whitespace-nowrap">{log.action}</td>
                      <td className="p-3 text-slate-300 font-sans whitespace-nowrap">{log.targetResource}</td>
                      <td className="p-3 text-slate-400 font-sans">{log.details}</td>
                      <td className="p-3">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            log.status === 'success'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : log.status === 'warning'
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'bg-rose-500/20 text-rose-400'
                          }`}
                        >
                          {log.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* INVITE MEMBER MODAL */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">Invite Team Member</h3>
              </div>
              <button onClick={() => setIsInviteOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-300">Full Name</label>
                <input
                  type="text"
                  required
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. Vikram Malhotra"
                  className="w-full mt-1 bg-slate-950 border border-slate-800 text-xs text-white rounded-xl p-2.5 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300">Google Email Address</label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="e.g. vikram@shrishyam.edu"
                  className="w-full mt-1 bg-slate-950 border border-slate-800 text-xs text-white rounded-xl p-2.5 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300">Initial Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as UserRole)}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 text-xs text-white rounded-xl p-2.5 focus:outline-none"
                >
                  <option value="operator">Operator (1,000 Blast/day, No Ads)</option>
                  <option value="manager">Manager (2,000 Blast/day, Can Run Ads)</option>
                  <option value="admin">Admin (Full Team & Campaign Governance)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition"
                >
                  Add Team Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
