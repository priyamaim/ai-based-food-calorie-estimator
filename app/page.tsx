'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { ApiKeyModal } from '@/components/ApiKeyModal';
import { ImageUploader } from '@/components/ImageUploader';
import { ImagePreviewModal } from '@/components/ImagePreviewModal';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { NutritionalResultCard } from '@/components/NutritionalResultCard';
import { ScanHistory } from '@/components/ScanHistory';
import { compressImageIfNeeded, CompressionResult } from '@/utils/imageCompressor';
import { NutritionalAnalysis, MealScanItem, ApiPredictResponse } from '@/types/nutrition';
import {
  Sparkles,
  AlertCircle,
  ShieldAlert,
  Flame,
  Zap,
  Info,
  RotateCcw,
  Key,
} from 'lucide-react';

type AppStep = 'IDLE' | 'PREVIEW' | 'LOADING' | 'RESULT' | 'ERROR';

export default function Home() {
  const [step, setStep] = useState<AppStep>('IDLE');
  const [selectedImage, setSelectedImage] = useState<CompressionResult | null>(null);
  const [analysisResult, setAnalysisResult] = useState<NutritionalAnalysis | null>(null);
  const [errorDetails, setErrorDetails] = useState<{ message: string; isApiKeyError?: boolean } | null>(null);

  // Settings & History state
  const [customApiKey, setCustomApiKey] = useState<string>('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [history, setHistory] = useState<MealScanItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isCurrentSaved, setIsCurrentSaved] = useState(false);

  // Load stored state on mount
  useEffect(() => {
    try {
      const storedKey = localStorage.getItem('nutrisnap_custom_gemini_key') || '';
      setCustomApiKey(storedKey);

      const storedHistory = localStorage.getItem('nutrisnap_scan_history');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error('Failed to access localStorage:', e);
    }
  }, []);

  // Save API Key
  const handleSaveApiKey = (key: string) => {
    setCustomApiKey(key);
    try {
      if (key) {
        localStorage.setItem('nutrisnap_custom_gemini_key', key);
      } else {
        localStorage.removeItem('nutrisnap_custom_gemini_key');
      }
    } catch (e) {
      console.error('Failed to save API key to localStorage:', e);
    }
  };

  // Save scan item to history log
  const handleSaveToHistory = () => {
    if (!analysisResult || !selectedImage || isCurrentSaved) return;

    const newItem: MealScanItem = {
      id: `scan_${Date.now()}`,
      timestamp: Date.now(),
      imageUri: selectedImage.previewUrl,
      analysis: analysisResult,
    };

    const updatedHistory = [newItem, ...history].slice(0, 30); // keep up to 30 items
    setHistory(updatedHistory);
    setIsCurrentSaved(true);

    try {
      localStorage.setItem('nutrisnap_scan_history', JSON.stringify(updatedHistory));
    } catch (e) {
      console.error('Failed to save scan history to localStorage:', e);
    }
  };

  // Delete history item
  const handleDeleteScan = (id: string) => {
    const updated = history.filter((item) => item.id !== id);
    setHistory(updated);
    try {
      localStorage.setItem('nutrisnap_scan_history', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to update scan history:', e);
    }
  };

  // Clear all history
  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('nutrisnap_scan_history');
    } catch (e) {
      console.error('Failed to clear scan history:', e);
    }
  };

  // Handle Image Selection
  const handleImageSelected = async (file: File) => {
    setErrorDetails(null);
    try {
      const compressed = await compressImageIfNeeded(file);
      setSelectedImage(compressed);
      setStep('PREVIEW');
    } catch (err: any) {
      console.error('Image processing error:', err);
      setErrorDetails({
        message: err?.message || 'Failed to process image file. Please try another photo.',
      });
      setStep('ERROR');
    }
  };

  // Perform Gemini AI Analysis
  const handleAnalyzeFood = async () => {
    if (!selectedImage) return;

    setStep('LOADING');
    setErrorDetails(null);
    setIsCurrentSaved(false);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (customApiKey) {
        headers['x-gemini-key'] = customApiKey;
      }

      const res = await fetch('/api/predict', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          image: selectedImage.base64,
          mimeType: selectedImage.mimeType,
        }),
      });

      const data: ApiPredictResponse = await res.json();

      if (!res.ok || !data.success || !data.data) {
        const isKeyErr =
          res.status === 401 ||
          Boolean(data.error && data.error.toLowerCase().includes('key'));

        setErrorDetails({
          message: data.error || 'Failed to analyze food image with Gemini API.',
          isApiKeyError: isKeyErr,
        });
        setStep('ERROR');
        return;
      }

      setAnalysisResult(data.data);
      setStep('RESULT');
    } catch (err: any) {
      console.error('API request error:', err);
      setErrorDetails({
        message: 'Network error connecting to AI analysis server. Please check your internet connection.',
      });
      setStep('ERROR');
    }
  };

  // Reset to initial state
  const handleReset = () => {
    setStep('IDLE');
    setSelectedImage(null);
    setAnalysisResult(null);
    setErrorDetails(null);
    setIsCurrentSaved(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19] text-gray-100">
      {/* Header Bar */}
      <Header
        hasCustomKey={!!customApiKey}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onToggleHistory={() => setIsHistoryOpen(true)}
        historyCount={history.length}
      />

      {/* Main SPA Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 sm:px-6 sm:py-10 flex flex-col justify-center">
        {/* IDLE STEP */}
        {step === 'IDLE' && (
          <div className="space-y-10 animate-in fade-in duration-300">
            {/* Hero Banner */}
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                <Zap className="w-3.5 h-3.5 fill-emerald-400" />
                Powered by Google Gemini 3.6 Flash
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                Know What You Eat in <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">One Snap</span>
              </h2>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed max-w-lg mx-auto">
                Snap or upload any meal photo to receive an instant, accurate breakdown of calories, protein, carbs, fats, and expert nutritionist tips.
              </p>
            </div>

            {/* Image Uploader */}
            <ImageUploader
              onImageSelected={handleImageSelected}
              isProcessing={false}
            />

            {/* Features / Quick Stats Pills */}
            <div className="grid grid-cols-1 xs:grid-cols-3 gap-3 max-w-xl mx-auto pt-4">
              <div className="glass-pill rounded-2xl p-3.5 text-center space-y-1 border border-gray-800">
                <Flame className="w-5 h-5 text-amber-400 mx-auto" />
                <h4 className="text-xs font-bold text-white">Calorie Precision</h4>
                <p className="text-[10px] text-gray-400">Instant energy estimates</p>
              </div>

              <div className="glass-pill rounded-2xl p-3.5 text-center space-y-1 border border-gray-800">
                <Sparkles className="w-5 h-5 text-emerald-400 mx-auto" />
                <h4 className="text-xs font-bold text-white">Macro Ratio</h4>
                <p className="text-[10px] text-gray-400">Protein, Carbs, Fat</p>
              </div>

              <div className="glass-pill rounded-2xl p-3.5 text-center space-y-1 border border-gray-800">
                <Zap className="w-5 h-5 text-cyan-400 mx-auto" />
                <h4 className="text-xs font-bold text-white">Zero Database</h4>
                <p className="text-[10px] text-gray-400">Direct AI Vision parsing</p>
              </div>
            </div>
          </div>
        )}

        {/* LOADING STEP */}
        {step === 'LOADING' && (
          <LoadingSkeleton imagePreviewUrl={selectedImage?.previewUrl} />
        )}

        {/* RESULT STEP */}
        {step === 'RESULT' && analysisResult && (
          <NutritionalResultCard
            analysis={analysisResult}
            imagePreviewUrl={selectedImage?.previewUrl}
            onReset={handleReset}
            onSaveToHistory={handleSaveToHistory}
            isSaved={isCurrentSaved}
          />
        )}

        {/* ERROR STEP */}
        {step === 'ERROR' && errorDetails && (
          <div className="w-full max-w-md mx-auto glass-card rounded-3xl p-6 border border-rose-500/30 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 mx-auto">
              {errorDetails.isApiKeyError ? (
                <ShieldAlert className="h-7 w-7" />
              ) : (
                <AlertCircle className="h-7 w-7" />
              )}
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">Analysis Failed</h3>
              <p className="mt-1.5 text-xs text-rose-300/90 leading-relaxed">
                {errorDetails.message}
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              {errorDetails.isApiKeyError && (
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold text-xs transition"
                >
                  <Key className="w-4 h-4" />
                  Configure Gemini API Key
                </button>
              )}

              <button
                type="button"
                onClick={handleReset}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-800 bg-gray-900/80 hover:bg-gray-800 text-gray-300 font-semibold text-xs transition"
              >
                <RotateCcw className="w-4 h-4" />
                Try Another Photo
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Image Preview Confirmation Modal */}
      {step === 'PREVIEW' && selectedImage && (
        <ImagePreviewModal
          imageInfo={selectedImage}
          onAnalyze={handleAnalyzeFood}
          onCancel={handleReset}
          isProcessing={false}
        />
      )}

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSaveKey={handleSaveApiKey}
        currentKey={customApiKey}
      />

      {/* Scan History Drawer */}
      <ScanHistory
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectScan={(item) => {
          setAnalysisResult(item.analysis);
          setSelectedImage({
            base64: '',
            mimeType: 'image/jpeg',
            originalSizeMb: 0,
            compressedSizeMb: 0,
            wasCompressed: false,
            previewUrl: item.imageUri,
          });
          setStep('RESULT');
        }}
        onClearHistory={handleClearHistory}
        onDeleteScan={handleDeleteScan}
      />

      {/* Footer */}
      <footer className="border-t border-gray-800/60 py-4 text-center text-xs text-gray-500">
        <p>NutriSnap AI • Mobile-First Gemini 3.6 Flash Food Estimator</p>
      </footer>
    </div>
  );
}
