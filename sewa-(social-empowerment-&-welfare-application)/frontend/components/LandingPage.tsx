
import React from 'react';
import { ShieldCheck, HeartHandshake, AlertTriangle, Users, ArrowRight, Activity, Globe } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 md:px-12 sticky top-0 bg-white/80 backdrop-blur-md z-40 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="bg-brand-600 text-white p-2 rounded-lg">
            <ShieldCheck size={24} />
          </div>
          <span className="text-xl font-black text-slate-800 tracking-tight">SEWA</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={onGetStarted}
            className="text-sm font-bold text-slate-600 hover:text-brand-600 transition-colors hidden md:block"
          >
            Log In
          </button>
          <button 
            onClick={onGetStarted}
            className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20"
          >
            Join Ecosystem
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-6 md:px-12 overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-brand-50 rounded-full blur-3xl opacity-50 z-0"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-indigo-50 rounded-full blur-3xl opacity-50 z-0"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-50 text-brand-700 rounded-full text-xs font-bold uppercase tracking-widest border border-brand-100">
              <Globe size={12} />
              Unified Social Welfare Platform
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
              Empowering <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">Communities</span>, Connecting Lives.
            </h1>
            <p className="text-lg md:text-xl text-slate-500 max-w-lg leading-relaxed">
              SEWA bridges the gap between citizens, NGOs, and government agencies. Report issues, find resources, and make a tangible impact in your local ecosystem.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={onGetStarted}
                className="px-8 py-4 bg-brand-600 text-white rounded-xl font-bold text-lg hover:bg-brand-700 transition-all shadow-xl shadow-brand-600/30 flex items-center justify-center gap-2 group"
              >
                Get Started Now
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                 Learn More
              </button>
            </div>
          </div>
          
          <div className="relative animate-slide-up">
             <div className="relative z-10 grid grid-cols-2 gap-4">
                <div className="space-y-4 mt-8">
                   <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100">
                      <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-4">
                        <Activity size={24} />
                      </div>
                      <h3 className="font-bold text-slate-800 text-lg">Health Support</h3>
                      <p className="text-sm text-slate-500 mt-1">AI-driven triage and emergency services.</p>
                   </div>
                   <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100">
                      <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-4">
                        <AlertTriangle size={24} />
                      </div>
                      <h3 className="font-bold text-slate-800 text-lg">Report Issues</h3>
                      <p className="text-sm text-slate-500 mt-1">Geo-tagged reporting for swift action.</p>
                   </div>
                </div>
                <div className="space-y-4">
                   <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100">
                      <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4">
                        <HeartHandshake size={24} />
                      </div>
                      <h3 className="font-bold text-slate-800 text-lg">NGO Connect</h3>
                      <p className="text-sm text-slate-500 mt-1">Verified donations and volunteering.</p>
                   </div>
                   <div className="bg-brand-600 p-6 rounded-2xl shadow-xl text-white">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
                        <Users size={24} />
                      </div>
                      <h3 className="font-bold text-white text-lg">Community</h3>
                      <p className="text-sm text-brand-100 mt-1">Join 50,000+ active citizens today.</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Stats/Social Proof */}
      <section className="py-12 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-black text-slate-800 mb-1">50k+</div>
            <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">Active Users</div>
          </div>
          <div>
            <div className="text-4xl font-black text-slate-800 mb-1">12k</div>
            <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">Issues Resolved</div>
          </div>
          <div>
            <div className="text-4xl font-black text-slate-800 mb-1">$2M+</div>
            <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">Donations Raised</div>
          </div>
          <div>
            <div className="text-4xl font-black text-slate-800 mb-1">500+</div>
            <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">Verified NGOs</div>
          </div>
        </div>
      </section>

      {/* Footer Simple */}
      <footer className="py-8 text-center text-slate-400 text-sm">
        <p>&copy; {new Date().getFullYear()} SEWA Ecosystem. All rights reserved.</p>
      </footer>
    </div>
  );
};
