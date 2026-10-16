'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ProviderConfig, AmazonProduct, ApiResponse } from '@/types/amazon';
import { INITIAL_PROVIDERS } from '@/lib/mockData';
import { 
  getCachedItem, 
  setCachedItem, 
  clearAllRapidApiCache, 
  getRapidApiCacheStats, 
  generateFilterCacheKey 
} from '@/lib/cacheStorage';
import { toast } from 'sonner';

interface ApiContextType {
  providers: ProviderConfig[];
  mockMode: boolean;
  autoFallbackEnabled: boolean;
  merchOnly: boolean;
  currentTab: 'overview' | 'trends' | 'evergreen' | 'spy' | 'trademark' | 'settings';
  activeAsin: string;
  activeProviderStatus: 'healthy' | 'rate-limited' | 'error' | 'disabled' | 'testing';
  activeProviderName: string;
  isPerformingFallbackTest: boolean;
  inspectedTrademark: { title: string; asin?: string } | null;
  cacheStats: { totalEntries: number; totalProductsCached: number; lastCachedAt: number | null };
  cacheVersion: number;
  setCurrentTab: (tab: 'overview' | 'trends' | 'evergreen' | 'spy' | 'trademark' | 'settings') => void;
  setActiveAsin: (asin: string) => void;
  setMockMode: (enabled: boolean) => void;
  setMerchOnly: (enabled: boolean) => void;
  setAutoFallbackEnabled: (enabled: boolean) => void;
  updateProvider: (id: string, updates: Partial<ProviderConfig>) => void;
  testProvider: (provider: ProviderConfig) => Promise<void>;
  simulateFallbackFailover: () => Promise<void>;
  clearCacheAndRefetch: () => void;
  fetchAsinProduct: (asin: string, forceRefresh?: boolean) => Promise<AmazonProduct | null>;
  searchTrends: (filters: any, forceRefresh?: boolean) => Promise<AmazonProduct[]>;
  searchEvergreen: (filters: any, forceRefresh?: boolean) => Promise<AmazonProduct[]>;
  openTrademarkModal: (title: string, asin?: string) => void;
  closeTrademarkModal: () => void;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

const LOCAL_STORAGE_PROVIDERS_KEY = 'pod_analytics_pro_providers_v2';
const LOCAL_STORAGE_MOCK_KEY = 'pod_analytics_pro_mock_mode_v2';

export function ApiProvider({ children }: { children: React.ReactNode }) {
  const [providers, setProviders] = useState<ProviderConfig[]>(INITIAL_PROVIDERS);
  const [mockMode, setMockModeState] = useState<boolean>(false); // Real RapidAPI live mode by default
  const [autoFallbackEnabled, setAutoFallbackEnabled] = useState<boolean>(true);
  const [merchOnly, setMerchOnlyState] = useState<boolean>(true); // Strict Merch by Amazon T-Shirts enabled by default
  const [currentTab, setCurrentTab] = useState<'overview' | 'trends' | 'evergreen' | 'spy' | 'trademark' | 'settings'>('overview');
  const [activeAsin, setActiveAsin] = useState<string>('B07ZPKBL9V');
  const [isPerformingFallbackTest, setIsPerformingFallbackTest] = useState(false);
  const [inspectedTrademark, setInspectedTrademark] = useState<{ title: string; asin?: string } | null>(null);
  const [cacheVersion, setCacheVersion] = useState<number>(0);
  const [cacheStats, setCacheStats] = useState(getRapidApiCacheStats());

  // Initialize and sync cache stats on client mount
  useEffect(() => {
    setCacheStats(getRapidApiCacheStats());
  }, []);

  const clearCacheAndRefetch = useCallback(() => {
    const { clearedCount } = clearAllRapidApiCache();
    setCacheVersion((v) => v + 1);
    setCacheStats(getRapidApiCacheStats());
    toast.success(
      `Cache Cleared: Wiped ${clearedCount} cached item${clearedCount === 1 ? '' : 's'}. Next searches will fetch live RapidAPI data.`,
      {
        description: 'Updated real-time BSR, pricing, and seller rankings are now requested.',
        duration: 4000,
      }
    );
  }, []);

  const setMerchOnly = (enabled: boolean) => {
    setMerchOnlyState(enabled);
    toast.info(
      enabled
        ? 'Merch T-Shirts Only: Filtering exclusively for T-Shirts (excluding non-apparel items).'
        : 'Merch Filter Disabled: Showing broad catalog items.'
    );
  };

  const openTrademarkModal = (title: string, asin?: string) => {
    setInspectedTrademark({ title, asin });
  };

  const closeTrademarkModal = () => {
    setInspectedTrademark(null);
  };

  // Load saved configuration from localStorage
  useEffect(() => {
    try {
      const savedProviders = localStorage.getItem(LOCAL_STORAGE_PROVIDERS_KEY);
      if (savedProviders) {
        setProviders(JSON.parse(savedProviders));
      }
    } catch (e) {
      console.error('Error loading settings from localStorage', e);
    }
  }, []);

  const saveProviders = (newProviders: ProviderConfig[]) => {
    setProviders(newProviders);
    try {
      localStorage.setItem(LOCAL_STORAGE_PROVIDERS_KEY, JSON.stringify(newProviders));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  };

  const setMockMode = (enabled: boolean) => {
    setMockModeState(enabled);
    try {
      localStorage.setItem(LOCAL_STORAGE_MOCK_KEY, String(enabled));
    } catch (e) {}
    toast.info(
      enabled
        ? 'Mock Data Mode enabled: Instant realistic POD datasets loaded.'
        : 'Live RapidAPI Mode activated: Sending requests to configured endpoints.'
    );
  };

  const updateProvider = (id: string, updates: Partial<ProviderConfig>) => {
    const updated = providers.map((p) => (p.id === id ? { ...p, ...updates } : p));
    saveProviders(updated);
  };

  // Primary provider health status
  const primaryProvider = providers.find((p) => p.type === 'primary');
  const activeProviderStatus = !primaryProvider?.enabled
    ? 'disabled'
    : primaryProvider.status;
  const activeProviderName = primaryProvider?.name || 'Primary Provider';

  // Test provider connection
  const testProvider = async (provider: ProviderConfig) => {
    const toastId = toast.loading(`Pinging ${provider.name}...`);
    try {
      const res = await fetch('/api/amazon-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'test-provider',
          payload: { provider },
          mockMode,
        }),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        updateProvider(provider.id, {
          status: 'healthy',
          latencyMs: json.latencyMs,
          lastTested: 'Just now',
        });
        toast.success(`Connected to ${provider.name} (${json.latencyMs}ms)`, { id: toastId });
      } else if (res.status === 429) {
        updateProvider(provider.id, {
          status: 'rate-limited',
          latencyMs: json.latencyMs,
          lastTested: 'Just now',
        });
        toast.warning(`${provider.name} is Rate Limited (429)! Fallback will engage automatically.`, { id: toastId });
      } else {
        updateProvider(provider.id, {
          status: 'error',
          latencyMs: json.latencyMs,
          lastTested: 'Just now',
        });
        toast.error(`Connection failed: ${json.message || 'Unknown error'}`, { id: toastId });
      }
    } catch (err: any) {
      updateProvider(provider.id, { status: 'error', lastTested: 'Just now' });
      toast.error(`Network error testing ${provider.name}: ${err.message}`, { id: toastId });
    }
  };

