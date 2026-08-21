'use client';

import React, { useRef, useState } from 'react';
import { Camera, Upload, Image as ImageIcon, Sparkles, AlertCircle, Plus } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelected: (file: File) => void;
  isProcessing: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelected,
  isProcessing,
}) => {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (!file.type.startsWith('image/')) {
        setErrorMsg('Please select a valid image file (JPEG, PNG, WEBP).');
        return;
      }
      onImageSelected(file);
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
    setErrorMsg(null);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (!file.type.startsWith('image/')) {
        setErrorMsg('Please drop a valid image file.');
        return;
      }
      onImageSelected(file);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      {/* Hidden inputs */}
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

      {/* Main Drag & Drop Zone - Apple Health Card */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`ios-card relative overflow-hidden p-8 sm:p-10 text-center transition-all duration-300 border-2 ${
          isDragging
            ? 'border-orange-500 bg-orange-50/80 dark:bg-orange-950/20 scale-[1.01]'
            : 'border-dashed border-slate-200 dark:border-slate-800 hover:border-orange-400 dark:hover:border-orange-500/60 bg-white/80 dark:bg-slate-900/80'
        }`}
      >
        {/* Glow ambient circle */}
        <div className="absolute -top-24 -left-24 w-56 h-56 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-56 h-56 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center justify-center space-y-6">
          {/* Circular Camera Icon Container */}
          <div className="relative group">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-orange-500 via-amber-500 to-yellow-400 text-white shadow-xl shadow-orange-500/25 transition-transform group-hover:scale-105">
              <Camera className="h-9 w-9 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md">
              <Plus className="w-4 h-4 stroke-[3]" />
            </div>
          </div>

          <div className="space-y-1.5 max-w-sm">
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
              Snap or Drag Food Photo
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
              Drop any meal image or use your phone camera to calculate calories &amp; macro breakdown instantly.
            </p>
          </div>

          {/* Dual Action Buttons */}
          <div className="flex flex-col xs:flex-row items-center justify-center gap-3 w-full max-w-md pt-2">
            {/* Take Photo */}
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => cameraInputRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-2.5 w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm shadow-lg shadow-orange-500/20 transition active:scale-95 disabled:opacity-50"
            >
              <Camera className="w-4 h-4" />
              <span>Take Photo</span>
            </button>

            {/* Gallery Upload */}
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-2.5 w-full py-3.5 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-semibold text-sm transition active:scale-95 disabled:opacity-50"
            >
              <Upload className="w-4 h-4 text-orange-500" />
              <span>Upload Gallery</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span>Auto-compresses photos over 4MB • Fast Gemini 3.6 Vision</span>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="flex items-center gap-2.5 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-medium">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
