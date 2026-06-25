'use client';
import useSWR from 'swr';
import type { FearGreedResponse, MarketDataResponse } from '@/lib/types';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useMarketData() {
  const {
    data: market,
    error: marketError,
    isLoading: marketLoading,
  } = useSWR<MarketDataResponse>('/api/market', fetcher, {
    refreshInterval: 60_000,
    revalidateOnFocus: true,
  });

  const {
    data: fearGreed,
    error: fgError,
    isLoading: fgLoading,
  } = useSWR<FearGreedResponse>('/api/fear-greed', fetcher, {
    refreshInterval: 300_000,
    revalidateOnFocus: true,
  });

  return {
    market,
    fearGreed,
    isLoading: marketLoading || fgLoading,
    hasErrors: [marketError ? 'market' : null, fgError ? 'fear-greed' : null].filter(
      Boolean
    ) as string[],
  };
}
