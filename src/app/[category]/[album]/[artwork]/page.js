import { getArtwork, getArtworks, getAlbum } from '@/lib/content';
import ArtworkView from '@/components/ArtworkView';
import Link from 'next/link';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { artwork: artworkId } = await params;
  const artwork = getArtwork(artworkId);
  return {
    title: `${artwork?.title || 'Artwork'} | HIEPICTURE`,
    openGraph: {
      images: artwork?.imageUrl ? [artwork.imageUrl] : [],
    },
  };
}

export default async function ArtworkPage({ params }) {
  const { category, album: albumSlug, artwork: artworkId } = await params;
  const artwork = getArtwork(artworkId);
  const album = getAlbum(albumSlug);
  const albumArtworks = album ? getArtworks(album.id) : [];

  if (!artwork) {
    return (
      <div className="panel-main" style={{ padding: '4rem', textAlign: 'center' }}>
        <h1>Artwork not found</h1>
        <Link href={`/${category}/${albumSlug}`}>← Back to album</Link>
      </div>
    );
  }

  const currentIndex = albumArtworks.findIndex(a => a.id === artworkId);
  const prevArtwork = currentIndex > 0 ? albumArtworks[currentIndex - 1] : null;
  const nextArtwork = currentIndex < albumArtworks.length - 1 ? albumArtworks[currentIndex + 1] : null;

  return (
    <ArtworkView
      artwork={artwork}
      category={category}
      albumSlug={albumSlug}
      albumTitle={album?.title}
      prevArtwork={prevArtwork ? `/${category}/${albumSlug}/${prevArtwork.id}` : null}
      nextArtwork={nextArtwork ? `/${category}/${albumSlug}/${nextArtwork.id}` : null}
    />
  );
}
