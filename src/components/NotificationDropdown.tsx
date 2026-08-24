'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Bell, Check, Trash2, UserPlus, Sparkles, Calendar, Award } from 'lucide-react';

export default function NotificationDropdown() {
  const { notifications, markNotificationRead, clearAllNotifications } = useData();
  const { currentUser, acceptFriendRequest, declineFriendRequest } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const userNotifications = notifications.filter((n) => !currentUser || n.userId === currentUser.id);
  const unreadCount = userNotifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'friend_request':
        return <UserPlus className="w-4 h-4 text-blue-400" />;
      case 'announcement':
        return <Sparkles className="w-4 h-4 text-gold-400" />;
      case 'event':
        return <Calendar className="w-4 h-4 text-emerald-400" />;
      case 'role_change':
      case 'claim':
        return <Award className="w-4 h-4 text-purple-400" />;
      default:
        return <Bell className="w-4 h-4 text-neutral-400" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full text-neutral-300 hover:text-white hover:bg-white/10 transition focus:outline-none"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-gold-500 text-black font-bold text-[10px] rounded-full flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-84 sm:w-96 glass-panel rounded-xl shadow-2xl z-50 border border-white/10 overflow-hidden">
          <div className="p-3.5 border-b border-white/10 flex items-center justify-between bg-black/40">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm text-white flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-gold-400" /> Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="bg-gold-500/20 text-gold-400 text-xs px-2 py-0.5 rounded-full font-medium">
                  {unreadCount} new
                </span>
              )}
            </div>

            {userNotifications.length > 0 && (
              <button
                onClick={() => clearAllNotifications()}
                className="text-xs text-neutral-400 hover:text-red-400 flex items-center gap-1 transition px-2 py-1 rounded hover:bg-white/5"
                title="Clear all notifications"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear All
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto divide-y divide-white/5">
            {userNotifications.length === 0 ? (
              <div className="p-8 text-center text-neutral-400 text-sm">
                <p>No notifications right now ✨</p>
                <p className="text-xs text-neutral-500 mt-1">You are all caught up!</p>
              </div>
            ) : (
              userNotifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-3.5 hover:bg-white/5 transition flex items-start gap-3 ${
                    !notif.read ? 'bg-white/[0.03]' : ''
                  }`}
                  onClick={() => markNotificationRead(notif.id)}
                >
                  <div className="p-2 rounded-lg bg-neutral-800 border border-white/5 mt-0.5 shrink-0">
                    {getIcon(notif.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <p className="text-xs font-medium text-white truncate">{notif.title}</p>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-gold-400 shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-xs text-neutral-300 mt-0.5 line-clamp-2">{notif.message}</p>

                    {/* Friend request quick actions */}
                    {notif.type === 'friend_request' && currentUser && (
                      <div className="flex items-center gap-2 mt-2">
                        <Link
                          href="/profile"
                          onClick={() => setIsOpen(false)}
                          className="text-[11px] bg-gold-500 hover:bg-gold-400 text-black font-semibold px-2.5 py-1 rounded transition"
                        >
                          View in Profile
                        </Link>
                      </div>
                    )}

                    {notif.link && notif.type !== 'friend_request' && (
                      <Link
                        href={notif.link}
                        onClick={() => setIsOpen(false)}
                        className="inline-block text-[11px] text-gold-400 hover:underline mt-1.5 font-medium"
                      >
                        View Details →
                      </Link>
                    )}

                    <p className="text-[10px] text-neutral-500 mt-1">
                      {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(notif.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
