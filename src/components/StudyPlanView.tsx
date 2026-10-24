import React, { useState } from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  Circle, 
  Flame, 
  Trophy, 
  Zap, 
  Target, 
  Calendar, 
  ArrowRight,
  Sparkles,
  Compass
} from 'lucide-react';
import { UserProgress, StudyPlan } from '../types';
import { STUDY_PLANS } from '../data/studyPlans';
import { calculateLevel } from '../utils/storage';

interface StudyPlanViewProps {
  userProgress: UserProgress;
  onUpdateProgress: (updated: UserProgress) => void;
  onNavigateToChallenge: (challengeId: string) => void;
}

export const StudyPlanView: React.FC<StudyPlanViewProps> = ({
  userProgress,
  onUpdateProgress,
  onNavigateToChallenge
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>(
    userProgress.activeStudyPlanId || STUDY_PLANS[0].id
  );

  const activePlan = STUDY_PLANS.find(p => p.id === selectedPlanId) || STUDY_PLANS[0];
  const levelInfo = calculateLevel(userProgress.xp);

  const toggleItemCompletion = (itemId: string) => {
    const isCompleted = userProgress.completedPlanItemIds.includes(itemId);
    const updatedIds = isCompleted
      ? userProgress.completedPlanItemIds.filter(id => id !== itemId)
      : [...userProgress.completedPlanItemIds, itemId];

    const xpEarned = isCompleted ? -50 : 50;

    onUpdateProgress({
      ...userProgress,
      activeStudyPlanId: selectedPlanId,
      completedPlanItemIds: updatedIds,
      xp: Math.max(0, userProgress.xp + xpEarned)
    });
  };

  const completedCount = activePlan.items.filter(item => 
    userProgress.completedPlanItemIds.includes(item.id)
  ).length;

  const planProgressPercent = Math.round((completedCount / (activePlan.items.length || 1)) * 100);

  // 7-day streak mock calendar
  const weekDays = [
    { day: 'Mon', active: true, date: '19' },
    { day: 'Tue', active: true, date: '20' },
    { day: 'Wed', active: true, date: '21' },
    { day: 'Thu', active: true, date: '22' },
    { day: 'Fri', active: true, date: '23' },
    { day: 'Sat', active: false, date: '24' },
    { day: 'Sun', active: false, date: '25' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Hero Header with Student Visual Asset */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 text-white min-h-[220px] flex flex-col justify-end p-6 sm:p-8">
        <img
          src="/src/assets/images/laramo_hero_student_1792816839032.jpg"
          alt="Laramo student study space"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />

        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <Compass className="w-4 h-4" />
            <span>Personalized Learning Roadmap for IT & Engineering Students</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Curated Study Plans & Progress Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Follow structured paths tailored for Philippine college curriculum and technical interview preparation. Learn at your own pace with offline cloud-synced tracking.
          </p>
        </div>
      </div>

      {/* Progress & Leveling Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Level & XP */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Rank Tier</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
              Level {levelInfo.level}
            </span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {levelInfo.title}
          </div>
          <div className="space-y-1">
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-300" 
                style={{ width: `${levelInfo.progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>{userProgress.xp} XP</span>
              <span>Next: {levelInfo.nextLevelXp} XP</span>
            </div>
          </div>
        </div>

        {/* Card 2: Streak Flame */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Daily Streak</span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-amber-500 tabular-nums">{userProgress.streak}</span>
            <span className="text-xs text-slate-500">days active</span>
          </div>
          <p className="text-xs text-slate-500">
            Keep coding today to protect your streak flame!
          </p>
        </div>

        {/* Card 3: Solved Problems */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Solved Coding Problems</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
              {userProgress.solvedChallengeIds.length}
            </span>
            <span className="text-xs text-slate-500">challenges done</span>
          </div>
          <p className="text-xs text-slate-500">
            Mastering algorithms and web dev across 12 languages.
          </p>
        </div>

        {/* Card 4: Roadmap Completion */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Roadmap Progress</span>
            <Target className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 tabular-nums">
              {planProgressPercent}%
            </span>
            <span className="text-xs text-slate-500">of active track</span>
          </div>
          <p className="text-xs text-slate-500">
            {completedCount} of {activePlan.items.length} modules completed
          </p>
        </div>
      </div>

      {/* Track Selector Tabs */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Choose Your Curriculum Path
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {STUDY_PLANS.map((plan) => {
            const isSelected = plan.id === selectedPlanId;
            return (
              <button
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className={`p-4 rounded-xl text-left border transition-all ${
                  isSelected
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-500 dark:border-emerald-500/80 shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {plan.level}
                  </span>
                  <span className="text-slate-400 tabular-nums">{plan.durationWeeks} Weeks</span>
                </div>
                <div className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                  {plan.title}
                </div>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {plan.tagline}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Roadmap Checklist & Weekly Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Module Checklist (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {activePlan.title}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {activePlan.description}
              </p>
            </div>
            <div className="text-xs font-mono text-slate-500 shrink-0">
              {completedCount} / {activePlan.items.length} Done
            </div>
          </div>

          {/* Module items list */}
          <div className="space-y-3">
            {activePlan.items.map((item, index) => {
              const isDone = userProgress.completedPlanItemIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isDone
                      ? 'bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800/80 opacity-80'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <button
                      onClick={() => toggleItemCompletion(item.id)}
                      className="mt-0.5 text-left flex items-start gap-3 group"
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 dark:text-slate-700 shrink-0 mt-0.5 group-hover:text-emerald-500 transition-colors" />
                      )}
                      <div>
                        <div className={`text-sm font-semibold ${isDone ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                          {item.title}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                          {item.description}
                        </div>
                      </div>
                    </button>

                    <div className="text-[11px] font-mono text-slate-400 shrink-0">
                      ~{item.estimatedHours} hrs
                    </div>
                  </div>

                  {/* Topic tags and challenge links */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/60 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      {item.topics.map((t, i) => (
                        <span key={i}>
                          {t}{i < item.topics.length - 1 ? ' · ' : ''}
                        </span>
                      ))}
                    </div>

                    {item.challengeIds.length > 0 && (
                      <div className="flex items-center gap-2">
                        {item.challengeIds.map((cId) => (
                          <button
                            key={cId}
                            onClick={() => onNavigateToChallenge(cId)}
                            className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-medium"
                          >
                            <span>Solve Exercise</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weekly Activity & Study Streak Widget (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-500" />
                This Week's Activity
              </span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                5 of 7 Days Active
              </span>
            </div>

            {/* Week days row */}
            <div className="grid grid-cols-7 gap-1.5 text-center">
              {weekDays.map((w, idx) => (
                <div 
                  key={idx} 
                  className={`p-2 rounded-lg border text-xs flex flex-col items-center gap-1 ${
                    w.active
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="text-[10px] uppercase font-semibold">{w.day}</span>
                  <span className="font-mono text-xs">{w.date}</span>
                  {w.active ? (
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                  )}
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 leading-relaxed">
              Coding for just 30 minutes every day compounds into mastery. Complete your daily roadmap lesson to earn bonus streak points.
            </div>
          </div>

          {/* Quick IT Student Tips */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
            <span className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              IT College Success Habit
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Don't just copy-paste solutions! Write code line-by-line, understand memory management and edge cases, and push your daily progress to GitHub for your future tech portfolio.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
