import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, 
  Search, 
  Globe, 
  Shield, 
  HardHat, 
  ChevronDown, 
  Check, 
  ExternalLink,
  User as UserIcon,
  LogOut
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';

export const Header: React.FC = () => {
  const { 
    currentRole, 
    currentLang, 
    currentUser, 
    currentAdmin, 
    currentRoute, 
    notifications, 
    switchRole, 
    setLanguage, 
    navigate, 
    logout,
    markNotificationAsRead,
    markAllNotificationsRead,
    t 
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const unreadNotifs = notifications.filter(n => !n.read);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Derive breadcrumb from currentRoute
  const getBreadcrumbs = () => {
    const parts = currentRoute.split('/').filter(Boolean);
    if (parts.length === 0) return ['MineX', 'Dashboard'];
    const rolePrefix = parts[0] === 'admin' ? 'Admin' : 'Field Operations';
    const pageName = parts[1] ? parts[1].replace('-', ' ').toUpperCase() : 'OVERVIEW';
    return ['MineX', rolePrefix, pageName];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-[#E2DCD0] px-4 lg:px-8 flex items-center justify-between shadow-xs">
      {/* Left: Breadcrumbs / Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 pr-3 sm:border-r sm:border-[#E2DCD0]">
          <img 
            src="/minex-logo.jpg" 
            alt="MineX Logo" 
            className="w-7 h-7 rounded object-contain border border-[#E2DCD0] bg-black shrink-0"
            referrerPolicy="no-referrer"
          />
          <span className="font-bold text-sm tracking-wider text-[#102A43]">MINEX</span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#64748B]">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span className="text-[#CBD5E1]">/</span>}
              <span className={idx === breadcrumbs.length - 1 ? 'font-semibold text-[#102A43]' : ''}>
                {crumb}
              </span>
            </React.Fragment>
          ))}
        </div>
        <div className="sm:hidden font-semibold text-xs text-[#102A43]">
          {breadcrumbs[breadcrumbs.length - 1]}
        </div>
      </div>

      {/* Right: Actions, Language Switcher, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-3.5">
        {/* Active Portal Indicator Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FAF9F6] border border-[#E2DCD0] text-xs">
          {currentRole === 'ADMIN' ? (
            <>
              <Shield className="w-3.5 h-3.5 text-[#B45309]" />
              <span className="font-semibold text-[#102A43]">Directorate Admin</span>
            </>
          ) : (
            <>
              <HardHat className="w-3.5 h-3.5 text-[#B45309]" />
              <span className="font-semibold text-[#102A43]">Field Operative</span>
            </>
          )}
        </div>

        {/* Bilingual Toggle: English / हिन्दी */}
        <div className="flex items-center bg-[#FAF9F6] border border-[#E2DCD0] rounded-md overflow-hidden text-xs">
          <button
            onClick={() => setLanguage('en')}
            className={`px-2.5 py-1 transition-colors font-medium ${
              currentLang === 'en'
                ? 'bg-[#102A43] text-white'
                : 'text-[#64748B] hover:text-[#102A43]'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('hi')}
            className={`px-2.5 py-1 transition-colors font-medium ${
              currentLang === 'hi'
                ? 'bg-[#102A43] text-white'
                : 'text-[#64748B] hover:text-[#102A43]'
            }`}
          >
            हिन्दी
          </button>
        </div>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-md text-[#64748B] hover:bg-[#F5F1EB] hover:text-[#102A43] transition-colors border border-transparent hover:border-[#E2DCD0]"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifs.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#DC2626] ring-2 ring-white" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg border border-[#E2DCD0] shadow-xl z-50 overflow-hidden">
              <div className="px-4 py-3 bg-[#FAF9F6] border-b border-[#E2DCD0] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-[#102A43] uppercase tracking-wider">
                    {t.notificationsTitle}
                  </span>
                  {unreadNotifs.length > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#DC2626] text-white">
                      {unreadNotifs.length}
                    </span>
                  )}
                </div>
                {unreadNotifs.length > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[11px] text-[#102A43] hover:underline font-medium"
                  >
                    {t.markAllRead}
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-[#F1EFEA]">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-[#64748B]">
                    {t.noNotifications}
                  </div>
                ) : (
                  notifications.map(notif => (
                    <div
                      key={notif.id}
                      onClick={() => markNotificationAsRead(notif.id)}
                      className={`p-3.5 text-xs transition-colors cursor-pointer hover:bg-[#FDFBF7] ${
                        !notif.read ? 'bg-[#FAF9F6]' : 'opacity-80'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          {!notif.read && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#102A43] shrink-0" />
                          )}
                          <span className={`font-semibold text-[#102A43] ${notif.urgent ? 'text-red-700' : ''}`}>
                            {currentLang === 'hi' ? notif.titleHi : notif.title}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#94A3B8] shrink-0">
                          {notif.timestamp}
                        </span>
                      </div>
                      <p className="mt-1 text-[#64748B] text-[11px] leading-relaxed pl-3">
                        {currentLang === 'hi' ? notif.messageHi : notif.message}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <div className="p-2 border-t border-[#E2DCD0] bg-[#FAF9F6] text-center">
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    navigate(currentRole === 'ADMIN' ? '/admin/notifications' : '/user/notifications');
                  }}
                  className="text-xs text-[#102A43] font-medium hover:underline"
                >
                  {t.view} {t.navNotifications}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill & Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 p-1 sm:px-2.5 sm:py-1 rounded-md hover:bg-[#F5F1EB] transition-colors border border-transparent hover:border-[#E2DCD0]"
          >
            <img
              src={currentRole === 'ADMIN' ? currentAdmin.avatarUrl : currentUser.avatarUrl}
              alt="Profile"
              className="w-7 h-7 rounded-full object-cover border border-[#CBD5E1]"
            />
            <div className="hidden sm:block text-left">
              <div className="text-xs font-semibold text-[#102A43] leading-tight flex items-center gap-1">
                {currentRole === 'ADMIN' ? currentAdmin.name : currentUser.name}
                <ChevronDown className="w-3 h-3 text-[#64748B]" />
              </div>
              <div className="text-[10px] text-[#64748B] tracking-tight">
                {currentRole === 'ADMIN' ? 'Chief Operations Director' : 'Sr. Blasting Technician'}
              </div>
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg border border-[#E2DCD0] shadow-xl z-50 py-1 divide-y divide-[#F1EFEA]">
              <div className="px-4 py-2.5">
                <p className="text-xs font-semibold text-[#102A43]">
                  {currentRole === 'ADMIN' ? currentAdmin.name : currentUser.name}
                </p>
                <p className="text-[11px] text-[#64748B] truncate">
                  {currentRole === 'ADMIN' ? currentAdmin.officialEmail : currentUser.email}
                </p>
                <div className="mt-1.5">
                  <span className="inline-block text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#F5F1EB] text-[#102A43] border border-[#E2DCD0]">
                    {currentRole === 'ADMIN' ? 'Administrator' : 'Field Worker'}
                  </span>
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate(currentRole === 'ADMIN' ? '/admin/profile' : '/user/profile');
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-[#1E293B] hover:bg-[#F8F7F4] flex items-center gap-2"
                >
                  <UserIcon className="w-3.5 h-3.5 text-[#64748B]" />
                  <span>{t.navMyProfile}</span>
                </button>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    switchRole(currentRole === 'ADMIN' ? 'USER' : 'ADMIN');
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-[#1E293B] hover:bg-[#F8F7F4] flex items-center gap-2"
                >
                  <Shield className="w-3.5 h-3.5 text-[#64748B]" />
                  <span>Switch to {currentRole === 'ADMIN' ? 'Worker' : 'Admin'}</span>
                </button>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    logout();
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-500" />
                  <span>{t.navLogout}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
