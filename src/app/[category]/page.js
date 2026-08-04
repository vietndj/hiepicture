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
        <div className="panel-header">
          <h1 className="panel-folder-name">{category.toUpperCase()}</h1>
          <span className="panel-folder-count">{albums.length} albums</span>
        </div>

        <div className="img-grid">
          {albums.map(album => (
            <Link key={album.id} href={`/${category}/${album.slug}`} className="img-card">
              <div className="img-wrap">
                <Image
                  src={album.coverImage}
                  alt={album.title}
                  width={400}
                  height={300}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  unoptimized
                />
              </div>
              <div className="img-info">
                <div className="img-title">{album.title}</div>
                <div className="img-desc">{album.artworkCount} artworks</div>
              </div>
            </Link>
          ))}
        </div>

        <div className="folder-desc" style={{ marginTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.5rem' }}>
          {currentCatObj?.description || `Short description about all albums above in ${category.toUpperCase()} menu`}
        </div>
      </div>
    </div>
  );
}
