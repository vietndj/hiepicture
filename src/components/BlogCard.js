import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function BlogCard({ post }) {
  if (!post) return null;

  const formattedDate = post.publishedAt 
    ? new Date(post.publishedAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : '';

  return (
    <Link href={`/blog/${post.slug || '#'}`} className="editorial-story-item">
      <div className="story-main-info">
        {/* Top Tag & Reading Time */}
        <div className="story-meta-top">
          <span className="story-tag-badge">{post.tags?.[0] || 'ESSAY'}</span>
          <span className="story-dot">•</span>
          <span className="story-date">{formattedDate}</span>
          <span className="story-dot">•</span>
          <span className="story-read-time">{post.readingTime || '4 min read'}</span>
        </div>

        {/* Title */}
        <h2 className="story-title">{post.title}</h2>

        {/* Excerpt */}
        {post.excerpt && <p className="story-excerpt">{post.excerpt}</p>}

        {/* Author Credit */}
        <div className="story-author-credit">
          By <span className="author-name">{post.author || 'HIEP'}</span>
        </div>
      </div>

      {/* Compact Thumbnail Image on Right */}
      {post.coverImage && (
        <div className="story-thumb-wrap">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 200px"
            unoptimized={true}
            style={{ objectFit: 'cover' }}
          />
        </div>
      )}
    </Link>
  );
}
