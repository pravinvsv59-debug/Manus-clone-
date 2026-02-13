
import React from 'react';
import { 
  Camera, Image as ImageIcon, Paperclip, Puzzle, 
  Layout, Smartphone, Presentation, ImageIcon as CreateImageIcon 
} from 'lucide-react';

interface SkillsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSkillClick?: (skill: string) => void;
}

const QuickAction: React.FC<{ icon: React.ReactNode; label: string; onClick?: () => void }> = ({ icon, label, onClick }) => (
  <div 
    onClick={onClick}
    className="flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 active:bg-white/15 transition-colors rounded-2xl p-4 cursor-pointer flex-1 h-28"
  >
    <div className="text-white/80 mb-2">{icon}</div>
    <span className="text-sm font-medium text-white/90">{label}</span>
  </div>
);

const SkillListItem: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  hasBadge?: boolean;
  onClick?: () => void;
}> = ({ icon, label, hasBadge, onClick }) => (
  <div 
    onClick={onClick}
    className="flex items-center justify-between py-4 px-2 active:bg-white/5 cursor-pointer transition-colors border-b border-white/5 last:border-b-0"
  >
    <div className="flex items-center space-x-4">
      <div className="text-white/60">{icon}</div>
      <span className="text-[16px] text-white/90 font-medium">{label}</span>
    </div>
    {hasBadge && (
      <div className="flex items-center space-x-1 bg-yellow-600/20 border border-yellow-600/30 rounded-full px-2.5 py-1">
        <span className="text-[10px] leading-none">🍌</span>
        <span className="text-[10px] font-bold text-yellow-500 uppercase tracking-tight">Nano Banana Pro</span>
      </div>
    )}
  </div>
);

const SkillsModal: React.FC<SkillsModalProps> = ({ isOpen, onClose, onSkillClick }) => {
  if (!isOpen) return null;

  const handleSkillSelect = (skill: string) => {
    onSkillClick?.(skill);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex flex-col justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative w-full max-w-md mx-auto bg-[#1E1E1E] rounded-t-[32px] p-4 flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="w-12 h-1 bg-white/10 rounded-full mx-auto mb-6 mt-1" />
        
        {/* Top Grid: Camera, Picture, File */}
        <div className="flex space-x-3 mb-6">
          <QuickAction icon={<Camera className="w-7 h-7" strokeWidth={1.5} />} label="Camera" />
          <QuickAction icon={<ImageIcon className="w-7 h-7" strokeWidth={1.5} />} label="Picture" />
          <QuickAction icon={<Paperclip className="w-7 h-7" strokeWidth={1.5} />} label="File" />
        </div>

        {/* Skills List */}
        <div className="flex flex-col mb-4">
          <SkillListItem icon={<Puzzle className="w-6 h-6" />} label="Add Skills" />
          <SkillListItem 
            icon={<Layout className="w-6 h-6" />} 
            label="Build website" 
            onClick={() => handleSkillSelect('Build a modern responsive website')}
          />
          <SkillListItem 
            icon={<Smartphone className="w-6 h-6" />} 
            label="Develop apps" 
            onClick={() => handleSkillSelect('Create a React Native mobile app')}
          />
          <SkillListItem icon={<Presentation className="w-6 h-6" />} label="Create slides" hasBadge />
          <SkillListItem icon={<CreateImageIcon className="w-6 h-6" />} label="Create image" hasBadge />
        </div>

        {/* Home Indicator Space */}
        <div className="h-4 w-full" />
      </div>
    </div>
  );
};

export default SkillsModal;
