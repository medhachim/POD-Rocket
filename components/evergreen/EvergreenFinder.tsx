'use client';

import React, { useState, useEffect } from 'react';
import { useApi } from '@/context/ApiContext';
import { AmazonProduct, EvergreenFilterState } from '@/types/amazon';
import { CustomSlider } from '@/components/ui/CustomSlider';
import { checkTrademark } from '@/lib/trademarkChecker';
import { formatCacheAge } from '@/lib/cacheStorage';
import { 
  LineChart, 
  Line, 
  ResponsiveContainer 
} from 'recharts';
import { 
  TreePine, 
  Search, 
  ArrowUpDown, 
  Copy, 
  ExternalLink, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Crosshair, 
  Star, 
  CheckCircle, 
  HelpCircle, 
  Sparkles, 
  Scale,
  RotateCw,
  Database
} from 'lucide-react';
import { toast } from 'sonner';

export function EvergreenFinder() {
  const { searchEvergreen, setActiveAsin, setCurrentTab, openTrademarkModal, cacheVersion } = useApi();
  const [products, setProducts] = useState<AmazonProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [filters, setFilters] = useState<EvergreenFilterState>({
    minBsr: 100000,
    maxBsr: 500000,
    maxReviews: 50,
    minRating: 4.0,
    keyword: '',
    competitionLevel: 'all',
    sortBy: 'stability',
  });

  const fetchResults = async (forceRefresh = false) => {
    setLoading(true);
    const res = await searchEvergreen(filters, forceRefresh);
    setProducts(res);
    setLoading(false);
  };

  useEffect(() => {
    fetchResults();
  }, [filters, cacheVersion]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${label} to clipboard!`);
  };

  const getTrademarkUrl = (title: string) => {
    const clean = title.replace(/[^a-zA-Z0-9\s]/g, '').split(/\s+/).slice(0, 4).join(' ');
    return `https://tmhunt.com/?query=${encodeURIComponent(clean)}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <TreePine className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-wide">
                Evergreen Low-Competition Finder: Consistent & Predictable Sales
              </h1>
              <p className="text-xs text-slate-400">
                Identify stable, year-round niches with low review barriers (&lt; 50 reviews) and reliable daily royalties.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">
              Found: <strong className="text-emerald-400">{products.length}</strong> low-competition items
            </span>
          </div>
        </div>

        {/* Sliders and Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Min BSR Slider */}
          <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/80">
            <CustomSlider
              label="Minimum BSR"
              min={50000}
              max={300000}
              step={10000}
              value={filters.minBsr}
              onChange={(val) => setFilters((prev) => ({ ...prev, minBsr: val }))}
              formatValue={(val) => `#${val.toLocaleString()}`}
            />
          </div>

          {/* Max BSR Slider */}
          <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/80">
            <CustomSlider
              label="Maximum BSR"
              min={200000}
              max={800000}
              step={20000}
              value={filters.maxBsr}
              onChange={(val) => setFilters((prev) => ({ ...prev, maxBsr: val }))}
              formatValue={(val) => `#${val.toLocaleString()}`}
            />
          </div>

          {/* Max Reviews Slider */}
          <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/80">
            <CustomSlider
              label="Max Reviews (Low Barrier)"
              min={5}
              max={100}
              step={5}
              value={filters.maxReviews}
              onChange={(val) => setFilters((prev) => ({ ...prev, maxReviews: val }))}
              unit=" reviews"
            />
          </div>

          {/* Competition Level & Sorting */}
          <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/80 space-y-2">
            <span className="text-xs font-medium text-slate-400">Competition & Sort</span>
            <div className="grid grid-cols-2 gap-2 pt-0.5">
              <select
                value={filters.competitionLevel}
                onChange={(e) => setFilters((prev) => ({ ...prev, competitionLevel: e.target.value as any }))}
                className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="all">All Comp</option>
                <option value="Low">Low Only</option>
                <option value="Medium">Medium</option>
              </select>

              <select
                value={filters.sortBy}
                onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))}
                className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="stability">Highest Stability</option>
                <option value="reviews_asc">Lowest Reviews</option>
                <option value="sales_desc">Highest Sales</option>
                <option value="bsr_asc">Lowest BSR</option>
              </select>
            </div>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={filters.keyword}
            onChange={(e) => setFilters((prev) => ({ ...prev, keyword: e.target.value }))}
            placeholder="Filter by hobby, trade, or occupation (e.g. beekeeper, lineman, welder, diesel, gardening)..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Verified Merch by Amazon Only & Local Cache Indicator Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800 shadow-sm">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/90 border border-emerald-600/80 text-emerald-400 font-mono text-xs font-bold shadow-sm">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            Verified Merch by Amazon Only
          </span>

          {/* Cached Data Indicator Badge (Requirement 1) */}
          {products.length > 0 && products[0]?.isFromCache && (
            <span 
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/90 border border-cyan-700/80 text-cyan-300 font-mono text-xs font-bold shadow-sm animate-in fade-in"
              title="Instant 0ms response loaded from persistent local storage cache"
            >
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              Cached Data ({formatCacheAge(products[0].cachedAt || Date.now())})
            </span>
          )}

          <span className="text-slate-400 text-xs hidden md:inline">
            Class 025 Graphic Tees ($13.00 – $25.99) • Non-Apparel Excluded
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span className="text-emerald-400 font-bold">{products.length}</span> Verified Evergreen Niches
          </div>

          <button
            onClick={() => fetchResults(true)}
            disabled={loading}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-medium cursor-pointer transition-colors"
            title="Bypass local cache and query fresh data from RapidAPI"
          >
            <RotateCw className={`w-3 h-3 text-cyan-400 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refetch Live</span>
          </button>
        </div>
      </div>

      {/* Sortable Data Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Product Details</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Current BSR</th>
                <th className="py-3 px-4 w-44">90-Day BSR Stability</th>
                <th className="py-3 px-4">Reviews & Rating</th>
                <th className="py-3 px-4">Competition</th>
                <th className="py-3 px-4">Est. Sales / Mo</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    Loading low-competition evergreen niches...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No evergreen products found matching your current filter settings. Try adjusting the BSR range or review limit.
                  </td>
                </tr>
              ) : (
                products.map((item) => {
                  // Prepare data for mini sparkline (sampling 15 points)
                  const sparklineData = (item.bsrHistory || []).filter((_, idx) => idx % 6 === 0);
                  const tmCheck = checkTrademark(item.title);

                  return (
                    <tr 
                      key={item.asin}
                      className="hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* Product Thumbnail & Title */}
                      <td className="py-3 px-4 min-w-[280px]">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-slate-950 overflow-hidden flex-shrink-0 border border-slate-800">
                            <img
                              src={item.productPhoto}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[11px] text-slate-400 font-semibold">{item.asin}</span>
                              <button
                                onClick={() => handleCopy(item.asin, 'ASIN')}
                                className="text-slate-500 hover:text-cyan-400 transition-colors"
                                title="Copy ASIN"
                              >
                                <Copy className="w-3 h-3" />
                              </button>

                              {/* Local Cache Indicator (Requirement 1) */}
                              {item.isFromCache && (
                                <span 
                                  className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-cyan-950/90 text-cyan-300 border border-cyan-800/80 flex items-center gap-0.5"
                                  title="Loaded instantly from local storage cache"
                                >
                                  <Database className="w-2.5 h-2.5 text-cyan-400" />
                                  Cached
                                </span>
                              )}

                              {/* Trademark Safety Badge */}
                              <button
                                onClick={() => openTrademarkModal(item.title, item.asin)}
                                className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold flex items-center gap-0.5 border cursor-pointer ${
                                  tmCheck.overallStatus === 'Safe'
                                    ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60'
                                    : tmCheck.overallStatus === 'Check Required'
                                    ? 'bg-amber-950/80 text-amber-300 border-amber-800/60'
                                    : 'bg-rose-950 text-rose-300 border-rose-700 animate-pulse'
                                }`}
                                title="Click to view USPTO Class 025 details"
                              >
                                {tmCheck.overallStatus === 'Safe' ? (
                                  <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
                                ) : tmCheck.overallStatus === 'Check Required' ? (
                                  <AlertTriangle className="w-2.5 h-2.5 text-amber-400" />
                                ) : (
                                  <ShieldAlert className="w-2.5 h-2.5 text-rose-400" />
                                )}
                                {tmCheck.overallStatus}
                              </button>
                            </div>
                            <h4 
                              className="text-xs font-medium text-slate-200 truncate group-hover:text-cyan-400 transition-colors max-w-xs cursor-pointer"
                              title={item.title}
                              onClick={() => {
                                setActiveAsin(item.asin);
                                setCurrentTab('spy');
                              }}
                            >
                              {item.title}
                            </h4>
                          </div>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 font-mono font-semibold text-white">
                        ${item.price.toFixed(2)}
                      </td>

                      {/* BSR */}
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-cyan-400">
                          #{item.currentBsr.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[130px]">
                          {item.bsrCategory}
                        </div>
                      </td>

                      {/* 90-Day BSR Stability Sparkline */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-1">
                          <div className="h-9 w-36 bg-slate-950/60 rounded p-0.5 border border-slate-800/80">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={sparklineData}>
                                <Line
                                  type="monotone"
                                  dataKey="bsr"
                                  stroke="#10b981"
                                  strokeWidth={1.8}
                                  dot={false}
                                  isAnimationActive={false}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                            <span>Score:</span>
                            <span className="text-emerald-400 font-semibold">{item.stabilityScore}% stable</span>
                          </div>
                        </div>
                      </td>

                      {/* Reviews & Rating */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 text-amber-400 font-mono font-semibold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{item.starRating}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {item.numRatings} reviews
                        </div>
                      </td>

                      {/* Competition Level */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                            item.competitionLevel === 'Low'
                              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60'
                              : 'bg-amber-950/80 text-amber-300 border-amber-800/60'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              item.competitionLevel === 'Low' ? 'bg-emerald-400' : 'bg-amber-400'
                            }`}
                          />
                          {item.competitionLevel} Comp
                        </span>
                      </td>

                      {/* Est. Sales */}
                      <td className="py-3 px-4">
                        <div className="text-white font-mono font-semibold">
                          ${item.estMonthlyRevenue.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          ~{item.estDailySales * 30} sales / mo
                        </div>
                      </td>

                      {/* Quick Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setActiveAsin(item.asin);
                              setCurrentTab('spy');
                            }}
                            className="p-1.5 rounded bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 transition-colors"
                            title="Analyze in Competitor Spy"
                          >
                            <Crosshair className="w-3.5 h-3.5" />
                          </button>

                          <a
                            href={item.productUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                            title="View on Amazon"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>

                          <button
                            type="button"
                            onClick={() => openTrademarkModal(item.title, item.asin)}
                            className={`p-1.5 rounded border transition-colors cursor-pointer ${
                              tmCheck.overallStatus === 'Trademark Alert'
                                ? 'bg-rose-950/80 hover:bg-rose-900 border-rose-700 text-rose-300'
                                : tmCheck.overallStatus === 'Check Required'
                                ? 'bg-amber-950/80 hover:bg-amber-900 border-amber-700 text-amber-300'
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                            }`}
                            title="Inspect Class 025 Trademarks & Copyright"
                          >
                            <ShieldAlert className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
