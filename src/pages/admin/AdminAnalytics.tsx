import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  ShieldAlert, 
  FileText, 
  Users, 
  Layers,
  ArrowUpRight,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../../components/common/StatCard';

export const AdminAnalytics: React.FC = () => {
  const { mines, documents, workers, processingJobs, t } = useApp();

  const totalProduction = mines.reduce((acc, m) => acc + m.currentProduction, 0);
  const totalTarget = mines.reduce((acc, m) => acc + m.dailyProductionTarget, 0);

  // Group documents by type
  const docsByType = documents.reduce((acc: { [key: string]: number }, doc) => {
    acc[doc.docType] = (acc[doc.docType] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#E2DCD0] rounded-lg p-5 sm:p-6 shadow-xs">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
          {t.navAnalytics}
        </span>
        <h1 className="text-xl sm:text-2xl font-bold text-[#102A43] tracking-tight mt-0.5">
          Enterprise Mining Intelligence & Operations Analytics
        </h1>
        <p className="text-xs text-[#64748B] mt-1">
          Aggregated extraction analytics, document digitization throughput, and statutory safety conformance
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Daily Output"
          value={`${(totalProduction / 1000).toFixed(1)}k MT`}
          subtext={`Target: ${(totalTarget / 1000).toFixed(1)}k MT`}
          icon={<TrendingUp className="w-4 h-4" />}
          trend={{ value: '+4.2% vs Last Week', isPositive: true }}
        />
        <StatCard
          label="Digitization Throughput"
          value="94.8%"
          subtext="OCR neural accuracy rating"
          icon={<FileText className="w-4 h-4" />}
          variant="accent"
        />
        <StatCard
          label="Mean Safety Conformance"
          value="94.7 / 100"
          subtext="DGMS Statutory Bench Score"
          icon={<ShieldAlert className="w-4 h-4" />}
          variant="success"
        />
        <StatCard
          label="Field Workforce Strength"
          value={workers.length * 18}
          subtext="Active in 6 Coalfield Basins"
          icon={<Users className="w-4 h-4" />}
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Mine-wise Production vs Target */}
        <div className="bg-white border border-[#E2DCD0] rounded-lg p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#F1EFEA] pb-3">
            <div>
              <h3 className="text-xs font-bold text-[#102A43] uppercase tracking-wider">
                Daily Production vs. Statutory Target (MT)
              </h3>
              <span className="text-xs text-[#64748B]">Mine-by-mine extraction telemetry</span>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1 text-[#102A43] font-medium">
                <span className="w-2.5 h-2.5 bg-[#102A43] rounded-xs" /> Output
              </span>
              <span className="flex items-center gap-1 text-[#64748B]">
                <span className="w-2.5 h-2.5 bg-[#E2DCD0] rounded-xs" /> Target
              </span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {mines.map(mine => {
              const percent = Math.min(100, Math.round((mine.currentProduction / mine.dailyProductionTarget) * 100));
              return (
                <div key={mine.id} className="space-y-1 text-xs">
                  <div className="flex justify-between font-medium">
                    <span className="text-[#102A43] font-semibold">{mine.name}</span>
                    <span className="text-[#64748B]">
                      {mine.currentProduction.toLocaleString()} / {mine.dailyProductionTarget.toLocaleString()} MT ({percent}%)
                    </span>
                  </div>
                  <div className="w-full h-3 bg-[#F1EFEA] rounded-full overflow-hidden flex">
                    <div
                      className="h-full bg-[#102A43] rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Document Types Distribution */}
        <div className="bg-white border border-[#E2DCD0] rounded-lg p-5 shadow-xs space-y-4">
          <div className="border-b border-[#F1EFEA] pb-3">
            <h3 className="text-xs font-bold text-[#102A43] uppercase tracking-wider">
              Document Knowledge Lake Composition
            </h3>
            <span className="text-xs text-[#64748B]">Breakdown of digitized archival records by classification</span>
          </div>

          <div className="space-y-3 pt-2">
            {Object.entries(docsByType).map(([type, count]) => {
              const percent = Math.round((count / documents.length) * 100);
              return (
                <div key={type} className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="font-semibold text-[#102A43]">{type}</span>
                    <span className="text-[#64748B]">{count} files ({percent}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-[#F1EFEA] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#B45309] rounded-full"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 3: Safety Indices across Coalfields */}
        <div className="bg-white border border-[#E2DCD0] rounded-lg p-5 shadow-xs space-y-4">
          <div className="border-b border-[#F1EFEA] pb-3">
            <h3 className="text-xs font-bold text-[#102A43] uppercase tracking-wider">
              DGMS Safety Conformance Rating by Pit
            </h3>
            <span className="text-xs text-[#64748B]">Audited across slope stability, ventilation & gas compliance</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            {mines.map(m => (
              <div key={m.id} className="p-3 bg-[#FAF9F6] border border-[#E2DCD0] rounded-lg text-xs">
                <span className="font-mono text-[10px] text-[#64748B] block">{m.mineCode}</span>
                <span className="font-bold text-[#102A43] block truncate">{m.name}</span>
                <div className="mt-2 text-xl font-bold text-emerald-700">{m.safetyRating} <span className="text-[11px] font-normal text-[#64748B]">/ 100</span></div>
                <span className="text-[10px] text-[#64748B] mt-0.5 block">{m.operationalStatus}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 4: Worker Allocation by Subsidiary */}
        <div className="bg-white border border-[#E2DCD0] rounded-lg p-5 shadow-xs space-y-4">
          <div className="border-b border-[#F1EFEA] pb-3">
            <h3 className="text-xs font-bold text-[#102A43] uppercase tracking-wider">
              Workforce Allocation & Roster Density
            </h3>
            <span className="text-xs text-[#64748B]">Deployment across deep seam underground & open-cast pits</span>
          </div>

          <div className="space-y-3 pt-2">
            {mines.map(m => (
              <div key={m.id} className="flex items-center justify-between text-xs p-2 rounded bg-[#FAF9F6] border border-[#E2DCD0]">
                <div>
                  <span className="font-semibold text-[#102A43] block">{m.name}</span>
                  <span className="text-[11px] text-[#64748B]">{m.mineType} • {m.district}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-[#102A43] text-sm block">{m.workersCount}</span>
                  <span className="text-[10px] text-[#64748B]">Field Personnel</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
