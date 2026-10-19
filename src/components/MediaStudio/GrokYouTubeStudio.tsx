import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Video,
  Sparkles,
  Play,
  Pause,
  Download,
  Copy,
  CheckCircle2,
  Share2,
  Film,
  Zap,
  Radio,
  Layers,
  Sliders,
  ExternalLink,
  ChevronRight,
  Monitor,
  Smartphone,
  Maximize2,
  RotateCcw,
  Volume2,
  VolumeX,
  FileText,
  Clock,
  Youtube,
} from 'lucide-react';

export interface GrokScene {
  sceneNumber: number;
  timecode: string;
  durationSeconds: number;
  sceneTitle: string;
  grokVideoPrompt: string;
  voiceoverScript: string;
  onScreenText: string;
  cameraMovement: string;
  lightingAndAtmosphere: string;
  soundDesignPrompt: string;
  bgGradient: string;
}

export interface GrokYouTubeProject {
  id: string;
  title: string;
  category: string;
  format: '16:9' | '9:16';
  targetDuration: string;
  youtubeTitle: string;
  youtubeDescription: string;
  youtubeTags: string[];
  grokThumbnailPrompt: string;
  scenes: GrokScene[];
}

const PRESET_GROK_PROJECTS: GrokYouTubeProject[] = [
  {
    id: 'grok-shri-shyam-workshop',
    title: '🚀 AI, ML & Robotics Coaching Workshop 2026 (M/s Shri Shyam Consultant)',
    category: 'Education & Career',
    format: '16:9',
    targetDuration: '2 Min 40 Sec (Full YouTube Video)',
    youtubeTitle: 'The Future is Here: AI, ML & Robotics Coaching Workshop 2026 | M/s Shri Shyam Consultant',
    youtubeDescription: `🚀 The Future is Here — and It's Powered by AI!
Join our AI, ML & Robotics Coaching Workshop, hosted by M/s Shri Shyam Consultant and led by our Expert Trainer in AI, ML & Robotics Science.

Whether you're a student, working professional, educator, business owner, marketer, or simply curious about AI — this workshop will help you understand how AI is transforming the way we learn, work, and create.

💡 What You'll Learn:
✨ AI for Vibe Coding
📱 AI for Digital Marketing & Content Creation
👨‍🏫 AI for Educators
💰 AI for Accounts & Finance

🏆 Certification:
Certificates will be issued by M/s Shri Shyam Consultant on completion of each batch:
1️⃣ Foundation
2️⃣ Python
3️⃣ AI
4️⃣ ML
5️⃣ Data Science

💰 Fee: INR 1,500 per month
⏳ Duration: 1 Year
🎓 Certificate provided on successful completion of the course
📅 Kickoff: Sunday, 23 Aug 2026
🕑 Time: 12:00 PM – 5:30 PM (IST)
📍 Mode: Online
🎓 Eligibility: No specific qualification required — everyone is welcome!

⚡ Hurry! Limited seats available — register to secure your spot in the new batch.
📲 Register now: https://agent-6a840d30697b8bc49--registeraerapoweredbyai.netlify.app
🌐 Website: https://shrishyamconsulting.in
💬 WhatsApp Inquiries: +91 78695 15615

TIMESTAMPS:
00:00 - The AI Revolution in 2026
00:20 - AI for Vibe Coding & Building Fast
00:40 - AI for Digital Marketing & Content
01:00 - AI for Educators & Finance
01:20 - 5 Official Certification Batches
01:40 - Course Details & Affordable INR 1,500 Fee
02:00 - M/s Shri Shyam Consultant Expert Trainer
02:20 - Register Online on Netlify`,
    youtubeTags: [
      'ArtificialIntelligence',
      'AIWorkshop',
      'MachineLearning',
      'Robotics',
      'AICoaching',
      'VibeCoding',
      'Python',
      'ShriShyamConsultant',
      'GrokVideo',
      'OnlineCourse',
    ],
    grokThumbnailPrompt:
      'Cinematic YouTube thumbnail, vibrant golden robotic hand touching a holographic crystal sphere showing code nodes, glowing neon typography "AI & ROBOTICS 2026", deep indigo and gold lighting, 8k resolution, octane render, YouTube 16:9 banner format --ar 16:9',
    scenes: [
      {
        sceneNumber: 1,
        timecode: '00:00 - 00:20',
        durationSeconds: 20,
        sceneTitle: 'The Viral Hook: The Future is Powered by AI',
        grokVideoPrompt:
          'Cinematic slow dolly push-in towards a glowing cybernetic neural globe floating over a futuristic city skyline at twilight, shimmering fiber-optic data streams, 8k photorealistic, volumetric cinematic lighting, anamorphic lens flare --ar 16:9 --style cinematic --motion medium',
        voiceoverScript:
          'The future is here — and it is powered by Artificial Intelligence! Whether you are a student, working professional, educator, or business owner, AI is redefining how the entire world learns, works, and creates.',
        onScreenText: 'THE FUTURE IS POWERED BY AI 🚀',
        cameraMovement: 'Slow Cinematic Dolly In',
        lightingAndAtmosphere: 'Twilight Gold & Cyber Blue with volumetric rays',
        soundDesignPrompt: 'Epic cinematic synth swell with futuristic digital pulse',
        bgGradient: 'from-slate-950 via-indigo-950 to-slate-900',
      },
      {
        sceneNumber: 2,
        timecode: '00:20 - 00:40',
        durationSeconds: 20,
        sceneTitle: 'Module 1: AI for Vibe Coding & Fast Prototyping',
        grokVideoPrompt:
          'Over-the-shoulder shot of a modern engineer speaking natural language to an intelligent dual-screen terminal as full software pipelines and neural nodes compile in real-time, holographic UI floating, neon cyan accents --ar 16:9 --style photorealistic --motion smooth',
        voiceoverScript:
          'Module One: Master AI for Vibe Coding. Transform your natural language ideas into full-fledged software, web apps, and automated workflows without getting stuck in syntax.',
        onScreenText: '✨ AI FOR VIBE CODING',
        cameraMovement: 'Smooth lateral tracking shot',
        lightingAndAtmosphere: 'Clean ambient tech studio with neon cyan glow',
        soundDesignPrompt: 'Subtle high-tech keyboard tapping and digital confirmation chimes',
        bgGradient: 'from-indigo-950 via-cyan-950 to-slate-950',
      },
      {
        sceneNumber: 3,
        timecode: '00:40 - 01:00',
        durationSeconds: 20,
        sceneTitle: 'Module 2: AI for Digital Marketing & Content Creation',
        grokVideoPrompt:
          'Dynamic multi-panel display showing ultra-high-definition viral 4K videos, automated social reels, and targeted ad pipelines generating simultaneously with rapid floating analytics bars --ar 16:9 --style cinematic --motion dynamic',
        voiceoverScript:
          'Module Two: AI for Digital Marketing and Content Creation. Generate viral YouTube videos, high-converting festival ads, and automated campaigns that scale your business effortlessly.',
        onScreenText: '📱 DIGITAL MARKETING & CONTENT',
        cameraMovement: 'Fast pan with rotational tilt',
        lightingAndAtmosphere: 'High-energy studio lighting with magenta and amber backlights',
        soundDesignPrompt: 'Energetic modern beat drop with digital shutter clicks',
        bgGradient: 'from-purple-950 via-pink-950 to-slate-950',
      },
      {
        sceneNumber: 4,
        timecode: '01:00 - 01:20',
        durationSeconds: 20,
        sceneTitle: 'Module 3: AI for Educators, Accounts & Finance',
        grokVideoPrompt:
          'Split screen transition: an educator guiding interactive holographic lessons to eager students, transitioning into real-time predictive financial charts and automated ledger analysis --ar 16:9 --style photorealistic --motion steady',
        voiceoverScript:
          'Module Three: AI for Educators, Accounts, and Finance. Automate lesson planning, grading, automated bookkeeping, and predictive financial insights in seconds.',
        onScreenText: '👨‍🏫 EDUCATORS & 💰 ACCOUNTS & FINANCE',
        cameraMovement: 'Steady glide with subtle vertical drift',
        lightingAndAtmosphere: 'Warm executive daylight transitioning into golden finance charts',
        soundDesignPrompt: 'Warm piano chords overlaid with subtle tech harmonics',
        bgGradient: 'from-emerald-950 via-teal-950 to-slate-950',
      },
      {
        sceneNumber: 5,
        timecode: '01:20 - 01:40',
        durationSeconds: 20,
        sceneTitle: '5 Recognized Certification Batches',
        grokVideoPrompt:
          'Five golden holographic crests rotating in 3D space: Foundation, Python, AI, Machine Learning, and Data Science. Elegant gold particle dust swirling around official seal of M/s Shri Shyam Consultant --ar 16:9 --style cinematic --motion slow',
        voiceoverScript:
          'Earn prestigious industry certificates issued by M/s Shri Shyam Consultant across five milestones: Foundation, Python, Artificial Intelligence, Machine Learning, and Data Science!',
        onScreenText: '🏆 5 CERTIFICATION BATCHES',
        cameraMovement: 'Orbital 360-degree camera spin',
        lightingAndAtmosphere: 'Royal gold and deep navy with gleaming highlights',
        soundDesignPrompt: 'Inspiring orchestral rise with crystal chime accent',
        bgGradient: 'from-amber-950 via-slate-900 to-indigo-950',
      },
      {
        sceneNumber: 6,
        timecode: '01:40 - 02:00',
        durationSeconds: 20,
        sceneTitle: 'Affordable INR 1,500 Fee & Course Schedule',
        grokVideoPrompt:
          'Modern calendar flipping to Sunday 23 Aug 2026, glowing clock showing 12:00 PM to 5:30 PM IST, bold golden fee badge displaying "INR 1,500 / Month", 100% online mode globe icon --ar 16:9 --style photorealistic --motion gentle',
        voiceoverScript:
          'Premium coaching at just INR 1,500 per month for a comprehensive 1-year journey. Interactive online live sessions every Sunday from 12:00 PM to 5:30 PM IST. No prior background required — everyone is welcome!',
        onScreenText: '💰 INR 1,500/MO • 1 YEAR • SUNDAYS',
        cameraMovement: 'Gentle pedestal down and tilt up',
        lightingAndAtmosphere: 'Crisp high-contrast commercial lighting',
        soundDesignPrompt: 'Friendly acoustic strumming and positive upbeat rhythm',
        bgGradient: 'from-teal-950 via-emerald-950 to-slate-900',
      },
      {
        sceneNumber: 7,
        timecode: '02:00 - 02:20',
        durationSeconds: 20,
        sceneTitle: 'M/s Shri Shyam Consultant Accreditation & Mentorship',
        grokVideoPrompt:
          'Distinguished expert trainer in modern high-tech research lab surrounded by robotic arms and neural network monitors, smiling confidently and holding official credentials of M/s Shri Shyam Consultant --ar 16:9 --style cinematic --motion smooth',
        voiceoverScript:
          'Hosted by M/s Shri Shyam Consultant and led by our senior expert trainer in AI, ML, and Robotics Science. You get 1-on-1 mentorship, live project reviews, and lifetime community support.',
        onScreenText: 'M/S SHRI SHYAM CONSULTANT 🎓',
        cameraMovement: 'Smooth tracking shot past high-tech equipment',
        lightingAndAtmosphere: 'Cinematic corporate studio lighting with soft diffused shadows',
        soundDesignPrompt: 'Deep resonant authority bass tone and uplifting strings',
        bgGradient: 'from-indigo-950 via-purple-950 to-slate-950',
      },
      {
        sceneNumber: 8,
        timecode: '02:20 - 02:40',
        durationSeconds: 20,
        sceneTitle: 'Final Call to Action: Register Online Now',
        grokVideoPrompt:
          'Smartphone displaying the Netlify registration link with glowing animated "Register Now" button, official website URL and WhatsApp support numbers glowing, YouTube Subscribe and Bell icon animation --ar 16:9 --style cinematic --motion zoom_in',
        voiceoverScript:
          'Limited seats available! Tap the link in the description to register on our Netlify portal or visit shrishyamconsulting.in. Like, subscribe, and hit the bell icon. See you in the workshop!',
        onScreenText: 'SECURE YOUR SPOT NOW! 🚀🤖',
        cameraMovement: 'Energetic zoom-in to subscription button',
        lightingAndAtmosphere: 'Vibrant celebratory golden starlight and confetti shimmer',
        soundDesignPrompt: 'Grand cinematic finale with YouTube subscribe click chime',
        bgGradient: 'from-rose-950 via-amber-950 to-slate-950',
      },
    ],
  },
  {
    id: 'grok-vibe-coding-tutorial',
    title: '⚡ How to Vibe Code Fullstack AI Apps in 15 Minutes #shorts',
    category: 'Vibe Coding',
    format: '9:16',
    targetDuration: '60 Seconds (YouTube Shorts)',
    youtubeTitle: 'How to Vibe Code with AI in 2026! Stop Writing Manual Code #shorts',
    youtubeDescription: 'Learn how modern developers build complete web apps using Vibe Coding and AI models.\n\n#VibeCoding #AI #Grok #Coding #Tech',
    youtubeTags: ['VibeCoding', 'AI', 'Coding', 'Cursor', 'Grok', 'Shorts'],
    grokThumbnailPrompt:
      'Ultra vibrant vertical YouTube Shorts thumbnail, glowing developer headset with AI code pouring from fingertips into holographic screen, 9:16 aspect ratio, 8k cinematic --ar 9:16',
    scenes: [
      {
        sceneNumber: 1,
        timecode: '00:00 - 00:15',
        durationSeconds: 15,
        sceneTitle: 'The Vibe Coding Revolution',
        grokVideoPrompt:
          'Fast-paced montage of modern programmer speaking casually while AI generates thousands of lines of React and Python in milliseconds, glowing neon purple lighting --ar 9:16 --style cinematic',
        voiceoverScript: 'Manual coding is evolving. In 2026, top engineers vibe code. You describe the vision, and AI builds the architecture.',
        onScreenText: 'WHAT IS VIBE CODING? ⚡',
        cameraMovement: 'Fast dynamic whip pan',
        lightingAndAtmosphere: 'Cyberpunk neon purple and cyan',
        soundDesignPrompt: 'Fast glitch techno intro',
        bgGradient: 'from-purple-950 via-indigo-950 to-slate-950',
      },
      {
        sceneNumber: 2,
        timecode: '00:15 - 00:30',
        durationSeconds: 15,
        sceneTitle: 'Prompting the Architecture',
        grokVideoPrompt:
          'High angle close-up on keyboard typing simple prompts, screen instantly visualizing full database tables and interactive UI components --ar 9:16 --style photorealistic',
        voiceoverScript: 'Step one: outline your database, models, and UI in plain English. No boilerplate, no tedious setup.',
        onScreenText: 'STEP 1: PROMPT ARCHITECTURE 🧠',
        cameraMovement: 'Smooth tilt down',
        lightingAndAtmosphere: 'Moody developer studio',
        soundDesignPrompt: 'Mechanical keyboard clicks',
        bgGradient: 'from-indigo-950 via-slate-900 to-slate-950',
      },
      {
        sceneNumber: 3,
        timecode: '00:30 - 00:45',
        durationSeconds: 15,
        sceneTitle: 'Autonomous Iteration & Bug Fixing',
        grokVideoPrompt:
          'AI agent automatically spotting errors and self-healing code with glowing green checkmarks, fluid transitions --ar 9:16 --style cinematic',
        voiceoverScript: 'Step two: the AI self-heals any build bugs before you even see them. You stay completely in the creative flow state.',
        onScreenText: 'STEP 2: ZERO DEBUG HEADACHES ✅',
        cameraMovement: 'Zoom into green checkmarks',
        lightingAndAtmosphere: 'Emerald glow on dark glass',
        soundDesignPrompt: 'Chime chord and sub bass drop',
        bgGradient: 'from-emerald-950 via-slate-900 to-slate-950',
      },
      {
        sceneNumber: 4,
        timecode: '00:45 - 01:00',
        durationSeconds: 15,
        sceneTitle: 'Join the Masterclass Batch',
        grokVideoPrompt:
          'Celebratory starlight particles illuminating the Shri Shyam Consultant registration badge and Netlify link, subscribe bell vibrating --ar 9:16 --style cinematic',
        voiceoverScript: 'Want to master Vibe Coding live? Join our upcoming AI Workshop hosted by M/s Shri Shyam Consultant. Tap the link in bio!',
        onScreenText: 'LEARN VIBE CODING LIVE 🚀',
        cameraMovement: 'Push in with pulse',
        lightingAndAtmosphere: 'Festive gold and celebratory sparkle',
        soundDesignPrompt: 'Upbeat subscribe sound effect',
        bgGradient: 'from-amber-950 via-rose-950 to-slate-950',
      },
    ],
  },
];

