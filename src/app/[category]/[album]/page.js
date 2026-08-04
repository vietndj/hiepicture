import { getCategories, getAlbum, getArtworks, getAlbums } from '@/lib/content';
import Sidebar from '@/components/Sidebar';
import ImageGrid from '@/components/ImageGrid';
import Link from 'next/link';

export const revalidate = 60;

export async function generateStaticParams() {
  const albums = getAlbums();
  return albums.map(album => ({
    category: album.categoryId,
    album: album.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { album: albumSlug } = await params;
  const album = getAlbum(albumSlug);
  return {
    title: `${album?.title || 'Album'} | HIEPICTURE`,
  };
}

export default async function AlbumPage({ params }) {
  const { category, album: albumSlug } = await params;
  const categories = getCategories();
  const album = getAlbum(albumSlug);
  const artworks = album ? getArtworks(album.id) : [];

  if (!album) {
    return (
      <div className="page-layout">
        <Sidebar categories={categories} currentCategory={category} activeSlug={albumSlug} />
        <div className="panel-main" style={{ textAlign: 'center', paddingTop: '4rem' }}>
          <h1>Album not found</h1>
          <Link href={`/${category}`}>← Back to {category.toUpperCase()}</Link>
        </div>
      </div>
    );
  }

  // Format artworks for ImageGrid
  const gridItems = artworks.map(art => ({
    ...art,
    href: `/${category}/${albumSlug}/${art.id}`
  }));

  return (
    <div className="page-layout">
      <Sidebar categories={categories} currentCategory={category} activeSlug={albumSlug} />
      <div className="panel-main">
        <div className="breadcrumb">
          <Link href={`/${category}`}>{category.toUpperCase()}</Link>
          <span style={{ margin: '0 0.5rem', opacity: 0.4 }}>/</span>
          <span>{album.title}</span>
        </div>

        <div className="panel-header" style={{ borderBottom: 'none', paddingBottom: 0 }}>
          <h1 className="panel-folder-name">{album.title}</h1>
          <span className="panel-folder-count">{artworks.length} artworks</span>
        </div>

        {album.description && (
          <p className="folder-desc">{album.description}</p>
        )}

        <ImageGrid items={gridItems} itemType="artwork" />

        <div className="folder-desc" style={{ marginTop: '3.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Showing all {artworks.length} works in {album.title}
          </span>
          
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Link href={`/${category}`} className="nav-btn-pill close-pill">
              ← Back to {category.toUpperCase()}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
