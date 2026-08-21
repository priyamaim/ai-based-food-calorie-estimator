'use client';

import React from 'react';
import { Flame, Key, History, Sparkles, User } from 'lucide-react';

interface HeaderProps {
  hasCustomKey: boolean;
  onOpenSettings: () => void;
  onToggleHistory: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  hasCustomKey,
  onOpenSettings,
  onToggleHistory,
  historyCount,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl px-4 py-3.5 sm:px-8">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        {/* Brand Logo - Apple Health style */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-orange-500 via-amber-500 to-yellow-400 shadow-md shadow-orange-500/20 text-white">
            <Flame className="h-6 w-6 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                Nutri<span className="text-orange-500">Snap</span>
              </h1>
              <span className="rounded-full bg-orange-500/10 dark:bg-orange-500/20 px-2.5 py-0.5 text-[10px] font-bold text-orange-600 dark:text-orange-400 border border-orange-500/20">
                Health AI
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block font-medium">
              Apple Health &amp; MyFitnessPal Vision AI
            </p>
          </div>
        </div>

        {/* Desktop / Tablet Controls */}
        <div className="flex items-center gap-2.5">
          {/* Active Key Status Badge */}
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900/80 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 transition hover:border-slate-300 dark:hover:border-slate-700 active:scale-95"
            title="Configure Gemini API Key"
          >
            <Key className="h-4 w-4 text-orange-500" />
            <span className="hidden xs:inline">
              {hasCustomKey ? 'Custom API Key' : 'Server Default'}
            </span>
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </button>

          {/* Diary Log History Button */}
          <button
            onClick={onToggleHistory}
            className="relative flex items-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900/80 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 transition hover:border-slate-300 dark:hover:border-slate-700 active:scale-95"
          >
            <History className="h-4 w-4 text-amber-500" />
            <span className="hidden sm:inline">Food Diary</span>
            {historyCount > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-extrabold text-white">
                {historyCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
