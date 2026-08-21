'use client';

import React from 'react';
import { Camera, History, Key, Home } from 'lucide-react';

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
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t border-slate-800 bg-slate-950/90 backdrop-blur-xl px-6 py-2">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Home */}
        <button
          onClick={onHomeClick}
          className={`flex flex-col items-center gap-1 transition ${
            activeTab === 'home'
              ? 'text-emerald-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium">Dashboard</span>
        </button>

        {/* Center Snap Button */}
        <button
          onClick={onScanClick}
          className="flex flex-col items-center -mt-6 transition group"
        >
          <div className="flex h-13 w-13 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 text-slate-950 shadow-lg shadow-emerald-500/30 group-active:scale-95 transition-transform">
            <Camera className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className="text-[10px] font-bold text-emerald-400 mt-1">Scan Dish</span>
        </button>

        {/* History */}
        <button
          onClick={onHistoryClick}
          className="relative flex flex-col items-center gap-1 text-slate-400 hover:text-slate-200 transition"
        >
          <History className="w-5 h-5" />
          <span className="text-[10px] font-medium">Meal Log</span>
          {historyCount > 0 && (
            <span className="absolute -top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-500 px-1 text-[9px] font-extrabold text-slate-950">
              {historyCount}
            </span>
          )}
        </button>

        {/* Key Settings */}
        <button
          onClick={onSettingsClick}
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-200 transition"
        >
          <Key className="w-5 h-5" />
          <span className="text-[10px] font-medium">API Key</span>
        </button>
      </div>
    </nav>
  );
};
