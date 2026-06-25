'use client';
import useSWR from 'swr';
import type { ExchangeRateResponse } from '@/lib/types';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useExchangeRate() {
  return useSWR<ExchangeRateResponse>('/api/exchange-rate', fetcher, {
    refreshInterval: 3_600_000,
    revalidateOnFocus: false,
  });
}
