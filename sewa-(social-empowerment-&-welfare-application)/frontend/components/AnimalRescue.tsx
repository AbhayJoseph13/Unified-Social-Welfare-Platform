
import React, { useState } from 'react';
import { Camera, MapPin, Phone, PawPrint, Search, Loader2, ExternalLink } from 'lucide-react';
import { getNearbyResources, GroundingSource } from '../services/geminiService';

export const AnimalRescue: React.FC = () => {
  const [photo, setPhoto] = useState<string | null>(null);
  const [shelters, setShelters] = useState<GroundingSource[]>([]);
  const [isFinding, setIsFinding] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPhoto(ev.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const findRealShelters = () => {
    setIsFinding(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      const result = await getNearbyResources("animal shelters and veterinary hospitals", latitude, longitude);
      setShelters(result.sources);
      setIsFinding(false);
    }, () => {
      alert("Location needed to find shelters.");
      setIsFinding(false);
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="bg-teal-600 text-white p-10 rounded-3xl relative overflow-hidden shadow-xl shadow-teal-200">
        <div className="relative z-10">
          <h2 className="text-4xl font-black mb-3 flex items-center gap-3">
            <PawPrint size={36} /> Animal Rescue Hub
          </h2>
          <p className="text-teal-50 max-w-lg text-lg opacity-90 leading-relaxed">
            Report injured strays or find immediate help. Our AI locator connects you to real-time veterinary care and verified shelters.
          </p>
        </div>
        <PawPrint className="absolute -right-12 -bottom-12 w-80 h-80 text-teal-500 opacity-30 rotate-12" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 h-fit">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Rescue Dispatch Form</h3>
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center hover:bg-slate-50 transition-colors relative group border-spacing-4">
               <input type="file" onChange={handlePhotoUpload} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
               {photo ? (
                 <img src={photo} alt="Preview" className="h-56 mx-auto object-cover rounded-xl shadow-lg" />
               ) : (
                 <div className="flex flex-col items-center text-slate-400">
                   <div className="p-4 bg-slate-100 rounded-full mb-3 group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
                     <Camera size={40} />
                   </div>
                   <p className="font-bold">Attach Photographic Evidence</p>
                   <p className="text-xs mt-1">AI will analyze injury severity automatically</p>
                 </div>
               )}
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Animal Condition</label>
              <select className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-700 outline-none focus:ring-2 focus:ring-teal-500 transition-all">
                <option>Injured / Trauma</option>
                <option>Visible Illness</option>
                <option>Threatening Behavior</option>
                <option>Abandoned / Lost</option>
              </select>
            </div>

            <button className="w-full bg-teal-600 text-white py-4 rounded-xl font-black text-lg hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20 active:scale-[0.98]">
              DISPATCH RESCUE
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
             <div className="flex items-center justify-between mb-6">
               <h3 className="text-xl font-bold text-slate-800">Verified AI Locator</h3>
               <button 
                onClick={findRealShelters}
                disabled={isFinding}
                className="text-xs bg-teal-50 text-teal-700 px-3 py-1.5 rounded-full font-bold border border-teal-100 hover:bg-teal-100 transition-all flex items-center gap-1.5"
               >
                 {isFinding ? <Loader2 size={12} className="animate-spin" /> : <Search size={12} />}
                 {shelters.length > 0 ? 'Refresh List' : 'Scan Nearby Shelters'}
               </button>
             </div>
             
             <div className="space-y-4">
               {shelters.map((shelter, i) => (
                 <a 
                  key={i} 
                  href={shelter.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200 group"
                 >
                    <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-teal-600 group-hover:text-white transition-colors shadow-sm">
                      <MapPin size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-800 truncate">{shelter.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                        Live Navigation Available <ExternalLink size={10} />
                      </p>
                    </div>
                 </a>
               ))}
               {shelters.length === 0 && !isFinding && (
                 <div className="text-center py-10 text-slate-400">
                    <Search size={40} className="mx-auto mb-2 opacity-10" />
                    <p className="text-sm font-medium">No shelters scanned yet.</p>
                 </div>
               )}
             </div>
          </div>

          <div className="bg-yellow-50 p-6 rounded-2xl border border-yellow-100 relative overflow-hidden">
             <div className="relative z-10 flex gap-4">
                <img src="https://picsum.photos/120/120?random=50" alt="Dog" className="w-24 h-24 rounded-2xl object-cover shadow-md" />
                <div>
                   <span className="text-[10px] bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full font-black uppercase tracking-widest">Urgent Adoption</span>
                   <h4 className="text-lg font-black text-yellow-900 mt-1">Meet Bruno</h4>
                   <p className="text-xs text-yellow-800 font-medium mb-3">Bruno was rescued 2 days ago near Sector 4.</p>
                   <button className="bg-yellow-600 text-white px-5 py-2 rounded-xl text-xs font-black hover:bg-yellow-700 transition-all shadow-md active:scale-95">
                     OFFER FOREVER HOME
                   </button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
