'use client';

import React from 'react';
import { X, Sparkles, RefreshCw, Zap, Image as ImageIcon } from 'lucide-react';
import { CompressionResult } from '@/utils/imageCompressor';

interface ImagePreviewModalProps {
  imageInfo: CompressionResult | null;
  onAnalyze: () => void;
  onCancel: () => void;
  isProcessing: boolean;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  imageInfo,
  onAnalyze,
  onCancel,
  isProcessing,
}) => {
  if (!imageInfo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="ios-card w-full max-w-lg rounded-3xl p-6 shadow-2xl text-slate-900 dark:text-white relative flex flex-col max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        {/* Close button */}
        <button
          onClick={onCancel}
          disabled={isProcessing}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white transition rounded-full p-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-2xl bg-orange-500/10 text-orange-500">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Confirm Food Photo</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Ready to run Gemini AI Nutrition Analysis</p>
          </div>
        </div>

        {/* Image Preview Container */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 mb-5 max-h-[340px] flex items-center justify-center">
          <img
            src={imageInfo.previewUrl}
            alt="Selected Food Preview"
            className="w-full h-full object-contain max-h-[340px] rounded-2xl"
          />

          {/* Compression Badge */}
          {imageInfo.wasCompressed && (
            <div className="absolute bottom-3 left-3 right-3 rounded-xl px-3.5 py-2 text-xs text-orange-700 dark:text-orange-300 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-orange-500/30 shadow-lg flex items-center justify-between font-medium">
              <span className="flex items-center gap-1.5 font-bold">
                <Zap className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                Compressed for fast payload
              </span>
              <span className="font-mono text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                {imageInfo.originalSizeMb.toFixed(1)}MB → {imageInfo.compressedSizeMb.toFixed(1)}MB
              </span>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            disabled={isProcessing}
            onClick={onCancel}
            className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition"
          >
            <RefreshCw className="w-4 h-4" />
            Change Photo
          </button>

          <button
            type="button"
            disabled={isProcessing}
            onClick={onAnalyze}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm shadow-lg shadow-orange-500/25 transition active:scale-95 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 fill-white" />
            Analyze Calories &amp; Macros
          </button>
        </div>
      </div>
    </div>
  );
};
