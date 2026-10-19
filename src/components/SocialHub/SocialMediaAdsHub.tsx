import React, { useState, useEffect } from 'react';
import { SocialPost, SocialAdCampaign, SocialPlatform, AdNetwork, AdObjective } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useSecurity } from '../../context/SecurityContext';
import confetti from 'canvas-confetti';
import {
  Share2,
  Megaphone,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  Send,
  Plus,
  Play,
  Pause,
  TrendingUp,
  DollarSign,
  Users,
  Eye,
  MousePointer,
  CheckCircle2,
  Calendar,
  Clock,
  Sparkles,
  ExternalLink,
  Layers,
  Image as ImageIcon,
  Video as VideoIcon,
  Filter,
  BarChart3,
  Flame,
  ShieldCheck,
  FileSpreadsheet,
} from 'lucide-react';

const PRESET_POSTS: SocialPost[] = [
  {
    id: 'post-1',
    title: 'Master AI & Low-Code Workflow Automation Masterclass 2026',
    content: `🚀 Ready to 10x your engineering output? Shri Shyam Consulting announces our flagship 6-Week Masterclass in Generative AI, Prompt Engineering, and Autonomous Agents.\n\n✨ Pre-requisite: Zero advanced math. Practical hands-on builds only.\n🔥 Early-bird seats now open! Reply or message on WhatsApp to reserve.\n\n#AI #Automation #GenerativeAI #NoCode #TechCareers2026`,
    platforms: ['facebook', 'instagram', 'linkedin', 'twitter', 'whatsapp'],
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80',
    mediaName: 'Masterclass_Hero_Banner.png',
    status: 'published',
    publishedAt: '2 hours ago',
    metrics: { likes: 342, comments: 48, shares: 89, reach: 4120, clicks: 215 },
    authorName: 'Rashmi Sondhi',
    authorEmail: 'sondhirashmi5@gmail.com',
  },
  {
    id: 'post-2',
    title: 'Top 3 AI Automation Breakthroughs That Save 20 Hours a Week',
    content: `Stop wasting hours on manual spreadsheet entry and customer follow-ups! Here is how modern teams deploy 24/7 AI agents directly on WhatsApp to capture verified leads in real-time. ⚡ Watch the full breakdown below.\n\n#AIWorkflows #Productivity #Python #TechInnovation`,
    platforms: ['youtube', 'facebook', 'linkedin', 'tiktok'],
    mediaType: 'video',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    mediaName: 'Viral_AI_Breakthroughs_Reel.mp4',
    status: 'published',
    publishedAt: 'Yesterday',
    metrics: { likes: 890, comments: 124, shares: 312, reach: 14200, clicks: 680 },
    authorName: 'Rashmi Sondhi',
    authorEmail: 'sondhirashmi5@gmail.com',
  },
];

