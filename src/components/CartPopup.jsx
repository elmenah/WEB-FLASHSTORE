import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';

function CartPopup() {
  const { cart, removeFromCart, clearCart, getCartTotal, isCartOpen, closeCart } = useCart();
  const navigate = useNavigate();
  const closeRef = useRef(closeCart);
  const closeButton = useRef(null);
  closeRef.current = closeCart;
  useEffect(() => {
    if (!isCartOpen) return;
    const previousFocus = document.activeElement;
    closeButton.current?.focus();
    const onKey = e => { if (e.key === 'Escape') closeRef.current(); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      if (previousFocus?.isConnected && document.activeElement === document.body) previousFocus.focus();
    };
  }, [isCartOpen]);
  const formatPrice = price => new Intl.NumberFormat('es-CL', {style:'currency', currency:'CLP'}).format(price);
  if (!isCartOpen) return null;
  return <aside className="flash-cart" aria-label="Carrito de compras">
    <header className="flash-cart-header"><div><p className="flash-eyebrow">TU PRÓXIMA PARTIDA</p><h2>Tu carrito <span>{cart.length}</span></h2></div><button ref={closeButton} className="flash-icon-button" onClick={closeCart} aria-label="Cerrar carrito"><X /></button></header>
    <div className="flash-cart-items">
      {cart.length ? cart.map((product,index) => <article className="flash-cart-item" key={index}><div className="flash-cart-image"><img src={product.imagen} alt="" /></div><div className="flash-cart-item-copy"><h3>{product.nombre}</h3><p>Cantidad: {product.cantidad || 1}</p><strong>{formatPrice(product.precio)} <small>CLP</small></strong></div><button className="flash-icon-button flash-cart-remove" onClick={() => removeFromCart(index)} aria-label={'Eliminar ' + product.nombre}><Trash2 size={17} /></button></article>) : <div className="flash-cart-empty"><ShoppingBag size={48} /><h3>Tu próxima aventura te espera</h3><p>Tu carrito está vacío. Explora la tienda y encuentra tu próximo estilo.</p><Link className="flash-button" to="/shop" onClick={closeCart}>Explorar tienda <ArrowRight size={18} /></Link></div>}
    </div>
    {cart.length > 0 && <footer className="flash-cart-footer"><button className="flash-cart-clear" onClick={clearCart}><Trash2 size={14} /> Vaciar carrito</button><div className="flash-cart-total"><span>Total</span><strong>{formatPrice(getCartTotal())} <small>CLP</small></strong></div><button className="flash-button" onClick={() => {closeCart();navigate('/checkout');}}>Continuar al checkout <ArrowRight size={20} /></button><button className="flash-cart-continue" onClick={closeCart}>Seguir explorando</button><p><ShieldCheck size={15} /> Revisa tus datos antes de pagar</p></footer>}
  </aside>;
}

export default CartPopup;
