'use client';
import { useSectorAnalysis } from '@/hooks/useSectorAnalysis';
import { SectorCard } from './SectorCard';
import { CardSkeleton } from '@/components/ui/LoadingSkeleton';
import { ErrorBanner } from '@/components/ui/ErrorBanner';

export function SectorGrid() {
  const { sectors, isLoading, fallbackSources } = useSectorAnalysis();

  return (
    <section>
      <ErrorBanner sources={fallbackSources} />

      <div className="px-4 pb-4 pt-2 flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">섹터별 투자 분석</h2>
        <span className="text-xs text-gray-400">높은 점수 순 · 30분마다 업데이트</span>
      </div>

      <div className="px-4 pb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {isLoading
          ? [...Array(11)].map((_, i) => <CardSkeleton key={i} />)
          : sectors.map((sector) => (
              <SectorCard key={sector.id} sector={sector} />
            ))}
      </div>
    </section>
  );
}
