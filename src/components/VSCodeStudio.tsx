import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  GitBranch, 
  Terminal, 
  FolderGit2, 
  CloudUpload, 
  Play, 
  RotateCcw, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  Copy, 
  Check, 
  Keyboard, 
  Download,
  Package,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { GitSimulatorState, GitCommit, UserProgress } from '../types';
import { 
  VS_CODE_SHORTCUTS, 
  RECOMMENDED_EXTENSIONS, 
  GITHUB_WORKFLOW_STEPS 
} from '../data/vsCodeGuide';

interface VSCodeStudioProps {
  userProgress: UserProgress;
  onUpdateProgress: (updated: UserProgress) => void;
}

const INITIAL_GIT_STATE: GitSimulatorState = {
  workingDirectory: [
    { name: 'main.py', status: 'untracked' },
    { name: 'README.md', status: 'untracked' },
    { name: 'solution.cpp', status: 'untracked' },
    { name: '.gitignore', status: 'untracked' }
  ],
  stagingArea: [],
  localCommits: [],
  remoteCommits: [],
  currentBranch: 'master',
  remoteUrl: null,
  historyLogs: [
    'Welcome to Laramo Interactive Git & Terminal Simulator!',
    'Type "help" to see available commands or click the step buttons below.',
    '----------------------------------------------------------------------'
  ]
};

