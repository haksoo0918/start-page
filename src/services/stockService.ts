import { STOCK_DATA, StockItem } from '../data/stockData';

// 7대 자산의 Yahoo Finance 티커 매핑
const TICKER_MAP: Record<string, string> = {
  'KOSPI': '^KS11',
  'KOSDAQ': '^KQ11',
  'SPX': '^GSPC',
  'IXIC': '^IXIC',
  'TLT': 'TLT',
  'GOLD': 'GC=F',
  'BTC': 'BTC-USD'
};

/**
 * 개별 종목의 실시간 시세 및 1D 차트 데이터를 조회합니다.
 */
export async function fetchStockData(symbolKey: string): Promise<StockItem> {
  const fallback = STOCK_DATA[symbolKey] || STOCK_DATA['KOSPI'];
  const ticker = TICKER_MAP[symbolKey];

  if (!ticker) return fallback;

  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?range=1d&interval=30m`;
    const res = await fetch(url);
    
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const result = data?.chart?.result?.[0];

    if (!result || !result.meta) {
      throw new Error('올바르지 않은 차트 데이터 형식입니다');
    }

    const meta = result.meta;
    const currentPrice = meta.regularMarketPrice ?? meta.chartPreviousClose;
    const previousClose = meta.previousClose ?? meta.chartPreviousClose;
    const change = currentPrice - previousClose;
    const changePercent = (change / previousClose) * 100;
    const isPositive = change >= 0;

    // 1D 타임스탬프 및 시세 데이터 가공 (30분 간격, 약 14포인트)
    const timestamps: number[] = result.timestamp || [];
    const quotes: number[] = result.indicators?.quote?.[0]?.close || [];
    const history1D: { time: string; value: number }[] = [];

    for (let i = 0; i < timestamps.length; i++) {
      if (quotes[i] !== null && quotes[i] !== undefined) {
        const d = new Date(timestamps[i] * 1000);
        const timeStr = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
        history1D.push({
          time: timeStr,
          value: Number(quotes[i].toFixed(2))
        });
      }
    }

    // 가격 포맷팅 (달러 표기 등)
    let formattedPrice = currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (symbolKey === 'TLT' || symbolKey === 'GOLD' || symbolKey === 'BTC') {
      formattedPrice = `$${formattedPrice}`;
    }

    return {
      ...fallback,
      price: formattedPrice,
      change: `${isPositive ? '+' : ''}${change.toFixed(2)}`,
      changePercent: `${isPositive ? '+' : ''}${changePercent.toFixed(2)}%`,
      isPositive,
      history: {
        ...fallback.history,
        '1D': history1D.length >= 10 ? history1D : fallback.history['1D']
      }
    };
  } catch (err) {
    // API 호출 실패 시 사전 계산된 Mock 데이터로 안전한 Fallback
    return fallback;
  }
}

/**
 * 7대 전체 자산 시세를 병렬로 조회합니다.
 */
export async function fetchAllStocks(): Promise<Record<string, StockItem>> {
  const keys = Object.keys(STOCK_DATA);
  const results: Record<string, StockItem> = {};

  await Promise.all(
    keys.map(async (key) => {
      results[key] = await fetchStockData(key);
    })
  );

  return results;
}
