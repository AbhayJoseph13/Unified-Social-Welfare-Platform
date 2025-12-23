
import React from 'react';
import { 
  AlertTriangle, 
  HeartPulse, 
  GraduationCap, 
  Users, 
  Leaf, 
  PawPrint,
  Accessibility,
  HeartHandshake,
  MessageSquareText,
  Droplet,
  ShieldAlert,
  LogOut,
  LayoutTemplate,
  Briefcase,
  Home
} from 'lucide-react';
import { ModuleType, UserProfile } from '../types';

interface SidebarProps {
  currentModule: ModuleType;
  onSelectModule: (module: ModuleType) => void;
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  userRole: UserProfile['role'];
  onLogout: () => void;
}

const navItems = [
  { id: ModuleType.HOME, label: 'Home', icon: Home },
  { id: ModuleType.AI_CHAT, label: 'AI Assistant', icon: MessageSquareText },
  { id: ModuleType.SOS, label: 'SOS & Safety', icon: ShieldAlert, alert: true },
  { id: ModuleType.JOBS, label: 'Job Portal', icon: Briefcase },
  { id: ModuleType.REPORT_ISSUE, label: 'Report Issue', icon: AlertTriangle },
  { id: ModuleType.BLOOD_DONATION, label: 'Blood Drive', icon: Droplet },
  { id: ModuleType.DONATIONS, label: 'Donations', icon: HeartHandshake },
  { id: ModuleType.HEALTH_SAFETY, label: 'Health & Safety', icon: HeartPulse },
  { id: ModuleType.EDUCATION, label: 'Education Hub', icon: GraduationCap },
  { id: ModuleType.ANIMAL_RESCUE, label: 'Animal Rescue', icon: PawPrint },
  { id: ModuleType.SENIOR_SUPPORT, label: 'Senior Support', icon: Accessibility },
  { id: ModuleType.COMMUNITY, label: 'Community', icon: Users },
  { id: ModuleType.SUSTAINABILITY, label: 'Sustainability', icon: Leaf },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentModule, onSelectModule, isOpen, setIsOpen, userRole, onLogout }) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 left-0 z-30 h-full w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col`}
      >
        <div className="flex items-center justify-center h-16 border-b border-slate-200 bg-brand-50 shrink-0">
          <h1 className="text-xl font-bold text-brand-700 flex items-center gap-2">
             SEWA
          </h1>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto flex-1">
          {userRole === 'ADMIN' && (
            <button
              onClick={() => {
                onSelectModule(ModuleType.ADMIN_DASHBOARD);
                setIsOpen(false);
              }}
              className={`flex items-center w-full px-4 py-3 mb-4 text-sm font-bold rounded-lg transition-colors border ${
                currentModule === ModuleType.ADMIN_DASHBOARD
                  ? 'bg-slate-800 text-white border-slate-800 shadow-md' 
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <LayoutTemplate className="w-5 h-5 mr-3" />
              Admin Dashboard
            </button>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentModule === item.id;
            // Special styling for SOS
            if (item.id === ModuleType.SOS) {
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectModule(item.id);
                    setIsOpen(false);
                  }}
                  className={`flex items-center w-full px-4 py-3 mb-2 text-sm font-bold rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-red-600 text-white shadow-md' 
                      : 'bg-red-50 text-red-600 hover:bg-red-100'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </button>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectModule(item.id);
                  setIsOpen(false);
                }}
                className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-brand-50 text-brand-700' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200 shrink-0">
          <button 
            onClick={onLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Log Out
          </button>
        </div>
      </aside>
    </>
  );
};
