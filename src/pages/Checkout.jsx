import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { supabase } from "../supabaseCliente"; // Ajusta la ruta según tu proyecto

const Checkout = () => {
  const { cart, removeFromCart, clearCart } = useCart(); // Asegúrate de incluir clearCart
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [fortniteUsername, setFortniteUsername] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState({
    type: null,
    value: 0,
    code: null,
  });
  const [couponFeedback, setCouponFeedback] = useState("");
  const [errors, setErrors] = useState({});

  const CLP = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
  });
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const COUPONS = {
    FORTNITE10: { type: "percent", value: 0.1, label: "10% de descuento" },
  };

  const getSubtotal = () => {
    return cart.reduce(
      (total, item) => total + item.precio * (item.cantidad || 1),
      0
    );
  };

  const applyDiscount = (amount) => {
    if (!discount.type) return amount;
    if (discount.type === "percent")
      return Math.max(0, Math.round(amount * (1 - discount.value)));
    if (discount.type === "fixed") return Math.max(0, amount - discount.value);
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
      setCouponFeedback("");
      return;
    }

    if (found) {
      setDiscount({ type: found.type, value: found.value, code });
      setCouponFeedback(`Cupón aplicado: ${found.label}`);
    } else {
      setDiscount({ type: null, value: 0, code: null });
      setCouponFeedback("Cupón inválido.");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!emailRegex.test(email.trim())) {
      newErrors.email = "Por favor introduce un email válido.";
    }

    if (!fortniteUsername.trim()) {
      newErrors.fortniteUsername = "Por favor introduce tu nombre de Fortnite.";
    }

    if (!acceptTerms) {
      newErrors.terms = "Debes aceptar los términos y condiciones.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (cart.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }

    const totalAmount = getTotal();
    const totalFormatted = CLP.format(totalAmount);

    try {
      // 1️⃣ Insertar pedido principal en Supabase

      // Obtener el usuario logueado
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (!currentUser) {
        alert("Debes iniciar sesión para hacer un pedido.");
        return;
      }

      const { data: pedidoData, error: pedidoError } = await supabase
        .from("pedidos")
        .insert([
          {
            user_id: currentUser.id,
            correo: email.trim(),
            username_fortnite: fortniteUsername.trim(),
            estado: "No Pagado",
          },
        ])
        .select()
        .single();

      if (pedidoError) throw pedidoError;

      // 2️⃣ Insertar items del carrito
      const itemsToInsert = cart.map((item) => ({
        pedido_id: pedidoData.id,
        nombre_producto: item.nombre,
        precio_unitario: item.precio, // Cambia 'precio' por 'precio_unitario'
        cantidad: item.cantidad || 1,
        imagen_url: item.imagen, // Cambia 'imagen' por 'imagen_url'
      }));

      const { error: itemsError } = await supabase
        .from("pedido_items")
        .insert(itemsToInsert);

      if (itemsError) throw itemsError;

      // 3️⃣ Crear mensaje de WhatsApp
      let mensaje = `NUEVA ORDEN\n\n`;
      mensaje += `Correo: ${email.trim()}\n`;
      mensaje += `Nombre Usuario: ${fortniteUsername.trim()}\n`;
      if (discount.code) mensaje += `Cupón: ${discount.code}\n`;
      if (orderNotes.trim()) mensaje += `Notas: ${orderNotes.trim()}\n`;
      mensaje += `\nTotal: ${totalFormatted}\n\n`;
      mensaje += `Productos:\n`;

      cart.forEach((producto, i) => {
        const precio = CLP.format(producto.precio);
        const cantidad = producto.cantidad || 1;
        mensaje += `${i + 1}. ${producto.nombre} - ${precio} x${cantidad}\n`;
        mensaje += `Imagen: ${producto.imagen}\n`;
      });

      const url = `https://wa.me/56930917730?text=${encodeURIComponent(
        mensaje
      )}`;
      window.open(url, "_blank");

      // 4️⃣ Limpiar carrito y redirigir
      clearCart();
      
      navigate("/micuenta");
    } catch (err) {
      console.error(err);
      alert("Ocurrió un error al crear tu pedido.");
    }
  };

  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const { data: userData, error } = await supabase.auth.getUser();
        if (error) {
          console.error("Error al obtener el usuario:", error.message);
          return;
        }
        if (userData?.user?.email) {
          setEmail(userData.user.email); // Autorrellenar el correo
        }
      } catch (err) {
        console.error("Error al obtener el correo del usuario:", err.message);
      }
    };

    fetchUserEmail();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      {/* Header */}
      <header className="text-center mb-12">
        <Link
          to="/shop"
          className="inline-flex items-center text-gray-400 hover:text-white transition mb-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
          <span className="ml-2">Regresar</span>
        </Link>
        <h1 className="text-3xl font-bold text-white">Finaliza tu compra</h1>
      </header>

      {/* Form and Summary */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Contact Data */}
        <div className="bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-6 text-white">
            Datos de contacto
          </h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm text-gray-300">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                placeholder="tuemail@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-lg bg-gray-700 border border-gray-600 p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.email && (
                <p className="text-xs mt-1 text-red-400">{errors.email}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="fortniteusername"
                className="block text-sm text-gray-300"
              >
                Nombre en Fortnite
              </label>
              <input
                id="fortniteusername"
                type="text"
                placeholder="TuNombreEnFortnite"
                value={fortniteUsername}
                onChange={(e) => setFortniteUsername(e.target.value)}
                className="mt-2 w-full rounded-lg bg-gray-700 border border-gray-600 p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-400 mt-2">
                Asegúrate de escribirlo exactamente como aparece en el juego.
              </p>
              {errors.fortniteUsername && (
                <p className="text-xs mt-1 text-red-400">
                  {errors.fortniteUsername}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Order Notes */}
        <div className="bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 text-white">
            Notas para el pedido (opcional)
          </h3>
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
          <h2 className="text-2xl font-semibold mb-6 text-white">
            Resumen del pedido
          </h2>
          <div className="space-y-4">
            {cart.length === 0 ? (
              <p className="text-gray-400">No hay productos en el carrito.</p>
            ) : (
              cart.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-4 py-4 border-b border-gray-700/50"
                >
                  <img
                    src={item.imagen}
                    alt={item.nombre}
                    className="w-16 h-16 rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-base text-white">
                      {item.nombre}
                    </h4>
                    <p className="text-sm text-gray-400">
                      Cantidad: {item.cantidad || 1}
                    </p>
                    <p className="text-sm text-gray-400">
                      {CLP.format(item.precio)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(index)}
                    className="text-gray-400 hover:text-white"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 6L6 18M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>
          <div className="mt-6">
            <div className="flex justify-between py-2">
              <span className="text-gray-300">Subtotal</span>
              <span className="font-medium text-white">
                {CLP.format(getSubtotal())}
              </span>
            </div>
            <div className="flex justify-between py-2 border-t border-gray-700">
              <span className="text-gray-300">Pago Vía Transferencia</span>
              
            </div>
            <div className="flex justify-between py-4 border-t border-gray-700 text-lg font-semibold">
              <span className="text-white">Total</span>
              <span className="text-white">{CLP.format(getTotal())}</span>
            </div>
          </div>
          <label className="flex items-start gap-3 text-sm text-gray-300 mt-4">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="mt-1 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
            />
            <span>
              Acepto los{" "}
              <a href="/terminos" className="underline hover:no-underline">
                términos y condiciones
              </a>{" "}
              y confirmo que mi nombre de Fortnite es correcto.
            </span>
          </label>
          {errors.terms && (
            <p className="text-xs mt-1 text-red-400">{errors.terms}</p>
          )}
          <button
            onClick={handleSubmit}
            disabled={!email.trim() || !fortniteUsername.trim() || !acceptTerms}
            className="mt-6 w-full py-3 rounded-lg bg-green-500 hover:bg-green-600 font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Finalizar pedido
          </button>
          <p className="text-xs text-gray-400 mt-4">
            Al finalizar, te contactaremos al correo indicado para coordinar la
            entrega en el juego.
          </p>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
