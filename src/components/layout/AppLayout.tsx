import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { PrototypeNotice } from '../common/PrototypeNotice';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-[#FAF9F6] text-[#1E293B]">
      {/* Primary Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Prototype Honesty Bar */}
        <PrototypeNotice variant="banner" />

        {/* Global Application Header */}
        <Header />

        {/* Dynamic Route View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

        {/* Enterprise Operational Footer */}
        <footer className="border-t border-[#E2DCD0] bg-white px-4 py-3 text-xs text-[#64748B] flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#102A43]">MineX Enterprise Platform</span>
            <span>•</span>
            <span>CMPDI / Ministry of Coal Digitization Initiative</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-[#94A3B8]">
            <span>DGMS Statutory Compliance Framework</span>
            <span>Terminal: ECL-GODDA-SEC4</span>
            <span className="font-mono">BUILD_v1.0-RC3</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
