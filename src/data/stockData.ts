export interface StockItem {
  symbol: string;
  name: string;
  price: string;
  change: string;
  changePercent: string;
  isPositive: boolean;
  unit: string;
  marketType: 'KR' | 'US' | 'CRYPTO_24H';
  history: {
    '1D': { time: string; value: number }[];
    '1W': { time: string; value: number }[];
    '1M': { time: string; value: number }[];
    '1Y': { time: string; value: number }[];
  };
}

// 1. 1D Labels by Market
const D1_KR_LABELS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '15:30'];
const D1_US_LABELS = ['09:30', '10:30', '11:30', '12:30', '13:30', '14:30', '15:30', '16:00'];
const D1_CRYPTO_LABELS = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00', '24:00'];

// 2. 1W Labels (Business Days for KR/US, 7 Days for Crypto)
function getTrailingWeekLabels(isCrypto = false): string[] {
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const now = new Date();
  const targetCount = isCrypto ? 7 : 5;
  const temp: string[] = [];
  let count = 0;
  let offset = 0;

  while (count < targetCount && offset < 14) {
    const d = new Date(now);
    d.setDate(now.getDate() - offset);
    const dayOfWeek = d.getDay();
    if (isCrypto || (dayOfWeek !== 0 && dayOfWeek !== 6)) {
      const month = d.getMonth() + 1;
      const date = d.getDate();
      const dayName = dayNames[dayOfWeek];
      temp.push(`${month}/${date}(${dayName})`);
      count++;
    }
    offset++;
  }
  return temp.reverse();
}

// 3. 1M Labels (Daily: Business days for KR/US, 30 days for Crypto)
function getTrailingMonthLabels(isCrypto = false): string[] {
  const now = new Date();
  const temp: string[] = [];
  const targetCount = isCrypto ? 30 : 20;
  let count = 0;
  let offset = 0;

  while (count < targetCount && offset < 45) {
    const d = new Date(now);
    d.setDate(now.getDate() - offset);
    const dayOfWeek = d.getDay();
    if (isCrypto || (dayOfWeek !== 0 && dayOfWeek !== 6)) {
      const month = d.getMonth() + 1;
      const date = d.getDate();
      temp.push(offset === 0 ? `${month}/${date}(오늘)` : `${month}/${date}`);
      count++;
    }
    offset++;
  }
  return temp.reverse();
}

// 4. 1Y Labels (Trailing 12 Months)
function getTrailingYearLabels(): string[] {
  const labels: string[] = [];
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  for (let i = 11; i >= 0; i--) {
    const d = new Date(currentYear, currentMonth - i, 1);
    const m = d.getMonth() + 1;
    const isCurrent = i === 0;
    labels.push(isCurrent ? `${m}월(현재)` : `${m}월`);
  }
  return labels;
}

const W1_STOCK_LABELS = getTrailingWeekLabels(false);
const W1_CRYPTO_LABELS = getTrailingWeekLabels(true);

const M1_STOCK_LABELS = getTrailingMonthLabels(false);
const M1_CRYPTO_LABELS = getTrailingMonthLabels(true);

const Y1_LABELS = getTrailingYearLabels();

function makeSeries(
  base: number,
  labels: string[],
  volatility: number,
  trend: number
): { time: string; value: number }[] {
  return labels.map((time, i) => {
    const progress = labels.length > 1 ? i / (labels.length - 1) : 0;
    const wave = Math.sin(i * 1.1) * 0.45 + Math.cos(i * 1.6) * 0.25;
    const noise = ((i * 11) % 5 - 2) * (volatility * 0.12);
    const val = base + (wave + progress * trend) * volatility + noise;
    return { time, value: Number(val.toFixed(2)) };
  });
}

