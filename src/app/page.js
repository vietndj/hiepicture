'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const containerRef = useRef(null);
  const [transform, setTransform] = useState({
    bgTransform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1.04)',
    textTransform: 'translate3d(0px, 0px, 40px)',
    subTransform: 'translate3d(0px, 0px, 20px)'
  });

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Normalized mouse position from -1 to 1
    const mouseX = (e.clientX - centerX) / (rect.width / 2);
    const mouseY = (e.clientY - centerY) / (rect.height / 2);

    // Calculate 3D tilt angles
    const rotateX = -mouseY * 12; // tilt up/down
    const rotateY = mouseX * 14;  // tilt left/right

    // Multi-layer parallax translation
    const textX = mouseX * -25;
    const textY = mouseY * -20;

    const subX = mouseX * -15;
    const subY = mouseY * -12;

    setTransform({
      bgTransform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.06)`,
      textTransform: `translate3d(${textX}px, ${textY}px, 60px)`,
      subTransform: `translate3d(${subX}px, ${subY}px, 30px)`
    });
  };

  const handleMouseLeave = () => {
    setTransform({
      bgTransform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1.04)',
      textTransform: 'translate3d(0px, 0px, 0px)',
      subTransform: 'translate3d(0px, 0px, 0px)'
    });
  };

  return (
    <div 
      ref={containerRef}
      className="hero-parallax-wrapper"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* 3D Parallax Background Artwork Layer */}
      <div 
        className="hero-parallax-bg"
        style={{ 
          backgroundImage: `url('/hero-bg.jpg')`,
          transform: transform.bgTransform
        }}
      />

      {/* Hero Content Container */}
      <div className="hero-content-layer">
        {/* Main 3D Title */}
        <div 
          className="hero-3d-title-wrap"
          style={{ transform: transform.textTransform }}
        >
          <h1 className="hero-mockup-title">
            <span className="title-bold">HIEP</span>
            <span className="title-thin">ICTURE</span>
          </h1>
        </div>

        {/* Subtitle Box on Bottom Right */}
        <div 
          className="hero-mockup-subtitle"
          style={{ transform: transform.subTransform }}
        >
          <p>
            Working extensively in both the fields of art & design since 90s. Versatile but strict eyes will help you stay away from mediocrity
          </p>
        </div>
      </div>
    </div>
  );
}
