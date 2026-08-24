'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  User as UserIcon,
  Mail,
  GraduationCap,
  BookOpen,
  Calendar,
  Phone,
  Instagram,
  Crown,
  Shield,
  Users,
  CheckCircle2,
  XCircle,
  UserPlus,
  UserMinus,
  Edit3,
  Camera,
  Image as ImageIcon,
  Building2,
  Sparkles,
  Palette,
  Eye
} from 'lucide-react';
import AvatarGeneratorModal from '../../components/AvatarGeneratorModal';
import BulkImageModal from '../../components/BulkImageModal';
import ImageUploadButton from '../../components/ImageUploadButton';
import ImageWithFallback from '../../components/ImageWithFallback';

export default function ProfilePage() {
  const {
    currentUser,
    users,
    updateProfile,
    acceptFriendRequest,
    declineFriendRequest,
    removeFriend
  } = useAuth();
  const { orgs } = useData();

  const [isEditing, setIsEditing] = useState(false);
  const [showMonogramModal, setShowMonogramModal] = useState(false);
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [showFullBannerModal, setShowFullBannerModal] = useState(false);

  const [name, setName] = useState(currentUser?.name || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [major, setMajor] = useState(currentUser?.major || '');
  const [gradYear, setGradYear] = useState(currentUser?.gradYear || '2026');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [instagram, setInstagram] = useState(currentUser?.instagram || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');
  const [banner, setBanner] = useState(currentUser?.banner || '');
  const [savedNotice, setSavedNotice] = useState(false);

  if (!currentUser) {
    return (
      <div className="glass-card rounded-3xl p-12 text-center max-w-md mx-auto my-12 space-y-4">
        <UserIcon className="w-12 h-12 text-neutral-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">Sign In Required</h2>
        <p className="text-xs text-neutral-400">Please log in to view and edit your profile.</p>
        <Link
          href="/login"
          className="inline-block px-5 py-2.5 rounded-xl bg-gold-500 text-black font-bold text-xs transition"
        >
          Sign In
        </Link>
      </div>
    );
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      bio,
      major,
      gradYear,
      phone,
      instagram,
      avatar,
      banner
    });
    setIsEditing(false);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const joinedOrgs = orgs.filter((o) => currentUser.joinedOrgIds.includes(o.id));
  const incomingFriends = users.filter((u) => currentUser.friendRequestsIncoming.includes(u.id));
  const myFriends = users.filter((u) => currentUser.friends.includes(u.id));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Banner & Avatar Header */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-white/10 shadow-2xl">
        <div
          className="h-64 sm:h-80 w-full relative bg-neutral-900 cursor-pointer group/banner"
          onClick={() => setShowFullBannerModal(true)}
          title="Click to view full banner"
        >
          <ImageWithFallback
            src={currentUser.banner}
            alt="Profile Banner"
            fallbackType="banner"
            className="w-full h-full object-cover group-hover/banner:scale-[1.02] transition duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-black/20" />

          {/* View Full Banner Badge */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowFullBannerModal(true);
            }}
            className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/70 hover:bg-black/90 text-white border border-white/20 text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-md transition shadow-lg"
          >
            <Eye className="w-3.5 h-3.5 text-gold-400" /> View Full Banner
          </button>
        </div>

        {/* Profile Info Bar */}
        <div className="px-6 sm:px-8 pb-6 pt-0 relative flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 sm:-mt-16">
          <div className="flex items-end gap-4">
            <div className="relative">
              <ImageWithFallback
                src={currentUser.avatar}
                alt={currentUser.name}
                fallbackType="avatar"
                fallbackText={currentUser.name.split(' ').map((n) => n[0]).join('')}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-neutral-950 shadow-2xl bg-neutral-900"
              />
              {currentUser.role === 'super_admin' && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white p-1 rounded-full shadow" title="Super Admin">
                  <Shield className="w-4 h-4" />
                </span>
              )}
            </div>

            <div className="space-y-0.5 pb-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">{currentUser.name}</h1>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    currentUser.role === 'super_admin'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                      : 'bg-gold-500/20 text-gold-300 border border-gold-500/40'
                  }`}
                >
                  {currentUser.role === 'super_admin' ? '🛡️ Super Admin' : '🎓 Student'}
                </span>
              </div>
              <p className="text-xs text-neutral-400 flex items-center gap-2">
                <span>{currentUser.campus}</span>
                <span>•</span>
                <span>{currentUser.major}</span>
                <span>•</span>
                <span>Class of {currentUser.gradYear}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-1.5 border border-white/10"
            >
              <Edit3 className="w-3.5 h-3.5" /> {isEditing ? 'Cancel Edit' : 'Edit Profile'}
            </button>
          </div>
        </div>

        {savedNotice && (
          <div className="mx-6 mb-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Profile successfully updated!
          </div>
        )}
      </div>

      {/* Edit Form */}
      {isEditing && (
        <form onSubmit={handleSaveProfile} className="glass-card p-6 rounded-3xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-gold-400" /> Edit Personal Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-neutral-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-300 mb-1">Major / Program</label>
              <input
                type="text"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-300 mb-1">Graduation Year</label>
              <input
                type="text"
                value={gradYear}
                onChange={(e) => setGradYear(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-300 mb-1">Instagram Handle</label>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="@username"
                className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-300 mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(951) 555-0123"
                className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
                <label className="font-semibold text-neutral-300">Avatar Image</label>
                <div className="flex items-center gap-2">
                  <ImageUploadButton
                    label="Upload Photo"
                    imageType="avatar"
                    onImageUploaded={(dataUrl) => setAvatar(dataUrl)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowMonogramModal(true)}
                    className="text-[11px] text-gold-400 hover:underline flex items-center gap-1 font-bold"
                  >
                    <Palette className="w-3 h-3" /> Monogram
                  </button>
                </div>
              </div>
              <input
                type="text"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://... or upload photo"
                className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
                <label className="font-semibold text-neutral-300">Banner Image</label>
                <div className="flex items-center gap-2">
                  <ImageUploadButton
                    label="Upload Banner from Files"
                    imageType="banner"
                    onImageUploaded={(dataUrl) => setBanner(dataUrl)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowBannerModal(true)}
                    className="text-[11px] text-gold-400 hover:underline flex items-center gap-1 font-bold"
                  >
                    <ImageIcon className="w-3 h-3" /> Pick Gallery
                  </button>
                </div>
              </div>
              <input
                type="text"
                value={banner}
                onChange={(e) => setBanner(e.target.value)}
                placeholder="https://... or upload photo/banner"
                className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-neutral-300 mb-1">Bio</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-bold text-xs transition"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      )}

      {/* Grid: Bio & Joined Orgs vs Friends */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Bio & Contact */}
        <div className="space-y-6">
          <div className="glass-card p-5 rounded-2xl space-y-3">
            <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">About Me</h3>
            <p className="text-xs text-neutral-300 leading-relaxed">{currentUser.bio || 'No bio provided yet.'}</p>
          </div>

          <div className="glass-card p-5 rounded-2xl space-y-3">
            <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">Contact Details</h3>
            <div className="space-y-2 text-xs text-neutral-300">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                <span className="truncate">{currentUser.email}</span>
              </div>
              {currentUser.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>{currentUser.phone}</span>
                </div>
              )}
              {currentUser.instagram && (
                <div className="flex items-center gap-2">
                  <Instagram className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>{currentUser.instagram}</span>
                </div>
              )}
            </div>
          </div>

          {/* Incoming Friend Requests */}
          {incomingFriends.length > 0 && (
            <div className="glass-card p-5 rounded-2xl space-y-3 border border-gold-500/30">
              <h3 className="text-xs font-bold text-gold-400 uppercase tracking-wider flex items-center gap-1.5">
                <UserPlus className="w-4 h-4" /> Pending Friend Requests ({incomingFriends.length})
              </h3>
              <div className="space-y-2">
                {incomingFriends.map((friend) => (
                  <div key={friend.id} className="flex items-center justify-between p-2 rounded-xl bg-white/5">
                    <div className="flex items-center gap-2">
                      <img src={friend.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                      <div>
                        <p className="text-xs font-bold text-white">{friend.name}</p>
                        <p className="text-[10px] text-neutral-400">{friend.campus}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => acceptFriendRequest(friend.id)}
                        className="p-1.5 rounded-lg bg-emerald-500 text-black hover:bg-emerald-400 transition"
                        title="Accept"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => declineFriendRequest(friend.id)}
                        className="p-1.5 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition"
                        title="Decline"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Center & Right Column: Joined Organizations & Friends List */}
        <div className="md:col-span-2 space-y-6">
          {/* Joined Orgs */}
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-gold-400" /> Organizations Joined ({joinedOrgs.length})
              </span>
              <Link href="/" className="text-xs text-gold-400 hover:underline">
                Browse More
              </Link>
            </h3>

            {joinedOrgs.length === 0 ? (
              <p className="text-xs text-neutral-400 italic py-4 text-center">
                You haven't joined any organizations yet. Browse the campus directory to join!
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {joinedOrgs.map((org) => {
                  const myPosition = org.members.find((m) => m.userId === currentUser.id)?.position || 'Member';
                  const isPrimaryAdmin = org.claimedByUserId === currentUser.id;

                  return (
                    <Link
                      key={org.id}
                      href={`/orgs/${org.id}`}
                      className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <img src={org.logo} alt="" className="w-10 h-10 rounded-xl object-cover" />
                        <div>
                          <p className="text-xs font-bold text-white group-hover:text-gold-400 transition leading-snug">
                            {org.shortName}
                          </p>
                          <p className="text-[11px] text-neutral-400">{myPosition}</p>
                        </div>
                      </div>

                      {isPrimaryAdmin && (
                        <span className="p-1.5 rounded-lg bg-gold-500/20 text-gold-400" title="Primary Admin / President">
                          <Crown className="w-4 h-4" />
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Friends List */}
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-gold-400" /> Friends ({myFriends.length})
            </h3>

            {myFriends.length === 0 ? (
              <p className="text-xs text-neutral-400 italic py-4 text-center">
                Your friends list is currently empty. Connect with other students across campus!
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {myFriends.map((friend) => (
                  <div
                    key={friend.id}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <img src={friend.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                      <div>
                        <p className="text-xs font-bold text-white">{friend.name}</p>
                        <p className="text-[10px] text-neutral-400">{friend.campus} • {friend.major}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFriend(friend.id)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 transition"
                      title="Remove Friend"
                    >
                      <UserMinus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Monogram Avatar Modal */}
      {showMonogramModal && (
        <AvatarGeneratorModal
          title="Create Custom Profile Monogram"
          initialText={currentUser.name ? currentUser.name.split(' ').map((n) => n[0]).join('') : 'EK'}
          onApply={(dataUrl) => setAvatar(dataUrl)}
          onClose={() => setShowMonogramModal(false)}
        />
      )}

      {/* Banner Selection Modal */}
      {showBannerModal && (
        <BulkImageModal
          title="Select Profile Banner"
          mode="banner"
          onSelect={(imgUrl) => setBanner(imgUrl)}
          onClose={() => setShowBannerModal(false)}
        />
      )}

      {/* Full Size Banner Lightbox Modal */}
      {showFullBannerModal && currentUser.banner && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setShowFullBannerModal(false)}
        >
          <div
            className="relative max-w-5xl w-full glass-panel rounded-3xl overflow-hidden border border-white/20 p-2 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3 border-b border-white/10">
              <h4 className="font-bold text-white text-sm">Full Profile Banner View</h4>
              <button
                onClick={() => setShowFullBannerModal(false)}
                className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold"
              >
                Close ✕
              </button>
            </div>
            <div className="p-2 flex items-center justify-center max-h-[80vh] overflow-hidden">
              <img
                src={currentUser.banner}
                alt="Full Banner"
                className="max-h-[75vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