export const VSCodeStudio: React.FC<VSCodeStudioProps> = ({
  userProgress,
  onUpdateProgress
}) => {
  const [activeTab, setActiveTab] = useState<'git-simulator' | 'vscode-guide' | 'shortcuts' | 'extensions'>('git-simulator');
  const [gitState, setGitState] = useState<GitSimulatorState>(INITIAL_GIT_STATE);
  const [terminalInput, setTerminalInput] = useState<string>('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [shortcutCategory, setShortcutCategory] = useState<string>('All');

  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [gitState.historyLogs]);

  // Execute Git Command in Simulator
  const handleExecuteCommand = (rawCommand: string) => {
    const cmd = rawCommand.trim();
    if (!cmd) return;

    const parts = cmd.split(' ');
    const mainCmd = parts[0];
    const subCmd = parts[1];

    const logs = [...gitState.historyLogs, `$ ${cmd}`];

    if (cmd === 'clear') {
      setGitState(prev => ({ ...prev, historyLogs: [] }));
      setTerminalInput('');
      return;
    }

    if (cmd === 'help') {
      logs.push(
        'Supported Git Commands in Laramo:',
        '  git init                               : Initialize local repository',
        '  git status                             : Show working tree status',
        '  git add .                              : Stage all untracked/modified files',
        '  git commit -m "<msg>"                  : Record changes to repository',
        '  git branch -M main                     : Rename branch to main',
        '  git remote add origin <url>            : Connect local repo to GitHub',
        '  git push -u origin main                : Push commits to GitHub remote',
        '  git log                                : Show commit logs',
        '  clear                                  : Clear terminal window'
      );
      setGitState(prev => ({ ...prev, historyLogs: logs }));
      setTerminalInput('');
      return;
    }

    if (mainCmd !== 'git') {
      logs.push(`bash: ${mainCmd}: command not found. Try typing a git command or "help".`);
      setGitState(prev => ({ ...prev, historyLogs: logs }));
      setTerminalInput('');
      return;
    }

    if (subCmd === 'init') {
      logs.push('Initialized empty Git repository in /workspace/laramo-project/.git/');
      setGitState(prev => ({ ...prev, historyLogs: logs }));
    } else if (subCmd === 'status') {
      if (gitState.stagingArea.length === 0 && gitState.workingDirectory.length === 0) {
        logs.push('On branch ' + gitState.currentBranch, 'nothing to commit, working tree clean');
      } else {
        logs.push(`On branch ${gitState.currentBranch}`);
        if (gitState.stagingArea.length > 0) {
          logs.push('Changes to be committed:');
          gitState.stagingArea.forEach(f => logs.push(`  (use "git restore --staged <file>..." to unstage)`));
          gitState.stagingArea.forEach(f => logs.push(`\t\x1b[32mnew file:   ${f}\x1b[0m`));
        }
        if (gitState.workingDirectory.length > 0) {
          logs.push('Untracked files:');
          logs.push('  (use "git add <file>..." to include in what will be committed)');
          gitState.workingDirectory.forEach(f => logs.push(`\t\x1b[31m${f.name}\x1b[0m`));
        }
      }
      setGitState(prev => ({ ...prev, historyLogs: logs }));
    } else if (subCmd === 'add') {
      if (parts[2] === '.' || parts[2] === '-A') {
        const fileNames = gitState.workingDirectory.map(f => f.name);
        logs.push(`Staged ${fileNames.length} files into the Git index.`);
        setGitState(prev => ({
          ...prev,
          stagingArea: [...prev.stagingArea, ...fileNames],
          workingDirectory: [],
          historyLogs: logs
        }));
      } else if (parts[2]) {
        const file = parts[2];
        const exists = gitState.workingDirectory.find(f => f.name === file);
        if (exists) {
          logs.push(`Staged file: ${file}`);
          setGitState(prev => ({
            ...prev,
            stagingArea: [...prev.stagingArea, file],
            workingDirectory: prev.workingDirectory.filter(f => f.name !== file),
            historyLogs: logs
          }));
        } else {
          logs.push(`fatal: pathspec '${file}' did not match any files`);
          setGitState(prev => ({ ...prev, historyLogs: logs }));
        }
      } else {
        logs.push('Nothing specified, nothing added. Maybe you wanted to say "git add ."?');
        setGitState(prev => ({ ...prev, historyLogs: logs }));
      }
    } else if (subCmd === 'commit') {
      if (gitState.stagingArea.length === 0) {
        logs.push('On branch ' + gitState.currentBranch, 'nothing to commit, working tree clean');
        setGitState(prev => ({ ...prev, historyLogs: logs }));
      } else {
        const msgMatch = cmd.match(/-m\s+["'](.*?)["']/);
        const msg = msgMatch ? msgMatch[1] : 'Commit update';
        const hash = Math.random().toString(16).substring(2, 9);
        const newCommit: GitCommit = {
          id: `c-${Date.now()}`,
          hash,
          message: msg,
          timestamp: 'Just now',
          author: userProgress.username,
          files: [...gitState.stagingArea]
        };

        logs.push(
          `[${gitState.currentBranch} ${hash}] ${msg}`,
          ` ${gitState.stagingArea.length} files changed, 84 insertions(+)`
        );

        setGitState(prev => ({
          ...prev,
          localCommits: [newCommit, ...prev.localCommits],
          stagingArea: [],
          historyLogs: logs
        }));
      }
    } else if (subCmd === 'branch') {
      if (parts[2] === '-M' && parts[3]) {
        const branchName = parts[3];
        logs.push(`Switched and renamed branch to '${branchName}'`);
        setGitState(prev => ({ ...prev, currentBranch: branchName, historyLogs: logs }));
      } else {
        logs.push(`* ${gitState.currentBranch}`);
        setGitState(prev => ({ ...prev, historyLogs: logs }));
      }
    } else if (subCmd === 'remote') {
      if (parts[2] === 'add' && parts[3] === 'origin' && parts[4]) {
        const url = parts[4];
        logs.push(`Added remote origin -> ${url}`);
        setGitState(prev => ({ ...prev, remoteUrl: url, historyLogs: logs }));
      } else if (parts[2] === '-v') {
        if (gitState.remoteUrl) {
          logs.push(
            `origin\t${gitState.remoteUrl} (fetch)`,
            `origin\t${gitState.remoteUrl} (push)`
          );
        } else {
          logs.push('No remotes configured yet. Use: git remote add origin <url>');
        }
        setGitState(prev => ({ ...prev, historyLogs: logs }));
      } else {
        logs.push('Usage: git remote add origin <url>');
        setGitState(prev => ({ ...prev, historyLogs: logs }));
      }
    } else if (subCmd === 'push') {
      if (!gitState.remoteUrl) {
        logs.push('fatal: No configured push destination. Run: git remote add origin <url>');
        setGitState(prev => ({ ...prev, historyLogs: logs }));
      } else if (gitState.localCommits.length === 0) {
        logs.push('Everything up-to-date (no local commits to push).');
        setGitState(prev => ({ ...prev, historyLogs: logs }));
      } else {
        logs.push(
          `Enumerating objects: ${gitState.localCommits.length * 4}, done.`,
          `Counting objects: 100% (${gitState.localCommits.length * 4}/${gitState.localCommits.length * 4}), done.`,
          `Writing objects: 100% (${gitState.localCommits.length * 4}/${gitState.localCommits.length * 4}), 3.42 KiB | 3.42 MiB/s, done.`,
          `Total ${gitState.localCommits.length * 4} (delta 2), reused 0 (delta 0)`,
          `To ${gitState.remoteUrl}`,
          ` * [new branch]      ${gitState.currentBranch} -> ${gitState.currentBranch}`,
          `Branch '${gitState.currentBranch}' set up to track remote branch '${gitState.currentBranch}' from 'origin'.`
        );

        // Confetti victory for first push
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });

        // Award badge & progress
        onUpdateProgress({
          ...userProgress,
          xp: userProgress.xp + 100,
          gitTutorialProgress: 100,
          badges: userProgress.badges.map(b => b.id === 'b_git' ? { ...b, unlockedAt: new Date().toISOString() } : b)
        });

        setGitState(prev => ({
          ...prev,
          remoteCommits: [...prev.localCommits],
          historyLogs: logs
        }));
      }
    } else if (subCmd === 'log') {
      if (gitState.localCommits.length === 0) {
        logs.push(`fatal: your current branch '${gitState.currentBranch}' does not have any commits yet`);
      } else {
        gitState.localCommits.forEach(c => {
          logs.push(`commit ${c.hash}`);
          logs.push(`Author: ${c.author}`);
          logs.push(`Date:   ${c.timestamp}`);
          logs.push(`    ${c.message}`);
          logs.push('');
        });
      }
      setGitState(prev => ({ ...prev, historyLogs: logs }));
    } else {
      logs.push(`git: '${subCmd}' is not a recognized git command in this simulator. Type "help".`);
      setGitState(prev => ({ ...prev, historyLogs: logs }));
    }

    setTerminalInput('');
  };

  const handleResetSimulator = () => {
    setGitState(INITIAL_GIT_STATE);
  };

  const handleCopyCommand = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const filteredShortcuts = VS_CODE_SHORTCUTS.filter(s => 
    shortcutCategory === 'All' || s.category === shortcutCategory
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <GitBranch className="w-4 h-4" />
            <span>Developer Tooling Masterclass for IT & Computer Science</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            VS Code & Git/GitHub Interactive Masterclass
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Matutunan kung paano gumawa ng GitHub repository, mag-stage, mag-commit, at mag-push ng iyong mga school codes at project solutions. Plus VS Code workflow essentials.
          </p>
        </div>

        {/* Quick Tabs inside header */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-medium">
          <button
            onClick={() => setActiveTab('git-simulator')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'git-simulator'
                ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Git Visual Simulator
          </button>
          <button
            onClick={() => setActiveTab('vscode-guide')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'vscode-guide'
                ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Step-by-Step GitHub Guide
          </button>
          <button
            onClick={() => setActiveTab('shortcuts')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'shortcuts'
                ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            VS Code Shortcuts
          </button>
          <button
            onClick={() => setActiveTab('extensions')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'extensions'
                ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Must-Have Extensions
          </button>
        </div>
      </div>

      {/* Tab 1: Interactive Git Visualizer & Terminal Simulator */}
      {activeTab === 'git-simulator' && (
        <div className="space-y-6">
          {/* Visual Architecture 4-Column Flow (Working Dir -> Staging -> Local Repo -> Remote) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FolderGit2 className="w-4 h-4 text-emerald-500" />
                  Live Git Architecture & Data Flow
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Panoorin kung paano gumagalaw ang iyong mga files mula sa computer patungo sa staging, commit, at cloud repository sa GitHub.
                </p>
              </div>
              <button
                onClick={handleResetSimulator}
                className="flex items-center gap-1 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Box 1: Working Directory */}
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex flex-col justify-between min-h-[160px]">
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    <span>1. Working Directory</span>
                    <span className="text-[11px] font-mono text-slate-400">Local files</span>
                  </div>
                  {gitState.workingDirectory.length === 0 ? (
                    <div className="text-xs text-slate-400 italic py-6 text-center">
                      Working tree clean
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {gitState.workingDirectory.map((f, i) => (
                        <div key={i} className="flex items-center justify-between text-xs font-mono p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded">
                          <span className="text-rose-500">? {f.name}</span>
                          <span className="text-[10px] text-slate-400">untracked</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
                  Command: <code className="text-emerald-600 dark:text-emerald-400">git add .</code>
                </div>
              </div>

              {/* Box 2: Staging Area (Index) */}
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex flex-col justify-between min-h-[160px]">
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    <span>2. Staging Area (Index)</span>
                    <span className="text-[11px] font-mono text-emerald-500">Ready to commit</span>
                  </div>
                  {gitState.stagingArea.length === 0 ? (
                    <div className="text-xs text-slate-400 italic py-6 text-center">
                      No files staged yet
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {gitState.stagingArea.map((f, i) => (
                        <div key={i} className="flex items-center justify-between text-xs font-mono p-1.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded">
                          <span className="text-emerald-700 dark:text-emerald-300">+ {f}</span>
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400">staged</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
                  Command: <code className="text-emerald-600 dark:text-emerald-400">git commit -m "msg"</code>
                </div>
              </div>

              {/* Box 3: Local Repository Commits */}
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex flex-col justify-between min-h-[160px]">
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    <span>3. Local Git Repo</span>
                    <span className="text-[11px] font-mono text-indigo-500">[{gitState.currentBranch}]</span>
                  </div>
                  {gitState.localCommits.length === 0 ? (
                    <div className="text-xs text-slate-400 italic py-6 text-center">
                      No commits recorded
                    </div>
                  ) : (
                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {gitState.localCommits.map((c) => (
                        <div key={c.id} className="p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-xs">
                          <div className="flex items-center justify-between font-mono text-[10px] text-indigo-500">
                            <span>#{c.hash}</span>
                            <span>{c.timestamp}</span>
                          </div>
                          <div className="font-medium text-slate-800 dark:text-slate-200 truncate mt-0.5">
                            {c.message}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
                  Command: <code className="text-emerald-600 dark:text-emerald-400">git push -u origin main</code>
                </div>
              </div>

              {/* Box 4: Remote GitHub Repository */}
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex flex-col justify-between min-h-[160px]">
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    <span className="flex items-center gap-1.5">
                      <CloudUpload className="w-3.5 h-3.5 text-emerald-500" />
                      4. GitHub Remote
                    </span>
                    <span className="text-[11px] font-mono text-emerald-500">Cloud Sync</span>
                  </div>
                  {!gitState.remoteUrl ? (
                    <div className="text-xs text-slate-400 italic py-6 text-center">
                      Remote origin not linked
                    </div>
                  ) : gitState.remoteCommits.length === 0 ? (
                    <div className="p-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded text-xs text-amber-700 dark:text-amber-400">
                      Linked to: <span className="font-mono text-[10px] break-all">{gitState.remoteUrl}</span>. Ready to push.
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono truncate">
                        ✔ Synced to GitHub origin/{gitState.currentBranch}
                      </div>
                      {gitState.remoteCommits.map((c) => (
                        <div key={c.id} className="p-1.5 bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 rounded text-xs">
                          <div className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400">
                            Remote Commit: {c.hash}
                          </div>
                          <div className="text-slate-700 dark:text-slate-300 truncate">
                            {c.message}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
                  Status: <span className="text-slate-700 dark:text-slate-300 font-medium">{gitState.remoteCommits.length > 0 ? 'Production Ready' : 'Awaiting Push'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Step Buttons for Beginners */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              One-Click Guided Actions (Or type manually in the terminal below)
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleExecuteCommand('git init')}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-xs font-mono text-slate-800 dark:text-slate-200 transition-colors"
              >
                1. git init
              </button>
              <button
                onClick={() => handleExecuteCommand('git status')}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-xs font-mono text-slate-800 dark:text-slate-200 transition-colors"
              >
                2. git status
              </button>
              <button
                onClick={() => handleExecuteCommand('git add .')}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-xs font-mono text-slate-800 dark:text-slate-200 transition-colors"
              >
                3. git add .
              </button>
              <button
                onClick={() => handleExecuteCommand('git commit -m "feat: initial commit for laramo"')}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-xs font-mono text-slate-800 dark:text-slate-200 transition-colors"
              >
                4. git commit -m "..."
              </button>
              <button
                onClick={() => handleExecuteCommand('git branch -M main')}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-xs font-mono text-slate-800 dark:text-slate-200 transition-colors"
              >
                5. git branch -M main
              </button>
              <button
                onClick={() => handleExecuteCommand('git remote add origin https://github.com/student/laramo-workspace.git')}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-xs font-mono text-slate-800 dark:text-slate-200 transition-colors"
              >
                6. git remote add origin ...
              </button>
              <button
                onClick={() => handleExecuteCommand('git push -u origin main')}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-mono font-semibold transition-colors shadow-sm"
              >
                7. git push -u origin main
              </button>
            </div>
          </div>

          {/* Interactive Bash Terminal */}
          <div className="bg-[#181818] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
            {/* Terminal Window Header */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#121212] border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <span className="font-mono text-slate-400 ml-2">bash — student@laramo-dev:~/workspace</span>
              </div>
              <div className="flex items-center gap-3 text-slate-500 font-mono text-[11px]">
                <span>Type "help" for command list</span>
                <span>·</span>
                <button 
                  onClick={() => handleExecuteCommand('clear')}
                  className="hover:text-slate-300 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Terminal Output logs */}
            <div className="p-4 font-mono text-xs text-slate-300 space-y-1 max-h-[300px] overflow-y-auto leading-relaxed">
              {gitState.historyLogs.map((log, i) => (
                <div key={i} className="whitespace-pre-wrap">{log}</div>
              ))}
              <div ref={terminalEndRef} />
            </div>

            {/* Terminal Command Input Prompt */}
            <div className="p-3 bg-[#141414] border-t border-slate-800 flex items-center gap-2 font-mono text-xs">
              <span className="text-emerald-400 font-bold">student@laramo:~$</span>
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleExecuteCommand(terminalInput);
                  }
                }}
                placeholder="type git command here and press Enter (e.g. git status)"
                className="flex-1 bg-transparent text-white focus:outline-none placeholder:text-slate-600"
              />
              <button
                onClick={() => handleExecuteCommand(terminalInput)}
                className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-sans transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Step-by-Step GitHub Repository Creation Guide */}
      {activeTab === 'vscode-guide' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              Paano Gumawa ng GitHub Repository at Mag-Push ng Code mula sa VS Code
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Ito ang kumpletong standard workflow ng bawat IT student at software engineer sa industriya. Sundin ang bawat hakbang mula simula hanggang matapos.
            </p>

            <div className="mt-6 space-y-6">
              {GITHUB_WORKFLOW_STEPS.map((step, idx) => (
                <div 
                  key={step.step}
                  className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shrink-0 font-mono">
                        {step.step}
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {step.title}
                      </h3>
                    </div>

                    <button
                      onClick={() => handleCopyCommand(step.command, idx)}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 font-mono"
                    >
                      {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedIndex === idx ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  {/* Command box */}
                  <div className="p-3 bg-[#181818] rounded-lg font-mono text-xs text-emerald-400 overflow-x-auto">
                    {step.command}
                  </div>

                  {/* Tagalog explanation */}
                  <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">Paliwanag: </span>
                    {step.explanationTagalog}
                  </div>

                  {/* Common mistake & Pro tip */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
                    <div className="text-rose-700 dark:text-rose-400">
                      <span className="font-semibold">Babala / Karaniwang Pagkakamali: </span>
                      {step.commonMistake}
                    </div>
                    <div className="text-indigo-700 dark:text-indigo-400">
                      <span className="font-semibold">Pro-Tip ng Dev: </span>
                      {step.proTip}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: VS Code Keyboard Shortcuts Trainer */}
      {activeTab === 'shortcuts' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Keyboard className="w-5 h-5 text-emerald-500" />
                  Mahahalagang Keyboard Shortcuts sa VS Code
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Mabilis mag-code ang isang programmer kapag sanay sa shortcuts sa halip na laging gumagamit ng mouse.
                </p>
              </div>

              {/* Category filter */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
                {['All', 'Navigation', 'Editing', 'Terminal', 'Debugging'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setShortcutCategory(cat)}
                    className={`px-3 py-1 rounded-md font-medium transition-colors ${
                      shortcutCategory === cat
                        ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {filteredShortcuts.map((s, idx) => (
                <div 
                  key={idx}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {s.action}
                    </div>
                    <div className="text-slate-500 text-[11px] leading-relaxed">
                      {s.description}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0 font-mono text-[11px]">
                    <kbd className="px-2 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded shadow-xs text-slate-800 dark:text-slate-200">
                      {s.keyWin}
                    </kbd>
                    <span className="text-[10px] text-slate-400">Mac: {s.keyMac}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Must-Have VS Code Extensions for IT Students */}
      {activeTab === 'extensions' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-500" />
                Must-Have VS Code Extensions para sa IT & Computer Science Students
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                I-install ang mga ito sa iyong VS Code upang magkaroon ng auto-complete, debugging, syntax checking, at group collaboration.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {RECOMMENDED_EXTENSIONS.map((ext, idx) => (
                <div
                  key={ext.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-bold text-sm text-slate-900 dark:text-white">
                        {ext.name}
                      </div>
                      <div className="text-xs text-slate-400 font-medium">
                        By {ext.publisher}
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      Verified
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {ext.description}
                  </p>

                  <div className="text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-lg">
                    <span className="font-semibold">Bakit kailangan ng IT student: </span>
                    {ext.whyStudentNeedsIt}
                  </div>

                  <div className="flex items-center justify-between pt-1 font-mono text-[11px] text-slate-500">
                    <span className="truncate max-w-[240px]">{ext.installCommand}</span>
                    <button
                      onClick={() => handleCopyCommand(ext.installCommand, 20 + idx)}
                      className="text-xs text-slate-700 dark:text-slate-300 hover:text-emerald-500 flex items-center gap-1 font-sans"
                    >
                      {copiedIndex === 20 + idx ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedIndex === 20 + idx ? 'Copied' : 'Copy Command'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
