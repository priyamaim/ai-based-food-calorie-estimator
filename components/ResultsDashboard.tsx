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
  PieChart,
  ListFilter,
  Sliders,
  ChefHat,
  UtensilsCrossed,
  Lightbulb,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { NutritionalAnalysis, MealAlternative } from '@/types/nutrition';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';

export const PORTION_PRESETS = [
  { label: 'Small', multiplier: 0.75 },
  { label: 'Medium', multiplier: 1.0 },
  { label: 'Large', multiplier: 1.5 },
  { label: 'Extra Large', multiplier: 2.0 },
];

export const COOKING_METHODS = [
  'Raw/Fresh',
  'Boiled/Steamed',
  'Grilled/Baked',
  'Pan Fried',
  'Deep Fried',
];

export const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

interface ResultsDashboardProps {
  analysis: NutritionalAnalysis | null;
  imagePreviewUrl?: string;
  isProcessing: boolean;
  onReset: () => void;
  onSaveToHistory?: () => void;
  isSaved?: boolean;
  portionMultiplier: number;
  onPortionChange: (val: number) => void;
  cookingMethod: string;
  onCookingMethodChange: (method: string) => void;
  mealType: string;
  onMealTypeChange: (type: string) => void;
  remainingDailyCalories?: number;
  onRemainingDailyCaloriesChange?: (val: number) => void;
  onApplySwap?: (alternative: MealAlternative) => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  analysis,
  imagePreviewUrl,
  isProcessing,
  onReset,
  onSaveToHistory,
  isSaved = false,
  portionMultiplier,
  onPortionChange,
  cookingMethod,
  onCookingMethodChange,
  mealType,
  onMealTypeChange,
  remainingDailyCalories = 2000,
  onRemainingDailyCaloriesChange,
  onApplySwap,
}) => {
  // Live Portion Scale State for real-time recalculation
  const [livePortionScale, setLivePortionScale] = useState<number>(portionMultiplier);

  useEffect(() => {
    setLivePortionScale(portionMultiplier);
  }, [portionMultiplier]);

  useEffect(() => {
    if (analysis) {
      setLivePortionScale(analysis.portionSizeMultiplier || portionMultiplier);
    }
  }, [analysis]);

  // 1. LOADING STATE
  if (isProcessing) {
    return <LoadingSkeleton imagePreviewUrl={imagePreviewUrl} />;
  }

  // 2. ANALYZED METRICS CALCULATION
  const baseMultiplier = analysis?.portionSizeMultiplier || portionMultiplier || 1.0;
  const ratio = analysis ? livePortionScale / (baseMultiplier || 1.0) : 1.0;

  const scaledCalories = analysis ? Math.round(analysis.total_calories * ratio) : 0;
  const scaledProtein = analysis ? Math.round(analysis.protein_g * ratio * 10) / 10 : 0;
  const scaledCarbs = analysis ? Math.round(analysis.carbs_g * ratio * 10) / 10 : 0;
  const scaledFat = analysis ? Math.round(analysis.fat_g * ratio * 10) / 10 : 0;

  const proteinCal = scaledProtein * 4;
  const carbsCal = scaledCarbs * 4;
  const fatCal = scaledFat * 9;
  const computedSum = proteinCal + carbsCal + fatCal || 1;

  const proteinPct = Math.round((proteinCal / computedSum) * 100);
  const carbsPct = Math.round((carbsCal / computedSum) * 100);
  const fatPct = Math.max(0, 100 - proteinPct - carbsPct);

  let confidenceBg = 'bg-purple-500/10 text-purple-300 border-purple-500/30';
  if ((analysis?.confidence_score || '').toLowerCase().includes('low')) {
    confidenceBg = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  } else if ((analysis?.confidence_score || '').toLowerCase().includes('medium')) {
    confidenceBg = 'bg-violet-500/10 text-violet-300 border-violet-500/20';
  }

  const scaledItems = (analysis?.items || []).map((item) => ({
    ...item,
    calories: Math.round(item.calories * ratio),
  }));

  const isExceedingBudget = scaledCalories > remainingDailyCalories;
  const exceedsAmount = scaledCalories - remainingDailyCalories;

  return (
    <div className="space-y-6">
      {/* 1. ANALYSIS CONTEXT SETUP PANEL (Replaces No Meal Analyzed Yet graphic) */}
      <div className="glass-card rounded-3xl p-5 sm:p-6 border border-purple-900/40 bg-[#120c1f]/90 text-white space-y-5 shadow-2xl shadow-purple-950/20">
        <div className="flex items-center justify-between border-b border-purple-950/80 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Analysis Context Setup</h3>
              <p className="text-xs text-slate-400">Specify preparation &amp; daily calorie budget</p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-full">
            Active Setup
          </span>
        </div>

        {/* Remaining Daily Calorie Budget */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" /> Remaining Daily Calorie Budget
            </label>
            <span className="text-xs font-mono font-extrabold text-amber-300 bg-amber-500/10 px-2.5 py-0.5 rounded-md border border-amber-500/30">
              {remainingDailyCalories} kcal
            </span>
          </div>
          <input
            type="number"
            min="100"
            max="5000"
            step="50"
            value={remainingDailyCalories}
            onChange={(e) =>
              onRemainingDailyCaloriesChange?.(Math.max(0, Number(e.target.value)))
            }
            className="w-full bg-[#090511]/80 border border-purple-950/80 rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-purple-500/60 transition"
            placeholder="e.g. 2000"
          />
        </div>

        {/* Meal Context Pills */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
            <UtensilsCrossed className="w-3.5 h-3.5 text-purple-400" /> Meal Context
          </label>
          <div className="grid grid-cols-4 gap-2">
            {MEAL_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => onMealTypeChange(type)}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition text-center border ${
                  mealType === type
                    ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white border-purple-400 shadow-lg shadow-purple-500/30'
                    : 'bg-[#090511]/80 text-slate-300 border-purple-950/60 hover:bg-purple-950/40'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Cooking Method Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
            <ChefHat className="w-3.5 h-3.5 text-violet-400" /> Cooking Method
          </label>
          <div className="flex flex-wrap gap-2">
            {COOKING_METHODS.map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => onCookingMethodChange(method)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold transition border ${
                  cookingMethod === method
                    ? 'bg-purple-600/30 text-purple-200 border-purple-400 shadow-md shadow-purple-500/25 font-bold'
                    : 'bg-[#090511]/80 text-slate-400 border-purple-950/60 hover:bg-purple-950/40 hover:text-slate-200'
                }`}
              >
                {method}
              </button>
            ))}
          </div>
        </div>

        {/* Portion Scale Controls */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-fuchsia-400" /> Portion Scale
            </label>
            <span className="text-xs font-mono font-extrabold text-purple-300 bg-purple-500/10 px-2.5 py-0.5 rounded-md border border-purple-500/30">
              {(analysis ? livePortionScale : portionMultiplier).toFixed(2)}x Multiplier
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {PORTION_PRESETS.map((preset) => {
              const currentVal = analysis ? livePortionScale : portionMultiplier;
              const isSelected = Math.abs(currentVal - preset.multiplier) < 0.05;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    onPortionChange(preset.multiplier);
                    if (analysis) {
                      setLivePortionScale(preset.multiplier);
                    }
                  }}
                  className={`py-2 px-1.5 rounded-xl text-xs font-bold transition text-center border ${
                    isSelected
                      ? 'bg-purple-600/30 text-purple-200 border-purple-400 shadow-md shadow-purple-500/25'
                      : 'bg-[#090511]/80 text-slate-400 border-purple-950/60 hover:bg-purple-950/40'
                  }`}
                >
                  {preset.label} ({preset.multiplier}x)
                </button>
              );
            })}
          </div>

          <div className="pt-1">
            <input
              type="range"
              min="0.5"
              max="3.0"
              step="0.05"
              value={analysis ? livePortionScale : portionMultiplier}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                onPortionChange(val);
                if (analysis) {
                  setLivePortionScale(val);
                }
              }}
              className="w-full h-2 rounded-lg bg-purple-950 appearance-none cursor-pointer accent-purple-400 focus:outline-none"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono pt-1">
              <span>0.5x (Half)</span>
              <span>1.0x (Standard)</span>
              <span>2.0x (Double)</span>
              <span>3.0x (Triple)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ANALYZED NUTRITIONAL DASHBOARD (Rendered when analysis is available) */}
      {analysis && (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
          {/* Budget Warning Badge */}
          {isExceedingBudget && (
            <div className="glass-card rounded-2xl p-4 border border-purple-500/50 bg-gradient-to-r from-purple-950/90 via-purple-900/70 to-violet-950/90 text-purple-200 shadow-xl shadow-purple-950/40 flex items-center justify-between gap-3 animate-in fade-in duration-200">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-500/20 border border-purple-400/40 text-purple-300 font-bold shrink-0 text-base">
                  ⚠️
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300">
                    Daily Budget Warning
                  </h4>
                  <p className="text-sm font-black text-white">
                    ⚠️ Exceeds Daily Allowance by {exceedsAmount} kcal
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-full bg-purple-500/25 border border-purple-400/40 text-purple-200 shrink-0">
                +{exceedsAmount} kcal over
              </span>
            </div>
          )}
          {/* Hero Calorie Card */}
          <div className="glass-card rounded-3xl p-6 sm:p-7 border border-purple-500/30 bg-[#120c1f]/95 text-white relative overflow-hidden shadow-2xl shadow-purple-950/30">
            <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-purple-950/80">
              <div className="flex items-center gap-3.5">
                {imagePreviewUrl && (
                  <img
                    src={imagePreviewUrl}
                    alt={analysis.food_name}
                    className="w-16 h-16 rounded-2xl object-cover border border-purple-900/60 shrink-0 shadow-md"
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

                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {analysis.mealType && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-950/60 text-[11px] font-semibold text-purple-300 border border-purple-900/40">
                        <UtensilsCrossed className="w-3 h-3" /> {analysis.mealType}
                      </span>
                    )}
                    {analysis.cookingMethod && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-950/60 text-[11px] font-semibold text-violet-300 border border-purple-900/40">
                        <ChefHat className="w-3 h-3" /> {analysis.cookingMethod}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-950/60 text-[11px] font-semibold text-fuchsia-300 border border-purple-900/40 font-mono">
                      {livePortionScale.toFixed(2)}x Portion
                    </span>
                  </div>
                </div>
              </div>

              {/* Calorie Display Box */}
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-300 shadow-lg shrink-0">
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

            {/* Macronutrient Grid */}
            <div className="pt-5 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                <span className="flex items-center gap-1.5 uppercase tracking-wider">
                  <PieChart className="w-4 h-4 text-purple-400" /> Macronutrient Ratio
                </span>
                <span>Protein • Carbs • Fats</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Protein - Purple Theme */}
                <div className="rounded-2xl bg-[#090511]/80 p-3.5 border border-purple-500/20 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 font-bold text-purple-400">
                      <Dumbbell className="w-4 h-4" /> Protein
                    </span>
                    <span className="font-mono font-bold text-white">{scaledProtein}g</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-purple-950/80 overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full animate-macro-fill"
                      style={{ width: `${Math.max(6, proteinPct)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                    <span>{Math.round(proteinCal)} kcal</span>
                    <span>{proteinPct}%</span>
                  </div>
                </div>

                {/* Carbs - Amber Theme */}
                <div className="rounded-2xl bg-[#090511]/80 p-3.5 border border-amber-500/20 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 font-bold text-amber-400">
                      <Wheat className="w-4 h-4" /> Carbs
                    </span>
                    <span className="font-mono font-bold text-white">{scaledCarbs}g</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-purple-950/80 overflow-hidden">
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

                {/* Fats - Fuchsia Theme */}
                <div className="rounded-2xl bg-[#090511]/80 p-3.5 border border-fuchsia-500/20 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 font-bold text-fuchsia-400">
                      <Droplet className="w-4 h-4" /> Fats
                    </span>
                    <span className="font-mono font-bold text-white">{scaledFat}g</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-purple-950/80 overflow-hidden">
                    <div
                      className="h-full bg-fuchsia-500 rounded-full animate-macro-fill"
                      style={{ width: `${Math.max(6, fatPct)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Smart Low-Calorie Swap Engine Card */}
          {analysis.alternatives && analysis.alternatives.length > 0 && (
            <div className="glass-card rounded-3xl p-6 border border-purple-500/30 bg-[#120c1f]/95 text-white space-y-4 shadow-2xl shadow-purple-950/30">
              <div className="flex items-center justify-between border-b border-purple-950/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white">💡 Healthy AI Swaps</h3>
                    <p className="text-xs text-slate-400">
                      Lower-calorie options maintaining similar taste &amp; protein
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
                  {analysis.alternatives.length} Swaps Available
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3.5">
                {analysis.alternatives.map((alt, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl bg-[#090511]/90 p-4 border border-purple-900/60 hover:border-purple-500/40 transition-all space-y-3 shadow-md"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          {alt.name}
                        </h4>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {alt.swapReason}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm">
                          <Zap className="w-3.5 h-3.5" /> Save {alt.caloriesSaved} kcal
                        </span>
                        <span className="text-xs font-mono font-bold text-purple-300 bg-purple-950/60 px-2.5 py-1 rounded-lg border border-purple-900/40">
                          {alt.calories} kcal
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => onApplySwap?.(alt)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white text-xs font-bold shadow-md shadow-purple-500/20 transition active:scale-95"
                      >
                        <span>Apply Swap</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Itemized Breakdown Table */}
          {scaledItems && scaledItems.length > 0 && (
            <div className="glass-card rounded-3xl p-6 border border-purple-900/40 bg-[#120c1f]/95 text-white space-y-3">
              <div className="flex items-center justify-between border-b border-purple-950/80 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <ListFilter className="w-4 h-4 text-purple-400" /> Itemized Ingredient Breakdown
                </h3>
                <span className="text-[11px] text-slate-500">{scaledItems.length} items identified</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-purple-950/80 text-slate-400 font-bold uppercase text-[10px]">
                      <th className="pb-2">Food / Component</th>
                      <th className="pb-2">Est. Weight / Portion</th>
                      <th className="pb-2 text-right">Calories</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-950/60 font-medium">
                    {scaledItems.map((item, idx) => (
                      <tr key={idx} className="hover:bg-purple-950/30 transition">
                        <td className="py-2.5 text-white font-bold">{item.name}</td>
                        <td className="py-2.5 text-slate-300">{item.portion}</td>
                        <td className="py-2.5 text-right font-mono font-bold text-purple-400">
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
            <div className="glass-card rounded-2xl p-4 border border-purple-500/20 bg-purple-950/20 text-white flex items-start gap-3">
              <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shrink-0 mt-0.5">
                <HeartPulse className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-1">
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
                    ? 'border-purple-500/40 bg-purple-500/10 text-purple-300'
                    : 'border-purple-900/50 bg-purple-950/40 text-slate-300 hover:bg-purple-900/50'
                }`}
              >
                {isSaved ? (
                  <>
                    <Check className="w-4 h-4 text-purple-400" /> Saved to Log
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4 text-violet-400" /> Save Meal Log
                  </>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={onReset}
              className="w-full xs:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white text-xs font-bold shadow-lg shadow-purple-500/20 transition active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              Scan Another Dish
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
