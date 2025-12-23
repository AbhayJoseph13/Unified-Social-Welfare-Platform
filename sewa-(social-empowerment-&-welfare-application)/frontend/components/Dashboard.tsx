
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { UserProfile } from '../types';
import { Award, TrendingUp, Users, AlertCircle, MapPin, Search, Loader2, ExternalLink, Sparkles } from 'lucide-react';
import { getNearbyResources, GroundingSource } from '../services/geminiService';

interface DashboardProps {
  user: UserProfile;
}

const dataImpact = [
  { name: 'Jan', reports: 12, resolved: 10 },
  { name: 'Feb', reports: 19, resolved: 15 },
  { name: 'Mar', reports: 3, resolved: 2 },
  { name: 'Apr', reports: 25, resolved: 20 },
  { name: 'May', reports: 14, resolved: 12 },
  { name: 'Jun', reports: 32, resolved: 28 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [searchQuery, setSearchQuery] = useState('NGOs and Help Centers');
  const [resources, setResources] = useState<{ text: string; sources: GroundingSource[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const findNearby = async () => {
    setIsLoading(true);
    try {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        const result = await getNearbyResources(searchQuery, latitude, longitude);
        setResources(result);
        setIsLoading(false);
      }, () => {
        alert("Location access denied. Please enable it for smart search.");
        setIsLoading(false);
      });
    } catch (e) {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
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
        {/* Smart Resource Locator */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-brand-100 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Sparkles size={120} className="text-brand-600" />
          </div>
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
                placeholder="What are you looking for nearby?" 
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all"
              />
            </div>
            <button 
              onClick={findNearby}
              disabled={isLoading}
              className="px-6 py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 disabled:opacity-50 transition-all shadow-lg shadow-brand-600/20"
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : 'Search AI'}
            </button>
          </div>

          {resources && (
            <div className="space-y-4 animate-slide-up">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-sm text-slate-700 leading-relaxed">
                {resources.text}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {resources.sources.map((source, i) => (
                  <a 
                    key={i} 
                    href={source.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-brand-500 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-brand-50 text-brand-600 rounded-lg group-hover:bg-brand-600 group-hover:text-white transition-colors">
                        <MapPin size={16} />
                      </div>
                      <span className="text-sm font-bold text-slate-800 line-clamp-1">{source.title}</span>
                    </div>
                    <ExternalLink size={14} className="text-slate-300 group-hover:text-brand-600" />
                  </a>
                ))}
              </div>
            </div>
          )}
          {!resources && !isLoading && (
            <div className="flex flex-col items-center justify-center py-10 text-slate-400">
               <MapPin size={40} className="mb-2 opacity-10" />
               <p className="text-sm">Enter a search query to find local welfare hubs.</p>
            </div>
          )}
        </div>

        {/* Impact Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Social Impact Activity</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataImpact}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="reports" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-indigo-600 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between shadow-xl shadow-indigo-200">
        <div>
           <h3 className="text-2xl font-black mb-2 flex items-center gap-2">
             <Sparkles /> Volunteer Intelligence
           </h3>
           <p className="text-indigo-100 font-medium max-w-lg">
             Based on your recent activity, we recommend the <strong>City Park Restoration Drive</strong>. It matches your environmental contribution pattern.
           </p>
        </div>
        <button className="mt-6 md:mt-0 bg-white text-indigo-600 px-8 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-transform active:scale-95 shadow-lg">
          Personalize My Feed
        </button>
      </div>
    </div>
  );
};
