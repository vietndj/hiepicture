'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import LiveEditModal from '@/components/admin/LiveEditModal';

export default function ManageArtworks() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  const fetchArtworks = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/content/artworks');
      const data = await res.json();
      if (Array.isArray(data)) {
        setArtworks(data.sort((a, b) => (a.order || 0) - (b.order || 0)));
      } else {
        setArtworks([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtworks();
  }, []);

  const saveArtworksList = async (updatedList) => {
    try {
      const saveRes = await fetch('/api/content/artworks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedList),
      });
      if (saveRes.ok) {
        setArtworks(updatedList);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Reorder Handler (Move Up / Move Down)
  const moveItem = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= artworks.length) return;

    const newArtworks = [...artworks];
    const temp = newArtworks[index];
    newArtworks[index] = newArtworks[targetIndex];
    newArtworks[targetIndex] = temp;

    // Update order indices
    const reordered = newArtworks.map((item, idx) => ({ ...item, order: idx + 1 }));
    await saveArtworksList(reordered);
  };

  // Toggle Published / Draft Handler
  const toggleStatus = async (artwork) => {
    const updated = artworks.map(item => 
      item.id === artwork.id ? { ...item, published: item.published === false ? true : false } : item
    );
    await saveArtworksList(updated);
  };

  // Delete Handler
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this artwork?')) return;
    const updated = artworks.filter(item => item.id !== id);
    await saveArtworksList(updated);
  };

  if (loading) return <div style={{ color: 'var(--text-muted)', padding: '2rem' }}>Loading artworks...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 700, color: 'var(--text-light)', marginBottom: '0.25rem' }}>
            Artworks Management
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            {artworks.length} artworks total • Drag/move items to reorder display sequence
          </p>
        </div>
        <button 
          className="admin-btn"
          onClick={() => {
            setSelectedArtwork(null);
            setModalMode('create');
            setModalOpen(true);
          }}
        >
          + Add New / Bulk Upload Artworks
        </button>
      </div>
      
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: '80px' }}>Reorder</th>
              <th>Preview</th>
              <th>Title</th>
              <th>Category / Album</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {artworks.map((art, idx) => (
              <tr key={art.id}>
                {/* Reorder Buttons */}
                <td style={{ textAlign: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <button 
                      onClick={() => moveItem(idx, -1)}
                      disabled={idx === 0}
                      style={{ background: 'none', border: 'none', color: idx === 0 ? 'rgba(255,255,255,0.2)' : 'var(--text-light)', cursor: 'pointer', fontSize: '12px' }}
                      title="Move Up"
                    >
                      ▲
                    </button>
                    <button 
                      onClick={() => moveItem(idx, 1)}
                      disabled={idx === artworks.length - 1}
                      style={{ background: 'none', border: 'none', color: idx === artworks.length - 1 ? 'rgba(255,255,255,0.2)' : 'var(--text-light)', cursor: 'pointer', fontSize: '12px' }}
                      title="Move Down"
                    >
                      ▼
                    </button>
                  </div>
                </td>

                {/* Preview */}
                <td style={{ width: '80px' }}>
                  <div style={{ width: '56px', height: '42px', position: 'relative', overflow: 'hidden', borderRadius: '4px', background: '#121110' }}>
                    <Image 
                      src={art.thumbnailUrl || art.imageUrl || art.image} 
                      alt={art.title || 'Artwork'}
                      fill
                      style={{ objectFit: 'cover' }}
                      unoptimized
                    />
                  </div>
                </td>

                {/* Title */}
                <td style={{ fontWeight: 600, color: 'var(--text-light)' }}>{art.title || 'Untitled'}</td>

                {/* Category & Album */}
                <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                  <span style={{ textTransform: 'uppercase', color: 'var(--accent)', fontWeight: 700, fontSize: '11px', marginRight: '6px' }}>
                    {art.categoryId}
                  </span>
                  / {art.albumId}
                </td>

                {/* Published / Draft Status */}
                <td>
                  <button 
                    onClick={() => toggleStatus(art)}
                    style={{
                      background: art.published === false ? 'rgba(255, 255, 255, 0.08)' : 'rgba(224, 74, 44, 0.2)',
                      border: `1px solid ${art.published === false ? 'rgba(255, 255, 255, 0.2)' : 'var(--accent)'}`,
                      color: art.published === false ? 'rgba(255, 255, 255, 0.6)' : '#ffffff',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    {art.published === false ? '🙈 Draft' : '👁️ Published'}
                  </button>
                </td>

                {/* Actions */}
                <td style={{ textAlign: 'right' }}>
                  <button 
                    className="admin-btn" 
                    onClick={() => {
                      setSelectedArtwork(art);
                      setModalMode('edit');
                      setModalOpen(true);
                    }}
                    style={{ padding: '4px 12px', fontSize: '12px', marginRight: '6px', background: 'rgba(255,255,255,0.08)' }}
                  >
                    Edit
                  </button>
                  <button 
                    className="admin-btn" 
                    onClick={() => handleDelete(art.id)}
                    style={{ padding: '4px 12px', fontSize: '12px', background: 'rgba(255,50,50,0.2)', color: '#ff6b6b' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <LiveEditModal
          isOpen={modalOpen}
          mode={modalMode}
          itemType="artwork"
          initialData={selectedArtwork}
          onClose={() => setModalOpen(false)}
          onSaveSuccess={() => {
            setModalOpen(false);
            fetchArtworks();
          }}
        />
      )}
    </div>
  );
}
