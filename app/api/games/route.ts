export const dynamic = 'force-dynamic';

const DEVELOPER_ID = '6528570119303841491';

type StoreGame = {
  id: string;
  title: string;
  rating?: string;
  reviews?: string;
  downloads?: string;
  description: string;
  tag: string;
  accent: string;
  appUrl: string;
  iconSrc: string;
};

const knownFallbacks: Record<string, Partial<StoreGame>> = {
  'com.lgx.bus.driving.bus.simulator.eurobus.game': {
    title: 'City Bus Games Coach Bus 3D',
    rating: '3.9',
    reviews: '2.33K reviews',
    downloads: '1M+',
    iconSrc: '/games/city-bus.webp',
    description: 'Coach and city bus driving missions with smooth controls, routes, and passenger transport gameplay.',
    tag: 'Bus simulator',
    accent: 'coach',
  },
  'com.lgx.police.crime.chase.simulator': {
    title: 'Police Crime Chase Simulator',
    iconSrc: '/games/police-crime-chase.webp',
    description: 'High-pressure police pursuit gameplay with crime-chase missions and city action driving.',
    tag: 'Crime chase',
    accent: 'chase',
  },
  'com.luckygamingxone.brazilcargotrucksimulator': {
    title: 'Brazil Cargo Truck Simulator',
    iconSrc: '/games/brazil-cargo.webp',
    description: 'Cargo delivery and truck racing modes with timers, coins, unlockable trucks, and route goals.',
    tag: 'Cargo truck',
    accent: 'cargo',
  },
  'com.lgx.offroad.van.driving.van.game.simulator': {
    title: 'City Van Game Simulator 3D',
    rating: '3.3',
    reviews: '1.31K reviews',
    downloads: '1M+',
    iconSrc: '/games/city-van.webp',
    description: 'Modern van and minibus driving with city pickups, offroad routes, and transport missions.',
    tag: 'Van driving',
    accent: 'van',
  },
  'com.lgx.pizzadelivery.cyclerider3d': {
    title: 'Pizza Delivery: Cycle Rider 3D',
    downloads: '50K+',
    iconSrc: '/games/pizza-delivery.webp',
    description: 'Ride through a 3D city, pick up pizzas, and deliver quickly through traffic-style missions.',
    tag: 'Delivery rider',
    accent: 'delivery',
  },
  'com.lgx.monster.truck.challenge.monster.car': {
    title: 'Monster Truck Simulator Game',
    rating: '3.8',
    downloads: '100K+',
    iconSrc: '/games/monster-truck.webp',
    description: 'Monster truck racing and stunt missions with heavy handling, ramps, and rough terrain.',
    tag: 'Monster truck',
    accent: 'monster',
  },
};

const initialPackageIds = [
  'com.lgx.bus.driving.bus.simulator.eurobus.game',
  'com.lgx.police.crime.chase.simulator',
  'com.luckygamingxone.brazilcargotrucksimulator',
  'com.lgx.offroad.van.driving.van.game.simulator',
  'com.lgx.pizzadelivery.cyclerider3d',
  'com.lgx.monster.truck.challenge.monster.car',
];

