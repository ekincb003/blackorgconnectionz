'use client';

import React, { useState } from 'react';
import { Organization, FeedPost } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  MessageSquare,
  Heart,
  MapPin,
  Clock,
  Award,
  Send,
  Plus,
  Trash2,
  Filter,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import ImageWithFallback from '../ImageWithFallback';
import ImageUploadButton from '../ImageUploadButton';

interface FeedTabProps {
  org: Organization;
}

export default function FeedTab({ org }: FeedTabProps) {
  const { currentUser, getUserById } = useAuth();
  const { createFeedPost, toggleFeedLike, addFeedComment, deleteFeedPost } = useData();

  // Filters: 'all' | 'general' | 'community_service'
  const [activeFilter, setActiveFilter] = useState<'all' | 'general' | 'community_service'>('all');
  const [showComposer, setShowComposer] = useState(false);

  // New post state
  const [postType, setPostType] = useState<'general' | 'community_service'>('general');
  const [content, setContent] = useState('');
  const [serviceHours, setServiceHours] = useState<number | ''>('');
  const [serviceDate, setServiceDate] = useState('');
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Comment input state
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});

  const isMember = currentUser ? org.members.some((m) => m.userId === currentUser.id) : false;
  const isPrimaryAdmin = currentUser ? org.claimedByUserId === currentUser.id : false;
  const isSuperAdmin = currentUser?.role === 'super_admin';
  const canPost = isMember || isPrimaryAdmin || isSuperAdmin;

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    createFeedPost(org.id, {
      type: postType,
      content: content.trim(),
      serviceHours: serviceHours !== '' ? Number(serviceHours) : undefined,
      serviceDate: serviceDate || undefined,
      location: location.trim() || undefined,
      imageUrl: imageUrl.trim() || undefined
    });

    setContent('');
    setServiceHours('');
    setServiceDate('');
    setLocation('');
    setImageUrl('');
    setShowComposer(false);
  };

  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;
    addFeedComment(org.id, postId, text.trim());
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
  };

  const filteredPosts = org.feed.filter((post) => {
    if (activeFilter === 'all') return true;
    return post.type === activeFilter;
  });

  const getGoogleMapsUrl = (loc: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc)}`;
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header, Filter Pills & Post Composer Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-gold-400" /> Member & Service Feed
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            General banter, brotherhood & sisterhood moments, and verified community service drives
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canPost && !showComposer && (
            <button
              onClick={() => setShowComposer(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-gold-500 hover:bg-gold-400 text-black shadow-lg shadow-gold-500/20 transition"
            >
              <Plus className="w-4 h-4" /> Share Update
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-neutral-900/60 p-1.5 rounded-xl border border-white/5 w-fit">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeFilter === 'all'
              ? 'bg-gold-500 text-black'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          All Activity ({org.feed.length})
        </button>

        <button
          onClick={() => setActiveFilter('general')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeFilter === 'general'
              ? 'bg-gold-500 text-black'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          💬 General Updates
        </button>

        <button
          onClick={() => setActiveFilter('community_service')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
            activeFilter === 'community_service'
              ? 'bg-emerald-500 text-black'
              : 'text-emerald-400 hover:text-white'
          }`}
        >
          <Award className="w-3.5 h-3.5" /> Community Service
        </button>
      </div>

      {/* Feed Post Composer */}
      {showComposer && (
        <div className="glass-panel rounded-2xl p-5 border border-gold-500/30 shadow-2xl relative animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
            <h4 className="font-bold text-sm text-gold-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Create Feed Post
            </h4>
            <button
              onClick={() => setShowComposer(false)}
              className="text-xs text-neutral-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleCreatePost} className="space-y-3.5">
            {/* Post Type Selector */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-neutral-300 font-semibold">Post Type:</span>
              <label className="flex items-center gap-1.5 text-xs text-neutral-200 cursor-pointer">
                <input
                  type="radio"
                  name="postType"
                  value="general"
                  checked={postType === 'general'}
                  onChange={() => setPostType('general')}
                  className="text-gold-500"
                />
                General Update
              </label>

              <label className="flex items-center gap-1.5 text-xs text-emerald-300 font-semibold cursor-pointer">
                <input
                  type="radio"
                  name="postType"
                  value="community_service"
                  checked={postType === 'community_service'}
                  onChange={() => setPostType('community_service')}
                  className="text-emerald-500"
                />
                🌱 Community Service
              </label>
            </div>

            {/* Post Content */}
            <div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
                placeholder={
                  postType === 'community_service'
                    ? 'Detail the community service project, volunteers involved, and impact...'
                    : 'What is happening with the chapter today?'
                }
                required
                className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-sm focus:border-gold-500 focus:outline-none"
              />
            </div>

            {/* Community Service specific metadata */}
            {postType === 'community_service' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <div>
                  <label className="block text-[11px] font-semibold text-emerald-300 mb-1">
                    Service Hours Completed
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 25"
                    value={serviceHours}
                    onChange={(e) => setServiceHours(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-white/10 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-emerald-300 mb-1">
                    Service Date
                  </label>
                  <input
                    type="date"
                    value={serviceDate}
                    onChange={(e) => setServiceDate(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-white/10 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-emerald-300 mb-1">
                    Location (Links to Maps)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. MLK Food Pantry"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-white/10 text-white text-xs"
                  />
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-neutral-300">
                  Attach Photo / Flyer (Optional)
                </label>
                <ImageUploadButton
                  label="Upload Photo"
                  imageType="general"
                  onImageUploaded={(dataUrl) => setImageUrl(dataUrl)}
                />
              </div>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://... or upload photo"
                className="w-full px-3 py-1.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-bold text-xs shadow-lg transition flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" /> Publish Post
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Feed List */}
      {filteredPosts.length === 0 ? (
        <div className="p-12 text-center glass-card rounded-2xl">
          <MessageSquare className="w-12 h-12 text-neutral-500 mx-auto mb-3" />
          <h4 className="text-base font-semibold text-white">No Posts in this Category</h4>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto mt-1">
            Share updates, volunteer hours, or thoughts with the chapter members!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => {
            const isLiked = currentUser ? post.likes.includes(currentUser.id) : false;
            const canDelete =
              isPrimaryAdmin || isSuperAdmin || (currentUser && post.authorId === currentUser.id);

            const liveAuthor = getUserById(post.authorId);
            const authorName = liveAuthor?.name || post.authorName;
            const authorAvatar = liveAuthor?.avatar || post.authorAvatar;

            return (
              <div
                key={post.id}
                className={`glass-card rounded-2xl p-5 border transition ${
                  post.type === 'community_service'
                    ? 'border-emerald-500/30 bg-emerald-500/[0.02]'
                    : 'border-white/5'
                }`}
              >
                {/* Author Info */}
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
                      <h4 className="font-bold text-white text-sm">{authorName}</h4>
                      <p className="text-[11px] text-neutral-400">
                        {new Date(post.createdAt).toLocaleDateString()} at{' '}
                        {new Date(post.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {post.type === 'community_service' ? (
                      <span className="flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                        <Award className="w-3.5 h-3.5" /> Community Service
                      </span>
                    ) : (
                      <span className="bg-white/10 text-neutral-300 text-[11px] font-medium px-2 py-0.5 rounded-full">
                        General
                      </span>
                    )}

                    {canDelete && (
                      <button
                        onClick={() => deleteFeedPost(org.id, post.id)}
                        className="p-1 text-neutral-400 hover:text-red-400 transition"
                        title="Delete Post"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Content */}
                <p className="text-xs sm:text-sm text-neutral-200 whitespace-pre-line leading-relaxed mb-3">
                  {post.content}
                </p>

                {/* Community Service Detail Highlight Card */}
                {post.type === 'community_service' && (post.serviceHours || post.location || post.serviceDate) && (
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/20 flex flex-wrap items-center gap-4 text-xs text-neutral-200 mb-3">
                    {post.serviceHours && (
                      <div className="flex items-center gap-1.5 text-emerald-300 font-semibold">
                        <Clock className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{post.serviceHours} Service Hours</span>
                      </div>
                    )}

                    {post.location && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                        <a
                          href={getGoogleMapsUrl(post.location)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gold-400 hover:underline flex items-center gap-1 font-medium"
                        >
                          {post.location} <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}

                    {post.serviceDate && (
                      <div className="text-neutral-400">
                        Date: {new Date(post.serviceDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                )}

                {/* Attached Image */}
                {post.imageUrl && (
                  <div className="rounded-xl overflow-hidden mb-3 border border-white/10 max-h-80">
                    <ImageWithFallback
                      src={post.imageUrl}
                      alt="Post Attachment"
                      fallbackType="banner"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Likes & Comments Count */}
                <div className="flex items-center justify-between py-1.5 border-t border-b border-white/5 text-xs text-neutral-400 my-2">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
                    {post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}
                  </span>
                  <span>
                    {post.comments.length} {post.comments.length === 1 ? 'comment' : 'comments'}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 mb-3">
                  <button
                    onClick={() => toggleFeedLike(org.id, post.id)}
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
                </div>

                {/* Comments List */}
                <div className="space-y-2 pt-1">
                  {post.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="flex items-start gap-2 bg-white/[0.02] p-2 rounded-lg border border-white/5 text-xs"
                    >
                      <img
                        src={comment.authorAvatar}
                        alt={comment.authorName}
                        className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="font-semibold text-white">{comment.authorName}</span>
                        <p className="text-neutral-300 mt-0.5">{comment.content}</p>
                      </div>
                    </div>
                  ))}

                  {/* Comment Input */}
                  {currentUser && (
                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="text"
                        placeholder="Write a comment..."
                        value={commentInputs[post.id] || ''}
                        onChange={(e) =>
                          setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleAddComment(post.id);
                          }
                        }}
                        className="flex-1 px-3 py-1.5 rounded-lg bg-neutral-900 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none"
                      />
                      <button
                        onClick={() => handleAddComment(post.id)}
                        className="p-1.5 rounded-lg bg-gold-500 hover:bg-gold-400 text-black font-semibold transition"
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
