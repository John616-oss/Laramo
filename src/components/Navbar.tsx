import React, { useState, useRef, useEffect } from 'react';
import { 
  Cloud, 
  CloudOff, 
  Moon, 
  Sun, 
  Flame, 
  Zap, 
  User, 
  UserPlus, 
  LogOut, 
  ChevronDown,
  ShieldCheck,
  Globe
} from 'lucide-react';
import { UserProgress } from '../types';
import { AppLanguage, TRANSLATIONS, setStoredLanguage } from '../utils/i18n';

interface NavbarProps {
  activeTab: 'challenges' | 'dsa' | 'study-plan' | 'vscode-git' | 'leaderboard';
  setActiveTab: (tab: 'challenges' | 'dsa' | 'study-plan' | 'vscode-git' | 'leaderboard') => void;
  userProgress: UserProgress;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  isOffline: boolean;
  onOpenSyncModal: () => void;
  onOpenAuthModal: (mode: 'login' | 'register') => void;
  onLogout: () => void;
  isLoggedIn: boolean;
  currentLanguage: AppLanguage;
  setCurrentLanguage: (lang: AppLanguage) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userProgress,
  isDarkMode,
  setIsDarkMode,
  isOffline,
  onOpenSyncModal,
  onOpenAuthModal,
  onLogout,
  isLoggedIn,
  currentLanguage,
  setCurrentLanguage
}) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const t = TRANSLATIONS[currentLanguage].nav;
  const tc = TRANSLATIONS[currentLanguage].common;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleLanguage = () => {
    const next = currentLanguage === 'en' ? 'fil' : 'en';
    setCurrentLanguage(next);
    setStoredLanguage(next);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => setActiveTab('challenges')}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm font-bold text-base tracking-tighter">
              L_
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white font-sans">
              Laramo
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => setActiveTab('challenges')}
            className={`whitespace-nowrap transition-colors py-1 cursor-pointer ${
              activeTab === 'challenges'
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold border-b-2 border-emerald-600 dark:border-emerald-400'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t.challenges}
          </button>

          <button
            onClick={() => setActiveTab('dsa')}
            className={`whitespace-nowrap transition-colors py-1 cursor-pointer ${
              activeTab === 'dsa'
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold border-b-2 border-emerald-600 dark:border-emerald-400'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t.dsa}
          </button>

          <button
            onClick={() => setActiveTab('study-plan')}
            className={`whitespace-nowrap transition-colors py-1 cursor-pointer ${
              activeTab === 'study-plan'
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold border-b-2 border-emerald-600 dark:border-emerald-400'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t.roadmap}
          </button>

          <button
            onClick={() => setActiveTab('vscode-git')}
            className={`whitespace-nowrap transition-colors py-1 cursor-pointer ${
              activeTab === 'vscode-git'
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold border-b-2 border-emerald-600 dark:border-emerald-400'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t.vscodeGit}
          </button>

          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`whitespace-nowrap transition-colors py-1 cursor-pointer ${
              activeTab === 'leaderboard'
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold border-b-2 border-emerald-600 dark:border-emerald-400'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t.leaderboard}
          </button>
        </nav>

        {/* Zone 3: Controls & Account Profile */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* User Streak & Level */}
          <div className="hidden lg:flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300 mr-1">
            <span className="flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span className="tabular-nums">{userProgress.streak}{tc.dayStreak}</span>
            </span>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
            <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
              <Zap className="w-3.5 h-3.5" />
              <span className="tabular-nums">{userProgress.xp} XP</span>
            </span>
          </div>

          {/* Language Switcher Button */}
          <button
            onClick={handleToggleLanguage}
            title={currentLanguage === 'en' ? 'Lumipat sa Filipino' : 'Switch to English'}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{currentLanguage === 'en' ? 'EN' : 'FIL'}</span>
          </button>

          {/* Cloud Sync & Offline Status Trigger */}
          <button
            onClick={onOpenSyncModal}
            title={isOffline ? t.offlineTooltip : t.syncTooltip}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors whitespace-nowrap cursor-pointer"
          >
            {isOffline ? (
              <>
                <CloudOff className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline">{tc.offline}</span>
              </>
            ) : (
              <>
                <Cloud className="w-3.5 h-3.5 text-emerald-500" />
                <span className="hidden sm:inline">{tc.sync}</span>
              </>
            )}
          </button>

          {/* Theme Switcher */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            aria-label="Toggle Dark and Light theme"
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* User Account / Profile Dropdown */}
          <div className="relative" ref={menuRef}>
            {isLoggedIn ? (
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors text-xs font-medium cursor-pointer"
              >
                <img
                  src={userProgress.avatar}
                  alt={userProgress.username}
                  className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800"
                />
                <span className="hidden sm:inline text-slate-800 dark:text-slate-200 max-w-[80px] truncate">
                  {userProgress.username}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onOpenAuthModal('login')}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  {t.login}
                </button>
                <button
                  onClick={() => onOpenAuthModal('register')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shadow-xs transition-colors cursor-pointer"
                >
                  {t.signUp}
                </button>
              </div>
            )}

            {/* Profile Dropdown Menu */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-3 space-y-2.5 z-50 text-xs">
                {/* Profile summary */}
                <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100 dark:border-slate-800">
                  <img
                    src={userProgress.avatar}
                    alt={userProgress.username}
                    className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0"
                  />
                  <div className="truncate">
                    <div className="font-bold text-slate-900 dark:text-white truncate">
                      {userProgress.username}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {userProgress.university}
                    </div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-semibold">
                      {tc.level} {userProgress.level} · {userProgress.xp} XP
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setActiveTab('study-plan');
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors text-left cursor-pointer"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    <span>{t.myProfile}</span>
                  </button>

                  <button
                    onClick={() => {
                      onOpenAuthModal('login');
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors text-left cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4 text-slate-400" />
                    <span>{t.switchAccount}</span>
                  </button>

                  <div className="px-2 py-1.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 flex items-center gap-1.5 text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    <span>{tc.protectedBadge}</span>
                  </div>

                  <button
                    onClick={() => {
                      onLogout();
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 transition-colors text-left font-medium cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t.logout}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
