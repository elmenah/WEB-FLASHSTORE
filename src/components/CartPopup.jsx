import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartPopup = () => {
  const { cart, removeFromCart, clearCart, getCartTotal, isCartOpen, closeCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  };

  return (
    <div className={`fixed right-0 top-0 w-[400px] h-full bg-gray-900 bg-opacity-90 backdrop-blur-lg shadow-2xl transform transition-transform duration-400 ease-out p-6 z-50 border-l border-gray-300 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="flex justify-between items-center text-xl font-bold mb-6 pb-4 border-b border-gray-300">
        <h2 className="text-white">Mi Carrito</h2>
        <span 
          className="cursor-pointer text-xl text-gray-500 hover:text-gray-700 transition-colors"
          onClick={closeCart}
        >
          ✖
        </span>
      </div>

      <div className="mb-6">
        {cart.length === 0 ? (
          <p className="text-gray-500 text-center">Tu carrito está vacío.</p>
        ) : (
          cart.map((producto, index) => (
            <div key={index} className="flex items-center justify-between mb-4 p-4 bg-gray-100 rounded-lg shadow-sm">
              <img src={producto.imagen} alt={producto.nombre} className="w-14 h-14 rounded-lg object-cover" />
              <div className="flex-1 mx-4">
                <p className="font-medium text-gray-800">{producto.nombre}</p>
                <p className="text-sm text-gray-500">{formatPrice(producto.precio)}</p>
              </div>
              <button 
                className="text-red-500 hover:text-red-600 transition-colors"
                onClick={() => removeFromCart(index)}
              >
                ❌
              </button>
            </div>
          ))
        )}
      </div>

      {cart.length > 0 && (
        <>
          <button 
            onClick={clearCart}
            className="w-full bg-red-500 text-white rounded-lg py-3 font-semibold shadow-md hover:bg-red-600 transition-all"
          >
            Vaciar carrito
          </button>

          <div className="my-6 border-t border-gray-300"></div>

          <div className="text-center">
            <p className="text-lg font-bold text-white">Total:</p>
            <p className="text-xl font-bold text-green-600">{formatPrice(getCartTotal())} CLP</p>
          </div>

          <button 
            onClick={handleCheckout}
            className="w-full bg-green-500 text-white rounded-lg py-3 font-semibold shadow-md hover:bg-green-600 transition-all mt-5"
          >
            Ir al checkout
          </button>
        </>
      )}
    </div>
  );
};

export default CartPopup;