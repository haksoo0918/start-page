import React, { useState } from 'react';
import { BookmarkLink } from '../data/presetLinks';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { BookmarkModal } from './BookmarkModal';

interface Props {
  links: BookmarkLink[];
  onAddLink: (link: BookmarkLink) => void;
  onUpdateLink: (link: BookmarkLink) => void;
  onDeleteLink: (id: string) => void;
  onReorderLinks: (newLinks: BookmarkLink[]) => void;
}

export const LinksHub: React.FC<Props> = ({
  links,
  onAddLink,
  onUpdateLink,
  onDeleteLink,
  onReorderLinks
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<BookmarkLink | null>(null);

  // Drag and drop state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace(/^www\./, '');
    } catch {
      return url;
    }
  };

  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch {
      return '';
    }
  };

  const handleEdit = (link: BookmarkLink, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingLink(link);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('이 바로가기를 삭제하시겠습니까?')) {
      onDeleteLink(id);
    }
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    // Transparent or ghost image
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const updated = [...links];
    const [draggedItem] = updated.splice(draggedIndex, 1);
    updated.splice(dropIndex, 0, draggedItem);

    onReorderLinks(updated);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <section className="saniti-card links-section">
      <div className="card-header">
        <div className="card-header-left">
          <span className="brand-dot" />
          <h2 className="card-title">자주 가는 링크</h2>
          <span className="mono-eyebrow" style={{ marginLeft: '6px' }}>
            {links.length} SITES (DRAG TO REORDER)
          </span>
        </div>

        <button
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
          onClick={() => {
            setEditingLink(null);
            setIsModalOpen(true);
          }}
        >
          <Plus size={14} />
          바로가기 추가
        </button>
      </div>

      <div className="links-card-body">
        <div className="links-grid">
          {links.map((link, index) => {
            const domain = getDomain(link.url);
            const isDragging = draggedIndex === index;
            const isDragOver = dragOverIndex === index;

            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={`link-tile ${isDragging ? 'dragging' : ''} ${isDragOver ? 'drag-over' : ''}`}
                title="드래그하여 순서를 바꿀 수 있습니다"
              >
                <div className="link-tile-header">
                  <div className="link-favicon-wrapper">
                    <img
                      src={getFaviconUrl(link.url)}
                      alt={link.title}
                      className="link-favicon"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>

                  <div className="link-actions">
                    <button
                      className="link-action-btn"
                      title="수정"
                      onClick={(e) => handleEdit(link, e)}
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      className="link-action-btn delete"
                      title="삭제"
                      onClick={(e) => handleDelete(link.id, e)}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <div className="link-title">{link.title}</div>
                <div className="link-url">{domain}</div>
              </a>
            );
          })}

          {/* Quick Add Card */}
          <button
            className="add-link-tile"
            onClick={() => {
              setEditingLink(null);
              setIsModalOpen(true);
            }}
          >
            <Plus size={20} />
            <span style={{ fontSize: '12px', fontWeight: 600 }}>새 바로가기 추가</span>
          </button>
        </div>
      </div>

      <BookmarkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(link) => {
          if (editingLink) {
            onUpdateLink(link);
          } else {
            onAddLink(link);
          }
        }}
        editingLink={editingLink}
      />
    </section>
  );
};
