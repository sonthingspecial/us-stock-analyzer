import type { SectorId } from '../types';

export const ETF_MAP: Record<SectorId, [string, string]> = {
  'technology':               ['QQQ',  'XLK'],
  'healthcare':               ['XLV',  'IBB'],
  'financials':               ['XLF',  'KRE'],
  'energy':                   ['XLE',  'UCO'],
  'consumer-discretionary':   ['XLY',  'VCR'],
  'consumer-staples':         ['XLP',  'VDC'],
  'industrials':              ['XLI',  'VIS'],
  'real-estate':              ['VNQ',  'XLRE'],
  'utilities':                ['XLU',  'VPU'],
  'materials':                ['XLB',  'GLD'],
  'communication-services':   ['XLC',  'VOX'],
};
