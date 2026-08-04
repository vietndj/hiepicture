'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu automatically on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navItems = [
    { label: 'ART', path: '/art' },
    { label: 'DESIGN', path: '/design' },
    { label: 'PLAY', path: '/play' }
  ];

  return (
    <>
      <nav className="navbar">
        <Link href="/" className="nav-logo" onClick={() => setIsMobileMenuOpen(false)}>
          HIEPICTURE
        </Link>
        
        {/* Desktop & Mobile Navigation Overlay */}
        <div className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          {navItems.map((item) => {
            const isActive = pathname?.startsWith(item.path);
            return (
              <Link 
                key={item.path} 
                href={item.path} 
                className={`nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
          <Link 
            href="/contact" 
            className={`nav-link contact-link ${pathname === '/contact' ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            CONTACT
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button 
          className="hamburger-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {/* Backdrop overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-menu-backdrop"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
