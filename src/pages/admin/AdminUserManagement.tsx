import React, { useState } from 'react';
import { 
  UserCheck, 
  Search, 
  Filter, 
  Plus, 
  Shield, 
  HardHat, 
  Power, 
  Edit3, 
  Mail, 
  Phone,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { AddUserModal } from '../../components/modals/AddUserModal';

export const AdminUserManagement: React.FC = () => {
  const { users, toggleUserStatus, mines, t } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.designation.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = selectedRole === 'all' || u.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || u.accountStatus === selectedStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleToggle = (id: string, name: string) => {
    toggleUserStatus(id);
    setToastMessage(`Account status updated for ${name}.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#E2DCD0] rounded-lg p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              {t.navUserManagement}
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-[#102A43] tracking-tight mt-0.5">
              Portal Access Governance & Role Authorizations
            </h1>
            <p className="text-xs text-[#64748B] mt-1">
              Role-based access control (RBAC) across field workers, inspectors, and executive administrators
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-md bg-[#102A43] text-white text-xs font-semibold hover:bg-[#1E3A8A] transition-colors flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.addUser}</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md text-xs text-emerald-800 flex items-center justify-between">
          <span>{toastMessage}</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
        </div>
      )}

      {/* Toolbar & Filters */}
      <div className="bg-white border border-[#E2DCD0] rounded-lg p-4 shadow-xs space-y-3 text-xs">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search user name, email, employee ID, or role..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-md border border-[#CBD5E1] bg-[#FAF9F6] text-xs text-[#102A43] focus:outline-none focus:border-[#102A43] focus:bg-white"
            />
            <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-2.5" />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedRole}
              onChange={e => setSelectedRole(e.target.value)}
              className="p-2 rounded-md border border-[#CBD5E1] bg-[#FAF9F6] text-xs text-[#102A43]"
            >
              <option value="all">All Roles</option>
              <option value="USER">Worker / Field User</option>
              <option value="ADMIN">System Administrator</option>
            </select>

            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="p-2 rounded-md border border-[#CBD5E1] bg-[#FAF9F6] text-xs text-[#102A43]"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-[#E2DCD0] rounded-lg shadow-xs overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#FAF9F6] border-b border-[#E2DCD0] text-[#64748B] uppercase text-[10px] tracking-wider font-semibold">
              <th className="p-3.5">User Identity</th>
              <th className="p-3.5">Access Role</th>
              <th className="p-3.5">Assigned Sector</th>
              <th className="p-3.5">Institutional Email</th>
              <th className="p-3.5">Contact Line</th>
              <th className="p-3.5">Account State</th>
              <th className="p-3.5">Last Login Session</th>
              <th className="p-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2DCD0]">
            {filteredUsers.map(u => (
              <tr key={u.id} className="hover:bg-[#FAF9F6] transition-colors">
                <td className="p-3.5">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={u.avatarUrl}
                      alt=""
                      className="w-8 h-8 rounded-full object-cover border border-[#CBD5E1]"
                    />
                    <div>
                      <span className="font-bold text-[#102A43] block">{u.name}</span>
                      <span className="font-mono text-[10px] text-[#64748B]">{u.employeeId}</span>
                    </div>
                  </div>
                </td>
                <td className="p-3.5">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                    u.role === 'ADMIN' ? 'bg-[#102A43] text-white' : 'bg-[#F5F1EB] text-[#102A43] border border-[#E2DCD0]'
                  }`}>
                    {u.role === 'ADMIN' ? <Shield className="w-3 h-3 text-[#F59E0B]" /> : <HardHat className="w-3 h-3 text-[#B45309]" />}
                    <span>{u.role}</span>
                  </span>
                </td>
                <td className="p-3.5 font-medium">{u.assignedMineName}</td>
                <td className="p-3.5 font-mono text-[11px] text-[#475569]">{u.email}</td>
                <td className="p-3.5 font-mono text-[11px] text-[#475569]">{u.primaryContact}</td>
                <td className="p-3.5">
                  <StatusBadge status={u.accountStatus} size="sm" />
                </td>
                <td className="p-3.5 text-[#64748B] text-[11px]">{u.lastLogin}</td>
                <td className="p-3.5 text-right">
                  <button
                    onClick={() => handleToggle(u.id, u.name)}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold border transition-colors ${
                      u.accountStatus === 'active'
                        ? 'text-red-700 border-red-200 hover:bg-red-50'
                        : 'text-emerald-700 border-emerald-200 hover:bg-emerald-50'
                    }`}
                  >
                    {u.accountStatus === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddUserModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>
  );
};
