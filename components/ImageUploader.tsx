'use client';

import React, { useRef, useState } from 'react';
import { Camera, Upload, Image as ImageIcon, Sparkles, AlertCircle } from 'lucide-react';

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
        setErrorMsg('Please select a valid image file (JPEG, PNG, WEBP, etc.).');
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

      {/* Main Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`glass-card relative overflow-hidden rounded-3xl p-8 text-center transition-all duration-300 border-2 ${
          isDragging
            ? 'border-emerald-400 bg-emerald-950/20 scale-[1.01]'
            : 'border-dashed border-gray-800 hover:border-gray-700 bg-gray-900/50'
        }`}
      >
        {/* Subtle Background Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center justify-center space-y-5">
          {/* Animated Icon Badge */}
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400 shadow-xl shadow-emerald-500/10 group">
            <ImageIcon className="h-8 w-8 text-emerald-400 transition-transform group-hover:scale-110" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-white tracking-tight sm:text-2xl">
              Snap or Upload Food Photo
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-gray-400 max-w-sm mx-auto">
              Get an instant AI estimate of calories, carbs, protein, and fat in seconds.
            </p>
          </div>

          {/* Action Buttons: Dual Mode */}
          <div className="flex flex-col xs:flex-row items-center justify-center gap-3 w-full max-w-md pt-2">
            {/* Take Photo Button */}
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => cameraInputRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-2.5 w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-teal-400 text-gray-950 font-bold text-sm shadow-lg shadow-emerald-500/25 transition active:scale-[0.98] disabled:opacity-50"
            >
              <Camera className="w-5 h-5 text-gray-950" />
              <span>Take Photo</span>
            </button>

            {/* Upload File Button */}
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-2.5 w-full py-3.5 px-5 rounded-2xl border border-gray-700 bg-gray-800/80 hover:bg-gray-800 text-white font-semibold text-sm transition active:scale-[0.98] disabled:opacity-50"
            >
              <Upload className="w-4 h-4 text-emerald-400" />
              <span>Upload File</span>
            </button>
          </div>

          <p className="text-[11px] text-gray-500">
            Supports JPEG, PNG, WEBP • Auto-compresses photos &gt; 4MB
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
