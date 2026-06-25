'use client';
import useSWR from 'swr';
import type { FearGreedResponse, MarketDataResponse } from '@/lib/types';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useMarketData() {
  const {
    data: market,
    error: marketError,
    isLoading: marketLoading,
    isValidating: marketValidating,
    mutate: mutateMarket,
  } = useSWR<MarketDataResponse>('/api/market', fetcher, {
    refreshInterval: 60_000,
    revalidateOnFocus: true,
  });

  const {
    data: fearGreed,
    error: fgError,
    isLoading: fgLoading,
    mutate: mutateFearGreed,
  } = useSWR<FearGreedResponse>('/api/fear-greed', fetcher, {
    refreshInterval: 300_000,
    revalidateOnFocus: true,
  });

  const refreshAll = () => {
    mutateMarket();
    mutateFearGreed();
  };

  return {
    market,
    fearGreed,
    isLoading: marketLoading || fgLoading,
    isValidating: marketValidating,
    refreshAll,
    hasErrors: [marketError ? 'market' : null, fgError ? 'fear-greed' : null].filter(
      Boolean
    ) as string[],
  };
}
