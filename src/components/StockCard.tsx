import React, { useState } from 'react';
import { STOCK_DATA, StockItem } from '../data/stockData';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';

type PeriodType = '1D' | '1W' | '1M' | '1Y';

export const StockCard: React.FC = () => {
  const stockKeys = Object.keys(STOCK_DATA);
  const [selectedKey, setSelectedKey] = useState<string>('KOSPI');
  const [period, setPeriod] = useState<PeriodType>('1D');

  const currentStock: StockItem = STOCK_DATA[selectedKey] || STOCK_DATA['KOSPI'];
  const chartPoints = currentStock.history[period] || [];

  const chartColor = currentStock.isPositive ? '#ef4444' : '#2563eb';

  return (
    <div className="saniti-card">
      <div className="card-header">
        <div className="card-header-left">
          <Activity size={16} color="var(--color-brand)" />
          <h2 className="card-title">주요 시세 및 지수</h2>
        </div>

        <div className="stock-period-tabs">
          {(['1D', '1W', '1M', '1Y'] as PeriodType[]).map((p) => (
            <button
              key={p}
              className={`period-btn ${period === p ? 'active' : ''}`}
              onClick={() => setPeriod(p)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="card-body">
        {/* Symbol Tabs: KOSPI, S&P 500, TLT, GOLD */}
        <div className="stock-tabs-scroll" style={{ marginBottom: 'var(--spacing-md)' }}>
          {stockKeys.map((key) => {
            const stock = STOCK_DATA[key];
            return (
              <button
                key={key}
                className={`stock-tab ${selectedKey === key ? 'active' : ''}`}
                onClick={() => setSelectedKey(key)}
              >
                {stock.symbol}
              </button>
            );
          })}
        </div>

        {/* Current Price and Change Header */}
        <div className="stock-price-header">
          <div>
            <div style={{ fontSize: '12px', color: 'var(--color-slate)', marginBottom: '2px', fontWeight: 500 }}>
              {currentStock.name}
            </div>
            <div className="stock-main-price">
              {currentStock.price}
              <span style={{ fontSize: '13px', color: 'var(--color-slate-soft)', marginLeft: '4px', fontWeight: 400 }}>
                {currentStock.unit}
              </span>
            </div>
          </div>

          <div className={`stock-change-badge ${currentStock.isPositive ? 'up' : 'down'}`}>
            {currentStock.isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <span>{currentStock.change} ({currentStock.changePercent})</span>
          </div>
        </div>

        {/* Interactive Stock Chart */}
        <div style={{ flex: 1, width: '100%', minHeight: '120px', marginTop: '6px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartPoints} margin={{ top: 6, right: 4, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id={`stockGradient-${selectedKey}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColor} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={chartColor} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                stroke="#cbd5e1"
                tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'var(--font-mono)' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
              />
              <YAxis
                domain={['dataMin - 5', 'dataMax + 5']}
                hide={true}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div
                        style={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #e2e8f0',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontFamily: 'var(--font-mono)'
                        }}
                      >
                        <div style={{ color: '#64748b' }}>{data.time}</div>
                        <div style={{ color: chartColor, fontWeight: 700 }}>
                          {data.value.toLocaleString()} {currentStock.unit}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={chartColor}
                strokeWidth={2}
                fillOpacity={1}
                fill={`url(#stockGradient-${selectedKey})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
