export function ErrorBanner({ sources }: { sources: string[] }) {
  if (sources.length === 0) return null;
  return (
    <div className="mx-4 mt-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700 rounded-lg text-amber-700 dark:text-amber-400 text-sm flex items-start gap-2">
      <span className="shrink-0 mt-0.5">⚠</span>
      <span>
        일부 데이터를 실시간으로 불러오지 못했습니다: <strong>{sources.join(', ')}</strong>. 보수적 기본값을 사용 중입니다.
      </span>
    </div>
  );
}
