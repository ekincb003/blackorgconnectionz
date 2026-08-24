'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  MessageSquare,
  Users,
  Send,
  Plus,
  Trash2,
  Edit2,
  Globe,
  Building2,
  UserCheck,
  Search,
  CheckCheck,
  Crown,
  Shield,
  X
} from 'lucide-react';
import { GroupChat } from '../../types';

function MessagesContent() {
  const searchParams = useSearchParams();
  const initialRecipient = searchParams.get('to');

  const { currentUser, users } = useAuth();
  const {
    messages,
    groupChats,
    orgs,
    sendMessage,
    editMessage,
    deleteMessage,
    createCustomGroupChat,
    leaveGroupChat,
    deleteGroupChat,
    markMessagesAsRead
  } = useData();

  // Active channel/conversation ID
  // e.g. "group:group-global", "group:group-org-pbs", or "user-xxx"
  const [activeChatId, setActiveChatId] = useState<string>(
    initialRecipient ? initialRecipient : 'group:group-global'
  );

  const [messageInput, setMessageInput] = useState('');
  const [editingMsgId, setEditingMsgId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  // Create Group Modal
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  useEffect(() => {
    if (activeChatId) {
      markMessagesAsRead(activeChatId);
    }
  }, [activeChatId]);

  // Compute conversations list
  const activeConversationMessages = useMemo(() => {
    if (!currentUser) return [];

    if (activeChatId.startsWith('group:')) {
      const groupId = activeChatId.replace('group:', '');
      return messages.filter(
        (m) => m.recipientId === `group:${groupId}` || m.recipientId === `group:${groupId}`
      );
    } else {
      // 1-on-1 private chat
      return messages.filter(
        (m) =>
          (m.senderId === currentUser.id && m.recipientId === activeChatId) ||
          (m.senderId === activeChatId && m.recipientId === currentUser.id)
      );
    }
  }, [messages, activeChatId, currentUser]);

  // Available group channels
  const userGroupChats = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === 'super_admin') return groupChats;
    return groupChats.filter(
      (g) => g.isGlobal || g.memberIds.includes(currentUser.id)
    );
  }, [groupChats, currentUser]);

  // Other users for direct messages
  const directMessageUsers = useMemo(() => {
    if (!currentUser) return [];
    return users.filter((u) => u.id !== currentUser.id && !u.isSiteBanned);
  }, [users, currentUser]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !currentUser) return;

    sendMessage(activeChatId, messageInput.trim());
    setMessageInput('');
  };

  const handleSaveEdit = (msgId: string) => {
    if (!editContent.trim()) return;
    editMessage(msgId, editContent.trim());
    setEditingMsgId(null);
    setEditContent('');
  };

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim() || !currentUser) return;

    const newGroup = createCustomGroupChat(newGroupName.trim(), selectedUserIds, newGroupDesc.trim());
    setShowCreateGroupModal(false);
    setNewGroupName('');
    setNewGroupDesc('');
    setSelectedUserIds([]);
    setActiveChatId(`group:${newGroup.id}`);
  };

  if (!currentUser) {
    return (
      <div className="glass-card rounded-3xl p-12 text-center max-w-md mx-auto my-12 space-y-4">
        <MessageSquare className="w-12 h-12 text-neutral-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">Sign In Required</h2>
        <p className="text-xs text-neutral-400">Please sign in to access campus direct messages and group chats.</p>
      </div>
    );
  }

  // Determine active conversation metadata
  const activeChatMeta = useMemo(() => {
    if (activeChatId.startsWith('group:')) {
      const gId = activeChatId.replace('group:', '');
      const group = groupChats.find((g) => g.id === gId);
      return {
        title: group?.name || 'Group Chat',
        subtitle: group?.description || `${group?.memberIds.length || 1} members`,
        isGroup: true,
        groupId: gId,
        isGlobal: group?.isGlobal
      };
    } else {
      const user = users.find((u) => u.id === activeChatId);
      return {
        title: user?.name || 'Private Chat',
        subtitle: user ? `${user.campus} • ${user.major}` : '',
        isGroup: false,
        avatar: user?.avatar
      };
    }
  }, [activeChatId, groupChats, users]);

  return (
    <div className="h-[calc(100vh-140px)] min-h-[500px] glass-panel rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col md:flex-row">
      {/* Left Sidebar: Channels & Chats */}
      <div className="w-full md:w-80 border-r border-white/10 flex flex-col bg-neutral-950/60 shrink-0">
        {/* Header & New Chat */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-sm font-black text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-gold-400" /> Messages & Channels
          </h2>

          <button
            onClick={() => setShowCreateGroupModal(true)}
            className="p-1.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-black transition"
            title="Create Custom Group Chat"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Channels List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {/* Group Channels */}
          <div>
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider px-2 block mb-1.5">
              Group Channels ({userGroupChats.length})
            </span>
            <div className="space-y-1">
              {userGroupChats.map((g) => {
                const isActive = activeChatId === `group:${g.id}`;
                return (
                  <button
                    key={g.id}
                    onClick={() => setActiveChatId(`group:${g.id}`)}
                    className={`w-full p-2.5 rounded-xl text-left transition flex items-center gap-2.5 ${
                      isActive
                        ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40 font-semibold'
                        : 'bg-white/[0.02] hover:bg-white/5 text-neutral-300'
                    }`}
                  >
                    {g.isGlobal ? (
                      <Globe className="w-4 h-4 text-gold-400 shrink-0" />
                    ) : g.isOrgChat ? (
                      <Building2 className="w-4 h-4 text-blue-400 shrink-0" />
                    ) : (
                      <Users className="w-4 h-4 text-purple-400 shrink-0" />
                    )}
                    <div className="truncate flex-1">
                      <p className="text-xs truncate">{g.name}</p>
                      <p className="text-[10px] text-neutral-500 truncate">{g.description || 'Channel'}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Direct 1-on-1 Messages */}
          <div>
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider px-2 block mb-1.5">
              Direct Messages ({directMessageUsers.length})
            </span>

            {directMessageUsers.length === 0 ? (
              <p className="text-[11px] text-neutral-500 italic px-2 py-1">No other registered users yet.</p>
            ) : (
              <div className="space-y-1">
                {directMessageUsers.map((u) => {
                  const isActive = activeChatId === u.id;
                  return (
                    <button
                      key={u.id}
                      onClick={() => setActiveChatId(u.id)}
                      className={`w-full p-2.5 rounded-xl text-left transition flex items-center gap-2.5 ${
                        isActive
                          ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40 font-semibold'
                          : 'bg-white/[0.02] hover:bg-white/5 text-neutral-300'
                      }`}
                    >
                      <img src={u.avatar} alt="" className="w-6 h-6 rounded-full object-cover shrink-0" />
                      <div className="truncate flex-1">
                        <p className="text-xs truncate">{u.name}</p>
                        <p className="text-[10px] text-neutral-500 truncate">{u.campus}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Area: Chat Conversation */}
      <div className="flex-1 flex flex-col bg-neutral-900/40">
        {/* Active Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-neutral-950/40">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
              {activeChatMeta.title}
            </h3>
            <p className="text-[11px] text-neutral-400">{activeChatMeta.subtitle}</p>
          </div>

          {activeChatMeta.isGroup && !activeChatMeta.isGlobal && (
            <button
              onClick={() => {
                if (confirm('Leave this group chat?')) {
                  leaveGroupChat(activeChatMeta.groupId!);
                  setActiveChatId('group:group-global');
                }
              }}
              className="text-[11px] text-neutral-400 hover:text-red-400 transition"
            >
              Leave Group
            </button>
          )}
        </div>

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {activeConversationMessages.length === 0 ? (
            <div className="text-center py-16 space-y-2">
              <MessageSquare className="w-10 h-10 text-neutral-600 mx-auto" />
              <p className="text-xs text-neutral-400">No messages in this channel yet.</p>
              <p className="text-[11px] text-neutral-500">Send the first message below to start the conversation!</p>
            </div>
          ) : (
            activeConversationMessages.map((msg) => {
              const isMine = msg.senderId === currentUser.id;
              const canModerate = isMine || currentUser.role === 'super_admin';

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <img
                    src={msg.senderAvatar}
                    alt=""
                    className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                  />

                  <div className={`max-w-[75%] space-y-1 ${isMine ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-2 px-1">
                      <span className="text-[11px] font-bold text-neutral-300">{msg.senderName}</span>
                      <span className="text-[9px] text-neutral-500">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {msg.isEdited && <span className="text-[9px] text-neutral-500 italic">(edited)</span>}
                    </div>

                    {editingMsgId === msg.id ? (
                      <div className="p-2 rounded-xl bg-neutral-900 border border-white/20 space-y-2">
                        <input
                          type="text"
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="w-full bg-transparent text-xs text-white focus:outline-none"
                        />
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => setEditingMsgId(null)}
                            className="px-2 py-0.5 rounded text-[10px] bg-white/10 text-neutral-300"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveEdit(msg.id)}
                            className="px-2 py-0.5 rounded text-[10px] bg-gold-500 text-black font-bold"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`p-3 rounded-2xl text-xs leading-relaxed group relative ${
                          isMine
                            ? 'bg-gradient-to-r from-gold-500 to-amber-500 text-black font-medium rounded-tr-none shadow-md'
                            : 'bg-white/10 text-white rounded-tl-none border border-white/5'
                        }`}
                      >
                        <p>{msg.content}</p>

                        {/* Edit / Delete Hover controls */}
                        {canModerate && (
                          <div
                            className={`absolute top-1 ${
                              isMine ? '-left-12' : '-right-12'
                            } hidden group-hover:flex items-center gap-1 bg-neutral-900/90 p-1 rounded-lg border border-white/10 shadow`}
                          >
                            {isMine && (
                              <button
                                onClick={() => {
                                  setEditingMsgId(msg.id);
                                  setEditContent(msg.content);
                                }}
                                className="p-1 text-neutral-400 hover:text-white"
                                title="Edit message"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteMessage(msg.id)}
                              className="p-1 text-neutral-400 hover:text-red-400"
                              title="Delete message"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Message Input Box */}
        <form onSubmit={handleSend} className="p-3 border-t border-white/10 bg-neutral-950/60 flex items-center gap-2">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder={`Message ${activeChatMeta.title}...`}
            className="flex-1 px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs placeholder:text-neutral-500 focus:border-gold-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!messageInput.trim()}
            className="p-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 disabled:opacity-40 text-black font-bold transition flex items-center justify-center shadow-lg shadow-gold-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* CREATE CUSTOM GROUP CHAT MODAL */}
      {showCreateGroupModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl border border-white/20 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-gold-400" /> Create Custom Group Chat
              </h3>
              <button onClick={() => setShowCreateGroupModal(false)} className="text-neutral-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-neutral-300 mb-1">Group Name</label>
                <input
                  type="text"
                  required
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="e.g. Divine Nine Stroll Team or Pre-Med Study Group"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1">Description (Optional)</label>
                <input
                  type="text"
                  value={newGroupDesc}
                  onChange={(e) => setNewGroupDesc(e.target.value)}
                  placeholder="e.g. Planning rehearsals and study schedules"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1">
                  Add Members ({selectedUserIds.length} selected)
                </label>
                <div className="max-h-40 overflow-y-auto space-y-1 p-2 rounded-xl bg-neutral-900 border border-white/10">
                  {directMessageUsers.length === 0 ? (
                    <p className="text-[11px] text-neutral-500 italic p-1">No other registered users available.</p>
                  ) : (
                    directMessageUsers.map((u) => {
                      const isSelected = selectedUserIds.includes(u.id);
                      return (
                        <button
                          type="button"
                          key={u.id}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedUserIds(selectedUserIds.filter((id) => id !== u.id));
                            } else {
                              setSelectedUserIds([...selectedUserIds, u.id]);
                            }
                          }}
                          className={`w-full p-2 rounded-lg text-left text-xs flex items-center justify-between transition ${
                            isSelected ? 'bg-gold-500/20 text-gold-300 font-semibold' : 'hover:bg-white/5 text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <img src={u.avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                            <span>{u.name}</span>
                          </div>
                          {isSelected && <span className="text-[10px] text-gold-400">✓ Added</span>}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateGroupModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-bold transition shadow-lg shadow-gold-500/20"
                >
                  Create Group Chat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-white">Loading messaging channels...</div>}>
      <MessagesContent />
    </Suspense>
  );
}
