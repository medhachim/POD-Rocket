// Local Data Persistence & Caching System for RapidAPI Amazon Responses
// Prevents redundant API calls, saves quota, and enables instant 0ms loads

export interface CacheEntry<T> {
  key: string;
  data: T;
  timestamp: number;
  expiresAt?: number;
  itemCount?: number;
  category: 'asin' | 'trend' | 'evergreen' | 'search';
}

const CACHE_PREFIX = 'pod_rapidapi_cache_';
const CACHE_INDEX_KEY = 'pod_rapidapi_cache_index_v1';

// In-memory fallback / mirror for zero-latency lookups
const memoryCache = new Map<string, CacheEntry<any>>();

// Helper to safely get the list of active cache keys
function getCacheIndex(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CACHE_INDEX_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return Array.from(memoryCache.keys());
  }
}

// Helper to save cache key index
function saveCacheIndex(keys: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CACHE_INDEX_KEY, JSON.stringify(keys));
  } catch (e) {
    console.warn('Failed to save cache index', e);
  }
}

// Generate normalized deterministic cache key for query filters
export function generateFilterCacheKey(type: 'trend' | 'evergreen', filters: Record<string, any>): string {
  // Sort keys for deterministic hash
  const normalized: Record<string, any> = {};
  Object.keys(filters || {})
    .sort()
    .forEach((k) => {
      if (filters[k] !== undefined && filters[k] !== null && filters[k] !== '') {
        normalized[k] = filters[k];
      }
    });

  return `${type}:${JSON.stringify(normalized)}`;
}

// Retrieve cached item
export function getCachedItem<T>(key: string): CacheEntry<T> | null {
  const fullKey = CACHE_PREFIX + key;

  // 1. Check in-memory first
  if (memoryCache.has(key)) {
    const memItem = memoryCache.get(key);
    return memItem as CacheEntry<T>;
  }

  // 2. Check localStorage
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(fullKey);
    if (!raw) return null;
    const entry: CacheEntry<T> = JSON.parse(raw);

    // Save in memory for next access
    memoryCache.set(key, entry);
    return entry;
  } catch (e) {
    console.error('Failed to read from localStorage cache', e);
    return null;
  }
}

// Save item to cache
export function setCachedItem<T>(
  key: string, 
  data: T, 
  category: CacheEntry<T>['category'] = 'search',
  itemCount?: number
): void {
  const fullKey = CACHE_PREFIX + key;
  const count = itemCount !== undefined ? itemCount : (Array.isArray(data) ? data.length : 1);

  const entry: CacheEntry<T> = {
    key,
    data,
    timestamp: Date.now(),
    category,
    itemCount: count,
  };

  // 1. Save to in-memory
  memoryCache.set(key, entry);

  // 2. Save to localStorage
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(fullKey, JSON.stringify(entry));

    const index = getCacheIndex();
    if (!index.includes(key)) {
      index.push(key);
      saveCacheIndex(index);
    }
  } catch (e) {
    console.warn('LocalStorage quota exceeded or unavailable. Retaining in-memory cache.', e);
  }
}

// Clear single key
export function removeCachedItem(key: string): void {
  const fullKey = CACHE_PREFIX + key;
  memoryCache.delete(key);

  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(fullKey);
    const index = getCacheIndex().filter(k => k !== key);
    saveCacheIndex(index);
  } catch {}
}

// Clear all cached RapidAPI queries and products
export function clearAllRapidApiCache(): { clearedCount: number } {
  const count = memoryCache.size;
  memoryCache.clear();

  if (typeof window === 'undefined') return { clearedCount: count };

  try {
    const keys = getCacheIndex();
    let removed = 0;
    keys.forEach((k) => {
      localStorage.removeItem(CACHE_PREFIX + k);
      removed++;
    });

    // Also scan for any orphaned keys
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i);
      if (k && k.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(k);
        removed++;
      }
    }

    localStorage.removeItem(CACHE_INDEX_KEY);
    return { clearedCount: Math.max(removed, count) };
  } catch (e) {
    console.error('Error clearing cache', e);
    return { clearedCount: count };
  }
}

// Get cache statistics for the UI
export function getRapidApiCacheStats(): {
  totalEntries: number;
  totalProductsCached: number;
  lastCachedAt: number | null;
  categories: Record<string, number>;
} {
  const keys = getCacheIndex();
  let totalProducts = 0;
  let latestTime: number | null = null;
  const categories: Record<string, number> = {
    asin: 0,
    trend: 0,
    evergreen: 0,
    search: 0,
  };

  keys.forEach((k) => {
    const item = getCachedItem<any>(k);
    if (item) {
      if (item.itemCount) totalProducts += item.itemCount;
      if (!latestTime || item.timestamp > latestTime) latestTime = item.timestamp;
      if (item.category && categories[item.category] !== undefined) {
        categories[item.category]++;
      }
    }
  });

  return {
    totalEntries: keys.length,
    totalProductsCached: totalProducts,
    lastCachedAt: latestTime,
    categories,
  };
}

// Format relative time for UI badge (e.g. "Saved 2 min ago")
export function formatCacheAge(timestamp: number): string {
  const diffSec = Math.floor((Date.now() - timestamp) / 1000);
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${Math.floor(diffHr / 24)}d ago`;
}
