import React from 'react';
import { 
  ClipboardList, 
  MapPin, 
  Clock, 
  FileText, 
  HardHat, 
  ChevronRight, 
  ShieldAlert,
  Bot,
  Phone,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Bell,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { TaskStatus } from '../../types';

export const UserDashboard: React.FC = () => {
  const { 
    currentUser, 
    assignment, 
    mines, 
    documents, 
    notifications,
    updateAssignmentStatus,
    setSelectedDoc, 
    setSelectedMine, 
    navigate,
    t 
  } = useApp();

  const assignedMine = mines.find(m => m.id === currentUser.assignedMineId) || mines[0];
  const relevantDocs = documents.filter(
    d => d.mineId === currentUser.assignedMineId || d.mineId === 'mine-01' || d.isOfficialSource
  ).slice(0, 4);

  const urgentNotifs = notifications.filter(n => n.targetRole === 'ALL' || n.targetRole === 'USER').slice(0, 3);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Welcome / Identity Banner */}
      <div className="bg-white border border-[#E2DCD0] rounded-lg p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <img 
              src="/minex-logo.jpg" 
              alt="MineX" 
              className="w-12 h-12 rounded-lg object-contain border border-[#E2DCD0] bg-black shrink-0 hidden sm:block"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                  Field Operations Dashboard
                </span>
                <span className="w-1 h-1 rounded-full bg-[#CBD5E1]" />
                <span className="text-xs font-mono text-[#64748B]">{currentUser.employeeId}</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] bg-[#F5F1EB] text-[#64748B] border border-[#E2DCD0]">
                  DEMO RECORD
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#102A43] tracking-tight">
                Welcome, {currentUser.name}
              </h1>
              <p className="mt-1 text-xs text-[#64748B]">
                {currentUser.designation} • {currentUser.department}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => navigate('/user/assignment')}
              className="px-3.5 py-2 rounded-md bg-[#102A43] text-white text-xs font-semibold hover:bg-[#1B365D] transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <ClipboardList className="w-3.5 h-3.5" />
              <span>{t.navMyAssignment}</span>
            </button>
            <button
              onClick={() => navigate('/user/assist')}
              className="px-3.5 py-2 rounded-md bg-[#FAF9F6] text-[#102A43] text-xs font-semibold hover:bg-[#F5F1EB] border border-[#E2DCD0] transition-colors flex items-center gap-1.5"
            >
              <Bot className="w-3.5 h-3.5 text-[#B45309]" />
              <span>Ask Mine Assist</span>
            </button>
          </div>
        </div>
      </div>

      {/* Core Immediate Needs Grid: Where am I? What shift? Who is supervisor? */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 3. Assigned Mine and Working Zone */}
        <div className="bg-white border border-[#E2DCD0] rounded-lg p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[#64748B] mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Assigned Mine & Zone</span>
              <MapPin className="w-4 h-4 text-[#B45309]" />
            </div>
            <h3 className="font-bold text-sm text-[#102A43]">{assignedMine.name}</h3>
            <p className="text-xs text-[#64748B] mt-0.5">{assignedMine.location} ({assignedMine.state})</p>
            
            <div className="mt-3 p-2.5 rounded bg-[#FAF9F6] border border-[#E2DCD0] text-xs">
              <span className="text-[11px] text-[#64748B] block">Current Pit Sector:</span>
              <span className="font-semibold text-[#102A43]">{currentUser.assignedZone}</span>
            </div>
          </div>

          <button
            onClick={() => setSelectedMine(assignedMine)}
            className="mt-4 text-xs text-[#B45309] hover:text-[#92400E] font-semibold flex items-center gap-1"
          >
            <span>View Mine Details</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4. Current Shift */}
        <div className="bg-white border border-[#E2DCD0] rounded-lg p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[#64748B] mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Current Shift</span>
              <Clock className="w-4 h-4 text-[#B45309]" />
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="font-bold text-sm text-[#102A43]">{currentUser.shift}</h3>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">{assignment.shiftTiming}</p>

            <div className="mt-3 p-2.5 rounded bg-[#FAF9F6] border border-[#E2DCD0] text-xs flex justify-between items-center">
              <span className="text-[#64748B]">Remaining in Shift:</span>
              <span className="font-mono font-bold text-emerald-800">3h 45m</span>
            </div>
          </div>

          <div className="mt-4 text-xs text-[#64748B] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#102A43]" />
            <span>Muster status: In-pit verified</span>
          </div>
        </div>

        {/* 5. Supervisor and Contact */}
        <div className="bg-white border border-[#E2DCD0] rounded-lg p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[#64748B] mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Supervisor & In-Charge</span>
              <Phone className="w-4 h-4 text-[#B45309]" />
            </div>
            <h3 className="font-bold text-sm text-[#102A43]">{currentUser.supervisor}</h3>
            <p className="text-xs text-[#64748B] mt-0.5">VHF Radio Channel 4 • Pit Safety Division</p>

            <div className="mt-3 p-2.5 rounded bg-[#FAF9F6] border border-[#E2DCD0] text-xs">
              <span className="text-[11px] text-[#64748B] block">Emergency Contact:</span>
              <span className="font-medium text-[#102A43]">{currentUser.emergencyContact.name} ({currentUser.emergencyContact.phone})</span>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <a
              href="tel:+919431100218"
              className="flex-1 py-1.5 px-2.5 rounded border border-[#E2DCD0] bg-[#FAF9F6] hover:bg-[#F5F1EB] text-xs font-semibold text-[#102A43] flex items-center justify-center gap-1"
            >
              <Phone className="w-3 h-3 text-[#B45309]" />
              <span>Call</span>
            </a>
            <button
              onClick={() => navigate('/user/assist')}
              className="flex-1 py-1.5 px-2.5 rounded border border-[#E2DCD0] bg-[#FAF9F6] hover:bg-[#F5F1EB] text-xs font-semibold text-[#102A43] flex items-center justify-center gap-1"
            >
              <MessageSquare className="w-3 h-3 text-[#B45309]" />
              <span>Dispatch Note</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Today's Assignment (Primary Task & Status Control) */}
      <div className="bg-white border border-[#E2DCD0] rounded-lg p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F1EFEA] pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                Today's Assigned Task
              </span>
              <span className="w-1 h-1 rounded-full bg-[#CBD5E1]" />
              <span className="text-xs font-mono text-[#64748B]">{assignment.assignmentId}</span>
            </div>
            <h2 className="text-lg font-bold text-[#102A43]">
              {assignment.taskTitle}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#64748B]">Task Status:</span>
            <StatusBadge status={assignment.status} />
          </div>
        </div>

        {/* Operational Directive */}
        <div className="p-4 rounded-md bg-[#FAF9F6] border border-[#E2DCD0] text-xs text-[#334155] leading-relaxed mb-4">
          <span className="font-bold text-[#102A43] block mb-1">Operational Directive:</span>
          {assignment.taskDescription}
        </div>

        {/* Interactive Milestone Status Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#64748B]">Update Task Progress:</span>
            <div className="flex gap-1.5">
              {(['in_progress', 'completed', 'on_hold'] as TaskStatus[]).map((st) => (
                <button
                  key={st}
                  onClick={() => updateAssignmentStatus(st)}
                  className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
                    assignment.status === st
                      ? 'bg-[#102A43] text-white border-[#102A43]'
                      : 'bg-white text-[#475569] border-[#CBD5E1] hover:bg-[#F5F1EB]'
                  }`}
                >
                  {st === 'in_progress' ? 'In Progress' : st === 'completed' ? 'Mark Completed' : 'Put On Hold'}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate('/user/assignment')}
            className="text-xs font-semibold text-[#102A43] hover:underline flex items-center gap-1"
          >
            <span>View Full Assignment Directive & Safety Protocols</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Two Columns: 6. Relevant Documents & 7. Important Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 6. Relevant Documents */}
        <div className="bg-white border border-[#E2DCD0] rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#F1EFEA] pb-3 mb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#B45309]" />
              <h3 className="font-bold text-sm text-[#102A43]">Relevant Shift Documents</h3>
            </div>
            <button
              onClick={() => navigate('/user/documents')}
              className="text-xs text-[#B45309] hover:underline font-semibold"
            >
              Browse All
            </button>
          </div>

          <div className="space-y-2.5">
            {relevantDocs.map((doc) => (
              <div
                key={doc.id}
                onClick={() => setSelectedDoc(doc)}
                className="p-3 rounded-md bg-[#FAF9F6] hover:bg-[#F5F1EB] border border-[#E2DCD0] transition-colors cursor-pointer flex items-center justify-between"
              >
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-1.5">
                    {doc.isOfficialSource && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                        OFFICIAL
                      </span>
                    )}
                    <span className="font-semibold text-xs text-[#102A43] truncate block">
                      {doc.title}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#64748B] mt-0.5">
                    {doc.docType} • {doc.sourceOrganization} • {doc.year}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#94A3B8] shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* 7. Important Notifications & Safety Advisories */}
        <div className="bg-white border border-[#E2DCD0] rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#F1EFEA] pb-3 mb-3">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#B45309]" />
              <h3 className="font-bold text-sm text-[#102A43]">Safety & Operational Notices</h3>
            </div>
            <button
              onClick={() => navigate('/user/notifications')}
              className="text-xs text-[#B45309] hover:underline font-semibold"
            >
              View All
            </button>
          </div>

          <div className="space-y-2.5">
            {urgentNotifs.map((n) => (
              <div
                key={n.id}
                className="p-3 rounded-md bg-[#FAF9F6] border border-[#E2DCD0] text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#102A43] flex items-center gap-1.5">
                    {n.type === 'safety' && <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />}
                    {n.title}
                  </span>
                  <span className="text-[10px] text-[#64748B]">{n.timestamp}</span>
                </div>
                <p className="text-[#475569] leading-relaxed">{n.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 8. Mine Assist Fast Prompt Bar */}
      <div className="bg-[#FAF9F6] border border-[#E2DCD0] rounded-lg p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#102A43] text-amber-400 flex items-center justify-center shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#102A43]">Need Immediate Technical Guidance?</h4>
            <p className="text-xs text-[#64748B]">
              Ask Mine Assist about DGMS blast exclusion barriers, borehole stratigraphy, or shift safety directives.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/user/assist')}
          className="px-4 py-2.5 rounded-md bg-[#102A43] hover:bg-[#1B365D] text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 shadow-2xs"
        >
          <span>Ask Mine Assist</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
