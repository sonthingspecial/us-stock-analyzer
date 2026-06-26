'use client';
import { TrendingUp, TrendingDown, Minus, ExternalLink } from 'lucide-react';
import { useRecommendedETFs } from '@/hooks/useRecommendedETFs';
import { Badge } from '@/components/ui/Badge';
import clsx from 'clsx';

function ETFCard({
  ticker,
  price,
  changePercent,
}: {
  ticker: string;
  price: number;
  changePercent: number;
}) {
  const up = changePercent > 0;
  const down = changePercent < 0;

  return (
    <a
      href={`https://finance.yahoo.com/quote/${ticker}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex-1 min-w-0 flex flex-col gap-0.5 px-4 py-3 bg-gray-50 dark:bg-gray-800/60 hover:bg-gray-100 dark:hover:bg-gray-700/60 rounded-xl border border-gray-200 dark:border-gray-700 transition-colors group"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold font-mono text-gray-800 dark:text-gray-100">{ticker}</span>
        <ExternalLink size={11} className="text-gray-300 dark:text-gray-600 group-hover:text-gray-400 transition-colors" />
      </div>
      <span className="text-base font-bold font-mono text-gray-900 dark:text-white">
        {price > 0 ? `$${price.toLocaleString()}` : '—'}
      </span>
      <div className={clsx(
        'flex items-center gap-1 text-xs font-semibold',
        up ? 'text-green-600 dark:text-green-400' :
        down ? 'text-red-500 dark:text-red-400' : 'text-gray-400'
      )}>
        {up ? <TrendingUp size={11} /> : down ? <TrendingDown size={11} /> : <Minus size={11} />}
        {changePercent > 0 ? '+' : ''}{changePercent.toFixed(2)}%
      </div>
    </a>
  );
}

function SkeletonRow() {
  return (
    <div className="animate-pulse space-y-2 pb-4 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0">
      <div className="flex items-center gap-2">
        <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-5 w-14 bg-gray-200 dark:bg-gray-700 rounded-full" />
      </div>
      <div className="h-3 w-3/4 bg-gray-100 dark:bg-gray-800 rounded" />
      <div className="flex gap-3">
        <div className="flex-1 h-16 bg-gray-100 dark:bg-gray-800 rounded-xl" />
        <div className="flex-1 h-16 bg-gray-100 dark:bg-gray-800 rounded-xl" />
      </div>
    </div>
  );
}

export function RecommendedETFs() {
  const { sectors, isLoading } = useRecommendedETFs();

  return (
    <section className="px-4 pb-2 pt-1">
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-5 pt-4 pb-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">🎯 오늘의 추천 ETF</h2>
            <p className="text-[11px] text-gray-400 mt-0.5">상위 3개 섹터 · Yahoo Finance 실시간</p>
          </div>
        </div>

        {/* Body */}
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {isLoading
            ? [1, 2, 3].map(i => (
                <div key={i} className="px-5 py-4"><SkeletonRow /></div>
              ))
            : sectors.map(s => (
                <div key={s.sectorId} className="px-5 py-4 space-y-2.5">
                  {/* Sector header */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      {s.nameKo}
                    </span>
                    <Badge
                      recommendationKey={s.recommendation.key}
                      label={s.recommendation.labelKo}
                      emoji={s.recommendation.emoji}
                    />
                    <span className="text-xs font-mono text-gray-400">
                      {s.score.total}점
                    </span>
                  </div>

                  {/* Reason */}
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                    {s.reason}
                  </p>

                  {/* ETF cards */}
                  <div className="flex gap-2.5">
                    {s.etfs.map(etf => (
                      <ETFCard
                        key={etf.ticker}
                        ticker={etf.ticker}
                        price={etf.price}
                        changePercent={etf.changePercent}
                      />
                    ))}
                  </div>
                </div>
              ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-2.5 bg-gray-50 dark:bg-gray-800/40 border-t border-gray-100 dark:border-gray-800">
          <p className="text-[10px] text-gray-400">
            ⚠ 투자 참고용입니다. 실제 투자는 본인의 판단과 책임 하에 하시기 바랍니다.
          </p>
        </div>
      </div>
    </section>
  );
}
