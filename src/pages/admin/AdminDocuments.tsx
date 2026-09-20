import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Edit3, 
  UploadCloud, 
  Eye, 
  CheckCircle2, 
  Building2,
  Calendar,
  Layers,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { DataProvenanceBadge } from '../../components/common/DataProvenanceBadge';
import { DocumentType } from '../../types';

export const AdminDocuments: React.FC = () => {
  const { documents, mines, setSelectedDoc, deleteDocument, navigate, t } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMine, setSelectedMine] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSource, setSelectedSource] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [officialOnly, setOfficialOnly] = useState(false);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesMine = selectedMine === 'all' || doc.mineId === selectedMine;
    const matchesType = selectedType === 'all' || doc.docType === selectedType;
    const matchesStatus = selectedStatus === 'all' || doc.processingStatus === selectedStatus;
    const matchesSource = selectedSource === 'all' || doc.sourceOrganization === selectedSource;
    const matchesYear = selectedYear === 'all' || doc.year.toString() === selectedYear;
    const matchesOfficial = !officialOnly || doc.isOfficialSource === true;

    return matchesSearch && matchesMine && matchesType && matchesStatus && matchesSource && matchesYear && matchesOfficial;
  });

  const handleDownload = (e: React.MouseEvent, title: string) => {
    e.stopPropagation();
    setDownloadNotice(title);
    setTimeout(() => setDownloadNotice(null), 3000);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to permanently delete this document record from the prototype index?')) {
      deleteDocument(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#E2DCD0] rounded-lg p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              {t.navDocuments}
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-[#102A43] tracking-tight mt-0.5">
              Master Institutional Document Repository
            </h1>
            <p className="text-xs text-[#64748B] mt-1">
              Cross-subsidiary digital archive of geological explorations, statutory mine plans, and DGMS compliance filings
            </p>
          </div>

          <button
            onClick={() => navigate('/admin/upload')}
            className="px-4 py-2 rounded-md bg-[#102A43] text-white text-xs font-semibold hover:bg-[#1E3A8A] transition-colors flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Ingest Document</span>
          </button>
        </div>
      </div>

      {downloadNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md text-xs text-emerald-800 flex items-center justify-between">
          <span>Prototype Download: Simulated package delivered for <strong>{downloadNotice}</strong>.</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
        </div>
      )}

      {/* Advanced Filters Toolbar */}
      <div className="bg-white border border-[#E2DCD0] rounded-lg p-4 shadow-xs space-y-3 text-xs">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search across titles, descriptions, authorities, or tags..."
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
              <option value="all">All Mine Sectors</option>
              {mines.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>

            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              className="p-2 rounded-md border border-[#CBD5E1] bg-[#FAF9F6] text-xs text-[#102A43]"
            >
              <option value="all">All Types</option>
              <option value="Mine Plan">Mine Plan</option>
              <option value="Geological Report">Geological Report</option>
              <option value="Production Report">Production Report</option>
              <option value="Safety Audit">Safety Audit</option>
              <option value="DGMS Circular">DGMS Circular</option>
              <option value="Worker Training">Worker Training</option>
            </select>

            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="p-2 rounded-md border border-[#CBD5E1] bg-[#FAF9F6] text-xs text-[#102A43]"
            >
              <option value="all">All Statuses</option>
              <option value="processed">Processed</option>
              <option value="processing">Processing</option>
              <option value="uploaded">Uploaded</option>
            </select>

            <select
              value={selectedYear}
              onChange={e => setSelectedYear(e.target.value)}
              className="p-2 rounded-md border border-[#CBD5E1] bg-[#FAF9F6] text-xs text-[#102A43]"
            >
              <option value="all">All Years</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>

            <button
              type="button"
              onClick={() => setOfficialOnly(!officialOnly)}
              className={`px-3 py-2 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                officialOnly
                  ? 'bg-amber-600 text-white border border-amber-600 shadow-2xs'
                  : 'bg-[#FAF9F6] text-[#64748B] hover:text-[#102A43] border border-[#CBD5E1]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Official Government Only</span>
            </button>
          </div>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white border border-[#E2DCD0] rounded-lg shadow-xs overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#FAF9F6] border-b border-[#E2DCD0] text-[#64748B] uppercase text-[10px] tracking-wider font-semibold">
              <th className="p-3.5">Document Title</th>
              <th className="p-3.5">Classification</th>
              <th className="p-3.5">Originating Authority</th>
              <th className="p-3.5">Allocated Mine</th>
              <th className="p-3.5">Year / Period</th>
              <th className="p-3.5">Provenance</th>
              <th className="p-3.5">Pipeline State</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2DCD0]">
            {filteredDocs.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-10 text-center text-[#64748B]">
                  No documents found matching the applied filter criteria.
                </td>
              </tr>
            ) : (
              filteredDocs.map(doc => (
                <tr
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className="hover:bg-[#FAF9F6] transition-colors cursor-pointer"
                >
                  <td className="p-3.5 font-semibold text-[#102A43] max-w-xs">
                    <div className="flex items-start gap-2">
                      <FileText className="w-4 h-4 text-[#102A43] shrink-0 mt-0.5" />
                      <div>
                        <div className="truncate font-semibold">{doc.title}</div>
                        {doc.isOfficialSource && (
                          <span className="text-[10px] text-amber-700 font-medium">Verified Government Publication</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5">{doc.docType}</td>
                  <td className="p-3.5 font-medium">{doc.sourceOrganization}</td>
                  <td className="p-3.5">{doc.mineName}</td>
                  <td className="p-3.5">{doc.year} ({doc.reportingPeriod})</td>
                  <td className="p-3.5">
                    {doc.provenance ? (
                      <DataProvenanceBadge provenance={doc.provenance} compact />
                    ) : (
                      <span className="text-[#64748B] text-[11px]">Field Operational</span>
                    )}
                  </td>
                  <td className="p-3.5">
                    <StatusBadge status={doc.processingStatus} size="sm" />
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedDoc(doc)}
                        className="p-1.5 text-[#64748B] hover:text-[#102A43] hover:bg-[#F5F1EB] rounded"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={e => handleDownload(e, doc.title)}
                        className="p-1.5 text-[#64748B] hover:text-[#102A43] hover:bg-[#F5F1EB] rounded"
                        title="Simulate Download"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={e => handleDelete(e, doc.id)}
                        className="p-1.5 text-[#64748B] hover:text-red-600 hover:bg-red-50 rounded"
                        title="Delete from Repository"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
