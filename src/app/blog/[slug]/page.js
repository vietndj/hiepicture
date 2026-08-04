import { getBlogPost } from '@/lib/content';
import Link from 'next/link';
import Image from 'next/image';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  return {
    title: `${post?.title || 'Blog Post'} | HIEPICTURE`,
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return (
      <div className="panel-main" style={{ padding: '4rem', textAlign: 'center' }}>
        <h1>Post not found</h1>
        <Link href="/blog">← Back to blog</Link>
      </div>
    );
  }

  const paragraphs = post.content.split('\n\n');

  return (
    <div className="blog-post">
      <Link href="/blog" className="back-link">← Back to blog</Link>
      {post.coverImage && (
        <div className="post-cover-wrap">
          <Image
            src={post.coverImage}
            alt={post.title}
            width={1200}
            height={600}
            style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
            unoptimized
          />
        </div>
      )}
      <h1>{post.title}</h1>
      <div className="post-meta">
        <span>{new Date(post.publishedAt).toLocaleDateString('vi-VN')}</span>
        {post.author && <span> · {post.author}</span>}
      </div>
      {post.tags && (
        <div className="post-tags">
          {post.tags.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      )}
      <div className="post-content">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </div>
  );
}
