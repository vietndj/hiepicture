import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function BlogCard({ post, isFeatured = false, isCompact = false }) {
  if (!post) return null;

  const formattedDate = post.publishedAt 
    ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '';

  return (
    <Link 
      href={`/blog/${post.slug || '#'}`} 
      className={`medium-story-card ${isFeatured ? 'featured' : ''} ${isCompact ? 'compact' : ''}`}
    >
      {post.coverImage && (
        <div className="story-image-wrap">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized={true}
            style={{ objectFit: 'cover' }}
          />
        </div>
      )}

      <div className="story-content-wrap">
        {/* Author & Meta Row */}
        <div className="story-author-row">
          <div className="author-avatar-small">
            <Image 
              src={post.authorAvatar || '/artist-hiep.jpg'} 
              alt={post.author || 'HIEP'} 
              width={24} 
              height={24}
              style={{ borderRadius: '50%', objectFit: 'cover' }}
            />
          </div>
          <span className="author-name">{post.author || 'HIEP'}</span>
          <span className="meta-dot">·</span>
          <span className="story-date">{formattedDate}</span>
        </div>

        {/* Story Title */}
        <h2 className="story-title">{post.title}</h2>

        {/* Story Excerpt */}
        {!isCompact && post.excerpt && (
          <p className="story-excerpt">{post.excerpt}</p>
        )}

        {/* Footer Meta Row */}
        <div className="story-footer-row">
          <span className="story-reading-time">{post.readingTime || '4 min read'}</span>
          {post.tags && post.tags.length > 0 && (
            <span className="story-tag-pill">{post.tags[0]}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
