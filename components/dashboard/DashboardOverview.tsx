'use client';

import React, { useState, useEffect } from 'react';
import { useApi } from '@/context/ApiContext';
import { AmazonProduct } from '@/types/amazon';
import { TRENDING_NICHES } from '@/lib/mockData';
import { 
  TrendingUp, 
  TreePine, 
  Crosshair, 
  Search, 
  Sparkles, 
  ArrowDownRight, 
  ArrowUpRight, 
  Activity, 
  ShieldCheck, 
  Zap,
  Tag,
  ExternalLink,
  Copy,
  Flame,
  CheckCircle2,
  RefreshCw,
  Loader2,
  Database
} from 'lucide-react';
import { formatCacheAge } from '@/lib/cacheStorage';
import { toast } from 'sonner';

export function DashboardOverview() {
  const { setCurrentTab, setActiveAsin, simulateFallbackFailover, isPerformingFallbackTest, searchTrends, cacheVersion } = useApi();
  const [liveProducts, setLiveProducts] = useState<AmazonProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    searchTrends({ keyword: 'vintage retro graphic t-shirt', maxResults: 8, sortBy: 'velocity' })
      .then((items) => {
        if (isMounted) {
          if (items && items.length > 0) {
            setLiveProducts(items.slice(0, 4));
          }
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [cacheVersion]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${label} to clipboard!`);
  };

  const topDroppers = liveProducts;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 p-6 md:p-8">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/50 text-cyan-400 text-xs font-mono">
            <Flame className="w-3.5 h-3.5 text-cyan-400" />
            Amazon Merch & POD Market Intelligence
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Discover Viral Trends & Evergreen Low-Comp Niches
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Real-time BSR velocity tracking, automated RapidAPI multi-provider failover, and deep competitor keyword reverse engineering for Amazon Merch on Demand.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => setCurrentTab('trends')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-cyan-950/50 transition-all cursor-pointer"
            >
              <TrendingUp className="w-4 h-4" />
              Launch Trend Finder
            </button>
            <button
              onClick={() => setCurrentTab('evergreen')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition-all cursor-pointer"
            >
              <TreePine className="w-4 h-4 text-emerald-400" />
              Explore Evergreen Niches
            </button>
            <button
              onClick={() => setCurrentTab('spy')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition-all cursor-pointer"
            >
              <Crosshair className="w-4 h-4 text-purple-400" />
              Competitor Spy (Reverse ASIN)
            </button>
          </div>
        </div>

        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Viral Velocity Trends</span>
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-white font-mono">18 Found</div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <ArrowDownRight className="w-3.5 h-3.5 text-emerald-400" />
            <span>Avg -48.2% BSR Drop (7d)</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Low-Comp Evergreens</span>
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <TreePine className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-white font-mono">42 Niches</div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="text-emerald-400 font-semibold">&lt; 50 Reviews</span>
            <span>• High Profit Margin</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Tracked POD ASINs</span>
            <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
              <Crosshair className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-white font-mono">1,840 Items</div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
            <span>T-Shirts, Hoodies, Popsockets, Mugs</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Failover Engine</span>
            <span className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">Active 100%</div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
            <span>Auto-reroutes on 429 Rate Limits</span>
          </div>
        </div>
      </div>

      {/* Failover Simulator Banner */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-amber-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
              Multi-API Sequential Fallback System
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              If Primary Provider returns 429 or 500, requests automatically route to Secondary Provider without frontend interruption.
            </p>
          </div>
        </div>
        <button
          onClick={simulateFallbackFailover}
          disabled={isPerformingFallbackTest}
          className="px-3.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-medium transition-colors flex items-center gap-1.5 flex-shrink-0 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isPerformingFallbackTest ? 'animate-spin' : ''}`} />
          {isPerformingFallbackTest ? 'Simulating 429 Failover...' : 'Test 429 Fallback Now'}
        </button>
      </div>

      {/* Fast Dropping BSR Spotlight */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h2 className="text-base font-bold text-white tracking-wide">
              Fastest Dropping BSR (High Sales Velocity)
            </h2>
          </div>
          <button
            onClick={() => setCurrentTab('trends')}
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium cursor-pointer"
          >
            View all 18 trends
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Verified Merch by Amazon Only UI Indicator Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-600/80 text-emerald-400 font-mono text-[11px] font-bold">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              Verified Merch by Amazon Only
            </span>
            <span className="text-slate-400 text-xs hidden sm:inline">
              Class 025 Graphic T-Shirts • Standard Pricing ($13.00 – $25.99)
            </span>
          </div>
          <span className="text-slate-400 font-mono text-[11px]">
            Filtered Commercial Brands & Non-Apparel
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-4 animate-pulse space-y-3">
                <div className="aspect-square bg-slate-950 rounded-lg" />
                <div className="h-4 bg-slate-800 rounded w-3/4" />
                <div className="h-3 bg-slate-800 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : topDroppers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {topDroppers.map((item) => (
              <div
                key={item.asin}
                className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-xl p-4 transition-all duration-200 group flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-square w-full rounded-lg bg-slate-950 overflow-hidden mb-3 border border-slate-800">
                    <img
                      src={item.productPhoto}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-emerald-950/90 border border-emerald-800/80 text-emerald-400 text-[10px] font-mono font-bold flex items-center gap-1 shadow-md">
                      <ArrowDownRight className="w-3 h-3" />
                      {item.bsrVelocity7d}% BSR (7d)
                    </span>
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-slate-900/90 border border-slate-800 text-slate-300 text-[10px] font-mono">
                      {item.productType}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-mono flex items-center gap-1">
                        {item.asin}
                        <button
                          onClick={() => handleCopy(item.asin, 'ASIN')}
                          className="text-slate-500 hover:text-slate-300"
                          title="Copy ASIN"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </span>
                      <span className="text-white font-bold font-mono">${item.price.toFixed(2)}</span>
                    </div>

                    <h3 className="text-xs font-semibold text-slate-200 line-clamp-2 leading-snug group-hover:text-cyan-400 transition-colors">
                      {item.title}
                    </h3>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Current BSR:</span>
                    <span className="text-cyan-400 font-mono font-semibold">#{item.currentBsr.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Est. Daily Sales:</span>
                    <span className="text-emerald-400 font-mono font-semibold">{item.estDailySales} / day</span>
                  </div>

                  <div className="pt-1 flex gap-2">
                    <button
                      onClick={() => {
                        setActiveAsin(item.asin);
                        setCurrentTab('spy');
                      }}
                      className="flex-1 py-1.5 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 rounded-lg text-xs font-medium transition-colors text-center cursor-pointer"
                    >
                      Deep Spy
                    </button>
                    <a
                      href={item.productUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors"
                      title="View on Amazon"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-400 bg-slate-900 border border-slate-800 rounded-xl">
            Live search items loading from RapidAPI...
          </div>
        )}
      </div>

      {/* Trending POD Niches Radar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              Niche Radar: Fast Surging Keywords
            </h2>
            <p className="text-xs text-slate-400">
              Curated POD niches with high keyword search velocity and strong customer demand.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {TRENDING_NICHES.map((niche) => (
            <div
              key={niche.id}
              className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-colors space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-semibold text-slate-200">{niche.name}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950/80 text-cyan-400 border border-cyan-800/40">
                  {niche.growthRate}
                </span>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>Category: {niche.category}</span>
                <span className="font-mono text-slate-300">Avg #{niche.avgBsr.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
                <span className="text-[10px] text-slate-400 truncate max-w-[160px] font-mono">
                  &quot;{niche.recommendedKeyword}&quot;
                </span>
                <button
                  onClick={() => {
                    setCurrentTab('trends');
                  }}
                  className="text-cyan-400 hover:underline text-[11px] font-medium cursor-pointer"
                >
                  Analyze Niche →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
