import React, { useState, useEffect } from 'react';
import { Search, HeartHandshake, CheckCircle2, X, Share2, Filter, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { api } from '../services/apiService';

interface NGO {
  _id?: string;
  id: string;
  name: string;
  cause: string;
  description: string;
  image: string;
  raised: number;
  goal: number;
}

const CAUSES = ["All", "Education", "Health", "Environment", "Animal Welfare", "Disaster Relief"];

export const Donations: React.FC = () => {
  const [ngos, setNgos] = useState<NGO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCause, setSelectedCause] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNGO, setSelectedNGO] = useState<NGO | null>(null);
  const [donationAmount, setDonationAmount] = useState<string>("");
  const [paymentStep, setPaymentStep] = useState<'idle' | 'form' | 'confirm' | 'success'>('idle');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchNGOs = async () => {
      setIsLoading(true);
      try {
        const data = await api.ngos.getAllApproved();
        setNgos(data);
      } catch (e) {
        console.error("Failed to load NGOs", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNGOs();
  }, []);

  const filteredNGOs = ngos.filter(ngo => {
    const matchesCause = selectedCause === "All" || ngo.cause === selectedCause;
    const matchesSearch = ngo.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ngo.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCause && matchesSearch;
  });

  const handleDonateClick = (ngo: NGO) => {
    setSelectedNGO(ngo);
    setPaymentStep('form');
    setDonationAmount("");
  };

  const handleConfirmStep = () => {
    setPaymentStep('confirm');
  };

  const handleProcessDonation = async () => {
    setIsProcessing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsProcessing(false);
    setPaymentStep('success');
  };

  const handleClose = () => {
    setPaymentStep('idle');
    setSelectedNGO(null);
    setIsProcessing(false);
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-brand-600" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <HeartHandshake className="text-brand-600" /> Donations & Contributions
          </h2>
          <p className="text-slate-500">Support verified NGOs and make a tangible impact.</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search NGOs..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 w-full md:w-64"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex overflow-x-auto pb-2 gap-2 no-scrollbar">
        {CAUSES.map(cause => (
          <button
            key={cause}
            onClick={() => setSelectedCause(cause)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCause === cause 
                ? 'bg-brand-600 text-white' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cause}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNGOs.map(ngo => {
          const progress = Math.min((ngo.raised / ngo.goal) * 100, 100);
          return (
            <div key={ngo.id || ngo._id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              <div className="h-48 overflow-hidden relative group">
                <img src={ngo.image} alt={ngo.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded text-slate-700">
                  {ngo.cause}
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-slate-800 mb-2">{ngo.name}</h3>
                <p className="text-slate-500 text-sm mb-4 line-clamp-2">{ngo.description}</p>
                
                <div className="mt-auto space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>Raised: ${ngo.raised.toLocaleString()}</span>
                      <span>Goal: ${ngo.goal.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-brand-500 h-full rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleDonateClick(ngo)}
                      className="flex-1 bg-brand-600 text-white py-2 rounded-lg font-medium hover:bg-brand-700 transition-colors"
                    >
                      Donate Now
                    </button>
                    <button className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-800">
                      <Share2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredNGOs.length === 0 && (
        <div className="text-center py-20 text-slate-400">
          <Filter size={48} className="mx-auto mb-4 opacity-50" />
          <p>No NGOs found matching your criteria.</p>
        </div>
      )}

      {/* Donation Modal / Overlay */}
      {paymentStep !== 'idle' && selectedNGO && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-scale-in">
            
            {paymentStep === 'form' && (
              <>
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                  <h3 className="font-bold text-lg text-slate-800">Donate to {selectedNGO.name}</h3>
                  <button onClick={handleClose} className="text-slate-400 hover:text-slate-600">
                    <X size={20} />
                  </button>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">Select Amount</label>
                    <div className="grid grid-cols-3 gap-3 mb-3">
                      {['10', '50', '100'].map(amt => (
                        <button
                          key={amt}
                          onClick={() => setDonationAmount(amt)}
                          className={`py-2 rounded-lg border text-sm font-medium transition-colors ${
                            donationAmount === amt 
                              ? 'bg-brand-50 border-brand-500 text-brand-700' 
                              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          ${amt}
                        </button>
                      ))}
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                      <input
                        type="number"
                        placeholder="Custom Amount"
                        value={donationAmount}
                        onChange={(e) => setDonationAmount(e.target.value)}
                        className="w-full pl-8 pr-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleConfirmStep}
                    disabled={!donationAmount}
                    className="w-full bg-brand-600 text-white py-3 rounded-lg font-bold hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Confirm Donation Details
                  </button>
                  <p className="text-xs text-center text-slate-400">
                    Payments are securely processed. 100% goes to the cause.
                  </p>
                </div>
              </>
            )}

            {paymentStep === 'confirm' && (
              <div className="p-8 text-center animate-slide-up">
                <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-6 border border-brand-100">
                  <AlertCircle size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-4">Confirm Your Contribution</h3>
                
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-left mb-6 space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <span className="text-sm text-slate-500 font-medium">Organization</span>
                    <span className="text-sm font-bold text-slate-800">{selectedNGO.name}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-sm text-slate-500 font-medium">Donation Amount</span>
                    <span className="text-lg font-black text-brand-600">${donationAmount}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleProcessDonation}
                    disabled={isProcessing}
                    className="w-full bg-brand-600 text-white py-4 rounded-xl font-bold hover:bg-brand-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-600/20 active:scale-95"
                  >
                    {isProcessing ? <Loader2 className="animate-spin" size={20} /> : 'Process Secure Donation'}
                  </button>
                  <button
                    onClick={() => setPaymentStep('form')}
                    disabled={isProcessing}
                    className="w-full py-3 text-slate-500 font-bold hover:text-slate-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowLeft size={18} /> Go Back & Edit
                  </button>
                </div>
                
                <p className="mt-6 text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                  By clicking process, you agree to our community contribution policy and terms of service.
                </p>
              </div>
            )}

            {paymentStep === 'success' && (
              <div className="p-8 text-center animate-fade-in">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Thank You!</h3>
                <p className="text-slate-600 mb-6">
                  Your donation of <strong>${donationAmount}</strong> to <strong>{selectedNGO.name}</strong> has been received.
                </p>
                <div className="flex flex-col gap-3">
                   <button className="w-full py-3 border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50">
                     Download Receipt
                   </button>
                   <button 
                     onClick={handleClose}
                     className="w-full bg-brand-600 text-white py-3 rounded-lg font-medium hover:bg-brand-700"
                   >
                     Done
                   </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
