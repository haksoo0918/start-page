import React, { useState } from 'react';
import { WeatherData, getWeatherInfo } from '../services/weatherService';
import { Region } from '../data/koreaRegions';
import { RegionSelectModal } from './RegionSelectModal';
import { CloudRain, Umbrella, MapPin, ChevronDown, RefreshCw } from 'lucide-react';
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
        <div style={{ color: 'var(--color-mute)', fontSize: '13px' }}>날씨 데이터를 불러오는 중...</div>
      </div>
    );
  }

  const todayInfo = weather ? getWeatherInfo(weather.today.weatherCode) : { label: '', icon: '' };
  const tomorrowInfo = weather ? getWeatherInfo(weather.tomorrow.weatherCode) : { label: '', icon: '' };

  // Format hourly data for chart (next 24~48 hours)
  const chartData = weather?.hourly.map((h, idx) => ({
    hour: h.hour,
    displayTime: idx === 0 ? '지금' : h.hour,
    rainProb: h.rainProb,
    temp: h.temp,
    isToday: h.isToday
  })) || [];

  return (
    <div className="saniti-card">
      <div className="card-header">
        <div className="card-header-left">
          <CloudRain size={16} color="var(--color-rain-blue)" />
          <h2 className="card-title">비 올 확률 예보</h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            className="weather-location-btn"
            onClick={() => setIsRegionModalOpen(true)}
            title="지역 변경"
          >
            <MapPin size={12} color="var(--color-brand)" />
            <span>{selectedRegion.name}</span>
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
        {/* Today vs Tomorrow Rain Highlights */}
        <div className="rain-highlight-grid">
          {/* Today Card */}
          <div className={`rain-day-card ${weather?.today.needUmbrella ? 'active-rain' : ''}`}>
            <div className="rain-day-header">
              <span className="rain-day-tag">오늘 (TODAY)</span>
              <span className={`rain-umbrella-badge ${weather?.today.needUmbrella ? 'need-umbrella' : 'safe'}`}>
                <Umbrella size={11} />
                {weather?.today.needUmbrella ? '우산 챙기세요' : '우산 불필요'}
              </span>
            </div>

            <div className="rain-prob-display">
              <span className={`rain-prob-number ${(weather?.today.maxRainProb || 0) >= 50 ? 'high-prob' : ''}`}>
                {weather?.today.maxRainProb ?? 0}
              </span>
              <span className="rain-prob-unit">%</span>
            </div>

            <div className="rain-day-footer">
              <span>{todayInfo.icon} {todayInfo.label}</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>
                {weather?.today.tempMin}° / {weather?.today.tempMax}°
              </span>
            </div>
          </div>

          {/* Tomorrow Card */}
          <div className={`rain-day-card ${weather?.tomorrow.needUmbrella ? 'active-rain' : ''}`}>
            <div className="rain-day-header">
              <span className="rain-day-tag">내일 (TOMORROW)</span>
              <span className={`rain-umbrella-badge ${weather?.tomorrow.needUmbrella ? 'need-umbrella' : 'safe'}`}>
                <Umbrella size={11} />
                {weather?.tomorrow.needUmbrella ? '우산 준비' : '맑음/안전'}
              </span>
            </div>

            <div className="rain-prob-display">
              <span className={`rain-prob-number ${(weather?.tomorrow.maxRainProb || 0) >= 50 ? 'high-prob' : ''}`}>
                {weather?.tomorrow.maxRainProb ?? 0}
              </span>
              <span className="rain-prob-unit">%</span>
            </div>

            <div className="rain-day-footer">
              <span>{tomorrowInfo.icon} {tomorrowInfo.label}</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>
                {weather?.tomorrow.tempMin}° / {weather?.tomorrow.tempMax}°
              </span>
            </div>
          </div>
        </div>

        {/* 48-Hour Rain Probability Timeline Chart */}
        <div className="rain-chart-container" style={{ flex: 1, minHeight: '130px', display: 'flex', flexDirection: 'column' }}>
          <div className="rain-chart-header" style={{ marginBottom: '6px' }}>
            <span className="mono-eyebrow">시간대별 강수확률 (48H TIMELINE)</span>
            <span style={{ fontSize: '11px', color: 'var(--color-slate)', fontFamily: 'var(--font-mono)' }}>
              현재 {weather?.currentTemp}°C
            </span>
          </div>

          <div style={{ flex: 1, width: '100%', minHeight: '100px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.filter((_, i) => i % 2 === 0)} margin={{ top: 8, right: 4, left: -25, bottom: 0 }}>
                <XAxis
                  dataKey="displayTime"
                  stroke="#cbd5e1"
                  tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'var(--font-mono)' }}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickLine={false}
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
                            fontSize: '11px'
                          }}
                        >
                          <div style={{ color: '#64748b', marginBottom: '2px' }}>
                            {data.isToday ? '오늘' : '내일'} {data.hour}
                          </div>
                          <div style={{ color: '#0284c7', fontWeight: 700 }}>
                            강수확률: {data.rainProb}%
                          </div>
                          <div style={{ color: '#1e293b' }}>
                            기온: {data.temp}°C
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine y={50} stroke="#f36458" strokeDasharray="3 3" opacity={0.6} />
                <Bar dataKey="rainProb" radius={[2, 2, 0, 0]}>
                  {chartData.filter((_, i) => i % 2 === 0).map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.rainProb >= 50 ? '#0284c7' : entry.rainProb >= 20 ? '#38bdf8' : '#e2e8f0'}
                    />
                  ))}
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
