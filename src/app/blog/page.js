import { getBlogPosts } from '@/lib/content';
import BlogCard from '@/components/BlogCard';

export const revalidate = 60;

export const metadata = {
  title: 'BLOG | HIEPICTURE'
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="blog-page">
      <h1>BLOG</h1>
      <div className="blog-grid">
        {posts.map(post => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
