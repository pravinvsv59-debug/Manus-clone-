
import React from 'react';
import { Gamepad2, TrendingUp, CheckCircle2, Globe, Smartphone, ChevronRight, Activity, Palette } from 'lucide-react';
import { Project } from '../types';

interface ProjectItemProps {
  project: Project;
  isDarkMode: boolean;
}

const ProjectItem: React.FC<ProjectItemProps> = ({ project, isDarkMode }) => {
  const getIcon = () => {
    switch (project.icon) {
      case 'web': return Globe;
      case 'mobile': return Smartphone;
      case 'chart': return TrendingUp;
      case 'palette': return Palette;
      default: return Gamepad2;
    }
  };
  
  const Icon = getIcon();
  const isPending = project.status === 'pending';

  return (
    <div className={`group relative mx-5 mb-3 p-5 rounded-[2.25rem] border transition-all duration-500 overflow-hidden ${
      isDarkMode 
        ? 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.12] shadow-xl' 
        : 'bg-white border-black/[0.03] hover:border-black/10 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)]'
    }`}>
      {/* Subtle Glow Effect for Pending */}
      {isPending && (
        <div className="absolute inset-0 bg-blue-600/[0.02] animate-pulse-slow pointer-events-none" aria-hidden="true" />
      )}

      <div className="flex items-center space-x-5 relative z-10">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-700 shrink-0 ${
          isPending 
            ? 'bg-blue-600 shadow-[0_10px_30px_-5px_rgba(37,99,235,0.5)]' 
            : 'bg-white/[0.03] border border-white/[0.06] group-hover:scale-105'
        }`}>
          <Icon className={`w-7 h-7 ${isPending ? 'text-white' : 'text-white/30 group-hover:text-white/60'}`} strokeWidth={1.5} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-[15px] font-black tracking-tight truncate pr-4 text-white/90">{project.title}</h3>
            {isPending ? (
              <div className="flex items-center space-x-2 px-2.5 py-1 rounded-full bg-blue-600/10 border border-blue-600/20">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-[8px] font-black uppercase tracking-widest text-blue-500">Syncing</span>
              </div>
            ) : (
              <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-20 shrink-0">{project.date}</span>
            )}
          </div>
          
          <p className="text-[12px] truncate opacity-40 font-medium tracking-tight pr-6">{project.description}</p>
          
          {isPending && (
            <div className="mt-4 flex items-center space-x-3">
              <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-white/5 border border-white/5">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(37,99,235,0.4)]" 
                  style={{ width: `${project.progress || 45}%` }} 
                />
              </div>
              <span className="text-[10px] font-black text-blue-500/60 w-8 text-right tabular-nums">{project.progress || 45}%</span>
            </div>
          )}
        </div>

        <div className="p-2 transition-transform group-hover:translate-x-1">
          <ChevronRight size={18} className="opacity-10 group-hover:opacity-40" />
        </div>
      </div>
    </div>
  );
};

export default ProjectItem;
