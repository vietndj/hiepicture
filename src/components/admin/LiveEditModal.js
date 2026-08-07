'use client';

import React, { useState, useEffect } from 'react';

export default function LiveEditModal({ isOpen, mode, itemType, initialData, onClose, onSaveSuccess }) {
  const [formData, setFormData] = useState({});
  const [bulkImages, setBulkImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        published: true,
        ...initialData
      });
    } else {
      setFormData({
        title: '',
        description: '',
        categoryId: 'art',
        albumId: 'kafka-collection',
        imageUrl: '',
        coverImage: '',
        published: true,
        tags: []
      });
    }
    setBulkImages([]);
  }, [initialData, mode, itemType]);

  useEffect(() => {
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

  // Bulk & Single Image Upload Handler
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    const uploadedUrls = [];

    try {
      for (const file of files) {
        const data = new FormData();
        data.append('file', file);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: data,
        });

        if (res.ok) {
          const result = await res.json();
          const url = result.url || result.displayUrl || result.secure_url;
          if (url) uploadedUrls.push({ url, name: file.name.replace(/\.[^/.]+$/, "") });
        }
      }

      if (uploadedUrls.length > 0) {
        if (files.length === 1 || mode === 'edit') {
          const firstUrl = uploadedUrls[0].url;
          handleChange(itemType === 'album' ? 'coverImage' : 'imageUrl', firstUrl);
          handleChange('thumbnailUrl', firstUrl);
        } else {
          // Bulk Mode: Store list of uploaded images to bulk-create artworks on save
          setBulkImages(uploadedUrls);
          handleChange('imageUrl', uploadedUrls[0].url);
        }
      } else {
        alert('Upload failed. Please enter URL manually.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Network error while uploading images.');
    } finally {
      setUploading(false);
    }
  };

  // Save changes directly to JSON
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const apiEndpoint = `/api/content/${itemType === 'artwork' ? 'artworks' : itemType === 'album' ? 'albums' : 'blog'}`;
      const res = await fetch(apiEndpoint);
      let currentItems = await res.json();
      if (!Array.isArray(currentItems)) currentItems = [];

      let updatedItems = [];

      if (mode === 'edit') {
        updatedItems = currentItems.map(item => item.id === formData.id ? { ...item, ...formData } : item);
      } else if (bulkImages.length > 1 && itemType === 'artwork') {
        // Bulk Create Multiple Artworks at Once
        const newArtworks = bulkImages.map((img, idx) => ({
          ...formData,
          id: `artwork-${Date.now()}-${idx}`,
          title: formData.title ? `${formData.title} (${idx + 1})` : img.name,
          imageUrl: img.url,
          thumbnailUrl: img.url,
          order: currentItems.length + idx + 1,
          published: formData.published !== false,
          createdAt: new Date().toISOString()
        }));
        updatedItems = [...currentItems, ...newArtworks];
      } else {
        // Single Create
        const newItem = {
          ...formData,
          id: `${itemType}-${Date.now()}`,
          slug: formData.slug || (formData.title ? formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `${itemType}-${Date.now()}`),
          order: currentItems.length + 1,
          published: formData.published !== false,
          createdAt: new Date().toISOString()
        };
        updatedItems = [...currentItems, newItem];
      }

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
          {/* Title & Status Row */}
          <div className="live-edit-row">
            <div className="live-edit-field flex-1">
              <label>TITLE</label>
              <input 
                type="text" 
                value={formData.title || ''} 
                onChange={e => handleChange('title', e.target.value)} 
                required={mode === 'edit' || bulkImages.length <= 1}
                placeholder="Title..."
              />
            </div>

            <div className="live-edit-field" style={{ width: '180px' }}>
              <label>VISIBILITY / STATUS</label>
              <select 
                value={formData.published !== false ? 'published' : 'draft'} 
                onChange={e => handleChange('published', e.target.value === 'published')}
              >
                <option value="published">👁️ Published</option>
                <option value="draft">🙈 Draft (Hidden)</option>
              </select>
            </div>
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

          {/* Image Picker / Bulk Upload */}
          <div className="live-edit-field">
            <label>
              IMAGE / COVER PHOTO {bulkImages.length > 0 && `(${bulkImages.length} images queued for bulk upload)`}
            </label>
            
            {imageSrc && (
              <div className="live-edit-preview">
                <img src={imageSrc} alt="Preview" />
              </div>
            )}
            
            <div className="live-edit-upload-box">
              <input 
                type="file" 
                accept="image/*" 
                multiple={mode === 'create' && itemType === 'artwork'}
                onChange={handleImageUpload}
                id="live-file-input"
                style={{ display: 'none' }}
              />
              <label htmlFor="live-file-input" className="live-upload-btn">
                {uploading ? 'Uploading...' : mode === 'create' && itemType === 'artwork' ? '📁 Choose File(s) / Bulk Upload' : '📁 Choose Image File'}
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

          {/* Category Dropdown */}
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
                {saving ? 'Saving...' : bulkImages.length > 1 ? `💾 Save All ${bulkImages.length} Artworks` : '💾 Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
