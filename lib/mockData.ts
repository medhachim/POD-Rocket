import { AmazonProduct, ProviderConfig } from '@/types/amazon';

// Helper to generate 90 days of history
function generateBsrHistory(
  baseBsr: number,
  basePrice: number,
  trendType: 'dropping' | 'stable' | 'volatile' | 'climbing'
) {
  const points = [];
  const today = new Date('2026-09-27');
  
  for (let i = 89; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    
    let currentBsr = baseBsr;
    let currentPrice = basePrice;
    
    if (trendType === 'dropping') {
      // Starts high, drops fast (velocity trend)
      const factor = 1 + (i / 90) * 3.5;
      const noise = (Math.random() - 0.5) * (baseBsr * 0.15);
      currentBsr = Math.max(800, Math.round(baseBsr * factor + noise));
    } else if (trendType === 'stable') {
      // Steady evergreen range
      const noise = (Math.random() - 0.5) * (baseBsr * 0.08);
      currentBsr = Math.max(50000, Math.round(baseBsr + noise));
    } else if (trendType === 'volatile') {
      const cyclical = Math.sin(i / 6) * (baseBsr * 0.4);
      currentBsr = Math.max(2000, Math.round(baseBsr + cyclical));
    } else {
      currentBsr = Math.round(baseBsr + (Math.random() - 0.5) * 5000);
    }
    
    // Slight price variations
    if (i % 25 === 0) {
      currentPrice = Number((basePrice + (Math.random() > 0.5 ? 2 : -1)).toFixed(2));
    }
    
    const estSales = Math.max(1, Math.round(100000 / Math.pow(currentBsr, 0.82)));
    
    points.push({
      date: dateStr,
      bsr: currentBsr,
      price: currentPrice,
      estSales,
    });
  }
  return points;
}

export const INITIAL_PROVIDERS: ProviderConfig[] = [
  {
    id: 'provider-primary',
    name: 'RapidAPI: Real-Time Amazon Data',
    type: 'primary',
    host: 'real-time-amazon-data.p.rapidapi.com',
    endpointUrl: 'https://real-time-amazon-data.p.rapidapi.com/product-details',
    apiKey: '110cfe6ccdmsh585217d3b968239p18b55ajsn62402351c62d',
    enabled: true,
    status: 'healthy',
    latencyMs: 142,
    lastTested: 'Just now',
  },
  {
    id: 'provider-secondary',
    name: 'RapidAPI: Amazon BSR & Pricing (Fallback)',
    type: 'secondary',
    host: 'amazon-price1.p.rapidapi.com',
    endpointUrl: 'https://amazon-price1.p.rapidapi.com/priceReport',
    apiKey: '110cfe6ccdmsh585217d3b968239p18b55ajsn62402351c62d',
    enabled: true,
    status: 'healthy',
    latencyMs: 210,
    lastTested: 'Just now',
  },
  {
    id: 'provider-metadata',
    name: 'RapidAPI: Amazon Merch Keyword & Search',
    type: 'metadata',
    host: 'amazon-search1.p.rapidapi.com',
    endpointUrl: 'https://amazon-search1.p.rapidapi.com/searchSuggestions',
    apiKey: '110cfe6ccdmsh585217d3b968239p18b55ajsn62402351c62d',
    enabled: true,
    status: 'healthy',
    latencyMs: 185,
    lastTested: 'Just now',
  },
];

