import { getBlogPosts } from '@/lib/content';
import BlogCard from '@/components/BlogCard';

export const revalidate = 60;

export const metadata = {
  title: 'BLOG | HIEPICTURE',
  description: 'Articles, essays, and creative thoughts on visual art, calligraphy, typography, and design by HIEP.',
};

export default async function BlogPage() {
  const posts = await getBlogPosts();
  const featuredPost = posts[0];
  const sidePosts = posts.slice(1, 3);

  return (
    <div className="medium-blog-layout">
      {/* Blog Hero Header */}
      <div className="blog-header-section">
        <h1 className="blog-main-title">ESSAYS & PERSPECTIVES</h1>
        <p className="blog-main-subtitle">
          Thoughts on visual art, calligraphy, typography, and creative process by HIEP.
        </p>
      </div>

      {/* Featured 2-Column Hero Section (Medium.com style) */}
      {featuredPost && (
        <div className="medium-hero-section">
          <div className="hero-featured-main">
            <BlogCard post={featuredPost} isFeatured={true} />
          </div>

          <div className="hero-featured-side">
            <div className="side-heading">LATEST WRITINGS</div>
            {sidePosts.map(post => (
              <BlogCard key={post.id || post.slug} post={post} isCompact={true} />
            ))}
          </div>
        </div>
      )}

      {/* All Stories Feed Section */}
      <div className="stories-feed-section">
        <div className="feed-heading">ALL STORIES</div>
        <div className="stories-feed-grid">
          {posts.map(post => (
            <BlogCard key={post.id || post.slug} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
