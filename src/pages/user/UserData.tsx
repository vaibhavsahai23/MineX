import React, { useState } from 'react';
import { 
  Database, 
  Download, 
  Search, 
  Filter, 
  Layers, 
  TrendingUp, 
  FileSpreadsheet, 
  ShieldCheck,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';

export const UserData: React.FC = () => {
  const { structuredData, t } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [exportNotice, setExportNotice] = useState(false);

  const filteredData = structuredData.filter(d => {
    const matchesSearch = 
      d.mineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.parameter.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.recordCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.zone.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || d.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const categories = [
    'all',
    'Coal Production',
    'Geological Seam',
    'Safety Inspection',
    'Environmental Telemetry',
    'HEMM Equipment'
  ];

  const handleExport = () => {
    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#E2DCD0] rounded-lg p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              {t.navData}
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-[#102A43] tracking-tight mt-0.5">
              Structured Mining & Geological Telemetry
            </h1>
            <p className="text-xs text-[#64748B] mt-1">
              Normalized parameters ingested from borehole logs, mine survey plans, and shift dispatch registries
            </p>
          </div>

          <button
            onClick={handleExport}
            className="px-4 py-2 rounded-md bg-[#102A43] text-white text-xs font-semibold hover:bg-[#1E3A8A] transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md text-xs text-emerald-800 flex items-center justify-between">
          <span>Prototype Telemetry Export: Downloaded structured dataset as <strong>MINEX_TELEMETRY_SAMPLE.csv</strong>.</span>
          <Check className="w-4 h-4 text-emerald-600" />
        </div>
      )}

      {/* Toolbar & Filter Tabs */}
      <div className="bg-white border border-[#E2DCD0] rounded-lg p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[#102A43] text-white'
                    : 'bg-[#FAF9F6] text-[#64748B] hover:text-[#102A43] border border-[#E2DCD0]'
                }`}
              >
                {cat === 'all' ? 'All Telemetry' : cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search parameter, code, or zone..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-md border border-[#CBD5E1] bg-[#FAF9F6] text-xs focus:outline-none focus:border-[#102A43]"
            />
            <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-2.5 top-2.5" />
          </div>
        </div>
      </div>

      {/* Structured Table */}
      <div className="bg-white border border-[#E2DCD0] rounded-lg shadow-xs overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#FAF9F6] border-b border-[#E2DCD0] text-[#64748B] uppercase text-[10px] tracking-wider font-semibold">
              <th className="p-3.5">Record Code</th>
              <th className="p-3.5">Mine Sector</th>
              <th className="p-3.5">Category</th>
              <th className="p-3.5">Parameter Tested</th>
              <th className="p-3.5">Metric Value</th>
              <th className="p-3.5">Operational Zone</th>
              <th className="p-3.5">Recorded Date</th>
              <th className="p-3.5">Supervisor</th>
              <th className="p-3.5">Compliance Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2DCD0]">
            {filteredData.map(item => (
              <tr key={item.id} className="hover:bg-[#FAF9F6] transition-colors">
                <td className="p-3.5 font-mono text-[11px] font-bold text-[#102A43]">{item.recordCode}</td>
                <td className="p-3.5 font-medium text-[#102A43]">{item.mineName}</td>
                <td className="p-3.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#FAF9F6] border border-[#E2DCD0] text-[#475569]">
                    {item.category}
                  </span>
                </td>
                <td className="p-3.5 font-semibold text-[#102A43]">{item.parameter}</td>
                <td className="p-3.5 font-bold text-[#102A43]">
                  {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}{' '}
                  <span className="font-normal text-[11px] text-[#64748B]">{item.unit}</span>
                </td>
                <td className="p-3.5 text-[#475569]">{item.zone}</td>
                <td className="p-3.5 text-[#64748B] font-mono text-[11px]">{item.recordedDate}</td>
                <td className="p-3.5 font-medium">{item.supervisorInCharge}</td>
                <td className="p-3.5">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                    item.complianceFlag === 'Critical'
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : item.complianceFlag === 'Advisory'
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {item.complianceFlag}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
