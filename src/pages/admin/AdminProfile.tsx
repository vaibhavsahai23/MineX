import React, { useState } from 'react';
import { 
  Shield, 
  Building2, 
  Key, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Globe,
  Check,
  Lock,
  Layers,
  Users,
  FileText,
  UserCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminProfile: React.FC = () => {
  const { currentAdmin, currentLang, setLanguage, t } = useApp();
  const [copied, setCopied] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard?.writeText?.(currentAdmin.adminId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const auditLogs = [
    {
      id: 'AUD-902',
      action: 'Granted Field Operative Access',
      target: 'Rameshwar Soren (Rajmahal OCP - Pit Face Zone B)',
      timestamp: 'Today, 09:15 hrs',
      status: 'VERIFIED'
    },
    {
      id: 'AUD-901',
      action: 'Statutory Document Ingestion',
      target: 'DGMS Technical Circular No. 04 of 2024 (Safe Blasting Distance Standards)',
      timestamp: 'Today, 08:30 hrs',
      status: 'VERIFIED'
    },
    {
      id: 'AUD-899',
      action: 'National Coal Inventory Synchronization',
      target: 'Synchronized 378.21 BT Geological Coal Inventory from Ministry of Coal 2023-24',
      timestamp: '15 Mar 2025, 14:20 hrs',
      status: 'VERIFIED'
    },
    {
      id: 'AUD-897',
      action: 'Safety Induction Parameter Update',
      target: 'Mandatory DGMS Gas Testing threshold check for Under-Ground seam ventilations',
      timestamp: '12 Mar 2025, 11:00 hrs',
      status: 'VERIFIED'
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white border border-[#E2DCD0] rounded-lg p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <img 
              src="/minex-logo.jpg" 
              alt="MineX Logo" 
              className="w-12 h-12 rounded-lg object-contain border border-[#E2DCD0] bg-black shrink-0 hidden sm:block"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                  Directorate Administrator Dossier
                </span>
                <span className="w-1 h-1 rounded-full bg-[#CBD5E1]" />
                <span className="text-xs font-mono text-[#64748B]">{currentAdmin.adminId}</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                  ACTIVE AUTHORITY
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#102A43] tracking-tight">
                {currentAdmin.name}
              </h1>
              <p className="text-xs text-[#64748B]">
                {currentAdmin.designation} • {currentAdmin.organization}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Officer Credentials Card */}
        <div className="space-y-6">
          <div className="bg-white border border-[#E2DCD0] rounded-lg p-5 shadow-xs text-center">
            <div className="relative inline-block mx-auto mb-3">
              <img
                src={currentAdmin.avatarUrl}
                alt="Admin Avatar"
                className="w-24 h-24 rounded-full object-cover border-4 border-[#FAF9F6] shadow-xs"
              />
              <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>

            <h2 className="text-base font-bold text-[#102A43]">{currentAdmin.name}</h2>
            <p className="text-xs text-[#64748B]">{currentAdmin.designation}</p>

            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#102A43] text-white text-xs font-semibold">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentAdmin.accessLevel}</span>
            </div>

            <div className="mt-5 pt-4 border-t border-[#F1EFEA] text-left space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[#64748B]">Officer ID:</span>
                <button 
                  onClick={handleCopyId}
                  className="font-mono font-bold text-[#102A43] hover:underline flex items-center gap-1"
                  title="Click to copy"
                >
                  <span>{currentAdmin.adminId}</span>
                  {copied && <Check className="w-3 h-3 text-emerald-600" />}
                </button>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Organization:</span>
                <span className="font-medium text-[#102A43] text-right truncate max-w-[170px]">{currentAdmin.organization}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Department:</span>
                <span className="font-medium text-[#102A43] text-right truncate max-w-[170px]">{currentAdmin.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">HQ Station:</span>
                <span className="font-medium text-[#102A43] text-right truncate max-w-[170px]">{currentAdmin.workLocation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Official Contact:</span>
                <span className="font-mono font-medium text-[#102A43]">{currentAdmin.primaryContact}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Govt. Email:</span>
                <span className="font-medium text-[#102A43] truncate max-w-[170px]">{currentAdmin.officialEmail}</span>
              </div>
            </div>
          </div>

          {/* Security & Credentials Section */}
          <div className="bg-white border border-[#E2DCD0] rounded-lg p-5 shadow-xs">
            <h3 className="text-xs font-bold text-[#102A43] uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#B45309]" />
              <span>Security & Credentials</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded bg-[#FAF9F6] border border-[#E2DCD0] flex items-center justify-between">
                <div>
                  <div className="font-semibold text-[#102A43]">Simulated Admin Access Key</div>
                  <div className="text-[11px] text-[#64748B]">Prototype authorization key</div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  XYZW (Active)
                </span>
              </div>

              <div className="p-3 rounded bg-[#FAF9F6] border border-[#E2DCD0] flex items-center justify-between">
                <div>
                  <div className="font-semibold text-[#102A43]">Two-Factor Authentication</div>
                  <div className="text-[11px] text-[#64748B]">Mandatory Directorate OTP</div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Enabled
                </span>
              </div>

              <div className="p-3 rounded bg-[#FAF9F6] border border-[#E2DCD0] flex items-center justify-between">
                <div>
                  <div className="font-semibold text-[#102A43]">Session Security Level</div>
                  <div className="text-[11px] text-[#64748B]">Directorate PKI Level 1</div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                  Air-Gapped / SSO
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: System Responsibilities & Audit Log */}
        <div className="lg:col-span-2 space-y-6">
          {/* System Responsibilities */}
          <div className="bg-white border border-[#E2DCD0] rounded-lg p-5 shadow-xs">
            <h3 className="text-xs font-bold text-[#102A43] uppercase tracking-wider mb-3">
              System Responsibilities & Authority
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded bg-[#FAF9F6] border border-[#E2DCD0]">
                <div className="flex items-center gap-2 text-[#102A43] font-bold mb-1">
                  <Layers className="w-4 h-4 text-[#B45309]" />
                  <span>Mines Supervised</span>
                </div>
                <p className="text-[#64748B] text-[11px] leading-relaxed">
                  Full statutory oversight across 6 active CIL subsidiary coalfields (Rajmahal, Jharia, Dipka, Gevra, Wardha, Singrauli).
                </p>
              </div>

              <div className="p-3 rounded bg-[#FAF9F6] border border-[#E2DCD0]">
                <div className="flex items-center gap-2 text-[#102A43] font-bold mb-1">
                  <UserCheck className="w-4 h-4 text-[#B45309]" />
                  <span>User Access Management</span>
                </div>
                <p className="text-[#64748B] text-[11px] leading-relaxed">
                  Primary Directorate clearance authority for approving and suspending field operative accounts and contractor muster rolls.
                </p>
              </div>

              <div className="p-3 rounded bg-[#FAF9F6] border border-[#E2DCD0]">
                <div className="flex items-center gap-2 text-[#102A43] font-bold mb-1">
                  <FileText className="w-4 h-4 text-[#B45309]" />
                  <span>Document Management</span>
                </div>
                <p className="text-[#64748B] text-[11px] leading-relaxed">
                  Repository gatekeeper for geological exploration reports, DGMS circulars, environmental clearance orders, and borehole logs.
                </p>
              </div>

              <div className="p-3 rounded bg-[#FAF9F6] border border-[#E2DCD0]">
                <div className="flex items-center gap-2 text-[#102A43] font-bold mb-1">
                  <Shield className="w-4 h-4 text-[#B45309]" />
                  <span>Data Provenance Verification</span>
                </div>
                <p className="text-[#64748B] text-[11px] leading-relaxed">
                  Statutory custodian verifying all publicized numbers with Ministry of Coal provisional statistics and CMPDI published inventories.
                </p>
              </div>
            </div>
          </div>

          {/* Administrative Audit Log */}
          <div className="bg-white border border-[#E2DCD0] rounded-lg p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#F1EFEA] pb-3 mb-3">
              <div>
                <h3 className="text-xs font-bold text-[#102A43] uppercase tracking-wider">
                  Administrative Audit Log
                </h3>
                <p className="text-[11px] text-[#64748B] mt-0.5">
                  Chronological cryptographic ledger of actions performed by this administrator
                </p>
              </div>
              <span className="text-xs font-mono text-[#64748B]">Audited v1.0</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#1F2937]">
                <thead className="bg-[#FAF9F6] border-y border-[#E2DCD0] text-[#64748B] uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-2 px-3">Audit ID</th>
                    <th className="py-2 px-3">Action Performed</th>
                    <th className="py-2 px-3">Target Entity</th>
                    <th className="py-2 px-3">Timestamp</th>
                    <th className="py-2 px-3 text-right">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1EFEA]">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#FAF9F6] transition-colors">
                      <td className="py-2.5 px-3 font-mono text-[11px] text-[#64748B]">{log.id}</td>
                      <td className="py-2.5 px-3 font-semibold text-[#102A43]">{log.action}</td>
                      <td className="py-2.5 px-3 text-[#475569]">{log.target}</td>
                      <td className="py-2.5 px-3 text-[#64748B]">{log.timestamp}</td>
                      <td className="py-2.5 px-3 text-right">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
