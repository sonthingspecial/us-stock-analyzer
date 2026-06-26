'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import * as Icons from 'lucide-react';
import { ChevronDown } from 'lucide-react';
import type { SectorAnalysis } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';
import { ScoreBar } from './ScoreBar';
import { useMarketData } from '@/hooks/useMarketData';
import clsx from 'clsx';

const scoreColor = (t: number) =>
  t >= 75 ? 'text-green-600 dark:text-green-400' :
  t >= 55 ? 'text-yellow-600 dark:text-yellow-400' :
  t >= 35 ? 'text-orange-600 dark:text-orange-400' :
  'text-red-600 dark:text-red-400';

const borderHover = (t: number) =>
  t >= 75 ? 'border-gray-200 dark:border-gray-800 hover:border-green-400 dark:hover:border-green-700' :
  t >= 55 ? 'border-gray-200 dark:border-gray-800 hover:border-yellow-400 dark:hover:border-yellow-700' :
  t >= 35 ? 'border-gray-200 dark:border-gray-800 hover:border-orange-400 dark:hover:border-orange-700' :
  'border-gray-200 dark:border-gray-800 hover:border-red-400 dark:hover:border-red-700';

const sentimentIcon = { positive: '▲', negative: '▼', neutral: '●' };
const sentimentColor = {
  positive: 'text-green-600 dark:text-green-400',
  negative: 'text-red-500 dark:text-red-400',
  neutral: 'text-gray-400',
};

function vixBracketLabel(vix: number): string {
  if (vix < 15) return `${vix.toFixed(1)} — 안정 구간 (<15)`;
  if (vix < 20) return `${vix.toFixed(1)} — 보통 구간 (15~20)`;
  if (vix < 25) return `${vix.toFixed(1)} — 주의 구간 (20~25)`;
  if (vix < 30) return `${vix.toFixed(1)} — 위험 구간 (25~30)`;
  return `${vix.toFixed(1)} — 패닉 구간 (30+)`;
}

function RationalePanel({ sector }: { sector: SectorAnalysis }) {
  const { market, fearGreed } = useMarketData();

  const posCount  = sector.allNews.filter(n => n.sentiment === 'positive').length;
  const negCount  = sector.allNews.filter(n => n.sentiment === 'negative').length;
  const neutCount = sector.allNews.filter(n => n.sentiment === 'neutral').length;
  const total     = posCount + negCount + neutCount;
  // Display formula using simplified per-item counts (actual uses keyword counts per title)
  const rawApprox    = posCount - negCount;
  const formulaScore = Math.max(0, Math.min(20, 10 + Math.round(rawApprox * 1.5)));

  const vix     = market?.vix;
  const fgScore = fearGreed?.score;

  return (
    <div className="space-y-3 pt-1">

      {/* 1. 뉴스 감성 분석 */}
      <div className="bg-gray-50 dark:bg-gray-800/60 rounded-lg p-3 space-y-1.5">
        <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          뉴스 감성 분석 {total > 0 && `(${total}개 기준)`}
        </p>
        {total > 0 ? (
          <>
            {/* Bar */}
            <div className="flex h-2 rounded-full overflow-hidden gap-px">
              {posCount  > 0 && <div className="bg-green-400" style={{ flex: posCount }}  />}
              {neutCount > 0 && <div className="bg-gray-300 dark:bg-gray-600" style={{ flex: neutCount }} />}
              {negCount  > 0 && <div className="bg-red-400"   style={{ flex: negCount }}  />}
            </div>
            {/* Counts */}
            <div className="flex gap-3 text-[11px]">
              <span className="text-green-600 dark:text-green-400 font-semibold">긍정 {posCount}개</span>
              <span className="text-gray-400 font-semibold">중립 {neutCount}개</span>
              <span className="text-red-500 dark:text-red-400 font-semibold">부정 {negCount}개</span>
            </div>
            {/* Formula */}
            <p className="text-[11px] text-gray-500 dark:text-gray-400 font-mono">
              10(기준) + ({posCount} - {negCount}) × 1.5 ≈{' '}
              <span className="font-bold text-gray-700 dark:text-gray-200">{formulaScore}점</span>
              <span className="text-gray-400"> / 20점</span>
              {formulaScore !== sector.score.news && (
                <span className="text-gray-400"> → 실제 {sector.score.news}점</span>
              )}
            </p>
          </>
        ) : (
          <p className="text-[11px] text-gray-400">뉴스 데이터 없음 — 기본 10점 적용</p>
        )}
      </div>

      {/* 2. 시장 환경 보정 */}
      <div className="bg-gray-50 dark:bg-gray-800/60 rounded-lg p-3 space-y-2">
        <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          시장 환경 보정
        </p>

        {/* VIX */}
        <div className="flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400 w-20 shrink-0">VIX 변동성</span>
            <span className="text-gray-600 dark:text-gray-300">
              {vix != null ? vixBracketLabel(vix) : '—'}
            </span>
          </div>
          <span className="font-bold font-mono text-gray-700 dark:text-gray-200 shrink-0 ml-2">
            +{sector.score.vix}<span className="text-gray-400 font-normal"> / 20</span>
          </span>
        </div>

        {/* Fear & Greed */}
        <div className="flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400 w-20 shrink-0">공포탐욕</span>
            <span className="text-gray-600 dark:text-gray-300 font-mono">
              {fgScore != null
                ? `${fgScore}점 ÷ 100 × 25`
                : '—'}
            </span>
          </div>
          <span className="font-bold font-mono text-gray-700 dark:text-gray-200 shrink-0 ml-2">
            +{sector.score.fearGreed}<span className="text-gray-400 font-normal"> / 25</span>
          </span>
        </div>

        {/* Exchange Rate */}
        <div className="flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400 w-20 shrink-0">환율 보정</span>
            <span className="text-gray-600 dark:text-gray-300">섹터 달러 민감도 반영</span>
          </div>
          <span className="font-bold font-mono text-gray-700 dark:text-gray-200 shrink-0 ml-2">
            +{sector.score.exchangeRate}<span className="text-gray-400 font-normal"> / 15</span>
          </span>
        </div>

        {/* Interest Rate */}
        <div className="flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400 w-20 shrink-0">금리 보정</span>
            <span className="text-gray-600 dark:text-gray-300">섹터 금리 민감도 반영</span>
          </div>
          <span className="font-bold font-mono text-gray-700 dark:text-gray-200 shrink-0 ml-2">
            +{sector.score.interestRate}<span className="text-gray-400 font-normal"> / 20</span>
          </span>
        </div>

        {/* Total */}
        <div className="pt-1.5 mt-1 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-[11px] font-bold">
          <span className="text-gray-600 dark:text-gray-300">합계</span>
          <span className={clsx('font-mono text-sm', scoreColor(sector.score.total))}>
            {sector.score.total}점 / 100점
          </span>
        </div>
      </div>
    </div>
  );
}

