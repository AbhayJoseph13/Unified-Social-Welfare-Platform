import React, { useState } from 'react';
import { getAIChatResponse, PRO_MODEL_NAME } from '../services/geminiService';
import { BookOpen, Lightbulb, MessageSquare } from 'lucide-react';
import { ChatMessage } from '../types';

export const EducationHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'learn' | 'skills'>('learn');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleAskTutor = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', text: input } as ChatMessage;
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const history = messages.map(m => ({ role: m.role, parts: [{ text: m.text }] }));
    const response = await getAIChatResponse(
      history, 
      input, 
      "You are a friendly and knowledgeable AI Tutor. Explain complex concepts simply. Focus on empowering the user with skills.",
      PRO_MODEL_NAME
    );

    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setIsTyping(false);
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
       <div className="flex items-center justify-between mb-6">
         <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
           <BookOpen className="text-brand-600" /> Education & Skill Empowerment
         </h2>
         <div className="flex bg-white rounded-lg p-1 border border-slate-200">
           <button 
             onClick={() => setActiveTab('learn')}
             className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'learn' ? 'bg-brand-50 text-brand-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
           >
             AI Tutor
           </button>
           <button 
             onClick={() => setActiveTab('skills')}
             className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'skills' ? 'bg-brand-50 text-brand-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
           >
             Skill Resources
           </button>
         </div>
       </div>

       {activeTab === 'learn' ? (
         <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
           <div className="p-4 bg-brand-600 text-white flex justify-between items-center">
              <span className="font-semibold flex items-center gap-2">
                <Lightbulb size={18} /> Personal AI Tutor
              </span>
              <span className="text-xs bg-brand-700 px-2 py-1 rounded">Online</span>
           </div>
           
           <div className="flex-1 overflow-y-auto p-6 space-y-6">
             {messages.length === 0 && (
               <div className="flex flex-col items-center justify-center h-full text-slate-400">
                 <MessageSquare size={48} className="mb-4 opacity-50" />
                 <p>Ask me anything about math, science, history, or vocational skills!</p>
               </div>
             )}
             {messages.map((m, i) => (
               <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                 <div className={`max-w-[85%] p-4 rounded-2xl ${
                   m.role === 'user' 
                    ? 'bg-slate-100 text-slate-800 rounded-br-none' 
                    : 'bg-brand-50 text-brand-900 rounded-bl-none border border-brand-100'
                 }`}>
                   <p className="text-sm leading-relaxed">{m.text}</p>
                 </div>
               </div>
             ))}
             {isTyping && <div className="text-xs text-slate-400 animate-pulse">Tutor is typing...</div>}
           </div>

           <div className="p-4 border-t border-slate-100">
             <div className="flex gap-2 relative">
               <input
                 className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                 placeholder="Explain how solar panels work..."
                 value={input}
                 onChange={(e) => setInput(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && handleAskTutor()}
               />
               <button 
                onClick={handleAskTutor}
                className="bg-brand-600 text-white px-6 rounded-lg font-medium hover:bg-brand-700 transition-colors"
               >
                 Ask
               </button>
             </div>
           </div>
         </div>
       ) : (
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {['Vocational Training', 'Digital Literacy', 'Financial Basics', 'Language Learning', 'Agriculture Tech', 'First Aid'].map((skill, i) => (
             <div key={i} className="bg-white p-6 rounded-xl border border-slate-100 hover:shadow-md transition-shadow cursor-pointer group">
               <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                 <BookOpen size={24} />
               </div>
               <h3 className="font-semibold text-slate-800 mb-2">{skill}</h3>
               <p className="text-sm text-slate-500 mb-4">Start your journey in {skill.toLowerCase()} with our curated free resources.</p>
               <span className="text-indigo-600 text-sm font-medium hover:underline">Start Learning &rarr;</span>
             </div>
           ))}
         </div>
       )}
    </div>
  );
}