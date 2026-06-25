import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = {
  title: '미국 주식 섹터 분석',
  description: '한국 투자자를 위한 미국 주식 섹터별 투자 타이밍 분석 — VIX, 환율, 기준금리, 공포탐욕지수 종합',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        {/* 다크모드 깜빡임 방지: 렌더링 전에 테마 적용 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme');if(t==='dark')document.documentElement.classList.add('dark');else document.documentElement.classList.remove('dark');}catch(e){}`,
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100`}>
        {children}
      </body>
    </html>
  );
}
