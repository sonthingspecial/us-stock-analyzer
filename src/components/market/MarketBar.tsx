'use client';
import { TrendingUp, TrendingDown, Minus, RefreshCw } from 'lucide-react';
import { useMarketData } from '@/hooks/useMarketData';
import { useExchangeRate } from '@/hooks/useExchangeRate';
import { useInterestRate } from '@/hooks/useInterestRate';
import clsx from 'clsx';

/* ─── MarketItem ─── */
function MarketItem({
  label, value, sub, changePercent, highlight, compact,
}: {
  label: string; value: string; sub?: string;
  changePercent?: number; highlight?: string; compact?: boolean;
}) {
  const up   = changePercent !== undefined && changePercent > 0;
  const down = changePercent !== undefined && changePercent < 0;
  return (
    <div className={clsx(
      'flex flex-col px-2.5 py-1.5 rounded-lg',
      compact ? 'w-full' : 'min-w-[88px] sm:min-w-[100px] px-3 sm:px-4 py-2',
      highlight,
    )}>
      <span className="text-[10px] text-gray-500 dark:text-gray-500 mb-0.5 whitespace-nowrap">{label}</span>
      <div className="flex items-center gap-1">
        <span className={clsx('font-bold font-mono text-gray-900 dark:text-white', compact ? 'text-xs' : 'text-xs sm:text-sm')}>
          {value}
        </span>
        {changePercent !== undefined && (
          <span className={clsx(
            'flex items-center gap-0.5 text-[10px]',
            up ? 'text-green-600 dark:text-green-400' : down ? 'text-red-600 dark:text-red-400' : 'text-gray-400',
          )}>
            {up ? <TrendingUp size={9} /> : down ? <TrendingDown size={9} /> : <Minus size={9} />}
            {changePercent > 0 ? '+' : ''}{changePercent.toFixed(2)}%
          </span>
        )}
      </div>
      {sub && <span className="text-[10px] text-gray-400 dark:text-gray-500">{sub}</span>}
    </div>
  );
}

function Divider() {
  return <div className="w-px h-7 bg-gray-200 dark:bg-gray-800 mx-0.5 shrink-0" />;
}

function vixHighlight(vix: number) {
  if (vix < 15) return 'bg-green-50 dark:bg-green-900/20';
  if (vix < 20) return 'bg-yellow-50 dark:bg-yellow-900/20';
  if (vix < 25) return 'bg-orange-50 dark:bg-orange-900/20';
  return 'bg-red-50 dark:bg-red-900/20';
}

function isUSMarketOpen(): boolean {
  const now = new Date();
  const day = now.getUTCDay();
  if (day === 0 || day === 6) return false;
  const utcMin = now.getUTCHours() * 60 + now.getUTCMinutes();
  return utcMin >= 810 && utcMin < 1200;
}

function formatServerTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  } catch { return ''; }
}

/* ─── StatusChip (공용) ─── */
function StatusChip({
  isOpen, lastFetched, isValidating, refreshAll, compact,
}: {
  isOpen: boolean; lastFetched: string; isValidating: boolean;
  refreshAll: () => void; compact?: boolean;
}) {
  return (
    <div className={clsx('flex items-center gap-2', compact ? 'w-full justify-between px-2.5 py-1.5' : 'px-3 py-1.5')}>
      <div className="flex items-center gap-1.5">
        <span className={clsx('w-1.5 h-1.5 rounded-full shrink-0', isOpen ? 'bg-green-500 animate-pulse' : 'bg-gray-300 dark:bg-gray-600')} />
        <div>
          <span className={clsx('text-[10px] font-semibold', isOpen ? 'text-green-600 dark:text-green-400' : 'text-gray-400')}>
            {isOpen ? 'LIVE' : '장 마감'}
          </span>
          {lastFetched && (
            <span className="ml-1 text-[9px] text-gray-400 flex-shrink-0">
              {lastFetched} 기준
            </span>
          )}
        </div>
      </div>
      <button
        onClick={refreshAll}
        disabled={isValidating}
        className="p-1.5 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors disabled:opacity-40"
        title="새로고침"
      >
        <RefreshCw size={13} className={isValidating ? 'animate-spin' : ''} />
      </button>
    </div>
  );
}

/* ─── Skeleton ─── */
function Skeleton() {
  return (
    <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      {/* Mobile skeleton: 2-col grid */}
      <div className="sm:hidden grid grid-cols-2 gap-1 px-3 py-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse px-2.5 py-1.5">
            <div className="h-2.5 w-10 bg-gray-200 dark:bg-gray-700 rounded mb-1" />
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        ))}
      </div>
      {/* Desktop skeleton */}
      <div className="hidden sm:flex gap-3 px-4 py-2">
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

