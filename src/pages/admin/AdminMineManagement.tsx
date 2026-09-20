import React, { useState } from 'react';
import { 
  Layers, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  MapPin, 
  HardHat, 
  FileText, 
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { AddMineModal } from '../../components/modals/AddMineModal';
import { Mine } from '../../types';

export const AdminMineManagement: React.FC = () => {
  const { mines, setSelectedMine, updateMine, t } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredMines = mines.filter(m => {
    const matchesSearch = 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.mineCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesState = selectedState === 'all' || m.state === selectedState;
    const matchesType = selectedType === 'all' || m.mineType === selectedType;
    const matchesStatus = selectedStatus === 'all' || m.operationalStatus === selectedStatus;

    return matchesSearch && matchesState && matchesType && matchesStatus;
  });

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>, mine: Mine) => {
    e.stopPropagation();
    updateMine({
      ...mine,
      operationalStatus: e.target.value as any
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#E2DCD0] rounded-lg p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              {t.navMineManagement}
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-[#102A43] tracking-tight mt-0.5">
              Master Coal Block & Colliery Directory
            </h1>
            <p className="text-xs text-[#64748B] mt-1">
              Authoritative inventory of open cast pits, deep seam underground blocks, and statutory mining leases
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-md bg-[#102A43] text-white text-xs font-semibold hover:bg-[#1E3A8A] transition-colors flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.addMine}</span>
          </button>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="bg-white border border-[#E2DCD0] rounded-lg p-4 shadow-xs space-y-3 text-xs">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search mine name, code, district, or particulars..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-md border border-[#CBD5E1] bg-[#FAF9F6] text-xs text-[#102A43] focus:outline-none focus:border-[#102A43] focus:bg-white"
            />
            <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-2.5" />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedState}
              onChange={e => setSelectedState(e.target.value)}
              className="p-2 rounded-md border border-[#CBD5E1] bg-[#FAF9F6] text-xs text-[#102A43]"
            >
              <option value="all">All States</option>
              <option value="Jharkhand">Jharkhand</option>
              <option value="West Bengal">West Bengal</option>
              <option value="Chhattisgarh">Chhattisgarh</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
              <option value="Maharashtra">Maharashtra</option>
            </select>

            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              className="p-2 rounded-md border border-[#CBD5E1] bg-[#FAF9F6] text-xs text-[#102A43]"
            >
              <option value="all">All Mine Types</option>
              <option value="Open Cast">Open Cast</option>
              <option value="Underground">Underground</option>
              <option value="Mixed Surface & Deep Seam">Mixed Surface & Deep Seam</option>
            </select>

            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="p-2 rounded-md border border-[#CBD5E1] bg-[#FAF9F6] text-xs text-[#102A43]"
            >
              <option value="all">All Statuses</option>
              <option value="operational">Operational</option>
              <option value="maintenance">Maintenance</option>
              <option value="inspection">Under Inspection</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Mine Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMines.map(mine => (
          <div
            key={mine.id}
            onClick={() => setSelectedMine(mine)}
            className="bg-white border border-[#E2DCD0] rounded-lg p-5 shadow-xs hover:shadow-sm hover:border-[#CBD5E1] transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="font-mono text-xs font-bold text-[#64748B]">
                  {mine.mineCode}
                </span>
                <StatusBadge status={mine.operationalStatus} size="sm" />
              </div>

              <h3 className="font-bold text-base text-[#102A43] leading-tight">
                {mine.name}
              </h3>
              <p className="text-xs text-[#64748B] mt-1 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{mine.district}, {mine.state}</span>
              </p>

              <p className="text-xs text-[#475569] mt-3 line-clamp-2 leading-relaxed">
                {mine.description}
              </p>

              <div className="mt-4 pt-3 border-t border-[#F1EFEA] grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[#64748B] text-[11px] block">Daily Output</span>
                  <span className="font-semibold text-[#102A43]">{mine.currentProduction.toLocaleString()} MT</span>
                </div>
                <div>
                  <span className="text-[#64748B] text-[11px] block">Safety Conformance</span>
                  <span className="font-semibold text-emerald-700">{mine.safetyRating} / 100</span>
                </div>
                <div>
                  <span className="text-[#64748B] text-[11px] block">Allocated Personnel</span>
                  <span className="font-semibold text-[#102A43]">{mine.workersCount}</span>
                </div>
                <div>
                  <span className="text-[#64748B] text-[11px] block">Operating Zones</span>
                  <span className="font-semibold text-[#102A43]">{mine.zones.length} Zones</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#F1EFEA] flex items-center justify-between text-xs" onClick={e => e.stopPropagation()}>
              <select
                value={mine.operationalStatus}
                onChange={e => handleStatusChange(e, mine)}
                className="p-1 rounded border border-[#CBD5E1] bg-[#FAF9F6] text-[11px] font-medium text-[#102A43]"
              >
                <option value="operational">Operational</option>
                <option value="maintenance">Maintenance</option>
                <option value="inspection">Under Inspection</option>
              </select>

              <button
                onClick={() => setSelectedMine(mine)}
                className="font-semibold text-[#102A43] hover:underline flex items-center gap-0.5"
              >
                <span>Full Dossier</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <AddMineModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>
  );
};
