import React from 'react';

export default function Timeline({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="timeline">
      {items.map((item, index) => (
        <div key={index} className="timeline-item">
          <div className="timeline-dot"></div>
          <div className="timeline-year">{item.year}</div>
          
          {item.events && item.events.length > 0 && (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {item.events.map((event, eIndex) => (
                <li key={eIndex} style={{ marginBottom: '0.75rem', color: 'rgba(255,255,255,.6)', fontSize: '14px', lineHeight: 1.6 }}>
                  {typeof event === 'string' ? (
                    event
                  ) : (
                    <>
                      {event.title && <div style={{ fontWeight: 600, color: 'rgba(255,255,255,.75)' }}>{event.title}</div>}
                      {event.description && <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{event.description}</div>}
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
