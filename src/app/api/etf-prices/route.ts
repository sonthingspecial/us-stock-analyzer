import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

async function fetchETF(ticker: string) {
  const encoded = encodeURIComponent(ticker);
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encoded}?interval=1d&range=2d`;
  const res = await fetch(url, {
    cache: 'no-store',
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
  const changePercent =
    prevClose && prevClose > 0
      ? Math.round(((price - prevClose) / prevClose) * 10000) / 100
      : (meta.regularMarketChangePercent ?? 0);
  return { ticker, price, changePercent };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get('tickers') ?? '';
  const tickers = raw.split(',').map(t => t.trim()).filter(Boolean).slice(0, 12);

  if (tickers.length === 0) {
    return NextResponse.json([], { headers: { 'Cache-Control': 'no-store' } });
  }

  const results = await Promise.allSettled(tickers.map(fetchETF));
  const data = results.map((r, i) =>
    r.status === 'fulfilled'
      ? r.value
      : { ticker: tickers[i], price: 0, changePercent: 0 }
  );

  return NextResponse.json(data, { headers: { 'Cache-Control': 'no-store' } });
}
