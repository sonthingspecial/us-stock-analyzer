import { NextResponse } from 'next/server';
import { FALLBACK_MARKET } from '@/lib/constants/fallbackData';

async function fetchTicker(ticker: string) {
  const encoded = encodeURIComponent(ticker);
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encoded}?interval=1d&range=2d`;
  const res = await fetch(url, {
    next: { revalidate: 300 },
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'application/json',
    },
  });
  if (!res.ok) throw new Error(`${ticker} HTTP ${res.status}`);
  const data = await res.json();
  const meta = data.chart.result[0].meta;
  const price = Math.round(meta.regularMarketPrice * 100) / 100;
  const prevClose = meta.chartPreviousClose ?? meta.previousClose;
  const changePercent = prevClose && prevClose > 0
    ? Math.round(((price - prevClose) / prevClose) * 10000) / 100
    : (meta.regularMarketChangePercent ?? 0);
  return { price, changePercent };
}

export async function GET() {
  try {
    const [vixResult, spyResult, qqqResult] = await Promise.allSettled([
      fetchTicker('^VIX'),
      fetchTicker('SPY'),
      fetchTicker('QQQ'),
    ]);

    const vix =
      vixResult.status === 'fulfilled' ? vixResult.value.price : 20;
    const spy =
      spyResult.status === 'fulfilled'
        ? spyResult.value
        : { price: 0, changePercent: 0 };
    const qqq =
      qqqResult.status === 'fulfilled'
        ? qqqResult.value
        : { price: 0, changePercent: 0 };

    return NextResponse.json({
      vix,
      spy,
      qqq,
      timestamp: new Date().toISOString(),
      source: 'live',
    });
  } catch (err) {
    console.error('[api/market]', err);
    return NextResponse.json(FALLBACK_MARKET);
  }
}
