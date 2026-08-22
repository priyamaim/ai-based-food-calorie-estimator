'use client';

import React, { useRef, useState } from 'react';
import {
  Camera,
  Upload,
  Image as ImageIcon,
  Sparkles,
  X,
  AlertCircle,
  Zap,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { compressImageIfNeeded, CompressionResult } from '@/utils/imageCompressor';

interface InputPanelProps {
  selectedImage: CompressionResult | null;
  onImageSelected: (compressed: CompressionResult) => void;
  onRemoveImage: () => void;
  onAnalyzeMeal: () => void;
  isProcessing: boolean;
}

export const InputPanel: React.FC<InputPanelProps> = ({
  selectedImage,
  onImageSelected,
  onRemoveImage,
  onAnalyzeMeal,
  isProcessing,
}) => {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const processFile = async (file: File) => {
    setErrorMsg(null);
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (JPEG, PNG, WEBP).');
      return;
    }
    try {
      const compressed = await compressImageIfNeeded(file);
      onImageSelected(compressed);
    } catch (err: any) {
      console.error('Compression error:', err);
      setErrorMsg('Failed to process image file. Please try another photo.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  return (
    <div className="glass-card rounded-3xl p-5 sm:p-6 border border-purple-900/30 space-y-5 bg-[#120c1f]/90 text-white relative shadow-2xl shadow-purple-950/20">
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={cameraInputRef}
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Card Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white">Meal Photo Input</h2>
            <p className="text-xs text-slate-400">Snap photo or drag &amp; drop</p>
          </div>
        </div>

        {selectedImage && (
          <button
            type="button"
            onClick={onRemoveImage}
            disabled={isProcessing}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-rose-400 transition font-semibold"
          >
            <X className="w-4 h-4" /> Clear
          </button>
        )}
      </div>

      {/* Main Interactive Drag & Drop / Preview Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative overflow-hidden rounded-2xl transition-all duration-300 border-2 ${
          isDragging
            ? 'border-purple-400 bg-purple-950/40 scale-[1.01]'
            : selectedImage
            ? 'border-purple-500/40 bg-[#090511]'
            : 'border-dashed border-purple-900/40 hover:border-purple-600/60 bg-[#090511]/60'
        }`}
      >
        {selectedImage ? (
          /* Thumbnail Preview Mode with Clear (X) Button */
          <div className="relative group flex flex-col items-center justify-center p-3">
            <div className="relative w-full max-h-[320px] overflow-hidden rounded-xl bg-[#090511] flex items-center justify-center">
              <img
                src={selectedImage.previewUrl}
                alt="Selected Food Preview"
                className="w-full h-full max-h-[320px] object-contain rounded-xl"
              />

              {/* Clear Image Removal (X) Button */}
              <button
                type="button"
                disabled={isProcessing}
                onClick={onRemoveImage}
                className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-[#090511]/90 border border-purple-700/60 text-purple-200 hover:text-white hover:bg-rose-600 hover:border-rose-500 transition shadow-lg z-10"
                title="Remove image"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {selectedImage.wasCompressed && (
              <div className="mt-3 w-full rounded-xl bg-purple-950/40 border border-purple-500/20 px-3 py-1.5 text-xs text-purple-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-semibold">
                  <Zap className="w-3.5 h-3.5 text-purple-400" />
                  Auto-compressed
                </span>
                <span className="font-mono text-[11px] text-slate-300">
                  {selectedImage.originalSizeMb.toFixed(1)}MB → {selectedImage.compressedSizeMb.toFixed(1)}MB
                </span>
              </div>
            )}
          </div>
        ) : (
          /* Dropzone Mode */
          <div className="p-9 text-center space-y-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 mx-auto">
              <ImageIcon className="h-8 w-8 text-purple-400" />
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">Drag &amp; Drop Meal Photo Here</h3>
              <p className="text-xs text-slate-400">Supports JPEG, PNG, WEBP</p>
            </div>

            {/* Dual Action Buttons */}
            <div className="flex flex-col xs:flex-row gap-2.5 max-w-xs mx-auto pt-1">
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition active:scale-95"
              >
                <Camera className="w-4 h-4" />
                Take Photo
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-purple-900/50 bg-purple-950/30 hover:bg-purple-900/50 text-white font-semibold text-xs transition active:scale-95"
              >
                <Upload className="w-4 h-4 text-purple-400" />
                Upload File
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* High-Visibility "Analyze Meal" Action Button in Bold Purple */}
      <div className="space-y-2 pt-2">
        <button
          type="button"
          disabled={!selectedImage || isProcessing}
          onClick={onAnalyzeMeal}
          className={`w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-extrabold text-sm shadow-xl transition active:scale-[0.98] ${
            !selectedImage
              ? 'bg-purple-950/20 text-slate-500 border border-purple-950/50 cursor-not-allowed'
              : isProcessing
              ? 'bg-purple-700 text-white cursor-wait'
              : 'bg-gradient-to-r from-purple-600 via-violet-500 to-fuchsia-500 hover:from-purple-500 hover:to-fuchsia-400 text-white shadow-purple-500/30'
          }`}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Analyzing Meal with Gemini AI...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 fill-white" />
              <span>Analyze Meal Nutrition</span>
            </>
          )}
        </button>

        {selectedImage && !isProcessing && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full text-center text-xs text-slate-400 hover:text-slate-200 transition py-1 font-semibold flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Select Different Photo
          </button>
        )}
      </div>
    </div>
  );
};
