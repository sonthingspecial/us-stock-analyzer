'use client';
import useSWR from 'swr';
import { useMemo } from 'react';
import type { SectorId, SectorNewsResponse, SectorAnalysis } from '@/lib/types';
import { useMarketData } from './useMarketData';
import { useExchangeRate } from './useExchangeRate';
import { useInterestRate } from './useInterestRate';
import { computeAllSectors } from '@/lib/scoring/composite';
import {
  FALLBACK_FEAR_GREED,
  FALLBACK_MARKET,
  FALLBACK_EXCHANGE_RATE,
  FALLBACK_INTEREST_RATE,
} from '@/lib/constants/fallbackData';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useSectorAnalysis() {
  const { market, fearGreed, isLoading: marketLoading } = useMarketData();
  const { data: exchangeRate, isLoading: fxLoading } = useExchangeRate();
  const { data: interestRate, isLoading: rateLoading } = useInterestRate();

  const { data: allNews, isLoading: newsLoading } = useSWR<
    Record<SectorId, SectorNewsResponse>
  >('/api/all-sector-news', fetcher, {
    refreshInterval: 1_800_000,
    revalidateOnFocus: false,
  });

  const isLoading = marketLoading || fxLoading || rateLoading || newsLoading;

  const sectors: SectorAnalysis[] = useMemo(() => {
    const fg = fearGreed ?? FALLBACK_FEAR_GREED;
    const mkt = market ?? FALLBACK_MARKET;
    const fx = exchangeRate ?? FALLBACK_EXCHANGE_RATE;
    const rate = interestRate ?? FALLBACK_INTEREST_RATE;
    const newsMap = allNews ?? {};
    return computeAllSectors(fg, mkt, fx, rate, newsMap);
  }, [fearGreed, market, exchangeRate, interestRate, allNews]);

  const fallbackSources: string[] = [
    fearGreed?.source === 'fallback' ? '공포탐욕 지수' : null,
    market?.source === 'fallback' ? '시장 데이터' : null,
    exchangeRate?.source === 'fallback' ? '환율' : null,
    interestRate?.source === 'static' ? '기준금리(정적 데이터)' : null,
    allNews &&
    Object.values(allNews).some((n) => n.source === 'fallback')
      ? '일부 뉴스'
      : null,
  ].filter(Boolean) as string[];

  return { sectors, isLoading, fallbackSources };
}
