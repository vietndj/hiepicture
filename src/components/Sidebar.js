'use client';

import React from 'react';
import Link from 'next/link';

export default function Sidebar({ categories, currentCategory, activeSlug }) {
  if (!categories || categories.length === 0) return null;

  // Find category object matching currentCategory (art, design, play)
  const categoryObj = categories.find(c => c.id === currentCategory || c.slug === currentCategory);
  if (!categoryObj || !categoryObj.items) return null;

  return (
    <aside className="panel-sidebar">
      <h2 className="panel-sidebar-title">{categoryObj.name}</h2>
      
      <ul className="sidebar-list">
        {categoryObj.items.map((item) => {
          const isItemActive = activeSlug === item.slug;

          return (
            <li key={item.id}>
              <Link 
                href={`/${currentCategory}/${item.slug}`}
                className={`sidebar-item-wrap ${isItemActive ? 'active' : ''}`}
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
  );
}
