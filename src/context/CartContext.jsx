import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { convertVBuckToCLP, convertCLPToVBuck } from "../config/prices";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try { const saved = JSON.parse(localStorage.getItem('carrito') || '[]'); return Array.isArray(saved) ? saved : []; }
    catch { return []; }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsCartOpen(false);
  }, [location.key]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try { localStorage.setItem('carrito', JSON.stringify(cart)); } catch { /* Storage may be unavailable. */ }
  }, [cart]);

  const addToCart = (product) => {
    // Corrige el nombre si no viene bien seteado
    let nombre = product.nombre;
    if (!nombre) {
      nombre = product.bundleName || product.itemName || product.title || 'Producto';
    }

    // ✅ Calcular pavos correctamente basado en el precio
    let pavos = product.pavos;
    if (!pavos) {
      // Calcular pavos basado en el precio: precio / 4.4
      const precio = product.precio || product.finalPrice || 0;
      pavos = convertCLPToVBuck(precio);
    }

    setCart(prevCart => [
      ...prevCart,
      {
        ...product,
        nombre,
        pavos // ✅ Pavos calculados correctamente
      }
    ]);
  };

  const removeFromCart = (index) => {
    setCart(prevCart => prevCart.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.precio * (item.cantidad || 1)), 0);
  };

  // ✅ Función corregida para obtener total de pavos
  const getCartPavos = () => {
    return cart.reduce((total, item) => {
      // Si el item tiene pavos definidos, usarlos
      if (item.pavos) {
        return total + item.pavos * (item.cantidad || 1);
      }
      // Si no, calcular basado en el precio
      const precio = item.precio || item.finalPrice || 0;
      const pavosCalculados = convertCLPToVBuck(precio);
      return total + pavosCalculados * (item.cantidad || 1);
    }, 0);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const value = {
    cart,
    updateCart: setCart,
    addToCart,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartPavos, // ✅ Agregar función de pavos
    isCartOpen,
    openCart,
    closeCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
