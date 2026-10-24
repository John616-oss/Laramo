import React from 'react';
import { Terminal, Cpu, BookOpen, GitBranch, Trophy } from 'lucide-react';

interface MobileNavProps {
  activeTab: 'challenges' | 'dsa' | 'study-plan' | 'vscode-git' | 'leaderboard';
  setActiveTab: (tab: 'challenges' | 'dsa' | 'study-plan' | 'vscode-git' | 'leaderboard') => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'challenges' as const, label: 'Code', icon: Terminal },
    { id: 'dsa' as const, label: 'DSA', icon: Cpu },
    { id: 'study-plan' as const, label: 'Plan', icon: BookOpen },
    { id: 'vscode-git' as const, label: 'VS & Git', icon: GitBranch },
    { id: 'leaderboard' as const, label: 'Rank', icon: Trophy },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 border-t border-slate-200 dark:border-slate-800 backdrop-blur-md px-2 py-1.5 flex items-center justify-around safe-bottom">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-xs font-medium transition-colors ${
              isActive
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="truncate max-w-[56px]">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