/* ─── MarketBar ─── */
export function MarketBar() {
  const { market, fearGreed, isLoading, isValidating, refreshAll } = useMarketData();
  const { data: fx } = useExchangeRate();
  const { data: rate } = useInterestRate();

  if (isLoading) return <Skeleton />;

  const isOpen     = isUSMarketOpen();
  const lastFetched = market?.timestamp ? formatServerTime(market.timestamp) : '';
  const trendArrow  = rate?.trend === 'falling' ? '↓' : rate?.trend === 'rising' ? '↑' : '→';
  const trendLabel  = rate?.trend === 'falling' ? '인하 중' : rate?.trend === 'rising' ? '인상 중' : '동결';

  const wrapperCls = 'sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur border-b border-gray-200 dark:border-gray-800 shadow-sm';

  return (
    <div className={wrapperCls}>

      {/* ── Mobile: 2-column grid (hidden on sm+) ── */}
      <div className="sm:hidden">
        <div className="grid grid-cols-2 divide-x divide-y divide-gray-100 dark:divide-gray-800">
          {market && (
            <>
              <MarketItem compact label="S&P 500"
                value={market.spy.price > 0 ? `$${market.spy.price.toLocaleString()}` : '—'}
                changePercent={market.spy.changePercent} />
              <MarketItem compact label="NASDAQ"
                value={market.qqq.price > 0 ? `$${market.qqq.price.toLocaleString()}` : '—'}
                changePercent={market.qqq.changePercent} />
              <MarketItem compact label="VIX"
                value={market.vix.toFixed(2)}
                sub={market.vix < 15 ? '안정' : market.vix < 20 ? '보통' : market.vix < 25 ? '주의' : '위험'}
                highlight={vixHighlight(market.vix)} />
            </>
          )}
          {fx && (
            <MarketItem compact label="USD/KRW" value={`₩${fx.usdKrw.toLocaleString()}`} />
          )}
          {rate && (
            <MarketItem compact label="기준금리"
              value={`${rate.fedRate.toFixed(2)}%`}
              sub={`${trendArrow} ${trendLabel}`} />
          )}
          {fearGreed && (
            <MarketItem compact label="공포탐욕"
              value={`${fearGreed.score}`}
              sub={fearGreed.score <= 24 ? '극단적 공포' : fearGreed.score <= 44 ? '공포' : fearGreed.score <= 54 ? '중립' : fearGreed.score <= 74 ? '탐욕' : '극단적 탐욕'} />
          )}
        </div>
        {/* Status row */}
        <div className="border-t border-gray-100 dark:border-gray-800">
          <StatusChip compact isOpen={isOpen} lastFetched={lastFetched} isValidating={isValidating} refreshAll={refreshAll} />
        </div>
      </div>

      {/* ── Desktop: horizontal flex bar (hidden on mobile) ── */}
      <div className="hidden sm:block overflow-x-auto">
        <div className="flex items-center gap-0.5 px-4 py-1 min-w-max">
          {market && (
            <>
              <MarketItem label="S&P 500"
                value={market.spy.price > 0 ? `$${market.spy.price.toLocaleString()}` : '—'}
                changePercent={market.spy.changePercent} />
              <Divider />
              <MarketItem label="NASDAQ"
                value={market.qqq.price > 0 ? `$${market.qqq.price.toLocaleString()}` : '—'}
                changePercent={market.qqq.changePercent} />
              <Divider />
              <MarketItem label="VIX"
                value={market.vix.toFixed(2)}
                sub={market.vix < 15 ? '안정' : market.vix < 20 ? '보통' : market.vix < 25 ? '주의' : '위험'}
                highlight={vixHighlight(market.vix)} />
            </>
          )}
          <Divider />
          {fx && <MarketItem label="USD/KRW" value={`₩${fx.usdKrw.toLocaleString()}`} />}
          <Divider />
          {rate && <MarketItem label="기준금리" value={`${rate.fedRate.toFixed(2)}%`} sub={`${trendArrow} ${trendLabel}`} />}
          {fearGreed && (
            <>
              <Divider />
              <MarketItem label="공포탐욕"
                value={`${fearGreed.score}`}
                sub={fearGreed.score <= 24 ? '극단적 공포' : fearGreed.score <= 44 ? '공포' : fearGreed.score <= 54 ? '중립' : fearGreed.score <= 74 ? '탐욕' : '극단적 탐욕'} />
            </>
          )}
          <Divider />
          <StatusChip isOpen={isOpen} lastFetched={lastFetched} isValidating={isValidating} refreshAll={refreshAll} />
        </div>
      </div>

    </div>
  );
}
