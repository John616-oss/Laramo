import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Navbar } from './components/Navbar';
import { MobileNav } from './components/MobileNav';
import { ChallengeWorkspace } from './components/ChallengeWorkspace';
import { DSAVisualizer } from './components/DSAVisualizer';
import { StudyPlanView } from './components/StudyPlanView';
import { VSCodeStudio } from './components/VSCodeStudio';
import { LeaderboardView } from './components/LeaderboardView';
import { CloudSyncModal } from './components/CloudSyncModal';
import { AuthModal } from './components/AuthModal';
import { AuthGate } from './components/AuthGate';
import { UserProgress, UserAccount } from './types';
import { loadUserProgress, saveUserProgress, INITIAL_PROGRESS } from './utils/storage';
import { 
  getActiveAccount, 
  logoutAccount, 
  syncAccountProgress
} from './utils/auth';
import { AppLanguage, getStoredLanguage, setStoredLanguage, TRANSLATIONS } from './utils/i18n';

export default function App() {
  const [activeTab, setActiveTab] = useState<'challenges' | 'dsa' | 'study-plan' | 'vscode-git' | 'leaderboard'>('challenges');
  
  // App language state (defaults to 'en')
  const [currentLanguage, setCurrentLanguage] = useState<AppLanguage>(() => {
    return getStoredLanguage();
  });

  // Strictly require user login/registration before accessing the platform
  const [currentAccount, setCurrentAccount] = useState<UserAccount | null>(() => {
    return getActiveAccount();
  });

  const [userProgress, setUserProgress] = useState<UserProgress>(() => {
    if (currentAccount?.progress) return currentAccount.progress;
    return loadUserProgress();
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('laramo_theme');
    if (saved) return saved === 'dark';
    return true; // Default to dark mode for developer / programmer aesthetic
  });

  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(!navigator.onLine);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [jumpChallengeId, setJumpChallengeId] = useState<string | undefined>(undefined);

  // Sync theme to DOM
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('laramo_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('laramo_theme', 'light');
    }
  }, [isDarkMode]);

  // Monitor browser network status
  useEffect(() => {
    const handleOnline = () => setIsSimulatedOffline(false);
    const handleOffline = () => setIsSimulatedOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleUpdateLanguage = (lang: AppLanguage) => {
    setCurrentLanguage(lang);
    setStoredLanguage(lang);
  };

  const handleUpdateProgress = (updated: UserProgress) => {
    setUserProgress(updated);
    saveUserProgress(updated);
    if (currentAccount) {
      syncAccountProgress(currentAccount.id, updated);
      setCurrentAccount(prev => prev ? { ...prev, progress: updated } : null);
    }
  };

  const handleNavigateToChallenge = (challengeId: string) => {
    setJumpChallengeId(challengeId);
    setActiveTab('challenges');
  };

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (account: UserAccount) => {
    setCurrentAccount(account);
    setUserProgress(account.progress);
    saveUserProgress(account.progress);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleLogout = () => {
    logoutAccount();
    setCurrentAccount(null);
    setUserProgress(INITIAL_PROGRESS);
  };

  // GATE: If user is not logged in, block app and show AuthGate
  if (!currentAccount) {
    return (
      <AuthGate
        onAuthSuccess={handleAuthSuccess}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        currentLanguage={currentLanguage}
        setCurrentLanguage={handleUpdateLanguage}
      />
    );
  }

  const tc = TRANSLATIONS[currentLanguage].common;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userProgress={userProgress}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        isOffline={isSimulatedOffline}
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
        onOpenAuthModal={handleOpenAuth}
        onLogout={handleLogout}
        isLoggedIn={Boolean(currentAccount)}
        currentLanguage={currentLanguage}
        setCurrentLanguage={handleUpdateLanguage}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-20 md:pb-12">
        {activeTab === 'challenges' && (
          <ChallengeWorkspace
            userProgress={userProgress}
            onUpdateProgress={handleUpdateProgress}
            initialChallengeId={jumpChallengeId}
          />
        )}

        {activeTab === 'dsa' && (
          <DSAVisualizer />
        )}

        {activeTab === 'study-plan' && (
          <StudyPlanView
            userProgress={userProgress}
            onUpdateProgress={handleUpdateProgress}
            onNavigateToChallenge={handleNavigateToChallenge}
          />
        )}

        {activeTab === 'vscode-git' && (
          <VSCodeStudio
            userProgress={userProgress}
            onUpdateProgress={handleUpdateProgress}
          />
        )}

        {activeTab === 'leaderboard' && (
          <LeaderboardView
            userProgress={userProgress}
            currentLanguage={currentLanguage}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Cloud Sync & Offline Modal */}
      <CloudSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        userProgress={userProgress}
        onUpdateProgress={handleUpdateProgress}
        isSimulatedOffline={isSimulatedOffline}
        setIsSimulatedOffline={setIsSimulatedOffline}
      />

      {/* Switch Account Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        initialMode={authModalMode}
        currentLanguage={currentLanguage}
      />

      {/* Developer Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 bg-white/50 dark:bg-slate-950/50 hidden md:block">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 dark:text-slate-300">Laramo</span>
            <span>·</span>
            <span>{tc.tagline}</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>{currentLanguage === 'en' ? '12 Languages Supported (HTML, CSS, JavaScript, PHP, Python, C++, Java, C#, Go, Rust, TS, SQL)' : '12 Lengguwahe (HTML, CSS, JavaScript, PHP, Python, C++, Java, C#, Go, Rust, TS, SQL)'}</span>
            <span>·</span>
            <span>{currentLanguage === 'en' ? 'Local-First, Offline-Ready & Cloud Synchronized' : 'Offline-Ready at Naka-sync sa Cloud'}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
