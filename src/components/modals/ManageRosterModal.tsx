'use client';

import React, { useState } from 'react';
import { Organization } from '../../types';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import {
  X,
  Shield,
  Award,
  UserMinus,
  Check,
  Crown,
  UserX,
  UserCheck,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import ImageWithFallback from '../ImageWithFallback';

interface ManageRosterModalProps {
  org: Organization;
  onClose: () => void;
}

export default function ManageRosterModal({ org, onClose }: ManageRosterModalProps) {
  const {
    assignMemberPosition,
    removeMemberPosition,
    removeMemberFromOrg,
    banMemberFromOrg,
    unbanMemberFromOrg,
    approveJoinRequest,
    rejectJoinRequest,
    approvePositionRequest,
    rejectPositionRequest
  } = useData();
  const { currentUser, getUserById } = useAuth();

  const [activeTab, setActiveTab] = useState<'roster' | 'join_requests' | 'position_requests' | 'banned'>('roster');

  const [positions, setPositions] = useState<{ [userId: string]: string }>(() => {
    const initial: { [userId: string]: string } = {};
    org.members.forEach((m) => {
      initial[m.userId] = m.position;
    });
    return initial;
  });

  const [isOfficerMap, setIsOfficerMap] = useState<{ [userId: string]: boolean }>(() => {
    const initial: { [userId: string]: boolean } = {};
    org.members.forEach((m) => {
      initial[m.userId] = m.isOfficer;
    });
    return initial;
  });

  const [savedUserIds, setSavedUserIds] = useState<string[]>([]);
  const [banModalUser, setBanModalUser] = useState<{ userId: string; userName: string } | null>(null);
  const [banReason, setBanReason] = useState('');

  const pendingJoinRequests = org.joinRequests?.filter((r) => r.status === 'pending') || [];
  const pendingPositionRequests = org.positionRequests?.filter((r) => r.status === 'pending') || [];
  const bannedMembers = org.bannedMembers || [];

  const handleSaveMember = (userId: string) => {
    const pos = positions[userId] || 'Member';
    const isOfficer = isOfficerMap[userId] || false;
    assignMemberPosition(org.id, userId, pos, isOfficer);
    setSavedUserIds((prev) => [...prev, userId]);
    setTimeout(() => {
      setSavedUserIds((prev) => prev.filter((id) => id !== userId));
    }, 2000);
  };

  const handleRemove = (userId: string) => {
    if (confirm('Are you sure you want to remove this member from the organization?')) {
      removeMemberFromOrg(org.id, userId);
    }
  };

  const handleConfirmBan = () => {
    if (!banModalUser) return;
    banMemberFromOrg(org.id, banModalUser.userId, banReason || 'Violating chapter conduct guidelines.');
    setBanModalUser(null);
    setBanReason('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-panel max-w-2xl w-full rounded-3xl border border-white/10 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-neutral-950/80">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-gold-400" /> Roster Management & Moderation
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">{org.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-2 bg-neutral-900 border-b border-white/10 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('roster')}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              activeTab === 'roster' ? 'bg-gold-500 text-black' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Active Members ({org.members.length})
          </button>

          <button
            onClick={() => setActiveTab('join_requests')}
            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
              activeTab === 'join_requests' ? 'bg-gold-500 text-black' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Join Requests
            {pendingJoinRequests.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
                {pendingJoinRequests.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('position_requests')}
            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
              activeTab === 'position_requests' ? 'bg-gold-500 text-black' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Position Requests
            {pendingPositionRequests.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-black text-[10px] flex items-center justify-center font-bold">
                {pendingPositionRequests.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('banned')}
            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
              activeTab === 'banned' ? 'bg-red-500 text-white' : 'text-neutral-400 hover:text-red-400'
            }`}
          >
            Banned Members ({bannedMembers.length})
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* 1. Active Members */}
          {activeTab === 'roster' && (
            <div className="space-y-4 divide-y divide-white/5">
              {org.members.map((member) => {
                const isSaved = savedUserIds.includes(member.userId);
                const isSelf = currentUser?.id === member.userId;

                const liveUser = getUserById(member.userId);
                const displayName = liveUser?.name || member.userName;
                const displayAvatar = liveUser?.avatar || member.userAvatar;
                const displayMajor = liveUser?.major || member.userMajor;
                const displayGradYear = liveUser?.gradYear || member.userGradYear;

                return (
                  <div
                    key={member.userId}
                    className="pt-4 first:pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <ImageWithFallback
                        src={displayAvatar}
                        alt={displayName}
                        fallbackType="avatar"
                        fallbackText={displayName.split(' ').map((n) => n[0]).join('')}
                        className="w-10 h-10 rounded-full object-cover ring-1 ring-white/10"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-white text-sm">{displayName}</span>
                          {member.isPrimaryAdmin && (
                            <span className="bg-gold-500/20 text-gold-400 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Crown className="w-3 h-3" /> Admin
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-400">
                          {displayMajor} • Class of {displayGradYear}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <div className="flex-1 sm:w-44">
                        <input
                          type="text"
                          value={positions[member.userId] || ''}
                          onChange={(e) =>
                            setPositions((prev) => ({ ...prev, [member.userId]: e.target.value }))
                          }
                          placeholder="e.g. Vice President"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none"
                        />
                      </div>

                      <label className="flex items-center gap-1 text-[11px] text-neutral-300 whitespace-nowrap cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isOfficerMap[member.userId] || false}
                          onChange={(e) =>
                            setIsOfficerMap((prev) => ({ ...prev, [member.userId]: e.target.checked }))
                          }
                          className="rounded bg-neutral-800 border-white/20 text-gold-500"
                        />
                        Officer
                      </label>

                      <button
                        onClick={() => handleSaveMember(member.userId)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
                          isSaved
                            ? 'bg-emerald-500 text-black'
                            : 'bg-gold-500 hover:bg-gold-400 text-black'
                        }`}
                      >
                        {isSaved ? <Check className="w-3.5 h-3.5" /> : 'Save'}
                      </button>

                      {!isSelf && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleRemove(member.userId)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-amber-500/20 text-neutral-400 hover:text-amber-400 transition"
                            title="Remove Member"
                          >
                            <UserMinus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setBanModalUser({ userId: member.userId, userName: member.userName })}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 transition"
                            title="Ban from Organization"
                          >
                            <UserX className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 2. Join Requests */}
          {activeTab === 'join_requests' && (
            <div className="space-y-3">
              {pendingJoinRequests.length === 0 ? (
                <p className="text-xs text-neutral-400 italic py-6 text-center">No pending join requests.</p>
              ) : (
                pendingJoinRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <img src={req.userAvatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                      <div>
                        <p className="text-xs font-bold text-white">{req.userName}</p>
                        <p className="text-[11px] text-neutral-400">{req.userMajor} • Class of {req.userGradYear}</p>
                        {req.message && <p className="text-[11px] text-gold-400/90 italic mt-0.5">"{req.message}"</p>}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => approveJoinRequest(org.id, req.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                      </button>
                      <button
                        onClick={() => rejectJoinRequest(org.id, req.id)}
                        className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-bold transition"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 3. Position Requests */}
          {activeTab === 'position_requests' && (
            <div className="space-y-3">
              {pendingPositionRequests.length === 0 ? (
                <p className="text-xs text-neutral-400 italic py-6 text-center">No pending position requests.</p>
              ) : (
                pendingPositionRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <img src={req.userAvatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                      <div>
                        <p className="text-xs font-bold text-white">{req.userName}</p>
                        <p className="text-xs font-semibold text-gold-400">
                          Requested Position: "{req.requestedPosition}"
                        </p>
                        {req.reason && <p className="text-[11px] text-neutral-300 italic mt-0.5">Reason: "{req.reason}"</p>}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => approvePositionRequest(org.id, req.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Grant Title
                      </button>
                      <button
                        onClick={() => rejectPositionRequest(org.id, req.id)}
                        className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-bold transition"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 4. Banned Members */}
          {activeTab === 'banned' && (
            <div className="space-y-3">
              {bannedMembers.length === 0 ? (
                <p className="text-xs text-neutral-400 italic py-6 text-center">No banned members in this organization.</p>
              ) : (
                bannedMembers.map((ban) => (
                  <div
                    key={ban.userId}
                    className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <img src={ban.userAvatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                      <div>
                        <p className="text-xs font-bold text-white">{ban.userName}</p>
                        <p className="text-[11px] text-red-300">Reason: {ban.reason}</p>
                        <p className="text-[10px] text-neutral-500">Banned by {ban.bannedBy}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => unbanMemberFromOrg(org.id, ban.userId)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold transition"
                    >
                      Unban Member
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Ban Member Submodal */}
        {banModalUser && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="glass-panel p-5 rounded-2xl border border-red-500/30 max-w-sm w-full space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" /> Ban {banModalUser.userName} from {org.shortName}
              </h4>
              <p className="text-xs text-neutral-300">
                This member will be removed from the roster and prevented from re-joining.
              </p>
              <textarea
                rows={3}
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="Reason for chapter ban..."
                className="w-full p-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:border-red-500 focus:outline-none"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => setBanModalUser(null)}
                  className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmBan}
                  className="px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-400 text-white text-xs font-bold"
                >
                  Confirm Ban
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
