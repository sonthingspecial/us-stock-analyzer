export interface FearGreedResponse {
  score: number;
  rating: string;
  timestamp: string;
  source: 'live' | 'fallback';
}

export interface MarketDataResponse {
  vix: number;
  spy: { price: number; changePercent: number };
  qqq: { price: number; changePercent: number };
  timestamp: string;
  source: 'live' | 'fallback';
}

export interface ExchangeRateResponse {
  usdKrw: number;
  timestamp: string;
  source: 'live' | 'fallback';
}

export interface InterestRateResponse {
  fedRate: number;
  lastChanged: string;
  trend: 'rising' | 'stable' | 'falling';
  source: 'fred' | 'static' | 'fallback';
}

export interface NewsItem {
  title: string;
  pubDate: string;
  link: string;
  sentiment: 'positive' | 'negative' | 'neutral';
}

export interface SectorNewsResponse {
  sector: SectorId;
  items: NewsItem[];
  sentimentScore: number;
  source: 'live' | 'fallback';
}

export interface SectorScoreBreakdown {
  fearGreed: number;
  vix: number;
  exchangeRate: number;
  interestRate: number;
  news: number;
  total: number;
}

export type RecommendationKey = 'strong-buy' | 'consider' | 'neutral' | 'avoid';

export interface Recommendation {
  key: RecommendationKey;
  labelKo: string;
  color: 'green' | 'yellow' | 'orange' | 'red';
  emoji: string;
}

export interface SectorAnalysis {
  id: SectorId;
  nameKo: string;
  nameEn: string;
  etf: string;
  icon: string;
  score: SectorScoreBreakdown;
  recommendation: Recommendation;
  news: NewsItem[];
  updatedAt: string;
}

export type SectorId =
  | 'technology'
  | 'healthcare'
  | 'financials'
  | 'energy'
  | 'consumer-discretionary'
  | 'consumer-staples'
  | 'industrials'
  | 'real-estate'
  | 'utilities'
  | 'materials'
  | 'communication-services';

export type FxSensitivity = 'positive' | 'negative' | 'neutral';
export type RateSensitivity =
  | 'positive-high'
  | 'negative-high'
  | 'negative-medium'
  | 'negative-low';

export interface SectorDefinition {
  nameKo: string;
  nameEn: string;
  etf: string;
  icon: string;
  fxSensitivity: FxSensitivity;
  rateSensitivity: RateSensitivity;
}
