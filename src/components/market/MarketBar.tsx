'use client';
import { TrendingUp, TrendingDown, Minus, RefreshCw } from 'lucide-react';
import { useMarketData } from '@/hooks/useMarketData';
import { useExchangeRate } from '@/hooks/useExchangeRate';
import { useInterestRate } from '@/hooks/useInterestRate';
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
    <div className={clsx('flex flex-col min-w-[88px] sm:min-w-[100px] px-3 sm:px-4 py-2 rounded-lg', highlight)}>
      <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-500 mb-0.5 whitespace-nowrap">{label}</span>
      <div className="flex items-center gap-1">
        <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white font-mono">{value}</span>
        {changePercent !== undefined && (
          <span className={clsx('text-[10px] sm:text-xs flex items-center gap-0.5', up ? 'text-green-600 dark:text-green-400' : down ? 'text-red-600 dark:text-red-400' : 'text-gray-400')}>
            {up ? <TrendingUp size={9} /> : down ? <TrendingDown size={9} /> : <Minus size={9} />}
            {changePercent > 0 ? '+' : ''}{changePercent.toFixed(2)}%
          </span>
        )}
      </div>
      {sub && <span className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500">{sub}</span>}
    </div>
  );
}

function vixHighlight(vix: number) {
  if (vix < 15) return 'bg-green-50 dark:bg-green-900/20';
  if (vix < 20) return 'bg-yellow-50 dark:bg-yellow-900/20';
  if (vix < 25) return 'bg-orange-50 dark:bg-orange-900/20';
  return 'bg-red-50 dark:bg-red-900/20';
}

function Divider() {
  return <div className="w-px h-7 bg-gray-200 dark:bg-gray-800 mx-0.5 shrink-0" />;
}

function isUSMarketOpen(): boolean {
  const now = new Date();
  const day = now.getUTCDay();
  if (day === 0 || day === 6) return false;
  // EDT = UTC-4: market 13:30–20:00 UTC
  const utcMin = now.getUTCHours() * 60 + now.getUTCMinutes();
  return utcMin >= 810 && utcMin < 1200;
}

function formatServerTime(isoString: string): string {
  try {
    return new Date(isoString).toLocaleTimeString('ko-KR', {
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  } catch {
    return '';
  }
}

export function MarketBar() {
  const { market, fearGreed, isLoading: mktLoading, isValidating, refreshAll } = useMarketData();
  const { data: fx } = useExchangeRate();
  const { data: rate } = useInterestRate();

  if (mktLoading) {
    return (
      <div className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="flex gap-3 px-4 py-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-2.5 w-10 bg-gray-200 dark:bg-gray-700 rounded mb-1" />
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const trendArrow = rate?.trend === 'falling' ? '↓' : rate?.trend === 'rising' ? '↑' : '→';
  const marketOpen = isUSMarketOpen();
  const lastFetched = market?.timestamp ? formatServerTime(market.timestamp) : '';

  return (
    <div className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur border-b border-gray-200 dark:border-gray-800 shadow-sm overflow-x-auto">
      <div className="flex items-center gap-0.5 px-2 sm:px-4 py-1 min-w-max">
        {market && (
          <>
            <MarketItem label="S&P 500" value={market.spy.price > 0 ? `$${market.spy.price.toLocaleString()}` : '—'} changePercent={market.spy.changePercent} />
            <Divider />
            <MarketItem label="NASDAQ" value={market.qqq.price > 0 ? `$${market.qqq.price.toLocaleString()}` : '—'} changePercent={market.qqq.changePercent} />
            <Divider />
            <MarketItem label="VIX" value={market.vix.toFixed(2)} sub={market.vix < 15 ? '안정' : market.vix < 20 ? '보통' : market.vix < 25 ? '주의' : '위험'} highlight={vixHighlight(market.vix)} />
          </>
        )}
        <Divider />
        {fx && <MarketItem label="USD/KRW" value={`₩${fx.usdKrw.toLocaleString()}`} />}
        <Divider />
        {rate && <MarketItem label="기준금리" value={`${rate.fedRate.toFixed(2)}%`} sub={`${trendArrow} ${rate.trend === 'falling' ? '인하 중' : rate.trend === 'rising' ? '인상 중' : '동결'}`} />}
        {fearGreed && (
          <>
            <Divider />
            <MarketItem label="공포탐욕" value={`${fearGreed.score}`} sub={fearGreed.score <= 24 ? '극단적 공포' : fearGreed.score <= 44 ? '공포' : fearGreed.score <= 54 ? '중립' : fearGreed.score <= 74 ? '탐욕' : '극단적 탐욕'} />
          </>
        )}

        {/* Status + manual refresh */}
        <Divider />
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="flex flex-col items-center min-w-[60px]">
            <div className="flex items-center gap-1">
              <span className={clsx(
                'inline-block w-1.5 h-1.5 rounded-full shrink-0',
                marketOpen ? 'bg-green-500 animate-pulse' : 'bg-gray-300 dark:bg-gray-600'
              )} />
              <span className={clsx(
                'text-[10px] font-semibold',
                marketOpen ? 'text-green-600 dark:text-green-400' : 'text-gray-400'
              )}>
                {marketOpen ? 'LIVE' : '장 마감'}
              </span>
            </div>
            {lastFetched && (
              <span className="text-[9px] text-gray-400 mt-0.5">{lastFetched} 기준</span>
            )}
          </div>
          <button
            onClick={refreshAll}
            disabled={isValidating}
            className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors disabled:opacity-40"
            title="데이터 새로고침"
          >
            <RefreshCw size={13} className={isValidating ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>
    </div>
  );
}
