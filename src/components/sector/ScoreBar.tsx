interface ScoreBarProps {
  label: string;
  value: number;
  max: number;
  color?: string;
}

export function ScoreBar({ label, value, max, color }: ScoreBarProps) {
  const pct = Math.round((value / max) * 100);
  const barColor =
    color ??
    (pct >= 70
      ? 'bg-green-500'
      : pct >= 50
      ? 'bg-yellow-400'
      : pct >= 30
      ? 'bg-orange-500'
      : 'bg-red-400');

  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-gray-400 w-16 shrink-0">{label}</span>
      <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-gray-500 font-mono w-10 text-right shrink-0">
        {value}/{max}
      </span>
    </div>
  );
}
