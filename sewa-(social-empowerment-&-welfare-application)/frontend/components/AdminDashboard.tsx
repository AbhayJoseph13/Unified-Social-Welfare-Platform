
import React, { useState, useEffect } from 'react';
import { Users, AlertTriangle, Building2, CheckCircle, XCircle, BarChart3, ShieldAlert, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../services/apiService';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [pendingNGOs, setPendingNGOs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    const [s, n] = await Promise.all([
      api.admin.getStats(),
      api.admin.getPendingNGOs()
    ]);
    setStats(s);
    setPendingNGOs(n);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleNGOStatus = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    await api.admin.updateNGOStatus(id, status);
    fetchData();
  };

  if (isLoading && !stats) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-brand-600" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <ShieldAlert className="text-brand-600" /> Admin Command Center
        </h2>
        <div className="flex gap-2">
          <button onClick={fetchData} className="text-xs bg-slate-100 px-3 py-1.5 rounded-lg font-medium text-slate-600 hover:bg-slate-200">
            Refresh Data
          </button>
          <span className="bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">Online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: stats?.totalUsers, icon: Users, color: 'brand' },
          { label: 'Active Issues', value: stats?.activeIssues, icon: AlertTriangle, color: 'orange' },
          { label: 'Pending NGOs', value: stats?.pendingNGOs, icon: Building2, color: 'purple' },
          { label: 'Resolved Issues', value: stats?.resolvedIssues, icon: CheckCircle, color: 'green' }
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-500 text-sm font-medium">{item.label}</h3>
              <item.icon className={`text-${item.color}-500`} size={20} />
            </div>
            <p className="text-3xl font-bold text-slate-800">{item.value?.toLocaleString() || '0'}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">System Analytics</h3>
          <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Reports', value: stats?.activeIssues + stats?.resolvedIssues },
                { name: 'NGOs', value: stats?.pendingNGOs + 150 },
                { name: 'Donations', value: 450 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-4">NGO Verification Queue</h3>
          <div className="space-y-4 flex-1">
            {pendingNGOs.map(ngo => (
              <div key={ngo.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100 transition-colors hover:bg-slate-100">
                <div>
                  <h4 className="font-semibold text-slate-800">{ngo.name}</h4>
                  <p className="text-xs text-slate-500">{ngo.type} • Applied {ngo.date}</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleNGOStatus(ngo.id, 'APPROVED')}
                    className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 shadow-sm transition-all active:scale-95"
                  >
                    <CheckCircle size={18} />
                  </button>
                  <button 
                    onClick={() => handleNGOStatus(ngo.id, 'REJECTED')}
                    className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 shadow-sm transition-all active:scale-95"
                  >
                    <XCircle size={18} />
                  </button>
                </div>
              </div>
            ))}
            {pendingNGOs.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <CheckCircle size={40} className="mb-2 opacity-20" />
                <p>Queue is empty. Well done!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
