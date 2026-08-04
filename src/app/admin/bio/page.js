'use client';

import { useState, useEffect } from 'react';

export default function ManageBio() {
  const [bio, setBio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBio = async () => {
      try {
        const res = await fetch('/api/content/bio');
        const data = await res.json();
        setBio(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBio();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="admin-page">
      <h1>Edit Bio</h1>
      {bio && (
        <form className="admin-form">
          <div className="form-group">
            <label>Name</label>
            <input type="text" defaultValue={bio.name} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" defaultValue={bio.email} />
          </div>
          <div className="form-group">
            <label>About</label>
            <textarea defaultValue={bio.about} rows={5} />
          </div>
          <button type="button" className="btn-primary">Save Changes</button>
        </form>
      )}
    </div>
  );
}
