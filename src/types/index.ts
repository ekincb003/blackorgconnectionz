export type UserRole = 'student' | 'org_admin' | 'super_admin';
export type UserType = 'student' | 'guest';
export type CampusAffiliation = 'UCR' | 'CBU' | 'CSUSB' | 'Other / Guest';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  userType: UserType;
  campus: CampusAffiliation;
  avatar: string;
  banner?: string;
  bio: string;
  major: string;
  gradYear: string;
  phone?: string;
  instagram?: string;
  joinedOrgIds: string[];
  role: UserRole;
  friends: string[]; // User IDs
  friendRequestsIncoming: string[];
  friendRequestsOutgoing: string[];
  isSiteBanned?: boolean;
  siteBanReason?: string;
  resetCode?: string;
  createdAt: string;
}

export type OrgCategory =
  | 'Fraternities & Sororities (NPHC)'
  | 'Academic / Professional'
  | 'Cultural'
  | 'Arts and Expression'
  | 'Campus Department / Affiliated';

export interface OrgMember {
  userId: string;
  userName: string;
  userAvatar: string;
  userMajor: string;
  userGradYear: string;
  position: string;
  isPrimaryAdmin: boolean;
  isOfficer: boolean;
  joinedAt: string;
}

export interface JoinRequest {
  id: string;
  orgId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userMajor: string;
  userGradYear: string;
  message?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface PositionRequest {
  id: string;
  orgId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  requestedPosition: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface ClaimRequest {
  id: string;
  orgId: string;
  orgName: string;
  userId: string;
  userName: string;
  userEmail: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface OrgBannedMember {
  userId: string;
  userName: string;
  userAvatar: string;
  reason: string;
  bannedAt: string;
  bannedBy: string;
}

export interface OrgPlannerNote {
  id: string;
  orgId: string;
  title: string;
  content: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
  accessGrantedUserIds: string[];
}

export interface OrgPlannerAccessRequest {
  id: string;
  orgId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface AnnouncementComment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
  likes: string[];
  replies?: AnnouncementComment[];
}

export interface Announcement {
  id: string;
  orgId: string;
  orgName?: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorPosition: string;
  title: string;
  content: string;
  pinned: boolean;
  isGlobal?: boolean;
  imageUrl?: string;
  videoUrl?: string;
  caption?: string;
  createdAt: string;
  likes: string[];
  comments: AnnouncementComment[];
}

export type EventCategory =
  | 'Meeting'
  | 'Social'
  | 'Community Service'
  | 'Educational'
  | 'Greek Stroll/Step'
  | 'Fundraiser'
  | 'Party'
  | 'Workshop';

export interface Event {
  id: string;
  orgId: string;
  orgName?: string;
  orgLogo?: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  locationAddress?: string;
  category: EventCategory;
  flyerUrl?: string;
  rsvpsGoing: string[];
  rsvpsInterested: string[];
  createdAt: string;
  isCollaboration?: boolean;
  collaboratingOrgIds?: string[];
  collaboratingOrgNames?: string[];
}

export interface FeedPost {
  id: string;
  orgId: string;
  orgName?: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  type: 'general' | 'community_service';
  title?: string;
  content: string;
  serviceHours?: number;
  serviceDate?: string;
  location?: string;
  imageUrl?: string;
  createdAt: string;
  likes: string[];
  comments: {
    id: string;
    authorId: string;
    authorName: string;
    authorAvatar: string;
    content: string;
    createdAt: string;
  }[];
}

export interface PhotoItem {
  id: string;
  orgId: string;
  title: string;
  caption: string;
  url: string;
  uploadedBy: string;
  uploadedById?: string;
  uploadedAt: string;
}

export interface VideoItem {
  id: string;
  orgId: string;
  title: string;
  description: string;
  url: string;
  provider: 'youtube' | 'vimeo' | 'direct';
  thumbnailUrl?: string;
  uploadedBy: string;
  uploadedById?: string;
  uploadedAt: string;
}

export interface HistoryPost {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  imageCaption?: string;
  createdAt: string;
}

export interface OrgHistory {
  foundingDate: string;
  foundingLocation: string;
  charterDateOnCampus?: string;
  motto: string;
  principles: string[];
  colors: string[];
  flower?: string;
  symbol?: string;
  foundingStory: string;
  campusChapterStory: string;
  historicalSignificance: string;
  historyPosts?: HistoryPost[];
  founders: {
    name: string;
    title?: string;
    bio?: string;
  }[];
  historicPhotos: {
    url: string;
    caption: string;
  }[];
}

export interface Organization {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  category: OrgCategory;
  isClaimed: boolean;
  claimedByUserId?: string;
  logo: string;
  banner: string;
  primaryColor: string;
  secondaryColor: string;
  description: string;
  contactEmail: string;
  contactPhone?: string;
  instagramHandle?: string;
  website?: string;
  members: OrgMember[];
  bannedMembers?: OrgBannedMember[];
  joinRequests?: JoinRequest[];
  positionRequests?: PositionRequest[];
  plannerNotes?: OrgPlannerNote[];
  plannerAccessRequests?: OrgPlannerAccessRequest[];
  announcements: Announcement[];
  events: Event[];
  feed: FeedPost[];
  photos: PhotoItem[];
  videos: VideoItem[];
  history: OrgHistory;
  createdAt: string;
}

export interface GroupChat {
  id: string;
  name: string;
  isGlobal?: boolean;
  isOrgChat?: boolean;
  orgId?: string;
  avatar?: string;
  description?: string;
  createdBy: string;
  memberIds: string[];
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  recipientId: string; // User ID, 'group:<groupId>', or 'org:<orgId>'
  content: string;
  isEdited?: boolean;
  createdAt: string;
  read: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'friend_request' | 'announcement' | 'event' | 'role_change' | 'mention' | 'claim' | 'request';
  link?: string;
  read: boolean;
  createdAt: string;
}
