'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import { useData } from '../../../context/DataContext';
import {
  User as UserIcon,
  Mail,
  GraduationCap,
  BookOpen,
  Calendar,
  Phone,
  Instagram,
  Crown,
  Shield,
  Users,
  UserPlus,
  UserCheck,
  UserMinus,
  MessageSquare,
  Building2,
  ArrowLeft
} from 'lucide-react';

import ImageWithFallback from '../../../components/ImageWithFallback';

export default function UserPublicProfilePage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const { currentUser, getUserById, sendFriendRequest, removeFriend } = useAuth();
  const { orgs } = useData();

  const user = getUserById(userId);

  if (!user) {
    return (
      <div className="glass-card rounded-3xl p-12 text-center max-w-md mx-auto my-12 space-y-4">
        <UserIcon className="w-12 h-12 text-neutral-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">Student Not Found</h2>
        <p className="text-xs text-neutral-400">The requested profile does not exist.</p>
        <Link
          href="/students"
          className="inline-block px-5 py-2.5 rounded-xl bg-gold-500 text-black font-bold text-xs transition"
        >
          Back to Students Directory
        </Link>
      </div>
    );
  }

  const isSelf = currentUser?.id === user.id;
  const isFriend = currentUser?.friends.includes(user.id);
  const isPending = currentUser?.friendRequestsOutgoing.includes(user.id);
  const joinedOrgs = orgs.filter((o) => user.joinedOrgIds.includes(o.id));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <div>
        <Link
          href="/students"
          className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-gold-400 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Students Directory
        </Link>
      </div>

      {/* Banner & Avatar Header */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-white/10 shadow-2xl">
        <div className="h-64 sm:h-80 w-full relative bg-neutral-900">
          <ImageWithFallback
            src={user.banner}
            alt="Profile Banner"
            fallbackType="banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-black/20" />
        </div>

        {/* Profile Info Bar */}
        <div className="px-6 sm:px-8 pb-6 pt-0 relative flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 sm:-mt-16">
          <div className="flex items-end gap-4">
            <div className="relative">
              <ImageWithFallback
                src={user.avatar}
                alt={user.name}
                fallbackType="avatar"
                fallbackText={user.name.split(' ').map((n) => n[0]).join('')}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-neutral-950 shadow-2xl bg-neutral-900"
              />
              {user.role === 'super_admin' && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white p-1 rounded-full shadow" title="Super Admin">
                  <Shield className="w-4 h-4" />
                </span>
              )}
            </div>

            <div className="space-y-0.5 pb-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">{user.name}</h1>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    user.role === 'super_admin'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                      : 'bg-gold-500/20 text-gold-300 border border-gold-500/40'
                  }`}
                >
                  {user.role === 'super_admin' ? '🛡️ Super Admin' : '🎓 Student'}
                </span>
              </div>
              <p className="text-xs text-neutral-400 flex items-center gap-2">
                <span className="font-semibold text-white">{user.campus}</span>
                <span>•</span>
                <span>{user.major}</span>
                <span>•</span>
                <span>Class of {user.gradYear}</span>
              </p>
            </div>
          </div>

          {/* Connect & Message Buttons */}
          {!isSelf && currentUser && (
            <div className="flex items-center gap-2">
              {isFriend ? (
                <button
                  onClick={() => removeFriend(user.id)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-red-500/20 text-neutral-300 hover:text-red-300 border border-white/10 text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" /> Friends (Remove)
                </button>
              ) : isPending ? (
                <span className="px-4 py-2 rounded-xl bg-white/5 text-neutral-400 border border-white/10 text-xs font-semibold">
                  Friend Request Sent
                </span>
              ) : (
                <button
                  onClick={() => sendFriendRequest(user.id)}
                  className="px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-black text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-gold-500/20"
                >
                  <UserPlus className="w-3.5 h-3.5" /> Add Friend
                </button>
              )}

              <Link
                href={`/messages?to=${user.id}`}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-1.5 border border-white/10"
              >
                <MessageSquare className="w-3.5 h-3.5 text-gold-400" /> Direct Message
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Profile Details & Joined Orgs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: About & Contact */}
        <div className="space-y-6">
          <div className="glass-card p-5 rounded-2xl space-y-3">
            <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">About</h3>
            <p className="text-xs text-neutral-300 leading-relaxed">{user.bio || 'No bio provided yet.'}</p>
          </div>

          <div className="glass-card p-5 rounded-2xl space-y-3">
            <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">Contact Details</h3>
            <div className="space-y-2 text-xs text-neutral-300">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                <span className="truncate">{user.email}</span>
              </div>
              {user.instagram && (
                <div className="flex items-center gap-2">
                  <Instagram className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>{user.instagram}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Joined Organizations */}
        <div className="md:col-span-2 space-y-6">
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-gold-400" /> Organizations Joined ({joinedOrgs.length})
            </h3>

            {joinedOrgs.length === 0 ? (
              <p className="text-xs text-neutral-400 italic py-4 text-center">
                This student has not joined any campus organizations yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {joinedOrgs.map((org) => {
                  const position = org.members.find((m) => m.userId === user.id)?.position || 'Member';
                  const isPrimaryAdmin = org.claimedByUserId === user.id;

                  return (
                    <Link
                      key={org.id}
                      href={`/orgs/${org.id}`}
                      className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <img src={org.logo} alt="" className="w-10 h-10 rounded-xl object-cover" />
                        <div>
                          <p className="text-xs font-bold text-white group-hover:text-gold-400 transition leading-snug">
                            {org.shortName}
                          </p>
                          <p className="text-[11px] text-neutral-400">{position}</p>
                        </div>
                      </div>

                      {isPrimaryAdmin && (
                        <span className="p-1.5 rounded-lg bg-gold-500/20 text-gold-400" title="Primary Admin / President">
                          <Crown className="w-4 h-4" />
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
