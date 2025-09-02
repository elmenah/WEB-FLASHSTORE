import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Checkout = () => {
  const { cart, removeFromCart } = useCart();
  const [email, setEmail] = useState('');
  const [fortniteUsername, setFortniteUsername] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState({ type: null, value: 0, code: null });
  const [couponFeedback, setCouponFeedback] = useState('');
  const [errors, setErrors] = useState({});

  const CLP = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' });
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const COUPONS = {
    "FORTNITE10": { type: "percent", value: 0.10, label: "10% de descuento" },
  };

  const getSubtotal = () => {
    return cart.reduce((total, item) => total + (item.precio * (item.cantidad || 1)), 0);
  };

  const applyDiscount = (amount) => {
    if (!discount.type) return amount;
    if (discount.type === 'percent') return Math.max(0, Math.round(amount * (1 - discount.value)));
    if (discount.type === 'fixed') return Math.max(0, amount - discount.value);
    return amount;
  };

  const getTotal = () => {
    return applyDiscount(getSubtotal());
  };

  const handleApplyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    const found = COUPONS[code];

    if (!code) {
      setDiscount({ type: null, value: 0, code: null });
      setCouponFeedback('');
      return;
    }

    if (found) {
      setDiscount({ type: found.type, value: found.value, code });
      setCouponFeedback(`Cupón aplicado: ${found.label}`);
    } else {
      setDiscount({ type: null, value: 0, code: null });
      setCouponFeedback('Cupón inválido.');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Por favor introduce un email válido.';
    }

    if (!fortniteUsername.trim()) {
      newErrors.fortniteUsername = 'Por favor introduce tu nombre de Fortnite.';
    }

    if (!acceptTerms) {
      newErrors.terms = 'Debes aceptar los términos y condiciones.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (cart.length === 0) {
      alert('Tu carrito está vacío.');
      return;
    }

    const totalAmount = getTotal();
    const totalFormatted = CLP.format(totalAmount);

    // Create WhatsApp message
    let mensaje = `NUEVA ORDEN\n\n`;
    mensaje += `Email: ${email.trim()}\n`;
    mensaje += `Fortnite Username: ${fortniteUsername.trim()}\n`;
    if (discount.code) mensaje += `Cupón: ${discount.code}\n`;
    if (orderNotes.trim()) mensaje += `Notas: ${orderNotes.trim()}\n`;
    mensaje += `\nTotal: ${totalFormatted}\n\n`;
    mensaje += `Productos:\n`;

    cart.forEach((producto, i) => {
      const precio = CLP.format(producto.precio);
      const cantidad = producto.cantidad || 1;
      mensaje += `${i + 1}. ${producto.nombre} - ${precio} x${cantidad}\n`;
    });

    const url = `https://wa.me/56930917730?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");

    alert('Procesando tu pedido...');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 pt-20">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <Link to="/shop" className="inline-flex items-center text-gray-400 hover:text-white transition">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
          <span className="ml-2">Regresar</span>
        </Link>
        <h1 className="text-xl font-semibold">Finaliza tu compra</h1>
      </header>

      {/* Steps */}
      <div className="mb-8">
        <ol className="flex items-center justify-center gap-6 text-sm">
          <li className="flex items-center gap-2 text-green-400">
            <span className="w-6 h-6 rounded-full bg-green-500/20 grid place-content-center">1</span> Carrito
          </li>
          <li className="flex items-center gap-2 text-white">
            <span className="w-6 h-6 rounded-full bg-blue-500/20 grid place-content-center border border-blue-400">2</span> Datos
          </li>
          <li className="flex items-center gap-2 text-gray-400">
            <span className="w-6 h-6 rounded-full bg-gray-700 grid place-content-center">3</span> Confirmación
          </li>
        </ol>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Left Column: Form */}
        <section className="lg:col-span-3 space-y-6">
          <form onSubmit={handleSubmit}>
            {/* Contact Data */}
            <div className="bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">Datos de contacto</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="email" className="block text-sm text-gray-300">Correo electrónico</label>
                  <input 
                    id="email" 
                    type="email" 
                    placeholder="tuemail@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2 w-full rounded-lg bg-gray-700 border border-gray-600 p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.email && <p className="text-xs mt-1 text-red-400">{errors.email}</p>}
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="fortniteusername" className="block text-sm text-gray-300">Nombre en Fortnite</label>
                  <input 
                    id="fortniteusername" 
                    type="text" 
                    placeholder="TuNombreEnFortnite"
                    value={fortniteUsername}
                    onChange={(e) => setFortniteUsername(e.target.value)}
                    className="mt-2 w-full rounded-lg bg-gray-700 border border-gray-600 p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-400 mt-2">Asegúrate de escribirlo exactamente como aparece en el juego.</p>
                  {errors.fortniteUsername && <p className="text-xs mt-1 text-red-400">{errors.fortniteUsername}</p>}
                </div>
              </div>
            </div>

            {/* Order Notes */}
            <div className="bg-gray-800 rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">Notas para el pedido (opcional)</h3>
                <span className="text-xs text-gray-400">Máx. 200 caracteres</span>
              </div>
              <textarea 
                rows="4" 
                maxLength="200" 
                placeholder="Ej: estoy conectado de 20:00 a 22:00…"
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                className="w-full rounded-lg bg-gray-700 border border-gray-600 p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Cart Items */}
            <div className="bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">Items en el carrito</h2>
              <div className="space-y-4">
                {cart.length === 0 ? (
                  <p className="text-gray-400">No items in cart.</p>
                ) : (
                  cart.map((item, index) => (
                    <div key={index} className="flex items-center justify-between gap-3 py-3 border-b border-gray-700/50">
                      <img src={item.imagen} alt={item.nombre} className="w-16 h-16 rounded-md object-cover" />
                      <div className="flex-1">
                        <h4 className="font-medium text-base">{item.nombre}</h4>
                        <p className="text-sm text-gray-400">Cantidad: {item.cantidad || 1}</p>
                        <p className="text-sm text-gray-400">{CLP.format(item.precio)}</p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => removeFromCart(index)}
                        className="text-gray-400 hover:text-white"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 6L6 18M6 6l12 12"></path>
                        </svg>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </form>
        </section>

        {/* Right Column: Summary */}
        <aside className="lg:col-span-2">
          <div className="lg:sticky lg:top-6 space-y-6">
            {/* Coupon */}
            <div className="bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold mb-3">¿Tienes un cupón?</h3>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="INGRESA-CUPON"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleApplyCoupon())}
                  className="flex-1 rounded-lg bg-gray-700 border border-gray-600 p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                  type="button"
                  onClick={handleApplyCoupon}
                  className="px-4 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 border border-gray-600 transition"
                >
                  Aplicar
                </button>
              </div>
              {couponFeedback && (
                <p className={`text-xs mt-2 ${couponFeedback.includes('aplicado') ? 'text-green-400' : 'text-red-400'}`}>
                  {couponFeedback}
                </p>
              )}
            </div>

            {/* Summary */}
            <div className="bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">Resumen del pedido</h2>

              <div className="flex justify-between py-2">
                <span className="text-gray-300">Subtotal</span>
                <span className="font-medium">{CLP.format(getSubtotal())}</span>
              </div>

              <div className="flex justify-between py-2 border-t border-gray-700">
                <span className="text-gray-300">Envío</span>
                <span className="font-medium">Gratis</span>
              </div>

              <div className="flex justify-between py-4 border-t border-gray-700 text-lg font-semibold">
                <span>Total</span>
                <span>{CLP.format(getTotal())}</span>
              </div>

              <label className="flex items-start gap-3 text-sm text-gray-300 mt-2">
                <input 
                  type="checkbox" 
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-1 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                />
                <span>
                  Acepto los <a href="#" className="underline hover:no-underline">términos y condiciones</a> y confirmo que mi nombre de Fortnite es correcto.
                </span>
              </label>
              {errors.terms && <p className="text-xs mt-1 text-red-400">{errors.terms}</p>}

              <button 
                onClick={handleSubmit}
                disabled={!email.trim() || !fortniteUsername.trim() || !acceptTerms}
                className="mt-6 w-full py-3 rounded-lg bg-green-500 hover:bg-green-600 font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Finalizar pedido
              </button>

              <p className="text-xs text-gray-400 mt-3">
                Al finalizar, te contactaremos al correo indicado para coordinar la entrega en el juego.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;