import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  MapPin, 
  Eye, 
  Edit3, 
  HardHat, 
  Award,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';

export const AdminWorkerManagement: React.FC = () => {
  const { workers, mines, setSelectedWorker, t } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMine, setSelectedMine] = useState('all');
  const [selectedShift, setSelectedShift] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredWorkers = workers.filter(w => {
    const matchesSearch = 
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesMine = selectedMine === 'all' || w.assignedMineName === selectedMine;
    const matchesShift = selectedShift === 'all' || w.shift.includes(selectedShift);
    const matchesStatus = selectedStatus === 'all' || w.accountStatus === selectedStatus;

    return matchesSearch && matchesMine && matchesShift && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#E2DCD0] rounded-lg p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              {t.navWorkerManagement}
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-[#102A43] tracking-tight mt-0.5">
              Workforce Service Dossier & Roster Allocation
            </h1>
            <p className="text-xs text-[#64748B] mt-1">
              Active roster of shotfirers, mining sirdars, mechanical operators, and survey surveyors
            </p>
          </div>

          <div className="text-xs text-[#64748B] bg-[#FAF9F6] border border-[#E2DCD0] px-3 py-1.5 rounded-md">
            Showing <strong className="text-[#102A43]">{filteredWorkers.length}</strong> active worker profiles
          </div>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="bg-white border border-[#E2DCD0] rounded-lg p-4 shadow-xs space-y-3 text-xs">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by worker name, employee ID, designation, or skill..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-md border border-[#CBD5E1] bg-[#FAF9F6] text-xs text-[#102A43] focus:outline-none focus:border-[#102A43] focus:bg-white"
            />
            <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-2.5" />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedMine}
              onChange={e => setSelectedMine(e.target.value)}
              className="p-2 rounded-md border border-[#CBD5E1] bg-[#FAF9F6] text-xs text-[#102A43]"
            >
              <option value="all">All Mine Deployments</option>
              {mines.map(m => (
                <option key={m.id} value={m.name}>{m.name}</option>
              ))}
            </select>

            <select
              value={selectedShift}
              onChange={e => setSelectedShift(e.target.value)}
              className="p-2 rounded-md border border-[#CBD5E1] bg-[#FAF9F6] text-xs text-[#102A43]"
            >
              <option value="all">All Shifts</option>
              <option value="Shift 1">Shift 1 (06:00 - 14:00)</option>
              <option value="Shift 2">Shift 2 (14:00 - 22:00)</option>
              <option value="General Shift">General Shift (08:00 - 17:00)</option>
            </select>

            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="p-2 rounded-md border border-[#CBD5E1] bg-[#FAF9F6] text-xs text-[#102A43]"
            >
              <option value="all">All Account States</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive / Standby</option>
            </select>
          </div>
        </div>
      </div>

      {/* Workers Table */}
      <div className="bg-white border border-[#E2DCD0] rounded-lg shadow-xs overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#FAF9F6] border-b border-[#E2DCD0] text-[#64748B] uppercase text-[10px] tracking-wider font-semibold">
              <th className="p-3.5">Personnel Name & ID</th>
              <th className="p-3.5">Designation & Dept</th>
              <th className="p-3.5">Assigned Mine & Sector</th>
              <th className="p-3.5">Shift Schedule</th>
              <th className="p-3.5">Direct Supervisor</th>
              <th className="p-3.5">Competency Skills</th>
              <th className="p-3.5">Account State</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2DCD0]">
            {filteredWorkers.map(w => (
              <tr
                key={w.id}
                onClick={() => setSelectedWorker(w)}
                className="hover:bg-[#FAF9F6] transition-colors cursor-pointer"
              >
                <td className="p-3.5">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={w.avatarUrl}
                      alt=""
                      className="w-8 h-8 rounded-full object-cover border border-[#CBD5E1]"
                    />
                    <div>
                      <span className="font-bold text-[#102A43] block">{w.name}</span>
                      <span className="font-mono text-[10px] text-[#64748B]">{w.employeeId}</span>
                    </div>
                  </div>
                </td>
                <td className="p-3.5">
                  <span className="font-medium text-[#102A43] block">{w.designation}</span>
                  <span className="text-[11px] text-[#64748B]">{w.department}</span>
                </td>
                <td className="p-3.5">
                  <span className="font-semibold text-[#102A43] block">{w.assignedMineName}</span>
                  <span className="text-[11px] text-[#64748B]">{w.assignedZone}</span>
                </td>
                <td className="p-3.5 font-medium">{w.shift}</td>
                <td className="p-3.5">{w.supervisor}</td>
                <td className="p-3.5">
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {w.skills.slice(0, 2).map((skill, i) => (
                      <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-[#FAF9F6] border border-[#E2DCD0] text-[#475569]">
                        {skill}
                      </span>
                    ))}
                    {w.skills.length > 2 && (
                      <span className="text-[10px] text-[#64748B]">+{w.skills.length - 2}</span>
                    )}
                  </div>
                </td>
                <td className="p-3.5">
                  <StatusBadge status={w.accountStatus} size="sm" />
                </td>
                <td className="p-3.5 text-right">
                  <div className="flex items-center justify-end gap-1.5" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => setSelectedWorker(w)}
                      className="p-1.5 text-[#64748B] hover:text-[#102A43] hover:bg-[#F5F1EB] rounded text-[11px] font-semibold flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Profile</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
