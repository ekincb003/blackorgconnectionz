'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, UserType, CampusAffiliation } from '../types';
import {
  loadStoredData,
  fetchServerData,
  saveUsers,
  getSavedCurrentUserId,
  setSavedCurrentUserId,
  clearSavedCurrentUser
} from '../lib/storage';
import { INITIAL_USERS } from '../lib/seedData';
import { supabase } from '../lib/supabaseClient';

export const ALLOWED_STUDENT_EMAIL_DOMAINS = [
  'ucr.edu',
  'calbaptist.edu',
  'cbu.edu',
  'csusb.edu',
  'coyote.csusb.edu'
];

export function isAllowedStudentEmail(email: string): { allowed: boolean; campus: CampusAffiliation } {
  const lower = email.toLowerCase().trim();
  if (lower.endsWith('@ucr.edu') || lower.endsWith('.ucr.edu')) {
    return { allowed: true, campus: 'UCR' };
  }
  if (lower.endsWith('@calbaptist.edu') || lower.endsWith('@cbu.edu')) {
    return { allowed: true, campus: 'CBU' };
  }
  if (lower.endsWith('@csusb.edu') || lower.endsWith('@coyote.csusb.edu') || lower.endsWith('.csusb.edu')) {
    return { allowed: true, campus: 'CSUSB' };
  }
  return { allowed: false, campus: 'Other / Guest' };
}

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  isLoading: boolean;
  login: (email: string, password?: string, remember30Days?: boolean) => { success: boolean; message?: string };
  signup: (
    userData: {
      name: string;
      email: string;
      password?: string;
      userType: UserType;
      major?: string;
      gradYear?: string;
      bio?: string;
      avatar?: string;
      banner?: string;
    },
    remember30Days?: boolean
  ) => { success: boolean; message?: string };
  logout: () => void;
  switchUser: (userId: string) => void;
  updateProfile: (updatedData: Partial<User>) => void;
  requestPasswordReset: (email: string) => { success: boolean; code?: string; message: string };
  verifyResetCodeAndSetPassword: (email: string, code: string, newPassword: string) => { success: boolean; message: string };
  // Site Governance
  banUserSite: (userId: string, reason: string) => void;
  unbanUserSite: (userId: string) => void;
  deleteUserPermanently: (userId: string) => void;
  // Friend System
  sendFriendRequest: (targetUserId: string) => void;
  cancelFriendRequest: (targetUserId: string) => void;
  acceptFriendRequest: (targetUserId: string) => void;
  declineFriendRequest: (targetUserId: string) => void;
  removeFriend: (targetUserId: string) => void;
  getUserById: (userId: string) => User | undefined;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const data = loadStoredData();
    setUsers(data.users);

    const checkSavedUser = (userList: User[]) => {
      const savedId = getSavedCurrentUserId();
      if (savedId) {
        const found = userList.find((u) => u.id === savedId);
        if (found && !found.isSiteBanned) {
          setCurrentUser(found);
        } else {
          setCurrentUser(null);
          clearSavedCurrentUser();
        }
      } else {
        // New visitor starts logged out - they can sign in or create their own account
        setCurrentUser(null);
      }
    };

    checkSavedUser(data.users);

    const loadUsersFromServer = async () => {
      const serverData = await fetchServerData();
      if (serverData && serverData.users && serverData.users.length > 0) {
        setUsers(serverData.users);
      }
    };
    loadUsersFromServer();

    // Supabase Real-time WebSockets Sync for users
    const channel = supabase
      .channel('platform_users_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'platform_state' },
        (payload) => {
          if (payload.new && (payload.new as any).data && (payload.new as any).data.users) {
            setUsers((payload.new as any).data.users);
          }
        }
      )
      .subscribe();

    const interval = setInterval(loadUsersFromServer, 4000);
    const onFocus = () => loadUsersFromServer();
    window.addEventListener('focus', onFocus);

    setIsLoading(false);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  const login = (email: string, password?: string, remember30Days: boolean = true) => {
    const cleanEmail = email.toLowerCase().trim();
    const found = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!found) {
      return { success: false, message: 'No account found with this email address.' };
    }

    if (found.isSiteBanned) {
      return {
        success: false,
        message: `This account has been site-banned by the Super Admin. Reason: ${found.siteBanReason || 'Violation of platform terms.'}`
      };
    }

    if (found.password && password && found.password !== password) {
      return { success: false, message: 'Incorrect password. Please try again or reset your password.' };
    }

    setCurrentUser(found);
    setSavedCurrentUserId(found.id, remember30Days);
    return { success: true };
  };

  const signup = (
    userData: {
      name: string;
      email: string;
      password?: string;
      userType: UserType;
      major?: string;
      gradYear?: string;
      bio?: string;
      avatar?: string;
      banner?: string;
    },
    remember30Days: boolean = true
  ) => {
    const cleanEmail = userData.email.toLowerCase().trim();

    if (!cleanEmail || !userData.name.trim()) {
      return { success: false, message: 'Please provide both your name and email address.' };
    }

    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return { success: false, message: 'An account with this email address already exists. Please log in.' };
    }

    // Validate email domain for student accounts
    let campus: CampusAffiliation = 'Other / Guest';
    if (userData.userType === 'student') {
      const check = isAllowedStudentEmail(cleanEmail);
      if (!check.allowed) {
        return {
          success: false,
          message: 'Student accounts require a valid campus email from UCR (@ucr.edu), CBU (@calbaptist.edu / @cbu.edu), or CSUSB (@csusb.edu / @coyote.csusb.edu). You can also register as a Guest.'
        };
      }
      campus = check.campus;
    }

    const isFirstUserEver = users.length === 0;
    const isElijah = cleanEmail === 'ekinc002@ucr.edu';

    const newUser: User = {
      id: isElijah ? 'user-elijah' : `user-${Date.now()}`,
      name: userData.name.trim(),
      email: cleanEmail,
      password: userData.password || 'password123',
      userType: userData.userType || 'student',
      campus,
      avatar:
        userData.avatar ||
        `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80`,
      banner: userData.banner || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1400&auto=format&fit=crop&q=80',
      bio: userData.bio || `${campus} ${userData.userType === 'student' ? 'Student' : 'Guest'} on BlackOrgConnectionz`,
      major: userData.major || (userData.userType === 'guest' ? 'Non-Student / Guest' : 'Undeclared'),
      gradYear: userData.gradYear || (userData.userType === 'guest' ? 'Guest' : '2027'),
      phone: '',
      instagram: '',
      joinedOrgIds: isElijah ? ['org-pbs', 'org-bsu', 'org-blaack', 'org-csu', 'org-easa', 'org-nsa', 'org-sasi'] : [],
      role: isElijah || isFirstUserEver ? 'super_admin' : 'student',
      friends: [],
      friendRequestsIncoming: [],
      friendRequestsOutgoing: [],
      createdAt: new Date().toISOString()
    };

    const nextUsers = [...users, newUser];
    setUsers(nextUsers);
    saveUsers(nextUsers);
    setCurrentUser(newUser);
    setSavedCurrentUserId(newUser.id, remember30Days);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    clearSavedCurrentUser();
  };

  const switchUser = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (target && !target.isSiteBanned) {
      setCurrentUser(target);
      setSavedCurrentUserId(target.id, true);
    }
  };

  const updateProfile = (updatedData: Partial<User>) => {
    if (!currentUser) return;
    const updatedUser: User = {
      ...currentUser,
      ...updatedData
    };

    const nextUsers = users.map((u) => (u.id === currentUser.id ? updatedUser : u));
    setUsers(nextUsers);
    saveUsers(nextUsers);
    setCurrentUser(updatedUser);
  };

  const requestPasswordReset = (email: string) => {
    const cleanEmail = email.toLowerCase().trim();
    const found = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!found) {
      return { success: false, message: 'No account found with that email address.' };
    }

    // Generate 6 digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const nextUsers = users.map((u) => (u.id === found.id ? { ...u, resetCode: code } : u));
    setUsers(nextUsers);
    saveUsers(nextUsers);

    return {
      success: true,
      code,
      message: `Verification code generated: ${code}. Enter this code below to set your new password.`
    };
  };

  const verifyResetCodeAndSetPassword = (email: string, code: string, newPassword: string) => {
    const cleanEmail = email.toLowerCase().trim();
    const found = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!found) {
      return { success: false, message: 'User not found.' };
    }
    if (!found.resetCode || found.resetCode !== code.trim()) {
      return { success: false, message: 'Invalid verification code.' };
    }

    const nextUsers = users.map((u) =>
      u.id === found.id ? { ...u, password: newPassword, resetCode: undefined } : u
    );
    setUsers(nextUsers);
    saveUsers(nextUsers);

    return { success: true, message: 'Password reset successfully! You can now log in with your new password.' };
  };

  // Super Admin Governance
  const banUserSite = (userId: string, reason: string) => {
    const nextUsers = users.map((u) =>
      u.id === userId ? { ...u, isSiteBanned: true, siteBanReason: reason } : u
    );
    setUsers(nextUsers);
    saveUsers(nextUsers);
    if (currentUser?.id === userId) {
      logout();
    }
  };

  const unbanUserSite = (userId: string) => {
    const nextUsers = users.map((u) =>
      u.id === userId ? { ...u, isSiteBanned: false, siteBanReason: undefined } : u
    );
    setUsers(nextUsers);
    saveUsers(nextUsers);
  };

  const deleteUserPermanently = (userId: string) => {
    const nextUsers = users.filter((u) => u.id !== userId);
    setUsers(nextUsers);
    saveUsers(nextUsers);
    if (currentUser?.id === userId) {
      logout();
    }
  };

  // Friend Operations
  const sendFriendRequest = (targetUserId: string) => {
    if (!currentUser || currentUser.id === targetUserId) return;
    if (currentUser.friends.includes(targetUserId)) return;
    if (currentUser.friendRequestsOutgoing.includes(targetUserId)) return;

    const updatedCurrent: User = {
      ...currentUser,
      friendRequestsOutgoing: [...currentUser.friendRequestsOutgoing, targetUserId]
    };

    const nextUsers = users.map((u) => {
      if (u.id === currentUser.id) return updatedCurrent;
      if (u.id === targetUserId) {
        return {
          ...u,
          friendRequestsIncoming: Array.from(new Set([...u.friendRequestsIncoming, currentUser.id]))
        };
      }
      return u;
    });

    setUsers(nextUsers);
    saveUsers(nextUsers);
    setCurrentUser(updatedCurrent);
  };

  const cancelFriendRequest = (targetUserId: string) => {
    if (!currentUser) return;
    const updatedCurrent: User = {
      ...currentUser,
      friendRequestsOutgoing: currentUser.friendRequestsOutgoing.filter((id) => id !== targetUserId)
    };

    const nextUsers = users.map((u) => {
      if (u.id === currentUser.id) return updatedCurrent;
      if (u.id === targetUserId) {
        return {
          ...u,
          friendRequestsIncoming: u.friendRequestsIncoming.filter((id) => id !== currentUser.id)
        };
      }
      return u;
    });

    setUsers(nextUsers);
    saveUsers(nextUsers);
    setCurrentUser(updatedCurrent);
  };

  const acceptFriendRequest = (targetUserId: string) => {
    if (!currentUser) return;
    const updatedCurrent: User = {
      ...currentUser,
      friends: Array.from(new Set([...currentUser.friends, targetUserId])),
      friendRequestsIncoming: currentUser.friendRequestsIncoming.filter((id) => id !== targetUserId)
    };

    const nextUsers = users.map((u) => {
      if (u.id === currentUser.id) return updatedCurrent;
      if (u.id === targetUserId) {
        return {
          ...u,
          friends: Array.from(new Set([...u.friends, currentUser.id])),
          friendRequestsOutgoing: u.friendRequestsOutgoing.filter((id) => id !== currentUser.id)
        };
      }
      return u;
    });

    setUsers(nextUsers);
    saveUsers(nextUsers);
    setCurrentUser(updatedCurrent);
  };

  const declineFriendRequest = (targetUserId: string) => {
    if (!currentUser) return;
    const updatedCurrent: User = {
      ...currentUser,
      friendRequestsIncoming: currentUser.friendRequestsIncoming.filter((id) => id !== targetUserId)
    };

    const nextUsers = users.map((u) => {
      if (u.id === currentUser.id) return updatedCurrent;
      if (u.id === targetUserId) {
        return {
          ...u,
          friendRequestsOutgoing: u.friendRequestsOutgoing.filter((id) => id !== currentUser.id)
        };
      }
      return u;
    });

    setUsers(nextUsers);
    saveUsers(nextUsers);
    setCurrentUser(updatedCurrent);
  };

  const removeFriend = (targetUserId: string) => {
    if (!currentUser) return;
    const updatedCurrent: User = {
      ...currentUser,
      friends: currentUser.friends.filter((id) => id !== targetUserId)
    };

    const nextUsers = users.map((u) => {
      if (u.id === currentUser.id) return updatedCurrent;
      if (u.id === targetUserId) {
        return {
          ...u,
          friends: u.friends.filter((id) => id !== currentUser.id)
        };
      }
      return u;
    });

    setUsers(nextUsers);
    saveUsers(nextUsers);
    setCurrentUser(updatedCurrent);
  };

  const getUserById = (userId: string) => {
    return users.find((u) => u.id === userId);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        isLoading,
        login,
        signup,
        logout,
        switchUser,
        updateProfile,
        requestPasswordReset,
        verifyResetCodeAndSetPassword,
        banUserSite,
        unbanUserSite,
        deleteUserPermanently,
        sendFriendRequest,
        cancelFriendRequest,
        acceptFriendRequest,
        declineFriendRequest,
        removeFriend,
        getUserById
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
