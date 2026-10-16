'use client';

import React from 'react';
import { ApiProvider, useApi } from '@/context/ApiContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { DashboardOverview } from '@/components/dashboard/DashboardOverview';
import { TrendFinder } from '@/components/trends/TrendFinder';
import { EvergreenFinder } from '@/components/evergreen/EvergreenFinder';
import { CompetitorSpy } from '@/components/competitor/CompetitorSpy';
import { TrademarkCheckerTab } from '@/components/trademark/TrademarkCheckerTab';
import { ApiSettings } from '@/components/settings/ApiSettings';
import { TrademarkModal } from '@/components/trademark/TrademarkModal';

function DashboardContent() {
  const { currentTab, inspectedTrademark, closeTrademarkModal } = useApi();

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Collapsible Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header with Breadcrumbs, Global Search, and API Status Indicator */}
        <Header />

        {/* Scrollable View Container */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-950/60 custom-scrollbar">
          <div className="max-w-7xl mx-auto w-full pb-12">
            {currentTab === 'overview' && <DashboardOverview />}
            {currentTab === 'trends' && <TrendFinder />}
            {currentTab === 'evergreen' && <EvergreenFinder />}
            {currentTab === 'spy' && <CompetitorSpy />}
            {currentTab === 'trademark' && <TrademarkCheckerTab />}
            {currentTab === 'settings' && <ApiSettings />}
          </div>
        </main>
      </div>

      {/* Dedicated Inspection Modal */}
      {inspectedTrademark && (
        <TrademarkModal
          isOpen={!!inspectedTrademark}
          onClose={closeTrademarkModal}
          title={inspectedTrademark.title}
          asin={inspectedTrademark.asin}
        />
      )}
    </div>
  );
}

export default function Home() {
  return (
    <ApiProvider>
      <DashboardContent />
    </ApiProvider>
  );
}
