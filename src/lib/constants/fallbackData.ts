import type {
  FearGreedResponse,
  MarketDataResponse,
  ExchangeRateResponse,
  InterestRateResponse,
} from '../types';

export const FALLBACK_FEAR_GREED: FearGreedResponse = {
  score: 50,
  rating: 'Neutral',
  timestamp: new Date().toISOString(),
  source: 'fallback',
};

export const FALLBACK_MARKET: MarketDataResponse = {
  vix: 20,
  spy: { price: 0, changePercent: 0 },
  qqq: { price: 0, changePercent: 0 },
  timestamp: new Date().toISOString(),
  source: 'fallback',
};

export const FALLBACK_EXCHANGE_RATE: ExchangeRateResponse = {
  usdKrw: 1380,
  timestamp: new Date().toISOString(),
  source: 'fallback',
};

// 2025년 1월 기준 미국 기준금리 4.33% (FOMC 결정)
// FRED API 키가 없으면 이 값이 사용됩니다
export const FALLBACK_INTEREST_RATE: InterestRateResponse = {
  fedRate: 4.33,
  lastChanged: '2025-01-29',
  trend: 'falling',
  source: 'static',
};
