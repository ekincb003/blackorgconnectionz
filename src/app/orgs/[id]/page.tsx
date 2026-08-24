'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useData } from '../../../context/DataContext';
import { useAuth } from '../../../context/AuthContext';
import {
  Users,
  Image as ImageIcon,
  Film,
  Sparkles,
  Calendar,
  MessageSquare,
  BookOpen,
  FileText,
  Crown,
  Settings,
  Mail,
  Phone,
  Instagram,
  Globe,
  ShieldCheck,
  ArrowLeft,
  Share2,
  ExternalLink
} from 'lucide-react';

import MembersTab from '../../../components/tabs/MembersTab';
import PhotosTab from '../../../components/tabs/PhotosTab';
import VideosTab from '../../../components/tabs/VideosTab';
import AnnouncementsTab from '../../../components/tabs/AnnouncementsTab';
import EventsTab from '../../../components/tabs/EventsTab';
import FeedTab from '../../../components/tabs/FeedTab';
import HistoryTab from '../../../components/tabs/HistoryTab';
import PlannerTab from '../../../components/tabs/PlannerTab';
import OrgSettingsModal from '../../../components/modals/OrgSettingsModal';

import ImageWithFallback from '../../../components/ImageWithFallback';

type TabKey =
  | 'members'
  | 'photos'
  | 'videos'
  | 'announcements'
  | 'events'
  | 'feed'
  | 'history'
  | 'planner';

interface TabDefinition {
  key: TabKey;
  label: string;
  icon: React.ReactNode;
  countBadge?: number;
}

