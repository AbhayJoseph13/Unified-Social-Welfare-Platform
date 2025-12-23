
import React from 'react';
import { Phone, Calendar, Pill, Users, HandHeart } from 'lucide-react';

export const SeniorSupport: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-orange-50 border border-orange-100 p-6 rounded-2xl flex items-center gap-4">
        <div className="bg-white p-3 rounded-full shadow-sm text-orange-600">
           <HandHeart size={32} />
        </div>
        <div>
           <h2 className="text-2xl font-bold text-slate-800">Senior Care & Support</h2>
           <p className="text-slate-600">Simplified tools for health, safety, and community connection.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Large Emergency Button */}
        <button className="bg-red-100 hover:bg-red-200 transition-colors p-8 rounded-2xl flex items-center justify-center gap-4 group border-2 border-red-200">
           <div className="bg-red-600 text-white p-4 rounded-full group-hover:scale-110 transition-transform">
             <Phone size={40} />
           </div>
           <div className="text-left">
             <h3 className="text-2xl font-bold text-red-800">Emergency Call</h3>
             <p className="text-red-700 font-medium">One-tap connect to family</p>
           </div>
        </button>

        {/* Medicine Reminder */}
        <div className="bg-blue-50 border-2 border-blue-200 p-6 rounded-2xl">
           <div className="flex items-center justify-between mb-4">
             <h3 className="text-xl font-bold text-blue-900 flex items-center gap-2">
               <Pill /> Medicine Reminder
             </h3>
             <span className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">12:30 PM</span>
           </div>
           <div className="space-y-3">
              <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-blue-100">
                 <div className="w-4 h-4 rounded-full bg-green-500"></div>
                 <span className="text-lg text-slate-700">Calcium Supplement (Taken)</span>
              </div>
              <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-blue-100 opacity-75">
                 <div className="w-4 h-4 rounded-full border-2 border-slate-300"></div>
                 <span className="text-lg text-slate-700">Blood Pressure Pill (Pending)</span>
              </div>
           </div>
        </div>

        {/* Home Services */}
        <div className="bg-white p-6 rounded-2xl border-2 border-slate-100 shadow-sm">
           <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Users /> Book Assistance
           </h3>
           <div className="grid grid-cols-2 gap-3">
             <button className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 font-semibold text-slate-700">Nurse</button>
             <button className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 font-semibold text-slate-700">Groceries</button>
             <button className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 font-semibold text-slate-700">Cleaner</button>
             <button className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 font-semibold text-slate-700">Repair</button>
           </div>
        </div>

        {/* Events */}
        <div className="bg-white p-6 rounded-2xl border-2 border-slate-100 shadow-sm">
           <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Calendar /> Community Events
           </h3>
           <div className="space-y-3">
              <div className="p-3 bg-indigo-50 rounded-xl border-l-4 border-indigo-500">
                <p className="font-bold text-indigo-900">Yoga in the Park</p>
                <p className="text-indigo-700 text-sm">Tomorrow, 7:00 AM • Community Center</p>
              </div>
              <div className="p-3 bg-indigo-50 rounded-xl border-l-4 border-indigo-500">
                <p className="font-bold text-indigo-900">Health Checkup Camp</p>
                <p className="text-indigo-700 text-sm">Sunday, 10:00 AM • City Hall</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
