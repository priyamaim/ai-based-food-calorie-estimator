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
  Flame,
  ChefHat,
  UtensilsCrossed,
  Sliders,
} from 'lucide-react';
import { compressImageIfNeeded, CompressionResult } from '@/utils/imageCompressor';

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

interface InputPanelProps {
  selectedImage: CompressionResult | null;
  onImageSelected: (compressed: CompressionResult) => void;
  onRemoveImage: () => void;
  onAnalyzeMeal: () => void;
  isProcessing: boolean;
  portionMultiplier: number;
  onPortionChange: (val: number) => void;
  cookingMethod: string;
  onCookingMethodChange: (method: string) => void;
  mealType: string;
  onMealTypeChange: (type: string) => void;
}

export const InputPanel: React.FC<InputPanelProps> = ({
  selectedImage,
  onImageSelected,
  onRemoveImage,
  onAnalyzeMeal,
  isProcessing,
  portionMultiplier,
  onPortionChange,
  cookingMethod,
  onCookingMethodChange,
  mealType,
  onMealTypeChange,
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
    <div className="glass-card rounded-3xl p-5 sm:p-6 border border-slate-800 space-y-6 bg-slate-900/90 text-white relative">
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
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white">Meal Photo &amp; Context</h2>
            <p className="text-xs text-slate-400">Input photo &amp; preparation options</p>
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
            ? 'border-emerald-400 bg-emerald-950/30 scale-[1.01]'
            : selectedImage
            ? 'border-emerald-500/40 bg-slate-950'
            : 'border-dashed border-slate-800 hover:border-slate-700 bg-slate-950/60'
        }`}
      >
        {selectedImage ? (
          /* Thumbnail Preview Mode */
          <div className="relative group flex flex-col items-center justify-center p-3">
            <div className="relative w-full max-h-[260px] overflow-hidden rounded-xl bg-slate-950 flex items-center justify-center">
              <img
                src={selectedImage.previewUrl}
                alt="Selected Food Preview"
                className="w-full h-full max-h-[260px] object-contain rounded-xl"
              />

              <button
                type="button"
                disabled={isProcessing}
                onClick={onRemoveImage}
                className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-slate-950/80 border border-slate-700 text-slate-300 hover:text-white hover:bg-rose-600 hover:border-rose-500 transition shadow-lg z-10"
                title="Remove image"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {selectedImage.wasCompressed && (
              <div className="mt-2.5 w-full rounded-xl bg-slate-900 border border-emerald-500/20 px-3 py-1.5 text-xs text-emerald-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-semibold">
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
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
          <div className="p-7 text-center space-y-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto">
              <ImageIcon className="h-7 w-7 text-emerald-400" />
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">Drag &amp; Drop Meal Photo Here</h3>
              <p className="text-xs text-slate-400">Supports JPEG, PNG, WEBP</p>
            </div>

            <div className="flex flex-col xs:flex-row gap-2.5 max-w-xs mx-auto pt-1">
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-md transition active:scale-95"
              >
                <Camera className="w-4 h-4" />
                Take Photo
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition active:scale-95"
              >
                <Upload className="w-4 h-4 text-emerald-400" />
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

      {/* PREPARATION CONTROLS SECTION */}
      <div className="space-y-4 pt-2 border-t border-slate-800/80">
        {/* 1. Meal Type Context Pills */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <UtensilsCrossed className="w-3.5 h-3.5 text-emerald-400" /> Meal Context
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {MEAL_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                disabled={isProcessing}
                onClick={() => onMealTypeChange(type)}
                className={`py-1.5 px-2 rounded-xl text-xs font-bold transition text-center border ${
                  mealType === type
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Cooking Method Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <ChefHat className="w-3.5 h-3.5 text-teal-400" /> Cooking Method
          </label>
          <div className="flex flex-wrap gap-1.5">
            {COOKING_METHODS.map((method) => (
              <button
                key={method}
                type="button"
                disabled={isProcessing}
                onClick={() => onCookingMethodChange(method)}
                className={`py-1.5 px-2.5 rounded-xl text-xs font-semibold transition border ${
                  cookingMethod === method
                    ? 'bg-teal-500/20 text-teal-300 border-teal-400/60'
                    : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {method}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Portion Size Controls (Presets + Manual Range Slider) */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" /> Portion Scale
            </label>
            <span className="text-xs font-mono font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
              {portionMultiplier.toFixed(2)}x Multiplier
            </span>
          </div>

          {/* Portion Presets */}
          <div className="grid grid-cols-4 gap-1.5">
            {PORTION_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                disabled={isProcessing}
                onClick={() => onPortionChange(preset.multiplier)}
                className={`py-1.5 px-1.5 rounded-xl text-[11px] font-bold transition text-center border ${
                  Math.abs(portionMultiplier - preset.multiplier) < 0.05
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                    : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:bg-slate-800'
                }`}
              >
                {preset.label} ({preset.multiplier}x)
              </button>
            ))}
          </div>

          {/* Manual Portion Slider */}
          <div className="pt-1">
            <input
              type="range"
              min="0.5"
              max="3.0"
              step="0.05"
              disabled={isProcessing}
              value={portionMultiplier}
              onChange={(e) => onPortionChange(parseFloat(e.target.value))}
              className="w-full h-2 rounded-lg bg-slate-800 appearance-none cursor-pointer accent-emerald-400 focus:outline-none"
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

      {/* High-Visibility "Analyze Meal" Action Button */}
      <div className="space-y-2 pt-2">
        <button
          type="button"
          disabled={!selectedImage || isProcessing}
          onClick={onAnalyzeMeal}
          className={`w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl font-extrabold text-sm shadow-xl transition active:scale-[0.98] ${
            !selectedImage
              ? 'bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed'
              : isProcessing
              ? 'bg-emerald-600 text-slate-950 cursor-wait'
              : 'bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 shadow-emerald-500/25'
          }`}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Analyzing Meal with Gemini AI...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 fill-slate-950" />
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
