'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Organization, OrgMember } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Users, Crown, Award, MessageSquare, UserPlus, Settings, UserMinus, Shield } from 'lucide-react';
import ManageRosterModal from '../modals/ManageRosterModal';
import TransferAdminModal from '../modals/TransferAdminModal';

import ImageWithFallback from '../ImageWithFallback';

interface MembersTabProps {
  org: Organization;
}

export default function MembersTab({ org }: MembersTabProps) {
  const { currentUser, getUserById, sendFriendRequest } = useAuth();
  const { leaveOrg } = useData();
  const [showRosterModal, setShowRosterModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);

  const isPrimaryAdmin = currentUser ? org.claimedByUserId === currentUser.id : false;
  const isSuperAdmin = currentUser?.role === 'super_admin';
  const canManage = isPrimaryAdmin || isSuperAdmin;

  const officers = org.members.filter((m) => m.isOfficer || m.isPrimaryAdmin);
  const generalMembers = org.members.filter((m) => !m.isOfficer && !m.isPrimaryAdmin);

  const renderMemberCard = (member: OrgMember) => {
    const isSelf = currentUser?.id === member.userId;
    const isFriend = currentUser?.friends.includes(member.userId);
    const hasRequested = currentUser?.friendRequestsOutgoing.includes(member.userId);

    // Dynamically resolve the most up-to-date user profile
    const liveUser = getUserById(member.userId);
    const displayName = liveUser?.name || member.userName;
    const displayAvatar = liveUser?.avatar || member.userAvatar;
    const displayMajor = liveUser?.major || member.userMajor;
    const displayGradYear = liveUser?.gradYear || member.userGradYear;

    return (
      <div
        key={member.userId}
        className="glass-card rounded-xl p-4 flex items-center justify-between gap-3 border border-white/5 hover:border-gold-500/30 transition"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="relative shrink-0">
            <ImageWithFallback
              src={displayAvatar}
              alt={displayName}
              fallbackType="avatar"
              fallbackText={displayName.split(' ').map((n) => n[0]).join('')}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-white/10"
            />
            {member.isPrimaryAdmin && (
              <span className="absolute -top-1 -right-1 bg-gold-400 text-black p-1 rounded-full shadow" title="Primary Admin / President">
                <Crown className="w-3 h-3 fill-black" />
              </span>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-white text-sm truncate">{displayName}</h4>
              {isSelf && (
                <span className="text-[10px] bg-white/10 text-neutral-300 px-1.5 py-0.2 rounded font-medium">
                  You
                </span>
              )}
            </div>

            <p className="text-xs font-semibold text-gold-400 flex items-center gap-1 mt-0.5">
              {member.isPrimaryAdmin ? (
                <>
                  <Crown className="w-3 h-3 text-gold-400" /> {member.position || 'President'}
                </>
              ) : member.isOfficer ? (
                <>
                  <Award className="w-3 h-3 text-blue-400" /> {member.position}
                </>
              ) : (
                <span className="text-neutral-400 font-normal">{member.position || 'Member'}</span>
              )}
            </p>

            <p className="text-[11px] text-neutral-400 truncate mt-0.5">
              {displayMajor} • Class of {displayGradYear}
            </p>
          </div>
        </div>

        {/* Action Shortcuts */}
        <div className="flex items-center gap-1.5 shrink-0">
          {!isSelf && currentUser && (
            <>
              <Link
                href={`/messages?user=${member.userId}`}
                className="p-2 rounded-lg bg-white/5 hover:bg-gold-500 hover:text-black text-neutral-300 transition"
                title={`Message ${member.userName}`}
              >
                <MessageSquare className="w-4 h-4" />
              </Link>

              {!isFriend && (
                <button
                  onClick={() => sendFriendRequest(member.userId)}
                  disabled={hasRequested}
                  className={`p-2 rounded-lg transition ${
                    hasRequested
                      ? 'bg-white/5 text-neutral-500 cursor-not-allowed'
                      : 'bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white'
                  }`}
                  title={hasRequested ? 'Friend request sent' : 'Add Friend'}
                >
                  <UserPlus className="w-4 h-4" />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Top Header & Admin Management Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-gold-400" /> Organization Roster
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            {org.members.length} total collegiate members and active officers
          </p>
        </div>

        {canManage && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowRosterModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/10 transition"
            >
              <Settings className="w-3.5 h-3.5 text-gold-400" /> Manage Roles & Positions
            </button>

            {isPrimaryAdmin && org.members.length > 1 && (
              <button
                onClick={() => setShowTransferModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 transition"
              >
                <Crown className="w-3.5 h-3.5" /> Transfer Admin
              </button>
            )}
          </div>
        )}
      </div>

      {org.members.length === 0 ? (
        <div className="p-12 text-center glass-card rounded-2xl">
          <Users className="w-12 h-12 text-neutral-500 mx-auto mb-3" />
          <h4 className="text-base font-semibold text-white">No Members Yet</h4>
          <p className="text-xs text-neutral-400 max-w-md mx-auto mt-1 mb-4">
            Be the first person to join this organization to automatically claim it and become its President!
          </p>
        </div>
      ) : (
        <>
          {/* Executive Board & Officers Section */}
          {officers.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Crown className="w-4 h-4 text-gold-400" />
                <h4 className="font-bold text-sm text-gold-400 uppercase tracking-wider">
                  Executive Board & Officers ({officers.length})
                </h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {officers.map((officer) => renderMemberCard(officer))}
              </div>
            </div>
          )}

          {/* General Body Section */}
          {generalMembers.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-4 h-4 text-neutral-400" />
                <h4 className="font-bold text-sm text-neutral-300 uppercase tracking-wider">
                  General Body Members ({generalMembers.length})
                </h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {generalMembers.map((member) => renderMemberCard(member))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      {showRosterModal && (
        <ManageRosterModal org={org} onClose={() => setShowRosterModal(false)} />
      )}
      {showTransferModal && (
        <TransferAdminModal org={org} onClose={() => setShowTransferModal(false)} />
      )}
    </div>
  );
}
