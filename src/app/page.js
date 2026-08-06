import React from 'react';

export default function HomePage() {
  return (
    <div className="hero-static-wrapper">
      {/* AI Cleaned Background Artwork (No Baked-in Text) */}
      <div 
        className="hero-static-bg"
        style={{ backgroundImage: `url('/hero-bg.jpg')` }}
      />

      {/* Hero Text Layers Overlay */}
      <div className="hero-content-layer">
        {/* Main HIEPICTURE Title Layer */}
        <div className="hero-title-wrap">
          <h1 className="hero-mockup-title">
            <span className="title-hi">HI</span>
            <span className="title-ep">EP</span>
            <span className="title-icture">ICTURE</span>
          </h1>
        </div>

        {/* Subtitle Layer on Bottom Right */}
        <div className="hero-mockup-subtitle">
          <p>
            Working extensively in both the fields of art & design since 90s. Versatile but strict eyes will help you stay away from mediocrity
          </p>
        </div>
      </div>
    </div>
  );
}
