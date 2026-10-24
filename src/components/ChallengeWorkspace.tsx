import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Play, 
  Send, 
  RotateCcw, 
  Download, 
  Copy, 
  Check, 
  Lightbulb, 
  Clock, 
  HardDrive, 
  CheckCircle2, 
  XCircle, 
  HelpCircle,
  Code2,
  ChevronRight,
  Maximize2,
  Minimize2,
  Eye,
  Globe
} from 'lucide-react';
import { Challenge, Language, UserProgress, TestCase } from '../types';
import { CHALLENGES } from '../data/challenges';
import { executeCode, ExecutionResult } from '../utils/codeRunner';
import { downloadCodeSnippet } from '../utils/storage';

interface ChallengeWorkspaceProps {
  userProgress: UserProgress;
  onUpdateProgress: (updated: UserProgress) => void;
  initialChallengeId?: string;
}

const LANGUAGES: { id: Language; label: string; ext: string }[] = [
  { id: 'python', label: 'Python 3', ext: 'py' },
  { id: 'javascript', label: 'JavaScript (ES6/Node)', ext: 'js' },
  { id: 'html', label: 'HTML5 (Web Layout)', ext: 'html' },
  { id: 'css', label: 'CSS3 (Styles)', ext: 'css' },
  { id: 'php', label: 'PHP 8.2 (Zend)', ext: 'php' },
  { id: 'typescript', label: 'TypeScript', ext: 'ts' },
  { id: 'cpp', label: 'C++ 20', ext: 'cpp' },
  { id: 'java', label: 'Java 17', ext: 'java' },
  { id: 'csharp', label: 'C# .NET', ext: 'cs' },
  { id: 'go', label: 'Go 1.22', ext: 'go' },
  { id: 'rust', label: 'Rust 2021', ext: 'rs' },
  { id: 'sql', label: 'SQL (PostgreSQL)', ext: 'sql' }
];

