export interface DealItem {
  id: string;
  title: string;
  image: string;
  dealPrice: number;
  originalPrice: number;
  discountPercent: number;
  merchant: 'Amazon.in' | 'Flipkart' | 'Myntra' | 'Ajio' | 'Croma' | 'Other';
  affiliateUrl: string;
  couponCode?: string;
  badge?: string;
  inStock: boolean;
}

export interface AffiliateTags {
  amazonTag?: string;
  flipkartTag?: string;
  generalTag?: string;
}

export interface LootPasteMeta {
  title: string;
  description: string;
  timerMinutes: number;
  createdAt: string;
  expiresAt: string;
  adminName?: string;
}

const SAMPLE_DEALS = [
  {
    title: "OnePlus Nord CE 4 Lite 5G (Super Silver, 8GB RAM, 128GB Storage)",
    image: "https://m.media-amazon.com/images/I/61Io5-gZs-L._SL1500_.jpg",
    dealPrice: 16999,
    originalPrice: 20999,
    merchant: "Amazon.in" as const,
    badge: "LIGHTNING DEAL",
  },
  {
    title: "Apple AirPods (3rd Generation) with Lightning Charging Case",
    image: "https://m.media-amazon.com/images/I/61CVih3UpIL._SL1500_.jpg",
    dealPrice: 12999,
    originalPrice: 19900,
    merchant: "Amazon.in" as const,
    badge: "85% OFF LOOT",
  },
  {
    title: "Nike Men's Revolution 7 Running Shoes",
    image: "https://m.media-amazon.com/images/I/71N-r2r77LL._UL1500_.jpg",
    dealPrice: 1899,
    originalPrice: 3695,
    merchant: "Flipkart" as const,
    badge: "HOT DEAL",
    couponCode: "FLAT300",
  },
  {
    title: "Samsung 138 cm (55 inches) 4K Ultra HD Smart LED TV",
    image: "https://m.media-amazon.com/images/I/71S8qt6mR-L._SL1500_.jpg",
    dealPrice: 34990,
    originalPrice: 52990,
    merchant: "Amazon.in" as const,
    badge: "FESTIVE PRICE",
  },
  {
    title: "Boat Airdopes 141 Bluetooth TWS Earbuds with 42H Playtime",
    image: "https://m.media-amazon.com/images/I/51H3241zL-L._SL1500_.jpg",
    dealPrice: 899,
    originalPrice: 4490,
    merchant: "Amazon.in" as const,
    badge: "LOOT DEAL",
    couponCode: "EARBUDS50",
  }
];

export function extractUrls(text: string): string[] {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const matches = text.match(urlRegex) || [];
  return Array.from(new Set(matches));
}

export function detectMerchant(url: string): 'Amazon.in' | 'Flipkart' | 'Myntra' | 'Ajio' | 'Croma' | 'Other' {
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes('amazon.') || lowerUrl.includes('amzn.to') || lowerUrl.includes('amzn.in')) {
    return 'Amazon.in';
  }
  if (lowerUrl.includes('flipkart.') || lowerUrl.includes('fkrt.it')) {
    return 'Flipkart';
  }
  if (lowerUrl.includes('myntra.')) {
    return 'Myntra';
  }
  if (lowerUrl.includes('ajio.')) {
    return 'Ajio';
  }
  if (lowerUrl.includes('croma.')) {
    return 'Croma';
  }
  return 'Other';
}

export function injectAffiliateTag(url: string, tags: AffiliateTags): string {
  try {
    const merchant = detectMerchant(url);
    const parsedUrl = new URL(url);

    if (merchant === 'Amazon.in' && tags.amazonTag) {
      parsedUrl.searchParams.set('tag', tags.amazonTag.trim());
      parsedUrl.searchParams.set('linkCode', 'osi');
    } else if (merchant === 'Flipkart' && tags.flipkartTag) {
      parsedUrl.searchParams.set('affid', tags.flipkartTag.trim());
    } else if (tags.generalTag) {
      parsedUrl.searchParams.set('subid', tags.generalTag.trim());
    }
    return parsedUrl.toString();
  } catch (e) {
    if (url.includes('amazon') && tags.amazonTag) {
      const separator = url.includes('?') ? '&' : '?';
      return `${url}${separator}tag=${encodeURIComponent(tags.amazonTag.trim())}`;
    }
    return url;
  }
}

export function parseDealText(input: string, tags: AffiliateTags): DealItem[] {
  const urls = extractUrls(input);
  if (urls.length === 0) return [];

  return urls.map((rawUrl, index) => {
    const merchant = detectMerchant(rawUrl);
    const affiliateUrl = injectAffiliateTag(rawUrl, tags);
    const sample = SAMPLE_DEALS[index % SAMPLE_DEALS.length];

    const dealPrice = sample.dealPrice;
    const originalPrice = sample.originalPrice;
    const discountPercent = Math.round(((originalPrice - dealPrice) / originalPrice) * 100);

    let title = sample.title;
    try {
      const parsed = new URL(rawUrl);
      const pathSegments = parsed.pathname.split('/').filter(Boolean);
      if (pathSegments.length > 0 && pathSegments[0].length > 3 && !pathSegments[0].includes('dp')) {
        const slugTitle = pathSegments[0].replace(/[-_]/g, ' ');
        if (slugTitle.length > 10) {
          title = slugTitle.charAt(0).toUpperCase() + slugTitle.slice(1);
        }
      }
    } catch (e) {
      // Keep sample title
    }

    return {
      id: `deal-${index + 1}-${Date.now()}`,
      title,
      image: sample.image,
      dealPrice,
      originalPrice,
      discountPercent,
      merchant,
      affiliateUrl,
      couponCode: sample.couponCode,
      badge: sample.badge,
      inStock: true
    };
  });
}

export function formatINR(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price);
}
