import { LeaderboardUser } from '../types';

const LEADERBOARD_STORAGE_KEY = 'laramo_registered_coders_v1';

export function getRegisteredCoders(): LeaderboardUser[] {
  try {
    const raw = localStorage.getItem(LEADERBOARD_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveRegisteredCoders(coders: LeaderboardUser[]): void {
  try {
    localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(coders));
  } catch (err) {
    console.error('Failed to save registered coders', err);
  }
}

export function addPeerCoder(coder: Omit<LeaderboardUser, 'rank'>): LeaderboardUser[] {
  const current = getRegisteredCoders();
  const exists = current.some(c => c.id === coder.id || c.name.toLowerCase() === coder.name.toLowerCase());
  if (exists) return current;

  const updated = [...current, { ...coder, rank: current.length + 1 }];
  saveRegisteredCoders(updated);
  return updated;
}
