
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { ShieldCheck, Mail, Lock, User, Loader2, AlertCircle, Smartphone, KeyRound, Ghost, X, CheckCircle2 } from 'lucide-react';
import { api } from '../services/apiService';

interface AuthProps {
  onLogin: (user: UserProfile) => void;
  onClose: () => void;
}

// Simple Icon Components for Brands
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const MicrosoftIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 23 23">
    <path fill="#f3f3f3" d="M0 0h23v23H0z"/>
    <path fill="#f35325" d="M1 1h10v10H1z"/>
    <path fill="#81bc06" d="M12 1h10v10H12z"/>
    <path fill="#05a6f0" d="M1 12h10v10H1z"/>
    <path fill="#ffba08" d="M12 12h10v10H12z"/>
  </svg>
);

const YahooIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#6001D2">
    <path d="M14.2 21.67h2.89L24 2.33h-3.41l-4.7 13.96h-.14L10.99 2.33H7.47l7.26 18.28-.53 1.06H14.2v-.01zM1.4 6.72l4.87 1.83.6-2.27L0 3.65v2.24l1.4.83z"/>
  </svg>
);

const AppleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 384 512" fill="currentColor">
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 52.3-11.4 69.5-34.3z"/>
  </svg>
);

export const Auth: React.FC<AuthProps> = ({ onLogin, onClose }) => {
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [demoOtp, setDemoOtp] = useState<string | null>(null);
  
  // Email Form
  const [emailData, setEmailData] = useState({ name: '', email: '', password: '', role: 'CITIZEN' as UserProfile['role'] });
  
  // Phone Form
  const [phoneData, setPhoneData] = useState({ phoneNumber: '', otp: '', name: '' });
  const [showOtpInput, setShowOtpInput] = useState(false);

  // Email/Pass Handler
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      if (isLogin) {
        const user = await api.auth.login(emailData.email, emailData.password);
        onLogin(user);
      } else {
        const user = await api.auth.signup(emailData);
        onLogin(user);
      }
    } catch (e: any) {
      setError(e.message || "Authentication failed. Check credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  // Phone OTP Handler
  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      if (!showOtpInput) {
        // Step 1: Request OTP
        const res = await api.auth.sendOtp(phoneData.phoneNumber);
        setShowOtpInput(true);
        // Display OTP to user in demo mode
        if(res.mockOtp) {
          setDemoOtp(res.mockOtp);
        }
      } else {
        // Step 2: Verify OTP
        const user = await api.auth.verifyOtp(phoneData.phoneNumber, phoneData.otp, phoneData.name);
        onLogin(user);
      }
    } catch (e: any) {
      setError(e.message || "Phone authentication failed. Check Number/OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  // Social Handler (Mock)
  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true);
    setError('');
    try {
      // In a real app, this would redirect to provider via window.location
      const dummyId = `mock_${provider}_${Date.now()}`;
      const user = await api.auth.oauthLogin(
        provider.toUpperCase(), 
        `user_${dummyId}@${provider.toLowerCase()}.com`, 
        `${provider} User`, 
        dummyId
      );
      onLogin(user);
    } catch (e: any) {
      setError(e.message || `${provider} login failed`);
    } finally {
      setIsLoading(false);
    }
  };

  // Guest Handler
  const handleGuestLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      const user = await api.auth.guestLogin();
      onLogin(user);
    } catch (e: any) {
      setError(e.message || "Guest login failed. Server might be busy.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, type: 'email' | 'phone') => {
    if (type === 'email') setEmailData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    else setPhoneData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-scale-in relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        <div className="bg-brand-600 p-8 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl font-black mb-1 tracking-tighter">SEWA</h1>
            <p className="text-brand-100 font-medium text-xs opacity-90">Secure Access Portal</p>
          </div>
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
          <ShieldCheck className="absolute -top-8 -left-8 w-32 h-32 text-brand-500 opacity-30 rotate-12" />
        </div>

        <div className="p-8 pt-6 max-h-[80vh] overflow-y-auto">
          {/* Auth Method Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
            <button
              onClick={() => { setAuthMethod('email'); setError(''); setDemoOtp(null); setShowOtpInput(false); }}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${authMethod === 'email' ? 'bg-white shadow-sm text-brand-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Email / Password
            </button>
            <button
              onClick={() => { setAuthMethod('phone'); setError(''); setDemoOtp(null); }}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${authMethod === 'phone' ? 'bg-white shadow-sm text-brand-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Phone / OTP
            </button>
          </div>

          <h2 className="text-xl font-bold text-slate-800 mb-2 text-center">
            {authMethod === 'email' ? (isLogin ? 'Welcome Back' : 'Create Account') : 'Mobile Login'}
          </h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-700 text-xs font-medium animate-shake">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          {/* Demo OTP Banner */}
          {demoOtp && showOtpInput && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex flex-col gap-1 animate-slide-up">
              <div className="flex items-center gap-2 text-green-800 font-bold text-sm">
                <CheckCircle2 size={16} />
                OTP Sent Successfully
              </div>
              <p className="text-xs text-green-700 pl-6">
                Use code <span className="font-black bg-white px-1.5 py-0.5 rounded border border-green-200 select-all">{demoOtp}</span> to login.
              </p>
            </div>
          )}

          {authMethod === 'email' ? (
            /* EMAIL FORM */
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Legal Name</label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-brand-600 transition-colors" />
                    <input
                      name="name"
                      required
                      type="text"
                      placeholder="Enter full name"
                      value={emailData.name}
                      onChange={(e) => handleChange(e, 'email')}
                      className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 focus:outline-none transition-all bg-slate-50 text-sm"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-brand-600 transition-colors" />
                  <input
                    name="email"
                    required
                    type="email"
                    placeholder="name@example.com"
                    value={emailData.email}
                    onChange={(e) => handleChange(e, 'email')}
                    className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 focus:outline-none transition-all bg-slate-50 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-brand-600 transition-colors" />
                  <input
                    name="password"
                    required
                    type="password"
                    placeholder="••••••••"
                    value={emailData.password}
                    onChange={(e) => handleChange(e, 'email')}
                    className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 focus:outline-none transition-all bg-slate-50 text-sm"
                  />
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Role</label>
                  <select 
                    name="role"
                    value={emailData.role} 
                    onChange={(e) => handleChange(e, 'email')}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 focus:outline-none transition-all bg-slate-50 text-sm appearance-none font-medium text-slate-700"
                  >
                    <option value="CITIZEN">Citizen / Individual</option>
                    <option value="VOLUNTEER">Verified Volunteer</option>
                    <option value="NGO">NGO Partner</option>
                    <option value="GOVT">Government Liaison</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand-600 text-white py-3.5 rounded-xl font-bold hover:bg-brand-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-600/20 text-sm"
              >
                {isLoading ? <Loader2 className="animate-spin" size={18} /> : (isLogin ? 'Log In' : 'Create Account')}
              </button>
            </form>
          ) : (
            /* PHONE FORM */
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
               {!showOtpInput ? (
                 <div className="space-y-1">
                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Mobile Number</label>
                   <div className="relative group">
                     <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-brand-600 transition-colors" />
                     <input
                       name="phoneNumber"
                       required
                       type="tel"
                       placeholder="+91 98765 43210"
                       value={phoneData.phoneNumber}
                       onChange={(e) => handleChange(e, 'phone')}
                       className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 focus:outline-none transition-all bg-slate-50 text-sm"
                     />
                   </div>
                 </div>
               ) : (
                 <>
                   <div className="space-y-1 animate-fade-in">
                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Enter OTP</label>
                     <div className="relative group">
                       <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-brand-600 transition-colors" />
                       <input
                         name="otp"
                         required
                         type="text"
                         maxLength={4}
                         placeholder="XXXX"
                         value={phoneData.otp}
                         onChange={(e) => handleChange(e, 'phone')}
                         className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 focus:outline-none transition-all bg-slate-50 text-sm tracking-widest font-mono"
                       />
                     </div>
                   </div>
                   <div className="space-y-1 animate-fade-in">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Your Name (Optional)</label>
                      <input
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        value={phoneData.name}
                        onChange={(e) => handleChange(e, 'phone')}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 focus:outline-none transition-all bg-slate-50 text-sm"
                      />
                   </div>
                 </>
               )}
               
               <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-slate-800 text-white py-3.5 rounded-xl font-bold hover:bg-slate-900 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-800/20 text-sm"
              >
                {isLoading ? <Loader2 className="animate-spin" size={18} /> : (showOtpInput ? 'Verify & Login' : 'Send OTP')}
              </button>
            </form>
          )}

          {/* Guest Option */}
          <div className="mt-4">
             <button
              onClick={handleGuestLogin}
              disabled={isLoading}
              className="w-full bg-slate-100 text-slate-600 py-3.5 rounded-xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2 text-sm border border-slate-200"
            >
              <Ghost size={16} /> Continue as Guest
            </button>
          </div>

          {/* Social Login Section */}
          <div className="mt-6">
            <div className="relative flex items-center justify-center mb-4">
              <div className="absolute w-full h-px bg-slate-200"></div>
              <span className="relative bg-white px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Or continue with</span>
            </div>
            
            <div className="grid grid-cols-4 gap-3">
              <button onClick={() => handleSocialLogin('Google')} className="flex items-center justify-center p-3 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all">
                <GoogleIcon />
              </button>
              <button onClick={() => handleSocialLogin('Microsoft')} className="flex items-center justify-center p-3 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all">
                <MicrosoftIcon />
              </button>
              <button onClick={() => handleSocialLogin('Yahoo')} className="flex items-center justify-center p-3 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all">
                <YahooIcon />
              </button>
              <button onClick={() => handleSocialLogin('Apple')} className="flex items-center justify-center p-3 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all">
                <AppleIcon />
              </button>
            </div>
          </div>

          {authMethod === 'email' && (
            <div className="mt-6 text-center">
              <button
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                className="text-slate-500 text-xs font-medium hover:text-brand-600 transition-colors"
              >
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <span className="font-bold border-b border-slate-300 ml-1 pb-0.5">{isLogin ? 'Sign Up' : 'Log In'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
