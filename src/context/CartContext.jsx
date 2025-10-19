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
      // Intenta obtener el nombre de otras propiedades comunes
      nombre = product.bundleName || product.itemName || product.title || 'Producto';
    }

    // ✅ Calcular pavos basado en el producto
    let pavos = product.pavos;
    if (!pavos) {
      // Si no tiene pavos definidos, calcular basado en cantidad
      const cantidad = product.cantidad || 1;
      pavos = cantidad * 1000; // Asumiendo 1000 pavos por item
    }

    setCart(prevCart => [
      ...prevCart,
      {
        ...product,
        nombre,
        pavos // ✅ Agregar pavos al producto en el carrito
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

  // ✅ Nueva función para obtener total de pavos
  const getCartPavos = () => {
    return cart.reduce((total, item) => total + (item.pavos || (item.cantidad || 1) * 1000), 0);
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