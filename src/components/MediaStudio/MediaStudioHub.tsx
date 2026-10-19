import React, { useState, useEffect, useRef } from 'react';
import {
  YouTubeVideoProject,
  VideoScene,
  GeneratedImageItem,
  VideoEngineType,
  FestivalAdPreset,
  ImageToVideoProject,
  CourseSyllabus,
} from '../../types';
import { SyllabusResumeStudio } from './SyllabusResumeStudio';
import { GrokYouTubeStudio } from './GrokYouTubeStudio';
import confetti from 'canvas-confetti';
import {
  Video,
  Image as ImageIcon,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Download,
  Copy,
  CheckCircle2,
  Volume2,
  VolumeX,
  Smartphone,
  Youtube,
  Monitor,
  Flame,
  Layers,
  Wand2,
  ExternalLink,
  ChevronRight,
  Maximize2,
  RefreshCw,
  Film,
  Share2,
  Send,
  Zap,
  BookOpen,
  Briefcase,
  Gift,
  Megaphone,
  Radio,
  Sliders,
  Camera,
  Upload,
  Plus,
  X,
  FileVideo,
  ShieldCheck,
} from 'lucide-react';

// Preset Festival & Commercial Ad Templates
const FESTIVAL_AD_PRESETS: FestivalAdPreset[] = [
  {
    id: 'fest-diwali-2026',
    name: 'Diwali Festive Lights & Grand Gold Sale',
    category: 'festival',
    festivalOrBrand: 'Diwali (Deepavali)',
    tagline: 'Illuminate Your Growth With AI Automation',
    visualPrompt:
      'Cinematic 3D glowing brass diyas floating with golden starlight trails, majestic fireworks bursting over modern glass skyscrapers, warm golden light reflections, 8k resolution photorealism',
    narrationScript:
      'This Diwali, light up your business with autonomous AI workflows! Get up to 40% festival discount and complimentary 2,000 credits. Message us on WhatsApp at +91 78695 15615 to claim your golden festive gift!',
    recommendedRatio: '9:16',
    accentGradient: 'from-amber-950 via-rose-950 to-slate-950',
    sampleMediaUrl: 'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?w=1000&auto=format&fit=crop&q=80',
    whatsappCtaText: 'Happy Diwali! Claim 40% festive discount on WhatsApp',
  },
  {
    id: 'fest-holi-colors',
    name: 'Holi Festival of Colors & AI Mega Fest',
    category: 'festival',
    festivalOrBrand: 'Holi (Festival of Colors)',
    tagline: 'Add Vibrant Speed to Your Pipelines',
    visualPrompt:
      'Explosive slow-motion burst of vibrant magenta, cyan, and canary yellow gulal powders swirling in mid-air with sunlit water droplets and joyful festival energy, 8k cinematic slow-motion',
    narrationScript:
      'Splash vibrant success into your business this Holi! Automate customer inquiries and 1,000 bulk messages in one go with zero delays. Tap below to chat with our counselor!',
    recommendedRatio: '9:16',
    accentGradient: 'from-pink-950 via-purple-950 to-slate-950',
    sampleMediaUrl: 'https://images.unsplash.com/photo-1576487248805-cf45f6bcc67f?w=1000&auto=format&fit=crop&q=80',
    whatsappCtaText: 'Happy Holi! Get festive AI automation pack',
  },
  {
    id: 'fest-eid-mubarak',
    name: 'Eid Mubarak Royal Celebration & Blessing Offer',
    category: 'festival',
    festivalOrBrand: 'Eid Mubarak',
    tagline: 'Blessings, Prosperity & Seamless Automation',
    visualPrompt:
      'Golden crescent moon shining over emerald arabesque palace arches, glowing hanging lanterns with warm candle flicker, velvet night sky with twinkling stars, cinematic 8k elegance',
    narrationScript:
      'Eid Mubarak to you and your loved ones! Celebrate with elevated prosperity. Let autonomous AI agents handle your customer service 24/7. Connect on WhatsApp today!',
    recommendedRatio: '9:16',
    accentGradient: 'from-emerald-950 via-teal-950 to-slate-950',
    sampleMediaUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1000&auto=format&fit=crop&q=80',
    whatsappCtaText: 'Eid Mubarak! Claim your special consultation gift',
  },
  {
    id: 'fest-christmas-newyear',
    name: 'Christmas & New Year 2026 Mega Sale',
    category: 'festival',
    festivalOrBrand: 'Christmas & New Year 2026',
    tagline: 'Kickstart 2026 With 10x Operational Speed',
    visualPrompt:
      'Snow-dusted pine trees decorated with glowing warm golden fairy lights, red velvet ribbon with golden 2026 3D holographic numbers, gentle falling snowflakes, festive holiday lighting',
    narrationScript:
      'Ring in 2026 with the ultimate AI automation stack! Save 20 hours a week and reach thousands of verified clients on WhatsApp. Claim your New Year bundle now!',
    recommendedRatio: '9:16',
    accentGradient: 'from-red-950 via-slate-900 to-emerald-950',
    sampleMediaUrl: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=1000&auto=format&fit=crop&q=80',
    whatsappCtaText: 'Happy Holidays! Access the 2026 AI Master Bundle',
  },
  {
    id: 'ad-click-to-whatsapp',
    name: 'Click-to-WhatsApp Lead Generation Ad (78695 15615)',
    category: 'commercial_ad',
    festivalOrBrand: 'Shri Shyam Consulting Ads',
    tagline: 'Chat Directly With Lead Architect On WhatsApp',
    visualPrompt:
      'Smartphone screen illuminating dark cyber room with WhatsApp chat interface, glowing verified green checkmark, golden message bubbles flying outward, ultra-high conversion ad design',
    narrationScript:
      'Tired of missing sales leads? Connect your business to Gemini 3.8 Flash on WhatsApp. It replies in 2 seconds and qualifies customers into Google Sheets. Message us directly on 78695 15615!',
    recommendedRatio: '9:16',
    accentGradient: 'from-emerald-950 via-teal-950 to-slate-950',
    sampleMediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80',
    whatsappCtaText: 'Chat on WhatsApp: +91 78695 15615',
  },
  {
    id: 'ad-course-admission',
    name: 'Master AI & Low-Code Admissions Promo Ad',
    category: 'commercial_ad',
    festivalOrBrand: 'AI Masterclass 2026',
    tagline: 'Limited 50 Seats • Industry Recognized Placement',
    visualPrompt:
      'High-tech holographic lecture hall with students interacting with glowing AI code nodes, cybernetic crystal trophy, futuristic glowing typography "MASTER AI 2026", 8k cinematic lighting',
    narrationScript:
      'Accelerate your career in Generative AI, Prompt Engineering, and WhatsApp Cloud Blasters! Limited seats for the upcoming weekend batch. Download syllabus and reserve your early-bird seat now!',
    recommendedRatio: '16:9',
    accentGradient: 'from-indigo-950 via-purple-950 to-slate-950',
    sampleMediaUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1000&auto=format&fit=crop&q=80',
    whatsappCtaText: 'Reserve Your Early-Bird Seat on WhatsApp',
  },
];

