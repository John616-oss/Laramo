import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Lock, 
  Mail, 
  User, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Code2, 
  Cpu, 
  GitBranch, 
  Trophy,
  Moon,
  Sun,
  ShieldCheck,
  Globe
} from 'lucide-react';
import { UserAccount } from '../types';
import { registerAccount, loginAccount } from '../utils/auth';
import { AppLanguage, TRANSLATIONS, setStoredLanguage } from '../utils/i18n';

interface AuthGateProps {
  onAuthSuccess: (account: UserAccount) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  currentLanguage: AppLanguage;
  setCurrentLanguage: (lang: AppLanguage) => void;
}

const AVATAR_SEEDS = [
  'JuanDev',
  'CodeNinja',
  'CyberStudent',
  'AlgorithmQueen',
  'Rustacean',
  'PinoyHacker'
];

const PHILIPPINE_UNIVERSITIES = [
  'CCST (Clark College of Science and Technology)',
  'Polytechnic University of the Philippines (PUP)',
  'University of the Philippines (UP Diliman / System)',
  'Technological Institute of the Philippines (TIP)',
  'University of Santo Tomas (UST)',
  'De La Salle University (DLSU)',
  'Mapúa University',
  'FEU Institute of Technology',
  'Ateneo de Manila University',
  'Bulacan State University (BulSU)',
  'Technological University of the Philippines (TUP)',
  'Other / Self-Taught Developer'
];

