import React, { useState, useEffect, useCallback } from 'react';
import { LinksHub } from './components/LinksHub';
import { RainForecastCard } from './components/RainForecastCard';
import { StockCard } from './components/StockCard';
import { BackgroundModal, BackgroundSettings } from './components/BackgroundModal';
import { PRESET_LINKS, BookmarkLink } from './data/presetLinks';
import { DEFAULT_REGION, Region } from './data/koreaRegions';
import { WeatherData, fetchRainWeather } from './services/weatherService';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Image as ImageIcon } from 'lucide-react';
import './styles/app.css';

const DEFAULT_BG_SETTINGS: BackgroundSettings = {
  type: 'none',
  url: '',
  blur: 4,
  opacity: 0.92
};

export const App: React.FC = () => {
  // LocalStorage Persisted State
  const [links, setLinks] = useLocalStorage<BookmarkLink[]>('browser_home_links', PRESET_LINKS);
  const [selectedRegion, setSelectedRegion] = useLocalStorage<Region>('browser_home_region', DEFAULT_REGION);
  const [bgSettings, setBgSettings] = useLocalStorage<BackgroundSettings>('browser_home_bg', DEFAULT_BG_SETTINGS);

  // Modals
  const [isBgModalOpen, setIsBgModalOpen] = useState(false);

  // Weather State
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState<boolean>(true);

  const loadWeather = useCallback(async () => {
    setWeatherLoading(true);
    try {
      const data = await fetchRainWeather(selectedRegion);
      setWeather(data);
    } catch (err) {
      console.error('Failed to load weather:', err);
    } finally {
      setWeatherLoading(false);
    }
  }, [selectedRegion]);

  useEffect(() => {
    loadWeather();
    // 15-minute periodic auto-refresh for weather
    const weatherTimer = setInterval(loadWeather, 15 * 60 * 1000);
    return () => clearInterval(weatherTimer);
  }, [loadWeather]);

  // Bookmark Link Handlers
  const handleAddLink = (newLink: BookmarkLink) => {
    setLinks(prev => [...prev, newLink]);
  };

  const handleUpdateLink = (updatedLink: BookmarkLink) => {
    setLinks(prev => prev.map(l => l.id === updatedLink.id ? updatedLink : l));
  };

  const handleDeleteLink = (id: string) => {
    setLinks(prev => prev.filter(l => l.id !== id));
  };

  const handleReorderLinks = (reorderedLinks: BookmarkLink[]) => {
    setLinks(reorderedLinks);
  };

  const hasBackground = bgSettings.type !== 'none' && Boolean(bgSettings.url);

  return (
    <>
      {/* Background Image Layer */}
      {hasBackground && (
        <div
          style={{
            position: 'fixed',
            top: '-20px',
            left: '-20px',
            right: '-20px',
            bottom: '-20px',
            backgroundImage: `url(${bgSettings.url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: `blur(${bgSettings.blur}px)`,
            transform: 'scale(1.03)',
            zIndex: -1,
            pointerEvents: 'none'
          }}
        />
      )}

      <div
        className="dashboard-container"
        style={{
          ...(hasBackground
            ? ({
                '--color-canvas-card': `rgba(255, 255, 255, ${bgSettings.opacity})`,
                '--color-canvas-soft': `rgba(248, 250, 252, ${bgSettings.opacity})`
              } as React.CSSProperties)
            : {})
        }}
      >
        {/* Saniti Header */}
        <header
          className="dashboard-header"
          style={hasBackground ? { backgroundColor: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(8px)', padding: '10px 16px', borderRadius: '8px' } : {}}
        >
          <div className="header-brand">
            <span className="brand-dot" />
            <h1 className="header-title">STARTPAGE</h1>
            <span className="header-subtitle">DESKTOP DASHBOARD</span>
          </div>

          <div className="header-status">
            <span className="mono-eyebrow">
              LOCATION: {selectedRegion.name}
            </span>
            <span style={{ color: 'var(--color-graphite)' }}>|</span>
            <span className="mono-eyebrow" style={{ color: weather?.today.needUmbrella ? 'var(--color-brand)' : 'var(--color-success)' }}>
              {weather?.today.needUmbrella ? 'RAIN EXPECTED 🌧️' : 'CLEAR SKY ☀️'}
            </span>
            <span style={{ color: 'var(--color-graphite)' }}>|</span>

            {/* Background Settings Button */}
            <button
              className="weather-location-btn"
              onClick={() => setIsBgModalOpen(true)}
              title="배경 이미지 설정"
            >
              <ImageIcon size={13} color="var(--color-slate)" />
              <span>배경 설정</span>
            </button>
          </div>
        </header>

        {/* Main Bento Grid */}
        <main className="dashboard-grid">
          {/* Left: Main Links Hub (62% Area) */}
          <LinksHub
            links={links}
            onAddLink={handleAddLink}
            onUpdateLink={handleUpdateLink}
            onDeleteLink={handleDeleteLink}
            onReorderLinks={handleReorderLinks}
          />

          {/* Right: Rain Forecast & Stock Charts (38% Area) */}
          <aside className="dashboard-sidebar">
            {/* Top Right: Rain Probability & 48H Timeline */}
            <RainForecastCard
              weather={weather}
              loading={weatherLoading}
              selectedRegion={selectedRegion}
              onSelectRegion={setSelectedRegion}
              onRefresh={loadWeather}
            />

            {/* Bottom Right: Stocks & Indices */}
            <StockCard />
          </aside>
        </main>
      </div>

      {/* Background Modal */}
      <BackgroundModal
        isOpen={isBgModalOpen}
        onClose={() => setIsBgModalOpen(false)}
        settings={bgSettings}
        onSave={setBgSettings}
      />
    </>
  );
};

export default App;
