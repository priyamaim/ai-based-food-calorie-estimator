'use client';

import React from 'react';
import { Flame, Key, History, Camera, Sparkles } from 'lucide-react';

interface HeaderProps {
  hasCustomKey: boolean;
  onOpenSettings: () => void;
  onToggleHistory: () => void;
  onScanDishClick: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  hasCustomKey,
  onOpenSettings,
  onToggleHistory,
  onScanDishClick,
  historyCount,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-purple-950/60 bg-[#09090b]/85 backdrop-blur-xl px-4 py-3 sm:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Custom NutriSnap AI Logo Badge - Black & Purple */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 via-violet-500 to-fuchsia-500 text-white font-black shadow-lg shadow-purple-500/25">
            <Flame className="h-6 w-6 fill-white text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight text-white sm:text-xl">
                Nutri<span className="bg-gradient-to-r from-purple-400 via-violet-300 to-fuchsia-400 bg-clip-text text-transparent">Snap AI</span>
              </h1>
              {/* Clean Status Indicator: AI Engine Ready */}
              <div className="hidden xs:flex items-center gap-1.5 rounded-full bg-purple-500/10 px-2.5 py-0.5 text-[11px] font-bold text-purple-400 border border-purple-500/20">
                <span className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
                <span>AI Engine Ready</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 hidden md:block">
              Standalone Image-to-Nutritional Calorie Estimator
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Quick Scan Dish Action Button */}
          <button
            onClick={onScanDishClick}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 px-3.5 py-2 text-xs font-extrabold text-white transition shadow-md shadow-purple-500/25 active:scale-95"
          >
            <Camera className="h-4 w-4 stroke-[2.5]" />
            <span className="hidden xs:inline">Scan Dish</span>
          </button>

          {/* API Key Modal Trigger */}
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 rounded-xl border border-purple-900/40 bg-purple-950/30 px-3 py-2 text-xs font-semibold text-purple-200 hover:bg-purple-900/50 transition active:scale-95"
            title="Configure Gemini API Key"
          >
            <Key className="h-3.5 w-3.5 text-purple-400" />
            <span className="hidden sm:inline">
              {hasCustomKey ? 'Custom Key' : 'Server Key'}
            </span>
          </button>

          {/* Meal Log History Toggle */}
          <button
            onClick={onToggleHistory}
            className="relative flex items-center gap-1.5 rounded-xl border border-purple-900/40 bg-purple-950/30 px-3 py-2 text-xs font-semibold text-purple-200 hover:bg-purple-900/50 transition active:scale-95"
          >
            <History className="h-3.5 w-3.5 text-violet-400" />
            <span className="hidden sm:inline">Log</span>
            {historyCount > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-purple-500 px-1 text-[10px] font-bold text-white">
                {historyCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
