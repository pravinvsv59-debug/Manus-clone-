
import React from 'react';
import { Plus } from 'lucide-react';

interface FloatingButtonProps {
  onClick: () => void;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({ onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="fixed bottom-8 right-6 w-16 h-16 bg-white rounded-3xl shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform group z-20"
    >
      <Plus className="w-8 h-8 text-black" strokeWidth={2.5} />
      <div className="absolute inset-0 rounded-3xl group-hover:bg-black/5 transition-colors"></div>
    </button>
  );
};

export default FloatingButton;
