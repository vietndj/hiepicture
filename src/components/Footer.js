import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div>
        © {currentYear} HIEPICTURE.
      </div>
      <div>
        VISUAL ARTIST & DESIGNER
      </div>
    </footer>
  );
}
