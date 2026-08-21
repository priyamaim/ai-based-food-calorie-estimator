'use client';

import React from 'react';
import {
  Flame,
  Dumbbell,
  Wheat,
  Droplet,
  Sparkles,
  ShieldCheck,
  Check,
  Bookmark,
  RotateCcw,
  HeartPulse,
  PieChart,
} from 'lucide-react';
import { NutritionalAnalysis } from '@/types/nutrition';

interface NutritionalResultCardProps {
  analysis: NutritionalAnalysis;
  imagePreviewUrl?: string;
  onReset: () => void;
  onSaveToHistory?: () => void;
  isSaved?: boolean;
}

export const NutritionalResultCard: React.FC<NutritionalResultCardProps> = ({
  analysis,
  imagePreviewUrl,
  onReset,
  onSaveToHistory,
  isSaved = false,
}) => {
  const {
    food_name,
    total_calories,
    protein_g,
    carbs_g,
    fat_g,
    confidence_score,
    health_tip,
  } = analysis;

  // Calculate macro calories and percentages
  const proteinCal = protein_g * 4;
  const carbsCal = carbs_g * 4;
  const fatCal = fat_g * 9;
  const computedMacroCalSum = proteinCal + carbsCal + fatCal || 1;

  const proteinPct = Math.round((proteinCal / computedMacroCalSum) * 100);
  const carbsPct = Math.round((carbsCal / computedMacroCalSum) * 100);
  const fatPct = Math.max(0, 100 - proteinPct - carbsPct);

  // Confidence score badge styling
  const confidenceLower = (confidence_score || 'medium').toLowerCase();
  let confidenceBg = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
  if (confidenceLower.includes('low')) {
    confidenceBg = 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
  } else if (confidenceLower.includes('medium')) {
    confidenceBg = 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20';
  }

  return (
    <div className="w-full max-w-xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-300">
      {/* Main Apple Health Result Card */}
      <div className="ios-card overflow-hidden p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 relative">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Dish Title & Calorie Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
            {imagePreviewUrl && (
              <img
                src={imagePreviewUrl}
                alt={food_name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-200 dark:border-slate-800 shadow-md shrink-0"
              />
            )}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {food_name}
                </h2>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${confidenceBg}`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {confidence_score} Confidence
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                MyFitnessPal AI Food Diary Entry
              </p>
            </div>
          </div>

          {/* Big Energy Calorie Box */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/20 border border-orange-200 dark:border-orange-900/40 text-orange-500 shadow-sm shrink-0">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500 text-white shadow-md shadow-orange-500/20">
              <Flame className="w-6 h-6 fill-white" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-none">
                {total_calories}
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Total Energy (kcal)
              </span>
            </div>
          </div>
        </div>

        {/* Combined Segmented Macro Bar */}
        <div className="pt-6 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5 uppercase tracking-wider">
              <PieChart className="w-4 h-4 text-orange-500" /> Macro Energy Share
            </span>
            <span>100% Calorie Breakdown</span>
          </div>

          <div className="flex h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden p-0.5 gap-0.5">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${proteinPct}%` }}
              title={`Protein: ${proteinPct}%`}
            />
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${carbsPct}%` }}
              title={`Carbs: ${carbsPct}%`}
            />
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${fatPct}%` }}
              title={`Fat: ${fatPct}%`}
            />
          </div>
        </div>

        {/* Individual Macro Progress Cards */}
        <div className="pt-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* Protein Card */}
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-950/60 p-4 border border-slate-100 dark:border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                  <Dumbbell className="w-4 h-4" /> Protein
                </span>
                <span className="font-mono font-extrabold text-slate-900 dark:text-white">{protein_g}g</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full animate-macro-fill"
                  style={{ width: `${Math.max(6, proteinPct)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                <span>{proteinCal} kcal</span>
                <span>{proteinPct}%</span>
              </div>
            </div>

            {/* Carbs Card */}
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-950/60 p-4 border border-slate-100 dark:border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400">
                  <Wheat className="w-4 h-4" /> Carbs
                </span>
                <span className="font-mono font-extrabold text-slate-900 dark:text-white">{carbs_g}g</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full animate-macro-fill"
                  style={{ width: `${Math.max(6, carbsPct)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                <span>{carbsCal} kcal</span>
                <span>{carbsPct}%</span>
              </div>
            </div>

            {/* Fats Card */}
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-950/60 p-4 border border-slate-100 dark:border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-bold text-indigo-600 dark:text-indigo-400">
                  <Droplet className="w-4 h-4" /> Fats
                </span>
                <span className="font-mono font-extrabold text-slate-900 dark:text-white">{fat_g}g</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full animate-macro-fill"
                  style={{ width: `${Math.max(6, fatPct)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                <span>{fatCal} kcal</span>
                <span>{fatPct}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Health Tip Box */}
        {health_tip && (
          <div className="mt-6 rounded-2xl bg-orange-50/80 dark:bg-orange-950/30 p-4 border border-orange-200 dark:border-orange-900/40 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-orange-500 text-white shrink-0 shadow-md">
              <HeartPulse className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-orange-900 dark:text-orange-300 uppercase tracking-wider mb-1">
                Apple Health AI Insight
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                {health_tip}
              </p>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col xs:flex-row items-center justify-between gap-3">
          {onSaveToHistory && (
            <button
              type="button"
              onClick={onSaveToHistory}
              disabled={isSaved}
              className={`w-full xs:w-auto flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border text-xs font-bold transition active:scale-95 ${
                isSaved
                  ? 'border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" /> Saved to Food Diary
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4 text-orange-500" /> Log Meal Entry
                </>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={onReset}
            className="w-full xs:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold shadow-lg shadow-orange-500/20 transition active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            Scan Another Meal
          </button>
        </div>
      </div>
    </div>
  );
};
