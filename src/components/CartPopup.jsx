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
      <div className={`fixed right-0 top-0 w-[350px] h-full bg-gray-900 bg-opacity-95 backdrop-blur shadow-lg transform transition-transform duration-400 ease-out p-6 z-50 border-l border-gray-700 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="carrito-header flex justify-between items-center text-xl font-bold mb-8 pb-4 border-b-2 border-gray-700">
        <h2>Mi Carrito</h2>
        <span 
          className="cerrar-carrito cursor-pointer text-xl text-red-400 hover:text-red-300 transition-colors"
          onClick={closeCart}
        >
          ✖
        </span>
      </div>

      <div className="carrito-contenido mb-6">
        {cart.length === 0 ? (
          <p className="text-gray-400">No hay productos en el carrito.</p>
        ) : (
          cart.map((producto, index) => (
            <div key={index} className="carrito-item flex justify-between items-center mb-4 p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700">
              <img src={producto.imagen} alt={producto.nombre} className="w-12 h-12 rounded-lg object-cover" />
              <div className="nombre flex-1 mx-4 font-medium">{producto.nombre}</div>
              <div className="precio text-blue-400 font-semibold">
                {formatPrice(producto.precio)}
              </div>
              <div 
                className="eliminar cursor-pointer text-red-400 hover:text-red-300 text-lg ml-3 transition-colors"
                onClick={() => removeFromCart(index)}
              >
                ❌
              </div>
            </div>
          ))
        )}
      </div>

      {cart.length > 0 && (
        <>
          <button 
            onClick={clearCart}
            className="vaciar-btn w-4/5 bg-gradient-to-r from-red-500 to-red-600 text-white border-none rounded-lg p-3 cursor-pointer font-semibold my-5 mx-auto block transition-all hover:from-red-600 hover:to-red-700 hover:-translate-y-1"
          >
            Vaciar carrito
          </button>

          <div className="carrito-separador h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent my-6 rounded"></div>

          <div className="total text-xl font-bold text-center p-5 bg-yellow-500 bg-opacity-10 rounded-lg border border-yellow-500 border-opacity-30 mb-3">
            <p>Total: {formatPrice(getCartTotal())} CLP</p>
          </div>

          <button 
            onClick={handleCheckout}
            className="checkout-btn w-full bg-gradient-to-r from-green-500 to-green-600 text-white border-none rounded-lg p-4 cursor-pointer font-semibold text-lg mt-5 transition-all uppercase tracking-wide shadow-lg hover:from-green-600 hover:to-green-700 hover:-translate-y-1 hover:shadow-xl"
          >
            Ir al checkout
          </button>
        </>
      )}
    </div>
  );
};

export default CartPopup;