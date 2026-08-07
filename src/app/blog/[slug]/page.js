import { getBlogPost } from '@/lib/content';
import Link from 'next/link';
import Image from 'next/image';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  return {
    title: `${post?.title || 'Blog Post'} | HIEPICTURE`,
    description: post?.excerpt || 'Article by HIEP',
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return (
      <div className="medium-article-container" style={{ textAlign: 'center', padding: '4rem 0' }}>
        <h1>Post not found</h1>
        <Link href="/blog" className="nav-btn-pill" style={{ marginTop: '1rem', display: 'inline-block' }}>
          ← Back to Essays
        </Link>
      </div>
    );
  }

  const paragraphs = post.content ? post.content.split('\n\n') : [];
  const formattedDate = post.publishedAt 
    ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : '';

  return (
    <article className="medium-article-container">
      <div className="article-top-nav">
        <Link href="/blog" className="nav-btn-pill">
          ← BACK TO ESSAYS
        </Link>
      </div>

      {/* Article Header */}
      <header className="article-header">
        {post.tags && post.tags.length > 0 && (
          <span className="article-tag-badge">{post.tags[0]}</span>
        )}
        <h1 className="article-title">{post.title}</h1>
        {post.excerpt && <p className="article-subtitle">{post.excerpt}</p>}

        {/* Medium Author Badge */}
        <div className="article-author-card">
          <div className="author-avatar-medium">
            <Image 
              src={post.authorAvatar || '/artist-hiep.jpg'} 
              alt={post.author || 'HIEP'} 
              width={48} 
              height={48}
              style={{ borderRadius: '50%', objectFit: 'cover' }}
            />
          </div>
          <div className="author-info">
            <div className="author-name-title">{post.author || 'HIEP'}</div>
            <div className="author-meta-sub">
              <span>{post.authorRole || 'Visual Artist & Designer'}</span>
              <span className="meta-dot">·</span>
              <span>{formattedDate}</span>
              <span className="meta-dot">·</span>
              <span>{post.readingTime || '5 min read'}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Cover Photo */}
      {post.coverImage && (
        <div className="article-hero-cover">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="100vw"
            priority
            unoptimized={true}
            style={{ objectFit: 'cover' }}
          />
        </div>
      )}

      {/* Article Body Content */}
      <div className="article-body-content">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      {/* Article Footer Tags */}
      {post.tags && post.tags.length > 0 && (
        <footer className="article-footer-tags">
          {post.tags.map(tag => (
            <span key={tag} className="article-tag-chip">
              #{tag}
            </span>
          ))}
        </footer>
      )}
    </article>
  );
}
