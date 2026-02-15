
import React, { useState, useEffect } from 'react';
import { 
  X, Upload, Share2, Download, ChevronDown, 
  Smartphone, Pencil, Database, Printer, Settings, Code,
  Loader2, CheckCircle2, AlertTriangle, Terminal, Cpu, Box,
  Fingerprint, Layers, Tag, Hash, FileJson
} from 'lucide-react';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  appName?: string;
  appIcon?: string;
  appCode?: string; 
}

type BuildStatus = 'idle' | 'preparing' | 'compiling' | 'signing' | 'completed' | 'failed';
type AndroidFormat = 'APK' | 'AAB';

const PublishModal: React.FC<PublishModalProps> = ({ isOpen, onClose, appName = "ManusApp", appIcon, appCode }) => {
  const [platform, setPlatform] = useState<'Android' | 'iOS'>('Android');
  const [androidFormat, setAndroidFormat] = useState<AndroidFormat>('APK');
  const [versionName, setVersionName] = useState('1.0.0');
  const [versionCode, setVersionCode] = useState('1');
  const [buildStatus, setBuildStatus] = useState<BuildStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const buildSteps = {
    Android: [
      "Initializing Gradle daemon...",
      `Configuring build v${versionName} (${versionCode})...`,
      "Resolving dependencies for :app...",
      "Compiling Java/Kotlin sources...",
      "Generating DEX files...",
      androidFormat === 'AAB' ? "Optimizing resources for App Bundle..." : "Shrinking resources with R8...",
      androidFormat === 'AAB' ? "Generating .aab package..." : "Generating .apk package...",
      "Signing package with production key...",
      "Aligning binary for store submission..."
    ],
    iOS: [
      "Starting xcodebuild...",
      `Configuring build v${versionName} (${versionCode})...`,
      "Resolving Swift packages...",
      "Compiling Swift sources...",
      "Linking object files...",
      "Processing Info.plist...",
      "Signing identity verification...",
      "Packaging .ipa bundle..."
    ]
  };

  const startBuild = () => {
    setBuildStatus('preparing');
    setProgress(0);
    setLogs(["[SYSTEM] Build pipeline initiated..."]);
    
    let stepIndex = 0;
    const currentSteps = buildSteps[platform];
    
    const interval = setInterval(() => {
      if (stepIndex < currentSteps.length) {
        setLogs(prev => [...prev, `[BUILD] ${currentSteps[stepIndex]}`]);
        setProgress(Math.round(((stepIndex + 1) / currentSteps.length) * 100));
        stepIndex++;
      } else {
        setBuildStatus('completed');
        setLogs(prev => [...prev, `[SUCCESS] ${platform} ${platform === 'Android' ? androidFormat : 'IPA'} generated successfully.`]);
        clearInterval(interval);
      }
    }, 1000);
  };

  const handleDownload = () => {
    let extension = 'apk';
    if (platform === 'iOS') extension = 'ipa';
    else if (androidFormat === 'AAB') extension = 'aab';
    
    const fileName = `${appName.toLowerCase().replace(/\s+/g, '-')}-v${versionName}.${extension}`;
    
    // Simulated download URL
    const dummyUrl = `https://github.com/expo/expo/releases/download/sdk-50.0.0/Exponent-2.30.0.${extension}`;
    const link = document.createElement('a');
    link.href = dummyUrl;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-xl bg-[#0F0F0F] rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 animate-in zoom-in duration-300 flex flex-col max-h-[92vh]">
        
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between px-8 py-6 bg-black/40 border-b border-white/5">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
              <Box size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight text-white">Cloud Forge</h2>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500/60">Binary Synthesis Protocol</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 text-white/40 hover:text-white transition-all bg-white/5 rounded-2xl">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-8 space-y-8">
          
          {/* App Info Card */}
          <div className="flex items-center space-x-6 p-6 bg-white/[0.03] border border-white/5 rounded-[2.5rem]">
            <div className="w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center overflow-hidden shadow-2xl ring-4 ring-white/5">
              {appIcon ? (
                <img src={appIcon} alt="App" className="w-full h-full object-cover" />
              ) : (
                <div className="text-3xl font-black text-white/20">{appName.charAt(0)}</div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-black text-white">{appName}</h3>
              <div className="flex items-center space-x-3 mt-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Stable Build</span>
                <div className="w-1 h-1 rounded-full bg-white/10" />
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">v{versionName}</span>
              </div>
            </div>
          </div>

          {buildStatus === 'idle' ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              {/* Platform Selector */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2">Target Architecture</label>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setPlatform('Android')}
                    className={`p-6 rounded-[2.25rem] border-2 transition-all flex flex-col items-center space-y-3 ${platform === 'Android' ? 'bg-blue-600 border-blue-400 text-white shadow-xl shadow-blue-600/20' : 'bg-white/5 border-white/5 text-white/30 hover:border-white/20'}`}
                  >
                    <Smartphone size={32} />
                    <span className="text-[11px] font-black uppercase tracking-widest">Android</span>
                  </button>
                  <button 
                    onClick={() => setPlatform('iOS')}
                    className={`p-6 rounded-[2.25rem] border-2 transition-all flex flex-col items-center space-y-3 ${platform === 'iOS' ? 'bg-blue-600 border-blue-400 text-white shadow-xl shadow-blue-600/20' : 'bg-white/5 border-white/5 text-white/30 hover:border-white/20'}`}
                  >
                    <Box size={32} />
                    <span className="text-[11px] font-black uppercase tracking-widest">iOS (IPA)</span>
                  </button>
                </div>
              </div>

              {/* Android Specific Options */}
              {platform === 'Android' && (
                <div className="space-y-4 animate-in slide-in-from-top-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2">Distribution Format</label>
                  <div className="flex bg-white/5 p-1.5 rounded-[1.5rem] border border-white/5">
                    <button 
                      onClick={() => setAndroidFormat('APK')}
                      className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${androidFormat === 'APK' ? 'bg-white text-black shadow-lg' : 'text-white/40'}`}
                    >
                      Universal APK
                    </button>
                    <button 
                      onClick={() => setAndroidFormat('AAB')}
                      className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${androidFormat === 'AAB' ? 'bg-white text-black shadow-lg' : 'text-white/40'}`}
                    >
                      App Bundle (AAB)
                    </button>
                  </div>
                </div>
              )}

              {/* Versioning Config */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2">Release Configuration</label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-blue-500 transition-colors">
                      <Tag size={16} />
                    </div>
                    <input 
                      type="text" 
                      placeholder="Version Name"
                      value={versionName}
                      onChange={(e) => setVersionName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] py-4 pl-12 pr-4 text-[13px] font-bold text-white outline-none focus:border-blue-500/40 transition-all"
                    />
                  </div>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-blue-500 transition-colors">
                      <Hash size={16} />
                    </div>
                    <input 
                      type="number" 
                      placeholder="Version Code"
                      value={versionCode}
                      onChange={(e) => setVersionCode(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] py-4 pl-12 pr-4 text-[13px] font-bold text-white outline-none focus:border-blue-500/40 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Build Terminal */
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center space-x-3">
                  <Terminal size={14} className="text-blue-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Remote Build Cluster</span>
                </div>
                <div className="flex items-center space-x-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                   <span className="text-[10px] font-mono text-blue-500 font-bold">{progress}%</span>
                </div>
              </div>
              
              <div className="bg-black/60 rounded-[2.5rem] border border-white/10 p-8 h-64 font-mono text-[11px] overflow-y-auto no-scrollbar space-y-3 shadow-inner">
                {logs.map((log, i) => (
                  <div key={i} className="flex space-x-4">
                    <span className="text-white/5 tabular-nums w-4">{i + 1}</span>
                    <span className={`
                      ${log.startsWith('[SUCCESS]') ? 'text-green-500 font-bold' : ''}
                      ${log.startsWith('[SYSTEM]') ? 'text-purple-400 font-black italic' : ''}
                      ${!log.startsWith('[SUCCESS]') && !log.startsWith('[SYSTEM]') ? 'text-blue-300/40' : ''}
                    `}>
                      {log}
                    </span>
                  </div>
                ))}
                {buildStatus !== 'completed' && (
                  <div className="flex items-center space-x-2 pt-2 text-blue-500/80">
                    <Loader2 size={12} className="animate-spin" />
                    <span className="animate-pulse font-black uppercase tracking-widest text-[9px]">Analyzing Bytecode...</span>
                  </div>
                )}
              </div>

              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-500 shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4">
            {buildStatus === 'idle' ? (
              <button 
                onClick={startBuild}
                className="w-full h-20 bg-white text-black rounded-[2.25rem] font-black uppercase tracking-[0.2em] text-[13px] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-4"
              >
                <Cpu size={22} />
                <span>Synchronize Build Pipeline</span>
              </button>
            ) : buildStatus === 'completed' ? (
              <div className="space-y-4">
                <button 
                  onClick={handleDownload}
                  className="w-full h-20 bg-green-500 text-white rounded-[2.25rem] font-black uppercase tracking-[0.2em] text-[13px] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-4 shadow-green-500/20"
                >
                  <Download size={22} />
                  <span>Download .{platform === 'iOS' ? 'ipa' : androidFormat.toLowerCase()}</span>
                </button>
                <button 
                  onClick={() => setBuildStatus('idle')}
                  className="w-full h-14 bg-white/5 text-white/30 rounded-[1.75rem] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white/10 transition-all"
                >
                  Regenerate Pipeline
                </button>
              </div>
            ) : (
              <div className="w-full h-20 bg-white/5 rounded-[2.25rem] flex items-center justify-center space-x-4 opacity-50 cursor-not-allowed border border-white/5">
                <Loader2 size={22} className="animate-spin text-blue-500" />
                <span className="text-[13px] font-black uppercase tracking-[0.2em] text-white/20">Synthesizing Binary Assets...</span>
              </div>
            )}
          </div>
        </div>

        <div className="px-10 py-6 bg-black/40 border-t border-white/[0.04] text-center">
          <div className="flex items-center justify-center space-x-3">
            <Fingerprint size={12} className="text-white/20" />
            <p className="text-[9px] text-white/10 font-black uppercase tracking-[0.4em]">
              Manus Engine v4.8.2 • Secure Sandbox Active
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublishModal;
