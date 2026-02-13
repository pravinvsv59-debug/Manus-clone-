
import React, { useState, useMemo } from 'react';
import Header from './components/Header.tsx';
import CategoryTabs from './components/CategoryTabs.tsx';
import ProjectItem from './components/ProjectItem.tsx';
import FloatingButton from './components/FloatingButton.tsx';
import ChatPage from './components/ChatPage.tsx';
import SettingsMenu from './components/SettingsMenu.tsx';
import SkillsModal from './components/SkillsModal.tsx';
import ConnectorsModal from './components/ConnectorsModal.tsx';
import SubscriptionModal from './components/SubscriptionModal.tsx';
// Fix: Added Plus to the lucide-react import list as it's used on line 308.
import { LogIn, Sparkles, Layout, ShieldCheck, Zap, FolderOpen, Box, Plus } from 'lucide-react';
import { Category, Project } from './types.ts';

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
    status: 'completed'
  },
  {
    id: '3',
    title: 'System Health Automation',
    description: 'Scheduled maintenance sequence successfully deployed.',
    date: 'Fri',
    icon: 'chart',
    category: 'Scheduled',
    status: 'completed',
    isDashedIcon: true
  },
  {
    id: '4',
    title: 'Portfolio Draft',
    description: 'Initial scaffolding for a 3D personal portfolio.',
    date: 'Draft',
    icon: 'game',
    category: 'All',
    status: 'pending',
    progress: 10
  }
];

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [currentView, setCurrentView] = useState<'home' | 'chat'>('home');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSkillsOpen, setIsSkillsOpen] = useState(false);
  const [isConnectorsOpen, setIsConnectorsOpen] = useState(false);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{name: string, email: string, photo: string} | null>(null);
  const [credits, setCredits] = useState(0);

  const filteredProjects = useMemo(() => {
    return INITIAL_PROJECTS.filter(p => {
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Sectioning logic
  const activeTasks = filteredProjects.filter(p => p.status === 'pending' && (p.progress || 0) > 20);
  const historyProjects = filteredProjects.filter(p => p.status === 'completed');
  const draftsAndTemplates = filteredProjects.filter(p => p.status === 'pending' && (p.progress || 0) <= 20);

  const handleOpenProject = (project: Project) => {
    setSelectedProject(project);
    setCurrentView('chat');
  };

  const handleNewChat = () => {
    setSelectedProject(null);
    setCurrentView('chat');
  };

  const handleGoogleLogin = () => {
    const simulatedUser = {
      name: 'Agent Explorer',
      email: 'user@manus.ai',
      photo: 'https://ui-avatars.com/api/?name=Agent+Explorer&background=0D8ABC&color=fff'
    };
    setIsLoggedIn(true);
    setUser(simulatedUser);
    setCredits(1000);
  };

  const deductCredits = (amount: number): boolean => {
    if (credits < amount) {
      setIsSubscriptionOpen(true);
      return false;
    }
    setCredits(prev => prev - amount);
    return true;
  };

  const handleSettingAction = (action: string) => {
    switch (action) {
      case 'skills': setIsSkillsOpen(true); break;
      case 'connectors': setIsConnectorsOpen(true); break;
      case 'credits': setIsSubscriptionOpen(true); break;
      case 'login': handleGoogleLogin(); break;
      case 'logout': setIsLoggedIn(false); setUser(null); setCredits(0); break;
      case 'mail': window.open(`mailto:support@manus.ai`); break;
      default: break;
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen max-w-md mx-auto bg-[#080808] flex flex-col p-8 justify-between relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-600/10 blur-[120px] rounded-full -z-10" />
        
        <div className="mt-20 space-y-8 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-white/5 rounded-[2.5rem] border border-white/10 flex items-center justify-center shadow-2xl relative">
            <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full" />
            <Layout className="w-10 h-10 text-white relative z-10" />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-manus lowercase tracking-tight">manus</h1>
            <p className="text-sm text-white/40 leading-relaxed px-6 font-medium">
              Autonomous multi-agent orchestration. <br/> Engineering at the speed of thought.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white/5 rounded-3xl p-6 border border-white/10 space-y-4 backdrop-blur-md">
             <div className="flex items-center space-x-3 text-blue-400">
                <ShieldCheck size={18} strokeWidth={2.5} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Neural Network Secure</span>
             </div>
             <p className="text-[13px] text-white/70 leading-relaxed font-semibold">
               Sign up now to receive <span className="text-blue-400 font-black">1,000 Free Credits</span> to kickstart your first autonomous build.
             </p>
          </div>

          <button 
            onClick={handleGoogleLogin}
            className="group w-full bg-white text-black h-16 rounded-[2rem] font-black text-xs uppercase tracking-widest flex items-center justify-center space-x-3 hover:bg-white/90 active:scale-[0.98] transition-all shadow-xl shadow-white/5"
          >
            <img src="https://www.google.com/favicon.ico" alt="G" className="w-5 h-5" />
            <span>Continue with Google</span>
          </button>
          
          <p className="text-[10px] text-white/10 text-center font-bold uppercase tracking-widest">
            Manus Labs © 2025 • Enterprise Ready
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-md mx-auto bg-[#121212] relative flex flex-col font-sans overflow-hidden border-x border-white/5">
      {currentView === 'chat' ? (
        <ChatPage 
          onBack={() => setCurrentView('home')} 
          initialMessages={selectedProject?.messages || []}
          initialTitle={selectedProject?.title}
          credits={credits}
          onDeductCredits={deductCredits}
        />
      ) : (
        <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-bottom duration-700">
          <SettingsMenu 
            isOpen={isSettingsOpen} 
            onClose={() => setIsSettingsOpen(false)} 
            onAction={handleSettingAction}
            credits={credits}
            isLoggedIn={isLoggedIn}
            user={user}
          />

          <SkillsModal 
            isOpen={isSkillsOpen} 
            onClose={() => setIsSkillsOpen(false)} 
            onSkillClick={() => setCurrentView('chat')}
          />
          
          <ConnectorsModal 
            isOpen={isConnectorsOpen} 
            onClose={() => setIsConnectorsOpen(false)} 
          />

          <SubscriptionModal
            isOpen={isSubscriptionOpen}
            onClose={() => setIsSubscriptionOpen(false)}
            onPurchase={(amt) => {
              setCredits(prev => prev + amt);
              setIsSubscriptionOpen(false);
            }}
          />

          <Header 
            onProfileClick={() => setIsSettingsOpen(true)} 
            credits={credits}
            isLoggedIn={isLoggedIn}
          />

          <main className="flex-1 overflow-y-auto pb-32 no-scrollbar">
            {/* Search Bar */}
            <div className="px-6 pt-6 pb-2">
              <div className="relative bg-white/5 rounded-3xl border border-white/5 flex items-center px-5 py-4 group focus-within:border-white/20 transition-all shadow-inner">
                <input 
                  type="text" 
                  placeholder="Search your neural repository..." 
                  className="bg-transparent border-none outline-none w-full text-white placeholder:text-white/10 text-sm font-medium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Navigation Tabs */}
            <CategoryTabs 
              activeCategory={activeCategory} 
              onCategoryChange={setActiveCategory} 
            />

            {/* 1. Active Tasks Section */}
            {activeTasks.length > 0 && (
              <section className="mt-6">
                <div className="px-6 mb-3 flex items-center justify-between">
                  <h2 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.25em] flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
                    <span>Live Processes</span>
                  </h2>
                  <span className="text-[10px] font-bold text-white/10">{activeTasks.length} RUNNING</span>
                </div>
                <div className="space-y-1">
                  {activeTasks.map((project) => (
                    <div key={project.id} onClick={() => handleOpenProject(project)}>
                      <ProjectItem project={project} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 2. Project History Section */}
            <section className="mt-8">
              <div className="px-6 mb-3 flex items-center justify-between">
                <h2 className="text-[10px] font-black text-white/20 uppercase tracking-[0.25em] flex items-center space-x-2">
                   <FolderOpen size={10} />
                   <span>Neural History</span>
                </h2>
                <span className="text-[10px] font-bold text-white/10">{historyProjects.length} ARCHIVED</span>
              </div>
              {historyProjects.length > 0 ? (
                <div className="space-y-1">
                  {historyProjects.map((project) => (
                    <div key={project.id} onClick={() => handleOpenProject(project)}>
                      <ProjectItem project={project} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-6 py-8 border border-dashed border-white/5 mx-6 rounded-3xl flex flex-col items-center justify-center text-center space-y-2">
                   <Zap size={20} className="text-white/10" />
                   <p className="text-[11px] font-bold text-white/10 uppercase tracking-widest">No completed tasks</p>
                </div>
              )}
            </section>

            {/* 3. New Section: Templates & Drafts */}
            <section className="mt-8">
               <div className="px-6 mb-3 flex items-center justify-between">
                  <h2 className="text-[10px] font-black text-purple-400/50 uppercase tracking-[0.25em] flex items-center space-x-2">
                     <Box size={10} />
                     <span>Drafts & Templates</span>
                  </h2>
               </div>
               {draftsAndTemplates.length > 0 ? (
                 <div className="space-y-1">
                   {draftsAndTemplates.map((project) => (
                     <div key={project.id} onClick={() => handleOpenProject(project)}>
                       <ProjectItem project={project} />
                     </div>
                   ))}
                 </div>
               ) : (
                 <div className="px-6 py-6 mx-6 bg-white/[0.02] rounded-3xl border border-white/5 flex items-center justify-between group cursor-pointer hover:bg-white/5 transition-colors">
                    <div className="flex items-center space-x-4">
                       <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/20">
                          <Plus size={18} />
                       </div>
                       <div className="flex flex-col">
                          <span className="text-xs font-bold text-white/40">Initialize New Draft</span>
                          <span className="text-[10px] text-white/10 uppercase font-black">Ready for deployment</span>
                       </div>
                    </div>
                    <div className="text-[10px] font-black text-blue-500/50 uppercase tracking-widest">Empty</div>
                 </div>
               )}
            </section>
          </main>

          <FloatingButton onClick={handleNewChat} />
        </div>
      )}
    </div>
  );
};

export default App;
