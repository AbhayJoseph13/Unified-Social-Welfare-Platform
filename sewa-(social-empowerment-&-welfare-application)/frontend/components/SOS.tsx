
import React, { useState, useEffect } from 'react';
import { ShieldAlert, Bell, Phone, MapPin, Navigation, Video } from 'lucide-react';

export const SOS: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleSOSClick = () => {
    if (isActive) {
      setIsActive(false);
      setCountdown(0);
    } else {
      setCountdown(3);
    }
  };

  useEffect(() => {
    let timer: number;
    if (countdown > 0) {
      timer = window.setTimeout(() => setCountdown(c => c - 1), 1000);
    } else if (countdown === 0 && !isActive && timer!) {
       // logic to actually activate
    }
    
    if (countdown === 0 && !isActive) return;
    
    if (countdown === 0 && isActive) {
      // already active
    } else if (countdown === 0) {
       setIsActive(true);
    }
    
    return () => clearTimeout(timer);
  }, [countdown, isActive]);

  return (
    <div className="max-w-xl mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
      
      {isActive ? (
        <div className="w-full bg-red-600 text-white rounded-2xl p-8 text-center animate-pulse shadow-2xl mb-8">
           <ShieldAlert size={64} className="mx-auto mb-4" />
           <h2 className="text-3xl font-black uppercase tracking-wider mb-2">SOS ACTIVE</h2>
           <p className="font-semibold text-red-100 mb-6">Alert sent to 3 Emergency Contacts & Nearby Police</p>
           
           <div className="bg-white/10 rounded-xl p-4 mb-6 backdrop-blur-sm">
             <div className="flex items-center justify-center gap-2 mb-2">
               <div className="w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
               <span className="text-sm font-mono">Live Location Sharing: ON</span>
             </div>
             <div className="flex items-center justify-center gap-2 text-red-200 text-xs">
               <Video size={12} /> Recording Audio/Video...
             </div>
           </div>

           <button 
             onClick={() => setIsActive(false)}
             className="bg-white text-red-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-red-50 transition-colors shadow-lg"
           >
             I AM SAFE - CANCEL SOS
           </button>
        </div>
      ) : (
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Emergency Safety Mode</h2>
          <p className="text-slate-500 mb-8">Press and hold the button below for 3 seconds to trigger SOS.</p>
          
          <button 
            onClick={() => setCountdown(3)}
            className="w-64 h-64 rounded-full bg-gradient-to-br from-red-500 to-red-700 shadow-2xl flex items-center justify-center relative group active:scale-95 transition-transform"
          >
             <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-20"></div>
             <div className="flex flex-col items-center text-white">
                <ShieldAlert size={64} className="mb-2" />
                <span className="text-3xl font-black tracking-widest">SOS</span>
                {countdown > 0 && <span className="text-4xl font-bold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white drop-shadow-md">{countdown}</span>}
             </div>
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 w-full">
        <button className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center gap-2 hover:bg-slate-50 transition-colors">
          <Phone className="text-brand-600" />
          <span className="font-semibold text-slate-700">Police (100)</span>
        </button>
        <button className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center gap-2 hover:bg-slate-50 transition-colors">
           <div className="bg-red-100 p-1 rounded-full text-red-600"><Phone size={20} /></div>
           <span className="font-semibold text-slate-700">Ambulance (102)</span>
        </button>
        <button className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center gap-2 hover:bg-slate-50 transition-colors">
           <MapPin className="text-brand-600" />
           <span className="font-semibold text-slate-700">Share Location</span>
        </button>
        <button className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center gap-2 hover:bg-slate-50 transition-colors">
           <Navigation className="text-brand-600" />
           <span className="font-semibold text-slate-700">Safe Route</span>
        </button>
      </div>
    </div>
  );
};
