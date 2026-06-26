import { Header } from '@/components/layout/Header';
import { MarketBar } from '@/components/market/MarketBar';
import { FearGreedGauge } from '@/components/market/FearGreedGauge';
import { RecommendedETFs } from '@/components/market/RecommendedETFs';
import { SectorGrid } from '@/components/sector/SectorGrid';

export default function Home() {
  return (
    <>
      <Header />
      <MarketBar />

      <main className="max-w-7xl mx-auto">
        <div className="px-4 py-4">
          <FearGreedGauge />
        </div>
        <RecommendedETFs />
        <SectorGrid />
      </main>

      <footer className="border-t border-gray-200 mt-8 py-6 text-center bg-gray-50">
        <p className="text-xs text-gray-500">
          ⚠ 본 사이트는 투자 참고용이며, 투자 권유나 금융 조언이 아닙니다. 모든 투자의 책임은 투자자 본인에게 있습니다.
        </p>
        <p className="text-xs text-gray-400 mt-1">
          데이터 출처: CNN Fear &amp; Greed · Yahoo Finance · ExchangeRate-API · Google News
        </p>
      </footer>
    </>
  );
}
