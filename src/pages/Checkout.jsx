import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { supabase } from "../supabaseCliente";
import MercadoPagoCheckout from "../components/MercadoPagoCheckout";

const Checkout = () => {
  const { cart, removeFromCart, clearCart } = useCart();
  const [email, setEmail] = useState("");
  const [fortniteUsername, setFortniteUsername] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [errors, setErrors] = useState({});
  const [showMPCheckout, setShowMPCheckout] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [telefono, setTelefono] = useState("");
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
    if (!paymentMethod) {
      newErrors.paymentMethod = "Selecciona un método de pago.";
    }
    if (!telefono.trim()) {
      newErrors.telefono = "Por favor introduce tu número de teléfono.";
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
      // 1️⃣ Obtener el usuario logueado
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      if (!currentUser) {
        alert("Debes iniciar sesión para hacer un pedido.");
        return;
      }

      // 2️⃣ Insertar pedido principal en Supabase
      const { data: pedidoData, error: pedidoError } = await supabase
        .from("pedidos")
        .insert([
          {
            user_id: currentUser.id,
            correo: email.trim(),
            username_fortnite: fortniteUsername.trim(),
            telefono: telefono.trim(),
            estado: "No Pagado",
          },
        ])
        .select()
        .single();
      if (pedidoError) throw pedidoError;

      // 3️⃣ Insertar ítems del carrito con pavos corregidos
      const itemsToInsert = cart.map((item) => {
        // Calcular pavos correctamente
        let pavosItem = item.pavos;
        if (!pavosItem) {
          // Si no tiene pavos definidos, calcular basado en el precio
          // Fórmula: precio_clp / 4.4 = pavos aproximados
          pavosItem = Math.round(item.precio / 4.4);
        }

        return {
          pedido_id: pedidoData.id,
          nombre_producto: item.nombre,
          precio_unitario: item.precio,
          cantidad: item.cantidad || 1,
          imagen_url: item.imagen,
          pavos: pavosItem, // ✅ Pavos calculados correctamente
        };
      });

      const { error: itemsError } = await supabase
        .from("pedido_items")
        .insert(itemsToInsert);
      if (itemsError) throw itemsError;

      // 4️⃣ Manejar método de pago
      if (paymentMethod === "Transferencia") {
        // Flujo WhatsApp con pavos incluidos
        let mensaje = `¡Hola! Quiero comprar en Tio Flashstore:%0A`;
        mensaje += `------------------------------------%0A`;
        cart.forEach((item, idx) => {
          // Calcular pavos correctamente para el mensaje
          let pavosItem = item.pavos;
          if (!pavosItem) {
            pavosItem = Math.round(item.precio / 4.4);
          }
          mensaje += `• ${item.nombre} x${item.cantidad || 1} - ${CLP.format(
            item.precio
          )} (${pavosItem.toLocaleString()} pavos)%0A`;
        });
        mensaje += `------------------------------------%0A`;

        // Calcular total de pavos correctamente
        const totalPavos = cart.reduce((total, item) => {
          let pavosItem = item.pavos;
          if (!pavosItem) {
            pavosItem = Math.round(item.precio / 4.4);
          }
          return total + pavosItem;
        }, 0);

        mensaje += `Total: ${CLP.format(getTotal())} (${totalPavos.toLocaleString()} pavos)%0A`;
        mensaje += `------------------------------------%0A`;
        mensaje += `Email: ${email}%0A`;
        mensaje += `Usuario Fortnite: ${fortniteUsername}%0A`;
        mensaje += `Método de pago: ${paymentMethod}%0A`;
        if (orderNotes) mensaje += `Notas: ${orderNotes}%0A`;
        mensaje += `%0A`;
        mensaje += `Acepto los términos y condiciones.`;

        const wspUrl = `https://wa.me/56930917730?text=${mensaje}`;
        clearCart();
        window.location.href = wspUrl;
      } else if (paymentMethod === "MercadoPago") {
        // Flujo Mercado Pago con componente React
        setCurrentOrderId(pedidoData.id);
        setShowMPCheckout(true);
      } else if (paymentMethod === "FLOW") {
        // Mantener flujo FLOW existente
        const subject =
          cart.length === 1 ? cart[0].nombre : `Pedido #${pedidoData.id}`;
        const amount = getTotal();

        const response = await fetch(
          "https://backendflash.onrender.com/api/flow-order",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: String(pedidoData.id),
              subject,
              amount,
              email,
            }),
          }
        );

        const data = await response.json();
        if (data.url && data.token) {
          window.location.href = `${data.url}?token=${data.token}`;
        } else {
          alert("No se pudo iniciar el pago con FLOW. Intenta nuevamente.");
        }
      }
    } catch (err) {
      console.error(err);
      alert("Ocurrió un error al crear tu pedido.");
    }
  };

  const handleMPError = (error) => {
    console.error("Error en pago:", error);
    alert("Error al procesar el pago con Mercado Pago");
    setShowMPCheckout(false);
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

  // Si está mostrando el checkout de Mercado Pago
  if (showMPCheckout && currentOrderId) {
    const subject =
      cart.length === 1 ? cart[0].nombre : `Pedido #${currentOrderId}`;

    return (
      <div className="min-h-screen pt-24 bg-gradient-to-br bg-gray-900 flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl mx-auto bg-white/90 rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Finalizar Pago
            </h2>
            <p className="text-gray-600">Total: {CLP.format(getTotal())}</p>
            {/* ✅ Agregar información sobre WhatsApp */}
            <p className="text-sm text-blue-600 mt-2">
              💬 Al completar el pago, se enviará automáticamente un WhatsApp con el
              resumen
            </p>
          </div>

          <MercadoPagoCheckout
            orderId={currentOrderId.toString()}
            subject={subject}
            amount={getTotal()}
            email={email}
            onSuccess={() => {
              clearCart();
              // ❌ NO redirigir aquí - Mercado Pago manejará la redirección
            }}
            onError={handleMPError}
          />

          <button
            onClick={() => setShowMPCheckout(false)}
            className="mt-4 w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
          >
            Volver atrás
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 bg-gradient-to-br min-h-screen pt-24 bg-gray-900 flex flex-col items-center justify-center animate-fade-in">
      <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-8 md:gap-12 bg-white/90 rounded-3xl shadow-2xl p-4 md:p-10 border border-gray-200 flex-col md:flex-row">
        {/* Formulario */}
        <div className="w-full md:w-2/3 flex flex-col gap-6 order-1 md:order-1">
          <h2 className="text-2xl font-bold mb-2 text-gray-800">
            Finaliza tu compra
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm text-gray-700 font-semibold"
              >
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                placeholder="tuemail@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`mt-2 w-full rounded-xl bg-white border-2 p-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition ${
                  errors.email ? "border-red-400" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="text-xs mt-1 text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="fortniteusername"
                className="block text-sm text-gray-700 font-semibold"
              >
                Nombre en Fortnite
              </label>
              <input
                id="fortniteusername"
                type="text"
                placeholder="TuNombreEnFortnite"
                value={fortniteUsername}
                onChange={(e) => setFortniteUsername(e.target.value)}
                className={`mt-2 w-full rounded-xl bg-white border-2 p-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition ${
                  errors.fortniteUsername ? "border-red-400" : "border-gray-300"
                }`}
              />
              {errors.fortniteUsername && (
                <p className="text-xs mt-1 text-red-500">
                  {errors.fortniteUsername}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="telefono"
                className="block text-sm text-gray-700 font-semibold"
              >
                Número de teléfono
              </label>
              <input
                id="telefono"
                type="tel"
                placeholder="Ej: +56912345678"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className={`mt-2 w-full rounded-xl bg-white border-2 p-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition ${
                  errors.telefono ? "border-red-400" : "border-gray-300"
                }`}
              />
              {errors.telefono && (
                <p className="text-xs mt-1 text-red-500">{errors.telefono}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="orderNotes"
                className="block text-sm text-gray-700 font-semibold"
              >
                Notas para el pedido (opcional)
              </label>
              <textarea
                id="orderNotes"
                rows="3"
                placeholder="Ej: estoy conectado de 20:00 a 22:00…"
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                className="mt-2 w-full rounded-xl bg-white border-2 border-gray-300 p-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              />
            </div>

            {/* Método de pago */}
            <div>
              <label className="block text-sm text-gray-700 font-semibold mb-1">
                Método de pago
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className={`w-full rounded-xl bg-white border-2 p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400 transition ${
                  errors.paymentMethod ? "border-red-400" : "border-gray-300"
                }`}
              >
                <option value="">Selecciona un método</option>
                <option value="MercadoPago">Mercado Pago (Tarjeta, Webpay, etc)</option>
                <option value="Transferencia">Transferencia</option>
              </select>
              {errors.paymentMethod && (
                <p className="text-xs mt-1 text-red-500">
                  {errors.paymentMethod}
                </p>
              )}

              {/* ✅ Mostrar información sobre WhatsApp automático */}
              {paymentMethod === "MercadoPago" && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                    <span className="text-sm font-medium">
                      Al completar el pago, se enviará automáticamente un WhatsApp
                      con el resumen del pedido
                    </span>
                  </div>
                </div>
              )}

              {/* Resumen del pedido SOLO en móvil */}
              <div className="block md:hidden mt-6">
                <div className="w-full bg-white/80 rounded-2xl shadow-lg p-6 flex flex-col gap-4 border border-gray-200 h-fit self-start">
                  <h2 className="text-xl font-bold mb-2 text-gray-800">
                    Resumen del pedido
                  </h2>
                  <div className="space-y-3">
                    {cart.length === 0 ? (
                      <p className="text-gray-400 text-center">
                        No hay productos en el carrito.
                      </p>
                    ) : (
                      cart.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 border-b border-gray-200 pb-3 last:border-b-0"
                        >
                          <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#47fdfe] to-[#2b6fa1]">
                            <img
                              src={item.imagen}
                              alt={item.nombre}
                              className="object-contain max-h-12 max-w-12"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-800 truncate">
                              {item.nombre}
                            </p>
                            <p className="text-xs text-gray-500">
                              Cantidad: {item.cantidad || 1}
                            </p>
                          </div>
                          <span className="font-bold text-green-600">
                            {CLP.format(item.precio)}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeFromCart(index)}
                            className="ml-2 text-red-500 hover:text-white bg-red-500/10 hover:bg-red-500/80 rounded-full w-8 h-8 flex items-center justify-center transition-all"
                            aria-label="Eliminar producto"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M18 6 6 18M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="mt-2 flex justify-between text-gray-700 font-semibold">
                    <span>Subtotal</span>
                    <span>{CLP.format(getSubtotal())}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-900 border-t border-gray-200 pt-3">
                    <span>Total</span>
                    <span>{CLP.format(getTotal())}</span>
                  </div>
                </div>
              </div>
            </div>

            <label className="flex items-start gap-3 text-sm text-gray-700 font-semibold">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1 rounded border-gray-400 bg-white text-green-500 focus:ring-green-400"
              />
              <span>
                Acepto los{" "}
                <Link
                  to="/terminos"
                  className="underline hover:no-underline text-green-600"
                >
                  términos y condiciones
                </Link>{" "}
                y confirmo que mi nombre de Fortnite es correcto.
              </span>
            </label>
            <label className="flex items-start gap-3 text-sm text-gray-700 font-semibold">
              
              <span>
                Antes de finalizar, asegúrate de tener agregado como amigo a Reydelosvbucks en Fortnite.
              </span>
            </label>
            {errors.terms && (
              <p className="text-xs mt-1 text-red-500">{errors.terms}</p>
            )}

            <button
              type="submit"
              disabled={
                !email.trim() || !fortniteUsername.trim() || !acceptTerms
              }
              className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white font-bold text-lg shadow-lg transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 12l5 5L20 7"
                />
              </svg>
              Finalizar pedido
            </button>

            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="#22c55e"
                  strokeWidth="2"
                />
                <path
                  stroke="#22c55e"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 12l2 2 4-4"
                />
              </svg>
              Pago 100% seguro y protegido
            </div>
          </form>

          {/* Ayuda WhatsApp */}
          <div className="mt-8 flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                fill="#25D366"
                d="M17.472 14.382c-.297-.149-1.758-.867-2.031-.967-.273-.099-.472-.148-.67.15-.198.297-.767.967-.94 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.151-.174.2-.298.3-.497.099-.198.05-.372-.025-.52-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.099 3.2 5.077 4.363.71.306 1.263.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.288.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 5.421h-.001a8.933 8.933 0 0 1-4.548-1.252l-.326-.194-3.377.892.902-3.292-.213-.337a8.922 8.922 0 0 1-1.37-4.788c.001-4.936 4.011-8.946 8.949-8.946 2.389 0 4.637.93 6.324 2.617a8.862 8.862 0 0 1 2.624 6.323c-.003 4.936-4.013 8.946-8.949 8.946m7.437-16.384A10.92 10.92 0 0 0 12.05 1.933C6.477 1.933 1.93 6.479 1.928 12.05c0 2.123.555 4.199 1.607 6.032l-1.7 6.191a1.003 1.003 0 0 0 1.223 1.223l6.193-1.7a10.888 10.888 0 0 0 4.799 1.146h.005c5.572 0 10.119-4.547 10.121-10.118a10.86 10.86 0 0 0-3.184-7.924"
              />
            </svg>
            <span className="text-green-700 font-semibold text-sm">
              ¿Dudas?{" "}
              <a
                href="https://wa.me/56930917730"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Habla con soporte
              </a>
            </span>
          </div>
        </div>

        {/* Resumen del pedido SOLO en escritorio */}
        <div className="hidden md:block w-full md:w-1/3 bg-white/80 rounded-2xl shadow-lg p-6 flex flex-col gap-4 border border-gray-200 h-fit self-start order-2 md:order-2">
          <h2 className="text-xl font-bold mb-2 text-gray-800">
            Resumen del pedido
          </h2>
          <div className="space-y-3">
            {cart.length === 0 ? (
              <p className="text-gray-400 text-center">
                No hay productos en el carrito.
              </p>
            ) : (
              cart.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 border-b border-gray-200 pb-3 last:border-b-0"
                >
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#47fdfe] to-[#2b6fa1]">
                    <img
                      src={item.imagen}
                      alt={item.nombre}
                      className="object-contain max-h-12 max-w-12"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate">
                      {item.nombre}
                    </p>
                    <p className="text-xs text-gray-500">
                      Cantidad: {item.cantidad || 1}
                    </p>
                  </div>
                  <span className="font-bold text-green-600">
                    {CLP.format(item.precio)}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFromCart(index)}
                    className="ml-2 text-red-500 hover:text-white bg-red-500/10 hover:bg-red-500/80 rounded-full w-8 h-8 flex items-center justify-center transition-all"
                    aria-label="Eliminar producto"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M18 6 6 18M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>
          <div className="mt-2 flex justify-between text-gray-700 font-semibold">
            <span>Subtotal</span>
            <span>{CLP.format(getSubtotal())}</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-gray-900 border-t border-gray-200 pt-3">
            <span>Total</span>
            <span>{CLP.format(getTotal())}</span>
          </div>
        </div>
      </div>

      <style>{`
        .animate-fade-in {
          animation: fadeInCheckout 0.7s cubic-bezier(.4,2,.6,1) both;
        }
        @keyframes fadeInCheckout {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  );
};

export default Checkout;
