
import React from 'react';
import { 
  X, Camera, Image as ImageIcon, Paperclip, Puzzle, 
  Layout, Smartphone, Presentation, ImageIcon as CreateImageIcon,
  Sparkles, CheckCircle2
} from 'lucide-react';

interface SkillsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSkillClick?: (skill: string) => void;
}

const QuickAction: React.FC<{ icon: React.ReactNode; label: string; onClick?: () => void }> = ({ icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center justify-center bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.08] active:scale-95 transition-all rounded-[2rem] p-5 flex-1 h-32 shadow-xl"
  >
    <div className="text-white/40 mb-3 transition-colors group-hover:text-blue-500">{icon}</div>
    <span className="text-[13px] font-bold text-white/70 uppercase tracking-widest">{label}</span>
  </button>
);

const SkillListItem: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  hasBadge?: boolean;
  onClick?: () => void;
}> = ({ icon, label, hasBadge, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between py-5 px-4 active:bg-white/[0.05] transition-all border-b border-white/[0.04] last:border-b-0 group"
  >
    <div className="flex items-center space-x-4">
      <div className="text-white/30 group-hover:text-blue-500 transition-colors">{icon}</div>
      <span className="text-[16px] text-white/90 font-medium tracking-tight">{label}</span>
    </div>
    {hasBadge ? (
      <div className="flex items-center space-x-2 bg-blue-600/10 border border-blue-500/20 rounded-full px-3 py-1">
        <Sparkles size={10} className="text-blue-400" fill="currentColor" />
        <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Enhanced</span>
      </div>
    ) : (
      <CheckCircle2 size={16} className="text-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
    )}
  </button>
);

const SkillsModal: React.FC<SkillsModalProps> = ({ isOpen, onClose, onSkillClick }) => {
  if (!isOpen) return null;

  const handleSkillSelect = (skill: string) => {
    onSkillClick?.(skill);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex flex-col justify-end bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative w-full max-w-md mx-auto bg-[#0F0F0F] rounded-t-[3.5rem] border-t border-white/[0.1] p-6 flex flex-col shadow-[0_-20px_80px_rgba(0,0,0,0.8)] animate-in slide-in-from-bottom duration-500">
        <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-8 mt-1" />
        
        <div className="flex space-x-4 mb-8">
          <QuickAction icon={<Camera className="w-8 h-8" strokeWidth={1.5} />} label="Snap" />
          <QuickAction icon={<ImageIcon className="w-8 h-8" strokeWidth={1.5} />} label="Library" />
          <QuickAction icon={<Paperclip className="w-8 h-8" strokeWidth={1.5} />} label="Asset" />
        </div>

        <div className="flex flex-col mb-6 bg-white/[0.02] border border-white/[0.05] rounded-[2.5rem] overflow-hidden shadow-inner">
          <SkillListItem icon={<Puzzle className="w-6 h-6" />} label="Extended Modules" />
          <SkillListItem 
            icon={<Layout className="w-6 h-6" />} 
            label="Neural Web Design" 
            onClick={() => handleSkillSelect('Design a premium SaaS landing page with futuristic aesthetics')}
          />
          <SkillListItem 
            icon={<Smartphone className="w-6 h-6" />} 
            label="Hybrid App Forge" 
            onClick={() => handleSkillSelect('Forge a React Native task manager with neural categorization')}
          />
          <SkillListItem icon={<Presentation className="w-6 h-6" />} label="Visual Synthesis" hasBadge />
          <SkillListItem icon={<CreateImageIcon className="w-6 h-6" />} label="Asset Generation" hasBadge />
        </div>

        <div className="h-6 w-full" />
      </div>
    </div>
  );
};

export default SkillsModal;
