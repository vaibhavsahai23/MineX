import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Trash2, 
  Edit3, 
  Check, 
  Clock, 
  Layers, 
  Tag, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { DocumentItem } from '../../types';

export const DocumentDetailModal: React.FC = () => {
  const { selectedDoc, setSelectedDoc, deleteDocument, updateDocumentMetadata, t } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [downloadNotice, setDownloadNotice] = useState(false);

  // Edit form state
  const [editTitle, setEditTitle] = useState('');
  const [editDepartment, setEditDepartment] = useState('');
  const [editPeriod, setEditPeriod] = useState('');
  const [editDescription, setEditDescription] = useState('');

  if (!selectedDoc) return null;

  const handleStartEdit = () => {
    setEditTitle(selectedDoc.title);
    setEditDepartment(selectedDoc.department);
    setEditPeriod(selectedDoc.reportingPeriod);
    setEditDescription(selectedDoc.description);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    updateDocumentMetadata(selectedDoc.id, {
      title: editTitle,
      department: editDepartment,
      reportingPeriod: editPeriod,
      description: editDescription
    });
    setIsEditing(false);
  };

  const handleDownload = () => {
    setDownloadNotice(true);
    setTimeout(() => setDownloadNotice(false), 3500);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to remove this document from the prototype repository?')) {
      deleteDocument(selectedDoc.id);
    }
  };

  return (
    <Modal
      isOpen={!!selectedDoc}
      onClose={() => {
        setIsEditing(false);
        setSelectedDoc(null);
      }}
      title={isEditing ? 'Edit Document Metadata' : selectedDoc.title}
      subtitle={`${selectedDoc.fileName} • ${selectedDoc.fileSize} • Uploaded by ${selectedDoc.uploadedBy}`}
      maxWidth="4xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-red-600 hover:bg-red-50 border border-red-200 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t.delete}</span>
          </button>

          <div className="flex items-center gap-2">
            {!isEditing ? (
              <>
                <button
                  onClick={handleStartEdit}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-[#F5F1EB] text-[#102A43] hover:bg-[#EAE5DC] border border-[#E2DCD0] transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{t.edit}</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-medium bg-[#102A43] text-white hover:bg-[#1E3A8A] transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{t.download} (PDF)</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 rounded-md text-xs font-medium text-[#64748B] hover:bg-[#F5F1EB] border border-[#E2DCD0]"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-3.5 py-1.5 rounded-md text-xs font-medium bg-[#102A43] text-white hover:bg-[#1E3A8A]"
                >
                  {t.save}
                </button>
              </>
            )}
          </div>
        </div>
      }
    >
      {downloadNotice && (
        <div className="mb-4 p-3 rounded-md bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between animate-fade-in">
          <span>Prototype Download Action: Initiated simulated download of <strong>{selectedDoc.fileName}</strong>.</span>
          <Check className="w-4 h-4 text-emerald-600" />
        </div>
      )}

      {isEditing ? (
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#102A43] mb-1">Document Title</label>
            <input
              type="text"
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              className="w-full p-2 rounded border border-[#CBD5E1] bg-white text-xs focus:outline-none focus:border-[#102A43]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#102A43] mb-1">Department</label>
              <input
                type="text"
                value={editDepartment}
                onChange={e => setEditDepartment(e.target.value)}
                className="w-full p-2 rounded border border-[#CBD5E1] bg-white text-xs focus:outline-none focus:border-[#102A43]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#102A43] mb-1">Reporting Period</label>
              <input
                type="text"
                value={editPeriod}
                onChange={e => setEditPeriod(e.target.value)}
                className="w-full p-2 rounded border border-[#CBD5E1] bg-white text-xs focus:outline-none focus:border-[#102A43]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#102A43] mb-1">Executive Summary / Description</label>
            <textarea
              rows={3}
              value={editDescription}
              onChange={e => setEditDescription(e.target.value)}
              className="w-full p-2 rounded border border-[#CBD5E1] bg-white text-xs focus:outline-none focus:border-[#102A43]"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Status & Priority Ribbon */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-[#FAF9F6] border border-[#E2DCD0] rounded-md text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[#64748B]">Processing Status:</span>
              <StatusBadge status={selectedDoc.processingStatus} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#64748B]">Classification Priority:</span>
              <StatusBadge status={selectedDoc.priority} size="sm" />
            </div>
          </div>

          {/* Description */}
          <div className="p-4 bg-white border border-[#E2DCD0] rounded-lg">
            <h4 className="text-xs font-bold text-[#102A43] uppercase tracking-wider mb-1.5">
              Executive Synopsis
            </h4>
            <p className="text-xs text-[#475569] leading-relaxed">
              {selectedDoc.description}
            </p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-white border border-[#E2DCD0] rounded-md">
              <span className="text-[#64748B] block text-[11px]">Mine Allocation</span>
              <span className="font-semibold text-[#102A43] mt-0.5 block">{selectedDoc.mineName}</span>
            </div>
            <div className="p-3 bg-white border border-[#E2DCD0] rounded-md">
              <span className="text-[#64748B] block text-[11px]">Originating Authority</span>
              <span className="font-semibold text-[#102A43] mt-0.5 block">{selectedDoc.sourceOrganization}</span>
            </div>
            <div className="p-3 bg-white border border-[#E2DCD0] rounded-md">
              <span className="text-[#64748B] block text-[11px]">Document Type</span>
              <span className="font-semibold text-[#102A43] mt-0.5 block">{selectedDoc.docType}</span>
            </div>
            <div className="p-3 bg-white border border-[#E2DCD0] rounded-md">
              <span className="text-[#64748B] block text-[11px]">Department</span>
              <span className="font-semibold text-[#102A43] mt-0.5 block">{selectedDoc.department}</span>
            </div>
            <div className="p-3 bg-white border border-[#E2DCD0] rounded-md">
              <span className="text-[#64748B] block text-[11px]">Financial / Calendar Year</span>
              <span className="font-semibold text-[#102A43] mt-0.5 block">{selectedDoc.year}</span>
            </div>
            <div className="p-3 bg-white border border-[#E2DCD0] rounded-md">
              <span className="text-[#64748B] block text-[11px]">Reporting Period</span>
              <span className="font-semibold text-[#102A43] mt-0.5 block">{selectedDoc.reportingPeriod}</span>
            </div>
          </div>

          {/* Extracted Structured Intelligence */}
          {selectedDoc.extractedMetadata && (
            <div className="p-4 bg-blue-50/50 border border-blue-200/70 rounded-lg">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#102A43] uppercase tracking-wider mb-2">
                <ShieldCheck className="w-4 h-4 text-blue-700" />
                <span>Extracted Schema Intelligence (Digitized)</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {selectedDoc.extractedMetadata.coalGrade && (
                  <div>
                    <span className="text-[#64748B]">Assayed Seam Grade:</span>
                    <p className="font-semibold text-[#102A43]">{selectedDoc.extractedMetadata.coalGrade}</p>
                  </div>
                )}
                {selectedDoc.extractedMetadata.seamDepthMeters && (
                  <div>
                    <span className="text-[#64748B]">Mean Borehole Depth:</span>
                    <p className="font-semibold text-[#102A43]">{selectedDoc.extractedMetadata.seamDepthMeters} m</p>
                  </div>
                )}
                {selectedDoc.extractedMetadata.complianceScore && (
                  <div>
                    <span className="text-[#64748B]">Statutory Compliance:</span>
                    <p className="font-semibold text-emerald-700">{selectedDoc.extractedMetadata.complianceScore}% Passed</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Search Tags */}
          <div>
            <span className="text-xs font-semibold text-[#64748B] block mb-1.5">Indexed Search Tokens</span>
            <div className="flex flex-wrap gap-1.5">
              {selectedDoc.tags.map((tag, idx) => (
                <span key={idx} className="text-[11px] px-2 py-0.5 rounded bg-[#FAF9F6] border border-[#E2DCD0] text-[#475569]">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};
