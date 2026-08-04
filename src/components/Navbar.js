'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'ART', path: '/art' },
    { label: 'DESIGN', path: '/design' },
    { label: 'PLAY', path: '/play' }
  ];

  return (
    <nav className="navbar">
      <Link href="/" className="nav-logo">
        HIEPICTURE
      </Link>
      
      <div className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        {navItems.map((item) => {
          const isActive = pathname?.startsWith(item.path);
          return (
            <Link 
              key={item.path} 
              href={item.path} 
              className={`nav-link ${isActive ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          );
        })}
        <Link 
          href="/contact" 
          className={`nav-link contact-link ${pathname === '/contact' ? 'active' : ''}`}
        >
          CONTACT
        </Link>
      </div>

      <button 
        className="hamburger-btn"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? '✕' : '☰'}
      </button>
    </nav>
  );
}
