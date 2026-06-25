'use client';
import { useParams, useRouter } from 'next/navigation';
import * as Icons from 'lucide-react';
import { ArrowLeft, ExternalLink, TrendingUp, TrendingDown } from 'lucide-react';
import { useSectorAnalysis } from '@/hooks/useSectorAnalysis';
import { useMarketData } from '@/hooks/useMarketData';
import { useExchangeRate } from '@/hooks/useExchangeRate';
import { useInterestRate } from '@/hooks/useInterestRate';
import { Badge } from '@/components/ui/Badge';
import { ScoreBar } from '@/components/sector/ScoreBar';
import type { SectorId, RationaleItem } from '@/lib/types';
import clsx from 'clsx';

const scoreColor = (t: number) =>
  t >= 75 ? 'text-green-600 dark:text-green-400' :
  t >= 55 ? 'text-yellow-600 dark:text-yellow-400' :
  t >= 35 ? 'text-orange-600 dark:text-orange-400' :
  'text-red-600 dark:text-red-400';

const sentimentStyle = {
  positive: { icon: '✓', cls: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400' },
  negative: { icon: '✗', cls: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400' },
  neutral:  { icon: '–', cls: 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400' },
};

function RationaleCard({ item }: { item: RationaleItem }) {
  const s = sentimentStyle[item.sentiment];
  return (
    <div className={clsx('flex items-start gap-2.5 px-3 py-2.5 rounded-lg border text-sm', s.cls)}>
      <span className="font-bold text-base shrink-0">{s.icon}</span>
      <div>
        <p className="font-semibold text-xs mb-0.5 opacity-70">{item.factor}</p>
        <p>{item.text}</p>
      </div>
    </div>
  );
}

export default function SectorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const sectorId = params.id as SectorId;

  const { sectors, isLoading } = useSectorAnalysis();
  const { market, fearGreed } = useMarketData();
  const { data: fx } = useExchangeRate();
  const { data: rate } = useInterestRate();

  const sector = sectors.find((s) => s.id === sectorId);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Icon = sector ? (Icons as any)[sector.icon] as React.ComponentType<{ size?: number; className?: string }> | undefined : undefined;

  if (isLoading || !sector) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-10 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-40 bg-gray-100 dark:bg-gray-800 rounded-xl" />
            <div className="h-40 bg-gray-100 dark:bg-gray-800 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  const { score, recommendation, rationale, allNews, topStocks, nameKo, nameEn, etf } = sector;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header bar */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => router.back()} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-2">
            {Icon && <Icon size={18} className="text-gray-500" />}
            <span className="font-semibold text-gray-900 dark:text-white">{nameKo}</span>
            <span className="text-gray-400 text-sm hidden sm:inline">{nameEn} · {etf}</span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">

        {/* Score overview */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">종합 투자 점수</p>
              <div className="flex items-baseline gap-2">
                <span className={clsx('text-5xl font-bold font-mono', scoreColor(score.total))}>{score.total}</span>
                <span className="text-gray-400 text-lg">/ 100</span>
              </div>
            </div>
            <Badge recommendationKey={recommendation.key} label={recommendation.labelKo} emoji={recommendation.emoji} />
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3 overflow-hidden">
            <div className={clsx('h-full rounded-full transition-all duration-700',
              score.total >= 75 ? 'bg-green-500' : score.total >= 55 ? 'bg-yellow-400' : score.total >= 35 ? 'bg-orange-500' : 'bg-red-500'
            )} style={{ width: `${score.total}%` }} />
          </div>

          {/* Live market context */}
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {market && (
              <>
                <div>
                  <p className="text-gray-400 mb-0.5">VIX</p>
                  <p className="font-bold font-mono text-gray-900 dark:text-white">{market.vix.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-0.5">S&amp;P 500</p>
                  <div className="flex items-center gap-1">
                    <p className="font-bold font-mono text-gray-900 dark:text-white">${market.spy.price.toLocaleString()}</p>
                    <span className={market.spy.changePercent >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}>
                      {market.spy.changePercent >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                    </span>
                  </div>
                </div>
              </>
            )}
            {fx && (
              <div>
                <p className="text-gray-400 mb-0.5">USD/KRW</p>
                <p className="font-bold font-mono text-gray-900 dark:text-white">₩{fx.usdKrw.toLocaleString()}</p>
              </div>
            )}
            {fearGreed && (
              <div>
                <p className="text-gray-400 mb-0.5">공포탐욕</p>
                <p className="font-bold font-mono text-gray-900 dark:text-white">{fearGreed.score} / 100</p>
              </div>
            )}
          </div>
        </div>

        {/* Score breakdown with descriptions */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">점수 구성 상세</h3>
          <div className="space-y-3">
            <ScoreBar label="공포탐욕" value={score.fearGreed} max={25} description={`CNN Fear & Greed Index — 현재 시장 심리 반영 (배점 25점)`} />
            <ScoreBar label="변동성" value={score.vix} max={20} description={`VIX 지수 기반 시장 안정성 평가 (배점 20점)`} />
            <ScoreBar label="환율" value={score.exchangeRate} max={15} description={`USD/KRW 수준 + 섹터별 달러 민감도 반영 (배점 15점)`} />
            <ScoreBar label="금리" value={score.interestRate} max={20} description={`미국 기준금리 수준·추세 + 섹터별 금리 민감도 반영 (배점 20점)`} />
            <ScoreBar label="뉴스" value={score.news} max={20} description={`최신 Google News 키워드 감성 분석 (배점 20점)`} />
          </div>
        </div>

        {/* Investment rationale */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            {recommendation.emoji} {recommendation.labelKo} 근거
          </h3>
          <div className="space-y-2">
            {rationale.map((item, i) => <RationaleCard key={i} item={item} />)}
          </div>
        </div>

        {/* Representative stocks */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">대표 종목</h3>
          <div className="flex gap-3 flex-wrap">
            {topStocks.map((ticker) => (
              <a
                key={ticker}
                href={`https://finance.yahoo.com/quote/${ticker}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-mono font-bold text-gray-800 dark:text-gray-200 transition-colors"
              >
                {ticker}
                <ExternalLink size={11} className="opacity-40" />
              </a>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2">Yahoo Finance에서 실시간 주가 확인</p>
        </div>

        {/* All news */}
        {allNews.length > 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              최신 뉴스 <span className="font-normal text-gray-400">({allNews.length}개)</span>
            </h3>
            <ul className="space-y-3">
              {allNews.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 pb-3 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0">
                  <span className={clsx('text-xs mt-0.5 shrink-0 font-bold',
                    item.sentiment === 'positive' ? 'text-green-600 dark:text-green-400' :
                    item.sentiment === 'negative' ? 'text-red-500 dark:text-red-400' : 'text-gray-400'
                  )}>
                    {item.sentiment === 'positive' ? '▲' : item.sentiment === 'negative' ? '▼' : '●'}
                  </span>
                  <div className="min-w-0">
                    <a href={item.link} target="_blank" rel="noopener noreferrer"
                      className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors leading-snug">
                      {item.title}
                      <ExternalLink size={10} className="inline ml-1 opacity-40" />
                    </a>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {new Date(item.pubDate).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Rate info footer */}
        {rate && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-xs text-blue-700 dark:text-blue-400">
            <p className="font-semibold mb-1">📌 점수 산정 기준</p>
            <p>기준금리 {rate.fedRate}% ({rate.trend === 'falling' ? '인하 추세' : rate.trend === 'rising' ? '인상 추세' : '동결'}) 환경에서 이 섹터의 금리 민감도를 반영하였습니다. 점수는 실시간 데이터를 기반으로 자동 계산됩니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
