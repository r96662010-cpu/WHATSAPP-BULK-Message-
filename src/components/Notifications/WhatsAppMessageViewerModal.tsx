import React, { useState } from 'react';
import {
  X,
  Phone,
  Video,
  MoreVertical,
  CheckCheck,
  Send,
  ExternalLink,
  Copy,
  Check,
  Smile,
  Paperclip,
  Mic,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Image as ImageIcon,
  FileText,
} from 'lucide-react';
import { playWhatsAppPop } from '../../utils/audioNotification';

export interface WhatsAppViewerData {
  recipientName: string;
  recipientPhone: string;
  recipientCompany?: string;
  recipientCourse?: string;
  messageBody: string;
  mediaType?: 'image' | 'video' | 'document' | 'none';
  mediaUrl?: string;
  mediaCaption?: string;
  actionButtons?: string[];
  sentTimestamp?: string;
  senderPhone?: string;
  isDelivered?: boolean;
}

interface WhatsAppMessageViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: WhatsAppViewerData | null;
}

export const WhatsAppMessageViewerModal: React.FC<WhatsAppMessageViewerModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const [copied, setCopied] = useState(false);
  const [replyInput, setReplyInput] = useState('');
  const [extraChatReplies, setExtraChatReplies] = useState<
    Array<{ text: string; time: string; isUser: boolean }>
  >([]);

  if (!isOpen || !data) return null;

  const cleanPhone = data.recipientPhone.replace(/[^0-9]/g, '');
  const timestamp = data.sentTimestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Interpolate message with recipient details
  const formattedMessage = data.messageBody
    .replace(/{{1}}/g, data.recipientName)
    .replace(/{{name}}/g, data.recipientName)
    .replace(/{{company}}/g, data.recipientCompany || 'Enterprise Leader')
    .replace(/{{course}}/g, data.recipientCourse || 'AI & Cloud Automation')
    .replace(/{{phone}}/g, data.recipientPhone)
    .replace(/{{discount}}/g, 'FLAT50')
    .replace(/{{date}}/g, 'Tomorrow at 7:00 PM')
    .replace(/{{link}}/g, 'https://wa.me/917869515615');

  const waWebUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(formattedMessage)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendQuickReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyInput.trim()) return;

    playWhatsAppPop();
    const newReply = {
      text: replyInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isUser: true,
    };
    setExtraChatReplies((prev) => [...prev, newReply]);
    setReplyInput('');

    // Simulate customer auto-reply
    setTimeout(() => {
      playWhatsAppPop();
      setExtraChatReplies((prev) => [
        ...prev,
        {
          text: `Thanks for reaching out! I received your WhatsApp broadcast. Can you share the syllabus details?`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isUser: false,
        },
      ]);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0b141a] border border-[#202c33] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#111b21] border-b border-[#202c33] text-xs text-slate-400">
          <div className="flex items-center gap-1.5 font-medium text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live WhatsApp Chat Viewer (Official Meta Preview)
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* WhatsApp Mobile Top Bar (#075E54 / #202c33 dark theme) */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#202c33] text-white">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center font-bold text-white shadow">
                {data.recipientName.charAt(0)}
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#202c33]" />
            </div>
            <div className="leading-tight">
              <div className="font-semibold text-sm flex items-center gap-1.5">
                <span>{data.recipientName}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                  Verified
                </span>
              </div>
              <div className="text-[11px] text-[#8696a0]">
                {data.recipientPhone} • <span className="text-emerald-400">online</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[#aebac1]">
            <button
              onClick={() => window.open(waWebUrl, '_blank')}
              title="Open WhatsApp Web"
              className="hover:text-emerald-400 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
            <Phone className="w-4 h-4 cursor-pointer hover:text-white" />
            <Video className="w-4 h-4 cursor-pointer hover:text-white" />
            <MoreVertical className="w-4 h-4 cursor-pointer hover:text-white" />
          </div>
        </div>

        {/* WhatsApp Doodle Wallpaper Chat Area */}
        <div
          className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0b141a] text-slate-100"
          style={{
            backgroundImage: `radial-gradient(#1f2c34 1px, transparent 1px)`,
            backgroundSize: '18px 18px',
          }}
        >
          {/* End-to-End Encryption Banner */}
          <div className="max-w-[85%] mx-auto p-2 rounded-lg bg-[#182229] border border-[#222e35] text-[11px] text-[#ffd279] text-center flex items-center justify-center gap-1.5 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-[#ffd279] shrink-0" />
            <span>Messages and calls are end-to-end encrypted. No one outside can read them.</span>
          </div>

          {/* Date separator */}
          <div className="flex justify-center my-2">
            <span className="px-3 py-1 rounded-md bg-[#182229] text-[11px] font-semibold text-[#8696a0] tracking-wider uppercase">
              Today
            </span>
          </div>

          {/* Outgoing Message Bubble (Right-aligned WhatsApp Sent Message) */}
          <div className="flex justify-end">
            <div className="max-w-[88%] rounded-2xl rounded-tr-sm bg-[#005c4b] p-3 text-white shadow-md space-y-2 border border-[#005c4b]/50">
              {/* Optional Media Header */}
              {data.mediaType && data.mediaType !== 'none' && (
                <div className="rounded-xl overflow-hidden bg-black/40 border border-white/10 mb-2 relative group">
                  {data.mediaType === 'image' && (
                    <img
                      src={
                        data.mediaUrl ||
                        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'
                      }
                      alt="WhatsApp Media"
                      className="w-full h-36 object-cover"
                    />
                  )}
                  {data.mediaType === 'video' && (
                    <div className="relative">
                      <video
                        src={
                          data.mediaUrl ||
                          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
                        }
                        className="w-full h-36 object-cover"
                        controls
                        muted
                      />
                    </div>
                  )}
                  {data.mediaType === 'document' && (
                    <div className="p-3 flex items-center gap-3 bg-slate-900/80">
                      <FileText className="w-8 h-8 text-rose-400 shrink-0" />
                      <div className="text-xs truncate">
                        <div className="font-bold truncate">AI_Syllabus_2026_Official.pdf</div>
                        <div className="text-[10px] text-slate-400">1.8 MB • PDF Document</div>
                      </div>
                    </div>
                  )}
                  {data.mediaCaption && (
                    <div className="px-2 py-1 text-[11px] bg-black/50 text-slate-200">
                      {data.mediaCaption}
                    </div>
                  )}
                </div>
              )}

              {/* Message Body with white text and whitespace preservation */}
              <div className="text-[13px] leading-relaxed whitespace-pre-wrap font-sans text-slate-100">
                {formattedMessage}
              </div>

              {/* Action Buttons (WhatsApp Quick Reply / CTA) */}
              {(data.actionButtons && data.actionButtons.length > 0) || (
                <div className="pt-2 border-t border-emerald-600/40 space-y-1.5">
                  {(data.actionButtons && data.actionButtons.length > 0
                    ? data.actionButtons
                    : ['Claim 40% Festive Offer 🎁', 'Confirm Admission Seat 🎓', 'Chat With Counselor 💬']
                  ).map((btn, bIdx) => (
                    <a
                      key={bIdx}
                      href={waWebUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 w-full py-1.5 px-3 rounded-lg bg-[#0c1317] hover:bg-[#1f2c34] text-emerald-400 hover:text-emerald-300 font-semibold text-xs border border-emerald-500/20 transition-colors shadow-sm"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>{btn}</span>
                      <ArrowRight className="w-3 h-3 ml-auto opacity-70" />
                    </a>
                  ))}
                </div>
              )}

              {/* Time & Double Blue Ticks */}
              <div className="flex items-center justify-end gap-1 text-[10px] text-emerald-200/80 pt-0.5">
                <span>{timestamp}</span>
                <CheckCheck className="w-4 h-4 text-[#53bdeb]" />
              </div>
            </div>
          </div>

          {/* User's Extra Chat Replies */}
          {extraChatReplies.map((reply, rIdx) => (
            <div
              key={rIdx}
              className={`flex ${reply.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-2.5 text-xs shadow-md ${
                  reply.isUser
                    ? 'rounded-tr-sm bg-[#005c4b] text-white'
                    : 'rounded-tl-sm bg-[#202c33] text-slate-200'
                }`}
              >
                <div>{reply.text}</div>
                <div
                  className={`flex items-center justify-end gap-1 text-[10px] mt-1 ${
                    reply.isUser ? 'text-emerald-200/80' : 'text-[#8696a0]'
                  }`}
                >
                  <span>{reply.time}</span>
                  {reply.isUser && <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* WhatsApp Mobile Chat Input Bar */}
        <form
          onSubmit={handleSendQuickReply}
          className="flex items-center gap-2 p-2.5 bg-[#202c33] border-t border-[#2a3942]"
        >
          <Smile className="w-5 h-5 text-[#8696a0] cursor-pointer hover:text-white shrink-0" />
          <Paperclip className="w-5 h-5 text-[#8696a0] cursor-pointer hover:text-white shrink-0" />

          <input
            type="text"
            value={replyInput}
            onChange={(e) => setReplyInput(e.target.value)}
            placeholder="Type a test WhatsApp message..."
            className="flex-1 bg-[#2a3942] text-sm text-white placeholder-[#8696a0] px-3.5 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />

          {replyInput.trim() ? (
            <button
              type="submit"
              className="p-2 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shrink-0 transition-transform active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          ) : (
            <Mic className="w-5 h-5 text-[#8696a0] cursor-pointer hover:text-white shrink-0" />
          )}
        </form>

        {/* Bottom Actions Bar (Open in Official WhatsApp Web, Copy, Close) */}
        <div className="p-3 bg-[#111b21] border-t border-[#202c33] flex items-center justify-between gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Message</span>
              </>
            )}
          </button>

          <a
            href={waWebUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Open in Official WhatsApp Web</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>
        </div>
      </div>
    </div>
  );
};
