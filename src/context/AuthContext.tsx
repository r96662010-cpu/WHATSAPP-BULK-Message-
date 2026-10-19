import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, AdminAuditLog } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  teamUsers: User[];
  auditLogs: AdminAuditLog[];
  signInWithGoogle: (customEmail?: string, customName?: string) => Promise<boolean>;
  signInWithEmail: (email: string, password?: string) => Promise<boolean>;
  signUpWithEmail: (email: string, password?: string, name?: string) => Promise<boolean>;
  signOut: () => void;
  consumeCredits: (amount: number) => boolean;
  addCredits: (amount: number) => void;
  updateUserRole: (userId: string, newRole: UserRole) => boolean;
  updateUserPermissions: (userId: string, updates: Partial<User>) => boolean;
  toggleUserStatus: (userId: string) => boolean;
  addTeamUser: (email: string, name: string, role: UserRole, isGoogleUser?: boolean) => boolean;
  deleteUser: (userId: string) => boolean;
  logAdminAction: (
    action: string,
    targetResource: string,
    details: string,
    status?: 'success' | 'warning' | 'denied'
  ) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CURRENT_USER_KEY = 'flowpulse_current_user';
const TEAM_USERS_KEY = 'flowpulse_team_users';
const AUDIT_LOGS_KEY = 'flowpulse_admin_audit_logs';

const INITIAL_TEAM: User[] = [
  {
    id: 'usr_sondhirashmi5',
    email: 'sondhirashmi5@gmail.com',
    name: 'Rashmi Sondhi (Owner)',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    credits: 5000,
    token: 'jwt_google_oauth_superadmin_2026',
    role: 'superadmin',
    isGoogleUser: true,
    emailVerified: true,
    status: 'active',
    dailyBlastLimit: 10000,
    dailyAdBudgetLimit: 100000,
    canRunAds: true,
    canExportData: true,
    canManageUsers: true,
    encryptionFingerprint: 'SHA256:4f8a...9c12',
    createdAt: '2026-01-10',
    lastLoginAt: 'Just now',
  },
  {
    id: 'usr_amit_marketing',
    email: 'amit.verma@shrishyam.edu',
    name: 'Amit Verma',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    credits: 2000,
    token: 'jwt_google_oauth_manager_2026',
    role: 'manager',
    isGoogleUser: true,
    emailVerified: true,
    status: 'active',
    dailyBlastLimit: 2000,
    dailyAdBudgetLimit: 25000,
    canRunAds: true,
    canExportData: true,
    canManageUsers: false,
    encryptionFingerprint: 'SHA256:b2e1...83ac',
    createdAt: '2026-02-14',
    lastLoginAt: '2 hours ago',
  },
  {
    id: 'usr_priya_ops',
    email: 'priya.sharma@shrishyam.edu',
    name: 'Priya Sharma',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    credits: 1500,
    token: 'jwt_email_operator_2026',
    role: 'operator',
    isGoogleUser: false,
    emailVerified: true,
    status: 'active',
    dailyBlastLimit: 1000,
    dailyAdBudgetLimit: 5000,
    canRunAds: false,
    canExportData: false,
    canManageUsers: false,
    encryptionFingerprint: 'SHA256:71d9...4a10',
    createdAt: '2026-03-01',
    lastLoginAt: 'Yesterday',
  },
];

