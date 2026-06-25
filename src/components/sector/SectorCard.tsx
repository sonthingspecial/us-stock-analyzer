'use client';
import * as Icons from 'lucide-react';
import { ExternalLink } from 'lucide-react';
import type { SectorAnalysis } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';
import { ScoreBar } from './ScoreBar';
import clsx from 'clsx';

const scoreColor = (total: number) => {
  if (total >= 75) return 'text-green-600';
  if (total >= 55) return 'text-yellow-600';
  if (total >= 35) return 'text-orange-600';
  return 'text-red-600';
};

const borderColor = (total: number) => {
  if (total >= 75) return 'border-green-200 hover:border-green-400';
  if (total >= 55) return 'border-yellow-200 hover:border-yellow-400';
  if (total >= 35) return 'border-orange-200 hover:border-orange-400';
  return 'border-red-200 hover:border-red-400';
};

const sentimentStyle = {
  positive: 'text-green-600',
  negative: 'text-red-500',
  neutral: 'text-gray-400',
};

interface SectorCardProps {
  sector: SectorAnalysis;
}

export function SectorCard({ sector }: SectorCardProps) {
  const { score, recommendation, news, nameKo, nameEn, etf, icon } = sector;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Icon = (Icons as any)[icon] as React.ComponentType<{ size?: number; className?: string }> | undefined;

  return (
    <div
      className={clsx(
        'bg-white border rounded-xl p-5 flex flex-col gap-4 transition-colors shadow-sm hover:shadow-md',
        borderColor(score.total)
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          {Icon && <Icon size={18} className="text-gray-500 shrink-0" />}
          <div>
            <p className="text-gray-900 font-semibold text-sm">{nameKo}</p>
            <p className="text-gray-400 text-xs">{nameEn} · {etf}</p>
          </div>
        </div>
        <Badge
          recommendationKey={recommendation.key}
          label={recommendation.labelKo}
          emoji={recommendation.emoji}
        />
      </div>

      {/* Total Score */}
      <div>
        <div className="flex items-baseline gap-1 mb-2">
          <span className={clsx('text-3xl font-bold font-mono', scoreColor(score.total))}>
            {score.total}
          </span>
          <span className="text-gray-400 text-sm">/ 100</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
          <div
            className={clsx(
              'h-full rounded-full transition-all duration-700',
              score.total >= 75
                ? 'bg-green-500'
                : score.total >= 55
                ? 'bg-yellow-400'
                : score.total >= 35
                ? 'bg-orange-500'
                : 'bg-red-500'
            )}
            style={{ width: `${score.total}%` }}
          />
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="space-y-1.5">
        <p className="text-xs text-gray-400 font-medium mb-2">점수 구성</p>
        <ScoreBar label="공포탐욕" value={score.fearGreed} max={25} />
        <ScoreBar label="변동성" value={score.vix} max={20} />
        <ScoreBar label="환율" value={score.exchangeRate} max={15} />
        <ScoreBar label="금리" value={score.interestRate} max={20} />
        <ScoreBar label="뉴스" value={score.news} max={20} />
      </div>

      {/* News */}
      {news.length > 0 && (
        <div>
          <p className="text-xs text-gray-400 font-medium mb-2">최신 뉴스</p>
          <ul className="space-y-1.5">
            {news.map((item, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span
                  className={clsx(
                    'text-xs mt-0.5 shrink-0',
                    sentimentStyle[item.sentiment]
                  )}
                >
                  {item.sentiment === 'positive'
                    ? '▲'
                    : item.sentiment === 'negative'
                    ? '▼'
                    : '●'}
                </span>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-600 hover:text-gray-900 line-clamp-2 leading-tight transition-colors"
                >
                  {item.title}
                  <ExternalLink size={10} className="inline ml-1 opacity-40" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      {news.length === 0 && (
        <p className="text-xs text-gray-300">뉴스를 불러오는 중...</p>
      )}
    </div>
  );
}
