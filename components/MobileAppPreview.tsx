
import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Smartphone, Play, Copy, Check, Terminal, 
  Wifi, Battery, Signal, Zap, ShieldCheck, Search,
  Menu, Bell, User, LayoutGrid, Heart, MessageCircle,
  Share2, Camera, MoreHorizontal, Plus, Loader2, Cpu, FileCode
} from 'lucide-react';

interface MobileAppPreviewProps {
  platform: 'React Native' | 'Flutter';
  code: string;
  isOpen: boolean;
  onClose: () => void;
}

const MobileAppPreview: React.FC<MobileAppPreviewProps> = ({ platform, code, isOpen, onClose }) => {
  const [tab, setTab] = useState<'preview' | 'code' | 'logs'>('preview');
  const [copied, setCopied] = useState(false);
  const [logs, setLogs] = useState<{msg: string, type: 'system' | 'info' | 'warn' | 'success'}[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [batteryLevel] = useState(Math.floor(Math.random() * 20) + 80);
  const terminalRef = useRef<HTMLDivElement>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setIsReady(false);
      setLogs([]);
      setRefreshKey(prev => prev + 1);
      
      const initialSteps: {msg: string, type: 'system' | 'info' | 'warn' | 'success'}[] = [
        { msg: "Mounting virtualized hardware Layer 1...", type: 'system' },
        { msg: "System: Mobile Hybrid Simulation initialized", type: 'info' },
        { msg: `Fetching ${platform} entry point from Manus Core...`, type: 'info' },
        { msg: "Resolving native dependencies (62/62)...", type: 'info' },
        { msg: "Optimization: AOT Bytecode synthesis active", type: 'success' },
        { msg: "JIT Runtime bridge established", type: 'info' },
        { msg: "Frame Buffer linked at 60fps", type: 'success' },
        { msg: "Application Ready.", type: 'success' },
      ];

      let currentStep = 0;
      const interval = setInterval(() => {
        if (currentStep < initialSteps.length) {
          const step = initialSteps[currentStep];
          if (step) {
            setLogs(prev => [...prev, step]);
          }
          currentStep++;
        } else {
          setIsReady(true);
          clearInterval(interval);
        }
      }, 350);

      return () => clearInterval(interval);
    }
  }, [isOpen, platform, code]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[150] bg-[#0A0A0B] flex flex-col animate-in fade-in zoom-in duration-500 overflow-hidden">
      <div className="h-16 bg-[#121214] border-b border-white/5 flex items-center justify-between px-6 shrink-0 z-50">
        <div className="flex items-center space-x-4">
          <div className={`p-2.5 rounded-2xl ${platform === 'Flutter' ? 'bg-blue-500/10 text-blue-400' : 'bg-cyan-500/10 text-cyan-400'} border border-white/5 shadow-inner`}>
            <Cpu className="w-5 h-5" />
          </div>
          <div className="hidden sm:block">
            <h3 className="text-[12px] font-black text-white uppercase tracking-widest">{platform} Runtime</h3>
            <div className="flex items-center space-x-1.5 mt-0.5">
               <div className={`w-1.5 h-1.5 rounded-full ${isReady ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`} />
               <span className="text-[9px] text-white/30 uppercase font-black tracking-widest">{isReady ? 'Operational' : 'Synchronizing'}</span>
            </div>
          </div>
        </div>

        <div className="flex bg-black/50 p-1 rounded-2xl border border-white/10">
          <button onClick={() => setTab('preview')} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tab === 'preview' ? 'bg-white text-black shadow-lg' : 'text-white/30 hover:text-white'}`}>Simulator</button>
          <button onClick={() => setTab('code')} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tab === 'code' ? 'bg-white text-black shadow-lg' : 'text-white/30 hover:text-white'}`}>Source</button>
          <button onClick={() => setTab('logs')} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tab === 'logs' ? 'bg-white text-black shadow-lg' : 'text-white/30 hover:text-white'}`}>Terminal</button>
        </div>

        <button onClick={onClose} className="p-2.5 bg-white/5 hover:bg-red-500/20 hover:text-red-400 rounded-full transition-all active:scale-90">
          <X className="w-6 h-6 text-white/40" />
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden bg-[#0A0A0B] relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_100%)] from-blue-600/[0.04] to-transparent pointer-events-none" />
        <div className="flex-1 relative flex items-center justify-center p-6 sm:p-12 overflow-y-auto no-scrollbar">
          
          {tab === 'preview' && (
            <div className="relative animate-in zoom-in slide-in-from-bottom duration-700">
              <div className="relative mx-auto border-[10px] border-[#1C1C1E] rounded-[3.5rem] w-[320px] h-[640px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] bg-black overflow-hidden ring-1 ring-white/10">
                <div className={`absolute top-2 left-1/2 -translate-x-1/2 rounded-full bg-black z-[100] transition-all duration-500 ease-out flex items-center justify-center overflow-hidden ${!isReady ? 'w-36 h-8' : 'w-24 h-6'}`}>
                   {!isReady && (
                     <div className="flex items-center space-x-2 px-3 animate-in fade-in duration-700">
                        <Loader2 size={12} className="text-blue-500 animate-spin" />
                        <span className="text-[9px] font-black text-white/60 uppercase tracking-widest">Booting...</span>
                     </div>
                   )}
                </div>
                <div className="absolute top-0 left-0 right-0 h-10 flex items-center justify-between px-10 text-[11px] font-black text-white z-[90] bg-gradient-to-b from-black/20 to-transparent">
                  <span>9:41</span>
                  <div className="flex items-center space-x-2 opacity-80">
                    <Signal size={14} />
                    <Wifi size={14} />
                    <div className="flex items-center space-x-1">
                       <span className="text-[9px]">{batteryLevel}%</span>
                       <Battery size={16} strokeWidth={2.5} />
                    </div>
                  </div>
                </div>
                <div className="w-full h-full pt-10 bg-[#080808] relative">
                  {!isReady ? (
                    <div className="flex flex-col items-center justify-center h-full space-y-8 px-10 text-center">
                       <div className="relative"><Zap size={48} className="text-blue-500 animate-pulse" /><div className="absolute inset-0 bg-blue-500/30 blur-2xl animate-pulse" /></div>
                       <div className="w-full space-y-4">
                          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 animate-[loading_1.2s_infinite]" />
                          </div>
                          <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.3em]">Loading dynamic assets...</p>
                       </div>
                    </div>
                  ) : (
                    <div className="h-full w-full animate-in fade-in duration-1000">
                       <iframe 
                         key={refreshKey}
                         srcDoc={code} 
                         className="w-full h-full border-none bg-white" 
                         title="App Simulation"
                         sandbox="allow-scripts allow-modals"
                       />
                    </div>
                  )}
                </div>
                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full z-[100]" />
              </div>
            </div>
          )}

          {tab === 'code' && (
            <div className="w-full h-full max-w-4xl bg-[#121214] rounded-[2rem] border border-white/5 overflow-hidden flex flex-col shadow-2xl animate-in zoom-in duration-300">
               <div className="h-14 px-6 border-b border-white/5 flex items-center justify-between bg-black/20">
                  <div className="flex items-center space-x-3"><FileCode className="w-4 h-4 text-blue-400" /><span className="text-[11px] font-mono font-black text-white/40 tracking-widest uppercase">main_bundle.{platform === 'Flutter' ? 'dart' : 'tsx'}</span></div>
                  <button onClick={handleCopy} className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl border border-white/10">{copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}<span>{copied ? 'Copied' : 'Copy'}</span></button>
               </div>
               <div className="flex-1 overflow-auto bg-black p-8 font-mono text-[13px] leading-relaxed text-blue-200/80 whitespace-pre no-scrollbar">{code || "// No code available"}</div>
            </div>
          )}

          {tab === 'logs' && (
            <div className="w-full h-full max-w-4xl bg-black rounded-[2rem] border border-white/10 overflow-hidden flex flex-col shadow-2xl font-mono animate-in slide-in-from-right duration-300">
               <div className="h-14 px-6 border-b border-white/10 flex items-center justify-between bg-[#080808]">
                  <div className="flex items-center space-x-3"><Terminal className="w-4 h-4 text-green-500" /><span className="text-[10px] font-black uppercase tracking-widest text-green-500/80">Kernel_Debugger</span></div>
                  <div className="flex items-center space-x-4"><div className="text-[9px] text-white/10 font-black">PROC: {Math.floor(Math.random()*9000)+1000}</div></div>
               </div>
               <div ref={terminalRef} className="flex-1 p-8 overflow-auto text-[11px] space-y-3 no-scrollbar">
                  {logs.map((log, i) => (
                    log && (
                      <div key={i} className="flex space-x-4 animate-in fade-in slide-in-from-left-2 duration-300">
                        <span className="text-white/10 font-black">{i + 1}</span>
                        <span className={`
                          ${log.type === 'system' ? 'text-purple-400 font-black' : ''}
                          ${log.type === 'info' ? 'text-white/50' : ''}
                          ${log.type === 'warn' ? 'text-yellow-500' : ''}
                          ${log.type === 'success' ? 'text-green-500 font-bold' : ''}
                        `}>
                          {log.msg}
                        </span>
                      </div>
                    )
                  ))}
                  {isReady && (
                    <div className="flex items-center space-x-2 pt-2">
                      <span className="text-green-500 font-black">$</span>
                      <div className="w-2 h-4 bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                    </div>
                  )}
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
      `}</style>
    </div>
  );
};

export default MobileAppPreview;
