
import React, { useState } from 'react';
import { X, ExternalLink, RotateCcw, Smartphone, Monitor, Copy, Check } from 'lucide-react';

interface WebsitePreviewProps {
  code: string;
  isOpen: boolean;
  onClose: () => void;
}

const WebsitePreview: React.FC<WebsitePreviewProps> = ({ code, isOpen, onClose }) => {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [copied, setCopied] = useState(false);
  const [key, setKey] = useState(0); // For forcing iframe refresh

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefresh = () => {
    setKey(prev => prev + 1);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-in fade-in zoom-in duration-300">
      {/* Toolbar */}
      <div className="h-14 bg-[#1A1A1A] border-b border-white/10 flex items-center justify-between px-4">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1.5 mr-2">
            <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
            <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
          </div>
          <div className="bg-black/40 rounded-lg px-3 py-1 flex items-center space-x-2 border border-white/5">
            <span className="text-[11px] font-mono text-white/30 truncate max-w-[120px]">
              preview.manus.ai/local-v{key}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <div className="flex bg-black/40 p-1 rounded-lg border border-white/5 mr-2">
            <button 
              onClick={() => setViewMode('desktop')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'desktop' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
            >
              <Monitor size={14} />
            </button>
            <button 
              onClick={() => setViewMode('mobile')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'mobile' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
            >
              <Smartphone size={14} />
            </button>
          </div>

          <button 
            onClick={handleCopy}
            title="Copy HTML"
            className="p-2 hover:bg-white/10 rounded-lg text-white/60 transition-colors flex items-center space-x-2"
          >
            {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
          </button>
          
          <button 
            onClick={handleRefresh}
            title="Refresh Preview"
            className="p-2 hover:bg-white/10 rounded-lg text-white/60 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          
          <div className="w-[1px] h-4 bg-white/10 mx-1" />
          
          <button 
            onClick={onClose}
            className="p-2 hover:bg-red-500/20 hover:text-red-400 rounded-lg text-white/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 bg-[#0F0F0F] p-4 flex items-center justify-center overflow-hidden">
        <div className={`transition-all duration-500 bg-white shadow-2xl overflow-hidden ${
          viewMode === 'mobile' 
            ? 'w-[375px] h-[667px] rounded-[32px] border-[8px] border-[#1C1C1E]' 
            : 'w-full h-full rounded-xl'
        }`}>
          <iframe 
            key={key}
            srcDoc={code} 
            className="w-full h-full border-none"
            title="Website Preview"
            sandbox="allow-scripts"
          />
        </div>
      </div>
    </div>
  );
};

export default WebsitePreview;
