'use client';

import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { ChevronDown, ChevronUp, MapPin, Calendar, Home as HomeIcon, AlertCircle } from 'lucide-react';
import type { AptItem } from '@/app/api/apt/schedule/route';

const REGIONS = [
  '전국', '서울', '경기', '인천', '부산', '대구', '대전', '광주', '울산', '세종',
  '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주',
];

const APT_TYPES = ['공공분양', '민간분양', '공공임대', '민간임대'];

const BRANDS = ['래미안', '힐스테이트', '푸르지오', '자이', '더샵', '아이파크', '롯데캐슬'];

const SCHEDULE_OPTIONS = [
  { label: '1주', weeks: 1 },
  { label: '2주', weeks: 2 },
  { label: '1개월', weeks: 4 },
  { label: '3개월', weeks: 13 },
];

const CONTRACT_RATES = [10, 15, 20];

function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(dateStr);
  return Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '-';
  return dateStr.replace(/-/g, '.');
}

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 animate-pulse">
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3" />
      <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-1/2 mb-2" />
      <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-2/3 mb-4" />
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
    </div>
  );
}

function AptCard({ item }: { item: AptItem }) {
  const daysLeft = daysUntil(item.receiptEnd);
  const isUrgent = daysLeft >= 0 && daysLeft <= 7;

  const typeColor: Record<string, string> = {
    공공분양: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    민간분양: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
    공공임대: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
    민간임대: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  };

  const matchedType = Object.keys(typeColor).find((t) => item.type.includes(t)) ?? '';

  return (
    <a
      href={item.url || 'https://www.applyhome.co.kr'}
      target="_blank"
      rel="noopener noreferrer"
      className={`block bg-white dark:bg-gray-900 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer
        ${isUrgent
          ? 'border-2 border-red-400 dark:border-red-500'
          : 'border border-gray-200 dark:border-gray-800'
        }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-snug line-clamp-2 flex-1">
          {item.name}
        </h3>
        {isUrgent && (
          <span className="shrink-0 text-xs font-semibold bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400 px-2 py-0.5 rounded-full">
            마감임박
          </span>
        )}
      </div>

      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-1">
        <MapPin size={11} />
        <span>{item.region}</span>
        {item.address && <span className="truncate">· {item.address}</span>}
      </div>

      {item.supplyCount && (
        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-3">
          <HomeIcon size={11} />
          <span>공급 {item.supplyCount}세대</span>
        </div>
      )}

      <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300 mb-3">
        <Calendar size={11} />
        <span>청약</span>
        <span className="font-medium">{formatDate(item.receiptStart)}</span>
        <span>~</span>
        <span className={`font-medium ${isUrgent ? 'text-red-500 dark:text-red-400' : ''}`}>
          {formatDate(item.receiptEnd)}
        </span>
        {daysLeft >= 0 && (
          <span className={`ml-1 ${isUrgent ? 'text-red-500 dark:text-red-400 font-semibold' : 'text-gray-400'}`}>
            (D-{daysLeft})
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {matchedType && (
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColor[matchedType]}`}>
            {matchedType}
          </span>
        )}
        {item.brand && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 font-medium">
            {item.brand}
          </span>
        )}
      </div>
    </a>
  );
}

