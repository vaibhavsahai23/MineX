import React from 'react';
import { useApp } from '../../context/AppContext';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const { t } = useApp();

  const normalized = status.toLowerCase().replace(/[\s_-]+/g, '');

  let bg = 'bg-slate-100 text-slate-700 border-slate-200';
  let label = status;

  switch (normalized) {
    // Mine & General operational statuses
    case 'operational':
    case 'active':
      bg = 'bg-emerald-50 text-emerald-800 border-emerald-200';
      label = t.statusOperational || 'Operational';
      break;
    case 'maintenance':
      bg = 'bg-amber-50 text-amber-800 border-amber-200';
      label = t.statusMaintenance || 'Maintenance';
      break;
    case 'inspection':
    case 'underinspection':
      bg = 'bg-blue-50 text-blue-800 border-blue-200';
      label = t.statusInspection || 'Under Inspection';
      break;
    case 'standby':
      bg = 'bg-slate-100 text-slate-700 border-slate-300';
      label = t.statusStandby || 'Standby';
      break;

    // Document & Processing statuses
    case 'uploaded':
      bg = 'bg-sky-50 text-sky-800 border-sky-200';
      label = t.statusUploaded || 'Uploaded';
      break;
    case 'processing':
      bg = 'bg-indigo-50 text-indigo-800 border-indigo-200 animate-pulse';
      label = t.statusProcessing || 'Processing';
      break;
    case 'extracting':
      bg = 'bg-amber-50 text-amber-900 border-amber-200';
      label = t.statusExtracting || 'Extracting';
      break;
    case 'structuring':
      bg = 'bg-purple-50 text-purple-800 border-purple-200';
      label = t.statusStructuring || 'Structuring';
      break;
    case 'processed':
    case 'completed':
      bg = 'bg-emerald-50 text-emerald-800 border-emerald-200';
      label = t.statusProcessed || 'Processed';
      break;
    case 'failed':
    case 'critical':
      bg = 'bg-rose-50 text-rose-800 border-rose-200';
      label = t.statusFailed || 'Failed';
      break;

    // Task & Priority statuses
    case 'pending':
      bg = 'bg-slate-100 text-slate-700 border-slate-200';
      label = t.statusPending || 'Pending';
      break;
    case 'inprogress':
      bg = 'bg-blue-50 text-blue-800 border-blue-200';
      label = t.statusInProgress || 'In Progress';
      break;
    case 'low':
      bg = 'bg-slate-100 text-slate-700 border-slate-200';
      label = t.priorityLow || 'Low';
      break;
    case 'medium':
      bg = 'bg-blue-50 text-blue-700 border-blue-200';
      label = t.priorityMedium || 'Medium';
      break;
    case 'high':
      bg = 'bg-amber-50 text-amber-800 border-amber-200';
      label = t.priorityHigh || 'High';
      break;
    case 'urgent':
      bg = 'bg-rose-50 text-rose-800 border-rose-300 font-semibold';
      label = t.priorityUrgent || 'Urgent';
      break;
    case 'inactive':
      bg = 'bg-slate-100 text-slate-500 border-slate-200';
      label = t.statusInactive || 'Inactive';
      break;
    default:
      label = status;
  }

  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md border font-medium tracking-wide ${padding} ${bg}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 shrink-0" />
      <span className="whitespace-nowrap">{label}</span>
    </span>
  );
};
