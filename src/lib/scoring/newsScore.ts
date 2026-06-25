import type { NewsItem } from '../types';

const POSITIVE_KEYWORDS = [
  'surge', 'rally', 'beat', 'record', 'growth', 'upgrade', 'bullish',
  'strong', 'innovation', 'expansion', 'deal', 'partnership', 'rise',
  'gains', 'profit', 'outperform', 'breakout', 'recovery', 'rebound',
  'boost', 'soar', 'jump', 'climb',
];

const NEGATIVE_KEYWORDS = [
  'crash', 'plunge', 'miss', 'recession', 'layoff', 'downgrade', 'bearish',
  'weak', 'loss', 'bankruptcy', 'tariff', 'sanction', 'regulation', 'decline',
  'fall', 'slump', 'warning', 'risk', 'concern', 'fears', 'volatile',
  'tumble', 'drop', 'sell-off', 'selloff',
];

function scoreItem(title: string): number {
  const text = title.toLowerCase();
  const pos = POSITIVE_KEYWORDS.filter(k => text.includes(k)).length;
  const neg = NEGATIVE_KEYWORDS.filter(k => text.includes(k)).length;
  return pos - neg;
}

export function getSentiment(title: string): 'positive' | 'negative' | 'neutral' {
  const s = scoreItem(title);
  if (s > 0) return 'positive';
  if (s < 0) return 'negative';
  return 'neutral';
}

export function newsScore(items: NewsItem[]): number {
  if (items.length === 0) return 10;
  const rawTotal = items.slice(0, 10).reduce((sum, item) => sum + scoreItem(item.title), 0);
  return Math.max(0, Math.min(20, 10 + Math.round(rawTotal * 1.5)));
}
