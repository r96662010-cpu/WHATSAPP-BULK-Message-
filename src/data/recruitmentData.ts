import { RecruitmentCandidate } from '../types';

export const INITIAL_CANDIDATES: RecruitmentCandidate[] = [
  {
    id: 'cand-001',
    fullName: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    contactNumber: '+91 98201 12345',
    currentLocation: 'Bangalore',
    preferredLocations: ['PAN India', 'Bangalore', 'Work from Home (Remote)'],
    positionApplied: 'AI/ML Science Specialist',
    keySkills: 'Python, PyTorch, TensorFlow, LLM Fine-tuning, LangChain, RAG architectures, FastAPI',
    totalExperience: '3–5 Years',
    relevantExperience: '3.5 years in Generative AI and production model deployment',
    currentCtc: '₹14 LPA',
    expectedCtc: '₹20 LPA',
    noticePeriod: '15 Days',
    reasonForChange: 'Seeking core product AI role focusing on multi-modal AI agents and robotics automation.',
    resumeFileName: 'Aarav_Sharma_AI_Lead_Resume.pdf',
    resumeFileSize: '2.4 MB',
    submittedAt: '2026-10-18T10:30:00Z',
    status: 'shortlisted',
    notes: 'Strong hands-on vibe coding and PyTorch background. High priority candidate.',
  },
  {
    id: 'cand-002',
    fullName: 'Priya Iyer',
    email: 'priya.iyer@example.com',
    contactNumber: '+91 98450 67890',
    currentLocation: 'Mumbai',
    preferredLocations: ['PAN India', 'Mumbai', 'Pune'],
    positionApplied: 'Software Engineer',
    keySkills: 'React, TypeScript, Node.js, Express, PostgreSQL, Tailwind CSS, Docker, Vite',
    totalExperience: '1–2 Years',
    relevantExperience: '2 years full-stack development in fintech SaaS applications',
    currentCtc: '₹7.5 LPA',
    expectedCtc: '₹11 LPA',
    noticePeriod: 'Immediate',
    reasonForChange: 'Looking for fast-paced growth and modern TypeScript/React stack.',
    resumeFileName: 'Priya_Iyer_FullStack_CV.pdf',
    resumeFileSize: '1.8 MB',
    submittedAt: '2026-10-18T14:15:00Z',
    status: 'interview_scheduled',
    notes: 'Available immediately. Scheduled for technical interview on Google Meet.',
  },
  {
    id: 'cand-003',
    fullName: 'Rohan Deshmukh',
    email: 'rohan.d@example.com',
    contactNumber: '+91 99700 45612',
    currentLocation: 'Pune',
    preferredLocations: ['PAN India', 'Work from Home (Remote)'],
    positionApplied: 'Python Developer',
    keySkills: 'Python 3.12, Django REST, Celery, Redis, Microservices, AWS Lambda, NumPy, Pandas',
    totalExperience: '3–5 Years',
    relevantExperience: '4 years backend Python development and automated data pipelines',
    currentCtc: '₹10 LPA',
    expectedCtc: '₹15 LPA',
    noticePeriod: '30 Days',
    reasonForChange: 'Project contract ending; seeking permanent technical leadership opportunities.',
    resumeFileName: 'Rohan_Deshmukh_Python_Lead.docx',
    resumeFileSize: '3.1 MB',
    submittedAt: '2026-10-19T06:20:00Z',
    status: 'new',
    notes: 'Solid algorithmic foundation and clean asynchronous Python experience.',
  },
  {
    id: 'cand-004',
    fullName: 'Meera Nair',
    email: 'meera.nair@example.com',
    contactNumber: '+91 97112 34567',
    currentLocation: 'Delhi NCR',
    preferredLocations: ['PAN India', 'Delhi NCR', 'Work from Home (Remote)'],
    positionApplied: 'HR Manager & Talent Acquisition',
    keySkills: 'Tech Recruitment, LinkedIn Recruiter, Applicant Tracking Systems, Employee Relations, Salary Benchmarking',
    totalExperience: '5+ Years',
    relevantExperience: '6 years scaling high-growth tech startups from 20 to 200+ engineers',
    currentCtc: '₹12 LPA',
    expectedCtc: '₹16 LPA',
    noticePeriod: '60 Days',
    reasonForChange: 'Relocating to Delhi NCR and looking to build technical recruitment org.',
    resumeFileName: 'Meera_Nair_HRM_Profile.pdf',
    resumeFileSize: '1.2 MB',
    submittedAt: '2026-10-17T18:40:00Z',
    status: 'reviewed',
    notes: 'Strong network for hiring AI/ML and engineering talent across India.',
  },
  {
    id: 'cand-005',
    fullName: 'Karan Verma',
    email: 'karan.verma@example.com',
    contactNumber: '+91 98102 99887',
    currentLocation: 'Hyderabad',
    preferredLocations: ['PAN India', 'Hyderabad', 'Bangalore'],
    positionApplied: 'Sales Executive & Client Partnerships',
    keySkills: 'B2B Tech Sales, Enterprise Lead Generation, SaaS Demos, Account Management, CRM Closing',
    totalExperience: '1–2 Years',
    relevantExperience: '1.5 years in educational & AI training solutions sales',
    currentCtc: '₹5 LPA',
    expectedCtc: '₹8 LPA',
    noticePeriod: '15 Days',
    reasonForChange: 'Looking for product-based enterprise software and workshop sales.',
    resumeFileName: 'Karan_Verma_Sales_CV.pdf',
    resumeFileSize: '950 KB',
    submittedAt: '2026-10-19T01:10:00Z',
    status: 'new',
    notes: 'High energy, strong phone presence, perfect fit for workshop registrations.',
  },
  {
    id: 'cand-006',
    fullName: 'Ananya Deshpande',
    email: 'ananya.deshpande@example.com',
    contactNumber: '+91 99304 88712',
    currentLocation: 'Bangalore',
    preferredLocations: ['PAN India', 'Bangalore', 'Work from Home (Remote)'],
    positionApplied: 'Full Stack Developer',
    keySkills: 'Next.js, React, Node.js, GraphQL, PostgreSQL, Tailwind CSS, Redis, Docker',
    totalExperience: '3–5 Years',
    relevantExperience: '3 years building scalable enterprise SaaS products with real-time WebSockets',
    currentCtc: '₹13 LPA',
    expectedCtc: '₹18 LPA',
    noticePeriod: '30 Days',
    reasonForChange: 'Seeking role with high architecture ownership and modern full-stack workflows.',
    resumeFileName: 'Ananya_Deshpande_FullStack_Resume.pdf',
    resumeFileSize: '2.1 MB',
    submittedAt: '2026-10-18T16:20:00Z',
    status: 'shortlisted',
    notes: 'Outstanding technical assessment in React and microservices architecture.',
  },
  {
    id: 'cand-007',
    fullName: 'Tanmay Saxena',
    email: 'tanmay.saxena@example.com',
    contactNumber: '+91 98210 54321',
    currentLocation: 'Gurgaon',
    preferredLocations: ['PAN India', 'Delhi NCR', 'Work from Home (Remote)'],
    positionApplied: 'Prompt Engineer & Vibe Coder',
    keySkills: 'System Prompt Engineering, Claude 3.5 Sonnet, Gemini Flash, Cursor, Few-Shot Evaluation, Python',
    totalExperience: '1–2 Years',
    relevantExperience: '1.5 years fine-tuning prompts, evaluation harnesses, and LLM agent orchestration',
    currentCtc: '₹9 LPA',
    expectedCtc: '₹14 LPA',
    noticePeriod: 'Immediate',
    reasonForChange: 'Passionate about vibe coding and high-velocity prototype generation.',
    resumeFileName: 'Tanmay_Saxena_PromptEngineer_CV.pdf',
    resumeFileSize: '1.4 MB',
    submittedAt: '2026-10-19T03:45:00Z',
    status: 'interview_scheduled',
    notes: 'Immediate joiner. Exceptional capability in multi-turn reasoning and tool use workflows.',
  },
  {
    id: 'cand-008',
    fullName: 'Divya Nambiar',
    email: 'divya.nambiar@example.com',
    contactNumber: '+91 94471 22334',
    currentLocation: 'Kochi',
    preferredLocations: ['PAN India', 'Bangalore', 'Work from Home (Remote)'],
    positionApplied: 'Data Scientist & Analytics Lead',
    keySkills: 'Pandas, NumPy, Scikit-Learn, PyTorch, BigQuery, Tableau, Statistical Modeling, SQL',
    totalExperience: '5+ Years',
    relevantExperience: '5.5 years leading predictive analytics and customer cohort modeling',
    currentCtc: '₹16 LPA',
    expectedCtc: '₹22 LPA',
    noticePeriod: '30 Days',
    reasonForChange: 'Relocating to Bangalore and looking for a high-impact data analytics leadership role.',
    resumeFileName: 'Divya_Nambiar_DataLead.pdf',
    resumeFileSize: '2.8 MB',
    submittedAt: '2026-10-17T11:00:00Z',
    status: 'shortlisted',
    notes: 'Extensive background in production predictive models and business analytics dashboards.',
  },
  {
    id: 'cand-009',
    fullName: 'Siddharth Rao',
    email: 'siddharth.rao@example.com',
    contactNumber: '+91 98400 99112',
    currentLocation: 'Chennai',
    preferredLocations: ['PAN India', 'Chennai', 'Bangalore'],
    positionApplied: 'Software Engineer',
    keySkills: 'Go, Java, Distributed Systems, Kafka, Kubernetes, Microservices, PostgreSQL',
    totalExperience: '3–5 Years',
    relevantExperience: '4 years high throughput backend systems and message queuing',
    currentCtc: '₹12.5 LPA',
    expectedCtc: '₹17 LPA',
    noticePeriod: '15 Days',
    reasonForChange: 'Company reorganizing; seeking core infrastructure engineering role.',
    resumeFileName: 'Siddharth_Rao_Backend_CV.pdf',
    resumeFileSize: '1.9 MB',
    submittedAt: '2026-10-18T19:30:00Z',
    status: 'new',
    notes: '15 days notice period. Excellent low-latency distributed systems background.',
  },
  {
    id: 'cand-010',
    fullName: 'Rhea Sen',
    email: 'rhea.sen@example.com',
    contactNumber: '+91 98301 77665',
    currentLocation: 'Kolkata',
    preferredLocations: ['PAN India', 'Work from Home (Remote)', 'Mumbai'],
    positionApplied: 'Digital Marketing & Content Lead',
    keySkills: 'Meta Ads Manager, Google Performance Max, SEO, Copywriting, WhatsApp Lead Funnels, Influencer ROI',
    totalExperience: '3–5 Years',
    relevantExperience: '3.5 years managing ₹50L+ monthly performance ad spend and conversion funnels',
    currentCtc: '₹8 LPA',
    expectedCtc: '₹12 LPA',
    noticePeriod: 'Immediate',
    reasonForChange: 'Seeking fast-growing startup with high experimentation budget.',
    resumeFileName: 'Rhea_Sen_PerformanceMarketing.pdf',
    resumeFileSize: '1.3 MB',
    submittedAt: '2026-10-19T05:15:00Z',
    status: 'shortlisted',
    notes: 'Immediate joiner. Strong track record with Meta click-to-WhatsApp campaign ROAS.',
  },
  {
    id: 'cand-011',
    fullName: 'Arjun Mathur',
    email: 'arjun.mathur@example.com',
    contactNumber: '+91 98765 11223',
    currentLocation: 'Ahmedabad',
    preferredLocations: ['PAN India', 'Bangalore', 'Pune'],
    positionApplied: 'Robotics & Automation Engineer',
    keySkills: 'ROS 2, C++, Python, Computer Vision, SLAM, Kinematics, OpenCV, Embedded Linux',
    totalExperience: '1–2 Years',
    relevantExperience: '2 years industrial AGV and computer vision navigation algorithms',
    currentCtc: '₹6.5 LPA',
    expectedCtc: '₹10 LPA',
    noticePeriod: '15 Days',
    reasonForChange: 'Looking to join modern AI-enabled robotics and autonomous hardware team.',
    resumeFileName: 'Arjun_Mathur_Robotics_Resume.pdf',
    resumeFileSize: '3.4 MB',
    submittedAt: '2026-10-18T08:50:00Z',
    status: 'new',
    notes: 'Passionate about ROS 2 and Edge AI hardware integration.',
  },
  {
    id: 'cand-012',
    fullName: 'Neha Kapoor',
    email: 'neha.kapoor@example.com',
    contactNumber: '+91 98111 65432',
    currentLocation: 'Delhi NCR',
    preferredLocations: ['PAN India', 'Delhi NCR', 'Work from Home (Remote)'],
    positionApplied: 'Software Engineer',
    keySkills: 'React, Redux Toolkit, TypeScript, Next.js, Jest, Web Vitals, Tailwind CSS',
    totalExperience: 'Fresher / Less than 1 Year',
    relevantExperience: '10 months internship & production React frontend development',
    currentCtc: '₹4.5 LPA',
    expectedCtc: '₹7 LPA',
    noticePeriod: 'Immediate',
    reasonForChange: 'Seeking full-time high-velocity development role.',
    resumeFileName: 'Neha_Kapoor_Frontend_Dev.pdf',
    resumeFileSize: '1.1 MB',
    submittedAt: '2026-10-19T07:05:00Z',
    status: 'new',
    notes: 'Fast learner, built multiple responsive React applications.',
  },
];

