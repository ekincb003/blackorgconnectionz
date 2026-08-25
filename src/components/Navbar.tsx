'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import NotificationDropdown from './NotificationDropdown';
import ImageWithFallback from './ImageWithFallback';
import LiveCampusClock from './LiveCampusClock';
import AppLogoModal from './modals/AppLogoModal';
import {
  Compass,
  MessageSquare,
  ShieldAlert,
  User,
  Users,
  LogOut,
  Sparkles,
  ChevronDown,
  Calendar,
  Megaphone,
  Shield,
  Image as ImageIcon,
  Edit,
  Cloud,
  Check
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { currentUser, logout, users } = useAuth();
  const { messages, appLogo, orgs, groupChats, claimRequests, notifications } = useData();
  const [profileOpen, setProfileOpen] = useState(false);
  const [showLogoModal, setShowLogoModal] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          users,
          organizations: orgs,
          messages,
          groupChats,
          claimRequests,
          notifications,
          appLogo
        })
      });
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 3000);
    } catch (err) {
      console.error('Manual sync failed:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  // Calculate unread direct messages for current user
  const unreadMsgCount = currentUser
    ? messages.filter((m) => m.recipientId === currentUser.id && !m.read).length
    : 0;

  const isCurrent = (path: string) => pathname === path;

  return (
    <>
      <header className="sticky top-0 z-40 bg-neutral-950/95 backdrop-blur-xl border-b border-white/10 shadow-2xl">
        {/* Top Status & Live Clock Bar */}
        <div className="bg-black/60 border-b border-white/5 px-4 sm:px-8 py-2 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <LiveCampusClock />
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-[11px] text-neutral-400">
            {currentUser && (
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-neutral-500">Logged in as:</span>
                <span className="text-white font-semibold flex items-center gap-1">
                  {currentUser.role === 'super_admin' ? (
                    <span className="text-red-400 font-bold">🛡️ Elijah Kincade (Super Admin)</span>
                  ) : (
                    <span>🎓 {currentUser.name}</span>
                  )}
                </span>
              </div>
            )}

            {/* Instant Manual Cloud Sync Button */}
            <button
              type="button"
              onClick={handleManualSync}
              disabled={isSyncing}
              className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition shadow-sm ${
                syncSuccess
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
              }`}
              title="Save & broadcast all edits to all devices via cloud"
            >
              {syncSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Cloud Synced!
                </>
              ) : (
                <>
                  <Cloud className={`w-3.5 h-3.5 text-gold-400 ${isSyncing ? 'animate-bounce' : ''}`} />
                  {isSyncing ? 'Syncing...' : 'Sync to Cloud'}
                </>
              )}
            </button>

            {currentUser?.role === 'super_admin' && (
              <button
                type="button"
                onClick={() => setShowLogoModal(true)}
                className="flex items-center gap-1 text-[11px] text-gold-400 hover:text-gold-300 font-medium px-2 py-1 rounded-lg bg-gold-500/10 border border-gold-500/20 transition"
                title="Upload or change app logo"
              >
                <ImageIcon className="w-3 h-3" /> Change App Logo
              </button>
            )}
          </div>
        </div>

        {/* Main Navbar Bar - Spacious and Clean */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4 sm:gap-8">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3.5 group shrink-0">
              <div className="w-11 h-11 rounded-2xl bg-neutral-900 border border-gold-500/30 p-1.5 flex items-center justify-center shadow-lg shadow-gold-500/10 group-hover:scale-105 group-hover:border-gold-500 transition duration-300">
                <img
                  src={appLogo}
                  alt="BlackOrgConnectionz Emblem"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-lg sm:text-xl font-black text-white tracking-tight group-hover:text-gold-400 transition">
                    BlackOrg<span className="gold-gradient-text">Connectionz</span>
                  </span>
                  <span className="hidden xl:inline text-[9px] bg-gold-500/20 text-gold-300 font-extrabold px-2 py-0.5 rounded-full border border-gold-500/30 tracking-wider uppercase">
                    Campus Hub
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 font-medium hidden lg:block">
                  Campus Black Student Organizations & NPHC Greek Life
                </p>
              </div>
            </Link>

            {/* Top Navigation Links in Requested Order */}
            <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
              {/* 1. 🏛️ Organizations */}
              <Link
                href="/"
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs lg:text-sm font-semibold transition ${
                  isCurrent('/')
                    ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40 shadow-inner'
                    : 'text-neutral-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Compass className="w-4 h-4 text-gold-400" /> Organizations
              </Link>

              {/* 2. 🎓 Students */}
              <Link
                href="/students"
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs lg:text-sm font-semibold transition ${
                  isCurrent('/students')
                    ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40 shadow-inner'
                    : 'text-neutral-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Users className="w-4 h-4 text-gold-400" /> Students
              </Link>

              {/* 3. 📅 Events */}
              <Link
                href="/events"
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs lg:text-sm font-semibold transition ${
                  isCurrent('/events')
                    ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40 shadow-inner'
                    : 'text-neutral-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Calendar className="w-4 h-4 text-gold-400" /> Events
              </Link>

              {/* 4. 📣 Announcements */}
              <Link
                href="/announcements"
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs lg:text-sm font-semibold transition ${
                  isCurrent('/announcements')
                    ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40 shadow-inner'
                    : 'text-neutral-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Megaphone className="w-4 h-4 text-gold-400" /> Announcements
              </Link>

              {/* 5. 💬 Messages & Chats */}
              <Link
                href="/messages"
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs lg:text-sm font-semibold transition relative ${
                  isCurrent('/messages')
                    ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40 shadow-inner'
                    : 'text-neutral-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <MessageSquare className="w-4 h-4 text-gold-400" /> Messages
                {unreadMsgCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 bg-gold-500 text-black text-[10px] font-extrabold rounded-full">
                    {unreadMsgCount}
                  </span>
                )}
              </Link>

              {/* 6. 🛡️ Super Admin */}
              {currentUser?.role === 'super_admin' && (
                <Link
                  href="/superadmin"
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs lg:text-sm font-semibold transition ${
                    isCurrent('/superadmin')
                      ? 'bg-red-500/25 text-red-300 border border-red-500/40 shadow-inner'
                      : 'text-red-400 hover:text-red-300 hover:bg-red-500/10'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4 text-red-400" /> Super Admin
                </Link>
              )}
            </nav>

            {/* Right Action Icons & User Dropdown */}
            <div className="flex items-center gap-3 shrink-0">
              <NotificationDropdown />

              {currentUser ? (
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl hover:bg-white/5 border border-white/10 transition focus:outline-none"
                  >
                    <ImageWithFallback
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      fallbackType="avatar"
                      fallbackText={currentUser.name.split(' ').map((n) => n[0]).join('')}
                      className="w-9 h-9 rounded-xl object-cover ring-2 ring-gold-500/40"
                    />
                    <span className="text-xs font-semibold text-white hidden lg:inline max-w-[120px] truncate">
                      {currentUser.name.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-neutral-400 hidden lg:inline" />
                  </button>

                  {profileOpen && (
                    <div
                      className="absolute right-0 mt-2 w-64 glass-panel rounded-2xl shadow-2xl z-50 border border-white/15 overflow-hidden py-1"
                      onMouseLeave={() => setProfileOpen(false)}
                    >
                      <div className="px-4 py-3 border-b border-white/10 bg-black/40">
                        <p className="text-sm font-bold text-white truncate">{currentUser.name}</p>
                        <p className="text-xs text-neutral-400 truncate">{currentUser.email}</p>
                        <div className="mt-2 flex items-center gap-1.5">
                          <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-md bg-gold-500/20 text-gold-300 border border-gold-500/30">
                            {currentUser.role.replace('_', ' ')}
                          </span>
                          <span className="text-[11px] text-neutral-400 truncate">{currentUser.major}</span>
                        </div>
                      </div>

                      <Link
                        href="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-neutral-200 hover:bg-white/10 hover:text-white transition"
                      >
                        <User className="w-4 h-4 text-gold-400" /> My Profile & Joined Orgs
                      </Link>

                      <Link
                        href="/events"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-neutral-200 hover:bg-white/10 hover:text-white transition"
                      >
                        <Calendar className="w-4 h-4 text-gold-400" /> Campus Calendar
                      </Link>

                      <Link
                        href="/announcements"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-neutral-200 hover:bg-white/10 hover:text-white transition"
                      >
                        <Megaphone className="w-4 h-4 text-gold-400" /> Announcements Feed
                      </Link>

                      <Link
                        href="/messages"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-neutral-200 hover:bg-white/10 hover:text-white transition"
                      >
                        <MessageSquare className="w-4 h-4 text-gold-400" /> Chats & Friends
                      </Link>

                      {currentUser.role === 'super_admin' && (
                        <>
                          <button
                            onClick={() => {
                              setProfileOpen(false);
                              setShowLogoModal(true);
                            }}
                            className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-xs text-gold-400 hover:bg-gold-500/10 hover:text-gold-300 transition"
                          >
                            <ImageIcon className="w-4 h-4 text-gold-400" /> Change App Logo
                          </button>

                          <Link
                            href="/superadmin"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300 transition"
                          >
                            <ShieldAlert className="w-4 h-4" /> Super Admin Control
                          </Link>
                        </>
                      )}

                      <div className="border-t border-white/10 my-1"></div>

                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          logout();
                        }}
                        className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs text-neutral-400 hover:bg-white/10 hover:text-red-400 transition"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="text-xs font-semibold text-white hover:text-gold-400 px-3.5 py-2 transition"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/login?mode=signup"
                    className="text-xs font-bold bg-gold-500 hover:bg-gold-400 text-black px-4 py-2 rounded-xl transition shadow-lg shadow-gold-500/20"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Floating Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around py-2 border-t border-white/10 bg-neutral-950/95 backdrop-blur-xl text-[11px] shadow-2xl safe-area-bottom">
        <Link
          href="/"
          className={`flex flex-col items-center py-1 px-2.5 transition ${
            isCurrent('/') ? 'text-gold-400 font-bold scale-105' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Compass className="w-4 h-4 mb-0.5" /> Orgs
        </Link>
        <Link
          href="/students"
          className={`flex flex-col items-center py-1 px-2.5 transition ${
            isCurrent('/students') ? 'text-gold-400 font-bold scale-105' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4 mb-0.5" /> Students
        </Link>
        <Link
          href="/events"
          className={`flex flex-col items-center py-1 px-2.5 transition ${
            isCurrent('/events') ? 'text-gold-400 font-bold scale-105' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4 mb-0.5" /> Events
        </Link>
        <Link
          href="/announcements"
          className={`flex flex-col items-center py-1 px-2.5 transition ${
            isCurrent('/announcements') ? 'text-gold-400 font-bold scale-105' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Megaphone className="w-4 h-4 mb-0.5" /> Bulletins
        </Link>
        <Link
          href="/messages"
          className={`flex flex-col items-center py-1 px-2.5 relative transition ${
            isCurrent('/messages') ? 'text-gold-400 font-bold scale-105' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <MessageSquare className="w-4 h-4 mb-0.5" /> Chats
          {unreadMsgCount > 0 && (
            <span className="absolute top-0 right-1.5 w-2 h-2 bg-gold-500 rounded-full" />
          )}
        </Link>
        <Link
          href={currentUser ? "/profile" : "/login"}
          className={`flex flex-col items-center py-1 px-2.5 transition ${
            isCurrent('/profile') || isCurrent('/login') ? 'text-gold-400 font-bold scale-105' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <User className="w-4 h-4 mb-0.5" /> {currentUser ? "Profile" : "Sign In"}
        </Link>
      </nav>

      {/* App Logo Customization Modal */}
      {showLogoModal && (
        <AppLogoModal onClose={() => setShowLogoModal(false)} />
      )}
    </>
  );
}
