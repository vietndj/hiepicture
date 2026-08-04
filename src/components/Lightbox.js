'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Lightbox({ images, initialIndex = 0, isOpen, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, currentIndex, images.length]);

  const nextImage = (e) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!isOpen || !images || images.length === 0) return null;

  const currentImg = images[currentIndex];

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <button className="lightbox-close" onClick={onClose} aria-label="Close">
        ✕
      </button>

      <div className="lightbox-nav">
        {currentIndex + 1} / {images.length}
      </div>

      {images.length > 1 && (
        <button className="lightbox-arrow prev" onClick={prevImage} aria-label="Previous image">
          ‹
        </button>
      )}

      <div className="relative w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
        {/* We use standard img for responsive lightbox images to respect max-width/max-height constraints easier without explicit dimensions */}
        <img
          src={currentImg.url || currentImg.thumbnailUrl}
          alt={currentImg.title || 'Lightbox image'}
          className="lightbox-image"
        />
      </div>

      {images.length > 1 && (
        <button className="lightbox-arrow next" onClick={nextImage} aria-label="Next image">
          ›
        </button>
      )}

      <div className="lightbox-caption">
        {currentImg.title && <strong>{currentImg.title}</strong>}
        {currentImg.description && <span> - {currentImg.description}</span>}
      </div>
    </div>
  );
}
