import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

interface PrototypeNoticeProps {
  message?: string;
  variant?: 'inline' | 'banner';
}

export const PrototypeNotice: React.FC<PrototypeNoticeProps> = ({ 
  message = 'Prototype Demonstration • Connected to verified local mining index. Enterprise backend & Gemini API endpoints mapped.',
  variant = 'inline' 
}) => {
  if (variant === 'banner') {
    return (
      <div className="bg-[#F5F1EB] border-b border-[#E2DCD0] px-4 py-2 text-xs text-[#525252] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#102A43]" />
          <span className="font-medium text-[#102A43]">MineX Sandbox Environment:</span>
          <span>{message}</span>
        </div>
        <span className="hidden sm:inline-block font-mono text-[11px] text-[#737373] bg-white/70 px-2 py-0.5 rounded border border-[#E2DCD0]">
          STATUS: PROTOTYPE_v1.0
        </span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F5F1EB] border border-[#E2DCD0] text-[11px] text-[#525252]">
      <Info className="w-3.5 h-3.5 text-[#102A43] shrink-0" />
      <span>{message}</span>
    </div>
  );
};
