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

  const TestAddProductButton = ({ addToCart, clearCart }) => {
  const addTestProduct = () => {
    clearCart(); // opcional: limpiar carrito antes
    addToCart({
      id: 'test-100',
      nombre: 'Producto de prueba $100',
      precio: 100,
      cantidad: 1,
      imagen: 'https://via.placeholder.com/150',
    });
  };

  return (
    <button
      onClick={addTestProduct}
      className="p-2 bg-green-500 text-white rounded mt-4"
    >
      Agregar producto de prueba $100
    </button>
  );
};
  return (
    <div className={`fixed right-0 top-0 w-full max-w-[420px] h-full bg-gradient-to-br from-[#23243aee] to-[#1a1b2bfa] backdrop-blur-xl shadow-2xl transform transition-transform duration-400 ease-out p-0 z-50 border-l border-[#3ad7ff33] ${isCartOpen ? 'translate-x-0 animate-fade-in' : 'translate-x-full'} `}
      style={{borderTopLeftRadius: '2rem', borderBottomLeftRadius: '2rem'}}>
      <div className="flex justify-between items-center text-2xl font-extrabold mb-4 px-8 pt-8 pb-4 border-b border-[#3ad7ff33]">
        <h2 className="text-white tracking-tight">Mi Carrito</h2>
        <button 
          className="cursor-pointer text-2xl text-gray-400 hover:text-white bg-white/10 hover:bg-red-500/80 rounded-full w-10 h-10 flex items-center justify-center transition-all"
          onClick={closeCart}
          aria-label="Cerrar carrito"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </div>

      <div className="mb-6 px-6 max-h-[45vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#47fdfe]/40 scrollbar-track-transparent transition-all">
        {cart.length === 0 ? (
          <p className="text-gray-400 text-center py-12">Tu carrito está vacío.</p>
        ) : (
          cart.map((producto, index) => (
            <div key={index} className="flex items-center justify-between mb-4 p-4 bg-[#23243aee] rounded-2xl shadow-md border-l-4 border-[#47fdfe] group transition-all">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#47fdfe] to-[#2b6fa1]">
                  <img src={producto.imagen} alt={producto.nombre} className="object-contain max-h-12 max-w-12" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white truncate">{producto.nombre}</p>
                  <p className="text-sm text-[#47fdfe] font-bold">{formatPrice(producto.precio)}</p>
                </div>
              </div>
              <button 
                className="ml-2 text-red-500 hover:text-white bg-red-500/10 hover:bg-red-500/80 rounded-full w-9 h-9 flex items-center justify-center transition-all"
                onClick={() => removeFromCart(index)}
                aria-label="Eliminar producto"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>
          ))
        )}
      </div>

      {cart.length > 0 && (
        <div className="px-8 pb-8">
          <button 
            onClick={clearCart}
            className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl py-3 font-bold shadow-lg hover:scale-[1.03] hover:from-red-600 hover:to-pink-600 transition-all mb-6"
          >
            Vaciar carrito
          </button>

          <TestAddProductButton addToCart={addToCart} clearCart={clearCart} />

          <div className="my-6 border-t border-[#3ad7ff33]"></div>

          <div className="text-center mb-6">
            <p className="text-lg font-bold text-white mb-1">Total:</p>
            <p className="text-2xl font-extrabold text-green-400 drop-shadow-lg">{formatPrice(getCartTotal())} CLP</p>
          </div>

          <button 
            onClick={handleCheckout}
            className="w-full bg-gradient-to-r from-green-500 to-cyan-500 text-white rounded-xl py-3 font-bold shadow-lg hover:scale-[1.03] hover:from-green-600 hover:to-cyan-600 transition-all"
          >
            Ir al checkout
          </button>
        </div>
      )}

      {/* Animación y scroll personalizado */}
      <style>{`
        .animate-fade-in {
          animation: fadeInCart 0.7s cubic-bezier(.4,2,.6,1) both;
        }
        @keyframes fadeInCart {
          from { opacity: 0; transform: translateX(60px); }
          to { opacity: 1; transform: none; }
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #47fdfe66;
          border-radius: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
};

export default CartPopup;