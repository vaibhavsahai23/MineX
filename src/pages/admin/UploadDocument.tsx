import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  ArrowRight,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DocumentType, PriorityLevel } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PrototypeNotice } from '../../components/common/PrototypeNotice';

export const UploadDocument: React.FC = () => {
  const { mines, uploadDocument, navigate, t } = useApp();

  // File state
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: string } | null>({
    name: 'CMPDI_Geological_Exploration_Block_IV.pdf',
    size: '8.4 MB'
  });
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form inputs
  const [title, setTitle] = useState('CMPDI Geological Exploration & Core Seam Logging - Block IV');
  const [docType, setDocType] = useState<DocumentType>('Geological Report');
  const [mineId, setMineId] = useState('mine-01');
  const [sourceOrg, setSourceOrg] = useState('CMPDI');
  const [department, setDepartment] = useState('Exploration & Drilling');
  const [year, setYear] = useState('2024');
  const [reportingPeriod, setReportingPeriod] = useState('Q3 FY 2024-25');
  const [priority, setPriority] = useState<PriorityLevel>('high');
  const [description, setDescription] = useState(
    'Borehole exploratory drill core sampling across Seams IV through IX. Contains proximate coal analysis, ash percentage, and moisture metrics.'
  );
  const [tagsInput, setTagsInput] = useState('Exploration, Core Log, Borehole, GCV Grade');
  const [initiateAutoProcessing, setInitiateAutoProcessing] = useState(true);

  // Upload confirmation state
  const [uploadedDocId, setUploadedDocId] = useState<string | null>(null);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      });
      setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[_ -]+/g, ' '));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      });
      setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[_ -]+/g, ' '));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    const matchedMine = mines.find(m => m.id === mineId);

    const docId = uploadDocument(
      selectedFile,
      {
        title,
        docType,
        mineId,
        mineName: matchedMine?.name || 'Rajmahal Open Cast Project',
        sourceOrganization: sourceOrg,
        department,
        year: parseInt(year, 10) || 2024,
        reportingPeriod,
        priority,
        description,
        tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean)
      }
    );

    setUploadedDocId(docId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#E2DCD0] rounded-lg p-5 sm:p-6 shadow-xs">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
          {t.navUploadDocument}
        </span>
        <h1 className="text-xl sm:text-2xl font-bold text-[#102A43] tracking-tight mt-0.5">
          Mining Document Ingestion & Schema Indexer
        </h1>
        <p className="text-xs text-[#64748B] mt-1">
          Ingest geological borehole reports, mine production plans, DGMS circulars, and environmental audits into the centralized digital lake
        </p>
      </div>

      <PrototypeNotice 
        message="Document Ingestion Engine: Uploaded files are immediately registered in the active database and queued into the OCR extraction pipeline."
      />

      {/* Success Notification */}
      {uploadedDocId && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold text-sm block">Document Successfully Ingested!</span>
              <span className="text-emerald-800">
                Registered under identifier <strong>{uploadedDocId}</strong>. Automated OCR and tabular neural extraction initialized.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/admin/processing')}
              className="px-3 py-1.5 rounded bg-[#102A43] text-white font-semibold hover:bg-[#1E3A8A] flex items-center gap-1"
            >
              <span>Track Pipeline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setUploadedDocId(null);
                setSelectedFile(null);
                setTitle('');
              }}
              className="px-3 py-1.5 rounded bg-white text-emerald-800 border border-emerald-300 font-semibold hover:bg-emerald-100"
            >
              Ingest Another
            </button>
          </div>
        </div>
      )}

      {/* Ingestion Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: File Dropzone & Specifications */}
        <div className="space-y-6">
          <div className="bg-white border border-[#E2DCD0] rounded-lg p-5 shadow-xs">
            <h3 className="text-xs font-bold text-[#102A43] uppercase tracking-wider mb-3">
              1. Document File Ingestion
            </h3>

            {/* Drop Zone */}
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleFileDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                dragOver
                  ? 'border-[#102A43] bg-blue-50/40'
                  : selectedFile
                  ? 'border-emerald-300 bg-emerald-50/20'
                  : 'border-[#CBD5E1] bg-[#FAF9F6] hover:bg-[#F5F1EB]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.docx,.xlsx,.png,.jpg,.tif"
                onChange={handleFileSelect}
              />
              <UploadCloud className={`w-10 h-10 mx-auto mb-2 ${selectedFile ? 'text-emerald-700' : 'text-[#64748B]'}`} />
              <div className="text-xs font-semibold text-[#102A43]">
                {selectedFile ? 'Change Selected File' : 'Click or Drag File Here'}
              </div>
              <p className="text-[11px] text-[#64748B] mt-1">
                Supports PDF, DOCX, XLSX, TIFF, Scanned Maps (up to 150 MB)
              </p>
            </div>

            {/* Selected File Card */}
            {selectedFile && (
              <div className="mt-4 p-3 bg-[#FAF9F6] border border-[#E2DCD0] rounded-md flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="w-4 h-4 text-[#102A43] shrink-0" />
                  <div className="min-w-0">
                    <span className="font-semibold text-[#102A43] block truncate">{selectedFile.name}</span>
                    <span className="text-[10px] text-[#64748B]">{selectedFile.size} • Ready for Ingestion</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="p-1 text-[#64748B] hover:text-red-600"
                  title="Remove file"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Pipeline Options Card */}
          <div className="bg-white border border-[#E2DCD0] rounded-lg p-5 shadow-xs text-xs space-y-3">
            <h3 className="text-xs font-bold text-[#102A43] uppercase tracking-wider">
              Ingestion Execution Mode
            </h3>
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={initiateAutoProcessing}
                onChange={e => setInitiateAutoProcessing(e.target.checked)}
                className="rounded border-[#CBD5E1] text-[#102A43] focus:ring-0 mt-0.5"
              />
              <div>
                <span className="font-semibold text-[#102A43] block">Automated Neural Extraction</span>
                <span className="text-[#64748B] text-[11px]">
                  Automatically route file through OCR, tabular parser, and geological schema tagging.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Right 2 Columns: Metadata Form Inputs */}
        <div className="lg:col-span-2 bg-white border border-[#E2DCD0] rounded-lg p-5 sm:p-6 shadow-xs text-xs space-y-4">
          <h3 className="text-xs font-bold text-[#102A43] uppercase tracking-wider border-b border-[#F1EFEA] pb-2">
            2. Structured Metadata Attributes
          </h3>

          <div>
            <label className="block font-semibold text-[#102A43] mb-1.5">
              Official Document Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full p-2.5 rounded-md border border-[#CBD5E1] bg-[#FAF9F6] text-xs font-medium text-[#102A43] focus:outline-none focus:border-[#102A43] focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#102A43] mb-1.5">
                Document Classification *
              </label>
              <select
                value={docType}
                onChange={e => setDocType(e.target.value as DocumentType)}
                className="w-full p-2.5 rounded-md border border-[#CBD5E1] bg-[#FAF9F6] text-xs font-medium text-[#102A43] focus:outline-none focus:border-[#102A43]"
              >
                <option value="Mine Plan">Mine Plan / Pit Layout</option>
                <option value="Geological Report">Geological Borehole Report</option>
                <option value="Production Report">Production / Dispatch Telemetry</option>
                <option value="Safety Audit">Safety & Compliance Audit</option>
                <option value="DGMS Circular">DGMS Statutory Circular</option>
                <option value="Worker Training">Worker Training & Competency</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#102A43] mb-1.5">
                Associated Mine Sector *
              </label>
              <select
                value={mineId}
                onChange={e => setMineId(e.target.value)}
                className="w-full p-2.5 rounded-md border border-[#CBD5E1] bg-[#FAF9F6] text-xs font-medium text-[#102A43] focus:outline-none focus:border-[#102A43]"
              >
                {mines.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.mineCode})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#102A43] mb-1.5">
                Source Organization / Authority *
              </label>
              <select
                value={sourceOrg}
                onChange={e => setSourceOrg(e.target.value)}
                className="w-full p-2.5 rounded-md border border-[#CBD5E1] bg-[#FAF9F6] text-xs font-medium text-[#102A43] focus:outline-none focus:border-[#102A43]"
              >
                <option value="CMPDI">CMPDI (HQ / Regional Institute)</option>
                <option value="Ministry of Coal">Ministry of Coal (New Delhi)</option>
                <option value="DGMS">DGMS (Directorate General of Mines Safety)</option>
                <option value="Coal India Limited">Coal India Limited (Apex)</option>
                <option value="Eastern Coalfields Limited (ECL)">Eastern Coalfields Limited (ECL)</option>
                <option value="Bharat Coking Coal Limited (BCCL)">Bharat Coking Coal Limited (BCCL)</option>
                <option value="South Eastern Coalfields Limited (SECL)">South Eastern Coalfields Limited (SECL)</option>
                <option value="Western Coalfields Limited (WCL)">Western Coalfields Limited (WCL)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#102A43] mb-1.5">
                Authoring Department *
              </label>
              <input
                type="text"
                value={department}
                onChange={e => setDepartment(e.target.value)}
                className="w-full p-2.5 rounded-md border border-[#CBD5E1] bg-[#FAF9F6] text-xs font-medium text-[#102A43] focus:outline-none focus:border-[#102A43]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-[#102A43] mb-1.5">
                Financial / Calendar Year *
              </label>
              <input
                type="number"
                value={year}
                onChange={e => setYear(e.target.value)}
                className="w-full p-2.5 rounded-md border border-[#CBD5E1] bg-[#FAF9F6] text-xs font-medium text-[#102A43] focus:outline-none focus:border-[#102A43]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#102A43] mb-1.5">
                Reporting Period *
              </label>
              <input
                type="text"
                value={reportingPeriod}
                onChange={e => setReportingPeriod(e.target.value)}
                className="w-full p-2.5 rounded-md border border-[#CBD5E1] bg-[#FAF9F6] text-xs font-medium text-[#102A43] focus:outline-none focus:border-[#102A43]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#102A43] mb-1.5">
                Statutory Priority
              </label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as PriorityLevel)}
                className="w-full p-2.5 rounded-md border border-[#CBD5E1] bg-[#FAF9F6] text-xs font-medium text-[#102A43] focus:outline-none focus:border-[#102A43]"
              >
                <option value="low">Low (Reference Only)</option>
                <option value="medium">Medium (Standard)</option>
                <option value="high">High (Audit Priority)</option>
                <option value="urgent">Urgent (Immediate Safety Directive)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#102A43] mb-1.5">
              Executive Abstract / Technical Scope
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full p-2.5 rounded-md border border-[#CBD5E1] bg-[#FAF9F6] text-xs font-medium text-[#102A43] focus:outline-none focus:border-[#102A43] focus:bg-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#102A43] mb-1.5">
              Knowledge Retrieval Indexing Tags (comma separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={e => setTagsInput(e.target.value)}
              className="w-full p-2.5 rounded-md border border-[#CBD5E1] bg-[#FAF9F6] text-xs font-medium text-[#102A43] focus:outline-none focus:border-[#102A43]"
            />
          </div>

          <div className="pt-4 border-t border-[#F1EFEA] flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/admin/documents')}
              className="px-4 py-2 rounded-md border border-[#CBD5E1] text-[#64748B] hover:bg-[#F5F1EB] font-semibold text-xs"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              disabled={!selectedFile}
              className="px-6 py-2 rounded-md bg-[#102A43] text-white hover:bg-[#1E3A8A] font-semibold text-xs transition-colors flex items-center gap-2 shadow-xs disabled:opacity-50"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Confirm & Ingest Document</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