export const MOCK_POD_PRODUCTS: AmazonProduct[] = [
  {
    asin: 'B08XYZ1984',
    title: 'Vintage 1984 Limited Edition 40th Birthday Retro Cassette T-Shirt',
    brand: 'Retro Birthday Apparel Co.',
    brandUrl: 'https://www.amazon.com/stores/RetroBirthdayApparel',
    price: 19.99,
    originalPrice: 22.99,
    currency: 'USD',
    starRating: 4.8,
    numRatings: 382,
    productPhoto: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
    productPhotos: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80',
    ],
    productUrl: 'https://www.amazon.com/dp/B08XYZ1984',
    productType: 'Standard T-Shirt',
    salesVolumeText: '800+ bought in past month',
    currentBsr: 2840,
    bsrCategory: 'Clothing, Shoes & Jewelry',
    bsrSubcategories: ['#12 in Novelty Men\'s T-Shirts', '#34 in Birthday Apparel'],
    bsrVelocity7d: -64.2, // Dropping fast = spiking sales!
    bsrChangeAmount: 18500,
    estDailySales: 54,
    estMonthlyRevenue: 32383,
    stabilityScore: 78,
    competitionLevel: 'Medium',
    trademarkStatus: 'Clean',
    backendSearchTerms: [
      'vintage 1984 gifts for men turning 40',
      'cassette tape 80s party costume shirt',
      'forty milestone celebration gift dad',
      'retro graphic tee husband birthday'
    ],
    extractedKeywords: [
      { keyword: '1984 birthday shirt', searchVolume: 18400, relevance: 98, competition: 'Medium' },
      { keyword: '40th birthday gift men', searchVolume: 32000, relevance: 94, competition: 'High' },
      { keyword: 'vintage 1984 cassette', searchVolume: 6700, relevance: 91, competition: 'Low' },
      { keyword: 'retro 80s aesthetic shirt', searchVolume: 14200, relevance: 86, competition: 'Medium' },
      { keyword: 'gifts for 40 year old man', searchVolume: 41000, relevance: 82, competition: 'High' },
    ],
    features: [
      'Solid colors: 100% Cotton; Heather Grey: 90% Cotton, 10% Polyester',
      'Machine Wash Cold with like colors, dry low heat',
      'Authentic vintage cassette graphic design celebration theme',
      'Lightweight, Classic fit, Double-needle sleeve and bottom hem'
    ],
    description: 'Looking for the ultimate 40th birthday shirt for someone born in 1984? This vintage retro cassette tape graphic brings nostalgic 80s vibes for husbands, dads, brothers, and friends celebrating four decades of awesomeness.',
    variations: [
      { asin: 'B08XYZ1984-S-BLK', size: 'Small', color: 'Asphalt Black', price: '$19.99', isAvailable: true },
      { asin: 'B08XYZ1984-M-BLK', size: 'Medium', color: 'Asphalt Black', price: '$19.99', isAvailable: true },
      { asin: 'B08XYZ1984-L-NAV', size: 'Large', color: 'Navy Blue', price: '$19.99', isAvailable: true },
      { asin: 'B08XYZ1984-XL-GRY', size: 'XL', color: 'Heather Grey', price: '$19.99', isAvailable: true },
    ],
    buyBoxSeller: 'Merch on Demand by Amazon',
    isBestSeller: true,
    isAmazonChoice: true,
    bsrHistory: generateBsrHistory(2840, 19.99, 'dropping'),
  },
  {
    asin: 'B09CODECOFFEE',
    title: 'It Works On My Machine Funny Programmer Developer Coding Pullover Hoodie',
    brand: 'Syntax Error Tees',
    brandUrl: 'https://www.amazon.com/stores/SyntaxErrorTees',
    price: 38.99,
    originalPrice: 42.00,
    currency: 'USD',
    starRating: 4.9,
    numRatings: 215,
    productPhoto: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
    productPhotos: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800&auto=format&fit=crop&q=80',
    ],
    productUrl: 'https://www.amazon.com/dp/B09CODECOFFEE',
    productType: 'Pullover Hoodie',
    salesVolumeText: '400+ bought in past month',
    currentBsr: 6420,
    bsrCategory: 'Clothing, Shoes & Jewelry',
    bsrSubcategories: ['#28 in Novelty Hoodies', '#8 in Computer Science Gifts'],
    bsrVelocity7d: -48.5,
    bsrChangeAmount: 14200,
    estDailySales: 32,
    estMonthlyRevenue: 37430,
    stabilityScore: 82,
    competitionLevel: 'Low',
    trademarkStatus: 'Clean',
    backendSearchTerms: [
      'software engineer humor hoodie',
      'python javascript developer gift',
      'it works on my machine docker sarcasm',
      'nerd computer science college hoodie'
    ],
    extractedKeywords: [
      { keyword: 'programmer hoodie funny', searchVolume: 9200, relevance: 96, competition: 'Low' },
      { keyword: 'software developer gift', searchVolume: 22000, relevance: 92, competition: 'Medium' },
      { keyword: 'coding sarcasm sweatshirt', searchVolume: 4300, relevance: 88, competition: 'Low' },
      { keyword: 'it works on my machine', searchVolume: 12500, relevance: 97, competition: 'Low' },
    ],
    features: [
      '8.5 oz, Classic fit, Twill-taped neck',
      'High-resolution direct-to-garment print',
      'Front pouch pocket with matching drawstrings'
    ],
    description: 'The universal excuse of developers everywhere. Great gift for software engineers, backend coders, devops specialists, and tech leads who refuse to debug local docker environments.',
    variations: [
      { asin: 'B09CODE-M', size: 'Medium', color: 'Dark Heather', price: '$38.99', isAvailable: true },
      { asin: 'B09CODE-L', size: 'Large', color: 'Dark Heather', price: '$38.99', isAvailable: true },
      { asin: 'B09CODE-XL', size: 'XL', color: 'Black', price: '$38.99', isAvailable: true },
    ],
    buyBoxSeller: 'Merch on Demand by Amazon',
    isBestSeller: false,
    isAmazonChoice: true,
    bsrHistory: generateBsrHistory(6420, 38.99, 'dropping'),
  },
  {
    asin: 'B07BEE185K',
    title: 'Vintage Beekeeper Whispering Honey Bee Botanical Anatomy T-Shirt',
    brand: 'Apiary Heritage Apparel',
    brandUrl: 'https://www.amazon.com/stores/ApiaryHeritage',
    price: 21.99,
    originalPrice: null,
    currency: 'USD',
    starRating: 4.7,
    numRatings: 34,
    productPhoto: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80',
    productPhotos: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80',
    ],
    productUrl: 'https://www.amazon.com/dp/B07BEE185K',
    productType: 'Premium T-Shirt',
    salesVolumeText: '100+ bought in past month',
    currentBsr: 185400,
    bsrCategory: 'Clothing, Shoes & Jewelry',
    bsrSubcategories: ['#1,402 in Agriculture Novelty Shirts'],
    bsrVelocity7d: -4.2,
    bsrChangeAmount: 8200,
    estDailySales: 5,
    estMonthlyRevenue: 3298,
    stabilityScore: 96, // Highly stable evergreen!
    competitionLevel: 'Low',
    trademarkStatus: 'Clean',
    backendSearchTerms: [
      'beekeeping whisperer hobbyist gift',
      'save the bees honeycomb vintage naturalist',
      'honey maker organic farm apiary tee'
    ],
    extractedKeywords: [
      { keyword: 'beekeeper shirt vintage', searchVolume: 5100, relevance: 97, competition: 'Low' },
      { keyword: 'honey bee anatomy graphic', searchVolume: 2400, relevance: 93, competition: 'Low' },
      { keyword: 'apiary gifts for beekeepers', searchVolume: 4800, relevance: 89, competition: 'Low' },
      { keyword: 'save the bees naturalist shirt', searchVolume: 8900, relevance: 85, competition: 'Medium' },
    ],
    features: [
      'Premium lightweight fine jersey fabric',
      'Detailed botanical honeybee illustration with Latin taxonomy',
      'Men\'s fit runs small, size up for a looser fit'
    ],
    description: 'A classic evergreen design for beekeepers, honey lovers, environmentalists, and nature enthusiasts. Featuring an authentic 19th-century scientific engraving aesthetic.',
    buyBoxSeller: 'Merch on Demand by Amazon',
    isBestSeller: false,
    isAmazonChoice: false,
    bsrHistory: generateBsrHistory(185400, 21.99, 'stable'),
  },
  {
    asin: 'B08LINEMAN22',
    title: 'Vintage Lineman Electrician High Voltage Retro Sunset Work Shirt',
    brand: 'Blue Collar Heritage',
    brandUrl: 'https://www.amazon.com/stores/BlueCollarHeritage',
    price: 19.99,
    originalPrice: null,
    currency: 'USD',
    starRating: 4.8,
    numRatings: 42,
    productPhoto: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80',
    productPhotos: [
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80',
    ],
    productUrl: 'https://www.amazon.com/dp/B08LINEMAN22',
    productType: 'Standard T-Shirt',
    salesVolumeText: '80+ bought in past month',
    currentBsr: 219800,
    bsrCategory: 'Clothing, Shoes & Jewelry',
    bsrSubcategories: ['#1,820 in Occupation Tees'],
    bsrVelocity7d: -2.1,
    bsrChangeAmount: 4300,
    estDailySales: 4,
    estMonthlyRevenue: 2398,
    stabilityScore: 94,
    competitionLevel: 'Low',
    trademarkStatus: 'Clean',
    backendSearchTerms: [
      'power lineman pride pole climber dad',
      'journeyman electrical worker union gift',
      'high voltage utility worker silhouette'
    ],
    extractedKeywords: [
      { keyword: 'lineman shirt retro', searchVolume: 3800, relevance: 98, competition: 'Low' },
      { keyword: 'electrician dad gifts', searchVolume: 12400, relevance: 91, competition: 'Low' },
      { keyword: 'power line worker apparel', searchVolume: 2900, relevance: 88, competition: 'Low' },
    ],
    features: [
      'Heavyweight durable cotton blend',
      'Distressed sunset gradient with power transmission tower',
      'Double stitched sleeves and hem'
    ],
    description: 'Honor the brave men and women who keep the power on in the storm. Great evergreen gift for journeymen, apprentice linemen, and electrical utility workers.',
    buyBoxSeller: 'Merch on Demand by Amazon',
    isBestSeller: false,
    isAmazonChoice: false,
    bsrHistory: generateBsrHistory(219800, 19.99, 'stable'),
  },
  {
    asin: 'B08WELD99K',
    title: 'Welder Skull Sparks Artisan Welding Brotherhood Hooded Sweatshirt',
    brand: 'Arc & Steel Forge',
    brandUrl: 'https://www.amazon.com/stores/ArcSteelForge',
    price: 39.99,
    originalPrice: 44.99,
    currency: 'USD',
    starRating: 4.6,
    numRatings: 28,
    productPhoto: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
    productPhotos: [
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
    ],
    productUrl: 'https://www.amazon.com/dp/B08WELD99K',
    productType: 'Sweatshirt',
    salesVolumeText: '60+ bought in past month',
    currentBsr: 275000,
    bsrCategory: 'Clothing, Shoes & Jewelry',
    bsrSubcategories: ['#2,150 in Tradesman Apparel'],
    bsrVelocity7d: 1.2,
    bsrChangeAmount: 1200,
    estDailySales: 3,
    estMonthlyRevenue: 3599,
    stabilityScore: 91,
    competitionLevel: 'Low',
    trademarkStatus: 'Clean',
    backendSearchTerms: [
      'mig tig pipe welder helmet sparks skull',
      'metal fabricator ironworker gift sweatshirt'
    ],
    extractedKeywords: [
      { keyword: 'welder hoodie skull', searchVolume: 4200, relevance: 96, competition: 'Low' },
      { keyword: 'mig tig welding gifts', searchVolume: 6100, relevance: 92, competition: 'Low' },
      { keyword: 'metal fabrication apparel', searchVolume: 1900, relevance: 86, competition: 'Low' },
    ],
    features: [
      'Cozy fleece interior for cold workshop days',
      'Vibrant heat-resistant style graphic print',
      'Preshrunk cotton poly blend'
    ],
    description: 'Perfect for ironworkers, pipe welders, fabricators and custom metal artisans. Steady sales year-round with low competition.',
    buyBoxSeller: 'Merch on Demand by Amazon',
    bsrHistory: generateBsrHistory(275000, 39.99, 'stable'),
  },
  {
    asin: 'B0CXAXOLOTL',
    title: 'Cute Axolotl Reading Books Just A Girl Who Loves Axolotls Coffee Mug 11oz',
    brand: 'Aquatic Kawaii Creations',
    brandUrl: 'https://www.amazon.com/stores/AquaticKawaii',
    price: 15.99,
    originalPrice: 17.99,
    currency: 'USD',
    starRating: 4.9,
    numRatings: 189,
    productPhoto: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
    productPhotos: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
    ],
    productUrl: 'https://www.amazon.com/dp/B0CXAXOLOTL',
    productType: 'Coffee Mug',
    salesVolumeText: '350+ bought in past month',
    currentBsr: 14850,
    bsrCategory: 'Home & Kitchen',
    bsrSubcategories: ['#42 in Novelty Coffee Mugs', '#18 in Kawaii Gifts'],
    bsrVelocity7d: -52.8,
    bsrChangeAmount: 16400,
    estDailySales: 24,
    estMonthlyRevenue: 11512,
    stabilityScore: 84,
    competitionLevel: 'Medium',
    trademarkStatus: 'Clean',
    backendSearchTerms: [
      'pink axolotl salamander pet lover mug',
      'cute animal bookworm reading librarian gift',
      'kawaii ceramic tea cup daughter birthday'
    ],
    extractedKeywords: [
      { keyword: 'axolotl mug cute', searchVolume: 11500, relevance: 97, competition: 'Medium' },
      { keyword: 'book lover coffee mug', searchVolume: 28000, relevance: 88, competition: 'High' },
      { keyword: 'gifts for axolotl lovers', searchVolume: 15200, relevance: 95, competition: 'Medium' },
    ],
    features: [
      'Premium ceramic with dual-sided sublimation print',
      'Microwave and dishwasher safe (top rack)',
      '11 fluid ounces capacity with comfortable C-handle'
    ],
    description: 'Adorably charming ceramic mug featuring a kawaii pink Mexican walking fish happily reading fantasy novels. High conversion rate among teen girls, librarians, and animal lovers.',
    buyBoxSeller: 'Merch on Demand by Amazon',
    isAmazonChoice: true,
    bsrHistory: generateBsrHistory(14850, 15.99, 'dropping'),
  },
  {
    asin: 'B07PICKLEPOP',
    title: 'Retro 80s Pickleball Just Dink It Smash Champion PopSockets Grip',
    brand: 'Dink Nation Merch',
    brandUrl: 'https://www.amazon.com/stores/DinkNation',
    price: 14.99,
    originalPrice: null,
    currency: 'USD',
    starRating: 4.7,
    numRatings: 520,
    productPhoto: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=800&auto=format&fit=crop&q=80',
    productPhotos: [
      'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=800&auto=format&fit=crop&q=80',
    ],
    productUrl: 'https://www.amazon.com/dp/B07PICKLEPOP',
    productType: 'PopSockets Grip',
    salesVolumeText: '600+ bought in past month',
    currentBsr: 8900,
    bsrCategory: 'Cell Phones & Accessories',
    bsrSubcategories: ['#6 in Cell Phone Stands', '#12 in PopSockets'],
    bsrVelocity7d: -41.0,
    bsrChangeAmount: 11000,
    estDailySales: 38,
    estMonthlyRevenue: 17088,
    stabilityScore: 89,
    competitionLevel: 'Medium',
    trademarkStatus: 'Clean',
    backendSearchTerms: [
      'pickleball paddle ball court player gift',
      'expandable phone stand accessory dink shot',
      'sports stocking stuffer for mom coach'
    ],
    extractedKeywords: [
      { keyword: 'pickleball popsockets', searchVolume: 8400, relevance: 99, competition: 'Medium' },
      { keyword: 'pickleball player gifts', searchVolume: 44000, relevance: 92, competition: 'High' },
      { keyword: 'funny pickleball accessories', searchVolume: 13200, relevance: 90, competition: 'Medium' },
    ],
    features: [
      'Collapsible grip provides secure hold for easier texting and photos',
      'Functions as a convenient stand for watching videos on the court',
      'Swappable top allows easy switching between designs'
    ],
    description: 'Explosive viral growth from the booming pickleball movement. Features a vibrant neon 80s synthwave paddle and ball graphic.',
    buyBoxSeller: 'Merch on Demand by Amazon',
    isBestSeller: true,
    bsrHistory: generateBsrHistory(8900, 14.99, 'dropping'),
  },
  {
    asin: 'B08CATMOON9',
    title: 'Black Cat Tarot Card The Moon Mystical Occult Witchy Graphic T-Shirt',
    brand: 'Lunar Nocturne Studio',
    brandUrl: 'https://www.amazon.com/stores/LunarNocturne',
    price: 19.99,
    originalPrice: 22.99,
    currency: 'USD',
    starRating: 4.8,
    numRatings: 610,
    productPhoto: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop&q=80',
    productPhotos: [
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop&q=80',
    ],
    productUrl: 'https://www.amazon.com/dp/B08CATMOON9',
    productType: 'Standard T-Shirt',
    salesVolumeText: '900+ bought in past month',
    currentBsr: 3410,
    bsrCategory: 'Clothing, Shoes & Jewelry',
    bsrSubcategories: ['#19 in Gothic Novelty Tees', '#45 in Women\'s Graphic Tees'],
    bsrVelocity7d: -58.2,
    bsrChangeAmount: 19200,
    estDailySales: 48,
    estMonthlyRevenue: 28785,
    stabilityScore: 85,
    competitionLevel: 'High',
    trademarkStatus: 'Clean',
    backendSearchTerms: [
      'major arcana xviii cat lover pagan wicca',
      'astrology gothic celestial night sky gift',
      'halloween witch aesthetic streetwear'
    ],
    extractedKeywords: [
      { keyword: 'cat tarot shirt', searchVolume: 24500, relevance: 98, competition: 'Medium' },
      { keyword: 'witchy clothes gothic', searchVolume: 36000, relevance: 91, competition: 'High' },
      { keyword: 'black cat mystic graphic tee', searchVolume: 12000, relevance: 94, competition: 'Medium' },
    ],
    features: [
      '100% Ring-spun soft cotton',
      'Intricate linework featuring crescent moon, sacred geometry, and feline guardian',
      'Taped neck and shoulders for durability'
    ],
    description: 'Year-round gothic cult favorite with strong autumn and Halloween spikes. High re-order rate and glowing customer reviews.',
    buyBoxSeller: 'Merch on Demand by Amazon',
    isBestSeller: true,
    isAmazonChoice: true,
    bsrHistory: generateBsrHistory(3410, 19.99, 'dropping'),
  },
  {
    asin: 'B09DIESEL99',
    title: 'Diesel Mechanic Torque Wrench Patent Blueprint Graphic Sweatshirt',
    brand: 'Wrench Life Apparel',
    brandUrl: 'https://www.amazon.com/stores/WrenchLife',
    price: 36.99,
    originalPrice: null,
    currency: 'USD',
    starRating: 4.8,
    numRatings: 19,
    productPhoto: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
    productPhotos: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
    ],
    productUrl: 'https://www.amazon.com/dp/B09DIESEL99',
    productType: 'Sweatshirt',
    salesVolumeText: '50+ bought in past month',
    currentBsr: 294000,
    bsrCategory: 'Clothing, Shoes & Jewelry',
    bsrSubcategories: ['#3,100 in Automotive Novelty'],
    bsrVelocity7d: -1.5,
    bsrChangeAmount: 3200,
    estDailySales: 3,
    estMonthlyRevenue: 3329,
    stabilityScore: 92,
    competitionLevel: 'Low',
    trademarkStatus: 'Clean',
    backendSearchTerms: [
      'heavy equipment semi truck repair patent',
      'grease monkey diesel technician blueprint'
    ],
    extractedKeywords: [
      { keyword: 'diesel mechanic sweatshirt', searchVolume: 4100, relevance: 98, competition: 'Low' },
      { keyword: 'patent blueprint wrench shirt', searchVolume: 1800, relevance: 94, competition: 'Low' },
      { keyword: 'semi truck mechanic gifts', searchVolume: 5300, relevance: 89, competition: 'Low' },
    ],
    features: [
      'Authentic historical patent diagram reproduction',
      'Air jet yarn for a softer feel and reduced pilling',
      'Double-needle stitching at shoulder, armhole, neck, waistband and cuffs'
    ],
    description: 'Under-the-radar high-margin niche item with almost no competition on Amazon Merch. Sub-20 reviews makes it prime for replication or variation.',
    buyBoxSeller: 'Merch on Demand by Amazon',
    bsrHistory: generateBsrHistory(294000, 36.99, 'stable'),
  },
  {
    asin: 'B08DENTAL77',
    title: 'Dental Hygienist Tooth Fairy In Training Scrub Funny Dentist T-Shirt',
    brand: 'Dental Squad Studio',
    brandUrl: 'https://www.amazon.com/stores/DentalSquad',
    price: 19.99,
    originalPrice: null,
    currency: 'USD',
    starRating: 4.7,
    numRatings: 84,
    productPhoto: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
    productPhotos: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
    ],
    productUrl: 'https://www.amazon.com/dp/B08DENTAL77',
    productType: 'Premium T-Shirt',
    salesVolumeText: '180+ bought in past month',
    currentBsr: 61200,
    bsrCategory: 'Clothing, Shoes & Jewelry',
    bsrSubcategories: ['#490 in Medical Novelty Shirts'],
    bsrVelocity7d: -24.0,
    bsrChangeAmount: 18000,
    estDailySales: 12,
    estMonthlyRevenue: 7196,
    stabilityScore: 88,
    competitionLevel: 'Medium',
    trademarkStatus: 'Clean',
    backendSearchTerms: [
      'rdh dental assistant hygiene school graduation',
      'orthodontist clinic staff matching team shirt',
      'molar floss cute pastel dentist gift'
    ],
    extractedKeywords: [
      { keyword: 'dental hygienist shirt cute', searchVolume: 12400, relevance: 98, competition: 'Medium' },
      { keyword: 'tooth fairy in training', searchVolume: 3900, relevance: 96, competition: 'Low' },
      { keyword: 'dental hygiene student gift', searchVolume: 8700, relevance: 92, competition: 'Low' },
    ],
    features: [
      'Ultra soft ring-spun cotton',
      'Pastel color typography with tooth fairy wings icon',
      'Tear-away label for maximum comfort under scrubs'
    ],
    description: 'A perennial favorite among dental hygiene students, graduation cohorts, and dental office staff for Friday casual days.',
    buyBoxSeller: 'Merch on Demand by Amazon',
    bsrHistory: generateBsrHistory(61200, 19.99, 'dropping'),
  },
  // The exact Apple iPhone 11 provided in the prompt
  {
    asin: 'B07ZPKBL9V',
    title: 'Apple iPhone 11, 64GB, PRODUCT RED - Unlocked (Renewed)',
    brand: 'Apple',
    brandUrl: 'https://www.amazon.com/Amazon-Renewed/b?node=12653393011',
    price: 175.00,
    originalPrice: 199.00,
    currency: 'USD',
    starRating: 4.2,
    numRatings: 60065,
    productPhoto: 'https://m.media-amazon.com/images/I/514k7uOBMwL._AC_SL1000_.jpg',
    productPhotos: [
      'https://m.media-amazon.com/images/I/514k7uOBMwL._AC_SL1000_.jpg',
      'https://m.media-amazon.com/images/I/71fBbZoMdGL._AC_SL1500_.jpg',
      'https://m.media-amazon.com/images/I/61PdhJpC4NL._AC_SL1500_.jpg',
      'https://m.media-amazon.com/images/I/61Ed2L5egWL._AC_SL1500_.jpg',
    ],
    productUrl: 'https://www.amazon.com/dp/B07ZPKBL9V',
    productType: 'Phone Case',
    salesVolumeText: '300+ bought in past month',
    currentBsr: 24,
    bsrCategory: 'Amazon Renewed',
    bsrSubcategories: ['#16 in Renewed Smartphones', '#20 in Cell Phones'],
    bsrVelocity7d: -12.5,
    bsrChangeAmount: 14,
    estDailySales: 180,
    estMonthlyRevenue: 945000,
    stabilityScore: 99,
    competitionLevel: 'High',
    trademarkStatus: 'Potential Risk', // Registered trademark
    backendSearchTerms: [
      'unlocked refurbished cell phone smartphone gsm',
      'apple dual camera a13 bionic fast charging',
      'liquid retina hd display product red'
    ],
    extractedKeywords: [
      { keyword: 'iphone 11 unlocked renewed', searchVolume: 145000, relevance: 99, competition: 'High' },
      { keyword: 'refurbished apple iphone 64gb', searchVolume: 62000, relevance: 95, competition: 'High' },
      { keyword: 'unlocked gsm smartphones', searchVolume: 48000, relevance: 88, competition: 'High' },
      { keyword: 'cheap backup phone unlocked', searchVolume: 24000, relevance: 84, competition: 'Medium' },
    ],
    features: [
      'Tested for battery health and guaranteed to have a minimum battery capacity of 80%',
      'Successfully passed a full diagnostic test which ensures like-new functionality',
      'Unlocked and compatible with any carrier of choice on GSM and CDMA networks',
      '6.1-inch Liquid Retina HD display with A13 Bionic chip'
    ],
    description: 'The iPhone 11 features a 6.1-inch LCD display that Apple calls a Liquid Retina HD Display. It features a 1792 x 828 resolution at 326ppi, dual cameras with Night mode, and all-day battery life.',
    variations: [
      { asin: 'B07ZPKBL9V', size: '64GB', color: '(PRODUCT) RED', price: '$175.00', isAvailable: true },
      { asin: 'B07ZPKG5TG', size: '128GB', color: '(PRODUCT) RED', price: '$198.00', isAvailable: true },
      { asin: 'B07ZPKN6YR', size: '64GB', color: 'Black', price: '$174.90', isAvailable: true },
      { asin: 'B07ZPJW2XH', size: '64GB', color: 'White', price: '$175.00', isAvailable: true },
    ],
    buyBoxSeller: 'WirelessSource (A3J9LL0SKEEIO0)',
    isBestSeller: true,
    isAmazonChoice: true,
    bsrHistory: generateBsrHistory(24, 175.00, 'stable'),
  },
  {
    asin: 'B07PLANTS55',
    title: 'Proud Plant Mom Monstera Deliciosa Botanical Gardening Vintage Tee',
    brand: 'Green Thumb Botanicals',
    brandUrl: 'https://www.amazon.com/stores/GreenThumb',
    price: 19.99,
    originalPrice: null,
    currency: 'USD',
    starRating: 4.8,
    numRatings: 94,
    productPhoto: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80',
    productPhotos: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80',
    ],
    productUrl: 'https://www.amazon.com/dp/B07PLANTS55',
    productType: 'Standard T-Shirt',
    salesVolumeText: '150+ bought in past month',
    currentBsr: 54200,
    bsrCategory: 'Clothing, Shoes & Jewelry',
    bsrSubcategories: ['#380 in Gardening Novelty'],
    bsrVelocity7d: -28.4,
    bsrChangeAmount: 19000,
    estDailySales: 11,
    estMonthlyRevenue: 6596,
    stabilityScore: 90,
    competitionLevel: 'Low',
    trademarkStatus: 'Clean',
    backendSearchTerms: [
      'indoor houseplant foliage urban jungle lover',
      'crazy plant lady succulent potted flora gift'
    ],
    extractedKeywords: [
      { keyword: 'plant mom shirt', searchVolume: 18200, relevance: 98, competition: 'Medium' },
      { keyword: 'monstera deliciosa graphic tee', searchVolume: 6400, relevance: 95, competition: 'Low' },
      { keyword: 'gardening gifts for women', searchVolume: 52000, relevance: 86, competition: 'High' },
    ],
    features: [
      '100% Combed and ring-spun cotton',
      'Distressed hand-drawn Monstera leaf artwork',
      'Lightweight, modern relaxed fit'
    ],
    description: 'The ultimate staple for houseplant enthusiasts, urban jungle growers, and plant parents. Steady sales across all 4 seasons.',
    buyBoxSeller: 'Merch on Demand by Amazon',
    bsrHistory: generateBsrHistory(54200, 19.99, 'stable'),
  },
  {
    asin: 'B08SHROOM77',
    title: 'Mushroom Forager Cottagecore Mycologist Botanical Vintage Graphic T-Shirt',
    brand: 'Fungi Forest Heritage',
    brandUrl: 'https://www.amazon.com/stores/FungiForest',
    price: 21.99,
    originalPrice: null,
    currency: 'USD',
    starRating: 4.8,
    numRatings: 112,
    productPhoto: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
    productPhotos: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
    ],
    productUrl: 'https://www.amazon.com/dp/B08SHROOM77',
    productType: 'Premium T-Shirt',
    salesVolumeText: '250+ bought in past month',
    currentBsr: 33900,
    bsrCategory: 'Clothing, Shoes & Jewelry',
    bsrSubcategories: ['#180 in Botanical Apparel'],
    bsrVelocity7d: -36.2,
    bsrChangeAmount: 18500,
    estDailySales: 16,
    estMonthlyRevenue: 10555,
    stabilityScore: 89,
    competitionLevel: 'Low',
    trademarkStatus: 'Clean',
    backendSearchTerms: [
      'morel chanterelle foraging nature lover gift',
      'fairycore goblin aesthetic autumn mushroom biology'
    ],
    extractedKeywords: [
      { keyword: 'cottagecore mushroom shirt', searchVolume: 21000, relevance: 97, competition: 'Medium' },
      { keyword: 'mycology t shirt', searchVolume: 9400, relevance: 96, competition: 'Low' },
      { keyword: 'mushroom foraging gifts', searchVolume: 12800, relevance: 91, competition: 'Low' },
    ],
    features: [
      'Vintage archival naturalist illustration',
      'Double-needle sleeve and bottom hem',
      'Ultra comfortable cotton fabric'
    ],
    description: 'Cottagecore aesthetics and wild foraging enthusiast crossover. A proven evergreen winner with great organic search pull.',
    buyBoxSeller: 'Merch on Demand by Amazon',
    bsrHistory: generateBsrHistory(33900, 21.99, 'dropping'),
  }
];

