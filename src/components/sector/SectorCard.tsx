'use client';
import Link from 'next/link';
import * as Icons from 'lucide-react';
import type { SectorAnalysis } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';
import { ScoreBar } from './ScoreBar';
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

export function SectorCard({ sector }: { sector: SectorAnalysis }) {
  const { score, recommendation, news, nameKo, nameEn, etf, icon, topStocks, id } = sector;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Icon = (Icons as any)[icon] as React.ComponentType<{ size?: number; className?: string }> | undefined;

  return (
    <Link href={`/sector/${id}`} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl">
      <div className={clsx(
        'bg-white dark:bg-gray-900 border rounded-xl p-5 flex flex-col gap-3.5 transition-all shadow-sm hover:shadow-md cursor-pointer h-full',
        borderHover(score.total)
      )}>
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            {Icon && <Icon size={17} className="text-gray-400 dark:text-gray-500 shrink-0" />}
            <div className="min-w-0">
              <p className="text-gray-900 dark:text-white font-semibold text-sm">{nameKo}</p>
              <p className="text-gray-400 text-xs truncate">{nameEn} · {etf}</p>
            </div>
          </div>
          <Badge recommendationKey={recommendation.key} label={recommendation.labelKo} emoji={recommendation.emoji} />
        </div>

        {/* Score */}
        <div>
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
        <div className="space-y-1.5">
          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">점수 구성</p>
          <ScoreBar label="공포탐욕" value={score.fearGreed} max={25} />
          <ScoreBar label="변동성" value={score.vix} max={20} />
          <ScoreBar label="환율" value={score.exchangeRate} max={15} />
          <ScoreBar label="금리" value={score.interestRate} max={20} />
          <ScoreBar label="뉴스" value={score.news} max={20} />
        </div>

        {/* Top Stocks */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {topStocks.map((ticker) => (
            <span key={ticker} className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-[11px] font-mono rounded">
              {ticker}
            </span>
          ))}
        </div>

        {/* News */}
        {news.length > 0 && (
          <div>
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

        <p className="text-[10px] text-blue-500 dark:text-blue-400 mt-auto pt-1">상세 분석 보기 →</p>
      </div>
    </Link>
  );
}
