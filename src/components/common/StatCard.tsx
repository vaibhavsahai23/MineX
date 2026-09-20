import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  icon?: React.ReactNode;
  variant?: 'default' | 'accent' | 'warning' | 'success';
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtext,
  trend,
  icon,
  variant = 'default'
}) => {
  let borderStyle = 'border-[#E2DCD0]';
  let accentBar = 'border-t-2 border-[#102A43]';

  if (variant === 'accent') {
    accentBar = 'border-t-2 border-[#B45309]';
  } else if (variant === 'warning') {
    accentBar = 'border-t-2 border-[#D97706]';
  } else if (variant === 'success') {
    accentBar = 'border-t-2 border-[#059669]';
  }

  return (
    <div className={`bg-white rounded-lg p-5 border ${borderStyle} ${accentBar} shadow-xs transition-shadow hover:shadow-sm`}>
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold tracking-wider text-[#64748B] uppercase">
          {label}
        </span>
        {icon && (
          <div className="text-[#64748B] p-1.5 bg-[#F8F7F4] rounded-md border border-[#EBE7DF]">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl lg:text-3xl font-bold tracking-tight text-[#0F2027]">
          {value}
        </span>
        {trend && (
          <span
            className={`text-xs font-medium px-1.5 py-0.5 rounded ${
              trend.isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {trend.value}
          </span>
        )}
      </div>

      {subtext && (
        <p className="mt-1.5 text-xs text-[#64748B] leading-relaxed">
          {subtext}
        </p>
      )}
    </div>
  );
};
