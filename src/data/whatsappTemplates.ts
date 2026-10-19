import { BroadcastTemplate } from '../types';

export const COMPREHENSIVE_TEMPLATES: BroadcastTemplate[] = [
  {
    id: 'tmpl-shri-shyam-workshop-2026',
    title: '🚀 AI, ML & Robotics Workshop (M/s Shri Shyam Consultant)',
    category: 'Masterclass',
    description: 'Sunday, 23 Aug 2026 • 1-Year AI, ML & Robotics Coaching Course with Certifications by M/s Shri Shyam Consultant (INR 1,500/month).',
    tags: ['AI', 'Workshop', 'Machine Learning', 'Robotics', 'Coaching', 'Certification'],
    body: `🚀 *The Future is Here — and It's Powered by AI!*

Join our *AI, ML & Robotics Coaching Workshop*, hosted by *M/s Shri Shyam Consultant* and led by our Expert Trainer in AI, ML & Robotics Science.

Whether you're a student, working professional, educator, business owner, marketer, or simply curious about AI — this workshop will help you understand how AI is transforming the way we learn, work, and create.

💡 *What You'll Learn:*
✨ AI for Vibe Coding
📱 AI for Digital Marketing & Content Creation
👨‍🏫 AI for Educators
💰 AI for Accounts & Finance

🏆 *Certification:*
Certificates will be issued by *M/s Shri Shyam Consultant* on completion of each batch:
1️⃣ Foundation
2️⃣ Python
3️⃣ AI
4️⃣ ML
5️⃣ Data Science

💰 *Fee:* INR 1,500 per month
⏳ *Duration:* 1 Year
🎓 *Certificate provided on successful completion of the course*
📅 *Batch Kickoff:* Sunday, 23 Aug 2026
🕑 *Time:* 12:00 PM – 5:30 PM (IST)
📍 *Mode:* Online
🎓 *Eligibility:* No specific qualification required — everyone is welcome!

⚡ *Hurry! Limited seats available — register to secure your spot in the new batch.*

📲 *Register now:*
https://agent-6a840d30697b8bc49--registeraerapoweredbyai.netlify.app

🌐 *Website:* https://shrishyamconsulting.in
✨ *AI Today. Better Tomorrow.*
See you there! 🚀🤖

#ArtificialIntelligence #AIWorkshop #MachineLearning #Robotics #AICoaching`,
    buttons: [
      { id: 'b-reg-1', type: 'url', text: '📲 Register Now (Netlify)', value: 'https://agent-6a840d30697b8bc49--registeraerapoweredbyai.netlify.app' },
      { id: 'b-web-1', type: 'url', text: '🌐 Official Website', value: 'https://shrishyamconsulting.in' },
      { id: 'b-call-1', type: 'call', text: '📞 WhatsApp Desk (+91 78695 15615)', value: '+917869515615' },
    ],
    variables: ['{{name}}', '{{company}}'],
  },
  {
    id: 'tmpl-masterclass-ai',
    title: '🚀 AI & Automation Masterclass Outreach',
    category: 'Masterclass',
    description: 'High-converting invitation for Python, LLM & Robotics course enrollment with 50-seat limited batch guarantee.',
    tags: ['Education', 'AI', 'Masterclass', 'Career'],
    body: `🚀 *[Special Invitation] Master AI & Automation Technologies!*

Hi {{name}},

Are you looking to gain practical skills in AI, Machine Learning, and Robotics to fast-track your career at {{company}}?

We are hosting an exclusive interactive masterclass designed to give you hands-on experience with:
✅ Generative AI & Prompt Engineering
✅ Python for Machine Learning & LLM Fine-Tuning
✅ Low-Code Automation Workflows (WhatsApp, CRM, Sheets)

🔥 *Limited Seats:* Early-bird registration is currently open for the upcoming weekend batch!

📍 *Offer valid for the first 50 seats only.*`,
    buttons: [
      { id: 'b1', type: 'url', text: '🔗 Enroll Now (URL)', value: 'https://shrishyam.edu/enroll' },
      { id: 'b2', type: 'call', text: '📞 Speak to Academic Expert', value: '+919876543210' },
      { id: 'b3', type: 'quick_reply', text: '📩 Send Me Syllabus PDF' },
    ],
    variables: ['{{name}}', '{{company}}'],
  },
  {
    id: 'tmpl-corporate-staffing',
    title: '📋 Corporate Staffing & B2B Recruitment',
    category: 'Recruitment',
    description: 'Direct outreach to HR Directors and Founders offering pre-vetted AI, IT, and executive talent.',
    tags: ['B2B', 'Recruitment', 'Corporate', 'Hiring'],
    body: `📋 *Streamline Your Recruitment & Executive Hiring*

Greetings {{name}},

Finding the right technical and operational talent shouldn't slow down {{company}}'s strategic growth.

At Shri Shyam Consulting, we provide end-to-end recruitment solutions tailored to your team's exact mandates:
🔹 Tech & Engineering Hiring (AI Engineers, Fullstack Devs, Cloud Architects)
🔹 Corporate Staffing & Lateral Recruitment
🔹 Pre-screened & Vetted Candidate Matrices with 72-hour turnaround

Would you be open to a brief 5-minute introductory call this week to review our active candidate bench?`,
    buttons: [
      { id: 'b4', type: 'quick_reply', text: '📩 Request Talent Profile Matrix' },
      { id: 'b5', type: 'quick_reply', text: '📞 Schedule 5-Min Discovery Call' },
      { id: 'b6', type: 'quick_reply', text: '❌ Not Hiring Right Now' },
    ],
    variables: ['{{name}}', '{{company}}'],
  },
  {
    id: 'tmpl-special-flash-offer',
    title: '⚡ 48-Hour Weekend Flash Sale / Special Announcement',
    category: 'Special Announcement',
    description: 'Urgency-driven discount announcement with countdown and immediate CTA.',
    tags: ['Promo', 'Discount', 'Urgency', 'Flash Sale'],
    body: `⚡ *[Special Announcement / Exclusive 48-Hour Window]*

Hi {{name}},

Are you ready to scale your business with official WhatsApp automation and AI-driven growth systems?

We’ve just unlocked a flash 40% discount for {{company}} on our complete Enterprise Automation Suite:
✅ Automate customer replies 24/7 with zero delay
✅ Reach thousands of qualified leads instantly with Anti-Ban Protection
✅ Boost sales conversions by up to 3x with verified WhatsApp workflows

🔥 *Exclusive Promo:* Use code *VIPGROWTH* before midnight tomorrow!

📍 *Offer valid for the first 50 seats only.*`,
    buttons: [
      { id: 'b7', type: 'url', text: '🔗 Claim 40% Discount (URL)', value: 'https://shrishyam.edu/register?code=VIPGROWTH' },
      { id: 'b8', type: 'call', text: '📞 Call Senior Consultant', value: '+919876543210' },
      { id: 'b9', type: 'quick_reply', text: '💬 Request Custom Quote' },
    ],
    variables: ['{{name}}', '{{company}}'],
  },
  {
    id: 'tmpl-webinar-live-invite',
    title: '🎙️ Live Webinar & Demo Day Invitation',
    category: 'Event',
    description: 'Invite leads to a live Zoom/YouTube workshop with calendar reservation.',
    tags: ['Webinar', 'Event', 'Live Stream', 'Training'],
    body: `🎙️ *Live Masterclass: How to Build Autonomous AI Agents in 2026*

Hello {{name}},

You're cordially invited to our exclusive live interactive session this Thursday at 7:00 PM IST.

What we'll demonstrate live:
🔹 Zero-code automated workflows that connect WhatsApp to Google Sheets
🔹 Deploying 24/7 voice and text AI agents with Gemini 3.8 Flash
🔹 Safe bulk outreach tactics that avoid account restrictions

🎟️ *Complimentary VIP Access Reserved for:* {{name}} ({{company}})
📅 *Date:* Thursday, 7:00 PM IST (Zoom & YouTube Live)`,
    buttons: [
      { id: 'b10', type: 'url', text: '🎟️ Reserve Free Zoom Seat', value: 'https://zoom.us/webinar/register/ai2026' },
      { id: 'b11', type: 'quick_reply', text: '📅 Add to Google Calendar' },
      { id: 'b12', type: 'quick_reply', text: '📹 Send Recording Link Later' },
    ],
    variables: ['{{name}}', '{{company}}'],
  },
  {
    id: 'tmpl-invoice-payment-reminder',
    title: '🔔 Invoice & Subscription Renewal Reminder',
    category: 'Billing',
    description: 'Polite and clear billing notice with direct payment link and receipt request.',
    tags: ['Billing', 'Finance', 'Invoices', 'Accounts'],
    body: `🔔 *Friendly Reminder: Pending Invoice / Service Renewal*

Dear {{name}},

Hope you're having a productive week at {{company}}.

This is a courtesy reminder regarding the pending invoice for your active service subscription (Plan: {{course}}).

📄 *Account Summary:*
• Account Holder: {{name}}
• Due Date: Immediate / Grace Period active
• Status: Pending verification

To ensure uninterrupted service and 24/7 API gateway uptime, please complete your transaction using the secure payment link below.`,
    buttons: [
      { id: 'b13', type: 'url', text: '💳 Pay Securely Online', value: 'https://billing.shrishyam.edu/pay' },
      { id: 'b14', type: 'call', text: '📞 Call Accounts Desk', value: '+919876543210' },
      { id: 'b15', type: 'quick_reply', text: '🧾 Already Paid / Send Receipt' },
    ],
    variables: ['{{name}}', '{{company}}', '{{course}}'],
  },
  {
    id: 'tmpl-client-feedback-nps',
    title: '⭐ Client Feedback & Google Review Request',
    category: 'FollowUp',
    description: 'Post-project satisfaction survey to collect 5-star ratings and testimonials.',
    tags: ['Feedback', 'Reviews', 'NPS', 'Customer Success'],
    body: `⭐ *How was your experience with Shri Shyam Consulting?*

Hi {{name}},

Thank you for choosing our platform for {{company}}'s automation initiatives!

Our team is dedicated to delivering excellence. Could you take 30 seconds to share your honest feedback?

Your thoughts help us continuously refine our AI solutions and deliver even better results.`,
    buttons: [
      { id: 'b16', type: 'url', text: '⭐ Leave a 5-Star Review', value: 'https://g.page/r/shrishyam/review' },
      { id: 'b17', type: 'quick_reply', text: '👍 Excellent Experience' },
      { id: 'b18', type: 'quick_reply', text: '💬 Request Manager Follow-up' },
    ],
    variables: ['{{name}}', '{{company}}'],
  },
  {
    id: 'tmpl-free-youtube-media',
    title: '🎬 Free YouTube Video & AI Assets Showcase (Rashmi Sondhi)',
    category: 'Media',
    description: 'Promote new YouTube animated videos and free AI image generation tools.',
    tags: ['YouTube', 'Video', 'Media Studio', 'Free Tools'],
    body: `🎬 *New Release: Free AI Video & Image Creation Suite!*

Hi {{name}},

Great news! We've just published a brand new free masterclass on YouTube produced by *Rashmi Sondhi*:

📺 *"How to Automate 10,000 WhatsApp Leads & Build Free Animated AI Videos"*

Key takeaways in this 15-minute tutorial:
✨ Creating viral animated 9:16 Shorts & 16:9 YouTube videos at zero cost
✨ Instant 4K thumbnail generation without designers
✨ Anti-ban safety secrets for bulk business messaging

Watch the full tutorial completely free — no subscription or credit card needed!`,
    buttons: [
      { id: 'b19', type: 'url', text: '▶️ Watch Video on YouTube', value: 'https://youtube.com/@RashmiSondhiAI' },
      { id: 'b20', type: 'url', text: '🎨 Open Free Media Studio', value: 'https://shrishyam.edu/media' },
      { id: 'b21', type: 'quick_reply', text: '📥 Get Free Video Templates' },
    ],
    variables: ['{{name}}'],
  },
  {
    id: 'tmpl-vip-onboarding',
    title: '🤝 VIP Welcome & New Member Onboarding',
    category: 'FollowUp',
    description: 'Warm welcome message for new clients, students, or signups with key resources.',
    tags: ['Onboarding', 'Welcome', 'VIP', 'Community'],
    body: `🤝 *Welcome to the Shri Shyam Family, {{name}}!*

We are thrilled to partner with you and {{company}}!

Here are 3 quick steps to get the absolute most out of your membership:
1️⃣ Access your student / client portal
2️⃣ Join our Private WhatsApp VIP Community for daily updates
3️⃣ Schedule your complimentary 1-on-1 strategy onboarding call

If you ever need assistance, our support team is available 24/7 right here on WhatsApp!`,
    buttons: [
      { id: 'b22', type: 'url', text: '🌐 Access Member Portal', value: 'https://portal.shrishyam.edu' },
      { id: 'b23', type: 'quick_reply', text: '📅 Book 1-on-1 Onboarding' },
      { id: 'b24', type: 'quick_reply', text: '👥 Join WhatsApp VIP Group' },
    ],
    variables: ['{{name}}', '{{company}}'],
  },
  {
    id: 'tmpl-winback-reactivation',
    title: '💫 "We Miss You" Inactive Lead Win-Back',
    category: 'Special Announcement',
    description: 'Re-engage cold contacts and past leads with a special renewal bonus.',
    tags: ['WinBack', 'Reactivation', 'Sales', 'Leads'],
    body: `💫 *It's been a while, {{name}}!*

We noticed it's been a few weeks since we connected regarding {{company}}'s automation goals.

A lot has improved since our last chat:
🚀 Upgraded to Gemini 3.8 Flash with 4x faster response speeds
🚀 Built-in YouTube Video & Animated Media Generator
🚀 Zero-ban multi-SIM WhatsApp rotation algorithms

We'd love to welcome you back with a special 2,000 bonus credits added to your account!`,
    buttons: [
      { id: 'b25', type: 'quick_reply', text: '🎁 Claim 2,000 Free Credits' },
      { id: 'b26', type: 'call', text: '📞 Talk to Account Director', value: '+919876543210' },
      { id: 'b27', type: 'quick_reply', text: '🚫 Unsubscribe / Stop' },
    ],
    variables: ['{{name}}', '{{company}}'],
  },
  {
    id: 'tmpl-lead-magnet-syllabus',
    title: '📚 Free Course Syllabus & Curriculum Download',
    category: 'Masterclass',
    description: 'Instant document delivery message for prospects requesting course details.',
    tags: ['LeadMagnet', 'Syllabus', 'Curriculum', 'Download'],
    body: `📚 *Here is your requested Course Syllabus, {{name}}!*

Thank you for your interest in our {{course}} program!

We've prepared the complete comprehensive curriculum including:
✅ Module-by-module breakdown (6 Weeks Hands-On)
✅ Capstone Real-World AI Project Specs
✅ Certification credentials accredited by industry leaders
✅ Hiring partner network and placement support guidelines

You can view the PDF instantly below or schedule a call with our career mentor.`,
    buttons: [
      { id: 'b28', type: 'url', text: '📥 Download Syllabus (PDF)', value: 'https://shrishyam.edu/assets/syllabus.pdf' },
      { id: 'b29', type: 'call', text: '📞 Talk to Counselor', value: '+919876543210' },
      { id: 'b30', type: 'quick_reply', text: '💳 Inquire Fee Structure' },
    ],
    variables: ['{{name}}', '{{course}}'],
  },
  {
    id: 'tmpl-consultation-booking',
    title: '📅 1-on-1 AI Strategy Discovery Session',
    category: 'FollowUp',
    description: 'Invite prospective B2B clients to book a high-value strategy call on Calendly.',
    tags: ['Consultation', 'B2B', 'Calendly', 'Strategy'],
    body: `📅 *Complimentary 1-on-1 AI Strategy Session for {{company}}*

Hi {{name}},

Are you evaluating how generative AI and robotic process automation can reduce overhead for {{company}} in 2026?

I'm opening a few slots this Friday for a complimentary 20-minute Strategy Discovery Session. We'll audit your existing workflow bottlenecks and map out a bespoke low-code roadmap.

Zero sales pitch — pure tactical architectural advice.`,
    buttons: [
      { id: 'b31', type: 'url', text: '📆 Select Convenient Time', value: 'https://calendly.com/rashmisondhi/ai-strategy' },
      { id: 'b32', type: 'quick_reply', text: '💬 Share Preliminary Questions' },
    ],
    variables: ['{{name}}', '{{company}}'],
  },
  {
    id: 'tmpl-order-confirmation',
    title: '📦 Order Confirmation & Shipping Dispatch',
    category: 'Billing',
    description: 'Transactional confirmation message with live tracking link and support contact.',
    tags: ['ECommerce', 'Shipping', 'Confirmation', 'Orders'],
    body: `📦 *Order Confirmed & Processing!*

Hi {{name}},

Thank you for your order with Shri Shyam Enterprise!

Your order has been logged and is currently being prepared for dispatch.
• Order ID: #SS-{{phone}}
• Destination: {{company}}
• Estimated Delivery: 2-3 Business Days

Track your parcel in real-time or reach out to our logistics desk if you have any questions.`,
    buttons: [
      { id: 'b33', type: 'url', text: '🚚 Track Live Dispatch', value: 'https://track.shrishyam.edu/orders' },
      { id: 'b34', type: 'call', text: '📞 Logistics Helpline', value: '+919876543210' },
    ],
    variables: ['{{name}}', '{{company}}', '{{phone}}'],
  },
];

export const TEMPLATE_CATEGORIES = [
  'All',
  'Masterclass',
  'Recruitment',
  'Special Announcement',
  'Event',
  'FollowUp',
  'Billing',
  'Media',
  'Custom',
] as const;

export const AVAILABLE_VARIABLES = [
  { tag: '{{name}}', label: 'Full Name', example: 'Vikram Mehta' },
  { tag: '{{company}}', label: 'Company / Org', example: 'Apex Tech Labs' },
  { tag: '{{course}}', label: 'Course / Mandate', example: 'AI/ML Masterclass' },
  { tag: '{{phone}}', label: 'Phone Number', example: '+91 98231 44210' },
  { tag: '{{discount}}', label: 'Discount Code', example: 'VIPGROWTH' },
  { tag: '{{date}}', label: 'Event Date', example: 'This Thursday 7:00 PM' },
  { tag: '{{link}}', label: 'Action URL', example: 'https://shrishyam.edu/enroll' },
];