const PRESET_ADS: SocialAdCampaign[] = [
  {
    id: 'ad-meta-whatsapp-1',
    name: 'Meta Ads: Click-to-WhatsApp AI Masterclass Leads',
    network: 'meta',
    objective: 'click_to_whatsapp',
    status: 'active',
    dailyBudget: 2500, // ₹2,500/day
    currency: 'INR',
    targetLocations: ['Bengaluru', 'Delhi NCR', 'Mumbai', 'Hyderabad', 'Pune'],
    targetAgeRange: '21 - 42',
    targetInterests: ['Artificial Intelligence', 'Software Development', 'Data Science', 'Python', 'Digital Marketing'],
    headline: 'Chat on WhatsApp with AI Counselor (+91 78695 15615)',
    primaryText: 'Level up your engineering career with industry-recognized AI and Low-Code certifications. Limited 50 seats per batch. Tap below to chat directly with our advisor!',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1000&auto=format&fit=crop&q=80',
    callToAction: 'Send WhatsApp Message',
    destinationUrl: 'https://wa.me/917869515615?text=Hi%20Rashmi%2C%20I%20am%20interested%20in%20the%20AI%20Masterclass',
    leadsGenerated: 142,
    impressions: 48200,
    clicks: 1980,
    spend: 12500,
    cpl: 88, // ₹88 per lead
    roas: 4.8,
    createdAt: '2026-10-12',
    syncedWithAudience: 'AI_Masterclass_Admissions_1000.xlsx',
  },
  {
    id: 'ad-google-youtube-1',
    name: 'YouTube Video Ads: Corporate Tech Recruitment 2026',
    network: 'google_youtube',
    objective: 'lead_generation',
    status: 'active',
    dailyBudget: 4000,
    currency: 'INR',
    targetLocations: ['Pan India', 'Bangalore Tech Corridors', 'Cyber City Gurugram'],
    targetAgeRange: '28 - 55',
    targetInterests: ['Human Resources', 'Talent Acquisition', 'Recruitment', 'CTO Leadership'],
    headline: 'Hire Pre-Vetted Tech & AI Engineers in 72 Hours',
    primaryText: 'Shri Shyam Consulting provides specialized executive placement and engineering squads with zero placement fee until successful probation.',
    mediaType: 'video',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    callToAction: 'Apply Now',
    destinationUrl: 'https://shrishyam.edu/corporate-mandates',
    leadsGenerated: 38,
    impressions: 29400,
    clicks: 840,
    spend: 16000,
    cpl: 421,
    roas: 6.2,
    createdAt: '2026-10-14',
    syncedWithAudience: 'Corporate_Hiring_Decision_Makers.xlsx',
  },
];

const STORAGE_POSTS_KEY = 'flowpulse_social_posts_v1';
const STORAGE_ADS_KEY = 'flowpulse_social_ads_v1';

export const SocialMediaAdsHub: React.FC = () => {
  const { user, isAdmin, logAdminAction } = useAuth();
  const { settings, maskText } = useSecurity();

  const [activeTab, setActiveTab] = useState<'posts' | 'ads'>('posts');

  // Posts State
  const [posts, setPosts] = useState<SocialPost[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_POSTS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return PRESET_POSTS;
  });

  // Ads State
  const [ads, setAds] = useState<SocialAdCampaign[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_ADS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return PRESET_ADS;
  });

  // New Post Form State
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>([
    'facebook',
    'instagram',
    'linkedin',
    'twitter',
    'whatsapp',
  ]);
  const [postMediaType, setPostMediaType] = useState<'image' | 'video' | 'none'>('image');
  const [postMediaUrl, setPostMediaUrl] = useState(
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80'
  );
  const [isPosting, setIsPosting] = useState(false);
  const [publishSuccessMessage, setPublishSuccessMessage] = useState<string | null>(null);

  // New Ad Campaign Modal State
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [adName, setAdName] = useState('');
  const [adNetwork, setAdNetwork] = useState<AdNetwork>('meta');
  const [adObjective, setAdObjective] = useState<AdObjective>('click_to_whatsapp');
  const [adBudget, setAdBudget] = useState<number>(3000);
  const [adHeadline, setAdHeadline] = useState('Chat on WhatsApp with AI Advisor (+91 78695 15615)');
  const [adPrimaryText, setAdPrimaryText] = useState(
    'Connect directly on WhatsApp to access the 2026 AI Masterclass curriculum and scholarship voucher.'
  );
  const [adMediaType, setAdMediaType] = useState<'image' | 'video'>('image');
  const [adMediaUrl, setAdMediaUrl] = useState(
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1000&auto=format&fit=crop&q=80'
  );
  const [adCta, setAdCta] = useState<'Send WhatsApp Message' | 'Learn More' | 'Sign Up' | 'Apply Now' | 'Download'>(
    'Send WhatsApp Message'
  );

  // Persist
  useEffect(() => {
    localStorage.setItem(STORAGE_POSTS_KEY, JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_ADS_KEY, JSON.stringify(ads));
  }, [ads]);

  // Platform list
  const ALL_PLATFORMS: { id: SocialPlatform; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'facebook', label: 'Facebook Pages & Groups', icon: <Facebook className="w-4 h-4 text-blue-500" />, color: 'hover:border-blue-500/50' },
    { id: 'instagram', label: 'Instagram Feed & Reels', icon: <Instagram className="w-4 h-4 text-pink-500" />, color: 'hover:border-pink-500/50' },
    { id: 'linkedin', label: 'LinkedIn Company & Personal', icon: <Linkedin className="w-4 h-4 text-sky-500" />, color: 'hover:border-sky-500/50' },
    { id: 'twitter', label: 'X (Twitter)', icon: <Twitter className="w-4 h-4 text-slate-200" />, color: 'hover:border-slate-500/50' },
    { id: 'youtube', label: 'YouTube Shorts & Community', icon: <Youtube className="w-4 h-4 text-red-500" />, color: 'hover:border-red-500/50' },
    { id: 'whatsapp', label: 'WhatsApp Status & Channels', icon: <Send className="w-4 h-4 text-emerald-500" />, color: 'hover:border-emerald-500/50' },
  ];

  const togglePlatform = (p: SocialPlatform) => {
    if (selectedPlatforms.includes(p)) {
      if (selectedPlatforms.length > 1) {
        setSelectedPlatforms(selectedPlatforms.filter((item) => item !== p));
      }
    } else {
      setSelectedPlatforms([...selectedPlatforms, p]);
    }
  };

  const handleSelectAllPlatforms = () => {
    if (selectedPlatforms.length === ALL_PLATFORMS.length) {
      setSelectedPlatforms(['facebook']);
    } else {
      setSelectedPlatforms(ALL_PLATFORMS.map((p) => p.id));
    }
  };

  // Publish to all platforms
  const handlePublishAll = () => {
    if (!newPostContent.trim()) {
      alert('Please enter post content or copy.');
      return;
    }

    setIsPosting(true);
    setTimeout(() => {
      const newPost: SocialPost = {
        id: `post-${Date.now()}`,
        title: newPostTitle || newPostContent.slice(0, 40) + '...',
        content: newPostContent,
        platforms: selectedPlatforms,
        mediaType: postMediaType,
        mediaUrl: postMediaUrl,
        mediaName: postMediaType === 'video' ? 'Product_Video_Demo.mp4' : 'Social_Promo_Card.png',
        status: 'published',
        publishedAt: 'Just now',
        metrics: {
          likes: Math.floor(Math.random() * 25 + 5),
          comments: Math.floor(Math.random() * 8 + 1),
          shares: Math.floor(Math.random() * 12 + 2),
          reach: Math.floor(Math.random() * 450 + 100),
          clicks: Math.floor(Math.random() * 35 + 5),
        },
        authorName: user?.name || 'Rashmi Sondhi',
        authorEmail: user?.email || 'sondhirashmi5@gmail.com',
      };

      setPosts([newPost, ...posts]);
      setIsPosting(false);
      setNewPostTitle('');
      setNewPostContent('');
      confetti({ particleCount: 50, spread: 80, origin: { y: 0.6 } });
      setPublishSuccessMessage(`Successfully published simultaneously across ${selectedPlatforms.length} social platforms!`);
      logAdminAction(
        'SOCIAL_CROSS_POST',
        'Social Media Multi-Platform',
        `Shared post to ${selectedPlatforms.join(', ')} with ${postMediaType}`
      );

      setTimeout(() => setPublishSuccessMessage(null), 4000);
    }, 1200);
  };

  // Toggle Ad Status
  const handleToggleAdStatus = (adId: string) => {
    const updated = ads.map((ad) => {
      if (ad.id === adId) {
        const nextStatus = ad.status === 'active' ? 'paused' : 'active';
        logAdminAction('AD_STATUS_CHANGED', 'Social Ads Campaign', `Changed ad ${ad.name} status to ${nextStatus}`);
        return { ...ad, status: nextStatus as 'active' | 'paused' };
      }
      return ad;
    });
    setAds(updated);
  };

  // Create Ad Campaign
  const handleCreateAd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adName.trim()) {
      alert('Please enter a campaign name');
      return;
    }

    const newAd: SocialAdCampaign = {
      id: `ad-${adNetwork}-${Date.now()}`,
      name: adName,
      network: adNetwork,
      objective: adObjective,
      status: 'active',
      dailyBudget: Number(adBudget),
      currency: 'INR',
      targetLocations: ['Bengaluru', 'Delhi NCR', 'Mumbai', 'Pune', 'Hyderabad'],
      targetAgeRange: '22 - 45',
      targetInterests: ['Artificial Intelligence', 'Software Careers', 'Recruitment', 'Python'],
      headline: adHeadline,
      primaryText: adPrimaryText,
      mediaType: adMediaType,
      mediaUrl: adMediaUrl,
      callToAction: adCta,
      destinationUrl:
        adObjective === 'click_to_whatsapp'
          ? 'https://wa.me/917869515615?text=Hello%20Rashmi%2C%20saw%20your%20ad'
          : 'https://shrishyam.edu/register',
      leadsGenerated: 0,
      impressions: 120,
      clicks: 14,
      spend: 0,
      cpl: 0,
      roas: 1.0,
      createdAt: new Date().toISOString().split('T')[0],
      syncedWithAudience: 'Active Excel Leads Audience',
    };

    setAds([newAd, ...ads]);
    setIsAdModalOpen(false);
    confetti({ particleCount: 60, spread: 90, origin: { y: 0.5 } });
    logAdminAction(
      'AD_CAMPAIGN_LAUNCHED',
      'Social Ads Campaign',
      `Launched ${adNetwork} ad campaign "${adName}" with budget ₹${adBudget}/day`
    );
  };

  // Aggregated Ad Metrics
  const totalSpend = ads.reduce((acc, curr) => acc + curr.spend, 0);
  const totalLeads = ads.reduce((acc, curr) => acc + curr.leadsGenerated, 0);
  const totalImpressions = ads.reduce((acc, curr) => acc + curr.impressions, 0);
  const totalClicks = ads.reduce((acc, curr) => acc + curr.clicks, 0);
  const avgCpl = totalLeads > 0 ? Math.round(totalSpend / totalLeads) : 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-6 rounded-2xl backdrop-blur-md relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Share2 className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Social Media Cross-Sharer & Ads Platform
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Multi-Channel
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Simultaneously post custom copy, images, and videos across <span className="text-white font-semibold">Facebook</span>,{' '}
            <span className="text-white font-semibold">Instagram</span>, <span className="text-white font-semibold">LinkedIn</span>,{' '}
            <span className="text-white font-semibold">X (Twitter)</span>, and <span className="text-white font-semibold">YouTube</span>.
            Run targeted paid ads on Facebook & Google with direct <span className="text-emerald-400 font-semibold">Click-to-WhatsApp (+91 78695 15615)</span> lead capture.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-950 rounded-xl border border-slate-800 relative z-10">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === 'posts'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share to All Social Media</span>
          </button>
          <button
            onClick={() => setActiveTab('ads')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === 'ads'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>Run Social Media Ads</span>
          </button>
        </div>
      </div>

      {/* SUCCESS NOTIFICATION */}
      {publishSuccessMessage && (
        <div className="p-4 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-200 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-pulse">
          <CheckCircle2 className="w-5 h-5 text-blue-400" />
          <span>{publishSuccessMessage}</span>
        </div>
      )}

      {/* TAB 1: CROSS-PLATFORM SOCIAL POSTER */}
      {activeTab === 'posts' && (
        <div className="space-y-6">
          {/* Composer Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Universal Cross-Platform Composer
                </h3>
              </div>
              <button
                onClick={handleSelectAllPlatforms}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold transition"
              >
                {selectedPlatforms.length === ALL_PLATFORMS.length ? 'Deselect All' : 'Select All Social Media'}
              </button>
            </div>

            {/* Platform Selector Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {ALL_PLATFORMS.map((platform) => {
                const isSelected = selectedPlatforms.includes(platform.id);
                return (
                  <button
                    key={platform.id}
                    onClick={() => togglePlatform(platform.id)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-left text-xs font-medium transition ${
                      isSelected
                        ? 'bg-slate-800 border-blue-500 text-white shadow-xs'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div className="p-1 rounded bg-black/40">{platform.icon}</div>
                    <span className="truncate text-[11px] font-semibold">{platform.label.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>

            {/* Post Title & Content */}
            <div className="space-y-3">
              <input
                type="text"
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
                placeholder="Post Title or Internal Campaign Reference (e.g. AI Masterclass 2026 Batch Announcement)"
                className="w-full bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white rounded-xl p-3 focus:outline-none focus:border-blue-500 placeholder:text-slate-600 font-medium"
              />

              <div className="relative">
                <textarea
                  rows={4}
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Write your cross-platform social copy here... (Hashtags and emojis will format natively on Facebook, LinkedIn, X, and Instagram)"
                  className="w-full bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white rounded-xl p-3 focus:outline-none focus:border-blue-500 placeholder:text-slate-600 font-normal leading-relaxed"
                />
                <div className="flex items-center justify-between text-[11px] text-slate-500 px-1 pt-1">
                  <span>Characters: {newPostContent.length}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setNewPostContent(
                          (prev) =>
                            prev +
                            '\n\n#AI #Technology #GenerativeAI #NoCode #Workflows #WhatsAppMarketing'
                        )
                      }
                      className="text-blue-400 hover:underline"
                    >
                      + Add Viral Hashtags
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Media Attachment Selector (Image / Video) */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-300">Attach Media Creative:</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setPostMediaType('image')}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition ${
                        postMediaType === 'image'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Image</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPostMediaType('video')}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition ${
                        postMediaType === 'video'
                          ? 'bg-red-600 text-white'
                          : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      <VideoIcon className="w-3.5 h-3.5" />
                      <span>Video</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPostMediaType('none')}
                      className={`px-2 py-1 rounded text-xs font-semibold transition ${
                        postMediaType === 'none'
                          ? 'bg-slate-700 text-white'
                          : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      Text Only
                    </button>
                  </div>
                </div>
              </div>

              {postMediaType !== 'none' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                  <input
                    type="text"
                    value={postMediaUrl}
                    onChange={(e) => setPostMediaUrl(e.target.value)}
                    placeholder="Enter Image or Video Direct URL (e.g. https://...)"
                    className="w-full bg-slate-900 border border-slate-800 text-xs text-white rounded-lg p-2 focus:outline-none focus:border-blue-500 font-mono"
                  />

                  {postMediaType === 'image' && postMediaUrl && (
                    <div className="flex items-center gap-3">
                      <img
                        src={postMediaUrl}
                        alt="Preview"
                        className="w-12 h-12 rounded-lg object-cover border border-slate-700"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80';
                        }}
                      />
                      <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Creative Image Loaded
                      </span>
                    </div>
                  )}

                  {postMediaType === 'video' && postMediaUrl && (
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <VideoIcon className="w-4 h-4 text-red-400" />
                      <span className="text-[11px] text-emerald-400 font-semibold">
                        HD MP4 Video Ready for Cross-Stream
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Publish Action Button */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400">
                Will dispatch instantly to{' '}
                <span className="text-white font-bold">{selectedPlatforms.length} platforms</span> under{' '}
                <span className="text-blue-400 font-mono">{user?.email}</span>
              </span>

              <button
                onClick={handlePublishAll}
                disabled={isPosting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/20 transition active:scale-95 disabled:opacity-50"
              >
                {isPosting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Broadcasting to Social Networks...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Publish to All ({selectedPlatforms.length}) Platforms Now</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Published Posts Feed */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Cross-Platform Activity & Live Performance
              </h3>
              <span className="text-xs text-slate-400">{posts.length} Broadcasts Logged</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3.5 shadow-md hover:border-slate-700 transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {post.platforms.map((p) => {
                        const plat = ALL_PLATFORMS.find((item) => item.id === p);
                        return (
                          <span
                            key={p}
                            className="p-1 rounded bg-slate-950 border border-slate-800 text-[10px]"
                            title={plat?.label}
                          >
                            {plat?.icon}
                          </span>
                        );
                      })}
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">{post.publishedAt}</span>
                  </div>

                  <h4 className="text-sm font-bold text-white line-clamp-1">{post.title}</h4>
                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed whitespace-pre-line">
                    {post.content}
                  </p>

                  {post.mediaUrl && (
                    <div className="rounded-xl overflow-hidden border border-slate-800 max-h-40 bg-slate-950">
                      {post.mediaType === 'video' ? (
                        <video src={post.mediaUrl} controls className="w-full max-h-40 object-cover" />
                      ) : (
                        <img src={post.mediaUrl} alt={post.title} className="w-full max-h-40 object-cover" />
                      )}
                    </div>
                  )}

                  {/* Metrics Bar */}
                  <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-800/80 text-center">
                    <div className="p-1.5 rounded-lg bg-slate-950">
                      <div className="text-[10px] text-slate-400">Likes</div>
                      <div className="text-xs font-bold text-white">{post.metrics.likes}</div>
                    </div>
                    <div className="p-1.5 rounded-lg bg-slate-950">
                      <div className="text-[10px] text-slate-400">Comments</div>
                      <div className="text-xs font-bold text-white">{post.metrics.comments}</div>
                    </div>
                    <div className="p-1.5 rounded-lg bg-slate-950">
                      <div className="text-[10px] text-slate-400">Shares</div>
                      <div className="text-xs font-bold text-white">{post.metrics.shares}</div>
                    </div>
                    <div className="p-1.5 rounded-lg bg-slate-950">
                      <div className="text-[10px] text-slate-400">Reach</div>
                      <div className="text-xs font-bold text-emerald-400">{post.metrics.reach}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SOCIAL MEDIA ADS CAMPAIGN MANAGER */}
      {activeTab === 'ads' && (
        <div className="space-y-6">
          {/* Ad Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Ad Spend</span>
              <div className="text-lg font-black text-white">₹{totalSpend.toLocaleString()}</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-400">WhatsApp Leads Captured</span>
              <div className="text-lg font-black text-emerald-400">{totalLeads} leads</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Impressions</span>
              <div className="text-lg font-black text-white">{totalImpressions.toLocaleString()}</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Clicks</span>
              <div className="text-lg font-black text-white">{totalClicks.toLocaleString()}</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1 col-span-2 sm:col-span-1">
              <span className="text-[10px] uppercase font-bold text-purple-400">Avg Cost / Lead (CPL)</span>
              <div className="text-lg font-black text-purple-400">₹{avgCpl}</div>
            </div>
          </div>

          {/* Action Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white">Active Social Ad Campaigns</h3>
              <p className="text-xs text-slate-400">
                Running across Meta (Facebook & Instagram), YouTube, and LinkedIn with Click-to-WhatsApp routing
              </p>
            </div>

            <button
              onClick={() => setIsAdModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Launch New Ad Campaign</span>
            </button>
          </div>

          {/* Campaigns Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {ads.map((ad) => (
              <div
                key={ad.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl hover:border-slate-700 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-full ${
                        ad.network === 'meta'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {ad.network === 'meta' ? 'Meta (FB & IG)' : 'Google / YouTube'}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        ad.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {ad.status.toUpperCase()}
                    </span>
                  </div>

                  <button
                    onClick={() => handleToggleAdStatus(ad.id)}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-white font-medium px-2 py-1 rounded bg-slate-800"
                  >
                    {ad.status === 'active' ? (
                      <>
                        <Pause className="w-3.5 h-3.5 text-amber-400" />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Resume</span>
                      </>
                    )}
                  </button>
                </div>

                <div>
                  <h4 className="text-base font-bold text-white">{ad.name}</h4>
                  <p className="text-xs text-slate-400 mt-1">{ad.headline}</p>
                </div>

                {/* Ad Creative Snapshot */}
                <div className="flex gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                  <img
                    src={ad.mediaUrl}
                    alt={ad.headline}
                    className="w-20 h-20 rounded-lg object-cover border border-slate-800 flex-shrink-0"
                  />
                  <div className="flex-1 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                      CTA: {ad.callToAction}
                    </span>
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{ad.primaryText}</p>
                    <div className="text-[11px] text-slate-500 truncate font-mono">
                      Target: {ad.targetLocations.slice(0, 3).join(', ')} • {ad.targetAgeRange} yrs
                    </div>
                  </div>
                </div>

                {/* Performance Metrics Row */}
                <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-center">
                  <div className="p-2 rounded-xl bg-slate-950">
                    <span className="text-[10px] text-slate-500">Daily Budget</span>
                    <div className="text-xs font-bold text-white">₹{ad.dailyBudget}</div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950">
                    <span className="text-[10px] text-emerald-500">Leads (WhatsApp)</span>
                    <div className="text-xs font-black text-emerald-400">{ad.leadsGenerated}</div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950">
                    <span className="text-[10px] text-slate-500">CPL</span>
                    <div className="text-xs font-bold text-white">₹{ad.cpl || 88}</div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950">
                    <span className="text-[10px] text-purple-400">RoAS</span>
                    <div className="text-xs font-bold text-purple-400">{ad.roas}x</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREATE AD CAMPAIGN MODAL */}
      {isAdModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Launch Social Media Ad Campaign</h3>
              </div>
              <button
                onClick={() => setIsAdModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAd} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300">Campaign Name</label>
                <input
                  type="text"
                  required
                  value={adName}
                  onChange={(e) => setAdName(e.target.value)}
                  placeholder="e.g. Meta Click-to-WhatsApp AI Masterclass 2026"
                  className="w-full mt-1 bg-slate-950 border border-slate-800 text-xs text-white rounded-xl p-2.5 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300">Ad Network</label>
                  <select
                    value={adNetwork}
                    onChange={(e) => setAdNetwork(e.target.value as AdNetwork)}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 text-xs text-white rounded-xl p-2.5 focus:outline-none"
                  >
                    <option value="meta">Meta Ads (Facebook & Instagram)</option>
                    <option value="google_youtube">Google & YouTube Video Ads</option>
                    <option value="linkedin">LinkedIn Sponsored Leads</option>
                    <option value="twitter">X (Twitter) Promoted</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300">Campaign Objective</label>
                  <select
                    value={adObjective}
                    onChange={(e) => setAdObjective(e.target.value as AdObjective)}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 text-xs text-white rounded-xl p-2.5 focus:outline-none"
                  >
                    <option value="click_to_whatsapp">Direct Click-to-WhatsApp Chat</option>
                    <option value="lead_generation">Instant Lead Form</option>
                    <option value="traffic">Website / Course Traffic</option>
                    <option value="video_views">Viral Video Views</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300">Daily Budget (INR ₹)</label>
                  <input
                    type="number"
                    min={500}
                    step={100}
                    value={adBudget}
                    onChange={(e) => setAdBudget(Number(e.target.value))}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 text-xs text-white rounded-xl p-2.5 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300">Call-To-Action Button</label>
                  <select
                    value={adCta}
                    onChange={(e) => setAdCta(e.target.value as any)}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 text-xs text-white rounded-xl p-2.5 focus:outline-none"
                  >
                    <option value="Send WhatsApp Message">Send WhatsApp Message</option>
                    <option value="Learn More">Learn More</option>
                    <option value="Apply Now">Apply Now</option>
                    <option value="Sign Up">Sign Up</option>
                    <option value="Download">Download Brochure</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300">Ad Headline</label>
                <input
                  type="text"
                  required
                  value={adHeadline}
                  onChange={(e) => setAdHeadline(e.target.value)}
                  placeholder="e.g. Chat on WhatsApp with AI Advisor (+91 78695 15615)"
                  className="w-full mt-1 bg-slate-950 border border-slate-800 text-xs text-white rounded-xl p-2.5 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300">Primary Ad Text</label>
                <textarea
                  rows={2}
                  required
                  value={adPrimaryText}
                  onChange={(e) => setAdPrimaryText(e.target.value)}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 text-xs text-white rounded-xl p-2.5 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300">Creative Media URL (Image or Video)</label>
                <input
                  type="text"
                  value={adMediaUrl}
                  onChange={(e) => setAdMediaUrl(e.target.value)}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 text-xs text-white rounded-xl p-2.5 focus:outline-none font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAdModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition"
                >
                  Confirm & Launch Live Ad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
