'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  Megaphone,
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
  Sparkles,
  Search,
  Filter,
  Eye
} from 'lucide-react';
import { Announcement } from '../../types';
import ImageWithFallback from '../../components/ImageWithFallback';
import ImageUploadButton from '../../components/ImageUploadButton';

export default function CampusAnnouncementsPage() {
  const { currentUser, getUserById } = useAuth();
  const {
    orgs,
    createAnnouncement,
    toggleAnnouncementLike,
    addAnnouncementComment,
    deleteAnnouncementComment,
    deleteAnnouncement
  } = useData();

  const [selectedOrgFilter, setSelectedOrgFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPostComposer, setShowPostComposer] = useState(false);
  const [selectedFlyer, setSelectedFlyer] = useState<{ url: string; title: string } | null>(null);

  // New announcement form state
  const [selectedOrgId, setSelectedOrgId] = useState(orgs.length > 0 ? orgs[0].id : '');
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isPinned, setIsPinned] = useState(false);

  // Active comment input states
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});
  const [replyingTo, setReplyingTo] = useState<{ [key: string]: string | null }>({});

  // Collect all announcements across all orgs, sorted pinned first then by date
  const allAnnouncements = useMemo(() => {
    const list: (Announcement & { hostOrgName?: string; hostOrgLogo?: string })[] = [];
    orgs.forEach((org) => {
      org.announcements.forEach((anc) => {
        list.push({
          ...anc,
          hostOrgName: anc.orgName || org.shortName,
          hostOrgLogo: org.logo
        });
      });
    });

    return list.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [orgs]);

  // Filtered Announcements
  const filteredAnnouncements = useMemo(() => {
    return allAnnouncements.filter((anc) => {
      if (selectedOrgFilter !== 'all' && anc.orgId !== selectedOrgFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = anc.title.toLowerCase().includes(q);
        const matchContent = anc.content.toLowerCase().includes(q);
        const matchAuthor = anc.authorName?.toLowerCase().includes(q);
        const matchOrg = anc.hostOrgName?.toLowerCase().includes(q);
        if (!matchTitle && !matchContent && !matchAuthor && !matchOrg) return false;
      }
      return true;
    });
  }, [allAnnouncements, selectedOrgFilter, searchQuery]);

  const canPost = !!currentUser;

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim() || !selectedOrgId) return;

    createAnnouncement(selectedOrgId, {
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

  const handleAddComment = (orgId: string, announcementId: string, replyToCommentId?: string) => {
    const inputKey = replyToCommentId ? `${announcementId}_${replyToCommentId}` : announcementId;
    const content = commentInputs[inputKey];
    if (!content || !content.trim()) return;

    addAnnouncementComment(orgId, announcementId, content.trim(), replyToCommentId);

    setCommentInputs((prev) => ({ ...prev, [inputKey]: '' }));
    if (replyToCommentId) {
      setReplyingTo((prev) => ({ ...prev, [announcementId]: null }));
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Hub Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 relative overflow-hidden shadow-2xl">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-gold-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Megaphone className="w-4 h-4" /> Global Announcements Feed
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Official Campus <span className="gold-gradient-text">Bulletins & Alerts</span>
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl mt-1">
              Stay up-to-date with official chapter alerts, scholarship news, callouts, and press releases across all organizations.
            </p>
          </div>

          {canPost && !showPostComposer && (
            <button
              onClick={() => setShowPostComposer(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-extrabold text-xs shadow-lg shadow-gold-500/25 transition shrink-0"
            >
              <Plus className="w-4 h-4" /> Post Announcement
            </button>
          )}
        </div>
      </div>

      {/* New Announcement Composer */}
      {showPostComposer && (
        <div className="glass-panel p-6 rounded-3xl border border-gold-500/30 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-gold-400" /> New Official Announcement
            </h3>
            <button
              onClick={() => setShowPostComposer(false)}
              className="text-xs text-neutral-400 hover:text-white"
            >
              Cancel ✕
            </button>
          </div>

          <form onSubmit={handleCreateAnnouncement} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-neutral-300 mb-1">Publishing Organization *</label>
              <select
                value={selectedOrgId}
                onChange={(e) => setSelectedOrgId(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none"
              >
                {orgs.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name} ({o.shortName})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-neutral-300 mb-1">Title *</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Spring 2026 Scholarship Application Now Open!"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-300 mb-1">Content & Message *</label>
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                rows={4}
                placeholder="Write full announcement details, instructions, or ticket information..."
                required
                className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-neutral-300">
                  Attached Flyer / Graphic (Optional)
                </label>
                <ImageUploadButton
                  label="Upload Photo/Flyer"
                  imageType="banner"
                  onImageUploaded={(dataUrl) => setNewImageUrl(dataUrl)}
                />
              </div>
              <input
                type="text"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="https://... or upload photo"
                className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <label className="flex items-center gap-2 cursor-pointer text-neutral-300">
                <input
                  type="checkbox"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="rounded bg-neutral-800 border-white/20 text-gold-500 focus:ring-0"
                />
                <span>Pin to top of feed</span>
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

      {/* Filter & Search Bar */}
      <div className="glass-card p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bulletins by title, content, or org..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs placeholder:text-neutral-500 focus:border-gold-500 focus:outline-none"
          />
        </div>

        <select
          value={selectedOrgFilter}
          onChange={(e) => setSelectedOrgFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none w-full sm:w-auto"
        >
          <option value="all">All Organizations ({allAnnouncements.length})</option>
          {orgs.map((o) => (
            <option key={o.id} value={o.id}>
              {o.shortName}
            </option>
          ))}
        </select>
      </div>

      {/* Announcements Feed */}
      {filteredAnnouncements.length === 0 ? (
        <div className="p-12 text-center glass-card rounded-3xl space-y-3">
          <Megaphone className="w-12 h-12 text-neutral-600 mx-auto" />
          <h4 className="text-base font-bold text-white">No Announcements Found</h4>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            No official bulletins match your filter. Check back soon for new chapter updates!
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredAnnouncements.map((announcement) => {
            const isLiked = currentUser ? announcement.likes.includes(currentUser.id) : false;
            const isSuperAdmin = currentUser?.role === 'super_admin';
            const isAuthor = currentUser && announcement.authorId === currentUser.id;
            const canDelete = isSuperAdmin || isAuthor;

            const liveAuthor = getUserById(announcement.authorId);
            const authorName = liveAuthor?.name || announcement.authorName;
            const authorAvatar = liveAuthor?.avatar || announcement.authorAvatar;

            return (
              <div
                key={announcement.id}
                className={`glass-card rounded-3xl p-6 border transition ${
                  announcement.pinned
                    ? 'border-gold-500/40 bg-gold-500/[0.03]'
                    : 'border-white/5'
                }`}
              >
                {/* Author & Host Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <ImageWithFallback
                      src={authorAvatar}
                      alt={authorName}
                      fallbackType="avatar"
                      fallbackText={authorName.split(' ').map((n) => n[0]).join('')}
                      className="w-11 h-11 rounded-2xl object-cover ring-2 ring-white/10"
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-white text-sm">{authorName}</span>
                        <Link
                          href={`/orgs/${announcement.orgId}`}
                          className="text-[11px] bg-gold-500/20 text-gold-300 font-bold px-2 py-0.2 rounded-full border border-gold-500/30 hover:underline"
                        >
                          {announcement.hostOrgName}
                        </Link>
                        {announcement.authorPosition && (
                          <span className="text-[10px] bg-white/10 text-neutral-300 px-2 py-0.2 rounded-full font-medium">
                            {announcement.authorPosition}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
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
                      <span className="flex items-center gap-1 bg-gold-500/20 text-gold-300 border border-gold-500/40 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                        <Pin className="w-3 h-3 text-gold-400 fill-gold-400" /> Pinned
                      </span>
                    )}

                    {canDelete && (
                      <button
                        onClick={() => deleteAnnouncement(announcement.orgId, announcement.id)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-white/5 transition"
                        title="Delete Announcement"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Title & Body */}
                <h3 className="text-lg font-bold text-white mb-2 leading-snug">
                  {announcement.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-200 whitespace-pre-line leading-relaxed mb-4">
                  {announcement.content}
                </p>

                {/* Attached Flyer Image */}
                {announcement.imageUrl && (
                  <div
                    className="rounded-2xl overflow-hidden mb-4 border border-white/10 max-h-96 bg-black/40 cursor-pointer relative group/flyer"
                    onClick={() => setSelectedFlyer({ url: announcement.imageUrl!, title: announcement.title })}
                  >
                    <ImageWithFallback
                      src={announcement.imageUrl}
                      alt={announcement.title}
                      fallbackType="banner"
                      className="w-full h-auto object-cover group-hover/flyer:scale-[1.01] transition"
                    />
                    <span className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/60 text-white backdrop-blur-md opacity-0 group-hover/flyer:opacity-100 transition">
                      <Eye className="w-3.5 h-3.5" /> View Full Flyer
                    </span>
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

                {/* Like & Share Action Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => toggleAnnouncementLike(announcement.orgId, announcement.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                      isLiked
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-red-400' : ''}`} />
                    {isLiked ? 'Liked' : 'Like'}
                  </button>
                </div>

                {/* Comments List */}
                {announcement.comments.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
                    {announcement.comments.map((comment) => (
                      <div key={comment.id} className="p-3 rounded-2xl bg-neutral-900/60 border border-white/5 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-xs">{comment.authorName}</span>
                          <span className="text-[10px] text-neutral-400">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-300">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Comment Input */}
                {currentUser && (
                  <div className="mt-4 flex items-center gap-2">
                    <input
                      type="text"
                      value={commentInputs[announcement.id] || ''}
                      onChange={(e) =>
                        setCommentInputs((prev) => ({ ...prev, [announcement.id]: e.target.value }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddComment(announcement.orgId, announcement.id);
                        }
                      }}
                      placeholder="Write a comment or question..."
                      className="flex-1 px-3.5 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none"
                    />
                    <button
                      onClick={() => handleAddComment(announcement.orgId, announcement.id)}
                      className="p-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-bold transition shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Flyer Modal */}
      {selectedFlyer && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedFlyer(null)}
        >
          <div
            className="relative max-w-2xl w-full glass-panel rounded-3xl overflow-hidden border border-white/20 p-2 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3 border-b border-white/10">
              <h4 className="font-bold text-white text-sm truncate">{selectedFlyer.title}</h4>
              <button
                onClick={() => setSelectedFlyer(null)}
                className="px-3 py-1 rounded-lg bg-white/10 text-white text-xs font-bold"
              >
                Close ✕
              </button>
            </div>
            <div className="p-2 flex items-center justify-center max-h-[75vh] overflow-hidden">
              <img
                src={selectedFlyer.url}
                alt={selectedFlyer.title}
                className="max-h-[70vh] w-auto object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
