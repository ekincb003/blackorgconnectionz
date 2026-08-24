'use client';

import React, { useState } from 'react';
import { Organization, PhotoItem } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Image, Plus, Trash2, X, ZoomIn, Calendar, User } from 'lucide-react';
import AddPhotoModal from '../modals/AddPhotoModal';
import ImageWithFallback from '../ImageWithFallback';

interface PhotosTabProps {
  org: Organization;
}

export default function PhotosTab({ org }: PhotosTabProps) {
  const { currentUser } = useAuth();
  const { deletePhoto } = useData();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);

  const isMember = currentUser ? org.members.some((m) => m.userId === currentUser.id) : false;
  const isPrimaryAdmin = currentUser ? org.claimedByUserId === currentUser.id : false;
  const isSuperAdmin = currentUser?.role === 'super_admin';
  const canUpload = isMember || isPrimaryAdmin || isSuperAdmin;

  return (
    <div className="space-y-6">
      {/* Header & Upload Button */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Image className="w-5 h-5 text-gold-400" /> Photo Gallery
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            {org.photos.length} captured moments, events, and step shows
          </p>
        </div>

        {canUpload && (
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-gold-500 hover:bg-gold-400 text-black shadow-lg shadow-gold-500/20 transition"
          >
            <Plus className="w-4 h-4" /> Add Photo
          </button>
        )}
      </div>

      {org.photos.length === 0 ? (
        <div className="p-12 text-center glass-card rounded-2xl">
          <Image className="w-12 h-12 text-neutral-500 mx-auto mb-3" />
          <h4 className="text-base font-semibold text-white">No Photos Uploaded Yet</h4>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto mt-1 mb-4">
            Share chapter photos, community service pictures, yard shows, and galas with the campus!
          </p>
          {canUpload && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gold-500 text-black hover:bg-gold-400 transition"
            >
              <Plus className="w-3.5 h-3.5" /> Upload First Photo
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {org.photos.map((photo) => {
            const canDelete =
              isPrimaryAdmin ||
              isSuperAdmin ||
              (currentUser && photo.uploadedBy === currentUser.name);

            return (
              <div
                key={photo.id}
                className="group relative glass-card rounded-2xl overflow-hidden cursor-pointer flex flex-col border border-white/5 hover:border-gold-500/40 transition duration-300"
                onClick={() => setSelectedPhoto(photo)}
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-neutral-900 relative">
                  <ImageWithFallback
                    src={photo.url}
                    alt={photo.title}
                    fallbackType="banner"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <span className="p-2.5 rounded-full bg-black/70 text-gold-400 backdrop-blur-md">
                      <ZoomIn className="w-5 h-5" />
                    </span>
                  </div>

                  {canDelete && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePhoto(org.id, photo.id);
                      }}
                      className="absolute top-2.5 right-2.5 p-2 rounded-lg bg-black/70 text-neutral-400 hover:text-red-400 hover:bg-black/90 transition backdrop-blur-md opacity-0 group-hover:opacity-100"
                      title="Delete Photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-semibold text-white text-sm line-clamp-1">{photo.title}</h4>
                    {photo.caption && (
                      <p className="text-xs text-neutral-300 mt-1 line-clamp-2">{photo.caption}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-neutral-400 mt-3 pt-2 border-t border-white/5">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-gold-400" /> {photo.uploadedBy}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-neutral-500" />
                      {new Date(photo.uploadedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox Full-Size Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] flex flex-col glass-panel rounded-2xl overflow-hidden border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex-1 overflow-hidden flex items-center justify-center bg-black/60 p-2 min-h-[300px]">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                className="max-h-[70vh] w-auto max-w-full object-contain rounded-lg"
              />
            </div>

            <div className="p-5 bg-neutral-950/90 border-t border-white/10">
              <h3 className="text-lg font-bold text-white">{selectedPhoto.title}</h3>
              {selectedPhoto.caption && (
                <p className="text-sm text-neutral-300 mt-1">{selectedPhoto.caption}</p>
              )}
              <div className="flex items-center gap-4 text-xs text-neutral-400 mt-3">
                <span>Uploaded by: <strong className="text-white">{selectedPhoto.uploadedBy}</strong></span>
                <span>Date: {new Date(selectedPhoto.uploadedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Photo Modal */}
      {showUploadModal && (
        <AddPhotoModal orgId={org.id} onClose={() => setShowUploadModal(false)} />
      )}
    </div>
  );
}
