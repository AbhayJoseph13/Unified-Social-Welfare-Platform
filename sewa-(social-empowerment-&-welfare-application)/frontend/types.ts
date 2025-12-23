
export enum ModuleType {
  HOME = 'HOME', // New Home Page
  PROFILE = 'PROFILE', // Replaces DASHBOARD as main view
  DASHBOARD = 'DASHBOARD', // Deprecated but kept for type safety if needed
  REPORT_ISSUE = 'REPORT_ISSUE',
  HEALTH_SAFETY = 'HEALTH_SAFETY',
  EDUCATION = 'EDUCATION',
  COMMUNITY = 'COMMUNITY',
  SUSTAINABILITY = 'SUSTAINABILITY',
  ANIMAL_RESCUE = 'ANIMAL_RESCUE',
  SENIOR_SUPPORT = 'SENIOR_SUPPORT',
  DONATIONS = 'DONATIONS',
  AI_CHAT = 'AI_CHAT',
  BLOOD_DONATION = 'BLOOD_DONATION',
  SOS = 'SOS',
  JOBS = 'JOBS',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
}

export interface UserProfile {
  name: string;
  email: string;
  phoneNumber?: string;
  karmaPoints: number;
  role: 'CITIZEN' | 'NGO' | 'GOVT' | 'VOLUNTEER' | 'ADMIN';
  avatar?: string;
}

export interface IssueReport {
  id: string;
  category: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  status: 'PENDING' | 'RESOLVED';
  timestamp: number;
  location?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface NewsArticle {
  title: string;
  description: string;
  content?: string;
  url: string;
  image: string;
  publishedAt: string;
  source: {
    name: string;
    url?: string;
  };
}

export interface BlogPost {
  id: string;
  title: string;
  author: string;
  content: string;
  date: string;
  likes: number;
  category: string;
  image?: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  members: number;
  image?: string;
}

export interface GroupMessage {
  id: string;
  text: string;
  sender: string;
  isMe: boolean;
  timestamp: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance' | 'Volunteer';
  salaryRange: string;
  description: string;
  requirements: string[];
  postedBy: string; // User ID of employer
  postedAt: string;
  applicantsCount: number;
}

export interface JobApplication {
  id: string;
  jobId: string;
  applicantId: string;
  applicantName: string;
  resumeLink?: string;
  coverLetter?: string;
  status: 'Applied' | 'Screening' | 'Interview' | 'Offer' | 'Rejected';
  aiMatchScore: number; // 0-100
  appliedAt: string;
}
