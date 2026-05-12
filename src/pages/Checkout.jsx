import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { supabase } from "../supabaseCliente";
import MercadoPagoCheckout from "../components/MercadoPagoCheckout";
import PayPalCheckout from "../components/PayPalCheckout";
import useScrollToTop from '../hooks/useScrollToTop';
import { VBUCK_TO_CLP_RATE, convertCLPToVBuck, convertVBuckToCLP, formatCLP } from '../config/prices';

// Función para validar RUT chileno
const validateRut = (rut) => {
  // Limpiar el RUT de puntos y guión
  const cleanRut = rut.replace(/[.-]/g, '');
  
  // Obtener dígito verificador
  const dv = cleanRut.slice(-1).toUpperCase();
  
  // Obtener cuerpo del RUT
  const rutBody = cleanRut.slice(0, -1);
  
  if (rutBody.length < 7) return false;
  
  // Calcular dígito verificador
  let sum = 0;
  let multiplier = 2;
  
  // Suma ponderada
  for (let i = rutBody.length - 1; i >= 0; i--) {
    sum += Number(rutBody[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  
  // Calcular dígito verificador esperado
  const expectedDV = 11 - (sum % 11);
  let calculatedDV;
  
  if (expectedDV === 11) calculatedDV = '0';
  else if (expectedDV === 10) calculatedDV = 'K';
  else calculatedDV = String(expectedDV);
  
  return calculatedDV === dv;
};

const Checkout = () => {
  useScrollToTop();
  const { cart, removeFromCart, clearCart } = useCart();
  const [email, setEmail] = useState("");
  const [fortniteUsername, setFortniteUsername] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [errors, setErrors] = useState({});
  const [showMPCheckout, setShowMPCheckout] = useState(false);
  const [showPayPalCheckout, setShowPayPalCheckout] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [telefono, setTelefono] = useState("");
  const [xboxOption, setXboxOption] = useState("");
  const [xboxEmail, setXboxEmail] = useState("");
  const [xboxPassword, setXboxPassword] = useState("");
  const [crunchyrollOption, setCrunchyrollOption] = useState("");
  const [chatgptOption, setChatgptOption] = useState("");
  const [chatgptEmail, setChatgptEmail] = useState("");
  const [iptvOption, setIptvOption] = useState("");
  const [rut, setRut] = useState("");
  
  // Estados para configuración de V-Bucks
  const [vbucksDeliveryMethod, setVbucksDeliveryMethod] = useState("");
  const [vbucksEpicEmail, setVbucksEpicEmail] = useState("");
  const [vbucksEpicPassword, setVbucksEpicPassword] = useState("");
  const [vbucksXboxEmail, setVbucksXboxEmail] = useState("");
  const [vbucksXboxPassword, setVbucksXboxPassword] = useState("");
  const [vbucks2FAConfirmed, setVbucks2FAConfirmed] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(null);
  
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
    
    // Detectar si solo tiene productos que no son de Fortnite (Crunchyroll, IPTV, ChatGPT, Office, Windows, V-Bucks)
    const hasFortniteProducts = cart.some(item => {
      const nombre = item.nombre.toLowerCase();
      return !nombre.includes('crunchyroll') && 
             !nombre.includes('iptv') && 
             !nombre.includes('chatgpt') && 
             !nombre.includes('office') && 
             !nombre.includes('windows') &&
             !nombre.includes('streaming') &&
             !nombre.includes('v-bucks') &&
             !nombre.includes('vbucks') &&
             !nombre.includes('pavos');
    });

    if (!email.trim()) {
      newErrors.email = "Por favor introduce un email válido.";
    }
    
    // Solo validar fortniteUsername si hay productos de Fortnite
    if (hasFortniteProducts && !fortniteUsername.trim()) {
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

    // Validación para Fortnite Crew
    const hasCrewItem = cart.some(item => item.nombre.toLowerCase().includes('crew'));
    if (hasCrewItem) {
      if (!xboxOption) {
        newErrors.xboxOption = "Por favor selecciona una opción para Xbox.";
      }
      if (xboxOption === "cuenta-existente") {
        if (!xboxEmail.trim()) {
          newErrors.xboxEmail = "Por favor introduce el correo de tu cuenta de Xbox.";
        }
        if (!xboxPassword.trim()) {
          newErrors.xboxPassword = "Por favor introduce la contraseña de tu cuenta de Xbox.";
        }
      }
    }

    // Validación para Crunchyroll
    const hasCrunchyrollItem = cart.some(item => item.nombre.toLowerCase().includes('crunchyroll'));
    if (hasCrunchyrollItem) {
      if (!crunchyrollOption) {
        newErrors.crunchyrollOption = "Por favor selecciona el tipo de cuenta de Crunchyroll.";
      }
    }

    // Validación para ChatGPT
    const hasChatgptItem = cart.some(item => item.nombre.toLowerCase().includes('chatgpt'));
    if (hasChatgptItem) {
      if (!chatgptOption) {
        newErrors.chatgptOption = "Por favor selecciona el tipo de plan de ChatGPT.";
      }
      // Si es 1 mes (por invitación), requiere correo
      if (chatgptOption === '1-mes' && !chatgptEmail.trim()) {
        newErrors.chatgptEmail = "Por favor introduce el correo para la invitación.";
      }
    }

    // Validación para IPTV
    const hasIptvItem = cart.some(item => item.nombre.toLowerCase().includes('iptv'));
    if (hasIptvItem) {
      if (!iptvOption) {
        newErrors.iptvOption = "Por favor selecciona el tipo de servicio de IPTV.";
      }
    }

    // Validación para V-Bucks/Recargas
    const hasVbucksItem = cart.some(item => {
      const nombre = item.nombre.toLowerCase();
      return nombre.includes('v-bucks') || nombre.includes('vbucks') || nombre.includes('pavos');
    });
    if (hasVbucksItem) {
      if (!vbucksDeliveryMethod) {
        newErrors.vbucksDeliveryMethod = "Por favor selecciona el método de entrega de V-Bucks.";
      }
      // Validar credenciales según el método seleccionado
      if (vbucksDeliveryMethod === 'epic-link') {
        if (!vbucksEpicEmail.trim()) {
          newErrors.vbucksEpicEmail = "Por favor introduce el correo de tu cuenta de Epic.";
        }
        if (!vbucksEpicPassword.trim()) {
          newErrors.vbucksEpicPassword = "Por favor introduce la contraseña de tu cuenta de Epic.";
        }
        if (!vbucks2FAConfirmed) {
          newErrors.vbucks2FAConfirmed = "Debes confirmar que deshabilitarás la autenticación de dos factores.";
        }
      } else if (vbucksDeliveryMethod === 'xbox-account') {
        if (!vbucksXboxEmail.trim()) {
          newErrors.vbucksXboxEmail = "Por favor introduce el correo de tu cuenta de Xbox.";
        }
        if (!vbucksXboxPassword.trim()) {
          newErrors.vbucksXboxPassword = "Por favor introduce la contraseña de tu cuenta de Xbox.";
        }
        if (!vbucks2FAConfirmed) {
          newErrors.vbucks2FAConfirmed = "Debes confirmar que deshabilitarás la autenticación de dos factores.";
        }
      }
      // La opción 'preloaded-account' no requiere credenciales
    }

    if (!rut.trim()) {
      newErrors.rut = "Por favor introduce tu RUT.";
    } else if (!validateRut(rut)) {
      newErrors.rut = "Por favor introduce un RUT válido.";
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
      // Preparar la información de Xbox si hay un producto Crew
      const hasCrewItem = cart.some(item => item.nombre.toLowerCase().includes('crew'));
      const xboxData = hasCrewItem ? {
        xbox_option: xboxOption,
        xbox_email: xboxOption === 'cuenta-existente' ? xboxEmail.trim() : null,
        xbox_password: xboxOption === 'cuenta-existente' ? xboxPassword.trim() : null
      } : {};

      // Preparar la información de Crunchyroll si hay un producto Crunchyroll
      const hasCrunchyrollItem = cart.some(item => item.nombre.toLowerCase().includes('crunchyroll'));
      const crunchyrollData = hasCrunchyrollItem ? {
        crunchyroll_option: crunchyrollOption
      } : {};

      // Preparar la información de ChatGPT si hay un producto ChatGPT
      const hasChatgptItem = cart.some(item => item.nombre.toLowerCase().includes('chatgpt'));
      const chatgptData = hasChatgptItem ? {
        chatgpt_option: chatgptOption,
        chatgpt_email: chatgptOption === '1-mes' ? chatgptEmail.trim() : null
      } : {};

      // Preparar la información de IPTV si hay un producto IPTV
      const hasIptvItem = cart.some(item => item.nombre.toLowerCase().includes('iptv'));
      const iptvData = hasIptvItem ? {
        iptv_option: iptvOption
      } : {};

      // Preparar la información de V-Bucks/Recargas si hay un producto de V-Bucks
      const hasVbucksItem = cart.some(item => {
        const nombre = item.nombre.toLowerCase();
        return nombre.includes('v-bucks') || nombre.includes('vbucks') || nombre.includes('pavos');
      });
      const vbucksData = hasVbucksItem ? {
        vbucks_delivery_method: vbucksDeliveryMethod,
        vbucks_epic_email: vbucksDeliveryMethod === 'epic-link' ? vbucksEpicEmail.trim() : null,
        vbucks_epic_password: vbucksDeliveryMethod === 'epic-link' ? vbucksEpicPassword.trim() : null,
        vbucks_xbox_email: vbucksDeliveryMethod === 'xbox-account' ? vbucksXboxEmail.trim() : null,
        vbucks_xbox_password: vbucksDeliveryMethod === 'xbox-account' ? vbucksXboxPassword.trim() : null
      } : {};

      // Detectar si hay productos de Fortnite (excluyendo V-Bucks que tienen su propia sección)
      const hasFortniteProducts = cart.some(item => {
        const nombre = item.nombre.toLowerCase();
        return !nombre.includes('crunchyroll') && 
               !nombre.includes('iptv') && 
               !nombre.includes('chatgpt') && 
               !nombre.includes('office') && 
               !nombre.includes('windows') &&
               !nombre.includes('streaming') &&
               !nombre.includes('v-bucks') &&
               !nombre.includes('vbucks') &&
               !nombre.includes('pavos');
      });

      const { data: pedidoData, error: pedidoError } = await supabase
        .from("pedidos")
        .insert([
          {
            user_id: currentUser.id,
            correo: email.trim(),
            username_fortnite: hasFortniteProducts ? fortniteUsername.trim() : 'N/A',
            telefono: telefono.trim(),
            rut: rut.trim(),
            estado: "No Pagado",
            ...xboxData,  // Incluir información de Xbox solo si existe
            ...crunchyrollData,  // Incluir información de Crunchyroll solo si existe
            ...chatgptData,  // Incluir información de ChatGPT solo si existe
            ...iptvData,  // Incluir información de IPTV solo si existe
            ...vbucksData  // Incluir información de V-Bucks solo si existe
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
          pavosItem = convertCLPToVBuck(item.precio);
        }

        return {
          pedido_id: pedidoData.id,
          nombre_producto: item.nombre,
          precio_unitario: item.precio,
          cantidad: item.cantidad || 1,
          imagen_url: item.imagen,
          pavos: pavosItem,
          offer_id: item.offer_id || null,
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
        
        // Solo incluir usuario de Fortnite si hay productos de Fortnite
        const hasFortniteProducts = cart.some(item => {
          const nombre = item.nombre.toLowerCase();
          return !nombre.includes('crunchyroll') && 
                 !nombre.includes('iptv') && 
                 !nombre.includes('chatgpt') && 
                 !nombre.includes('office') && 
                 !nombre.includes('windows') &&
                 !nombre.includes('streaming');
        });
        
        if (hasFortniteProducts && fortniteUsername) {
          mensaje += `Usuario Fortnite: ${fortniteUsername}%0A`;
        }
        
        mensaje += `Método de pago: ${paymentMethod}%0A`;
        
        // Añadir información de Xbox si hay producto Crew
        if (hasCrewItem) {
          mensaje += `------------------------------------%0A`;
          mensaje += `Información de Xbox:%0A`;
          mensaje += `Opción seleccionada: ${xboxOption === 'cuenta-existente' ? 'Tiene cuenta Xbox' : 'Necesita cuenta Xbox'}%0A`;
          if (xboxOption === 'cuenta-existente') {
            mensaje += `Correo Xbox: ${xboxEmail}%0A`;
            mensaje += `Contraseña Xbox: ${xboxPassword}%0A`;
          }
        }

        // Añadir información de Crunchyroll si hay producto Crunchyroll
        const hasCrunchyrollItem = cart.some(item => item.nombre.toLowerCase().includes('crunchyroll'));
        if (hasCrunchyrollItem) {
          mensaje += `------------------------------------%0A`;
          mensaje += `Información de Crunchyroll:%0A`;
          mensaje += `Tipo de cuenta: ${crunchyrollOption === 'cuenta-nueva' ? 'Cuenta nueva' : 'Activación en cuenta propia'}%0A`;
        }

        // Añadir información de ChatGPT si hay producto ChatGPT
        const hasChatgptItem = cart.some(item => item.nombre.toLowerCase().includes('chatgpt'));
        if (hasChatgptItem) {
          mensaje += `------------------------------------%0A`;
          mensaje += `Información de ChatGPT Plus:%0A`;
          if (chatgptOption === '1-mes') {
            mensaje += `Plan: 1 Mes (Por invitación)%0A`;
            mensaje += `Correo para invitación: ${chatgptEmail}%0A`;
          } else {
            mensaje += `Plan: 12 Meses (Activación en cuenta propia)%0A`;
          }
        }

        // Añadir información de IPTV si hay producto IPTV
        const hasIptvItem = cart.some(item => item.nombre.toLowerCase().includes('iptv'));
        if (hasIptvItem) {
          mensaje += `------------------------------------%0A`;
          mensaje += `Información de IPTV:%0A`;
          mensaje += `Tipo de servicio: ${iptvOption === 'cuenta-nueva' ? 'Cuenta nueva' : 'Renovación'}%0A`;
        }
        
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
      } else if (paymentMethod === "PayPal") {
        // Flujo PayPal
        setCurrentOrderId(pedidoData.id);
        setShowPayPalCheckout(true);
      } else if (paymentMethod === "Cripto") {
        // Flujo Zenobank - Criptomonedas
        const subject =
          cart.length === 1 ? cart[0].nombre : `Pedido #${pedidoData.id}`;
        const amount = getTotal();

        try {
          const response = await fetch(
            "https://backendflash.onrender.com/api/zenobank-checkout",
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
          if (data.checkoutUrl) {
            clearCart();
            window.location.href = data.checkoutUrl;
          } else {
            alert("No se pudo iniciar el pago con criptomonedas. Intenta nuevamente.");
          }
        } catch (cryptoErr) {
          console.error("Error con Zenobank:", cryptoErr);
          alert("Error al conectar con el servicio de criptomonedas.");
        }
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

  const handlePayPalSuccess = (captureData) => {
    clearCart();
    // Redirigir al backend para generar el mensaje de WhatsApp
    window.location.href = `https://backendflash.onrender.com/paypal-success?order=${currentOrderId}&email=${encodeURIComponent(email)}`;
  };

  const handlePayPalError = (error) => {
    console.error("Error en pago PayPal:", error);
    alert("Error al procesar el pago con PayPal");
    setShowPayPalCheckout(false);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (userData?.user?.email) {
          setEmail(userData.user.email);
          
          // Intentar obtener el RUT del usuario desde la base de datos
          const { data: userProfile } = await supabase
            .from('usuarios')
            .select('rut')
            .eq('user_id', userData.user.id)
            .single();
            
          if (userProfile?.rut) {
            setRut(userProfile.rut);
          }
        }
      } catch (err) {
        console.error("Error al obtener los datos del usuario:", err.message);
      }
    };

    fetchUserData();

    // Obtener tasa de cambio actual
    fetch('https://backendflash.onrender.com/api/exchange-rate')
      .then(res => res.json())
      .then(data => {
        if (data.clpPerUsd) setExchangeRate(data.clpPerUsd);
      })
      .catch(() => setExchangeRate(950));
  }, []);

  // Si está mostrando el checkout de PayPal
  if (showPayPalCheckout && currentOrderId) {
    const rate = exchangeRate || 950;
    const baseUSD = (getTotal() / rate);
    const totalWithFee = (baseUSD + 0.30) / (1 - 0.054);
    const feeUSD = totalWithFee - baseUSD;
    return (
      <div className="min-h-screen pt-24 bg-gradient-to-br bg-gray-900 flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl mx-auto bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              Pagar con PayPal
            </h2>
            <div className="space-y-1 mt-3">
              <p className="text-gray-300">Subtotal: {CLP.format(getTotal())}</p>
              <p className="text-sm text-gray-400">
                Equivalente a ~${baseUSD.toFixed(2)} USD
              </p>
              <div className="border-t border-white/10 mt-2 pt-2">
                <p className="text-sm text-yellow-400">
                  Comisión PayPal (5.4% + $0.30): +${feeUSD.toFixed(2)} USD
                </p>
                <p className="text-lg font-bold text-white mt-1">
                  Total a pagar: ${totalWithFee.toFixed(2)} USD
                </p>
              </div>
              {exchangeRate && (
                <p className="text-xs text-gray-500 mt-1">
                  Tasa actual: 1 USD = {Math.round(exchangeRate)} CLP
                </p>
              )}
            </div>
            <p className="text-sm text-blue-400 mt-3">
              💬 Al completar el pago, recuerda enviar la confirmacion de pago por whatsapp
            </p>
          </div>

          <PayPalCheckout
            orderId={currentOrderId.toString()}
            amount={getTotal()}
            email={email}
            onError={handlePayPalError}
          />

          <button
            onClick={() => setShowPayPalCheckout(false)}
            className="mt-4 w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition"
          >
            Volver atrás
          </button>
        </div>
      </div>
    );
  }

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
            <p className="text-sm text-blue-400 mt-3">
              💬 Al completar el pago, recuerda enviar la confirmación de pago por whatsapp.
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
    <div className="min-h-screen pt-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center animate-fade-in">
      {/* Header con gradiente y progreso */}
      <div className="w-full max-w-7xl mx-auto mb-6 px-4">
        <div className="text-center">
          <div className="inline-block mb-3">
            <span className="bg-blue-600/20 text-blue-400 px-4 py-2 rounded-full text-sm font-semibold tracking-wider uppercase border border-blue-600/30">
              PASO FINAL
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600 bg-clip-text text-transparent">
            Finaliza tu Compra
          </h1>
          <p className="text-gray-400 mt-2">Completa tus datos para procesar el pedido</p>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 p-4">
        {/* Formulario */}
        <div className="w-full lg:w-2/3 flex flex-col gap-6 order-1 lg:order-1 bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-700/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Grid de 2 columnas para campos principales en pantallas grandes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm text-gray-300 font-semibold mb-2 flex items-center gap-2"
              >
                <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                placeholder="tuemail@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full rounded-xl bg-gray-900/80 border-2 p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all ${
                  errors.email ? "border-red-400 focus:ring-red-400" : "border-gray-600"
                }`}
              />
              {errors.email && (
                <p className="text-xs mt-1 text-red-400 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Solo mostrar campo de Fortnite si hay productos de Fortnite */}
            {cart.some(item => {
              const nombre = item.nombre.toLowerCase();
              return !nombre.includes('crunchyroll') && 
                     !nombre.includes('iptv') && 
                     !nombre.includes('chatgpt') && 
                     !nombre.includes('office') && 
                     !nombre.includes('windows') &&
                     !nombre.includes('streaming');
            }) && (
              <div>
                <label
                  htmlFor="fortniteusername"
                  className="block text-sm text-gray-300 font-semibold mb-2 flex items-center gap-2"
                >
                  <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                  Usuario de Epic Games
                </label>
                <input
                  id="fortniteusername"
                  type="text"
                  placeholder="Usuario De Epic"
                  value={fortniteUsername}
                  onChange={(e) => setFortniteUsername(e.target.value)}
                  className={`w-full rounded-xl bg-gray-900/80 border-2 p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all ${
                    errors.fortniteUsername ? "border-red-400 focus:ring-red-400" : "border-gray-600"
                  }`}
                />
                {errors.fortniteUsername && (
                  <p className="text-xs mt-1 text-red-400 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                    </svg>
                    {errors.fortniteUsername}
                  </p>
                )}
              </div>
            )}

            <div>
              <label
                htmlFor="telefono"
                className="block text-sm text-gray-300 font-semibold mb-2 flex items-center gap-2"
              >
                <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                Número de teléfono
              </label>
              <input
                id="telefono"
                type="tel"
                placeholder="Ej: +56912345678"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className={`w-full rounded-xl bg-gray-900/80 border-2 p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all ${
                  errors.telefono ? "border-red-400 focus:ring-red-400" : "border-gray-600"
                }`}
              />
              {errors.telefono && (
                <p className="text-xs mt-1 text-red-400 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                  {errors.telefono}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="rut"
                className="block text-sm text-gray-300 font-semibold mb-2 flex items-center gap-2"
              >
                <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"/>
                </svg>
                RUT
              </label>
              <input
                id="rut"
                type="text"
                placeholder="Ej: 12.345.678-9"
                value={rut}
                onChange={(e) => setRut(e.target.value)}
                className={`w-full rounded-xl bg-gray-900/80 border-2 p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all ${
                  errors.rut ? "border-red-400 focus:ring-red-400" : "border-gray-600"
                }`}
              />
              {errors.rut && (
                <p className="text-xs mt-1 text-red-400 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                  {errors.rut}
                </p>
              )}
            </div>
            </div>

            {/* Notas - Ancho completo */}
            <div>
              <label
                htmlFor="orderNotes"
                className="block text-sm text-gray-300 font-semibold mb-2 flex items-center gap-2"
              >
                <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
                Notas para el pedido (opcional)
              </label>
              <textarea
                id="orderNotes"
                rows="3"
                placeholder="Ej: estoy conectado de 20:00 a 22:00…"
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                className="w-full rounded-xl bg-gray-900/80 border-2 border-gray-600 p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all"
              />
            </div>

            {/* Sección Crunchyroll */}
            {cart.some(item => item.nombre.toLowerCase().includes('crunchyroll')) && (
              <div className="space-y-4 p-4 bg-gradient-to-br from-orange-800/50 to-orange-900/50 rounded-xl border border-orange-700/50 shadow-lg">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polygon points="10 8 16 12 10 16 10 8"/>
                  </svg>
                  Configuración de Crunchyroll
                </h3>
                
                <div className="space-y-3">
                  <label className="block text-sm text-gray-300 font-semibold">
                    Tipo de cuenta:
                  </label>
                  
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="crunchyrollOption"
                        value="cuenta-nueva"
                        checked={crunchyrollOption === "cuenta-nueva"}
                        onChange={(e) => setCrunchyrollOption(e.target.value)}
                        className="text-orange-500 focus:ring-orange-400 bg-gray-800 border-gray-600"
                      />
                      <span className="text-white">🆕 Cuenta nueva (nosotros la creamos)</span>
                    </label>
                    
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="crunchyrollOption"
                        value="cuenta-propia"
                        checked={crunchyrollOption === "cuenta-propia"}
                        onChange={(e) => setCrunchyrollOption(e.target.value)}
                        className="text-orange-500 focus:ring-orange-400 bg-gray-800 border-gray-600"
                      />
                      <span className="text-white">👤 Activación en mi cuenta existente</span>
                    </label>
                  </div>

                  {errors.crunchyrollOption && (
                    <p className="text-xs text-red-500 mt-1">{errors.crunchyrollOption}</p>
                  )}

                  {crunchyrollOption && (
                    <div className="mt-3 p-3 bg-gray-800/50 rounded-lg border border-orange-500/30">
                      <p className="text-orange-400 text-sm flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"/>
                          <line x1="12" y1="16" x2="12" y2="12"/>
                          <line x1="12" y1="8" x2="12.01" y2="8"/>
                        </svg>
                        {crunchyrollOption === 'cuenta-nueva' 
                          ? 'Te crearemos una cuenta nueva de Crunchyroll' 
                          : 'Activaremos el plan en tu cuenta existente de Crunchyroll'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Sección ChatGPT Plus */}
            {cart.some(item => item.nombre.toLowerCase().includes('chatgpt')) && (
              <div className="space-y-4 p-4 bg-gradient-to-br from-green-800/50 to-emerald-900/50 rounded-xl border border-green-700/50 shadow-lg">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 16v-4"/>
                    <path d="M12 8h.01"/>
                  </svg>
                  Configuración de ChatGPT Plus
                </h3>
                
                <div className="space-y-3">
                  <label className="block text-sm text-gray-300 font-semibold">
                    Selecciona tu plan:
                  </label>
                  
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="chatgptOption"
                        value="1-mes"
                        checked={chatgptOption === "1-mes"}
                        onChange={(e) => setChatgptOption(e.target.value)}
                        className="text-green-500 focus:ring-green-400 bg-gray-800 border-gray-600"
                      />
                      <span className="text-white">📧 1 Mes - Por invitación</span>
                    </label>
                    
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="chatgptOption"
                        value="12-meses"
                        checked={chatgptOption === "12-meses"}
                        onChange={(e) => setChatgptOption(e.target.value)}
                        className="text-green-500 focus:ring-green-400 bg-gray-800 border-gray-600"
                      />
                      <span className="text-white">👤 12 Meses - Activación en cuenta propia</span>
                    </label>
                  </div>

                  {errors.chatgptOption && (
                    <p className="text-xs text-red-500 mt-1">{errors.chatgptOption}</p>
                  )}

                  {/* Campo de correo si es 1 mes */}
                  {chatgptOption === '1-mes' && (
                    <div className="space-y-3 mt-3">
                      <div>
                        <label className="block text-sm text-gray-300 font-semibold">
                          Correo para la invitación
                        </label>
                        <input
                          type="email"
                          value={chatgptEmail}
                          onChange={(e) => setChatgptEmail(e.target.value)}
                          placeholder="correo@ejemplo.com"
                          className="mt-1 w-full rounded-lg bg-gray-800 border border-gray-600 p-2 text-white placeholder-gray-400"
                        />
                        {errors.chatgptEmail && (
                          <p className="text-xs text-red-500 mt-1">{errors.chatgptEmail}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {chatgptOption && (
                    <div className="mt-3 p-3 bg-gray-800/50 rounded-lg border border-green-500/30">
                      <p className="text-green-400 text-sm flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6L9 17l-5-5"/>
                        </svg>
                        {chatgptOption === '1-mes' 
                          ? 'Te enviaremos una invitación al correo proporcionado' 
                          : 'Activaremos ChatGPT Plus directamente en tu cuenta'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Sección IPTV */}
            {cart.some(item => item.nombre.toLowerCase().includes('iptv')) && (
              <div className="space-y-4 p-4 bg-gradient-to-br from-blue-800/50 to-blue-900/50 rounded-xl border border-blue-700/50 shadow-lg">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="15" rx="2" ry="2"/>
                    <polyline points="17 2 12 7 7 2"/>
                  </svg>
                  Configuración de IPTV
                </h3>
                
                <div className="space-y-3">
                  <label className="block text-sm text-gray-300 font-semibold">
                    Tipo de servicio:
                  </label>
                  
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="iptvOption"
                        value="cuenta-nueva"
                        checked={iptvOption === "cuenta-nueva"}
                        onChange={(e) => setIptvOption(e.target.value)}
                        className="text-blue-500 focus:ring-blue-400 bg-gray-800 border-gray-600"
                      />
                      <span className="text-white">🆕 Cuenta nueva</span>
                    </label>
                    
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="iptvOption"
                        value="renovacion"
                        checked={iptvOption === "renovacion"}
                        onChange={(e) => setIptvOption(e.target.value)}
                        className="text-blue-500 focus:ring-blue-400 bg-gray-800 border-gray-600"
                      />
                      <span className="text-white">🔄 Renovación</span>
                    </label>
                  </div>

                  {errors.iptvOption && (
                    <p className="text-xs text-red-500 mt-1">{errors.iptvOption}</p>
                  )}

                  {iptvOption && (
                    <div className="mt-3 p-3 bg-gray-800/50 rounded-lg border border-blue-500/30">
                      <p className="text-blue-400 text-sm flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6L9 17l-5-5"/>
                        </svg>
                        {iptvOption === 'cuenta-nueva' 
                          ? 'Te crearemos una cuenta nueva de IPTV' 
                          : 'Renovaremos tu cuenta existente de IPTV'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Sección Fortnite Crew */}
            {cart.some(item => item.nombre.toLowerCase().includes('crew')) && (
              <div className="space-y-4 p-4 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-700/50 shadow-lg">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
                    <path d="M4 6v12c0 1.1.9 2 2 2h14v-4" />
                    <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z" />
                  </svg>
                  Configuración de Fortnite Crew
                </h3>
                
                <div className="space-y-3">
                  <label className="block text-sm text-gray-300 font-semibold">
                    Selecciona una opción:
                  </label>
                  
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="xboxOption"
                        value="cuenta-existente"
                        checked={xboxOption === "cuenta-existente"}
                        onChange={(e) => setXboxOption(e.target.value)}
                        className="text-green-500 focus:ring-green-400 bg-gray-800 border-gray-600"
                      />
                      <span>Tengo una cuenta de Xbox conectada a mi cuenta de Epic</span>
                    </label>
                    
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="xboxOption"
                        value="sin-cuenta"
                        checked={xboxOption === "sin-cuenta"}
                        onChange={(e) => setXboxOption(e.target.value)}
                        className="text-green-500 focus:ring-green-400 bg-gray-800 border-gray-600"
                      />
                      <span className="text-white">No tengo una cuenta de Xbox conectada</span>
                    </label>
                  </div>

                  {errors.xboxOption && (
                    <p className="text-xs text-red-500 mt-1">{errors.xboxOption}</p>
                  )}

                  {xboxOption === "cuenta-existente" && (
                    <div className="space-y-3 mt-3">
                      <div>
                        <label className="block text-sm text-gray-300 font-semibold">
                          Correo de Xbox
                        </label>
                        <input
                          type="email"
                          value={xboxEmail}
                          onChange={(e) => setXboxEmail(e.target.value)}
                          placeholder="correo@xbox.com"
                          className="mt-1 w-full rounded-lg bg-gray-800 border border-gray-600 p-2 text-white placeholder-gray-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-300 font-semibold">
                          Contraseña de Xbox
                        </label>
                        <input
                          type="password"
                          value={xboxPassword}
                          onChange={(e) => setXboxPassword(e.target.value)}
                          placeholder="••••••••"
                          className="mt-1 w-full rounded-lg bg-gray-800 border border-gray-600 p-2 text-white placeholder-gray-400"
                        />
                      </div>
                      {errors.xboxCredentials && (
                        <p className="text-xs text-red-500">{errors.xboxCredentials}</p>
                      )}
                    </div>
                  )}

                  {xboxOption === "sin-cuenta" && (
                    <div className="mt-3 p-3 bg-gray-800/50 rounded-lg border border-green-500/30">
                      <p className="text-green-400 text-sm flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6L9 17l-5-5"/>
                        </svg>
                        Nosotros te proporcionaremos una cuenta de Xbox
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Sección Recargas de V-Bucks */}
            {cart.some(item => {
              const nombre = item.nombre.toLowerCase();
              return nombre.includes('v-bucks') || nombre.includes('vbucks') || nombre.includes('pavos');
            }) && (
              <div className="space-y-4 p-4 bg-gradient-to-br from-purple-800/50 to-blue-900/50 rounded-xl border border-purple-700/50 shadow-lg">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/>
                    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/>
                    <path d="M18 12a2 2 0 0 0 0 4h4v-4z"/>
                  </svg>
                  ¿Cómo deseas recibir tus V-Bucks?
                </h3>
                
                <p className="text-sm text-gray-300">
                  Selecciona el método de entrega que prefieras
                </p>

                <div className="space-y-3">
                  {/* Opción 1: Link to Epic profile */}
                  <div className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    vbucksDeliveryMethod === 'epic-link' 
                      ? 'border-purple-500 bg-purple-500/10' 
                      : 'border-gray-600 bg-gray-800/30 hover:border-purple-400'
                  }`}
                  onClick={() => setVbucksDeliveryMethod('epic-link')}>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="vbucksDeliveryMethod"
                        value="epic-link"
                        checked={vbucksDeliveryMethod === 'epic-link'}
                        onChange={(e) => setVbucksDeliveryMethod(e.target.value)}
                        className="mt-1 text-purple-500 focus:ring-purple-400 bg-gray-800 border-gray-600"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">Vincular a mi perfil de Epic</span>
                          <span className="text-xs bg-purple-500 text-white px-2 py-0.5 rounded-full uppercase font-bold">Recomendado</span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">
                          Conectamos nuestra Xbox a tu cuenta de Epic y recargamos los V-Bucks directamente.
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Opción 2: Xbox account */}
                  <div className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    vbucksDeliveryMethod === 'xbox-account' 
                      ? 'border-blue-500 bg-blue-500/10' 
                      : 'border-gray-600 bg-gray-800/30 hover:border-blue-400'
                  }`}
                  onClick={() => setVbucksDeliveryMethod('xbox-account')}>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="vbucksDeliveryMethod"
                        value="xbox-account"
                        checked={vbucksDeliveryMethod === 'xbox-account'}
                        onChange={(e) => setVbucksDeliveryMethod(e.target.value)}
                        className="mt-1 text-blue-500 focus:ring-blue-400 bg-gray-800 border-gray-600"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">Usar mi cuenta de Xbox</span>
                          <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full uppercase font-bold">Directo</span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">
                          Cargamos los V-Bucks directamente en tu cuenta de Xbox vinculada.
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Opción 3: Preloaded account */}
                  <div className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    vbucksDeliveryMethod === 'preloaded-account' 
                      ? 'border-cyan-500 bg-cyan-500/10' 
                      : 'border-gray-600 bg-gray-800/30 hover:border-cyan-400'
                  }`}
                  onClick={() => setVbucksDeliveryMethod('preloaded-account')}>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="vbucksDeliveryMethod"
                        value="preloaded-account"
                        checked={vbucksDeliveryMethod === 'preloaded-account'}
                        onChange={(e) => setVbucksDeliveryMethod(e.target.value)}
                        className="mt-1 text-cyan-500 focus:ring-cyan-400 bg-gray-800 border-gray-600"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">Enviarme una cuenta precargada</span>
                          <span className="text-xs bg-cyan-500 text-white px-2 py-0.5 rounded-full uppercase font-bold">Más Rápido</span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">
                          Recibes un login de Fortnite nuevo ya cargado con tus V-Bucks.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {errors.vbucksDeliveryMethod && (
                  <p className="text-xs text-red-500 mt-2">{errors.vbucksDeliveryMethod}</p>
                )}

                {/* Campos para Epic Link */}
                {vbucksDeliveryMethod === 'epic-link' && (
                  <div className="space-y-3 mt-4 p-4 bg-gray-800/50 rounded-lg border border-purple-500/30">
                    <p className="text-purple-400 text-sm font-semibold flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="16" x2="12" y2="12"/>
                        <line x1="12" y1="8" x2="12.01" y2="8"/>
                      </svg>
                      Proporciona tus credenciales de Epic Games
                    </p>
                    <div>
                      <label className="block text-sm text-gray-300 font-semibold mb-1">
                        Correo de Epic Games
                      </label>
                      <input
                        type="email"
                        value={vbucksEpicEmail}
                        onChange={(e) => setVbucksEpicEmail(e.target.value)}
                        placeholder="player@example.com"
                        className={`w-full rounded-lg bg-gray-900 border-2 p-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                          errors.vbucksEpicEmail ? 'border-red-400' : 'border-gray-600'
                        }`}
                      />
                      {errors.vbucksEpicEmail && (
                        <p className="text-xs text-red-400 mt-1">{errors.vbucksEpicEmail}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 font-semibold mb-1">
                        Contraseña de Epic Games
                      </label>
                      <input
                        type="password"
                        value={vbucksEpicPassword}
                        onChange={(e) => setVbucksEpicPassword(e.target.value)}
                        placeholder="Enter password"
                        className={`w-full rounded-lg bg-gray-900 border-2 p-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                          errors.vbucksEpicPassword ? 'border-red-400' : 'border-gray-600'
                        }`}
                      />
                      {errors.vbucksEpicPassword && (
                        <p className="text-xs text-red-400 mt-1">{errors.vbucksEpicPassword}</p>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 flex items-start gap-2">
                      <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                      </svg>
                      Tip: Ten tu teléfono cerca por si Epic solicita verificación. Entrega completada en 24 horas.
                    </p>
                    
                    <div className="mt-3 p-3 bg-purple-900/30 border border-purple-500/30 rounded-lg">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={vbucks2FAConfirmed}
                          onChange={(e) => setVbucks2FAConfirmed(e.target.checked)}
                          className="mt-0.5 rounded border-gray-600 bg-gray-900 text-purple-500 focus:ring-purple-400 focus:ring-offset-gray-800"
                        />
                        <span className="text-xs text-purple-200">
                          Confirmo que la autenticación de dos factores está deshabilitada mientras el equipo entrega los V-Bucks. Puedo volver a habilitarla después.
                        </span>
                      </label>
                      {errors.vbucks2FAConfirmed && (
                        <p className="text-xs text-red-400 mt-2">{errors.vbucks2FAConfirmed}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Campos para Xbox Account */}
                {vbucksDeliveryMethod === 'xbox-account' && (
                  <div className="space-y-3 mt-4 p-4 bg-gray-800/50 rounded-lg border border-blue-500/30">
                    <p className="text-blue-400 text-sm font-semibold flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="16" x2="12" y2="12"/>
                        <line x1="12" y1="8" x2="12.01" y2="8"/>
                      </svg>
                      Ingresa tus datos de Xbox
                    </p>
                    <div>
                      <label className="block text-sm text-gray-300 font-semibold mb-1">
                        Correo de Xbox
                      </label>
                      <input
                        type="email"
                        value={vbucksXboxEmail}
                        onChange={(e) => setVbucksXboxEmail(e.target.value)}
                        placeholder="player@example.com"
                        className={`w-full rounded-lg bg-gray-900 border-2 p-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                          errors.vbucksXboxEmail ? 'border-red-400' : 'border-gray-600'
                        }`}
                      />
                      {errors.vbucksXboxEmail && (
                        <p className="text-xs text-red-400 mt-1">{errors.vbucksXboxEmail}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 font-semibold mb-1">
                        Contraseña de Xbox
                      </label>
                      <input
                        type="password"
                        value={vbucksXboxPassword}
                        onChange={(e) => setVbucksXboxPassword(e.target.value)}
                        placeholder="Enter password"
                        className={`w-full rounded-lg bg-gray-900 border-2 p-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                          errors.vbucksXboxPassword ? 'border-red-400' : 'border-gray-600'
                        }`}
                      />
                      {errors.vbucksXboxPassword && (
                        <p className="text-xs text-red-400 mt-1">{errors.vbucksXboxPassword}</p>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 flex items-start gap-2">
                      <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                      </svg>
                      Tip: Asegúrate de que tu cuenta de Xbox esté vinculada a Epic Games. Entrega completada en 24 horas.
                    </p>
                    
                    <div className="mt-3 p-3 bg-blue-900/30 border border-blue-500/30 rounded-lg">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={vbucks2FAConfirmed}
                          onChange={(e) => setVbucks2FAConfirmed(e.target.checked)}
                          className="mt-0.5 rounded border-gray-600 bg-gray-900 text-blue-500 focus:ring-blue-400 focus:ring-offset-gray-800"
                        />
                        <span className="text-xs text-blue-200">
                          Confirmo que la autenticación de dos factores está deshabilitada mientras el equipo entrega los V-Bucks. Puedo volver a habilitarla después.
                        </span>
                      </label>
                      {errors.vbucks2FAConfirmed && (
                        <p className="text-xs text-red-400 mt-2">{errors.vbucks2FAConfirmed}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Mensaje para Preloaded Account */}
                {vbucksDeliveryMethod === 'preloaded-account' && (
                  <div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-cyan-500/30">
                    <p className="text-cyan-400 text-sm flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                      Te enviaremos una cuenta de Fortnite nueva con tus V-Bucks ya cargados, lista para usar inmediatamente.
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      📧 Recibirás el login por correo electrónico con una guía de inicio rápido.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Método de pago */}
            <div>
              <label className="block text-sm text-gray-300 font-semibold mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                </svg>
                Método de pago
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className={`w-full rounded-xl bg-gray-900/80 border-2 p-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all ${
                  errors.paymentMethod ? "border-red-400 focus:ring-red-400" : "border-gray-600"
                }`}
              >
                <option value="" className="bg-gray-800">Selecciona un método</option>
                <option value="MercadoPago" className="bg-gray-800">💳 Mercado Pago (Tarjeta, Webpay, etc)</option>
                <option value="PayPal" className="bg-gray-800">🅿️ PayPal (Internacional)</option>
                <option value="Cripto" className="bg-gray-800">₿ Criptomonedas (Bitcoin, USDT, etc)</option>
                
              </select>
              {errors.paymentMethod && (
                <p className="text-xs mt-1 text-red-400 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                  {errors.paymentMethod}
                </p>
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

            <label className="flex items-start gap-3 text-sm text-gray-300 font-medium">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1 rounded border-gray-600 bg-gray-900 text-cyan-500 focus:ring-cyan-400 focus:ring-offset-gray-800"
              />
              <span>
                Acepto los{" "}
                <Link
                  to="/terminos"
                  className="underline hover:no-underline text-cyan-400 hover:text-cyan-300"
                >
                  términos y condiciones
                </Link>
                {cart.some(item => {
                  const nombre = item.nombre.toLowerCase();
                  return !nombre.includes('crunchyroll') && 
                         !nombre.includes('iptv') && 
                         !nombre.includes('chatgpt') && 
                         !nombre.includes('office') && 
                         !nombre.includes('windows') &&
                         !nombre.includes('streaming') &&
                         !nombre.includes('v-bucks') &&
                         !nombre.includes('vbucks') &&
                         !nombre.includes('pavos');
                }) && " y confirmo que mi usuario de Epic Games es correcto"}
                .
              </span>
            </label>
            
            {/* Solo mostrar mensaje de agregar amigos si hay productos de Fortnite (no V-Bucks) */}
            {cart.some(item => {
              const nombre = item.nombre.toLowerCase();
              return !nombre.includes('crunchyroll') && 
                     !nombre.includes('iptv') && 
                     !nombre.includes('chatgpt') && 
                     !nombre.includes('office') && 
                     !nombre.includes('windows') &&
                     !nombre.includes('streaming') &&
                     !nombre.includes('v-bucks') &&
                     !nombre.includes('vbucks') &&
                     !nombre.includes('pavos');
            }) && (
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-sm text-yellow-400 leading-relaxed">
                    Antes de finalizar, asegúrate de tener agregado como amigo a <span className="font-bold">Reydelosvbucks</span> y <span className="font-bold">pavostioflash2</span> en Fortnite por mínimo 48 horas.
                  </span>
                </div>
              </div>
            )}
            
            {errors.terms && (
              <p className="text-xs mt-1 text-red-500">{errors.terms}</p>
            )}

            <button
              type="submit"
              disabled={
                !email.trim() || 
                !acceptTerms || 
                !rut.trim() || 
                !validateRut(rut) || 
                !telefono.trim() || 
                !paymentMethod ||
                // Solo requerir fortniteUsername si hay productos de Fortnite
                (cart.some(item => {
                  const nombre = item.nombre.toLowerCase();
                  return !nombre.includes('crunchyroll') && 
                         !nombre.includes('iptv') && 
                         !nombre.includes('chatgpt') && 
                         !nombre.includes('office') && 
                         !nombre.includes('windows') &&
                         !nombre.includes('streaming');
                }) && !fortniteUsername.trim())
              }
              className="group mt-6 w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 hover:from-blue-700 hover:via-cyan-600 hover:to-blue-700 text-white font-bold text-lg shadow-xl hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-xl flex items-center justify-center gap-3 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
              </svg>
              <span className="relative">Finalizar Pedido</span>
            </button>

            <div className="flex items-center justify-center gap-2 mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-xl">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span className="text-sm text-green-400 font-semibold">Pago 100% seguro protegido por Mercado Pago</span>
            </div>
          </form>

          {/* Ayuda WhatsApp */}
          <div className="mt-6 flex items-center gap-3 bg-green-500/10 border border-green-500/30 rounded-xl p-4 backdrop-blur-sm hover:bg-green-500/20 transition-all">
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
            <span className="text-green-400 font-semibold text-sm">
              ¿Dudas?{" "}
              <a
                href="https://wa.me/56930917730"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-green-300 transition-colors"
              >
                Habla con soporte
              </a>
            </span>
          </div>
        </div>

        {/* Resumen del pedido SOLO en escritorio */}
        <div className="hidden lg:block w-full lg:w-1/3 bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl p-6 flex flex-col gap-4 border border-gray-700/50 h-fit self-start order-2 lg:order-2 sticky top-28">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
            </svg>
            <h2 className="text-xl font-bold text-white">
              Resumen del Pedido
            </h2>
          </div>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {cart.length === 0 ? (
              <p className="text-gray-400 text-center py-8">
                No hay productos en el carrito.
              </p>
            ) : (
              cart.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 border-b border-gray-700/50 pb-3 last:border-b-0 hover:bg-gray-700/20 p-2 rounded-lg transition-all"
                >
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
                    <img
                      src={item.imagen}
                      alt={item.nombre}
                      className="object-contain max-h-12 max-w-12"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white truncate text-sm">
                      {item.nombre}
                    </p>
                    <p className="text-xs text-gray-400">
                      Cantidad: {item.cantidad || 1}
                    </p>
                  </div>
                  <span className="font-bold text-cyan-400 text-sm">
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
          <div className="mt-4 space-y-3">
            <div className="flex justify-between text-gray-300 font-semibold">
              <span>Subtotal</span>
              <span>{CLP.format(getSubtotal())}</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-white border-t border-gray-700/50 pt-4">
              <span>Total</span>
              <span className="text-cyan-400">{CLP.format(getTotal())}</span>
            </div>
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
