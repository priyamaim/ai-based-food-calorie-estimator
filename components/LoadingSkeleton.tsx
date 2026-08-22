'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Activity } from 'lucide-react';

interface LoadingSkeletonProps {
  imagePreviewUrl?: string;
}

const LOADING_TIPS = [
  'Scanning image pixels & color profiles...',
  'Detecting food items & portion sizes...',
  'Calculating protein, carbs, & fat distribution...',
  'Estimating total caloric energy...',
  'Consulting Gemini AI Nutritionist insights...',
];

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ imagePreviewUrl }) => {
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % LOADING_TIPS.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Laser Scanner Preview Box */}
      {imagePreviewUrl && (
        <div className="relative rounded-3xl overflow-hidden border border-purple-500/30 bg-[#090511] shadow-2xl h-64 flex items-center justify-center">
          <img
            src={imagePreviewUrl}
            alt="Scanning target"
            className="w-full h-full object-cover opacity-40 blur-[1px]"
          />

          {/* Glowing Purple Laser Scan Line */}
          <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent shadow-[0_0_20px_#a855f7] animate-purple-scan" />

          {/* Center Activity Badge */}
          <div className="absolute rounded-2xl bg-[#090511]/90 border border-purple-500/30 px-4 py-2.5 backdrop-blur-md flex items-center gap-3 shadow-2xl">
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-purple-600 text-white animate-pulse">
              <Activity className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-purple-300 tracking-wide">
              Analyzing Meal with Gemini AI...
            </span>
          </div>
        </div>
      )}

      {/* Main Skeleton Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6 bg-[#120c1f]/90 border border-purple-900/40">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between border-b border-purple-950/80 pb-5">
          <div className="space-y-2">
            <div className="h-6 w-48 rounded-xl bg-purple-950/80 animate-pulse" />
            <div className="h-4 w-28 rounded-lg bg-purple-950/50 animate-pulse" />
          </div>
          <div className="h-12 w-28 rounded-2xl bg-purple-500/10 border border-purple-500/20 animate-pulse" />
        </div>

        {/* Macros Skeleton */}
        <div className="space-y-4">
          <div className="h-4 w-36 rounded-lg bg-purple-950/80 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="rounded-2xl bg-[#090511]/80 p-4 border border-purple-950/80 space-y-3"
              >
                <div className="flex justify-between items-center">
                  <div className="h-3 w-16 rounded bg-purple-950/80 animate-pulse" />
                  <div className="h-3 w-10 rounded bg-purple-950/80 animate-pulse" />
                </div>
                <div className="h-2.5 w-full rounded-full bg-purple-950/80 overflow-hidden">
                  <div className="h-full w-2/3 bg-purple-500/30 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tip Box Skeleton */}
        <div className="rounded-2xl bg-purple-950/30 p-4 border border-purple-900/40 flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-purple-400 animate-spin shrink-0" />
          <p className="text-xs text-purple-300 font-semibold transition-all duration-300">
            {LOADING_TIPS[tipIndex]}
          </p>
        </div>
      </div>
    </div>
  );
};