  // Simulate Fallback failover
  const simulateFallbackFailover = async () => {
    setIsPerformingFallbackTest(true);
    const toastId = toast.loading('Simulating Primary Provider 429 Rate Limit error...');
    
    try {
      const res = await fetch('/api/amazon-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'asin-lookup',
          payload: { asin: 'B07ZPKBL9V' },
          providers,
          mockMode: false,
          simulateFailover: true,
        }),
      });

      const json = await res.json();
      
      // Temporarily mark primary as rate-limited to visually reflect in UI
      const primary = providers.find((p) => p.type === 'primary');
      if (primary) {
        updateProvider(primary.id, { status: 'rate-limited', lastTested: 'Just now' });
      }

      if (json.fallbackOccurred) {
        toast.warning(
          `FAILOVER TRIGGERED: ${json.failedProviders?.[0] || 'Primary Provider 429'}. Switched to ${json.providerUsed}!`,
          {
            id: toastId,
            duration: 6000,
            description: 'Request completed successfully without dropping any data or crashing the frontend.',
          }
        );
      } else {
        toast.success('Simulation test finished.', { id: toastId });
      }
    } catch (e: any) {
      toast.error(`Simulation failed: ${e.message}`, { id: toastId });
    } finally {
      setIsPerformingFallbackTest(false);
    }
  };

  // Fetch product for Competitor Spy
  const fetchAsinProduct = async (asin: string, forceRefresh = false): Promise<AmazonProduct | null> => {
    const cleanAsin = asin.trim().toUpperCase();
    const cacheKey = `asin:${cleanAsin}`;

    // 1. Persistent Storage Check: return cached product immediately if present
    if (!forceRefresh) {
      const cached = getCachedItem<AmazonProduct>(cacheKey);
      if (cached && cached.data) {
        return {
          ...cached.data,
          isFromCache: true,
          cachedAt: cached.timestamp,
        };
      }
    }

    // 2. Fetch live data from RapidAPI
    try {
      const res = await fetch('/api/amazon-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'asin-lookup',
          payload: { asin: cleanAsin },
          providers,
          mockMode,
        }),
      });

      const json: ApiResponse<AmazonProduct> = await res.json();

      if (json.fallbackOccurred) {
        toast.warning(`Notice: Fallback activated! Switched to ${json.providerUsed}`, {
          description: `Primary provider hit an error. Data was seamlessly routed through fallback.`,
          duration: 5000,
        });
      }

      if (json.success && json.data) {
        // Save to persistent storage
        setCachedItem(cacheKey, json.data, 'asin', 1);
        setCacheStats(getRapidApiCacheStats());
        return {
          ...json.data,
          isFromCache: false,
          cachedAt: Date.now(),
        };
      }
      return null;
    } catch (e: any) {
      toast.error(`Failed to fetch ASIN: ${e.message}`);
      return null;
    }
  };

  // Search Trends
  const searchTrends = async (filters: any, forceRefresh = false): Promise<AmazonProduct[]> => {
    const cacheKey = generateFilterCacheKey('trend', { ...filters, merchOnly });

    // 1. Persistent Storage Check: return cached results immediately
    if (!forceRefresh) {
      const cached = getCachedItem<AmazonProduct[]>(cacheKey);
      if (cached && Array.isArray(cached.data) && cached.data.length > 0) {
        return cached.data.map((p) => ({
          ...p,
          isFromCache: true,
          cachedAt: cached.timestamp,
        }));
      }
    }

    // 2. Execute live RapidAPI request
    try {
      const res = await fetch('/api/amazon-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'trend-search',
          payload: { ...filters, merchOnly },
          providers,
          mockMode,
        }),
      });
      const json = await res.json();
      const list = json.data || [];

      if (list.length > 0) {
        // Save to persistent storage
        setCachedItem(cacheKey, list, 'trend', list.length);
        setCacheStats(getRapidApiCacheStats());
      }
      return list.map((p: AmazonProduct) => ({
        ...p,
        isFromCache: false,
        cachedAt: Date.now(),
      }));
    } catch (e) {
      console.error(e);
      return [];
    }
  };

  // Search Evergreen
  const searchEvergreen = async (filters: any, forceRefresh = false): Promise<AmazonProduct[]> => {
    const cacheKey = generateFilterCacheKey('evergreen', { ...filters, merchOnly });

    // 1. Persistent Storage Check: return cached results immediately
    if (!forceRefresh) {
      const cached = getCachedItem<AmazonProduct[]>(cacheKey);
      if (cached && Array.isArray(cached.data) && cached.data.length > 0) {
        return cached.data.map((p) => ({
          ...p,
          isFromCache: true,
          cachedAt: cached.timestamp,
        }));
      }
    }

    // 2. Execute live RapidAPI request
    try {
      const res = await fetch('/api/amazon-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'evergreen-search',
          payload: { ...filters, merchOnly },
          providers,
          mockMode,
        }),
      });
      const json = await res.json();
      const list = json.data || [];

      if (list.length > 0) {
        // Save to persistent storage
        setCachedItem(cacheKey, list, 'evergreen', list.length);
        setCacheStats(getRapidApiCacheStats());
      }
      return list.map((p: AmazonProduct) => ({
        ...p,
        isFromCache: false,
        cachedAt: Date.now(),
      }));
    } catch (e) {
      console.error(e);
      return [];
    }
  };

  return (
    <ApiContext.Provider
      value={{
        providers,
        mockMode,
        autoFallbackEnabled,
        merchOnly,
        currentTab,
        activeAsin,
        activeProviderStatus,
        activeProviderName,
        isPerformingFallbackTest,
        cacheStats,
        cacheVersion,
        setCurrentTab,
        setActiveAsin,
        setMockMode,
        setMerchOnly,
        setAutoFallbackEnabled,
        updateProvider,
        testProvider,
        simulateFallbackFailover,
        clearCacheAndRefetch,
        fetchAsinProduct,
        searchTrends,
        searchEvergreen,
        inspectedTrademark,
        openTrademarkModal,
        closeTrademarkModal,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
}

export function useApi() {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
}
