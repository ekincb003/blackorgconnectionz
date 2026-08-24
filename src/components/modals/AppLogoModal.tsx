'use client';

import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { X, Image as ImageIcon, Sparkles, Check, RefreshCw } from 'lucide-react';
import ImageUploadButton from '../ImageUploadButton';
import { DEFAULT_APP_LOGO_SVG } from '../../lib/defaultAppLogo';

interface AppLogoModalProps {
  onClose: () => void;
}

export default function AppLogoModal({ onClose }: AppLogoModalProps) {
  const { appLogo, updateAppLogo } = useData();
  const [logoInput, setLogoInput] = useState(appLogo);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logoInput.trim()) return;
    updateAppLogo(logoInput.trim());
    setSaved(true);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  const handleResetDefault = () => {
    setLogoInput(DEFAULT_APP_LOGO_SVG);
    updateAppLogo(DEFAULT_APP_LOGO_SVG);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-panel max-w-md w-full rounded-3xl border border-white/10 overflow-hidden shadow-2xl space-y-4 p-6">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <ImageIcon className="w-5 h-5 text-gold-400" /> Customize App Logo
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Logo Preview */}
        <div className="text-center space-y-2 py-2">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-neutral-900 border border-white/10 p-2 flex items-center justify-center shadow-xl">
            <img
              src={logoInput}
              alt="App Logo Preview"
              className="w-full h-full object-contain"
            />
          </div>
          <p className="text-xs text-neutral-400">Current App Crest / Logo</p>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
              <label className="font-semibold text-neutral-300">Upload from Device Photos/Files</label>
              <ImageUploadButton
                label="Choose Logo Image"
                imageType="avatar"
                onImageUploaded={(dataUrl) => setLogoInput(dataUrl)}
              />
            </div>
            <input
              type="text"
              value={logoInput}
              onChange={(e) => setLogoInput(e.target.value)}
              placeholder="Or paste image URL (https://...)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={handleResetDefault}
              className="text-xs text-neutral-400 hover:text-gold-400 flex items-center gap-1 transition"
            >
              <RefreshCw className="w-3 h-3" /> Reset Default Crest
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-white/5 text-neutral-300 hover:text-white text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-black text-xs font-bold transition shadow-lg flex items-center gap-1.5"
              >
                {saved ? <Check className="w-3.5 h-3.5" /> : null}
                {saved ? 'Saved!' : 'Apply App Logo'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
