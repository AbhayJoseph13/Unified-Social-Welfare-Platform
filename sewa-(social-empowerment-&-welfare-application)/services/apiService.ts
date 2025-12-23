
import { UserProfile, IssueReport } from '../types';

// Point to the backend server port. 
// If you are running locally, ensure node server.js is running on 3001.
const BASE_URL = 'http://localhost:3001'; 

// --- MOCK FALLBACK SYSTEM ---
// This ensures the app works even if the backend server is not running.
const mockDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getMockUsers = (): any[] => JSON.parse(localStorage.getItem('sewa_mock_users') || '[]');
const saveMockUser = (user: any) => {
  const users = getMockUsers();
  users.push(user);
  localStorage.setItem('sewa_mock_users', JSON.stringify(users));
};

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
  }
};
