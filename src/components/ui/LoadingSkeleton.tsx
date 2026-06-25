export function CardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 animate-pulse shadow-sm">
      <div className="flex justify-between mb-4">
        <div className="h-5 w-24 bg-gray-200 rounded" />
        <div className="h-5 w-16 bg-gray-200 rounded-full" />
      </div>
      <div className="h-8 w-20 bg-gray-200 rounded mb-3" />
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-3 bg-gray-100 rounded" />
        ))}
      </div>
      <div className="mt-4 space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-3 bg-gray-100 rounded w-full" />
        ))}
      </div>
    </div>
  );
}

export function MarketBarSkeleton() {
  return (
    <div className="flex gap-6 px-6 py-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-3 w-12 bg-gray-200 rounded mb-1" />
          <div className="h-5 w-20 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  );
}
