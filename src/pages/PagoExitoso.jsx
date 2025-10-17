import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext"; // ✅ Importar el contexto del carrito

const PagoExitoso = () => {
  const location = useLocation();
  const [wspMessage, setWspMessage] = useState("");
  const [countdown, setCountdown] = useState(2); // ✅ Estado para el countdown
  const [whatsappOpened, setWhatsappOpened] = useState(false); // ✅ Estado para controlar si ya se abrió
  const { clearCart } = useCart(); // ✅ Obtener la función para limpiar carrito

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const mensaje = urlParams.get("wsp");
    
    // ✅ Si hay mensaje de WhatsApp, significa que el pago fue exitoso
    if (mensaje) {
      setWspMessage(decodeURIComponent(mensaje));
      // ✅ Limpiar el carrito cuando se confirma el pago exitoso
      console.log('Pago exitoso confirmado, limpiando carrito...');
      clearCart();
    }
  }, [location, clearCart]); // ✅ Agregar clearCart como dependencia

  // ✅ Timer para abrir WhatsApp automáticamente
  useEffect(() => {
    if (wspMessage && !whatsappOpened) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            // ✅ Abrir WhatsApp cuando llegue a 0
            abrirWhatsApp();
            setWhatsappOpened(true);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // ✅ Cleanup del timer
      return () => clearInterval(timer);
    }
  }, [wspMessage, whatsappOpened]);

  const abrirWhatsApp = () => {
    if (!wspMessage) return;
    const numero = "56930917730"; // tu número de WhatsApp
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(wspMessage)}`;
    window.open(url, "_blank");
  };

  const abrirWhatsAppManual = () => {
    setWhatsappOpened(true); // ✅ Marcar como abierto para detener el timer
    abrirWhatsApp();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-200 to-cyan-200 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center max-w-md w-full">
        <svg width="64" height="64" fill="none" viewBox="0 0 24 24" className="mb-4">
          <circle cx="12" cy="12" r="10" fill="#22c55e" />
          <path stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M8 12l2 2 4-4" />
        </svg>
        
        <h1 className="text-3xl font-bold text-green-700 mb-2 text-center">
          ¡Pago realizado con éxito!
        </h1>
        
        <p className="text-gray-700 text-center mb-4">
          Tu pago fue procesado correctamente.<br />
          Pronto recibirás tus productos en tu cuenta de Fortnite.
        </p>

        {/* ✅ Mostrar countdown y botón */}
        {wspMessage && !whatsappOpened && (
          <div className="text-center mb-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-center gap-2 text-blue-700 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.031-.967-.273-.099-.472-.148-.67.15-.198.297-.767.967-.94 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.151-.174.2-.298.3-.497.099-.198.05-.372-.025-.52-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.099 3.2 5.077 4.363.71.306 1.263.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.288.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 5.421h-.001a8.933 8.933 0 0 1-4.548-1.252l-.326-.194-3.377.892.902-3.292-.213-.337a8.922 8.922 0 0 1-1.37-4.788c.001-4.936 4.011-8.946 8.949-8.946 2.389 0 4.637.93 6.324 2.617a8.862 8.862 0 0 1 2.624 6.323c-.003 4.936-4.013 8.946-8.949 8.946m7.437-16.384A10.92 10.92 0 0 0 12.05 1.933C6.477 1.933 1.93 6.479 1.928 12.05c0 2.123.555 4.199 1.607 6.032l-1.7 6.191a1.003 1.003 0 0 0 1.223 1.223l6.193-1.7a10.888 10.888 0 0 0 4.799 1.146h.005c5.572 0 10.119-4.547 10.121-10.118a10.86 10.86 0 0 0-3.184-7.924"/>
                </svg>
                <span className="font-medium">
                  Abriendo WhatsApp en {countdown} segundo{countdown !== 1 ? 's' : ''}...
                </span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${((2 - countdown) / 2) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <button
              onClick={abrirWhatsAppManual}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold shadow mb-4 transition"
            >
              💬 Abrir WhatsApp ahora
            </button>
          </div>
        )}

        {/* ✅ Botón alternativo si ya se abrió WhatsApp */}
        {wspMessage && whatsappOpened && (
          <button
            onClick={abrirWhatsApp}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold shadow mb-6 transition"
          >
            💬 Abrir WhatsApp nuevamente
          </button>
        )}

        <Link to="/" className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold shadow transition">
          Volver al inicio
        </Link>
      </div>

      {/* ✅ Agregar estilos para la animación */}
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default PagoExitoso;
