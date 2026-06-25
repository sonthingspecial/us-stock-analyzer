import type { RecommendationKey } from '@/lib/types';

const styles: Record<RecommendationKey, string> = {
  'strong-buy': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-700',
  consider:     'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border border-yellow-300 dark:border-yellow-700',
  neutral:      'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border border-orange-300 dark:border-orange-700',
  avoid:        'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-700',
};

export function Badge({ recommendationKey, label, emoji }: { recommendationKey: RecommendationKey; label: string; emoji: string }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${styles[recommendationKey]}`}>
      {emoji} {label}
    </span>
  );
}
