'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Sidebar({ categories, currentCategory, activeSlug }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  if (!categories || categories.length === 0) return null;

  // Find category object matching currentCategory (art, design, play)
  const categoryObj = categories.find(c => c.id === currentCategory || c.slug === currentCategory);
  if (!categoryObj || !categoryObj.items) return null;

  const currentItem = categoryObj.items.find(i => i.slug === activeSlug) || 
                    categoryObj.items.flatMap(i => i.children || []).find(c => c.slug === activeSlug);

  return (
    <>
      {/* Mobile Accordion Toggle Bar */}
      <div className="mobile-sidebar-toggle-bar">
        <button 
          className="mobile-sidebar-toggle-btn"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          <span>📁 {categoryObj.name.toUpperCase()} {currentItem ? `/ ${currentItem.name}` : ''}</span>
          <span className="toggle-arrow">{isMobileOpen ? '▲' : '▼'}</span>
        </button>
      </div>

      {/* Main Sidebar Container (Desktop & Mobile Drawer) */}
      <aside className={`panel-sidebar ${isMobileOpen ? 'mobile-expanded' : ''}`}>
        <h2 className="panel-sidebar-title">{categoryObj.name}</h2>
        
        <ul className="sidebar-list">
          {categoryObj.items.map((item) => {
            const isItemActive = activeSlug === item.slug;

            return (
              <li key={item.id}>
                <Link 
                  href={`/${currentCategory}/${item.slug}`}
                  className={`sidebar-item-wrap ${isItemActive ? 'active' : ''}`}
                  onClick={() => setIsMobileOpen(false)}
                >
                  <span className="sidebar-item">
                    {item.name}
                  </span>
                </Link>
                
                {item.children && item.children.length > 0 && (
                  <ul className="sidebar-list">
                    {item.children.map((child) => {
                      const isChildActive = activeSlug === child.slug;

                      return (
                        <li key={child.id}>
                          <Link 
                            href={`/${currentCategory}/${child.slug}`}
                            className={`sidebar-item-wrap ${isChildActive ? 'active' : ''}`}
                            onClick={() => setIsMobileOpen(false)}
                          >
                            <span className="sidebar-item depth-1">
                              <span className="sidebar-bullet">•</span> {child.name}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </aside>
    </>
  );
}
