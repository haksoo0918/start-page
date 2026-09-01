import React, { useState, useEffect } from 'react';
import { BookmarkLink } from '../data/presetLinks';
import { X, Globe } from 'lucide-react';

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
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (editingLink) {
      setTitle(editingLink.title);
      setUrl(editingLink.url);
    } else {
      setTitle('');
      setUrl('');
    }
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

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    let formattedUrl = url.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl;
    }

    onSave({
      id: editingLink ? editingLink.id : Date.now().toString(),
      title: title.trim(),
      url: formattedUrl,
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
              <h3 className="modal-title">{editingLink ? '바로가기 수정' : '새 바로가기 추가'}</h3>
            </div>
            <button type="button" className="modal-close-btn" onClick={onClose}>
              <X size={18} />
            </button>
          </div>

          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">사이트 이름</label>
              <input
                type="text"
                className="form-input"
                placeholder="예: GitHub, YouTube"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label">웹사이트 URL</label>
              <input
                type="text"
                className="form-input"
                placeholder="예: https://github.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              취소
            </button>
            <button type="submit" className="btn-brand">
              {editingLink ? '저장' : '추가하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
