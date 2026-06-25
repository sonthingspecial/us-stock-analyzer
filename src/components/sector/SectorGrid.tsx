'use client';
import { useEffect, useRef, useState } from 'react';
import { useSectorAnalysis } from '@/hooks/useSectorAnalysis';
import { SectorCard } from './SectorCard';
import { CardSkeleton } from '@/components/ui/LoadingSkeleton';
import { ErrorBanner } from '@/components/ui/ErrorBanner';

export function SectorGrid() {
  const { sectors, isLoading, isValidating, fallbackSources } = useSectorAnalysis();
  const [lastUpdated, setLastUpdated] = useState('');
  const prevValidating = useRef(false);

  // Update timestamp when SWR finishes a revalidation (isValidating: true → false)
  useEffect(() => {
    if (prevValidating.current && !isValidating && sectors.length > 0) {
      setLastUpdated(new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }
    prevValidating.current = isValidating;
  }, [isValidating, sectors.length]);

  return (
    <section>
      <ErrorBanner sources={fallbackSources} />
      <div className="px-4 pb-3 pt-2 flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">섹터별 투자 분석</h2>
        <div className="text-right">
          <p className="text-xs text-gray-400">높은 점수 순</p>
          {lastUpdated && <p className="text-[10px] text-gray-300 dark:text-gray-600">업데이트 {lastUpdated}</p>}
        </div>
      </div>
      <div className="px-4 pb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {isLoading
          ? [...Array(11)].map((_, i) => <CardSkeleton key={i} />)
          : sectors.map((s) => <SectorCard key={s.id} sector={s} />)}
      </div>
    </section>
  );
}
