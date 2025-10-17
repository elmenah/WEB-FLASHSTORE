import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const PagoExitoso = () => {
  const location = useLocation();
  
  useEffect(() => {
    // ✅ Verificar si hay parámetros de WhatsApp en la URL
    const urlParams = new URLSearchParams(location.search);
    const wspMessage = urlParams.get('wsp');
    
    if (wspMessage) {
      // ✅ Abrir WhatsApp automáticamente con el mensaje
      setTimeout(() => {
        const wspUrl = `https://wa.me/56930917730?text=${wspMessage}`;
        window.open(wspUrl, '_blank');
      }, 2000); // Esperar 2 segundos para que el usuario vea la página
    }
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-200 to-cyan-200 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center max-w-md w-full">
        <svg width="64" height="64" fill="none" viewBox="0 0 24 24" className="mb-4">
          <circle cx="12" cy="12" r="10" fill="#22c55e" />
          <path stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M8 12l2 2 4-4" />
        </svg>
        <h1 className="text-3xl font-bold text-green-700 mb-2 text-center">¡Pago realizado con éxito!</h1>
        <p className="text-gray-700 text-center mb-4">Tu pago fue procesado correctamente.<br />Pronto recibirás tus productos en tu cuenta de Fortnite.</p>
        
        {/* ✅ Mostrar información sobre WhatsApp */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6 w-full">
          <div className="flex items-center gap-2 text-green-700">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.031-.967-.273-.099-.472-.148-.67.15-.198.297-.767.967-.94 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.151-.174.2-.298.3-.497.099-.198.05-.372-.025-.52-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.099 3.2 5.077 4.363.71.306 1.263.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.288.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 5.421h-.001a8.933 8.933 0 0 1-4.548-1.252l-.326-.194-3.377.892.902-3.292-.213-.337a8.922 8.922 0 0 1-1.37-4.788c.001-4.936 4.011-8.946 8.949-8.946 2.389 0 4.637.93 6.324 2.617a8.862 8.862 0 0 1 2.624 6.323c-.003 4.936-4.013 8.946-8.949 8.946m7.437-16.384A10.92 10.92 0 0 0 12.05 1.933C6.477 1.933 1.93 6.479 1.928 12.05c0 2.123.555 4.199 1.607 6.032l-1.7 6.191a1.003 1.003 0 0 0 1.223 1.223l6.193-1.7a10.888 10.888 0 0 0 4.799 1.146h.005c5.572 0 10.119-4.547 10.121-10.118a10.86 10.86 0 0 0-3.184-7.924"/>
            </svg>
            <span className="text-sm font-medium">
              📱 Se abrirá WhatsApp automáticamente con el resumen de tu pedido
            </span>
          </div>
        </div>
        
        <Link to="/" className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold shadow transition">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default PagoExitoso;
