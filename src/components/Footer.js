import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div>
        © {currentYear} HIEPICTURE. ALL RIGHTS RESERVED.
      </div>
      <div>
        VISUAL ARTIST & DESIGNER
      </div>
    </footer>
  );
}
