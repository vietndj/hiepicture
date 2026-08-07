import { getCategories, getAlbums } from '@/lib/content';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
import Image from 'next/image';

export const revalidate = 60;

export async function generateStaticParams() {
  return [
    { category: 'art' },
    { category: 'design' },
    { category: 'play' }
  ];
}

export async function generateMetadata({ params }) {
  const { category } = await params;
  return {
    title: `${category.toUpperCase()} | HIEPICTURE`,
    description: `Explore ${category} works by HIEPICTURE — Visual Artist & Designer`,
  };
}

export default async function CategoryPage({ params }) {
  const { category } = await params;
  const categories = getCategories();
  const currentCatObj = categories.find(c => c.id === category || c.slug === category);
  const albums = getAlbums(category);

  return (
    <div className="page-layout">
      <Sidebar categories={categories} currentCategory={category} />
      <div className="panel-main">
        <div className="img-grid">
          {albums.map(album => (
            <Link key={album.id} href={`/${category}/${album.slug}`} className="album-card-vibrant">
              {/* Full Vibrant Color Image */}
              {album.coverImage ? (
                <div className="album-cover-full">
                  <Image
                    src={album.coverImage}
                    alt={album.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: 'cover' }}
                    unoptimized
                  />
                </div>
              ) : (
                <div className="album-cover-placeholder" />
              )}

              {/* Small Tag Title Badge Overlay */}
              <div className="album-tag-badge">
                {album.title}
              </div>
            </Link>
          ))}
        </div>

        <div className="folder-desc" style={{ marginTop: '3rem', fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>
          {currentCatObj?.description || `Short description about all albums above in ${category.toUpperCase()} menu`}
        </div>
      </div>
    </div>
  );
}