export default function OrgDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orgId = params.id as string;

  const { getOrgById, joinOrg, leaveOrg } = useData();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<TabKey>('members');
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const org = getOrgById(orgId);

  if (!org) {
    return (
      <div className="glass-card rounded-2xl p-12 text-center max-w-md mx-auto space-y-4">
        <h2 className="text-xl font-bold text-white">Organization Not Found</h2>
        <p className="text-xs text-neutral-400">
          The requested organization ID does not exist or has been removed.
        </p>
        <Link
          href="/"
          className="inline-block px-5 py-2.5 rounded-xl bg-gold-500 text-black font-bold text-xs"
        >
          Return to Directory
        </Link>
      </div>
    );
  }

  const isMember = currentUser ? org.members.some((m) => m.userId === currentUser.id) : false;
  const isPrimaryAdmin = currentUser ? org.claimedByUserId === currentUser.id : false;
  const isSuperAdmin = currentUser?.role === 'super_admin';
  const canManageSettings = isPrimaryAdmin || isSuperAdmin;

  const tabs: TabDefinition[] = [
    {
      key: 'members',
      label: 'Members',
      icon: <Users className="w-4 h-4" />,
      countBadge: org.members.length
    },
    {
      key: 'photos',
      label: 'Photos',
      icon: <ImageIcon className="w-4 h-4" />,
      countBadge: org.photos.length
    },
    {
      key: 'videos',
      label: 'Videos',
      icon: <Film className="w-4 h-4" />,
      countBadge: org.videos.length
    },
    {
      key: 'announcements',
      label: 'Announcements',
      icon: <Sparkles className="w-4 h-4" />,
      countBadge: org.announcements.length
    },
    {
      key: 'events',
      label: 'Events',
      icon: <Calendar className="w-4 h-4" />,
      countBadge: org.events.length
    },
    {
      key: 'feed',
      label: 'Feed',
      icon: <MessageSquare className="w-4 h-4" />,
      countBadge: org.feed.length
    },
    {
      key: 'history',
      label: 'History',
      icon: <BookOpen className="w-4 h-4" />
    },
    {
      key: 'planner',
      label: 'Planner',
      icon: <FileText className="w-4 h-4" />,
      countBadge: org.plannerNotes?.length
    }
  ];

  return (
    <div className="space-y-6">
      {/* Back to Directory Link */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-gold-400 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Organizations Directory
        </Link>
      </div>

      {/* Org Header Hub Card */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative">
        {/* Org Banner with Gradient Overlay */}
        <div className="h-48 sm:h-64 w-full relative overflow-hidden bg-neutral-900">
          <ImageWithFallback
            src={org.banner}
            alt={org.name}
            fallbackType="banner"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-black/30" />

          {/* Claimed / Unclaimed Status Badge */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            {org.isClaimed ? (
              <span className="flex items-center gap-1.5 bg-black/80 backdrop-blur-md text-emerald-300 border border-emerald-500/40 text-xs font-bold px-3 py-1 rounded-full shadow-xl">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Claimed Chapter
              </span>
            ) : (
              <span className="flex items-center gap-1.5 bg-gradient-to-r from-gold-400 to-amber-500 text-black text-xs font-black px-3.5 py-1.5 rounded-full shadow-2xl animate-pulse">
                <Crown className="w-4 h-4" /> Unclaimed — Join to Become Admin!
              </span>
            )}
          </div>
        </div>

        {/* Org Info Header */}
        <div className="px-6 sm:px-8 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
            {/* Logo and Name */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 min-w-0">
              <div className="relative">
                <ImageWithFallback
                  src={org.logo}
                  alt={org.name}
                  fallbackType="logo"
                  fallbackText={org.shortName?.substring(0, 3)}
                  fallbackBg={org.primaryColor || '#002B7F'}
                  fallbackTextColor={org.secondaryColor || '#FFFFFF'}
                  className="w-24 h-24 sm:w-28 sm:h-28 aspect-square rounded-xl object-contain bg-neutral-900 p-1 ring-4 ring-neutral-950 shadow-2xl border-2 border-white/20"
                />
                {isPrimaryAdmin && (
                  <span className="absolute -top-2 -right-2 p-1.5 rounded-full bg-gold-400 text-black shadow-lg" title="You are the Chapter President">
                    <Crown className="w-4 h-4 fill-black" />
                  </span>
                )}
              </div>

              <div className="space-y-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                    {org.name}
                  </h1>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-gold-300 border border-white/10">
                    {org.category}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gold-400 font-medium italic">
                  "{org.tagline}"
                </p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
              {canManageSettings && (
                <button
                  onClick={() => setShowSettingsModal(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/10 transition"
                >
                  <Settings className="w-4 h-4 text-gold-400" /> Org Settings
                </button>
              )}

              {currentUser ? (
                isMember ? (
                  <button
                    onClick={() => leaveOrg(org.id)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-red-500/20 text-neutral-300 hover:text-red-300 border border-white/10 hover:border-red-500/40 transition"
                  >
                    {isPrimaryAdmin ? 'Leave Org (Admin)' : 'Leave Org'}
                  </button>
                ) : (
                  <button
                    onClick={() => joinOrg(org.id)}
                    className={`px-5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                      !org.isClaimed
                        ? 'bg-gradient-to-r from-gold-400 to-amber-500 hover:from-gold-300 hover:to-amber-400 text-black shadow-xl shadow-gold-500/30'
                        : 'bg-gold-500 hover:bg-gold-400 text-black shadow-lg'
                    }`}
                  >
                    {!org.isClaimed ? (
                      <>
                        <Crown className="w-4 h-4" /> Join & Claim Leadership
                      </>
                    ) : (
                      'Join Organization'
                    )}
                  </button>
                )
              ) : (
                <Link
                  href="/login"
                  className="px-5 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-bold text-xs"
                >
                  Sign In to Join
                </Link>
              )}
            </div>
          </div>

          {/* Description & Contact Strip */}
          <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-4xl">
              {org.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400 pt-1">
              <a
                href={`mailto:${org.contactEmail}`}
                className="flex items-center gap-1.5 hover:text-gold-400 transition"
              >
                <Mail className="w-3.5 h-3.5 text-neutral-400" /> {org.contactEmail}
              </a>

              {org.contactPhone && (
                <a
                  href={`tel:${org.contactPhone}`}
                  className="flex items-center gap-1.5 hover:text-gold-400 transition"
                >
                  <Phone className="w-3.5 h-3.5 text-neutral-400" /> {org.contactPhone}
                </a>
              )}

              {org.instagramHandle && (
                <a
                  href={`https://instagram.com/${org.instagramHandle.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-pink-400 hover:underline"
                >
                  <Instagram className="w-3.5 h-3.5" /> {org.instagramHandle}
                </a>
              )}

              {org.website && (
                <a
                  href={org.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-blue-400 hover:underline"
                >
                  <Globe className="w-3.5 h-3.5" /> Official Website <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* 7 Dedicated Tabs Navigation Bar */}
        <div className="px-4 sm:px-8 border-t border-white/10 bg-neutral-950/60 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1 sm:gap-2 py-2">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                    isActive
                      ? 'bg-gold-500 text-black shadow-lg shadow-gold-500/20'
                      : 'text-neutral-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.countBadge !== undefined && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive ? 'bg-black/20 text-black' : 'bg-white/10 text-neutral-400'
                      }`}
                    >
                      {tab.countBadge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Render Active Tab Component */}
      <div className="pt-2">
        {activeTab === 'members' && <MembersTab org={org} />}
        {activeTab === 'photos' && <PhotosTab org={org} />}
        {activeTab === 'videos' && <VideosTab org={org} />}
        {activeTab === 'announcements' && <AnnouncementsTab org={org} />}
        {activeTab === 'events' && <EventsTab org={org} />}
        {activeTab === 'feed' && <FeedTab org={org} />}
        {activeTab === 'history' && <HistoryTab org={org} />}
        {activeTab === 'planner' && <PlannerTab org={org} />}
      </div>

      {/* Org Settings Modal */}
      {showSettingsModal && (
        <OrgSettingsModal org={org} onClose={() => setShowSettingsModal(false)} />
      )}
    </div>
  );
}