export const JOB_POSITIONS = [
  'Software Engineer',
  'AI/ML Science Specialist',
  'Full Stack Developer',
  'Python Developer',
  'Prompt Engineer & Vibe Coder',
  'Data Scientist & Analytics Lead',
  'HR Manager & Talent Acquisition',
  'Sales Executive & Partnerships',
  'Digital Marketing & Content Lead',
  'Robotics & Automation Engineer',
];

export const EXPERIENCE_RANGES = [
  'Fresher / Less than 1 Year',
  '1–2 Years',
  '3–5 Years',
  '5+ Years',
];

export const NOTICE_PERIODS = [
  'Immediate',
  '15 Days',
  '30 Days',
  '60 Days',
  '90 Days',
];

export const PREFERRED_LOCATION_OPTIONS = [
  'PAN India',
  'Work from Home (Remote)',
  'Delhi NCR',
  'Bangalore',
  'Mumbai',
  'Hyderabad',
  'Pune',
  'Chennai',
  'Kolkata',
];

// Complete Google Apps Script to auto-generate the Google Form and link with Google Sheet
export const generateGoogleAppsScript = (companyName: string = 'M/s Shri Shyam Consultant') => {
  return `/**
 * Google Apps Script to automatically generate the complete Recruitment Google Form
 * and link it directly with a Google Sheet.
 *
 * HOW TO RUN:
 * 1. Visit https://script.google.com and click "+ New project"
 * 2. Paste this complete code into Code.gs
 * 3. Click "Run" -> select "createRecruitmentForm"
 * 4. Grant permissions when prompted.
 * 5. Check your execution log for the Published Form URL and Linked Sheet URL!
 */

function createRecruitmentForm() {
  const companyName = "${companyName.replace(/"/g, '\\"')}";
  
  // 1. Create the Google Form
  const form = FormApp.create("Job Application Form - " + companyName);
  
  // 2. Set Form Description
  form.setDescription(
    "[" + companyName + "] – Job Application Form\\n\\n" +
    "Thank you for your interest in joining our team! Please fill out the details below accurately " +
    "and attach your updated resume. Our talent acquisition team will review your application and " +
    "reach out if your profile matches our requirements.\\n\\n" +
    "Mode: PAN India & Remote Roles Available\\n" +
    "Contact: talent@" + companyName.toLowerCase().replace(/[^a-z0-9]/g, '') + ".in"
  );
  
  form.setConfirmationMessage(
    "Thank you for applying to " + companyName + "! Your application has been successfully received. " +
    "Our HR team will reach out via WhatsApp and Email for the next steps."
  );
  form.setAllowResponseEdits(true);
  form.setPublishingSummary(true);

  // 1. Full Name (Short answer, Required)
  const nameItem = form.addTextItem();
  nameItem.setTitle("Full Name")
    .setHelpText("Enter your full legal name as per government ID")
    .setRequired(true);

  // 2. Email ID (Short answer, Required with Email Validation)
  const emailItem = form.addTextItem();
  emailItem.setTitle("Email ID")
    .setHelpText("Active email address where interview calls will be sent")
    .setRequired(true);
  const emailValidation = FormApp.createTextValidation()
    .requireTextIsEmail()
    .setHelpText("Please enter a valid email address.")
    .build();
  emailItem.setValidation(emailValidation);

  // 3. Contact Number (Short answer, Required with Number Validation)
  const phoneItem = form.addTextItem();
  phoneItem.setTitle("Contact Number (WhatsApp Enabled)")
    .setHelpText("10-digit mobile number with country code (e.g. +91 9876543210)")
    .setRequired(true);
  const phoneValidation = FormApp.createTextValidation()
    .requireTextMatchesPattern("^[+]?[0-9\\\\s-]{10,15}$")
    .setHelpText("Please enter a valid 10-digit contact number.")
    .build();
  phoneItem.setValidation(phoneValidation);

  // 4. Current Location (Short answer, Required)
  const locationItem = form.addTextItem();
  locationItem.setTitle("Current Location")
    .setHelpText("City and State (e.g., Mumbai, Bangalore, Delhi NCR, Remote)")
    .setRequired(true);

  // 5. Preferred Location(s) (Checkboxes, Required)
  const prefLocItem = form.addCheckboxItem();
  prefLocItem.setTitle("Preferred Location(s)")
    .setHelpText("Select all locations where you are open to work")
    .setChoiceValues([
      "PAN India",
      "Work from Home (Remote)",
      "Delhi NCR",
      "Bangalore",
      "Mumbai",
      "Hyderabad",
      "Pune",
      "Chennai"
    ])
    .setRequired(true);

  // 6. Position Applied For (Dropdown, Required)
  const positionItem = form.addListItem();
  positionItem.setTitle("Position Applied For")
    .setHelpText("Select the opening you are applying for")
    .setChoiceValues([
      "Software Engineer",
      "AI/ML Science Specialist",
      "Full Stack Developer",
      "Python Developer",
      "Prompt Engineer & Vibe Coder",
      "Data Scientist & Analytics Lead",
      "HR Manager & Talent Acquisition",
      "Sales Executive & Partnerships",
      "Digital Marketing & Content Lead",
      "Robotics & Automation Engineer"
    ])
    .setRequired(true);

  // 7. Key Skills (Paragraph, Required)
  const skillsItem = form.addParagraphTextItem();
  skillsItem.setTitle("Key Skills")
    .setHelpText("List your primary skills, tech stack, libraries, tools, and certifications")
    .setRequired(true);

  // 8. Total Work Experience (Dropdown, Required)
  const expItem = form.addListItem();
  expItem.setTitle("Total Work Experience")
    .setHelpText("Select total career experience")
    .setChoiceValues([
      "Fresher / Less than 1 Year",
      "1–2 Years",
      "3–5 Years",
      "5+ Years"
    ])
    .setRequired(true);

  // 9. Relevant Experience (Short answer, Required)
  const relExpItem = form.addTextItem();
  relExpItem.setTitle("Relevant Experience")
    .setHelpText("Years/Months of experience strictly relevant to this specific applied role")
    .setRequired(true);

  // 10. Current CTC (per annum) (Short answer, Required)
  const currentCtcItem = form.addTextItem();
  currentCtcItem.setTitle("Current CTC (per annum)")
    .setHelpText("e.g. ₹8 LPA or N/A (Fresher)")
    .setRequired(true);

  // 11. Expected CTC (per annum) (Short answer, Required)
  const expectedCtcItem = form.addTextItem();
  expectedCtcItem.setTitle("Expected CTC (per annum)")
    .setHelpText("e.g. ₹12 LPA or Negotiable")
    .setRequired(true);

  // 12. Notice Period (Dropdown, Required)
  const noticeItem = form.addListItem();
  noticeItem.setTitle("Notice Period")
    .setHelpText("Select your joining availability")
    .setChoiceValues([
      "Immediate",
      "15 Days",
      "30 Days",
      "60 Days",
      "90 Days"
    ])
    .setRequired(true);

  // 13. Reason for Change (Paragraph, Required)
  const reasonItem = form.addParagraphTextItem();
  reasonItem.setTitle("Reason for Change")
    .setHelpText("Briefly explain why you are looking for a job change and what excites you about this role")
    .setRequired(true);

  // 14. Link Responses to a new Google Sheet
  const sheet = SpreadsheetApp.create("Candidate Applications - " + companyName);
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());

  Logger.log("🎉 SUCCESS! Google Form Created.");
  Logger.log("🔗 Published Form URL: " + form.getPublishedUrl());
  Logger.log("✏️ Form Edit URL: " + form.getEditUrl());
  Logger.log("📊 Linked Google Sheet URL: " + sheet.getUrl());
}
`;
};
