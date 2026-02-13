
import React, { useState } from 'react';
import { 
  X, Sparkles, Calendar, BookOpen, Mail, Database, 
  Puzzle, Plug2, User, Globe, Moon, Trash2, 
  ChevronRight, ChevronUp, ChevronDown, Info, LogOut
} from 'lucide-react';

interface SettingsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onAction: (action: string) => void;
  credits: number;
  isLoggedIn: boolean;
  user: {name: string, email: string, photo: string} | null;
}

const SettingsItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  value?: string;
  showChevron?: boolean;
  isStatus?: boolean;
  onClick?: () => void;
  destructive?: boolean;
}> = ({ icon, label, value, showChevron = true, isStatus = false, onClick, destructive = false }) => (
  <div 
    onClick={onClick}
    className="flex items-center justify-between py-3.5 px-4 active:bg-white/5 cursor-pointer transition-colors group"
  >
    <div className="flex items-center space-x-4">
      <div className={`${destructive ? 'text-red-400' : 'text-white/60'} group-active:text-white transition-colors`}>{icon}</div>
      <span className={`text-[16px] ${destructive ? 'text-red-400' : 'text-white/90'}`}>{label}</span>
    </div>
    <div className="flex items-center space-x-2">
      {value && <span className="text-[14px] text-white/40">{value}</span>}
      {isStatus ? (
        <div className="flex flex-col items-center">
            <ChevronUp className="w-3 h-3 text-white/20 -mb-1" />
            <ChevronDown className="w-3 h-3 text-white/20" />
        </div>
      ) : (
        showChevron && <ChevronRight className="w-4 h-4 text-white/20" />
      )}
    </div>
  </div>
);

const SettingsMenu: React.FC<SettingsMenuProps> = ({ isOpen, onClose, onAction, credits, isLoggedIn, user }) => {
  const [appearance, setAppearance] = useState('System');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#121212] overflow-y-auto animate-in slide-in-from-bottom duration-500 no-scrollbar">
      <div className="max-w-md mx-auto min-h-screen flex flex-col pb-12">
        
        <div className="flex justify-between items-center p-6 bg-[#121212]/80 backdrop-blur-xl sticky top-0 z-10 border-b border-white/5">
          <h2 className="text-xl font-bold">Preferences</h2>
          <button onClick={onClose} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
            <X className="w-5 h-5 text-white/60" />
          </button>
        </div>

        {/* Auth Section */}
        <div className="px-6 py-8">
          {!isLoggedIn ? (
            <div className="bg-[#1A1A1A] rounded-[2.5rem] p-8 border border-white/5 text-center flex flex-col items-center space-y-6">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl">
                 <img src="https://www.google.com/favicon.ico" alt="Google" className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Join Manus</h3>
                <p className="text-sm text-white/40 leading-relaxed px-4">
                  Sign up with Google to get 1,000 free tokens and sync your tasks across devices.
                </p>
              </div>
              <button 
                onClick={() => onAction('login')}
                className="w-full bg-white text-black h-14 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg"
              >
                Sign in with Google
              </button>
            </div>
          ) : (
            <div className="bg-white/5 rounded-[2.5rem] p-6 border border-white/10 flex items-center space-x-4">
              <img src={user?.photo} alt="Avatar" className="w-14 h-14 rounded-2xl border border-white/10 shadow-lg" />
              <div className="flex-1">
                <h3 className="text-lg font-bold">{user?.name}</h3>
                <p className="text-xs text-white/40">{user?.email}</p>
              </div>
              <button 
                onClick={() => onAction('logout')}
                className="p-3 bg-white/5 rounded-xl hover:bg-red-500/10 text-white/20 hover:text-red-400 transition-all"
              >
                <LogOut size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Credits Card */}
        {isLoggedIn && (
          <div className="px-4 mb-10">
            <div 
              onClick={() => onAction('credits')}
              className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 flex items-center justify-between cursor-pointer hover:shadow-2xl hover:shadow-blue-500/20 transition-all active:scale-95 border border-white/10"
            >
              <div className="flex flex-col">
                <span className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Neural Tokens</span>
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-yellow-400" fill="currentColor" />
                  <span className="text-3xl font-black text-white">{credits}</span>
                </div>
              </div>
              <div className="bg-white/20 px-4 py-2 rounded-xl text-xs font-bold text-white uppercase">
                {credits === 0 ? 'Buy Pack' : 'Top Up'}
              </div>
            </div>
          </div>
        )}

        {/* Manus Section */}
        <div className="mb-10">
          <h3 className="px-6 text-[12px] font-black text-white/20 uppercase tracking-[0.2em] mb-3">Manus Core</h3>
          <div className="bg-[#1A1A1A] rounded-3xl mx-4 overflow-hidden border border-white/5">
            <SettingsItem icon={<Calendar className="w-5 h-5" />} label="Scheduled tasks" />
            <SettingsItem icon={<Puzzle className="w-5 h-5" />} label="Agent Skills" onClick={() => { onClose(); onAction('skills'); }} />
            <SettingsItem icon={<Plug2 className="w-5 h-5" />} label="System Connectors" onClick={() => { onClose(); onAction('connectors'); }} />
            <SettingsItem icon={<Mail className="w-5 h-5" />} label="Support" onClick={() => onAction('mail')} />
          </div>
        </div>

        <div className="px-8 flex flex-col items-center text-center space-y-4">
           <p className="text-[11px] text-white/20 font-medium leading-relaxed">
             Manus Autonomous Framework v2.5.2<br/>
             © 2025 Manus AI Labs
           </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsMenu;
