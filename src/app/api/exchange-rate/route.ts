import { NextResponse } from 'next/server';
import { FALLBACK_EXCHANGE_RATE } from '@/lib/constants/fallbackData';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD', {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return NextResponse.json(
      { usdKrw: Math.round(data.rates.KRW * 10) / 10, timestamp: new Date().toISOString(), source: 'live' },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (err) {
    console.error('[api/exchange-rate]', err);
    return NextResponse.json(FALLBACK_EXCHANGE_RATE);
  }
}
