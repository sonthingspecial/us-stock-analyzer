'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useMarketData } from '@/hooks/useMarketData';
import { useExchangeRate } from '@/hooks/useExchangeRate';
import clsx from 'clsx';

interface Judgment {
  emoji: string;
  message: string;
  fxNote: string | null;
  tone: 'green' | 'yellow' | 'red';
}

function judge(fg: number, vix: number, usdKrw: number): Judgment {
  const fxNote = usdKrw > 1400 ? '환율 부담으로 실질 수익 주의' : null;

  if (fg < 30 && vix < 20) {
    return { emoji: '🟢', message: '매수 적기입니다. 상위 섹터 ETF를 주목하세요.', fxNote, tone: 'green' };
  }
  if (fg > 70 || vix > 25) {
    return { emoji: '🔴', message: '시장 과열 또는 변동성 주의. 현금 비중을 고려하세요.', fxNote, tone: 'red' };
  }
  return { emoji: '🟡', message: '중립 구간입니다. 분할 매수 전략을 고려하세요.', fxNote, tone: 'yellow' };
}

const toneStyle = {
  green:  { wrap: 'bg-green-50  dark:bg-green-900/20  border-green-200  dark:border-green-800',  text: 'text-green-800  dark:text-green-200',  sub: 'text-green-600  dark:text-green-400' },
  yellow: { wrap: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800', text: 'text-yellow-800 dark:text-yellow-200', sub: 'text-yellow-600 dark:text-yellow-400' },
  red:    { wrap: 'bg-red-50    dark:bg-red-900/20    border-red-200    dark:border-red-800',    text: 'text-red-800    dark:text-red-200',    sub: 'text-red-600    dark:text-red-400' },
};

const RULES = [
  { cond: '공포탐욕 < 30  +  VIX < 20',    emoji: '🟢', msg: '매수 적기입니다. 상위 섹터 ETF를 주목하세요.' },
  { cond: '공포탐욕 > 70  또는  VIX > 25', emoji: '🔴', msg: '시장 과열 또는 변동성 주의. 현금 비중을 고려하세요.' },
  { cond: 'USD/KRW > 1,400 (추가 조건)',    emoji: '🟡', msg: '환율 부담으로 실질 수익 주의 (위 문구에 병기)' },
  { cond: '그 외',                          emoji: '🟡', msg: '중립 구간입니다. 분할 매수 전략을 고려하세요.' },
];

export function DailySummaryBanner() {
  const [open, setOpen] = useState(false);
  const { market, fearGreed, isLoading } = useMarketData();
  const { data: fx } = useExchangeRate();

  if (isLoading || !market || !fearGreed) {
    return (
      <div className="mx-4 mt-3 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
    );
  }

  const { emoji, message, fxNote, tone } = judge(fearGreed.score, market.vix, fx?.usdKrw ?? 0);
  const s = toneStyle[tone];

  return (
    <div className={clsx('mx-4 mt-3 rounded-xl border px-4 py-3', s.wrap)}>
      {/* Main row */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-start gap-2 min-w-0">
          <span className="text-lg leading-tight shrink-0">{emoji}</span>
          <div className="min-w-0">
            <p className={clsx('text-sm font-semibold leading-snug', s.text)}>{message}</p>
            {fxNote && (
              <p className={clsx('text-xs mt-0.5 font-medium', s.sub)}>
                🟡 {fxNote}
              </p>
            )}
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
              이 추천은 규칙 기반이며 투자 조언이 아닙니다
            </p>
          </div>
        </div>

        {/* Toggle */}
        <button
          onClick={() => setOpen(v => !v)}
          className={clsx(
            'flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg shrink-0 transition-colors',
            open
              ? 'bg-white/60 dark:bg-black/20 text-gray-600 dark:text-gray-300'
              : 'text-gray-500 dark:text-gray-400 hover:bg-white/60 dark:hover:bg-black/20'
          )}
        >
          판단 기준 보기
          <ChevronDown size={12} className={clsx('transition-transform duration-300', open && 'rotate-180')} />
        </button>
      </div>

      {/* Collapsible rules */}
      <div className={clsx(
        'grid transition-all duration-300 ease-in-out',
        open ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0'
      )}>
        <div className="overflow-hidden">
          <div className="pt-2 border-t border-black/10 dark:border-white/10 space-y-2">
            <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              판단 규칙
            </p>
            {RULES.map((r, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <span className="shrink-0 font-mono text-gray-400 dark:text-gray-500 w-52 shrink-0">{r.cond}</span>
                <span className="text-gray-300 dark:text-gray-600 shrink-0">→</span>
                <span className="text-gray-600 dark:text-gray-300">
                  {r.emoji} {r.msg}
                </span>
              </div>
            ))}
            {/* Live values */}
            <div className="flex gap-4 pt-1.5 mt-1.5 border-t border-black/10 dark:border-white/10 text-[11px] text-gray-500 dark:text-gray-400">
              <span>공포탐욕 <strong className="text-gray-700 dark:text-gray-200">{fearGreed.score}</strong></span>
              <span>VIX <strong className="text-gray-700 dark:text-gray-200">{market.vix.toFixed(1)}</strong></span>
              <span>USD/KRW <strong className="text-gray-700 dark:text-gray-200">₩{fx?.usdKrw.toLocaleString() ?? '—'}</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
