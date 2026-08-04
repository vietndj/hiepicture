'use client';

import { useState, useEffect } from 'react';

export default function ManageAlbums() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const res = await fetch('/api/content/albums');
        const data = await res.json();
        setAlbums(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAlbums();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="admin-page">
      <h1>Manage Albums</h1>
      <button className="btn-primary">Add Album</button>
      
      <table className="admin-table">
        <thead>
          <tr>
            <th>Cover</th>
            <th>Title</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {albums.map(album => (
            <tr key={album.id}>
              <td><img src={album.cover} alt={album.title} width="50" /></td>
              <td>{album.title}</td>
              <td>{album.categoryId}</td>
              <td>
                <button>Edit</button>
                <button>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
