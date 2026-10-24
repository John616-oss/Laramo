import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  RotateCcw, 
  Shuffle, 
  Cpu, 
  Clock, 
  Database,
  ArrowRight
} from 'lucide-react';
import { VisualizerAlgorithm } from '../types';
import { 
  DSA_TOPICS, 
  generateBubbleSortSteps, 
  generateSelectionSortSteps, 
  generateBinarySearchSteps, 
  generateTwoPointersSteps,
  AlgorithmStep
} from '../data/dsaTopics';

export const DSAVisualizer: React.FC = () => {
  const [selectedAlgo, setSelectedAlgo] = useState<VisualizerAlgorithm>('bubble-sort');
  const [arraySize, setArraySize] = useState<number>(10);
  const [array, setArray] = useState<number[]>([45, 12, 85, 32, 89, 39, 69, 44, 42, 1]);
  const [targetVal, setTargetVal] = useState<number>(44);
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMs, setSpeedMs] = useState<number>(600);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentTopic = DSA_TOPICS.find(t => t.id === selectedAlgo) || DSA_TOPICS[0];

  // Generate randomized array
  const handleRandomize = () => {
    setIsPlaying(false);
    let newArr: number[];
    if (selectedAlgo === 'binary-search' || selectedAlgo === 'two-pointers') {
      // Must be sorted
      const set = new Set<number>();
      while (set.size < arraySize) {
        set.add(Math.floor(Math.random() * 95) + 5);
      }
      newArr = Array.from(set).sort((a, b) => a - b);
      const randomTarget = newArr[Math.floor(Math.random() * newArr.length)];
      setTargetVal(randomTarget);
    } else {
      newArr = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 90) + 10);
    }
    setArray(newArr);
  };

  // Recompute steps whenever algorithm or array changes
  useEffect(() => {
    let generated: AlgorithmStep[] = [];
    if (selectedAlgo === 'bubble-sort') {
      generated = generateBubbleSortSteps(array);
    } else if (selectedAlgo === 'selection-sort') {
      generated = generateSelectionSortSteps(array);
    } else if (selectedAlgo === 'binary-search') {
      const sorted = [...array].sort((a, b) => a - b);
      generated = generateBinarySearchSteps(sorted, targetVal);
    } else if (selectedAlgo === 'two-pointers') {
      const sorted = [...array].sort((a, b) => a - b);
      const targetSum = sorted[1] + sorted[sorted.length - 2];
      setTargetVal(targetSum);
      generated = generateTwoPointersSteps(sorted, targetSum);
    } else {
      generated = generateBubbleSortSteps(array);
    }

    setSteps(generated);
    setCurrentStepIdx(0);
    setIsPlaying(false);
  }, [selectedAlgo, array, targetVal]);

  // Handle Playback Interval
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speedMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, speedMs, steps.length]);

  const currentStep = steps[currentStepIdx] || {
    array,
    comparingIndices: [],
    sortedIndices: [],
    description: 'Ready to run.'
  };

  const handleStepForward = () => {
    if (currentStepIdx < steps.length - 1) {
      setCurrentStepIdx(prev => prev + 1);
    }
  };

  const handleStepBack = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIdx(0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header section with concept visual */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <Cpu className="w-4 h-4" />
            <span>Interactive Data Structures & Algorithms Lab</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {currentTopic.title} Step-by-Step Simulator
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {currentTopic.description}
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5" /> Best: {currentTopic.timeBest}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5" /> Average: {currentTopic.timeAverage}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5" /> Worst: {currentTopic.timeWorst}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1 font-mono">
              <Database className="w-3.5 h-3.5" /> Space: {currentTopic.spaceComplexity}
            </span>
          </div>
        </div>

        {/* Thumbnail preview */}
        <div className="w-full md:w-64 h-36 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shrink-0 relative bg-slate-950">
          <img
            src="/src/assets/images/laramo_dsa_concept_1792816839510.jpg"
            alt="Data Structures & Algorithms visualization diagram"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-2.5">
            <span className="text-[11px] font-mono text-emerald-400 font-medium">O(log n) Graph / Tree Trace</span>
          </div>
        </div>
      </div>

      {/* Algorithm Selector Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {DSA_TOPICS.map((topic) => (
          <button
            key={topic.id}
            onClick={() => setSelectedAlgo(topic.id)}
            className={`px-3.5 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              selectedAlgo === topic.id
                ? 'bg-slate-900 text-white dark:bg-emerald-600 dark:text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {topic.title}
          </button>
        ))}
      </div>

      {/* Main Simulation Stage & Control Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Visual Stage (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            {/* Playback buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-colors"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </button>

              <button
                onClick={handleStepBack}
                disabled={currentStepIdx === 0}
                title="Step backward"
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors text-slate-700 dark:text-slate-300"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={handleStepForward}
                disabled={currentStepIdx >= steps.length - 1}
                title="Step forward"
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors text-slate-700 dark:text-slate-300"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              <button
                onClick={handleReset}
                title="Reset to beginning"
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={handleRandomize}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>Shuffle</span>
              </button>
            </div>

            {/* Speed & Steps counter */}
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <span>Speed:</span>
                <select
                  value={speedMs}
                  onChange={(e) => setSpeedMs(Number(e.target.value))}
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2 py-1 text-xs text-slate-700 dark:text-slate-300"
                >
                  <option value={1000}>0.5x (Slow)</option>
                  <option value={600}>1.0x (Normal)</option>
                  <option value={250}>2.5x (Fast)</option>
                  <option value={100}>5.0x (Turbo)</option>
                </select>
              </div>

              <span className="font-mono tabular-nums">
                Step {currentStepIdx + 1} / {steps.length}
              </span>
            </div>
          </div>

          {/* Interactive Visual Canvas: Animated Bars */}
          <div className="h-64 sm:h-72 flex items-end justify-center gap-2 sm:gap-3 px-4 py-2 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl relative">
            {currentStep.array.map((value, idx) => {
              const isComparing = currentStep.comparingIndices.includes(idx);
              const isSwapped = currentStep.swappedIndices?.includes(idx);
              const isSorted = currentStep.sortedIndices.includes(idx);

              // Determine bar color
              let barColor = 'bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
              if (isSwapped) {
                barColor = 'bg-rose-500 text-white shadow-md scale-105';
              } else if (isComparing) {
                barColor = 'bg-amber-500 text-white shadow-md scale-105';
              } else if (isSorted) {
                barColor = 'bg-emerald-600 text-white';
              }

              // Pointers check
              const pointerLabels: string[] = [];
              if (currentStep.pointers) {
                for (const [key, val] of Object.entries(currentStep.pointers)) {
                  if (val === idx) pointerLabels.push(key);
                }
              }

              const heightPercent = Math.max(12, Math.min(100, Math.round((value / 100) * 100)));

              return (
                <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full relative group">
                  {/* Floating pointer tag */}
                  {pointerLabels.length > 0 && (
                    <div className="absolute -top-7 text-[10px] font-mono font-bold uppercase bg-slate-900 text-emerald-400 px-1.5 py-0.5 rounded shadow">
                      {pointerLabels.join(', ')}
                    </div>
                  )}

                  {/* The bar element */}
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-md flex items-end justify-center pb-1.5 font-mono text-xs font-semibold transition-all duration-200 ${barColor}`}
                  >
                    <span className="text-[11px] tabular-nums select-none">{value}</span>
                  </div>

                  {/* Index label */}
                  <div className="text-[10px] font-mono text-slate-400 mt-1 select-none">
                    [{idx}]
                  </div>
                </div>
              );
            })}
          </div>

          {/* Current Step Description Card */}
          <div className="p-4 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-start gap-3">
            <div className="p-1.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-lg shrink-0 mt-0.5">
              <ArrowRight className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-900 dark:text-white">
                Step Observation:
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-0.5">
                {currentStep.description}
              </div>
            </div>
          </div>
        </div>

        {/* Algorithm Logic & Pseudocode Deck (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Pseudocode Tracker */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
            <h3 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
              Pseudocode Architecture
            </h3>
            <div className="p-3 bg-[#181818] text-slate-200 rounded-lg font-mono text-xs space-y-1 overflow-x-auto">
              {currentTopic.pseudocode.map((line, idx) => (
                <div key={idx} className="leading-5">
                  <span className="text-slate-600 select-none mr-2">{idx + 1}</span>
                  <span>{line}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Deep-dive Concept Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
            <h3 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
              Key Insight for IT Students
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {currentTopic.conceptSummary}
            </p>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>In-Place Memory:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">Yes (O(1))</span>
              </div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>Stability:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {selectedAlgo === 'selection-sort' ? 'Unstable' : 'Stable'}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>Best used when:</span>
                <span className="text-slate-700 dark:text-slate-300 text-right">
                  {selectedAlgo === 'binary-search' ? 'Array is sorted' : 'Educational demonstration'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
