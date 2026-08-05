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

      {/* Main Sidebar Container matching Design Slides 3, 4, 5 */}
      <aside className={`panel-sidebar ${isMobileOpen ? 'mobile-expanded' : ''}`}>
        <ul className="sidebar-list">
          {categoryObj.items.map((item) => {
            const isItemActive = activeSlug === item.slug;
            const hasChildren = item.children && item.children.length > 0;
            const isChildActive = hasChildren && item.children.some(c => c.slug === activeSlug);

            return (
              <li key={item.id} className="sidebar-group">
                <Link 
                  href={`/${currentCategory}/${item.slug}`}
                  className={`sidebar-item-header ${(isItemActive || isChildActive) ? 'active' : ''}`}
                  onClick={() => setIsMobileOpen(false)}
                >
                  {item.name}
                </Link>
                
                {hasChildren && (
                  <ul className="sidebar-sublist">
                    {item.children.map((child) => {
                      const isThisChildActive = activeSlug === child.slug;

                      return (
                        <li key={child.id}>
                          <Link 
                            href={`/${currentCategory}/${child.slug}`}
                            className={`sidebar-subitem ${isThisChildActive ? 'active' : ''}`}
                            onClick={() => setIsMobileOpen(false)}
                          >
                            <span className="sidebar-bullet">•</span> {child.name}
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
