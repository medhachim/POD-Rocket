export type ProductType = 
  | 'Standard T-Shirt'
  | 'Premium T-Shirt'
  | 'Pullover Hoodie'
  | 'Zip Hoodie'
  | 'Sweatshirt'
  | 'PopSockets Grip'
  | 'Coffee Mug'
  | 'Tote Bag'
  | 'Phone Case'
  | 'Electronics / Other';

export type CompetitionLevel = 'Low' | 'Medium' | 'High';

export interface BsrHistoryPoint {
  date: string;
  bsr: number;
  price: number;
  estSales?: number;
}

export interface ProductVariation {
  asin: string;
  title?: string;
  size?: string;
  color?: string;
  price?: string;
  isAvailable?: boolean;
  photo?: string;
}

export interface ExtractedKeyword {
  keyword: string;
  searchVolume: number;
  relevance: number; // 1-100
  competition: CompetitionLevel;
}

export interface AmazonProduct {
  asin: string;
  title: string;
  brand: string;
  brandUrl?: string;
  price: number;
  originalPrice?: number | null;
  currency: string;
  starRating: number;
  numRatings: number;
  productPhoto: string;
  productPhotos?: string[];
  productUrl: string;
  productType: ProductType;
  salesVolumeText?: string;
  
  // BSR & Sales Metrics
  currentBsr: number;
  bsrCategory: string;
  bsrSubcategories?: string[];
  bsrVelocity7d: number; // Percentage change (negative means dropping fast = good)
  bsrChangeAmount: number; // e.g., dropped from 65,000 to 12,000
  estDailySales: number;
  estMonthlyRevenue: number;
  
  // Historical Data
  bsrHistory: BsrHistoryPoint[];
  stabilityScore: number; // 0 - 100% (for evergreen products)
  
  // Merch / POD Details
  competitionLevel: CompetitionLevel;
  trademarkStatus: 'Clean' | 'Potential Risk' | 'Unchecked';
  backendSearchTerms: string[];
  extractedKeywords: ExtractedKeyword[];
  features?: string[];
  description?: string;
  variations?: ProductVariation[];
  buyBoxSeller?: string;
  isBestSeller?: boolean;
  isAmazonChoice?: boolean;
  isFromCache?: boolean;
  cachedAt?: number;
}

export type ProviderType = 'primary' | 'secondary' | 'metadata';
export type ProviderStatus = 'healthy' | 'rate-limited' | 'error' | 'testing' | 'disabled';

export interface ProviderConfig {
  id: string;
  name: string;
  type: ProviderType;
  host: string;
  endpointUrl: string;
  apiKey: string;
  enabled: boolean;
  status: ProviderStatus;
  latencyMs?: number;
  lastTested?: string;
}

export interface ApiSettingsState {
  providers: ProviderConfig[];
  mockMode: boolean;
  autoFallbackEnabled: boolean;
  activeProviderId: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  providerUsed: string;
  fallbackOccurred: boolean;
  failedProviders?: string[];
  message?: string;
  isMock: boolean;
  latencyMs: number;
}

export interface TrendFilterState {
  maxBsr: number;
  dateRange: '7d' | '14d' | '30d' | '60d';
  maxResults: number;
  productType: string;
  keyword: string;
  sortBy: 'velocity' | 'bsr_asc' | 'sales_desc' | 'price_asc';
}

export interface EvergreenFilterState {
  minBsr: number;
  maxBsr: number;
  maxReviews: number;
  minRating: number;
  keyword: string;
  competitionLevel: 'all' | 'Low' | 'Medium';
  sortBy: 'stability' | 'reviews_asc' | 'sales_desc' | 'bsr_asc';
}
