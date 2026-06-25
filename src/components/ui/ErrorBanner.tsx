interface ErrorBannerProps {
  sources: string[];
}

export function ErrorBanner({ sources }: ErrorBannerProps) {
  if (sources.length === 0) return null;
  return (
    <div className="mx-4 mt-2 px-4 py-2 bg-amber-50 border border-amber-300 rounded-lg text-amber-700 text-sm flex items-center gap-2">
      <span>⚠</span>
      <span>
        일부 데이터를 실시간으로 불러오지 못했습니다:{' '}
        <strong>{sources.join(', ')}</strong>. 보수적 기본값을 사용 중입니다.
      </span>
    </div>
  );
}
