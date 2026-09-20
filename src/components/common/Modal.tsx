import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = '2xl'
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
  }[maxWidth];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#0F172A]/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
        <div className={`relative w-full ${widthClasses} bg-white rounded-lg border border-[#E2DCD0] shadow-xl overflow-hidden`}>
          {/* Header */}
          <div className="flex items-start justify-between px-6 py-4 border-b border-[#E2DCD0] bg-[#FAF9F6]">
            <div>
              <h3 className="text-base font-semibold text-[#102A43]">
                {title}
              </h3>
              {subtitle && (
                <p className="mt-0.5 text-xs text-[#64748B]">
                  {subtitle}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="rounded-md p-1.5 text-[#64748B] hover:bg-[#EAE5DC] hover:text-[#102A43] transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5 max-h-[75vh] overflow-y-auto">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="px-6 py-3.5 border-t border-[#E2DCD0] bg-[#FAF9F6] flex justify-end gap-2.5">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
