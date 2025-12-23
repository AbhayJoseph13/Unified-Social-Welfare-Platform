
import { UserProfile, IssueReport, NewsArticle, BlogPost, Group, Job, JobApplication } from '../types';
import { fetchRealTimeNews } from './geminiService';

// Point to the backend server port. 
// If you are running locally, ensure node server.js is running on 3001.
const BASE_URL = 'http://localhost:3001'; 

// --- MOCK FALLBACK SYSTEM ---
// This ensures the app works even if the backend server is not running.
const mockDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getMockUsers = (): any[] => JSON.parse(localStorage.getItem('sewa_mock_users') || '[]');
const saveMockUser = (user: any) => {
  const users = getMockUsers();
  // Update or add
  const idx = users.findIndex((u: any) => u.email === user.email);
  if (idx >= 0) {
    users[idx] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem('sewa_mock_users', JSON.stringify(users));
};

const MOCK_NGOS = [
  {
    id: '1',
    name: "Future Scholars Foundation",
    cause: "Education",
    description: "Providing textbooks, uniforms, and scholarships to underprivileged children in rural districts.",
    image: "https://picsum.photos/400/250?random=101",
    raised: 15400,
    goal: 50000,
    status: 'APPROVED'
  },
  {
    id: '2',
    name: "Green Earth Alliance",
    cause: "Environment",
    description: "Planting 10,000 trees this monsoon season to combat urban heat islands.",
    image: "https://picsum.photos/400/250?random=102",
    raised: 8200,
    goal: 10000,
    status: 'APPROVED'
  },
  {
    id: '3',
    name: "Healing Hands Medical",
    cause: "Health",
    description: "Free cataract surgeries and general health checkups for senior citizens.",
    image: "https://picsum.photos/400/250?random=103",
    raised: 45000,
    goal: 60000,
    status: 'APPROVED'
  },
  {
    id: '4',
    name: "Paws & Claws Shelter",
    cause: "Animal Welfare",
    description: "Medical aid and food for stray animals injured in recent traffic accidents.",
    image: "https://picsum.photos/400/250?random=104",
    raised: 3000,
    goal: 15000,
    status: 'APPROVED'
  },
  {
    id: '5',
    name: "Rapid Response Relief",
    cause: "Disaster Relief",
    description: "Emergency kits and temporary shelter for flood victims in the northern region.",
    image: "https://picsum.photos/400/250?random=105",
    raised: 89000,
    goal: 100000,
    status: 'APPROVED'
  }
];

// Mock Data for News (Fallback)
const MOCK_NEWS: Record<string, NewsArticle[]> = {
  global: [
    {
      title: "UN Launches New Sustainability Goals for 2030",
      description: "World leaders gather to discuss urgent climate action and social welfare strategies for the next decade.",
      url: "#",
      image: "https://picsum.photos/800/400?random=901",
      publishedAt: new Date().toISOString(),
      source: { name: "Global News Wire" }
    },
    {
      title: "Tech Giants Collaborate on Open Source Education",
      description: "Major tech companies release free educational tools for developing nations to bridge the digital divide.",
      url: "#",
      image: "https://picsum.photos/800/400?random=902",
      publishedAt: new Date().toISOString(),
      source: { name: "Tech Daily" }
    }
  ],
  national: [
    {
      title: "New Government Scheme for Rural Healthcare",
      description: "The ministry announces a budget increase for mobile clinics in remote villages starting next month.",
      url: "#",
      image: "https://picsum.photos/800/400?random=903",
      publishedAt: new Date().toISOString(),
      source: { name: "National Times" }
    },
    {
      title: "Clean River Initiative Shows Promising Results",
      description: "Water quality index improves by 15% in major industrial zones following stricter regulations.",
      url: "#",
      image: "https://picsum.photos/800/400?random=904",
      publishedAt: new Date().toISOString(),
      source: { name: "Eco Watch India" }
    }
  ],
  local: [
    {
      title: "City Park Renovation Starts This Weekend",
      description: "Local volunteers are needed for the tree plantation drive at Central Park this Saturday.",
      url: "#",
      image: "https://picsum.photos/800/400?random=905",
      publishedAt: new Date().toISOString(),
      source: { name: "City Gazette" }
    },
    {
      title: "Traffic Diversion on Main Street for Repairs",
      description: "Municipal corporation advises commuters to take alternate routes due to emergency pipeline repairs.",
      url: "#",
      image: "https://picsum.photos/800/400?random=906",
      publishedAt: new Date().toISOString(),
      source: { name: "Local Beat" }
    }
  ]
};

const MOCK_BLOGS: BlogPost[] = [
  {
    id: '1',
    title: '5 Ways to Live More Sustainably',
    author: 'Eco Warrior',
    content: 'Sustainable living is not just a trend; it is a necessity. Here are 5 simple changes you can make today: 1. Reduce plastic usage... 2. Compost organic waste...',
    date: '2024-03-10',
    likes: 124,
    category: 'Sustainability',
    image: 'https://picsum.photos/800/400?random=301'
  },
  {
    id: '2',
    title: 'My Experience Volunteering at the Animal Shelter',
    author: 'Jane Doe',
    content: 'Last weekend, I spent 5 hours at the Paws & Claws shelter. It was an eye-opening experience. The dedication of the staff is inspiring...',
    date: '2024-03-05',
    likes: 89,
    category: 'Volunteering',
    image: 'https://picsum.photos/800/400?random=302'
  }
];

const MOCK_GROUPS: Group[] = [
  {
    id: '1',
    name: 'Civic Action Team',
    description: 'Discussing local governance and cleanliness drives.',
    members: 1250,
    image: 'https://picsum.photos/100/100?random=401'
  },
  {
    id: '2',
    name: 'Tech for Good',
    description: 'Developers building tools for social impact.',
    members: 890,
    image: 'https://picsum.photos/100/100?random=402'
  },
  {
    id: '3',
    name: 'Weekend Cleanups',
    description: 'Coordinating spot-fixes every Saturday.',
    members: 450,
    image: 'https://picsum.photos/100/100?random=403'
  }
];

const MOCK_JOBS: Job[] = [
  {
    id: '1',
    title: 'Community Outreach Coordinator',
    company: 'Green Earth Alliance',
    location: 'Mumbai, India',
    type: 'Full-time',
    salaryRange: '₹30,000 - ₹45,000',
    description: 'We are looking for a passionate coordinator to manage our weekend plantation drives and community workshops.',
    requirements: ['Excellent communication skills', 'Experience in event management', 'Passion for environment'],
    postedBy: 'employer1',
    postedAt: new Date().toISOString(),
    applicantsCount: 12
  },
  {
    id: '2',
    title: 'Volunteer Math Tutor',
    company: 'Future Scholars',
    location: 'Remote',
    type: 'Volunteer',
    salaryRange: 'Unpaid',
    description: 'Teach basic mathematics to underprivileged children via Zoom on weekends.',
    requirements: ['Strong Math background', 'Patience with children', 'Available on weekends'],
    postedBy: 'employer2',
    postedAt: new Date(Date.now() - 86400000).toISOString(),
    applicantsCount: 5
  },
  {
    id: '3',
    title: 'Senior Care Assistant',
    company: 'Golden Years Home',
    location: 'Delhi, India',
    type: 'Part-time',
    salaryRange: '₹15,000 - ₹20,000',
    description: 'Assist senior citizens with daily activities and organize recreational sessions.',
    requirements: ['Nursing background preferred', 'Empathetic nature', 'Basic first aid knowledge'],
    postedBy: 'employer3',
    postedAt: new Date(Date.now() - 172800000).toISOString(),
    applicantsCount: 8
  }
];

const MOCK_APPLICATIONS: JobApplication[] = [];

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || 'Network response was not ok');
  }
  return response.json();
};

