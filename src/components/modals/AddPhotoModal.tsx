'use client';

import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { X, Image as ImageIcon, Upload, Link as LinkIcon } from 'lucide-react';

import { compressImageFile } from '../../lib/imageUtils';

interface AddPhotoModalProps {
  orgId: string;
  onClose: () => void;
}

export default function AddPhotoModal({ orgId, onClose }: AddPhotoModalProps) {
  const { addPhoto } = useData();

  const [mode, setMode] = useState<'url' | 'file'>('url');
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsProcessing(true);
        const compressed = await compressImageFile(file, {
          maxWidth: 1400,
          maxHeight: 1000,
          quality: 0.85
        });
        setPreview(compressed);
        setUrl(compressed);
      } catch (err) {
        console.error('Photo compression error:', err);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalUrl = mode === 'url' ? url.trim() : preview;
    if (!finalUrl) return;

    addPhoto(orgId, {
      title: title.trim() || 'Chapter Photo',
      caption: caption.trim(),
      url: finalUrl
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-panel max-w-md w-full rounded-2xl border border-white/10 overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-neutral-950/80">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-gold-400" /> Upload Chapter Photo
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/5 text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Source Switcher */}
        <div className="p-5 pb-0">
          <div className="grid grid-cols-2 gap-2 bg-neutral-900 p-1 rounded-xl border border-white/5 text-xs">
            <button
              type="button"
              onClick={() => setMode('url')}
              className={`py-1.5 rounded-lg font-semibold transition flex items-center justify-center gap-1.5 ${
                mode === 'url' ? 'bg-gold-500 text-black' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" /> Image Link / URL
            </button>
            <button
              type="button"
              onClick={() => setMode('file')}
              className={`py-1.5 rounded-lg font-semibold transition flex items-center justify-center gap-1.5 ${
                mode === 'file' ? 'bg-gold-500 text-black' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Upload className="w-3.5 h-3.5" /> Upload File / Roll
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          {mode === 'url' ? (
            <div>
              <label className="block font-semibold text-neutral-300 mb-1">Image URL *</label>
              <input
                type="url"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setPreview(e.target.value);
                }}
                placeholder="https://images.unsplash.com/..."
                required
                className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none"
              />
            </div>
          ) : (
            <div>
              <label className="block font-semibold text-neutral-300 mb-1">Select from Device / Roll *</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs file:mr-3 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gold-500 file:text-black"
              />
            </div>
          )}

          {/* Preview */}
          {preview && (
            <div className="h-32 w-full rounded-xl overflow-hidden bg-neutral-900 border border-white/10">
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}

          <div>
            <label className="block font-semibold text-neutral-300 mb-1">Photo Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Fall 2026 Probate Show / Food Drive"
              required
              className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-300 mb-1">Caption (Optional)</label>
            <textarea
              rows={2}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Add story or photo details..."
              className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none"
            />
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-bold text-xs transition shadow-lg"
            >
              Add to Gallery
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
