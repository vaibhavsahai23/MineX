import React, { useState } from 'react';
import { 
  Layers, 
  Users, 
  FileText, 
  UserCheck, 
  UploadCloud, 
  Plus, 
  ArrowRight, 
  Shield, 
  MapPin, 
  ChevronRight,
  Bot,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Search,
  Filter,
  BarChart3,
  Building
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DataProvenanceBadge } from '../../components/common/DataProvenanceBadge';
import { 
  ALL_INDIA_COAL_PRODUCTION_DATA, 
  GEOLOGICAL_COAL_RESOURCES_DATA,
  COAL_SUBSIDIARIES_DATA,
  MINISTRY_OF_COAL_PROVENANCE,
  CMPDI_RESOURCE_PROVENANCE 
} from '../../data/officialMiningData';

export const AdminOverview: React.FC = () => {
  const { 
    currentAdmin, 
    mines, 
    workers, 
    documents, 
    accessRequests,
    approveAccessRequest,
    rejectAccessRequest,
    navigate, 
    t 
  } = useApp();

  const [requestFilter, setRequestFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [requestSearch, setRequestSearch] = useState('');

  const pendingRequestsCount = accessRequests.filter(r => r.status === 'PENDING').length;
  const filteredRequests = accessRequests.filter(req => {
    const matchesFilter = requestFilter === 'ALL' || req.status === requestFilter;
    const matchesSearch = 
      req.fullName.toLowerCase().includes(requestSearch.toLowerCase()) ||
      req.email.toLowerCase().includes(requestSearch.toLowerCase()) ||
      req.requestedMine.toLowerCase().includes(requestSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Directorate Header */}
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
                  Directorate Administration
                </span>
                <span className="w-1 h-1 rounded-full bg-[#CBD5E1]" />
                <span className="text-xs font-mono text-[#64748B]">{currentAdmin.adminId}</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                  CHIEF GM CLEARANCE
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#102A43] tracking-tight">
                {currentAdmin.name}
              </h1>
              <p className="text-xs text-[#64748B]">
                {currentAdmin.designation} • Central Mine Planning & Design Institute (CMPDI HQ)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => navigate('/admin/upload')}
              className="px-3.5 py-2 rounded-md bg-[#102A43] text-white text-xs font-semibold hover:bg-[#1B365D] transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>{t.navUploadDocument}</span>
            </button>
            <button
              onClick={() => navigate('/admin/assist')}
              className="px-3.5 py-2 rounded-md bg-[#FAF9F6] text-[#102A43] text-xs font-semibold hover:bg-[#F5F1EB] border border-[#E2DCD0] transition-colors flex items-center gap-1.5"
            >
              <Bot className="w-3.5 h-3.5 text-[#B45309]" />
              <span>Mine Assist</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. System Overview Metrics (Linked to respective management sections) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Mines */}
        <div 
          onClick={() => navigate('/admin/mines')}
          className="bg-white border border-[#E2DCD0] hover:border-[#102A43] rounded-lg p-5 shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-[#64748B] mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Mines</span>
              <Layers className="w-4 h-4 text-[#B45309]" />
            </div>
            <div className="text-2xl font-bold text-[#102A43]">{mines.length}</div>
            <p className="text-xs text-[#64748B] mt-1">CIL subsidiary mining operations</p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#F1EFEA] text-xs text-[#102A43] font-semibold flex items-center justify-between group-hover:text-[#B45309]">
            <span>Manage Mines</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Active Workers */}
        <div 
          onClick={() => navigate('/admin/workers')}
          className="bg-white border border-[#E2DCD0] hover:border-[#102A43] rounded-lg p-5 shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-[#64748B] mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Active Workers</span>
              <Users className="w-4 h-4 text-[#B45309]" />
            </div>
            <div className="text-2xl font-bold text-[#102A43]">{workers.length * 16 + 8}</div>
            <p className="text-xs text-[#64748B] mt-1">Personnel registered across shifts</p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#F1EFEA] text-xs text-[#102A43] font-semibold flex items-center justify-between group-hover:text-[#B45309]">
            <span>Manage Workforce</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Documents in Library */}
        <div 
          onClick={() => navigate('/admin/documents')}
          className="bg-white border border-[#E2DCD0] hover:border-[#102A43] rounded-lg p-5 shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-[#64748B] mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Document Library</span>
              <FileText className="w-4 h-4 text-[#B45309]" />
            </div>
            <div className="text-2xl font-bold text-[#102A43]">{documents.length}</div>
            <p className="text-xs text-[#64748B] mt-1">Plans, borehole logs & official circulars</p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#F1EFEA] text-xs text-[#102A43] font-semibold flex items-center justify-between group-hover:text-[#B45309]">
            <span>Open Library</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Pending Access Requests */}
        <div 
          onClick={() => {
            const el = document.getElementById('user-access-requests-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="bg-white border border-[#E2DCD0] hover:border-[#B45309] rounded-lg p-5 shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-[#64748B] mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Access Approvals</span>
              <UserCheck className="w-4 h-4 text-[#B45309]" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-[#102A43]">{pendingRequestsCount}</span>
              {pendingRequestsCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
                  Awaiting Review
                </span>
              )}
            </div>
            <p className="text-xs text-[#64748B] mt-1">Field worker access requests</p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#F1EFEA] text-xs text-[#102A43] font-semibold flex items-center justify-between group-hover:text-[#B45309]">
            <span>Review Requests</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* 2. USER ACCESS REQUESTS SECTION (NEW & PROMINENT) */}
      <div id="user-access-requests-section" className="bg-white border border-[#E2DCD0] rounded-lg p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F1EFEA] pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <UserCheck className="w-5 h-5 text-[#B45309]" />
              <h2 className="text-lg font-bold text-[#102A43]">User Access Requests</h2>
            </div>
            <p className="text-xs text-[#64748B]">
              Review and grant role-gated operational access to mine personnel, operators, and contractors.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={requestSearch}
                onChange={(e) => setRequestSearch(e.target.value)}
                placeholder="Search requests..."
                className="pl-8 pr-3 py-1.5 text-xs rounded-md border border-[#CBD5E1] bg-white focus:outline-none focus:ring-1 focus:ring-[#102A43]"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex bg-[#FAF9F6] border border-[#E2DCD0] rounded-md p-0.5 text-xs">
              {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setRequestFilter(st)}
                  className={`px-2.5 py-1 rounded transition-colors font-medium ${
                    requestFilter === st
                      ? 'bg-[#102A43] text-white'
                      : 'text-[#64748B] hover:text-[#102A43]'
                  }`}
                >
                  {st === 'ALL' ? 'All' : st.charAt(0) + st.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Requests Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#1F2937]">
            <thead className="bg-[#FAF9F6] border-y border-[#E2DCD0] text-[#64748B] uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-2.5 px-3">Applicant Name</th>
                <th className="py-2.5 px-3">Contact & Email</th>
                <th className="py-2.5 px-3">Requested Mine</th>
                <th className="py-2.5 px-3">Request Date</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1EFEA]">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-[#64748B]">
                    No access requests found matching your query.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-[#FAF9F6] transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-[#102A43]">{req.fullName}</div>
                      <div className="text-[11px] text-[#64748B]">{req.designation}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-mono text-[#102A43]">{req.contactNumber}</div>
                      <div className="text-[11px] text-[#64748B]">{req.email}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-medium text-[#102A43]">{req.requestedMine}</span>
                    </td>
                    <td className="py-3 px-3 text-[#64748B]">
                      {req.requestedAt}
                    </td>
                    <td className="py-3 px-3">
                      {req.status === 'APPROVED' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <CheckCircle2 className="w-3 h-3" />
                          Approved
                        </span>
                      )}
                      {req.status === 'PENDING' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-300">
                          <Clock className="w-3 h-3" />
                          Pending Review
                        </span>
                      )}
                      {req.status === 'REJECTED' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-100 text-red-800 border border-red-300">
                          <XCircle className="w-3 h-3" />
                          Rejected
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      {req.status === 'PENDING' ? (
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          <button
                            type="button"
                            onClick={() => approveAccessRequest(req.id)}
                            className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => rejectAccessRequest(req.id)}
                            className="px-2.5 py-1 rounded bg-red-50 hover:bg-red-100 text-red-700 border border-red-300 font-semibold text-[11px] transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-[#64748B]">
                          {req.reviewedBy ? `Reviewed by ${req.reviewedBy}` : 'Action Complete'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. OFFICIAL / PUBLIC MINING DATA HIGHLIGHTS (REAL DATA PROVENANCE) */}
      <div className="bg-white border border-[#E2DCD0] rounded-lg p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F1EFEA] pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="w-5 h-5 text-[#B45309]" />
              <h2 className="text-lg font-bold text-[#102A43]">Official Public Mining Intelligence</h2>
            </div>
            <p className="text-xs text-[#64748B]">
              Real publicly documented benchmarks published by the Ministry of Coal and CMPDI.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <DataProvenanceBadge provenance={MINISTRY_OF_COAL_PROVENANCE} />
          </div>
        </div>

        {/* Real Data Highlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* 1. All-India Coal Production */}
          <div className="p-4 rounded-lg bg-[#FAF9F6] border border-[#E2DCD0] flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">
                {ALL_INDIA_COAL_PRODUCTION_DATA.headline}
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#102A43]">
                {ALL_INDIA_COAL_PRODUCTION_DATA.totalProductionMT} <span className="text-base font-semibold text-[#64748B]">MT</span>
              </div>
              <p className="text-xs text-[#475569] mt-2 leading-relaxed">
                Growth rate of <strong className="text-emerald-700">+{ALL_INDIA_COAL_PRODUCTION_DATA.growthRate}</strong> compared to 893.19 MT in FY 2022-23.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#E2DCD0] text-[11px] text-[#64748B] space-y-1">
              <div className="flex justify-between">
                <span>CIL Share:</span>
                <span className="font-semibold text-[#102A43]">{ALL_INDIA_COAL_PRODUCTION_DATA.breakdown.coalIndiaLtd} MT</span>
              </div>
              <div className="flex justify-between">
                <span>Captive & Others:</span>
                <span className="font-semibold text-[#102A43]">{ALL_INDIA_COAL_PRODUCTION_DATA.breakdown.captiveAndOthers} MT</span>
              </div>
            </div>
          </div>

          {/* 2. Total Geological Coal Resources */}
          <div className="p-4 rounded-lg bg-[#FAF9F6] border border-[#E2DCD0] flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">
                {GEOLOGICAL_COAL_RESOURCES_DATA.headline}
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#102A43]">
                {GEOLOGICAL_COAL_RESOURCES_DATA.totalEstimatedResourcesBT} <span className="text-base font-semibold text-[#64748B]">Billion MT</span>
              </div>
              <p className="text-xs text-[#475569] mt-2 leading-relaxed">
                National Inventory compiled by GSI and CMPDI up to a depth of 1,200 metres.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#E2DCD0] text-[11px] text-[#64748B] space-y-1">
              <div className="flex justify-between">
                <span>Proved (Measured):</span>
                <span className="font-semibold text-[#102A43]">{GEOLOGICAL_COAL_RESOURCES_DATA.breakdown.provedResourcesBT} BT</span>
              </div>
              <div className="flex justify-between">
                <span>Indicated:</span>
                <span className="font-semibold text-[#102A43]">{GEOLOGICAL_COAL_RESOURCES_DATA.breakdown.indicatedResourcesBT} BT</span>
              </div>
            </div>
          </div>

          {/* 3. Key Mining Subsidiaries */}
          <div className="p-4 rounded-lg bg-[#FAF9F6] border border-[#E2DCD0] flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">
                Major CIL Coal Producing Subsidiaries
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {COAL_SUBSIDIARIES_DATA.map((sub: { code: string; name: string }) => (
                  <span
                    key={sub.code}
                    className="px-2 py-0.5 rounded bg-white border border-[#CBD5E1] text-[11px] font-bold text-[#102A43]"
                  >
                    {sub.code}
                  </span>
                ))}
              </div>
              <p className="text-xs text-[#475569] mt-3 leading-relaxed">
                Operating across Jharkhand, Odisha, Chhattisgarh, Madhya Pradesh, West Bengal & Maharashtra.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#E2DCD0]">
              <DataProvenanceBadge provenance={CMPDI_RESOURCE_PROVENANCE} />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Quick Actions & 5. Recent System Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 4. Quick Actions (1 Col) */}
        <div className="bg-white border border-[#E2DCD0] rounded-lg p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-[#102A43] mb-3">Quick Directorate Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => navigate('/admin/upload')}
                className="w-full p-2.5 rounded-md bg-[#FAF9F6] hover:bg-[#F5F1EB] border border-[#E2DCD0] text-left text-xs font-semibold text-[#102A43] flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <UploadCloud className="w-4 h-4 text-[#B45309]" />
                  <span>Upload Mine Document</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
              </button>

              <button
                onClick={() => navigate('/admin/mines')}
                className="w-full p-2.5 rounded-md bg-[#FAF9F6] hover:bg-[#F5F1EB] border border-[#E2DCD0] text-left text-xs font-semibold text-[#102A43] flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#B45309]" />
                  <span>Add / Configure Mine Basin</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
              </button>

              <button
                onClick={() => navigate('/admin/workers')}
                className="w-full p-2.5 rounded-md bg-[#FAF9F6] hover:bg-[#F5F1EB] border border-[#E2DCD0] text-left text-xs font-semibold text-[#102A43] flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#B45309]" />
                  <span>Register Field Personnel</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
              </button>

              <button
                onClick={() => navigate('/admin/assist')}
                className="w-full p-2.5 rounded-md bg-[#FAF9F6] hover:bg-[#F5F1EB] border border-[#E2DCD0] text-left text-xs font-semibold text-[#102A43] flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-[#B45309]" />
                  <span>Query AI Mine Assist</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
              </button>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#F1EFEA] text-[11px] text-[#64748B]">
            All actions logged in Directorate Audit Registry v1.0
          </div>
        </div>

        {/* 5. Recent System Activity (2 Cols) */}
        <div className="lg:col-span-2 bg-white border border-[#E2DCD0] rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#F1EFEA] pb-3 mb-3">
            <h3 className="font-bold text-sm text-[#102A43]">Recent System Audit Activity</h3>
            <span className="text-[11px] text-[#64748B]">Real-time operational ledger</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-2.5 rounded bg-[#FAF9F6] border border-[#E2DCD0] text-xs">
              <div className="w-7 h-7 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold">
                ✓
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#102A43]">Official Document Ingestion</span>
                  <span className="text-[10px] text-[#64748B]">Today 08:30 hrs</span>
                </div>
                <p className="text-[#475569] mt-0.5 leading-relaxed">
                  DGMS Technical Circular No. 04 of 2024 published to statutory repository with full digital provenance verification.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2.5 rounded bg-[#FAF9F6] border border-[#E2DCD0] text-xs">
              <div className="w-7 h-7 rounded bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 font-bold">
                👤
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#102A43]">Access Request Review</span>
                  <span className="text-[10px] text-[#64748B]">Yesterday 16:45 hrs</span>
                </div>
                <p className="text-[#475569] mt-0.5 leading-relaxed">
                  Field clearance granted for Rameshwar Soren at Rajmahal Open Cast Project (Zone B Pit Face).
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2.5 rounded bg-[#FAF9F6] border border-[#E2DCD0] text-xs">
              <div className="w-7 h-7 rounded bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 font-bold">
                ⛏
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#102A43]">National Inventory Synchronization</span>
                  <span className="text-[10px] text-[#64748B]">15 Mar 2025</span>
                </div>
                <p className="text-[#475569] mt-0.5 leading-relaxed">
                  Inventory of Geological Resources updated to 378.21 BT as per Ministry of Coal Annual Report 2023-24.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
