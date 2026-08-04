'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Lightbox from './Lightbox';
import LiveEditModal from './admin/LiveEditModal';

export default function ArtworkView({ artwork, category, albumSlug, albumTitle, prevArtwork, nextArtwork }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const albumPath = category && albumSlug ? `/${category}/${albumSlug}` : `/${category || 'art'}`;

  useEffect(() => {
    setIsAdmin(document.cookie.includes('admin_token='));
  }, []);

  // Keyboard shortcut: Press Escape key to exit / close artwork view
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        router.push(albumPath);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router, albumPath]);

  if (!artwork) return null;

  const imageUrl = artwork.imageUrl || artwork.url || artwork.thumbnailUrl;
  const prevHref = typeof prevArtwork === 'string' ? prevArtwork : prevArtwork?.href;
  const nextHref = typeof nextArtwork === 'string' ? nextArtwork : nextArtwork?.href;

  return (
    <div className="artwork-layout">
      {/* Top Header Bar for Instant & Clear Exit */}
      <div className="artwork-top-bar">
        <div className="breadcrumb" style={{ margin: 0 }}>
          <Link href={`/${category || 'art'}`}>{(category || 'ART').toUpperCase()}</Link>
          {albumTitle && (
            <>
              <span style={{ margin: '0 0.5rem', opacity: 0.4 }}>/</span>
              <Link href={albumPath}>{albumTitle}</Link>
            </>
          )}
          <span style={{ margin: '0 0.5rem', opacity: 0.4 }}>/</span>
          <span style={{ color: 'var(--text-light)' }}>{artwork.title}</span>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {isAdmin && (
            <button 
              className="artwork-close-btn" 
              onClick={() => setIsEditing(true)}
              style={{ background: 'rgba(224, 74, 44, 0.2)', borderColor: 'var(--accent)' }}
            >
              ✏️ EDIT ARTWORK
            </button>
          )}

          {/* Clear Exit / Close Button */}
          <Link href={albumPath} className="artwork-close-btn" title="Back to Album (Press Esc)">
            <span>✕</span> CLOSE
          </Link>
        </div>
      </div>

      {/* Main Image View */}
      <div className="artwork-image-pane">
        <div className="artwork-image-container" onClick={() => setLightboxOpen(true)} title="Click to view fullscreen">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={artwork.title || 'Artwork'}
              fill
              sizes="70vw"
              unoptimized={true}
              style={{ objectFit: 'contain' }}
              priority
            />
          ) : (
            <div style={{ color: 'var(--text-muted)' }}>No image available</div>
          )}
        </div>
      </div>
      
      {/* Artwork Metadata & Navigation */}
      <div className="artwork-info-pane">
        {/* Top Tagline */}
        <div className="artwork-meta-tagline">
          <span>{(category || artwork.categoryId || 'ART').toUpperCase()}</span>
          {artwork.year && <span> • {artwork.year}</span>}
        </div>

        {/* Main Title (GT Sectra) */}
        <h1 className="artwork-title">{artwork.title}</h1>

        {/* Structured Metadata Grid */}
        <div className="artwork-details-grid">
          {albumTitle && (
            <div className="artwork-meta-item">
              <span className="meta-label">COLLECTION</span>
              <span className="meta-value">{albumTitle}</span>
            </div>
          )}

          {artwork.medium && (
            <div className="artwork-meta-item">
              <span className="meta-label">MEDIUM & TECH</span>
              <span className="meta-value">{artwork.medium}</span>
            </div>
          )}

          {artwork.year && (
            <div className="artwork-meta-item">
              <span className="meta-label">YEAR</span>
              <span className="meta-value">{artwork.year}</span>
            </div>
          )}
        </div>
        
        {/* 3-Line Rich Story / Description */}
        {artwork.description && (
          <div className="artwork-description-box">
            <span className="meta-label" style={{ display: 'block', marginBottom: '0.6rem' }}>ABOUT THE WORK</span>
            {artwork.description.split('\n').map((line, i) => (
              line.trim() ? <p key={i} className="artwork-desc-line">{line}</p> : null
            ))}
          </div>
        )}
        
        {/* Tags Pills */}
        {artwork.tags && artwork.tags.length > 0 && (
          <div className="artwork-tags-row">
            {artwork.tags.map(tag => (
              <span key={tag} className="artwork-tag-pill">
                #{tag}
              </span>
            ))}
          </div>
        )}
        
        {/* Navigation Bar at Bottom */}
        <div className="artwork-nav">
          {prevHref ? (
            <Link href={prevHref} className="nav-btn-pill">
              ← PREV
            </Link>
          ) : (
            <span className="nav-btn-pill disabled">← PREV</span>
          )}
          
          <Link href={albumPath} className="nav-btn-pill close-pill">
            ✕ CLOSE
          </Link>
          
          {nextHref ? (
            <Link href={nextHref} className="nav-btn-pill next-pill">
              NEXT →
            </Link>
          ) : (
            <span className="nav-btn-pill disabled">NEXT →</span>
          )}
        </div>
      </div>
      
      {lightboxOpen && imageUrl && (
        <Lightbox 
          images={[{ url: imageUrl, title: artwork.title, description: artwork.description }]} 
          isOpen={lightboxOpen} 
          onClose={() => setLightboxOpen(false)} 
        />
      )}

      {/* Live Edit Modal */}
      {isEditing && (
        <LiveEditModal
          isOpen={isEditing}
          mode="edit"
          itemType="artwork"
          initialData={artwork}
          onClose={() => setIsEditing(false)}
          onSaveSuccess={() => setIsEditing(false)}
        />
      )}
    </div>
  );
}
