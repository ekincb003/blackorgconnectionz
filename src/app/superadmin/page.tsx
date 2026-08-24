'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  Shield,
  Users,
  Building2,
  Trash2,
  Download,
  Upload,
  UserX,
  UserCheck,
  AlertTriangle,
  FileText,
  Calendar,
  Layers,
  Crown,
  CheckCircle,
  XCircle,
  Sparkles,
  ExternalLink,
  MessageSquare,
  RefreshCw,
  Plus,
  Image as ImageIcon,
  Palette
} from 'lucide-react';
import AvatarGeneratorModal from '../../components/AvatarGeneratorModal';
import BulkImageModal from '../../components/BulkImageModal';
import ImageUploadButton from '../../components/ImageUploadButton';
import ImageWithFallback from '../../components/ImageWithFallback';
import { OrgCategory } from '../../types';

export default function SuperAdminPage() {
  const { currentUser, users, banUserSite, unbanUserSite, deleteUserPermanently } = useAuth();
  const {
    orgs,
    groupChats,
    claimRequests,
    notifications,
    messages,
    approveClaimRequest,
    rejectClaimRequest,
    forceClaimOrg,
    unclaimOrg,
    deleteOrg,
    bulkImportOrgs,
    createOrg,
    moveEventToOrg,
    deleteGroupChat,
    deleteMessage,
    dataCleanup,
    exportPlatformDataJson,
    resetAllPlatformData,
    updateOrgDetails,
    appLogo,
    updateAppLogo
  } = useData();

  const [activeTab, setActiveTab] = useState<'overview' | 'claims' | 'users' | 'orgs' | 'branding' | 'bulk' | 'cleanup'>('overview');

  // Org branding modal state
  const [targetBrandingOrg, setTargetBrandingOrg] = useState<string | null>(null);
  const [showLogoModal, setShowLogoModal] = useState(false);
  const [showBannerModal, setShowBannerModal] = useState(false);

  // Bulk import state
  const [bulkInput, setBulkInput] = useState('');
  const [bulkResult, setBulkResult] = useState<number | null>(null);

  // Create Org Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgShortName, setNewOrgShortName] = useState('');
  const [newOrgCategory, setNewOrgCategory] = useState<OrgCategory>('Cultural');
  const [newOrgTagline, setNewOrgTagline] = useState('');
  const [newOrgDesc, setNewOrgDesc] = useState('');
  const [newOrgEmail, setNewOrgEmail] = useState('');

  // Move Event Modal
  const [moveEventModal, setMoveEventModal] = useState<{ orgId: string; eventId: string; eventTitle: string } | null>(null);
  const [targetOrgId, setTargetOrgId] = useState('');

  // Ban User Modal
  const [banModalUser, setBanModalUser] = useState<{ id: string; name: string } | null>(null);
  const [banReason, setBanReason] = useState('');

  // Quick feedback messages
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 4000);
  };

  // Restrict to Super Admin (Elijah Kincade)
  if (!currentUser || currentUser.role !== 'super_admin') {
    return (
      <div className="glass-card rounded-3xl p-12 text-center max-w-md mx-auto my-12 space-y-4">
        <div className="p-3 bg-red-500/10 text-red-400 rounded-2xl w-fit mx-auto border border-red-500/20">
          <Shield className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white">Super Admin Access Required</h2>
        <p className="text-xs text-neutral-400">
          This governance dashboard is restricted exclusively to Elijah Kincade (Platform Super Admin).
        </p>
        <Link
          href="/login"
          className="inline-block px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-bold text-xs transition"
        >
          Sign In as Elijah Kincade
        </Link>
      </div>
    );
  }

  const handleExportJson = () => {
    const jsonStr = exportPlatformDataJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BlackOrgConnectionz-Backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    showFeedback('Complete platform JSON database exported successfully!');
  };

  const handleExportPdfReport = () => {
    // Generate clean printable report in new window
    const printWin = window.open('', '_blank');
    if (!printWin) return;

    const html = `
      <html>
        <head>
          <title>BlackOrgConnectionz - Master Campus Directory Report</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; color: #111; }
            h1 { color: #800020; font-size: 24px; margin-bottom: 4px; }
            p.sub { color: #666; font-size: 13px; margin-bottom: 24px; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 12px; }
            th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; }
            th { background-color: #f5f5f5; font-weight: bold; }
            .claimed { color: green; font-weight: bold; }
            .unclaimed { color: orange; font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>BlackOrgConnectionz — Campus Master Report</h1>
          <p class="sub">Generated on ${new Date().toLocaleString()} by Platform Director Elijah Kincade (${currentUser.email})</p>
          <h3>Campus Organizations Summary (${orgs.length} Total)</h3>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Organization Name</th>
                <th>Category</th>
                <th>Status</th>
                <th>Members</th>
                <th>Contact</th>
              </tr>
            </thead>
            <tbody>
              ${orgs
                .map(
                  (o, idx) => `
                <tr>
                  <td>${idx + 1}</td>
                  <td><strong>${o.name}</strong></td>
                  <td>${o.category}</td>
                  <td class="${o.isClaimed ? 'claimed' : 'unclaimed'}">${o.isClaimed ? 'Claimed' : 'Unclaimed'}</td>
                  <td>${o.members.length}</td>
                  <td>${o.contactEmail}</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
    printWin.document.write(html);
    printWin.document.close();
    printWin.focus();
    setTimeout(() => printWin.print(), 500);
  };

  const handleBulkImport = () => {
    if (!bulkInput.trim()) return;
    const count = bulkImportOrgs(bulkInput);
    setBulkResult(count);
    setBulkInput('');
    showFeedback(`Successfully bulk-imported ${count} organizations!`);
  };

  const handleCreateOrg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName.trim()) return;

    createOrg({
      name: newOrgName.trim(),
      shortName: newOrgShortName.trim() || newOrgName.trim(),
      category: newOrgCategory,
      tagline: newOrgTagline.trim() || 'Excellence and Community',
      description: newOrgDesc.trim() || 'A premier campus organization.',
      contactEmail: newOrgEmail.trim() || 'contact@campus.edu'
    });

    setShowCreateModal(false);
    setNewOrgName('');
    setNewOrgShortName('');
    setNewOrgTagline('');
    setNewOrgDesc('');
    setNewOrgEmail('');
    showFeedback('New campus organization successfully created!');
  };

  const handleExecuteMoveEvent = () => {
    if (!moveEventModal || !targetOrgId) return;
    moveEventToOrg(moveEventModal.orgId, targetOrgId, moveEventModal.eventId);
    setMoveEventModal(null);
    setTargetOrgId('');
    showFeedback('Event successfully moved to target organization!');
  };

  const handleExecuteBan = () => {
    if (!banModalUser) return;
    banUserSite(banModalUser.id, banReason || 'Violation of campus community guidelines.');
    setBanModalUser(null);
    setBanReason('');
    showFeedback(`User ${banModalUser.name} site-banned.`);
  };

  const pendingClaims = claimRequests.filter((c) => c.status === 'pending');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-red-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 text-xs font-bold">
              <Shield className="w-3.5 h-3.5" /> Super Admin Governance
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Platform Master Console — <span className="text-gold-400">Elijah Kincade</span>
            </h1>
            <p className="text-xs text-neutral-300">
              Authenticated as <code className="text-gold-400">ekinc002@ucr.edu</code>. Complete authority across all 24 organizations, user registrations, and platform data.
            </p>
          </div>

          {/* Quick Export Tools */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleExportJson}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-1.5 border border-white/10"
              title="Download full JSON platform database"
            >
              <Download className="w-4 h-4 text-gold-400" /> Export JSON
            </button>
            <button
              onClick={handleExportPdfReport}
              className="px-3.5 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-black text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-gold-500/20"
              title="Printable / PDF Master Directory Report"
            >
              <FileText className="w-4 h-4" /> Export PDF Report
            </button>
          </div>
        </div>

        {/* Global Feedback Banner */}
        {actionNotice && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <CheckCircle className="w-4 h-4 text-emerald-400" /> {actionNotice}
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'overview' ? 'bg-gold-500 text-black' : 'bg-white/5 text-neutral-300 hover:bg-white/10'
          }`}
        >
          <Layers className="w-4 h-4" /> Overview & Stats
        </button>

        <button
          onClick={() => setActiveTab('claims')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 relative ${
            activeTab === 'claims' ? 'bg-gold-500 text-black' : 'bg-white/5 text-neutral-300 hover:bg-white/10'
          }`}
        >
          <Crown className="w-4 h-4" /> Claim Requests
          {pendingClaims.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-black">
              {pendingClaims.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('orgs')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'orgs' ? 'bg-gold-500 text-black' : 'bg-white/5 text-neutral-300 hover:bg-white/10'
          }`}
        >
          <Building2 className="w-4 h-4" /> Manage 24 Orgs
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'users' ? 'bg-gold-500 text-black' : 'bg-white/5 text-neutral-300 hover:bg-white/10'
          }`}
        >
          <Users className="w-4 h-4" /> Users & Moderation
        </button>

        <button
          onClick={() => setActiveTab('branding')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'branding' ? 'bg-gold-500 text-black' : 'bg-white/5 text-neutral-300 hover:bg-white/10'
          }`}
        >
          <ImageIcon className="w-4 h-4" /> Branding & Logos
        </button>

        <button
          onClick={() => setActiveTab('bulk')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'bulk' ? 'bg-gold-500 text-black' : 'bg-white/5 text-neutral-300 hover:bg-white/10'
          }`}
        >
          <Upload className="w-4 h-4" /> Bulk Import Orgs
        </button>

        <button
          onClick={() => setActiveTab('cleanup')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'cleanup' ? 'bg-red-500 text-white' : 'bg-white/5 text-red-400 hover:bg-red-500/20'
          }`}
        >
          <Trash2 className="w-4 h-4" /> Data Cleanup & Reset
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="glass-card p-4 rounded-2xl">
              <p className="text-2xl font-black text-white">{orgs.length}</p>
              <p className="text-xs text-neutral-400 mt-0.5">Total Organizations</p>
            </div>
            <div className="glass-card p-4 rounded-2xl">
              <p className="text-2xl font-black text-emerald-400">
                {orgs.filter((o) => o.isClaimed).length}
              </p>
              <p className="text-xs text-neutral-400 mt-0.5">Claimed (Active)</p>
            </div>
            <div className="glass-card p-4 rounded-2xl">
              <p className="text-2xl font-black text-amber-400">
                {orgs.filter((o) => !o.isClaimed).length}
              </p>
              <p className="text-xs text-neutral-400 mt-0.5">⭕ Unclaimed</p>
            </div>
            <div className="glass-card p-4 rounded-2xl">
              <p className="text-2xl font-black text-gold-400">{users.length}</p>
              <p className="text-xs text-neutral-400 mt-0.5">Registered Accounts</p>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold-400" /> Platform Quick Controls
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => setShowCreateModal(true)}
                className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition space-y-1"
              >
                <div className="flex items-center gap-2 text-gold-400 font-bold text-xs">
                  <Plus className="w-4 h-4" /> Create New Organization
                </div>
                <p className="text-[11px] text-neutral-400">Add a custom campus org to the directory</p>
              </button>

              <button
                onClick={handleExportJson}
                className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition space-y-1"
              >
                <div className="flex items-center gap-2 text-blue-400 font-bold text-xs">
                  <Download className="w-4 h-4" /> Backup Database (JSON)
                </div>
                <p className="text-[11px] text-neutral-400">Export complete platform snapshot</p>
              </button>

              <button
                onClick={() => setActiveTab('cleanup')}
                className="p-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-left transition space-y-1"
              >
                <div className="flex items-center gap-2 text-red-400 font-bold text-xs">
                  <Trash2 className="w-4 h-4" /> Data Cleanup Suite
                </div>
                <p className="text-[11px] text-neutral-400">Purge test orgs, test messages, or claims</p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CLAIM REQUESTS */}
      {activeTab === 'claims' && (
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Crown className="w-5 h-5 text-gold-400" /> Organization Claim Submissions
          </h2>

          {claimRequests.length === 0 ? (
            <p className="text-xs text-neutral-400 italic py-6 text-center">
              No claim requests submitted yet. Students can submit claim requests or join unclaimed orgs directly.
            </p>
          ) : (
            <div className="space-y-3">
              {claimRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">{req.userName}</span>
                      <span className="text-[11px] text-neutral-400">({req.userEmail})</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          req.status === 'approved'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : req.status === 'rejected'
                            ? 'bg-red-500/20 text-red-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {req.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-gold-400 font-semibold">Requesting to Claim: {req.orgName}</p>
                    <p className="text-xs text-neutral-300 italic">"{req.reason}"</p>
                    <p className="text-[10px] text-neutral-500">Submitted: {new Date(req.createdAt).toLocaleString()}</p>
                  </div>

                  {req.status === 'pending' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          approveClaimRequest(req.id);
                          showFeedback(`Claim approved for ${req.userName}!`);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition flex items-center gap-1"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Approve & Grant Admin
                      </button>
                      <button
                        onClick={() => {
                          rejectClaimRequest(req.id);
                          showFeedback(`Claim rejected.`);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-bold transition flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: MANAGE 24 ORGS */}
      {activeTab === 'orgs' && (
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-gold-400" /> Manage All Campus Organizations ({orgs.length})
            </h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-3 py-1.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-black text-xs font-bold transition flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Add Organization
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-neutral-400 text-[11px] font-semibold uppercase">
                  <th className="p-3">Organization</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Members</th>
                  <th className="p-3">Admin</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orgs.map((org) => {
                  const admin = org.members.find((m) => m.isPrimaryAdmin);
                  return (
                    <tr key={org.id} className="hover:bg-white/[0.02] transition">
                      <td className="p-3 flex items-center gap-2.5">
                        <img src={org.logo} alt="" className="w-8 h-8 rounded-lg object-cover" />
                        <div>
                          <p className="font-bold text-white">{org.name}</p>
                          <p className="text-[11px] text-neutral-400">{org.contactEmail}</p>
                        </div>
                      </td>

                      <td className="p-3 text-neutral-300">{org.category}</td>

                      <td className="p-3">
                        {org.isClaimed ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                            ✅ Claimed
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px]">
                            ⭕ Unclaimed
                          </span>
                        )}
                      </td>

                      <td className="p-3 text-white font-semibold">{org.members.length}</td>

                      <td className="p-3 text-neutral-300">
                        {admin ? (
                          <span className="flex items-center gap-1 text-gold-400 font-medium">
                            <Crown className="w-3 h-3" /> {admin.userName}
                          </span>
                        ) : (
                          <span className="text-neutral-500 italic">None</span>
                        )}
                      </td>

                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/orgs/${org.id}`}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition"
                            title="View Org Page"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>

                          {org.isClaimed ? (
                            <button
                              onClick={() => {
                                unclaimOrg(org.id);
                                showFeedback(`Unclaimed ${org.shortName}.`);
                              }}
                              className="px-2 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[11px] font-semibold transition"
                              title="Reset to Unclaimed"
                            >
                              Unclaim
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                forceClaimOrg(org.id, currentUser.id);
                                showFeedback(`Claimed ${org.shortName} as Elijah Kincade.`);
                              }}
                              className="px-2 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-400 text-emerald-300 hover:text-black text-[11px] font-semibold transition"
                              title="Force Claim as Super Admin"
                            >
                              Claim (You)
                            </button>
                          )}

                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to permanently delete "${org.name}"?`)) {
                                deleteOrg(org.id);
                                showFeedback(`Deleted ${org.name}.`);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/30 text-red-400 transition"
                            title="Delete Organization"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: USERS & MODERATION */}
      {activeTab === 'users' && (
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-gold-400" /> Registered Users & Site Moderation ({users.length})
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-neutral-400 text-[11px] font-semibold uppercase">
                  <th className="p-3">User</th>
                  <th className="p-3">Campus / Type</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Joined Orgs</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-white/[0.02] transition">
                    <td className="p-3 flex items-center gap-2.5">
                      <img src={u.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <p className="font-bold text-white flex items-center gap-1.5">
                          {u.name}
                          {u.id === currentUser.id && (
                            <span className="text-[10px] text-gold-400 font-normal">(You)</span>
                          )}
                        </p>
                        <p className="text-[11px] text-neutral-400">{u.email}</p>
                      </div>
                    </td>

                    <td className="p-3 text-neutral-300">
                      <span className="font-medium text-white">{u.campus}</span>
                      <span className="text-[10px] text-neutral-500 block">({u.userType})</span>
                    </td>

                    <td className="p-3">
                      {u.role === 'super_admin' ? (
                        <span className="text-red-400 font-bold flex items-center gap-1">
                          <Shield className="w-3.5 h-3.5" /> Super Admin
                        </span>
                      ) : (
                        <span className="text-neutral-300">Student</span>
                      )}
                    </td>

                    <td className="p-3 text-white font-semibold">{u.joinedOrgIds.length} orgs</td>

                    <td className="p-3">
                      {u.isSiteBanned ? (
                        <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 font-bold text-[10px]">
                          Banned: {u.siteBanReason}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                          Active
                        </span>
                      )}
                    </td>

                    <td className="p-3 text-right">
                      {u.id !== currentUser.id && (
                        <div className="flex items-center justify-end gap-1.5">
                          {u.isSiteBanned ? (
                            <button
                              onClick={() => {
                                unbanUserSite(u.id);
                                showFeedback(`Unbanned ${u.name}.`);
                              }}
                              className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold transition"
                            >
                              Unban
                            </button>
                          ) : (
                            <button
                              onClick={() => setBanModalUser({ id: u.id, name: u.name })}
                              className="px-2 py-1 rounded-lg bg-amber-500/20 text-amber-300 text-[11px] font-semibold transition"
                            >
                              Ban Site
                            </button>
                          )}

                          <button
                            onClick={() => {
                              if (confirm(`Permanently delete account for "${u.name}"?`)) {
                                deleteUserPermanently(u.id);
                                showFeedback(`Deleted user ${u.name}.`);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/30 transition"
                            title="Delete User Permanently"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: BRANDING & LOGOS */}
      {activeTab === 'branding' && (
        <div className="space-y-6">
          {/* Master Platform App Logo Studio */}
          <div className="glass-panel p-6 rounded-3xl border border-gold-500/30 shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-gold-500/40 p-2 flex items-center justify-center shadow-xl shrink-0">
                  <img src={appLogo} alt="Platform Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-gold-400" /> Platform App Crest & Master Logo
                  </h3>
                  <p className="text-xs text-neutral-400 max-w-lg mt-0.5">
                    This image is displayed at the top of the app across the header navigation, mobile menu, and authentication pages.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <ImageUploadButton
                  label="Upload Custom App Logo"
                  imageType="avatar"
                  onImageUploaded={(dataUrl) => {
                    updateAppLogo(dataUrl);
                    showFeedback('Custom platform app logo updated successfully!');
                  }}
                />
              </div>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl space-y-4">
            <div className="space-y-1">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-gold-400" /> Organization Branding & Monogram Studio
              </h2>
              <p className="text-xs text-neutral-400">
                Customize logos, generate Divine 9 / chapter monograms with custom letters & colors, or assign high-definition collegiate banners.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {orgs.map((org) => (
              <div key={org.id} className="p-4 rounded-2xl bg-neutral-900 border border-white/10 space-y-3 flex flex-col justify-between">
                <div className="flex items-center gap-3">
                  <ImageWithFallback
                    src={org.logo}
                    alt={org.name}
                    fallbackType="logo"
                    fallbackText={org.shortName?.substring(0, 3)}
                    fallbackBg={org.primaryColor || '#002B7F'}
                    fallbackTextColor={org.secondaryColor || '#FFFFFF'}
                    className="w-12 h-12 aspect-square rounded-lg object-contain bg-neutral-950 p-0.5 ring-2 ring-white/10"
                  />
                  <div className="truncate flex-1">
                    <p className="font-bold text-white text-xs truncate">{org.shortName}</p>
                    <p className="text-[10px] text-neutral-400 truncate">{org.category}</p>
                  </div>
                </div>

                <div className="h-20 w-full rounded-lg overflow-hidden bg-black/40 relative">
                  <ImageWithFallback
                    src={org.banner}
                    alt={org.name}
                    fallbackType="banner"
                    className="w-full h-full object-cover opacity-80"
                  />
                  <span className="absolute bottom-1 right-2 text-[9px] text-white/80 bg-black/60 px-1.5 py-0.5 rounded">Banner</span>
                </div>

                {/* Upload and Branding Actions */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center gap-1.5">
                    <ImageUploadButton
                      label="Upload Logo"
                      imageType="avatar"
                      className="flex-1 py-1.5 text-[11px] justify-center"
                      onImageUploaded={(dataUrl) => {
                        updateOrgDetails(org.id, { logo: dataUrl });
                        showFeedback(`Updated logo for ${org.shortName}!`);
                      }}
                    />
                    <button
                      onClick={() => {
                        setTargetBrandingOrg(org.id);
                        setShowLogoModal(true);
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-gold-500/20 hover:bg-gold-500/30 text-gold-300 text-[11px] font-bold transition flex items-center gap-1"
                    >
                      <Palette className="w-3 h-3" /> Monogram
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <ImageUploadButton
                      label="Upload Banner"
                      imageType="banner"
                      className="flex-1 py-1.5 text-[11px] justify-center"
                      onImageUploaded={(dataUrl) => {
                        updateOrgDetails(org.id, { banner: dataUrl });
                        showFeedback(`Updated banner for ${org.shortName}!`);
                      }}
                    />
                    <button
                      onClick={() => {
                        setTargetBrandingOrg(org.id);
                        setShowBannerModal(true);
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-[11px] font-semibold transition flex items-center gap-1"
                    >
                      <ImageIcon className="w-3 h-3" /> Gallery
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>
      )}

      {/* TAB 5: BULK IMPORT */}
      {activeTab === 'bulk' && (
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Upload className="w-5 h-5 text-gold-400" /> Bulk Import Organizations
            </h2>
            <p className="text-xs text-neutral-400">
              Format: <code className="text-gold-400">Name | Description | Category | LogoURL</code> (one per line)
            </p>
          </div>

          <textarea
            rows={8}
            value={bulkInput}
            onChange={(e) => setBulkInput(e.target.value)}
            placeholder="Black Student Experience | Advocacy group for Black collegiate scholars | Campus Department / Affiliated | https://...&#10;Inland Empire NSBE Chapter | Engineering chapter | Academic / Professional | https://..."
            className="w-full p-3.5 rounded-xl bg-neutral-900 border border-white/10 text-white font-mono text-xs focus:border-gold-500 focus:outline-none"
          />

          <div className="flex items-center justify-between">
            <button
              onClick={handleBulkImport}
              className="px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-bold text-xs transition shadow-lg shadow-gold-500/20"
            >
              Execute Bulk Import
            </button>
            {bulkResult !== null && (
              <span className="text-xs text-emerald-400 font-semibold">
                Imported {bulkResult} organizations successfully!
              </span>
            )}
          </div>
        </div>
      )}

      {/* TAB 6: DATA CLEANUP & RESET */}
      {activeTab === 'cleanup' && (
        <div className="glass-card p-6 rounded-2xl space-y-6">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-red-400 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" /> Data Cleanup Suite
            </h2>
            <p className="text-xs text-neutral-400">
              Select specific actions to clean test data while keeping Elijah Kincade's super admin account intact.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <p className="text-xs font-bold text-white">Clear Notifications</p>
              <p className="text-[11px] text-neutral-400">Purge all platform notification history.</p>
              <button
                onClick={() => {
                  dataCleanup({ clearNotifs: true });
                  showFeedback('All notifications cleared.');
                }}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition"
              >
                Clear Notifications
              </button>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <p className="text-xs font-bold text-white">Clear Claim Requests</p>
              <p className="text-[11px] text-neutral-400">Remove all processed and pending claim submissions.</p>
              <button
                onClick={() => {
                  dataCleanup({ clearClaims: true });
                  showFeedback('All claim requests cleared.');
                }}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition"
              >
                Clear Claims
              </button>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <p className="text-xs font-bold text-white">Remove Bulk-Imported Test Orgs</p>
              <p className="text-[11px] text-neutral-400">Deletes any dynamically imported test organizations.</p>
              <button
                onClick={() => {
                  dataCleanup({ clearTestOrgs: true });
                  showFeedback('Removed test orgs.');
                }}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition"
              >
                Remove Test Orgs
              </button>
            </div>

            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 space-y-2">
              <p className="text-xs font-bold text-red-300">Reset Platform to Default 24 Orgs</p>
              <p className="text-[11px] text-neutral-400">
                Restores original Divine Nine & campus org dataset with Elijah Kincade as Super Admin.
              </p>
              <button
                onClick={() => {
                  if (confirm('Reset entire platform back to default dataset?')) {
                    resetAllPlatformData();
                    showFeedback('Platform restored to default state.');
                  }
                }}
                className="px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-400 text-white text-xs font-bold transition"
              >
                Restore Default State
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE ORG MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl border border-white/20 max-w-lg w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Create New Campus Organization</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-neutral-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOrg} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-neutral-300 mb-1">Organization Name</label>
                <input
                  type="text"
                  required
                  value={newOrgName}
                  onChange={(e) => setNewOrgName(e.target.value)}
                  placeholder="e.g. Society of Black Scholars"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-300 mb-1">Short Name / Acronym</label>
                  <input
                    type="text"
                    value={newOrgShortName}
                    onChange={(e) => setNewOrgShortName(e.target.value)}
                    placeholder="e.g. SBS"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-300 mb-1">Category</label>
                  <select
                    value={newOrgCategory}
                    onChange={(e) => setNewOrgCategory(e.target.value as OrgCategory)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none"
                  >
                    <option value="Fraternities & Sororities (NPHC)">Fraternities & Sororities (NPHC)</option>
                    <option value="Academic / Professional">Academic / Professional</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Arts and Expression">Arts and Expression</option>
                    <option value="Campus Department / Affiliated">Campus Department / Affiliated</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1">Tagline / Motto</label>
                <input
                  type="text"
                  value={newOrgTagline}
                  onChange={(e) => setNewOrgTagline(e.target.value)}
                  placeholder="e.g. Excellence in Scholarly Discovery"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newOrgDesc}
                  onChange={(e) => setNewOrgDesc(e.target.value)}
                  placeholder="Detailed description of the organization..."
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1">Contact Email</label>
                <input
                  type="email"
                  value={newOrgEmail}
                  onChange={(e) => setNewOrgEmail(e.target.value)}
                  placeholder="org@campus.edu"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-bold transition shadow-lg shadow-gold-500/20"
                >
                  Create Organization
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BAN USER MODAL */}
      {banModalUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl border border-red-500/30 max-w-md w-full space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <UserX className="w-5 h-5 text-red-400" /> Site-Ban User: {banModalUser.name}
            </h3>
            <p className="text-xs text-neutral-300">
              Site-banned users will be locked out from signing into BlackOrgConnectionz across all features.
            </p>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Ban Reason</label>
              <textarea
                rows={3}
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="Reason for site ban (e.g. Terms violation, inappropriate conduct)..."
                className="w-full p-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:border-red-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setBanModalUser(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteBan}
                className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-400 text-white text-xs font-bold transition"
              >
                Confirm Site Ban
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Org Crest / Monogram Generator Modal */}
      {showLogoModal && targetBrandingOrg && (
        <AvatarGeneratorModal
          title={`Create Crest / Monogram for ${orgs.find((o) => o.id === targetBrandingOrg)?.shortName || 'Org'}`}
          initialText={orgs.find((o) => o.id === targetBrandingOrg)?.shortName?.substring(0, 3) || 'ORG'}
          initialBg={orgs.find((o) => o.id === targetBrandingOrg)?.primaryColor || '#002B7F'}
          initialTextColor={orgs.find((o) => o.id === targetBrandingOrg)?.secondaryColor || '#FFFFFF'}
          onApply={(dataUrl) => {
            updateOrgDetails(targetBrandingOrg, { logo: dataUrl });
            showFeedback('Organization crest / logo monogram updated!');
          }}
          onClose={() => {
            setShowLogoModal(false);
            setTargetBrandingOrg(null);
          }}
        />
      )}

      {/* Org Banner Picker Modal */}
      {showBannerModal && targetBrandingOrg && (
        <BulkImageModal
          title={`Select Banner for ${orgs.find((o) => o.id === targetBrandingOrg)?.name || 'Org'}`}
          mode="banner"
          onSelect={(imgUrl) => {
            updateOrgDetails(targetBrandingOrg, { banner: imgUrl });
            showFeedback('Organization header banner updated!');
          }}
          onClose={() => {
            setShowBannerModal(false);
            setTargetBrandingOrg(null);
          }}
        />
      )}
    </div>
  );
}
