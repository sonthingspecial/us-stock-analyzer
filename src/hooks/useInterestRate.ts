'use client';
import useSWR from 'swr';
import type { InterestRateResponse } from '@/lib/types';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useInterestRate() {
  return useSWR<InterestRateResponse>('/api/interest-rate', fetcher, {
    refreshInterval: 3_600_000,
    revalidateOnFocus: false,
  });
}
