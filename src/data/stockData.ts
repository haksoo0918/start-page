export interface StockItem {
  symbol: string;
  name: string;
  price: string;
  change: string;
  changePercent: string;
  isPositive: boolean;
  unit: string;
  history: {
    '1D': { time: string; value: number }[];
    '1W': { time: string; value: number }[];
    '1M': { time: string; value: number }[];
    '1Y': { time: string; value: number }[];
  };
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
    history: {
      '1D': [
        { time: '09:00', value: 2672 },
        { time: '11:00', value: 2678 },
        { time: '13:00', value: 2680 },
        { time: '14:30', value: 2682 },
        { time: '15:30', value: 2684.28 }
      ],
      '1W': [
        { time: '월', value: 2650 },
        { time: '화', value: 2665 },
        { time: '수', value: 2670 },
        { time: '목', value: 2668 },
        { time: '금', value: 2684.28 }
      ],
      '1M': [
        { time: '1주', value: 2610 },
        { time: '2주', value: 2640 },
        { time: '3주', value: 2660 },
        { time: '4주', value: 2684.28 }
      ],
      '1Y': [
        { time: '1분기', value: 2520 },
        { time: '2분기', value: 2750 },
        { time: '3분기', value: 2610 },
        { time: '4분기', value: 2684.28 }
      ]
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
    history: {
      '1D': [
        { time: '09:30', value: 5858 },
        { time: '11:00', value: 5870 },
        { time: '13:00', value: 5865 },
        { time: '15:00', value: 5885 },
        { time: '16:00', value: 5892.14 }
      ],
      '1W': [
        { time: '월', value: 5810 },
        { time: '화', value: 5835 },
        { time: '수', value: 5820 },
        { time: '목', value: 5860 },
        { time: '금', value: 5892.14 }
      ],
      '1M': [
        { time: '1주', value: 5720 },
        { time: '2주', value: 5780 },
        { time: '3주', value: 5830 },
        { time: '4주', value: 5892.14 }
      ],
      '1Y': [
        { time: '1분기', value: 5100 },
        { time: '2분기', value: 5450 },
        { time: '3분기', value: 5650 },
        { time: '4분기', value: 5892.14 }
      ]
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
    history: {
      '1D': [
        { time: '09:30', value: 99.17 },
        { time: '11:00', value: 99.00 },
        { time: '13:00', value: 98.85 },
        { time: '15:00', value: 98.80 },
        { time: '16:00', value: 98.75 }
      ],
      '1W': [
        { time: '월', value: 99.80 },
        { time: '화', value: 99.40 },
        { time: '수', value: 99.10 },
        { time: '목', value: 98.90 },
        { time: '금', value: 98.75 }
      ],
      '1M': [
        { time: '1주', value: 96.50 },
        { time: '2주', value: 97.80 },
        { time: '3주', value: 99.20 },
        { time: '4주', value: 98.75 }
      ],
      '1Y': [
        { time: '1분기', value: 92.00 },
        { time: '2분기', value: 94.50 },
        { time: '3분기', value: 101.00 },
        { time: '4분기', value: 98.75 }
      ]
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
    history: {
      '1D': [
        { time: '09:00', value: 2496 },
        { time: '12:00', value: 2504 },
        { time: '15:00', value: 2508 },
        { time: '18:00', value: 2512 },
        { time: '21:00', value: 2514.80 }
      ],
      '1W': [
        { time: '월', value: 2480 },
        { time: '화', value: 2495 },
        { time: '수', value: 2490 },
        { time: '목', value: 2505 },
        { time: '금', value: 2514.80 }
      ],
      '1M': [
        { time: '1주', value: 2430 },
        { time: '2주', value: 2460 },
        { time: '3주', value: 2485 },
        { time: '4주', value: 2514.80 }
      ],
      '1Y': [
        { time: '1분기', value: 2050 },
        { time: '2분기', value: 2320 },
        { time: '3분기', value: 2440 },
        { time: '4분기', value: 2514.80 }
      ]
    }
  }
};
