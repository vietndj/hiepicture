'use client';

import React, { useState } from 'react';
import AdminBar from './AdminBar';
import AdminQuickSwitch from './AdminQuickSwitch';
import Navbar from './Navbar';
import Footer from './Footer';
import LiveEditModal from './admin/LiveEditModal';

export default function ClientLayout({ children }) {
  const [addModalType, setAddModalType] = useState(null);

  return (
    <>
      <AdminBar onOpenAddModal={(type) => setAddModalType(type)} />
      <Navbar />
      <main>{children}</main>
      <Footer />
      
      {/* Floating Bottom-Right Admin Switch Button */}
      <AdminQuickSwitch />

      {/* Global Add Item Modal from Top Admin Bar */}
      {addModalType && (
        <LiveEditModal
          isOpen={!!addModalType}
          mode="add"
          itemType={addModalType}
          initialData={null}
          onClose={() => setAddModalType(null)}
          onSaveSuccess={() => setAddModalType(null)}
        />
      )}
    </>
  );
}