export const STOCK_DATA: Record<string, StockItem> = {
  'KOSPI': {
    symbol: 'KOSPI',
    name: '코스피 지수',
    price: '2,684.28',
    change: '+12.45',
    changePercent: '+0.47%',
    isPositive: true,
    unit: 'pt',
    marketType: 'KR',
    history: {
      '1D': makeSeries(2672, D1_KR_LABELS, 7, 1.5),
      '1W': makeSeries(2650, W1_STOCK_LABELS, 12, 2.4),
      '1M': makeSeries(2610, M1_STOCK_LABELS, 22, 2.9),
      '1Y': makeSeries(2520, Y1_LABELS, 55, 2.6)
    }
  },
  'KOSDAQ': {
    symbol: 'KOSDAQ',
    name: '코스닥 지수',
    price: '768.45',
    change: '+5.12',
    changePercent: '+0.67%',
    isPositive: true,
    unit: 'pt',
    marketType: 'KR',
    history: {
      '1D': makeSeries(763, D1_KR_LABELS, 3.2, 1.4),
      '1W': makeSeries(752, W1_STOCK_LABELS, 5.8, 2.4),
      '1M': makeSeries(740, M1_STOCK_LABELS, 10.5, 2.3),
      '1Y': makeSeries(710, Y1_LABELS, 26.0, 2.0)
    }
  },
  'SPX': {
    symbol: 'S&P 500',
    name: 'S&P 500 지수',
    price: '5,892.14',
    change: '+34.20',
    changePercent: '+0.58%',
    isPositive: true,
    unit: 'pt',
    marketType: 'US',
    history: {
      '1D': makeSeries(5860, D1_US_LABELS, 12, 2.2),
      '1W': makeSeries(5810, W1_STOCK_LABELS, 26, 2.8),
      '1M': makeSeries(5720, M1_STOCK_LABELS, 50, 3.1),
      '1Y': makeSeries(5100, Y1_LABELS, 210, 3.5)
    }
  },
  'IXIC': {
    symbol: 'NASDAQ',
    name: '나스닥 종합',
    price: '18,518.61',
    change: '+142.80',
    changePercent: '+0.78%',
    isPositive: true,
    unit: 'pt',
    marketType: 'US',
    history: {
      '1D': makeSeries(18380, D1_US_LABELS, 55, 2.2),
      '1W': makeSeries(18200, W1_STOCK_LABELS, 95, 2.9),
      '1M': makeSeries(17800, M1_STOCK_LABELS, 220, 3.0),
      '1Y': makeSeries(15900, Y1_LABELS, 800, 3.2)
    }
  },
  'TLT': {
    symbol: 'TLT',
    name: '미국 20년+ 국채 ETF',
    price: '$98.75',
    change: '-0.42',
    changePercent: '-0.42%',
    isPositive: false,
    unit: 'USD',
    marketType: 'US',
    history: {
      '1D': makeSeries(99.15, D1_US_LABELS, 0.22, -1.6),
      '1W': makeSeries(99.60, W1_STOCK_LABELS, 0.40, -1.8),
      '1M': makeSeries(97.80, M1_STOCK_LABELS, 0.80, 1.1),
      '1Y': makeSeries(92.00, Y1_LABELS, 3.00, 2.0)
    }
  },
  'GOLD': {
    symbol: 'GOLD',
    name: '국제 금 시세',
    price: '$2,514.80',
    change: '+18.50',
    changePercent: '+0.74%',
    isPositive: true,
    unit: 'USD/oz',
    marketType: 'US',
    history: {
      '1D': makeSeries(2498, D1_US_LABELS, 6.5, 2.2),
      '1W': makeSeries(2480, W1_STOCK_LABELS, 12.0, 2.5),
      '1M': makeSeries(2430, M1_STOCK_LABELS, 26.0, 2.9),
      '1Y': makeSeries(2050, Y1_LABELS, 130.0, 3.3)
    }
  },
  'BTC': {
    symbol: 'BTC',
    name: '비트코인 (USD)',
    price: '$64,250',
    change: '+1,420',
    changePercent: '+2.26%',
    isPositive: true,
    unit: 'USD',
    marketType: 'CRYPTO_24H',
    history: {
      '1D': makeSeries(62850, D1_CRYPTO_LABELS, 520, 2.4),
      '1W': makeSeries(61200, W1_CRYPTO_LABELS, 1150, 2.5),
      '1M': makeSeries(58500, M1_CRYPTO_LABELS, 2200, 2.4),
      '1Y': makeSeries(28000, Y1_LABELS, 10500, 3.3)
    }
  }
};
