'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Organization,
  ChatMessage,
  Notification,
  GroupChat,
  ClaimRequest,
  JoinRequest,
  PositionRequest,
  OrgPlannerNote,
  OrgPlannerAccessRequest,
  OrgBannedMember,
  Announcement,
  Event,
  FeedPost,
  PhotoItem,
  VideoItem,
  HistoryPost,
  OrgHistory,
  OrgCategory
} from '../types';
import {
  loadStoredData,
  saveOrgs,
  saveMessages,
  saveGroupChats,
  saveClaimRequests,
  saveNotifications,
  resetAllDataToDefault
} from '../lib/storage';
import { DEFAULT_APP_LOGO_SVG } from '../lib/defaultAppLogo';
import { sortOrganizationsByFounding } from '../lib/seedData';
import { useAuth } from './AuthContext';

interface DataContextType {
  orgs: Organization[];
  messages: ChatMessage[];
  groupChats: GroupChat[];
  claimRequests: ClaimRequest[];
  notifications: Notification[];
  isLoading: boolean;
  getOrgById: (id: string) => Organization | undefined;
  // Org Membership & Claims
  joinOrg: (orgId: string) => void;
  leaveOrg: (orgId: string) => void;
  requestJoinOrg: (orgId: string, message?: string) => void;
  approveJoinRequest: (orgId: string, requestId: string) => void;
  rejectJoinRequest: (orgId: string, requestId: string) => void;
  requestPosition: (orgId: string, requestedPosition: string, reason: string) => void;
  approvePositionRequest: (orgId: string, requestId: string) => void;
  rejectPositionRequest: (orgId: string, requestId: string) => void;
  submitClaimRequest: (orgId: string, reason: string) => void;
  approveClaimRequest: (requestId: string) => void;
  rejectClaimRequest: (requestId: string) => void;
  forceClaimOrg: (orgId: string, targetUserId: string) => void;
  unclaimOrg: (orgId: string) => void;
  transferAdminRights: (orgId: string, newAdminUserId: string) => void;
  assignMemberPosition: (orgId: string, targetUserId: string, position: string, isOfficer: boolean) => void;
  removeMemberPosition: (orgId: string, targetUserId: string) => void;
  removeMemberFromOrg: (orgId: string, targetUserId: string) => void;
  banMemberFromOrg: (orgId: string, targetUserId: string, reason: string) => void;
  unbanMemberFromOrg: (orgId: string, targetUserId: string) => void;
  // Org Content & Settings
  updateOrgDetails: (orgId: string, updates: Partial<Organization>) => void;
  createOrg: (newOrgData: Partial<Organization>) => Organization;
  deleteOrg: (orgId: string) => void;
  bulkImportOrgs: (rawTsvText: string) => number;
  createOrgGroupChat: (orgId: string) => void;
  // Planner Notes
  createPlannerNote: (orgId: string, title: string, content: string) => void;
  updatePlannerNote: (orgId: string, noteId: string, title: string, content: string) => void;
  deletePlannerNote: (orgId: string, noteId: string) => void;
  requestPlannerAccess: (orgId: string) => void;
  approvePlannerAccess: (orgId: string, requestId: string) => void;
  rejectPlannerAccess: (orgId: string, requestId: string) => void;
  // 7 Tabs Actions
  createAnnouncement: (orgId: string, data: { title: string; content: string; pinned?: boolean; isGlobal?: boolean; imageUrl?: string; videoUrl?: string; caption?: string }) => void;
  toggleAnnouncementLike: (orgId: string, announcementId: string) => void;
  addAnnouncementComment: (orgId: string, announcementId: string, content: string, replyToCommentId?: string) => void;
  deleteAnnouncementComment: (orgId: string, announcementId: string, commentId: string) => void;
  deleteAnnouncement: (orgId: string, announcementId: string) => void;
  createEvent: (orgId: string, eventData: Omit<Event, 'id' | 'orgId' | 'createdAt' | 'rsvpsGoing' | 'rsvpsInterested'>) => void;
  updateEvent: (orgId: string, eventId: string, eventData: Partial<Event>) => void;
  deleteEvent: (orgId: string, eventId: string) => void;
  moveEventToOrg: (currentOrgId: string, targetOrgId: string, eventId: string) => void;
  toggleEventRsvp: (orgId: string, eventId: string, rsvpType: 'going' | 'interested') => void;
  createFeedPost: (orgId: string, postData: { type: 'general' | 'community_service'; title?: string; content: string; serviceHours?: number; serviceDate?: string; location?: string; imageUrl?: string }) => void;
  toggleFeedLike: (orgId: string, postId: string) => void;
  addFeedComment: (orgId: string, postId: string, content: string) => void;
  deleteFeedComment: (orgId: string, postId: string, commentId: string) => void;
  deleteFeedPost: (orgId: string, postId: string) => void;
  addPhoto: (orgId: string, photo: { title: string; caption: string; url: string }) => void;
  editPhoto: (orgId: string, photoId: string, title: string, caption: string) => void;
  deletePhoto: (orgId: string, photoId: string) => void;
  addVideo: (orgId: string, video: { title: string; description: string; url: string; provider?: 'youtube' | 'vimeo' | 'direct'; thumbnailUrl?: string }) => void;
  editVideo: (orgId: string, videoId: string, title: string, description: string) => void;
  deleteVideo: (orgId: string, videoId: string) => void;
  createHistoryPost: (orgId: string, post: { title: string; content: string; imageUrl?: string; imageCaption?: string }) => void;
  deleteHistoryPost: (orgId: string, postId: string) => void;
  updateOrgHistory: (orgId: string, history: Partial<OrgHistory>) => void;
  // Messaging & Group Chats
  sendMessage: (recipientId: string, content: string) => void;
  editMessage: (messageId: string, newContent: string) => void;
  deleteMessage: (messageId: string) => void;
  createCustomGroupChat: (name: string, memberIds: string[], description?: string) => GroupChat;
  joinGroupChat: (groupId: string) => void;
  leaveGroupChat: (groupId: string) => void;
  deleteGroupChat: (groupId: string) => void;
  markMessagesAsRead: (recipientId: string) => void;
  // Notifications
  createNotification: (userId: string, title: string, message: string, type: Notification['type'], link?: string) => void;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (notificationId: string) => void;
  clearAllNotifications: () => void;
  // Platform Branding
  appLogo: string;
  updateAppLogo: (logoUrl: string) => void;
  // Super Admin Tools
  exportPlatformDataJson: () => string;
  dataCleanup: (options: { clearTestUsers?: boolean; clearTestOrgs?: boolean; removeMembers?: boolean; clearNotifs?: boolean; clearClaims?: boolean }) => void;
  resetAllPlatformData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { currentUser, users, updateProfile, getUserById, deleteUserPermanently } = useAuth();
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [groupChats, setGroupChats] = useState<GroupChat[]>([]);
  const [claimRequests, setClaimRequests] = useState<ClaimRequest[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [appLogo, setAppLogoState] = useState<string>(DEFAULT_APP_LOGO_SVG);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const data = loadStoredData();
    const sortedOrgs = sortOrganizationsByFounding(data.orgs);
    setOrgs(sortedOrgs);
    setMessages(data.messages);
    setGroupChats(data.groupChats);
    setClaimRequests(data.claimRequests);
    setNotifications(data.notifications);
    const savedLogo = localStorage.getItem('boc_app_logo');
    if (savedLogo) {
      setAppLogoState(savedLogo);
    }
    setIsLoading(false);
  }, []);

  const updateAppLogo = (logoUrl: string) => {
    setAppLogoState(logoUrl);
    localStorage.setItem('boc_app_logo', logoUrl);
  };

  // Synchronize org members, announcement authors, and feed authors with updated user profiles
  useEffect(() => {
    if (!users || users.length === 0 || orgs.length === 0) return;

    const userMap = new Map(users.map((u) => [u.id, u]));
    let hasChanges = false;

    const updatedOrgs = orgs.map((org) => {
      let orgChanged = false;

      // 1. Sync Members
      const updatedMembers = org.members.map((member) => {
        const liveUser = userMap.get(member.userId);
        if (
          liveUser &&
          (member.userName !== liveUser.name ||
            member.userAvatar !== liveUser.avatar ||
            member.userMajor !== liveUser.major ||
            member.userGradYear !== liveUser.gradYear)
        ) {
          orgChanged = true;
          return {
            ...member,
            userName: liveUser.name,
            userAvatar: liveUser.avatar,
            userMajor: liveUser.major,
            userGradYear: liveUser.gradYear
          };
        }
        return member;
      });

      // 2. Sync Announcements Author Details
      const updatedAnnouncements = org.announcements.map((ann) => {
        const liveUser = userMap.get(ann.authorId);
        if (
          liveUser &&
          (ann.authorName !== liveUser.name || ann.authorAvatar !== liveUser.avatar)
        ) {
          orgChanged = true;
          return {
            ...ann,
            authorName: liveUser.name,
            authorAvatar: liveUser.avatar
          };
        }
        return ann;
      });

      // 3. Sync Feed Author Details
      const updatedFeed = org.feed.map((feedItem) => {
        const liveUser = userMap.get(feedItem.authorId);
        if (
          liveUser &&
          (feedItem.authorName !== liveUser.name || feedItem.authorAvatar !== liveUser.avatar)
        ) {
          orgChanged = true;
          return {
            ...feedItem,
            authorName: liveUser.name,
            authorAvatar: liveUser.avatar
          };
        }
        return feedItem;
      });

      if (orgChanged) {
        hasChanges = true;
        return {
          ...org,
          members: updatedMembers,
          announcements: updatedAnnouncements,
          feed: updatedFeed
        };
      }
      return org;
    });

    if (hasChanges) {
      setOrgs(updatedOrgs);
      saveOrgs(updatedOrgs);
    }
  }, [users]);

  const updateAndSaveOrgs = (nextOrgs: Organization[]) => {
    const sorted = sortOrganizationsByFounding(nextOrgs);
    setOrgs(sorted);
    saveOrgs(sorted);
  };

  const updateAndSaveMessages = (nextMessages: ChatMessage[]) => {
    setMessages(nextMessages);
    saveMessages(nextMessages);
  };

  const updateAndSaveGroupChats = (nextGroupChats: GroupChat[]) => {
    setGroupChats(nextGroupChats);
    saveGroupChats(nextGroupChats);
  };

  const updateAndSaveClaimRequests = (nextClaims: ClaimRequest[]) => {
    setClaimRequests(nextClaims);
    saveClaimRequests(nextClaims);
  };

  const updateAndSaveNotifications = (nextNotifications: Notification[]) => {
    setNotifications(nextNotifications);
    saveNotifications(nextNotifications);
  };

  const getOrgById = (id: string) => orgs.find((o) => o.id === id);

  const createNotification = (
    userId: string,
    title: string,
    message: string,
    type: Notification['type'],
    link?: string
  ) => {
    const newNotif: Notification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      userId,
      title,
      message,
      type,
      link,
      read: false,
      createdAt: new Date().toISOString()
    };
    updateAndSaveNotifications([newNotif, ...notifications]);
  };

  // --- JOIN & LEAVE ORG ---
  const joinOrg = (orgId: string) => {
    if (!currentUser) return;
    const org = getOrgById(orgId);
    if (!org) return;

    if (org.members.some((m) => m.userId === currentUser.id)) return;

    // Check if user is banned from org
    if (org.bannedMembers?.some((b) => b.userId === currentUser.id)) {
      alert('You have been banned from this organization.');
      return;
    }

    const isFirstMemberOrUnclaimed = !org.isClaimed || org.members.length === 0;

    const newMember = {
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      userMajor: currentUser.major,
      userGradYear: currentUser.gradYear,
      position: isFirstMemberOrUnclaimed ? 'President' : 'Member',
      isPrimaryAdmin: isFirstMemberOrUnclaimed,
      isOfficer: isFirstMemberOrUnclaimed,
      joinedAt: new Date().toISOString()
    };

    const nextOrgs = orgs.map((o) => {
      if (o.id === orgId) {
        return {
          ...o,
          isClaimed: isFirstMemberOrUnclaimed ? true : o.isClaimed,
          claimedByUserId: isFirstMemberOrUnclaimed ? currentUser.id : o.claimedByUserId,
          members: [...o.members, newMember]
        };
      }
      return o;
    });

    updateAndSaveOrgs(nextOrgs);
    updateProfile({ joinedOrgIds: Array.from(new Set([...currentUser.joinedOrgIds, orgId])) });

    if (isFirstMemberOrUnclaimed) {
      createNotification(
        currentUser.id,
        `👑 You Claimed ${org.name}!`,
        `As the first member to join, you are now the Primary Admin and President of ${org.shortName}.`,
        'claim',
        `/orgs/${org.id}`
      );
    }
  };

  const leaveOrg = (orgId: string) => {
    if (!currentUser) return;
    const org = getOrgById(orgId);
    if (!org) return;

    const remainingMembers = org.members.filter((m) => m.userId !== currentUser.id);
    const wasAdmin = org.claimedByUserId === currentUser.id;

    const nextClaimed = remainingMembers.length > 0;
    const nextClaimedByUserId =
      wasAdmin && remainingMembers.length > 0
        ? remainingMembers[0].userId
        : nextClaimed
        ? org.claimedByUserId
        : undefined;

    const updatedMembers = remainingMembers.map((m, index) => {
      if (wasAdmin && index === 0) {
        return {
          ...m,
          isPrimaryAdmin: true,
          isOfficer: true,
          position: m.position === 'Member' ? 'President' : m.position
        };
      }
      return m;
    });

    const nextOrgs = orgs.map((o) => {
      if (o.id === orgId) {
        return {
          ...o,
          isClaimed: nextClaimed,
          claimedByUserId: nextClaimedByUserId,
          members: updatedMembers
        };
      }
      return o;
    });

    updateAndSaveOrgs(nextOrgs);
    updateProfile({ joinedOrgIds: currentUser.joinedOrgIds.filter((id) => id !== orgId) });
  };

  // Join Requests
  const requestJoinOrg = (orgId: string, message?: string) => {
    if (!currentUser) return;
    const org = getOrgById(orgId);
    if (!org) return;

    const newReq: JoinRequest = {
      id: `jreq-${Date.now()}`,
      orgId,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      userMajor: currentUser.major,
      userGradYear: currentUser.gradYear,
      message,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const nextOrgs = orgs.map((o) =>
      o.id === orgId ? { ...o, joinRequests: [...(o.joinRequests || []), newReq] } : o
    );
    updateAndSaveOrgs(nextOrgs);

    if (org.claimedByUserId) {
      createNotification(
        org.claimedByUserId,
        `New Membership Request for ${org.shortName}`,
        `${currentUser.name} requested to join ${org.shortName}.`,
        'request',
        `/orgs/${orgId}`
      );
    }
  };

  const approveJoinRequest = (orgId: string, requestId: string) => {
    const org = getOrgById(orgId);
    if (!org) return;
    const req = org.joinRequests?.find((r) => r.id === requestId);
    if (!req) return;

    const newMember = {
      userId: req.userId,
      userName: req.userName,
      userAvatar: req.userAvatar,
      userMajor: req.userMajor,
      userGradYear: req.userGradYear,
      position: 'Member',
      isPrimaryAdmin: false,
      isOfficer: false,
      joinedAt: new Date().toISOString()
    };

    const nextOrgs = orgs.map((o) => {
      if (o.id === orgId) {
        return {
          ...o,
          members: [...o.members, newMember],
          joinRequests: o.joinRequests?.map((r) => (r.id === requestId ? { ...r, status: 'approved' as const } : r))
        };
      }
      return o;
    });

    updateAndSaveOrgs(nextOrgs);
    createNotification(
      req.userId,
      `Join Request Approved for ${org.shortName}`,
      `Your request to join ${org.name} has been approved!`,
      'request',
      `/orgs/${orgId}`
    );
  };

  const rejectJoinRequest = (orgId: string, requestId: string) => {
    const nextOrgs = orgs.map((o) => {
      if (o.id === orgId) {
        return {
          ...o,
          joinRequests: o.joinRequests?.map((r) => (r.id === requestId ? { ...r, status: 'rejected' as const } : r))
        };
      }
      return o;
    });
    updateAndSaveOrgs(nextOrgs);
  };

  // Position Requests
  const requestPosition = (orgId: string, requestedPosition: string, reason: string) => {
    if (!currentUser) return;
    const org = getOrgById(orgId);
    if (!org) return;

    const newReq: PositionRequest = {
      id: `preq-${Date.now()}`,
      orgId,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      requestedPosition,
      reason,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const nextOrgs = orgs.map((o) =>
      o.id === orgId ? { ...o, positionRequests: [...(o.positionRequests || []), newReq] } : o
    );
    updateAndSaveOrgs(nextOrgs);

    if (org.claimedByUserId) {
      createNotification(
        org.claimedByUserId,
        `Position Request in ${org.shortName}`,
        `${currentUser.name} requested the title of "${requestedPosition}".`,
        'role_change',
        `/orgs/${orgId}`
      );
    }
  };

  const approvePositionRequest = (orgId: string, requestId: string) => {
    const org = getOrgById(orgId);
    if (!org) return;
    const req = org.positionRequests?.find((r) => r.id === requestId);
    if (!req) return;

    const nextOrgs = orgs.map((o) => {
      if (o.id === orgId) {
        return {
          ...o,
          members: o.members.map((m) =>
            m.userId === req.userId ? { ...m, position: req.requestedPosition, isOfficer: true } : m
          ),
          positionRequests: o.positionRequests?.map((r) => (r.id === requestId ? { ...r, status: 'approved' as const } : r))
        };
      }
      return o;
    });

    updateAndSaveOrgs(nextOrgs);
    createNotification(
      req.userId,
      `Position Approved in ${org.shortName}`,
      `Your request for the position "${req.requestedPosition}" was approved!`,
      'role_change',
      `/orgs/${orgId}`
    );
  };

  const rejectPositionRequest = (orgId: string, requestId: string) => {
    const nextOrgs = orgs.map((o) => {
      if (o.id === orgId) {
        return {
          ...o,
          positionRequests: o.positionRequests?.map((r) => (r.id === requestId ? { ...r, status: 'rejected' as const } : r))
        };
      }
      return o;
    });
    updateAndSaveOrgs(nextOrgs);
  };

  // Claim Requests
  const submitClaimRequest = (orgId: string, reason: string) => {
    if (!currentUser) return;
    const org = getOrgById(orgId);
    if (!org) return;

    const newReq: ClaimRequest = {
      id: `creq-${Date.now()}`,
      orgId,
      orgName: org.name,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      reason,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    updateAndSaveClaimRequests([...claimRequests, newReq]);
  };

  const approveClaimRequest = (requestId: string) => {
    const req = claimRequests.find((c) => c.id === requestId);
    if (!req) return;

    forceClaimOrg(req.orgId, req.userId);
    const nextClaims = claimRequests.map((c) =>
      c.id === requestId ? { ...c, status: 'approved' as const } : c
    );
    updateAndSaveClaimRequests(nextClaims);
  };

  const rejectClaimRequest = (requestId: string) => {
    const nextClaims = claimRequests.map((c) =>
      c.id === requestId ? { ...c, status: 'rejected' as const } : c
    );
    updateAndSaveClaimRequests(nextClaims);
  };

  const forceClaimOrg = (orgId: string, targetUserId: string) => {
    const user = getUserById(targetUserId);
    if (!user) return;

    const nextOrgs = orgs.map((o) => {
      if (o.id === orgId) {
        const existingMember = o.members.find((m) => m.userId === targetUserId);
        let nextMembers = [...o.members];
        if (existingMember) {
          nextMembers = nextMembers.map((m) =>
            m.userId === targetUserId
              ? { ...m, isPrimaryAdmin: true, isOfficer: true, position: 'President' }
              : { ...m, isPrimaryAdmin: false }
          );
        } else {
          nextMembers.push({
            userId: user.id,
            userName: user.name,
            userAvatar: user.avatar,
            userMajor: user.major,
            userGradYear: user.gradYear,
            position: 'President',
            isPrimaryAdmin: true,
            isOfficer: true,
            joinedAt: new Date().toISOString()
          });
        }
        return {
          ...o,
          isClaimed: true,
          claimedByUserId: targetUserId,
          members: nextMembers
        };
      }
      return o;
    });

    updateAndSaveOrgs(nextOrgs);
    createNotification(
      targetUserId,
      `Org Claim Approved`,
      `You are now the Primary Admin & President of ${getOrgById(orgId)?.shortName}.`,
      'claim',
      `/orgs/${orgId}`
    );
  };

  const unclaimOrg = (orgId: string) => {
    const nextOrgs = orgs.map((o) => {
      if (o.id === orgId) {
        return {
          ...o,
          isClaimed: false,
          claimedByUserId: undefined,
          members: o.members.map((m) => ({ ...m, isPrimaryAdmin: false, position: 'Member' }))
        };
      }
      return o;
    });
    updateAndSaveOrgs(nextOrgs);
  };

  const transferAdminRights = (orgId: string, newAdminUserId: string) => {
    const nextOrgs = orgs.map((o) => {
      if (o.id === orgId) {
        return {
          ...o,
          claimedByUserId: newAdminUserId,
          members: o.members.map((m) => {
            if (m.userId === newAdminUserId) {
              return { ...m, isPrimaryAdmin: true, isOfficer: true, position: 'President' };
            }
            if (m.isPrimaryAdmin) {
              return { ...m, isPrimaryAdmin: false, position: 'Former President / Advisor' };
            }
            return m;
          })
        };
      }
      return o;
    });
    updateAndSaveOrgs(nextOrgs);
  };

  const assignMemberPosition = (orgId: string, targetUserId: string, position: string, isOfficer: boolean) => {
    const nextOrgs = orgs.map((o) => {
      if (o.id === orgId) {
        return {
          ...o,
          members: o.members.map((m) => (m.userId === targetUserId ? { ...m, position, isOfficer } : m))
        };
      }
      return o;
    });
    updateAndSaveOrgs(nextOrgs);
  };

  const removeMemberPosition = (orgId: string, targetUserId: string) => {
    assignMemberPosition(orgId, targetUserId, 'Member', false);
  };

  const removeMemberFromOrg = (orgId: string, targetUserId: string) => {
    const org = getOrgById(orgId);
    if (!org) return;

    const remaining = org.members.filter((m) => m.userId !== targetUserId);
    const wasAdmin = org.claimedByUserId === targetUserId;
    const nextClaimed = remaining.length > 0;
    const nextClaimedBy = nextClaimed && wasAdmin ? remaining[0].userId : (nextClaimed ? org.claimedByUserId : undefined);

    const nextOrgs = orgs.map((o) => {
      if (o.id === orgId) {
        return {
          ...o,
          isClaimed: nextClaimed,
          claimedByUserId: nextClaimedBy,
          members: remaining.map((m, idx) => (wasAdmin && idx === 0 ? { ...m, isPrimaryAdmin: true, isOfficer: true } : m))
        };
      }
      return o;
    });
    updateAndSaveOrgs(nextOrgs);
  };

  const banMemberFromOrg = (orgId: string, targetUserId: string, reason: string) => {
    const org = getOrgById(orgId);
    if (!org) return;
    const user = getUserById(targetUserId);

    removeMemberFromOrg(orgId, targetUserId);

    const newBan: OrgBannedMember = {
      userId: targetUserId,
      userName: user?.name || 'Member',
      userAvatar: user?.avatar || '',
      reason,
      bannedAt: new Date().toISOString(),
      bannedBy: currentUser?.name || 'Admin'
    };

    const nextOrgs = orgs.map((o) =>
      o.id === orgId ? { ...o, bannedMembers: [...(o.bannedMembers || []), newBan] } : o
    );
    updateAndSaveOrgs(nextOrgs);
  };

  const unbanMemberFromOrg = (orgId: string, targetUserId: string) => {
    const nextOrgs = orgs.map((o) =>
      o.id === orgId ? { ...o, bannedMembers: o.bannedMembers?.filter((b) => b.userId !== targetUserId) } : o
    );
    updateAndSaveOrgs(nextOrgs);
  };

  // Planner Notes
  const createPlannerNote = (orgId: string, title: string, content: string) => {
    if (!currentUser) return;
    const newNote: OrgPlannerNote = {
      id: `note-${Date.now()}`,
      orgId,
      title,
      content,
      createdBy: currentUser.id,
      createdByName: currentUser.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      accessGrantedUserIds: [currentUser.id]
    };

    const nextOrgs = orgs.map((o) =>
      o.id === orgId ? { ...o, plannerNotes: [newNote, ...(o.plannerNotes || [])] } : o
    );
    updateAndSaveOrgs(nextOrgs);
  };

  const updatePlannerNote = (orgId: string, noteId: string, title: string, content: string) => {
    const nextOrgs = orgs.map((o) => {
      if (o.id === orgId) {
        return {
          ...o,
          plannerNotes: o.plannerNotes?.map((n) =>
            n.id === noteId ? { ...n, title, content, updatedAt: new Date().toISOString() } : n
          )
        };
      }
      return o;
    });
    updateAndSaveOrgs(nextOrgs);
  };

  const deletePlannerNote = (orgId: string, noteId: string) => {
    const nextOrgs = orgs.map((o) =>
      o.id === orgId ? { ...o, plannerNotes: o.plannerNotes?.filter((n) => n.id !== noteId) } : o
    );
    updateAndSaveOrgs(nextOrgs);
  };

  const requestPlannerAccess = (orgId: string) => {
    if (!currentUser) return;
    const newReq: OrgPlannerAccessRequest = {
      id: `plreq-${Date.now()}`,
      orgId,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const nextOrgs = orgs.map((o) =>
      o.id === orgId ? { ...o, plannerAccessRequests: [...(o.plannerAccessRequests || []), newReq] } : o
    );
    updateAndSaveOrgs(nextOrgs);
  };

  const approvePlannerAccess = (orgId: string, requestId: string) => {
    const org = getOrgById(orgId);
    if (!org) return;
    const req = org.plannerAccessRequests?.find((r) => r.id === requestId);
    if (!req) return;

    const nextOrgs = orgs.map((o) => {
      if (o.id === orgId) {
        return {
          ...o,
          plannerNotes: o.plannerNotes?.map((n) => ({
            ...n,
            accessGrantedUserIds: Array.from(new Set([...n.accessGrantedUserIds, req.userId]))
          })),
          plannerAccessRequests: o.plannerAccessRequests?.map((r) =>
            r.id === requestId ? { ...r, status: 'approved' as const } : r
          )
        };
      }
      return o;
    });
    updateAndSaveOrgs(nextOrgs);
  };

  const rejectPlannerAccess = (orgId: string, requestId: string) => {
    const nextOrgs = orgs.map((o) => {
      if (o.id === orgId) {
        return {
          ...o,
          plannerAccessRequests: o.plannerAccessRequests?.map((r) =>
            r.id === requestId ? { ...r, status: 'rejected' as const } : r
          )
        };
      }
      return o;
    });
    updateAndSaveOrgs(nextOrgs);
  };

  // 7 Tabs Actions
  const createAnnouncement = (
    orgId: string,
    data: { title: string; content: string; pinned?: boolean; isGlobal?: boolean; imageUrl?: string; videoUrl?: string; caption?: string }
  ) => {
    if (!currentUser) return;
    const org = getOrgById(orgId);

    const newAnnouncement: Announcement = {
      id: `anc-${Date.now()}`,
      orgId,
      orgName: org?.shortName,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorPosition: org?.members.find((m) => m.userId === currentUser.id)?.position || (currentUser.role === 'super_admin' ? 'Super Admin' : 'Member'),
      title: data.title,
      content: data.content,
      pinned: !!data.pinned,
      isGlobal: !!data.isGlobal,
      imageUrl: data.imageUrl,
      videoUrl: data.videoUrl,
      caption: data.caption,
      createdAt: new Date().toISOString(),
      likes: [],
      comments: []
    };

    const nextOrgs = orgs.map((o) =>
      o.id === orgId ? { ...o, announcements: [newAnnouncement, ...o.announcements] } : o
    );
    updateAndSaveOrgs(nextOrgs);
  };

  const toggleAnnouncementLike = (orgId: string, announcementId: string) => {
    if (!currentUser) return;
    const nextOrgs = orgs.map((o) => {
      if (o.id === orgId) {
        return {
          ...o,
          announcements: o.announcements.map((a) => {
            if (a.id === announcementId) {
              const likes = a.likes.includes(currentUser.id)
                ? a.likes.filter((id) => id !== currentUser.id)
                : [...a.likes, currentUser.id];
              return { ...a, likes };
            }
            return a;
          })
        };
      }
      return o;
    });
    updateAndSaveOrgs(nextOrgs);
  };

  const addAnnouncementComment = (orgId: string, announcementId: string, content: string, replyToCommentId?: string) => {
    if (!currentUser || !content.trim()) return;

    const newComment = {
      id: `c-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      content: content.trim(),
      createdAt: new Date().toISOString(),
      likes: [],
      replies: []
    };

    const nextOrgs = orgs.map((o) => {
      if (o.id === orgId) {
        return {
          ...o,
          announcements: o.announcements.map((a) => {
            if (a.id === announcementId) {
              if (replyToCommentId) {
                return {
                  ...a,
                  comments: a.comments.map((c) =>
                    c.id === replyToCommentId ? { ...c, replies: [...(c.replies || []), newComment] } : c
                  )
                };
              }
              return { ...a, comments: [...a.comments, newComment] };
            }
            return a;
          })
        };
      }
      return o;
    });
    updateAndSaveOrgs(nextOrgs);
  };

  const deleteAnnouncementComment = (orgId: string, announcementId: string, commentId: string) => {
    const nextOrgs = orgs.map((o) => {
      if (o.id === orgId) {
        return {
          ...o,
          announcements: o.announcements.map((a) =>
            a.id === announcementId ? { ...a, comments: a.comments.filter((c) => c.id !== commentId) } : a
          )
        };
      }
      return o;
    });
    updateAndSaveOrgs(nextOrgs);
  };

  const deleteAnnouncement = (orgId: string, announcementId: string) => {
    const nextOrgs = orgs.map((o) =>
      o.id === orgId ? { ...o, announcements: o.announcements.filter((a) => a.id !== announcementId) } : o
    );
    updateAndSaveOrgs(nextOrgs);
  };

  // Events
  const createEvent = (
    orgId: string,
    eventData: Omit<Event, 'id' | 'orgId' | 'createdAt' | 'rsvpsGoing' | 'rsvpsInterested'>
  ) => {
    const org = getOrgById(orgId);
    const collabNames = eventData.collaboratingOrgIds
      ? eventData.collaboratingOrgIds.map((id) => getOrgById(id)?.shortName || id)
      : [];

    const newEvent: Event = {
      ...eventData,
      id: `evt-${Date.now()}`,
      orgId,
      orgName: org?.shortName,
      orgLogo: org?.logo,
      isCollaboration: !!(eventData.collaboratingOrgIds && eventData.collaboratingOrgIds.length > 0),
      collaboratingOrgNames: collabNames,
      rsvpsGoing: [],
      rsvpsInterested: [],
      createdAt: new Date().toISOString()
    };

    const targetOrgIds = Array.from(new Set([orgId, ...(eventData.collaboratingOrgIds || [])]));

    const nextOrgs = orgs.map((o) => {
      if (targetOrgIds.includes(o.id)) {
        return { ...o, events: [newEvent, ...o.events] };
      }
      return o;
    });
    updateAndSaveOrgs(nextOrgs);
  };

  const updateEvent = (orgId: string, eventId: string, eventData: Partial<Event>) => {
    const nextOrgs = orgs.map((o) => {
      if (o.id === orgId) {
        return { ...o, events: o.events.map((e) => (e.id === eventId ? { ...e, ...eventData } : e)) };
      }
      return o;
    });
    updateAndSaveOrgs(nextOrgs);
  };

  const deleteEvent = (orgId: string, eventId: string) => {
    const nextOrgs = orgs.map((o) =>
      o.id === orgId ? { ...o, events: o.events.filter((e) => e.id !== eventId) } : o
    );
    updateAndSaveOrgs(nextOrgs);
  };

  const moveEventToOrg = (currentOrgId: string, targetOrgId: string, eventId: string) => {
    const sourceOrg = getOrgById(currentOrgId);
    const targetOrg = getOrgById(targetOrgId);
    const event = sourceOrg?.events.find((e) => e.id === eventId);
    if (!event || !targetOrg) return;

    const movedEvent: Event = { ...event, orgId: targetOrgId, orgName: targetOrg.shortName };

    const nextOrgs = orgs.map((o) => {
      if (o.id === currentOrgId) {
        return { ...o, events: o.events.filter((e) => e.id !== eventId) };
      }
      if (o.id === targetOrgId) {
        return { ...o, events: [movedEvent, ...o.events] };
      }
      return o;
    });
    updateAndSaveOrgs(nextOrgs);
  };

  const toggleEventRsvp = (orgId: string, eventId: string, rsvpType: 'going' | 'interested') => {
    if (!currentUser) return;
    const nextOrgs = orgs.map((o) => {
      if (o.id === orgId) {
        return {
          ...o,
          events: o.events.map((e) => {
            if (e.id === eventId) {
              let going = [...e.rsvpsGoing];
              let interested = [...e.rsvpsInterested];
              if (rsvpType === 'going') {
                if (going.includes(currentUser.id)) going = going.filter((id) => id !== currentUser.id);
                else {
                  going.push(currentUser.id);
                  interested = interested.filter((id) => id !== currentUser.id);
                }
              } else {
                if (interested.includes(currentUser.id)) interested = interested.filter((id) => id !== currentUser.id);
                else {
                  interested.push(currentUser.id);
                  going = going.filter((id) => id !== currentUser.id);
                }
              }
              return { ...e, rsvpsGoing: going, rsvpsInterested: interested };
            }
            return e;
          })
        };
      }
      return o;
    });
    updateAndSaveOrgs(nextOrgs);
  };

  // Feed
  const createFeedPost = (
    orgId: string,
    postData: {
      type: 'general' | 'community_service';
      title?: string;
      content: string;
      serviceHours?: number;
      serviceDate?: string;
      location?: string;
      imageUrl?: string;
    }
  ) => {
    if (!currentUser) return;
    const org = getOrgById(orgId);

    const newPost: FeedPost = {
      id: `feed-${Date.now()}`,
      orgId,
      orgName: org?.shortName,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      type: postData.type,
      title: postData.title,
      content: postData.content,
      serviceHours: postData.serviceHours,
      serviceDate: postData.serviceDate,
      location: postData.location,
      imageUrl: postData.imageUrl,
      createdAt: new Date().toISOString(),
      likes: [],
      comments: []
    };

    const nextOrgs = orgs.map((o) => (o.id === orgId ? { ...o, feed: [newPost, ...o.feed] } : o));
    updateAndSaveOrgs(nextOrgs);
  };

  const toggleFeedLike = (orgId: string, postId: string) => {
    if (!currentUser) return;
    const nextOrgs = orgs.map((o) => {
      if (o.id === orgId) {
        return {
          ...o,
          feed: o.feed.map((p) => {
            if (p.id === postId) {
              const likes = p.likes.includes(currentUser.id)
                ? p.likes.filter((id) => id !== currentUser.id)
                : [...p.likes, currentUser.id];
              return { ...p, likes };
            }
            return p;
          })
        };
      }
      return o;
    });
    updateAndSaveOrgs(nextOrgs);
  };

  const addFeedComment = (orgId: string, postId: string, content: string) => {
    if (!currentUser || !content.trim()) return;
    const newComment = {
      id: `fc-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      content: content.trim(),
      createdAt: new Date().toISOString()
    };

    const nextOrgs = orgs.map((o) => {
      if (o.id === orgId) {
        return {
          ...o,
          feed: o.feed.map((p) => (p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p))
        };
      }
      return o;
    });
    updateAndSaveOrgs(nextOrgs);
  };

  const deleteFeedComment = (orgId: string, postId: string, commentId: string) => {
    const nextOrgs = orgs.map((o) => {
      if (o.id === orgId) {
        return {
          ...o,
          feed: o.feed.map((p) => (p.id === postId ? { ...p, comments: p.comments.filter((c) => c.id !== commentId) } : p))
        };
      }
      return o;
    });
    updateAndSaveOrgs(nextOrgs);
  };

  const deleteFeedPost = (orgId: string, postId: string) => {
    const nextOrgs = orgs.map((o) =>
      o.id === orgId ? { ...o, feed: o.feed.filter((p) => p.id !== postId) } : o
    );
    updateAndSaveOrgs(nextOrgs);
  };

  // Photos
  const addPhoto = (orgId: string, photo: { title: string; caption: string; url: string }) => {
    if (!currentUser) return;
    const newPhoto: PhotoItem = {
      id: `photo-${Date.now()}`,
      orgId,
      title: photo.title || 'Chapter Photo',
      caption: photo.caption || '',
      url: photo.url,
      uploadedBy: currentUser.name,
      uploadedById: currentUser.id,
      uploadedAt: new Date().toISOString()
    };
    const nextOrgs = orgs.map((o) => (o.id === orgId ? { ...o, photos: [newPhoto, ...o.photos] } : o));
    updateAndSaveOrgs(nextOrgs);
  };

  const editPhoto = (orgId: string, photoId: string, title: string, caption: string) => {
    const nextOrgs = orgs.map((o) => {
      if (o.id === orgId) {
        return {
          ...o,
          photos: o.photos.map((p) => (p.id === photoId ? { ...p, title, caption } : p))
        };
      }
      return o;
    });
    updateAndSaveOrgs(nextOrgs);
  };

  const deletePhoto = (orgId: string, photoId: string) => {
    const nextOrgs = orgs.map((o) =>
      o.id === orgId ? { ...o, photos: o.photos.filter((p) => p.id !== photoId) } : o
    );
    updateAndSaveOrgs(nextOrgs);
  };

  // Videos
  const addVideo = (
    orgId: string,
    video: { title: string; description: string; url: string; provider?: 'youtube' | 'vimeo' | 'direct'; thumbnailUrl?: string }
  ) => {
    if (!currentUser) return;
    let provider = video.provider || 'direct';
    if (video.url.includes('youtube.com') || video.url.includes('youtu.be')) provider = 'youtube';
    else if (video.url.includes('vimeo.com')) provider = 'vimeo';

    const newVideo: VideoItem = {
      id: `vid-${Date.now()}`,
      orgId,
      title: video.title,
      description: video.description,
      url: video.url,
      provider,
      thumbnailUrl: video.thumbnailUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
      uploadedBy: currentUser.name,
      uploadedById: currentUser.id,
      uploadedAt: new Date().toISOString()
    };

    const nextOrgs = orgs.map((o) => (o.id === orgId ? { ...o, videos: [newVideo, ...o.videos] } : o));
    updateAndSaveOrgs(nextOrgs);
  };

  const editVideo = (orgId: string, videoId: string, title: string, description: string) => {
    const nextOrgs = orgs.map((o) => {
      if (o.id === orgId) {
        return {
          ...o,
          videos: o.videos.map((v) => (v.id === videoId ? { ...v, title, description } : v))
        };
      }
      return o;
    });
    updateAndSaveOrgs(nextOrgs);
  };

  const deleteVideo = (orgId: string, videoId: string) => {
    const nextOrgs = orgs.map((o) =>
      o.id === orgId ? { ...o, videos: o.videos.filter((v) => v.id !== videoId) } : o
    );
    updateAndSaveOrgs(nextOrgs);
  };

  // History
  const createHistoryPost = (orgId: string, post: { title: string; content: string; imageUrl?: string; imageCaption?: string }) => {
    const newPost: HistoryPost = {
      id: `hp-${Date.now()}`,
      title: post.title,
      content: post.content,
      imageUrl: post.imageUrl,
      imageCaption: post.imageCaption,
      createdAt: new Date().toISOString()
    };
    const nextOrgs = orgs.map((o) => {
      if (o.id === orgId) {
        return {
          ...o,
          history: {
            ...o.history,
            historyPosts: [newPost, ...(o.history.historyPosts || [])]
          }
        };
      }
      return o;
    });
    updateAndSaveOrgs(nextOrgs);
  };

  const deleteHistoryPost = (orgId: string, postId: string) => {
    const nextOrgs = orgs.map((o) => {
      if (o.id === orgId) {
        return {
          ...o,
          history: {
            ...o.history,
            historyPosts: o.history.historyPosts?.filter((hp) => hp.id !== postId)
          }
        };
      }
      return o;
    });
    updateAndSaveOrgs(nextOrgs);
  };

  const updateOrgHistory = (orgId: string, history: Partial<OrgHistory>) => {
    const nextOrgs = orgs.map((o) => (o.id === orgId ? { ...o, history: { ...o.history, ...history } } : o));
    updateAndSaveOrgs(nextOrgs);
  };

  const updateOrgDetails = (orgId: string, updates: Partial<Organization>) => {
    const nextOrgs = orgs.map((o) => (o.id === orgId ? { ...o, ...updates } : o));
    updateAndSaveOrgs(nextOrgs);
  };

  const createOrg = (newOrgData: Partial<Organization>): Organization => {
    const id = `org-${Date.now()}`;
    const newOrg: Organization = {
      id,
      name: newOrgData.name || 'New Organization',
      shortName: newOrgData.shortName || newOrgData.name?.substring(0, 10) || 'New Org',
      tagline: newOrgData.tagline || 'Leading with Purpose and Excellence',
      category: (newOrgData.category as OrgCategory) || 'Cultural',
      isClaimed: false,
      logo: newOrgData.logo || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=300&auto=format&fit=crop&q=80',
      banner: newOrgData.banner || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1400&auto=format&fit=crop&q=80',
      primaryColor: newOrgData.primaryColor || '#1B3B6F',
      secondaryColor: newOrgData.secondaryColor || '#D4AF37',
      description: newOrgData.description || 'Campus student organization committed to community and culture.',
      contactEmail: newOrgData.contactEmail || 'contact@campus.edu',
      contactPhone: newOrgData.contactPhone || '',
      instagramHandle: newOrgData.instagramHandle || '',
      website: newOrgData.website || '',
      members: [],
      bannedMembers: [],
      joinRequests: [],
      positionRequests: [],
      plannerNotes: [],
      plannerAccessRequests: [],
      announcements: [],
      events: [],
      feed: [],
      photos: [],
      videos: [],
      history: {
        foundingDate: '2026',
        foundingLocation: 'Campus',
        motto: 'Leadership, Fellowship, Service',
        principles: ['Leadership', 'Service'],
        colors: ['Blue', 'Gold'],
        foundingStory: 'Created to enrich campus student life and provide connection.',
        campusChapterStory: 'Newly established on campus.',
        historicalSignificance: 'Serving our community.',
        founders: [],
        historicPhotos: []
      },
      createdAt: new Date().toISOString()
    };

    updateAndSaveOrgs([newOrg, ...orgs]);
    return newOrg;
  };

  const deleteOrg = (orgId: string) => {
    const nextOrgs = orgs.filter((o) => o.id !== orgId);
    updateAndSaveOrgs(nextOrgs);
  };

  const bulkImportOrgs = (rawTsvText: string): number => {
    const lines = rawTsvText.split('\n').map((l) => l.trim()).filter(Boolean);
    let count = 0;
    const newItems: Organization[] = [];

    for (const line of lines) {
      const parts = line.split('|').map((p) => p.trim());
      if (parts.length >= 3) {
        const [name, description, category, logo] = parts;
        const newOrg: Organization = {
          id: `org-bulk-${Date.now()}-${count}`,
          name,
          shortName: name.length > 15 ? name.substring(0, 15) : name,
          tagline: 'Leading with Purpose and Excellence',
          category: (category as OrgCategory) || 'Cultural',
          isClaimed: false,
          logo: logo || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=300&auto=format&fit=crop&q=80',
          banner: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1400&auto=format&fit=crop&q=80',
          primaryColor: '#1A202C',
          secondaryColor: '#D4AF37',
          description,
          contactEmail: 'contact@campus.edu',
          members: [],
          announcements: [],
          events: [],
          feed: [],
          photos: [],
          videos: [],
          history: {
            foundingDate: 'Campus Chapter',
            foundingLocation: 'Campus',
            motto: 'Leadership and Community',
            principles: ['Excellence', 'Service'],
            colors: ['Black', 'Gold'],
            foundingStory: description,
            campusChapterStory: 'Active campus organization.',
            historicalSignificance: 'Serving our student community.',
            founders: [],
            historicPhotos: []
          },
          createdAt: new Date().toISOString()
        };
        newItems.push(newOrg);
        count++;
      }
    }

    if (newItems.length > 0) {
      updateAndSaveOrgs([...newItems, ...orgs]);
    }
    return count;
  };

  const createOrgGroupChat = (orgId: string) => {
    const org = getOrgById(orgId);
    if (!org) return;

    const existing = groupChats.find((g) => g.orgId === orgId);
    if (existing) return;

    const newGroup: GroupChat = {
      id: `group-org-${orgId}`,
      name: `${org.shortName} Official Chat`,
      isOrgChat: true,
      orgId,
      avatar: org.logo,
      description: `Official group chat for all members of ${org.name}.`,
      createdBy: currentUser?.id || 'admin',
      memberIds: org.members.map((m) => m.userId),
      createdAt: new Date().toISOString()
    };

    updateAndSaveGroupChats([...groupChats, newGroup]);
  };

  // Messaging & Group Chats
  const sendMessage = (recipientId: string, content: string) => {
    if (!currentUser || !content.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      recipientId,
      content: content.trim(),
      createdAt: new Date().toISOString(),
      read: false
    };

    updateAndSaveMessages([...messages, newMsg]);
  };

  const editMessage = (messageId: string, newContent: string) => {
    const nextMessages = messages.map((m) =>
      m.id === messageId ? { ...m, content: newContent.trim(), isEdited: true } : m
    );
    updateAndSaveMessages(nextMessages);
  };

  const deleteMessage = (messageId: string) => {
    const nextMessages = messages.filter((m) => m.id !== messageId);
    updateAndSaveMessages(nextMessages);
  };

  const createCustomGroupChat = (name: string, memberIds: string[], description?: string): GroupChat => {
    if (!currentUser) throw new Error('Must be logged in');

    const newGroup: GroupChat = {
      id: `group-${Date.now()}`,
      name,
      description,
      createdBy: currentUser.id,
      memberIds: Array.from(new Set([currentUser.id, ...memberIds])),
      createdAt: new Date().toISOString()
    };

    updateAndSaveGroupChats([newGroup, ...groupChats]);
    return newGroup;
  };

  const joinGroupChat = (groupId: string) => {
    if (!currentUser) return;
    const nextGroupChats = groupChats.map((g) =>
      g.id === groupId ? { ...g, memberIds: Array.from(new Set([...g.memberIds, currentUser.id])) } : g
    );
    updateAndSaveGroupChats(nextGroupChats);
  };

  const leaveGroupChat = (groupId: string) => {
    if (!currentUser) return;
    const nextGroupChats = groupChats.map((g) =>
      g.id === groupId ? { ...g, memberIds: g.memberIds.filter((id) => id !== currentUser.id) } : g
    );
    updateAndSaveGroupChats(nextGroupChats);
  };

  const deleteGroupChat = (groupId: string) => {
    const nextGroupChats = groupChats.filter((g) => g.id !== groupId);
    const nextMessages = messages.filter((m) => m.recipientId !== `group:${groupId}`);
    updateAndSaveGroupChats(nextGroupChats);
    updateAndSaveMessages(nextMessages);
  };

  const markMessagesAsRead = (recipientId: string) => {
    if (!currentUser) return;
    const nextMessages = messages.map((m) => {
      if (
        (m.recipientId === currentUser.id && m.senderId === recipientId) ||
        m.recipientId === recipientId ||
        m.recipientId === `group:${recipientId}`
      ) {
        return { ...m, read: true };
      }
      return m;
    });
    updateAndSaveMessages(nextMessages);
  };

  // Notifications
  const markNotificationRead = (notificationId: string) => {
    const next = notifications.map((n) => (n.id === notificationId ? { ...n, read: true } : n));
    updateAndSaveNotifications(next);
  };

  const markAllNotificationsRead = () => {
    if (!currentUser) return;
    const next = notifications.map((n) => (n.userId === currentUser.id ? { ...n, read: true } : n));
    updateAndSaveNotifications(next);
  };

  const deleteNotification = (notificationId: string) => {
    const next = notifications.filter((n) => n.id !== notificationId);
    updateAndSaveNotifications(next);
  };

  const clearAllNotifications = () => {
    if (!currentUser) return;
    const next = notifications.filter((n) => n.userId !== currentUser.id);
    updateAndSaveNotifications(next);
  };

  // Super Admin Export & Data Cleanup
  const exportPlatformDataJson = (): string => {
    return JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        exportedBy: currentUser?.name || 'Super Admin',
        orgs,
        groupChats,
        claimRequests,
        messagesCount: messages.length
      },
      null,
      2
    );
  };

  const dataCleanup = (options: {
    clearTestUsers?: boolean;
    clearTestOrgs?: boolean;
    removeMembers?: boolean;
    clearNotifs?: boolean;
    clearClaims?: boolean;
  }) => {
    if (options.clearNotifs) {
      updateAndSaveNotifications([]);
    }
    if (options.clearClaims) {
      updateAndSaveClaimRequests([]);
    }
    if (options.clearTestOrgs) {
      updateAndSaveOrgs(orgs.filter((o) => !o.id.startsWith('org-bulk-')));
    }
    if (options.removeMembers) {
      updateAndSaveOrgs(
        orgs.map((o) => ({
          ...o,
          members: o.claimedByUserId ? o.members.filter((m) => m.userId === o.claimedByUserId) : []
        }))
      );
    }
  };

  const resetAllPlatformData = () => {
    resetAllDataToDefault();
    const data = loadStoredData();
    setOrgs(data.orgs);
    setMessages(data.messages);
    setGroupChats(data.groupChats);
    setClaimRequests(data.claimRequests);
    setNotifications(data.notifications);
  };

  return (
    <DataContext.Provider
      value={{
        orgs,
        messages,
        groupChats,
        claimRequests,
        notifications,
        isLoading,
        getOrgById,
        joinOrg,
        leaveOrg,
        requestJoinOrg,
        approveJoinRequest,
        rejectJoinRequest,
        requestPosition,
        approvePositionRequest,
        rejectPositionRequest,
        submitClaimRequest,
        approveClaimRequest,
        rejectClaimRequest,
        forceClaimOrg,
        unclaimOrg,
        transferAdminRights,
        assignMemberPosition,
        removeMemberPosition,
        removeMemberFromOrg,
        banMemberFromOrg,
        unbanMemberFromOrg,
        updateOrgDetails,
        createOrg,
        deleteOrg,
        bulkImportOrgs,
        createOrgGroupChat,
        createPlannerNote,
        updatePlannerNote,
        deletePlannerNote,
        requestPlannerAccess,
        approvePlannerAccess,
        rejectPlannerAccess,
        createAnnouncement,
        toggleAnnouncementLike,
        addAnnouncementComment,
        deleteAnnouncementComment,
        deleteAnnouncement,
        createEvent,
        updateEvent,
        deleteEvent,
        moveEventToOrg,
        toggleEventRsvp,
        createFeedPost,
        toggleFeedLike,
        addFeedComment,
        deleteFeedComment,
        deleteFeedPost,
        addPhoto,
        editPhoto,
        deletePhoto,
        addVideo,
        editVideo,
        deleteVideo,
        createHistoryPost,
        deleteHistoryPost,
        updateOrgHistory,
        sendMessage,
        editMessage,
        deleteMessage,
        createCustomGroupChat,
        joinGroupChat,
        leaveGroupChat,
        deleteGroupChat,
        markMessagesAsRead,
        createNotification,
        markNotificationRead,
        markAllNotificationsRead,
        deleteNotification,
        clearAllNotifications,
        appLogo,
        updateAppLogo,
        exportPlatformDataJson,
        dataCleanup,
        resetAllPlatformData
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
