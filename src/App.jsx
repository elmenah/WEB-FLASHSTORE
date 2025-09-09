import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Club from './pages/Club';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import TermsAndConditions from './pages/TermsAndConditions';
import MiCuenta from './pages/MiCuenta';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="Micuenta" element={<MiCuenta />} />
          <Route path="shop" element={<Shop />} />
          <Route path="club" element={<Club />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="terminos" element={<TermsAndConditions />} />
        </Route>
      </Routes>
    </CartProvider>
  );
}

export default App;