export const AuthGate: React.FC<AuthGateProps> = ({
  onAuthSuccess,
  isDarkMode,
  setIsDarkMode,
  currentLanguage,
  setCurrentLanguage
}) => {
  const t = TRANSLATIONS[currentLanguage].auth;
  const tc = TRANSLATIONS[currentLanguage].common;

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Login Form States
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Form States
  const [regFullName, setRegFullName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regUniversity, setRegUniversity] = useState(PHILIPPINE_UNIVERSITIES[0]);
  const [regMajor, setRegMajor] = useState('BS Information Technology');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [selectedAvatarSeed, setSelectedAvatarSeed] = useState(AVATAR_SEEDS[0]);

  const handleToggleLanguage = () => {
    const nextLang = currentLanguage === 'en' ? 'fil' : 'en';
    setCurrentLanguage(nextLang);
    setStoredLanguage(nextLang);
    setErrorMsg(null);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const result = loginAccount(loginIdentifier, loginPassword, currentLanguage);
    if (result.success && result.account) {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      onAuthSuccess(result.account);
    } else {
      setErrorMsg(result.error || t.authFailed);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (regPassword.length < 4) {
      setErrorMsg(t.passMinLength);
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMsg(t.passMismatch);
      return;
    }

    const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${selectedAvatarSeed}`;

    const result = registerAccount({
      username: regUsername,
      email: regEmail,
      fullName: regFullName,
      university: regUniversity,
      major: regMajor,
      password: regPassword,
      avatar: avatarUrl
    }, currentLanguage);

    if (result.success && result.account) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      onAuthSuccess(result.account);
    } else {
      setErrorMsg(result.error || t.authFailed);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans transition-colors duration-200">
      {/* Background Subtle Gradient & Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/10 via-slate-100 to-slate-200 dark:from-emerald-900/20 dark:via-slate-950 dark:to-slate-950 -z-10" />

      {/* Top Bar on Gateway */}
      <header className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm font-bold text-base tracking-tighter">
            L_
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white font-sans">
            Laramo
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <button
            onClick={handleToggleLanguage}
            title={currentLanguage === 'en' ? 'Lumipat sa Filipino' : 'Switch to English'}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors bg-white/60 dark:bg-slate-900/60 shadow-xs text-xs font-semibold cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{currentLanguage === 'en' ? 'EN' : 'FIL'}</span>
            <span className="text-[10px] text-slate-400 font-normal hidden sm:inline">
              ({currentLanguage === 'en' ? 'English' : 'Filipino'})
            </span>
          </button>

          {/* Theme Switcher */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            aria-label="Toggle Theme"
            className="p-2 rounded-lg border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors bg-white/60 dark:bg-slate-900/60 shadow-xs cursor-pointer"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
        </div>
      </header>

      {/* Main Split Authentication Stage */}
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
          {/* Left Column: Visual Introduction & Features (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t.gatewayBadge}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                {t.heroTitle}
              </h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                {t.heroSubtitle}
              </p>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2 max-w-xl text-xs">
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/60 shadow-xs space-y-1">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <Code2 className="w-4 h-4" />
                  <span>{t.features.languagesTitle}</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                  {t.features.languagesDesc}
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/60 shadow-xs space-y-1">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold">
                  <Cpu className="w-4 h-4" />
                  <span>{t.features.dsaTitle}</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                  {t.features.dsaDesc}
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/60 shadow-xs space-y-1">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold">
                  <GitBranch className="w-4 h-4" />
                  <span>{t.features.gitTitle}</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                  {t.features.gitDesc}
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/60 shadow-xs space-y-1">
                <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-semibold">
                  <Trophy className="w-4 h-4" />
                  <span>{t.features.rankingTitle}</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                  {t.features.rankingDesc}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Authentication Card (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xl space-y-5">
              {/* Tab Selector: Login vs Register */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMsg(null);
                  }}
                  className={`flex-1 py-2 rounded-lg text-center transition-colors cursor-pointer ${
                    mode === 'login'
                      ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {t.tabLogin}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMsg(null);
                  }}
                  className={`flex-1 py-2 rounded-lg text-center transition-colors cursor-pointer ${
                    mode === 'register'
                      ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {t.tabRegister}
                </button>
              </div>

              {/* Error Alert */}
              {errorMsg && (
                <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Form 1: LOGIN */}
              {mode === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                      {t.usernameOrEmail}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder={t.usernameOrEmailPlaceholder}
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        className="w-full pl-8 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder:text-slate-400 dark:placeholder:text-slate-600"
                      />
                      <User className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-2.5 top-3.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                      {t.password}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder={t.passwordPlaceholder}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full pl-8 pr-8 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder:text-slate-400 dark:placeholder:text-slate-600"
                      />
                      <Lock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-2.5 top-3.5" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-colors shadow-sm mt-1 text-xs cursor-pointer"
                  >
                    {t.loginBtn}
                  </button>

                  {/* Security Guarantee Notice */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-[11px] space-y-1.5 text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                        <ShieldCheck className="w-4 h-4 shrink-0" />
                        <span>{t.securityTitle}</span>
                      </div>
                      <p className="leading-relaxed">
                        {t.securityDesc}
                      </p>
                    </div>
                  </div>
                </form>
              )}

              {/* Form 2: REGISTER */}
              {mode === 'register' && (
                <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs max-h-[460px] overflow-y-auto pr-1">
                  {/* Avatar Picker */}
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                      {t.avatarPicker}
                    </label>
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                      {AVATAR_SEEDS.map((seed) => {
                        const isSelected = selectedAvatarSeed === seed;
                        return (
                          <button
                            key={seed}
                            type="button"
                            onClick={() => setSelectedAvatarSeed(seed)}
                            className={`p-1 rounded-xl border-2 transition-all shrink-0 cursor-pointer ${
                              isSelected
                                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 scale-105'
                                : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600'
                            }`}
                          >
                            <img
                              src={`https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`}
                              alt={seed}
                              className="w-8 h-8 rounded-lg"
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                        {t.fullName}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={t.fullNamePlaceholder}
                        value={regFullName}
                        onChange={(e) => setRegFullName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder:text-slate-400 dark:placeholder:text-slate-600"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                        {t.username}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={t.usernamePlaceholder}
                        value={regUsername}
                        onChange={(e) => setRegUsername(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder:text-slate-400 dark:placeholder:text-slate-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                      {t.studentEmail}
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        placeholder={t.studentEmailPlaceholder}
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder:text-slate-400 dark:placeholder:text-slate-600"
                      />
                      <Mail className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-2.5 top-3" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                        {t.university}
                      </label>
                      <select
                        value={regUniversity}
                        onChange={(e) => setRegUniversity(e.target.value)}
                        className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      >
                        {PHILIPPINE_UNIVERSITIES.map((u) => (
                          <option key={u} value={u}>{u}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                        {t.major}
                      </label>
                      <input
                        type="text"
                        placeholder={t.majorPlaceholder}
                        value={regMajor}
                        onChange={(e) => setRegMajor(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder:text-slate-400 dark:placeholder:text-slate-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                        {t.password}
                      </label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Min. 4 chars"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder:text-slate-400 dark:placeholder:text-slate-600"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                        {t.confirmPassword}
                      </label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder={t.confirmPasswordPlaceholder}
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder:text-slate-400 dark:placeholder:text-slate-600"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-colors shadow-sm mt-2 text-xs cursor-pointer"
                  >
                    {t.registerBtn}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 text-center text-xs text-slate-500 dark:text-slate-400">
        {t.footerNotice}
      </footer>
    </div>
  );
};
