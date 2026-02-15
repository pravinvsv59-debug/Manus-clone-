
import React from 'react';
import { User, Sparkles, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  onProfileClick: () => void;
  credits: number;
  isLoggedIn: boolean;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ onProfileClick, credits, isLoggedIn, isDarkMode, onToggleTheme }) => {
  return (
    <header className="flex items-center justify-between px-6 py-5 sticky top-0 backdrop-blur-3xl z-40 bg-black/40 border-b border-white/[0.04]">
      {/* LEFT: Profile Icon */}
      <div className="flex-1 flex justify-start">
        <button 
          onClick={onProfileClick} 
          className="relative active:scale-90 transition-transform group focus:outline-none"
          aria-label={isLoggedIn ? "Open profile settings" : "Log in to Manus"}
        >
          <div className="w-11 h-11 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center overflow-hidden shadow-2xl transition-all group-hover:border-blue-500/40 group-hover:bg-white/[0.06]">
            {isLoggedIn ? (
              <img src="https://ui-avatars.com/api/?name=User&background=2563EB&color=fff" alt="User Profile Avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="w-5 h-5 opacity-30" aria-hidden="true" />
            )}
          </div>
          {/* Live Status Pulse */}
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0A0A0A] shadow-[0_0_12px_rgba(34,197,94,0.6)] animate-pulse" aria-hidden="true" />
        </button>
      </div>
      
      {/* CENTER: Brand Logo */}
      <div className="flex-none flex flex-col items-center select-none" role="img" aria-label="Manus Brand Logo">
        <h1 className="text-2xl font-manus lowercase tracking-tighter leading-none text-white font-black">manus</h1>
        <div className="h-[2px] w-5 mt-2 bg-blue-600 rounded-full shadow-[0_0_12px_rgba(37,99,235,1)] animate-pulse" aria-hidden="true" />
      </div>
      
      {/* RIGHT: Credits & Theme */}
      <div className="flex-1 flex justify-end items-center space-x-3">
        <div 
          className="flex items-center space-x-2 px-3 py-1.5 bg-white/[0.03] border border-white/[0.06] rounded-xl shadow-inner group cursor-default"
          aria-label={`${credits} neural tokens available`}
          title="Neural Tokens"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-500" fill="currentColor" aria-hidden="true" />
          <span className="text-[11px] font-black tracking-widest tabular-nums text-white/70">{credits.toLocaleString()}</span>
        </div>

        <button 
          onClick={onToggleTheme} 
          className="w-10 h-10 flex items-center justify-center bg-white/[0.03] border border-white/[0.06] rounded-xl active:scale-90 transition-all text-white/30 hover:text-white"
          aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
        >
          {isDarkMode ? <Sun size={16} strokeWidth={2.5} /> : <Moon size={16} strokeWidth={2.5} />}
        </button>
      </div>
    </header>
  );
};

export default Header;
