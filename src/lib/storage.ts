import { User, Organization, ChatMessage, Notification, GroupChat, ClaimRequest } from '../types';
import {
  INITIAL_USERS,
  INITIAL_ORGS,
  INITIAL_MESSAGES,
  INITIAL_NOTIFICATIONS,
  INITIAL_GROUP_CHATS,
  INITIAL_CLAIM_REQUESTS
} from './seedData';

const STORAGE_KEYS = {
  USERS: 'boc_users_v3',
  ORGS: 'boc_orgs_v3',
  MESSAGES: 'boc_messages_v3',
  GROUP_CHATS: 'boc_group_chats_v3',
  CLAIM_REQUESTS: 'boc_claim_requests_v3',
  NOTIFICATIONS: 'boc_notifications_v3',
  CURRENT_USER_ID: 'boc_current_user_id_v3',
  AUTH_EXPIRY: 'boc_auth_expiry_v3'
};

export interface AppState {
  users: User[];
  orgs: Organization[];
  messages: ChatMessage[];
  groupChats: GroupChat[];
  claimRequests: ClaimRequest[];
  notifications: Notification[];
}

export function loadStoredData(): AppState {
  if (typeof window === 'undefined') {
    return {
      users: INITIAL_USERS,
      orgs: INITIAL_ORGS,
      messages: INITIAL_MESSAGES,
      groupChats: INITIAL_GROUP_CHATS,
      claimRequests: INITIAL_CLAIM_REQUESTS,
      notifications: INITIAL_NOTIFICATIONS
    };
  }

  try {
    const rawUsers = localStorage.getItem(STORAGE_KEYS.USERS);
    const rawOrgs = localStorage.getItem(STORAGE_KEYS.ORGS);
    const rawMessages = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    const rawGroupChats = localStorage.getItem(STORAGE_KEYS.GROUP_CHATS);
    const rawClaimRequests = localStorage.getItem(STORAGE_KEYS.CLAIM_REQUESTS);
    const rawNotifications = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);

    const users = rawUsers ? JSON.parse(rawUsers) : INITIAL_USERS;
    const orgs = rawOrgs ? JSON.parse(rawOrgs) : INITIAL_ORGS;
    const messages = rawMessages ? JSON.parse(rawMessages) : INITIAL_MESSAGES;
    const groupChats = rawGroupChats ? JSON.parse(rawGroupChats) : INITIAL_GROUP_CHATS;
    const claimRequests = rawClaimRequests ? JSON.parse(rawClaimRequests) : INITIAL_CLAIM_REQUESTS;
    const notifications = rawNotifications ? JSON.parse(rawNotifications) : INITIAL_NOTIFICATIONS;

    return { users, orgs, messages, groupChats, claimRequests, notifications };
  } catch (err) {
    console.error('Failed to load from localStorage, falling back to seed:', err);
    return {
      users: INITIAL_USERS,
      orgs: INITIAL_ORGS,
      messages: INITIAL_MESSAGES,
      groupChats: INITIAL_GROUP_CHATS,
      claimRequests: INITIAL_CLAIM_REQUESTS,
      notifications: INITIAL_NOTIFICATIONS
    };
  }
}

export function saveUsers(users: User[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }
}

export function saveOrgs(orgs: Organization[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.ORGS, JSON.stringify(orgs));
  }
}

export function saveMessages(messages: ChatMessage[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  }
}

export function saveGroupChats(groupChats: GroupChat[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.GROUP_CHATS, JSON.stringify(groupChats));
  }
}

export function saveClaimRequests(claimRequests: ClaimRequest[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.CLAIM_REQUESTS, JSON.stringify(claimRequests));
  }
}

export function saveNotifications(notifications: Notification[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }
}

export function resetAllDataToDefault() {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(STORAGE_KEYS.ORGS, JSON.stringify(INITIAL_ORGS));
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(INITIAL_MESSAGES));
    localStorage.setItem(STORAGE_KEYS.GROUP_CHATS, JSON.stringify(INITIAL_GROUP_CHATS));
    localStorage.setItem(STORAGE_KEYS.CLAIM_REQUESTS, JSON.stringify(INITIAL_CLAIM_REQUESTS));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
  }
}

export function getSavedCurrentUserId(): string | null {
  if (typeof window === 'undefined') return null;
  const expiry = localStorage.getItem(STORAGE_KEYS.AUTH_EXPIRY);
  if (expiry && Number(expiry) < Date.now()) {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    localStorage.removeItem(STORAGE_KEYS.AUTH_EXPIRY);
    return null;
  }
  return localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
}

export function setSavedCurrentUserId(userId: string, remember30Days: boolean = true) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, userId);
  if (remember30Days) {
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    localStorage.setItem(STORAGE_KEYS.AUTH_EXPIRY, (Date.now() + thirtyDays).toString());
  } else {
    const oneDay = 24 * 60 * 60 * 1000;
    localStorage.setItem(STORAGE_KEYS.AUTH_EXPIRY, (Date.now() + oneDay).toString());
  }
}

export function clearSavedCurrentUser() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
  localStorage.removeItem(STORAGE_KEYS.AUTH_EXPIRY);
}
