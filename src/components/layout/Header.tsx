'use client';
import { RefreshCw } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const [rotating, setRotating] = useState(false);

  const handleRefresh = () => {
    setRotating(true);
    window.location.reload();
  };

  return (
    <header className="border-b border-gray-200 bg-white/90 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span className="text-blue-600">📊</span>
            미국 주식 섹터 분석
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            한국 투자자를 위한 실시간 투자 타이밍 분석
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100"
        >
          <RefreshCw size={14} className={rotating ? 'animate-spin' : ''} />
          새로고침
        </button>
      </div>
    </header>
  );
}
