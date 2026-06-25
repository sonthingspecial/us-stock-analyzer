import type { RecommendationKey } from '@/lib/types';

const styles: Record<RecommendationKey, string> = {
  'strong-buy': 'bg-green-100 text-green-700 border border-green-300',
  consider: 'bg-yellow-100 text-yellow-700 border border-yellow-300',
  neutral: 'bg-orange-100 text-orange-700 border border-orange-300',
  avoid: 'bg-red-100 text-red-700 border border-red-300',
};

interface BadgeProps {
  recommendationKey: RecommendationKey;
  label: string;
  emoji: string;
}

export function Badge({ recommendationKey, label, emoji }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${styles[recommendationKey]}`}
    >
      {emoji} {label}
    </span>
  );
}
