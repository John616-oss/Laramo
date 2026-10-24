import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Flame, 
  Award, 
  ShieldCheck, 
  Users, 
  UserPlus, 
  X,
  CheckCircle2
} from 'lucide-react';
import { UserProgress, LeaderboardUser } from '../types';
import { getRegisteredCoders, addPeerCoder } from '../data/leaderboardData';
import { AppLanguage, TRANSLATIONS } from '../utils/i18n';

interface LeaderboardViewProps {
  userProgress: UserProgress;
  currentLanguage?: AppLanguage;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ 
  userProgress,
  currentLanguage = 'en'
}) => {
  const [activeTab, setActiveTab] = useState<'individual' | 'universities' | 'badges'>('individual');
  const [peers, setPeers] = useState<LeaderboardUser[]>([]);
  const [isAddPeerOpen, setIsAddPeerOpen] = useState(false);
  const [newPeerName, setNewPeerName] = useState('');
  const [newPeerUni, setNewPeerUni] = useState('');
  const [newPeerXp, setNewPeerXp] = useState('100');

  const t = TRANSLATIONS[currentLanguage].leaderboard;
  const tc = TRANSLATIONS[currentLanguage].common;

  useEffect(() => {
    setPeers(getRegisteredCoders());
  }, []);

  // Compute currentUser entry
  const currentUserEntry: LeaderboardUser = {
    rank: 1,
    id: userProgress.userId,
    name: `${userProgress.username} (${currentLanguage === 'en' ? 'You' : 'Ikaw'})`,
    university: userProgress.university,
    avatar: userProgress.avatar,
    xp: userProgress.xp,
    solvedCount: userProgress.solvedChallengeIds.length,
    streak: userProgress.streak,
    league: (userProgress.xp > 6000 ? 'Grandmaster' : userProgress.xp > 3000 ? 'Diamond' : userProgress.xp > 1000 ? 'Gold' : 'Silver') as LeaderboardUser['league'],
    isCurrentUser: true
  };

  // Combine real users only: currentUser + registered peers (prevent duplicates)
  const otherPeers = peers.filter(p => p.id !== userProgress.userId && p.name.toLowerCase() !== userProgress.username.toLowerCase());
  const allRealUsers: LeaderboardUser[] = [currentUserEntry, ...otherPeers]
    .sort((a, b) => b.xp - a.xp)
    .map((u, idx) => ({ ...u, rank: idx + 1 }));

  // Aggregate real universities based on actual registered users
  const uniMap = new Map<string, { activeCoders: number; totalProblemsSolved: number; campusScore: number }>();
  allRealUsers.forEach(u => {
    const uni = u.university || (currentLanguage === 'en' ? 'Independent / Self-Taught' : 'Indibidwal / Sariling Sikap');
    const existing = uniMap.get(uni) || { activeCoders: 0, totalProblemsSolved: 0, campusScore: 0 };
    uniMap.set(uni, {
      activeCoders: existing.activeCoders + 1,
      totalProblemsSolved: existing.totalProblemsSolved + u.solvedCount,
      campusScore: existing.campusScore + u.xp
    });
  });

  const universityRankings = Array.from(uniMap.entries())
    .map(([name, stats], idx) => ({
      rank: idx + 1,
      name,
      ...stats
    }))
    .sort((a, b) => b.campusScore - a.campusScore)
    .map((u, idx) => ({ ...u, rank: idx + 1 }));

  const handleAddPeer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPeerName.trim()) return;

    const peerXpNum = parseInt(newPeerXp, 10) || 0;
    const newPeer: LeaderboardUser = {
      rank: allRealUsers.length + 1,
      id: `peer-${Date.now()}`,
      name: newPeerName.trim(),
      university: newPeerUni.trim() || (currentLanguage === 'en' ? 'IT College Student' : 'Estudyante ng IT'),
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(newPeerName)}`,
      xp: peerXpNum,
      solvedCount: Math.max(1, Math.floor(peerXpNum / 100)),
      streak: 1,
      league: peerXpNum > 3000 ? 'Diamond' : peerXpNum > 1000 ? 'Gold' : 'Bronze',
      isCurrentUser: false
    };

    const updated = addPeerCoder(newPeer);
    setPeers(updated);
    setNewPeerName('');
    setNewPeerUni('');
    setNewPeerXp('100');
    setIsAddPeerOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-500">
            <Trophy className="w-4 h-4" />
            <span>{currentLanguage === 'en' ? 'Accurate Live Leaderboard & Academic Hall of Fame' : 'Tumpak na Live Leaderboard at Academic Hall of Fame'}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* View Switcher Tabs & Add Peer Button */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-medium">
            <button
              onClick={() => setActiveTab('individual')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'individual'
                  ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t.tabIndividual} ({allRealUsers.length})
            </button>
            <button
              onClick={() => setActiveTab('universities')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'universities'
                  ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t.tabUniversities} ({universityRankings.length})
            </button>
            <button
              onClick={() => setActiveTab('badges')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'badges'
                  ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t.tabBadges}
            </button>
          </div>

          <button
            onClick={() => setIsAddPeerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition-colors shadow-sm cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{t.addPeerBtn}</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Individual Coders Leaderboard */}
      {activeTab === 'individual' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <span>
              {currentLanguage === 'en' 
                ? 'Rankings computed directly from verified XP and solved coding challenges' 
                : 'Tumpak na ranggo batay sa aktwal na XP at nasagutang mga challenge'}
            </span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
              {allRealUsers.length} {currentLanguage === 'en' ? 'Verified Registered Coders' : 'Totoong Rehistradong Coder'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold bg-slate-50/50 dark:bg-slate-950/50">
                  <th className="py-3 px-4 w-16 text-center">{t.rankCol}</th>
                  <th className="py-3 px-4">{t.coderCol}</th>
                  <th className="py-3 px-4 hidden md:table-cell">{t.universityCol}</th>
                  <th className="py-3 px-4 text-center">{t.solvedCol}</th>
                  <th className="py-3 px-4 text-center">{t.streakCol}</th>
                  <th className="py-3 px-4 text-right">{t.xpCol}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {allRealUsers.map((user) => {
                  return (
                    <tr
                      key={user.id}
                      className={`transition-colors ${
                        user.isCurrentUser
                          ? 'bg-emerald-50/80 dark:bg-emerald-950/40 font-semibold'
                          : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      {/* Rank column */}
                      <td className="py-3.5 px-4 text-center font-mono">
                        {user.rank === 1 ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-bold text-xs shadow-xs">1</span>
                        ) : user.rank === 2 ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-300 text-slate-950 font-bold text-xs">2</span>
                        ) : user.rank === 3 ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-700 text-white font-bold text-xs">3</span>
                        ) : (
                          <span className="text-slate-500">{user.rank}</span>
                        )}
                      </td>

                      {/* Name and avatar */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            referrerPolicy="no-referrer"
                            className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0"
                          />
                          <div>
                            <div className="font-medium text-slate-900 dark:text-white flex items-center gap-1.5">
                              <span>{user.name}</span>
                              {user.isCurrentUser && (
                                <span className="px-1.5 py-0.2 text-[10px] bg-emerald-600 text-white rounded">YOU</span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 md:hidden truncate max-w-[180px]">
                              {user.university}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* University column */}
                      <td className="py-3.5 px-4 hidden md:table-cell text-slate-600 dark:text-slate-300">
                        {user.university}
                      </td>

                      {/* Solved column */}
                      <td className="py-3.5 px-4 text-center font-mono tabular-nums text-slate-700 dark:text-slate-300">
                        {user.solvedCount}
                      </td>

                      {/* Streak column */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 text-amber-500 font-mono font-medium">
                          <Flame className="w-3.5 h-3.5 fill-current" />
                          <span className="tabular-nums">{user.streak}d</span>
                        </span>
                      </td>

                      {/* XP column */}
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                        {user.xp.toLocaleString()} XP
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {peers.length === 0 && (
            <div className="p-6 bg-slate-50/50 dark:bg-slate-950/30 text-center space-y-2 border-t border-slate-100 dark:border-slate-800">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {currentLanguage === 'en' ? 'You hold the #1 Rank!' : 'Ikaw ang kasalukuyang Rank #1!'}
              </div>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {currentLanguage === 'en'
                  ? 'No artificial bot accounts. If you want to benchmark against your campus classmates or peers, click "+ Add Peer / Classmate".'
                  : 'Walang gawa-gawang bots. Kung nais mong makipagpaligsahan sa iyong mga kaklase o study group sa campus, i-click ang "+ Magdagdag ng Kaklase".'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: University Rankings */}
      {activeTab === 'universities' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {universityRankings.map((uni) => (
              <div
                key={uni.name}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
                      #{uni.rank}
                    </span>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        {uni.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" /> {uni.activeCoders} {currentLanguage === 'en' ? 'active students' : 'aktibong estudyante'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="font-mono text-xs font-bold text-slate-900 dark:text-white tabular-nums bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded">
                    {uni.campusScore.toLocaleString()} pts
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                  <span>{currentLanguage === 'en' ? 'Total problems solved:' : 'Kabuuang nasagutang problems:'}</span>
                  <span className="font-mono font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
                    {uni.totalProblemsSolved}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {universityRankings.length <= 1 && (
            <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center text-xs text-slate-500">
              {currentLanguage === 'en'
                ? 'This ranking reflects genuine schools and universities from students registered on this instance.'
                : 'Ang listahang ito ay binubuo lamang ng mga unibersidad kung saan nanggaling ang aktwal na mga rehistradong coder sa app.'}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Badges and Achievements */}
      {activeTab === 'badges' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {currentLanguage === 'en' ? 'Student Badges & Achievements' : 'Mga Badge at Parangal ng Estudyante'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentLanguage === 'en' 
                ? 'Unlock special accolades by solving problems, mastering algorithms, and completing Git version control workflows.'
                : 'I-unlock ang mga parangal sa pamamagitan ng paglutas ng mga hamon, pag-unawa sa algorithms, at pagsasanay sa Git.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {userProgress.badges.map((badge) => {
              const isUnlocked = Boolean(badge.unlockedAt);
              return (
                <div
                  key={badge.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isUnlocked
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                      : 'bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      isUnlocked 
                        ? 'bg-emerald-600 text-white shadow-sm' 
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                    }`}>
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>{badge.title}</span>
                        {isUnlocked && <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />}
                      </div>
                      <div className="text-xs text-slate-500 leading-snug mt-0.5">
                        {badge.description}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800/80 text-[11px] text-slate-400 font-mono">
                    {isUnlocked 
                      ? (currentLanguage === 'en' ? `Unlocked on ${new Date(badge.unlockedAt!).toLocaleDateString()}` : `Na-unlock noong ${new Date(badge.unlockedAt!).toLocaleDateString()}`) 
                      : (currentLanguage === 'en' ? 'Locked — Complete challenges to unlock' : 'Naka-lock — Sagutan ang mga hamon para ma-unlock')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal: Add Classmate / Peer */}
      {isAddPeerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-500" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {t.addPeerModalTitle}
                </h3>
              </div>
              <button
                onClick={() => setIsAddPeerOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddPeer} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                  {t.peerName}
                </label>
                <input
                  type="text"
                  required
                  placeholder={currentLanguage === 'en' ? 'e.g. Maria Santos' : 'Hal. Maria Santos'}
                  value={newPeerName}
                  onChange={(e) => setNewPeerName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                  {t.peerUni}
                </label>
                <input
                  type="text"
                  placeholder={currentLanguage === 'en' ? 'e.g. CCST, PUP Sta. Mesa, UP Diliman, TIP, UST' : 'Hal. CCST, PUP Sta. Mesa, UP Diliman, TIP, UST'}
                  value={newPeerUni}
                  onChange={(e) => setNewPeerUni(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                  {t.peerXp}
                </label>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={newPeerXp}
                  onChange={(e) => setNewPeerXp(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddPeerOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  {tc.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-xs cursor-pointer"
                >
                  {t.savePeer}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
