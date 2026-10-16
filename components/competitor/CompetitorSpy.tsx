'use client';

import React, { useState, useEffect } from 'react';
import { useApi } from '@/context/ApiContext';
import { AmazonProduct, BsrHistoryPoint } from '@/types/amazon';
import { checkTrademark } from '@/lib/trademarkChecker';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { 
  Crosshair, 
  Search, 
  Copy, 
  ExternalLink, 
  TrendingDown, 
  TrendingUp, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle,
  Sparkles, 
  Star, 
  DollarSign, 
  BarChart3, 
  Tag, 
  Layers, 
  Check, 
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  Store,
  Scale,
  RotateCw,
  Database
} from 'lucide-react';
import { formatCacheAge } from '@/lib/cacheStorage';
import { toast } from 'sonner';

export function CompetitorSpy() {
  const { activeAsin, setActiveAsin, fetchAsinProduct, openTrademarkModal, cacheVersion } = useApi();
  const [searchInput, setSearchInput] = useState(activeAsin || 'B07ZPKBL9V');
  const [product, setProduct] = useState<AmazonProduct | null>(null);
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState<'30d' | '60d' | '90d'>('90d');
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  // Real Amazon ASIN presets for 1-click live lookup
  const presets = [
    { label: 'Apple iPhone 11 (Prompt ASIN)', asin: 'B07ZPKBL9V' },
    { label: 'Vintage Auto Movie Shirt', asin: 'B08GK2MQPS' },
    { label: 'DARE Lion 90s Shirt', asin: 'B0G2CKN34L' },
    { label: 'Floppy Disk Retro Tee', asin: 'B00NMFDFHA' },
    { label: 'Tom Petty Band Tee', asin: 'B0CQRV6HQL' },
    { label: 'Dr Pepper Retro Ringer', asin: 'B0917TJ11B' },
  ];

  const handleSearch = async (asinToSearch?: string, forceRefresh = false) => {
    const target = asinToSearch || searchInput;
    if (!target) return;

    // Clean ASIN
    const match = target.match(/(?:dp|gp\/product|\/d)\/([A-Z0-9]{10})/i) || target.match(/([A-Z0-9]{10})/i);
    const clean = match ? match[1].toUpperCase() : target.trim().toUpperCase();

    setLoading(true);
    setActiveAsin(clean);
    setSearchInput(clean);

    const res = await fetchAsinProduct(clean, forceRefresh);
    if (res) {
      setProduct(res);
      setActivePhotoIndex(0);
      if (res.isFromCache) {
        toast.info(`Loaded ASIN from Local Cache (0ms): ${clean}`);
      } else {
        toast.success(`Live RapidAPI Data Retrieved: ${clean}`);
      }
    } else {
      toast.error(`Unable to find data for ASIN: ${clean}`);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (activeAsin) {
      setSearchInput(activeAsin);
      handleSearch(activeAsin);
    }
  }, [activeAsin, cacheVersion]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${label} to clipboard!`);
  };

  const handleCopyAllKeywords = () => {
    if (!product || !product.extractedKeywords) return;
    const all = product.extractedKeywords.map((k) => k.keyword).join(', ');
    navigator.clipboard.writeText(all);
    toast.success('Copied all extracted keywords to clipboard!');
  };

  // Filter history based on time range
  const chartData = React.useMemo(() => {
    if (!product || !product.bsrHistory) return [];
    const days = timeRange === '30d' ? 30 : timeRange === '60d' ? 60 : 90;
    return product.bsrHistory.slice(product.bsrHistory.length - days);
  }, [product, timeRange]);

  // Calculate high/low BSR stats
  const bsrStats = React.useMemo(() => {
    if (!chartData || chartData.length === 0) return { min: 0, max: 0, avg: 0 };
    const bsrValues = chartData.map((d) => d.bsr);
    const min = Math.min(...bsrValues);
    const max = Math.max(...bsrValues);
    const avg = Math.round(bsrValues.reduce((a, b) => a + b, 0) / bsrValues.length);
    return { min, max, avg };
  }, [chartData]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Central Input Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="text-center space-y-1">
            <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
              <Crosshair className="w-6 h-6 text-cyan-400" />
              Competitor Spy & Reverse ASIN Intelligence
            </h1>
            <p className="text-xs md:text-sm text-slate-400">
              Paste any Amazon Merch ASIN or product URL for instant price history, BSR volatility, and hidden backend search terms.
            </p>
          </div>

          {/* Search Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter ASIN (e.g. B08XYZ1984 or B07ZPKBL9V) or full Amazon URL..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all shadow-inner"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white rounded-xl text-xs md:text-sm font-semibold transition-all shadow-lg shadow-cyan-950/50 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Crosshair className="w-4 h-4" />
                  Inspect ASIN
                </>
              )}
            </button>
          </form>

          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1 text-xs">
            <span className="text-slate-500 text-[11px] font-medium mr-1">Quick Presets:</span>
            {presets.map((p) => (
              <button
                key={p.asin}
                type="button"
                onClick={() => {
                  setSearchInput(p.asin);
                  handleSearch(p.asin);
                }}
                className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono transition-colors cursor-pointer ${
                  activeAsin === p.asin
                    ? 'bg-cyan-950/80 text-cyan-300 border-cyan-800/80'
                    : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Analysis View */}
      {loading && !product ? (
        <div className="p-16 text-center bg-slate-900 border border-slate-800 rounded-2xl animate-pulse space-y-4">
          <div className="w-12 h-12 border-3 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mx-auto" />
          <p className="text-slate-400 text-sm">Reverse engineering ASIN metrics & BSR timeline...</p>
        </div>
      ) : product ? (
        <div className="space-y-8">
          {/* Top 2-Column Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Product Information & Extracted Backend Meta (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Product Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
                {/* Photo Gallery with Thumbnails */}
                <div className="space-y-3">
                  <div className="aspect-square w-full rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center p-4 relative group">
                    <img
                      src={
                        product.productPhotos && product.productPhotos[activePhotoIndex]
                          ? product.productPhotos[activePhotoIndex]
                          : product.productPhoto
                      }
                      alt={product.title}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-900/90 border border-slate-800 text-slate-300 font-mono text-xs">
                        {product.productType}
                      </span>
                      {product.isBestSeller && (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-950/90 border border-amber-800 text-amber-300 font-mono text-xs font-semibold">
                          #1 Best Seller
                        </span>
                      )}
                    </div>
                  </div>

                  {product.productPhotos && product.productPhotos.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {product.productPhotos.map((photo, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActivePhotoIndex(idx)}
                          className={`w-14 h-14 rounded-lg overflow-hidden border-2 flex-shrink-0 bg-slate-950 p-1 transition-all ${
                            activePhotoIndex === idx
                              ? 'border-cyan-500 scale-105'
                              : 'border-slate-800 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={photo} alt="" className="w-full h-full object-contain" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Title & Brand */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                        {product.asin}
                      </span>
                      <button
                        onClick={() => handleCopy(product.asin, 'ASIN')}
                        className="text-slate-400 hover:text-white"
                        title="Copy ASIN"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      {/* Cached Data Indicator (Requirement 1) */}
                      {product.isFromCache && (
                        <span 
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-950/90 border border-cyan-700/80 text-cyan-300 font-mono text-[11px] font-bold shadow-sm"
                          title="Loaded instantly from persistent local storage cache (0ms)"
                        >
                          <Database className="w-3 h-3 text-cyan-400" />
                          Cached Data ({formatCacheAge(product.cachedAt || Date.now())})
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSearch(product.asin, true)}
                        disabled={loading}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-[11px] font-medium flex items-center gap-1 cursor-pointer transition-colors"
                        title="Bypass local cache and query fresh data from RapidAPI"
                      >
                        <RotateCw className={`w-3 h-3 text-cyan-400 ${loading ? 'animate-spin' : ''}`} />
                        Refetch Live
                      </button>

                      <a
                        href={product.productUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1 font-medium"
                      >
                        Amazon Page
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  <h2 className="text-base font-bold text-white leading-snug">
                    {product.title}
                  </h2>

                  {/* Brand Link */}
                  <div className="flex items-center gap-2 pt-1 text-xs text-slate-400">
                    <Store className="w-4 h-4 text-cyan-400" />
                    <span>Brand: <strong className="text-slate-200">{product.brand}</strong></span>
                    {product.brandUrl && (
                      <a
                        href={product.brandUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:underline inline-flex items-center gap-0.5"
                      >
                        Visit Store <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>

                  {/* Trademark Safety Compliance Card */}
                  {(() => {
                    const tmCheck = checkTrademark(product.title);
                    return (
                      <div className="pt-2">
                        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            {tmCheck.overallStatus === 'Safe' ? (
                              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                                <ShieldCheck className="w-4 h-4" />
                              </div>
                            ) : tmCheck.overallStatus === 'Check Required' ? (
                              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
                                <AlertTriangle className="w-4 h-4" />
                              </div>
                            ) : (
                              <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30">
                                <ShieldAlert className="w-4 h-4" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                                <span>Class 025:</span>
                                <span
                                  className={
                                    tmCheck.overallStatus === 'Safe'
                                      ? 'text-emerald-400'
                                      : tmCheck.overallStatus === 'Check Required'
                                      ? 'text-amber-400'
                                      : 'text-rose-400'
                                  }
                                >
                                  {tmCheck.overallStatus}
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-500 block truncate">
                                {tmCheck.matchedTrademarks.length > 0
                                  ? `${tmCheck.matchedTrademarks.length} conflicting terms detected`
                                  : 'No known high-risk trademarks found'}
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => openTrademarkModal(product.title, product.asin)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 text-xs font-semibold flex items-center gap-1 flex-shrink-0 cursor-pointer transition-colors"
                          >
                            <Scale className="w-3.5 h-3.5" />
                            Inspect TM
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Core KPIs Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
                  <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Price</span>
                    <span className="text-base font-bold text-white font-mono">${product.price.toFixed(2)}</span>
                  </div>

                  <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Current BSR</span>
                    <span className="text-base font-bold text-cyan-400 font-mono">#{product.currentBsr.toLocaleString()}</span>
                  </div>

                  <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Est. Daily Sales</span>
                    <span className="text-base font-bold text-emerald-400 font-mono">~{product.estDailySales} units</span>
                  </div>
                </div>

                {/* Rating & Buy Box */}
                <div className="p-3.5 bg-slate-950/50 border border-slate-800/80 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Customer Rating:</span>
                    <div className="flex items-center gap-1.5 font-mono">
                      <div className="flex items-center text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span className="ml-1 font-bold text-white">{product.starRating}</span>
                      </div>
                      <span className="text-slate-500">({product.numRatings.toLocaleString()} ratings)</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Buy Box Seller:</span>
                    <span className="font-mono text-slate-200">{product.buyBoxSeller || 'Amazon Merch on Demand'}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">BSR Category:</span>
                    <span className="font-medium text-slate-300 truncate max-w-[200px]" title={product.bsrCategory}>
                      {product.bsrCategory}
                    </span>
                  </div>
                </div>

                {/* Hidden Backend Search Terms / Attributes */}
                <div className="space-y-2.5 pt-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      Hidden Backend Search Terms
                    </h3>
                  </div>

                  <div className="space-y-1.5">
                    {product.backendSearchTerms && product.backendSearchTerms.length > 0 ? (
                      product.backendSearchTerms.map((term, i) => (
                        <div
                          key={i}
                          onClick={() => handleCopy(term, 'Search Term')}
                          className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs font-mono text-slate-300 hover:border-cyan-500/50 hover:text-white transition-all cursor-pointer flex items-center justify-between group"
                          title="Click to copy search term"
                        >
                          <span className="truncate pr-2">{term}</span>
                          <Copy className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 flex-shrink-0" />
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500">No hidden terms extracted for this listing.</p>
                    )}
                  </div>
                </div>

                {/* Features Bullets */}
                {product.features && product.features.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Listing Bullet Points
                    </h3>
                    <ul className="space-y-1.5 text-xs text-slate-400">
                      {product.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-cyan-400 mt-1">•</span>
                          <span className="leading-relaxed">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Interactive Recharts Line Chart & Sales Metrics (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Big Interactive Chart Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-cyan-400" />
                      BSR vs. Price Historical Correlation
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Inverted BSR scale: A rising line means lower BSR (faster sales volume).
                    </p>
                  </div>

                  {/* Time Range Selector */}
                  <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                    {(['30d', '60d', '90d'] as const).map((r) => (
                      <button
                        key={r}
                        onClick={() => setTimeRange(r)}
                        className={`px-3 py-1 rounded text-xs font-mono font-medium transition-colors cursor-pointer ${
                          timeRange === r
                            ? 'bg-cyan-600 text-white shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stat Badges for Chart */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-slate-950/60 border border-slate-800/80 p-2.5 rounded-lg text-xs">
                    <span className="text-[10px] text-slate-500 uppercase">Best BSR Rank</span>
                    <div className="text-emerald-400 font-mono font-bold">#{bsrStats.min.toLocaleString()}</div>
                  </div>
                  <div className="bg-slate-950/60 border border-slate-800/80 p-2.5 rounded-lg text-xs">
                    <span className="text-[10px] text-slate-500 uppercase">Average BSR</span>
                    <div className="text-cyan-400 font-mono font-bold">#{bsrStats.avg.toLocaleString()}</div>
                  </div>
                  <div className="bg-slate-950/60 border border-slate-800/80 p-2.5 rounded-lg text-xs">
                    <span className="text-[10px] text-slate-500 uppercase">Peak BSR Drop</span>
                    <div className="text-white font-mono font-bold">#{bsrStats.max.toLocaleString()}</div>
                  </div>
                  <div className="bg-slate-950/60 border border-slate-800/80 p-2.5 rounded-lg text-xs">
                    <span className="text-[10px] text-slate-500 uppercase">Est. Monthly Rev</span>
                    <div className="text-emerald-400 font-mono font-bold">${product.estMonthlyRevenue.toLocaleString()}</div>
                  </div>
                </div>

                {/* Recharts Dual-Axis Line Graph */}
                <div className="h-80 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                      <XAxis
                        dataKey="date"
                        stroke="#64748b"
                        fontSize={11}
                        tickFormatter={(val) => val.slice(5)}
                      />
                      {/* Left Axis: Price */}
                      <YAxis
                        yAxisId="priceAxis"
                        stroke="#38bdf8"
                        fontSize={11}
                        domain={['dataMin - 2', 'dataMax + 2']}
                        tickFormatter={(val) => `$${val}`}
                        width={45}
                      />
                      {/* Right Axis: BSR (Reversed so lower rank is higher on the chart!) */}
                      <YAxis
                        yAxisId="bsrAxis"
                        orientation="right"
                        reversed={true}
                        stroke="#10b981"
                        fontSize={11}
                        tickFormatter={(val) => `#${(val / 1000).toFixed(0)}k`}
                        width={55}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderColor: '#1e293b',
                          borderRadius: '0.75rem',
                          color: '#f8fafc',
                          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
                        }}
                        formatter={(val: any, name: any) => {
                          if (name === 'BSR Rank') return [`#${Number(val).toLocaleString()}`, 'BSR (Lower is better)'];
                          if (name === 'Price ($)') return [`$${Number(val).toFixed(2)}`, 'Listing Price'];
                          return [val, name];
                        }}
                      />
                      <Legend verticalAlign="top" height={36} />
                      <Line
                        yAxisId="priceAxis"
                        type="monotone"
                        dataKey="price"
                        name="Price ($)"
                        stroke="#38bdf8"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 5 }}
                      />
                      <Line
                        yAxisId="bsrAxis"
                        type="monotone"
                        dataKey="bsr"
                        name="BSR Rank"
                        stroke="#10b981"
                        strokeWidth={2.5}
                        dot={false}
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Variations Matrix (if available) */}
              {product.variations && product.variations.length > 0 && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-cyan-400" />
                      Product Variations Matrix ({product.variations.length} options)
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto pr-1">
                    {product.variations.map((v, i) => (
                      <div
                        key={i}
                        className="p-2.5 bg-slate-950/60 border border-slate-800 rounded-lg text-xs flex items-center justify-between"
                      >
                        <div className="min-w-0 pr-2">
                          <div className="text-slate-200 font-medium truncate">
                            {v.color || v.title || 'Variant'}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {v.size || v.asin}
                          </div>
                        </div>
                        <span className="text-white font-mono font-semibold text-xs flex-shrink-0">
                          {v.price || `$${product.price.toFixed(2)}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Section: Extracted Keywords & Tags Clickable Pills */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
                  <Tag className="w-5 h-5 text-cyan-400" />
                  Extracted Keywords & Search Volume Tags
                </h3>
                <p className="text-xs text-slate-400">
                  Click any pill to copy to clipboard for your Merch on Demand backend search terms or title.
                </p>
              </div>

              <button
                onClick={handleCopyAllKeywords}
                className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                Copy All Keywords
              </button>
            </div>

            {/* Keyword Pills Grid */}
            <div className="flex flex-wrap gap-2 pt-2">
              {product.extractedKeywords && product.extractedKeywords.length > 0 ? (
                product.extractedKeywords.map((kw, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleCopy(kw.keyword, 'Keyword')}
                    className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 hover:border-cyan-500/50 text-xs font-mono transition-all cursor-pointer shadow-sm"
                  >
                    <span>{kw.keyword}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/40">
                      {kw.searchVolume.toLocaleString()} vol
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded ${
                        kw.competition === 'Low'
                          ? 'bg-emerald-950/80 text-emerald-400'
                          : 'bg-amber-950/80 text-amber-400'
                      }`}
                    >
                      {kw.competition}
                    </span>
                    <Copy className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 opacity-60 group-hover:opacity-100" />
                  </button>
                ))
              ) : (
                <p className="text-xs text-slate-400">No keyword tags available.</p>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
