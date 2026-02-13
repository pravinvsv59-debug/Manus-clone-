
import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronLeft, ChevronDown, Sparkles, Mic, ArrowUp, Plus, User, 
  Loader2, Smartphone, Terminal, Workflow, BrainCircuit, ShieldCheck, 
  Rocket, Shield, Palette, Monitor, Globe, Play, ExternalLink
} from 'lucide-react';
import SkillsModal from './SkillsModal.tsx';
import ConnectorsModal from './ConnectorsModal.tsx';
import WebsitePreview from './WebsitePreview.tsx';
import MobileAppPreview from './MobileAppPreview.tsx';
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { ChatMessage, AgentStep } from '../types.ts';

interface ChatPageProps {
  onBack: () => void;
  initialMessages?: ChatMessage[];
  initialTitle?: string;
  credits: number;
  onDeductCredits: (amount: number) => boolean;
}

const toolDeclarations: FunctionDeclaration[] = [
  {
    name: 'build_website',
    description: 'Generates a production-ready website with advanced HTML and CSS.',
    parameters: {
      type: Type.OBJECT,
      description: 'The content and structural parameters for the website.',
      properties: {
        description: { type: Type.STRING, description: 'Brief description of the website content.' },
        html_code: { type: Type.STRING, description: 'The complete self-contained HTML/CSS source code.' },
      },
      required: ['description', 'html_code'],
    },
  },
  {
    name: 'build_mobile_app',
    description: 'Generates a cross-platform mobile app source code using React Native or Flutter.',
    parameters: {
      type: Type.OBJECT,
      description: 'The architecture and logic parameters for the mobile application.',
      properties: {
        platform: { type: Type.STRING, enum: ['React Native', 'Flutter'], description: 'The target mobile framework.' },
        description: { type: Type.STRING, description: 'Functional overview of the app features.' },
        code: { type: Type.STRING, description: 'The main entry point source code for the app.' },
      },
      required: ['platform', 'description', 'code'],
    },
  }
];

