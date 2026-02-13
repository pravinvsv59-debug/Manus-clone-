
import React from 'react';
import { X, Check, Zap, Sparkles, CreditCard, ShieldCheck } from 'lucide-react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase: (amount: number) => void;
}

const PlanCard: React.FC<{
  title: string;
  price: string;
  tokens: number;
  features: string[];
  recommended?: boolean;
  onClick: () => void;
}> = ({ title, price, tokens, features, recommended, onClick }) => (
  <div 
    onClick={onClick}
    className={`relative rounded-[2.5rem] p-6 border-2 transition-all active:scale-95 cursor-pointer ${
      recommended 
        ? 'bg-blue-600 border-blue-400 shadow-2xl shadow-blue-600/30' 
        : 'bg-white/5 border-white/10 hover:border-white/20'
    }`}
  >
    {recommended && (
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
        Most Popular
      </div>
    )}
    <h3 className={`text-lg font-bold ${recommended ? 'text-white' : 'text-white/90'}`}>{title}</h3>
    <div className="mt-4 flex items-baseline space-x-1">
      <span className="text-3xl font-black">{price}</span>
      <span className="text-xs opacity-40">/mo</span>
    </div>
    <div className="mt-2 flex items-center space-x-1.5">
       <Sparkles size={12} className={recommended ? 'text-white' : 'text-yellow-400'} fill="currentColor" />
       <span className="text-sm font-bold">{tokens} Tokens</span>
    </div>
    <ul className="mt-6 space-y-3">
      {features.map((f, i) => (
        <li key={i} className="flex items-start space-x-2 text-[12px] opacity-70">
          <Check size={14} className="shrink-0 mt-0.5" />
          <span>{f}</span>
        </li>
      ))}
    </ul>
  </div>
);

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose, onPurchase }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex flex-col justify-end bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative w-full max-w-md mx-auto bg-[#121212] rounded-t-[3rem] border-t border-white/10 p-6 flex flex-col max-h-[90vh] overflow-y-auto no-scrollbar animate-in slide-in-from-bottom duration-500">
        
        <div className="flex justify-between items-center mb-8">
          <div className="flex flex-col">
            <h2 className="text-2xl font-black tracking-tight">Fuel your Agent</h2>
            <p className="text-sm text-white/30">Select a plan to continue building.</p>
          </div>
          <button onClick={onClose} className="p-2 bg-white/5 rounded-full"><X size={20} /></button>
        </div>

        {/* Insufficient Message */}
        <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-4 mb-8 flex items-center space-x-3">
          <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center text-red-400">
            <Zap size={20} />
          </div>
          <p className="text-xs font-bold text-red-200/80 leading-relaxed">
            Your neural tokens are exhausted. Upgrade to a premium tier to resume autonomous operations.
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <PlanCard 
            title="Starter Pack"
            price="$9"
            tokens={5000}
            features={['Basic web generation', 'Research agent access', 'Cloud sync']}
            onClick={() => onPurchase(5000)}
          />
          <PlanCard 
            recommended
            title="Professional"
            price="$29"
            tokens={25000}
            features={['Unlimited complex builds', 'Priority engine cycles', 'Dedicated connectors', 'Custom skill training']}
            onClick={() => onPurchase(25000)}
          />
          <PlanCard 
            title="Enterprise"
            price="$99"
            tokens={100000}
            features={['Advanced multi-agent team', 'SLA guaranteed uptime', 'API access']}
            onClick={() => onPurchase(100000)}
          />
        </div>

        <div className="px-6 py-6 bg-white/5 rounded-[2rem] flex items-center justify-between">
           <div className="flex items-center space-x-3">
              <ShieldCheck className="text-green-400" />
              <div className="flex flex-col">
                 <span className="text-[10px] font-black uppercase text-white/30 tracking-widest">Secured by</span>
                 <span className="text-sm font-bold">Stripe Architecture</span>
              </div>
           </div>
           <CreditCard size={24} className="text-white/20" />
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;
