
export type ProjectStatus = 'completed' | 'pending' | 'failed';

export interface Project {
  id: string;
  title: string;
  description: string;
  date: string;
  icon: 'game' | 'chart';
  isDashedIcon?: boolean;
  category: Category;
  status?: ProjectStatus;
  progress?: number;
  messages?: ChatMessage[];
}

export type Category = 'All' | 'Favorites' | 'Scheduled';

export interface AgentStep {
  id: string;
  type: 'plan' | 'search' | 'code' | 'action' | 'website' | 'mobile_app';
  label: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  steps?: AgentStep[];
  websiteCode?: string;
  mobileAppData?: {
    platform: 'React Native' | 'Flutter';
    code: string;
    description: string;
  };
}
