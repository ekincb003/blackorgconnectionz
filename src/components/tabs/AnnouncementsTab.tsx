'use client';

import React, { useState } from 'react';
import { Organization, Announcement } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  Sparkles,
  Pin,
  Heart,
  MessageCircle,
  Share2,
  Trash2,
  Send,
  CornerDownRight,
  Image as ImageIcon,
  Plus,
  Crown,
  Award
} from 'lucide-react';
import ImageWithFallback from '../ImageWithFallback';
import ImageUploadButton from '../ImageUploadButton';

interface AnnouncementsTabProps {
  org: Organization;
}

export default function AnnouncementsTab({ org }: AnnouncementsTabProps) {
  const { currentUser, getUserById } = useAuth();
  const {
    createAnnouncement,
    toggleAnnouncementLike,
    addAnnouncementComment,
    deleteAnnouncement
  } = useData();

  // New announcement form state
  const [showPostComposer, setShowPostComposer] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isPinned, setIsPinned] = useState(false);

  // Active comment input states
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});
  const [replyingTo, setReplyingTo] = useState<{ [key: string]: string | null }>({});

  const isPrimaryAdmin = currentUser ? org.claimedByUserId === currentUser.id : false;
  const isOfficer = currentUser
    ? org.members.some((m) => m.userId === currentUser.id && (m.isOfficer || m.isPrimaryAdmin))
    : false;
  const isSuperAdmin = currentUser?.role === 'super_admin';
  const canPost = isPrimaryAdmin || isOfficer || isSuperAdmin;

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    createAnnouncement(org.id, {
      title: newTitle.trim(),
      content: newContent.trim(),
      pinned: isPinned,
      imageUrl: newImageUrl.trim() || undefined
    });

    setNewTitle('');
    setNewContent('');
    setNewImageUrl('');
    setIsPinned(false);
    setShowPostComposer(false);
  };

  const handleAddComment = (announcementId: string, replyToCommentId?: string) => {
    const inputKey = replyToCommentId ? `${announcementId}_${replyToCommentId}` : announcementId;
    const content = commentInputs[inputKey];
    if (!content || !content.trim()) return;

    addAnnouncementComment(org.id, announcementId, content.trim(), replyToCommentId);

    setCommentInputs((prev) => ({ ...prev, [inputKey]: '' }));
    if (replyToCommentId) {
      setReplyingTo((prev) => ({ ...prev, [announcementId]: null }));
    }
  };

  // Sort announcements: pinned first, then by date descending
  const sortedAnnouncements = [...org.announcements].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header & Post Creator Trigger */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-gold-400" /> Official Announcements
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Official chapter alerts, scholarship news, callouts, and press releases
          </p>
        </div>

        {canPost && !showPostComposer && (
          <button
            onClick={() => setShowPostComposer(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-gold-500 hover:bg-gold-400 text-black shadow-lg shadow-gold-500/20 transition"
          >
            <Plus className="w-4 h-4" /> Post Announcement
          </button>
        )}
      </div>

      {/* New Announcement Composer Card */}
      {showPostComposer && (
        <div className="glass-panel rounded-2xl p-5 border border-gold-500/30 shadow-2xl relative animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
            <h4 className="font-bold text-sm text-gold-400 flex items-center gap-1.5">
              <Crown className="w-4 h-4" /> Compose Official Announcement
            </h4>
            <button
              onClick={() => setShowPostComposer(false)}
              className="text-xs text-neutral-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleCreateAnnouncement} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Announcement Headline / Title *
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Annual Black & Gold Gala - Date Announced!"
                required
                className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-sm focus:border-gold-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Content / Message Body *
              </label>
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                rows={4}
                placeholder="Write full announcement details, instructions, or ticket information..."
                required
                className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-sm focus:border-gold-500 focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-neutral-300">
                  Attached Image / Flyer (Optional)
                </label>
                <ImageUploadButton
                  label="Upload Photo/Flyer"
                  imageType="general"
                  onImageUploaded={(dataUrl) => setNewImageUrl(dataUrl)}
                />
              </div>
              <input
                type="text"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="https://... or upload flyer photo"
                className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-sm focus:border-gold-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300">
                <input
                  type="checkbox"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="rounded bg-neutral-800 border-white/20 text-gold-500 focus:ring-0"
                />
                <Pin className="w-3.5 h-3.5 text-gold-400" /> Pin this announcement to the top
              </label>

              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-bold text-xs shadow-lg transition flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" /> Publish Announcement
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Announcements Feed */}
      {sortedAnnouncements.length === 0 ? (
        <div className="p-12 text-center glass-card rounded-2xl">
          <Sparkles className="w-12 h-12 text-neutral-500 mx-auto mb-3" />
          <h4 className="text-base font-semibold text-white">No Announcements Yet</h4>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto mt-1">
            When chapter officers post official updates, scholarships, and events, they will appear here!
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {sortedAnnouncements.map((announcement) => {
            const isLiked = currentUser ? announcement.likes.includes(currentUser.id) : false;
            const canDelete =
              isPrimaryAdmin ||
              isSuperAdmin ||
              (currentUser && announcement.authorId === currentUser.id);

            const liveAuthor = getUserById(announcement.authorId);
            const authorName = liveAuthor?.name || announcement.authorName;
            const authorAvatar = liveAuthor?.avatar || announcement.authorAvatar;

            return (
              <div
                key={announcement.id}
                className={`glass-card rounded-2xl p-5 border transition ${
                  announcement.pinned
                    ? 'border-gold-500/40 bg-gold-500/[0.03]'
                    : 'border-white/5'
                }`}
              >
                {/* Author Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <ImageWithFallback
                      src={authorAvatar}
                      alt={authorName}
                      fallbackType="avatar"
                      fallbackText={authorName.split(' ').map((n) => n[0]).join('')}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-white/10"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{authorName}</span>
                        <span className="text-[11px] bg-gold-500/20 text-gold-300 font-semibold px-2 py-0.2 rounded-full border border-gold-500/30">
                          {announcement.authorPosition || 'Officer'}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400">
                        {new Date(announcement.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}{' '}
                        at{' '}
                        {new Date(announcement.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {announcement.pinned && (
                      <span className="flex items-center gap-1 bg-gold-500/20 text-gold-300 border border-gold-500/40 text-[11px] font-bold px-2 py-0.5 rounded-full">
                        <Pin className="w-3 h-3 text-gold-400 fill-gold-400" /> Pinned
                      </span>
                    )}

                    {canDelete && (
                      <button
                        onClick={() => deleteAnnouncement(org.id, announcement.id)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-white/5 transition"
                        title="Delete Announcement"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Title & Body */}
                <h4 className="text-base font-bold text-white mb-2 leading-snug">
                  {announcement.title}
                </h4>
                <p className="text-xs sm:text-sm text-neutral-200 whitespace-pre-line leading-relaxed mb-4">
                  {announcement.content}
                </p>

                {/* Attached Image */}
                {announcement.imageUrl && (
                  <div className="rounded-xl overflow-hidden mb-4 border border-white/10 max-h-96 bg-black/40">
                    <ImageWithFallback
                      src={announcement.imageUrl}
                      alt={announcement.title}
                      fallbackType="banner"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                )}

                {/* Likes & Comments Count Bar */}
                <div className="flex items-center justify-between py-2 border-t border-b border-white/5 text-xs text-neutral-400 my-3">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
                    {announcement.likes.length} {announcement.likes.length === 1 ? 'like' : 'likes'}
                  </span>
                  <span>
                    {announcement.comments.length} {announcement.comments.length === 1 ? 'comment' : 'comments'}
                  </span>
                </div>

                {/* Action Buttons (Like / Comment) */}
                <div className="flex items-center gap-2 mb-3">
                  <button
                    onClick={() => toggleAnnouncementLike(org.id, announcement.id)}
                    disabled={!currentUser}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                      isLiked
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-white/5 hover:bg-white/10 text-neutral-300'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-400' : ''}`} />
                    {isLiked ? 'Liked' : 'Like'}
                  </button>

                  <button
                    onClick={() => {
                      const input = document.getElementById(`comment-input-${announcement.id}`);
                      if (input) input.focus();
                    }}
                    className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-neutral-300 flex items-center justify-center gap-1.5 transition"
                  >
                    <MessageCircle className="w-4 h-4" /> Comment
                  </button>
                </div>

                {/* Comments Section */}
                <div className="space-y-2.5 pt-2">
                  {announcement.comments.map((comment) => (
                    <div key={comment.id} className="space-y-2">
                      <div className="flex items-start gap-2.5 bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
                        <img
                          src={comment.authorAvatar}
                          alt={comment.authorName}
                          className="w-7 h-7 rounded-full object-cover ring-1 ring-white/10 shrink-0 mt-0.5"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-white text-xs">
                              {comment.authorName}
                            </span>
                            <span className="text-[10px] text-neutral-500">
                              {new Date(comment.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-300 mt-0.5">{comment.content}</p>

                          {/* Reply Button */}
                          {currentUser && (
                            <button
                              onClick={() =>
                                setReplyingTo((prev) => ({
                                  ...prev,
                                  [announcement.id]:
                                    prev[announcement.id] === comment.id ? null : comment.id
                                }))
                              }
                              className="text-[11px] text-gold-400 hover:underline mt-1 font-medium flex items-center gap-1"
                            >
                              <CornerDownRight className="w-3 h-3" /> Reply
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Nested Replies */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="pl-6 space-y-1.5 border-l-2 border-white/10 ml-3">
                          {comment.replies.map((reply) => (
                            <div
                              key={reply.id}
                              className="flex items-start gap-2 bg-white/[0.015] p-2 rounded-lg border border-white/5"
                            >
                              <img
                                src={reply.authorAvatar}
                                alt={reply.authorName}
                                className="w-6 h-6 rounded-full object-cover shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <span className="font-semibold text-white text-xs">
                                    {reply.authorName}
                                  </span>
                                  <span className="text-[10px] text-neutral-500">
                                    {new Date(reply.createdAt).toLocaleTimeString([], {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                </div>
                                <p className="text-xs text-neutral-300 mt-0.5">{reply.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Nested Reply Input */}
                      {replyingTo[announcement.id] === comment.id && currentUser && (
                        <div className="pl-6 ml-3 flex items-center gap-2">
                          <input
                            type="text"
                            placeholder={`Reply to ${comment.authorName}...`}
                            value={commentInputs[`${announcement.id}_${comment.id}`] || ''}
                            onChange={(e) =>
                              setCommentInputs((prev) => ({
                                ...prev,
                                [`${announcement.id}_${comment.id}`]: e.target.value
                              }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleAddComment(announcement.id, comment.id);
                              }
                            }}
                            className="flex-1 px-3 py-1.5 rounded-lg bg-neutral-900 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none"
                          />
                          <button
                            onClick={() => handleAddComment(announcement.id, comment.id)}
                            className="p-1.5 rounded-lg bg-gold-500 text-black font-semibold hover:bg-gold-400 transition"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Main Comment Input */}
                  {currentUser && (
                    <div className="flex items-center gap-2 pt-2">
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-white/10"
                      />
                      <input
                        id={`comment-input-${announcement.id}`}
                        type="text"
                        placeholder="Write a comment..."
                        value={commentInputs[announcement.id] || ''}
                        onChange={(e) =>
                          setCommentInputs((prev) => ({
                            ...prev,
                            [announcement.id]: e.target.value
                          }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleAddComment(announcement.id);
                          }
                        }}
                        className="flex-1 px-3.5 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none"
                      />
                      <button
                        onClick={() => handleAddComment(announcement.id)}
                        className="px-3 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-bold text-xs transition flex items-center gap-1"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
