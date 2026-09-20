import React, { useState } from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Award, 
  Clock, 
  Edit3, 
  Check, 
  HardHat, 
  AlertCircle 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { Worker } from '../../types';

export const WorkerDetailModal: React.FC = () => {
  const { selectedWorker, setSelectedWorker, updateWorker, mines, t } = useApp();
  const [isEditing, setIsEditing] = useState(false);

  // Edit state
  const [editMine, setEditMine] = useState('');
  const [editZone, setEditZone] = useState('');
  const [editShift, setEditShift] = useState('');
  const [editSupervisor, setEditSupervisor] = useState('');

  if (!selectedWorker) return null;

  const handleStartEdit = () => {
    setEditMine(selectedWorker.assignedMineName);
    setEditZone(selectedWorker.assignedZone);
    setEditShift(selectedWorker.shift);
    setEditSupervisor(selectedWorker.supervisor);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    const matchedMine = mines.find(m => m.name === editMine);
    updateWorker({
      ...selectedWorker,
      assignedMineId: matchedMine ? matchedMine.id : selectedWorker.assignedMineId,
      assignedMineName: editMine,
      assignedZone: editZone,
      shift: editShift,
      supervisor: editSupervisor
    });
    setIsEditing(false);
  };

  return (
    <Modal
      isOpen={!!selectedWorker}
      onClose={() => {
        setIsEditing(false);
        setSelectedWorker(null);
      }}
      title={selectedWorker.name}
      subtitle={`${selectedWorker.designation} • ${selectedWorker.employeeId}`}
      maxWidth="4xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-[11px] text-[#64748B]">
            Last Activity: {selectedWorker.lastActivity}
          </span>
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <>
                <button
                  onClick={handleStartEdit}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-[#F5F1EB] text-[#102A43] hover:bg-[#EAE5DC] border border-[#E2DCD0]"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Assign Shift / Mine</span>
                </button>
                <button
                  onClick={() => setSelectedWorker(null)}
                  className="px-4 py-1.5 rounded-md text-xs font-medium bg-[#102A43] text-white hover:bg-[#1E3A8A]"
                >
                  {t.close}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 rounded-md text-xs font-medium text-[#64748B] hover:bg-[#F5F1EB] border border-[#E2DCD0]"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-3.5 py-1.5 rounded-md text-xs font-medium bg-[#102A43] text-white hover:bg-[#1E3A8A]"
                >
                  {t.save}
                </button>
              </>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Profile Card Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-[#FAF9F6] border border-[#E2DCD0] rounded-lg">
          <img
            src={selectedWorker.avatarUrl}
            alt=""
            className="w-16 h-16 rounded-full object-cover border-2 border-[#CBD5E1]"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[#102A43]">{selectedWorker.name}</h3>
              <StatusBadge status={selectedWorker.accountStatus} size="sm" />
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              {selectedWorker.department} • Member since {selectedWorker.joiningDate}
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-[#475569]">
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-[#64748B]" />
                {selectedWorker.contactNumber}
              </span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-[#64748B]" />
                {selectedWorker.email}
              </span>
            </div>
          </div>
        </div>

        {/* Reassignment Form or Display */}
        {isEditing ? (
          <div className="p-4 bg-white border border-[#E2DCD0] rounded-lg space-y-3 text-xs">
            <h4 className="font-bold text-[#102A43] uppercase tracking-wider">
              Operational Reassignment
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-[#102A43] mb-1">Assigned Mine</label>
                <select
                  value={editMine}
                  onChange={e => setEditMine(e.target.value)}
                  className="w-full p-2 rounded border border-[#CBD5E1] bg-white text-xs"
                >
                  {mines.map(m => (
                    <option key={m.id} value={m.name}>{m.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold text-[#102A43] mb-1">Working Zone</label>
                <input
                  type="text"
                  value={editZone}
                  onChange={e => setEditZone(e.target.value)}
                  className="w-full p-2 rounded border border-[#CBD5E1] bg-white text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#102A43] mb-1">Shift Schedule</label>
                <input
                  type="text"
                  value={editShift}
                  onChange={e => setEditShift(e.target.value)}
                  className="w-full p-2 rounded border border-[#CBD5E1] bg-white text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#102A43] mb-1">Designated Supervisor</label>
                <input
                  type="text"
                  value={editSupervisor}
                  onChange={e => setEditSupervisor(e.target.value)}
                  className="w-full p-2 rounded border border-[#CBD5E1] bg-white text-xs"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-white border border-[#E2DCD0] rounded-md">
              <span className="text-[#64748B] block text-[11px]">Mine Sector</span>
              <span className="font-semibold text-[#102A43] mt-0.5 block">{selectedWorker.assignedMineName}</span>
            </div>
            <div className="p-3 bg-white border border-[#E2DCD0] rounded-md">
              <span className="text-[#64748B] block text-[11px]">Working Zone</span>
              <span className="font-semibold text-[#102A43] mt-0.5 block">{selectedWorker.assignedZone}</span>
            </div>
            <div className="p-3 bg-white border border-[#E2DCD0] rounded-md">
              <span className="text-[#64748B] block text-[11px]">Shift Timing</span>
              <span className="font-semibold text-[#102A43] mt-0.5 block">{selectedWorker.shift}</span>
            </div>
            <div className="p-3 bg-white border border-[#E2DCD0] rounded-md">
              <span className="text-[#64748B] block text-[11px]">Shift Supervisor</span>
              <span className="font-semibold text-[#102A43] mt-0.5 block">{selectedWorker.supervisor}</span>
            </div>
          </div>
        )}

        {/* Current Task */}
        <div className="p-4 bg-white border border-[#E2DCD0] rounded-lg">
          <h4 className="text-xs font-bold text-[#102A43] uppercase tracking-wider mb-1.5">
            Active Work Assignment
          </h4>
          <p className="text-xs text-[#475569] leading-relaxed">
            {selectedWorker.currentWorkAssignment}
          </p>
        </div>

        {/* Skills & Certifications */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-white border border-[#E2DCD0] rounded-lg">
            <h4 className="text-xs font-bold text-[#102A43] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <HardHat className="w-3.5 h-3.5 text-[#B45309]" />
              <span>Technical Skills</span>
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {selectedWorker.skills.map((skill, i) => (
                <span key={i} className="text-[11px] px-2 py-0.5 bg-[#FAF9F6] border border-[#E2DCD0] rounded text-[#334155]">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 bg-white border border-[#E2DCD0] rounded-lg">
            <h4 className="text-xs font-bold text-[#102A43] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-blue-700" />
              <span>DGMS Certifications & Endorsements</span>
            </h4>
            <ul className="space-y-1 text-xs text-[#475569]">
              {selectedWorker.certifications.map((cert, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{cert}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="p-3 bg-[#FAF9F6] border border-[#E2DCD0] rounded-md text-xs flex items-center justify-between">
          <div>
            <span className="font-semibold text-[#102A43]">Emergency Contact:</span>{' '}
            <span className="text-[#475569]">{selectedWorker.emergencyContact.name} ({selectedWorker.emergencyContact.relation})</span>
          </div>
          <span className="font-mono font-medium text-[#102A43]">{selectedWorker.emergencyContact.phone}</span>
        </div>
      </div>
    </Modal>
  );
};
