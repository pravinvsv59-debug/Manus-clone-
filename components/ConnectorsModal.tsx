
import React, { useState } from 'react';
import { 
  Chrome, Mail, Calendar, HardDrive, Github, Plus, Settings2, 
  ChevronRight, XCircle, AlertCircle, CheckCircle2, Loader2,
  SlidersHorizontal
} from 'lucide-react';

interface ConnectorsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ConnectorItemProps {
  id: string;
  icon: React.ReactNode;
  name: string;
  isConnected: boolean;
  isManaging: boolean;
  onToggle: (id: string) => void;
  onConfigure: (id: string) => void;
}

const ConnectorItem: React.FC<ConnectorItemProps> = ({ 
  id, icon, name, isConnected, isManaging, onToggle, onConfigure 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleClick = async () => {
    setIsProcessing(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    onToggle(id);
    setIsProcessing(false);
  };

  return (
    <div className={`flex items-center justify-between py-3.5 px-4 transition-all duration-200 ${
      isConnected ? 'bg-white/[0.02]' : 'hover:bg-white/[0.02]'
    } group border-b border-white/5 last:border-b-0`}>
      <div className="flex items-center space-x-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
          isConnected ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-white/5 border border-white/5'
        }`}>
          <div className={`${isConnected ? 'text-blue-400' : 'text-white/60'} transition-colors`}>
            {icon}
          </div>
        </div>
        <div className="flex flex-col">
          <span className={`text-[15px] font-semibold tracking-tight ${isConnected ? 'text-white' : 'text-white/70'}`}>
            {name}
          </span>
          {isConnected && (
            <span className="text-[10px] text-blue-400/60 font-black uppercase tracking-widest mt-0.5">
              Active Sync
            </span>
          )}
        </div>
      </div>
      
      <div className="flex items-center">
        {isManaging ? (
          isConnected ? (
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => onConfigure(id)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all active:scale-95"
                title="Configure Settings"
              >
                <SlidersHorizontal size={14} />
              </button>
              <button 
                onClick={handleClick}
                disabled={isProcessing}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all active:scale-95 disabled:opacity-50"
              >
                {isProcessing ? <Loader2 size={12} className="animate-spin" /> : <XCircle size={14} />}
                <span className="text-xs font-bold">Disconnect</span>
              </button>
            </div>
          ) : (
            <div className="text-[11px] text-white/20 font-bold uppercase tracking-wider px-3">
              Available
            </div>
          )
        ) : (
          <button 
            onClick={handleClick}
            disabled={isProcessing}
            className={`text-[13px] font-black tracking-tight px-4 py-1.5 rounded-xl transition-all active:scale-95 disabled:opacity-50 ${
              isConnected 
                ? 'text-white/30 hover:text-white/50 bg-white/5' 
                : 'text-blue-400 hover:text-blue-300 bg-blue-500/10 border border-blue-500/20'
            }`}
          >
            {isProcessing ? (
              <Loader2 size={14} className="animate-spin" />
            ) : isConnected ? (
              'Connected'
            ) : (
              'Connect'
            )}
          </button>
        )}
      </div>
    </div>
  );
};

const ConnectorsModal: React.FC<ConnectorsModalProps> = ({ isOpen, onClose }) => {
  const [connectedIds, setConnectedIds] = useState<Set<string>>(new Set(['chrome']));
  const [isManaging, setIsManaging] = useState(false);
  const [configuringId, setConfiguringId] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleService = (id: string) => {
    setConnectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleConfigure = (id: string) => {
    setConfiguringId(id);
    // In a real app, this would open a specific settings sheet for the connector
    setTimeout(() => {
        alert(`Manus: Initializing reconfiguration for ${id}. You can now update sync intervals, data scopes, and API permissions.`);
        setConfiguringId(null);
    }, 400);
  };

  const connectors = [
    { id: 'chrome', icon: <Chrome size={18} />, name: 'My Browser' },
    { id: 'gmail', icon: <Mail size={18} />, name: 'Gmail' },
    { id: 'gcal', icon: <Calendar size={18} />, name: 'Google Calendar' },
    { id: 'gdrive', icon: <HardDrive size={18} />, name: 'Google Drive' },
    { id: 'outlook_mail', icon: <Mail size={18} />, name: 'Outlook Mail' },
    { id: 'outlook_cal', icon: <Calendar size={18} />, name: 'Outlook Calendar' },
    { id: 'github', icon: <Github size={18} />, name: 'GitHub' },
  ];

  return (
    <div className="fixed inset-0 z-[120] flex flex-col justify-end bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative w-full max-w-md mx-auto bg-[#121212] rounded-t-[40px] border-t border-white/10 flex flex-col shadow-[0_-20px_50px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom duration-500 max-h-[90vh]">
        
        {/* Handle */}
        <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mt-4 mb-6" />
        
        <div className="px-6 flex items-center justify-between mb-6">
          <div className="flex flex-col">
            <h2 className="text-2xl font-black text-white tracking-tight">System Connectors</h2>
            <p className="text-[13px] text-white/30 font-medium">Link Manus to your digital ecosystem.</p>
          </div>
          <div className="flex items-center space-x-2 bg-blue-500/10 px-3 py-1.5 rounded-2xl border border-blue-500/20">
            <CheckCircle2 size={12} className="text-blue-400" />
            <span className="text-[11px] font-black text-blue-400">{connectedIds.size} Active</span>
          </div>
        </div>

        {/* Scrollable List Area */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 no-scrollbar">
          <div className="bg-[#1A1A1A] rounded-[28px] overflow-hidden border border-white/5 shadow-inner">
            {connectors.map((c) => (
              <ConnectorItem 
                key={c.id} 
                id={c.id}
                icon={c.icon} 
                name={c.name}
                isConnected={connectedIds.has(c.id)}
                isManaging={isManaging}
                onToggle={toggleService}
                onConfigure={handleConfigure}
              />
            ))}
          </div>

          {/* Management Controls */}
          <div className="mt-4 space-y-2">
            <button 
              onClick={() => setIsManaging(!isManaging)}
              className={`w-full flex items-center justify-between px-6 py-4 rounded-[24px] border transition-all duration-300 ${
                isManaging 
                  ? 'bg-blue-600 border-blue-500 shadow-xl shadow-blue-600/20 text-white' 
                  : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Settings2 size={18} className={isManaging ? 'animate-spin-slow' : ''} />
                <span className="text-[15px] font-bold tracking-tight">
                  {isManaging ? 'Finish Managing' : 'Manage Connectors'}
                </span>
              </div>
              {!isManaging && <ChevronRight size={18} className="opacity-30" />}
            </button>

            {!isManaging && (
              <button className="w-full flex items-center justify-between px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-[24px] text-white/60 hover:text-white transition-all group">
                <div className="flex items-center space-x-3">
                  <Plus size={18} />
                  <span className="text-[15px] font-bold tracking-tight">Add custom connector</span>
                </div>
                <ChevronRight size={18} className="opacity-30 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="px-8 py-6 bg-black/20 flex items-start space-x-3">
          <AlertCircle size={16} className="text-white/20 shrink-0 mt-0.5" />
          <p className="text-[11px] text-white/20 leading-relaxed font-medium">
            Manus processes data locally within your browser context when using connectors. Credentials are never stored on our servers.
          </p>
        </div>
      </div>

      <style>{`
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ConnectorsModal;