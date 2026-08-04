import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function BlogCard({ post }) {
  if (!post) return null;

  return (
    <Link href={`/blog/${post.slug || '#'}`} className="blog-card">
      <div className="blog-card-image">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized={true}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', backgroundColor: '#eee' }}></div>
        )}
      </div>
      <div className="blog-card-content">
        {post.publishedAt && (
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            {new Date(post.publishedAt).toLocaleDateString()}
          </div>
        )}
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', lineHeight: 1.2 }}>
          {post.title}
        </h3>
        {post.excerpt && (
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            {post.excerpt}
          </p>
        )}
        {post.tags && post.tags.length > 0 && (
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {post.tags.map(tag => (
              <span key={tag} style={{ fontSize: '11px', color: 'var(--accent)', textTransform: 'uppercase' }}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
