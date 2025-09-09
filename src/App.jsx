import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Club from "./pages/Club";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MiCuenta from "./pages/MiCuenta";
import Checkout from "./pages/Checkout";
import AuthGuard from "./components/AuthGuard";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CartPopup from "./components/CartPopup";

import { CartProvider } from './context/CartContext';

const App = () => {
  const location = useLocation();

  // Rutas donde no se debe mostrar el header y el footer
  const hideHeaderFooter = ["/login", "/register"];

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-gray-900 text-white">
        {/* Mostrar el header solo si no estamos en login o register */}
        {!hideHeaderFooter.includes(location.pathname) && <Header />}
        <main className="flex-grow">
          <Routes>
            {/* Rutas públicas */}
            
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={ <AuthGuard> <Home /> </AuthGuard>} />
            <Route path="/shop" element={ <AuthGuard> <Shop /> </AuthGuard>} />
            <Route path="/club" element={ <AuthGuard> <Club /> </AuthGuard>} />
            {/* Rutas protegidas */}
            <Route
              path="/micuenta"
              element={
                <AuthGuard>
                  <MiCuenta />
                </AuthGuard>
              }
            />
            <Route
              path="/checkout"
              element={
                <AuthGuard>
                  <Checkout />
                </AuthGuard>
              }
            />
          </Routes>
        </main>

        
    {/* 👇 Carrito montado aquí */}
    <CartPopup />
        {/* Mostrar el footer solo si no estamos en login o register */}
        {!hideHeaderFooter.includes(location.pathname) && <Footer />}
      </div>
    </CartProvider>
  );
};

export default App;