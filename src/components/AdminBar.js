'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminBar({ onOpenAddModal, onOpenEditModal }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [editMode, setEditMode] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const hasToken = document.cookie.includes('admin_token=');
      setIsAdmin(hasToken);
    };

    checkAuth();
    // Re-check on cookie changes or interval
    const interval = setInterval(checkAuth, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isAdmin) {
      document.body.classList.toggle('admin-edit-active', editMode);
    } else {
      document.body.classList.remove('admin-edit-active');
    }
  }, [isAdmin, editMode]);

  if (!isAdmin) return null;

  const handleLogout = () => {
    document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    setIsAdmin(false);
    window.location.reload();
  };

  return (
    <div className="wordpress-admin-bar">
      <div className="admin-bar-left">
        <span className="admin-bar-badge">● HIEPICTURE ADMIN</span>
        
        <button 
          className={`admin-mode-toggle ${editMode ? 'on' : 'off'}`}
          onClick={() => setEditMode(!editMode)}
          title="Toggle inline hover-to-edit mode"
        >
          Inline Edit: {editMode ? 'ON ✏️' : 'OFF 👁️'}
        </button>
      </div>

      <div className="admin-bar-center">
        <button className="admin-bar-action-btn" onClick={() => onOpenAddModal('artwork')}>
          + Add Artwork
        </button>
        <button className="admin-bar-action-btn" onClick={() => onOpenAddModal('album')}>
          + Add Album
        </button>
        <button className="admin-bar-action-btn" onClick={() => onOpenAddModal('blog')}>
          + Add Blog Post
        </button>
      </div>

      <div className="admin-bar-right">
        <Link href="/admin" className="admin-bar-link">
          Admin Dashboard
        </Link>
        <button onClick={handleLogout} className="admin-bar-logout">
          Log Out
        </button>
      </div>
    </div>
  );
}
