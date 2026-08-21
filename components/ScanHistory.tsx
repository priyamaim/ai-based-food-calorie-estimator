'use client';

import React from 'react';
import { X, Trash2, Calendar, Flame, ChevronRight, History, Utensils } from 'lucide-react';
import { MealScanItem } from '@/types/nutrition';

interface ScanHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  history: MealScanItem[];
  onSelectScan: (item: MealScanItem) => void;
  onClearHistory: () => void;
  onDeleteScan: (id: string) => void;
}

export const ScanHistory: React.FC<ScanHistoryProps> = ({
  isOpen,
  onClose,
  history,
  onSelectScan,
  onClearHistory,
  onDeleteScan,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-modal w-full max-w-md h-full p-6 shadow-2xl border-l border-slate-800 text-white flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Utensils className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">Saved Meal Log</h3>
                <p className="text-xs text-slate-400">Past NutriSnap AI scans ({history.length})</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition rounded-xl p-1.5 hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List of items */}
          {history.length === 0 ? (
            <div className="py-16 text-center text-slate-500 space-y-3">
              <History className="w-12 h-12 mx-auto text-slate-700 opacity-50" />
              <p className="text-xs font-semibold">No saved meal scans yet.</p>
              <p className="text-[11px] text-slate-600">Scan a meal photo to build your log!</p>
            </div>
          ) : (
            <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-180px)] pr-1">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="group relative rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 p-3.5 flex items-center gap-3.5 transition cursor-pointer active:scale-[0.99]"
                  onClick={() => {
                    onSelectScan(item);
                    onClose();
                  }}
                >
                  <img
                    src={item.imageUri}
                    alt={item.analysis.food_name}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-800 shrink-0 shadow-sm"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">
                      {item.analysis.food_name}
                    </h4>

                    <div className="flex items-center gap-2.5 mt-1">
                      <span className="text-xs font-black text-emerald-400 flex items-center gap-0.5">
                        <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        {item.analysis.total_calories} kcal
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {new Date(item.timestamp).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1 font-semibold">
                      <span className="text-emerald-400">P: {item.analysis.protein_g}g</span>
                      <span className="text-amber-400">C: {item.analysis.carbs_g}g</span>
                      <span className="text-rose-400">F: {item.analysis.fat_g}g</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteScan(item.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 transition p-1.5 rounded-lg hover:bg-slate-800"
                    title="Delete item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 transition" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Clear Log Button */}
        {history.length > 0 && (
          <div className="pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClearHistory}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 text-xs font-semibold transition"
            >
              <Trash2 className="w-4 h-4" />
              Clear Log History
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
