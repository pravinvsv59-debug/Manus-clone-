
import React from 'react';
import { User, Bell, Sparkles } from 'lucide-react';

interface HeaderProps {
  onProfileClick: () => void;
  credits: number;
  isLoggedIn: boolean;
}

const Header: React.FC<HeaderProps> = ({ onProfileClick, credits, isLoggedIn }) => {
  return (
    <header className="flex items-center justify-between px-6 py-5 sticky top-0 bg-[#121212]/80 backdrop-blur-xl z-20 border-b border-white/5">
      <button 
        onClick={onProfileClick}
        className="relative group shrink-0"
      >
        <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-all overflow-hidden">
          {isLoggedIn ? (
            <img src="https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff" alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <User className="w-5 h-5 text-white/40" />
          )}
        </div>
      </button>
      
      <h1 className="text-2xl font-manus lowercase tracking-tight absolute left-1/2 -translate-x-1/2">manus</h1>
      
      <div className="flex items-center space-x-3">
        <div className="hidden sm:flex items-center space-x-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
          <Sparkles className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" />
          <span className="text-xs font-black">{credits}</span>
        </div>
        <button className="relative p-2 hover:bg-white/10 rounded-xl transition-colors">
          <Bell className="w-5 h-5 text-white/60" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-blue-500 rounded-full border border-[#121212]" />
        </button>
      </div>
    </header>
  );
};

export default Header;
