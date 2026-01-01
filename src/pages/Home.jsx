import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Particles } from "@/components/magicui/particles";
import useScrollToTop from "../hooks/useScrollToTop";
import { useCart } from "../context/CartContext";
import FortnitePesadillas from "../components/FortnitePesadillas";
import Testimonios from "../components/Testimonios";

const Home = () => {
  useScrollToTop();
  const { addToCart } = useCart();
  const [notification, setNotification] = useState(false);

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
        <Particles
          className="absolute inset-0 z-10 pointer-events-none"
          quantity={250}
          staticity={10}
          ease={50}
          size={1.5}
          color="#ffffff"
        />
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
