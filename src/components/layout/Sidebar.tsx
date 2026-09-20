import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  User, 
  ClipboardList, 
  UploadCloud, 
  FileText, 
  Cpu, 
  Database, 
  BarChart3, 
  Layers, 
  Users, 
  UserCheck, 
  Bot, 
  Bell, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Shield,
  HardHat,
  Compass
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Sidebar: React.FC = () => {
  const { 
    currentRole, 
    currentRoute, 
    currentUser, 
    currentAdmin, 
    notifications, 
    processingJobs, 
    navigate, 
    logout,
    t 
  } = useApp();

  const [isCollapsed, setIsCollapsed] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;
  const activeProcessingCount = processingJobs.filter(j => j.status !== 'processed' && j.status !== 'failed').length;

  interface NavItem {
    label: string;
    route: string;
    icon: React.ReactNode;
    badge?: number;
    badgeColor?: string;
  }

  const userNavItems: NavItem[] = [
    { label: t.navDashboard, route: '/user/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: t.navMyProfile, route: '/user/profile', icon: <User className="w-4 h-4" /> },
    { label: t.navMyAssignment, route: '/user/assignment', icon: <ClipboardList className="w-4 h-4" /> },
    { label: t.navDocuments, route: '/user/documents', icon: <FileText className="w-4 h-4" /> },
    { label: t.navProcessingStatus, route: '/user/processing', icon: <Cpu className="w-4 h-4" />, badge: activeProcessingCount, badgeColor: 'bg-amber-600' },
    { label: t.navData, route: '/user/data', icon: <Database className="w-4 h-4" /> },
    { label: t.navMineAssist, route: '/user/mine-assist', icon: <Bot className="w-4 h-4" /> },
    { label: t.navNotifications, route: '/user/notifications', icon: <Bell className="w-4 h-4" />, badge: unreadCount, badgeColor: 'bg-red-600' },
  ];

  const adminNavItems: NavItem[] = [
    { label: t.navOverview, route: '/admin/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: t.navMyProfile, route: '/admin/profile', icon: <User className="w-4 h-4" /> },
    { label: t.navUploadDocument, route: '/admin/upload', icon: <UploadCloud className="w-4 h-4" /> },
    { label: t.navDocuments, route: '/admin/documents', icon: <FileText className="w-4 h-4" /> },
    { label: t.navProcessingStatus, route: '/admin/processing', icon: <Cpu className="w-4 h-4" />, badge: activeProcessingCount, badgeColor: 'bg-amber-500' },
    { label: t.navData, route: '/admin/data', icon: <Database className="w-4 h-4" /> },
    { label: t.navAnalytics, route: '/admin/analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { label: t.navMineManagement, route: '/admin/mines', icon: <Layers className="w-4 h-4" /> },
    { label: t.navWorkerManagement, route: '/admin/workers', icon: <Users className="w-4 h-4" /> },
    { label: t.navUserManagement, route: '/admin/users', icon: <UserCheck className="w-4 h-4" /> },
    { label: t.navMineAssist, route: '/admin/mine-assist', icon: <Bot className="w-4 h-4" /> },
    { label: t.navNotifications, route: '/admin/notifications', icon: <Bell className="w-4 h-4" />, badge: unreadCount, badgeColor: 'bg-red-600' },
  ];

  const currentNavItems = currentRole === 'ADMIN' ? adminNavItems : userNavItems;

  return (
    <aside
      className={`relative flex flex-col bg-[#0B192C] text-[#E2E8F0] border-r border-[#1E293B] transition-all duration-200 z-40 ${
        isCollapsed ? 'w-18' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[#1E293B] bg-[#071322]">
        <div 
          onClick={() => navigate(currentRole === 'ADMIN' ? '/admin/dashboard' : '/user/dashboard')}
          className="flex items-center gap-3 cursor-pointer overflow-hidden select-none"
        >
          {/* Official MineX Brand Logo */}
          <img 
            src="/minex-logo.jpg" 
            alt="MineX Logo" 
            className="w-9 h-9 rounded-md object-contain border border-[#334155] bg-black shrink-0 shadow-xs"
            referrerPolicy="no-referrer"
          />
          {!isCollapsed && (
            <div className="truncate">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-wider text-white">MINEX</span>
                <span className="text-[10px] uppercase font-mono tracking-widest px-1 py-0.2 rounded bg-[#1E293B] text-[#94A3B8]">
                  v1.0
                </span>
              </div>
              <div className="text-[10px] text-[#94A3B8] tracking-tight truncate">
                Govt. Mining Intelligence
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded text-[#94A3B8] hover:text-white hover:bg-[#1E293B] transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Role Badge Indicator */}
      <div className="px-3 py-2 border-b border-[#1E293B]/70 bg-[#0E2238]/60">
        {!isCollapsed ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {currentRole === 'ADMIN' ? (
                <Shield className="w-3.5 h-3.5 text-[#EAB308]" />
              ) : (
                <HardHat className="w-3.5 h-3.5 text-[#F59E0B]" />
              )}
              <span className="text-[11px] font-semibold tracking-wider text-slate-300 uppercase">
                {currentRole === 'ADMIN' ? 'Admin Portal' : 'Field Operations'}
              </span>
            </div>
            <span className="text-[9px] font-mono text-[#64748B] uppercase">
              {currentRole === 'ADMIN' ? 'CMPDI / HQ' : 'ECL Sector'}
            </span>
          </div>
        ) : (
          <div className="flex justify-center" title={currentRole === 'ADMIN' ? 'Admin Role' : 'Worker Role'}>
            {currentRole === 'ADMIN' ? (
              <Shield className="w-4 h-4 text-[#EAB308]" />
            ) : (
              <HardHat className="w-4 h-4 text-[#F59E0B]" />
            )}
          </div>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
        {currentNavItems.map(item => {
          const isActive = currentRoute === item.route;
          return (
            <button
              key={item.route}
              onClick={() => navigate(item.route)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                isActive
                  ? 'bg-[#1E3A8A] text-white font-semibold shadow-xs border border-blue-400/20'
                  : 'text-[#94A3B8] hover:bg-[#132A4A] hover:text-white'
              } ${isCollapsed ? 'justify-center px-2' : ''}`}
            >
              <div className={`shrink-0 ${isActive ? 'text-white' : 'text-[#94A3B8]'}`}>
                {item.icon}
              </div>

              {!isCollapsed && (
                <span className="truncate text-left flex-1">
                  {item.label}
                </span>
              )}

              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`${
                    item.badgeColor || 'bg-slate-700'
                  } text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full shrink-0 ${
                    isCollapsed ? 'absolute top-1 right-1' : ''
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Profile & Logout */}
      <div className="p-2 border-t border-[#1E293B] bg-[#071322]">
        {!isCollapsed ? (
          <div className="flex items-center justify-between p-2 rounded-md bg-[#0F233E]">
            <div 
              onClick={() => navigate(currentRole === 'ADMIN' ? '/admin/profile' : '/user/profile')}
              className="flex items-center gap-2.5 min-w-0 cursor-pointer hover:opacity-90"
            >
              <img
                src={currentRole === 'ADMIN' ? currentAdmin.avatarUrl : currentUser.avatarUrl}
                alt="Avatar"
                className="w-7 h-7 rounded-full object-cover border border-slate-600 shrink-0"
              />
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white truncate">
                  {currentRole === 'ADMIN' ? currentAdmin.name : currentUser.name}
                </div>
                <div className="text-[10px] text-[#94A3B8] truncate">
                  {currentRole === 'ADMIN' ? 'Chief Operations' : 'Extraction Tech'}
                </div>
              </div>
            </div>

            <button
              onClick={logout}
              className="p-1.5 rounded text-[#94A3B8] hover:text-red-400 hover:bg-[#1E293B] transition-colors"
              title={t.navLogout}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-1">
            <button
              onClick={() => navigate(currentRole === 'ADMIN' ? '/admin/profile' : '/user/profile')}
              title={currentRole === 'ADMIN' ? currentAdmin.name : currentUser.name}
              className="hover:ring-2 hover:ring-blue-400 rounded-full"
            >
              <img
                src={currentRole === 'ADMIN' ? currentAdmin.avatarUrl : currentUser.avatarUrl}
                alt="Avatar"
                className="w-7 h-7 rounded-full object-cover border border-slate-600"
              />
            </button>
            <button
              onClick={logout}
              className="p-1.5 rounded text-[#94A3B8] hover:text-red-400 transition-colors"
              title={t.navLogout}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
