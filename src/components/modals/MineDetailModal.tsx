import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  HardHat, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Layers, 
  Activity, 
  Clock, 
  ShieldAlert,
  Users,
  Compass
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';

export const MineDetailModal: React.FC = () => {
  const { selectedMine, setSelectedMine, documents, workers, t } = useApp();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'operations' | 'workers' | 'zones' | 'documents' | 'production' | 'safety' | 'activity'
  >('overview');

  if (!selectedMine) return null;

  const mineDocs = documents.filter(d => d.mineId === selectedMine.id || d.mineName === selectedMine.name);
  const mineWorkers = workers.filter(w => w.assignedMineId === selectedMine.id || w.assignedMineName === selectedMine.name);

  return (
    <Modal
      isOpen={!!selectedMine}
      onClose={() => setSelectedMine(null)}
      title={selectedMine.name}
      subtitle={`${selectedMine.mineCode} • ${selectedMine.district}, ${selectedMine.state} • ${selectedMine.mineType}`}
      maxWidth="4xl"
      footer={
        <button
          onClick={() => setSelectedMine(null)}
          className="px-4 py-2 text-xs font-medium rounded-md bg-[#102A43] text-white hover:bg-[#1E3A8A] transition-colors"
        >
          {t.close}
        </button>
      }
    >
      {/* Tab Navigation */}
      <div className="flex border-b border-[#E2DCD0] overflow-x-auto gap-1 pb-1 mb-5">
        {[
          { id: 'overview', label: 'Overview', icon: <Compass className="w-3.5 h-3.5" /> },
          { id: 'operations', label: 'Operations', icon: <Layers className="w-3.5 h-3.5" /> },
          { id: 'workers', label: `Workers (${mineWorkers.length})`, icon: <Users className="w-3.5 h-3.5" /> },
          { id: 'zones', label: `Zones (${selectedMine.zones.length})`, icon: <HardHat className="w-3.5 h-3.5" /> },
          { id: 'documents', label: `Documents (${mineDocs.length})`, icon: <FileText className="w-3.5 h-3.5" /> },
          { id: 'production', label: 'Production', icon: <TrendingUp className="w-3.5 h-3.5" /> },
          { id: 'safety', label: 'Safety Index', icon: <ShieldAlert className="w-3.5 h-3.5" /> },
          { id: 'activity', label: 'Recent Activity', icon: <Activity className="w-3.5 h-3.5" /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-[#102A43] text-white shadow-xs'
                : 'text-[#64748B] hover:bg-[#F5F1EB] hover:text-[#102A43]'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="p-4 bg-[#FAF9F6] rounded-lg border border-[#E2DCD0]">
            <h4 className="text-xs font-bold text-[#102A43] uppercase tracking-wider mb-2">
              Block Operational Profile
            </h4>
            <p className="text-xs text-[#475569] leading-relaxed">
              {selectedMine.description}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-white border border-[#E2DCD0] rounded-md">
              <span className="text-[11px] text-[#64748B] uppercase">Status</span>
              <div className="mt-1">
                <StatusBadge status={selectedMine.operationalStatus} />
              </div>
            </div>
            <div className="p-3 bg-white border border-[#E2DCD0] rounded-md">
              <span className="text-[11px] text-[#64748B] uppercase">Mine ID</span>
              <div className="text-xs font-mono font-semibold text-[#102A43] mt-1">{selectedMine.mineId}</div>
            </div>
            <div className="p-3 bg-white border border-[#E2DCD0] rounded-md">
              <span className="text-[11px] text-[#64748B] uppercase">Daily Output</span>
              <div className="text-xs font-semibold text-[#102A43] mt-1">{selectedMine.currentProduction.toLocaleString()} MT</div>
            </div>
            <div className="p-3 bg-white border border-[#E2DCD0] rounded-md">
              <span className="text-[11px] text-[#64748B] uppercase">Safety Score</span>
              <div className="text-xs font-semibold text-emerald-700 mt-1">{selectedMine.safetyRating} / 100</div>
            </div>
          </div>

          <div className="p-4 bg-white border border-[#E2DCD0] rounded-lg">
            <h4 className="text-xs font-bold text-[#102A43] uppercase tracking-wider mb-3">
              Geographic & Jurisdictional Coordinates
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-[#64748B]">State / Jurisdiction:</span>
                <p className="font-medium text-[#102A43]">{selectedMine.state}</p>
              </div>
              <div>
                <span className="text-[#64748B]">District Basin:</span>
                <p className="font-medium text-[#102A43]">{selectedMine.district}</p>
              </div>
              <div>
                <span className="text-[#64748B]">GPS Center:</span>
                <p className="font-mono text-[#102A43]">{selectedMine.coordinates.lat}° N, {selectedMine.coordinates.lng}° E</p>
              </div>
              <div>
                <span className="text-[#64748B]">Last DGMS Inspection:</span>
                <p className="font-medium text-[#102A43]">{selectedMine.lastInspectionDate}</p>
              </div>
              <div>
                <span className="text-[#64748B]">Last Audit Sync:</span>
                <p className="font-medium text-[#102A43]">{selectedMine.lastUpdatedDate}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Operations */}
      {activeTab === 'operations' && (
        <div className="space-y-4">
          <div className="p-4 bg-white border border-[#E2DCD0] rounded-lg">
            <h4 className="text-xs font-bold text-[#102A43] uppercase tracking-wider mb-2">
              Active Shift Telemetry
            </h4>
            <div className="p-3 bg-[#F5F1EB] rounded border border-[#E2DCD0] text-xs font-medium text-[#102A43]">
              {selectedMine.currentShiftInfo}
            </div>
          </div>

          <div className="p-4 bg-white border border-[#E2DCD0] rounded-lg">
            <h4 className="text-xs font-bold text-[#102A43] uppercase tracking-wider mb-3">
              Shift Supervisors on Record
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {selectedMine.supervisors.map((sup, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2.5 bg-[#FAF9F6] rounded border border-[#E2DCD0] text-xs">
                  <HardHat className="w-4 h-4 text-[#102A43]" />
                  <div>
                    <span className="font-semibold text-[#102A43]">{sup}</span>
                    <span className="block text-[10px] text-[#64748B]">Authorized Pit Supervisor</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Workers */}
      {activeTab === 'workers' && (
        <div className="space-y-3">
          <div className="text-xs text-[#64748B] flex justify-between items-center mb-2">
            <span>Total allocated personnel: <strong>{selectedMine.workersCount}</strong></span>
            <span>Sample roster ({mineWorkers.length} shown)</span>
          </div>

          <div className="divide-y divide-[#E2DCD0] border border-[#E2DCD0] rounded-lg overflow-hidden">
            {mineWorkers.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#64748B]">
                Personnel records are aggregated under the master regional registry.
              </div>
            ) : (
              mineWorkers.map(w => (
                <div key={w.id} className="p-3 bg-white flex items-center justify-between text-xs hover:bg-[#FAF9F6]">
                  <div className="flex items-center gap-3">
                    <img src={w.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover border border-[#CBD5E1]" />
                    <div>
                      <span className="font-semibold text-[#102A43] block">{w.name}</span>
                      <span className="text-[11px] text-[#64748B]">{w.designation} • {w.assignedZone}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-[11px] text-[#102A43] block">{w.employeeId}</span>
                    <span className="text-[10px] text-emerald-700 font-medium">Shift Active</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Zones */}
      {activeTab === 'zones' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {selectedMine.zones.map(z => (
              <div key={z.id} className="p-4 bg-white border border-[#E2DCD0] rounded-lg">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-[#102A43]">{z.name}</h5>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    z.riskLevel === 'High' ? 'bg-rose-100 text-rose-800' :
                    z.riskLevel === 'Medium' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {z.riskLevel} Risk
                  </span>
                </div>
                <p className="mt-2 text-xs text-[#64748B]">
                  <strong>Current Operation:</strong> {z.currentActivity}
                </p>
                <div className="mt-3 pt-2 border-t border-[#F1EFEA] flex justify-between text-xs text-[#64748B]">
                  <span>Active Workers: <strong className="text-[#102A43]">{z.activeWorkers}</strong></span>
                  <span>Safety Index: <strong className="text-emerald-700">{z.safetyScore}%</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Documents */}
      {activeTab === 'documents' && (
        <div className="space-y-2">
          {mineDocs.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#64748B]">
              No documents specifically attached to this mine block yet.
            </div>
          ) : (
            <div className="divide-y divide-[#E2DCD0] border border-[#E2DCD0] rounded-lg overflow-hidden">
              {mineDocs.map(doc => (
                <div key={doc.id} className="p-3 bg-white flex items-center justify-between text-xs hover:bg-[#FAF9F6]">
                  <div className="flex items-start gap-2.5">
                    <FileText className="w-4 h-4 text-[#102A43] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-[#102A43] block">{doc.title}</span>
                      <span className="text-[11px] text-[#64748B]">
                        {doc.docType} • {doc.sourceOrganization} • {doc.year}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={doc.processingStatus} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 6: Production */}
      {activeTab === 'production' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white border border-[#E2DCD0] rounded-lg">
              <span className="text-xs text-[#64748B] uppercase">Daily Target</span>
              <div className="text-2xl font-bold text-[#102A43] mt-1">{selectedMine.dailyProductionTarget.toLocaleString()} MT</div>
              <span className="text-[11px] text-[#64748B] mt-1 block">Statutory Annual Allocation</span>
            </div>
            <div className="p-4 bg-white border border-[#E2DCD0] rounded-lg">
              <span className="text-xs text-[#64748B] uppercase">Current Daily Output</span>
              <div className="text-2xl font-bold text-emerald-700 mt-1">{selectedMine.currentProduction.toLocaleString()} MT</div>
              <span className="text-[11px] text-emerald-700 font-medium mt-1 block">
                {((selectedMine.currentProduction / selectedMine.dailyProductionTarget) * 100).toFixed(1)}% of Target Met
              </span>
            </div>
          </div>

          <div className="p-4 bg-[#FAF9F6] border border-[#E2DCD0] rounded-lg text-xs text-[#475569]">
            <h5 className="font-bold text-[#102A43] mb-1">Coal Grade Specifications</h5>
            <p>Non-coking Power Grade (G5 to G7) with mean Gross Calorific Value (GCV) 4,600 - 5,200 kcal/kg. Dispatched via Merry-Go-Round (MGR) railway rakes to state utilities.</p>
          </div>
        </div>
      )}

      {/* Tab 7: Safety */}
      {activeTab === 'safety' && (
        <div className="space-y-4">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-900 uppercase">DGMS Statutory Safety Index</span>
              <div className="text-3xl font-extrabold text-emerald-800 mt-0.5">{selectedMine.safetyRating} / 100</div>
              <p className="text-xs text-emerald-700 mt-1">Zero lost-time injuries (LTI) reported in last 45 operational days.</p>
            </div>
            <CheckCircle2 className="w-10 h-10 text-emerald-600 opacity-80" />
          </div>

          <div className="p-4 bg-white border border-[#E2DCD0] rounded-lg text-xs">
            <h5 className="font-bold text-[#102A43] uppercase tracking-wider mb-2">Compliance Directives Active</h5>
            <ul className="list-disc list-inside space-y-1 text-[#475569]">
              <li>Highwall slope angle telemetry verified below 65 degrees.</li>
              <li>Sump dewatering pump capacity operating at 120% monsoon rating.</li>
              <li>Continuous multi-gas sensors calibrated at all bench haul ways.</li>
            </ul>
          </div>
        </div>
      )}

      {/* Tab 8: Recent Activity */}
      {activeTab === 'activity' && (
        <div className="space-y-3">
          <div className="divide-y divide-[#E2DCD0] border border-[#E2DCD0] rounded-lg overflow-hidden text-xs">
            {[
              { time: 'Today 06:00 AM', event: 'Morning Shift 1 initiated with 359 personnel logged across 4 zones.' },
              { time: 'Yesterday 17:30 PM', event: 'Daily dispatch report finalized with 49,250 MT coal loaded.' },
              { time: 'Sept 18, 2024', event: 'DGMS Regional Safety audit completed with zero non-conformances.' },
              { time: 'Sept 16, 2024', event: 'Highwall laser contour scanning uploaded to MineX repository.' }
            ].map((act, i) => (
              <div key={i} className="p-3 bg-white flex items-start gap-3 hover:bg-[#FAF9F6]">
                <Clock className="w-3.5 h-3.5 text-[#64748B] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#102A43]">{act.event}</span>
                  <span className="block text-[11px] text-[#94A3B8] mt-0.5">{act.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Modal>
  );
};
