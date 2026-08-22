'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { ApiKeyModal } from '@/components/ApiKeyModal';
import { InputPanel } from '@/components/InputPanel';
import { ResultsDashboard, PORTION_PRESETS } from '@/components/ResultsDashboard';
import { ScanHistory } from '@/components/ScanHistory';
import { CompressionResult } from '@/utils/imageCompressor';
import { NutritionalAnalysis, MealScanItem, ApiPredictResponse } from '@/types/nutrition';
import { AlertCircle, ShieldAlert, Key } from 'lucide-react';

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<CompressionResult | null>(null);
  const [analysisResult, setAnalysisResult] = useState<NutritionalAnalysis | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorDetails, setErrorDetails] = useState<{ message: string; isApiKeyError?: boolean } | null>(null);

  // Preparation & Portion Controls State
  const [portionMultiplier, setPortionMultiplier] = useState<number>(1.0);
  const [cookingMethod, setCookingMethod] = useState<string>('Grilled/Baked');
  const [mealType, setMealType] = useState<string>('Lunch');

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

    const updatedHistory = [newItem, ...history].slice(0, 30);
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
  const handleImageSelected = (compressed: CompressionResult) => {
    setSelectedImage(compressed);
    setErrorDetails(null);
  };

  // Handle Remove Image
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
    setErrorDetails(null);
    setIsCurrentSaved(false);
  };

  // Perform Gemini AI Analysis
  const handleAnalyzeMeal = async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    setErrorDetails(null);
    setIsCurrentSaved(false);

    const matchedPreset = PORTION_PRESETS.find(
      (p) => Math.abs(p.multiplier - portionMultiplier) < 0.05
    );
    const portionLabel = matchedPreset
      ? `${matchedPreset.label} (${portionMultiplier}x)`
      : `Custom (${portionMultiplier.toFixed(2)}x)`;

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
          portionSizeMultiplier: portionMultiplier,
          portionLabel,
          cookingMethod,
          mealType,
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
        setIsProcessing(false);
        return;
      }

      setAnalysisResult(data.data);
      setIsProcessing(false);
    } catch (err: any) {
      console.error('API request error:', err);
      setErrorDetails({
        message: 'Network error connecting to AI analysis server. Please check your internet connection.',
      });
      setIsProcessing(false);
    }
  };

  // Reset all
  const handleReset = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
    setErrorDetails(null);
    setIsProcessing(false);
    setIsCurrentSaved(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#09090b] text-gray-100 pb-20 lg:pb-8 selection:bg-purple-600 selection:text-white">
      {/* Top Header Navigation */}
      <Header
        hasCustomKey={!!customApiKey}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onToggleHistory={() => setIsHistoryOpen(true)}
        onScanDishClick={() => {
          handleReset();
        }}
        historyCount={history.length}
      />

      {/* Main Two-Column Dashboard Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:px-8 sm:py-10">
        {/* Error Alert Box */}
        {errorDetails && (
          <div className="mb-6 glass-card rounded-2xl p-4 border border-rose-500/30 bg-rose-950/30 text-rose-300 flex items-center justify-between gap-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-3">
              {errorDetails.isApiKeyError ? (
                <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              )}
              <span className="text-xs font-semibold">{errorDetails.message}</span>
            </div>

            <div className="flex items-center gap-2">
              {errorDetails.isApiKeyError && (
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition"
                >
                  <Key className="w-3.5 h-3.5 inline mr-1" /> Key Settings
                </button>
              )}
              <button
                type="button"
                onClick={() => setErrorDetails(null)}
                className="px-3 py-1.5 rounded-xl border border-purple-900/50 bg-purple-950/40 text-slate-300 text-xs font-semibold hover:bg-purple-900/50 transition"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Grid Container: Stacked on Mobile, Side-by-Side on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column (Input Panel): Photo Input Only (5 Cols on Desktop) */}
          <div className="lg:col-span-5 w-full">
            <InputPanel
              selectedImage={selectedImage}
              onImageSelected={handleImageSelected}
              onRemoveImage={handleRemoveImage}
              onAnalyzeMeal={handleAnalyzeMeal}
              isProcessing={isProcessing}
            />
          </div>

          {/* Right Column (Results Dashboard): Analysis Context Setup & Results (7 Cols on Desktop) */}
          <div className="lg:col-span-7 w-full">
            <ResultsDashboard
              analysis={analysisResult}
              imagePreviewUrl={selectedImage?.previewUrl}
              isProcessing={isProcessing}
              onReset={handleReset}
              onSaveToHistory={handleSaveToHistory}
              isSaved={isCurrentSaved}
              portionMultiplier={portionMultiplier}
              onPortionChange={setPortionMultiplier}
              cookingMethod={cookingMethod}
              onCookingMethodChange={setCookingMethod}
              mealType={mealType}
              onMealTypeChange={setMealType}
            />
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        onScanClick={handleReset}
        onHistoryClick={() => setIsHistoryOpen(true)}
        onSettingsClick={() => setIsSettingsOpen(true)}
        onHomeClick={handleReset}
        activeTab={isHistoryOpen ? 'history' : isSettingsOpen ? 'settings' : 'home'}
        historyCount={history.length}
      />

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
        }}
        onClearHistory={handleClearHistory}
        onDeleteScan={handleDeleteScan}
      />

      {/* Footer */}
      <footer className="hidden lg:block border-t border-purple-950/80 py-4 text-center text-xs text-slate-500">
        <p>NutriSnap AI • Black &amp; Purple Standalone Calorie Dashboard</p>
      </footer>
    </div>
  );
}
