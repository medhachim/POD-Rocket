'use client';

import React, { useState } from 'react';
import { useApi } from '@/context/ApiContext';
import { ProviderConfig } from '@/types/amazon';
import { 
  Sliders, 
  Key, 
  Globe, 
  Server, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Zap, 
  RefreshCw, 
  Lock, 
  Database,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  Info,
  Trash2,
  HardDrive
} from 'lucide-react';
import { formatCacheAge } from '@/lib/cacheStorage';
import { toast } from 'sonner';

export function ApiSettings() {
  const { 
    providers, 
    updateProvider, 
    testProvider, 
    mockMode, 
    setMockMode, 
    autoFallbackEnabled, 
    setAutoFallbackEnabled,
    simulateFallbackFailover,
    isPerformingFallbackTest,
    cacheStats,
    clearCacheAndRefetch
  } = useApi();

  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  const toggleShowKey = (id: string) => {
    setShowKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getStatusBadge = (provider: ProviderConfig) => {
    if (!provider.enabled) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-slate-800 text-slate-400 border border-slate-700">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
          Disabled
        </span>
      );
    }

    switch (provider.status) {
      case 'healthy':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Connected ({provider.latencyMs ? `${provider.latencyMs}ms` : 'Healthy'})
          </span>
        );
      case 'rate-limited':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-amber-950/80 text-amber-300 border border-amber-800/60">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            Rate Limited (429)
          </span>
        );
      case 'error':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-rose-950/80 text-rose-300 border border-rose-800/60">
            <XCircle className="w-3.5 h-3.5 text-rose-400" />
            Error / Disconnected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-slate-800 text-slate-300 border border-slate-700">
            Ready
          </span>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Settings Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-wide">
              Multi-API Management & Fallback Routing
            </h1>
            <p className="text-xs md:text-sm text-slate-400">
              Configure multiple RapidAPI providers with automatic sequential failover and parallel keyword extraction.
            </p>
          </div>
        </div>
      </div>

      {/* Global Mode Toggles Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <h2 className="text-base font-bold text-white tracking-wide flex items-center gap-2 border-b border-slate-800 pb-3">
          <Database className="w-5 h-5 text-cyan-400" />
          Execution Engine Modes
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mock Mode Card */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white">Mock Data Mode</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950/80 text-amber-300 border border-amber-800/40">
                  Instant Preview
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                When active, bypasses external RapidAPI calls and immediately returns high-fidelity Amazon Merch datasets (including iPhone 11 and top POD items) without consuming API credits.
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
              <input
                type="checkbox"
                checked={mockMode}
                onChange={(e) => setMockMode(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>

          {/* Sequential Fallback Protection Card */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white">Sequential Auto-Fallback</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-800/40">
                  Fail-Safe
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                If Provider A returns a 429 (Rate Limit) or 500 error, automatically catch the error and route the request to Provider B without crashing the frontend.
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
              <input
                type="checkbox"
                checked={autoFallbackEnabled}
                onChange={(e) => {
                  setAutoFallbackEnabled(e.target.checked);
                  toast.info(`Sequential Fallback ${e.target.checked ? 'enabled' : 'disabled'}`);
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>
        </div>

        {/* Live Failover Demo Action */}
        <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <div className="text-xs text-slate-300">
              <span className="font-semibold text-amber-300">Simulate Failover Resilience:</span> Test how the frontend catches a 429 Rate Limit error on Provider A and seamlessly routes to Provider B with Sonner toast alert.
            </div>
          </div>
          <button
            onClick={simulateFallbackFailover}
            disabled={isPerformingFallbackTest}
            className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 flex-shrink-0 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isPerformingFallbackTest ? 'animate-spin' : ''}`} />
            {isPerformingFallbackTest ? 'Simulating 429 Failover...' : 'Trigger 429 Failover Test'}
          </button>
        </div>
      </div>

      {/* Persistent Local Cache Management Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                Local Cache &amp; Data Persistence Guardrail
              </h2>
              <p className="text-xs text-slate-400">
                Prevents redundant RapidAPI calls, conserves subscription quota, and delivers 0ms instant data retrieval.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={clearCacheAndRefetch}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border border-rose-800/60 text-xs font-semibold cursor-pointer transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
            Clear Cache &amp; Refetch Live
          </button>
        </div>

        {/* Cache Storage Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Cached Queries</span>
            <div className="text-lg font-bold font-mono text-cyan-400">{cacheStats.totalEntries}</div>
            <span className="text-[10px] text-slate-500">Search &amp; ASIN requests</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Saved Products</span>
            <div className="text-lg font-bold font-mono text-emerald-400">{cacheStats.totalProductsCached}</div>
            <span className="text-[10px] text-slate-500">In persistent storage</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Last Cache Sync</span>
            <div className="text-sm font-bold font-mono text-white mt-1">
              {cacheStats.lastCachedAt ? formatCacheAge(cacheStats.lastCachedAt) : 'No cache yet'}
            </div>
            <span className="text-[10px] text-slate-500">Auto-persisted</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">RapidAPI Quota Guard</span>
            <div className="text-sm font-bold font-mono text-emerald-400 mt-1">Active (100%)</div>
            <span className="text-[10px] text-slate-500">0 duplicate calls</span>
          </div>
        </div>
      </div>

      {/* RapidAPI Providers Configuration List */}
      <div className="space-y-6">
        <h2 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
          <Server className="w-5 h-5 text-cyan-400" />
          RapidAPI Endpoints & Credentials
        </h2>

        {providers.map((provider, index) => {
          const isKeyVisible = showKeys[provider.id] ?? false;

          return (
            <div
              key={provider.id}
              className={`bg-slate-900 border rounded-2xl p-6 transition-all duration-200 space-y-5 ${
                provider.enabled ? 'border-slate-800 shadow-xl' : 'border-slate-800/50 opacity-70'
              }`}
            >
              {/* Provider Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm font-bold text-white tracking-wide">
                      {provider.name}
                    </span>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      {provider.type}
                    </span>
                    {getStatusBadge(provider)}
                  </div>
                  <p className="text-xs text-slate-400">
                    {provider.type === 'primary' && 'Primary provider for BSR rank, prices, seller info, and product photos.'}
                    {provider.type === 'secondary' && 'Fallback provider invoked automatically if Primary provider fails or is rate limited.'}
                    {provider.type === 'metadata' && 'Concurrently queried in parallel (Promise.all) for search suggestions and keywords.'}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 font-medium">Enabled:</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={provider.enabled}
                      onChange={(e) => {
                        updateProvider(provider.id, { enabled: e.target.checked });
                        toast.info(`${provider.name} ${e.target.checked ? 'enabled' : 'disabled'}`);
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
                  </label>
                </div>
              </div>

              {/* Form Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* RapidAPI Key */}
                <div className="space-y-1.5 md:col-span-2">
                  <div className="flex items-center justify-between text-xs">
                    <label className="text-slate-400 flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-cyan-400" />
                      RapidAPI Key (x-rapidapi-key)
                    </label>
                    <button
                      type="button"
                      onClick={() => toggleShowKey(provider.id)}
                      className="text-slate-500 hover:text-slate-300 flex items-center gap-1 text-[11px]"
                    >
                      {isKeyVisible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3 text-cyan-400" />}
                      {isKeyVisible ? 'Hide' : 'Reveal'}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={isKeyVisible ? 'text' : 'password'}
                      value={provider.apiKey}
                      onChange={(e) => updateProvider(provider.id, { apiKey: e.target.value })}
                      placeholder="Paste RapidAPI Key..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                    />
                  </div>
                </div>

                {/* Host */}
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-cyan-400" />
                    RapidAPI Host (x-rapidapi-host)
                  </label>
                  <input
                    type="text"
                    value={provider.host}
                    onChange={(e) => updateProvider(provider.id, { host: e.target.value })}
                    placeholder="e.g. real-time-amazon-data.p.rapidapi.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>

                {/* Endpoint URL */}
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5 text-cyan-400" />
                    Base Endpoint URL
                  </label>
                  <input
                    type="text"
                    value={provider.endpointUrl}
                    onChange={(e) => updateProvider(provider.id, { endpointUrl: e.target.value })}
                    placeholder="e.g. https://real-time-amazon-data.p.rapidapi.com/product-details"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Action Strip */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <div className="text-[11px] text-slate-500 font-mono">
                  Last tested: {provider.lastTested || 'Never'}
                </div>

                <button
                  type="button"
                  onClick={() => testProvider(provider)}
                  className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  Test Connectivity & Latency
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
