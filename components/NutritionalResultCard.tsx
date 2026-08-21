'use client';

import React, { useState } from 'react';
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
  AlertTriangle,
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

  // Calculate calories from macros for percentage distribution
  const proteinCal = protein_g * 4;
  const carbsCal = carbs_g * 4;
  const fatCal = fat_g * 9;
  const computedMacroCalSum = proteinCal + carbsCal + fatCal || 1;

  const proteinPct = Math.round((proteinCal / computedMacroCalSum) * 100);
  const carbsPct = Math.round((carbsCal / computedMacroCalSum) * 100);
  const fatPct = Math.min(100, 100 - proteinPct - carbsPct);

  // Confidence score badge styling
  const confidenceLower = (confidence_score || 'medium').toLowerCase();
  let confidenceBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  if (confidenceLower.includes('low')) {
    confidenceBg = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  } else if (confidenceLower.includes('medium')) {
    confidenceBg = 'bg-teal-500/10 text-teal-300 border-teal-500/20';
  }

  return (
    <div className="w-full max-w-xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-300">
      {/* Top Header Card */}
      <div className="glass-card overflow-hidden rounded-3xl p-6 sm:p-8 border border-emerald-500/30 relative">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-800/80">
          <div className="flex items-center gap-4">
            {imagePreviewUrl && (
              <img
                src={imagePreviewUrl}
                alt={food_name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-gray-800 shadow-md shrink-0"
              />
            )}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {food_name}
                </h2>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${confidenceBg}`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {confidence_score} Confidence
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                AI Vision Nutritional Breakdown
              </p>
            </div>
          </div>

          {/* Calorie Display Box */}
          <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-transparent border border-emerald-500/30 text-emerald-400 shadow-lg shrink-0">
            <Flame className="w-7 h-7 text-amber-400 fill-amber-400/30" />
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white leading-none">
                {total_calories}
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Total Calories (kcal)
              </span>
            </div>
          </div>
        </div>

        {/* Macros Breakdown Section */}
        <div className="pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Macronutrient Distribution
            </h3>
            <span className="text-xs text-gray-500">Gram &amp; Calorie % Ratio</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* Protein Card */}
            <div className="rounded-2xl bg-gray-900/80 p-4 border border-emerald-500/20 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
                  <Dumbbell className="w-4 h-4 text-emerald-400" /> Protein
                </span>
                <span className="font-mono font-bold text-white">{protein_g}g</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${Math.max(5, proteinPct)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>{proteinCal} kcal</span>
                <span>{proteinPct}%</span>
              </div>
            </div>

            {/* Carbs Card */}
            <div className="rounded-2xl bg-gray-900/80 p-4 border border-amber-500/20 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-semibold text-amber-400">
                  <Wheat className="w-4 h-4 text-amber-400" /> Carbs
                </span>
                <span className="font-mono font-bold text-white">{carbs_g}g</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${Math.max(5, carbsPct)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>{carbsCal} kcal</span>
                <span>{carbsPct}%</span>
              </div>
            </div>

            {/* Fat Card */}
            <div className="rounded-2xl bg-gray-900/80 p-4 border border-rose-500/20 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-semibold text-rose-400">
                  <Droplet className="w-4 h-4 text-rose-400" /> Fat
                </span>
                <span className="font-mono font-bold text-white">{fat_g}g</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-rose-500 to-pink-400 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${Math.max(5, fatPct)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>{fatCal} kcal</span>
                <span>{fatPct}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Health Tip Box */}
        {health_tip && (
          <div className="mt-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-teal-950/40 p-4 border border-emerald-500/20 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
              <HeartPulse className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1">
                AI Nutritionist Health Tip
              </h4>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                {health_tip}
              </p>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="mt-6 pt-4 border-t border-gray-800 flex flex-col xs:flex-row items-center justify-between gap-3">
          {onSaveToHistory && (
            <button
              type="button"
              onClick={onSaveToHistory}
              disabled={isSaved}
              className={`w-full xs:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition ${
                isSaved
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                  : 'border-gray-800 bg-gray-900/80 hover:bg-gray-800 text-gray-300'
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
            className="w-full xs:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-gray-950 text-xs font-bold shadow-lg shadow-emerald-500/20 transition active:scale-[0.98]"
          >
            <RotateCcw className="w-4 h-4" />
            Scan Another Dish
          </button>
        </div>
      </div>
    </div>
  );
};
