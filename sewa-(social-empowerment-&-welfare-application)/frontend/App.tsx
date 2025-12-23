import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { HomePage } from './components/HomePage';
import { IssueReporting } from './components/IssueReporting';
import { HealthHub } from './components/HealthHub';
import { EducationHub } from './components/EducationHub';
import { AnimalRescue } from './components/AnimalRescue';
import { Donations } from './components/Donations';
import { AIChatbot } from './components/AIChatbot';
import { SOS } from './components/SOS';
import { BloodDonation } from './components/BloodDonation';
import { SeniorSupport } from './components/SeniorSupport';
import { Community } from './components/Community';
import { JobPortal } from './components/JobPortal';
import { AdminDashboard } from './components/AdminDashboard';
import { ProfilePage } from './components/ProfilePage';
import { Auth } from './components/Auth';
import { LandingPage } from './components/LandingPage';
import { ModuleType, UserProfile } from './types';
import { Menu, Bell, Loader2 } from 'lucide-react';
import { api } from './services/apiService';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentModule, setCurrentModule] = useState<ModuleType>(ModuleType.HOME);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Persistence: Check for session on load
  useEffect(() => {
    const initAuth = async () => {
      const sessionUser = await api.auth.checkSession();
      if (sessionUser) {
        setUser(sessionUser);
        setIsAuthenticated(true);
        if (sessionUser.role === 'ADMIN') setCurrentModule(ModuleType.ADMIN_DASHBOARD);
        else setCurrentModule(ModuleType.HOME);
      }
      setIsInitializing(false);
    };
    initAuth();
  }, []);

  const handleLogin = (loggedInUser: UserProfile) => {
    setUser(loggedInUser);
    setIsAuthenticated(true);
    setShowAuthModal(false);
    if (loggedInUser.role === 'ADMIN') {
      setCurrentModule(ModuleType.ADMIN_DASHBOARD);
    } else {
      setCurrentModule(ModuleType.HOME);
    }
  };

  const handleLogout = () => {
    api.auth.logout();
    setIsAuthenticated(false);
    setUser(null);
    setCurrentModule(ModuleType.HOME);
  };

  const handleKarmaUpdate = (points: number) => {
    if (user) {
      const updatedUser = { ...user, karmaPoints: user.karmaPoints + points };
      setUser(updatedUser);
    }
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-brand-600 mb-4" size={48} />
        <h1 className="text-xl font-bold text-slate-700">Connecting to SEWA Cloud...</h1>
      </div>
    );
  }

  // If not authenticated, show Landing Page (and potentially the Auth Modal)
  if (!isAuthenticated) {
    return (
      <>
        <LandingPage onGetStarted={() => setShowAuthModal(true)} />
        {showAuthModal && (
          <Auth onLogin={handleLogin} onClose={() => setShowAuthModal(false)} />
        )}
      </>
    );
  }

  // Authenticated Application Flow
  const renderModule = () => {
    if (!user) return null;

    switch (currentModule) {
      case ModuleType.HOME:
        return <HomePage user={user} onNavigate={setCurrentModule} />;
      case ModuleType.PROFILE:
        return <ProfilePage user={user} onUpdateUser={setUser} onLogout={handleLogout} />;
      // Fallback for deprecated dashboard enum if stuck in state
      case ModuleType.DASHBOARD:
        return <HomePage user={user} onNavigate={setCurrentModule} />;
      case ModuleType.ADMIN_DASHBOARD:
        return user.role === 'ADMIN' ? <AdminDashboard /> : <HomePage user={user} onNavigate={setCurrentModule} />;
      case ModuleType.AI_CHAT:
        return <AIChatbot />;
      case ModuleType.REPORT_ISSUE:
        return <IssueReporting onKarmaUpdate={handleKarmaUpdate} />;
      case ModuleType.HEALTH_SAFETY:
        return <HealthHub />;
      case ModuleType.EDUCATION:
        return <EducationHub />;
      case ModuleType.ANIMAL_RESCUE:
        return <AnimalRescue />;
      case ModuleType.DONATIONS:
        return <Donations />;
      case ModuleType.SOS:
        return <SOS />;
      case ModuleType.BLOOD_DONATION:
        return <BloodDonation />;
      case ModuleType.SENIOR_SUPPORT:
        return <SeniorSupport />;
      case ModuleType.COMMUNITY:
        return <Community />;
      case ModuleType.SUSTAINABILITY:
        return <Community />; 
      case ModuleType.JOBS:
        return <JobPortal user={user} />;
      default:
        return <HomePage user={user} onNavigate={setCurrentModule} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar 
        currentModule={currentModule} 
        onSelectModule={setCurrentModule}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        userRole={user?.role || 'CITIZEN'}
        onLogout={handleLogout}
      />
      
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 rounded-lg hover:bg-slate-100 lg:hidden text-slate-600"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-semibold text-slate-800 lg:hidden">SEWA</h2>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="hidden md:flex flex-col items-end cursor-pointer" onClick={() => setCurrentModule(ModuleType.PROFILE)}>
               <span className="text-sm font-semibold text-slate-800">{user?.name}</span>
               <div className="flex items-center gap-2">
                 <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-bold">{user?.role}</span>
                 {user?.role !== 'ADMIN' && <span className="text-xs text-brand-600 font-medium">{user?.karmaPoints} Karma</span>}
               </div>
             </div>
             <button className="relative p-2 rounded-full hover:bg-slate-100 text-slate-500">
               <Bell size={20} />
               <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
             </button>
             <button 
              onClick={() => setCurrentModule(ModuleType.PROFILE)}
              className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border border-slate-300 transition-transform active:scale-95"
             >
               <img src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || 'guest'}`} alt="Profile" className="w-full h-full object-cover" />
             </button>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-x-hidden">
          {renderModule()}
        </main>
      </div>
    </div>
  );
}