export const GrokYouTubeStudio: React.FC = () => {
  const [activeProject, setActiveProject] = useState<GrokYouTubeProject>(
    PRESET_GROK_PROJECTS[0]
  );
  const [selectedSceneIndex, setSelectedSceneIndex] = useState(0);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  // Cinema Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerSceneIndex, setPlayerSceneIndex] = useState(0);
  const [sceneProgress, setSceneProgress] = useState(0);
  const [voiceNarrationEnabled, setVoiceNarrationEnabled] = useState(true);
  const [isDownloadingVideo, setIsDownloadingVideo] = useState(false);
  const [videoDownloadProgress, setVideoDownloadProgress] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  const showCopyToast = (msg: string) => {
    setCopyFeedback(msg);
    setTimeout(() => setCopyFeedback(null), 3000);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    confetti({ particleCount: 30, spread: 50 });
    showCopyToast(`Copied ${label} to clipboard!`);
  };

  // Compile Single Master Grok Prompt for the Whole YouTube Video
  const compileMasterGrokPrompt = () => {
    const isWidescreen = activeProject.format === '16:9';
    let prompt = `[xAI Grok Video / Grok Imagine Production Prompt: Full YouTube Video]\n`;
    prompt += `Title: ${activeProject.youtubeTitle}\n`;
    prompt += `Aspect Ratio: ${isWidescreen ? '--ar 16:9' : '--ar 9:16'}\n`;
    prompt += `Duration: ${activeProject.targetDuration}\n`;
    prompt += `Style: 8K resolution, ARRI Alexa 35mm, cinematic volumetric lighting, photorealistic, octane render, motion coherence\n\n`;
    prompt += `--- SCENE-BY-SCENE STORYBOARD & SHOT LIST ---\n\n`;

    activeProject.scenes.forEach((sc) => {
      prompt += `[Scene ${sc.sceneNumber} (${sc.timecode}) - ${sc.sceneTitle}]\n`;
      prompt += `Visual Prompt: ${sc.grokVideoPrompt}\n`;
      prompt += `Camera Motion: ${sc.cameraMovement}\n`;
      prompt += `Lighting: ${sc.lightingAndAtmosphere}\n`;
      prompt += `On-Screen Text: "${sc.onScreenText}"\n`;
      prompt += `Voiceover (Narration): "${sc.voiceoverScript}"\n`;
      prompt += `Sound FX Prompt: ${sc.soundDesignPrompt}\n\n`;
    });

    prompt += `--- YOUTUBE METADATA ---\n`;
    prompt += `SEO Title: ${activeProject.youtubeTitle}\n`;
    prompt += `Description:\n${activeProject.youtubeDescription}\n\n`;
    prompt += `Tags: ${activeProject.youtubeTags.join(', ')}\n`;
    return prompt;
  };

  // Download complete project as formatted text script
  const handleDownloadScriptFile = () => {
    const content = compileMasterGrokPrompt();
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Grok_YouTube_Script_${activeProject.id}_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    confetti({ particleCount: 40, spread: 60 });
    showCopyToast('Downloaded full YouTube production script free!');
  };

  // Download 4K Scene Frame Image (100% Free)
  const handleDownloadSceneFrame = (scene: GrokScene) => {
    const isWidescreen = activeProject.format === '16:9';
    const w = isWidescreen ? 1920 : 1080;
    const h = isWidescreen ? 1080 : 1920;

    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const ctx = c.getContext('2d');
    if (!ctx) return;

    // Gradient background
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#020617');
    grad.addColorStop(0.5, '#1e1b4b');
    grad.addColorStop(1, '#090514');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Decorative particles
    for (let i = 0; i < 60; i++) {
      ctx.fillStyle = i % 2 === 0 ? 'rgba(251, 191, 36, 0.4)' : 'rgba(56, 189, 248, 0.3)';
      ctx.beginPath();
      ctx.arc(Math.random() * w, Math.random() * h, Math.random() * 4 + 1, 0, Math.PI * 2);
      ctx.fill();
    }

    // Top Brand Tag
    ctx.fillStyle = '#10B981';
    ctx.font = 'bold 28px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('⚡ GROK VIDEO FOR YOUTUBE • M/S SHRI SHYAM CONSULTANT 2026', w / 2, isWidescreen ? 120 : 180);

    // Scene Title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${isWidescreen ? '54px' : '48px'} system-ui, sans-serif`;
    ctx.fillText(scene.onScreenText, w / 2, h / 2 - 40);

    // Narration
    ctx.fillStyle = '#E2E8F0';
    ctx.font = '26px system-ui, sans-serif';
    const words = scene.voiceoverScript.split(' ');
    const line1 = words.slice(0, 10).join(' ');
    const line2 = words.slice(10, 20).join(' ');
    ctx.fillText(`"${line1}`, w / 2, h / 2 + 50);
    if (line2) ctx.fillText(`${line2}..."`, w / 2, h / 2 + 90);

    // Footer Info
    ctx.fillStyle = '#94A3B8';
    ctx.font = '22px system-ui, sans-serif';
    ctx.fillText(
      `Scene ${scene.sceneNumber} (${scene.timecode}) • Free 4K Download`,
      w / 2,
      h - (isWidescreen ? 100 : 150)
    );

    const a = document.createElement('a');
    a.href = c.toDataURL('image/png');
    a.download = `Grok_YouTube_Scene_${scene.sceneNumber}_4K.png`;
    a.click();
    confetti({ particleCount: 35, spread: 60 });
    showCopyToast(`Downloaded 4K frame for Scene ${scene.sceneNumber}!`);
  };

  // Play narration using Web Speech API
  const speakNarration = (text: string) => {
    if (!voiceNarrationEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  // Handle Play/Pause
  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } else {
      setIsPlaying(true);
      const current = activeProject.scenes[playerSceneIndex];
      if (current) {
        speakNarration(current.voiceoverScript);
      }
    }
  };

  // Scene player loop
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setSceneProgress((prev) => {
        if (prev >= 100) {
          if (playerSceneIndex < activeProject.scenes.length - 1) {
            const nextIdx = playerSceneIndex + 1;
            setPlayerSceneIndex(nextIdx);
            speakNarration(activeProject.scenes[nextIdx].voiceoverScript);
            return 0;
          } else {
            setIsPlaying(false);
            confetti({ particleCount: 50, spread: 70 });
            return 100;
          }
        }
        return prev + 2.5;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [isPlaying, playerSceneIndex, activeProject.scenes]);

  // Canvas drawing for interactive preview
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isWidescreen = activeProject.format === '16:9';
    const width = isWidescreen ? 800 : 450;
    const height = isWidescreen ? 450 : 800;
    canvas.width = width;
    canvas.height = height;

    const curScene = activeProject.scenes[playerSceneIndex] || activeProject.scenes[0];

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#090514');
    grad.addColorStop(0.5, '#1e1b4b');
    grad.addColorStop(1, '#020617');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Dynamic wave lines
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
    ctx.lineWidth = 2;
    for (let line = 0; line < 5; line++) {
      ctx.beginPath();
      for (let x = 0; x < width; x += 20) {
        const y = height / 2 + Math.sin(x * 0.015 + sceneProgress * 0.1 + line) * 35;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Top Bar info
    ctx.fillStyle = '#38BDF8';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`GROK YOUTUBE ENGINE • ${curScene.timecode}`, 20, 30);

    // Scene Heading
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${isWidescreen ? '26px' : '22px'} system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(curScene.onScreenText, width / 2, height / 2 - 20);

    // Subtitle / Narration preview
    ctx.fillStyle = '#CBD5E1';
    ctx.font = '14px system-ui, sans-serif';
    const words = curScene.voiceoverScript.split(' ');
    const line1 = words.slice(0, 8).join(' ');
    const line2 = words.slice(8, 16).join(' ');
    ctx.fillText(`"${line1}`, width / 2, height / 2 + 30);
    if (line2) ctx.fillText(`${line2}..."`, width / 2, height / 2 + 55);

    // Progress bar inside canvas
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.fillRect(20, height - 25, width - 40, 6);
    ctx.fillStyle = '#10B981';
    ctx.fillRect(20, height - 25, ((width - 40) * sceneProgress) / 100, 6);
  }, [playerSceneIndex, sceneProgress, activeProject]);

  const activeScene = activeProject.scenes[selectedSceneIndex] || activeProject.scenes[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast Alert */}
      {copyFeedback && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-2xl flex items-center gap-2 border border-emerald-400 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4" />
          <span>{copyFeedback}</span>
        </div>
      )}

      {/* Top Banner: Grok YouTube Studio */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-red-950/60 via-slate-900 to-indigo-950/60 border border-red-500/30 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 border border-red-500/30">
                <Youtube className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                Grok YouTube Video Generator
              </span>
              <span className="text-xs text-slate-400 font-medium">
                • xAI Grok 2 & Grok Video Prompt Engine
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
                100% Free Downloads
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              Grok Video Text Prompts to Make Full Videos for YouTube
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Generate complete, production-ready scene storyboards, camera motion syntax, Hindi/English narration scripts,
              and 16:9 widescreen 4K YouTube videos. Includes the official{' '}
              <span className="text-emerald-400 font-bold">
                M/s Shri Shyam Consultant AI, ML & Robotics Coaching Workshop (23 Aug 2026)
              </span>{' '}
              storyboard ready for one-click copy and free download.
            </p>
          </div>

          {/* Quick Preset Projects Switcher */}
          <div className="flex items-center gap-2 flex-wrap">
            {PRESET_GROK_PROJECTS.map((proj) => (
              <button
                key={proj.id}
                onClick={() => {
                  setActiveProject(proj);
                  setSelectedSceneIndex(0);
                  setPlayerSceneIndex(0);
                  setSceneProgress(0);
                  setIsPlaying(false);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 border ${
                  activeProject.id === proj.id
                    ? 'bg-red-600 text-white border-red-400 shadow-lg shadow-red-600/30'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span className="truncate max-w-[200px]">{proj.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Split: Interactive YouTube Cinema Player + Master Prompt Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): Interactive Cinema Player & Scene Timeline */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Monitor className="w-4 h-4 text-red-400" />
                <span>YouTube Cinema Simulator ({activeProject.format})</span>
              </h3>
              <span className="text-xs text-emerald-400 font-mono font-bold">
                {activeProject.targetDuration}
              </span>
            </div>

            {/* Video Canvas Container */}
            <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-black flex items-center justify-center">
              <canvas
                ref={canvasRef}
                className={`w-full ${
                  activeProject.format === '16:9' ? 'aspect-video' : 'aspect-[9/16] max-h-[460px]'
                } object-contain`}
              />

              {/* Floating Play/Pause Button overlay */}
              <button
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/20 transition group"
              >
                <div className="w-14 h-14 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition">
                  {isPlaying ? (
                    <Pause className="w-6 h-6 fill-white" />
                  ) : (
                    <Play className="w-6 h-6 fill-white ml-0.5" />
                  )}
                </div>
              </button>
            </div>

            {/* Player Controls Bar */}
            <div className="flex items-center justify-between gap-2 pt-1 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={togglePlay}
                  className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold flex items-center gap-1.5 transition"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlaying ? 'Pause' : 'Play Video'}</span>
                </button>

                <button
                  onClick={() => {
                    setPlayerSceneIndex(0);
                    setSceneProgress(0);
                    setIsPlaying(false);
                    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                      window.speechSynthesis.cancel();
                    }
                  }}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  title="Restart Preview"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setVoiceNarrationEnabled(!voiceNarrationEnabled)}
                  className={`p-1.5 rounded-lg transition border ${
                    voiceNarrationEnabled
                      ? 'bg-indigo-950 text-indigo-300 border-indigo-500/40'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                  title={voiceNarrationEnabled ? 'Voice Narration ON' : 'Voice Narration Muted'}
                >
                  {voiceNarrationEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleDownloadSceneFrame(activeScene)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold flex items-center gap-1 transition"
                  title="Download Current Scene 4K Frame Free"
                >
                  <Download className="w-3 h-3 text-emerald-400" />
                  <span>4K Frame</span>
                </button>

                <button
                  onClick={handleDownloadScriptFile}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 text-[11px] font-bold flex items-center gap-1 transition"
                  title="Download Script as TXT"
                >
                  <FileText className="w-3 h-3 text-indigo-400" />
                  <span>Script .TXT</span>
                </button>
              </div>
            </div>

            {/* Scene Selector Strip */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Scenes Timeline ({activeProject.scenes.length} Scenes)
              </span>
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {activeProject.scenes.map((sc, idx) => (
                  <button
                    key={sc.sceneNumber}
                    onClick={() => {
                      setSelectedSceneIndex(idx);
                      setPlayerSceneIndex(idx);
                      setSceneProgress(0);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl transition flex items-center justify-between text-xs ${
                      selectedSceneIndex === idx
                        ? 'bg-red-600/20 border border-red-500 text-white'
                        : 'bg-slate-950/60 hover:bg-slate-800/60 border border-slate-800 text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-red-400 font-bold">
                          Scene {sc.sceneNumber}
                        </span>
                        <span className="text-[10px] text-slate-400">({sc.timecode})</span>
                      </div>
                      <p className="font-semibold text-[11px] text-slate-200 truncate max-w-[240px] mt-0.5">
                        {sc.sceneTitle}
                      </p>
                    </div>

                    <span className="text-[10px] text-slate-400 font-mono">
                      {sc.durationSeconds}s
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): Grok Video Text Prompt & YouTube Package */}
        <div className="lg:col-span-7 space-y-5">
          {/* Active Scene Prompt Inspector */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                    Scene {activeScene.sceneNumber} of {activeProject.scenes.length}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">({activeScene.timecode})</span>
                </div>
                <h2 className="text-base font-extrabold text-white mt-1">
                  {activeScene.sceneTitle}
                </h2>
              </div>

              {/* Action: Copy Scene Grok Prompt */}
              <button
                onClick={() =>
                  copyToClipboard(
                    activeScene.grokVideoPrompt,
                    `Grok Prompt for Scene ${activeScene.sceneNumber}`
                  )
                }
                className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 shadow transition"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Grok Scene Prompt</span>
              </button>
            </div>

            {/* Grok Video Text Prompt Box */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Grok Video Generation Text Prompt (xAI Grok / Grok 2)</span>
                </span>
                <span className="text-[10px] text-amber-300 font-mono">8K Photorealistic</span>
              </label>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 leading-relaxed relative group">
                <p>{activeScene.grokVideoPrompt}</p>
              </div>
            </div>

            {/* Voiceover Script & On-Screen Typography */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                  Voiceover Narration Script
                </label>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed min-h-[90px]">
                  "{activeScene.voiceoverScript}"
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                  On-Screen Lower-Third & Graphics
                </label>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-cyan-300 font-bold min-h-[90px] flex items-center justify-center text-center">
                  {activeScene.onScreenText}
                </div>
              </div>
            </div>

            {/* Camera Motion & Sound Design */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Camera Motion</span>
                <p className="font-semibold text-white mt-0.5">{activeScene.cameraMovement}</p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Lighting</span>
                <p className="font-semibold text-amber-300 mt-0.5 truncate">
                  {activeScene.lightingAndAtmosphere}
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Sound Design</span>
                <p className="font-semibold text-cyan-300 mt-0.5 truncate">
                  {activeScene.soundDesignPrompt}
                </p>
              </div>
            </div>
          </div>

          {/* Master Copy-Paste Buttons for YouTube Automation */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>1-Click Production Exports for Grok & YouTube</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Button 1: Copy Complete Master Grok Prompt */}
              <button
                onClick={() =>
                  copyToClipboard(
                    compileMasterGrokPrompt(),
                    'Complete Master Grok Video Prompt'
                  )
                }
                className="p-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition transform hover:-translate-y-0.5"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Full Master Grok Prompt</span>
              </button>

              {/* Button 2: Copy Grok 16:9 Thumbnail Prompt */}
              <button
                onClick={() =>
                  copyToClipboard(
                    activeProject.grokThumbnailPrompt,
                    'Grok Thumbnail Prompt'
                  )
                }
                className="p-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Copy Grok Thumbnail Prompt</span>
              </button>

              {/* Button 3: Copy YouTube Title & Description with Timestamps */}
              <button
                onClick={() =>
                  copyToClipboard(
                    `${activeProject.youtubeTitle}\n\n${activeProject.youtubeDescription}`,
                    'YouTube Title & Description'
                  )
                }
                className="p-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <Youtube className="w-4 h-4 text-cyan-400" />
                <span>Copy YouTube Description & Timestamps</span>
              </button>

              {/* Button 4: Download Full Script (.TXT) */}
              <button
                onClick={handleDownloadScriptFile}
                className="p-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Download Script Package (.TXT)</span>
              </button>
            </div>

            {/* YouTube SEO Preview */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400">
                SEO Ready YouTube Title:
              </span>
              <p className="font-bold text-white">{activeProject.youtubeTitle}</p>
              <div className="flex items-center gap-1 flex-wrap pt-1">
                {activeProject.youtubeTags.slice(0, 6).map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
