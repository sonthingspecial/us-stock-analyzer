import { NextResponse } from 'next/server';
import { FALLBACK_FEAR_GREED } from '@/lib/constants/fallbackData';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await fetch(
      'https://production.dataviz.cnn.io/index/fearandgreed/graphdata',
      {
        cache: 'no-store',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json, text/plain, */*',
          'Referer': 'https://edition.cnn.com/markets/fear-and-greed',
          'Origin': 'https://edition.cnn.com',
        },
      }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const raw = await res.json();
    const fg = raw.fear_and_greed;
    return NextResponse.json(
      { score: Math.round(fg.score), rating: fg.rating, timestamp: new Date().toISOString(), source: 'live' },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (err) {
    console.error('[api/fear-greed]', err);
    return NextResponse.json(FALLBACK_FEAR_GREED);
  }
}
