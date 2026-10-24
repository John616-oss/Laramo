import React, { useState } from 'react';
import { 
  Cloud, 
  CloudOff, 
  RefreshCw, 
  Download, 
  Upload, 
  CheckCircle2, 
  X, 
  ShieldCheck, 
  AlertTriangle,
  HardDrive
} from 'lucide-react';
import { UserProgress } from '../types';
import { 
  exportProgressToJson, 
  saveUserProgress, 
  markCloudSyncNow, 
  getLastCloudSyncTime 
} from '../utils/storage';

interface CloudSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProgress: UserProgress;
  onUpdateProgress: (updated: UserProgress) => void;
  isSimulatedOffline: boolean;
  setIsSimulatedOffline: (val: boolean) => void;
}

export const CloudSyncModal: React.FC<CloudSyncModalProps> = ({
  isOpen,
  onClose,
  userProgress,
  onUpdateProgress,
  isSimulatedOffline,
  setIsSimulatedOffline
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<string>(getLastCloudSyncTime() || 'Not synced yet');

  if (!isOpen) return null;

  const handleManualSync = () => {
    if (isSimulatedOffline) {
      setSyncMessage('Cannot sync while in Offline Mode. Switch to Online mode first.');
      return;
    }

    setIsSyncing(true);
    setSyncMessage(null);

    setTimeout(() => {
      const now = markCloudSyncNow();
      setLastSync(now);
      setIsSyncing(false);
      setSyncMessage('Successfully backed up and synchronized with Laramo Cloud Node (Asia-East/Manila)!');
    }, 750);
  };

  const handleExport = () => {
    exportProgressToJson(userProgress);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.userId && Array.isArray(parsed.solvedChallengeIds)) {
          onUpdateProgress(parsed);
          saveUserProgress(parsed);
          setSyncMessage('Backup restored successfully!');
        } else {
          setSyncMessage('Invalid Laramo backup JSON structure.');
        }
      } catch {
        setSyncMessage('Failed to parse backup JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
              <Cloud className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Cloud Sync & Offline Persistence
              </h2>
              <p className="text-xs text-slate-500">
                Tuloy-tuloy ang aral kahit mahina o walang internet connection.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Network & Offline Toggle Card */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isSimulatedOffline ? (
                <CloudOff className="w-4 h-4 text-amber-500" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              )}
              <span className="text-xs font-semibold text-slate-900 dark:text-white">
                {isSimulatedOffline ? 'Offline Mode (Local-First)' : 'Online & Connected to Cloud'}
              </span>
            </div>

            <button
              onClick={() => {
                setIsSimulatedOffline(!isSimulatedOffline);
                setSyncMessage(null);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                isSimulatedOffline
                  ? 'bg-amber-600 text-white hover:bg-amber-500'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {isSimulatedOffline ? 'Go Online' : 'Simulate Offline'}
            </button>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            {isSimulatedOffline
              ? 'Naka-save ang lahat ng iyong code drafts at streak nang lokal sa browser (LocalStorage & Cache). Hindi mawawala ang iyong mga ginawa kahit walang WiFi.'
              : 'Aktibo ang cloud synchronization. Awtomatikong nagba-backup ang iyong progress sa server kapag natapos ang coding challenges.'}
          </p>
        </div>

        {/* Cloud Sync Status */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Last Synced:</span>
            <span className="font-mono text-slate-800 dark:text-slate-200">
              {new Date(lastSync).toLocaleString()}
            </span>
          </div>

          <button
            onClick={handleManualSync}
            disabled={isSyncing || isSimulatedOffline}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Synchronizing with Cloud Node...' : 'Sync to Cloud Now'}</span>
          </button>

          {syncMessage && (
            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300">
              {syncMessage}
            </div>
          )}
        </div>

        {/* Data Backup & Restore */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Manual Backup & Restore
          </span>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={handleExport}
              className="flex items-center justify-center gap-1.5 p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>

            <label className="flex items-center justify-center gap-1.5 p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>Import JSON</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
