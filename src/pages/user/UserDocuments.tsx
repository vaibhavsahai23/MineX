import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Calendar, 
  Layers, 
  Building2,
  CheckCircle2,
  Tag,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { DataProvenanceBadge } from '../../components/common/DataProvenanceBadge';
import { DocumentType } from '../../types';

export const UserDocuments: React.FC = () => {
  const { documents, currentUser, setSelectedDoc, t } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [officialOnly, setOfficialOnly] = useState(false);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  // Filter documents accessible to worker
  const filteredDocs = documents.filter(doc => {
    const matchesSearch = 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = selectedType === 'all' || doc.docType === selectedType;
    const matchesYear = selectedYear === 'all' || doc.year.toString() === selectedYear;
    const matchesOfficial = !officialOnly || doc.isOfficialSource === true;

    return matchesSearch && matchesType && matchesYear && matchesOfficial;
  });

  const docTypes: DocumentType[] = [
    'Mine Plan',
    'Geological Report',
    'Production Report',
    'Safety Audit',
    'DGMS Circular',
    'Worker Training'
  ];

  const handleDownload = (e: React.MouseEvent, docTitle: string) => {
    e.stopPropagation();
    setDownloadNotice(docTitle);
    setTimeout(() => setDownloadNotice(null), 3000);
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
              Field Technical & Compliance Library
            </h1>
            <p className="text-xs text-[#64748B] mt-1">
              Statutory SOPs, pit section drawings, DGMS advisories, and geological logs
            </p>
          </div>

          <div className="text-xs text-[#64748B] bg-[#FAF9F6] border border-[#E2DCD0] px-3 py-1.5 rounded-md">
            Indexed: <strong className="text-[#102A43]">{filteredDocs.length}</strong> documents available
          </div>
        </div>
      </div>

      {downloadNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md text-xs text-emerald-800 flex items-center justify-between">
          <span>Demonstration File Download: Package initiated for <strong>{downloadNotice}</strong>.</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
        </div>
      )}

      {/* Filters & Search Toolbar */}
      <div className="bg-white border border-[#E2DCD0] rounded-lg p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by title, keyword, DGMS reference, or tag..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-md border border-[#CBD5E1] bg-[#FAF9F6] text-xs text-[#102A43] focus:outline-none focus:border-[#102A43] focus:bg-white"
            />
            <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-2.5" />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              className="p-2 rounded-md border border-[#CBD5E1] bg-[#FAF9F6] text-xs font-medium text-[#102A43] focus:outline-none"
            >
              <option value="all">All Document Types</option>
              {docTypes.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={e => setSelectedYear(e.target.value)}
              className="p-2 rounded-md border border-[#CBD5E1] bg-[#FAF9F6] text-xs font-medium text-[#102A43] focus:outline-none"
            >
              <option value="all">All Years</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
          </div>
        </div>
      </div>

      {/* Documents Grid / Table */}
      <div className="bg-white border border-[#E2DCD0] rounded-lg shadow-xs overflow-hidden">
        {filteredDocs.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#64748B]">
            No documents match your active query filters. Try adjusting search terms.
          </div>
        ) : (
          <div className="divide-y divide-[#E2DCD0]">
            {filteredDocs.map(doc => (
              <div
                key={doc.id}
                onClick={() => setSelectedDoc(doc)}
                className="p-4 sm:p-5 hover:bg-[#FAF9F6] transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div className="p-2 bg-[#F5F1EB] rounded-md border border-[#E2DCD0] text-[#102A43] shrink-0 mt-0.5">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-bold text-[#102A43] text-sm hover:underline">
                        {doc.title}
                      </h3>
                      {doc.isOfficialSource && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                          GOVT. PUBLICATION
                        </span>
                      )}
                      <StatusBadge status={doc.processingStatus} size="sm" />
                    </div>
                    <p className="text-[#475569] text-xs leading-relaxed line-clamp-2">
                      {doc.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-[#64748B]">
                      <span>Mine: <strong className="text-[#102A43]">{doc.mineName}</strong></span>
                      <span>•</span>
                      <span>Authority: <strong className="text-[#102A43]">{doc.sourceOrganization}</strong></span>
                      <span>•</span>
                      <span>Year: <strong>{doc.year}</strong></span>
                      <span>•</span>
                      <span>Size: <strong>{doc.fileSize}</strong></span>
                      {doc.provenance && (
                        <>
                          <span>•</span>
                          <DataProvenanceBadge provenance={doc.provenance} compact />
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 sm:self-center">
                  <button
                    type="button"
                    onClick={() => setSelectedDoc(doc)}
                    className="px-3 py-1.5 rounded-md bg-[#FAF9F6] hover:bg-[#F5F1EB] border border-[#E2DCD0] text-xs font-semibold text-[#102A43] flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Dossier</span>
                  </button>
                  <button
                    type="button"
                    onClick={e => handleDownload(e, doc.title)}
                    className="p-1.5 rounded-md text-[#64748B] hover:bg-[#F5F1EB] hover:text-[#102A43] border border-transparent hover:border-[#E2DCD0]"
                    title="Simulate Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
