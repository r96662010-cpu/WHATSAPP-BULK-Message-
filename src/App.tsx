/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { SecurityProvider, useSecurity } from './context/SecurityContext';
import { Navbar, ActiveTab } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { GoogleSignInModal } from './components/GoogleSignInModal';
import { EncryptedLockScreen } from './components/EncryptedLockScreen';
import { CommandCenter } from './components/Overview/CommandCenter';
import { WorkflowCanvas } from './components/WorkflowBuilder/WorkflowCanvas';
import { WhatsAppBlasterHub } from './components/WhatsAppBlaster/WhatsAppBlasterHub';
import { BlasterUtilitiesHub } from './components/WhatsAppBlaster/BlasterUtilitiesHub';
import { LiveAgentHub } from './components/LiveAgentSimulator/LiveAgentHub';
import { MediaStudioHub } from './components/MediaStudio/MediaStudioHub';
import { IntegrationsHub } from './components/Integrations/IntegrationsHub';
import { ProductionGateway } from './components/ProductionGateway/ProductionGateway';
import { KeyboardShortcutManager } from './components/Shortcuts/KeyboardShortcutManager';
import { ExcelSheetHub } from './components/ExcelHub/ExcelSheetHub';
import { SocialMediaAdsHub } from './components/SocialHub/SocialMediaAdsHub';
import { NotificationProvider } from './context/NotificationContext';
import { RecruitmentGoogleFormHub } from './components/RecruitmentHub/RecruitmentGoogleFormHub';
import { AdminControlCenter } from './components/Admin/AdminControlCenter';
import { WhatsAppQuickDispatcherModal } from './components/Notifications/WhatsAppQuickDispatcherModal';

function AppContent() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const { lockApp } = useSecurity();

  // Workflow shortcut action dispatchers
  const handleOpen1000Blast = () => {
    setActiveTab('blaster');
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('flowpulse_open_1000_blast'));
    }, 60);
  };

  const handleOpenMessageAll = () => {
    setActiveTab('blaster');
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('flowpulse_open_message_all'));
    }, 60);
  };

  const handleOpenTemplateManager = () => {
    setActiveTab('blaster');
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('flowpulse_open_templates'));
    }, 60);
  };

  const handleOpenWarmer = () => {
    setActiveTab('blaster');
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('flowpulse_open_warmer'));
    }, 60);
  };

  const handleOpenFilter = () => {
    setActiveTab('utilities');
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('flowpulse_open_filter'));
    }, 60);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white relative">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenGoogleAuth={() => setIsGoogleModalOpen(true)}
        onOpenShortcuts={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: '?' }))}
        activeAccountsCount={4}
      />

      {/* Main Workspace based on active navigation tab */}
      <div className="flex-1">
        {activeTab === 'overview' && (
          <CommandCenter onNavigate={(tab) => setActiveTab(tab)} />
        )}
        {activeTab === 'canvas' && (
          <WorkflowCanvas onOpenSheetsTab={() => setActiveTab('agent')} />
        )}
        {activeTab === 'blaster' && <WhatsAppBlasterHub />}
        {activeTab === 'excel' && (
          <ExcelSheetHub
            onNavigateToBlaster={() => setActiveTab('blaster')}
            onNavigateToSocialAds={() => setActiveTab('social')}
          />
        )}
        {activeTab === 'social' && <SocialMediaAdsHub />}
        {activeTab === 'recruitment' && <RecruitmentGoogleFormHub />}
        {activeTab === 'agent' && <LiveAgentHub />}
        {activeTab === 'media' && <MediaStudioHub />}
        {activeTab === 'admin' && <AdminControlCenter />}
        {activeTab === 'utilities' && <BlasterUtilitiesHub />}
        {activeTab === 'integrations' && <IntegrationsHub />}
        {activeTab === 'gateway' && <ProductionGateway />}
      </div>

      {/* Global Keyboard Shortcut Manager (Navigation 1-8 / Alt+1-8, 1000 Blast, Actions, Cheat Sheet) */}
      <KeyboardShortcutManager
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenGoogleAuth={() => setIsGoogleModalOpen(true)}
        onOpenMessageAll={handleOpenMessageAll}
        onOpenTemplateManager={handleOpenTemplateManager}
        onOpenWarmer={handleOpenWarmer}
        onOpenFilter={handleOpenFilter}
        onOpen1000Blast={handleOpen1000Blast}
        onLockApp={lockApp}
      />

      {/* Authentication Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Dedicated Official Google Sign-In Modal */}
      <GoogleSignInModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
      />

      {/* Encrypted Vault Lock Screen Overlay (Active when app is locked) */}
      <EncryptedLockScreen />

      {/* Global WhatsApp Direct Dispatcher & Floating Notification Hub */}
      <WhatsAppQuickDispatcherModal />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SecurityProvider>
        <NotificationProvider>
          <AppContent />
        </NotificationProvider>
      </SecurityProvider>
    </AuthProvider>
  );
}
