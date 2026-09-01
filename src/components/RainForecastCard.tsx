import React, { useState } from 'react';
import { WeatherData, getWeatherInfo } from '../services/weatherService';
import { Region } from '../data/koreaRegions';
import { RegionSelectModal } from './RegionSelectModal';
import { CloudSun, MapPin, ChevronDown, RefreshCw } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  Cell,
  ReferenceLine
} from 'recharts';

interface Props {
  weather: WeatherData | null;
  loading: boolean;
  selectedRegion: Region;
  onSelectRegion: (region: Region) => void;
  onRefresh: () => void;
}

export const RainForecastCard: React.FC<Props> = ({
  weather,
  loading,
  selectedRegion,
  onSelectRegion,
  onRefresh
}) => {
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);

  if (!weather && loading) {
    return (
      <div className="saniti-card" style={{ minHeight: '330px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--color-mute)', fontSize: '13px', fontFamily: "'Noto Sans KR', sans-serif" }}>
          날씨 데이터를 불러오는 중...
        </div>
      </div>
    );
  }

  const todayInfo = weather ? getWeatherInfo(weather.today.weatherCode) : { label: '', icon: '' };
  const tomorrowInfo = weather ? getWeatherInfo(weather.tomorrow.weatherCode) : { label: '', icon: '' };

  // 2-hour interval data
  const rawData = weather?.hourly.filter((_, i) => i % 2 === 0) || [];
  const currentHourNum = new Date().getHours();

  // Find exact index for today's current hour
  let todayCurrentIndex = -1;
  let todayCount = 0;

  rawData.forEach((h, idx) => {
    if (h.isToday) {
      todayCount++;
      const hourVal = parseInt(h.hour.replace('시', ''), 10);
      if (Math.abs(hourVal - currentHourNum) <= 1 && todayCurrentIndex === -1) {
        todayCurrentIndex = idx;
      }
    }
  });

  const chartData = rawData.map((h, idx) => {
    return {
      hour: h.hour,
      rainProb: h.rainProb,
      temp: h.temp,
      isToday: h.isToday,
      isNow: idx === todayCurrentIndex
    };
  });

  // Calculate exact percentage between today (22시) and tomorrow (00시)
  const dividerPercent = rawData.length > 0 ? (todayCount / rawData.length) * 100 : 50;

  return (
    <div className="saniti-card">
      <div className="card-header">
        <div className="card-header-left">
          <CloudSun size={16} color="var(--color-rain-blue)" />
          <h2 className="card-title" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>날씨</h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <button
            className="weather-location-btn"
            onClick={() => setIsRegionModalOpen(true)}
            title="지역 변경"
            style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
          >
            <MapPin size={12} color="var(--color-brand)" />
            <span style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>{selectedRegion.name}</span>
            <ChevronDown size={12} />
          </button>

          <button
            className="link-action-btn"
            onClick={onRefresh}
            title="새로고침"
            style={{ padding: '4px' }}
          >
            <RefreshCw size={13} className={loading ? 'spin' : ''} />
          </button>
        </div>
      </div>

      <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
        {/* Today vs Tomorrow Rain Highlights (Today Subtly Emphasized) */}
        <div className="rain-highlight-grid">
          {/* Today Card (Featured Emphasis) */}
          <div
            className="rain-day-card"
            style={{
              backgroundColor: '#ffffff',
              borderColor: '#cbd5e1',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.04)'
            }}
          >
            <div className="rain-day-header">
              <span style={{ fontSize: '11.5px', color: 'var(--color-slate-soft)', fontWeight: 600, fontFamily: "'Noto Sans KR', sans-serif" }}>
                강수확률
              </span>
              <span
                className="rain-day-tag"
                style={{
                  fontFamily: "'Noto Sans KR', sans-serif",
                  fontSize: '11px',
                  fontWeight: 700,
                  backgroundColor: 'var(--color-ink)',
                  color: '#ffffff',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  letterSpacing: '0.02em'
                }}
              >
                오늘
              </span>
            </div>

            <div className="rain-prob-display">
              <span className={`rain-prob-number ${(weather?.today.maxRainProb || 0) >= 40 ? 'high-prob' : ''}`} style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
                {weather?.today.maxRainProb ?? 0}
              </span>
              <span className="rain-prob-unit" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>%</span>
            </div>

            <div className="rain-day-footer" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
              <span style={{ fontWeight: 600 }}>{todayInfo.icon} {todayInfo.label}</span>
              <span style={{ fontWeight: 600, fontSize: '11px', color: 'var(--color-slate)' }}>
                최저 {weather?.today.tempMin}° · 최고 {weather?.today.tempMax}°
              </span>
            </div>
          </div>

          {/* Tomorrow Card (Subtle Secondary) */}
          <div className="rain-day-card">
            <div className="rain-day-header">
              <span style={{ fontSize: '11.5px', color: 'var(--color-slate-soft)', fontWeight: 600, fontFamily: "'Noto Sans KR', sans-serif" }}>
                강수확률
              </span>
              <span
                className="rain-day-tag"
                style={{
                  fontFamily: "'Noto Sans KR', sans-serif",
                  fontSize: '11px',
                  fontWeight: 500,
                  backgroundColor: 'var(--color-canvas-elevated)',
                  color: 'var(--color-slate)',
                  padding: '2px 8px',
                  borderRadius: '4px'
                }}
              >
                내일
              </span>
            </div>

            <div className="rain-prob-display">
              <span className={`rain-prob-number ${(weather?.tomorrow.maxRainProb || 0) >= 40 ? 'high-prob' : ''}`} style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
                {weather?.tomorrow.maxRainProb ?? 0}
              </span>
              <span className="rain-prob-unit" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>%</span>
            </div>

            <div className="rain-day-footer" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
              <span style={{ fontWeight: 600 }}>{tomorrowInfo.icon} {tomorrowInfo.label}</span>
              <span style={{ fontWeight: 600, fontSize: '11px', color: 'var(--color-slate)' }}>
                최저 {weather?.tomorrow.tempMin}° · 최고 {weather?.tomorrow.tempMax}°
              </span>
            </div>
          </div>
        </div>

        {/* 48-Hour Rain Probability Timeline Chart */}
        <div className="rain-chart-container" style={{ flex: 1, minHeight: '130px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <div className="rain-chart-header" style={{ marginBottom: '4px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-slate-soft)', fontFamily: "'Noto Sans KR', sans-serif" }}>
              시간대별 강수확률 (오늘~내일 48H)
            </span>
            <span style={{ fontSize: '11px', color: 'var(--color-slate)', fontWeight: 600, fontFamily: "'Noto Sans KR', sans-serif" }}>
              현재 {weather?.currentTemp}°C
            </span>
          </div>

          <div style={{ flex: 1, width: '100%', minHeight: '100px', position: 'relative' }}>
            {/* Clean Background Vertical Divider Line Exactly Between Today (22시) and Tomorrow (00시) */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 24,
                left: `calc(${dividerPercent}% - 6px)`,
                borderLeft: '1.5px dashed #94a3b8',
                zIndex: 1,
                pointerEvents: 'none'
              }}
            />

            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 6, left: -25, bottom: 0 }}>
                <XAxis
                  dataKey="hour"
                  stroke="#cbd5e1"
                  tick={({ x, y, payload, index }) => {
                    const isNow = chartData[index]?.isNow;
                    return (
                      <text
                        x={x}
                        y={y + 12}
                        textAnchor="middle"
                        fill={isNow ? '#f36458' : '#64748b'}
                        fontSize={9.5}
                        fontWeight={isNow ? 700 : 500}
                        fontFamily="'Noto Sans KR', sans-serif"
                      >
                        {payload.value}
                      </text>
                    );
                  }}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickLine={false}
                  interval={0}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(0, 0, 0, 0.03)' }}
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
                            fontFamily: "'Noto Sans KR', sans-serif"
                          }}
                        >
                          <div style={{ color: '#64748b', marginBottom: '2px', fontWeight: 600 }}>
                            {data.isNow ? '● 지금 실시간' : data.isToday ? '오늘' : '내일'} {data.hour}
                          </div>
                          <div style={{ color: '#0284c7', fontWeight: 700 }}>
                            강수확률: {data.rainProb}%
                          </div>
                          <div style={{ color: '#1e293b', fontWeight: 500 }}>
                            기온: {data.temp}°C
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine y={50} stroke="#f36458" strokeDasharray="3 3" opacity={0.5} />
                <Bar dataKey="rainProb" radius={[2, 2, 0, 0]}>
                  {chartData.map((entry, index) => {
                    let barFill = entry.rainProb >= 50 ? '#0284c7' : entry.rainProb >= 20 ? '#38bdf8' : '#e2e8f0';
                    if (entry.isNow) {
                      barFill = '#f36458';
                    }
                    return <Cell key={`cell-${index}`} fill={barFill} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <RegionSelectModal
        isOpen={isRegionModalOpen}
        onClose={() => setIsRegionModalOpen(false)}
        selectedRegion={selectedRegion}
        onSelect={onSelectRegion}
      />
    </div>
  );
};
