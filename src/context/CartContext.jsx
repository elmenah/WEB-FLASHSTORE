import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('carrito');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(cart));
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
      pavos = Math.round(precio / 4.0);
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
        return total + item.pavos;
      }
      // Si no, calcular basado en el precio
      const precio = item.precio || item.finalPrice || 0;
      const pavosCalculados = Math.round(precio / 4.0);
      return total + pavosCalculados;
    }, 0);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const value = {
    cart,
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