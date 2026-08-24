'use client';

import React, { useState } from 'react';
import { X, Image as ImageIcon, Sparkles, Check, Upload, Link as LinkIcon, Layers } from 'lucide-react';
import { CURATED_BANNER_LIBRARY } from '../lib/avatarGenerator';

interface BulkImageModalProps {
  title?: string;
  mode?: 'banner' | 'avatar' | 'bulk_urls';
  onSelect: (imageUrl: string) => void;
  onClose: () => void;
}

export default function BulkImageModal({
  title = 'Select Image or Banner',
  mode = 'banner',
  onSelect,
  onClose
}: BulkImageModalProps) {
  const [customUrl, setCustomUrl] = useState('');
  const [bulkUrls, setBulkUrls] = useState('');
  const [activeTab, setActiveTab] = useState<'curated' | 'custom' | 'bulk'>('curated');

  const handleApplyCustom = () => {
    if (!customUrl.trim()) return;
    onSelect(customUrl.trim());
    onClose();
  };

  const handleApplyBulkFirst = () => {
    const urls = bulkUrls
      .split('\n')
      .map((u) => u.trim())
      .filter((u) => u.startsWith('http') || u.startsWith('data:image'));
    if (urls.length > 0) {
      onSelect(urls[0]);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-panel max-w-2xl w-full rounded-3xl border border-white/20 overflow-hidden shadow-2xl space-y-4 p-6 animate-fadeIn max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gold-500/10 text-gold-400">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{title}</h3>
              <p className="text-[11px] text-neutral-400">
                Choose from high-definition campus banners or provide image URLs
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-full bg-white/5 text-neutral-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-3 p-1 rounded-xl bg-neutral-900 border border-white/10 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('curated')}
            className={`py-1.5 rounded-lg font-bold transition ${
              activeTab === 'curated' ? 'bg-gold-500 text-black' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Curated Gallery
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('custom')}
            className={`py-1.5 rounded-lg font-bold transition ${
              activeTab === 'custom' ? 'bg-gold-500 text-black' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Direct URL
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('bulk')}
            className={`py-1.5 rounded-lg font-bold transition ${
              activeTab === 'bulk' ? 'bg-gold-500 text-black' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Paste Bulk URLs
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {activeTab === 'curated' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {CURATED_BANNER_LIBRARY.map((item, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => {
                    onSelect(item.url);
                    onClose();
                  }}
                  className="rounded-2xl overflow-hidden glass-card border border-white/10 hover:border-gold-500/50 transition group text-left flex flex-col"
                >
                  <div className="h-28 w-full overflow-hidden relative">
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/70 text-[9px] text-gold-300 font-bold">
                      {item.category}
                    </span>
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <p className="text-xs font-semibold text-white group-hover:text-gold-400 transition truncate">
                      {item.title}
                    </p>
                    <span className="text-[10px] text-gold-400 font-bold shrink-0">Select →</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {activeTab === 'custom' && (
            <div className="space-y-4 p-2">
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1.5">Direct Image URL</label>
                <input
                  type="url"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... or cloud image URL"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none"
                />
              </div>

              {customUrl && (
                <div className="p-3 rounded-2xl bg-neutral-950 border border-white/10 space-y-2">
                  <p className="text-[11px] text-neutral-400">Image Preview:</p>
                  <div className="h-36 rounded-xl overflow-hidden bg-black/40">
                    <img src={customUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleApplyCustom}
                disabled={!customUrl.trim()}
                className="w-full py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 disabled:opacity-40 text-black font-bold text-xs transition"
              >
                Apply Image URL
              </button>
            </div>
          )}

          {activeTab === 'bulk' && (
            <div className="space-y-3 p-2">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-neutral-300">
                  Paste Bulk Image URLs (one per line)
                </label>
                <p className="text-[11px] text-neutral-400">
                  You can paste multiple image links from Unsplash, Imgur, or cloud storage.
                </p>
              </div>

              <textarea
                rows={6}
                value={bulkUrls}
                onChange={(e) => setBulkUrls(e.target.value)}
                placeholder="https://images.unsplash.com/photo-1541339907198...&#10;https://images.unsplash.com/photo-1523240795612...&#10;https://..."
                className="w-full p-3 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs font-mono focus:border-gold-500 focus:outline-none"
              />

              <button
                type="button"
                onClick={handleApplyBulkFirst}
                disabled={!bulkUrls.trim()}
                className="w-full py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 disabled:opacity-40 text-black font-bold text-xs transition"
              >
                Apply First Valid URL
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
