'use client';

import React, { useState, useEffect } from 'react';

export default function LiveEditModal({ isOpen, mode, itemType, initialData, onClose, onSaveSuccess }) {
  const [formData, setFormData] = useState({});
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        title: '',
        description: '',
        categoryId: 'art',
        albumId: 'kafka-collection',
        imageUrl: '',
        coverImage: '',
        tags: []
      });
    }
  }, [initialData, mode, itemType]);

  useEffect(() => {
    // Fetch categories and albums for dropdown selectors
    const loadDropdowns = async () => {
      try {
        const [catRes, albumRes] = await Promise.all([
          fetch('/api/content/categories'),
          fetch('/api/content/albums')
        ]);
        const catData = await catRes.json();
        const albumData = await albumRes.json();
        if (Array.isArray(catData)) setCategories(catData);
        if (Array.isArray(albumData)) setAlbums(albumData);
      } catch (e) {
        console.error(e);
      }
    };
    if (isOpen) loadDropdowns();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Image Upload Handler
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const data = new FormData();
      data.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });

      if (res.ok) {
        const result = await res.json();
        const url = result.url || result.displayUrl || result.secure_url;
        if (url) {
          handleChange(itemType === 'album' ? 'coverImage' : 'imageUrl', url);
          handleChange('thumbnailUrl', url);
          handleChange('imageUrl', url);
        } else {
          alert('Upload completed but no URL returned. Please enter URL manually.');
        }
      } else {
        const errJson = await res.json().catch(() => ({}));
        alert(errJson.error || 'Upload failed. Please enter URL manually.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Network error while uploading image.');
    } finally {
      setUploading(false);
    }
  };

  // Save changes directly to JSON
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // 1. Fetch current content array
      const apiEndpoint = `/api/content/${itemType === 'artwork' ? 'artworks' : itemType === 'album' ? 'albums' : 'blog'}`;
      const res = await fetch(apiEndpoint);
      let currentItems = await res.json();
      if (!Array.isArray(currentItems)) currentItems = [];

      let updatedItems = [];
      if (mode === 'edit') {
        updatedItems = currentItems.map(item => item.id === formData.id ? { ...item, ...formData } : item);
      } else {
        const newItem = {
          ...formData,
          id: `${itemType}-${Date.now()}`,
          slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          order: currentItems.length + 1,
          createdAt: new Date().toISOString()
        };
        updatedItems = [...currentItems, newItem];
      }

      // 2. PUT updated array back to API
      const saveRes = await fetch(apiEndpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItems),
      });

      if (saveRes.ok) {
        onSaveSuccess();
        onClose();
        window.location.reload();
      } else {
        alert('Failed to save changes.');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving data.');
    } finally {
      setSaving(false);
    }
  };

  // Delete Item Handler
  const handleDelete = async () => {
    if (!formData.id || !confirm(`Delete "${formData.title}"?`)) return;
    setSaving(true);

    try {
      const apiEndpoint = `/api/content/${itemType === 'artwork' ? 'artworks' : itemType === 'album' ? 'albums' : 'blog'}`;
      const res = await fetch(apiEndpoint);
      let currentItems = await res.json();
      const updatedItems = currentItems.filter(item => item.id !== formData.id);

      const saveRes = await fetch(apiEndpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItems),
      });

      if (saveRes.ok) {
        onSaveSuccess();
        onClose();
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const imageSrc = formData.imageUrl || formData.coverImage || formData.thumbnailUrl;

  return (
    <div className="live-edit-overlay">
      <div className="live-edit-modal">
        <div className="live-edit-header">
          <h2>
            {mode === 'edit' ? `✏️ EDIT ${itemType.toUpperCase()}` : `+ ADD NEW ${itemType.toUpperCase()}`}
          </h2>
          <button onClick={onClose} className="live-edit-close">✕</button>
        </div>

        <form onSubmit={handleSave} className="live-edit-form">
          {/* Title */}
          <div className="live-edit-field">
            <label>TITLE</label>
            <input 
              type="text" 
              value={formData.title || ''} 
              onChange={e => handleChange('title', e.target.value)} 
              required
              placeholder="Title..."
            />
          </div>

          {/* Description */}
          <div className="live-edit-field">
            <label>DESCRIPTION</label>
            <textarea 
              value={formData.description || ''} 
              onChange={e => handleChange('description', e.target.value)} 
              rows={3}
              placeholder="Description..."
            />
          </div>

          {/* Image Picker / Upload */}
          <div className="live-edit-field">
            <label>IMAGE / COVER PHOTO</label>
            {imageSrc && (
              <div className="live-edit-preview">
                <img src={imageSrc} alt="Preview" />
              </div>
            )}
            
            <div className="live-edit-upload-box">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload}
                id="live-file-input"
                style={{ display: 'none' }}
              />
              <label htmlFor="live-file-input" className="live-upload-btn">
                {uploading ? 'Uploading...' : '📁 Choose Image File'}
              </label>

              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>OR enter image URL:</span>
              <input 
                type="url" 
                value={imageSrc || ''} 
                onChange={e => {
                  handleChange('imageUrl', e.target.value);
                  handleChange('coverImage', e.target.value);
                  handleChange('thumbnailUrl', e.target.value);
                }}
                placeholder="https://..."
                style={{ flex: 1 }}
              />
            </div>
          </div>

          {/* Category Dropdown (if artwork or album) */}
          {itemType !== 'blog' && (
            <div className="live-edit-row">
              <div className="live-edit-field flex-1">
                <label>CATEGORY</label>
                <select 
                  value={formData.categoryId || 'art'} 
                  onChange={e => handleChange('categoryId', e.target.value)}
                >
                  <option value="art">ART</option>
                  <option value="design">DESIGN</option>
                  <option value="play">PLAY</option>
                </select>
              </div>

              {itemType === 'artwork' && (
                <div className="live-edit-field flex-1">
                  <label>ALBUM</label>
                  <select 
                    value={formData.albumId || ''} 
                    onChange={e => handleChange('albumId', e.target.value)}
                  >
                    {albums.map(album => (
                      <option key={album.id} value={album.id}>{album.title}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Buttons */}
          <div className="live-edit-actions">
            {mode === 'edit' && (
              <button type="button" onClick={handleDelete} className="live-btn-delete">
                🗑️ Delete
              </button>
            )}

            <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
              <button type="button" onClick={onClose} className="live-btn-cancel">
                Cancel
              </button>
              <button type="submit" disabled={saving || uploading} className="live-btn-save">
                {saving ? 'Saving...' : '💾 Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
