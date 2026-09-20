/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';
import { LoginScreen } from './pages/LoginScreen';

// User Pages
import { UserDashboard } from './pages/user/UserDashboard';
import { UserAssignment } from './pages/user/UserAssignment';
import { UserProfile } from './pages/user/UserProfile';
import { UserDocuments } from './pages/user/UserDocuments';
import { UserProcessingStatus } from './pages/user/UserProcessingStatus';
import { UserData } from './pages/user/UserData';
import { UserMineAssist } from './pages/user/UserMineAssist';

// Admin Pages
import { AdminOverview } from './pages/admin/AdminOverview';
import { AdminMineManagement } from './pages/admin/AdminMineManagement';
import { AdminWorkerManagement } from './pages/admin/AdminWorkerManagement';
import { AdminUserManagement } from './pages/admin/AdminUserManagement';
import { AdminDocuments } from './pages/admin/AdminDocuments';
import { UploadDocument } from './pages/admin/UploadDocument';
import { AdminProcessingStatus } from './pages/admin/AdminProcessingStatus';
import { AdminData } from './pages/admin/AdminData';
import { AdminAnalytics } from './pages/admin/AdminAnalytics';
import { AdminMineAssist } from './pages/admin/AdminMineAssist';
import { AdminProfile } from './pages/admin/AdminProfile';

// Shared Pages & Modals
import { NotificationsPage } from './pages/NotificationsPage';
import { MineDetailModal } from './components/modals/MineDetailModal';
import { DocumentDetailModal } from './components/modals/DocumentDetailModal';
import { WorkerDetailModal } from './components/modals/WorkerDetailModal';

const AppContent: React.FC = () => {
  const { isLoggedIn, currentRoute, currentRole } = useApp();

  if (!isLoggedIn || currentRoute === '/login' || currentRoute === '/welcome') {
    return <LoginScreen />;
  }

  const renderActivePage = () => {
    switch (currentRoute) {
      // User Pages
      case '/user/dashboard':
        return <UserDashboard />;
      case '/user/assignment':
        return <UserAssignment />;
      case '/user/profile':
        return <UserProfile />;
      case '/user/documents':
        return <UserDocuments />;
      case '/user/processing':
        return <UserProcessingStatus />;
      case '/user/data':
        return <UserData />;
      case '/user/assist':
      case '/user/mine-assist':
        return <UserMineAssist />;
      case '/user/notifications':
        return <NotificationsPage />;

      // Admin Pages
      case '/admin/overview':
      case '/admin/dashboard':
        return <AdminOverview />;
      case '/admin/mines':
        return <AdminMineManagement />;
      case '/admin/workers':
        return <AdminWorkerManagement />;
      case '/admin/users':
        return <AdminUserManagement />;
      case '/admin/documents':
        return <AdminDocuments />;
      case '/admin/upload':
        return <UploadDocument />;
      case '/admin/processing':
        return <AdminProcessingStatus />;
      case '/admin/data':
        return <AdminData />;
      case '/admin/analytics':
        return <AdminAnalytics />;
      case '/admin/assist':
      case '/admin/mine-assist':
        return <AdminMineAssist />;
      case '/admin/profile':
        return <AdminProfile />;
      case '/admin/notifications':
        return <NotificationsPage />;

      default:
        return currentRole === 'ADMIN' ? <AdminOverview /> : <UserDashboard />;
    }
  };

  return (
    <AppLayout>
      {renderActivePage()}
      <MineDetailModal />
      <DocumentDetailModal />
      <WorkerDetailModal />
    </AppLayout>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
