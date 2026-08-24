'use client';

import React, { useState } from 'react';
import { Organization } from '../../types';
import { useData } from '../../context/DataContext';
import { X, BookOpen, Save } from 'lucide-react';

interface EditHistoryModalProps {
  org: Organization;
  onClose: () => void;
}

export default function EditHistoryModal({ org, onClose }: EditHistoryModalProps) {
  const { updateOrgHistory } = useData();

  const [formData, setFormData] = useState({
    foundingDate: org.history.foundingDate,
    foundingLocation: org.history.foundingLocation,
    charterDateOnCampus: org.history.charterDateOnCampus || '',
    motto: org.history.motto,
    principles: org.history.principles.join(', '),
    flower: org.history.flower || '',
    symbol: org.history.symbol || '',
    foundingStory: org.history.foundingStory,
    campusChapterStory: org.history.campusChapterStory,
    historicalSignificance: org.history.historicalSignificance
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateOrgHistory(org.id, {
      foundingDate: formData.foundingDate,
      foundingLocation: formData.foundingLocation,
      charterDateOnCampus: formData.charterDateOnCampus || undefined,
      motto: formData.motto,
      principles: formData.principles.split(',').map((p) => p.trim()).filter(Boolean),
      flower: formData.flower || undefined,
      symbol: formData.symbol || undefined,
      foundingStory: formData.foundingStory,
      campusChapterStory: formData.campusChapterStory,
      historicalSignificance: formData.historicalSignificance
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-panel max-w-2xl w-full rounded-2xl border border-white/10 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-neutral-950/80">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-gold-400" /> Edit History & Founding Story
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/5 text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-neutral-300 mb-1">Founding Date *</label>
              <input
                type="text"
                value={formData.foundingDate}
                onChange={(e) => setFormData({ ...formData, foundingDate: e.target.value })}
                required
                className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-300 mb-1">Founding Location *</label>
              <input
                type="text"
                value={formData.foundingLocation}
                onChange={(e) => setFormData({ ...formData, foundingLocation: e.target.value })}
                required
                className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-neutral-300 mb-1">Campus Charter Date</label>
              <input
                type="text"
                value={formData.charterDateOnCampus}
                onChange={(e) => setFormData({ ...formData, charterDateOnCampus: e.target.value })}
                placeholder="e.g. March 15, 1974"
                className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-300 mb-1">Official Motto *</label>
              <input
                type="text"
                value={formData.motto}
                onChange={(e) => setFormData({ ...formData, motto: e.target.value })}
                required
                className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-neutral-300 mb-1">
              Cardinal Principles (Comma-separated)
            </label>
            <input
              type="text"
              value={formData.principles}
              onChange={(e) => setFormData({ ...formData, principles: e.target.value })}
              placeholder="e.g. Scholarship, Fellowship, Good Character, Uplifting Humanity"
              className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-300 mb-1">Founding Story *</label>
            <textarea
              rows={4}
              value={formData.foundingStory}
              onChange={(e) => setFormData({ ...formData, foundingStory: e.target.value })}
              required
              className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-300 mb-1">
              Historical Significance & Notable Alumni *
            </label>
            <textarea
              rows={3}
              value={formData.historicalSignificance}
              onChange={(e) => setFormData({ ...formData, historicalSignificance: e.target.value })}
              required
              className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-300 mb-1">On-Campus Chapter Legacy *</label>
            <textarea
              rows={3}
              value={formData.campusChapterStory}
              onChange={(e) => setFormData({ ...formData, campusChapterStory: e.target.value })}
              required
              className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-bold text-xs shadow-lg transition flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" /> Save History
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
