
import React, { useState, useEffect } from 'react';
import { 
  X, Smartphone, Code2, Play, Copy, Check, Terminal, 
  Wifi, Battery, Signal, Zap, ShieldCheck, Search,
  Menu, Bell, User, LayoutGrid, Heart, MessageCircle,
  Share2, Camera, MoreHorizontal, Plus
} from 'lucide-react';

interface MobileAppPreviewProps {
  platform: 'React Native' | 'Flutter';
  code: string;
  isOpen: boolean;
  onClose: void;
}

const MobileAppPreview: React.FC<MobileAppPreviewProps> = ({ platform, code, isOpen, onClose }) => {
  const [tab, setTab] = useState<'preview' | 'code' | 'logs'>('preview');
  const [copied, setCopied] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [batteryLevel] = useState(Math.floor(Math.random() * 20) + 80);

  useEffect(() => {
    if (isOpen) {
      setIsReady(false);
      const initialLogs = [
        `[${new Date().toLocaleTimeString()}] Mounting virtualized hardware...`,
        `[${new Date().toLocaleTimeString()}] System: iOS 17.2 Simulation active`,
        `[${new Date().toLocaleTimeString()}] Fetching source from Manus Neural API...`,
        `[${new Date().toLocaleTimeString()}] Resolving dependencies...`,
        `[${new Date().toLocaleTimeString()}] Build: Optimizing bytecode for ARM64`,
      ];
      setLogs(initialLogs);

      const timer = setInterval(() => {
        const nextLogs = [
          `[${new Date().toLocaleTimeString()}] JIT Runtime connected`,
          `[${new Date().toLocaleTimeString()}] Hot Restarting UI thread`,
          `[${new Date().toLocaleTimeString()}] Bridge initialized`,
          `[${new Date().toLocaleTimeString()}] Rendering Frame...`,
        ];
        
        setLogs(prev => {
          if (prev.length < 14) {
            return [...prev, nextLogs[Math.floor(Math.random() * nextLogs.length)]];
          } else {
            setIsReady(true);
            return prev;
          }
        });
      }, 800);

      return () => clearInterval(timer);
    }
  }, [isOpen, platform]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[150] bg-[#0A0A0A] flex flex-col animate-in fade-in zoom-in duration-500">
      {/* Universal Control Center */}
      <div className="h-16 bg-[#161616] border-b border-white/5 flex items-center justify-between px-6 shrink-0 z-50">
        <div className="flex items-center space-x-4">
          <div className={`p-2 rounded-xl ${platform === 'Flutter' ? 'bg-blue-500/10 text-blue-400' : 'bg-cyan-500/10 text-cyan-400'} border border-white/5 shadow-inner`}>
            <Smartphone className="w-5 h-5" />
          </div>
          <div className="hidden sm:block">
            <h3 className="text-[13px] font-black text-white uppercase tracking-wider">{platform} Runtime</h3>
            <div className="flex items-center space-x-1.5 mt-0.5">
               <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
               <span className="text-[9px] text-white/30 uppercase font-black tracking-widest">Live Engine</span>
            </div>
          </div>
        </div>

        <div className="flex bg-black p-1 rounded-2xl border border-white/10 shadow-2xl">
          <button 
            onClick={() => setTab('preview')}
            className={`px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${tab === 'preview' ? 'bg-white text-black shadow-lg' : 'text-white/30 hover:text-white'}`}
          >
            Simulator
          </button>
          <button 
            onClick={() => setTab('code')}
            className={`px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${tab === 'code' ? 'bg-white text-black shadow-lg' : 'text-white/30 hover:text-white'}`}
          >
            Source
          </button>
          <button 
            onClick={() => setTab('logs')}
            className={`px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${tab === 'logs' ? 'bg-white text-black shadow-lg' : 'text-white/30 hover:text-white'}`}
          >
            Terminal
          </button>
        </div>

        <button 
          onClick={onClose}
          className="p-2.5 bg-white/5 hover:bg-red-500/20 hover:text-red-400 rounded-full transition-all active:scale-90"
        >
          <X className="w-6 h-6 text-white/40" />
        </button>
      </div>

      {/* Viewport Area */}
      <div className="flex-1 flex overflow-hidden bg-[#0F0F0F] relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_100%)] from-blue-500/[0.03] to-transparent pointer-events-none" />

        <div className="flex-1 relative flex items-center justify-center p-6 sm:p-12 overflow-y-auto no-scrollbar">
          
          {tab === 'preview' && (
            <div className="relative animate-in zoom-in slide-in-from-bottom duration-700">
              {/* High Fidelity iPhone Frame */}
              <div className="relative mx-auto border-[12px] border-[#1C1C1E] rounded-[3.5rem] w-[310px] h-[620px] sm:w-[340px] sm:h-[680px] shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] bg-black overflow-hidden ring-1 ring-white/10">
                
                {/* Dynamic Island Interaction Area */}
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-8 bg-black rounded-full z-[100] flex items-center justify-center group cursor-pointer hover:w-36 transition-all duration-300">
                   <div className="w-2 h-2 rounded-full bg-blue-500/60 animate-pulse ml-auto mr-4 shadow-2xl shadow-blue-500" />
                </div>
                
                {/* iOS Status Bar */}
                <div className="absolute top-0 left-0 right-0 h-12 flex items-center justify-between px-10 text-[12px] font-black text-white z-[90]">
                  <span>9:41</span>
                  <div className="flex items-center space-x-2 opacity-80">
                    <Signal size={14} />
                    <Wifi size={14} />
                    <div className="flex items-center space-x-1 border border-white/20 rounded-md px-1 py-0.5">
                       <span className="text-[8px]">{batteryLevel}%</span>
                       <Battery size={14} />
                    </div>
                  </div>
                </div>

                {/* Simulated Content */}
                <div className="w-full h-full pt-12 bg-black relative">
                  {!isReady ? (
                    <div className="flex flex-col items-center justify-center h-full space-y-6 px-10 text-center animate-in fade-in duration-500">
                       <div className="relative">
                          <Zap size={40} className="text-blue-500 animate-bounce" />
                          <div className="absolute inset-0 bg-blue-500/20 blur-2xl animate-pulse" />
                       </div>
                       <div className="w-full space-y-3">
                          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                             <div className="h-full bg-blue-500 animate-[loading_1.5s_infinite]" />
                          </div>
                          <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.3em]">Attaching {platform} Hook...</p>
                       </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col bg-[#080808] animate-in fade-in duration-1000">
                       {/* Mock App Header */}
                       <div className="px-6 py-6 flex items-center justify-between">
                          <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 text-white/40">
                             <Menu size={20} />
                          </div>
                          <div className="flex items-center space-x-3">
                             <Bell size={18} className="text-white/20" />
                             <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 border border-white/10 shadow-lg" />
                          </div>
                       </div>

                       {/* Mock App Hero */}
                       <div className="px-6 py-4 space-y-6">
                          <div className="space-y-2">
                             <h4 className="text-2xl font-bold tracking-tight text-white/90">Welcome Home</h4>
                             <p className="text-xs text-white/30">Your neural artifacts are synced.</p>
                          </div>

                          <div className="relative bg-gradient-to-br from-[#1A1A1A] to-[#121212] border border-white/5 rounded-[2rem] p-6 shadow-2xl overflow-hidden group">
                             <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-600/10 blur-[50px] rounded-full group-hover:bg-blue-600/20 transition-all" />
                             <div className="relative z-10 flex flex-col space-y-4">
                                <ShieldCheck className="text-blue-500" size={24} />
                                <div className="space-y-1">
                                   <div className="h-4 w-2/3 bg-white/20 rounded-md" />
                                   <div className="h-3 w-full bg-white/5 rounded-md" />
                                </div>
                                <div className="h-10 bg-white text-black rounded-xl flex items-center justify-center text-xs font-black uppercase tracking-widest">
                                   Authorize Build
                                </div>
                             </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                             {[1, 2, 3, 4].map(i => (
                               <div key={i} className="bg-white/[0.03] border border-white/5 rounded-[1.5rem] p-4 flex flex-col space-y-3">
                                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                     {i === 1 ? <LayoutGrid size={16} /> : i === 2 ? <Heart size={16} /> : i === 3 ? <MessageCircle size={16} /> : <Share2 size={16} />}
                                  </div>
                                  <div className="h-2 w-12 bg-white/10 rounded-full" />
                               </div>
                             ))}
                          </div>
                       </div>
                       
                       {/* Mock Navigation Bar */}
                       <div className="mt-auto h-20 bg-black/50 backdrop-blur-xl border-t border-white/5 flex items-center justify-around px-4 pb-6">
                          <div className="p-3 text-blue-500"><LayoutGrid size={22} /></div>
                          <div className="p-3 text-white/20"><Search size={22} /></div>
                          {/* Fixed: Plus icon used here is now imported */}
                          <div className="p-3 text-white/20"><Plus size={22} /></div>
                          <div className="p-3 text-white/20"><MessageCircle size={22} /></div>
                          <div className="p-3 text-white/20"><User size={22} /></div>
                       </div>
                    </div>
                  )}
                </div>
                
                {/* iOS Home Indicator */}
                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-36 h-1.5 bg-white/30 rounded-full z-[100]" />
              </div>
            </div>
          )}

          {tab === 'code' && (
            <div className="w-full h-full max-w-5xl bg-[#161616] rounded-3xl border border-white/5 overflow-hidden flex flex-col shadow-2xl animate-in zoom-in duration-300">
               <div className="h-14 px-6 border-b border-white/5 flex items-center justify-between bg-black/40">
                  <div className="flex items-center space-x-3">
                    <Code2 className="w-4 h-4 text-blue-400" />
                    <span className="text-[12px] font-mono font-bold text-white/60 tracking-tight">source_main.{platform === 'Flutter' ? 'dart' : 'tsx'}</span>
                  </div>
                  <button 
                    onClick={handleCopy}
                    className="flex items-center space-x-2 text-[11px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-all bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl border border-white/10 active:scale-95 shadow-inner"
                  >
                    {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied' : 'Copy Source'}</span>
                  </button>
               </div>
               <div className="flex-1 overflow-auto bg-[#0A0A0A] p-6 sm:p-10 font-mono text-[13px] leading-relaxed text-blue-200/80 whitespace-pre scrollbar-thin selection:bg-blue-500/30">
                  {code}
               </div>
            </div>
          )}

          {tab === 'logs' && (
            <div className="w-full h-full max-w-5xl bg-black rounded-3xl border border-white/10 overflow-hidden flex flex-col shadow-2xl font-mono animate-in slide-in-from-right duration-300">
               <div className="h-14 px-6 border-b border-white/10 flex items-center justify-between bg-[#080808]">
                  <div className="flex items-center space-x-3">
                    <Terminal className="w-4 h-4 text-green-500" />
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-green-500/80">Kernel_Debugger</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-[10px] text-white/10 font-black">PROCESS_ID: {Math.floor(Math.random()*9000)+1000}</div>
                    <button onClick={() => setLogs([])} className="text-[10px] text-white/20 hover:text-white transition-colors">CLEAR</button>
                  </div>
               </div>
               <div className="flex-1 p-8 overflow-auto text-[12px] space-y-2.5 no-scrollbar bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]">
                  {logs.map((log, i) => (
                    <div key={i} className="text-white/50 border-l-2 border-green-500/20 pl-4 hover:border-green-500 transition-colors">
                      <span className="text-green-500/60 font-black mr-3">#</span>
                      {log}
                    </div>
                  ))}
                  <div className="flex items-center space-x-2 pt-2">
                    <span className="text-green-500 font-black">$</span>
                    <div className="w-2.5 h-4 bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>
      
      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(350%); }
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #0A0A0A;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #1C1C1E;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default MobileAppPreview;