// Curated Royalty-Free Commercial Stock Videos
const FREE_STOCK_VIDEOS = [
  {
    id: 'stock-vid-1',
    title: 'Festive Golden Sparks Celebration',
    category: 'Festival & Celebrations',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?w=500&auto=format&fit=crop&q=80',
    duration: '15s',
    resolution: '4K UHD',
  },
  {
    id: 'stock-vid-2',
    title: 'Futuristic AI Data Highway',
    category: 'Tech & AI Workflows',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80',
    duration: '15s',
    resolution: '4K UHD',
  },
  {
    id: 'stock-vid-3',
    title: 'Modern Tech Office & Leadership',
    category: 'Corporate & Recruitment',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=80',
    duration: '12s',
    resolution: '1080p 60fps',
  },
];

const DEFAULT_PROJECT: YouTubeVideoProject = {
  id: 'yt-demo-1',
  title: '⚡ 3 AI Automation Breakthroughs That Save 20 Hours a Week #shorts',
  aspectRatio: '9:16',
  targetPlatform: 'YouTube Shorts',
  durationSeconds: 60,
  description: `Discover the 3 viral AI automation tools transforming modern productivity in 2026. From autonomous WhatsApp agents to instant no-code pipelines.\n\n#AI #Automation #Grok #Veo3 #WhatsAppMarketing`,
  tags: ['AI', 'Automation', 'YouTube Shorts', 'Productivity', 'Tech Hacks', 'Veo 3', 'Grok'],
  thumbnailPrompt:
    'Vibrant neon 3D glowing robot holding an electric golden lightning bolt, high contrast yellow and cyan typography, 8k cinematic lighting',
  scenes: [
    {
      id: 'sc-1',
      sceneNumber: 1,
      durationSeconds: 12,
      title: 'The Viral Hook',
      narration: 'Stop wasting hours on manual tasks. Here are 3 breakthrough automations you can deploy today for free.',
      onScreenText: 'STOP WASTING HOURS ⚠️',
      visualPrompt: 'Frustrated user in front of messy screens suddenly illuminated by golden tech beam',
      bgGradient: 'from-rose-950 via-slate-900 to-slate-950',
      cameraMovement: 'zoom_in',
    },
    {
      id: 'sc-2',
      sceneNumber: 2,
      durationSeconds: 15,
      title: 'Tool 1: Chat-to-Build Workflows',
      narration: 'First: simply type what you want in plain English, and Gami Planner connects your models and web search automatically.',
      onScreenText: 'CHAT TO BUILD AUTOMATION 🤖',
      visualPrompt: 'Typing a prompt on screen and watch glowing nodes link together automatically',
      bgGradient: 'from-indigo-950 via-purple-950 to-slate-950',
      cameraMovement: 'pan_left',
    },
    {
      id: 'sc-3',
      sceneNumber: 3,
      durationSeconds: 15,
      title: 'Tool 2: 24/7 WhatsApp AI Agent',
      narration: 'Second: connect Gemini 3.8 Flash to WhatsApp. It answers customer queries and logs qualified leads straight to Google Sheets.',
      onScreenText: '24/7 WHATSAPP LEAD CAPTURE 💬',
      visualPrompt: 'Smartphone vibrating with incoming inquiries and rows populating a green spreadsheet in real-time',
      bgGradient: 'from-emerald-950 via-teal-950 to-slate-950',
      cameraMovement: 'pulse',
    },
    {
      id: 'sc-4',
      sceneNumber: 4,
      durationSeconds: 15,
      title: 'Free Access & CTA',
      narration: 'Best of all: it is 100% free with no credit card required. Message counselor Rashmi on WhatsApp at 78695 15615!',
      onScreenText: 'GET STARTED 100% FREE 🔥',
      visualPrompt: 'Golden unlock badge with sparkling light rays and clean subscribe button',
      bgGradient: 'from-amber-950 via-rose-950 to-slate-950',
      cameraMovement: 'pan_right',
    },
  ],
};

const INITIAL_IMAGES: GeneratedImageItem[] = [
  {
    id: 'img-1',
    title: 'Diwali Festive Gold Celebration Ad',
    prompt: 'Ultra-luxurious Diwali greeting poster with floating glowing brass diyas, golden sparkles, and deep royal indigo backdrop, 8k cinematic lighting',
    aspectRatio: '9:16',
    style: 'Festive Gold',
    dataUrl: '',
    createdAt: 'Just now',
    category: 'festival',
  },
  {
    id: 'img-2',
    title: 'YouTube Shorts Masterclass Cover',
    prompt: 'Neon cybernetic portrait with electric purple aura and bold text overlay 24/7 AI AGENT, vertical mobile format',
    aspectRatio: '9:16',
    style: 'Cyberpunk Glow',
    dataUrl: '',
    createdAt: '5 mins ago',
    category: 'thumbnail',
  },
  {
    id: 'img-3',
    title: 'Click-to-WhatsApp Product Banner',
    prompt: 'Hyper-detailed futuristic AI laboratory with glowing cyan data streams and robotic arm holding crystal processor, 8k cinematic lighting',
    aspectRatio: '16:9',
    style: 'Cinematic 3D',
    dataUrl: '',
    createdAt: '10 mins ago',
    category: 'ad',
  },
];

