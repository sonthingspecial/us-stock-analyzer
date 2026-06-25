'use client';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useMarketData } from '@/hooks/useMarketData';
import { useExchangeRate } from '@/hooks/useExchangeRate';
import { useInterestRate } from '@/hooks/useInterestRate';
import { MarketBarSkeleton } from '@/components/ui/LoadingSkeleton';
import clsx from 'clsx';

function MarketItem({
  label,
  value,
  sub,
  changePercent,
  highlight,
}: {
  label: string;
  value: string;
  sub?: string;
  changePercent?: number;
  highlight?: string;
}) {
  const up = changePercent !== undefined && changePercent > 0;
  const down = changePercent !== undefined && changePercent < 0;

  return (
    <div className={clsx('flex flex-col min-w-[100px] px-4 py-2 rounded-lg', highlight)}>
      <span className="text-xs text-gray-500 mb-0.5">{label}</span>
      <div className="flex items-center gap-1">
        <span className="text-sm font-bold text-gray-900 font-mono">{value}</span>
        {changePercent !== undefined && (
          <span
            className={clsx(
              'text-xs flex items-center gap-0.5',
              up ? 'text-green-600' : down ? 'text-red-600' : 'text-gray-400'
            )}
          >
            {up ? <TrendingUp size={10} /> : down ? <TrendingDown size={10} /> : <Minus size={10} />}
            {changePercent > 0 ? '+' : ''}{changePercent.toFixed(2)}%
          </span>
        )}
      </div>
      {sub && <span className="text-xs text-gray-400">{sub}</span>}
    </div>
  );
}

function vixHighlight(vix: number) {
  if (vix < 15) return 'bg-green-50';
  if (vix < 20) return 'bg-yellow-50';
  if (vix < 25) return 'bg-orange-50';
  return 'bg-red-50';
}

export function MarketBar() {
  const { market, fearGreed, isLoading: mktLoading } = useMarketData();
  const { data: fx, isLoading: fxLoading } = useExchangeRate();
  const { data: rate, isLoading: rateLoading } = useInterestRate();

  if (mktLoading && fxLoading && rateLoading) {
    return (
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <MarketBarSkeleton />
      </div>
    );
  }

  const trendArrow =
    rate?.trend === 'falling' ? '↓' : rate?.trend === 'rising' ? '↑' : '→';

  return (
    <div className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200 shadow-sm overflow-x-auto">
      <div className="flex items-center gap-1 px-4 py-1 min-w-max">
        {market && (
          <>
            <MarketItem
              label="S&P 500 (SPY)"
              value={market.spy.price > 0 ? `$${market.spy.price.toLocaleString()}` : '—'}
              changePercent={market.spy.changePercent}
            />
            <div className="w-px h-8 bg-gray-200 mx-1" />
            <MarketItem
              label="NASDAQ (QQQ)"
              value={market.qqq.price > 0 ? `$${market.qqq.price.toLocaleString()}` : '—'}
              changePercent={market.qqq.changePercent}
            />
            <div className="w-px h-8 bg-gray-200 mx-1" />
            <MarketItem
              label="VIX 변동성"
              value={market.vix.toFixed(2)}
              sub={
                market.vix < 15
                  ? '안정'
                  : market.vix < 20
                  ? '보통'
                  : market.vix < 25
                  ? '주의'
                  : '위험'
              }
              highlight={vixHighlight(market.vix)}
            />
          </>
        )}
        <div className="w-px h-8 bg-gray-200 mx-1" />
        {fx && (
          <MarketItem label="USD/KRW" value={`₩${fx.usdKrw.toLocaleString()}`} />
        )}
        <div className="w-px h-8 bg-gray-200 mx-1" />
        {rate && (
          <MarketItem
            label="미국 기준금리"
            value={`${rate.fedRate.toFixed(2)}%`}
            sub={`${trendArrow} ${
              rate.trend === 'falling'
                ? '인하 중'
                : rate.trend === 'rising'
                ? '인상 중'
                : '동결'
            }`}
          />
        )}
        {fearGreed && (
          <>
            <div className="w-px h-8 bg-gray-200 mx-1" />
            <MarketItem
              label="공포탐욕지수"
              value={`${fearGreed.score}`}
              sub={
                fearGreed.score <= 24
                  ? '극단적 공포'
                  : fearGreed.score <= 44
                  ? '공포'
                  : fearGreed.score <= 54
                  ? '중립'
                  : fearGreed.score <= 74
                  ? '탐욕'
                  : '극단적 탐욕'
              }
            />
          </>
        )}
      </div>
    </div>
  );
}
