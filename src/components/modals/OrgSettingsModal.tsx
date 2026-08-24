'use client';

import React, { useState } from 'react';
import { Organization } from '../../types';
import { useData } from '../../context/DataContext';
import { X, Settings, Image as ImageIcon, Save, Instagram, Mail, Phone, Globe, Palette } from 'lucide-react';
import AvatarGeneratorModal from '../AvatarGeneratorModal';
import BulkImageModal from '../BulkImageModal';
import ImageUploadButton from '../ImageUploadButton';
import ImageWithFallback from '../ImageWithFallback';

interface OrgSettingsModalProps {
  org: Organization;
  onClose: () => void;
}

export default function OrgSettingsModal({ org, onClose }: OrgSettingsModalProps) {
  const { updateOrgDetails } = useData();

  const [formData, setFormData] = useState({
    name: org.name,
    shortName: org.shortName,
    tagline: org.tagline,
    description: org.description,
    logo: org.logo,
    banner: org.banner,
    primaryColor: org.primaryColor,
    secondaryColor: org.secondaryColor,
    contactEmail: org.contactEmail,
    contactPhone: org.contactPhone || '',
    instagramHandle: org.instagramHandle || '',
    website: org.website || ''
  });

  const [showLogoGenerator, setShowLogoGenerator] = useState(false);
  const [showBannerPicker, setShowBannerPicker] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateOrgDetails(org.id, formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-panel max-w-2xl w-full rounded-3xl border border-white/10 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-neutral-950/80">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Settings className="w-4 h-4 text-gold-400" /> Organization Settings & Branding
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
              <label className="block font-semibold text-neutral-300 mb-1">Full Org Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-300 mb-1">Short / Common Name *</label>
              <input
                type="text"
                value={formData.shortName}
                onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                required
                className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-neutral-300 mb-1">Motto / Tagline *</label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              required
              className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-300 mb-1">About & Purpose Description *</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none"
            />
          </div>

          {/* Visual Branding URLs & Generators */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/5">
            <div>
              <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
                <label className="font-semibold text-neutral-300 flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-gold-400" /> Logo / Crest Image
                </label>
                <div className="flex items-center gap-2">
                  <ImageUploadButton
                    label="Upload Photo"
                    imageType="avatar"
                    onImageUploaded={(dataUrl) => setFormData((prev) => ({ ...prev, logo: dataUrl }))}
                  />
                  <button
                    type="button"
                    onClick={() => setShowLogoGenerator(true)}
                    className="text-[11px] text-gold-400 hover:underline flex items-center gap-1 font-bold"
                  >
                    <Palette className="w-3 h-3" /> Monogram
                  </button>
                </div>
              </div>
              <input
                type="text"
                value={formData.logo}
                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                placeholder="https://... or upload photo"
                className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
                <label className="font-semibold text-neutral-300 flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-gold-400" /> Header Banner
                </label>
                <div className="flex items-center gap-2">
                  <ImageUploadButton
                    label="Upload Banner from Files"
                    imageType="banner"
                    onImageUploaded={(dataUrl) => setFormData((prev) => ({ ...prev, banner: dataUrl }))}
                  />
                  <button
                    type="button"
                    onClick={() => setShowBannerPicker(true)}
                    className="text-[11px] text-gold-400 hover:underline flex items-center gap-1 font-bold"
                  >
                    <ImageIcon className="w-3 h-3" /> Pick Gallery
                  </button>
                </div>
              </div>
              <input
                type="text"
                value={formData.banner}
                onChange={(e) => setFormData({ ...formData, banner: e.target.value })}
                placeholder="https://... or upload photo/banner"
                className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Color Palettes */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-neutral-300 mb-1">Primary Color (Hex)</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-white/10 text-white text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-neutral-300 mb-1">Secondary Color (Hex)</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.secondaryColor}
                  onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                  className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.secondaryColor}
                  onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-white/10 text-white text-xs"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="pt-2 border-t border-white/5 space-y-3">
            <h4 className="font-bold text-neutral-200">Public Contact & Social Channels</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-neutral-300 mb-1 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-neutral-400" /> Contact Email *
                </label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1 flex items-center gap-1">
                  <Instagram className="w-3.5 h-3.5 text-pink-400" /> Instagram Handle
                </label>
                <input
                  type="text"
                  value={formData.instagramHandle}
                  onChange={(e) => setFormData({ ...formData, instagramHandle: e.target.value })}
                  placeholder="@org_handle"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" /> Contact Phone
                </label>
                <input
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  placeholder="(555) 000-0000"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-blue-400" /> Official Website
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Action Footer */}
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
              <Save className="w-3.5 h-3.5" /> Save Changes
            </button>
          </div>
        </form>

        {/* Logo Monogram Creator */}
        {showLogoGenerator && (
          <AvatarGeneratorModal
            title={`Create Crest / Monogram for ${org.shortName}`}
            initialText={org.shortName.length <= 4 ? org.shortName : org.shortName.substring(0, 3)}
            initialBg={formData.primaryColor || '#002B7F'}
            initialTextColor={formData.secondaryColor || '#FFFFFF'}
            onApply={(dataUrl) => setFormData((prev) => ({ ...prev, logo: dataUrl }))}
            onClose={() => setShowLogoGenerator(false)}
          />
        )}

        {/* Banner Gallery Picker */}
        {showBannerPicker && (
          <BulkImageModal
            title={`Select Banner for ${org.name}`}
            mode="banner"
            onSelect={(imgUrl) => setFormData((prev) => ({ ...prev, banner: imgUrl }))}
            onClose={() => setShowBannerPicker(false)}
          />
        )}
      </div>
    </div>
  );
}
