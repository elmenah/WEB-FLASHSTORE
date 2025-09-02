import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import CartPopup from './CartPopup';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-50">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartPopup />
    </div>
  );
};

export default Layout;