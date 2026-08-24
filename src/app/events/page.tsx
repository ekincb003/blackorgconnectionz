'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  Calendar as CalendarIcon,
  MapPin,
  Clock,
  ExternalLink,
  Plus,
  Search,
  Filter,
  Users,
  Sparkles,
  CheckCircle2,
  Star,
  Building2,
  Layers,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Eye,
  Grid,
  List,
  CalendarDays,
  X
} from 'lucide-react';
import { Event, EventCategory } from '../../types';
import ImageWithFallback from '../../components/ImageWithFallback';
import AddEventModal from '../../components/modals/AddEventModal';

const CATEGORIES: ('All' | EventCategory)[] = [
  'All',
  'Social',
  'Greek Stroll/Step',
  'Community Service',
  'Educational',
  'Meeting',
  'Fundraiser',
  'Party',
  'Workshop'
];

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function CampusEventsPage() {
  const { currentUser } = useAuth();
  const { orgs, toggleEventRsvp, deleteEvent } = useData();

  const [selectedCategory, setSelectedCategory] = useState<'All' | EventCategory>('All');
  const [selectedOrgFilter, setSelectedOrgFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedFlyer, setSelectedFlyer] = useState<{ url: string; title: string } | null>(null);

  // Calendar State
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<string | null>(null);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const jumpToToday = () => {
    setCurrentDate(new Date());
    const todayStr = new Date().toISOString().split('T')[0];
    setSelectedCalendarDay(todayStr);
  };

  // Collect all events across all orgs, de-duplicating by id
  const allEvents = useMemo(() => {
    const eventMap = new Map<string, Event>();
    orgs.forEach((org) => {
      org.events.forEach((evt) => {
        if (!eventMap.has(evt.id)) {
          eventMap.set(evt.id, {
            ...evt,
            orgName: evt.orgName || org.shortName,
            orgLogo: evt.orgLogo || org.logo
          });
        }
      });
    });
    return Array.from(eventMap.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [orgs]);

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return allEvents.filter((evt) => {
      // Category filter
      if (selectedCategory !== 'All' && evt.category !== selectedCategory) {
        return false;
      }
      // Org filter
      if (selectedOrgFilter !== 'all') {
        const isHost = evt.orgId === selectedOrgFilter;
        const isCollab = evt.collaboratingOrgIds?.includes(selectedOrgFilter);
        if (!isHost && !isCollab) return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = evt.title.toLowerCase().includes(q);
        const matchLoc = evt.location.toLowerCase().includes(q);
        const matchDesc = evt.description?.toLowerCase().includes(q);
        const matchOrg = evt.orgName?.toLowerCase().includes(q);
        if (!matchTitle && !matchLoc && !matchDesc && !matchOrg) return false;
      }
      return true;
    });
  }, [allEvents, selectedCategory, selectedOrgFilter, searchQuery]);

  // Calendar Grid Calculations
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

    const days = [];

    // Previous month padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      const m = currentMonth === 0 ? 11 : currentMonth - 1;
      const y = currentMonth === 0 ? currentYear - 1 : currentYear;
      const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({
        dayNum: d,
        dateStr,
        isCurrentMonth: false,
        events: filteredEvents.filter((e) => e.date === dateStr)
      });
    }

    // Current month days
    for (let i = 1; i <= totalDaysInMonth; i++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({
        dayNum: i,
        dateStr,
        isCurrentMonth: true,
        events: filteredEvents.filter((e) => e.date === dateStr)
      });
    }

    // Next month padding to fill grid to 35 or 42 cells
    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      const m = currentMonth === 11 ? 0 : currentMonth + 1;
      const y = currentMonth === 11 ? currentYear + 1 : currentYear;
      const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({
        dayNum: i,
        dateStr,
        isCurrentMonth: false,
        events: filteredEvents.filter((e) => e.date === dateStr)
      });
    }

    return days;
  }, [currentYear, currentMonth, filteredEvents]);

  const todayStr = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }, []);

  const selectedDayEvents = useMemo(() => {
    if (!selectedCalendarDay) return [];
    return filteredEvents.filter((e) => e.date === selectedCalendarDay);
  }, [selectedCalendarDay, filteredEvents]);

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
      case 'Party':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'Workshop':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      default:
        return 'bg-neutral-500/20 text-neutral-300 border-neutral-500/30';
    }
  };

  const canCreate = !!currentUser;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 relative overflow-hidden shadow-2xl">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-gold-400 text-xs font-bold uppercase tracking-wider mb-1">
              <CalendarDays className="w-4 h-4" /> Full Campus Events Calendar
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Campus Master <span className="gold-gradient-text">Events & Yard Calendar</span>
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl mt-1">
              Explore upcoming Greek strolls, community service drives, joint collaborations, and general body meetings.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            {/* View Mode Toggle */}
            <div className="p-1 rounded-2xl bg-neutral-900 border border-white/10 flex items-center gap-1 shadow-inner">
              <button
                type="button"
                onClick={() => setViewMode('calendar')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  viewMode === 'calendar'
                    ? 'bg-gold-500 text-black shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Grid className="w-3.5 h-3.5" /> Month Calendar
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  viewMode === 'list'
                    ? 'bg-gold-500 text-black shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <List className="w-3.5 h-3.5" /> Event Feed
              </button>
            </div>

            {canCreate && (
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-extrabold text-xs shadow-lg shadow-gold-500/25 transition"
              >
                <Plus className="w-4 h-4" /> Schedule Event
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-card p-4 rounded-2xl border border-white/10 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events by title, location, or host org..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs placeholder:text-neutral-500 focus:border-gold-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Org Filter */}
            <select
              value={selectedOrgFilter}
              onChange={(e) => setSelectedOrgFilter(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none w-full sm:w-auto"
            >
              <option value="all">All Organizations ({allEvents.length})</option>
              {orgs.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.shortName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-gold-500 text-black shadow-md'
                  : 'bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* FULL WORKING MONTH CALENDAR VIEW */}
      {viewMode === 'calendar' && (
        <div className="space-y-4">
          {/* Month Header & Controls */}
          <div className="glass-panel p-4 sm:p-5 rounded-3xl border border-white/10 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-gold-400" />
                {MONTH_NAMES[currentMonth]} {currentYear}
              </h2>
              <button
                type="button"
                onClick={jumpToToday}
                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white/10 text-neutral-300 hover:text-white hover:bg-white/20 transition"
              >
                Today
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prevMonth}
                className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-white transition flex items-center gap-1 text-xs font-semibold"
              >
                <ChevronLeft className="w-4 h-4" /> Prev
              </button>
              <button
                type="button"
                onClick={nextMonth}
                className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-white transition flex items-center gap-1 text-xs font-semibold"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 7-Day Grid */}
          <div className="glass-card rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
            {/* Weekday Column Headers */}
            <div className="grid grid-cols-7 border-b border-white/10 bg-neutral-900/90 text-center py-2.5">
              {DAYS_OF_WEEK.map((day) => (
                <div key={day} className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Day Cells Grid */}
            <div className="grid grid-cols-7 auto-rows-fr gap-px bg-white/5">
              {calendarDays.map((cell, idx) => {
                const isToday = cell.dateStr === todayStr;
                const isSelected = cell.dateStr === selectedCalendarDay;
                const hasEvents = cell.events.length > 0;

                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedCalendarDay(cell.dateStr)}
                    className={`min-h-[100px] sm:min-h-[125px] p-1.5 sm:p-2.5 bg-neutral-950 flex flex-col justify-between transition cursor-pointer relative group ${
                      !cell.isCurrentMonth ? 'bg-neutral-950/40 opacity-40' : 'hover:bg-neutral-900/80'
                    } ${isSelected ? 'ring-2 ring-gold-500 bg-gold-500/[0.05]' : ''}`}
                  >
                    {/* Date Number Header */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                          isToday
                            ? 'bg-gold-500 text-black font-extrabold shadow-md'
                            : isSelected
                            ? 'text-gold-400 font-bold'
                            : 'text-neutral-300'
                        }`}
                      >
                        {cell.dayNum}
                      </span>

                      {hasEvents && (
                        <span className="text-[10px] font-extrabold text-gold-400 px-1.5 py-0.2 rounded-full bg-gold-500/20 border border-gold-500/30">
                          {cell.events.length}
                        </span>
                      )}
                    </div>

                    {/* Events Mini List inside cell */}
                    <div className="space-y-1 my-1 overflow-hidden">
                      {cell.events.slice(0, 2).map((evt) => (
                        <div
                          key={evt.id}
                          className={`px-1.5 py-0.5 rounded text-[10px] font-semibold truncate border flex items-center gap-1 ${getCategoryColor(
                            evt.category
                          )}`}
                          title={`${evt.title} (${evt.time})`}
                        >
                          {evt.isCollaboration && <Users className="w-2.5 h-2.5 shrink-0 text-purple-400" />}
                          <span className="truncate">{evt.title}</span>
                        </div>
                      ))}
                      {cell.events.length > 2 && (
                        <div className="text-[9px] text-neutral-400 font-bold px-1">
                          +{cell.events.length - 2} more
                        </div>
                      )}
                    </div>

                    <div className="text-[9px] text-neutral-500 group-hover:text-gold-400 transition text-right">
                      {hasEvents ? 'View Day' : ''}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Day Inspector Tray */}
          {selectedCalendarDay && (
            <div className="glass-panel p-6 rounded-3xl border border-gold-500/30 space-y-4 shadow-2xl animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-gold-400" />
                    Events for {new Date(selectedCalendarDay + 'T00:00:00').toLocaleDateString(undefined, {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {selectedDayEvents.length} event{selectedDayEvents.length === 1 ? '' : 's'} scheduled for this date
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCalendarDay(null)}
                  className="p-1.5 rounded-lg bg-white/5 text-neutral-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {selectedDayEvents.length === 0 ? (
                <div className="p-8 text-center glass-card rounded-2xl">
                  <p className="text-xs text-neutral-400">No events scheduled on this date.</p>
                  {canCreate && (
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="mt-3 inline-flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold bg-gold-500 text-black hover:bg-gold-400 transition"
                    >
                      <Plus className="w-3.5 h-3.5" /> Schedule Event on This Date
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedDayEvents.map((evt) => {
                    const isGoing = currentUser ? evt.rsvpsGoing.includes(currentUser.id) : false;
                    const isInterested = currentUser ? evt.rsvpsInterested.includes(currentUser.id) : false;

                    return (
                      <div key={evt.id} className="glass-card p-5 rounded-2xl border border-white/10 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getCategoryColor(evt.category)}`}>
                              {evt.category}
                            </span>
                            <h4 className="font-bold text-white text-base mt-1">{evt.title}</h4>
                            <p className="text-xs text-gold-400 font-semibold">{evt.orgName}</p>
                          </div>
                          {evt.flyerUrl && (
                            <button
                              onClick={() => setSelectedFlyer({ url: evt.flyerUrl!, title: evt.title })}
                              className="text-xs text-neutral-300 hover:text-gold-400 flex items-center gap-1 p-1 rounded bg-white/5"
                            >
                              <Eye className="w-3 h-3" /> Flyer
                            </button>
                          )}
                        </div>

                        {evt.collaboratingOrgNames && evt.collaboratingOrgNames.length > 0 && (
                          <div className="text-[11px] text-purple-300 font-medium">
                            🤝 Co-hosted with: {evt.collaboratingOrgNames.join(', ')}
                          </div>
                        )}

                        <div className="space-y-1 text-xs text-neutral-300">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                            <span>{evt.time}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                            <a
                              href={getGoogleMapsUrl(evt.location, evt.locationAddress)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gold-400 hover:underline truncate"
                            >
                              {evt.location}
                            </a>
                          </div>
                        </div>

                        {currentUser && (
                          <div className="flex items-center justify-between pt-2 border-t border-white/5">
                            <span className="text-[11px] text-neutral-400">
                              {evt.rsvpsGoing.length} Going
                            </span>
                            <button
                              onClick={() => toggleEventRsvp(evt.orgId, evt.id, 'going')}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                                isGoing
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-white/10 text-neutral-300 hover:text-white'
                              }`}
                            >
                              {isGoing ? '✓ Going' : 'RSVP'}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* LIST FEED VIEW */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
            <span>
              Showing {filteredEvents.length} scheduled event{filteredEvents.length === 1 ? '' : 's'}
            </span>
          </div>

          {filteredEvents.length === 0 ? (
            <div className="glass-card rounded-3xl p-12 text-center space-y-3">
              <CalendarIcon className="w-12 h-12 text-neutral-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No Events Found</h3>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                No campus events match your current filter or search.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredEvents.map((evt) => {
                const isGoing = currentUser ? evt.rsvpsGoing.includes(currentUser.id) : false;
                const isInterested = currentUser ? evt.rsvpsInterested.includes(currentUser.id) : false;
                const isSuperAdmin = currentUser?.role === 'super_admin';
                const isHostAdmin = currentUser
                  ? orgs.find((o) => o.id === evt.orgId)?.claimedByUserId === currentUser.id
                  : false;
                const canDelete = isSuperAdmin || isHostAdmin;

                const dateObj = new Date(evt.date + 'T00:00:00');
                const monthStr = dateObj.toLocaleDateString(undefined, { month: 'short' }).toUpperCase();
                const dayStr = dateObj.getDate();
                const weekdayStr = dateObj.toLocaleDateString(undefined, { weekday: 'short' });

                return (
                  <div
                    key={evt.id}
                    className="glass-card rounded-3xl border border-white/10 hover:border-gold-500/40 transition flex flex-col justify-between overflow-hidden group shadow-xl"
                  >
                    {/* Flyer / Header */}
                    {evt.flyerUrl ? (
                      <div
                        className="h-44 w-full relative bg-neutral-900 cursor-pointer overflow-hidden group/flyer"
                        onClick={() => setSelectedFlyer({ url: evt.flyerUrl!, title: evt.title })}
                      >
                        <ImageWithFallback
                          src={evt.flyerUrl}
                          alt={evt.title}
                          fallbackType="banner"
                          className="w-full h-full object-cover group-hover/flyer:scale-105 transition duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-black/30" />
                        <span className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/60 text-white backdrop-blur-md opacity-0 group-hover/flyer:opacity-100 transition">
                          <Eye className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    ) : (
                      <div className="h-20 w-full bg-gradient-to-r from-neutral-900 to-neutral-950 relative border-b border-white/5 flex items-center justify-between px-5">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getCategoryColor(evt.category)}`}>
                          {evt.category}
                        </span>
                      </div>
                    )}

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="flex items-start gap-3.5">
                        <div className="flex flex-col items-center justify-center p-2 rounded-2xl bg-gold-500/15 border border-gold-500/30 shrink-0 w-12 text-center">
                          <span className="text-[10px] font-black text-gold-400 leading-none">{monthStr}</span>
                          <span className="text-lg font-black text-white leading-tight">{dayStr}</span>
                          <span className="text-[9px] text-neutral-400 font-semibold uppercase leading-none">{weekdayStr}</span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <Link
                              href={`/orgs/${evt.orgId}`}
                              className="text-xs font-bold text-gold-400 hover:underline truncate"
                            >
                              {evt.orgName}
                            </Link>

                            {evt.isCollaboration && (
                              <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.2 rounded-full font-bold border border-purple-500/30 flex items-center gap-1">
                                <Users className="w-2.5 h-2.5" /> Joint Collab
                              </span>
                            )}
                          </div>

                          <h3 className="font-bold text-white text-base leading-snug group-hover:text-gold-300 transition mt-0.5">
                            {evt.title}
                          </h3>
                        </div>

                        {canDelete && (
                          <button
                            onClick={() => deleteEvent(evt.orgId, evt.id)}
                            className="text-neutral-500 hover:text-red-400 p-1 transition"
                            title="Delete Event"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {evt.collaboratingOrgNames && evt.collaboratingOrgNames.length > 0 && (
                        <div className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-500/20 space-y-1">
                          <p className="text-[10px] text-purple-300 font-bold uppercase tracking-wider flex items-center gap-1">
                            <Users className="w-3 h-3" /> Co-Hosted By:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {evt.collaboratingOrgNames.map((name, i) => (
                              <span
                                key={i}
                                className="text-[10px] bg-purple-500/20 text-purple-200 px-2 py-0.5 rounded-md font-medium"
                              >
                                {name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {evt.description && (
                        <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed">
                          {evt.description}
                        </p>
                      )}

                      <div className="space-y-1.5 text-xs text-neutral-300 pt-2 border-t border-white/5">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                          <span className="font-medium text-neutral-200">{evt.time}</span>
                        </div>

                        <div className="flex items-start gap-2">
                          <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                          <div className="min-w-0">
                            <a
                              href={getGoogleMapsUrl(evt.location, evt.locationAddress)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gold-400 hover:underline flex items-center gap-1 font-medium truncate"
                            >
                              {evt.location} <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                            </a>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-3 border-t border-white/5">
                        <div className="flex items-center gap-1 text-[11px] text-neutral-400">
                          <span className="font-bold text-white">{evt.rsvpsGoing.length}</span> Going
                        </div>

                        {currentUser && (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => toggleEventRsvp(evt.orgId, evt.id, 'going')}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                                isGoing
                                  ? 'bg-emerald-500 text-white shadow-md'
                                  : 'bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white'
                              }`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" /> {isGoing ? 'Going' : 'RSVP'}
                            </button>
                            <button
                              onClick={() => toggleEventRsvp(evt.orgId, evt.id, 'interested')}
                              className={`p-1.5 rounded-xl transition ${
                                isInterested
                                  ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40'
                                  : 'bg-white/5 text-neutral-400 hover:text-gold-400'
                              }`}
                              title="Interested"
                            >
                              <Star className={`w-3.5 h-3.5 ${isInterested ? 'fill-gold-400' : ''}`} />
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
        </div>
      )}

      {/* Schedule Event Modal */}
      {showAddModal && (
        <AddEventModal onClose={() => setShowAddModal(false)} />
      )}

      {/* Flyer Lightbox Modal */}
      {selectedFlyer && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedFlyer(null)}
        >
          <div
            className="relative max-w-2xl w-full glass-panel rounded-3xl overflow-hidden border border-white/20 p-2 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3 border-b border-white/10">
              <h4 className="font-bold text-white text-sm truncate">{selectedFlyer.title}</h4>
              <button
                onClick={() => setSelectedFlyer(null)}
                className="px-3 py-1 rounded-lg bg-white/10 text-white text-xs font-bold"
              >
                Close ✕
              </button>
            </div>
            <div className="p-2 flex items-center justify-center max-h-[75vh] overflow-hidden">
              <img
                src={selectedFlyer.url}
                alt={selectedFlyer.title}
                className="max-h-[70vh] w-auto object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
