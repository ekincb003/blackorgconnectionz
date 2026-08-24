'use client';

import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { X, Calendar, MapPin, Clock, Tag, Image as ImageIcon, Users, Sparkles, Building2, Check } from 'lucide-react';
import { Event, EventCategory } from '../../types';
import ImageUploadButton from '../ImageUploadButton';

interface AddEventModalProps {
  orgId?: string;
  onClose: () => void;
}

export default function AddEventModal({ orgId: initialOrgId, onClose }: AddEventModalProps) {
  const { orgs, createEvent } = useData();

  const [selectedHostOrgId, setSelectedHostOrgId] = useState(initialOrgId || (orgs.length > 0 ? orgs[0].id : ''));
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [locationAddress, setLocationAddress] = useState('');
  const [category, setCategory] = useState<EventCategory>('Social');
  const [flyerUrl, setFlyerUrl] = useState('');
  const [isCollab, setIsCollab] = useState(false);
  const [collaboratingOrgIds, setCollaboratingOrgIds] = useState<string[]>([]);

  const toggleCollaborator = (id: string) => {
    if (collaboratingOrgIds.includes(id)) {
      setCollaboratingOrgIds(collaboratingOrgIds.filter((oId) => oId !== id));
    } else {
      setCollaboratingOrgIds([...collaboratingOrgIds, id]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date || !location.trim() || !selectedHostOrgId) return;

    createEvent(selectedHostOrgId, {
      title: title.trim(),
      description: description.trim(),
      date,
      time: time.trim() || 'TBA',
      location: location.trim(),
      locationAddress: locationAddress.trim() || undefined,
      category,
      flyerUrl: flyerUrl.trim() || undefined,
      isCollaboration: isCollab && collaboratingOrgIds.length > 0,
      collaboratingOrgIds: isCollab ? collaboratingOrgIds : []
    });

    onClose();
  };

  const otherOrgs = orgs.filter((o) => o.id !== selectedHostOrgId);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-panel max-w-lg w-full rounded-2xl border border-white/10 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-neutral-950/80">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gold-400" /> Schedule Campus Event
            </h3>
            <p className="text-[11px] text-neutral-400 mt-0.5">Post singular or joint multi-organization event</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/5 text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Host Organization */}
          <div>
            <label className="block font-semibold text-neutral-300 mb-1">Host Organization *</label>
            <select
              value={selectedHostOrgId}
              onChange={(e) => {
                setSelectedHostOrgId(e.target.value);
                setCollaboratingOrgIds(collaboratingOrgIds.filter((id) => id !== e.target.value));
              }}
              required
              className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none"
            >
              {orgs.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name} ({o.shortName})
                </option>
              ))}
            </select>
          </div>

          {/* Event Title */}
          <div>
            <label className="block font-semibold text-neutral-300 mb-1">Event Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Yard Show 2026 / Black Excellence Gala / Joint Study Jam"
              required
              className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none"
            />
          </div>

          {/* Event Scope: Singular vs Collaboration */}
          <div className="p-3 rounded-xl bg-neutral-900/90 border border-white/10 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-neutral-200 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-gold-400" /> Multi-Organization Collaboration?
              </label>
              <button
                type="button"
                onClick={() => setIsCollab(!isCollab)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  isCollab ? 'bg-gold-500 text-black' : 'bg-white/10 text-neutral-400 hover:text-white'
                }`}
              >
                {isCollab ? '🤝 Joint Collaboration' : '👤 Singular Org Event'}
              </button>
            </div>

            {isCollab && (
              <div className="pt-2 border-t border-white/5 space-y-2">
                <p className="text-[11px] text-neutral-400">
                  Select all collaborating organizations (event will sync across all selected org calendars):
                </p>
                <div className="max-h-36 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-1.5 p-1 bg-black/40 rounded-lg">
                  {otherOrgs.map((o) => {
                    const isSelected = collaboratingOrgIds.includes(o.id);
                    return (
                      <button
                        key={o.id}
                        type="button"
                        onClick={() => toggleCollaborator(o.id)}
                        className={`flex items-center justify-between p-2 rounded-lg text-left text-[11px] font-medium transition border ${
                          isSelected
                            ? 'bg-gold-500/20 text-gold-300 border-gold-500/50'
                            : 'bg-white/5 text-neutral-300 border-transparent hover:bg-white/10'
                        }`}
                      >
                        <span className="truncate">{o.shortName}</span>
                        {isSelected && <Check className="w-3 h-3 text-gold-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block font-semibold text-neutral-300 mb-1">Event Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as EventCategory)}
              className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none"
            >
              <option value="Social">🎉 Social Event</option>
              <option value="Community Service">🌱 Community Service</option>
              <option value="Greek Stroll/Step">⚡ Greek Stroll / Step Show</option>
              <option value="Educational">📚 Educational / Career Panel</option>
              <option value="Meeting">📋 General Body Meeting</option>
              <option value="Fundraiser">💰 Fundraiser / Gala</option>
              <option value="Party">🎈 Party / Celebration</option>
              <option value="Workshop">🛠️ Workshop & Mentorship</option>
            </select>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-neutral-300 mb-1">Event Date *</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-300 mb-1">Time Range</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 6:00 PM - 8:30 PM"
                className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block font-semibold text-neutral-300 mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-red-400" /> Location Name *
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. HUB 302 / Bell Tower Lawn / Student Union Room 101"
              required
              className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-300 mb-1">
              Physical Street Address (Optional for Maps Directions)
            </label>
            <input
              type="text"
              value={locationAddress}
              onChange={(e) => setLocationAddress(e.target.value)}
              placeholder="900 University Ave, Riverside, CA 92521"
              className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none"
            />
          </div>

          {/* Flyer Image & Upload from Device */}
          <div>
            <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
              <label className="font-semibold text-neutral-300 flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5 text-gold-400" /> Event Flyer / Graphic (Optional)
              </label>
              <ImageUploadButton
                label="Upload Flyer from Files/Photos"
                imageType="banner"
                onImageUploaded={(url) => setFlyerUrl(url)}
              />
            </div>
            <input
              type="text"
              value={flyerUrl}
              onChange={(e) => setFlyerUrl(e.target.value)}
              placeholder="https://... or upload flyer photo"
              className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold text-neutral-300 mb-1">Description & Details</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain the itinerary, who should attend, dress code, RSVP instructions, or parking details..."
              className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none"
            />
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-bold text-xs shadow-lg transition flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" /> Publish Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
