'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Brain, Cpu } from 'lucide-react';

interface LoadingSkeletonProps {
  imagePreviewUrl?: string;
}

const LOADING_TIPS = [
  'Scanning image pixels & color profiles...',
  'Detecting food items & portion sizes...',
  'Calculating protein, carbs, & fat distribution...',
  'Estimating total caloric content...',
  'Generating personalized nutritionist health tip...',
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
      {/* Scanning Image Box with Laser Effect */}
      {imagePreviewUrl && (
        <div className="relative rounded-3xl overflow-hidden border border-emerald-500/30 bg-gray-900/90 shadow-2xl h-64 flex items-center justify-center">
          <img
            src={imagePreviewUrl}
            alt="Scanning target"
            className="w-full h-full object-cover opacity-40 blur-[1px]"
          />
          {/* Laser Line Animation */}
          <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-scan-line" />

          {/* Center Processing Badge */}
          <div className="absolute glass-modal px-4 py-2.5 rounded-2xl border border-emerald-500/30 flex items-center gap-2.5 shadow-2xl">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </div>
            <span className="text-xs font-bold text-emerald-300 tracking-wide">
              Gemini 3.6 Flash Processing
            </span>
          </div>
        </div>
      )}

      {/* Main Skeleton Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6 border border-emerald-500/20">
        {/* Top Header Skeleton */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-5">
          <div className="space-y-2">
            <div className="h-6 w-44 rounded-lg bg-gray-800 animate-pulse" />
            <div className="h-4 w-28 rounded-md bg-gray-800/60 animate-pulse" />
          </div>
          <div className="h-12 w-28 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 animate-pulse" />
        </div>

        {/* Macros Progress Bar Skeletons */}
        <div className="space-y-4">
          <div className="h-4 w-32 rounded-md bg-gray-800 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="rounded-2xl bg-gray-900/80 p-4 border border-gray-800 space-y-3">
                <div className="flex justify-between items-center">
                  <div className="h-3 w-16 rounded bg-gray-800 animate-pulse" />
                  <div className="h-3 w-10 rounded bg-gray-800 animate-pulse" />
                </div>
                <div className="h-2 w-full rounded-full bg-gray-800 overflow-hidden">
                  <div className="h-full w-2/3 bg-emerald-500/30 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tip Box Skeleton */}
        <div className="rounded-2xl bg-gray-900/60 p-4 border border-gray-800 flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-emerald-400 animate-spin" />
          <p className="text-xs text-emerald-300/90 font-medium transition-all duration-300">
            {LOADING_TIPS[tipIndex]}
          </p>
        </div>
      </div>
    </div>
  );
};
