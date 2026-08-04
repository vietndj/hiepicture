'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminLayout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const hasToken = document.cookie.includes('admin_token=');
      setIsAuthenticated(hasToken);
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      
      if (res.ok) {
        setIsAuthenticated(true);
      } else {
        setError('Incorrect password. Please try again.');
      }
    } catch (err) {
      setError('Login failed. Please check network.');
    }
  };

  const handleLogout = () => {
    document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <div className="admin-login-container">
        <div style={{ color: 'var(--text-muted)' }}>Loading Admin Portal...</div>
      </div>
    );
  }

  // Unauthenticated: Show sleek dark login modal
  if (!isAuthenticated) {
    return (
      <div className="admin-login-container">
        <div className="admin-login-card">
          <div className="admin-brand">HIEPICTURE</div>
          <h1 className="admin-login-title">ADMIN CONTROL CENTER</h1>
          <p className="admin-login-sub">Enter credentials to manage portfolio content</p>
          
          {error && <div className="admin-error-box">{error}</div>}
          
          <form onSubmit={handleLogin} className="admin-login-form">
            <div className="admin-field-group">
              <label className="admin-field-label">PASSWORD</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="admin-input-styled"
                autoFocus
                required
              />
            </div>
            
            <button type="submit" className="admin-btn-accent">
              LOG IN ➔
            </button>
          </form>

          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <Link href="/" className="admin-back-link">
              ← Return to public website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: '📊' },
    { label: 'Artworks', path: '/admin/artworks', icon: '🖼️' },
    { label: 'Albums', path: '/admin/albums', icon: '📁' },
    { label: 'Categories', path: '/admin/categories', icon: '🗂️' },
    { label: 'Blog', path: '/admin/blog', icon: '✍️' },
    { label: 'Bio & Contact', path: '/admin/bio', icon: '👤' },
  ];

  return (
    <div className="admin-layout">
      {/* Admin Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <span style={{ color: 'var(--accent)', marginRight: '8px' }}>●</span>
          HIEPICTURE ADMIN
        </div>

        <nav className="admin-nav-list">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`admin-nav-item ${isActive ? 'active' : ''}`}
              >
                <span style={{ marginRight: '10px' }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <Link href="/" target="_blank" className="admin-footer-btn">
            View Site ↗
          </Link>
          <button onClick={handleLogout} className="admin-logout-btn">
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Admin Area */}
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}
