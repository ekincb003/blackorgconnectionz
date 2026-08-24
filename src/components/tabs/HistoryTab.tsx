'use client';

import React, { useState } from 'react';
import { Organization } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { BookOpen, Award, Sparkles, Calendar, MapPin, Edit3, Image as ImageIcon } from 'lucide-react';
import EditHistoryModal from '../modals/EditHistoryModal';

interface HistoryTabProps {
  org: Organization;
}

export default function HistoryTab({ org }: HistoryTabProps) {
  const { currentUser } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);

  const isPrimaryAdmin = currentUser ? org.claimedByUserId === currentUser.id : false;
  const isSuperAdmin = currentUser?.role === 'super_admin';
  const canEdit = isPrimaryAdmin || isSuperAdmin;

  const { history } = org;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header & Edit Button */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-gold-400" /> Legacy, Founding & Significance
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Historical origins, cardinal principles, founders, and on-campus heritage
          </p>
        </div>

        {canEdit && (
          <button
            onClick={() => setShowEditModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/10 transition"
          >
            <Edit3 className="w-3.5 h-3.5 text-gold-400" /> Edit History
          </button>
        )}
      </div>

      {/* Quick Facts Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="glass-card p-4 rounded-xl border border-white/5">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
            Founded
          </span>
          <p className="text-sm font-bold text-white flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-gold-400" /> {history.foundingDate}
          </p>
          <p className="text-[11px] text-neutral-400 mt-1 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-neutral-500" /> {history.foundingLocation}
          </p>
        </div>

        <div className="glass-card p-4 rounded-xl border border-white/5">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
            Motto
          </span>
          <p className="text-xs font-semibold text-gold-400 italic">
            "{history.motto}"
          </p>
        </div>

        <div className="glass-card p-4 rounded-xl border border-white/5">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
            Official Colors
          </span>
          <div className="flex flex-wrap items-center gap-1.5 mt-1">
            {history.colors.map((color, i) => (
              <span
                key={i}
                className="text-xs font-medium px-2 py-0.5 rounded-md bg-white/10 text-white border border-white/10"
              >
                {color}
              </span>
            ))}
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl border border-white/5">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
            Symbols & Flower
          </span>
          <p className="text-xs text-white">
            {history.symbol || 'Not Specified'}
          </p>
          {history.flower && (
            <p className="text-[11px] text-neutral-400 mt-0.5">Flower: {history.flower}</p>
          )}
        </div>
      </div>

      {/* Cardinal Principles */}
      {history.principles && history.principles.length > 0 && (
        <div className="glass-panel p-5 rounded-2xl border border-gold-500/20">
          <h4 className="text-xs font-bold text-gold-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Award className="w-4 h-4" /> Cardinal Principles
          </h4>
          <div className="flex flex-wrap gap-2">
            {history.principles.map((principle, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl bg-gold-500/10 text-gold-300 border border-gold-500/30 text-xs font-semibold flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3 text-gold-400" /> {principle}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Founding Story */}
      <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-4">
        <h4 className="text-lg font-bold text-white flex items-center gap-2">
          🏛️ Founding Story
        </h4>
        <p className="text-sm text-neutral-200 leading-relaxed whitespace-pre-line">
          {history.foundingStory}
        </p>
      </div>

      {/* Historical Significance */}
      <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-4">
        <h4 className="text-lg font-bold text-white flex items-center gap-2">
          ✊ Historical Significance & Impact
        </h4>
        <p className="text-sm text-neutral-200 leading-relaxed whitespace-pre-line">
          {history.historicalSignificance}
        </p>
      </div>

      {/* On-Campus Chapter Heritage */}
      <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-4">
        <h4 className="text-lg font-bold text-white flex items-center gap-2">
          🎓 On-Campus Chapter Legacy
        </h4>
        <p className="text-sm text-neutral-200 leading-relaxed whitespace-pre-line">
          {history.campusChapterStory}
        </p>
      </div>

      {/* Founders Section */}
      {history.founders && history.founders.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-bold text-white flex items-center gap-2">
            👑 Founders & Revered Pioneers
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {history.founders.map((founder, idx) => (
              <div
                key={idx}
                className="glass-card p-4 rounded-xl border border-white/5 hover:border-gold-500/30 transition"
              >
                <div className="flex items-center gap-2 mb-1">
                  <h5 className="font-bold text-white text-sm">{founder.name}</h5>
                  {founder.title && (
                    <span className="text-[10px] bg-gold-500/20 text-gold-300 font-semibold px-2 py-0.2 rounded-full">
                      {founder.title}
                    </span>
                  )}
                </div>
                {founder.bio && <p className="text-xs text-neutral-300 mt-1">{founder.bio}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Archival Photos */}
      {history.historicPhotos && history.historicPhotos.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-bold text-white flex items-center gap-2">
            📜 Archival Photos & Records
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {history.historicPhotos.map((item, idx) => (
              <div
                key={idx}
                className="glass-card rounded-xl overflow-hidden border border-white/5"
              >
                <img
                  src={item.url}
                  alt={item.caption}
                  className="w-full h-48 object-cover sepia-[0.25]"
                />
                <div className="p-3">
                  <p className="text-xs text-neutral-300 italic">{item.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History Posts Feed */}
      {history.historyPosts && history.historyPosts.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-bold text-white flex items-center gap-2">
            📖 Documented History Posts
          </h4>
          <div className="space-y-4">
            {history.historyPosts.map((post) => (
              <div key={post.id} className="glass-card p-6 rounded-2xl border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="text-base font-bold text-white">{post.title}</h5>
                  <span className="text-[10px] text-neutral-400">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {post.imageUrl && (
                  <div className="rounded-xl overflow-hidden my-2 max-h-80 bg-black/40">
                    <img src={post.imageUrl} alt={post.imageCaption || ''} className="w-full h-full object-cover" />
                    {post.imageCaption && (
                      <p className="p-2 text-[11px] text-neutral-400 italic bg-black/60">{post.imageCaption}</p>
                    )}
                  </div>
                )}
                <p className="text-xs text-neutral-200 whitespace-pre-line leading-relaxed">{post.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit History Modal */}
      {showEditModal && (
        <EditHistoryModal org={org} onClose={() => setShowEditModal(false)} />
      )}
    </div>
  );
}
