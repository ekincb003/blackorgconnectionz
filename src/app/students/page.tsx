'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  Users,
  Search,
  GraduationCap,
  MessageSquare,
  UserPlus,
  UserCheck,
  Building2,
  Sparkles,
  MapPin,
  BookOpen,
  Filter,
  Check
} from 'lucide-react';
import { CampusAffiliation } from '../../types';
import ImageWithFallback from '../../components/ImageWithFallback';

export default function StudentsDirectoryPage() {
  const { currentUser, users, sendFriendRequest } = useAuth();
  const { orgs } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCampus, setSelectedCampus] = useState<'All' | CampusAffiliation>('All');
  const [selectedGradYear, setSelectedGradYear] = useState<string>('All');

  const filteredStudents = useMemo(() => {
    return users.filter((u) => {
      if (u.isSiteBanned) return false;

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        u.name.toLowerCase().includes(query) ||
        u.major.toLowerCase().includes(query) ||
        u.bio.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query);

      const matchesCampus =
        selectedCampus === 'All' || u.campus === selectedCampus;

      const matchesGradYear =
        selectedGradYear === 'All' || u.gradYear === selectedGradYear;

      return matchesSearch && matchesCampus && matchesGradYear;
    });
  }, [users, searchQuery, selectedCampus, selectedGradYear]);

  const campusCounts = useMemo(() => {
    const activeUsers = users.filter((u) => !u.isSiteBanned);
    return {
      all: activeUsers.length,
      ucr: activeUsers.filter((u) => u.campus === 'UCR').length,
      cbu: activeUsers.filter((u) => u.campus === 'CBU').length,
      csusb: activeUsers.filter((u) => u.campus === 'CSUSB').length
    };
  }, [users]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-300 text-xs font-semibold">
            <Users className="w-3.5 h-3.5" /> Campus Student Network
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Discover & Connect with <span className="gold-gradient-text">Black Scholars</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300">
            Search for fellow classmates, student leaders, and Greek life members across UCR, CBU, and CSUSB.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-neutral-900/40 p-4 rounded-2xl border border-white/5">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name, major, bio, or campus..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white placeholder:text-neutral-500 text-xs focus:border-gold-500 focus:outline-none"
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

        {/* Campus Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {(['All', 'UCR', 'CBU', 'CSUSB'] as const).map((campus) => (
            <button
              key={campus}
              onClick={() => setSelectedCampus(campus)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedCampus === campus
                  ? 'bg-gold-500 text-black shadow-md'
                  : 'bg-white/5 text-neutral-300 hover:bg-white/10'
              }`}
            >
              {campus === 'All' ? `All (${campusCounts.all})` : campus}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
        <span>Showing {filteredStudents.length} scholar{filteredStudents.length === 1 ? '' : 's'}</span>
      </div>

      {/* Students Grid */}
      {filteredStudents.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center space-y-3">
          <Users className="w-12 h-12 text-neutral-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No Students Found</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            No scholars match your current search or campus filter. Try searching for a different name or major!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map((student) => {
            const isSelf = currentUser?.id === student.id;
            const isFriend = currentUser?.friends.includes(student.id);
            const isPending = currentUser?.friendRequestsOutgoing.includes(student.id);

            const studentOrgs = orgs.filter((o) => student.joinedOrgIds.includes(o.id));

            return (
              <div
                key={student.id}
                className="glass-card rounded-2xl p-5 border border-white/10 hover:border-gold-500/40 transition flex flex-col justify-between group space-y-4"
              >
                {/* Profile Header */}
                <div className="flex items-start gap-3.5">
                  <Link href={`/profile/${student.id}`} className="shrink-0">
                    <ImageWithFallback
                      src={student.avatar}
                      alt={student.name}
                      fallbackType="avatar"
                      fallbackText={student.name.split(' ').map((n) => n[0]).join('')}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-white/10 group-hover:border-gold-400 transition bg-neutral-900 shadow-md"
                    />
                  </Link>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Link
                        href={`/profile/${student.id}`}
                        className="font-bold text-white text-sm group-hover:text-gold-400 transition truncate"
                      >
                        {student.name}
                      </Link>
                      {isSelf && (
                        <span className="text-[10px] bg-gold-500/20 text-gold-300 px-1.5 py-0.2 rounded font-bold">
                          You
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 mt-0.5">
                      <span className="font-semibold text-white px-1.5 py-0.2 rounded bg-white/10 text-[10px]">
                        {student.campus}
                      </span>
                      <span>•</span>
                      <span className="truncate">{student.major}</span>
                    </div>

                    <p className="text-[10px] text-neutral-500 mt-0.5">Class of {student.gradYear}</p>
                  </div>
                </div>

                {/* Bio snippet */}
                {student.bio && (
                  <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed italic">
                    "{student.bio}"
                  </p>
                )}

                {/* Joined Orgs Badges */}
                {studentOrgs.length > 0 && (
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">
                      Joined Organizations ({studentOrgs.length})
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {studentOrgs.slice(0, 3).map((o) => (
                        <span
                          key={o.id}
                          className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-neutral-300 font-medium truncate max-w-[140px]"
                        >
                          {o.shortName}
                        </span>
                      ))}
                      {studentOrgs.length > 3 && (
                        <span className="px-1.5 py-0.5 rounded-md bg-white/5 text-[10px] text-neutral-400">
                          +{studentOrgs.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                  {!isSelf && currentUser && (
                    <>
                      {isFriend ? (
                        <span className="flex-1 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-semibold text-center flex items-center justify-center gap-1">
                          <UserCheck className="w-3.5 h-3.5" /> Friends
                        </span>
                      ) : isPending ? (
                        <span className="flex-1 py-1.5 rounded-xl bg-white/5 text-neutral-400 text-xs font-semibold text-center">
                          Requested
                        </span>
                      ) : (
                        <button
                          onClick={() => sendFriendRequest(student.id)}
                          className="flex-1 py-1.5 rounded-xl bg-white/10 hover:bg-gold-500 hover:text-black text-white text-xs font-bold transition flex items-center justify-center gap-1"
                        >
                          <UserPlus className="w-3.5 h-3.5" /> Add Friend
                        </button>
                      )}

                      <Link
                        href={`/messages?to=${student.id}`}
                        className="p-2 rounded-xl bg-white/10 hover:bg-gold-500 hover:text-black text-white transition flex items-center justify-center"
                        title={`Message ${student.name}`}
                      >
                        <MessageSquare className="w-4 h-4" />
                      </Link>
                    </>
                  )}

                  <Link
                    href={`/profile/${student.id}`}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white transition text-xs font-semibold ml-auto"
                  >
                    Profile →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
