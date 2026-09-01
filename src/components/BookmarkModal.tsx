import React, { useState, useEffect, useRef } from 'react';
import { BookmarkLink } from '../data/presetLinks';
import { normalizeUrl, fetchPageTitle } from '../utils/urlHelper';
import { X, Globe, Loader2, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (link: BookmarkLink) => void;
  editingLink?: BookmarkLink | null;
}

export const BookmarkModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
  editingLink
}) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [fetchingTitle, setFetchingTitle] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (editingLink) {
      setUrl(editingLink.url);
      setTitle(editingLink.title);
    } else {
      setUrl('');
      setTitle('');
    }
    setFetchingTitle(false);
  }, [editingLink, isOpen]);

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

  // Handle URL change with auto title fetch
  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);

    // If editing existing link with user-set title, do not overwrite unless title is empty
    if (editingLink && title.trim()) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    const trimmed = newUrl.trim();
    if (trimmed.length > 3 && (trimmed.includes('.') || trimmed.startsWith('http'))) {
      debounceTimerRef.current = setTimeout(async () => {
        setFetchingTitle(true);
        try {
          const autoTitle = await fetchPageTitle(trimmed);
          if (autoTitle) {
            setTitle(autoTitle);
          }
        } catch {
          // ignore
        } finally {
          setFetchingTitle(false);
        }
      }, 400);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUrl = normalizeUrl(url);
    if (!cleanUrl) return;

    const finalTitle = title.trim() || cleanUrl.replace(/^https?:\/\//, '').split('/')[0];

    onSave({
      id: editingLink ? editingLink.id : Date.now().toString(),
      title: finalTitle,
      url: cleanUrl,
      category: 'all'
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="modal-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Globe size={16} color="var(--color-brand)" />
              <h3 className="modal-title" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
                {editingLink ? '바로가기 수정' : '새 바로가기 추가'}
              </h3>
            </div>
            <button type="button" className="modal-close-btn" onClick={onClose}>
              <X size={18} />
            </button>
          </div>

          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* 1. Website URL (Top Priority with Auto-Focus) */}
            <div className="form-group">
              <label className="form-label" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
                웹사이트 주소 (URL)
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="예: naver.com, https://github.com"
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
                required
                autoFocus
                style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
              />
            </div>

            {/* 2. Site Name (Auto-Fetched with manual override) */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label className="form-label" style={{ margin: 0, fontFamily: "'Noto Sans KR', sans-serif" }}>
                  사이트 이름
                </label>
                {fetchingTitle && (
                  <span style={{ fontSize: '11px', color: 'var(--color-brand)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Loader2 size={11} className="spin" />
                    <span>제목 가져오는 중...</span>
                  </span>
                )}
                {!fetchingTitle && title && !editingLink && (
                  <span style={{ fontSize: '11px', color: 'var(--color-slate-soft)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <Sparkles size={11} color="var(--color-brand)" />
                    <span>자동 완성됨</span>
                  </span>
                )}
              </div>
              <input
                type="text"
                className="form-input"
                placeholder="주소를 입력하면 자동으로 채워집니다"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
              취소
            </button>
            <button type="submit" className="btn-brand" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
              {editingLink ? '저장' : '추가하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
