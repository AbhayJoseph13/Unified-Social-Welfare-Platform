import React, { useState, useRef, useEffect } from 'react';
import { getAIChatResponse, PRO_MODEL_NAME } from '../services/geminiService';
import { Send, Loader2, Bot, User, HeartPulse, Phone } from 'lucide-react';
import { ChatMessage } from '../types';

export const HealthHub: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hello! I am your Health & Safety Assistant. I can help with symptom checking, first-aid advice, or safety alerts. Note: I am an AI, not a doctor. For emergencies, call 112.' }
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
    
    const newMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setIsLoading(true);

    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const responseText = await getAIChatResponse(
      history, 
      input, 
      "You are a compassionate medical assistant AI. Provide first aid advice, general health information, and safety tips. ALWAYS disclaim that you are not a doctor and recommend professional help for serious symptoms. Keep answers concise.",
      PRO_MODEL_NAME
    );

    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setIsLoading(false);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-6">
      <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-red-50 flex justify-between items-center">
          <div className="flex items-center gap-2 text-red-700">
             <HeartPulse size={20} />
             <span className="font-semibold">AI Health Triage</span>
          </div>
          <button className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded border border-red-200 hover:bg-red-200 flex items-center gap-1">
             <Phone size={12} /> Emergency: 112
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50" ref={scrollRef}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl p-4 ${
                msg.role === 'user' 
                  ? 'bg-brand-600 text-white rounded-br-none' 
                  : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
              }`}>
                <div className="flex items-center gap-2 mb-1 opacity-75 text-xs">
                  {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                  <span>{msg.role === 'user' ? 'You' : 'Assistant'}</span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
               <div className="bg-white p-4 rounded-2xl rounded-bl-none border border-slate-200 shadow-sm flex items-center gap-2">
                 <Loader2 size={16} className="animate-spin text-brand-600" />
                 <span className="text-xs text-slate-500">Thinking...</span>
               </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-white border-t border-slate-100">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Describe symptoms or ask health questions..."
              className="flex-1 p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="p-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50 transition-colors"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="w-full md:w-80 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
           <h3 className="font-semibold text-slate-800 mb-3">Quick Actions</h3>
           <div className="space-y-2">
             <button className="w-full text-left p-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-sm font-medium text-slate-700 transition-colors">
               🚑 Call Ambulance
             </button>
             <button className="w-full text-left p-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-sm font-medium text-slate-700 transition-colors">
               📅 Book Teleconsultation
             </button>
             <button className="w-full text-left p-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-sm font-medium text-slate-700 transition-colors">
               💊 Medicine Reminder Setup
             </button>
           </div>
        </div>
        <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
          <h3 className="font-semibold text-orange-800 mb-2 text-sm">Safety Alert</h3>
          <p className="text-xs text-orange-700">
            Heatwave warning in your area. Stay hydrated and avoid direct sunlight between 12 PM - 3 PM.
          </p>
        </div>
      </div>
    </div>
  );
};