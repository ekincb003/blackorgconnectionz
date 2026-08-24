'use client';

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, Shield, GraduationCap, Crown, X, ChevronUp, ChevronDown } from 'lucide-react';

export default function RoleSwitcher() {
  const { currentUser, users, switchUser } = useAuth();
  const [expanded, setExpanded] = useState(false);

  if (!currentUser) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!expanded ? (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-neutral-900/95 hover:bg-neutral-800 border border-gold-500/40 text-white text-xs font-bold shadow-2xl backdrop-blur-md transition group"
          title="Switch Test Accounts"
        >
          <span className="p-1 rounded-lg bg-gold-500/20 text-gold-400">
            <Crown className="w-3.5 h-3.5" />
          </span>
          <span className="hidden sm:inline text-neutral-300 group-hover:text-white">
            {currentUser.name.split(' ')[0]} ({currentUser.role === 'super_admin' ? '🛡️ Super Admin' : '🎓 Student'})
          </span>
          <ChevronUp className="w-3.5 h-3.5 text-neutral-400" />
        </button>
      ) : (
        <div className="glass-panel p-4 rounded-3xl border border-gold-500/40 shadow-2xl space-y-3 max-w-xs w-72 backdrop-blur-xl animate-fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 text-gold-400" /> Test Account Switcher
            </span>
            <button
              onClick={() => setExpanded(false)}
              className="p-1 rounded-lg text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[11px] text-neutral-400">
            Active as <strong className="text-white">{currentUser.name}</strong> ({currentUser.role})
          </p>

          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {users.map((u) => {
              const isActive = u.id === currentUser.id;
              return (
                <button
                  key={u.id}
                  onClick={() => {
                    switchUser(u.id);
                    setExpanded(false);
                  }}
                  className={`w-full text-left p-2 rounded-xl text-xs transition flex items-center justify-between ${
                    isActive
                      ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40 font-bold'
                      : 'bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span>{u.role === 'super_admin' ? '🛡️' : '🎓'}</span>
                    <span className="truncate">{u.name}</span>
                  </div>
                  <span className="text-[10px] text-neutral-400">{u.role === 'super_admin' ? 'Admin' : 'Student'}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