function cleanHtmlText(value?: string | null): string {
  if (!value) return '';
  return value
    .replace(/\\u003c[^>]+>/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .trim();
}

function inferTagAndAccent(title: string) {
  const lower = title.toLowerCase();
  let tag = 'Android game';
  let accent = 'coach';

  if (lower.includes('bus')) {
    tag = 'Bus simulator';
    accent = 'coach';
  } else if (lower.includes('van')) {
    tag = 'Van driving';
    accent = 'van';
  } else if (lower.includes('monster')) {
    tag = 'Monster truck';
    accent = 'monster';
  } else if (lower.includes('pizza') || lower.includes('rider') || lower.includes('cycle')) {
    tag = 'Delivery rider';
    accent = 'delivery';
  } else if (lower.includes('cargo') || lower.includes('truck')) {
    tag = 'Cargo truck';
    accent = 'cargo';
  } else if (lower.includes('police') || lower.includes('chase')) {
    tag = 'Crime chase';
    accent = 'chase';
  } else if (lower.includes('racing') || lower.includes('car')) {
    tag = 'Car racing';
    accent = 'coach';
  }

  return { tag, accent };
}

function parseAppPage(html: string, appId: string): StoreGame {
  const fallback = knownFallbacks[appId] || {};

  // 1. Live Title
  const ogTitle = html.match(/<meta property="og:title" content="([^"]+)"/i)?.[1];
  const pageTitle =
    html.match(/<title id="main-title">(.*?)<\/title>/i)?.[1] ||
    html.match(/<title>(.*?) - Apps on Google Play<\/title>/i)?.[1] ||
    html.match(/<title>(.*?)<\/title>/i)?.[1];
  const rawTitle = ogTitle || pageTitle;
  const title = rawTitle
    ? cleanHtmlText(rawTitle.replace(/ - Apps on Google Play/i, '').replace(/ - Apps on.*/i, ''))
    : fallback.title || appId;

  // 2. Live Icon
  const ogImage = html.match(/<meta property="og:image" content="([^"]+)"/i)?.[1];
  const iconImg =
    html.match(/<img [^>]*alt="Icon image"[^>]*src="([^"]+)"/i)?.[1] ||
    html.match(/<img [^>]*src="([^"]+)"[^>]*alt="Icon image"/i)?.[1] ||
    ogImage;
  const iconSrc =
    iconImg && iconImg.includes('play-lh.googleusercontent.com')
      ? iconImg.replace(/=[^"'\s]+$/, '=s256')
      : fallback.iconSrc || '/games/city-bus.webp';

  // Header section isolate
  const aboutIndex = html.indexOf('About this game');
  const headerHtml =
    aboutIndex > 0 ? html.substring(0, aboutIndex + 3000) : html.substring(0, 100000);

  // 3. Live Rating
  const ratingMatch =
    headerHtml.match(/<div class="TT9eCd">([0-9.]+)<\/div>/i) ||
    headerHtml.match(/aria-label="Rated ([0-9.]+) stars out of five/i);
  const rating = ratingMatch ? ratingMatch[1] : fallback.rating;

  // 4. Live Downloads
  const downloadsMatch =
    headerHtml.match(/<div class="ClM7O">([0-9.]+[KMB]\+?)<\/div>[\s\S]{0,100}Downloads/i) ||
    headerHtml.match(/([0-9.]+[KMB]\+)\s*Downloads/i);
  const downloads = downloadsMatch ? downloadsMatch[1] : fallback.downloads;

  // 5. Live Reviews
  const reviewsMatch =
    headerHtml.match(/<div class="EHIdMe">([0-9.]+[KMB]?\s*reviews?)<\/div>/i) ||
    headerHtml.match(/([0-9.]+[KMB]?\s*reviews)/i);
  const reviews = reviewsMatch ? reviewsMatch[1] : fallback.reviews;

  // 6. Live Description
  const ogDesc = html.match(/<meta property="og:description" content="([^"]+)"/i)?.[1];
  const description = ogDesc
    ? cleanHtmlText(ogDesc)
    : fallback.description || 'Android game by Lucky Gaming Xone.';

  const inferred = inferTagAndAccent(title);

  return {
    id: appId,
    title,
    rating,
    downloads,
    reviews,
    iconSrc,
    description,
    tag: fallback.tag || inferred.tag,
    accent: fallback.accent || inferred.accent,
    appUrl: `https://play.google.com/store/apps/details?id=${appId}`,
  };
}

async function fetchAppDetails(appId: string): Promise<StoreGame> {
  const fallback = knownFallbacks[appId] || {};
  const url = `https://play.google.com/store/apps/details?id=${appId}&hl=en&gl=PK`;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      },
    });
    clearTimeout(timeout);

    if (!response.ok) {
      const inferred = inferTagAndAccent(fallback.title || appId);
      return {
        id: appId,
        title: fallback.title || appId,
        rating: fallback.rating,
        reviews: fallback.reviews,
        downloads: fallback.downloads,
        description: fallback.description || 'Android game by Lucky Gaming Xone.',
        tag: fallback.tag || inferred.tag,
        accent: fallback.accent || inferred.accent,
        appUrl: `https://play.google.com/store/apps/details?id=${appId}`,
        iconSrc: fallback.iconSrc || '/games/city-bus.webp',
      };
    }

    const html = await response.text();
    return parseAppPage(html, appId);
  } catch {
    const inferred = inferTagAndAccent(fallback.title || appId);
    return {
      id: appId,
      title: fallback.title || appId,
      rating: fallback.rating,
      reviews: fallback.reviews,
      downloads: fallback.downloads,
      description: fallback.description || 'Android game by Lucky Gaming Xone.',
      tag: fallback.tag || inferred.tag,
      accent: fallback.accent || inferred.accent,
      appUrl: `https://play.google.com/store/apps/details?id=${appId}`,
      iconSrc: fallback.iconSrc || '/games/city-bus.webp',
    };
  }
}

async function discoverDeveloperAppIds(): Promise<string[]> {
  try {
    const devUrl = `https://play.google.com/store/apps/dev?id=${DEVELOPER_ID}&hl=en&gl=PK`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(devUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });
    clearTimeout(timeout);

    if (!res.ok) return initialPackageIds;

    const html = await res.text();
    const packageMatches = [...html.matchAll(/\/store\/apps\/details\?id=([a-zA-Z0-9._]+)/g)].map(
      (m) => m[1],
    );
    const discovered = Array.from(new Set(packageMatches));

    // Combine discovered IDs with initial ones to ensure nothing is missed
    const allIds = Array.from(new Set([...discovered, ...initialPackageIds]));
    return allIds.length ? allIds : initialPackageIds;
  } catch {
    return initialPackageIds;
  }
}

export async function GET() {
  const packageIds = await discoverDeveloperAppIds();
  const settled = await Promise.allSettled(packageIds.map(fetchAppDetails));
  const liveGames = settled
    .filter(
      (result): result is PromiseFulfilledResult<StoreGame> => result.status === 'fulfilled',
    )
    .map((result) => result.value);

  return Response.json(
    {
      source: 'Google Play dynamic developer discovery',
      developerId: DEVELOPER_ID,
      discoveredCount: liveGames.length,
      fetchedAt: new Date().toISOString(),
      games: liveGames,
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    },
  );
}



