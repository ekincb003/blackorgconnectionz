'use client';

import React, { useState } from 'react';
import { Organization } from '../../types';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { X, Crown, AlertTriangle, Check } from 'lucide-react';

interface TransferAdminModalProps {
  org: Organization;
  onClose: () => void;
}

export default function TransferAdminModal({ org, onClose }: TransferAdminModalProps) {
  const { transferAdminRights } = useData();
  const { currentUser } = useAuth();
  const [selectedUserId, setSelectedUserId] = useState<string>('');

  const eligibleMembers = org.members.filter((m) => m.userId !== currentUser?.id);

  const handleTransfer = () => {
    if (!selectedUserId) return;
    const target = org.members.find((m) => m.userId === selectedUserId);
    if (confirm(`Are you sure you want to transfer primary admin rights of ${org.shortName} to ${target?.userName}?`)) {
      transferAdminRights(org.id, selectedUserId);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-panel max-w-md w-full rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-neutral-950/80">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Crown className="w-4 h-4 text-gold-400" /> Transfer Primary Admin Rights
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/5 text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p>
              Transferring leadership will make the chosen member the Primary Admin & President. You will retain normal membership.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-2">
              Select New President / Primary Admin:
            </label>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {eligibleMembers.map((member) => (
                <label
                  key={member.userId}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                    selectedUserId === member.userId
                      ? 'bg-gold-500/15 border-gold-500/50 text-white'
                      : 'bg-neutral-900 border-white/5 text-neutral-300 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={member.userAvatar}
                      alt={member.userName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-xs font-bold text-white">{member.userName}</p>
                      <p className="text-[11px] text-neutral-400">{member.position}</p>
                    </div>
                  </div>

                  <input
                    type="radio"
                    name="newAdmin"
                    value={member.userId}
                    checked={selectedUserId === member.userId}
                    onChange={() => setSelectedUserId(member.userId)}
                    className="text-gold-500"
                  />
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-white/10 bg-neutral-950/80 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-300 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleTransfer}
            disabled={!selectedUserId}
            className="px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-black font-bold text-xs transition"
          >
            Confirm Transfer
          </button>
        </div>
      </div>
    </div>
  );
}
