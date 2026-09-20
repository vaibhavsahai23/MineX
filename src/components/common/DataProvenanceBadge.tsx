import React, { useState } from 'react';
import { ShieldCheck, ExternalLink, Info, X } from 'lucide-react';
import { OfficialDataProvenance } from '../../types';

interface DataProvenanceBadgeProps {
  provenance: OfficialDataProvenance;
  compact?: boolean;
}

export const DataProvenanceBadge: React.FC<DataProvenanceBadgeProps> = ({ provenance, compact = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        type="button"
        className={`inline-flex items-center gap-1.5 rounded-full border transition-all cursor-pointer select-none text-left ${
          compact
            ? 'px-2 py-0.5 text-[10px] font-medium bg-[#F5F1EB] text-[#102A43] border-[#E2DCD0] hover:bg-[#EAE4D9]'
            : 'px-2.5 py-1 text-xs font-medium bg-[#FAF9F6] text-[#102A43] border-[#E2DCD0] hover:bg-[#F5F1EB] shadow-2xs'
        }`}
        title="View Official Source & Data Provenance"
      >
        <ShieldCheck className="w-3 h-3 text-[#B45309] shrink-0" />
        <span className="font-semibold truncate max-w-[140px] sm:max-w-none">
          {provenance.organization}
        </span>
        <span className="text-[#64748B] text-[10px] font-normal border-l border-[#D1D5DB] pl-1.5 ml-0.5">
          {provenance.reportingPeriod}
        </span>
      </button>

      {/* Provenance Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div 
            className="w-full max-w-lg bg-white rounded-lg shadow-xl border border-[#E2DCD0] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-[#E2DCD0] bg-[#FAF9F6] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#F5F1EB] border border-[#E2DCD0] flex items-center justify-center text-[#B45309]">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#102A43]">Official Data Provenance</h3>
                  <p className="text-xs text-[#64748B]">Verified Public Intelligence Record</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md text-[#64748B] hover:text-[#102A43] hover:bg-[#F5F1EB] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4 text-xs text-[#1F2937]">
              <div className="bg-[#F5F1EB] p-3.5 rounded-md border border-[#E2DCD0]">
                <div className="text-[11px] font-semibold uppercase text-[#64748B] tracking-wider mb-1">
                  Metric Reference
                </div>
                <div className="text-base font-bold text-[#102A43]">
                  {provenance.metricLabel}: <span className="text-[#B45309]">{provenance.metricValue}</span>
                </div>
                {provenance.verificationNote && (
                  <p className="mt-1 text-xs text-[#475569] leading-relaxed">
                    {provenance.verificationNote}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-[#FAF9F6] rounded-md border border-[#E2DCD0]">
                  <div className="text-[10px] uppercase font-semibold text-[#64748B] tracking-wider">
                    Authoritative Organization
                  </div>
                  <div className="font-semibold text-sm text-[#102A43] mt-0.5">
                    {provenance.organization}
                  </div>
                </div>

                <div className="p-3 bg-[#FAF9F6] rounded-md border border-[#E2DCD0]">
                  <div className="text-[10px] uppercase font-semibold text-[#64748B] tracking-wider">
                    Reporting Period
                  </div>
                  <div className="font-semibold text-sm text-[#102A43] mt-0.5">
                    {provenance.reportingPeriod}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-[#FAF9F6] rounded-md border border-[#E2DCD0]">
                <div className="text-[10px] uppercase font-semibold text-[#64748B] tracking-wider">
                  Source Publication / Document
                </div>
                <div className="font-medium text-xs text-[#102A43] mt-0.5">
                  {provenance.sourceDocument}
                </div>
                <div className="text-[11px] text-[#64748B] mt-1">
                  Record Date: {provenance.dataDate}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#E2DCD0]">
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  {provenance.statusText}
                </div>

                <a
                  href={provenance.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#102A43] hover:bg-[#1B365D] text-white rounded-md text-xs font-semibold transition-colors"
                >
                  <span>Verify at Official Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