export const ChallengeWorkspace: React.FC<ChallengeWorkspaceProps> = ({
  userProgress,
  onUpdateProgress,
  initialChallengeId
}) => {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge>(() => {
    if (initialChallengeId) {
      const found = CHALLENGES.find(c => c.id === initialChallengeId);
      if (found) return found;
    }
    return CHALLENGES[0];
  });

  const [selectedLanguage, setSelectedLanguage] = useState<Language>('python');
  const [code, setCode] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'description' | 'hints' | 'solution'>('description');
  const [bottomTab, setBottomTab] = useState<'testcases' | 'output' | 'preview'>('testcases');
  const [activeTestCaseIdx, setActiveTestCaseIdx] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState<number>(14);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [revealedHints, setRevealedHints] = useState<number[]>([]);
  const [isEditorFullscreen, setIsEditorFullscreen] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync starter code or saved user code when challenge or language changes
  useEffect(() => {
    const saved = userProgress.savedCode?.[selectedChallenge.id]?.[selectedLanguage];
    if (saved) {
      setCode(saved);
    } else {
      setCode(selectedChallenge.starterCode[selectedLanguage] || '// No starter code available');
    }
    setExecutionResult(null);
    setRevealedHints([]);
    setActiveTestCaseIdx(0);
  }, [selectedChallenge.id, selectedLanguage]);

  // Handle Tab key inside textarea for smooth code editing experience
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4;
        }
      }, 0);
    }
  };

  // Quick insertion of symbols for mobile touch convenience
  const insertSymbol = (sym: string) => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const newCode = code.substring(0, start) + sym + code.substring(end);
    setCode(newCode);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + sym.length;
      }
    }, 0);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setBottomTab('output');
    try {
      const res = await executeCode(code, selectedLanguage, selectedChallenge.testCases, selectedChallenge.slug);
      setExecutionResult(res);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitSolution = async () => {
    setIsRunning(true);
    setBottomTab('output');
    try {
      const res = await executeCode(code, selectedLanguage, selectedChallenge.testCases, selectedChallenge.slug);
      setExecutionResult(res);

      if (res.success) {
        // Trigger celebratory confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });

        // Award XP and mark challenge as solved if not already solved
        const isNewSolve = !userProgress.solvedChallengeIds.includes(selectedChallenge.id);
        const earnedXp = isNewSolve ? selectedChallenge.points : 20;

        const updatedProgress: UserProgress = {
          ...userProgress,
          xp: userProgress.xp + earnedXp,
          streak: isNewSolve ? userProgress.streak + 1 : userProgress.streak,
          solvedChallengeIds: isNewSolve 
            ? [...userProgress.solvedChallengeIds, selectedChallenge.id] 
            : userProgress.solvedChallengeIds,
          savedCode: {
            ...userProgress.savedCode,
            [selectedChallenge.id]: {
              ...(userProgress.savedCode?.[selectedChallenge.id] || {} as Record<Language, string>),
              [selectedLanguage]: code
            }
          }
        };

        onUpdateProgress(updatedProgress);
      }
    } finally {
      setIsRunning(false);
    }
  };

  const handleResetCode = () => {
    setCode(selectedChallenge.starterCode[selectedLanguage] || '// No starter code available for this language');
    setExecutionResult(null);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = LANGUAGES.find(l => l.id === selectedLanguage)?.ext || 'txt';
    downloadCodeSnippet(`${selectedChallenge.slug}_solution.${ext}`, code);
  };

  // Filter challenges
  const filteredChallenges = CHALLENGES.filter(ch => {
    const matchesCategory = categoryFilter === 'All' || ch.category === categoryFilter;
    const matchesDiff = difficultyFilter === 'All' || ch.difficulty === difficultyFilter;
    const matchesSearch = ch.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ch.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesDiff && matchesSearch;
  });

  const isSolved = userProgress.solvedChallengeIds.includes(selectedChallenge.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner / Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
        {/* Category & Difficulty Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs overflow-x-auto">
            {['All', 'WebDev', 'PHP', 'Arrays', 'Strings', 'DSA', 'Algorithms'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                  categoryFilter === cat
                    ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
            {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
              <button
                key={diff}
                onClick={() => setDifficultyFilter(diff)}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  difficultyFilter === diff
                    ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Search input & Quick stats */}
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search problems..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-900 dark:text-slate-100 w-44 sm:w-56"
          />
          <div className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block whitespace-nowrap">
            Solved: <span className="font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">{userProgress.solvedChallengeIds.length}</span> of {CHALLENGES.length}
          </div>
        </div>
      </div>

      {/* Main Split Layout: Left Problem Explorer & Right Workspace IDE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Problem description & Catalog (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Challenge Selector Dropdown / Carousel */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Select Problem
              </span>
              <span className="text-xs text-slate-500">
                {filteredChallenges.length} challenges available
              </span>
            </div>

            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
              {filteredChallenges.map((ch) => {
                const solvedThis = userProgress.solvedChallengeIds.includes(ch.id);
                const isCurrent = ch.id === selectedChallenge.id;
                return (
                  <button
                    key={ch.id}
                    onClick={() => setSelectedChallenge(ch)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left text-xs transition-colors ${
                      isCurrent
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-transparent text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {solvedThis ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700 shrink-0" />
                      )}
                      <span className="font-medium truncate">{ch.title}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 text-[11px]">
                      <span className={
                        ch.difficulty === 'Easy' ? 'text-emerald-600 dark:text-emerald-400' :
                        ch.difficulty === 'Medium' ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'
                      }>
                        {ch.difficulty}
                      </span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-500 tabular-nums">+{ch.points} XP</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Problem Details Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
            {/* Header Tabs */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-4 py-2.5 bg-slate-50/50 dark:bg-slate-950/50">
              <div className="flex items-center gap-3 text-xs font-medium">
                <button
                  onClick={() => setActiveTab('description')}
                  className={`py-1 transition-colors ${
                    activeTab === 'description'
                      ? 'text-emerald-600 dark:text-emerald-400 font-semibold border-b-2 border-emerald-600 dark:border-emerald-400'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab('hints')}
                  className={`py-1 transition-colors flex items-center gap-1 ${
                    activeTab === 'hints'
                      ? 'text-emerald-600 dark:text-emerald-400 font-semibold border-b-2 border-emerald-600 dark:border-emerald-400'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  Hints ({selectedChallenge.hints.length})
                </button>
              </div>

              {isSolved && (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Solved
                </span>
              )}
            </div>

            {/* Tab Contents */}
            <div className="p-5 max-h-[600px] overflow-y-auto space-y-4 text-sm text-slate-700 dark:text-slate-300">
              {activeTab === 'description' && (
                <>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      {selectedChallenge.title}
                    </h2>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                      <span>{selectedChallenge.category}</span>
                      <span>·</span>
                      <span className={
                        selectedChallenge.difficulty === 'Easy' ? 'text-emerald-600 dark:text-emerald-400 font-medium' :
                        selectedChallenge.difficulty === 'Medium' ? 'text-amber-600 dark:text-amber-400 font-medium' : 'text-rose-600 dark:text-rose-400 font-medium'
                      }>
                        {selectedChallenge.difficulty}
                      </span>
                      <span>·</span>
                      <span className="tabular-nums">Reward: {selectedChallenge.points} XP</span>
                    </div>
                  </div>

                  {/* Body description */}
                  <div className="whitespace-pre-line leading-relaxed text-sm">
                    {selectedChallenge.description}
                  </div>

                  {/* Examples */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                      Examples
                    </h4>
                    {selectedChallenge.examples.map((ex, idx) => (
                      <div 
                        key={idx} 
                        className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs space-y-1.5"
                      >
                        <div>
                          <span className="font-semibold text-slate-500">Input: </span>
                          <code className="text-slate-900 dark:text-slate-100">{ex.input}</code>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-500">Output: </span>
                          <code className="text-emerald-600 dark:text-emerald-400">{ex.output}</code>
                        </div>
                        {ex.explanation && (
                          <div className="text-slate-500 dark:text-slate-400 pt-0.5">
                            {ex.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Constraints */}
                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                      Constraints
                    </h4>
                    <ul className="list-disc list-inside text-xs space-y-1 text-slate-600 dark:text-slate-400">
                      {selectedChallenge.constraints.map((c, i) => (
                        <li key={i}><code>{c}</code></li>
                      ))}
                    </ul>
                  </div>

                  {/* Target Complexity */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> Time: {selectedChallenge.timeComplexity}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <HardDrive className="w-3.5 h-3.5" /> Space: {selectedChallenge.spaceComplexity}
                    </span>
                  </div>
                </>
              )}

              {activeTab === 'hints' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-500">
                    Need a nudge? Reveal hints progressively to stimulate your algorithmic problem solving without spoiling the full solution.
                  </p>
                  {selectedChallenge.hints.map((hint, idx) => {
                    const isRevealed = revealedHints.includes(idx);
                    return (
                      <div
                        key={idx}
                        className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            Hint {idx + 1}
                          </span>
                          {!isRevealed ? (
                            <button
                              onClick={() => setRevealedHints(prev => [...prev, idx])}
                              className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                            >
                              Reveal Hint
                            </button>
                          ) : (
                            <span className="text-slate-400">Unlocked</span>
                          )}
                        </div>
                        {isRevealed && (
                          <p className="mt-2 text-slate-600 dark:text-slate-300 leading-relaxed">
                            {hint}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Code Editor & Test Results IDE (7 cols on lg) */}
        <div className={`space-y-4 ${isEditorFullscreen ? 'fixed inset-4 z-50 bg-white dark:bg-slate-900 p-6 overflow-auto border border-slate-300 dark:border-slate-700 rounded-2xl shadow-2xl' : 'lg:col-span-7'}`}>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden flex flex-col">
            {/* Editor Top Bar: Language selector, actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-slate-50/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 text-xs">
              {/* Language Selector */}
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value as Language)}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.id} value={lang.id}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Toolbar Controls */}
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <button
                  onClick={() => setFontSize(f => Math.max(12, f - 1))}
                  title="Decrease font size"
                  className="px-2 py-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 font-mono text-xs"
                >
                  A-
                </button>
                <button
                  onClick={() => setFontSize(f => Math.min(20, f + 1))}
                  title="Increase font size"
                  className="px-2 py-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 font-mono text-xs"
                >
                  A+
                </button>
                <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-800 mx-1" />
                <button
                  onClick={handleCopyCode}
                  title="Copy code"
                  className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={handleDownload}
                  title="Download source file"
                  className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleResetCode}
                  title="Reset to starter code"
                  className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsEditorFullscreen(!isEditorFullscreen)}
                  title={isEditorFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                  className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                >
                  {isEditorFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Code Textarea Area with Line Numbers */}
            <div className="relative flex bg-[#1e1e1e] text-slate-100 font-mono overflow-hidden min-h-[320px]">
              {/* Simulated Line Numbers */}
              <div 
                className="select-none py-3 px-2 text-right text-slate-500 bg-[#181818] border-r border-slate-800 text-xs font-mono w-10 shrink-0"
                aria-hidden="true"
              >
                {Array.from({ length: Math.max(16, code.split('\n').length) }, (_, i) => (
                  <div key={i} className="leading-6">{i + 1}</div>
                ))}
              </div>

              {/* Code Input */}
              <textarea
                ref={textareaRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={handleKeyDown}
                spellCheck={false}
                autoCapitalize="off"
                autoComplete="off"
                autoCorrect="off"
                style={{ fontSize: `${fontSize}px`, lineHeight: '24px' }}
                className="w-full h-[380px] p-3 bg-transparent text-slate-100 font-mono focus:outline-none resize-none leading-6 whitespace-pre overflow-auto"
                placeholder="Write your solution here..."
              />
            </div>

            {/* Mobile Quick Symbols Helper Bar */}
            <div className="flex sm:hidden items-center gap-1 overflow-x-auto p-1.5 bg-slate-900 border-t border-slate-800 text-xs text-slate-300">
              {['(', ')', '{', '}', '[', ']', ';', ':', '=>', '==', '"', "'", '=', '+', '-', '<', '>', '&', '|'].map((sym) => (
                <button
                  key={sym}
                  onClick={() => insertSymbol(sym)}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 font-mono shrink-0"
                >
                  {sym}
                </button>
              ))}
            </div>

            {/* Execution Actions Bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
              <div className="text-xs text-slate-500">
                {selectedLanguage.toUpperCase()} Runtime ready
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Run Code</span>
                </button>

                <button
                  onClick={handleSubmitSolution}
                  disabled={isRunning}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-medium text-white shadow-sm transition-colors disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Solution</span>
                </button>
              </div>
            </div>
          </div>

          {/* Test Cases & Output Panel */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
            {/* Tab header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-4 py-2 bg-slate-50/50 dark:bg-slate-950/50 text-xs">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setBottomTab('testcases')}
                  className={`py-1 transition-colors ${
                    bottomTab === 'testcases'
                      ? 'text-emerald-600 dark:text-emerald-400 font-semibold border-b-2 border-emerald-600 dark:border-emerald-400'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Test Cases
                </button>

                <button
                  onClick={() => setBottomTab('output')}
                  className={`py-1 transition-colors flex items-center gap-1.5 ${
                    bottomTab === 'output'
                      ? 'text-emerald-600 dark:text-emerald-400 font-semibold border-b-2 border-emerald-600 dark:border-emerald-400'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Terminal / Output
                  {executionResult && (
                    <span className={`w-2 h-2 rounded-full ${executionResult.success ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  )}
                </button>

                {(selectedLanguage === 'html' || selectedLanguage === 'css' || selectedLanguage === 'javascript' || code.includes('<article') || code.includes('<html')) && (
                  <button
                    onClick={() => setBottomTab('preview')}
                    className={`py-1 transition-colors flex items-center gap-1.5 ${
                      bottomTab === 'preview'
                        ? 'text-emerald-600 dark:text-emerald-400 font-semibold border-b-2 border-emerald-600 dark:border-emerald-400'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Live Web Preview</span>
                  </button>
                )}
              </div>

              {executionResult && (
                <div className="text-xs text-slate-500 flex items-center gap-2">
                  <span>Runtime: <span className="font-mono text-slate-800 dark:text-slate-200">{executionResult.runtimeMs}ms</span></span>
                  <span>·</span>
                  <span>Memory: <span className="font-mono text-slate-800 dark:text-slate-200">{executionResult.memoryMb}MB</span></span>
                </div>
              )}
            </div>

            {/* Bottom Panel Content */}
            <div className="p-4">
              {bottomTab === 'testcases' && (
                <div className="space-y-3">
                  {/* Test case tabs */}
                  <div className="flex items-center gap-2">
                    {selectedChallenge.testCases.map((tc, idx) => (
                      <button
                        key={tc.id}
                        onClick={() => setActiveTestCaseIdx(idx)}
                        className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                          activeTestCaseIdx === idx
                            ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white'
                            : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                        }`}
                      >
                        Case {idx + 1}
                      </button>
                    ))}
                  </div>

                  {/* Selected test case content */}
                  {selectedChallenge.testCases[activeTestCaseIdx] && (
                    <div className="space-y-2.5 text-xs">
                      <div>
                        <div className="text-slate-500 mb-1">Input:</div>
                        <div className="p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-mono text-slate-800 dark:text-slate-200">
                          {selectedChallenge.testCases[activeTestCaseIdx].input}
                        </div>
                      </div>

                      <div>
                        <div className="text-slate-500 mb-1">Expected Output:</div>
                        <div className="p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-mono text-emerald-600 dark:text-emerald-400">
                          {selectedChallenge.testCases[activeTestCaseIdx].expectedOutput}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {bottomTab === 'output' && (
                <div>
                  {!executionResult && !isRunning && (
                    <div className="text-xs text-slate-500 py-4 text-center">
                      Run your code or submit solution to inspect real-time outputs and test verification.
                    </div>
                  )}

                  {isRunning && (
                    <div className="py-6 flex flex-col items-center justify-center space-y-2 text-xs text-slate-500">
                      <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                      <span>Compiling and executing against test suite...</span>
                    </div>
                  )}

                  {executionResult && !isRunning && (
                    <div className="space-y-3 font-mono text-xs">
                      {/* Overall status banner */}
                      <div className={`p-3 rounded-lg border flex items-center justify-between ${
                        executionResult.success
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300'
                          : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-300'
                      }`}>
                        <div className="flex items-center gap-2">
                          {executionResult.success ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                          )}
                          <span className="font-semibold font-sans">
                            {executionResult.success ? 'Accepted! Solution Verified' : 'Tests Failed or Differences Found'}
                          </span>
                        </div>
                        <span className="text-xs tabular-nums">
                          {executionResult.totalPassed} / {executionResult.totalCases} Passed
                        </span>
                      </div>

                      {/* Stdout Console logs */}
                      <div className="p-3 bg-[#181818] text-slate-200 rounded-lg space-y-1">
                        {executionResult.stdout.map((line, i) => (
                          <div key={i} className="text-xs">{line}</div>
                        ))}
                      </div>

                      {/* Detailed test comparisons */}
                      {executionResult.caseResults.length > 0 && (
                        <div className="space-y-2 pt-1 font-sans">
                          {executionResult.caseResults.map((cr, idx) => (
                            <div 
                              key={idx}
                              className={`p-2.5 rounded-lg border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                                cr.passed 
                                  ? 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800' 
                                  : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                {cr.passed ? (
                                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold font-mono">✔ Case {idx + 1}</span>
                                ) : (
                                  <span className="text-rose-600 dark:text-rose-400 font-semibold font-mono">✖ Case {idx + 1}</span>
                                )}
                                <span className="text-slate-500 font-mono truncate max-w-xs">{cr.input}</span>
                              </div>

                              <div className="flex items-center gap-3 text-xs font-mono">
                                <span className="text-slate-500">Expected: <span className="text-slate-800 dark:text-slate-200">{cr.expected}</span></span>
                                <span>·</span>
                                <span className="text-slate-500">Actual: <span className={cr.passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>{cr.actual}</span></span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {bottomTab === 'preview' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span className="flex items-center gap-1.5 font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                      <Globe className="w-3.5 h-3.5" />
                      http://localhost:3000/preview.html
                    </span>
                    <span className="text-[11px] text-slate-400">Live HTML5 / CSS3 / JavaScript Rendering Sandbox</span>
                  </div>

                  <div className="w-full h-80 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white shadow-xs">
                    <iframe
                      title="Laramo Live Web Preview"
                      srcDoc={
                        selectedLanguage === 'css'
                          ? `<!DOCTYPE html><html><head><style>${code}</style></head><body style="margin:20px;font-family:sans-serif;background:#0f172a;color:#fff;"><div class="profile-card"><h3>Styled Element</h3><p>Your CSS is rendering live inside this container.</p><button>Sample Button</button></div></body></html>`
                          : selectedLanguage === 'javascript'
                          ? `<!DOCTYPE html><html><head><style>body{margin:20px;font-family:sans-serif;background:#0f172a;color:#fff;}</style></head><body><div id="app"><h3>JavaScript Web Container</h3><p id="output">Open browser or check output.</p></div><script>${code}</script></body></html>`
                          : code
                      }
                      sandbox="allow-scripts allow-modals"
                      className="w-full h-full border-0 bg-transparent"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