export function SectorCard({ sector }: { sector: SectorAnalysis }) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const { score, recommendation, news, nameKo, nameEn, etf, icon, topStocks, id } = sector;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Icon = (Icons as any)[icon] as React.ComponentType<{ size?: number; className?: string }> | undefined;

  return (
    <div
      className={clsx(
        'bg-white dark:bg-gray-900 border rounded-xl p-5 flex flex-col gap-3.5 transition-all shadow-sm hover:shadow-md h-full',
        borderHover(score.total)
      )}
    >
      {/* Header — click navigates to detail */}
      <div
        className="flex items-start justify-between gap-2 cursor-pointer"
        onClick={() => router.push(`/sector/${id}`)}
      >
        <div className="flex items-center gap-2 min-w-0">
          {Icon && <Icon size={17} className="text-gray-400 dark:text-gray-500 shrink-0" />}
          <div className="min-w-0">
            <p className="text-gray-900 dark:text-white font-semibold text-sm">{nameKo}</p>
            <p className="text-gray-400 text-xs truncate">{nameEn} · {etf}</p>
          </div>
        </div>
        <Badge recommendationKey={recommendation.key} label={recommendation.labelKo} emoji={recommendation.emoji} />
      </div>

      {/* Score — click navigates */}
      <div className="cursor-pointer" onClick={() => router.push(`/sector/${id}`)}>
        <div className="flex items-baseline gap-1 mb-1.5">
          <span className={clsx('text-3xl font-bold font-mono', scoreColor(score.total))}>{score.total}</span>
          <span className="text-gray-400 text-sm">/ 100</span>
        </div>
        <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
          <div className={clsx('h-full rounded-full transition-all duration-700',
            score.total >= 75 ? 'bg-green-500' : score.total >= 55 ? 'bg-yellow-400' : score.total >= 35 ? 'bg-orange-500' : 'bg-red-500'
          )} style={{ width: `${score.total}%` }} />
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="space-y-1.5 cursor-pointer" onClick={() => router.push(`/sector/${id}`)}>
        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">점수 구성</p>
        <ScoreBar label="공포탐욕" value={score.fearGreed} max={25} />
        <ScoreBar label="변동성" value={score.vix} max={20} />
        <ScoreBar label="환율" value={score.exchangeRate} max={15} />
        <ScoreBar label="금리" value={score.interestRate} max={20} />
        <ScoreBar label="뉴스" value={score.news} max={20} />
      </div>

      {/* Top Stocks */}
      <div className="flex items-center gap-1.5 flex-wrap cursor-pointer" onClick={() => router.push(`/sector/${id}`)}>
        {topStocks.map((ticker) => (
          <span key={ticker} className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-[11px] font-mono rounded">
            {ticker}
          </span>
        ))}
      </div>

      {/* News */}
      {news.length > 0 && (
        <div className="cursor-pointer" onClick={() => router.push(`/sector/${id}`)}>
          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-1.5">최신 뉴스</p>
          <ul className="space-y-1.5">
            {news.map((item, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className={clsx('text-[10px] mt-0.5 shrink-0', sentimentColor[item.sentiment])}>
                  {sentimentIcon[item.sentiment]}
                </span>
                <span className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-tight">{item.title}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Bottom actions */}
      <div className="mt-auto pt-1 flex items-center justify-between gap-2">
        {/* 근거 보기 toggle */}
        <button
          onClick={() => setExpanded(prev => !prev)}
          className={clsx(
            'flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg transition-all',
            expanded
              ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
              : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
          )}
        >
          점수 근거 보기
          <ChevronDown
            size={12}
            className={clsx('transition-transform duration-300', expanded && 'rotate-180')}
          />
        </button>

        <button
          onClick={() => router.push(`/sector/${id}`)}
          className="text-[10px] text-blue-500 dark:text-blue-400 hover:underline"
        >
          상세 분석 보기 →
        </button>
      </div>

      {/* Collapsible rationale panel — grid-rows trick for height animation */}
      <div className={clsx(
        'grid transition-all duration-300 ease-in-out',
        expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
      )}>
        <div className="overflow-hidden">
          <RationalePanel sector={sector} />
        </div>
      </div>
    </div>
  );
}
