import React, { useEffect, useState } from 'react';
import { UserProfile, ModuleType, NewsArticle } from '../types';
import { 
  Briefcase, AlertTriangle, HeartHandshake, HeartPulse, 
  ArrowRight, Sparkles, MapPin, TrendingUp, ShieldAlert,
  Loader2, ExternalLink
} from 'lucide-react';
import { api } from '../services/apiService';

interface HomePageProps {
  user: UserProfile;
  onNavigate: (module: ModuleType) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ user, onNavigate }) => {
  const [localNews, setLocalNews] = useState<NewsArticle[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);

  useEffect(() => {
    // Fetch a couple of local news items for the home feed
    const loadNews = async () => {
       try {
         // Attempt to get location, default to generic if failed
         if ("geolocation" in navigator) {
           navigator.geolocation.getCurrentPosition(
             async (pos) => {
               const news = await api.news.getNews('local', pos.coords.latitude, pos.coords.longitude);
               setLocalNews(news.slice(0, 2));
             },
             async () => {
               const news = await api.news.getNews('global');
               setLocalNews(news.slice(0, 2));
             }
           );
         } else {
           const news = await api.news.getNews('global');
           setLocalNews(news.slice(0, 2));
         }
       } catch (e) {
         console.error(e);
       } finally {
         setLoadingNews(false);
       }
    };
    loadNews();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-10">
       {/* Hero Section */}
       <div className="bg-gradient-to-r from-brand-700 to-brand-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10">
             <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">
               Namaste, {user.name.split(' ')[0]}! 🙏
             </h1>
             <p className="text-brand-100 text-lg max-w-xl leading-relaxed mb-8">
               Your community ecosystem is active. You have <strong>{user.karmaPoints} Karma Points</strong> and helped resolve <strong>12 issues</strong> this month.
             </p>
             <div className="flex flex-wrap gap-4">
               <button 
                 onClick={() => onNavigate(ModuleType.REPORT_ISSUE)}
                 className="bg-white text-brand-900 px-6 py-3 rounded-xl font-bold hover:bg-brand-50 transition-colors flex items-center gap-2"
               >
                 <AlertTriangle size={20} /> Report an Issue
               </button>
               <button 
                 onClick={() => onNavigate(ModuleType.AI_CHAT)}
                 className="bg-brand-600 text-white border border-brand-500 px-6 py-3 rounded-xl font-bold hover:bg-brand-500 transition-colors flex items-center gap-2"
               >
                 <Sparkles size={20} /> Ask AI Assistant
               </button>
             </div>
          </div>
          {/* Background Decor */}
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
             <MapPin size={300} className="-mb-20 -mr-20" />
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse"></div>
       </div>

       {/* Quick Access Grid */}
       <div>
         <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
           <Sparkles className="text-brand-600" size={20} /> Quick Actions
         </h2>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickActionCard 
              icon={Briefcase} 
              label="Job Portal" 
              subLabel="Find Work" 
              color="blue" 
              onClick={() => onNavigate(ModuleType.JOBS)} 
            />
            <QuickActionCard 
              icon={HeartHandshake} 
              label="Donate" 
              subLabel="Help NGOs" 
              color="green" 
              onClick={() => onNavigate(ModuleType.DONATIONS)} 
            />
            <QuickActionCard 
              icon={HeartPulse} 
              label="Health" 
              subLabel="Medical Aid" 
              color="red" 
              onClick={() => onNavigate(ModuleType.HEALTH_SAFETY)} 
            />
            <QuickActionCard 
              icon={ShieldAlert} 
              label="SOS" 
              subLabel="Emergency" 
              color="orange" 
              onClick={() => onNavigate(ModuleType.SOS)} 
            />
         </div>
       </div>

       {/* Two Column Layout: News & Stats */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Local Updates */}
          <div className="lg:col-span-2 space-y-4">
             <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">Local Updates</h2>
                <button 
                  onClick={() => onNavigate(ModuleType.COMMUNITY)}
                  className="text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                >
                  View Community <ArrowRight size={16} />
                </button>
             </div>
             
             {loadingNews ? (
               <div className="space-y-4">
                 {[1, 2].map(i => (
                   <div key={i} className="h-32 bg-slate-100 rounded-2xl animate-pulse"></div>
                 ))}
               </div>
             ) : (
               <div className="space-y-4">
                  {localNews.map((news, i) => (
                    <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex gap-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate(ModuleType.COMMUNITY)}>
                       <img src={news.image} alt="News" className="w-24 h-24 rounded-xl object-cover bg-slate-200" />
                       <div className="flex-1 py-1">
                          <h3 className="font-bold text-slate-800 line-clamp-1 mb-1">{news.title}</h3>
                          <p className="text-sm text-slate-500 line-clamp-2 mb-2">{news.description}</p>
                          <div className="flex items-center gap-2">
                             <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{news.source.name}</span>
                             <span className="text-xs text-slate-300">•</span>
                             <span className="text-xs text-slate-400">{new Date(news.publishedAt).toLocaleDateString()}</span>
                          </div>
                       </div>
                    </div>
                  ))}
                  {localNews.length === 0 && (
                    <div className="p-8 text-center bg-slate-50 rounded-2xl text-slate-500">
                      No local news updates available right now.
                    </div>
                  )}
               </div>
             )}
          </div>

          {/* Impact Card */}
          <div className="space-y-4">
             <h2 className="text-xl font-bold text-slate-800">Your Impact</h2>
             <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-full flex flex-col justify-center items-center text-center">
                <div className="w-32 h-32 rounded-full border-8 border-brand-50 flex items-center justify-center mb-4 relative">
                   <TrendingUp size={40} className="text-brand-600" />
                   <div className="absolute inset-0 border-8 border-brand-500 rounded-full border-t-transparent border-l-transparent rotate-45"></div>
                </div>
                <h3 className="text-3xl font-black text-slate-800 mb-1">{user.karmaPoints}</h3>
                <p className="text-slate-500 font-medium mb-6">Karma Points Earned</p>
                <button 
                  onClick={() => onNavigate(ModuleType.PROFILE)}
                  className="w-full py-3 bg-slate-50 text-slate-700 font-bold rounded-xl hover:bg-slate-100 transition-colors"
                >
                  View Full Profile
                </button>
             </div>
          </div>
       </div>
    </div>
  );
};

const QuickActionCard = ({ icon: Icon, label, subLabel, color, onClick }: any) => {
  const colorClasses: any = {
    blue: "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
    green: "bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white",
    red: "bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white",
    orange: "bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white",
  };

  return (
    <button 
      onClick={onClick}
      className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group text-left"
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors ${colorClasses[color]}`}>
        <Icon size={24} />
      </div>
      <div className="font-bold text-slate-800">{label}</div>
      <div className="text-xs text-slate-500 font-medium">{subLabel}</div>
    </button>
  );
};