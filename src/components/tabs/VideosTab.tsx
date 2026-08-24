'use client';

import React, { useState } from 'react';
import { Organization, VideoItem } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Video, Play, Plus, Trash2, X, Film, ExternalLink } from 'lucide-react';
import AddVideoModal from '../modals/AddVideoModal';

interface VideosTabProps {
  org: Organization;
}

export default function VideosTab({ org }: VideosTabProps) {
  const { currentUser } = useAuth();
  const { deleteVideo } = useData();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  const isMember = currentUser ? org.members.some((m) => m.userId === currentUser.id) : false;
  const isPrimaryAdmin = currentUser ? org.claimedByUserId === currentUser.id : false;
  const isSuperAdmin = currentUser?.role === 'super_admin';
  const canUpload = isMember || isPrimaryAdmin || isSuperAdmin;

  // Helper to extract YouTube embed URL
  const getEmbedUrl = (video: VideoItem) => {
    if (video.provider === 'youtube') {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = video.url.match(regExp);
      const videoId = match && match[2].length === 11 ? match[2] : null;
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      }
    } else if (video.provider === 'vimeo') {
      const regExp = /vimeo\.com\/(\d+)/;
      const match = video.url.match(regExp);
      if (match && match[1]) {
        return `https://player.vimeo.com/video/${match[1]}?autoplay=1`;
      }
    }
    return video.url;
  };

  return (
    <div className="space-y-6">
      {/* Header & Add Video Button */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Film className="w-5 h-5 text-gold-400" /> Video Highlights & Recaps
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            {org.videos.length} stroll presentations, step show championships, and member spotlight videos
          </p>
        </div>

        {canUpload && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-gold-500 hover:bg-gold-400 text-black shadow-lg shadow-gold-500/20 transition"
          >
            <Plus className="w-4 h-4" /> Add Video
          </button>
        )}
      </div>

      {org.videos.length === 0 ? (
        <div className="p-12 text-center glass-card rounded-2xl">
          <Film className="w-12 h-12 text-neutral-500 mx-auto mb-3" />
          <h4 className="text-base font-semibold text-white">No Videos Added Yet</h4>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto mt-1 mb-4">
            Embed YouTube, Vimeo, or direct video clips of stroll routines, step performances, and community highlights!
          </p>
          {canUpload && (
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gold-500 text-black hover:bg-gold-400 transition"
            >
              <Plus className="w-3.5 h-3.5" /> Post First Video
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {org.videos.map((video) => {
            const canDelete =
              isPrimaryAdmin ||
              isSuperAdmin ||
              (currentUser && video.uploadedBy === currentUser.name);

            return (
              <div
                key={video.id}
                className="group glass-card rounded-2xl overflow-hidden cursor-pointer flex flex-col border border-white/5 hover:border-gold-500/40 transition duration-300 relative"
                onClick={() => setSelectedVideo(video)}
              >
                {/* Thumbnail with Play Icon overlay */}
                <div className="aspect-video w-full overflow-hidden bg-neutral-900 relative">
                  <img
                    src={
                      video.thumbnailUrl ||
                      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80'
                    }
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full gold-gradient-bg flex items-center justify-center text-black shadow-xl group-hover:scale-110 transition">
                      <Play className="w-6 h-6 fill-black ml-1" />
                    </div>
                  </div>

                  {canDelete && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteVideo(org.id, video.id);
                      }}
                      className="absolute top-2.5 right-2.5 p-2 rounded-lg bg-black/70 text-neutral-400 hover:text-red-400 hover:bg-black/90 transition backdrop-blur-md opacity-0 group-hover:opacity-100"
                      title="Delete Video"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <span className="absolute bottom-2.5 left-2.5 bg-black/80 text-white text-[10px] font-semibold uppercase px-2 py-0.5 rounded backdrop-blur-md">
                    {video.provider}
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-white text-sm line-clamp-1 group-hover:text-gold-400 transition">
                      {video.title}
                    </h4>
                    {video.description && (
                      <p className="text-xs text-neutral-300 mt-1 line-clamp-2">{video.description}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-neutral-400 mt-3 pt-2 border-t border-white/5">
                    <span>Uploaded by {video.uploadedBy}</span>
                    <span>{new Date(video.uploadedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Video Player Lightbox Pop-up Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="relative max-w-4xl w-full flex flex-col glass-panel rounded-2xl overflow-hidden border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 bg-neutral-950/80 border-b border-white/10">
              <h3 className="font-bold text-base text-white truncate pr-4">{selectedVideo.title}</h3>
              <button
                onClick={() => setSelectedVideo(null)}
                className="p-1.5 rounded-full bg-white/10 text-neutral-300 hover:text-white hover:bg-white/20 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-video w-full bg-black">
              {selectedVideo.provider === 'youtube' || selectedVideo.provider === 'vimeo' ? (
                <iframe
                  src={getEmbedUrl(selectedVideo)}
                  title={selectedVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={selectedVideo.url}
                  controls
                  autoPlay
                  className="w-full h-full"
                >
                  Your browser does not support HTML5 video.
                </video>
              )}
            </div>

            <div className="p-4 bg-neutral-950/90 border-t border-white/10">
              <p className="text-sm text-neutral-300">{selectedVideo.description}</p>
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5 text-xs text-neutral-400">
                <span>Uploaded by <strong className="text-white">{selectedVideo.uploadedBy}</strong></span>
                <a
                  href={selectedVideo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold-400 hover:underline flex items-center gap-1 font-medium"
                >
                  Original Link <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Video Modal */}
      {showAddModal && (
        <AddVideoModal orgId={org.id} onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
}