const ChatPage: React.FC<ChatPageProps> = ({ onBack, initialMessages = [], initialTitle, credits, onDeductCredits }) => {
  const [isSkillsOpen, setIsSkillsOpen] = useState(false);
  const [isConnectorsOpen, setIsConnectorsOpen] = useState(false);
  const [previewCode, setPreviewCode] = useState<string | null>(null);
  const [mobileAppPreview, setMobileAppPreview] = useState<ChatMessage['mobileAppData'] | null>(null);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const addLog = (msg: string, type: 'info' | 'error' | 'success' = 'info') => {
    const symbol = type === 'error' ? '✖' : type === 'success' ? '✔' : '›';
    setTerminalLogs(prev => [...prev.slice(-15), `[${new Date().toLocaleTimeString()}] ${symbol} ${msg}`]);
  };

  const handleSendMessage = async (textOverride?: string) => {
    const currentInput = textOverride || input;
    if (!currentInput.trim() || isLoading) return;

    // Credit check (base cost for interaction)
    if (!onDeductCredits(5)) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: currentInput.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setTerminalLogs([]);

    try {
      // Fix: Always initialize GoogleGenAI with apiKey from process.env.API_KEY directly.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      addLog("Initializing autonomous orchestration...");
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [
          ...messages.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
          { role: 'user', parts: [{ text: currentInput }] }
        ],
        config: {
          systemInstruction: "You are Manus v2.5. You build complete, functional web and mobile applications. When tool-calling, ensure the code provided is high-quality and production-ready.",
          tools: [{ functionDeclarations: toolDeclarations }]
        }
      });

      let extractedWebCode = '';
      let mobileAppData: ChatMessage['mobileAppData'] | undefined;

      if (response.functionCalls && response.functionCalls.length > 0) {
        // High-level generation cost
        if (!onDeductCredits(95)) {
            setIsLoading(false);
            return;
        }

        for (const call of response.functionCalls) {
          if (call.name === 'build_website') {
            addLog("Compiling UI framework...");
            extractedWebCode = call.args.html_code;
            await new Promise(r => setTimeout(r, 1000));
            addLog("Global deployment complete.", 'success');
          } else if (call.name === 'build_mobile_app') {
            addLog(`Scaffolding ${call.args.platform} bridge...`);
            mobileAppData = { platform: call.args.platform, code: call.args.code, description: call.args.description };
            await new Promise(r => setTimeout(r, 1500));
            addLog("Mobile binary ready for testing.", 'success');
          }
        }
      }

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.text || "Engineering process complete. See results below.",
        timestamp: new Date(),
        websiteCode: extractedWebCode,
        mobileAppData
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err: any) {
      addLog(`Critical Failure: ${err.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen max-w-md mx-auto bg-[#080808] flex flex-col relative text-white">
      {/* Dynamic Header */}
      <div className="flex items-center justify-between px-4 py-5 shrink-0 border-b border-white/5 bg-[#080808]/95 backdrop-blur-xl z-20">
        <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-xl transition-all"><ChevronLeft className="w-6 h-6" /></button>
        <div className="flex flex-col items-center">
            <div className="flex items-center space-x-2 px-3 py-0.5 bg-blue-500/10 rounded-full border border-blue-500/20">
              <ShieldCheck className="w-3 h-3 text-blue-400" />
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Autonomous</span>
            </div>
            <button className="flex items-center mt-1 text-[14px] font-bold">{initialTitle || 'Manus Ultra'}</button>
        </div>
        <div className="flex items-center space-x-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
          <Sparkles className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" />
          <span className="text-xs font-black">{credits}</span>
        </div>
      </div>

      {/* Main Conversation */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-10 no-scrollbar">
        {messages.length === 0 && !isLoading ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-8 px-6">
            <div className="w-24 h-24 bg-[#111] rounded-[3rem] flex items-center justify-center border border-white/10 relative shadow-2xl">
              <div className="absolute inset-0 bg-blue-500/5 blur-[40px] rounded-full" />
              <BrainCircuit className="w-12 h-12 text-blue-500 relative z-10" />
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tight">Manus Agent</h2>
              <p className="text-white/30 text-sm font-medium leading-relaxed">
                Provide a prompt to begin autonomous engineering. I can build websites, mobile apps, and complex datasets.
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom duration-500`}>
                <div className={`flex items-start space-x-3 max-w-[92%] ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                    msg.role === 'user' ? 'bg-white/5 border-white/10' : 'bg-blue-600 border-blue-500 shadow-xl shadow-blue-500/20'
                  }`}>
                    {msg.role === 'user' ? <User size={16} /> : <div className="text-[11px] font-black tracking-tighter">M</div>}
                  </div>
                  <div className="flex flex-col space-y-3">
                    <div className={`rounded-[1.5rem] px-5 py-4 text-[15px] leading-relaxed shadow-xl ${
                      msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-[#151515] text-white/90 border border-white/5'
                    }`}>
                      {msg.text}
                    </div>

                    {/* Artifact Actions - Professional Cards */}
                    {(msg.websiteCode || msg.mobileAppData) && (
                      <div className="grid grid-cols-1 gap-3 pt-2">
                        {msg.websiteCode && (
                          <div className="bg-[#1A1A1A] border border-white/5 rounded-3xl p-4 flex flex-col space-y-4">
                            <div className="flex items-center space-x-3">
                               <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400">
                                  <Monitor size={20} />
                               </div>
                               <div className="flex flex-col">
                                  <span className="text-[13px] font-bold">Web Application</span>
                                  <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">v1.0.0-neural</span>
                               </div>
                            </div>
                            <button 
                              onClick={() => setPreviewCode(msg.websiteCode || '')} 
                              className="w-full h-12 bg-pink-600 hover:bg-pink-700 active:scale-[0.98] transition-all rounded-2xl flex items-center justify-center space-x-2 font-black text-xs uppercase tracking-widest shadow-lg shadow-pink-600/20"
                            >
                              <Globe size={16} />
                              <span>Preview Website</span>
                            </button>
                          </div>
                        )}
                        {msg.mobileAppData && (
                          <div className="bg-[#1A1A1A] border border-white/5 rounded-3xl p-4 flex flex-col space-y-4">
                            <div className="flex items-center space-x-3">
                               <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                                  <Smartphone size={20} />
                               </div>
                               <div className="flex flex-col">
                                  <span className="text-[13px] font-bold">{msg.mobileAppData.platform} Native</span>
                                  <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Cross-Platform SDK</span>
                               </div>
                            </div>
                            <button 
                              onClick={() => setMobileAppPreview(msg.mobileAppData || null)} 
                              className="w-full h-12 bg-cyan-600 hover:bg-cyan-700 active:scale-[0.98] transition-all rounded-2xl flex items-center justify-center space-x-2 font-black text-xs uppercase tracking-widest shadow-lg shadow-cyan-600/20"
                            >
                              <Play size={16} fill="currentColor" />
                              <span>Launch Mobile App</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="space-y-6">
                <div className="flex items-center space-x-3 text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-2">
                   <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                   <span>Neural Orchestration in Progress</span>
                </div>
                <div className="ml-12 bg-black/50 rounded-2xl p-5 border border-white/5 font-mono text-[10px] text-white/20 h-44 overflow-y-auto no-scrollbar shadow-inner">
                  {terminalLogs.map((log, i) => <div key={i} className="mb-1.5 opacity-80">{log}</div>)}
                  <div className="flex items-center space-x-1">
                    <div className="w-1.5 h-3 bg-blue-500/50 animate-pulse" />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Console */}
      <div className="px-4 pb-10 pt-4 bg-[#080808]">
        <div className="bg-[#121212] rounded-[2.5rem] p-3 flex flex-col border border-white/10 shadow-[0_-10px_50px_rgba(0,0,0,0.5)]">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Instruct Manus..."
            className="w-full bg-transparent text-white text-[16px] outline-none min-h-[50px] p-4 resize-none scrollbar-none font-medium placeholder:text-white/10"
            rows={1}
          />
          <div className="flex items-center justify-between px-3 pb-2 pt-1">
            <div className="flex space-x-2">
              <button 
                onClick={() => setIsSkillsOpen(true)} 
                className="p-3 text-white/20 hover:text-white hover:bg-white/5 rounded-2xl transition-all"
              >
                <Plus size={22} />
              </button>
            </div>
            <button 
              onClick={() => handleSendMessage()} 
              disabled={!input.trim() || isLoading} 
              className={`p-3.5 rounded-2xl transition-all ${input.trim() && !isLoading ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/40 hover:scale-105 active:scale-95' : 'text-white/10'}`}
            >
              <ArrowUp size={24} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <SkillsModal isOpen={isSkillsOpen} onClose={() => setIsSkillsOpen(false)} onSkillClick={handleSendMessage} />
      <ConnectorsModal isOpen={isConnectorsOpen} onClose={() => setIsConnectorsOpen(false)} />
      <WebsitePreview code={previewCode || ''} isOpen={!!previewCode} onClose={() => setPreviewCode(null)} />
      <MobileAppPreview 
        platform={mobileAppPreview?.platform || 'React Native'} 
        code={mobileAppPreview?.code || ''} 
        isOpen={!!mobileAppPreview} 
        onClose={() => setMobileAppPreview(null)} 
      />
    </div>
  );
};

export default ChatPage;
