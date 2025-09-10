import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { supabase } from "../supabaseCliente";

const Checkout = () => {
  const { cart, removeFromCart, clearCart } = useCart();
  const [email, setEmail] = useState("");
  const [fortniteUsername, setFortniteUsername] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const CLP = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
  });

  const getSubtotal = () => {
    return cart.reduce(
      (total, item) => total + item.precio * (item.cantidad || 1),
      0
    );
  };

  const getTotal = () => {
    return getSubtotal();
  };

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
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

    try {
      // Simulación de envío de datos
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
        const { data: userData } = await supabase.auth.getUser();
        if (userData?.user?.email) {
          setEmail(userData.user.email);
        }
      } catch (err) {
        console.error("Error al obtener el correo del usuario:", err.message);
      }
    };

    fetchUserEmail();
  }, []);

  return (
    <div className="min-h-screen pt-24 bg-gray-900">
      <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {/* Resumen del pedido */}
        <div className="w-full md:w-1/2 p-4 md:p-8 bg-gray-800 text-white">
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-center md:text-left">
            Resumen del pedido
          </h2>
          <div className="space-y-2 md:space-y-4">
            {cart.length === 0 ? (
              <p className="text-gray-400 text-center">
                No hay productos en el carrito.
              </p>
            ) : (
              cart.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-2 md:gap-4 py-2 md:py-4 border-b border-gray-700"
                >
                  <img
                    src={item.imagen}
                    alt={item.nombre}
                    className="w-12 h-12 md:w-16 md:h-16 rounded-md object-cover"
                  />
                  <div className="flex-1 text-left">
                    <h4 className="font-medium text-sm md:text-base">
                      {item.nombre}
                    </h4>
                    <p className="text-xs md:text-sm text-gray-400">
                      Cantidad: {item.cantidad || 1}
                    </p>
                    <p className="text-xs md:text-sm text-gray-400">
                      {CLP.format(item.precio)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(index)}
                    className="text-gray-400 hover:text-white text-sm md:text-base"
                  >
                    ❌
                  </button>
                </div>
              ))
            )}
          </div>
          <div className="mt-4 md:mt-6">
            <div className="flex justify-between py-2">
              <span className="text-gray-300 text-sm md:text-base">
                Subtotal
              </span>
              <span className="font-medium text-sm md:text-base">
                {CLP.format(getSubtotal())}
              </span>
            </div>
            <div className="flex justify-between py-4 border-t border-gray-700 text-base md:text-lg font-semibold">
              <span>Total</span>
              <span>{CLP.format(getTotal())}</span>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <div className="w-full md:w-1/2 p-4 md:p-8 bg-gray-700 text-white">
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-center md:text-left">
            Finaliza tu compra
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
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
                className="mt-2 w-full rounded-lg bg-gray-700 border border-gray-600 p-2 md:p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="mt-2 w-full rounded-lg bg-gray-700 border border-gray-600 p-2 md:p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.fortniteUsername && (
                <p className="text-xs mt-1 text-red-400">
                  {errors.fortniteUsername}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="orderNotes"
                className="block text-sm text-gray-300"
              >
                Notas para el pedido (opcional)
              </label>
              <textarea
                id="orderNotes"
                rows="3"
                placeholder="Ej: estoy conectado de 20:00 a 22:00…"
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                className="mt-2 w-full rounded-lg bg-gray-700 border border-gray-600 p-2 md:p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <label className="flex items-start gap-2 md:gap-3 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
              />
              <span>
                Acepto los{" "}
                <Link to="/terminos" className="underline hover:no-underline">
                  términos y condiciones
                </Link>{" "}
                y confirmo que mi nombre de Fortnite es correcto.
              </span>
            </label>
            {errors.terms && (
              <p className="text-xs mt-1 text-red-400">{errors.terms}</p>
            )}
            <button
              type="submit"
              disabled={!email.trim() || !fortniteUsername.trim() || !acceptTerms}
              className="mt-4 md:mt-6 w-full py-2 md:py-3 rounded-lg bg-green-500 hover:bg-green-600 font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Finalizar pedido
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