// Niche research trends for the dashboard radar
export interface TrendingNiche {
  id: string;
  name: string;
  category: string;
  growthRate: string;
  avgBsr: number;
  compLevel: 'Low' | 'Medium' | 'High';
  recommendedKeyword: string;
}

export const TRENDING_NICHES: TrendingNiche[] = [
  {
    id: 'niche-1',
    name: 'Retro 80s Pickleball & Dink Jokes',
    category: 'Standard T-Shirt / PopSockets',
    growthRate: '+312% MoM',
    avgBsr: 14200,
    compLevel: 'Medium',
    recommendedKeyword: 'pickleball dink retro synthwave',
  },
  {
    id: 'niche-2',
    name: 'Blue Collar Tradesman Sarcasm (Welder/Lineman)',
    category: 'Hoodies & Sweatshirts',
    growthRate: '+184% MoM',
    avgBsr: 189000,
    compLevel: 'Low',
    recommendedKeyword: 'lineman power line skull vintage',
  },
  {
    id: 'niche-3',
    name: 'Cottagecore Mycology & Botanical Anatomy',
    category: 'Premium T-Shirt / Tote Bag',
    growthRate: '+240% MoM',
    avgBsr: 32000,
    compLevel: 'Low',
    recommendedKeyword: 'vintage mushroom taxonomy naturalist',
  },
  {
    id: 'niche-4',
    name: '40th & 50th Milestone Cassette Tape Birthdays',
    category: 'Standard T-Shirt',
    growthRate: '+420% MoM',
    avgBsr: 4500,
    compLevel: 'Medium',
    recommendedKeyword: 'vintage 1984 cassette limited edition',
  },
  {
    id: 'niche-5',
    name: 'Software Developer Localhost / Docker Humor',
    category: 'Hoodies & Mugs',
    growthRate: '+165% MoM',
    avgBsr: 18400,
    compLevel: 'Low',
    recommendedKeyword: 'it works on my machine coder',
  },
];
