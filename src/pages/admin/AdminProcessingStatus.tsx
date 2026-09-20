import React, { useState } from 'react';
import { 
  Cpu, 
  CheckCircle2, 
  Clock, 
  Play, 
  RotateCcw, 
  Layers, 
  Search, 
  Filter, 
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PrototypeNotice } from '../../components/common/PrototypeNotice';

export const AdminProcessingStatus: React.FC = () => {
  const { processingJobs, advanceProcessingStage, setSelectedDoc, documents, t } = useApp();
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredJobs = processingJobs.filter(j => {
    if (filterStatus === 'all') return true;
    return j.status === filterStatus;
  });

  const stagesList = [
    { key: 'uploaded', label: '1. Ingestion' },
    { key: 'processing', label: '2. OCR Neural Scan' },
    { key: 'extracting', label: '3. Data Extraction' },
    { key: 'structuring', label: '4. Schema Structuring' },
    { key: 'processed', label: '5. Master Index' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#E2DCD0] rounded-lg p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              {t.navProcessingStatus}
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-[#102A43] tracking-tight mt-0.5">
              Enterprise OCR & Neural Processing Queue
            </h1>
            <p className="text-xs text-[#64748B] mt-1">
              Distributed asynchronous pipeline extracting geological metrics, borehole depth, and DGMS tabular safety registers
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="p-2 rounded-md border border-[#CBD5E1] bg-[#FAF9F6] text-xs font-semibold text-[#102A43] focus:outline-none"
            >
              <option value="all">All Stages</option>
              <option value="uploaded">Uploaded / Queued</option>
              <option value="processing">In OCR Scan</option>
              <option value="extracting">Extracting Data</option>
              <option value="structuring">Structuring Schema</option>
              <option value="processed">Completed & Indexed</option>
            </select>
          </div>
        </div>
      </div>

      <PrototypeNotice 
        message="Demonstration Processing Engine: Click 'Advance Pipeline' on any job to test state transitions and live database schema synchronization."
      />

      {/* Processing Jobs Queue */}
      <div className="space-y-4">
        {filteredJobs.map(job => {
          const matchedDoc = documents.find(d => d.id === job.docId);

          return (
            <div
              key={job.jobId}
              className="bg-white border border-[#E2DCD0] rounded-lg p-5 shadow-xs space-y-4 text-xs"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F1EFEA] pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-[#64748B]">{job.jobId}</span>
                    <StatusBadge status={job.status} size="sm" />
                  </div>
                  <h3 className="font-bold text-[#102A43] text-sm mt-0.5">
                    {job.docTitle}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  {job.status !== 'processed' && (
                    <button
                      onClick={() => advanceProcessingStage(job.jobId)}
                      className="px-3.5 py-1.5 rounded-md bg-[#102A43] text-white font-semibold hover:bg-[#1E3A8A] transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Advance Pipeline</span>
                    </button>
                  )}
                  {matchedDoc && (
                    <button
                      onClick={() => setSelectedDoc(matchedDoc)}
                      className="px-3 py-1.5 rounded-md bg-[#FAF9F6] hover:bg-[#F5F1EB] border border-[#E2DCD0] font-semibold text-[#102A43]"
                    >
                      Inspect Dossier
                    </button>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-[11px] font-medium text-[#64748B] mb-1.5">
                  <span>Digitization Completeness Index</span>
                  <span className="font-bold text-[#102A43]">{job.progress}%</span>
                </div>
                <div className="w-full h-2 bg-[#F1EFEA] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#102A43] transition-all duration-500 rounded-full"
                    style={{ width: `${job.progress}%` }}
                  />
                </div>
              </div>

              {/* 5-Stage Stepper Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                {stagesList.map((stage, idx) => {
                  const stageState = job.pipelineStages.find(s => s.stage === stage.key);
                  const isCompleted = stageState?.completed;
                  const isCurrent = job.status === stage.key;

                  return (
                    <div
                      key={stage.key}
                      className={`p-2.5 rounded border ${
                        isCompleted
                          ? 'bg-[#F0FDF4] border-emerald-200 text-emerald-900'
                          : isCurrent
                          ? 'bg-blue-50 border-blue-300 text-blue-900 font-bold'
                          : 'bg-[#FAF9F6] border-[#E2DCD0] text-[#94A3B8]'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        {isCompleted ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        ) : isCurrent ? (
                          <RefreshCw className="w-3.5 h-3.5 text-blue-600 animate-spin shrink-0" />
                        ) : (
                          <Clock className="w-3.5 h-3.5 text-[#CBD5E1] shrink-0" />
                        )}
                        <span className="text-[10px] font-semibold truncate">{stage.label}</span>
                      </div>
                      <span className="text-[9px] block text-[#64748B] truncate">
                        {stageState?.notes || 'Pending'}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Telemetry Footer */}
              <div className="pt-2 border-t border-[#F1EFEA] flex flex-wrap justify-between text-[11px] text-[#64748B]">
                <span>Ingested: <strong>{job.uploadedTime}</strong></span>
                <span>Last Updated: <strong>{job.lastUpdatedTime}</strong></span>
                <span>Worker Allocation Link: <strong>Verified</strong></span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