export default function Home() {
  const [region, setRegion] = useState('전국');
  const [capital, setCapital] = useState('');
  const [loan, setLoan] = useState('');
  const [contractRate, setContractRate] = useState(10);
  const [financeOpen, setFinanceOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [scheduleWeeks, setScheduleWeeks] = useState<number | null>(null);
  const [items, setItems] = useState<AptItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const affordablePrice = (Number(capital) || 0) + (Number(loan) || 0);
  const downPaymentNeeded = affordablePrice > 0 ? Math.round(affordablePrice * (contractRate / 100)) : 0;

  const toggleType = (t: string) =>
    setSelectedTypes((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  const toggleBrand = (b: string) =>
    setSelectedBrands((prev) => (prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]));

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (region !== '전국') params.set('region', region);
      if (affordablePrice > 0) params.set('maxPrice', String(affordablePrice));
      if (selectedTypes.length > 0) params.set('types', selectedTypes.join(','));
      if (selectedBrands.length > 0) params.set('brands', selectedBrands.join(','));
      if (scheduleWeeks) params.set('weeks', String(scheduleWeeks));

      const res = await fetch(`/api/apt/schedule?${params.toString()}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? '조회 실패');
      setItems(json.items ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : '알 수 없는 오류');
    } finally {
      setLoading(false);
    }
  }, [region, affordablePrice, selectedTypes, selectedBrands, scheduleWeeks]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            🏠 청약 정보 조회
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            오늘 이후 청약 접수 마감인 분양·임대 공고를 조회합니다
          </p>
        </div>

        {/* 필터 패널 */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 mb-6 space-y-4">
          {/* 지역 */}
          <div>
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5 block uppercase tracking-wide">
              지역
            </label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full sm:w-48 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {REGIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* 자금 조건 아코디언 */}
          <div className="border border-gray-100 dark:border-gray-800 rounded-lg overflow-hidden">
            <button
              onClick={() => setFinanceOpen((v) => !v)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800/50 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <span>💰 자금 조건 설정</span>
              <div className="flex items-center gap-2">
                {affordablePrice > 0 && (
                  <span className="text-xs font-normal text-blue-600 dark:text-blue-400">
                    감당 가능 분양가: {affordablePrice.toLocaleString()}만원
                  </span>
                )}
                {financeOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </button>

            {financeOpen && (
              <div className="px-4 py-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
                      보유 자본금 (만원)
                    </label>
                    <input
                      type="number"
                      value={capital}
                      onChange={(e) => setCapital(e.target.value)}
                      placeholder="예: 5000"
                      className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
                      예상 대출가능액 (만원)
                    </label>
                    <input
                      type="number"
                      value={loan}
                      onChange={(e) => setLoan(e.target.value)}
                      placeholder="예: 30000"
                      className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400 mb-1.5 block">
                    계약금 비율
                  </label>
                  <div className="flex gap-2">
                    {CONTRACT_RATES.map((rate) => (
                      <button
                        key={rate}
                        onClick={() => setContractRate(rate)}
                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors
                          ${contractRate === rate
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                          }`}
                      >
                        {rate}%
                      </button>
                    ))}
                  </div>
                </div>

                {affordablePrice > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg px-4 py-3">
                      <p className="text-xs text-blue-600 dark:text-blue-400 mb-0.5">감당 가능 분양가 상한</p>
                      <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
                        {affordablePrice.toLocaleString()}만원
                      </p>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg px-4 py-3">
                      <p className="text-xs text-orange-600 dark:text-orange-400 mb-0.5">
                        계약금 필요 금액 ({contractRate}%)
                      </p>
                      <p className="text-lg font-bold text-orange-700 dark:text-orange-300">
                        {downPaymentNeeded.toLocaleString()}만원
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 청약 유형 */}
          <div>
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5 block uppercase tracking-wide">
              청약 유형
            </label>
            <div className="flex flex-wrap gap-2">
              {APT_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => toggleType(t)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                    ${selectedTypes.includes(t)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* 브랜드 */}
          <div>
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5 block uppercase tracking-wide">
              브랜드
            </label>
            <div className="flex flex-wrap gap-2">
              {BRANDS.map((b) => (
                <button
                  key={b}
                  onClick={() => toggleBrand(b)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                    ${selectedBrands.includes(b)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* 일정 필터 */}
          <div>
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5 block uppercase tracking-wide">
              청약 마감 일정
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setScheduleWeeks(null)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                  ${scheduleWeeks === null
                    ? 'bg-gray-700 dark:bg-gray-200 text-white dark:text-gray-900'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
              >
                전체
              </button>
              {SCHEDULE_OPTIONS.map(({ label, weeks }) => (
                <button
                  key={weeks}
                  onClick={() => setScheduleWeeks(weeks)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                    ${scheduleWeeks === weeks
                      ? 'bg-gray-700 dark:bg-gray-200 text-white dark:text-gray-900'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 결과 */}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 mb-4 text-sm text-red-600 dark:text-red-400">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-4xl mb-3">🏘️</span>
            <p className="text-gray-500 dark:text-gray-400 font-medium">조건에 맞는 청약이 없어요</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              필터 조건을 변경하거나 전체 기간으로 조회해 보세요
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              총 <span className="font-semibold text-gray-900 dark:text-white">{items.length}</span>건
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => (
                <AptCard key={item.id} item={item} />
              ))}
            </div>
          </>
        )}

        <footer className="border-t border-gray-200 dark:border-gray-800 mt-10 pt-6 text-center">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            데이터 출처: 공공데이터포털 청약홈 분양정보 조회 서비스 · 10분 캐시 적용
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            실제 청약 신청은{' '}
            <a
              href="https://www.applyhome.co.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-600 dark:hover:text-gray-300"
            >
              청약홈
            </a>
            에서 확인하세요
          </p>
        </footer>
      </main>
    </>
  );
}
