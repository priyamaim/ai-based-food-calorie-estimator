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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-modal w-full max-w-lg rounded-3xl p-5 sm:p-6 shadow-2xl border border-gray-800 text-white relative flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onCancel}
          disabled={isProcessing}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition rounded-full p-1.5 bg-gray-900/60 border border-gray-800 hover:bg-gray-800 z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Confirm Food Image</h3>
            <p className="text-xs text-gray-400">Ready to run Gemini 2.5 AI Nutrition Analysis</p>
          </div>
        </div>

        {/* Image Preview Container */}
        <div className="relative rounded-2xl overflow-hidden border border-gray-800 bg-gray-900/80 mb-4 max-h-[340px] flex items-center justify-center">
          <img
            src={imageInfo.previewUrl}
            alt="Selected Food Preview"
            className="w-full h-full object-contain max-h-[340px] rounded-2xl"
          />

          {/* Compression Badge */}
          {imageInfo.wasCompressed && (
            <div className="absolute bottom-3 left-3 right-3 glass-pill rounded-xl px-3 py-1.5 text-xs text-emerald-300 flex items-center justify-between border border-emerald-500/20">
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                Auto-compressed for Gemini
              </span>
              <span className="font-mono text-[11px] text-gray-300">
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
            className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl border border-gray-800 bg-gray-900/80 hover:bg-gray-800 text-gray-300 text-xs font-semibold transition"
          >
            <RefreshCw className="w-4 h-4" />
            Change Photo
          </button>

          <button
            type="button"
            disabled={isProcessing}
            onClick={onAnalyze}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-teal-400 text-gray-950 font-bold text-sm shadow-lg shadow-emerald-500/25 transition active:scale-[0.98] disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 fill-gray-950" />
            Analyze Calories & Macros
          </button>
        </div>
      </div>
    </div>
  );
};
