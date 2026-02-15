
import React, { useState } from 'react';
import { 
  X, Sparkles, Calendar, BookOpen, Mail, Database, 
  Puzzle, Plug2, User, Globe, Moon, Trash2, 
  ChevronRight, ChevronUp, ChevronDown, Info, LogOut, Clock,
  Download, Settings, Bot
} from 'lucide-react';

interface SettingsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onAction: (action: string) => void;
  credits: number;
  isLoggedIn: boolean;
  user: {name: string, email: string, photo: string} | null;
  isDarkMode: boolean;
}

const SettingsItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  value?: string;
  showChevron?: boolean;
  onClick?: () => void;
  destructive?: boolean;
}> = ({ icon, label, value, showChevron = true, onClick, destructive = false }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between py-4.5 px-6 transition-all group active:bg-white/[0.04] border-b border-white/[0.04] last:border-b-0"
  >
    <div className="flex items-center space-x-4">
      <div className={`${destructive ? 'text-red-500' : 'text-white/40'} group-active:text-blue-500 transition-colors`}>{icon}</div>
      <span className={`text-[16px] font-medium tracking-tight ${destructive ? 'text-red-500' : 'text-white/90'}`}>{label}</span>
    </div>
    <div className="flex items-center space-x-3">
      {value && <span className="text-[14px] font-bold text-white/30">{value}</span>}
      {showChevron && <ChevronRight className="w-4 h-4 text-white/10 group-active:text-white/40" />}
    </div>
  </button>
);

const SettingsMenu: React.FC<SettingsMenuProps> = ({ isOpen, onClose, onAction, credits, isLoggedIn, user, isDarkMode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] overflow-y-auto animate-in slide-in-from-bottom-6 duration-700 no-scrollbar bg-[#0A0A0A] text-white">
      <div className="max-w-md mx-auto min-h-screen flex flex-col pb-12">
        
        <div className="flex justify-between items-center p-8 sticky top-0 z-10 backdrop-blur-3xl bg-[#0A0A0A]/80 border-b border-white/[0.04]">
          <h2 className="text-2xl font-black tracking-tight">System Identity</h2>
          <button onClick={onClose} className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 transition-all">
            <X className="w-5 h-5 text-white/40" />
          </button>
        </div>

        {/* Auth Section */}
        <div className="px-6 py-10">
          {!isLoggedIn ? (
            <div className="rounded-[3rem] p-10 border border-white/[0.06] bg-white/[0.02] text-center flex flex-col items-center space-y-8 shadow-2xl">
              <div className="w-20 h-20 rounded-[2rem] bg-white flex items-center justify-center shadow-2xl">
                 <img src="https://www.google.com/favicon.ico" alt="Google" className="w-10 h-10" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-black">Sync with Manus</h3>
                <p className="text-sm text-white/30 font-medium">Connect your account to sync your agents.</p>
              </div>
              <button onClick={() => onAction('login')} className="w-full h-16 rounded-[2rem] bg-white text-black font-black text-sm uppercase tracking-widest shadow-xl">Link Account</button>
            </div>
          ) : (
            <div className="rounded-[2.5rem] p-6 border border-white/[0.06] bg-white/[0.02] flex items-center space-x-5 shadow-lg">
              <img src={user?.photo} alt="Avatar" className="w-16 h-16 rounded-[1.5rem] border border-white/10" />
              <div className="flex-1">
                <h3 className="text-lg font-black">{user?.name}</h3>
                <p className="text-xs font-bold text-white/20 uppercase tracking-widest">{user?.email}</p>
              </div>
              <button onClick={() => onAction('logout')} className="p-3.5 rounded-2xl bg-white/5 hover:text-red-400"><LogOut size={20} /></button>
            </div>
          )}
        </div>

        {/* Menu Section */}
        <div className="mb-12">
          <h3 className="px-9 text-[11px] font-black uppercase tracking-[0.3em] mb-5 text-white/20">Protocol Management</h3>
          <div className="mx-6 rounded-[2.5rem] overflow-hidden border border-white/[0.06] bg-white/[0.02] shadow-xl">
            <SettingsItem icon={<Bot className="w-5 h-5" />} label="Agent Fleet" onClick={() => onAction('agents')} />
            <SettingsItem icon={<Clock className="w-5 h-5" />} label="Neural Archive" onClick={() => onAction('history')} />
            <SettingsItem icon={<Plug2 className="w-5 h-5" />} label="Core Connectors" onClick={() => onAction('connectors')} />
            <SettingsItem icon={<Download className="w-5 h-5" />} label="Export Local Vault" onClick={() => onAction('export_all')} />
          </div>
        </div>

        <div className="px-10 flex flex-col items-center text-center space-y-5">
           <div className="w-12 h-[1px] bg-white/10" />
           <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white/20">Manus Autonomous System v2.6.0</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsMenu;
