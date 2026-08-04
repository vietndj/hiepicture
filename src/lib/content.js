import fs from 'fs';
import path from 'path';

const contentDir = path.join(process.cwd(), 'content');

export function getCategories() {
  const filePath = path.join(contentDir, 'categories.json');
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

export function getAlbums(categoryId) {
  const filePath = path.join(contentDir, 'albums.json');
  let albums = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  if (categoryId) {
    albums = albums.filter(album => album.categoryId === categoryId);
  }
  return albums.sort((a, b) => a.order - b.order);
}

export function getAlbum(slug) {
  const albums = getAlbums();
  return albums.find(album => album.slug === slug) || null;
}

export function getArtworks(albumId) {
  const filePath = path.join(contentDir, 'artworks.json');
  let artworks = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  if (albumId) {
    artworks = artworks.filter(art => art.albumId === albumId);
  }
  return artworks.sort((a, b) => a.order - b.order);
}

export function getArtwork(id) {
  const artworks = getArtworks();
  return artworks.find(art => art.id === id) || null;
}

export function getBio() {
  const filePath = path.join(contentDir, 'bio.json');
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

export function getBlogPosts() {
  const filePath = path.join(contentDir, 'blog.json');
  const posts = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  return posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getBlogPost(slug) {
  const posts = getBlogPosts();
  return posts.find(post => post.slug === slug) || null;
}
