import { NextResponse } from 'next/server';
import { FALLBACK_INTEREST_RATE } from '@/lib/constants/fallbackData';

export const dynamic = 'force-dynamic';

export async function GET() {
  const apiKey = process.env.FRED_API_KEY;
  if (!apiKey) {
    return NextResponse.json(FALLBACK_INTEREST_RATE);
  }

  try {
    const url =
      `https://api.stlouisfed.org/fred/series/observations` +
      `?series_id=FEDFUNDS&api_key=${apiKey}&sort_order=desc&limit=2&file_type=json`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const obs = data.observations;
    const latest = parseFloat(obs[0].value);
    const prev = parseFloat(obs[1].value);
    const trend: 'rising' | 'stable' | 'falling' =
      latest > prev ? 'rising' : latest < prev ? 'falling' : 'stable';
    return NextResponse.json({
      fedRate: latest,
      lastChanged: obs[0].date,
      trend,
      source: 'fred',
    });
  } catch (err) {
    console.error('[api/interest-rate]', err);
    return NextResponse.json(FALLBACK_INTEREST_RATE);
  }
}
