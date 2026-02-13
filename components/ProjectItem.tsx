
import React from 'react';
import { Gamepad2, TrendingUp, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Project } from '../types';

interface ProjectItemProps {
  project: Project;
}

const ProjectItem: React.FC<ProjectItemProps> = ({ project }) => {
  const Icon = project.icon === 'game' ? Gamepad2 : TrendingUp;
  const isPending = project.status === 'pending';

  return (
    <div className="group px-6 py-5 cursor-pointer hover:bg-white/5 active:bg-white/10 transition-all">
      <div className="flex items-start space-x-4">
        <div className={`relative flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
          isPending 
            ? 'bg-blue-500/10 border border-blue-500/30' 
            : 'bg-white/5 border border-white/5 group-hover:border-white/20'
        }`}>
          <Icon className={`w-6 h-6 ${isPending ? 'text-blue-400 animate-pulse' : 'text-white/60'}`} strokeWidth={1.5} />
          
          {project.status === 'completed' && (
            <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5 border-2 border-[#121212]">
              <CheckCircle2 size={10} className="text-white" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h3 className="text-[15px] font-bold text-white/90 truncate pr-2 tracking-tight">
              {project.title}
            </h3>
            <div className="flex items-center space-x-2 shrink-0">
              {isPending ? (
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md">Processing</span>
              ) : (
                <span className="text-[11px] text-white/20 font-medium">{project.date}</span>
              )}
            </div>
          </div>
          
          <p className="text-[13px] text-white/30 truncate mt-1">
            {project.description}
          </p>

          {isPending && (
            <div className="mt-3">
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-1000 ease-out" 
                  style={{ width: `${project.progress || 45}%` }}
                />
              </div>
              <div className="flex justify-between mt-1.5 text-[10px] font-mono text-white/20 tracking-tighter">
                <span>ORCHESTRATING_ENGINE</span>
                <span>{project.progress || 45}%</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectItem;
