/**
 * Sound & Browser Notification Utilities for WhatsApp Message Delivery
 */

// Play authentic double-chime delivery tone using Web Audio API
export const playWhatsAppDeliveryTone = () => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    const now = ctx.currentTime;

    // Chime 1: 880 Hz (A5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, now);
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.25, now + 0.02);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.18);

    // Chime 2: 1760 Hz (A6 - Higher harmonic double tick)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1760, now + 0.12);
    gain2.gain.setValueAtTime(0, now + 0.12);
    gain2.gain.linearRampToValueAtTime(0.35, now + 0.14);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.38);
  } catch (err) {
    console.warn('Audio playback not permitted or unavailable:', err);
  }
};

// Request Notification Permission
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }
  if (Notification.permission === 'granted') {
    return true;
  }
  if (Notification.permission !== 'denied') {
    const result = await Notification.requestPermission();
    return result === 'granted';
  }
  return false;
};

// Trigger Browser Desktop Notification
export const triggerDeliveryNotification = (params: {
  phone: string;
  name?: string;
  title?: string;
  body?: string;
}) => {
  const { phone, name, title, body } = params;

  // Play audio chime
  playWhatsAppDeliveryTone();

  if (typeof window === 'undefined' || !('Notification' in window)) {
    return;
  }

  const defaultTitle = title || `✅ WhatsApp Delivered to ${phone}`;
  const defaultBody =
    body ||
    `Message successfully delivered to ${name ? `${name} (${phone})` : phone} with double checkmark (✓✓) confirmation.`;

  if (Notification.permission === 'granted') {
    try {
      new Notification(defaultTitle, {
        body: defaultBody,
        icon: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg',
      });
    } catch {
      // Fallback
    }
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then((perm) => {
      if (perm === 'granted') {
        new Notification(defaultTitle, {
          body: defaultBody,
          icon: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg',
        });
      }
    });
  }
};

// Convenience helper for delivery notifications
export const notifyDeliverySuccess = (name?: string, phone?: string) => {
  triggerDeliveryNotification({
    name,
    phone: phone || '',
    title: `✅ WhatsApp Delivered to ${name || phone || 'Recipient'}`,
    body: `Message successfully delivered to ${name ? `${name} (${phone})` : phone || 'contact'} with verified double checkmark (✓✓).`,
  });
};

// Clean & Format Phone Numbers for WhatsApp
export interface FormattedPhoneResult {
  cleanDigits: string;
  displayFormatted: string;
  countryCode: string;
  isValid: boolean;
  error?: string;
}

export const cleanAndFormatPhone = (
  rawPhone: string,
  defaultCountryCode = '91'
): FormattedPhoneResult => {
  if (!rawPhone || typeof rawPhone !== 'string') {
    return {
      cleanDigits: '',
      displayFormatted: '',
      countryCode: defaultCountryCode,
      isValid: false,
      error: 'Phone number is empty',
    };
  }

  // Remove whitespace, dashes, parens, brackets, dots
  let digits = rawPhone.replace(/[\s\-\(\)\.\[\]]/g, '');

  // Strip leading +
  if (digits.startsWith('+')) {
    digits = digits.slice(1);
  }

  // If starts with 00, strip 00 (common international dialing prefix)
  if (digits.startsWith('00')) {
    digits = digits.slice(2);
  }

  // If leading single 0 and 11 digits (e.g. 09876543210 in India), strip 0 and prepend country code
  if (digits.startsWith('0') && digits.length === 11) {
    digits = defaultCountryCode + digits.slice(1);
  } else if (digits.length === 10) {
    // 10 digits standard mobile number without country code (e.g. India standard)
    digits = defaultCountryCode + digits;
  }

  // International WhatsApp numbers are typically between 10 and 15 digits
  const isValid = /^\d{10,15}$/.test(digits);

  return {
    cleanDigits: digits,
    displayFormatted: `+${digits}`,
    countryCode: digits.startsWith(defaultCountryCode)
      ? defaultCountryCode
      : digits.slice(0, 3),
    isValid,
    error: isValid ? undefined : 'Please enter a valid 10-15 digit mobile number with country code',
  };
};

// Generate Universal WhatsApp Direct URLs (Official Meta wa.me & API Click-to-Chat)
export const getWhatsAppUrls = (phone: string, text: string) => {
  const formatted = cleanAndFormatPhone(phone);
  const clean = formatted.cleanDigits;
  const encoded = encodeURIComponent(text.trim());

  return {
    waMeUrl: `https://wa.me/${clean}${encoded ? `?text=${encoded}` : ''}`,
    apiUrl: `https://api.whatsapp.com/send/?phone=${clean}&text=${encoded}&type=phone_number&app_absent=0`,
    webUrl: `https://web.whatsapp.com/send?phone=${clean}&text=${encoded}`,
    deepLinkUrl: `whatsapp://send?phone=${clean}&text=${encoded}`,
    cleanPhone: clean,
    formattedPhone: formatted.displayFormatted,
    isValid: formatted.isValid,
  };
};

// Open WhatsApp to Given Number with Universal Popup Safeguard & Meta wa.me link
export const openWhatsAppDirect = (
  phone: string,
  text: string,
  mode: 'wa_me' | 'api' | 'web' | 'app' = 'wa_me'
): {
  success: boolean;
  url: string;
  waMeUrl: string;
  webUrl: string;
  deepLinkUrl: string;
  cleanPhone: string;
} => {
  const urls = getWhatsAppUrls(phone, text);
  if (!urls.isValid || !urls.cleanPhone) {
    return {
      success: false,
      url: '',
      waMeUrl: '',
      webUrl: '',
      deepLinkUrl: '',
      cleanPhone: '',
    };
  }

  // Select target URL based on requested mode (default wa.me works universally on Mobile & Desktop)
  const targetUrl =
    mode === 'web'
      ? urls.webUrl
      : mode === 'app'
      ? urls.deepLinkUrl
      : mode === 'api'
      ? urls.apiUrl
      : urls.waMeUrl;

  try {
    const win = window.open(targetUrl, '_blank', 'noopener,noreferrer');
    if (!win || win.closed || typeof win.closed === 'undefined') {
      // Popup blocked fallback: create hidden link and click
      const a = document.createElement('a');
      a.href = targetUrl;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  } catch (err) {
    console.warn('Direct window.open encountered constraint:', err);
    try {
      const a = document.createElement('a');
      a.href = targetUrl;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch {
      // fallback
    }
  }

  // Dispatch broadcast event so the app UI can display instant interactive 'Open in WhatsApp' pill
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('flowpulse_whatsapp_message_dispatched', {
        detail: {
          phone: urls.formattedPhone,
          cleanPhone: urls.cleanPhone,
          text,
          url: targetUrl,
          waMeUrl: urls.waMeUrl,
          webUrl: urls.webUrl,
          deepLinkUrl: urls.deepLinkUrl,
          timestamp: new Date().toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }),
        },
      })
    );
  }

  return {
    success: true,
    url: targetUrl,
    waMeUrl: urls.waMeUrl,
    webUrl: urls.webUrl,
    deepLinkUrl: urls.deepLinkUrl,
    cleanPhone: urls.cleanPhone,
  };
};
