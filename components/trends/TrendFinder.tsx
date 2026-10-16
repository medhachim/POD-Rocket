'use client';

import React, { useState, useEffect } from 'react';
import { useApi } from '@/context/ApiContext';
import { AmazonProduct, TrendFilterState } from '@/types/amazon';
import { CustomSlider } from '@/components/ui/CustomSlider';
import { Modal } from '@/components/ui/Modal';
import { checkTrademark } from '@/lib/trademarkChecker';
import { formatCacheAge } from '@/lib/cacheStorage';
import { 
  TrendingUp, 
  Search, 
  Filter, 
  ArrowDownRight, 
  Copy, 
  ExternalLink, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Crosshair, 
  Sparkles, 
  Tag, 
  Calendar, 
  Layers, 
  ZoomIn, 
  Scale, 
  CheckCircle2,
  RotateCw,
  Database
} from 'lucide-react';
import { toast } from 'sonner';

export function TrendFinder() {
  const { searchTrends, setActiveAsin, setCurrentTab, openTrademarkModal, cacheVersion } = useApi();
  const [products, setProducts] = useState<AmazonProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [filters, setFilters] = useState<TrendFilterState>({
    maxBsr: 100000,
    dateRange: '7d',
    maxResults: 150,
    productType: 'all',
    keyword: '',
    sortBy: 'velocity',
  });

  // Modal / Preview state
  const [selectedProduct, setSelectedProduct] = useState<AmazonProduct | null>(null);
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);

  const fetchResults = async (forceRefresh = false) => {
    setLoading(true);
    const res = await searchTrends(filters, forceRefresh);
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
    // Take the main distinctive words for TMHunt search
    const clean = title.replace(/[^a-zA-Z0-9\s]/g, '').split(/\s+/).slice(0, 4).join(' ');
    return `https://tmhunt.com/?query=${encodeURIComponent(clean)}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-wide">
                Trend Finder: Fast Dropping BSR & Viral POD Sales
              </h1>
              <p className="text-xs text-slate-400">
                Detect exploding sales spikes and viral Merch on Demand designs before the niche saturates.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">
              Found: <strong className="text-cyan-400">{products.length}</strong> products
            </span>
          </div>
        </div>

        {/* Sliders and Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Max BSR Slider */}
          <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/80">
            <CustomSlider
              label="Maximum BSR"
              min={1000}
              max={150000}
              step={1000}
              value={filters.maxBsr}
              onChange={(val) => setFilters((prev) => ({ ...prev, maxBsr: val }))}
              formatValue={(val) => `#${val.toLocaleString()}`}
            />
          </div>

          {/* Date Picker / Range Selector */}
          <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                Velocity Window
              </span>
              <span className="text-cyan-400 font-mono font-semibold">{filters.dateRange}</span>
            </div>
            <div className="grid grid-cols-4 gap-1 pt-1">
              {(['7d', '14d', '30d', '60d'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setFilters((prev) => ({ ...prev, dateRange: range }))}
                  className={`py-1 rounded text-xs font-mono font-medium transition-colors ${
                    filters.dateRange === range
                      ? 'bg-cyan-600 text-white shadow-sm'
                      : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          {/* Max Results Slider (< 300) */}
          <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/80">
            <CustomSlider
              label="Max Results Limit"
              min={25}
              max={300}
              step={25}
              value={filters.maxResults}
              onChange={(val) => setFilters((prev) => ({ ...prev, maxResults: val }))}
              unit=" items"
            />
          </div>

          {/* Product Type & Sort */}
          <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/80 space-y-2">
            <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              Category & Sort
            </span>
            <div className="grid grid-cols-2 gap-2 pt-0.5">
              <select
                value={filters.productType}
                onChange={(e) => setFilters((prev) => ({ ...prev, productType: e.target.value }))}
                className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="all">All Types</option>
                <option value="Standard T-Shirt">Standard T-Shirt</option>
                <option value="Premium T-Shirt">Premium T-Shirt</option>
                <option value="Pullover Hoodie">Pullover Hoodie</option>
                <option value="Sweatshirt">Sweatshirt</option>
                <option value="PopSockets Grip">PopSockets</option>
                <option value="Coffee Mug">Coffee Mug</option>
              </select>

              <select
                value={filters.sortBy}
                onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))}
                className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="velocity">Fastest Dropping</option>
                <option value="bsr_asc">Lowest BSR</option>
                <option value="sales_desc">Highest Sales</option>
                <option value="price_asc">Lowest Price</option>
              </select>
            </div>
          </div>
        </div>

        {/* Search Bar within Trends */}
        <div className="relative">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={filters.keyword}
            onChange={(e) => setFilters((prev) => ({ ...prev, keyword: e.target.value }))}
            placeholder="Search trend titles, keywords (e.g. vintage 1984, retro pickleball, coding, halloween)..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Verified Merch by Amazon Only & Local Cache Indicator Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800 shadow-sm">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/90 border border-emerald-600/80 text-emerald-400 font-mono text-xs font-bold shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
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
            Class 025 Graphic Tees ($13.00 – $25.99)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span className="text-emerald-400 font-bold">{products.length}</span> Verified Listings
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

      {/* Results View: Responsive Product Data Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-4 animate-pulse space-y-3">
              <div className="aspect-square bg-slate-800 rounded-lg" />
              <div className="h-4 bg-slate-800 rounded w-3/4" />
              <div className="h-3 bg-slate-800 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/50 border border-slate-800 rounded-xl space-y-3">
          <p className="text-slate-400 text-sm">No trending products found matching your current filter criteria.</p>
          <button
            onClick={() => setFilters({
              maxBsr: 150000,
              dateRange: '7d',
              maxResults: 150,
              productType: 'all',
              keyword: '',
              sortBy: 'velocity',
            })}
            className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-medium cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.map((item) => {
            const tmCheck = checkTrademark(item.title);

            return (
              <div
                key={item.asin}
                className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-xl p-4 transition-all duration-200 flex flex-col justify-between group shadow-lg hover:shadow-cyan-950/30"
              >
                <div>
                  {/* Thumbnail with Hover to Enlarge */}
                  <div 
                    className="relative aspect-square w-full rounded-lg bg-slate-950 overflow-hidden mb-3 border border-slate-800/80 cursor-pointer"
                    onClick={() => setSelectedProduct(item)}
                  >
                    <img
                      src={item.productPhoto}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* BSR Velocity & TM Safety Badges */}
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-950/95 border border-emerald-700/80 text-emerald-400 text-[11px] font-mono font-bold flex items-center gap-1 shadow-lg backdrop-blur-sm">
                        <ArrowDownRight className="w-3.5 h-3.5 text-emerald-400" />
                        {item.bsrVelocity7d}% BSR (7d)
                      </span>

                      {/* Dynamic Trademark Safety Badge */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openTrademarkModal(item.title, item.asin);
                        }}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold flex items-center gap-1 shadow-md backdrop-blur-sm transition-transform hover:scale-105 ${
                          tmCheck.overallStatus === 'Safe'
                            ? 'bg-emerald-950/90 border border-emerald-800 text-emerald-400'
                            : tmCheck.overallStatus === 'Check Required'
                            ? 'bg-amber-950/90 border border-amber-800 text-amber-300'
                            : 'bg-rose-950/95 border border-rose-700 text-rose-300 animate-pulse'
                        }`}
                        title="Click to inspect Class 025 Trademarks"
                      >
                        {tmCheck.overallStatus === 'Safe' ? (
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        ) : tmCheck.overallStatus === 'Check Required' ? (
                          <AlertTriangle className="w-3 h-3 text-amber-400" />
                        ) : (
                          <ShieldAlert className="w-3 h-3 text-rose-400" />
                        )}
                        {tmCheck.overallStatus}
                      </button>
                    </div>

                    {/* Product Type Badge */}
                    <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md bg-slate-900/90 border border-slate-800 text-slate-300 text-[10px] font-mono backdrop-blur-sm">
                      {item.productType}
                    </span>

                    {/* Cached Data Indicator on Card (Requirement 1) */}
                    {item.isFromCache && (
                      <span 
                        className="absolute top-2.5 right-2.5 px-1.5 py-0.5 rounded-md bg-cyan-950/95 border border-cyan-700/80 text-cyan-300 text-[10px] font-mono font-bold flex items-center gap-1 shadow-md backdrop-blur-sm"
                        title="Loaded instantly from local storage cache (0ms)"
                      >
                        <Database className="w-2.5 h-2.5 text-cyan-400" />
                        Cached
                      </span>
                    )}

                    {/* Quick Preview Icon */}
                    <div className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ZoomIn className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Title & ASIN */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400 font-mono font-semibold">{item.asin}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(item.asin, 'ASIN');
                          }}
                          className="text-slate-500 hover:text-cyan-400 transition-colors"
                          title="Copy ASIN to clipboard"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-white font-bold font-mono text-sm">${item.price.toFixed(2)}</span>
                      </div>
                    </div>

                    <h3 
                      className="text-xs font-semibold text-slate-200 line-clamp-2 leading-relaxed group-hover:text-cyan-400 transition-colors cursor-pointer"
                      title={item.title}
                      onClick={() => setSelectedProduct(item)}
                    >
                      {item.title}
                    </h3>
                  </div>
                </div>

                {/* Metrics & Badges */}
                <div className="pt-3 mt-3 border-t border-slate-800/80 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Current BSR:</span>
                    <span className="text-cyan-400 font-mono font-bold">#{item.currentBsr.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Est. Daily Sales:</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 font-mono font-semibold text-[11px]">
                      ~{item.estDailySales} sales / day
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Est. Mo. Revenue:</span>
                    <span className="text-white font-mono font-semibold">${item.estMonthlyRevenue.toLocaleString()}</span>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="pt-1.5 flex items-center gap-2">
                    <button
                      onClick={() => {
                        setActiveAsin(item.asin);
                        setCurrentTab('spy');
                      }}
                      className="flex-1 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Crosshair className="w-3 h-3" />
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

                    <button
                      type="button"
                      onClick={() => openTrademarkModal(item.title, item.asin)}
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
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
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Product Quick-View Modal */}
      <Modal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        title={selectedProduct?.title || 'Product Details'}
        maxWidth="max-w-3xl"
      >
        {selectedProduct && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="aspect-square rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                <img
                  src={selectedProduct.productPhoto}
                  alt={selectedProduct.title}
                  className="w-full h-full object-contain p-4"
                />
              </div>

              {selectedProduct.productPhotos && selectedProduct.productPhotos.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {selectedProduct.productPhotos.map((photo, i) => (
                    <img
                      key={i}
                      src={photo}
                      alt="Thumbnail"
                      className="w-14 h-14 rounded-lg object-cover border border-slate-800 cursor-pointer hover:border-cyan-500"
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                  {selectedProduct.asin}
                </span>
                <h3 className="text-sm font-bold text-white mt-2 leading-relaxed">
                  {selectedProduct.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1">Brand: {selectedProduct.brand}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950/70 rounded-xl border border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400">Price:</span>
                  <div className="text-white font-mono font-bold text-sm">${selectedProduct.price.toFixed(2)}</div>
                </div>
                <div>
                  <span className="text-slate-400">Current BSR:</span>
                  <div className="text-cyan-400 font-mono font-bold text-sm">#{selectedProduct.currentBsr.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-slate-400">BSR Velocity (7d):</span>
                  <div className="text-emerald-400 font-mono font-bold text-sm">{selectedProduct.bsrVelocity7d}%</div>
                </div>
                <div>
                  <span className="text-slate-400">Est. Daily Sales:</span>
                  <div className="text-emerald-400 font-mono font-bold text-sm">{selectedProduct.estDailySales} units</div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Top Extracted Keywords
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProduct.extractedKeywords.map((kw, i) => (
                    <span
                      key={i}
                      onClick={() => handleCopy(kw.keyword, 'Keyword')}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-mono border border-slate-700 cursor-pointer flex items-center gap-1"
                      title="Click to copy"
                    >
                      {kw.keyword}
                      <Copy className="w-2.5 h-2.5 text-slate-400" />
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => {
                    setActiveAsin(selectedProduct.asin);
                    setCurrentTab('spy');
                    setSelectedProduct(null);
                  }}
                  className="flex-1 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Analyze in Competitor Spy
                </button>
                <a
                  href={selectedProduct.productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 flex items-center gap-1.5"
                >
                  Amazon <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
