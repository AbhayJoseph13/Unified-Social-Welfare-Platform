export enum ModuleType {
  DASHBOARD = 'DASHBOARD',
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
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
}

export interface UserProfile {
  name: string;
  email: string;
  karmaPoints: number;
  role: 'CITIZEN' | 'NGO' | 'GOVT' | 'VOLUNTEER' | 'ADMIN';
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