const INITIAL_AUDIT_LOGS: AdminAuditLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-10-18 04:35:10',
    actorEmail: 'sondhirashmi5@gmail.com',
    actorRole: 'superadmin',
    action: 'OAUTH_LOGIN_GOOGLE',
    targetResource: 'Google OAuth SSO',
    details: 'Authenticated with Google Verified Identity (sub: 108429184)',
    status: 'success',
  },
  {
    id: 'log-2',
    timestamp: '2026-10-18 04:40:22',
    actorEmail: 'sondhirashmi5@gmail.com',
    actorRole: 'superadmin',
    action: 'VAULT_KEY_ROTATED',
    targetResource: 'Security Vault AES-256-GCM',
    details: 'Master crypto key rotated. New fingerprint SHA256:4f8a...9c12',
    status: 'success',
  },
  {
    id: 'log-3',
    timestamp: '2026-10-18 05:02:15',
    actorEmail: 'sondhirashmi5@gmail.com',
    actorRole: 'superadmin',
    action: 'PRIMARY_SENDER_BOUND',
    targetResource: 'WhatsApp Cloud Gateway',
    details: 'Connected primary sender +91 78695 15615 with 1,000/day bulk throughput',
    status: 'success',
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [teamUsers, setTeamUsers] = useState<User[]>([]);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from storage or defaults
  useEffect(() => {
    try {
      // 1. Team Users
      const storedTeam = localStorage.getItem(TEAM_USERS_KEY);
      let activeTeam = INITIAL_TEAM;
      if (storedTeam) {
        try {
          activeTeam = JSON.parse(storedTeam);
        } catch {
          activeTeam = INITIAL_TEAM;
        }
      } else {
        localStorage.setItem(TEAM_USERS_KEY, JSON.stringify(INITIAL_TEAM));
      }
      setTeamUsers(activeTeam);

      // 2. Audit logs
      const storedLogs = localStorage.getItem(AUDIT_LOGS_KEY);
      if (storedLogs) {
        try {
          setAuditLogs(JSON.parse(storedLogs));
        } catch {
          setAuditLogs(INITIAL_AUDIT_LOGS);
        }
      } else {
        localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(INITIAL_AUDIT_LOGS));
        setAuditLogs(INITIAL_AUDIT_LOGS);
      }

      // 3. Current User
      const stored = localStorage.getItem(CURRENT_USER_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        const defaultUser = activeTeam.find((u) => u.email === 'sondhirashmi5@gmail.com') || activeTeam[0];
        setUser(defaultUser);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(defaultUser));
      }
    } catch (e) {
      console.warn('Auth storage read error', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveUser = (u: User | null) => {
    setUser(u);
    if (u) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(u));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  };

  const saveTeamUsers = (usersList: User[]) => {
    setTeamUsers(usersList);
    localStorage.setItem(TEAM_USERS_KEY, JSON.stringify(usersList));
  };

  const logAdminAction = (
    action: string,
    targetResource: string,
    details: string,
    status: 'success' | 'warning' | 'denied' = 'success'
  ) => {
    const newLog: AdminAuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actorEmail: user?.email || 'system@flowpulse.ai',
      actorRole: user?.role || 'operator',
      action,
      targetResource,
      details,
      status,
    };
    const updated = [newLog, ...auditLogs.slice(0, 99)];
    setAuditLogs(updated);
    localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(updated));
  };

  const signInWithGoogle = async (customEmail?: string, customName?: string): Promise<boolean> => {
    const emailToUse = customEmail || 'sondhirashmi5@gmail.com';
    const nameToUse = customName || (emailToUse.includes('sondhi') ? 'Rashmi Sondhi' : emailToUse.split('@')[0]);
    const isOwner = emailToUse.toLowerCase() === 'sondhirashmi5@gmail.com';

    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailToUse,
          name: nameToUse,
          avatarUrl: isOwner
            ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        }),
      });
      if (res.ok) {
        // Successful response
      }
    } catch (err) {
      console.warn('Backend google auth note:', err);
    }

    // Check if user is in team list
    const existingTeamMember = teamUsers.find((u) => u.email.toLowerCase() === emailToUse.toLowerCase());
    const role: UserRole = isOwner ? 'superadmin' : existingTeamMember?.role || 'admin';

    const googleUser: User = {
      id: existingTeamMember?.id || `usr_${emailToUse.replace(/[^a-zA-Z0-9]/g, '_')}`,
      email: emailToUse,
      name: nameToUse,
      avatarUrl:
        existingTeamMember?.avatarUrl ||
        (isOwner
          ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'),
      credits: existingTeamMember?.credits ?? 3000,
      token: `jwt_google_oauth_v3_${Date.now()}`,
      role,
      isGoogleUser: true,
      googleSub: `sub_g_${Math.floor(Math.random() * 900000000 + 100000000)}`,
      emailVerified: true,
      status: 'active',
      dailyBlastLimit: existingTeamMember?.dailyBlastLimit ?? (isOwner ? 10000 : 3000),
      dailyAdBudgetLimit: existingTeamMember?.dailyAdBudgetLimit ?? (isOwner ? 100000 : 50000),
      canRunAds: true,
      canExportData: true,
      canManageUsers: role === 'superadmin' || role === 'admin',
      encryptionFingerprint: 'SHA256:g8a9...7f1b',
      createdAt: existingTeamMember?.createdAt || new Date().toISOString().split('T')[0],
      lastLoginAt: 'Just now',
    };

    saveUser(googleUser);

    // Update teamUsers if not present or update lastLogin
    const exists = teamUsers.some((u) => u.email.toLowerCase() === emailToUse.toLowerCase());
    if (!exists) {
      saveTeamUsers([googleUser, ...teamUsers]);
    } else {
      saveTeamUsers(
        teamUsers.map((u) =>
          u.email.toLowerCase() === emailToUse.toLowerCase()
            ? { ...u, lastLoginAt: 'Just now', isGoogleUser: true, emailVerified: true }
            : u
        )
      );
    }

    logAdminAction('SIGN_IN_GOOGLE', 'Google Identity Federation', `User ${emailToUse} signed in with Google OAuth`);
    return true;
  };

  const signInWithEmail = async (email: string): Promise<boolean> => {
    const isOwner = email.toLowerCase() === 'sondhirashmi5@gmail.com';
    const existingTeamMember = teamUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    const role: UserRole = isOwner ? 'superadmin' : existingTeamMember?.role || 'manager';

    const emailUser: User = {
      id: existingTeamMember?.id || `usr_${email.replace(/[^a-zA-Z0-9]/g, '_')}`,
      email,
      name: existingTeamMember?.name || email.split('@')[0],
      avatarUrl: existingTeamMember?.avatarUrl,
      credits: existingTeamMember?.credits ?? 2000,
      token: `jwt_email_${Date.now()}`,
      role,
      isGoogleUser: false,
      emailVerified: true,
      status: 'active',
      dailyBlastLimit: existingTeamMember?.dailyBlastLimit ?? 1000,
      dailyAdBudgetLimit: existingTeamMember?.dailyAdBudgetLimit ?? 10000,
      canRunAds: existingTeamMember?.canRunAds ?? false,
      canExportData: existingTeamMember?.canExportData ?? false,
      canManageUsers: role === 'superadmin' || role === 'admin',
      createdAt: existingTeamMember?.createdAt || new Date().toISOString().split('T')[0],
      lastLoginAt: 'Just now',
    };

    saveUser(emailUser);
    logAdminAction('SIGN_IN_EMAIL', 'Password Credentials', `User ${email} signed in via email credentials`);
    return true;
  };

  const signUpWithEmail = async (email: string, _password?: string, name?: string): Promise<boolean> => {
    const isOwner = email.toLowerCase() === 'sondhirashmi5@gmail.com';
    const role: UserRole = isOwner ? 'superadmin' : 'operator';

    const newUser: User = {
      id: `usr_${email.replace(/[^a-zA-Z0-9]/g, '_')}`,
      email,
      name: name || email.split('@')[0],
      credits: 2000,
      token: `jwt_email_${Date.now()}`,
      role,
      isGoogleUser: false,
      emailVerified: true,
      status: 'active',
      dailyBlastLimit: 1000,
      dailyAdBudgetLimit: 5000,
      canRunAds: false,
      canExportData: false,
      canManageUsers: role === 'superadmin',
      createdAt: new Date().toISOString().split('T')[0],
      lastLoginAt: 'Just now',
    };

    saveUser(newUser);
    saveTeamUsers([newUser, ...teamUsers]);
    logAdminAction('SIGN_UP_EMAIL', 'User Registration', `New team user registered: ${email}`);
    return true;
  };

  const signOut = () => {
    logAdminAction('SIGN_OUT', 'User Session', `User ${user?.email} logged out`);
    saveUser(null);
  };

  const consumeCredits = (amount: number): boolean => {
    if (!user) return false;
    if (user.credits < amount) {
      return false;
    }
    const updated = { ...user, credits: user.credits - amount };
    saveUser(updated);
    return true;
  };

  const addCredits = (amount: number) => {
    if (!user) return;
    const updated = { ...user, credits: user.credits + amount };
    saveUser(updated);
  };

  // ADMIN CONTROLS (Only available to Admin / Super Admin)
  const isSuperAdmin = user?.role === 'superadmin';
  const isAdmin = isSuperAdmin || user?.role === 'admin';

  const updateUserRole = (userId: string, newRole: UserRole): boolean => {
    if (!isAdmin) {
      logAdminAction('ROLE_CHANGE_BLOCKED', 'Admin RBAC', `Non-admin attempted to change role of ${userId}`, 'denied');
      return false;
    }

    const updatedTeam = teamUsers.map((u) => {
      if (u.id === userId) {
        return {
          ...u,
          role: newRole,
          canManageUsers: newRole === 'admin' || newRole === 'superadmin',
          canRunAds: newRole !== 'operator',
          canExportData: newRole !== 'operator',
        };
      }
      return u;
    });

    saveTeamUsers(updatedTeam);

    // If updating currently logged in user
    if (user?.id === userId) {
      const updatedCurrent = updatedTeam.find((u) => u.id === userId);
      if (updatedCurrent) saveUser(updatedCurrent);
    }

    logAdminAction('ROLE_UPDATED', 'User RBAC', `Admin changed role of user ${userId} to ${newRole}`);
    return true;
  };

  const updateUserPermissions = (userId: string, updates: Partial<User>): boolean => {
    if (!isAdmin) return false;

    const updatedTeam = teamUsers.map((u) => (u.id === userId ? { ...u, ...updates } : u));
    saveTeamUsers(updatedTeam);

    if (user?.id === userId) {
      saveUser({ ...user, ...updates });
    }

    logAdminAction('PERMISSIONS_UPDATED', 'User Permissions', `Updated limits/permissions for user ${userId}`);
    return true;
  };

  const toggleUserStatus = (userId: string): boolean => {
    if (!isAdmin) return false;

    const updatedTeam = teamUsers.map((u) => {
      if (u.id === userId) {
        const nextStatus = u.status === 'active' ? 'suspended' : 'active';
        return { ...u, status: nextStatus as 'active' | 'suspended' };
      }
      return u;
    });

    saveTeamUsers(updatedTeam);
    logAdminAction('STATUS_TOGGLED', 'Account Status', `Toggled account status for ${userId}`);
    return true;
  };

  const addTeamUser = (email: string, name: string, role: UserRole, isGoogleUser = true): boolean => {
    if (!isAdmin) return false;

    const newMember: User = {
      id: `usr_${email.replace(/[^a-zA-Z0-9]/g, '_')}`,
      email,
      name,
      credits: 2000,
      token: `jwt_invite_${Date.now()}`,
      role,
      isGoogleUser,
      emailVerified: true,
      status: 'active',
      dailyBlastLimit: role === 'admin' ? 5000 : role === 'manager' ? 2000 : 1000,
      dailyAdBudgetLimit: role === 'admin' ? 50000 : role === 'manager' ? 20000 : 5000,
      canRunAds: role !== 'operator',
      canExportData: role !== 'operator',
      canManageUsers: role === 'admin' || role === 'superadmin',
      createdAt: new Date().toISOString().split('T')[0],
      lastLoginAt: 'Never (Invited)',
    };

    saveTeamUsers([newMember, ...teamUsers]);
    logAdminAction('TEAM_USER_INVITED', 'Team Management', `Invited new ${role}: ${email}`);
    return true;
  };

  const deleteUser = (userId: string): boolean => {
    if (!isAdmin) return false;
    const target = teamUsers.find((u) => u.id === userId);
    if (target?.role === 'superadmin') {
      alert('Cannot delete the Super Admin / Account Owner.');
      return false;
    }

    const filtered = teamUsers.filter((u) => u.id !== userId);
    saveTeamUsers(filtered);
    logAdminAction('USER_REMOVED', 'Team Management', `Removed user ${userId} from organization`);
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAdmin,
        isSuperAdmin,
        teamUsers,
        auditLogs,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        consumeCredits,
        addCredits,
        updateUserRole,
        updateUserPermissions,
        toggleUserStatus,
        addTeamUser,
        deleteUser,
        logAdminAction,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
