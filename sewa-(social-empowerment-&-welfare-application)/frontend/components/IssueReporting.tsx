
import React, { useState } from 'react';
import { analyzeIssueDescription } from '../services/geminiService';
import { Loader2, Send, MapPin, Camera, AlertTriangle } from 'lucide-react';
import { api } from '../services/apiService';

interface IssueReportingProps {
  onKarmaUpdate: (points: number) => void;
}

export const IssueReporting: React.FC<IssueReportingProps> = ({ onKarmaUpdate }) => {
  const [description, setDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleAnalyze = async () => {
    if (!description.trim()) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeIssueDescription(description);
      setAnalysisResult(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.issues.submit({
        category: analysisResult?.category || 'Uncategorized',
        severity: analysisResult?.severity || 'LOW',
        description: description
      });
      setSubmitted(true);
      onKarmaUpdate(50);
    } catch (e) {
      alert("Submission failed. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12 animate-fade-in">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 shadow-sm">
          <Send size={40} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Report Transmitted to Headquarters</h2>
        <p className="text-slate-600 mb-6">Your report has been logged in our secure database. 50 Karma Points awarded.</p>
        <button 
          onClick={() => {
            setSubmitted(false);
            setDescription('');
            setAnalysisResult(null);
          }}
          className="bg-brand-600 text-white px-8 py-3 rounded-full font-bold hover:bg-brand-700 transition-all shadow-md"
        >
          Submit Another Report
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <AlertTriangle className="text-brand-600" /> Community Issue Gateway
        </h2>
        <span className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded font-bold uppercase">Encrypted Session</span>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Detailed Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Help us understand the situation with specific details..."
            className="w-full h-32 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none transition-all bg-slate-50"
          />
          <div className="mt-4 flex flex-wrap justify-between items-center gap-4">
             <div className="flex gap-2">
               <button type="button" className="px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors flex items-center gap-1.5">
                 <MapPin size={14} /> Add Geo-Tag
               </button>
               <button type="button" className="px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors flex items-center gap-1.5">
                 <Camera size={14} /> Attach Proof
               </button>
             </div>
             <button
              type="button"
              onClick={handleAnalyze}
              disabled={isAnalyzing || !description.trim()}
              className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold hover:bg-indigo-100 disabled:opacity-50 transition-all flex items-center gap-2 border border-indigo-100"
            >
              {isAnalyzing ? <Loader2 size={14} className="animate-spin" /> : 'AI Triage & Categorize'}
            </button>
          </div>
        </div>

        {analysisResult && (
          <div className="mb-6 bg-brand-50/50 p-5 rounded-xl border border-brand-100 animate-slide-up">
             <div className="flex items-center gap-2 mb-4">
               <div className="w-1.5 h-4 bg-brand-600 rounded-full"></div>
               <h3 className="text-sm font-bold text-brand-900">Backend Triage Result</h3>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-white p-3 rounded-lg border border-brand-50">
                 <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Incident Category</span>
                 <p className="font-bold text-slate-800">{analysisResult.category}</p>
               </div>
               <div className="bg-white p-3 rounded-lg border border-brand-50">
                 <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Priority Level</span>
                 <p className={`font-bold ${
                   analysisResult.severity === 'CRITICAL' ? 'text-red-600' : 
                   analysisResult.severity === 'HIGH' ? 'text-orange-600' : 'text-slate-800'
                 }`}>
                   {analysisResult.severity}
                 </p>
               </div>
               <div className="md:col-span-2">
                 <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">AI Synopsis</span>
                 <p className="text-sm text-slate-700 mt-1 italic">"{analysisResult.summary}"</p>
               </div>
               <div className="md:col-span-2">
                 <div className="bg-white p-3 rounded-lg border border-brand-100 flex items-center gap-3">
                   <div className="p-2 bg-brand-600 text-white rounded-lg"><AlertTriangle size={16} /></div>
                   <div>
                     <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Immediate Recommendation</span>
                     <p className="text-sm text-brand-700 font-bold">{analysisResult.suggestedAction}</p>
                   </div>
                 </div>
               </div>
             </div>
          </div>
        )}

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !description.trim()}
            className="w-full md:w-auto px-10 py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-brand-500/20"
          >
            {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : 'Finalize & Post Report'}
          </button>
        </div>
      </div>
    </div>
  );
};
