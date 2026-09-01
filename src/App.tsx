import React, { useState, useEffect } from 'react';
import { LinksHub } from './components/LinksHub';
import { RainForecastCard } from './components/RainForecastCard';
import { StockCard } from './components/StockCard';
import { PRESET_LINKS, BookmarkLink } from './data/presetLinks';
import { DEFAULT_REGION, Region } from './data/koreaRegions';
import { WeatherData, fetchRainWeather } from './services/weatherService';
import { useLocalStorage } from './hooks/useLocalStorage';
import { MapPin } from 'lucide-react';
import './styles/app.css';

export const App: React.FC = () => {
  // 1. Links Management State
  const [links, setLinks] = useLocalStorage<BookmarkLink[]>('saniti_links_v1', PRESET_LINKS);

  // 2. Weather & Region State
  const [selectedRegion, setSelectedRegion] = useLocalStorage<Region>('saniti_region_v1', DEFAULT_REGION);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);

  // Load weather data
  const loadWeather = async (region: Region) => {
    setWeatherLoading(true);
    try {
      const data = await fetchRainWeather(region);
      setWeather(data);
    } catch (e) {
      console.error('Weather load error:', e);
    } finally {
      setWeatherLoading(false);
    }
  };

  useEffect(() => {
    loadWeather(selectedRegion);
    const timer = setInterval(() => loadWeather(selectedRegion), 15 * 60 * 1000);
    return () => clearInterval(timer);
  }, [selectedRegion]);

  const handleSelectRegion = (region: Region) => {
    setSelectedRegion(region);
  };

  // Link CRUD operations
  const handleAddLink = (newLink: BookmarkLink) => {
    setLinks([...links, newLink]);
  };

  const handleUpdateLink = (updatedLink: BookmarkLink) => {
    setLinks(links.map((l) => (l.id === updatedLink.id ? updatedLink : l)));
  };

  const handleDeleteLink = (id: string) => {
    setLinks(links.filter((l) => l.id !== id));
  };

  const handleReorderLinks = (reorderedLinks: BookmarkLink[]) => {
    setLinks(reorderedLinks);
  };

  return (
    <div className="dashboard-container">
      {/* Saniti Header */}
      <header className="dashboard-header">
        <div className="header-brand">
          <span className="brand-dot" />
          <h1 className="header-title">STARTPAGE</h1>
          <span className="header-subtitle">DESKTOP DASHBOARD</span>
        </div>

        <div className="header-status" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: "'Noto Sans KR', sans-serif" }}>
            <MapPin size={13} color="var(--color-brand)" />
            <strong style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>{selectedRegion.name}</strong>
          </span>
          <span style={{ color: 'var(--color-hairline)' }}>|</span>
          <span style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
            {weather?.today.needUmbrella ? '🌧️ 오늘 비 예보 (우산 필요)' : '☀️ 오늘 비 소식 없음'}
          </span>
        </div>
      </header>

      {/* Main Bento Dashboard Grid */}
      <main className="dashboard-grid">
        {/* Left Section: 62% Primary Links Hub */}
        <LinksHub
          links={links}
          onAddLink={handleAddLink}
          onUpdateLink={handleUpdateLink}
          onDeleteLink={handleDeleteLink}
          onReorderLinks={handleReorderLinks}
        />

        {/* Right Section: 38% Widgets (Rain Forecast & Major Stocks) */}
        <div className="dashboard-sidebar">
          {/* Top Widget: Rain Forecast Card */}
          <RainForecastCard
            weather={weather}
            loading={weatherLoading}
            selectedRegion={selectedRegion}
            onSelectRegion={handleSelectRegion}
            onRefresh={() => loadWeather(selectedRegion)}
          />

          {/* Bottom Widget: 7 Major Asset Stock Card */}
          <StockCard />
        </div>
      </main>
    </div>
  );
};

export default App;
