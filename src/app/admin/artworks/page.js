'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function ManageArtworks() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchArtworks = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/content/artworks');
      const data = await res.json();
      setArtworks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtworks();
  }, []);

  if (loading) return <div style={{ color: 'var(--text-muted)' }}>Loading artworks...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 700, color: 'var(--text-light)', marginBottom: '0.25rem' }}>
            Artworks Management
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            {artworks.length} artworks in total
          </p>
        </div>
        <button className="admin-btn">+ Add New Artwork</button>
      </div>
      
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Preview</th>
              <th>Title</th>
              <th>Category</th>
              <th>Album</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {artworks.map(art => (
              <tr key={art.id}>
                <td style={{ width: '80px' }}>
                  <div style={{ width: '56px', height: '42px', position: 'relative', overflow: 'hidden', borderRadius: '4px', background: '#121110' }}>
                    <Image 
                      src={art.thumbnailUrl || art.imageUrl || art.image} 
                      alt={art.title}
                      fill
                      style={{ objectFit: 'cover' }}
                      unoptimized
                    />
                  </div>
                </td>
                <td style={{ fontWeight: 600, color: 'var(--text-light)' }}>{art.title}</td>
                <td style={{ color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '12px' }}>{art.categoryId}</td>
                <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{art.albumId}</td>
                <td style={{ textAlign: 'right' }}>
                  <button className="admin-btn" style={{ padding: '4px 10px', fontSize: '12px', marginRight: '6px', background: 'rgba(255,255,255,0.08)' }}>
                    Edit
                  </button>
                  <button className="admin-btn" style={{ padding: '4px 10px', fontSize: '12px', background: 'rgba(224,74,44,0.2)', color: '#ff7761' }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
