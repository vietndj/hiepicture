import React from 'react';

export default function HomePage() {
  return (
    <div className="hero-static-wrapper">
      {/* Background Artwork Layer */}
      <div 
        className="hero-static-bg"
        style={{ backgroundImage: `url('/hero-bg.jpg')` }}
      />

      {/* Hero Content Container */}
      <div className="hero-content-layer">
        {/* Main Title */}
        <div className="hero-title-wrap">
          <h1 className="hero-mockup-title">
            <span className="title-bold">HIEP</span>
            <span className="title-thin">ICTURE</span>
          </h1>
        </div>

        {/* Subtitle Box on Bottom Right */}
        <div className="hero-mockup-subtitle">
          <p>
            Working extensively in both the fields of art & design since 90s. Versatile but strict eyes will help you stay away from mediocrity
          </p>
        </div>
      </div>
    </div>
  );
}
