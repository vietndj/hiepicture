import fs from 'fs';
import path from 'path';

const contentDir = path.join(process.cwd(), 'content');

export function getCategories() {
  const filePath = path.join(contentDir, 'categories.json');
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

export function getAlbums(categoryId, includeDrafts = false) {
  const filePath = path.join(contentDir, 'albums.json');
  let albums = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  if (!includeDrafts) {
    albums = albums.filter(album => album.published !== false);
  }
  if (categoryId) {
    albums = albums.filter(album => album.categoryId === categoryId);
  }
  return albums.sort((a, b) => (a.order || 0) - (b.order || 0));
}

export function getAlbum(slug, includeDrafts = false) {
  const albums = getAlbums(null, includeDrafts);
  return albums.find(album => album.slug === slug) || null;
}

export function getArtworks(albumId, includeDrafts = false) {
  const filePath = path.join(contentDir, 'artworks.json');
  let artworks = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  if (!includeDrafts) {
    artworks = artworks.filter(art => art.published !== false);
  }
  if (albumId) {
    artworks = artworks.filter(art => art.albumId === albumId);
  }
  return artworks.sort((a, b) => (a.order || 0) - (b.order || 0));
}

export function getArtwork(id, includeDrafts = false) {
  const artworks = getArtworks(null, includeDrafts);
  return artworks.find(art => art.id === id) || null;
}

export function getBio() {
  const filePath = path.join(contentDir, 'bio.json');
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

export function getBlogPosts(includeDrafts = false) {
  const filePath = path.join(contentDir, 'blog.json');
  let posts = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  if (!includeDrafts) {
    posts = posts.filter(post => post.published !== false);
  }
  return posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getBlogPost(slug, includeDrafts = false) {
  const posts = getBlogPosts(includeDrafts);
  return posts.find(post => post.slug === slug) || null;
}
