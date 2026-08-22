'use client';

import React, { useState, useEffect } from 'react';
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
  Sliders,
  ChefHat,
  UtensilsCrossed,
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
  // Live Portion Scale State for real-time recalculation
  const [livePortionScale, setLivePortionScale] = useState<number>(1.0);

  useEffect(() => {
    if (analysis) {
      setLivePortionScale(analysis.portionSizeMultiplier || 1.0);
    }
  }, [analysis]);

  // 1. LOADING STATE
  if (isProcessing) {
    return <LoadingSkeleton imagePreviewUrl={imagePreviewUrl} />;
  }

  // 2. EMPTY STATE
  if (!analysis) {
    return (
      <div className="glass-card rounded-3xl p-8 sm:p-12 border border-slate-800 text-center space-y-6 bg-slate-900/80 text-white min-h-[460px] flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-800/80 border border-slate-700 text-emerald-400 shadow-xl">
          <Utensils className="h-10 w-10 text-emerald-400" />
        </div>

        <div className="space-y-2 max-w-sm">
          <h3 className="text-xl font-bold text-white tracking-tight">No Meal Analyzed Yet</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Snap or upload a food photo, select cooking method &amp; portion size on the left, then click <strong className="text-emerald-400">Analyze Meal</strong> to calculate your nutrition metrics instantly.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-[11px] font-semibold text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Powered by Gemini 3.6 Flash AI Engine</span>
        </div>
      </div>
    );
  }

  // 3. ANALYZED STATE WITH REAL-TIME RECALCULATION
  const baseMultiplier = analysis.portionSizeMultiplier || 1.0;
  const ratio = livePortionScale / (baseMultiplier || 1.0);

  const scaledCalories = Math.round(analysis.total_calories * ratio);
  const scaledProtein = Math.round(analysis.protein_g * ratio * 10) / 10;
  const scaledCarbs = Math.round(analysis.carbs_g * ratio * 10) / 10;
  const scaledFat = Math.round(analysis.fat_g * ratio * 10) / 10;

  const proteinCal = scaledProtein * 4;
  const carbsCal = scaledCarbs * 4;
  const fatCal = scaledFat * 9;
  const computedSum = proteinCal + carbsCal + fatCal || 1;

  const proteinPct = Math.round((proteinCal / computedSum) * 100);
  const carbsPct = Math.round((carbsCal / computedSum) * 100);
  const fatPct = Math.max(0, 100 - proteinPct - carbsPct);

  let confidenceBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  if ((analysis.confidence_score || '').toLowerCase().includes('low')) {
    confidenceBg = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  } else if ((analysis.confidence_score || '').toLowerCase().includes('medium')) {
    confidenceBg = 'bg-teal-500/10 text-teal-300 border-teal-500/20';
  }

  // Scaled items breakdown
  const scaledItems = (analysis.items || []).map((item) => ({
    ...item,
    calories: Math.round(item.calories * ratio),
  }));

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
      {/* Hero Calorie Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-7 border border-emerald-500/30 bg-slate-900/90 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div className="flex items-center gap-3.5">
            {imagePreviewUrl && (
              <img
                src={imagePreviewUrl}
                alt={analysis.food_name}
                className="w-16 h-16 rounded-2xl object-cover border border-slate-800 shrink-0 shadow-md"
              />
            )}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-black text-white tracking-tight">{analysis.food_name}</h2>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${confidenceBg}`}>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {analysis.confidence_score} Confidence
                </span>
              </div>

              {/* Context Badges */}
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                {analysis.mealType && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 text-[11px] font-semibold text-emerald-400 border border-slate-700">
                    <UtensilsCrossed className="w-3 h-3" /> {analysis.mealType}
                  </span>
                )}
                {analysis.cookingMethod && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 text-[11px] font-semibold text-teal-300 border border-slate-700">
                    <ChefHat className="w-3 h-3" /> {analysis.cookingMethod}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 text-[11px] font-semibold text-cyan-300 border border-slate-700 font-mono">
                  {livePortionScale.toFixed(2)}x Portion
                </span>
              </div>
            </div>
          </div>

          {/* Calorie Display Box */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-lg shrink-0">
            <Flame className="w-7 h-7 text-amber-400 fill-amber-400/30" />
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white leading-none">
                {scaledCalories}
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Total Calories (kcal)
              </span>
            </div>
          </div>
        </div>

        {/* INTERACTIVE REAL-TIME PORTION RECALCULATION SLIDER */}
        <div className="pt-4 pb-1 border-b border-slate-800/80">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1.5">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Sliders className="w-4 h-4" /> Live Portion Adjuster
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400">
              {livePortionScale.toFixed(2)}x Portion Factor
            </span>
          </div>
          <input
            type="range"
            min="0.5"
            max="3.0"
            step="0.05"
            value={livePortionScale}
            onChange={(e) => setLivePortionScale(parseFloat(e.target.value))}
            className="w-full h-2 rounded-lg bg-slate-800 appearance-none cursor-pointer accent-emerald-400 focus:outline-none"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono pt-1">
            <span>0.5x Portion</span>
            <span>1.0x Baseline</span>
            <span>2.0x Portion</span>
            <span>3.0x Portion</span>
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
                <span className="font-mono font-bold text-white">{scaledProtein}g</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full animate-macro-fill"
                  style={{ width: `${Math.max(6, proteinPct)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>{Math.round(proteinCal)} kcal</span>
                <span>{proteinPct}%</span>
              </div>
            </div>

            {/* Carbs */}
            <div className="rounded-2xl bg-slate-950/80 p-3.5 border border-amber-500/20 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-bold text-amber-400">
                  <Wheat className="w-4 h-4" /> Carbs
                </span>
                <span className="font-mono font-bold text-white">{scaledCarbs}g</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full animate-macro-fill"
                  style={{ width: `${Math.max(6, carbsPct)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>{Math.round(carbsCal)} kcal</span>
                <span>{carbsPct}%</span>
              </div>
            </div>

            {/* Fats */}
            <div className="rounded-2xl bg-slate-950/80 p-3.5 border border-rose-500/20 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-bold text-rose-400">
                  <Droplet className="w-4 h-4" /> Fats
                </span>
                <span className="font-mono font-bold text-white">{scaledFat}g</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full animate-macro-fill"
                  style={{ width: `${Math.max(6, fatPct)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>{Math.round(fatCal)} kcal</span>
                <span>{fatPct}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Itemized Breakdown Table */}
      {scaledItems && scaledItems.length > 0 && (
        <div className="glass-card rounded-3xl p-6 border border-slate-800 bg-slate-900/90 text-white space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <ListFilter className="w-4 h-4 text-emerald-400" /> Itemized Ingredient Breakdown
            </h3>
            <span className="text-[11px] text-slate-500">{scaledItems.length} items identified</span>
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
                {scaledItems.map((item, idx) => (
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
      {analysis.health_tip && (
        <div className="glass-card rounded-2xl p-4 border border-emerald-500/20 bg-emerald-950/20 text-white flex items-start gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
            <HeartPulse className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1">
              NutriSnap AI Health Insight
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{analysis.health_tip}</p>
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
