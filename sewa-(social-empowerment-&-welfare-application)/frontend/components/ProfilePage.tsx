
import React, { useState, useEffect } from 'react';
import { UserProfile, IssueReport } from '../types';
import { 
  User, Mail, Phone, Lock, Camera, Save, 
  LayoutDashboard, History, Settings, LogOut, 
  TrendingUp, Award, Users, AlertCircle, Sparkles,
  MapPin, Search, Loader2, ExternalLink
} from 'lucide-react';
import { api } from '../services/apiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getNearbyResources, GroundingSource } from '../services/geminiService';

interface ProfilePageProps {
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
  onLogout: () => void;
}

const dataImpact = [
  { name: 'Jan', reports: 12, resolved: 10 },
  { name: 'Feb', reports: 19, resolved: 15 },
  { name: 'Mar', reports: 3, resolved: 2 },
  { name: 'Apr', reports: 25, resolved: 20 },
  { name: 'May', reports: 14, resolved: 12 },
  { name: 'Jun', reports: 32, resolved: 28 },
];

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUpdateUser, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'settings' | 'history'>('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Edit Form State
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber || '',
    avatar: user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
    currentPassword: '',
    newPassword: ''
  });

  // Dashboard Logic State
  const [searchQuery, setSearchQuery] = useState('NGOs and Help Centers');
  const [resources, setResources] = useState<{ text: string; sources: GroundingSource[] } | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // History State
  const [donations, setDonations] = useState<any[]>([]);

  useEffect(() => {
    // Load history when tab changes
    if (activeTab === 'history') {
      api.user.getDonationHistory().then(setDonations);
    }
  }, [activeTab]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const updated = await api.user.updateProfile({
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        avatar: formData.avatar
      });
      onUpdateUser(updated);
      setSuccessMsg("Profile updated successfully!");
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      alert("Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  const findNearby = async () => {
    setIsSearching(true);
    try {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        const result = await getNearbyResources(searchQuery, latitude, longitude);
        setResources(result);
        setIsSearching(false);
      }, () => {
        alert("Location access denied.");
        setIsSearching(false);
      });
    } catch (e) {
      setIsSearching(false);
    }
  };

  const renderOverview = () => (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-purple-100 rounded-full text-purple-600"><Award size={24} /></div>
          <div><p className="text-sm text-slate-500">Karma Points</p><p className="text-2xl font-bold text-slate-800">{user.karmaPoints}</p></div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-full text-green-600"><TrendingUp size={24} /></div>
          <div><p className="text-sm text-slate-500">Impact Score</p><p className="text-2xl font-bold text-slate-800">Top 5%</p></div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-full text-blue-600"><Users size={24} /></div>
          <div><p className="text-sm text-slate-500">Community Rank</p><p className="text-2xl font-bold text-slate-800">#42</p></div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-orange-100 rounded-full text-orange-600"><AlertCircle size={24} /></div>
          <div><p className="text-sm text-slate-500">Open Reports</p><p className="text-2xl font-bold text-slate-800">1</p></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Resource Locator */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-brand-100 overflow-hidden relative">
           <div className="flex items-center gap-2 mb-6">
            <MapPin className="text-brand-600" />
            <h3 className="text-lg font-bold text-slate-800">AI Smart Resource Locator</h3>
            <span className="text-[10px] bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full font-black uppercase tracking-widest">Maps Grounded</span>
          </div>

          <div className="flex gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Find NGOs, hospitals, etc." 
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
            <button 
              onClick={findNearby}
              disabled={isSearching}
              className="px-6 py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 disabled:opacity-50"
            >
              {isSearching ? <Loader2 size={20} className="animate-spin" /> : 'Search'}
            </button>
          </div>

          {resources && (
            <div className="space-y-4 animate-slide-up">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-sm text-slate-700">
                {resources.text}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {resources.sources.map((source, i) => (
                  <a 
                    key={i} 
                    href={source.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl hover:border-brand-500 hover:shadow-md transition-all group"
                  >
                    <span className="text-sm font-bold text-slate-800 line-clamp-1">{source.title}</span>
                    <ExternalLink size={14} className="text-slate-300 group-hover:text-brand-600" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Your Impact</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataImpact}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="reports" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-fade-in">
      <div className="p-8 border-b border-slate-100">
         <h2 className="text-2xl font-bold text-slate-800">Edit Profile</h2>
         <p className="text-slate-500">Update your personal information and security settings.</p>
      </div>
      
      <form onSubmit={handleUpdateProfile} className="p-8 space-y-8">
        {/* Avatar Section */}
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-100 shadow-inner">
               <img src={formData.avatar} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <button 
              type="button"
              onClick={() => setFormData({...formData, avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`})}
              className="absolute bottom-0 right-0 p-2 bg-brand-600 text-white rounded-full shadow-lg hover:bg-brand-700 transition-colors"
            >
              <Camera size={16} />
            </button>
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Profile Picture</h3>
            <p className="text-xs text-slate-500">Click the camera icon to generate a new avatar.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
             <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
             <div className="relative">
               <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
               <input 
                 type="text" 
                 value={formData.name}
                 onChange={(e) => setFormData({...formData, name: e.target.value})}
                 className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
               />
             </div>
          </div>
          <div className="space-y-2">
             <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
             <div className="relative">
               <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
               <input 
                 type="email" 
                 value={formData.email}
                 onChange={(e) => setFormData({...formData, email: e.target.value})}
                 className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
               />
             </div>
          </div>
          <div className="space-y-2">
             <label className="text-xs font-bold text-slate-500 uppercase">Phone Number</label>
             <div className="relative">
               <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
               <input 
                 type="tel" 
                 value={formData.phoneNumber}
                 onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                 placeholder="+1 234 567 890"
                 className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
               />
             </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100">
           <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Lock size={18} /> Security</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
               <label className="text-xs font-bold text-slate-500 uppercase">New Password</label>
               <input 
                 type="password" 
                 value={formData.newPassword}
                 onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                 placeholder="••••••••"
                 className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
               />
             </div>
             <div className="space-y-2">
               <label className="text-xs font-bold text-slate-500 uppercase">Confirm Password</label>
               <input 
                 type="password" 
                 placeholder="••••••••"
                 className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
               />
             </div>
           </div>
        </div>

        <div className="flex items-center justify-between pt-4">
           {successMsg && <span className="text-green-600 text-sm font-bold flex items-center gap-2"><Sparkles size={16}/> {successMsg}</span>}
           <div className="flex-1"></div>
           <button 
             type="submit"
             disabled={isLoading}
             className="px-8 py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-all flex items-center gap-2"
           >
             {isLoading ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Save Changes</>}
           </button>
        </div>
      </form>
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-6 animate-fade-in">
       <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
         <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-slate-800">Donation History</h3>
         </div>
         <div className="overflow-x-auto">
           <table className="w-full">
             <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider text-left">
               <tr>
                 <th className="p-4">NGO Name</th>
                 <th className="p-4">Date</th>
                 <th className="p-4">Amount</th>
                 <th className="p-4">Status</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
               {donations.map((d, i) => (
                 <tr key={i} className="text-sm text-slate-700 hover:bg-slate-50">
                   <td className="p-4 font-medium">{d.ngo}</td>
                   <td className="p-4">{d.date}</td>
                   <td className="p-4 font-bold text-green-600">${d.amount}</td>
                   <td className="p-4"><span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">{d.status}</span></td>
                 </tr>
               ))}
               {donations.length === 0 && (
                 <tr>
                   <td colSpan={4} className="p-8 text-center text-slate-400">No donation records found.</td>
                 </tr>
               )}
             </tbody>
           </table>
         </div>
       </div>

       <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
         <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-slate-800">Recent Activity</h3>
         </div>
         <div className="p-8 text-center text-slate-400 text-sm">
           No other recent activities or issue reports found.
         </div>
       </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Profile Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-8">
         <div className="flex flex-col md:flex-row items-center gap-6">
           <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-50 shadow-lg">
             <img src={formData.avatar} alt={user.name} className="w-full h-full object-cover" />
           </div>
           <div className="text-center md:text-left flex-1">
             <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
             <p className="text-slate-500 font-medium">{user.role} • {user.email}</p>
             <div className="flex items-center justify-center md:justify-start gap-4 mt-3">
               <span className="text-xs bg-brand-50 text-brand-700 px-3 py-1 rounded-full font-bold uppercase tracking-wide">
                 {user.karmaPoints} Karma
               </span>
               <span className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full font-bold uppercase tracking-wide">
                 Verified Member
               </span>
             </div>
           </div>
           <button 
             onClick={onLogout}
             className="px-6 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all font-medium text-sm flex items-center gap-2"
           >
             <LogOut size={16} /> Log Out
           </button>
         </div>

         {/* Navigation Tabs */}
         <div className="flex items-center gap-2 mt-8 border-b border-slate-100">
            {[
              { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'settings', label: 'Edit Profile', icon: Settings },
              { id: 'history', label: 'History', icon: History }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-bold border-b-2 transition-all ${
                  activeTab === tab.id 
                    ? 'border-brand-600 text-brand-600' 
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-t-lg'
                }`}
              >
                <tab.icon size={16} /> {tab.label}
              </button>
            ))}
         </div>
      </div>

      {/* Tab Content */}
      <div className="p-6 md:p-8 flex-1 overflow-y-auto">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'settings' && renderSettings()}
        {activeTab === 'history' && renderHistory()}
      </div>
    </div>
  );
};
