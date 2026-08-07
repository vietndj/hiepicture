'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import LiveEditModal from '@/components/admin/LiveEditModal';

export default function ManageBlog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedPost, setSelectedPost] = useState(null);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/content/blog');
      const data = await res.json();
      if (Array.isArray(data)) {
        setPosts(data);
      } else {
        setPosts([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const savePostsList = async (updatedList) => {
    try {
      const saveRes = await fetch('/api/content/blog', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedList),
      });
      if (saveRes.ok) {
        setPosts(updatedList);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Toggle Published / Draft Handler
  const toggleStatus = async (post) => {
    const updated = posts.map(item => 
      (item.id === post.id || item.slug === post.slug) ? { ...item, published: item.published === false ? true : false } : item
    );
    await savePostsList(updated);
  };

  // Delete Handler
  const handleDelete = async (post) => {
    if (!confirm(`Are you sure you want to delete "${post.title}"?`)) return;
    const updated = posts.filter(item => item.id !== post.id && item.slug !== post.slug);
    await savePostsList(updated);
  };

  if (loading) return <div style={{ color: 'var(--text-muted)', padding: '2rem' }}>Loading blog essays...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 700, color: 'var(--text-light)', marginBottom: '0.25rem' }}>
            Blog & Essays Management
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            {posts.length} articles published • Manage Medium-style essays, cover images, and tags
          </p>
        </div>
        <button 
          className="admin-btn"
          onClick={() => {
            setSelectedPost(null);
            setModalMode('create');
            setModalOpen(true);
          }}
        >
          + Write New Essay / Article
        </button>
      </div>
      
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: '90px' }}>Cover</th>
              <th>Article Title</th>
              <th>Tags / Category</th>
              <th>Published Date</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => {
              const formattedDate = post.publishedAt 
                ? new Date(post.publishedAt).toLocaleDateString('vi-VN')
                : 'N/A';

              return (
                <tr key={post.id || post.slug}>
                  {/* Preview */}
                  <td style={{ width: '90px' }}>
                    <div style={{ width: '64px', height: '42px', position: 'relative', overflow: 'hidden', borderRadius: '4px', background: '#121110' }}>
                      <Image 
                        src={post.coverImage || '/placeholder-cover.jpg'} 
                        alt={post.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        unoptimized
                      />
                    </div>
                  </td>

                  {/* Title & Excerpt */}
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-light)', fontSize: '14px', marginBottom: '2px' }}>
                      {post.title}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '380px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {post.excerpt}
                    </div>
                  </td>

                  {/* Tags */}
                  <td style={{ fontSize: '12px' }}>
                    {post.tags && post.tags.length > 0 ? (
                      <span style={{ color: 'var(--accent)', fontWeight: 700, background: 'rgba(224, 74, 44, 0.12)', padding: '2px 8px', borderRadius: '10px' }}>
                        {post.tags[0]}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>—</span>
                    )}
                  </td>

                  {/* Date */}
                  <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                    {formattedDate}
                  </td>

                  {/* Published / Draft Status */}
                  <td>
                    <button 
                      onClick={() => toggleStatus(post)}
                      style={{
                        background: post.published === false ? 'rgba(255, 255, 255, 0.08)' : 'rgba(224, 74, 44, 0.2)',
                        border: `1px solid ${post.published === false ? 'rgba(255, 255, 255, 0.2)' : 'var(--accent)'}`,
                        color: post.published === false ? 'rgba(255, 255, 255, 0.6)' : '#ffffff',
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '4px 10px',
                        borderRadius: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      {post.published === false ? '🙈 Draft' : '👁️ Published'}
                    </button>
                  </td>

                  {/* Actions */}
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      className="admin-btn" 
                      onClick={() => {
                        setSelectedPost(post);
                        setModalMode('edit');
                        setModalOpen(true);
                      }}
                      style={{ padding: '4px 12px', fontSize: '12px', marginRight: '6px', background: 'rgba(255,255,255,0.08)' }}
                    >
                      Edit
                    </button>
                    <button 
                      className="admin-btn" 
                      onClick={() => handleDelete(post)}
                      style={{ padding: '4px 12px', fontSize: '12px', background: 'rgba(255,50,50,0.2)', color: '#ff6b6b' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <LiveEditModal
          isOpen={modalOpen}
          mode={modalMode}
          itemType="blog"
          initialData={selectedPost}
          onClose={() => setModalOpen(false)}
          onSaveSuccess={() => {
            setModalOpen(false);
            fetchPosts();
          }}
        />
      )}
    </div>
  );
}
