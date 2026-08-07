'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Lightbox from './Lightbox';
import LiveEditModal from './admin/LiveEditModal';

export default function ImageGrid({ items, itemType = 'artwork' }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      setIsAdmin(document.cookie.includes('admin_token='));
    };
    checkAuth();
  }, []);

  if (!items || items.length === 0) {
    return <div style={{ color: 'var(--text-muted)', padding: '2rem 0' }}>No items to display</div>;
  }

  const handleEditClick = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    setEditItem(item);
  };

  return (
    <>
      <div className="img-grid">
        {items.map((item, index) => {
          const CardComponent = item.href ? Link : 'div';
          const imgSrc = item.thumbnailUrl || item.imageUrl || item.coverImage || item.url;
          
          return (
            <div key={item.id} className="img-card-wrapper" style={{ position: 'relative' }}>
              {/* Admin Hover Edit Badge */}
              {isAdmin && (
                <button
                  className="admin-inline-edit-badge"
                  onClick={(e) => handleEditClick(e, item)}
                  title="Quick edit this item"
                >
                  ✏️ Edit
                </button>
              )}

              <CardComponent 
                href={item.href || '#'} 
                className="album-card-vibrant"
                onClick={(e) => {
                  if (!item.href) {
                    e.preventDefault();
                    setCurrentIndex(index);
                    setLightboxOpen(true);
                  }
                }}
              >
                {/* Full Vibrant Color Image (100% Opacity) */}
                {imgSrc ? (
                  <div className="album-cover-full">
                    <Image
                      src={imgSrc}
                      alt={item.title || 'Image'}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      unoptimized={true}
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                ) : (
                  <div className="album-cover-placeholder" />
                )}
                
                {/* Small Tag Title Badge Overlay */}
                <div className="album-tag-badge">
                  {item.title || 'Untitled'}
                </div>
              </CardComponent>
            </div>
          );
        })}
      </div>

      {lightboxOpen && (
        <Lightbox 
          images={items}
          initialIndex={currentIndex}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
        />
      )}

      {/* Live Edit Modal */}
      {editItem && (
        <LiveEditModal
          isOpen={!!editItem}
          mode="edit"
          itemType={itemType}
          initialData={editItem}
          onClose={() => setEditItem(null)}
          onSaveSuccess={() => {
            setEditItem(null);
          }}
        />
      )}
    </>
  );
}
