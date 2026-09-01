import { STOCK_DATA, StockItem } from '../data/stockData';

// Yahoo Finance Ticker Mapping for 7 assets
const TICKER_MAP: Record<string, string> = {
  'KOSPI': '^KS11',
  'KOSDAQ': '^KQ11',
  'SPX': '^GSPC',
  'IXIC': '^IXIC',
  'TLT': 'TLT',
  'GOLD': 'GC=F',
  'BTC': 'BTC-USD'
};

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
      throw new Error('Invalid chart data format');
    }

    const meta = result.meta;
    const currentPrice = meta.regularMarketPrice ?? meta.chartPreviousClose;
    const previousClose = meta.previousClose ?? meta.chartPreviousClose;
    const change = currentPrice - previousClose;
    const changePercent = (change / previousClose) * 100;
    const isPositive = change >= 0;

    // Parse 1D timestamps & quotes (30-min interval, ~14 points)
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

    // Format price
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
    // Graceful fallback to pre-calculated balanced dataset
    return fallback;
  }
}

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