// Helper to try fetch, fallback to mock if connection fails
const tryFetchOrMock = async (
  endpoint: string, 
  options: RequestInit, 
  mockAction: () => Promise<any>
) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    return await handleResponse(response);
  } catch (error: any) {
    console.warn(`Backend unreachable (${endpoint}), falling back to mock mode.`, error);
    // Only fallback on network errors (fetch failed) or 404/500 if server is dead
    await mockDelay(800); // Simulate network latency
    return mockAction();
  }
};

export const api = {
  auth: {
    // Standard Email/Password
    async login(email: string, password: string): Promise<UserProfile> {
      return tryFetchOrMock('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      }, async () => {
        // Mock Login Logic
        const users = getMockUsers();
        const user = users.find((u: any) => u.email === email && u.password === password);
        if (!user) throw new Error("Invalid credentials (Mock Mode)");
        const sessionUser = { ...user, password: '' }; // safe user object
        localStorage.setItem('sewa_session', JSON.stringify(sessionUser));
        return sessionUser;
      });
    },

    async signup(userData: any): Promise<UserProfile> {
      return tryFetchOrMock('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      }, async () => {
        // Mock Signup Logic
        const users = getMockUsers();
        if (users.find((u: any) => u.email === userData.email)) {
          throw new Error("User already exists (Mock Mode)");
        }
        const newUser = { 
          ...userData, 
          role: userData.role || 'CITIZEN',
          karmaPoints: 0, 
          provider: 'LOCAL' 
        };
        saveMockUser(newUser);
        localStorage.setItem('sewa_session', JSON.stringify(newUser));
        return newUser;
      });
    },

    // Social OAuth
    async oauthLogin(provider: string, email: string, name: string, providerId: string): Promise<UserProfile> {
      return tryFetchOrMock('/api/auth/oauth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, email, name, providerId })
      }, async () => {
        // Mock Social Logic
        const newUser = {
          name,
          email,
          provider,
          role: 'CITIZEN',
          karmaPoints: 0
        };
        localStorage.setItem('sewa_session', JSON.stringify(newUser));
        return newUser as UserProfile;
      });
    },

    // Phone OTP
    async sendOtp(phoneNumber: string): Promise<any> {
      return tryFetchOrMock('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber })
      }, async () => {
        return { message: "OTP Sent", mockOtp: "1234" };
      });
    },

    async verifyOtp(phoneNumber: string, otp: string, name?: string): Promise<UserProfile> {
      return tryFetchOrMock('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, otp, name })
      }, async () => {
        if (otp !== "1234") throw new Error("Invalid OTP (Mock Mode)");
        const user = {
          name: name || 'Mobile User',
          phoneNumber,
          role: 'CITIZEN',
          karmaPoints: 0,
          provider: 'PHONE'
        };
        localStorage.setItem('sewa_session', JSON.stringify(user));
        return user as any;
      });
    },
    
    // Guest Login
    async guestLogin(): Promise<UserProfile> {
      return tryFetchOrMock('/api/auth/guest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, async () => {
        const guestUser = {
          name: 'Guest User',
          email: `guest_${Date.now()}@sewa.local`,
          role: 'CITIZEN',
          karmaPoints: 0,
          provider: 'GUEST'
        };
        localStorage.setItem('sewa_session', JSON.stringify(guestUser));
        return guestUser as any;
      });
    },

    // Session Management
    async checkSession(): Promise<UserProfile | null> {
      const session = localStorage.getItem('sewa_session');
      return session ? JSON.parse(session) : null;
    },
    logout() {
      localStorage.removeItem('sewa_session');
    }
  },

  user: {
    async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
      // In a real app, this would be a PATCH /api/me
      await mockDelay(800);
      const session = localStorage.getItem('sewa_session');
      if (!session) throw new Error("No session");
      
      const currentUser = JSON.parse(session);
      const updatedUser = { ...currentUser, ...updates };
      
      localStorage.setItem('sewa_session', JSON.stringify(updatedUser));
      saveMockUser(updatedUser); // Update "DB"
      
      return updatedUser;
    },
    async getDonationHistory() {
      await mockDelay(500);
      return [
        { id: 1, ngo: "Green Earth Alliance", amount: 50, date: "2024-03-15", status: "Completed" },
        { id: 2, ngo: "Healing Hands Medical", amount: 100, date: "2024-02-10", status: "Completed" },
      ];
    }
  },

  issues: {
    async submit(report: Partial<IssueReport>): Promise<IssueReport> {
      return tryFetchOrMock('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report)
      }, async () => {
        return { ...report, id: Date.now().toString(), timestamp: Date.now(), status: 'PENDING' } as IssueReport;
      });
    },
    async getAll(): Promise<IssueReport[]> {
      return tryFetchOrMock('/api/reports', { method: 'GET' }, async () => []);
    }
  },

  ngos: {
    async getAllApproved(): Promise<any[]> {
      return tryFetchOrMock('/api/ngos', { method: 'GET' }, async () => MOCK_NGOS);
    }
  },

  admin: {
    async getStats() {
      return tryFetchOrMock('/api/admin/stats', { method: 'GET' }, async () => ({
        totalUsers: 120, activeIssues: 5, resolvedIssues: 42, pendingNGOs: 3
      }));
    },
    async getPendingNGOs() {
      return tryFetchOrMock('/api/admin/ngos', { method: 'GET' }, async () => []);
    },
    async updateNGOStatus(id: string, status: 'APPROVED' | 'REJECTED') {
      return tryFetchOrMock(`/api/admin/ngos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      }, async () => ({ id, status }));
    }
  },

  news: {
    async getNews(scope: 'global' | 'national' | 'local', lat?: number, lng?: number): Promise<NewsArticle[]> {
      // Try fetching real-time news via Gemini Search Grounding first
      const realTimeData = await fetchRealTimeNews(scope, lat, lng);
      
      if (realTimeData && realTimeData.length > 0) {
        return realTimeData;
      }

      // If AI fails, use mock data
      await mockDelay(1000);
      return MOCK_NEWS[scope] || MOCK_NEWS['global'];
    }
  },

  blogs: {
    async getAll(): Promise<BlogPost[]> {
      return tryFetchOrMock('/api/blogs', { method: 'GET' }, async () => MOCK_BLOGS);
    },
    async create(blog: Partial<BlogPost>): Promise<BlogPost> {
      return tryFetchOrMock('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blog)
      }, async () => {
        const newBlog = { 
          ...blog, 
          id: Date.now().toString(), 
          date: new Date().toISOString().split('T')[0],
          likes: 0
        } as BlogPost;
        MOCK_BLOGS.unshift(newBlog);
        return newBlog;
      });
    }
  },

  groups: {
    async getAll(): Promise<Group[]> {
      return tryFetchOrMock('/api/groups', { method: 'GET' }, async () => MOCK_GROUPS);
    }
  },

  jobs: {
    async getAllJobs(): Promise<Job[]> {
      return tryFetchOrMock('/api/jobs', { method: 'GET' }, async () => MOCK_JOBS);
    },
    async postJob(job: Partial<Job>): Promise<Job> {
      return tryFetchOrMock('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(job)
      }, async () => {
        const newJob = { ...job, id: Date.now().toString(), applicantsCount: 0, postedAt: new Date().toISOString() } as Job;
        MOCK_JOBS.unshift(newJob);
        return newJob;
      });
    },
    async getApplicants(jobId: string): Promise<JobApplication[]> {
      return tryFetchOrMock(`/api/jobs/${jobId}/applications`, { method: 'GET' }, async () => {
        return MOCK_APPLICATIONS.filter(app => app.jobId === jobId);
      });
    },
    async applyForJob(application: Partial<JobApplication>): Promise<JobApplication> {
      return tryFetchOrMock('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(application)
      }, async () => {
        const newApp = { 
          ...application, 
          id: Date.now().toString(), 
          status: 'Applied', 
          aiMatchScore: Math.floor(Math.random() * 40) + 60, // Mock AI Score 60-100
          appliedAt: new Date().toISOString()
        } as JobApplication;
        MOCK_APPLICATIONS.push(newApp);
        // Update local job applicant count
        const job = MOCK_JOBS.find(j => j.id === application.jobId);
        if (job) job.applicantsCount += 1;
        return newApp;
      });
    },
    async updateApplicationStatus(appId: string, status: string): Promise<JobApplication> {
      return tryFetchOrMock(`/api/applications/${appId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      }, async () => {
        const app = MOCK_APPLICATIONS.find(a => a.id === appId);
        if (app) app.status = status as any;
        return app as JobApplication;
      });
    }
  }
};
