'use client';

import React from 'react';
import { Camera, History, Key, Home, PlusCircle } from 'lucide-react';

interface MobileBottomNavProps {
  onScanClick: () => void;
  onHistoryClick: () => void;
  onSettingsClick: () => void;
  onHomeClick: () => void;
  activeTab: 'home' | 'history' | 'settings';
  historyCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onScanClick,
  onHistoryClick,
  onSettingsClick,
  onHomeClick,
  activeTab,
  historyCount,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 sm:hidden border-t border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl px-6 py-2">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Home */}
        <button
          onClick={onHomeClick}
          className={`flex flex-col items-center gap-1 transition ${
            activeTab === 'home'
              ? 'text-orange-500 font-bold'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium">Home</span>
        </button>

        {/* Big Center Snap Button */}
        <button
          onClick={onScanClick}
          className="flex flex-col items-center -mt-6 transition group"
        >
          <div className="flex h-13 w-13 items-center justify-center rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 text-white shadow-lg shadow-orange-500/30 group-active:scale-95 transition-transform">
            <Camera className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-bold text-orange-500 mt-1">Scan Meal</span>
        </button>

        {/* History */}
        <button
          onClick={onHistoryClick}
          className="relative flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition"
        >
          <History className="w-5 h-5" />
          <span className="text-[10px] font-medium">Diary Log</span>
          {historyCount > 0 && (
            <span className="absolute -top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-500 px-1 text-[9px] font-extrabold text-white">
              {historyCount}
            </span>
          )}
        </button>

        {/* API Settings */}
        <button
          onClick={onSettingsClick}
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition"
        >
          <Key className="w-5 h-5" />
          <span className="text-[10px] font-medium">Key Config</span>
        </button>
      </div>
    </nav>
  );
};
