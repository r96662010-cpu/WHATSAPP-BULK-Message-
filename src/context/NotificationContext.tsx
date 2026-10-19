import React, { createContext, useContext, useState, useEffect } from 'react';
import { BroadcastNotification } from '../types';
import { playSuccessChime } from '../utils/audioNotification';
import { WhatsAppViewerData, WhatsAppMessageViewerModal } from '../components/Notifications/WhatsAppMessageViewerModal';
import { MailReportData, MailReportViewerModal } from '../components/Notifications/MailReportViewerModal';
import { BroadcastCompletionModal } from '../components/Notifications/BroadcastCompletionModal';

interface TriggerNotificationParams {
  count: number;
  senderPhone: string;
  adminWhatsApp?: string;
  toEmail?: string;
  templateTitle?: string;
  messageBody?: string;
  sampleRecipient?: {
    name: string;
    phone: string;
    company?: string;
    course?: string;
  };
}

interface NotificationContextType {
  notifications: BroadcastNotification[];
  unreadCount: number;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  triggerBroadcastCompleteNotification: (params: TriggerNotificationParams) => void;
  openWhatsAppViewer: (data: WhatsAppViewerData) => void;
  openMailReport: (data: MailReportData) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const INITIAL_NOTIFICATIONS: BroadcastNotification[] = [
  {
    id: 'notif-1',
    timestamp: 'Just now',
    title: 'All Messages Sent in WhatsApp & Dispatched to Mail',
    message: '1,000 bulk messages transmitted from +91 78695 15615. Audit report sent to sondhirashmi5@gmail.com.',
    type: 'broadcast_complete',
    recipientsCount: 1000,
    senderPhone: '+91 78695 15615',
    recipientEmail: 'sondhirashmi5@gmail.com',
    adminWhatsApp: '+91 78695 15615',
    mailSubject: '[FlowPulse Alert] 1,000 WhatsApp Messages Dispatched Successfully',
    deliveryStatus: 'delivered',
    read: false,
    sampleRecipient: {
      name: 'Rahul Gupta',
      phone: '+91 98334 11229',
      company: 'FinTech AI Innovations',
      message:
        'Hi Rahul Gupta! Exclusive 40% Festive AI Automation Offer from Shri Shyam Consulting. Reply YES to claim!',
    },
  },
  {
    id: 'notif-2',
    timestamp: '25 mins ago',
    title: 'Admissions Campaign Dispatched',
    message: '500 candidate alerts sent for Delhi NCR AI Masterclass batch.',
    type: 'whatsapp_sent',
    recipientsCount: 500,
    senderPhone: '+91 98765 00102',
    recipientEmail: 'sondhirashmi5@gmail.com',
    adminWhatsApp: '+91 78695 15615',
    mailSubject: '[FlowPulse Alert] 500 Candidate Messages Dispatched',
    deliveryStatus: 'delivered',
    read: true,
  },
];

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<BroadcastNotification[]>(() => {
    try {
      const stored = localStorage.getItem('flowpulse_notifications');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      // ignore
    }
    return INITIAL_NOTIFICATIONS;
  });

