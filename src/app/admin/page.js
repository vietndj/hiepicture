'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ artworks: 0, albums: 0, blogPosts: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [artworksRes, albumsRes, blogRes] = await Promise.all([
          fetch('/api/content/artworks'),
          fetch('/api/content/albums'),
          fetch('/api/content/blog')
        ]);
        
        const artworks = await artworksRes.json();
        const albums = await albumsRes.json();
        const blogPosts = await blogRes.json();
        
        setStats({
          artworks: Array.isArray(artworks) ? artworks.length : 0,
          albums: Array.isArray(albums) ? albums.length : 0,
          blogPosts: Array.isArray(blogPosts) ? blogPosts.length : 0
        });
      } catch (error) {
        console.error('Failed to load stats', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  if (loading) {
    return <div style={{ color: 'var(--text-muted)' }}>Loading Dashboard...</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 700, color: 'var(--text-light)', marginBottom: '0.5rem' }}>
          Dashboard Overview
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          Welcome to HIEPICTURE Content Management System.
        </p>
      </div>
      
      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="admin-card" style={{ borderLeft: '4px solid var(--accent)' }}>
          <div style={{ fontSize: '11px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            TOTAL ARTWORKS
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '3rem', fontWeight: 700, color: 'var(--text-light)' }}>
            {stats.artworks}
          </div>
        </div>

        <div className="admin-card" style={{ borderLeft: '4px solid var(--accent)' }}>
          <div style={{ fontSize: '11px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            ALBUMS
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '3rem', fontWeight: 700, color: 'var(--text-light)' }}>
            {stats.albums}
          </div>
        </div>

        <div className="admin-card" style={{ borderLeft: '4px solid var(--accent)' }}>
          <div style={{ fontSize: '11px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            BLOG POSTS
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '3rem', fontWeight: 700, color: 'var(--text-light)' }}>
            {stats.blogPosts}
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="admin-card">
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-light)', marginBottom: '1.5rem' }}>
          Quick Actions
        </h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/admin/artworks" className="admin-btn" style={{ textDecoration: 'none' }}>
            + Manage Artworks
          </Link>
          <Link href="/admin/albums" className="admin-btn" style={{ textDecoration: 'none', backgroundColor: 'rgba(255,255,255,0.1)', color: 'var(--text-light)' }}>
            + Manage Albums
          </Link>
          <Link href="/admin/blog" className="admin-btn" style={{ textDecoration: 'none', backgroundColor: 'rgba(255,255,255,0.1)', color: 'var(--text-light)' }}>
            + Write Blog Post
          </Link>
        </div>
      </div>
    </div>
  );
}
