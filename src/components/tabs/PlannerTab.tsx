'use client';

import React, { useState } from 'react';
import { Organization } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  FileText,
  Lock,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
  Shield,
  UserCheck,
  XCircle,
  Key
} from 'lucide-react';

interface PlannerTabProps {
  org: Organization;
}

export default function PlannerTab({ org }: PlannerTabProps) {
  const { currentUser } = useAuth();
  const {
    createPlannerNote,
    updatePlannerNote,
    deletePlannerNote,
    requestPlannerAccess,
    approvePlannerAccess,
    rejectPlannerAccess
  } = useData();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');

  const isPrimaryAdmin = currentUser ? org.claimedByUserId === currentUser.id : false;
  const isSuperAdmin = currentUser?.role === 'super_admin';
  const isOfficer = currentUser
    ? org.members.some((m) => m.userId === currentUser.id && m.isOfficer)
    : false;

  // Access check: Primary admin, Super admin, officer, or specifically granted user
  const hasAccess =
    isPrimaryAdmin ||
    isSuperAdmin ||
    isOfficer ||
    (currentUser &&
      org.plannerNotes?.some((n) => n.accessGrantedUserIds?.includes(currentUser.id)));

  const pendingRequests = org.plannerAccessRequests?.filter((r) => r.status === 'pending') || [];
  const myPendingRequest = currentUser
    ? org.plannerAccessRequests?.find((r) => r.userId === currentUser.id && r.status === 'pending')
    : null;

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim() || !noteContent.trim()) return;

    if (editingNoteId) {
      updatePlannerNote(org.id, editingNoteId, noteTitle.trim(), noteContent.trim());
      setEditingNoteId(null);
    } else {
      createPlannerNote(org.id, noteTitle.trim(), noteContent.trim());
      setShowAddModal(false);
    }

    setNoteTitle('');
    setNoteContent('');
  };

  const handleStartEdit = (note: { id: string; title: string; content: string }) => {
    setEditingNoteId(note.id);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setShowAddModal(true);
  };

  // If user does not have planner access, show access request screen
  if (!hasAccess) {
    return (
      <div className="glass-card rounded-2xl p-10 text-center max-w-md mx-auto space-y-4">
        <div className="p-3.5 bg-amber-500/10 text-amber-400 rounded-2xl w-fit mx-auto border border-amber-500/20">
          <Lock className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-white">Private Executive Planner</h3>
        <p className="text-xs text-neutral-400">
          This tab contains private executive meeting notes, budget tracking, and event agendas for chapter officers and granted members.
        </p>

        {myPendingRequest ? (
          <div className="p-3 rounded-xl bg-gold-500/15 border border-gold-500/30 text-gold-300 text-xs flex items-center justify-center gap-2">
            <Clock className="w-4 h-4" /> Access request pending approval by Chapter Admin.
          </div>
        ) : currentUser ? (
          <button
            onClick={() => requestPlannerAccess(org.id)}
            className="px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-bold text-xs transition flex items-center gap-2 mx-auto"
          >
            <Key className="w-4 h-4" /> Request Planner Access
          </button>
        ) : (
          <p className="text-xs text-neutral-500">Sign in to request executive access.</p>
        )}
      </div>
    );
  }

  const notes = org.plannerNotes || [];

  return (
    <div className="space-y-6">
      {/* Header & Access Requests */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-gold-400" /> Executive Planner & Private Notes
          </h2>
          <p className="text-xs text-neutral-400">
            Private strategy, agendas, and chapter notes visible only to leadership and granted members.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingNoteId(null);
            setNoteTitle('');
            setNoteContent('');
            setShowAddModal(true);
          }}
          className="px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-bold text-xs transition flex items-center gap-1.5 self-start sm:self-auto shadow-lg shadow-gold-500/20"
        >
          <Plus className="w-4 h-4" /> New Planner Note
        </button>
      </div>

      {/* Pending Access Requests (Admins only) */}
      {(isPrimaryAdmin || isSuperAdmin) && pendingRequests.length > 0 && (
        <div className="p-4 rounded-2xl bg-gold-500/10 border border-gold-500/30 space-y-3">
          <h3 className="text-xs font-bold text-gold-400 uppercase tracking-wider flex items-center gap-1.5">
            <UserCheck className="w-4 h-4" /> Pending Access Requests ({pendingRequests.length})
          </h3>
          <div className="space-y-2">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-900/80 border border-white/10"
              >
                <div className="flex items-center gap-2.5">
                  <img src={req.userAvatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                  <span className="text-xs font-bold text-white">{req.userName}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => approvePlannerAccess(org.id, req.id)}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500 text-black text-xs font-bold hover:bg-emerald-400 transition flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3 h-3" /> Grant Access
                  </button>
                  <button
                    onClick={() => rejectPlannerAccess(org.id, req.id)}
                    className="px-2.5 py-1 rounded-lg bg-red-500/20 text-red-300 text-xs font-bold hover:bg-red-500/30 transition"
                  >
                    <XCircle className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes Grid */}
      {notes.length === 0 ? (
        <div className="glass-card rounded-2xl p-10 text-center space-y-2">
          <FileText className="w-10 h-10 text-neutral-600 mx-auto" />
          <p className="text-xs text-neutral-400">No planner notes created yet.</p>
          <p className="text-[11px] text-neutral-500">
            Click "+ New Planner Note" to create chapter agendas and confidential notes.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {notes.map((note) => (
            <div key={note.id} className="glass-card p-5 rounded-2xl space-y-3 flex flex-col">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-white">{note.title}</h3>
                  <p className="text-[10px] text-neutral-400">
                    By {note.createdByName} • {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {(isPrimaryAdmin || isSuperAdmin || note.createdBy === currentUser?.id) && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleStartEdit(note)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 transition"
                      title="Edit Note"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deletePlannerNote(org.id, note.id)}
                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition"
                      title="Delete Note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex-1 text-xs text-neutral-300 whitespace-pre-line leading-relaxed bg-black/30 p-3 rounded-xl border border-white/5 font-mono">
                {note.content}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD / EDIT NOTE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl border border-white/20 max-w-lg w-full space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-gold-400" />
              {editingNoteId ? 'Edit Planner Note' : 'Create Executive Note'}
            </h3>

            <form onSubmit={handleSaveNote} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-neutral-300 mb-1">Note Title / Agenda</label>
                <input
                  type="text"
                  required
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="e.g. Fall 2026 Step Show Budget & Logistics"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1">Content / Details</label>
                <textarea
                  rows={6}
                  required
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Write confidential executive notes, meeting bullet points, or task assignments..."
                  className="w-full p-3 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:border-gold-500 focus:outline-none font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-bold transition shadow-lg shadow-gold-500/20"
                >
                  {editingNoteId ? 'Update Note' : 'Save Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
