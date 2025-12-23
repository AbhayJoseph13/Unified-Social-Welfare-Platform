
import React, { useState } from 'react';
import { Droplet, Search, MapPin, BellRing, UserPlus, Clock } from 'lucide-react';

export const BloodDonation: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'find' | 'requests'>('find');

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-red-600 text-white p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
            <Droplet className="fill-white" /> Blood Donation Drive
          </h2>
          <p className="text-red-100">Every drop counts. Connect with donors or request blood in emergencies.</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3 relative z-10">
          <button className="bg-white text-red-600 px-6 py-2 rounded-full font-bold hover:bg-red-50 transition-colors">
            Register as Donor
          </button>
        </div>
        <Droplet className="absolute -right-6 -bottom-6 w-48 h-48 text-red-500 opacity-50 rotate-12" />
      </div>

      {/* Tabs */}
      <div className="flex bg-white p-1 rounded-xl border border-slate-200 w-fit">
        <button
          onClick={() => setActiveTab('find')}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'find' ? 'bg-red-50 text-red-700' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Find Donors
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'requests' ? 'bg-red-50 text-red-700' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Live Requests
        </button>
      </div>

      {activeTab === 'find' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm md:col-span-1">
            <h3 className="font-bold text-slate-800 mb-4">Search Donors</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Blood Group</label>
                <div className="grid grid-cols-4 gap-2">
                  {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                    <button key={bg} className="py-2 rounded border border-slate-200 text-sm font-medium hover:bg-red-50 hover:border-red-200 hover:text-red-700">
                      {bg}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                <div className="flex gap-2">
                  <input type="text" placeholder="Enter pincode or city" className="flex-1 p-2 border border-slate-200 rounded-lg text-sm" />
                  <button className="p-2 bg-slate-100 rounded-lg text-slate-600">
                    <MapPin size={18} />
                  </button>
                </div>
              </div>
              <button className="w-full bg-slate-900 text-white py-3 rounded-lg font-medium hover:bg-slate-800">
                Search Nearby
              </button>
            </div>
          </div>

          <div className="md:col-span-2 space-y-4">
            <h3 className="font-bold text-slate-800">Available Donors Nearby</h3>
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-lg">
                    {i === 1 ? 'O+' : i === 2 ? 'B+' : 'A-'}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">Verified Donor</h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin size={12} /> {i * 2}.5 km away • Last donated 3 months ago
                    </p>
                  </div>
                </div>
                <button className="text-sm bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200 font-medium">
                  Request
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-start gap-3">
             <BellRing className="text-red-600 flex-shrink-0 mt-1" />
             <div>
               <h3 className="font-bold text-red-800">Critical: O- Blood Needed</h3>
               <p className="text-sm text-red-700 mt-1">City Hospital, Ward 4. Urgency: High. Patient scheduled for surgery in 2 hours.</p>
               <div className="mt-3 flex gap-3">
                 <button className="bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-red-700">I can donate</button>
                 <button className="bg-white text-red-600 border border-red-200 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-red-50">Share</button>
               </div>
             </div>
          </div>
          
          <div className="bg-white border border-slate-100 p-4 rounded-xl flex items-center justify-between">
             <div className="flex gap-4 items-center">
               <div className="p-3 bg-slate-100 rounded-lg">
                 <Clock className="text-slate-500" />
               </div>
               <div>
                 <h3 className="font-semibold text-slate-800">AB+ Platelets Required</h3>
                 <p className="text-xs text-slate-500">Apex Trauma Center • 5km away</p>
               </div>
             </div>
             <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded font-medium">Medium Urgency</span>
          </div>
        </div>
      )}
    </div>
  );
};
