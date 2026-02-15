
import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header.tsx';
import CategoryTabs from './components/CategoryTabs.tsx';
import ProjectItem from './components/ProjectItem.tsx';
import FloatingButton from './components/FloatingButton.tsx';
import ChatPage from './components/ChatPage.tsx';
import SettingsMenu from './components/SettingsMenu.tsx';
import SkillsModal from './components/SkillsModal.tsx';
import ConnectorsModal from './components/ConnectorsModal.tsx';
import SubscriptionModal from './components/SubscriptionModal.tsx';
import AgentManagerModal from './components/AgentManagerModal.tsx';
import { Sparkles, FolderOpen, Coffee, Zap, User, Search, Bot } from 'lucide-react';
import { Category, Project, CustomAgent } from './types.ts';

const STORAGE_KEY = 'manus_projects_v1';
const AGENTS_STORAGE_KEY = 'manus_custom_agents_v1';

const INITIAL_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Visual Novel Engine',
    description: 'Autonomous layer for story branching and asset synthesis...',
    date: 'Today',
    icon: 'game',
    category: 'Favorites',
    status: 'pending',
    progress: 72,
    messages: [
      { id: 'm1', role: 'user', text: 'Build a visual novel engine', timestamp: new Date() }
    ]
  },
  {
    id: '2',
    title: 'Market Analysis Dashboard',
    description: 'Completed e-commerce trend report for Q1 2025.',
    date: 'Mon',
    icon: 'chart',
    category: 'All',
    status: 'completed',
    messages: []
  },
  {
    id: '3',
    title: 'AI Art Generator',
    description: 'A platform for generating unique AI-powered art pieces.',
    date: 'Tue',
    icon: 'palette',
    category: 'All',
    status: 'completed',
    messages: []
  }
];

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [customAgents, setCustomAgents] = useState<CustomAgent[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [currentView, setCurrentView] = useState<'home' | 'chat'>('home');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSkillsOpen, setIsSkillsOpen] = useState(false);
  const [isConnectorsOpen, setIsConnectorsOpen] = useState(false);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [isAgentManagerOpen, setIsAgentManagerOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{name: string, email: string, photo: string} | null>(null);
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#0A0A0A';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#fcfcfc';
    }
  }, [isDarkMode]);

  useEffect(() => {
    // Load Projects
    const savedProjects = localStorage.getItem(STORAGE_KEY);
    if (savedProjects) {
      try {
        const parsed = JSON.parse(savedProjects);
        setProjects(parsed.map((p: any) => ({
          ...p,
          messages: (p.messages || []).map((m: any) => ({ 
            ...m, 
            timestamp: m.timestamp ? new Date(m.timestamp) : new Date() 
          }))
        })));
      } catch (e) { setProjects(INITIAL_PROJECTS); }
    } else { setProjects(INITIAL_PROJECTS); }

    // Load Agents
    const savedAgents = localStorage.getItem(AGENTS_STORAGE_KEY);
    if (savedAgents) {
      try { setCustomAgents(JSON.parse(savedAgents)); } catch (e) { setCustomAgents([]); }
    }
  }, []);

  useEffect(() => {
    if (projects.length > 0) localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(AGENTS_STORAGE_KEY, JSON.stringify(customAgents));
  }, [customAgents]);

  const filteredProjects = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return projects.filter(p => {
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      if (!query) return matchesCategory;
      return matchesCategory && (p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query));
    });
  }, [projects, activeCategory, searchQuery]);

  const activeTasks = filteredProjects.filter(p => p.status === 'pending');
  const historyProjects = filteredProjects.filter(p => p.status === 'completed');

  const handleOpenProject = (project: Project) => {
    setSelectedProject(project);
    setCurrentView('chat');
  };

  const handleNewChat = () => {
    setSelectedProject(null);
    setCurrentView('chat');
  };

  const updateProject = (projectId: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, ...updates } : p));
  };

  const createProject = (newProject: Project) => {
    setProjects(prev => [newProject, ...prev]);
    setSelectedProject(newProject);
  };

  const handleSettingAction = (action: string) => {
    switch (action) {
      case 'history': setCurrentView('home'); setIsSettingsOpen(false); break;
      case 'skills': setIsSkillsOpen(true); break;
      case 'connectors': setIsConnectorsOpen(true); break;
      case 'credits': setIsSubscriptionOpen(true); break;
      case 'agents': setIsAgentManagerOpen(true); break;
      case 'login': handleGoogleLogin(); break;
      case 'logout': setIsLoggedIn(false); setUser(null); setCredits(0); break;
    }
  };

  const handleGoogleLogin = () => {
    setIsLoggedIn(true);
    setUser({
      name: 'User',
      email: 'user@manus.ai',
      photo: 'https://ui-avatars.com/api/?name=User&background=2563EB&color=fff'
    });
    setCredits(1000);
  };

  if (!isLoggedIn) {
    return (
      <main className="h-screen flex flex-col p-10 justify-between bg-[#0A0A0A] text-white relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-blue-600/20 blur-[150px] rounded-full" />
        </div>
        <div className="mt-20 flex flex-col items-center text-center relative z-10">
          <div className="w-24 h-24 rounded-[2.5rem] bg-white/[0.03] border border-white/10 flex items-center justify-center shadow-2xl">
            <Sparkles className="w-12 h-12 text-blue-500" fill="currentColor" />
          </div>
          <div className="mt-10 space-y-4">
            <h1 className="text-5xl font-manus lowercase tracking-tighter">manus</h1>
            <p className="text-[15px] opacity-40 font-medium tracking-tight">The first autonomous AI agent framework.</p>
          </div>
        </div>
        <div className="space-y-6 relative z-10 safe-pb">
          <button onClick={handleGoogleLogin} className="w-full h-18 bg-white text-black rounded-[2rem] font-black text-[13px] uppercase tracking-[0.2em] flex items-center justify-center space-x-4 active:scale-95 transition-all">
            <img src="https://www.google.com/favicon.ico" alt="" className="w-5 h-5" />
            <span>Continue with Google</span>
          </button>
        </div>
      </main>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#0A0A0A] text-white overflow-hidden safe-pt">
      {currentView === 'chat' ? (
        <ChatPage 
          onBack={() => { setCurrentView('home'); setSelectedProject(null); }} 
          project={selectedProject}
          onCreateProject={createProject}
          onUpdateProject={updateProject}
          credits={credits}
          onDeductCredits={(amt) => { if (credits < amt) { setIsSubscriptionOpen(true); return false; } setCredits(prev => prev - amt); return true; }}
          isDarkMode={isDarkMode}
          onToggleTheme={() => setIsDarkMode(!isDarkMode)}
          customAgents={customAgents}
          onOpenAgentManager={() => setIsAgentManagerOpen(true)}
        />
      ) : (
        <div className="flex-1 flex flex-col relative h-full">
          <SettingsMenu isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} onAction={handleSettingAction} credits={credits} isLoggedIn={isLoggedIn} user={user} isDarkMode={isDarkMode} />
          <SkillsModal isOpen={isSkillsOpen} onClose={() => setIsSkillsOpen(false)} onSkillClick={handleNewChat} />
          <ConnectorsModal isOpen={isConnectorsOpen} onClose={() => setIsConnectorsOpen(false)} isDarkMode={isDarkMode} />
          <SubscriptionModal isOpen={isSubscriptionOpen} onClose={() => setIsSubscriptionOpen(false)} onPurchase={(amt) => { setCredits(prev => prev + amt); setIsSubscriptionOpen(false); }} isDarkMode={isDarkMode} />
          <AgentManagerModal isOpen={isAgentManagerOpen} onClose={() => setIsAgentManagerOpen(false)} agents={customAgents} onUpdateAgents={setCustomAgents} />
          
          <Header onProfileClick={() => setIsSettingsOpen(true)} credits={credits} isLoggedIn={isLoggedIn} isDarkMode={isDarkMode} onToggleTheme={() => setIsDarkMode(!isDarkMode)} />
          
          <main className="flex-1 overflow-y-auto no-scrollbar pb-40">
            <div className="px-6 pt-6 pb-2">
              <div className="group relative rounded-2xl bg-white/[0.03] border border-white/5 flex items-center px-5 py-4 focus-within:border-blue-500/30 transition-all">
                <Search size={18} className="mr-4 opacity-20 group-focus-within:text-blue-500 transition-all" />
                <input type="text" placeholder="Find your creations..." className="bg-transparent border-none outline-none w-full text-[14px] font-bold text-white placeholder:opacity-20" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
            </div>

            <CategoryTabs activeCategory={activeCategory} onCategoryChange={setActiveCategory} isDarkMode={isDarkMode} />
            
            {filteredProjects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 opacity-10">
                <Coffee size={48} strokeWidth={1.5} />
                <p className="mt-4 text-[11px] font-black uppercase tracking-[0.4em]">Zero Results</p>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                {activeTasks.length > 0 && (
                  <section>
                    <div className="px-8 mb-4 flex items-center space-x-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
                      <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Live Synthesis</h2>
                    </div>
                    <div className="space-y-1">
                      {activeTasks.map((p) => (
                        <button key={p.id} onClick={() => handleOpenProject(p)} className="w-full text-left"><ProjectItem project={p} isDarkMode={isDarkMode} /></button>
                      ))}
                    </div>
                  </section>
                )}
                <section className="mt-10">
                  <div className="px-8 mb-4 flex items-center space-x-2.5 opacity-20">
                    <FolderOpen size={12} />
                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em]">Archive</h2>
                  </div>
                  <div className="space-y-1">
                    {historyProjects.map((p) => (
                      <button key={p.id} onClick={() => handleOpenProject(p)} className="w-full text-left"><ProjectItem project={p} isDarkMode={isDarkMode} /></button>
                    ))}
                  </div>
                </section>
              </div>
            )}
          </main>
          
          <FloatingButton onClick={handleNewChat} isDarkMode={isDarkMode} />
          
          <nav className="absolute bottom-6 left-6 right-6 h-20 bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] flex items-center justify-around px-8 shadow-2xl z-20">
             <button className="text-blue-500 flex flex-col items-center space-y-1">
                <Zap size={22} fill="currentColor" />
                <span className="text-[9px] font-black uppercase tracking-widest">Core</span>
                <div className="w-1 h-1 bg-blue-500 rounded-full mt-0.5" />
             </button>
             <button onClick={() => setIsAgentManagerOpen(true)} className="text-white/20 hover:text-white transition-all flex flex-col items-center space-y-1">
                <Bot size={22} />
                <span className="text-[9px] font-black uppercase tracking-widest">Agents</span>
             </button>
             <button onClick={() => setIsSettingsOpen(true)} className="text-white/20 hover:text-white transition-all flex flex-col items-center space-y-1">
                <User size={22} />
                <span className="text-[9px] font-black uppercase tracking-widest">Self</span>
             </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default App;
