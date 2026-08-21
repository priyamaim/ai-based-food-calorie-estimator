'use client';

import React from 'react';
import { Sparkles, Key, History, Flame } from 'lucide-react';

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
    <header className="sticky top-0 z-40 w-full border-b border-gray-800/80 bg-gray-950/80 backdrop-blur-md px-4 py-3 sm:px-6">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 shadow-lg shadow-emerald-500/20">
            <Flame className="h-6 w-6 text-gray-950 fill-gray-950" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg font-bold tracking-tight text-white sm:text-xl">
                Nutri<span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">Snap</span>
              </h1>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                AI 3.6
              </span>
            </div>
            <p className="text-[11px] text-gray-400 hidden sm:block">
              Instant AI Food Calorie & Nutrient Estimator
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Active Key Status Badge */}
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 rounded-lg border border-gray-800 bg-gray-900/80 px-2.5 py-1.5 text-xs text-gray-300 transition hover:border-gray-700 hover:bg-gray-800/80"
            title="Configure Gemini API Key"
          >
            <Key className="h-3.5 w-3.5 text-emerald-400" />
            <span className="hidden xs:inline">
              {hasCustomKey ? 'Custom Key' : 'Server Key'}
            </span>
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>

          {/* History Button */}
          <button
            onClick={onToggleHistory}
            className="relative flex items-center gap-1.5 rounded-lg border border-gray-800 bg-gray-900/80 px-3 py-1.5 text-xs font-medium text-gray-300 transition hover:border-gray-700 hover:bg-gray-800/80"
          >
            <History className="h-3.5 w-3.5 text-teal-400" />
            <span className="hidden sm:inline">History</span>
            {historyCount > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-teal-500 px-1 text-[10px] font-bold text-gray-950">
                {historyCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
