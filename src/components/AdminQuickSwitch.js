'use client';

import React, { useState, useEffect } from 'react';

export default function AdminQuickSwitch() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkToken = () => {
      const hasToken = document.cookie.includes('admin_token=');
      setIsAdmin(hasToken);
      if (hasToken) {
        document.body.classList.add('admin-edit-active');
      } else {
        document.body.classList.remove('admin-edit-active');
      }
    };
    checkToken();
  }, []);

  const toggleAdminMode = () => {
    if (isAdmin) {
      // Turn OFF
      document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      setIsAdmin(false);
      document.body.classList.remove('admin-edit-active');
    } else {
      // Turn ON instantly (no login required for dev phase)
      document.cookie = 'admin_token=dev_active_token; path=/; max-age=86400; sameSite=lax';
      setIsAdmin(true);
      document.body.classList.add('admin-edit-active');
    }
    // Trigger page update to enable/disable inline edit badges
    window.location.reload();
  };

  return (
    <div className="admin-floating-switch-container">
      <button 
        onClick={toggleAdminMode}
        className={`admin-floating-switch ${isAdmin ? 'active' : ''}`}
        title="Toggle Admin Mode instantly (No login required for dev phase)"
      >
        <span className="switch-icon">{isAdmin ? '⚡' : '🔒'}</span>
        <span className="switch-text">ADMIN MODE</span>
        <span className={`switch-pill ${isAdmin ? 'on' : 'off'}`}>
          {isAdmin ? 'ON' : 'OFF'}
        </span>
      </button>
    </div>
  );
}
