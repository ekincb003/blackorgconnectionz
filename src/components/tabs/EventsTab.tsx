'use client';

import React, { useState } from 'react';
import { Organization, Event } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  Calendar,
  MapPin,
  Clock,
  ExternalLink,
  Plus,
  Trash2,
  CheckCircle2,
  HelpCircle,
  Users,
  Tag
} from 'lucide-react';
import AddEventModal from '../modals/AddEventModal';

interface EventsTabProps {
  org: Organization;
}

export default function EventsTab({ org }: EventsTabProps) {
  const { currentUser } = useAuth();
  const { toggleEventRsvp, deleteEvent } = useData();
  const [showAddModal, setShowAddModal] = useState(false);

  const isMember = currentUser ? org.members.some((m) => m.userId === currentUser.id) : false;
  const isPrimaryAdmin = currentUser ? org.claimedByUserId === currentUser.id : false;
  const isSuperAdmin = currentUser?.role === 'super_admin';
  const canCreate = isMember || isPrimaryAdmin || isSuperAdmin;

  const getGoogleMapsUrl = (location: string, address?: string) => {
    const query = address ? `${location}, ${address}` : location;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Community Service':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'Greek Stroll/Step':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'Social':
        return 'bg-pink-500/20 text-pink-300 border-pink-500/30';
      case 'Educational':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'Fundraiser':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      default:
        return 'bg-neutral-500/20 text-neutral-300 border-neutral-500/30';
    }
  };

  // Sort events by date ascending
  const sortedEvents = [...org.events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="space-y-6">
      {/* Header & Create Event Button */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gold-400" /> Chapter Events & Calendar
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            {org.events.length} upcoming yard shows, community service drives, panels, and formals
          </p>
        </div>

        {canCreate && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-gold-500 hover:bg-gold-400 text-black shadow-lg shadow-gold-500/20 transition"
          >
            <Plus className="w-4 h-4" /> Add Event
          </button>
        )}
      </div>

      {sortedEvents.length === 0 ? (
        <div className="p-12 text-center glass-card rounded-2xl">
          <Calendar className="w-12 h-12 text-neutral-500 mx-auto mb-3" />
          <h4 className="text-base font-semibold text-white">No Upcoming Events</h4>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto mt-1 mb-4">
            Stay tuned! Upcoming general body meetings, yard strolls, and community outreach will be listed here.
          </p>
          {canCreate && (
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gold-500 text-black hover:bg-gold-400 transition"
            >
              <Plus className="w-3.5 h-3.5" /> Schedule First Event
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {sortedEvents.map((evt) => {
            const isGoing = currentUser ? evt.rsvpsGoing.includes(currentUser.id) : false;
            const isInterested = currentUser ? evt.rsvpsInterested.includes(currentUser.id) : false;
            const canDelete = isPrimaryAdmin || isSuperAdmin;

            const eventDate = new Date(evt.date);

            return (
              <div
                key={evt.id}
                className="glass-card rounded-2xl overflow-hidden border border-white/5 hover:border-gold-500/30 transition flex flex-col justify-between"
              >
                {/* Event Flyer / Banner (if any) */}
                {evt.flyerUrl && (
                  <div className="h-40 w-full overflow-hidden bg-neutral-900 relative">
                    <img
                      src={evt.flyerUrl}
                      alt={evt.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
                    <span
                      className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-0.5 rounded-full border backdrop-blur-md ${getCategoryColor(
                        evt.category
                      )}`}
                    >
                      {evt.category}
                    </span>
                  </div>
                )}

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {!evt.flyerUrl && (
                      <div className="mb-2">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getCategoryColor(
                            evt.category
                          )}`}
                        >
                          {evt.category}
                        </span>
                      </div>
                    )}

                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-base font-bold text-white leading-snug">{evt.title}</h4>
                      {canDelete && (
                        <button
                          onClick={() => deleteEvent(org.id, evt.id)}
                          className="p-1 rounded-lg text-neutral-400 hover:text-red-400 transition"
                          title="Delete Event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <p className="text-xs text-neutral-300 mt-2 line-clamp-3 leading-relaxed">
                      {evt.description}
                    </p>

                    {/* Date & Location Badges */}
                    <div className="space-y-2 mt-4 pt-3 border-t border-white/5 text-xs text-neutral-300">
                      {/* Date & Time */}
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gold-400 shrink-0" />
                        <span>
                          <strong>
                            {eventDate.toLocaleDateString(undefined, {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </strong>
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-neutral-400">
                        <Clock className="w-4 h-4 text-gold-400 shrink-0" />
                        <span>{evt.time}</span>
                      </div>

                      {/* Google Maps Location Link */}
                      <div className="flex items-start gap-2 pt-1">
                        <MapPin className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        <a
                          href={getGoogleMapsUrl(evt.location, evt.locationAddress)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gold-400 hover:text-gold-300 hover:underline font-medium inline-flex items-center gap-1 group/link"
                        >
                          <span>{evt.location}</span>
                          <ExternalLink className="w-3 h-3 group-hover/link:translate-x-0.5 transition" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* RSVPs and Action Buttons */}
                  <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between gap-3">
                    <div className="text-[11px] text-neutral-400 flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <strong className="text-white">{evt.rsvpsGoing.length}</strong> Going
                      </span>
                      <span className="flex items-center gap-1">
                        <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                        <strong className="text-white">{evt.rsvpsInterested.length}</strong> Interested
                      </span>
                    </div>

                    {currentUser && (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => toggleEventRsvp(org.id, evt.id, 'going')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                            isGoing
                              ? 'bg-emerald-500 text-black font-bold'
                              : 'bg-white/5 hover:bg-emerald-500/20 text-neutral-300 hover:text-emerald-300 border border-white/10'
                          }`}
                        >
                          {isGoing ? '✓ Going' : 'Going'}
                        </button>

                        <button
                          onClick={() => toggleEventRsvp(org.id, evt.id, 'interested')}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                            isInterested
                              ? 'bg-amber-500 text-black font-bold'
                              : 'bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10'
                          }`}
                        >
                          {isInterested ? '★ Starred' : 'Interested'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Event Modal */}
      {showAddModal && (
        <AddEventModal orgId={org.id} onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
}
