'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import OrgCard from '../components/OrgCard';
import { OrgCategory } from '../types';
import {
  Compass,
  Search,
  Sparkles,
  Users,
  Award,
  Crown,
  Calendar,
  Layers,
  Filter,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';

const CATEGORIES: ('All' | OrgCategory)[] = [
  'All',
  'Fraternities & Sororities (NPHC)',
  'Academic / Professional',
  'Cultural',
  'Arts and Expression',
  'Campus Department / Affiliated'
];

export default function HomePage() {
  const { orgs, isLoading } = useData();
  const { currentUser } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | OrgCategory>('All');
  const [claimFilter, setClaimFilter] = useState<'all' | 'claimed' | 'unclaimed'>('all');

  // Compute platform summary statistics
  const stats = useMemo(() => {
    const totalOrgs = orgs.length;
    const claimedOrgs = orgs.filter((o) => o.isClaimed).length;
    const unclaimedOrgs = orgs.filter((o) => !o.isClaimed).length;
    const totalMembers = orgs.reduce((acc, o) => acc + o.members.length, 0);
    const totalEvents = orgs.reduce((acc, o) => acc + o.events.length, 0);
    const totalServiceHours = orgs.reduce(
      (acc, o) =>
        acc +
        o.feed
          .filter((f) => f.type === 'community_service' && f.serviceHours)
          .reduce((sum, f) => sum + (f.serviceHours || 0), 0),
      0
    );

    return {
      totalOrgs,
      claimedOrgs,
      unclaimedOrgs,
      totalMembers,
      totalEvents,
      totalServiceHours: totalServiceHours || 40
    };
  }, [orgs]);

  // Filter organizations
  const filteredOrgs = useMemo(() => {
    return orgs.filter((org) => {
      // Search matching
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        org.name.toLowerCase().includes(query) ||
        org.shortName.toLowerCase().includes(query) ||
        org.description.toLowerCase().includes(query) ||
        org.tagline.toLowerCase().includes(query);

      // Category matching
      const matchesCategory =
        selectedCategory === 'All' || org.category === selectedCategory;

      // Claim filter matching
      const matchesClaim =
        claimFilter === 'all' ||
        (claimFilter === 'claimed' && org.isClaimed) ||
        (claimFilter === 'unclaimed' && !org.isClaimed);

      return matchesSearch && matchesCategory && matchesClaim;
    });
  }, [orgs, searchQuery, selectedCategory, claimFilter]);

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-white/10 p-6 sm:p-10 shadow-2xl">
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-gold-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-80 h-80 rounded-full bg-brand-royal/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            The Centralized Campus Network
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Discover, Connect & Lead with{' '}
            <span className="gold-gradient-text">Black Student Organizations</span> & NPHC Greek Life
          </h1>

          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
            Browse all 24 campus Black/NPHC organizations. Join any org to get involved, or be the first to join an unclaimed organization to automatically claim it as President/Admin.
          </p>

          {/* Quick claim callout */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href="#directory-section"
              className="px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-bold text-xs sm:text-sm shadow-xl shadow-gold-500/20 transition flex items-center gap-2"
            >
              <Compass className="w-4 h-4" /> Browse 24 Organizations
            </a>

            {currentUser?.role === 'super_admin' && (
              <Link
                href="/superadmin"
                className="px-5 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 font-semibold text-xs sm:text-sm transition flex items-center gap-1.5"
              >
                <ShieldAlert className="w-4 h-4" /> Super Admin Governance
              </Link>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10 text-center">
          <div className="glass-card p-3.5 rounded-2xl">
            <p className="text-2xl font-extrabold text-gold-400">{stats.totalOrgs}</p>
            <p className="text-xs text-neutral-400 mt-0.5">Total Campus Orgs</p>
          </div>
          <div className="glass-card p-3.5 rounded-2xl">
            <p className="text-2xl font-extrabold text-emerald-400">{stats.claimedOrgs}</p>
            <p className="text-xs text-neutral-400 mt-0.5">Claimed (Active)</p>
          </div>
          <div className="glass-card p-3.5 rounded-2xl">
            <p className="text-2xl font-extrabold text-amber-400">{stats.unclaimedOrgs}</p>
            <p className="text-xs text-neutral-400 mt-0.5">⭕ Unclaimed (Open to Join)</p>
          </div>
          <div className="glass-card p-3.5 rounded-2xl">
            <p className="text-2xl font-extrabold text-white">{stats.totalServiceHours}+</p>
            <p className="text-xs text-neutral-400 mt-0.5">Service Hours</p>
          </div>
        </div>
      </div>

      {/* Directory Search & Filter Section */}
      <section id="directory-section" className="space-y-6 pt-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Compass className="w-6 h-6 text-gold-400" /> Campus Organizations Directory
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Showing {filteredOrgs.length} of {orgs.length} organizations across campus
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, acronym, or keywords..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-900/90 border border-white/10 text-white placeholder:text-neutral-500 text-xs focus:border-gold-500 focus:outline-none shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-neutral-900/40 p-3 rounded-2xl border border-white/5">
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-gold-500 text-black shadow-md'
                    : 'bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Claim Status Toggle */}
          <div className="flex items-center gap-1.5 bg-neutral-950 p-1 rounded-xl border border-white/10 self-start lg:self-auto shrink-0">
            <button
              onClick={() => setClaimFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                claimFilter === 'all'
                  ? 'bg-white/20 text-white font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              All ({stats.totalOrgs})
            </button>
            <button
              onClick={() => setClaimFilter('claimed')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                claimFilter === 'claimed'
                  ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              ✅ Claimed ({stats.claimedOrgs})
            </button>
            <button
              onClick={() => setClaimFilter('unclaimed')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1 ${
                claimFilter === 'unclaimed'
                  ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30'
                  : 'text-neutral-400 hover:text-amber-400'
              }`}
            >
              ⭕ Unclaimed ({stats.unclaimedOrgs})
            </button>
          </div>
        </div>

        {/* Organizations Grid */}
        {filteredOrgs.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center space-y-3">
            <Layers className="w-12 h-12 text-neutral-500 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Organizations Found</h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              No campus organizations match your current search or category filter. Try clearing your filters!
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setClaimFilter('all');
              }}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrgs.map((org) => (
              <OrgCard key={org.id} org={org} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