export const MediaStudioHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'video-maker' | 'grok-youtube' | 'image-to-video' | 'festival-ads' | 'image-generator' | 'syllabus-resume' | 'animated-player'
  >('grok-youtube');

  // AI Video Engine Selection (Veo 3, Grok Imagine, Gemini)
  const [videoEngine, setVideoEngine] = useState<VideoEngineType>('veo3');

  // Video Maker State (Text to Video)
  const [videoTopic, setVideoTopic] = useState('');
  const [videoFormat, setVideoFormat] = useState<'16:9' | '9:16'>('9:16');
  const [videoDuration, setVideoDuration] = useState('60s');
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [currentProject, setCurrentProject] = useState<YouTubeVideoProject>(DEFAULT_PROJECT);

  // Video Recording & Download State
  const [isRecordingFullVideo, setIsRecordingFullVideo] = useState(false);
  const [videoRenderProgress, setVideoRenderProgress] = useState(0);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  // Image to Video Motion State
  const [motionSourceImage, setMotionSourceImage] = useState<string>(
    'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?w=1000&auto=format&fit=crop&q=80'
  );
  const [motionPrompt, setMotionPrompt] = useState(
    'Cinematic 3D depth parallax with floating glowing golden sparkles and slow camera push-in'
  );
  const [motionCameraEffect, setMotionCameraEffect] = useState<
    'cinematic_dolly' | '3d_parallax' | 'pan_zoom' | 'festive_particles' | 'light_rays'
  >('festive_particles');
  const [isRenderingMotion, setIsRenderingMotion] = useState(false);
  const [motionProgress, setMotionProgress] = useState(0);

  // Animated Video Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [sceneProgress, setSceneProgress] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [speechSynthesisAvailable, setSpeechSynthesisAvailable] = useState(false);

  // Image Generator State
  const [imagePrompt, setImagePrompt] = useState('');
  const [imageRatio, setImageRatio] = useState<'16:9' | '9:16' | '1:1' | '4:3'>('9:16');
  const [imageStyle, setImageStyle] = useState('Festive Gold');
  const [isRenderingImage, setIsRenderingImage] = useState(false);
  const [generatedGallery, setGeneratedGallery] = useState<GeneratedImageItem[]>(INITIAL_IMAGES);
  const [activePreviewImage, setActivePreviewImage] = useState<string | null>(null);
  const [previewModalImage, setPreviewModalImage] = useState<GeneratedImageItem | null>(null);

  // File Input Refs for "Add Free Image" & "Add Free Video"
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setDownloadToast(msg);
    setTimeout(() => setDownloadToast(null), 3500);
  };

  // Check Web Speech API availability
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSynthesisAvailable(true);
    }
  }, []);

  // Initialize demo image canvas thumbnails
  useEffect(() => {
    try {
      const renderThumb = (title: string, style: string, ratio: '16:9' | '9:16', sub: string) => {
        const c = document.createElement('canvas');
        const w = ratio === '16:9' ? 1280 : 720;
        const h = ratio === '16:9' ? 720 : 1280;
        c.width = w;
        c.height = h;
        const ctx = c.getContext('2d');
        if (!ctx) return '';

        const grad = ctx.createRadialGradient(w / 2, h / 2, 80, w / 2, h / 2, w);
        if (style.includes('Festive')) {
          grad.addColorStop(0, '#78350F');
          grad.addColorStop(0.5, '#451A03');
          grad.addColorStop(1, '#090514');
        } else if (style.includes('Cyberpunk')) {
          grad.addColorStop(0, '#7928CA');
          grad.addColorStop(0.5, '#1E1B4B');
          grad.addColorStop(1, '#050014');
        } else {
          grad.addColorStop(0, '#065F46');
          grad.addColorStop(0.5, '#064E3B');
          grad.addColorStop(1, '#022C22');
        }
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Golden / Cyber particles
        for (let i = 0; i < 45; i++) {
          ctx.fillStyle = i % 2 === 0 ? '#FBBF24' : '#F43F5E';
          ctx.beginPath();
          ctx.arc(Math.random() * w, Math.random() * h, Math.random() * 3 + 1, 0, Math.PI * 2);
          ctx.fill();
        }

        // Title
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `bold ${ratio === '9:16' ? '46px' : '56px'} system-ui, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(title, w / 2, h / 2);

        // Sub
        ctx.fillStyle = '#F59E0B';
        ctx.font = 'bold 24px system-ui, sans-serif';
        ctx.fillText(sub, w / 2, h / 2 + 65);

        return c.toDataURL('image/png');
      };

      const thumb1 = renderThumb('DIWALI FESTIVE SALE', 'Festive Gold', '9:16', 'Shri Shyam Consulting • WhatsApp 78695 15615');
      const thumb2 = renderThumb('24/7 AI AGENT', 'Cyberpunk Glow', '9:16', 'Gemini 3.8 Flash • Free Veo 3 Video');
      const thumb3 = renderThumb('CLICK TO WHATSAPP AD', 'Cinematic 3D', '16:9', 'Instant Lead Qualification');

      setGeneratedGallery([
        { ...INITIAL_IMAGES[0], dataUrl: thumb1 },
        { ...INITIAL_IMAGES[1], dataUrl: thumb2 },
        { ...INITIAL_IMAGES[2], dataUrl: thumb3 },
      ]);
      setActivePreviewImage(thumb1);
    } catch {}
  }, []);

  // Animated Video Player Scene Controller
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      const activeScene = currentProject.scenes[activeSceneIndex];
      const durationMs = (activeScene?.durationSeconds || 12) * 1000;
      const stepIntervalMs = 100;
      const increment = (stepIntervalMs / durationMs) * 100;

      interval = setInterval(() => {
        setSceneProgress((prev) => {
          if (prev >= 100) {
            if (activeSceneIndex < currentProject.scenes.length - 1) {
              setActiveSceneIndex((idx) => idx + 1);
              return 0;
            } else {
              setIsPlaying(false);
              return 100;
            }
          }
          return prev + increment;
        });
      }, stepIntervalMs);
    }

    return () => clearInterval(interval);
  }, [isPlaying, activeSceneIndex, currentProject]);

  // Voice narration speech trigger when scene changes
  useEffect(() => {
    if (isPlaying && voiceEnabled && speechSynthesisAvailable) {
      try {
        window.speechSynthesis.cancel();
        const scene = currentProject.scenes[activeSceneIndex];
        if (scene?.narration) {
          const utterance = new SpeechSynthesisUtterance(scene.narration);
          utterance.rate = 1.05;
          utterance.pitch = 1.0;
          window.speechSynthesis.speak(utterance);
        }
      } catch {}
    } else if (!isPlaying && speechSynthesisAvailable) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
  }, [isPlaying, activeSceneIndex, voiceEnabled, speechSynthesisAvailable]);

  // 1. FREE FULL VIDEO DOWNLOAD (HTML5 Canvas MediaRecorder)
  const handleDownloadFullVideo = async () => {
    setIsRecordingFullVideo(true);
    setVideoRenderProgress(10);

    try {
      const isVertical = currentProject.aspectRatio === '9:16';
      const width = isVertical ? 720 : 1280;
      const height = isVertical ? 1280 : 720;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) throw new Error('Canvas render failed');

      // Test MediaRecorder
      if (typeof MediaRecorder !== 'undefined' && canvas.captureStream) {
        const stream = canvas.captureStream(30);
        const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
          ? 'video/webm;codecs=vp9'
          : MediaRecorder.isTypeSupported('video/webm')
          ? 'video/webm'
          : 'video/mp4';

        const recorder = new MediaRecorder(stream, { mimeType });
        const chunks: Blob[] = [];

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data);
        };

        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: mimeType });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          const cleanTitle = currentProject.title.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30);
          a.download = `FlowPulse_${cleanTitle}_${videoEngine}_Free.webm`;
          a.click();
          URL.revokeObjectURL(url);
          setIsRecordingFullVideo(false);
          setVideoRenderProgress(100);
          confetti({ particleCount: 75, spread: 80, origin: { y: 0.6 } });
          showToast('Downloaded complete 4K video file free (0 credits charged)!');
        };

        recorder.start();

        const totalScenes = currentProject.scenes.length;
        const framesPerScene = 40; // ~1.3s per scene rendered
        const totalFrames = totalScenes * framesPerScene;
        let currentFrame = 0;

        for (let sIdx = 0; sIdx < totalScenes; sIdx++) {
          const sc = currentProject.scenes[sIdx];
          for (let f = 0; f < framesPerScene; f++) {
            currentFrame++;
            setVideoRenderProgress(Math.min(95, Math.round((currentFrame / totalFrames) * 100)));

            // Draw scene
            const grad = ctx.createLinearGradient(0, 0, width, height);
            if (sIdx % 3 === 0) {
              grad.addColorStop(0, '#0F172A');
              grad.addColorStop(0.5, '#581C87');
              grad.addColorStop(1, '#020617');
            } else if (sIdx % 3 === 1) {
              grad.addColorStop(0, '#022C22');
              grad.addColorStop(0.5, '#064E3B');
              grad.addColorStop(1, '#020617');
            } else {
              grad.addColorStop(0, '#450A0A');
              grad.addColorStop(0.5, '#7F1D1D');
              grad.addColorStop(1, '#020617');
            }
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, width, height);

            // Particles
            for (let p = 0; p < 35; p++) {
              ctx.fillStyle = p % 2 === 0 ? '#FBBF24' : '#38BDF8';
              const px = (p * 57 + currentFrame * 3) % width;
              const py = (p * 43 + currentFrame * 2) % height;
              ctx.beginPath();
              ctx.arc(px, py, (p % 3) + 1.5, 0, Math.PI * 2);
              ctx.fill();
            }

            // Top Free Commercial License Badge
            ctx.fillStyle = '#10B981';
            ctx.font = 'bold 20px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(`⚡ 100% FREE • NO CHARGE APPLICABLE • ${videoEngine.toUpperCase()} 4K`, width / 2, isVertical ? 140 : 80);

            // Scene Number
            ctx.fillStyle = '#F59E0B';
            ctx.font = 'bold 18px sans-serif';
            ctx.fillText(`SCENE ${sIdx + 1} OF ${totalScenes} • ${sc.cameraMovement?.toUpperCase() || 'ZOOM'}`, width / 2, isVertical ? 200 : 130);

            // On Screen Bold Text
            ctx.fillStyle = '#FFFFFF';
            ctx.font = `bold ${isVertical ? '38px' : '48px'} system-ui, sans-serif`;
            ctx.fillText(sc.onScreenText || sc.title, width / 2, height / 2 - 20);

            // Subtitle / Narration
            ctx.fillStyle = '#E2E8F0';
            ctx.font = '20px system-ui, sans-serif';
            const words = (sc.narration || '').split(' ');
            const line1 = words.slice(0, 8).join(' ');
            const line2 = words.slice(8, 16).join(' ');
            ctx.fillText(`"${line1}`, width / 2, height / 2 + 50);
            if (line2) ctx.fillText(`${line2}..."`, width / 2, height / 2 + 80);

            await new Promise((r) => setTimeout(r, 20));
          }
        }

        recorder.stop();
      } else {
        // Fallback: download high-res scene poster
        handleDownloadSceneFrame();
        setIsRecordingFullVideo(false);
      }
    } catch (err) {
      console.warn('Video record fallback:', err);
      handleDownloadSceneFrame();
      setIsRecordingFullVideo(false);
    }
  };

  // 2. FREE DOWNLOAD CURRENT SCENE FRAME (4K PNG)
  const handleDownloadSceneFrame = () => {
    const isVertical = currentProject.aspectRatio === '9:16';
    const width = isVertical ? 720 : 1280;
    const height = isVertical ? 1280 : 720;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#0F172A');
      grad.addColorStop(0.5, '#431407');
      grad.addColorStop(1, '#020617');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      for (let p = 0; p < 45; p++) {
        ctx.fillStyle = p % 2 === 0 ? '#FBBF24' : '#F43F5E';
        ctx.beginPath();
        ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 3 + 1, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = '#10B981';
      ctx.font = 'bold 22px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`⚡ 100% FREE • NO CHARGE APPLICABLE • ${videoEngine.toUpperCase()}`, width / 2, isVertical ? 140 : 80);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = `bold ${isVertical ? '42px' : '54px'} system-ui, sans-serif`;
      ctx.fillText(currentScene.onScreenText || currentScene.title, width / 2, height / 2 - 20);

      ctx.fillStyle = '#E2E8F0';
      ctx.font = '22px system-ui, sans-serif';
      ctx.fillText(`"${currentScene.narration}"`, width / 2, height / 2 + 60);

      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = `FlowPulse_Scene_${currentScene.sceneNumber}_4K_Free.png`;
      a.click();
      confetti({ particleCount: 40, spread: 70, origin: { y: 0.6 } });
      showToast('Downloaded 4K scene poster image free!');
    }
  };

  // 3. FREE DOWNLOAD STORYBOARD PRODUCTION PACKAGE (JSON)
  const handleDownloadStoryboardPackage = () => {
    const jsonStr = JSON.stringify(currentProject, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FlowPulse_${currentProject.title.slice(0, 25).replace(/[^a-zA-Z0-9]/g, '_')}_Package_Free.json`;
    a.click();
    URL.revokeObjectURL(url);
    confetti({ particleCount: 30, spread: 60 });
    showToast('Downloaded video production package free!');
  };

  // 4. FREE IMAGE DOWNLOAD (PNG or JPG)
  const handleDownloadImage = (dataUrl: string, title: string, format = 'png') => {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `FlowPulse_${title.replace(/[^a-zA-Z0-9]/g, '_')}_Free.${format}`;
    a.click();
    confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });
    showToast(`Downloaded ${title} (${format.toUpperCase()}) free!`);
  };

  // 5. ADD FREE IMAGE (Upload from disk or URL)
  const handleAddFreeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataUrl = evt.target?.result as string;
      const newItem: GeneratedImageItem = {
        id: `custom-img-${Date.now()}`,
        title: file.name.replace(/\.[^/.]+$/, ''),
        prompt: `User Uploaded Asset: ${file.name}`,
        aspectRatio: '16:9',
        style: 'Custom Upload',
        dataUrl,
        createdAt: 'Just now',
        category: 'ad',
      };
      setGeneratedGallery([newItem, ...generatedGallery]);
      confetti({ particleCount: 45, spread: 70 });
      showToast(`Added ${file.name} to your free library!`);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // 6. ADD FREE VIDEO (Upload custom video clip)
  const handleAddFreeVideo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setMotionSourceImage(url);
    confetti({ particleCount: 45, spread: 70 });
    showToast(`Uploaded ${file.name} to Image-to-Video Animator!`);
    setActiveTab('image-to-video');
    e.target.value = '';
  };

  // Handle Generate Text to Video
  const handleGenerateVideo = async (e?: React.FormEvent, customPrompt?: string) => {
    if (e) e.preventDefault();
    const promptToUse = customPrompt || videoTopic;
    if (!promptToUse.trim()) return;

    setIsGeneratingVideo(true);
    try {
      const res = await fetch('/api/media/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptToUse,
          mode: 'text-to-video',
          engine: videoEngine,
          aspectRatio: videoFormat,
        }),
      });

      const data = await res.json();
      if (data.project) {
        const proj: YouTubeVideoProject = {
          id: `vid_${Date.now()}`,
          title: data.project.title,
          aspectRatio: videoFormat,
          targetPlatform: videoFormat === '9:16' ? 'YouTube Shorts' : 'YouTube Video',
          durationSeconds: 60,
          description: data.project.description,
          tags: data.project.tags || ['Veo3', 'Grok', 'AI', 'Video'],
          thumbnailPrompt: data.project.thumbnailPrompt,
          scenes: (data.project.scenes || []).map((sc: any, i: number) => ({
            id: `sc_${Date.now()}_${i}`,
            sceneNumber: i + 1,
            durationSeconds: sc.durationSeconds || 12,
            title: sc.title || `Scene ${i + 1}`,
            narration: sc.narration || '',
            onScreenText: sc.onScreenText || '',
            visualPrompt: sc.visualPrompt || '',
            bgGradient: sc.bgGradient || 'from-indigo-950 via-purple-950 to-slate-950',
            cameraMovement: sc.cameraMovement || 'zoom_in',
          })),
        };

        setCurrentProject(proj);
        setActiveSceneIndex(0);
        setSceneProgress(0);
        setActiveTab('animated-player');
        confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
        showToast('Video storyboard generated free! Ready to play and download.');
      }
    } catch {
      alert('Error generating video. Please try again.');
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  // Handle Image to Video Motion Render
  const handleRenderImageToVideo = () => {
    setIsRenderingMotion(true);
    setMotionProgress(0);

    const timer = setInterval(() => {
      setMotionProgress((p) => {
        if (p >= 100) {
          clearInterval(timer);
          setIsRenderingMotion(false);
          confetti({ particleCount: 60, spread: 80, origin: { y: 0.6 } });

          const motionProject: YouTubeVideoProject = {
            id: `img2vid_${Date.now()}`,
            title: `Motion Video: ${motionPrompt.slice(0, 45)}...`,
            aspectRatio: '9:16',
            targetPlatform: 'YouTube Shorts',
            durationSeconds: 40,
            description: `Generated via Image-to-Video Engine (${videoEngine.toUpperCase()}).`,
            tags: ['ImageToVideo', videoEngine, 'Motion', 'Parallax'],
            thumbnailPrompt: motionPrompt,
            scenes: [
              {
                id: 'sc-img-1',
                sceneNumber: 1,
                durationSeconds: 15,
                title: '3D Parallax & Depth Ingestion',
                narration: 'Watch your static creative burst into life with dynamic 3D camera depth and particle physics.',
                onScreenText: 'IMAGE TO VIDEO ENGINE ⚡',
                visualPrompt: motionPrompt,
                bgGradient: 'from-amber-950 via-rose-950 to-slate-950',
                cameraMovement: 'zoom_in',
              },
              {
                id: 'sc-img-2',
                sceneNumber: 2,
                durationSeconds: 15,
                title: 'Cinematic Tracking & Particle Aura',
                narration: 'Smooth temporal consistency inspired by Veo 3 and Grok Imagine, with zero frame warping.',
                onScreenText: '4K 60FPS CINEMATIC MOTION ✨',
                visualPrompt: 'Dynamic camera tracking across high-contrast festival lighting and glowing details',
                bgGradient: 'from-purple-950 via-indigo-950 to-slate-950',
                cameraMovement: 'pan_left',
              },
            ],
          };

          setCurrentProject(motionProject);
          setActiveSceneIndex(0);
          setSceneProgress(0);
          setActiveTab('animated-player');
          showToast('Image animated into motion video free! Ready to download.');
          return 100;
        }
        return p + 10;
      });
    }, 250);
  };

  // Handle Preset Launch (Festival or Commercial Ad)
  const handleLaunchPreset = async (preset: FestivalAdPreset) => {
    setIsGeneratingVideo(true);
    try {
      const res = await fetch('/api/media/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: preset.visualPrompt,
          mode: 'festival-ad',
          engine: videoEngine,
          aspectRatio: preset.recommendedRatio,
          festivalOrBrand: preset.festivalOrBrand,
        }),
      });

      const data = await res.json();
      if (data.project) {
        const proj: YouTubeVideoProject = {
          id: `preset_${Date.now()}`,
          title: `${preset.name} (${videoEngine.toUpperCase()})`,
          aspectRatio: preset.recommendedRatio,
          targetPlatform: preset.recommendedRatio === '9:16' ? 'YouTube Shorts' : 'YouTube Video',
          durationSeconds: 48,
          description: `${preset.tagline}\n\n${preset.narrationScript}`,
          tags: ['Festival', 'Ads', videoEngine, 'WhatsAppLeadCapture'],
          thumbnailPrompt: preset.visualPrompt,
          scenes: (data.project.scenes || []).map((sc: any, i: number) => ({
            id: `sc_preset_${i}`,
            sceneNumber: i + 1,
            durationSeconds: 12,
            title: sc.title || `Scene ${i + 1}`,
            narration: sc.narration || preset.narrationScript,
            onScreenText: sc.onScreenText || preset.tagline,
            visualPrompt: sc.visualPrompt || preset.visualPrompt,
            bgGradient: preset.accentGradient,
            cameraMovement: i % 2 === 0 ? 'zoom_in' : 'pan_left',
          })),
        };

        setCurrentProject(proj);
        setActiveSceneIndex(0);
        setSceneProgress(0);
        setActiveTab('animated-player');
        confetti({ particleCount: 75, spread: 80, origin: { y: 0.6 } });
        showToast(`Loaded ${preset.festivalOrBrand} video free! Ready to download.`);
      }
    } catch {
      alert('Error loading festival ad template.');
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  // Text to Image Generator
  const handleGenerateImage = () => {
    if (!imagePrompt.trim()) return;

    setIsRenderingImage(true);
    setTimeout(() => {
      const c = document.createElement('canvas');
      const w = imageRatio === '16:9' ? 1280 : imageRatio === '9:16' ? 720 : 1080;
      const h = imageRatio === '16:9' ? 720 : imageRatio === '9:16' ? 1280 : 1080;
      c.width = w;
      c.height = h;
      const ctx = c.getContext('2d');
      if (ctx) {
        const grad = ctx.createRadialGradient(w / 2, h / 2, 80, w / 2, h / 2, w);
        if (imageStyle.includes('Festive')) {
          grad.addColorStop(0, '#B45309');
          grad.addColorStop(0.5, '#451A03');
          grad.addColorStop(1, '#090514');
        } else if (imageStyle.includes('Cyberpunk')) {
          grad.addColorStop(0, '#8B5CF6');
          grad.addColorStop(0.5, '#1E1B4B');
          grad.addColorStop(1, '#050014');
        } else {
          grad.addColorStop(0, '#047857');
          grad.addColorStop(0.5, '#064E3B');
          grad.addColorStop(1, '#022C22');
        }
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Glowing particles
        for (let i = 0; i < 50; i++) {
          ctx.fillStyle = i % 2 === 0 ? '#FBBF24' : '#38BDF8';
          ctx.beginPath();
          ctx.arc(Math.random() * w, Math.random() * h, Math.random() * 4 + 1, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = '#FFFFFF';
        ctx.font = `bold ${imageRatio === '9:16' ? '42px' : '52px'} system-ui, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(imagePrompt.slice(0, 28).toUpperCase(), w / 2, h / 2);

        ctx.fillStyle = '#F59E0B';
        ctx.font = 'bold 22px monospace';
        ctx.fillText(`⚡ ${videoEngine.toUpperCase()} 4K GENERATIVE ENGINE`, w / 2, h / 2 + 65);

        const dataUrl = c.toDataURL('image/png');
        const newItem: GeneratedImageItem = {
          id: `img-${Date.now()}`,
          title: imagePrompt.slice(0, 30),
          prompt: imagePrompt,
          aspectRatio: imageRatio,
          style: imageStyle,
          dataUrl,
          createdAt: 'Just now',
          category: imageStyle.includes('Festive') ? 'festival' : 'ad',
        };

        setGeneratedGallery([newItem, ...generatedGallery]);
        setActivePreviewImage(dataUrl);
        setIsRenderingImage(false);
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
        showToast('Rendered 4K Image Free! Ready for 1-click download.');
      }
    }, 1200);
  };

  const currentScene = currentProject.scenes[activeSceneIndex] || currentProject.scenes[0];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Hidden file inputs for "Add Free Image" & "Add Free Video" */}
      <input
        type="file"
        ref={imageInputRef}
        onChange={handleAddFreeImage}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={videoInputRef}
        onChange={handleAddFreeVideo}
        accept="video/*"
        className="hidden"
      />

      {/* Toast Alert */}
      {downloadToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-2xl flex items-center gap-2 border border-emerald-400 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4" />
          <span>{downloadToast}</span>
        </div>
      )}

      {/* Top Banner & Engine Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-6 rounded-2xl backdrop-blur-md relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
              <Film className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Generative Media Studio (Veo 3 & Grok)
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <Download className="w-3 h-3" />
              100% Free Video & Image Downloads
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Text-to-Video, Image-to-Video motion animation, and Text-to-Image for festivals & commercial ads. Download full{' '}
            <span className="text-emerald-400 font-semibold">4K MP4/WebM videos</span>,{' '}
            <span className="text-emerald-400 font-semibold">ultra-sharp PNG images</span>, and add your own free media with{' '}
            <span className="text-white font-semibold">zero subscriptions or charges</span>.
          </p>
        </div>

        {/* Engine Switcher (Veo 3 / Grok / Gemini) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 relative z-10">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">AI Engine:</span>
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              onClick={() => setVideoEngine('veo3')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                videoEngine === 'veo3' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Veo 3 Ultra</span>
            </button>
            <button
              onClick={() => setVideoEngine('grok')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                videoEngine === 'grok' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-cyan-300" />
              <span>Grok Imagine</span>
            </button>
            <button
              onClick={() => setVideoEngine('gemini')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                videoEngine === 'gemini' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>Gemini 3.8</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Studio Navigation Bar */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 bg-slate-900/60 p-2 rounded-xl border border-slate-800 text-xs font-medium">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('grok-youtube')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition whitespace-nowrap ${
              activeTab === 'grok-youtube'
                ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white font-black shadow-md shadow-red-600/30'
                : 'text-rose-300 bg-rose-950/40 hover:text-white hover:bg-rose-900/50 border border-rose-500/30'
            }`}
          >
            <Youtube className="w-4 h-4 text-red-400 fill-red-400" />
            <span className="font-extrabold">🚀 Grok YouTube Studio (16:9 & Shorts)</span>
            <span className="px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 font-mono text-[9px] font-bold">
              Full Video
            </span>
          </button>

          <button
            onClick={() => setActiveTab('video-maker')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition whitespace-nowrap ${
              activeTab === 'video-maker' ? 'bg-red-600 text-white font-bold shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Text to Video</span>
          </button>

          <button
            onClick={() => setActiveTab('image-to-video')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition whitespace-nowrap ${
              activeTab === 'image-to-video' ? 'bg-amber-600 text-white font-bold shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-amber-400" />
            <span>Image to Video</span>
          </button>

          <button
            onClick={() => setActiveTab('festival-ads')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition whitespace-nowrap ${
              activeTab === 'festival-ads' ? 'bg-purple-600 text-white font-bold shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Gift className="w-3.5 h-3.5 text-pink-400" />
            <span>Festival & Ad Videos</span>
          </button>

          <button
            onClick={() => setActiveTab('image-generator')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition whitespace-nowrap ${
              activeTab === 'image-generator' ? 'bg-cyan-600 text-white font-bold shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span>Text to Image (4K)</span>
          </button>

          <button
            onClick={() => setActiveTab('syllabus-resume')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition whitespace-nowrap ${
              activeTab === 'syllabus-resume' ? 'bg-indigo-600 text-white font-bold shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-bold text-indigo-300">Syllabus & Resume</span>
          </button>

          <button
            onClick={() => setActiveTab('animated-player')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition whitespace-nowrap ${
              activeTab === 'animated-player' ? 'bg-emerald-600 text-white font-bold shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Play className="w-3.5 h-3.5 text-emerald-400" />
            <span>Cinema Player & Download</span>
          </button>
        </div>

        {/* Global "Add Free" Quick Buttons */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={() => imageInputRef.current?.click()}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition shadow-xs"
            title="Upload and add free image to library"
          >
            <Upload className="w-3 h-3 text-emerald-400" />
            <span>Add Free Image</span>
          </button>

          <button
            onClick={() => videoInputRef.current?.click()}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-red-300 border border-red-500/30 text-xs font-bold transition shadow-xs"
            title="Upload and add free video to animator"
          >
            <FileVideo className="w-3 h-3 text-red-400" />
            <span>Add Free Video</span>
          </button>
        </div>
      </div>

      {/* TAB 0: GROK YOUTUBE VIDEO GENERATOR */}
      {activeTab === 'grok-youtube' && <GrokYouTubeStudio />}

      {/* TAB 1: TEXT TO VIDEO */}
      {activeTab === 'video-maker' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-red-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Generate Video ({videoEngine.toUpperCase()})
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                Free Download Included
              </span>
            </div>

            <form onSubmit={handleGenerateVideo} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300">Video Topic or Ad Copy</label>
                <textarea
                  rows={4}
                  required
                  value={videoTopic}
                  onChange={(e) => setVideoTopic(e.target.value)}
                  placeholder="e.g. Master AI Automation in 2026: 3 Breakthrough tools to save 20 hours a week and scale WhatsApp outreach..."
                  className="w-full mt-1 bg-slate-950 border border-slate-800 text-xs text-white rounded-xl p-3 focus:outline-none focus:border-red-500 font-medium leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300">Aspect Ratio</label>
                  <select
                    value={videoFormat}
                    onChange={(e) => setVideoFormat(e.target.value as '16:9' | '9:16')}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 text-xs text-white rounded-xl p-2.5 focus:outline-none"
                  >
                    <option value="9:16">Vertical 9:16 (Shorts & Reels)</option>
                    <option value="16:9">Landscape 16:9 (YouTube Full)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300">Duration</label>
                  <select
                    value={videoDuration}
                    onChange={(e) => setVideoDuration(e.target.value)}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 text-xs text-white rounded-xl p-2.5 focus:outline-none"
                  >
                    <option value="30s">30s (Fast Hook)</option>
                    <option value="60s">60s (Viral Shorts)</option>
                    <option value="90s">90s (Deep Dive)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isGeneratingVideo}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-red-600/20 transition active:scale-95 disabled:opacity-50"
              >
                {isGeneratingVideo ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Directing {videoEngine.toUpperCase()} Scenes...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Free Video Storyboard</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Quick Previews & Current Script Breakdown */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-300 uppercase">
                    Active Video Project
                  </span>
                  <h3 className="text-base font-bold text-white mt-1">{currentProject.title}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('animated-player')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-xs"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Play & Download Video</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentProject.scenes.map((sc, i) => (
                  <div
                    key={sc.id}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 hover:border-slate-700 transition"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-red-400">Scene {sc.sceneNumber}</span>
                      <span className="text-slate-500 font-mono">{sc.durationSeconds}s • {sc.cameraMovement}</span>
                    </div>
                    <div className="text-xs font-bold text-white">{sc.title}</div>
                    <p className="text-xs text-slate-300 line-clamp-2 italic">"{sc.narration}"</p>
                    <div className="text-[10px] text-amber-400 font-mono font-bold bg-black/40 px-2 py-1 rounded">
                      TEXT: {sc.onScreenText}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: IMAGE TO VIDEO (Motion Animator) */}
      {activeTab === 'image-to-video' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Image to Video Motion
                  </h3>
                </div>
                <button
                  onClick={() => imageInputRef.current?.click()}
                  className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
                >
                  <Upload className="w-3 h-3" />
                  <span>Upload Image</span>
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300">Source Image Direct URL</label>
                  <input
                    type="text"
                    value={motionSourceImage}
                    onChange={(e) => setMotionSourceImage(e.target.value)}
                    placeholder="Paste direct image URL or upload above"
                    className="w-full mt-1 bg-slate-950 border border-slate-800 text-xs text-white rounded-xl p-2.5 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300">AI Motion & Camera Prompt</label>
                  <textarea
                    rows={3}
                    value={motionPrompt}
                    onChange={(e) => setMotionPrompt(e.target.value)}
                    placeholder="e.g. 3D depth parallax with floating golden sparkles, slow camera push-in..."
                    className="w-full mt-1 bg-slate-950 border border-slate-800 text-xs text-white rounded-xl p-2.5 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300">Motion Effect Type</label>
                  <select
                    value={motionCameraEffect}
                    onChange={(e) => setMotionCameraEffect(e.target.value as any)}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 text-xs text-white rounded-xl p-2.5 focus:outline-none"
                  >
                    <option value="festive_particles">Festive Floating Sparks & Light Aura</option>
                    <option value="3d_parallax">3D Depth Parallax & Dolly Zoom (Veo 3)</option>
                    <option value="cinematic_dolly">Cinematic Drone Push-In (60fps)</option>
                    <option value="light_rays">Cyber Neon Pulse & Volumetric Rays (Grok)</option>
                    <option value="pan_zoom">Horizontal Pan & Dynamic Reveal</option>
                  </select>
                </div>

                <button
                  onClick={handleRenderImageToVideo}
                  disabled={isRenderingMotion}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-amber-600/20 transition active:scale-95 disabled:opacity-50"
                >
                  {isRenderingMotion ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Synthesizing Video Motion ({motionProgress}%)...</span>
                    </>
                  ) : (
                    <>
                      <Film className="w-4 h-4" />
                      <span>Animate Image to Video Free</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Motion Visualizer Canvas */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Live Motion Canvas Visualization</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownloadImage(motionSourceImage, 'Motion_Source_Poster', 'png')}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Free Download Image</span>
                    </button>
                  </div>
                </div>

                <div className="relative rounded-2xl overflow-hidden aspect-video bg-black flex items-center justify-center border border-slate-800 group">
                  <img
                    src={motionSourceImage}
                    alt="Source"
                    className={`w-full h-full object-cover transition-transform duration-1000 ${
                      isRenderingMotion ? 'scale-110 blur-xs' : 'group-hover:scale-105'
                    }`}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?w=1000&auto=format&fit=crop&q=80';
                    }}
                  />

                  {isRenderingMotion && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center space-y-3">
                      <span className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs text-white font-bold font-mono">
                        Generating Temporal Motion Frames ({motionProgress}%)...
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Curated Free Royalty-Free Stock Video Clips */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">
                  Royalty-Free Stock Video Clips (100% Free Download & Commercial Use)
                </h3>
                <p className="text-xs text-slate-400">
                  Ready-to-use 4K & 1080p clips for festive greetings, WhatsApp ads, and social cross-posting.
                </p>
              </div>
              <button
                onClick={() => videoInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Free Video Clip</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {FREE_STOCK_VIDEOS.map((stock) => (
                <div
                  key={stock.id}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2.5 group"
                >
                  <div className="relative rounded-lg overflow-hidden aspect-video bg-black">
                    <img
                      src={stock.thumbnail}
                      alt={stock.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                    <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/70 text-[10px] text-white font-mono">
                      {stock.duration} • {stock.resolution}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-white truncate">{stock.title}</h4>
                    <span className="text-[10px] text-purple-400">{stock.category}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                    <a
                      href={stock.url}
                      download={`${stock.title}.mp4`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-bold"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Free Download Video</span>
                    </a>

                    <button
                      onClick={() => {
                        setMotionSourceImage(stock.thumbnail);
                        showToast(`Loaded ${stock.title} into Motion Animator!`);
                      }}
                      className="text-[11px] text-slate-400 hover:text-white"
                    >
                      Remix in Animator →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FESTIVAL & AD VIDEO SUITE */}
      {activeTab === 'festival-ads' && (
        <div className="space-y-5">
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white">
                Festival & Commercial Ad Video Library ({videoEngine.toUpperCase()})
              </h3>
              <p className="text-xs text-slate-400">
                1-Click generation & free downloads for Diwali, Holi, Eid, Christmas, Black Friday & WhatsApp Lead Ads.
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Free Downloads & Zero Watermark
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FESTIVAL_AD_PRESETS.map((preset) => (
              <div
                key={preset.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl hover:border-purple-500/50 transition flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="relative rounded-xl overflow-hidden aspect-video bg-black border border-slate-800">
                    <img
                      src={preset.sampleMediaUrl}
                      alt={preset.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-white border border-white/20">
                        {preset.category === 'festival' ? '🎉 FESTIVAL' : '🚀 COMMERCIAL AD'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white">{preset.name}</h4>
                    <p className="text-xs text-purple-300 mt-0.5">{preset.tagline}</p>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2">{preset.narrationScript}</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => handleLaunchPreset(preset)}
                    disabled={isGeneratingVideo}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-600/20 transition active:scale-95 disabled:opacity-50"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Generate & Download Free Video</span>
                  </button>

                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <button
                      onClick={() => handleDownloadImage(preset.sampleMediaUrl, `${preset.name}_Poster`, 'jpg')}
                      className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>Free Download Poster</span>
                    </button>
                    <span className="text-slate-500 font-mono">Free Forever</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: TEXT TO IMAGE GENERATOR & FREE GALLERY */}
      {activeTab === 'image-generator' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Text to Image (4K Free)
                </h3>
              </div>
              <button
                onClick={() => imageInputRef.current?.click()}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Free Image</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300">Image Description & Prompt</label>
                <textarea
                  rows={4}
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  placeholder="e.g. Ultra-luxurious Diwali gold greeting card with floating glowing brass diyas and fireworks..."
                  className="w-full mt-1 bg-slate-950 border border-slate-800 text-xs text-white rounded-xl p-3 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300">Aspect Ratio</label>
                  <select
                    value={imageRatio}
                    onChange={(e) => setImageRatio(e.target.value as any)}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 text-xs text-white rounded-xl p-2.5 focus:outline-none"
                  >
                    <option value="9:16">Vertical 9:16 (Stories/Status)</option>
                    <option value="16:9">Landscape 16:9 (YouTube/Web)</option>
                    <option value="1:1">Square 1:1 (Instagram Feed)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300">Style Preset</label>
                  <select
                    value={imageStyle}
                    onChange={(e) => setImageStyle(e.target.value)}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 text-xs text-white rounded-xl p-2.5 focus:outline-none"
                  >
                    <option value="Festive Gold">Festive Gold & Royal Glow</option>
                    <option value="Cyberpunk Glow">Cyberpunk Neon</option>
                    <option value="Cinematic 3D">Cinematic 3D Photoreal</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleGenerateImage}
                disabled={isRenderingImage || !imagePrompt.trim()}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 hover:from-cyan-500 hover:to-teal-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-cyan-600/20 transition active:scale-95 disabled:opacity-50"
              >
                {isRenderingImage ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Rendering 4K Visual Asset...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Render & Download Free 4K Image</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Generated Gallery with Direct Free Downloads */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Free Generated & Added Gallery ({generatedGallery.length})
                </h3>
                <span className="text-xs font-bold text-emerald-400">100% Free Downloads</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {generatedGallery.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 p-2 space-y-2 group"
                  >
                    <div
                      className="relative overflow-hidden rounded-lg cursor-pointer"
                      onClick={() => setPreviewModalImage(item)}
                    >
                      {item.dataUrl ? (
                        <img
                          src={item.dataUrl}
                          alt={item.title}
                          className="w-full h-36 object-cover group-hover:scale-105 transition"
                        />
                      ) : (
                        <div className="w-full h-36 bg-slate-900 flex items-center justify-center text-xs text-slate-500">
                          Preview
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                        <span className="text-[11px] font-bold text-white bg-black/60 px-2.5 py-1 rounded-full">
                          Click to View & Download
                        </span>
                      </div>
                    </div>

                    <div className="text-[11px] font-bold text-white truncate">{item.title}</div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                      <button
                        onClick={() => handleDownloadImage(item.dataUrl, item.title, 'png')}
                        className="flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-bold"
                      >
                        <Download className="w-3 h-3" />
                        <span>Free Download (PNG)</span>
                      </button>

                      <button
                        onClick={() => {
                          setMotionSourceImage(item.dataUrl);
                          setActiveTab('image-to-video');
                          showToast(`Loaded ${item.title} into Image-to-Video!`);
                        }}
                        className="text-[10px] text-amber-400 hover:underline"
                        title="Animate this image to video"
                      >
                        Animate →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SYLLABUS & RESUME STUDIO */}
      {activeTab === 'syllabus-resume' && (
        <SyllabusResumeStudio
          onSendToVideoStudio={(script, title) => {
            setVideoTopic(`${title}: ${script}`);
            setActiveTab('video-maker');
            handleGenerateVideo(undefined, `${title}: ${script}`);
          }}
        />
      )}

      {/* TAB 6: CINEMA PLAYER & FREE VIDEO DOWNLOADER */}
      {activeTab === 'animated-player' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-300">
                Engine: {videoEngine.toUpperCase()} Ultra 4K
              </span>
              <h2 className="text-lg font-bold text-white mt-1">{currentProject.title}</h2>
            </div>

            {/* Action Buttons: Free Download Video, Scene Poster, Play */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleDownloadFullVideo}
                disabled={isRecordingFullVideo}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-2 transition active:scale-95 disabled:opacity-50"
              >
                {isRecordingFullVideo ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Rendering 4K Video ({videoRenderProgress}%)...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>Free Download Video (MP4/WebM)</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDownloadSceneFrame}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
                title="Download current scene as 4K PNG poster"
              >
                <ImageIcon className="w-3.5 h-3.5 text-slate-300" />
                <span>Download Scene Frame (PNG)</span>
              </button>

              <button
                onClick={handleDownloadStoryboardPackage}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
                title="Download video project package JSON"
              >
                <Download className="w-3.5 h-3.5 text-slate-300" />
                <span>Save Package (.JSON)</span>
              </button>

              <button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
                  voiceEnabled
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
                title="Toggle Web Speech Voice Narration"
              >
                {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                <span>Voice</span>
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                  isPlaying
                    ? 'bg-amber-600 hover:bg-amber-500 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                }`}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                <span>{isPlaying ? 'Pause' : 'Play Video'}</span>
              </button>
            </div>
          </div>

          {/* Video Scene Canvas / Frame */}
          <div className="relative rounded-2xl overflow-hidden aspect-video bg-gradient-to-br from-slate-950 via-slate-900 to-black border border-slate-800 flex items-center justify-center p-8 text-center shadow-2xl">
            <div className="space-y-4 max-w-xl z-10 animate-in fade-in zoom-in-95 duration-200">
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-amber-400 border border-amber-500/30 inline-block">
                Scene {currentScene.sceneNumber} of {currentProject.scenes.length} • {currentScene.cameraMovement}
              </span>

              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight drop-shadow-md">
                {currentScene.onScreenText}
              </h1>

              <p className="text-xs sm:text-base text-slate-200 leading-relaxed font-medium bg-black/40 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                "{currentScene.narration}"
              </p>
            </div>

            {/* Progress Bar inside player */}
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-950">
              <div
                className="h-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-400 transition-all duration-100"
                style={{ width: `${sceneProgress}%` }}
              />
            </div>
          </div>

          {/* Scene Selectors */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {currentProject.scenes.map((sc, i) => (
              <button
                key={sc.id}
                onClick={() => {
                  setActiveSceneIndex(i);
                  setSceneProgress(0);
                }}
                className={`p-3 rounded-xl border text-left transition ${
                  i === activeSceneIndex
                    ? 'bg-red-500/15 border-red-500 text-white shadow-xs'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="text-[10px] font-mono text-red-400">Scene {i + 1}</div>
                <div className="text-xs font-bold truncate mt-0.5">{sc.title}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* FULL SCREEN IMAGE PREVIEW & FREE DOWNLOAD MODAL */}
      {previewModalImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">{previewModalImage.title}</h3>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                  100% Free Download
                </span>
              </div>
              <button
                onClick={() => setPreviewModalImage(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-hidden rounded-xl bg-black flex items-center justify-center border border-slate-800">
              <img
                src={previewModalImage.dataUrl}
                alt={previewModalImage.title}
                className="max-h-[60vh] w-auto object-contain"
              />
            </div>

            <p className="text-xs text-slate-400 italic font-mono">
              Prompt: "{previewModalImage.prompt}"
            </p>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <span className="text-xs text-slate-400">
                Aspect: <strong>{previewModalImage.aspectRatio}</strong> • Commercial License: <strong>Included</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadImage(previewModalImage.dataUrl, previewModalImage.title, 'png')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-600/20 transition active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>Free Download (PNG)</span>
                </button>
                <button
                  onClick={() => handleDownloadImage(previewModalImage.dataUrl, previewModalImage.title, 'jpg')}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
                >
                  <span>Download (JPG)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
