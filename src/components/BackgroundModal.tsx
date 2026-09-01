import React, { useState, useEffect } from 'react';
import { X, Image as ImageIcon, Upload, RotateCcw, Check } from 'lucide-react';

export interface BackgroundSettings {
  type: 'none' | 'url' | 'custom';
  url: string;
  blur: number; // 0 to 20px
  opacity: number; // 0.1 to 1.0
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  settings: BackgroundSettings;
  onSave: (settings: BackgroundSettings) => void;
}

const PRESETS = [
  {
    id: 'nature',
    name: '고요한 숲',
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1920&q=80'
  },
  {
    id: 'architecture',
    name: '미니멀 건축',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80'
  },
  {
    id: 'mountain',
    name: '안개 산맥',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80'
  },
  {
    id: 'sea',
    name: '차분한 바다',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80'
  }
];

export const BackgroundModal: React.FC<Props> = ({
  isOpen,
  onClose,
  settings,
  onSave
}) => {
  const [currentUrl, setCurrentUrl] = useState(settings.url);
  const [currentBlur, setCurrentBlur] = useState(settings.blur);
  const [currentOpacity, setCurrentOpacity] = useState(settings.opacity);
  const [currentType, setCurrentType] = useState<BackgroundSettings['type']>(settings.type);

  // ESC key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setCurrentUrl(settings.url);
      setCurrentBlur(settings.blur);
      setCurrentOpacity(settings.opacity);
      setCurrentType(settings.type);
    }
  }, [isOpen, settings]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('이미지 파일 크기는 5MB 이하여야 합니다.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setCurrentUrl(base64);
        setCurrentType('custom');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApply = () => {
    onSave({
      type: currentType,
      url: currentUrl,
      blur: currentBlur,
      opacity: currentOpacity
    });
    onClose();
  };

  const handleReset = () => {
    onSave({
      type: 'none',
      url: '',
      blur: 0,
      opacity: 0.85
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ width: '520px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ImageIcon size={16} color="var(--color-brand)" />
            <h3 className="modal-title">배경 이미지 설정</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} title="닫기 (ESC)">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Preset Selection */}
          <div className="form-group">
            <label className="form-label">프리셋 배경 선택</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {PRESETS.map((p) => {
                const isSelected = currentType === 'url' && currentUrl === p.url;
                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      setCurrentUrl(p.url);
                      setCurrentType('url');
                    }}
                    style={{
                      position: 'relative',
                      height: '64px',
                      borderRadius: 'var(--radius-app-sm)',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: isSelected ? '2px solid var(--color-brand)' : '1px solid var(--color-hairline)',
                      backgroundImage: `url(${p.url})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: 'rgba(0,0,0,0.6)',
                        color: '#fff',
                        fontSize: '10px',
                        padding: '2px 4px',
                        textAlign: 'center'
                      }}
                    >
                      {p.name}
                    </div>
                    {isSelected && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '4px',
                          right: '4px',
                          background: 'var(--color-brand)',
                          color: '#fff',
                          borderRadius: '50%',
                          width: '16px',
                          height: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Check size={10} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* URL Input */}
          <div className="form-group">
            <label className="form-label">이미지 URL 직접 입력</label>
            <input
              type="text"
              className="form-input"
              placeholder="https://images.unsplash.com/..."
              value={currentUrl.startsWith('data:') ? '로컬 업로드 이미지' : currentUrl}
              onChange={(e) => {
                setCurrentUrl(e.target.value);
                setCurrentType('url');
              }}
            />
          </div>

          {/* File Upload */}
          <div className="form-group">
            <label className="form-label">또는 내 컴퓨터에서 파일 선택</label>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '8px 12px',
                border: '1px dashed var(--color-hairline)',
                borderRadius: 'var(--radius-app-xs)',
                backgroundColor: 'var(--color-canvas-soft)',
                cursor: 'pointer',
                fontSize: '12px',
                color: 'var(--color-slate)'
              }}
            >
              <Upload size={14} />
              <span>이미지 파일 업로드 (JPG, PNG, WebP)</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          {/* Blur & Opacity Sliders */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '4px' }}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>배경 흐림(블러)</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>{currentBlur}px</span>
              </label>
              <input
                type="range"
                min="0"
                max="20"
                value={currentBlur}
                onChange={(e) => setCurrentBlur(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-brand)' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>카드 불투명도</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>{Math.round(currentOpacity * 100)}%</span>
              </label>
              <input
                type="range"
                min="0.5"
                max="1.0"
                step="0.05"
                value={currentOpacity}
                onChange={(e) => setCurrentOpacity(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-brand)' }}
              />
            </div>
          </div>
        </div>

        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={handleReset}
            style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <RotateCcw size={12} />
            기본 배경으로 초기화
          </button>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              취소
            </button>
            <button type="button" className="btn-brand" onClick={handleApply}>
              적용하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
