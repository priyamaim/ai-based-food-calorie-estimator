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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#09090b]/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-modal w-full max-w-md rounded-3xl p-6 shadow-2xl bg-[#120c1f] border border-purple-900/40 text-white relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition rounded-xl p-1.5 hover:bg-purple-950/60"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Gemini API Key Settings</h3>
            <p className="text-xs text-slate-400">
              Use custom Google AI Studio key or server default
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-purple-300 mb-1.5 uppercase tracking-wider">
              Custom Gemini API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full rounded-2xl bg-[#090511] border border-purple-900/50 px-4 py-3 pr-10 text-sm text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition font-mono"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="rounded-2xl bg-[#090511]/60 border border-purple-900/40 p-3.5 text-xs text-slate-300 flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <p className="leading-relaxed font-normal">
                Your key is saved locally in your browser and used only to authenticate with Gemini 3.6 API.
              </p>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-bold text-purple-400 underline hover:text-purple-300 mt-1.5"
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
                className="flex items-center justify-center gap-1.5 px-3.5 py-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 text-xs font-bold transition"
              >
                <Trash2 className="w-4 h-4" />
                Clear
              </button>
            )}

            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-violet-500 to-fuchsia-500 hover:from-purple-500 hover:to-fuchsia-400 text-white text-xs font-bold shadow-lg shadow-purple-500/25 transition active:scale-95"
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
