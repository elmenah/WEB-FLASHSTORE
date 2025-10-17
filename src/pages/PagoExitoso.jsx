import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const PagoExitoso = () => {
  const location = useLocation();
  const [wspMessage, setWspMessage] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const mensaje = urlParams.get("wsp");
    if (mensaje) setWspMessage(decodeURIComponent(mensaje));
  }, [location]);

  const abrirWhatsApp = () => {
    if (!wspMessage) return;
    const numero = "56930917730"; // tu número de WhatsApp
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(wspMessage)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-200 to-cyan-200 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center max-w-md w-full">
        <svg width="64" height="64" fill="none" viewBox="0 0 24 24" className="mb-4">
          <circle cx="12" cy="12" r="10" fill="#22c55e" />
          <path stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M8 12l2 2 4-4" />
        </svg>
        <h1 className="text-3xl font-bold text-green-700 mb-2 text-center">¡Pago realizado con éxito!</h1>
        <p className="text-gray-700 text-center mb-4">
          Tu pago fue procesado correctamente.<br />
          Pronto recibirás tus productos en tu cuenta de Fortnite.
        </p>

        {wspMessage && (
          <button
            onClick={abrirWhatsApp}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold shadow mb-6 transition"
          >
            💬 Enviar confirmación por WhatsApp
          </button>
        )}

        <Link to="/" className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold shadow transition">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default PagoExitoso;
