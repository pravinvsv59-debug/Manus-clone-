
import React, { useState, useRef } from 'react';
import { 
  X, Plus, Trash2, Shield, BrainCircuit, Palette, Zap, Bot, Sparkles, 
  ChevronRight, Save, Key, Info, Check, ArrowLeft, Download, Upload,
  AlertTriangle, FileJson, Lock, Eye, EyeOff
} from 'lucide-react';
import { CustomAgent, AIProvider } from '../types.ts';

interface AgentManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  agents: CustomAgent[];
  onUpdateAgents: (agents: CustomAgent[]) => void;
}

const PROVIDERS: {id: AIProvider, name: string, icon: string}[] = [
  { id: 'gemini', name: 'Google Gemini', icon: 'https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d47353046b5d9207ad271.svg' },
  { id: 'openai', name: 'OpenAI GPT', icon: 'https://openai.com/favicon.ico' },
  { id: 'anthropic', name: 'Anthropic Claude', icon: 'https://anthropic.com/favicon.ico' },
  { id: 'deepseek', name: 'DeepSeek', icon: 'https://deepseek.com/favicon.ico' },
  { id: 'other', name: 'Other Llama/Custom', icon: 'https://meta.com/favicon.ico' }
];

const ICONS = ['brain', 'shield', 'palette', 'zap', 'bot', 'sparkles'];
const COLORS = ['#2563EB', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#6366F1'];

const AgentManagerModal: React.FC<AgentManagerModalProps> = ({ isOpen, onClose, agents, onUpdateAgents }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newAgent, setNewAgent] = useState<Partial<CustomAgent>>({
    name: '',
    provider: 'gemini',
    systemInstruction: '',
    iconType: 'bot',
    color: '#2563EB',
    apiKey: ''
  });

  if (!isOpen) return null;

  const handleExportFleet = () => {
    if (agents.length === 0) return;
    const data = JSON.stringify(agents, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `manus-agent-fleet-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const importedData = JSON.parse(content);
        
        // Simple validation
        const validAgents = (Array.isArray(importedData) ? importedData : [importedData]).filter(a => 
          a.name && a.systemInstruction && a.provider
        );

        if (validAgents.length === 0) {
          setImportError("Invalid agent configuration format.");
          return;
        }

        // Assign new IDs to prevent collisions
        const processedAgents: CustomAgent[] = validAgents.map(a => ({
          ...a,
          id: `imported-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
        }));

        onUpdateAgents([...agents, ...processedAgents]);
        setImportError(null);
        // Reset input
        e.target.value = '';
      } catch (err) {
        setImportError("Failed to parse JSON file.");
      }
    };
    reader.readAsText(file);
  };

  const handleCreate = () => {
    if (!newAgent.name || !newAgent.systemInstruction) return;
    const agent: CustomAgent = {
      ...newAgent as CustomAgent,
      id: Date.now().toString(),
    };
    onUpdateAgents([...agents, agent]);
    setIsCreating(false);
    setNewAgent({
      name: '',
      provider: 'gemini',
      systemInstruction: '',
      iconType: 'bot',
      color: '#2563EB',
      apiKey: ''
    });
  };

  const handleDelete = (id: string) => {
    onUpdateAgents(agents.filter(a => a.id !== id));
  };

  const getIcon = (type: string, color: string, size = 20) => {
    const props = { size, style: { color } };
    switch (type) {
      case 'brain': return <BrainCircuit {...props} />;
      case 'shield': return <Shield {...props} />;
      case 'palette': return <Palette {...props} />;
      case 'zap': return <Zap {...props} />;
      case 'bot': return <Bot {...props} />;
      default: return <Sparkles {...props} />;
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-xl flex items-end justify-center animate-in fade-in duration-300">
      <div className="absolute inset-0" onClick={onClose} />
      
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept=".json" 
        onChange={handleFileImport} 
      />

      <div className="relative w-full max-w-lg bg-[#0F0F0F] rounded-t-[3rem] border-t border-white/10 flex flex-col max-h-[92vh] animate-in slide-in-from-bottom duration-500 overflow-hidden">
        
        <div className="px-8 pt-8 pb-4 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center space-x-3">
            {isCreating && (
              <button onClick={() => setIsCreating(false)} className="p-2 -ml-2 text-white/40 hover:text-white">
                <ArrowLeft size={20} />
              </button>
            )}
            <div>
              <h2 className="text-2xl font-black tracking-tight">{isCreating ? 'Create Agent' : 'Agent Fleet'}</h2>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/20">System Governance</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {!isCreating && (
              <>
                <button 
                  onClick={handleExportFleet}
                  disabled={agents.length === 0}
                  className="p-2.5 bg-white/5 rounded-2xl hover:bg-white/10 text-white/40 hover:text-white transition-all disabled:opacity-20"
                  title="Export Fleet"
                >
                  <Download size={20} />
                </button>
                <button 
                  onClick={handleImportClick}
                  className="p-2.5 bg-white/5 rounded-2xl hover:bg-white/10 text-white/40 hover:text-white transition-all"
                  title="Import Agents"
                >
                  <Upload size={20} />
                </button>
              </>
            )}
            <button onClick={onClose} className="p-2.5 bg-white/5 rounded-2xl hover:bg-white/10 transition-all">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 no-scrollbar">
          {importError && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center space-x-3 animate-in slide-in-from-top-2">
              <AlertTriangle className="text-red-500" size={18} />
              <span className="text-xs font-bold text-red-200">{importError}</span>
              <button onClick={() => setImportError(null)} className="ml-auto text-white/20 hover:text-white"><X size={14} /></button>
            </div>
          )}

          {!isCreating ? (
            <div className="space-y-4">
              {agents.length === 0 && !importError && (
                <div className="py-12 flex flex-col items-center justify-center text-center opacity-20">
                  <Bot size={48} strokeWidth={1} />
                  <p className="mt-4 text-[12px] font-black uppercase tracking-widest">No Custom Agents Active</p>
                  <button onClick={handleImportClick} className="mt-4 text-[10px] text-blue-500 font-bold flex items-center space-x-1.5 uppercase tracking-widest hover:underline">
                    <FileJson size={12} />
                    <span>Import from local file</span>
                  </button>
                </div>
              )}
              {agents.map(agent => (
                <div key={agent.id} className="group p-5 bg-white/[0.03] border border-white/5 rounded-[2.5rem] flex items-center justify-between hover:bg-white/[0.05] transition-all">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-center shadow-lg">
                      {getIcon(agent.iconType, agent.color, 24)}
                    </div>
                    <div>
                      <h3 className="text-[16px] font-black">{agent.name}</h3>
                      <div className="flex items-center space-x-2 mt-0.5">
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">{agent.provider}</span>
                        <div className="w-1 h-1 rounded-full bg-white/10" />
                        <span className="text-[10px] opacity-40 truncate max-w-[120px]">{agent.systemInstruction.slice(0, 40)}...</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(agent.id)} className="p-3 text-red-500/20 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}

              <button 
                onClick={() => setIsCreating(true)}
                className="w-full mt-4 p-6 border-2 border-dashed border-white/5 hover:border-blue-500/30 rounded-[2.5rem] flex items-center justify-center space-x-3 text-white/20 hover:text-blue-500 transition-all group"
              >
                <Plus className="group-hover:scale-110 transition-transform" />
                <span className="text-[12px] font-black uppercase tracking-widest">Deploy New Agent</span>
              </button>
            </div>
          ) : (
            <div className="space-y-8 pb-10">
              {/* Profile Config */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-2">Agent Identity</label>
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 rounded-[2rem] bg-black/40 border border-white/10 flex items-center justify-center shadow-2xl overflow-hidden relative group">
                    {getIcon(newAgent.iconType!, newAgent.color!, 32)}
                  </div>
                  <div className="flex-1">
                    <input 
                      type="text" 
                      placeholder="Agent Name" 
                      value={newAgent.name}
                      onChange={e => setNewAgent({...newAgent, name: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-[15px] font-bold outline-none focus:border-blue-500/30 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-6 gap-2">
                  {ICONS.map(i => (
                    <button 
                      key={i} 
                      onClick={() => setNewAgent({...newAgent, iconType: i as any})}
                      className={`p-3 rounded-xl border transition-all ${newAgent.iconType === i ? 'bg-blue-600/20 border-blue-500/50' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                    >
                      {getIcon(i, newAgent.color!, 20)}
                    </button>
                  ))}
                </div>
                
                <div className="flex space-x-2">
                  {COLORS.map(c => (
                    <button 
                      key={c} 
                      onClick={() => setNewAgent({...newAgent, color: c})}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${newAgent.color === c ? 'border-white scale-110' : 'border-transparent'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              {/* Provider Config */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-2">Provider Link</label>
                <div className="space-y-2">
                  {PROVIDERS.map(p => (
                    <button 
                      key={p.id}
                      onClick={() => setNewAgent({...newAgent, provider: p.id})}
                      className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all ${newAgent.provider === p.id ? 'bg-blue-600/10 border-blue-500/30' : 'bg-white/5 border-white/5'}`}
                    >
                      <div className="flex items-center space-x-3">
                        <img src={p.icon} alt="" className="w-5 h-5 rounded" />
                        <span className="text-[14px] font-bold">{p.name}</span>
                      </div>
                      {newAgent.provider === p.id && <Check size={16} className="text-blue-500" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* API Credentials Section */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-2">Neural Credentials</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-blue-500 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input 
                    type={showApiKey ? "text" : "password"} 
                    placeholder={`${newAgent.provider?.toUpperCase()} API Key`}
                    value={newAgent.apiKey}
                    onChange={e => setNewAgent({...newAgent, apiKey: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-[14px] font-mono outline-none focus:border-blue-500/30 transition-all"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                  >
                    {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div className="px-2 flex items-start space-x-2">
                  <Info size={12} className="text-white/20 mt-0.5" />
                  <p className="text-[10px] text-white/20 leading-relaxed italic">
                    Keys are stored locally in your vault and never transmitted to our servers.
                  </p>
                </div>
              </div>

              {/* System Instructions */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-2">Neural Directives</label>
                <textarea 
                  placeholder="E.g., You are a specialized security agent focusing on high-level architecture..."
                  value={newAgent.systemInstruction}
                  onChange={e => setNewAgent({...newAgent, systemInstruction: e.target.value})}
                  className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-[14px] outline-none focus:border-blue-500/30 transition-all resize-none"
                />
              </div>

              <button 
                onClick={handleCreate}
                disabled={!newAgent.name || !newAgent.systemInstruction}
                className={`w-full h-16 rounded-[2rem] font-black uppercase tracking-widest text-[13px] flex items-center justify-center space-x-3 transition-all ${
                  (!newAgent.name || !newAgent.systemInstruction) 
                    ? 'bg-white/5 text-white/10' 
                    : 'bg-white text-black shadow-2xl active:scale-95'
                }`}
              >
                <Save size={18} />
                <span>Synchronize Agent</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentManagerModal;
