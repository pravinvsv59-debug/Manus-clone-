
import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, ArrowUp, Plus, Loader2, X, 
  Globe, Smartphone, AlertCircle, ArrowLeft, 
  FileText, Share, Download, Play, CheckCircle2,
  Terminal, BrainCircuit, User, ChevronDown, 
  Shield, Zap, Palette, Bot, Settings2, Save, BookmarkCheck,
  ListTodo, Search, Code, Construction, Activity,
  Layout, Kanban, ShoppingCart, LineChart, HeartPulse,
  FileUp, FileCheck, Layers, Gamepad2, Box, Cpu, Upload, ExternalLink,
  AlertTriangle
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { ChatMessage, Project, CustomAgent, AIProvider, AgentStep } from '../types.ts';
import MobileAppPreview from './MobileAppPreview.tsx';
import WebsitePreview from './WebsitePreview.tsx';
import PublishModal from './PublishModal.tsx';

interface ChatPageProps {
  onBack: () => void;
  project: Project | null;
  onCreateProject: (p: Project) => void;
  onUpdateProject: (id: string, updates: Partial<Project>) => void;
  credits: number;
  onDeductCredits: (amount: number) => boolean;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onExportProject?: (project: Project) => void;
  customAgents?: CustomAgent[];
  onOpenAgentManager?: () => void;
}

interface Attachment {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'code' | 'file';
  content?: string;
  status: 'processing' | 'ready' | 'error';
  progress: number;
}

const DEFAULT_AGENT: CustomAgent = {
  id: 'manus-core',
  name: 'Manus Core',
  systemInstruction: 'You are a World-Class Senior Full-Stack Developer and SEO Expert. Build unique, high-fidelity applications with perfect SEO optimization.',
  iconType: 'brain',
  color: '#2563EB',
  provider: 'gemini'
};

const SUGGESTIONS = [
  { label: 'Build Python app', icon: <Terminal size={14} />, prompt: 'Build a powerful Python application that automates data processing with a clean CLI interface.' },
  { label: '2D Platformer', icon: <Gamepad2 size={14} />, prompt: 'Create a 2D platformer game engine with physics, parallax scrolling, and a character controller.' },
  { label: '3D RPG World', icon: <Box size={14} />, prompt: 'Generate a 3D RPG world environment using Three.js with dynamic lighting and interactive objects.' },
  { label: 'AI NPC Behavior', icon: <BrainCircuit size={14} />, prompt: 'Script an advanced AI behavior tree for NPCs that react to player movements and environment changes.' },
  { label: 'Physics Engine', icon: <Cpu size={14} />, prompt: 'Build a custom 2D physics engine from scratch supporting collisions, gravity, and friction.' },
  { label: 'Inventory System', icon: <Layers size={14} />, prompt: 'Design a modular RPG inventory system with drag-and-drop support and item metadata.' },
];

const toolDeclarations: FunctionDeclaration[] = [
  {
    name: 'build_website',
    description: 'Generates a unique, production-ready website. MUST include SEO meta tags, Open Graph data, JSON-LD schema, and semantic HTML.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        description: { type: Type.STRING, description: "Technical and SEO strategy breakdown." },
        html_code: { type: Type.STRING, description: "Complete source with SEO headers and semantic body." },
      },
      required: ['description', 'html_code'],
    },
  },
  {
    name: 'build_mobile_app',
    description: 'Generates a mobile app simulation using Web technologies. MUST include app-specific metadata and semantic structure.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        platform: { type: Type.STRING, enum: ['React Native', 'Flutter'] },
        code: { type: Type.STRING, description: "HTML/Tailwind/JS code optimized for 9:16 simulation." },
        app_name: { type: Type.STRING },
        app_icon_description: { type: Type.STRING }
      },
      required: ['platform', 'code', 'app_name'],
    },
  }
];

