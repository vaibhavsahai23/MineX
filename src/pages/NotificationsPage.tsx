import React, { useState } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  AlertCircle, 
  Check, 
  Trash2, 
  Filter,
  FileText,
  Cpu,
  ClipboardList
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NotificationItem } from '../types';

export const NotificationsPage: React.FC = () => {
  const { notifications, markAllNotificationsRead, currentLang, t } = useApp();
  const [filterType, setFilterType] = useState<string>('all');

  const filteredNotifications = notifications.filter((n: NotificationItem) => {
    if (filterType === 'all') return true;
    return n.type === filterType;
  });

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'safety':
        return <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />;
      case 'document':
        return <FileText className="w-4 h-4 text-blue-600 shrink-0" />;
      case 'assignment':
        return <ClipboardList className="w-4 h-4 text-indigo-600 shrink-0" />;
      case 'processing':
        return <Cpu className="w-4 h-4 text-emerald-600 shrink-0" />;
      case 'system':
      default:
        return <Info className="w-4 h-4 text-[#102A43] shrink-0" />;
    }
  };

  const types: Array<{ key: string; label: string }> = [
    { key: 'all', label: 'All Bulletins' },
    { key: 'safety', label: 'Safety Advisories' },
    { key: 'document', label: 'Documents' },
    { key: 'assignment', label: 'Assignments' },
    { key: 'processing', label: 'Processing Pipeline' },
    { key: 'system', label: 'System Announcements' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#E2DCD0] rounded-lg p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              {t.navNotifications}
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-[#102A43] tracking-tight mt-0.5">
              Official Directives & Operational Bulletins
            </h1>
            <p className="text-xs text-[#64748B] mt-1">
              Statutory circulars, highwall safety alerts, and system ingestion updates
            </p>
          </div>

          <button
            onClick={markAllNotificationsRead}
            className="px-3.5 py-2 rounded-md bg-[#FAF9F6] text-[#102A43] text-xs font-semibold hover:bg-[#F5F1EB] border border-[#E2DCD0] transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Check className="w-3.5 h-3.5 text-emerald-700" />
            <span>Mark All as Read</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {types.map(item => (
          <button
            key={item.key}
            onClick={() => setFilterType(item.key)}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors whitespace-nowrap ${
              filterType === item.key
                ? 'bg-[#102A43] text-white'
                : 'bg-white text-[#64748B] hover:text-[#102A43] border border-[#E2DCD0]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Notification Items List */}
      <div className="bg-white border border-[#E2DCD0] rounded-lg shadow-xs overflow-hidden divide-y divide-[#E2DCD0]">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#64748B]">
            No bulletins match this filter category.
          </div>
        ) : (
          filteredNotifications.map((n: NotificationItem) => (
            <div
              key={n.id}
              className={`p-4 sm:p-5 flex items-start gap-3.5 transition-colors text-xs ${
                n.read ? 'bg-white' : 'bg-[#FAF9F6]'
              }`}
            >
              <div className="mt-0.5">
                {getIcon(n.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-bold ${n.read ? 'text-[#334155]' : 'text-[#102A43] text-sm'}`}>
                      {currentLang === 'hi' && n.titleHi ? n.titleHi : n.title}
                    </h3>
                    {n.urgent && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-100 text-red-800 border border-red-200">
                        URGENT
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-[#64748B] shrink-0 font-mono">
                    {n.timestamp}
                  </span>
                </div>
                <p className="text-[#475569] mt-1 leading-relaxed text-xs">
                  {currentLang === 'hi' && n.messageHi ? n.messageHi : n.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
