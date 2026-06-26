'use client';
import useSWR from 'swr';
import { useSectorAnalysis } from './useSectorAnalysis';
import { ETF_MAP } from '@/lib/constants/etfMap';
import type { SectorId, Recommendation, SectorScoreBreakdown } from '@/lib/types';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export interface RecommendedSector {
  sectorId: SectorId;
  nameKo: string;
  score: SectorScoreBreakdown;
  recommendation: Recommendation;
  reason: string;
  etfs: { ticker: string; price: number; changePercent: number }[];
}

interface EtfPrice {
  ticker: string;
  price: number;
  changePercent: number;
}

export function useRecommendedETFs() {
  const { sectors, isLoading: sectorsLoading } = useSectorAnalysis();

  // Top 3 sectors by score (already sorted descending by useSectorAnalysis)
  const topSectors = sectors.slice(0, 3);
  const tickers = topSectors.flatMap(s => ETF_MAP[s.id] ?? []);
  const tickerParam = tickers.join(',');

  const { data: prices, isLoading: pricesLoading } = useSWR<EtfPrice[]>(
    !sectorsLoading && tickerParam ? `/api/etf-prices?tickers=${tickerParam}` : null,
    fetcher,
    { refreshInterval: 60_000, revalidateOnFocus: true }
  );

  const result: RecommendedSector[] = topSectors.map(sector => {
    const etfTickers = ETF_MAP[sector.id] ?? [];
    // Pick the top positive rationale item as the one-line reason
    const topRationale =
      sector.rationale.find(r => r.sentiment === 'positive') ??
      sector.rationale.find(r => r.sentiment === 'neutral') ??
      sector.rationale[0];
    const reason = topRationale
      ? `${topRationale.factor}: ${topRationale.text}`
      : `종합 ${sector.score.total}점 — ${sector.recommendation.labelKo}`;

    return {
      sectorId: sector.id,
      nameKo: sector.nameKo,
      score: sector.score,
      recommendation: sector.recommendation,
      reason,
      etfs: etfTickers.map(ticker => {
        const p = prices?.find(x => x.ticker === ticker);
        return { ticker, price: p?.price ?? 0, changePercent: p?.changePercent ?? 0 };
      }),
    };
  });

  return {
    sectors: result,
    isLoading: sectorsLoading || pricesLoading,
  };
}
