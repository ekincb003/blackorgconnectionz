'use client';

import React from 'react';
import Link from 'next/link';
import { Organization } from '../types';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Users, Crown, Sparkles, ArrowRight, ShieldCheck, Instagram, Mail } from 'lucide-react';

import ImageWithFallback from './ImageWithFallback';

interface OrgCardProps {
  org: Organization;
}

export default function OrgCard({ org }: OrgCardProps) {
  const { currentUser } = useAuth();
  const { joinOrg, leaveOrg } = useData();

  const isMember = currentUser ? org.members.some((m) => m.userId === currentUser.id) : false;
  const isPrimaryAdmin = currentUser ? org.claimedByUserId === currentUser.id : false;
  const isSuperAdmin = currentUser?.role === 'super_admin';

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Fraternities & Sororities (NPHC)':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'Academic / Professional':
        return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
      case 'Cultural':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case 'Arts and Expression':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
      case 'Campus Department / Affiliated':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
      default:
        return 'bg-neutral-500/15 text-neutral-300 border-neutral-500/30';
    }
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col group relative">
      {/* Banner */}
      <div className="h-32 w-full relative overflow-hidden bg-neutral-900">
        <ImageWithFallback
          src={org.banner}
          alt={`${org.name} Banner`}
          fallbackType="banner"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500 opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />

        {/* Claimed / Unclaimed Status Pill */}
        <div className="absolute top-3 right-3">
          {org.isClaimed ? (
            <span className="flex items-center gap-1 bg-black/80 backdrop-blur-md text-emerald-400 border border-emerald-500/40 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-lg">
              <ShieldCheck className="w-3.5 h-3.5" /> Claimed
            </span>
          ) : (
            <span className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-gold-400 text-black text-[11px] font-bold px-2.5 py-1 rounded-full shadow-lg animate-pulse">
              <Sparkles className="w-3.5 h-3.5" /> ⭕ Unclaimed
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-5 pt-0 flex-1 flex flex-col relative">
        {/* Logo and Colors */}
        <div className="flex items-end justify-between -mt-10 mb-3">
          <div className="relative">
            <ImageWithFallback
              src={org.logo}
              alt={`${org.name} Logo`}
              fallbackType="logo"
              fallbackText={org.shortName?.substring(0, 3)}
              fallbackBg={org.primaryColor || '#002B7F'}
              fallbackTextColor={org.secondaryColor || '#FFFFFF'}
              className="w-16 h-16 aspect-square rounded-xl object-contain bg-neutral-900 p-1 border-2 border-white/20 shadow-xl"
            />
            {isPrimaryAdmin && (
              <span className="absolute -top-1.5 -right-1.5 bg-gold-400 text-black p-1 rounded-full shadow" title="You are the Admin / President">
                <Crown className="w-3.5 h-3.5 fill-black" />
              </span>
            )}
          </div>

          {/* Org official color swatches */}
          <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg border border-white/5">
            <span
              className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
              style={{ backgroundColor: org.primaryColor }}
              title={`Primary: ${org.primaryColor}`}
            />
            <span
              className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
              style={{ backgroundColor: org.secondaryColor }}
              title={`Secondary: ${org.secondaryColor}`}
            />
          </div>
        </div>

        {/* Category Tag */}
        <div className="mb-2">
          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${getCategoryColor(org.category)}`}>
            {org.category}
          </span>
        </div>

        {/* Org Name & Tagline */}
        <Link href={`/orgs/${org.id}`} className="group-hover:text-gold-400 transition">
          <h3 className="text-base font-bold text-white leading-snug line-clamp-2">{org.name}</h3>
        </Link>
        <p className="text-xs text-gold-400/90 font-medium italic mt-0.5 mb-2 line-clamp-1">
          "{org.tagline}"
        </p>

        <p className="text-xs text-neutral-300 line-clamp-2 mb-4 flex-1">
          {org.description}
        </p>

        {/* Metadata stats */}
        <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-neutral-300 mb-4">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-gold-400" />
            <span className="font-semibold text-white">{org.members.length}</span> members
          </div>

          <div className="flex items-center gap-2 text-neutral-400">
            {org.instagramHandle && (
              <span className="flex items-center gap-1 text-[11px]" title={org.instagramHandle}>
                <Instagram className="w-3.5 h-3.5 text-neutral-400" />
                <span className="hidden sm:inline">{org.instagramHandle.replace('@', '')}</span>
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mt-auto">
          {currentUser ? (
            isMember ? (
              <button
                onClick={() => leaveOrg(org.id)}
                className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold bg-white/5 hover:bg-red-500/20 text-neutral-300 hover:text-red-300 border border-white/10 hover:border-red-500/40 transition text-center"
              >
                {isPrimaryAdmin ? 'Leave (Admin)' : 'Leave Org'}
              </button>
            ) : (
              <button
                onClick={() => joinOrg(org.id)}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition text-center flex items-center justify-center gap-1.5 ${
                  !org.isClaimed
                    ? 'bg-gradient-to-r from-gold-400 to-amber-500 hover:from-gold-300 hover:to-amber-400 text-black shadow-lg shadow-gold-500/20'
                    : 'bg-white/10 hover:bg-gold-500 hover:text-black text-white'
                }`}
              >
                {!org.isClaimed ? (
                  <>
                    <Crown className="w-3.5 h-3.5" /> Join & Claim Leadership
                  </>
                ) : (
                  'Join Org'
                )}
              </button>
            )
          ) : (
            <Link
              href="/login"
              className="flex-1 py-2 px-3 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white text-center transition"
            >
              Sign In to Join
            </Link>
          )}

          <Link
            href={`/orgs/${org.id}`}
            className="p-2 rounded-xl bg-white/10 hover:bg-gold-500 hover:text-black text-white transition flex items-center justify-center"
            title="Open 7 Org Tabs"
          >
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
