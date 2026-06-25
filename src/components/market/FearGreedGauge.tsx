'use client';
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts';
import { useMarketData } from '@/hooks/useMarketData';

function getColor(score: number) {
  if (score <= 24) return '#ef4444';
  if (score <= 44) return '#f97316';
  if (score <= 54) return '#eab308';
  if (score <= 74) return '#84cc16';
  return '#22c55e';
}

function getRatingKo(score: number) {
  if (score <= 24) return '극단적 공포';
  if (score <= 44) return '공포';
  if (score <= 54) return '중립';
  if (score <= 74) return '탐욕';
  return '극단적 탐욕';
}

export function FearGreedGauge() {
  const { fearGreed, isLoading } = useMarketData();

  const score = fearGreed?.score ?? 50;
  const color = getColor(score);
  const ratingKo = getRatingKo(score);

  const data = [{ value: score, fill: color }];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h2 className="text-sm text-gray-600 mb-1 font-medium">공포·탐욕 지수</h2>
      <p className="text-xs text-gray-400 mb-4">
        CNN Fear &amp; Greed Index — 시장 심리 종합 지표
      </p>

      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="relative w-64 h-36">
          {isLoading ? (
            <div className="w-full h-full bg-gray-100 rounded animate-pulse" />
          ) : (
            <>
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%"
                  cy="90%"
                  innerRadius="60%"
                  outerRadius="100%"
                  startAngle={180}
                  endAngle={0}
                  data={data}
                >
                  <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                  <RadialBar
                    background={{ fill: '#f3f4f6' }}
                    dataKey="value"
                    cornerRadius={6}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
                <span className="text-4xl font-bold font-mono" style={{ color }}>
                  {score}
                </span>
                <span className="text-sm font-medium" style={{ color }}>
                  {ratingKo}
                </span>
              </div>
            </>
          )}
        </div>

        <div className="flex-1 space-y-3 text-sm">
          <p className="text-gray-700 font-medium">공포탐욕지수란?</p>
          <p className="text-gray-500 text-xs leading-relaxed">
            CNN Money가 발표하는 시장 심리 지표로, 주가 모멘텀·시장 변동성·
            안전자산 수요 등 7가지 요인을 종합해 0~100으로 표현합니다.
          </p>
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            {[
              { range: '0–24', label: '극단적 공포', color: 'text-red-500', hint: '과매도 가능성' },
              { range: '25–44', label: '공포', color: 'text-orange-500', hint: '매수 기회 탐색' },
              { range: '45–54', label: '중립', color: 'text-yellow-500', hint: '방향성 불확실' },
              { range: '55–74', label: '탐욕', color: 'text-lime-600', hint: '상승 모멘텀' },
              { range: '75–100', label: '극단적 탐욕', color: 'text-green-600', hint: '과매수 주의' },
            ].map((item) => (
              <div key={item.range} className="flex items-center gap-1.5">
                <span className={`font-bold ${item.color}`}>{item.range}</span>
                <span className="text-gray-600">{item.label}</span>
                <span className="text-gray-400">({item.hint})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
