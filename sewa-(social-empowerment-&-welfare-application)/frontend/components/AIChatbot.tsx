
import React, { useState, useRef, useEffect } from 'react';
import { getGroundedProChatResponse, GroundingSource } from '../services/geminiService';
import { Send, Loader2, Bot, User, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';
import { ChatMessage } from '../types';

interface ExtendedChatMessage extends ChatMessage {
  sources?: GroundingSource[];
}

export const AIChatbot: React.FC = () => {
  const [messages, setMessages] = useState<ExtendedChatMessage[]>([
    { 
      role: 'model', 
      text: 'Namaste! I am your SEWA Grounded Intelligence Assistant. I have live access to Google Search to provide up-to-date info on social welfare, NGOs, and government policies. How can I assist you?' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const newMsg: ExtendedChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setIsLoading(true);

    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const result = await getGroundedProChatResponse(history, input);

    setMessages(prev => [...prev, { 
      role: 'model', 
      text: result.text,
      sources: result.sources 
    }]);
    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden font-sans">
      {/* Header */}
      <div className="p-6 bg-brand-600 text-white flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
            <Sparkles size={28} />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight">SEWA Grounded Intelligence</h2>
            <div className="flex items-center gap-2 text-xs font-bold text-brand-100 opacity-80 mt-1">
              <ShieldCheck size={14} /> LIVE SEARCH & POLICY ACCESS
            </div>
          </div>
        </div>
        <div className="hidden md:block">
           <span className="text-[10px] bg-white/20 px-3 py-1 rounded-full font-black uppercase tracking-widest border border-white/10">Gemini 3 Pro</span>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50/50" ref={scrollRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-4 max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                msg.role === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-brand-600 text-white'
              }`}>
                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              
              <div className="space-y-3">
                <div className={`p-5 rounded-3xl shadow-sm text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-brand-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
                
                {msg.sources && msg.sources.length > 0 && (
                  <div className="flex flex-wrap gap-2 animate-fade-in pl-1">
                    {msg.sources.map((source, sIdx) => (
                      <a 
                        key={sIdx} 
                        href={source.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 text-brand-700 border border-brand-100 rounded-full text-[10px] font-black uppercase tracking-tight hover:bg-brand-100 transition-colors shadow-sm"
                      >
                        <ExternalLink size={10} /> {source.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
             <div className="flex gap-4 max-w-[85%]">
               <div className="w-10 h-10 rounded-2xl bg-brand-600 text-white flex items-center justify-center flex-shrink-0 shadow-lg">
                 <Bot size={20} />
               </div>
               <div className="bg-white p-5 rounded-3xl rounded-tl-none border border-slate-100 shadow-sm flex items-center gap-3">
                 <div className="flex gap-1">
                   <div className="w-2 h-2 bg-brand-600 rounded-full animate-bounce"></div>
                   <div className="w-2 h-2 bg-brand-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                   <div className="w-2 h-2 bg-brand-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                 </div>
                 <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Grounding with Live Data...</span>
               </div>
             </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white border-t border-slate-100">
        <div className="flex gap-4 items-end max-w-5xl mx-auto">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask about schemes, how to report issues, or search the web..."
              className="w-full p-4 max-h-40 min-h-[60px] rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 text-sm resize-none bg-slate-50 font-medium transition-all"
            />
          </div>
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="p-4 bg-brand-600 text-white rounded-2xl hover:bg-brand-700 disabled:opacity-50 transition-all shadow-xl shadow-brand-600/30 mb-0.5 active:scale-90"
          >
            <Send size={24} />
          </button>
        </div>
        <div className="flex items-center justify-center gap-4 mt-4 opacity-50">
           <div className="h-px bg-slate-200 flex-1"></div>
           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
             AI Grounded in Verified Policy & Local Data
           </p>
           <div className="h-px bg-slate-200 flex-1"></div>
        </div>
      </div>
    </div>
  );
};
