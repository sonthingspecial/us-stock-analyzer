import { NextResponse } from 'next/server';
import { FALLBACK_EXCHANGE_RATE } from '@/lib/constants/fallbackData';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Yahoo Finance provides real-time forex (updates every few seconds during market hours)
    const res = await fetch(
      'https://query1.finance.yahoo.com/v8/finance/chart/USDKRW=X?interval=1m&range=1d',
      {
        cache: 'no-store',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
        },
      }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const meta = data.chart.result[0].meta;
    const usdKrw = Math.round(meta.regularMarketPrice * 10) / 10;
    return NextResponse.json(
      { usdKrw, timestamp: new Date().toISOString(), source: 'live' },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (err) {
    console.error('[api/exchange-rate]', err);
    return NextResponse.json(FALLBACK_EXCHANGE_RATE);
  }
}
