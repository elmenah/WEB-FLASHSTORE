import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Marquee from "react-fast-marquee";
import useScrollToTop from "../hooks/useScrollToTop";
import { useCart } from "../context/CartContext";
import FortnitePesadillas from "../components/FortnitePesadillas";
import Testimonios from "../components/Testimonios";

const Home = () => {
  useScrollToTop();
  const { addToCart } = useCart();
  const [notification, setNotification] = useState(false);

  // Cargar script de Instagram
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.instagram.com/embed.js';
    script.async = true;
    document.body.appendChild(script);

    // Procesar embeds cuando el script cargue
    const timer = setTimeout(() => {
      if (window.instgrm) {
        window.instgrm.Embeds.process();
      }
    }, 1000);

    return () => {
      clearTimeout(timer);
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Beneficios rápidos
  const beneficios = [
    { icon: "💸", text: "Precios bajos garantizados" },
    { icon: "⚡", text: "Entrega rápida" },
    { icon: "🔒", text: "Compra 100% segura" },
    { icon: "📱", text: "Soporte personalizado" },
    { icon: "⭐", text: "Clientes felices" },
  ];

  const showNotification = () => {
    setNotification(true);
    setTimeout(() => setNotification(false), 2000);
  };

  return (
    <>
      {/* 🔔 Notificación */}
      <div
        className={`fixed top-20 right-5 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg transition-opacity duration-500 z-50 ${
          notification ? "opacity-100" : "opacity-0 hidden"
        }`}
      >
        Producto agregado al carrito
      </div>

      {/* 🎯 HERO */}
      <div className="relative flex items-center justify-center h-[70vh] sm:h-screen bg-gray-900 text-white overflow-hidden animate-fade-in">
        <img
          src="/Imagenes/cap7.png"
          className="w-full h-full object-cover z-0"
          alt="Hero"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent z-10"></div>

        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20 w-11/12 sm:w-auto pl-4 sm:pl-10 pr-4 text-left animate-fade-in">
          <h1 className="text-2xl xs:text-3xl md:text-5xl font-bold mb-3 sm:mb-4 italic drop-shadow-xl leading-tight">
            Bienvenido a{" "}
            <span className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
              Tio Flashstore
            </span>
          </h1>
          <p className="text-base xs:text-lg md:text-2xl mb-4 sm:mb-6 text-white/80 font-semibold">
            Tu tienda confiable de skins, lotes y pases de Fortnite
          </p>
          <Link
            to="/shop"
            className="bg-white text-gray-900 px-4 py-2 sm:px-6 sm:py-3 rounded-lg text-base sm:text-lg font-semibold shadow-lg hover:bg-gray-100 transition-colors animate-bounce"
          >
            Ver la tienda de hoy
          </Link>
        </div>
      </div>

      {/* 💎 Beneficios rápidos */}
      <section className="py-6 sm:py-10 bg-gray-900">
        <div className="max-w-8xl mx-auto flex flex-wrap justify-center gap-4 sm:gap-6 px-2">
          {beneficios.map((b, i) => (
            <div
              key={i}
              className="flex flex-col items-center rounded-xl px-4 py-3 sm:px-6 sm:py-4 animate-fade-in min-w-[120px]"
            >
              <span className="text-2xl sm:text-3xl mb-1 sm:mb-2">{b.icon}</span>
              <span className="text-white font-semibold text-xs sm:text-base text-center">
                {b.text}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 💬 Testimonios */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-3 text-white italic">
              Lo que dicen nuestros clientes
            </h2>
            <p className="text-gray-400 text-lg">
              Testimonios reales de nuestra comunidad de gamers satisfechos
            </p>
          </div>

          {/* Marquee de testimonios */}
          <div className="relative w-full">
            {/* Primera fila - de izquierda a derecha */}
            <Marquee speed={40} pauseOnHover gradient={false} className="mb-6">
              {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                <div
                  key={num}
                  className="relative w-[500px] h-[180px] bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-xl border border-gray-700 mx-3"
                >
                  <img
                    src={`/Imagenes/testimonios/Testimonio${num}.png`}
                    alt={`Testimonio ${num}`}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.src = `https://via.placeholder.com/500x180/1a1a1a/ffffff?text=Testimonio+${num}`;
                    }}
                  />
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Instagram
                  </div>
                </div>
              ))}
            </Marquee>

            {/* Segunda fila - de derecha a izquierda */}
            <Marquee speed={40} direction="right" pauseOnHover gradient={false}>
              {[7, 6, 5, 4, 3, 2, 1].map((num) => (
                <div
                  key={num}
                  className="relative w-[500px] h-[180px] bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-xl border border-gray-700 mx-3"
                >
                  <img
                    src={`/Imagenes/testimonios/Testimonio${num}.png`}
                    alt={`Testimonio ${num}`}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.src = `https://via.placeholder.com/500x180/1a1a1a/ffffff?text=Testimonio+${num}`;
                    }}
                  />
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Instagram
                  </div>
                </div>
              ))}
            </Marquee>
          </div>

          {/* CTA Instagram */}
          <div className="mt-12 text-center">
            <a 
              href="https://www.instagram.com/tioflashstore" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-2xl hover:transform hover:scale-105 transition-all duration-300"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Síguenos en Instagram @tioflashstore
            </a>
          </div>

          {/* Post de Instagram Embebido */}
          <div className="mt-16 flex justify-center">
            <blockquote 
              className="instagram-media" 
              data-instgrm-captioned
              data-instgrm-permalink="https://www.instagram.com/p/C1sBS_yxpwI/?utm_source=ig_embed&utm_campaign=loading" 
              data-instgrm-version="14"
              style={{
                background: '#FFF',
                border: 0,
                borderRadius: '3px',
                boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)',
                margin: '1px auto',
                maxWidth: '540px',
                minWidth: '326px',
                padding: 0,
                width: '99.375%'
              }}
            />
          </div>
        </div>
      </section>

      
        {/* Hero, Fortnite Pesadillas, etc */}
      {/* <Testimonios /> */}
      {/* Secciones siguientes */}
      {/* ❓ Cómo funciona */}
      <div className="container mx-auto p-4 text-white">
        <h2 className="text-4xl font-bold text-center mb-8 italic">
          ¿Cómo Funciona?
        </h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          <div className="w-full md:w-1/3 flex justify-center">
            <img
              src="/Imagenes/homero.png"
              alt="Homero explicando cómo funciona"
              className="w-64 h-auto object-contain"
            />
          </div>

          <div className="w-full md:w-2/3 space-y-6">
            <div>
              <h3 className="text-xl font-semibold">PASO 1</h3>
              <p className="text-gray-400">
                Asegúrate de haber agregado nuestras cuentas 48 hrs antes de
                realizar una compra. <br />
                Usuario:{" "}
                <span className="font-bold text-white">1. Reydelosvbucks </span> 
                <span className="font-bold text-white">2. pavostioflash2</span>
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold">PASO 2</h3>
              <p className="text-gray-400">
                Elige la skin que quieras de la rotación diaria de la tienda.{" "}
                <br />
                Agrega al carrito y termina el proceso de compra.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold">PASO 3</h3>
              <p className="text-gray-400">
                Recibe las skins y/o lotes que hayas elegido directamente en tu
                cuenta enviadas por nuestro equipo.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 💳 Métodos de pago */}
      <section className="py-12 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-2 text-white">
            PAGOS SEGUROS PROCESADOS POR
          </h2>

          <div className="flex flex-wrap justify-center items-center gap-8 opacity-80 hover:opacity-100 transition-opacity">
            {[
              "/Imagenes/Mercado_Pago.svg.png",
              "/Imagenes/Visa_Logo.png",
              "/Imagenes/MasterCard_early_1990s_logo.png",
              "/Imagenes/logo-web-pay-plus.png",
            ].map((img, i) => (
              <div
                key={i}
                className="bg-white rounded-lg p-4 shadow-lg hover:scale-105 transition-transform"
              >
                <img
                  src={img}
                  alt="Medio de pago"
                  className="h-10 w-auto object-contain"
                />
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <div className="inline-flex items-center gap-2 bg-green-600/20 text-green-400 px-4 py-2 rounded-full">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-semibold">
                Transacciones 100% seguras y cifradas
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ❓ FAQ */}
      <div className="container mx-auto p-4 text-white">
        <h2 className="text-4xl font-bold text-center mb-8 italic">
          Preguntas Frecuentes
        </h2>
        <div className="space-y-6">
          {[
            {
              q: "¿Cómo recibo los productos que compro?",
              a: "Los productos adquiridos serán entregados directamente en tu cuenta de Fortnite mediante el nombre de usuario que proporciones al momento de la compra.",
            },
            {
              q: "¿Cuánto tiempo tarda la entrega?",
              a: "La entrega se realiza en un plazo máximo de 24 horas después de confirmar tu compra. En la mayoría de los casos, la entrega es inmediata.",
            },
            {
              q: "¿Por qué es tan barato?",
              a: "Aprovechamos precios regionales favorables en tiendas de otros países, siempre pagando el precio completo establecido por Epic Games. No utilizamos exploits ni métodos fraudulentos.",
            },
            {
              q: "¿Esto es seguro?",
              a: "Llevamos años vendiendo servicios digitales, tenemos cientos de clientes en @tioflashstore y cumplimos todas las reglas de Epic Games, sin riesgos para tu cuenta.",
            },
            {
              q: "¿Cuáles son los métodos de pago?",
              a: "Ofrecemos métodos locales para Chile y también aceptamos pagos con criptomonedas como USDT.",
            },
          ].map((item, i) => (
            <div key={i}>
              <h3 className="text-xl font-semibold">{item.q}</h3>
              <p className="text-gray-400">{item.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ⚙️ Animación CSS */}
      <style>{`
        .animate-fade-in {
          animation: fadeIn 1.2s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: none; }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </>
  );
};

export default Home;