  // Modal States
  const [whatsAppViewerData, setWhatsAppViewerData] = useState<WhatsAppViewerData | null>(null);
  const [mailReportData, setMailReportData] = useState<MailReportData | null>(null);
  const [completionModalData, setCompletionModalData] = useState<{
    isOpen: boolean;
    recipientsCount: number;
    senderPhone: string;
    adminWhatsApp: string;
    toEmail: string;
    sampleViewerData: WhatsAppViewerData;
    sampleMailReportData: MailReportData;
  } | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('flowpulse_notifications', JSON.stringify(notifications));
    } catch (e) {
      // ignore
    }
  }, [notifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const openWhatsAppViewer = (data: WhatsAppViewerData) => {
    setWhatsAppViewerData(data);
  };

  const openMailReport = (data: MailReportData) => {
    setMailReportData(data);
  };

  const triggerBroadcastCompleteNotification = (params: TriggerNotificationParams) => {
    const {
      count,
      senderPhone,
      adminWhatsApp = '+91 78695 15615',
      toEmail = 'sondhirashmi5@gmail.com',
      templateTitle = 'Festive Offer & AI Masterclass Campaign',
      messageBody = `Hi {{name}}, exclusive update from Shri Shyam Consulting! Reply to claim.`,
      sampleRecipient = {
        name: 'Rahul Gupta',
        phone: '+91 98334 11229',
        company: 'FinTech AI Innovations',
        course: 'AI & Cloud Automation',
      },
    } = params;

    // 1. Play success chime
    playSuccessChime();

    // 2. Browser native notification
    try {
      if ('Notification' in window) {
        if (Notification.permission === 'granted') {
          new Notification('FlowPulse: All Messages Sent in WhatsApp & Mail!', {
            body: `Successfully sent ${count.toLocaleString()} messages from ${senderPhone}. Report dispatched to ${toEmail}.`,
            icon: '/favicon.ico',
          });
        } else if (Notification.permission !== 'denied') {
          Notification.requestPermission().then((perm) => {
            if (perm === 'granted') {
              new Notification('FlowPulse: All Messages Sent in WhatsApp & Mail!', {
                body: `Successfully sent ${count.toLocaleString()} messages from ${senderPhone}. Report dispatched to ${toEmail}.`,
              });
            }
          });
        }
      }
    } catch (err) {
      console.debug('Notification permission error:', err);
    }

    // 3. Create new notification record
    const newNotif: BroadcastNotification = {
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      title: 'All Messages Sent in WhatsApp & Dispatched to Mail',
      message: `All ${count.toLocaleString()} messages transmitted via WhatsApp from ${senderPhone}. Official delivery report delivered to ${toEmail}.`,
      type: 'broadcast_complete',
      recipientsCount: count,
      senderPhone,
      recipientEmail: toEmail,
      adminWhatsApp,
      mailSubject: `[FlowPulse Alert] ${count.toLocaleString()} WhatsApp Messages Dispatched Successfully`,
      deliveryStatus: 'delivered',
      read: false,
      sampleRecipient: {
        name: sampleRecipient.name,
        phone: sampleRecipient.phone,
        company: sampleRecipient.company,
        message: messageBody.replace(/{{name}}/g, sampleRecipient.name),
      },
    };

    setNotifications((prev) => [newNotif, ...prev]);

    // 4. Prepare data for modals
    const viewerData: WhatsAppViewerData = {
      recipientName: sampleRecipient.name,
      recipientPhone: sampleRecipient.phone,
      recipientCompany: sampleRecipient.company,
      recipientCourse: sampleRecipient.course,
      messageBody,
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      actionButtons: ['Claim 40% Festive Offer 🎁', 'Confirm Admission Seat 🎓', 'Chat on WhatsApp 💬'],
      sentTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      senderPhone,
      isDelivered: true,
    };

    const mailData: MailReportData = {
      toEmail,
      adminWhatsApp,
      senderPhone,
      totalRecipients: count,
      deliveredCount: count,
      templateName: templateTitle,
      campaignTitle: `${count.toLocaleString()} WhatsApp Bulk Broadcast`,
      dispatchedAt: new Date().toLocaleString(),
      sampleRecipients: [
        { name: sampleRecipient.name, phone: sampleRecipient.phone, company: sampleRecipient.company },
        { name: 'Ananya Sen', phone: '+91 97401 55667', company: 'Stellar Cloud Systems' },
        { name: 'Karan Bajaj', phone: '+91 99102 33445', company: 'NextGen Global AI' },
        { name: 'Vikram Mehta', phone: '+91 98114 88990', company: 'Apex Ventures' },
        { name: 'Pooja Sharma', phone: '+91 98203 44556', company: 'EduTech Prime' },
      ],
    };

    // 5. Open the celebratory BroadcastCompletionModal
    setCompletionModalData({
      isOpen: true,
      recipientsCount: count,
      senderPhone,
      adminWhatsApp,
      toEmail,
      sampleViewerData: viewerData,
      sampleMailReportData: mailData,
    });
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAllAsRead,
        clearNotifications,
        triggerBroadcastCompleteNotification,
        openWhatsAppViewer,
        openMailReport,
      }}
    >
      {children}

      {/* WhatsApp Sent Message Viewer Modal */}
      <WhatsAppMessageViewerModal
        isOpen={Boolean(whatsAppViewerData)}
        onClose={() => setWhatsAppViewerData(null)}
        data={whatsAppViewerData}
      />

      {/* Mail Notification Report Viewer Modal */}
      <MailReportViewerModal
        isOpen={Boolean(mailReportData)}
        onClose={() => setMailReportData(null)}
        report={mailReportData}
      />

      {/* Broadcast Completion Celebratory Modal */}
      {completionModalData && (
        <BroadcastCompletionModal
          isOpen={completionModalData.isOpen}
          onClose={() => setCompletionModalData(null)}
          recipientsCount={completionModalData.recipientsCount}
          senderPhone={completionModalData.senderPhone}
          adminWhatsApp={completionModalData.adminWhatsApp}
          toEmail={completionModalData.toEmail}
          sampleViewerData={completionModalData.sampleViewerData}
          sampleMailReportData={completionModalData.sampleMailReportData}
          onOpenWhatsAppViewer={() => {
            setWhatsAppViewerData(completionModalData.sampleViewerData);
          }}
          onOpenMailReportViewer={() => {
            setMailReportData(completionModalData.sampleMailReportData);
          }}
        />
      )}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
