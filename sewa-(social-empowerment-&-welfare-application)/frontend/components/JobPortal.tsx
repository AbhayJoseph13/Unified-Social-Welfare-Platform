
import React, { useState, useEffect } from 'react';
import { Briefcase, Search, MapPin, Building2, Clock, Upload, X, CheckCircle, ChevronRight, Users, Sparkles, Filter, MoreHorizontal, User } from 'lucide-react';
import { api } from '../services/apiService';
import { Job, JobApplication, UserProfile } from '../types';

interface JobPortalProps {
  user: UserProfile;
}

export const JobPortal: React.FC<JobPortalProps> = ({ user }) => {
  // Mode Switcher: 'seeker' vs 'employer'
  const [viewMode, setViewMode] = useState<'seeker' | 'employer'>('seeker');

  // --- SEEKER STATE ---
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [appSubmitted, setAppSubmitted] = useState(false);

  // --- EMPLOYER STATE ---
  const [newJob, setNewJob] = useState({ title: '', company: '', location: '', salaryRange: '', type: 'Full-time', description: '', requirements: '' });
  const [isPostingJob, setIsPostingJob] = useState(false);
  const [myJobs, setMyJobs] = useState<Job[]>([]);
  const [viewApplicantsJobId, setViewApplicantsJobId] = useState<string | null>(null);
  const [applicants, setApplicants] = useState<JobApplication[]>([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setIsLoadingJobs(true);
    const allJobs = await api.jobs.getAllJobs();
    setJobs(allJobs);
    setMyJobs(allJobs.filter(j => j.postedBy === 'employer1' || j.postedBy === 'employer2' || j.postedBy === 'employer3')); // Mock filter for simulation
    setIsLoadingJobs(false);
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    await api.jobs.applyForJob({
      jobId: selectedJob.id,
      applicantId: 'user_123', // Mock ID
      applicantName: user.name,
      resumeLink: 'mock_resume.pdf'
    });

    setAppSubmitted(true);
    setTimeout(() => {
      setAppSubmitted(false);
      setIsApplying(false);
      setSelectedJob(null);
      setResumeFile(null);
    }, 2000);
  };

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.jobs.postJob({
      ...newJob,
      requirements: newJob.requirements.split(',').map(s => s.trim()),
      type: newJob.type as any,
      postedBy: 'employer1' // Mock ID
    });
    fetchJobs();
    setIsPostingJob(false);
    setNewJob({ title: '', company: '', location: '', salaryRange: '', type: 'Full-time', description: '', requirements: '' });
  };

  const loadApplicants = async (jobId: string) => {
    setViewApplicantsJobId(jobId);
    const apps = await api.jobs.getApplicants(jobId);
    setApplicants(apps);
  };

  const updateStatus = async (appId: string, status: string) => {
    await api.jobs.updateApplicationStatus(appId, status);
    if (viewApplicantsJobId) loadApplicants(viewApplicantsJobId);
  };

  // --- RENDER HELPERS ---

  const renderSeekerView = () => {
    const filteredJobs = jobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || job.company.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterType === 'All' || job.type === filterType;
      return matchesSearch && matchesFilter;
    });

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
        <div className="lg:col-span-2 space-y-6">
          {/* Search Bar */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search by job title, skill, or company..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              className="p-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-700 outline-none"
            >
              <option>All</option>
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Volunteer</option>
            </select>
          </div>

          {/* Job List */}
          <div className="space-y-4">
             {filteredJobs.map(job => (
               <div key={job.id} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                 <div className="flex justify-between items-start">
                   <div>
                     <h3 className="text-lg font-bold text-slate-800 group-hover:text-brand-600 transition-colors">{job.title}</h3>
                     <p className="text-slate-500 font-medium">{job.company}</p>
                   </div>
                   <span className="bg-brand-50 text-brand-700 px-3 py-1 rounded-full text-xs font-bold uppercase">{job.type}</span>
                 </div>
                 <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
                    <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                    <span className="flex items-center gap-1"><Clock size={14} /> Posted {new Date(job.postedAt).toLocaleDateString()}</span>
                    <span className="font-semibold text-slate-700">{job.salaryRange}</span>
                 </div>
                 <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
                   <p className="text-sm text-slate-500 line-clamp-1 flex-1 mr-4">{job.description}</p>
                   <button 
                    onClick={() => { setSelectedJob(job); setIsApplying(true); }}
                    className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors"
                   >
                     Apply Now
                   </button>
                 </div>
               </div>
             ))}
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
           <div className="bg-indigo-600 text-white p-6 rounded-2xl shadow-xl shadow-indigo-200 relative overflow-hidden">
             <div className="relative z-10">
               <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><Sparkles size={18} /> AI Resume Match</h3>
               <p className="text-indigo-100 text-sm mb-4">Upload your resume to let AI find the perfect job for your skill set.</p>
               <button className="w-full bg-white text-indigo-600 py-2.5 rounded-lg font-bold text-sm hover:bg-indigo-50 transition-colors">
                 Analyze Resume
               </button>
             </div>
             <Sparkles className="absolute -right-6 -bottom-6 w-32 h-32 text-indigo-500 opacity-30" />
           </div>

           <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4">Saved Jobs</h3>
              <div className="text-center py-8 text-slate-400">
                <Briefcase size={32} className="mx-auto mb-2 opacity-20" />
                <p className="text-sm">No jobs saved yet.</p>
              </div>
           </div>
        </div>
      </div>
    );
  };

  const renderEmployerView = () => (
    <div className="animate-fade-in space-y-6">
       <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Employer Dashboard</h2>
            <p className="text-slate-500">Manage your job postings and applicants.</p>
          </div>
          <button 
            onClick={() => setIsPostingJob(true)}
            className="bg-brand-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-700 transition-colors shadow-lg shadow-brand-600/20"
          >
            + Post New Job
          </button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {myJobs.map(job => (
           <div key={job.id} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-4">
                 <div>
                   <h3 className="font-bold text-slate-800 text-lg">{job.title}</h3>
                   <p className="text-sm text-slate-500">{job.location} • {job.type}</p>
                 </div>
                 <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal size={20}/></button>
              </div>
              <div className="flex items-center justify-between mt-6">
                 <div className="flex items-center gap-2 text-slate-600">
                   <Users size={18} />
                   <span className="font-bold">{job.applicantsCount} Applicants</span>
                 </div>
                 <button 
                   onClick={() => loadApplicants(job.id)}
                   className="text-brand-600 font-bold text-sm hover:underline flex items-center gap-1"
                 >
                   View Candidates <ChevronRight size={16} />
                 </button>
              </div>
           </div>
         ))}
       </div>

       {/* Applicants Modal Area (Inline for simplicity) */}
       {viewApplicantsJobId && (
         <div className="mt-8 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-slide-up">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
               <h3 className="font-bold text-slate-800 text-lg">Candidates for Job ID: {viewApplicantsJobId}</h3>
               <button onClick={() => setViewApplicantsJobId(null)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Candidate</th>
                    <th className="p-4">Applied</th>
                    <th className="p-4">AI Score</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {applicants.map(app => (
                     <tr key={app.id}>
                       <td className="p-4">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold"><User size={14}/></div>
                            <span className="font-bold text-slate-700">{app.applicantName}</span>
                         </div>
                       </td>
                       <td className="p-4 text-sm text-slate-600">{new Date(app.appliedAt).toLocaleDateString()}</td>
                       <td className="p-4">
                         <div className="flex items-center gap-2">
                           <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                             <div className="h-full bg-green-500" style={{width: `${app.aiMatchScore}%`}}></div>
                           </div>
                           <span className="text-xs font-bold text-green-700">{app.aiMatchScore}%</span>
                         </div>
                       </td>
                       <td className="p-4">
                         <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                           app.status === 'Offer' ? 'bg-green-100 text-green-700' : 
                           app.status === 'Rejected' ? 'bg-red-100 text-red-700' : 
                           'bg-blue-100 text-blue-700'
                         }`}>
                           {app.status}
                         </span>
                       </td>
                       <td className="p-4">
                         <div className="flex gap-2">
                           <button onClick={() => updateStatus(app.id, 'Interview')} className="px-3 py-1 bg-white border border-slate-200 rounded text-xs font-bold hover:bg-slate-50">Interview</button>
                           <button onClick={() => updateStatus(app.id, 'Offer')} className="px-3 py-1 bg-green-600 text-white rounded text-xs font-bold hover:bg-green-700">Hire</button>
                           <button onClick={() => updateStatus(app.id, 'Rejected')} className="px-3 py-1 bg-red-50 text-red-600 rounded text-xs font-bold hover:bg-red-100">Reject</button>
                         </div>
                       </td>
                     </tr>
                   ))}
                   {applicants.length === 0 && (
                     <tr>
                       <td colSpan={5} className="p-8 text-center text-slate-400">No applicants found for this job yet.</td>
                     </tr>
                   )}
                </tbody>
              </table>
            </div>
         </div>
       )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header & Toggle */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
           <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
             <Briefcase className="text-brand-600" /> SEWA Job Portal
           </h1>
           <p className="text-slate-500 font-medium">Connect, Apply, and Grow your Career.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
           <button 
             onClick={() => setViewMode('seeker')}
             className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${viewMode === 'seeker' ? 'bg-white shadow-sm text-brand-600' : 'text-slate-500 hover:text-slate-700'}`}
           >
             I'm a Job Seeker
           </button>
           <button 
             onClick={() => setViewMode('employer')}
             className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${viewMode === 'employer' ? 'bg-white shadow-sm text-brand-600' : 'text-slate-500 hover:text-slate-700'}`}
           >
             I'm an Employer
           </button>
        </div>
      </div>

      {viewMode === 'seeker' ? renderSeekerView() : renderEmployerView()}

      {/* --- MODALS --- */}

      {/* Apply Modal */}
      {isApplying && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-8 relative overflow-hidden">
             {appSubmitted ? (
               <div className="text-center py-12">
                 <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                   <CheckCircle size={40} />
                 </div>
                 <h3 className="text-2xl font-bold text-slate-800">Application Sent!</h3>
                 <p className="text-slate-500">Good luck! The employer will contact you soon.</p>
               </div>
             ) : (
               <>
                 <button onClick={() => setIsApplying(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={24}/></button>
                 <h2 className="text-xl font-bold text-slate-800 mb-1">Apply for {selectedJob.title}</h2>
                 <p className="text-sm text-slate-500 mb-6">{selectedJob.company} • {selectedJob.location}</p>
                 
                 <form onSubmit={handleApply} className="space-y-4">
                   <div>
                     <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                     <input type="text" value={user.name} disabled className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500" />
                   </div>
                   <div>
                     <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
                     <input type="email" value={user.email} disabled className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500" />
                   </div>
                   <div>
                     <label className="block text-sm font-bold text-slate-700 mb-1">Upload Resume (PDF)</label>
                     <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center cursor-pointer hover:bg-slate-50 transition-colors relative">
                       <input 
                         type="file" 
                         accept=".pdf" 
                         className="absolute inset-0 opacity-0 cursor-pointer"
                         onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                       />
                       <Upload className="mx-auto text-slate-400 mb-2" />
                       <p className="text-sm font-medium text-slate-600">{resumeFile ? resumeFile.name : 'Click to upload or drag and drop'}</p>
                     </div>
                   </div>
                   <button className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg">
                     Submit Application
                   </button>
                 </form>
               </>
             )}
          </div>
        </div>
      )}

      {/* Post Job Modal */}
      {isPostingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-8 relative overflow-hidden max-h-[90vh] overflow-y-auto">
             <button onClick={() => setIsPostingJob(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={24}/></button>
             <h2 className="text-xl font-bold text-slate-800 mb-6">Post a New Job</h2>
             
             <form onSubmit={handlePostJob} className="space-y-4">
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Job Title</label>
                   <input required type="text" value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:border-brand-500" />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Company Name</label>
                   <input required type="text" value={newJob.company} onChange={e => setNewJob({...newJob, company: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:border-brand-500" />
                 </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Location</label>
                   <input required type="text" value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:border-brand-500" />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Salary Range</label>
                   <input required type="text" value={newJob.salaryRange} onChange={e => setNewJob({...newJob, salaryRange: e.target.value})} placeholder="e.g. ₹30k - ₹50k" className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:border-brand-500" />
                 </div>
               </div>
               <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Job Type</label>
                 <select value={newJob.type} onChange={e => setNewJob({...newJob, type: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:border-brand-500 bg-white">
                   <option>Full-time</option>
                   <option>Part-time</option>
                   <option>Contract</option>
                   <option>Volunteer</option>
                 </select>
               </div>
               <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label>
                 <textarea required rows={3} value={newJob.description} onChange={e => setNewJob({...newJob, description: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:border-brand-500 resize-none" />
               </div>
               <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Requirements (Comma separated)</label>
                 <textarea required rows={2} value={newJob.requirements} onChange={e => setNewJob({...newJob, requirements: e.target.value})} placeholder="React, Node.js, Team Player" className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:border-brand-500 resize-none" />
               </div>

               <button className="w-full bg-brand-600 text-white py-3 rounded-xl font-bold hover:bg-brand-700 transition-colors shadow-lg mt-4">
                 Publish Job
               </button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};
