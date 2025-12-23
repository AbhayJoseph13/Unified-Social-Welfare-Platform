
import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/apiService';
import { NewsArticle, BlogPost, Group, GroupMessage } from '../types';
import { 
  Globe, Flag, MapPin, Loader2, ExternalLink, Calendar, 
  MessageSquare, Newspaper, Share2, ThumbsUp, PenSquare, 
  Users, Send, Search, MoreVertical, X, Image as ImageIcon
} from 'lucide-react';

export const Community: React.FC = () => {
  const [activeView, setActiveView] = useState<'news' | 'blogs' | 'groups'>('news');
  
  // News State
  const [newsTab, setNewsTab] = useState<'global' | 'national' | 'local'>('local');
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [locationError, setLocationError] = useState('');

  // Blogs State
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [blogsLoading, setBlogsLoading] = useState(false);
  const [isCreatingBlog, setIsCreatingBlog] = useState(false);
  const [newBlog, setNewBlog] = useState({ title: '', content: '', category: 'General' });

  // Groups State
  const [groups, setGroups] = useState<Group[]>([]);
  const [groupsLoading, setGroupsLoading] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // --- NEWS LOGIC ---
  useEffect(() => {
    if (activeView === 'news') fetchNews(newsTab);
  }, [activeView, newsTab]);

  const fetchNews = async (scope: 'global' | 'national' | 'local') => {
    setNewsLoading(true);
    setLocationError('');
    try {
      if (scope === 'local' && "geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const articles = await api.news.getNews(scope, pos.coords.latitude, pos.coords.longitude);
            setNews(articles);
            setNewsLoading(false);
          },
          (err) => {
            setLocationError("Location access denied. Showing general updates.");
            api.news.getNews(scope).then(a => { setNews(a); setNewsLoading(false); });
          }
        );
      } else {
        const articles = await api.news.getNews(scope);
        setNews(articles);
        setNewsLoading(false);
      }
    } catch (e) {
      setNewsLoading(false);
    }
  };

  // --- BLOG LOGIC ---
  useEffect(() => {
    if (activeView === 'blogs') {
      setBlogsLoading(true);
      api.blogs.getAll().then(b => {
        setBlogs(b);
        setBlogsLoading(false);
      });
    }
  }, [activeView]);

  const handleCreateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlog.title || !newBlog.content) return;
    
    setBlogsLoading(true);
    await api.blogs.create({ ...newBlog, author: 'You', image: `https://picsum.photos/800/400?random=${Date.now()}` });
    const allBlogs = await api.blogs.getAll();
    setBlogs(allBlogs);
    setBlogsLoading(false);
    setIsCreatingBlog(false);
    setNewBlog({ title: '', content: '', category: 'General' });
  };

  // --- GROUPS LOGIC ---
  useEffect(() => {
    if (activeView === 'groups') {
      setGroupsLoading(true);
      api.groups.getAll().then(g => {
        setGroups(g);
        setGroupsLoading(false);
      });
    }
  }, [activeView]);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, selectedGroup]);

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    const msg: GroupMessage = {
      id: Date.now().toString(),
      text: chatMessage,
      sender: 'You',
      isMe: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, msg]);
    setChatMessage('');
    
    // Simulate reply
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: 'That sounds like a great idea! count me in.',
        sender: 'Volunteer Alex',
        isMe: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 2000);
  };

  // --- RENDERS ---

  const renderNews = () => (
    <div className="space-y-6 animate-fade-in">
       <div className="flex bg-white p-1 rounded-xl border border-slate-200 w-full md:w-fit mx-auto">
         {[
           { id: 'global', label: 'Global', icon: Globe },
           { id: 'national', label: 'National', icon: Flag },
           { id: 'local', label: 'Local', icon: MapPin }
         ].map(tab => (
           <button
             key={tab.id}
             onClick={() => setNewsTab(tab.id as any)}
             className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
               newsTab === tab.id ? 'bg-brand-50 text-brand-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
             }`}
           >
             <tab.icon size={16} /> {tab.label}
           </button>
         ))}
       </div>

       {locationError && newsTab === 'local' && (
         <div className="bg-orange-50 text-orange-700 p-3 rounded-lg text-sm text-center font-medium border border-orange-100">
           {locationError}
         </div>
       )}

       {newsLoading ? (
         <div className="flex justify-center py-12"><Loader2 className="animate-spin text-brand-600" /></div>
       ) : (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {news.map((article, i) => (
             <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
               <div className="h-48 overflow-hidden relative">
                 <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                 <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <span className="text-white text-xs font-bold uppercase tracking-wider">{article.source.name}</span>
                 </div>
               </div>
               <div className="p-5 flex-1 flex flex-col">
                 <h3 className="text-lg font-bold text-slate-800 mb-2 leading-snug hover:text-brand-600 cursor-pointer">{article.title}</h3>
                 <p className="text-sm text-slate-500 mb-4 line-clamp-3 flex-1">{article.description}</p>
                 <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                   <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                     <Calendar size={12} /> {new Date(article.publishedAt).toLocaleDateString()}
                   </span>
                   <button className="text-brand-600 text-sm font-bold flex items-center gap-1 hover:underline">
                     Read Full <ExternalLink size={14} />
                   </button>
                 </div>
               </div>
             </div>
           ))}
         </div>
       )}
    </div>
  );

  const renderBlogs = () => (
    <div className="space-y-6 animate-fade-in">
      {isCreatingBlog ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800">Write a New Blog Post</h3>
            <button onClick={() => setIsCreatingBlog(false)} className="p-2 hover:bg-slate-100 rounded-full"><X size={20}/></button>
          </div>
          <form onSubmit={handleCreateBlog} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Title</label>
              <input 
                type="text" 
                required
                value={newBlog.title}
                onChange={(e) => setNewBlog({...newBlog, title: e.target.value})}
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                placeholder="Share your story..."
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Category</label>
              <select 
                value={newBlog.category}
                onChange={(e) => setNewBlog({...newBlog, category: e.target.value})}
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
              >
                <option>General</option>
                <option>Sustainability</option>
                <option>Volunteering</option>
                <option>Events</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Content</label>
              <textarea 
                required
                value={newBlog.content}
                onChange={(e) => setNewBlog({...newBlog, content: e.target.value})}
                className="w-full h-40 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none resize-none"
                placeholder="What's on your mind?"
              />
            </div>
            <button type="submit" disabled={blogsLoading} className="w-full bg-brand-600 text-white py-3 rounded-xl font-bold hover:bg-brand-700 disabled:opacity-50">
              {blogsLoading ? <Loader2 className="animate-spin mx-auto"/> : 'Publish Post'}
            </button>
          </form>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
             <h3 className="text-xl font-bold text-slate-800">Community Voices</h3>
             <button 
               onClick={() => setIsCreatingBlog(true)}
               className="bg-brand-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-brand-700 shadow-lg shadow-brand-600/20"
             >
               <PenSquare size={18} /> Write Blog
             </button>
          </div>
          
          {blogsLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="animate-spin text-brand-600" /></div>
          ) : (
            <div className="space-y-6">
              {blogs.map((blog) => (
                <div key={blog.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 hover:shadow-md transition-all">
                  <img src={blog.image} alt={blog.title} className="w-full md:w-48 h-32 object-cover rounded-xl" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded uppercase">{blog.category}</span>
                      <span className="text-xs text-slate-400">• {blog.date}</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">{blog.title}</h3>
                    <p className="text-slate-600 text-sm line-clamp-2 mb-4">{blog.content}</p>
                    <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
                      <span className="flex items-center gap-1 hover:text-brand-600 cursor-pointer"><ThumbsUp size={16}/> {blog.likes}</span>
                      <span className="flex items-center gap-1 hover:text-brand-600 cursor-pointer"><MessageSquare size={16}/> Comment</span>
                      <span className="flex items-center gap-1 hover:text-brand-600 cursor-pointer ml-auto"><Share2 size={16}/> Share</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );

  const renderGroups = () => (
    <div className="h-[600px] bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex animate-fade-in">
      {/* Sidebar List */}
      <div className={`w-full md:w-80 border-r border-slate-100 flex flex-col ${selectedGroup ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input type="text" placeholder="Search groups..." className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {groups.map(group => (
            <div 
              key={group.id} 
              onClick={() => { setSelectedGroup(group); setMessages([]); }}
              className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-slate-50 transition-colors border-b border-slate-50 ${selectedGroup?.id === group.id ? 'bg-green-50 border-green-100' : ''}`}
            >
              <img src={group.image} alt={group.name} className="w-12 h-12 rounded-full object-cover" />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                   <h4 className="font-bold text-slate-800 truncate">{group.name}</h4>
                   <span className="text-[10px] text-slate-400">12:30 PM</span>
                </div>
                <p className="text-xs text-slate-500 truncate">{group.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex-col bg-[#efeae2] ${selectedGroup ? 'flex' : 'hidden md:flex'}`}>
        {selectedGroup ? (
          <>
            <div className="p-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
               <div className="flex items-center gap-3">
                 <button onClick={() => setSelectedGroup(null)} className="md:hidden text-slate-600"><X size={20}/></button>
                 <img src={selectedGroup.image} alt={selectedGroup.name} className="w-10 h-10 rounded-full object-cover" />
                 <div>
                   <h4 className="font-bold text-slate-800 leading-tight">{selectedGroup.name}</h4>
                   <p className="text-xs text-slate-500">{selectedGroup.members} members</p>
                 </div>
               </div>
               <div className="flex gap-2 text-slate-600">
                 <Search size={20} className="cursor-pointer hover:text-slate-900" />
                 <MoreVertical size={20} className="cursor-pointer hover:text-slate-900" />
               </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3" ref={chatScrollRef} style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', opacity: 0.9 }}>
               {messages.length === 0 && (
                 <div className="text-center py-10">
                   <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded shadow-sm">
                     Messages are end-to-end encrypted.
                   </span>
                 </div>
               )}
               {messages.map(msg => (
                 <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                   <div className={`max-w-[75%] p-2 px-3 rounded-lg shadow-sm text-sm ${msg.isMe ? 'bg-[#d9fdd3] rounded-tr-none' : 'bg-white rounded-tl-none'}`}>
                     {!msg.isMe && <p className="text-[10px] font-bold text-orange-600 mb-0.5">{msg.sender}</p>}
                     <p className="text-slate-800">{msg.text}</p>
                     <span className="text-[9px] text-slate-500 block text-right mt-1">{msg.timestamp}</span>
                   </div>
                 </div>
               ))}
            </div>

            <div className="p-3 bg-slate-100 flex items-center gap-2">
              <button className="text-slate-500 hover:text-slate-700"><ImageIcon size={24}/></button>
              <input 
                type="text" 
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message" 
                className="flex-1 p-2 rounded-lg border border-slate-300 focus:outline-none focus:border-green-500"
              />
              <button onClick={handleSendMessage} className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 shadow-sm">
                <Send size={18} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50 border-l border-slate-200">
            <Users size={64} className="opacity-20 mb-4" />
            <p className="font-medium">Select a community group to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Nav */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="text-brand-600" /> Community Hub
          </h2>
          <p className="text-slate-500">Stay informed, share stories, and connect with peers.</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
           <button 
             onClick={() => setActiveView('news')}
             className={`px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${activeView === 'news' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
           >
             <Newspaper size={16} /> News
           </button>
           <button 
             onClick={() => setActiveView('blogs')}
             className={`px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${activeView === 'blogs' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
           >
             <PenSquare size={16} /> Blogs
           </button>
           <button 
             onClick={() => setActiveView('groups')}
             className={`px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${activeView === 'groups' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
           >
             <MessageSquare size={16} /> Groups
           </button>
        </div>
      </div>

      {activeView === 'news' && renderNews()}
      {activeView === 'blogs' && renderBlogs()}
      {activeView === 'groups' && renderGroups()}
    </div>
  );
};
