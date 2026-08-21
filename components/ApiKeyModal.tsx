'use client';

import React, { useState, useEffect } from 'react';
import { X, Key, ExternalLink, Check, Trash2, ShieldCheck, Eye, EyeOff } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveKey: (key: string) => void;
  currentKey: string;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  onSaveKey,
  currentKey,
}) => {
  const [apiKey, setApiKey] = useState(currentKey);
  const [showKey, setShowKey] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setApiKey(currentKey);
  }, [currentKey, isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveKey(apiKey.trim());
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 600);
  };

  const handleClear = () => {
    setApiKey('');
    onSaveKey('');
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="ios-card w-full max-w-md rounded-3xl p-6 shadow-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white transition rounded-full p-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-2xl bg-orange-500/10 text-orange-500">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Gemini API Key Settings</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Use custom Google AI Studio key or server default
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              Custom Gemini API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-4 py-3 pr-10 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition font-mono"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 p-3.5 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
            <div>
              <p className="leading-relaxed font-normal">
                Your key is saved locally in your browser and used only to authenticate with Gemini 3.6 API.
              </p>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-bold text-orange-500 underline hover:text-orange-600 mt-1.5"
              >
                Get a free API key from Google AI Studio <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2.5 pt-2">
            {currentKey && (
              <button
                type="button"
                onClick={handleClear}
                className="flex items-center justify-center gap-1.5 px-3.5 py-3 rounded-2xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 text-xs font-bold transition"
              >
                <Trash2 className="w-4 h-4" />
                Clear
              </button>
            )}

            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold shadow-lg shadow-orange-500/20 transition active:scale-95"
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4" /> Key Saved!
                </>
              ) : (
                'Save Key & Apply'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
