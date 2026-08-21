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
  Utensils,
  PieChart,
  ListFilter,
  Camera,
} from 'lucide-react';
import { NutritionalAnalysis } from '@/types/nutrition';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';

interface ResultsDashboardProps {
  analysis: NutritionalAnalysis | null;
  imagePreviewUrl?: string;
  isProcessing: boolean;
  onReset: () => void;
  onSaveToHistory?: () => void;
  isSaved?: boolean;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  analysis,
  imagePreviewUrl,
  isProcessing,
  onReset,
  onSaveToHistory,
  isSaved = false,
}) => {
  // 1. LOADING STATE
  if (isProcessing) {
    return <LoadingSkeleton imagePreviewUrl={imagePreviewUrl} />;
  }

  // 2. EMPTY STATE
  if (!analysis) {
    return (
      <div className="glass-card rounded-3xl p-8 sm:p-12 border border-slate-800 text-center space-y-6 bg-slate-900/80 text-white min-h-[420px] flex flex-col items-center justify-center relative overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-800/80 border border-slate-700 text-emerald-400 shadow-xl">
          <Utensils className="h-10 w-10 text-emerald-400" />
        </div>

        <div className="space-y-2 max-w-sm">
          <h3 className="text-xl font-bold text-white tracking-tight">No Meal Analyzed Yet</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Snap or upload a food photo using the input panel on the left, then click <strong className="text-emerald-400">Analyze Meal</strong> to reveal caloric &amp; macro breakdown.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-[11px] font-semibold text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Powered by Gemini 3.6 Flash AI Engine</span>
        </div>
      </div>
    );
  }

  // 3. ANALYZED STATE
  const {
    food_name,
    total_calories,
    protein_g,
    carbs_g,
    fat_g,
    confidence_score,
    health_tip,
    items = [],
  } = analysis;

  const proteinCal = protein_g * 4;
  const carbsCal = carbs_g * 4;
  const fatCal = fat_g * 9;
  const computedSum = proteinCal + carbsCal + fatCal || 1;

  const proteinPct = Math.round((proteinCal / computedSum) * 100);
  const carbsPct = Math.round((carbsCal / computedSum) * 100);
  const fatPct = Math.max(0, 100 - proteinPct - carbsPct);

  let confidenceBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  if ((confidence_score || '').toLowerCase().includes('low')) {
    confidenceBg = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  } else if ((confidence_score || '').toLowerCase().includes('medium')) {
    confidenceBg = 'bg-teal-500/10 text-teal-300 border-teal-500/20';
  }

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
      {/* Hero Calorie Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-7 border border-emerald-500/30 bg-slate-900/90 text-white relative overflow-hidden">
        {/* Glow circle */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div className="flex items-center gap-3.5">
            {imagePreviewUrl && (
              <img
                src={imagePreviewUrl}
                alt={food_name}
                className="w-16 h-16 rounded-2xl object-cover border border-slate-800 shrink-0 shadow-md"
              />
            )}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-black text-white tracking-tight">{food_name}</h2>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${confidenceBg}`}>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {confidence_score} Confidence
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">NutriSnap AI Vision Analysis</p>
            </div>
          </div>

          {/* Calorie Display Box */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-lg shrink-0">
            <Flame className="w-7 h-7 text-amber-400 fill-amber-400/30" />
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white leading-none">
                {total_calories}
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Total Calories (kcal)
              </span>
            </div>
          </div>
        </div>

        {/* Macronutrient Grid */}
        <div className="pt-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span className="flex items-center gap-1.5 uppercase tracking-wider">
              <PieChart className="w-4 h-4 text-emerald-400" /> Macronutrient Ratio
            </span>
            <span>Protein • Carbs • Fats</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Protein */}
            <div className="rounded-2xl bg-slate-950/80 p-3.5 border border-emerald-500/20 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-bold text-emerald-400">
                  <Dumbbell className="w-4 h-4" /> Protein
                </span>
                <span className="font-mono font-bold text-white">{protein_g}g</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full animate-macro-fill"
                  style={{ width: `${Math.max(6, proteinPct)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>{proteinCal} kcal</span>
                <span>{proteinPct}%</span>
              </div>
            </div>

            {/* Carbs */}
            <div className="rounded-2xl bg-slate-950/80 p-3.5 border border-amber-500/20 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-bold text-amber-400">
                  <Wheat className="w-4 h-4" /> Carbs
                </span>
                <span className="font-mono font-bold text-white">{carbs_g}g</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full animate-macro-fill"
                  style={{ width: `${Math.max(6, carbsPct)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>{carbsCal} kcal</span>
                <span>{carbsPct}%</span>
              </div>
            </div>

            {/* Fats */}
            <div className="rounded-2xl bg-slate-950/80 p-3.5 border border-rose-500/20 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-bold text-rose-400">
                  <Droplet className="w-4 h-4" /> Fats
                </span>
                <span className="font-mono font-bold text-white">{fat_g}g</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full animate-macro-fill"
                  style={{ width: `${Math.max(6, fatPct)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>{fatCal} kcal</span>
                <span>{fatPct}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Itemized Breakdown Table */}
      {items && items.length > 0 && (
        <div className="glass-card rounded-3xl p-6 border border-slate-800 bg-slate-900/90 text-white space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <ListFilter className="w-4 h-4 text-emerald-400" /> Itemized Ingredient Breakdown
            </h3>
            <span className="text-[11px] text-slate-500">{items.length} items identified</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800/80 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="pb-2">Food / Component</th>
                  <th className="pb-2">Est. Weight / Portion</th>
                  <th className="pb-2 text-right">Calories</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition">
                    <td className="py-2.5 text-white font-bold">{item.name}</td>
                    <td className="py-2.5 text-slate-300">{item.portion}</td>
                    <td className="py-2.5 text-right font-mono font-bold text-emerald-400">
                      {item.calories} kcal
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* AI Health Insight */}
      {health_tip && (
        <div className="glass-card rounded-2xl p-4 border border-emerald-500/20 bg-emerald-950/20 text-white flex items-start gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
            <HeartPulse className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1">
              NutriSnap AI Health Insight
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{health_tip}</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col xs:flex-row items-center justify-between gap-3 pt-2">
        {onSaveToHistory && (
          <button
            type="button"
            onClick={onSaveToHistory}
            disabled={isSaved}
            className={`w-full xs:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition ${
              isSaved
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                : 'border-slate-800 bg-slate-900/90 text-slate-300 hover:bg-slate-800'
            }`}
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" /> Saved to Log
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4 text-teal-400" /> Save Meal Log
              </>
            )}
          </button>
        )}

        <button
          type="button"
          onClick={onReset}
          className="w-full xs:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20 transition active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          Scan Another Dish
        </button>
      </div>
    </div>
  );
};
