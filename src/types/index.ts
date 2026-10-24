export type Language = 
  | 'python' 
  | 'javascript' 
  | 'typescript' 
  | 'cpp' 
  | 'java' 
  | 'csharp' 
  | 'go' 
  | 'rust' 
  | 'php'
  | 'html'
  | 'css'
  | 'sql';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  explanation?: string;
  isHidden?: boolean;
}

export interface Challenge {
  id: string;
  title: string;
  slug: string;
  difficulty: Difficulty;
  category: 'Basics' | 'Arrays' | 'Strings' | 'DSA' | 'Algorithms' | 'OOP' | 'Databases' | 'WebDev' | 'PHP';
  points: number;
  description: string;
  constraints: string[];
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  starterCode: Partial<Record<Language, string>>;
  solutionCode?: Partial<Record<Language, string>>;
  testCases: TestCase[];
  hints: string[];
  timeComplexity: string;
  spaceComplexity: string;
}

export interface UserProgress {
  userId: string;
  username: string;
  email?: string;
  avatar: string;
  university: string;
  major?: string;
  level: number;
  xp: number;
  streak: number;
  lastActiveDate: string;
  solvedChallengeIds: string[];
  activeStudyPlanId: string;
  completedPlanItemIds: string[];
  savedCode: Record<string, Partial<Record<Language, string>>>;
  gitTutorialProgress: number; // 0 to 100
  badges: Badge[];
}

export interface UserAccount {
  id: string;
  username: string;
  email: string;
  password?: string;
  fullName: string;
  university: string;
  major: string;
  avatar: string;
  createdAt: string;
  progress: UserProgress;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface StudyPlanItem {
  id: string;
  title: string;
  description: string;
  estimatedHours: number;
  topics: string[];
  challengeIds: string[];
  isMilestone?: boolean;
}

export interface StudyPlan {
  id: string;
  title: string;
  tagline: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  durationWeeks: number;
  description: string;
  recommendedLanguages: Language[];
  items: StudyPlanItem[];
}

export interface LeaderboardUser {
  rank: number;
  id: string;
  name: string;
  university: string;
  avatar: string;
  xp: number;
  solvedCount: number;
  streak: number;
  league: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Grandmaster';
  isCurrentUser?: boolean;
}

export type VisualizerAlgorithm = 
  | 'bubble-sort' 
  | 'selection-sort' 
  | 'insertion-sort' 
  | 'merge-sort' 
  | 'binary-search' 
  | 'two-pointers' 
  | 'bst-traversal';

export interface GitCommit {
  id: string;
  hash: string;
  message: string;
  timestamp: string;
  author: string;
  files: string[];
}

export interface GitSimulatorState {
  workingDirectory: { name: string; status: 'untracked' | 'modified' | 'staged' }[];
  stagingArea: string[];
  localCommits: GitCommit[];
  remoteCommits: GitCommit[];
  currentBranch: string;
  remoteUrl: string | null;
  historyLogs: string[];
}
