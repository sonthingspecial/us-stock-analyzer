import { NextRequest, NextResponse } from 'next/server';

export const revalidate = 600;

interface RawItem {
  HOUSE_NM?: string;
  SUBSCRPT_AREA_CODE_NM?: string;
  SUBSCRPT_AREA_CODE?: string;
  RCRIT_PBLANC_DE?: string;
  RCEPT_BGNDE?: string;
  RCEPT_ENDDE?: string;
  PRZWNER_PRESNATN_DE?: string;
  CNTRCT_CNCLS_BGNDE?: string;
  CNTRCT_CNCLS_ENDDE?: string;
  HSSPLY_ADRES?: string;
  TOT_SUPLY_HSHLDCO?: string;
  LTTOT_TOP_DE?: string;
  PBLANC_URL?: string;
  HOUSE_SECD_NM?: string;
  BSNS_MBY_NM?: string;
  [key: string]: string | undefined;
}

export interface AptItem {
  id: string;
  name: string;
  region: string;
  regionCode: string;
  address: string;
  supplyCount: string;
  receiptStart: string;
  receiptEnd: string;
  announceDate: string;
  winnerDate: string;
  contractStart: string;
  contractEnd: string;
  type: string;
  brand: string;
  url: string;
}

const BRAND_KEYWORDS: Record<string, string[]> = {
  래미안: ['래미안'],
  힐스테이트: ['힐스테이트'],
  푸르지오: ['푸르지오'],
  자이: ['자이'],
  더샵: ['더샵'],
  아이파크: ['아이파크'],
  롯데캐슬: ['롯데캐슬'],
};

function detectBrand(name: string): string {
  for (const [brand, keywords] of Object.entries(BRAND_KEYWORDS)) {
    if (keywords.some((k) => name.includes(k))) return brand;
  }
  return '';
}

function toDateStr(raw?: string): string {
  if (!raw) return '';
  const s = String(raw).replace(/-/g, '');
  if (s.length === 8) return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
  return raw;
}

function isAfterToday(dateStr: string): boolean {
  if (!dateStr) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(dateStr);
  return d >= today;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const region = searchParams.get('region') || '';
  const types = searchParams.get('types')?.split(',').filter(Boolean) ?? [];
  const brands = searchParams.get('brands')?.split(',').filter(Boolean) ?? [];
  const weeks = searchParams.get('weeks') ? Number(searchParams.get('weeks')) : null;

  const apiKey = process.env.PUBLIC_DATA_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  try {
    const url = new URL(
      'https://api.odcloud.kr/api/ApplyhomeInfoDetailSvc/v1/getAPTLttotPblancDetail'
    );
    url.searchParams.set('page', '1');
    url.searchParams.set('perPage', '100');
    url.searchParams.set('serviceKey', apiKey);

    const res = await fetch(url.toString(), { next: { revalidate: 600 } });
    if (!res.ok) throw new Error(`upstream ${res.status}`);

    const json = await res.json();
    const rawItems: RawItem[] = json.data ?? [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let deadlineDate: Date | null = null;
    if (weeks) {
      deadlineDate = new Date(today);
      deadlineDate.setDate(today.getDate() + weeks * 7);
    }

    const items: AptItem[] = rawItems
      .map((item, idx): AptItem => ({
        id: String(idx),
        name: item.HOUSE_NM ?? '',
        region: item.SUBSCRPT_AREA_CODE_NM ?? '',
        regionCode: item.SUBSCRPT_AREA_CODE ?? '',
        address: item.HSSPLY_ADRES ?? '',
        supplyCount: item.TOT_SUPLY_HSHLDCO ?? '',
        receiptStart: toDateStr(item.RCEPT_BGNDE),
        receiptEnd: toDateStr(item.RCEPT_ENDDE),
        announceDate: toDateStr(item.RCRIT_PBLANC_DE),
        winnerDate: toDateStr(item.PRZWNER_PRESNATN_DE),
        contractStart: toDateStr(item.CNTRCT_CNCLS_BGNDE),
        contractEnd: toDateStr(item.CNTRCT_CNCLS_ENDDE),
        type: item.HOUSE_SECD_NM ?? '',
        brand: detectBrand(item.HOUSE_NM ?? ''),
        url: item.PBLANC_URL ?? 'https://www.applyhome.co.kr',
      }))
      .filter((item) => {
        if (!isAfterToday(item.receiptEnd)) return false;
        if (region && !item.region.includes(region)) return false;
        if (types.length > 0 && !types.some((t) => item.type.includes(t))) return false;
        if (brands.length > 0 && !brands.includes(item.brand)) return false;
        if (deadlineDate) {
          const end = new Date(item.receiptEnd);
          if (end > deadlineDate) return false;
        }
        return true;
      })
      .sort((a, b) => (a.receiptEnd > b.receiptEnd ? 1 : -1));

    return NextResponse.json({ items });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'unknown';
    return NextResponse.json({ error: msg, items: [] }, { status: 500 });
  }
}
