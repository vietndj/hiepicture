import { getBlogPosts } from '@/lib/content';
import BlogCard from '@/components/BlogCard';

export const revalidate = 60;

export const metadata = {
  title: 'BLOG | HIEPICTURE',
  description: 'Góc chia sẻ về tư duy sáng tác, triết lý nét cọ Á Đông và thiết kế thị giác của HIEP.',
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="editorial-blog-container">
      {/* Blog Header & Intro */}
      <header className="editorial-blog-header">
        <h1 className="editorial-page-title">BLOG & WRITINGS</h1>
        <p className="editorial-page-subtitle">
          Góc chia sẻ của HIEP về hành trình sáng tác, triết lý nét cọ Á Đông, thiết kế chữ và các thử nghiệm thị giác.
        </p>
      </header>

      {/* Story Feed List */}
      <div className="editorial-story-feed">
        {posts.map((post) => (
          <BlogCard key={post.id || post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
