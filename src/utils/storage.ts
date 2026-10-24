import { UserProgress, Badge, Language } from '../types';

const STORAGE_KEY = 'laramo_user_progress_v1';
const CLOUD_SYNC_KEY = 'laramo_cloud_synced_timestamp';

export const DEFAULT_BADGES: Badge[] = [
  { id: 'b_welcome', title: 'First Keystroke', description: 'Joined Laramo platform and started coding', icon: 'Sparkles', unlockedAt: new Date().toISOString() },
  { id: 'b_git', title: 'Git Initiate', description: 'Successfully completed the Git & GitHub push simulation', icon: 'GitBranch' },
  { id: 'b_algo', title: 'DSA Navigator', description: 'Explored algorithm steps in the DSA visualizer', icon: 'Cpu' },
  { id: 'b_streak', title: 'Week Warrior', description: 'Maintained a 7-day coding streak', icon: 'Flame' },
  { id: 'b_master', title: 'Multi-Lingual Dev', description: 'Ran code in 3 or more programming languages', icon: 'Layers' }
];

export const INITIAL_PROGRESS: UserProgress = {
  userId: 'laramo-student-01',
  username: 'Mark Coder',
  avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=LaramoStudent',
  university: 'PUP Sta. Mesa (CCIS)',
  level: 1,
  xp: 150,
  streak: 3,
  lastActiveDate: new Date().toISOString().split('T')[0],
  solvedChallengeIds: ['ch-2'],
  activeStudyPlanId: 'plan-cs-foundation',
  completedPlanItemIds: ['cs-1'],
  savedCode: {},
  gitTutorialProgress: 35,
  badges: DEFAULT_BADGES
};

export function loadUserProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveUserProgress(INITIAL_PROGRESS);
      return INITIAL_PROGRESS;
    }
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_PROGRESS,
      ...parsed
    };
  } catch {
    return INITIAL_PROGRESS;
  }
}

export function saveUserProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (err) {
    console.error('Failed to save to local storage', err);
  }
}

export function getLastCloudSyncTime(): string | null {
  return localStorage.getItem(CLOUD_SYNC_KEY) || new Date().toISOString();
}

export function markCloudSyncNow(): string {
  const now = new Date().toISOString();
  localStorage.setItem(CLOUD_SYNC_KEY, now);
  return now;
}

export function calculateLevel(xp: number): { level: number; currentXp: number; nextLevelXp: number; progressPercent: number; title: string } {
  const levels = [
    { level: 1, xp: 0, title: 'Novice Coder' },
    { level: 2, xp: 200, title: 'Apprentice Dev' },
    { level: 3, xp: 500, title: 'Junior Programmer' },
    { level: 4, xp: 900, title: 'Algorithm Specialist' },
    { level: 5, xp: 1400, title: 'Full-Stack Craftsman' },
    { level: 6, xp: 2100, title: 'Systems Architect' },
    { level: 7, xp: 3000, title: 'Staff Engineer' },
    { level: 8, xp: 4200, title: 'Principal Technologist' },
    { level: 9, xp: 6000, title: 'Laramo Fellow' },
    { level: 10, xp: 8500, title: 'Grandmaster' }
  ];

  let current = levels[0];
  let next = levels[1];

  for (let i = levels.length - 1; i >= 0; i--) {
    if (xp >= levels[i].xp) {
      current = levels[i];
      next = levels[i + 1] || { level: 10, xp: 10000, title: 'Grandmaster' };
      break;
    }
  }

  const range = next.xp - current.xp;
  const earned = xp - current.xp;
  const progressPercent = Math.min(100, Math.max(0, Math.round((earned / (range || 1)) * 100)));

  return {
    level: current.level,
    currentXp: xp,
    nextLevelXp: next.xp,
    progressPercent,
    title: current.title
  };
}

export function exportProgressToJson(progress: UserProgress): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(progress, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `laramo_backup_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function downloadCodeSnippet(filename: string, code: string): void {
  const dataStr = 'data:text/plain;charset=utf-8,' + encodeURIComponent(code);
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', filename);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
