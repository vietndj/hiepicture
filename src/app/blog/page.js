import { getBlogPosts } from '@/lib/content';
import BlogCard from '@/components/BlogCard';

export const revalidate = 60;

export const metadata = {
  title: 'BLOG | HIEPICTURE',
  description: 'Articles, essays, and creative thoughts by HIEPICTURE — Visual Artist & Designer',
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="blog-container-page">
      <div className="panel-header" style={{ marginBottom: '2.5rem' }}>
        <h1 className="panel-folder-name">BLOG</h1>
        <span className="panel-folder-count">{posts.length} articles</span>
      </div>

      <div className="blog-grid">
        {posts.map(post => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
