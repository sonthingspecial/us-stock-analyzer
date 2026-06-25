import type {
  FearGreedResponse,
  MarketDataResponse,
  ExchangeRateResponse,
  InterestRateResponse,
  SectorNewsResponse,
  SectorAnalysis,
  SectorScoreBreakdown,
  Recommendation,
  SectorId,
} from '../types';
import { SECTORS, SECTOR_IDS } from '../constants/sectors';
import { fearGreedScore } from './fearGreedScore';
import { vixScore } from './vixScore';
import { exchangeRateScore } from './exchangeRateScore';
import { interestRateScore } from './interestRateScore';
import { newsScore } from './newsScore';
import { generateRationale } from './rationale';

function getRecommendation(total: number): Recommendation {
  if (total >= 75) return { key: 'strong-buy', labelKo: '강력 매수', color: 'green', emoji: '🟢' };
  if (total >= 55) return { key: 'consider', labelKo: '매수 고려', color: 'yellow', emoji: '🟡' };
  if (total >= 35) return { key: 'neutral', labelKo: '중립/관망', color: 'orange', emoji: '🟠' };
  return { key: 'avoid', labelKo: '진입 비추천', color: 'red', emoji: '🔴' };
}

function computeBreakdown(
  fearGreedData: FearGreedResponse,
  marketData: MarketDataResponse,
  fxData: ExchangeRateResponse,
  rateData: InterestRateResponse,
  newsData: SectorNewsResponse,
  sectorId: SectorId
): SectorScoreBreakdown {
  const sector = SECTORS[sectorId];
  const fearGreed = fearGreedScore(fearGreedData.score);
  const vix = vixScore(marketData.vix);
  const exchangeRate = exchangeRateScore(fxData.usdKrw, sector.fxSensitivity);
  const interestRate = interestRateScore(rateData, sector.rateSensitivity);
  const news = newsData.sentimentScore ?? newsScore(newsData.items);
  const total = fearGreed + vix + exchangeRate + interestRate + news;
  return { fearGreed, vix, exchangeRate, interestRate, news, total };
}

export function computeAllSectors(
  fearGreedData: FearGreedResponse,
  marketData: MarketDataResponse,
  fxData: ExchangeRateResponse,
  rateData: InterestRateResponse,
  newsMap: Partial<Record<SectorId, SectorNewsResponse>>
): SectorAnalysis[] {
  return SECTOR_IDS.map((id) => {
    const def = SECTORS[id];
    const newsData: SectorNewsResponse = newsMap[id] ?? {
      sector: id,
      items: [],
      sentimentScore: 10,
      source: 'fallback',
    };
    const score = computeBreakdown(fearGreedData, marketData, fxData, rateData, newsData, id);
    return {
      id,
      nameKo: def.nameKo,
      nameEn: def.nameEn,
      etf: def.etf,
      icon: def.icon,
      topStocks: def.topStocks,
      score,
      recommendation: getRecommendation(score.total),
      rationale: generateRationale(score),
      news: newsData.items.slice(0, 3),
      allNews: newsData.items,
      updatedAt: new Date().toISOString(),
    };
  }).sort((a, b) => b.score.total - a.score.total);
}
