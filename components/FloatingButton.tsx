
import React from 'react';
import { Plus } from 'lucide-react';

interface FloatingButtonProps {
  onClick: () => void;
  isDarkMode: boolean;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({ onClick, isDarkMode }) => {
  return (
    <div className="fixed bottom-10 right-8 z-30 pointer-events-none">
      <button 
        onClick={onClick}
        aria-label="Start a new AI creation"
        className={`pointer-events-auto w-18 h-18 rounded-[2rem] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] flex items-center justify-center hover:scale-110 active:scale-90 transition-all duration-300 group relative overflow-hidden focus:outline-none focus:ring-4 focus:ring-blue-500/50 ${
          isDarkMode ? 'bg-white text-black' : 'bg-black text-white'
        }`}
      >
        <Plus className="w-9 h-9 relative z-10" strokeWidth={2.5} aria-hidden="true" />
        
        {/* Hover Shine Effect */}
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transform`} aria-hidden="true" />
      </button>
      
      {/* Outer Pulse for visibility */}
      <div className={`absolute inset-0 rounded-[2rem] animate-pulse -z-10 blur-xl opacity-20 ${isDarkMode ? 'bg-white' : 'bg-black'}`} aria-hidden="true" />
    </div>
  );
};

export default FloatingButton;
