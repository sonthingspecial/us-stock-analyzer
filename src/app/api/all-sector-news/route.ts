import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { SECTOR_IDS } from '@/lib/constants/sectors';
import { NEWS_KEYWORDS } from '@/lib/constants/newsKeywords';
import { getSentiment, newsScore } from '@/lib/scoring/newsScore';
import type { SectorId, NewsItem, SectorNewsResponse } from '@/lib/types';

const parser = new Parser({ timeout: 8000 });

async function fetchSectorNews(id: SectorId): Promise<SectorNewsResponse> {
  try {
    const keywords = NEWS_KEYWORDS[id];
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(keywords)}&hl=en-US&gl=US&ceid=US:en`;
    const feed = await parser.parseURL(rssUrl);

    const items: NewsItem[] = (feed.items ?? []).slice(0, 10).map((item) => ({
      title: item.title ?? '',
      pubDate: item.pubDate ?? new Date().toISOString(),
      link: item.link ?? '',
      sentiment: getSentiment(item.title ?? ''),
    }));

    return { sector: id, items, sentimentScore: newsScore(items), source: 'live' };
  } catch {
    return { sector: id, items: [], sentimentScore: 10, source: 'fallback' };
  }
}

export async function GET() {
  const results = await Promise.all(SECTOR_IDS.map(fetchSectorNews));
  const newsMap: Record<string, SectorNewsResponse> = {};
  results.forEach((r) => {
    newsMap[r.sector] = r;
  });

  return NextResponse.json(newsMap, {
    headers: {
      'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
    },
  });
}
