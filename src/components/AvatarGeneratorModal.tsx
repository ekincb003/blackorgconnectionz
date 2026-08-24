'use client';

import React, { useState, useMemo } from 'react';
import {
  X,
  Palette,
  Sparkles,
  Check,
  Type,
  Layers,
  ChevronRight
} from 'lucide-react';
import {
  PRESET_BG_COLORS,
  PRESET_TEXT_COLORS,
  GREEK_LETTERS,
  generateMonogramDataUrl
} from '../lib/avatarGenerator';

interface AvatarGeneratorModalProps {
  title?: string;
  initialText?: string;
  initialBg?: string;
  initialTextColor?: string;
  onApply: (dataUrl: string) => void;
  onClose: () => void;
}

export default function AvatarGeneratorModal({
  title = 'Create Monogram Avatar',
  initialText = 'EK',
  initialBg = '#002B7F',
  initialTextColor = '#FFFFFF',
  onApply,
  onClose
}: AvatarGeneratorModalProps) {
  const [text, setText] = useState(initialText);
  const [bgColor, setBgColor] = useState(initialBg);
  const [textColor, setTextColor] = useState(initialTextColor);
  const [activeTab, setActiveTab] = useState<'english' | 'greek' | 'custom'>('english');

  const previewDataUrl = useMemo(() => {
    return generateMonogramDataUrl({
      text: text || 'A',
      bgColor,
      textColor
    });
  }, [text, bgColor, textColor]);

  const handleApply = () => {
    onApply(previewDataUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-panel max-w-md w-full rounded-3xl border border-white/20 overflow-hidden shadow-2xl space-y-5 p-6 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gold-500/10 text-gold-400">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{title}</h3>
              <p className="text-[11px] text-neutral-400">Choose colors & initial letters</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/5 text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Preview */}
        <div className="p-6 rounded-2xl bg-neutral-950/80 border border-white/10 flex flex-col items-center justify-center space-y-3">
          <div className="relative group">
            <img
              src={previewDataUrl}
              alt="Monogram Preview"
              className="w-24 h-24 aspect-square rounded-xl object-contain shadow-2xl ring-4 ring-white/10"
            />
            <span className="absolute -bottom-2 -right-2 p-1 bg-gold-400 text-black rounded-full shadow">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
          </div>
          <p className="text-xs text-neutral-400 font-medium">Live Monogram Preview</p>
        </div>

        {/* Step 1: Initial Letters Selection */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-white flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-gold-400" /> Letter(s) or Monogram
            </label>
            <div className="flex items-center gap-1 text-[10px]">
              <button
                type="button"
                onClick={() => setActiveTab('english')}
                className={`px-2 py-0.5 rounded-md ${
                  activeTab === 'english' ? 'bg-gold-500 text-black font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                A-Z
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('greek')}
                className={`px-2 py-0.5 rounded-md ${
                  activeTab === 'greek' ? 'bg-gold-500 text-black font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Greek (Divine 9)
              </button>
            </div>
          </div>

          <input
            type="text"
            maxLength={4}
            value={text}
            onChange={(e) => setText(e.target.value.toUpperCase())}
            placeholder="e.g. EK, ΑΚΑ, ΦΒΣ"
            className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white font-bold text-center text-sm tracking-widest focus:border-gold-500 focus:outline-none uppercase"
          />

          {/* Quick Select Grid */}
          {activeTab === 'greek' ? (
            <div className="grid grid-cols-8 gap-1 pt-1 max-h-24 overflow-y-auto">
              {GREEK_LETTERS.map((letter) => (
                <button
                  type="button"
                  key={letter}
                  onClick={() => setText((prev) => (prev.length >= 3 ? letter : prev + letter))}
                  className="p-1 rounded bg-white/5 hover:bg-gold-500 hover:text-black text-white text-xs font-bold transition"
                >
                  {letter}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-1 pt-1">
              {['EK', 'UCR', 'CBU', 'D9', 'BSU', '1908', '1911', '1914'].map((quick) => (
                <button
                  type="button"
                  key={quick}
                  onClick={() => setText(quick)}
                  className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 text-[11px] font-semibold transition"
                >
                  {quick}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Step 2: Background Color */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-white flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-gold-400" /> Background Color
          </label>
          <div className="grid grid-cols-6 gap-2">
            {PRESET_BG_COLORS.map((c) => (
              <button
                type="button"
                key={c.hex}
                onClick={() => setBgColor(c.hex)}
                className={`h-8 rounded-xl relative transition transform hover:scale-105 ${
                  bgColor === c.hex ? 'ring-2 ring-white ring-offset-2 ring-offset-neutral-950' : 'opacity-80'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              >
                {bgColor === c.hex && (
                  <Check className="w-3.5 h-3.5 text-white mx-auto drop-shadow-md" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Step 3: Letter Color */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-white flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-gold-400" /> Letter Color
          </label>
          <div className="flex items-center gap-2">
            {PRESET_TEXT_COLORS.map((c) => (
              <button
                type="button"
                key={c.hex}
                onClick={() => setTextColor(c.hex)}
                className={`flex-1 py-1.5 rounded-xl border text-xs font-bold transition ${
                  textColor === c.hex
                    ? 'border-gold-500 text-gold-400 bg-gold-500/15'
                    : 'border-white/10 text-neutral-300 bg-white/5 hover:bg-white/10'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Apply Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="px-5 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-bold text-xs transition shadow-lg shadow-gold-500/20 flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" /> Apply Monogram Avatar
          </button>
        </div>
      </div>
    </div>
  );
}
