// Comprehensive USPTO Class 025 (Apparel) Trademark & Copyright Knowledgebase
// Designed specifically for Merch by Amazon & Print-On-Demand account safety

export interface TrademarkMatch {
  phrase: string;
  category: 'Registered Trademark' | 'Major Brand' | 'Famous Character / IP' | 'Protected Slogan';
  classNum: string; // usually '025' (Clothing)
  riskLevel: 'high' | 'medium';
  description: string;
}

export interface NgramAnalysis {
  phrase: string;
  ngramType: '1-gram' | '2-gram' | '3-gram';
  isFlagged: boolean;
  match?: TrademarkMatch;
  usptoSearchUrl: string;
  tmHuntSearchUrl: string;
  googleCopyrightUrl: string;
}

export interface TrademarkCheckResult {
  overallStatus: 'Safe' | 'Check Required' | 'Trademark Alert';
  riskScore: number; // 0 (100% clean) to 100 (high risk)
  matchedTrademarks: TrademarkMatch[];
  ngrams: NgramAnalysis[];
  cleanTitle: string;
  sanitizedKeywords: string[];
  totalCheckedPhrases: number;
}

// Known Class 025 high-risk registered words, slogans, character IPs, and brand names
// that trigger automated Amazon Merch listing rejections or terminations
const HIGH_RISK_CLASS_025_TERMS: Record<string, { category: TrademarkMatch['category']; description: string; riskLevel: 'high' | 'medium' }> = {
  // Major Brands & Tech
  'apple': { category: 'Major Brand', description: 'Registered trademark of Apple Inc. (Class 009, 025). Strict Merch ban.', riskLevel: 'high' },
  'iphone': { category: 'Major Brand', description: 'Registered trademark of Apple Inc. Cannot be used on apparel/accessories without license.', riskLevel: 'high' },
  'nike': { category: 'Major Brand', description: 'Registered trademark of Nike Inc. in Class 025.', riskLevel: 'high' },
  'adidas': { category: 'Major Brand', description: 'Registered trademark of Adidas AG in Class 025.', riskLevel: 'high' },
  'under armour': { category: 'Major Brand', description: 'Registered trademark of Under Armour Inc. in Class 025.', riskLevel: 'high' },
  'puma': { category: 'Major Brand', description: 'Registered trademark of Puma SE in Class 025.', riskLevel: 'high' },
  'disney': { category: 'Major Brand', description: 'Registered trademark of Disney Enterprises in Class 025.', riskLevel: 'high' },
  'marvel': { category: 'Major Brand', description: 'Registered trademark of Marvel Characters Inc. in Class 025.', riskLevel: 'high' },
  'lego': { category: 'Major Brand', description: 'Registered trademark of Lego Juris A/S in Class 025.', riskLevel: 'high' },
  'coca cola': { category: 'Major Brand', description: 'Registered trademark of The Coca-Cola Company in Class 025.', riskLevel: 'high' },
  'pepsi': { category: 'Major Brand', description: 'Registered trademark of PepsiCo in Class 025.', riskLevel: 'high' },
  'starbucks': { category: 'Major Brand', description: 'Registered trademark of Starbucks Corp. in Class 025.', riskLevel: 'high' },
  'mcdonalds': { category: 'Major Brand', description: 'Registered trademark of McDonald\'s Corp. in Class 025.', riskLevel: 'high' },

  // Famous Characters & Entertainment IPs
  'star wars': { category: 'Famous Character / IP', description: 'Protected trademark of Lucasfilm Ltd. in Class 025.', riskLevel: 'high' },
  'harry potter': { category: 'Famous Character / IP', description: 'Protected trademark of Warner Bros. Entertainment in Class 025.', riskLevel: 'high' },
  'pokemon': { category: 'Famous Character / IP', description: 'Protected trademark of Nintendo / Pokemon Company in Class 025.', riskLevel: 'high' },
  'pikachu': { category: 'Famous Character / IP', description: 'Registered character trademark of Nintendo in Class 025.', riskLevel: 'high' },
  'mickey mouse': { category: 'Famous Character / IP', description: 'Registered character mark of Disney in Class 025.', riskLevel: 'high' },
  'super mario': { category: 'Famous Character / IP', description: 'Registered trademark of Nintendo Co. in Class 025.', riskLevel: 'high' },
  'baby yoda': { category: 'Famous Character / IP', description: 'Protected character trademark of Lucasfilm / Disney.', riskLevel: 'high' },
  'barbie': { category: 'Famous Character / IP', description: 'Registered trademark of Mattel Inc. in Class 025.', riskLevel: 'high' },
  'batman': { category: 'Famous Character / IP', description: 'Registered character trademark of DC Comics in Class 025.', riskLevel: 'high' },
  'spiderman': { category: 'Famous Character / IP', description: 'Registered character trademark of Marvel in Class 025.', riskLevel: 'high' },
  'spider man': { category: 'Famous Character / IP', description: 'Registered character trademark of Marvel in Class 025.', riskLevel: 'high' },
  'stranger things': { category: 'Famous Character / IP', description: 'Registered trademark of Netflix Inc. in Class 025.', riskLevel: 'high' },
  'fortnite': { category: 'Famous Character / IP', description: 'Registered trademark of Epic Games Inc. in Class 025.', riskLevel: 'high' },
  'swiftie': { category: 'Famous Character / IP', description: 'Registered trademark of TAS Rights Management (Taylor Swift).', riskLevel: 'high' },

  // Sports & Organizations
  'super bowl': { category: 'Registered Trademark', description: 'Strictly enforced trademark of the NFL in Class 025.', riskLevel: 'high' },
  'nfl': { category: 'Registered Trademark', description: 'National Football League registered trademark in Class 025.', riskLevel: 'high' },
  'nba': { category: 'Registered Trademark', description: 'National Basketball Association registered trademark in Class 025.', riskLevel: 'high' },
  'olympics': { category: 'Registered Trademark', description: 'Strictly protected under special Olympic legislation and Class 025.', riskLevel: 'high' },
  'world cup': { category: 'Registered Trademark', description: 'FIFA registered trademark in Class 025.', riskLevel: 'high' },

  // Infamous Merch Slogans Registered in Class 025
  'just do it': { category: 'Protected Slogan', description: 'Famous registered slogan of Nike Inc. in Class 025.', riskLevel: 'high' },
  'boy mom': { category: 'Registered Trademark', description: 'Infamous trademark registered in Class 025 for apparel (frequent takedowns).', riskLevel: 'high' },
  'girl mom': { category: 'Registered Trademark', description: 'Registered trademark in Class 025 for clothing/shirts.', riskLevel: 'high' },
  'mama bear': { category: 'Registered Trademark', description: 'Registered in Class 025 (USPTO Reg #5684942) for t-shirts.', riskLevel: 'high' },
  'livin the dream': { category: 'Protected Slogan', description: 'Registered trademark in Class 025 for apparel.', riskLevel: 'high' },
  'hakuna matata': { category: 'Protected Slogan', description: 'Registered trademark by Disney Enterprises in Class 025.', riskLevel: 'high' },
  'be kind': { category: 'Protected Slogan', description: 'Multiple active trademark registrations in Class 025.', riskLevel: 'medium' },
  'game day': { category: 'Protected Slogan', description: 'Registered trademark variations in Class 025.', riskLevel: 'medium' },
  'dad life': { category: 'Protected Slogan', description: 'Registered trademark in Class 025 for shirts and hats.', riskLevel: 'high' },
  'mom life': { category: 'Protected Slogan', description: 'Multiple trademark filings and disputes in Class 025.', riskLevel: 'medium' },
  'resting beach face': { category: 'Protected Slogan', description: 'Registered trademark in Class 025 for shirts.', riskLevel: 'high' },
  'eat sleep repeat': { category: 'Protected Slogan', description: 'Frequently targeted phrase on Amazon Merch.', riskLevel: 'medium' },
};

