import { UserAccount, UserProgress, LeaderboardUser } from '../types';
import { INITIAL_PROGRESS, DEFAULT_BADGES } from './storage';
import { saveRegisteredCoders, getRegisteredCoders } from '../data/leaderboardData';

const ACCOUNTS_STORAGE_KEY = 'laramo_accounts_v1';
const SESSION_KEY = 'laramo_session_user_id_v1';

export function getAllAccounts(): UserAccount[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveAllAccounts(accounts: UserAccount[]): void {
  try {
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
    // Also sync to registered coders for the leaderboard
    const coders = accounts.map((acc, idx) => ({
      rank: idx + 1,
      id: acc.id,
      name: acc.fullName || acc.username,
      university: acc.university || 'IT College Student',
      avatar: acc.avatar,
      xp: acc.progress.xp,
      solvedCount: acc.progress.solvedChallengeIds.length,
      streak: acc.progress.streak,
      league: (acc.progress.xp > 6000 ? 'Grandmaster' : acc.progress.xp > 3000 ? 'Diamond' : acc.progress.xp > 1000 ? 'Gold' : 'Silver') as LeaderboardUser['league'],
      isCurrentUser: false
    }));
    saveRegisteredCoders(coders);
  } catch (err) {
    console.error('Failed to save accounts', err);
  }
}

export function getActiveSessionUserId(): string | null {
  try {
    return localStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

export function setActiveSessionUserId(userId: string | null): void {
  try {
    if (userId) {
      localStorage.setItem(SESSION_KEY, userId);
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  } catch (err) {
    console.error('Failed to set active session', err);
  }
}

export function getActiveAccount(): UserAccount | null {
  const activeId = getActiveSessionUserId();
  if (!activeId) return null;
  const accounts = getAllAccounts();
  return accounts.find(a => a.id === activeId) || null;
}

export function registerAccount(data: {
  username: string;
  email: string;
  fullName: string;
  university: string;
  major: string;
  password?: string;
  avatar?: string;
}, lang: 'en' | 'fil' = 'en'): { success: boolean; account?: UserAccount; error?: string } {
  const accounts = getAllAccounts();
  const trimmedUser = data.username.trim().toLowerCase();
  const trimmedEmail = data.email.trim().toLowerCase();

  // Check unique constraints
  const userExists = accounts.some(a => a.username.toLowerCase() === trimmedUser);
  if (userExists) {
    return { 
      success: false, 
      error: lang === 'fil' 
        ? 'Mayroon nang account na may parehong username. Pumili ng iba.' 
        : 'An account with this username already exists. Please choose a different username.' 
    };
  }

  const emailExists = accounts.some(a => a.email.toLowerCase() === trimmedEmail);
  if (emailExists) {
    return { 
      success: false, 
      error: lang === 'fil'
        ? 'Mayroon nang account na naka-rehistro sa email na ito.' 
        : 'An account is already registered with this email address.' 
    };
  }

  const userId = `usr-${Date.now()}`;
  const avatar = data.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(data.username)}`;

  const newProgress: UserProgress = {
    ...INITIAL_PROGRESS,
    userId,
    username: data.username.trim(),
    email: trimmedEmail,
    avatar,
    university: data.university.trim() || 'IT College Student',
    major: data.major.trim() || 'BS Information Technology',
    level: 1,
    xp: 0,
    streak: 1,
    solvedChallengeIds: [],
    completedPlanItemIds: [],
    badges: DEFAULT_BADGES.map(b => b.id === 'b_welcome' ? { ...b, unlockedAt: new Date().toISOString() } : { ...b, unlockedAt: undefined })
  };

  const newAccount: UserAccount = {
    id: userId,
    username: data.username.trim(),
    email: trimmedEmail,
    password: data.password || '',
    fullName: data.fullName.trim() || data.username.trim(),
    university: data.university.trim() || 'IT College Student',
    major: data.major.trim() || 'BS Information Technology',
    avatar,
    createdAt: new Date().toISOString(),
    progress: newProgress
  };

  const updatedAccounts = [...accounts, newAccount];
  saveAllAccounts(updatedAccounts);
  setActiveSessionUserId(userId);

  return { success: true, account: newAccount };
}

export function loginAccount(identifier: string, password?: string, lang: 'en' | 'fil' = 'en'): { success: boolean; account?: UserAccount; error?: string } {
  const accounts = getAllAccounts();
  const trimmed = (identifier || '').trim().toLowerCase();

  if (!trimmed) {
    return { 
      success: false, 
      error: lang === 'fil' 
        ? 'Pakilagay ang iyong username o rehistradong email.' 
        : 'Please enter your username or registered student email.' 
    };
  }

  if (!password || !password.trim()) {
    return { 
      success: false, 
      error: lang === 'fil'
        ? 'Kailangan ilagay ang iyong password. Bawal ma-access ng iba ang iyong account nang walang tamang password.'
        : 'Password is required to protect your personal account and progress.' 
    };
  }

  const found = accounts.find(a => 
    a.username.toLowerCase() === trimmed || a.email.toLowerCase() === trimmed
  );

  if (!found) {
    return { 
      success: false, 
      error: lang === 'fil'
        ? 'Hindi nahanap ang account na may ganyang username o email.' 
        : 'No account found matching that username or email address.' 
    };
  }

  if (found.password !== password) {
    return { 
      success: false, 
      error: lang === 'fil'
        ? 'Maling password. Tanging ang may-ari lamang ng account na may tamang password ang makakapasok.' 
        : 'Incorrect password. Only the verified account owner with the correct password can sign in.' 
    };
  }

  setActiveSessionUserId(found.id);
  return { success: true, account: found };
}

export function logoutAccount(): void {
  setActiveSessionUserId(null);
}

export function syncAccountProgress(userId: string, progress: UserProgress): void {
  const accounts = getAllAccounts();
  const updated = accounts.map(acc => {
    if (acc.id === userId) {
      return {
        ...acc,
        progress: {
          ...progress,
          userId: acc.id,
          username: acc.username,
          avatar: acc.avatar,
          university: acc.university
        }
      };
    }
    return acc;
  });
  saveAllAccounts(updated);
}

export function updateAccountPassword(userId: string, oldPass: string, newPass: string): { success: boolean; error?: string } {
  const accounts = getAllAccounts();
  const acc = accounts.find(a => a.id === userId);
  if (!acc) return { success: false, error: 'Hindi nahanap ang account.' };
  if (acc.password && acc.password !== oldPass) {
    return { success: false, error: 'Maling lumang password.' };
  }
  if (!newPass || newPass.trim().length < 4) {
    return { success: false, error: 'Ang bagong password ay dapat hindi bababa sa 4 na characters.' };
  }
  acc.password = newPass.trim();
  saveAllAccounts(accounts);
  return { success: true };
}
