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
    { label: 'PLAY', path: '/play' },
    { label: 'BLOG', path: '/blog' },
    { label: 'Bio & Contact', path: '/contact' }
  ];

  return (
    <>
      <nav className="navbar">
        <Link href="/" className="nav-logo" onClick={() => setIsMobileMenuOpen(false)}>
          HOME
        </Link>
        
        {/* Navigation Items with | Separators as in Design */}
        <div className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          {navItems.map((item, index) => {
            const isActive = item.path === '/contact' ? pathname === '/contact' : pathname?.startsWith(item.path);
            return (
              <React.Fragment key={item.path}>
                {index > 0 && <span className="nav-divider">|</span>}
                <Link 
                  href={item.path} 
                  className={`nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </React.Fragment>
            );
          })}
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