const ChatPage: React.FC<ChatPageProps> = ({ 
  onBack, project, onCreateProject, onUpdateProject, 
  credits, onDeductCredits, isDarkMode, onToggleTheme, 
  onExportProject, customAgents = [], onOpenAgentManager 
}) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(project?.messages || []);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingSteps, setLoadingSteps] = useState<AgentStep[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedAgentId, setSelectedAgentId] = useState<string>(project?.agentId || 'manus-core');
  const [isAgentSelectorOpen, setIsAgentSelectorOpen] = useState(false);
  const [previewWebCode, setPreviewWebCode] = useState<string | null>(null);
  const [previewMobileData, setPreviewMobileData] = useState<{platform: 'React Native' | 'Flutter', code: string, appName?: string, appIcon?: string} | null>(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const allAgents = [DEFAULT_AGENT, ...customAgents];
  const selectedAgent = allAgents.find(a => a.id === selectedAgentId) || DEFAULT_AGENT;

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' }); 
    }
  }, [messages, isLoading]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (files.length === 0) return;
    const newAttachments: Attachment[] = files.map(file => ({
      id: Math.random().toString(36).substring(2, 9),
      file, preview: '',
      type: file.type.startsWith('image/') ? 'image' : (file.name.match(/\.(ts|tsx|js|jsx|html|css|py|json|md|txt)$/i) ? 'code' : 'file'),
      status: 'processing', progress: 0
    }));
    setAttachments(prev => [...prev, ...newAttachments]);
    e.target.value = '';
    for (const attachment of newAttachments) {
      const reader = new FileReader();
      reader.onload = async () => {
        updateAttachment(attachment.id, { preview: attachment.type === 'image' ? reader.result as string : '', content: attachment.type !== 'image' ? reader.result as string : undefined, status: 'ready', progress: 100 });
      };
      if (attachment.type === 'image') reader.readAsDataURL(attachment.file);
      else reader.readAsText(attachment.file);
    }
  };

  const updateAttachment = (id: string, updates: Partial<Attachment>) => setAttachments(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));

  const handleSendMessage = async (customInput?: string) => {
    const finalInput = customInput || input;
    const readyAttachments = attachments.filter(a => a.status === 'ready');
    if ((!finalInput.trim() && readyAttachments.length === 0) || isLoading) return;
    
    setError(null);
    if (!onDeductCredits(50)) return;

    let combinedText = finalInput.trim();
    const currentAttachments = [...readyAttachments];
    currentAttachments.forEach(att => {
      if (att.type !== 'image' && att.content) combinedText += `\n\n[FILE: ${att.file.name}]\n\`\`\`\n${att.content}\n\`\`\``;
    });

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: finalInput.trim() || `Command with ${currentAttachments.length} items`, timestamp: new Date(), agentId: selectedAgentId };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setAttachments([]);
    setIsLoading(true);

    const initialSteps: AgentStep[] = [
      { id: 'step-1', type: 'plan', label: 'Analyzing Complex Goal', status: 'running' },
      { id: 'step-2', type: 'search', label: 'Decomposing Sub-tasks', status: 'pending' },
      { id: 'step-3', type: 'code', label: 'Building Technical Logic', status: 'pending' },
      { id: 'step-4', type: 'action', label: 'Finalizing Output', status: 'pending' }
    ];
    setLoadingSteps(initialSteps);

    try {
      // Use custom API Key if available, else fallback to default
      const effectiveApiKey = selectedAgent.apiKey || process.env.API_KEY;
      const ai = new GoogleGenAI({ apiKey: effectiveApiKey });
      
      const parts: any[] = [{ text: combinedText || "Initialize protocol." }];
      currentAttachments.forEach(att => {
        if (att.type === 'image' && att.preview) parts.push({ inlineData: { data: att.preview.split(',')[1], mimeType: att.file.type || 'image/png' } });
      });

      const response = await ai.models.generateContent({
        model: selectedAgent.provider === 'gemini' ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview',
        contents: [
          ...messages.map(m => ({ role: m.role as any, parts: [{ text: m.text }] })), 
          { role: 'user', parts }
        ],
        config: { 
          thinkingConfig: selectedAgentId === 'manus-core' ? { thinkingBudget: 32768 } : undefined,
          systemInstruction: `${selectedAgent.systemInstruction}\nMODULAR SYNTHESIS PROTOCOL ACTIVE.`, 
          tools: [{ functionDeclarations: toolDeclarations }] 
        }
      });

      let webCode = project?.websiteCode;
      let mobileData = project?.mobileAppData;
      if (response && response.functionCalls) {
        for (const call of response.functionCalls) {
          const args = (call.args as any) || {};
          if (call.name === 'build_website') webCode = args.html_code;
          if (call.name === 'build_mobile_app') mobileData = { platform: args.platform || 'React Native', code: args.code, description: args.description || 'Architecture', appName: args.app_name };
        }
      }

      const aiMsg: ChatMessage = { 
        id: (Date.now() + 1).toString(), role: 'model', text: response?.text || 'Synthesis complete.', timestamp: new Date(), 
        websiteCode: webCode, mobileAppData: mobileData, agentId: selectedAgentId, steps: loadingSteps.map(s => ({...s, status: 'completed'}))
      };
      setMessages(prev => [...prev, aiMsg]);
      
      if (project) onUpdateProject(project.id, { messages: [...messages, userMsg, aiMsg], websiteCode: webCode, mobileAppData: mobileData });
      else onCreateProject({ id: Date.now().toString(), title: userMsg.text.slice(0, 30), description: aiMsg.text.slice(0, 100), date: 'Today', icon: webCode ? 'web' : mobileData ? 'mobile' : 'game', category: 'All', status: 'completed', messages: [userMsg, aiMsg], websiteCode: webCode, mobileAppData: mobileData, agentId: selectedAgentId });
      
    } catch (err: any) {
      console.error(err);
      let errorMsg = "An unexpected neural fault occurred.";
      if (err.message?.includes('429') || err.message?.toLowerCase().includes('quota')) {
        errorMsg = "Quota Exceeded. Please check your Agent's API Key in the Fleet Manager or wait for reset.";
      } else if (err.message?.includes('API_KEY_INVALID')) {
        errorMsg = "Invalid API Key. Please update your Agent credentials.";
      }
      setError(errorMsg);
      // Remove the last user message if it failed to process to keep history clean
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
      setLoadingSteps([]);
    }
  };

  const getAgentIcon = (type: string, color: string) => {
    const props = { size: 16, style: { color } };
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
    <div className="h-screen flex flex-col bg-[#0A0A0A] text-white overflow-hidden safe-pt relative">
      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} multiple accept="image/*,.txt,.md,.js,.ts,.tsx,.jsx,.html,.css,.py,.json" />
      <header className="px-6 py-5 flex items-center justify-between z-[60] bg-black/50 backdrop-blur-xl border-b border-white/[0.04]">
        <div className="flex items-center space-x-3">
          <button className="w-10 h-10 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center overflow-hidden active:scale-95 transition-all"><img src="https://ui-avatars.com/api/?name=User&background=2563EB&color=fff" alt="Profile" className="w-full h-full object-cover" /></button>
          <button onClick={onBack} className="p-2 text-white/30 hover:text-white transition-colors"><ArrowLeft size={20} /></button>
        </div>
        <div className="relative">
          <button onClick={() => setIsAgentSelectorOpen(!isAgentSelectorOpen)} className="flex flex-col items-center group">
            <div className="flex items-center space-x-2"><span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Autonomous core</span><ChevronDown size={12} className={`text-blue-500 transition-transform ${isAgentSelectorOpen ? 'rotate-180' : ''}`} /></div>
            <span className="text-[11px] font-bold text-white/40 mt-0.5 flex items-center space-x-1.5 uppercase tracking-widest">{getAgentIcon(selectedAgent.iconType, selectedAgent.color)}<span>{selectedAgent.name}</span></span>
          </button>
          {isAgentSelectorOpen && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-64 glass rounded-[2rem] shadow-2xl p-2 z-[100] animate-in slide-in-from-top-2 duration-300">
              <div className="max-h-80 overflow-y-auto no-scrollbar space-y-1">
                {allAgents.map(agent => (
                  <button key={agent.id} onClick={() => { setSelectedAgentId(agent.id); setIsAgentSelectorOpen(false); }} className={`w-full flex items-center space-x-3 p-3 rounded-2xl transition-all ${selectedAgentId === agent.id ? 'bg-blue-600/15' : 'hover:bg-white/5'}`}>
                    <div className="w-9 h-9 rounded-xl bg-black/40 flex items-center justify-center border border-white/5">{getAgentIcon(agent.iconType, agent.color)}</div>
                    <div className="flex-1 text-left">
                      <p className="text-[13px] font-bold">{agent.name}</p>
                      <div className="flex items-center space-x-1.5">
                        <p className="text-[9px] opacity-40 uppercase tracking-widest">{agent.provider}</p>
                        {agent.apiKey && <div className="w-1 h-1 rounded-full bg-green-500" title="Custom API Key active" />}
                      </div>
                    </div>
                  </button>
                ))}
                
                <div className="pt-2 mt-1 border-t border-white/5">
                  <button onClick={() => { setIsAgentSelectorOpen(false); onOpenAgentManager?.(); }} className="w-full flex items-center space-x-3 p-3 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 hover:bg-blue-600/20 transition-all group">
                    <div className="w-9 h-9 rounded-xl bg-blue-600/20 flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform"><Plus size={16} /></div>
                    <div className="text-left"><p className="text-[11px] font-black uppercase tracking-widest">Deploy New</p></div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2"><button onClick={() => onBack()} className={`p-2.5 rounded-2xl border transition-all bg-white/5 text-white/30 hover:text-white border-white/5`}><Save size={18} /></button></div>
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-10 no-scrollbar">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center px-10 space-y-4 opacity-20">
            <Sparkles size={48} />
            <p className="text-sm font-black uppercase tracking-[0.2em]">Initiate Neural Synthesis</p>
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[85%] rounded-[2rem] px-6 py-4 text-[15px] leading-relaxed shadow-xl ${msg.role === 'user' ? 'bg-blue-600 text-white shadow-blue-600/20' : 'bg-[#141414] border border-white/[0.08] text-white/90'}`}>
              <div className="markdown-content"><ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown></div>
              
              {msg.role === 'model' && (msg.websiteCode || msg.mobileAppData) && (
                <div className="mt-5 pt-4 border-t border-white/[0.08] flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-2 duration-500">
                  {msg.websiteCode && (
                    <button onClick={() => setPreviewWebCode(msg.websiteCode!)} className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-[11px] shadow-lg shadow-blue-600/20 active:scale-95 transition-all">
                      <Globe size={13} /><span>Preview Website</span>
                    </button>
                  )}
                  {msg.mobileAppData && (
                    <button onClick={() => setPreviewMobileData(msg.mobileAppData!)} className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-[11px] shadow-lg shadow-blue-600/20 active:scale-95 transition-all">
                      <Smartphone size={13} /><span>Preview App</span>
                    </button>
                  )}
                  <button onClick={() => setIsPublishModalOpen(true)} className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/10 border border-white/10 text-white/60 hover:text-white font-bold text-[11px] active:scale-95 transition-all">
                    <Upload size={13} /><span>Publish</span>
                  </button>
                </div>
              )}

              {msg.steps && msg.steps.length > 0 && (
                <div className="mt-5 pt-4 border-t border-white/[0.05] space-y-2.5">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20">Protocol Breakdown</span>
                  {msg.steps.map(step => (
                    <div key={step.id} className="flex items-center space-x-3 opacity-50"><CheckCircle2 size={12} className="text-blue-500" /><span className="text-[12px] font-medium">{step.label}</span></div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {error && (
          <div className="flex justify-start animate-in slide-in-from-left-4">
             <div className="bg-red-500/10 border border-red-500/20 rounded-[1.5rem] px-5 py-4 flex items-start space-x-3 max-w-[85%]">
                <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={16} />
                <div className="space-y-1">
                  <p className="text-[13px] font-bold text-red-200">{error}</p>
                  <button onClick={() => onOpenAgentManager?.()} className="text-[10px] uppercase font-black tracking-widest text-red-400 hover:underline">Update Agent Config</button>
                </div>
             </div>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-[#141414] border border-white/[0.06] rounded-[2.5rem] px-8 py-7 w-full max-w-[85%] animate-in slide-in-from-bottom-4 duration-500">
               <div className="flex items-center space-x-4 mb-8">
                 <div className="w-10 h-10 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500 border border-blue-500/20"><BrainCircuit size={20} className="animate-pulse" /></div>
                 <div><span className="text-[14px] font-black tracking-tight block">Manus Reasoning</span><span className="text-[9px] font-black uppercase tracking-widest text-blue-500 animate-pulse">Synthesis in progress</span></div>
               </div>
               <div className="space-y-5">
                 {loadingSteps.map((step) => (
                   <div key={step.id} className={`flex items-center space-x-4 transition-all duration-500 ${step.status === 'pending' ? 'opacity-10' : 'opacity-100'}`}>
                     <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${step.status === 'completed' ? 'bg-green-500/10 text-green-500' : step.status === 'running' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white/5 text-white/10'}`}>
                       {step.status === 'completed' ? <CheckCircle2 size={16} /> : step.status === 'running' ? <Loader2 size={16} className="animate-spin" /> : <Activity size={16} />}
                     </div>
                     <span className={`text-[13px] font-bold ${step.status === 'running' ? 'text-white' : 'text-white/40'}`}>{step.label}</span>
                   </div>
                 ))}
               </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="px-5 mb-2 overflow-x-auto no-scrollbar flex items-center space-x-2">
        {SUGGESTIONS.map((s, idx) => (
          <button key={idx} onClick={() => handleSendMessage(s.prompt)} className="shrink-0 flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.08] hover:border-white/10 transition-all active:scale-95">
            <span className="text-blue-500/60">{s.icon}</span><span className="text-[12px] font-bold tracking-tight whitespace-nowrap opacity-80">{s.label}</span>
          </button>
        ))}
      </div>

      <footer className="p-5 glass border-t border-white/[0.04]">
        <div className="relative group">
          <button onClick={() => fileInputRef.current?.click()} className="absolute left-2.5 bottom-2.5 p-2.5 text-white/30 hover:text-white transition-all bg-white/5 hover:bg-white/10 rounded-2xl"><FileUp size={20} /></button>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={`Instruct ${selectedAgent.name}...`} className="w-full bg-[#141414] border border-white/[0.06] rounded-[2rem] pl-16 pr-16 py-4 min-h-[64px] max-h-40 text-[15px] outline-none focus:border-blue-500/40 transition-all resize-none no-scrollbar font-medium" />
          <button onClick={() => handleSendMessage()} disabled={!input.trim() || isLoading} className={`absolute right-2.5 bottom-2.5 p-2.5 rounded-2xl transition-all ${input.trim() && !isLoading ? 'bg-blue-600 text-white active:scale-90 shadow-[0_0_20px_rgba(37,99,235,0.4)]' : 'bg-white/5 text-white/10'}`}>
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <ArrowUp size={20} />}
          </button>
        </div>
      </footer>

      {previewWebCode && <WebsitePreview code={previewWebCode} isOpen={true} onClose={() => setPreviewWebCode(null)} />}
      {previewMobileData && <MobileAppPreview platform={previewMobileData.platform} code={previewMobileData.code} isOpen={true} onClose={() => setPreviewMobileData(null)} />}
      {isPublishModalOpen && <PublishModal isOpen={true} onClose={() => setIsPublishModalOpen(false)} appName={previewMobileData?.appName || project?.title} appIcon={previewMobileData?.appIcon} />}
    </div>
  );
};

export default ChatPage;
