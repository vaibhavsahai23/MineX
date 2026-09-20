import React, { useState } from 'react';
import { 
  ClipboardList, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  HardHat, 
  MapPin, 
  Wrench, 
  User, 
  Phone,
  ShieldCheck,
  FileCheck,
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { TaskStatus } from '../../types';

interface MilestoneItem {
  id: string;
  task: string;
  completed: boolean;
}

export const UserAssignment: React.FC = () => {
  const { assignment, updateAssignmentStatus, t } = useApp();

  const [milestones, setMilestones] = useState<MilestoneItem[]>([
    { id: 'm-1', task: 'Bench slope & highwall crest visual inspection (Bench 3 East)', completed: true },
    { id: 'm-2', task: 'Calibrate multi-gas detector for CO, SO2 & flammable particulates', completed: true },
    { id: 'm-3', task: 'Verify electronic delay detonator telemetry & wiring continuity', completed: false },
    { id: 'm-4', task: 'Establish 300m HEMM equipment standoff exclusion zone', completed: false },
    { id: 'm-5', task: 'Radio confirmation to Shift In-Charge before blasting window', completed: false }
  ]);

  const [reportNote, setReportNote] = useState('');
  const [reportedSuccess, setReportedSuccess] = useState(false);

  const toggleMilestone = (id: string) => {
    const updated = milestones.map(item => item.id === id ? { ...item, completed: !item.completed } : item);
    setMilestones(updated);

    const allDone = updated.every(i => i.completed);
    if (allDone) {
      updateAssignmentStatus('completed');
    } else {
      updateAssignmentStatus('in_progress');
    }
  };

  const handleStatusChange = (newStatus: TaskStatus) => {
    updateAssignmentStatus(newStatus);
  };

  const handleSendReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportNote.trim()) return;
    setReportedSuccess(true);
    setTimeout(() => {
      setReportedSuccess(false);
      setReportNote('');
    }, 3500);
  };

  const allocatedEquipment = [
    'Komatsu PC2000 Face Shovel (Fleet #SH-04)',
    'Cat 777D Dump Truck 100T (Fleet #DT-18)',
    'Atlas Copco Blast Hole Drill Rig (Fleet #DR-02)'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#E2DCD0] rounded-lg p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              {t.navMyAssignment}
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-[#102A43] tracking-tight mt-0.5">
              {assignment.taskTitle}
            </h1>
            <p className="text-xs text-[#64748B] mt-1 flex flex-wrap items-center gap-2">
              <span className="font-mono text-[#102A43] font-bold">{assignment.assignmentId}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#64748B]" />
                {assignment.mineName} ({assignment.zone})
              </span>
              <span>•</span>
              <span>{assignment.shift} ({assignment.shiftTiming})</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#64748B]">Status:</span>
            <select
              value={assignment.status}
              onChange={e => handleStatusChange(e.target.value as TaskStatus)}
              className="p-2 rounded-md border border-[#CBD5E1] bg-[#FAF9F6] text-xs font-semibold text-[#102A43] focus:outline-none"
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="on_hold">On Hold</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Details + Checklist + Report */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols */}
        <div className="lg:col-span-2 space-y-6">
          {/* Objective Synopsis */}
          <div className="bg-white border border-[#E2DCD0] rounded-lg p-5 shadow-xs">
            <h3 className="text-xs font-bold text-[#102A43] uppercase tracking-wider mb-2">
              Operational Directive & Scope
            </h3>
            <p className="text-xs text-[#475569] leading-relaxed">
              {assignment.taskDescription}
            </p>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-2.5 bg-[#FAF9F6] rounded border border-[#E2DCD0]">
                <span className="text-[#64748B] text-[11px] block">Priority</span>
                <StatusBadge status={assignment.priority} size="sm" />
              </div>
              <div className="p-2.5 bg-[#FAF9F6] rounded border border-[#E2DCD0]">
                <span className="text-[#64748B] text-[11px] block">Current State</span>
                <StatusBadge status={assignment.status} size="sm" />
              </div>
              <div className="p-2.5 bg-[#FAF9F6] rounded border border-[#E2DCD0]">
                <span className="text-[#64748B] text-[11px] block">Reporting Lead</span>
                <span className="font-semibold text-[#102A43] text-[11px] mt-0.5 block truncate">{assignment.supervisor}</span>
              </div>
              <div className="p-2.5 bg-[#FAF9F6] rounded border border-[#E2DCD0]">
                <span className="text-[#64748B] text-[11px] block">Target Finish</span>
                <span className="font-semibold text-[#102A43] text-[11px] mt-0.5 block">{assignment.expectedCompletion}</span>
              </div>
            </div>
          </div>

          {/* Task Checklist (Interactive) */}
          <div className="bg-white border border-[#E2DCD0] rounded-lg p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#F1EFEA] pb-3 mb-4">
              <div>
                <h3 className="text-xs font-bold text-[#102A43] uppercase tracking-wider">
                  Mandatory Task Milestones
                </h3>
                <span className="text-xs text-[#64748B]">Click milestone to attest field completion</span>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 bg-[#FAF9F6] border border-[#E2DCD0] rounded text-[#102A43]">
                {milestones.filter(c => c.completed).length} of {milestones.length} Complete
              </span>
            </div>

            <div className="space-y-2.5">
              {milestones.map(item => (
                <div
                  key={item.id}
                  onClick={() => toggleMilestone(item.id)}
                  className={`p-3 rounded-lg border text-xs flex items-center justify-between cursor-pointer transition-colors ${
                    item.completed
                      ? 'bg-[#F0FDF4] border-emerald-200 text-emerald-900'
                      : 'bg-white border-[#E2DCD0] hover:bg-[#FAF9F6] text-[#102A43]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className={`w-4 h-4 shrink-0 ${item.completed ? 'text-emerald-600' : 'text-[#CBD5E1]'}`} />
                    <span className={item.completed ? 'line-through opacity-70 font-medium' : 'font-medium'}>
                      {item.task}
                    </span>
                  </div>
                  <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-[#64748B]">
                    {item.completed ? 'VERIFIED' : 'PENDING'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Safety Protocols */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-800" />
              <h3 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                DGMS Statutory Safety Directives for This Operation
              </h3>
            </div>
            <ul className="space-y-2 text-xs text-amber-900">
              {assignment.safetyInstructions.map((instruction, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-700 shrink-0 mt-1.5" />
                  <span>{instruction}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right 1 Col: Machinery, Supervisor, Shift Telemetry */}
        <div className="space-y-6">
          {/* Allocated Machinery */}
          <div className="bg-white border border-[#E2DCD0] rounded-lg p-5 shadow-xs">
            <h3 className="text-xs font-bold text-[#102A43] uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-[#B45309]" />
              <span>Assigned Heavy Machinery (HEMM)</span>
            </h3>
            <div className="space-y-2">
              {allocatedEquipment.map((eq, i) => (
                <div key={i} className="p-2.5 bg-[#FAF9F6] rounded border border-[#E2DCD0] text-xs">
                  <span className="font-semibold text-[#102A43] block">{eq}</span>
                  <span className="text-[10px] text-emerald-700">Calibrated & Certified for Active Shift</span>
                </div>
              ))}
            </div>
          </div>

          {/* Shift Supervisor Card */}
          <div className="bg-white border border-[#E2DCD0] rounded-lg p-5 shadow-xs">
            <h3 className="text-xs font-bold text-[#102A43] uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#102A43]" />
              <span>Designated Shift In-Charge</span>
            </h3>
            <div className="p-3 bg-[#FAF9F6] rounded border border-[#E2DCD0] text-xs space-y-1.5">
              <div className="font-bold text-[#102A43]">{assignment.supervisor}</div>
              <div className="text-[11px] text-[#64748B]">Senior Pit Supervisor (Zone B)</div>
              <div className="pt-2 border-t border-[#EAE5DC] flex items-center gap-1 text-[11px] text-[#102A43] font-mono">
                <Phone className="w-3 h-3 text-[#64748B]" />
                <span>+91 94311 00218</span>
              </div>
            </div>
          </div>

          {/* Related Documents */}
          <div className="bg-white border border-[#E2DCD0] rounded-lg p-5 shadow-xs">
            <h3 className="text-xs font-bold text-[#102A43] uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#102A43]" />
              <span>Attached SOPs & Clearances</span>
            </h3>
            <div className="space-y-2 text-xs">
              {assignment.relatedDocuments.map((doc, i) => (
                <div key={i} className="p-2.5 bg-[#FAF9F6] rounded border border-[#E2DCD0]">
                  <span className="font-semibold text-[#102A43] block">{doc.title}</span>
                  <span className="text-[10px] text-[#64748B] font-mono">{doc.docId}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Shift Telemetry / Feedback Submission */}
          <div className="bg-white border border-[#E2DCD0] rounded-lg p-5 shadow-xs">
            <h3 className="text-xs font-bold text-[#102A43] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-blue-700" />
              <span>Field Telemetry Log</span>
            </h3>
            <p className="text-xs text-[#64748B] mb-3">
              Log bench clearance, explosive cartridge counts, or safety observations.
            </p>

            {reportedSuccess ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Field telemetry transmitted to Shift In-Charge.</span>
              </div>
            ) : (
              <form onSubmit={handleSendReport} className="space-y-2 text-xs">
                <textarea
                  rows={3}
                  value={reportNote}
                  onChange={e => setReportNote(e.target.value)}
                  placeholder="Record observations (e.g. Bench 3 East cleared; water dampening active)..."
                  className="w-full p-2.5 rounded border border-[#CBD5E1] bg-[#FAF9F6] text-xs focus:outline-none focus:border-[#102A43]"
                />
                <button
                  type="submit"
                  disabled={!reportNote.trim()}
                  className="w-full py-2 rounded bg-[#102A43] text-white font-semibold hover:bg-[#1E3A8A] disabled:opacity-40 transition-colors"
                >
                  Submit Shift Attestation
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
