'use client';

import React, { useState } from 'react';
import { useApi } from '@/context/ApiContext';
import { 
  Search, 
  ChevronRight, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Database,
  ExternalLink,
  Sparkles,
  ShieldAlert,
  RotateCw,
  HardDrive
} from 'lucide-react';
import { toast } from 'sonner';

export function Header() {
  const { 
    currentTab, 
    setCurrentTab, 
    activeAsin, 
    setActiveAsin, 
    fetchAsinProduct,
    providers, 
    mockMode, 
    setMockMode,
    activeProviderStatus,
    activeProviderName,
    simulateFallbackFailover,
    isPerformingFallbackTest,
    clearCacheAndRefetch,
    cacheStats
  } = useApi();

  const [searchInput, setSearchInput] = useState('');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const breadcrumbs: Record<string, { title: string; subtitle: string }> = {
    overview: { title: 'Dashboard Overview', subtitle: 'Market Overview & Real-Time POD Stats' },
    trends: { title: 'Trend Finder', subtitle: 'Viral Velocity & Fast Dropping BSR Niches' },
    evergreen: { title: 'Evergreen Finder', subtitle: 'Stable Sales & Low Competition Keywords' },
    spy: { title: 'Competitor Spy', subtitle: 'Deep ASIN Analysis & Keyword Reverse Engineering' },
    trademark: { title: 'Trademark & Copyright Checker', subtitle: 'USPTO Class 025 (Apparel) Account Safety & N-Gram Scanner' },
    settings: { title: 'API Settings', subtitle: 'Multi-Provider Failover & RapidAPI Configuration' },
  };

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    // Extract ASIN
    const raw = searchInput.trim();
    const match = raw.match(/(?:dp|gp\/product|\/d)\/([A-Z0-9]{10})/i) || raw.match(/([A-Z0-9]{10})/i);
    const targetAsin = match ? match[1].toUpperCase() : raw.toUpperCase();

    setActiveAsin(targetAsin);
    setCurrentTab('spy');
    toast.info(`Inspecting ASIN: ${targetAsin} in Competitor Spy`);
  };

  // Status icon and color helper
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'healthy':
        return {
          color: 'bg-emerald-500',
          textColor: 'text-emerald-400',
          borderColor: 'border-emerald-500/30',
          bgColor: 'bg-emerald-950/60',
          label: 'Connected',
          icon: CheckCircle2,
        };
      case 'rate-limited':
        return {
          color: 'bg-amber-400 animate-pulse',
          textColor: 'text-amber-400',
          borderColor: 'border-amber-500/30',
          bgColor: 'bg-amber-950/60',
          label: 'Rate Limited',
          icon: AlertTriangle,
        };
      case 'error':
        return {
          color: 'bg-rose-500',
          textColor: 'text-rose-400',
          borderColor: 'border-rose-500/30',
          bgColor: 'bg-rose-950/60',
          label: 'Disconnected',
          icon: XCircle,
        };
      default:
        return {
          color: 'bg-slate-500',
          textColor: 'text-slate-400',
          borderColor: 'border-slate-700',
          bgColor: 'bg-slate-900',
          label: 'Disabled',
          icon: Activity,
        };
    }
  };

  const currentStatusDisplay = getStatusDisplay(activeProviderStatus);

  return (
    <header className="sticky top-0 z-20 h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 flex items-center justify-between gap-4">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-sm min-w-0">
        <span className="text-slate-500 hover:text-slate-400 cursor-pointer" onClick={() => setCurrentTab('overview')}>
          POD Analytics
        </span>
        <ChevronRight className="w-4 h-4 text-slate-600 flex-shrink-0" />
        <span className="font-semibold text-white tracking-wide truncate">
          {breadcrumbs[currentTab]?.title || 'Dashboard'}
        </span>
      </div>

      {/* Global ASIN Search Bar & Local Cache Controls */}
      <div className="flex-1 max-w-xl mx-4 hidden md:flex items-center gap-2">
        <form onSubmit={handleGlobalSearch} className="relative flex items-center flex-1">
          <Search className="absolute left-3.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Paste ASIN (e.g., B08XYZ1984) or Amazon product URL..."
            className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-9.5 pr-20 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 font-mono transition-all"
          />
          <button
            type="submit"
            className="absolute right-1.5 px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-[11px] font-medium transition-colors cursor-pointer"
          >
            Spy ASIN
          </button>
        </form>

        {/* Clear Data & Refetch Button (Requirement 3) */}
        <button
          onClick={clearCacheAndRefetch}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800/90 hover:bg-rose-950/40 text-slate-200 hover:text-rose-300 border border-slate-700 hover:border-rose-700/60 text-xs font-semibold transition-all group flex-shrink-0 cursor-pointer shadow-sm"
          title="Clear all saved local data and force fresh live RapidAPI requests for updated BSR, prices, and rankings"
        >
          <RotateCw className="w-3.5 h-3.5 text-cyan-400 group-hover:text-rose-400 group-hover:rotate-180 transition-transform duration-500" />
          <span className="hidden lg:inline">Clear Cache &amp; Refetch</span>
          <span className="lg:hidden">Refetch</span>
          {cacheStats.totalEntries > 0 && (
            <span 
              className="px-1.5 py-0.2 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-mono text-[10px] font-bold"
              title={`${cacheStats.totalEntries} queries / ${cacheStats.totalProductsCached} products currently saved in local storage`}
            >
              {cacheStats.totalEntries}
            </span>
          )}
        </button>
      </div>

      {/* Header Actions & API Status Indicator */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Mobile Clear Cache Button */}
        <button
          onClick={clearCacheAndRefetch}
          className="md:hidden flex items-center gap-1 p-2 rounded-lg bg-slate-800 text-slate-200 hover:text-rose-300 border border-slate-700 text-xs font-medium cursor-pointer"
          title="Clear Cache & Refetch"
        >
          <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
        </button>
        {/* Mock Mode Quick Switcher */}
        <button
          onClick={() => setMockMode(!mockMode)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
            mockMode
              ? 'bg-amber-950/40 text-amber-300 border-amber-800/60 hover:bg-amber-900/40'
              : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
          }`}
          title="Toggle Mock Data vs Live RapidAPI"
        >
          <Database className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Mock Mode:</span>
          <span className="font-mono font-bold">{mockMode ? 'ON' : 'OFF'}</span>
        </button>

        {/* Live API Status Indicator with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowStatusDropdown(!showStatusDropdown)}
            className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${currentStatusDisplay.bgColor} ${currentStatusDisplay.borderColor} ${currentStatusDisplay.textColor} hover:brightness-110`}
          >
            <span className="relative flex h-2.5 w-2.5">
              {activeProviderStatus === 'rate-limited' && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              )}
              {activeProviderStatus === 'healthy' && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-40"></span>
              )}
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${currentStatusDisplay.color}`}></span>
            </span>
            <span className="hidden sm:inline font-mono">{currentStatusDisplay.label}</span>
          </button>

          {/* Status Dropdown Details */}
          {showStatusDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <span className="text-xs font-semibold text-white uppercase tracking-wider">
                  Live API Engine Status
                </span>
                <button
                  onClick={() => {
                    setShowStatusDropdown(false);
                    setCurrentTab('settings');
                  }}
                  className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                >
                  Configure
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-2.5">
                {providers.map((p) => {
                  const pStatus = getStatusDisplay(!p.enabled ? 'disabled' : p.status);
                  return (
                    <div
                      key={p.id}
                      className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 flex items-center justify-between"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="text-xs font-medium text-slate-200 truncate">
                          {p.name}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono truncate">
                          {p.host}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`w-2 h-2 rounded-full ${pStatus.color}`} />
                        <span className={`text-[10px] font-mono font-medium ${pStatus.textColor}`}>
                          {p.latencyMs ? `${p.latencyMs}ms` : pStatus.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Failover Simulator Quick Action */}
              <div className="mt-3 pt-3 border-t border-slate-800">
                <button
                  onClick={() => {
                    setShowStatusDropdown(false);
                    simulateFallbackFailover();
                  }}
                  disabled={isPerformingFallbackTest}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-medium transition-colors"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  {isPerformingFallbackTest ? 'Simulating 429 Failover...' : 'Test Rate-Limit Failover'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
