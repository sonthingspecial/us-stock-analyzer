'use client';
import { RefreshCw, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Header() {
  const [rotating, setRotating] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
    const now = new Date();
    setLastUpdated(now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }));
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleRefresh = () => {
    setRotating(true);
    window.location.reload();
  };

  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h1 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
            <span>🏠</span>
            <span className="truncate">청약 정보 조회</span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5 hidden sm:block">
            오늘 이후 마감 청약 공고 · 실시간 조회
            {lastUpdated && <span className="ml-2 text-gray-400">· 업데이트: {lastUpdated}</span>}
          </p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title={isDark ? '라이트 모드' : '다크 모드'}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors px-2.5 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <RefreshCw size={14} className={rotating ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">새로고침</span>
          </button>
        </div>
      </div>
    </header>
  );
}