// Generate 1-word, 2-word, and 3-word n-grams
export function generateNgrams(text: string): { phrase: string; ngramType: '1-gram' | '2-gram' | '3-gram' }[] {
  if (!text) return [];

  // Normalize text: remove emojis, punctuation, lowercase
  const cleaned = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const words = cleaned.split(' ').filter(w => w.length > 1);
  const ngrams: { phrase: string; ngramType: '1-gram' | '2-gram' | '3-gram' }[] = [];
  const seen = new Set<string>();

  // 1-grams
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    if (!seen.has(w)) {
      seen.add(w);
      ngrams.push({ phrase: w, ngramType: '1-gram' });
    }
  }

  // 2-grams
  for (let i = 0; i < words.length - 1; i++) {
    const phrase = `${words[i]} ${words[i + 1]}`;
    if (!seen.has(phrase)) {
      seen.add(phrase);
      ngrams.push({ phrase, ngramType: '2-gram' });
    }
  }

  // 3-grams
  for (let i = 0; i < words.length - 2; i++) {
    const phrase = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
    if (!seen.has(phrase)) {
      seen.add(phrase);
      ngrams.push({ phrase, ngramType: '3-gram' });
    }
  }

  return ngrams;
}

// Generate direct search URLs
export function getUsptoSearchUrl(phrase: string): string {
  // Pre-fill USPTO search with phrase in combined search with Class 025 (Apparel)
  const q = `"${phrase}"[COMB] AND 025[IC]`;
  return `https://tmsearch.uspto.gov/search/search-results?query=${encodeURIComponent(q)}`;
}

export function getTmHuntSearchUrl(phrase: string): string {
  return `https://tmhunt.com/?q=${encodeURIComponent(phrase)}`;
}

export function getGoogleCopyrightUrl(phrase: string): string {
  return `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(phrase + ' t-shirt merch')}`;
}

export function getJustiaSearchUrl(phrase: string): string {
  return `https://trademarks.justia.com/search?q=${encodeURIComponent(phrase)}`;
}

/**
 * Main automated Title & Keyword Trademark Scanner for Merch by Amazon (Class 025)
 */
export function checkTrademark(text: string): TrademarkCheckResult {
  if (!text || text.trim().length === 0) {
    return {
      overallStatus: 'Safe',
      riskScore: 0,
      matchedTrademarks: [],
      ngrams: [],
      cleanTitle: '',
      sanitizedKeywords: [],
      totalCheckedPhrases: 0,
    };
  }

  const rawNgrams = generateNgrams(text);
  const matchedTrademarks: TrademarkMatch[] = [];
  const matchedPhrasesSet = new Set<string>();

  const analyzedNgrams: NgramAnalysis[] = rawNgrams.map(({ phrase, ngramType }) => {
    const lowerPhrase = phrase.toLowerCase();
    const matchData = HIGH_RISK_CLASS_025_TERMS[lowerPhrase];

    if (matchData) {
      const matchObj: TrademarkMatch = {
        phrase,
        category: matchData.category,
        classNum: '025',
        riskLevel: matchData.riskLevel,
        description: matchData.description,
      };
      if (!matchedPhrasesSet.has(lowerPhrase)) {
        matchedPhrasesSet.add(lowerPhrase);
        matchedTrademarks.push(matchObj);
      }
      return {
        phrase,
        ngramType,
        isFlagged: true,
        match: matchObj,
        usptoSearchUrl: getUsptoSearchUrl(phrase),
        tmHuntSearchUrl: getTmHuntSearchUrl(phrase),
        googleCopyrightUrl: getGoogleCopyrightUrl(phrase),
      };
    }

    return {
      phrase,
      ngramType,
      isFlagged: false,
      usptoSearchUrl: getUsptoSearchUrl(phrase),
      tmHuntSearchUrl: getTmHuntSearchUrl(phrase),
      googleCopyrightUrl: getGoogleCopyrightUrl(phrase),
    };
  });

  // Calculate Risk Score & Safety Status
  let riskScore = 0;
  let overallStatus: TrademarkCheckResult['overallStatus'] = 'Safe';

  if (matchedTrademarks.some(m => m.riskLevel === 'high')) {
    riskScore = Math.min(100, 75 + matchedTrademarks.length * 10);
    overallStatus = 'Trademark Alert';
  } else if (matchedTrademarks.length > 0) {
    riskScore = Math.min(65, 40 + matchedTrademarks.length * 10);
    overallStatus = 'Check Required';
  } else {
    // If no direct database hit, check word count and potential common risk markers
    const hasSuspectWords = /(official|authentic|licensed|disney|nfl|marvel|super|movie|singer|band)/i.test(text);
    if (hasSuspectWords) {
      riskScore = 25;
      overallStatus = 'Check Required';
    } else {
      riskScore = 5;
      overallStatus = 'Safe';
    }
  }

  // Create clean title with risky phrases stripped out
  let cleanTitle = text;
  matchedTrademarks.forEach((m) => {
    const regex = new RegExp(`\\b${m.phrase}\\b`, 'gi');
    cleanTitle = cleanTitle.replace(regex, '').replace(/\s+/g, ' ').trim();
  });

  // Sanitized keywords: clean 1-grams and 2-grams safe for Merch tags
  const sanitizedKeywords = analyzedNgrams
    .filter(n => !n.isFlagged && n.phrase.length > 3)
    .slice(0, 10)
    .map(n => n.phrase);

  return {
    overallStatus,
    riskScore,
    matchedTrademarks,
    ngrams: analyzedNgrams,
    cleanTitle: cleanTitle || text,
    sanitizedKeywords,
    totalCheckedPhrases: analyzedNgrams.length,
  };
}
