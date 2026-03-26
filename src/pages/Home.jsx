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
  const [heroImages, setHeroImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar noticias de Fortnite para el hero dinámico
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("https://fortnite-api.com/v2/news/br?language=es");
        if (!res.ok) throw new Error("Error al obtener noticias");
        const data = await res.json();
        const motds = data?.data?.motds || [];
        if (motds.length > 0) {
          setHeroImages(motds.map((item) => ({
            image: item.image,
            title: item.title,
            body: item.body,
          })));
        }
      } catch (err) {
        console.error("Error al cargar noticias de Fortnite:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNews();
  }, []);

  // Auto-rotar el carrusel cada 6 segundos
  useEffect(() => {
    if (heroImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages]);

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

      {/* 🎯 HERO - Carrusel dinámico */}
      <div className="relative flex items-center justify-center h-[70vh] sm:h-screen bg-gray-900 text-white overflow-hidden animate-fade-in">
        {/* Imágenes del carrusel */}
        {heroImages.length > 0 ? (
          heroImages.map((item, index) => (
            <img
              key={index}
              src={item.image}
              className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-1000 ${
                index === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
              alt={item.title || "Fortnite News"}
            />
          ))
        ) : (
          <img
            src="/Imagenes/cap7.png"
            className="w-full h-full object-cover z-0"
            alt="Hero"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/30 to-transparent z-10"></div>

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

        {/* Indicadores del carrusel */}
        {heroImages.length > 1 && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === currentImageIndex
                    ? "bg-white w-6"
                    : "bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>
        )}
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

          {/* Post de Instagram + CTA */}
          <div className="flex flex-col lg:flex-row items-start justify-center gap-8 max-w-7xl mx-auto mb-16">
            {/* Post de Instagram a la izquierda - solo imagen */}
            <div className="w-full lg:w-1/2 flex justify-center">
              <blockquote 
                className="instagram-media" 
                data-instgrm-permalink="https://www.instagram.com/p/C1sBS_yxpwI/?utm_source=ig_embed&utm_campaign=loading" 
                data-instgrm-version="14"
                
                style={{
                  background: '#FFF',
                  border: 5,
                  borderRadius: '5px',
                  boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)',
                  margin: '1px auto',
                  maxWidth: '540px',
                  minWidth: '326px',
                  padding: 0,
                  width: '100%'
                }}
              />
            </div>

            {/* Texto, testimonios y botón a la derecha */}
            <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left px-4">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6">
                Tú también puedes dejar tu comentario
              </h3>
              
              {/* Marquee de testimonios - compacto */}
              <div className="relative w-full mb-6">
                {/* Primera fila - de izquierda a derecha */}
                <Marquee speed={30} pauseOnHover gradient={false} className="mb-3">
                  {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                    <div
                      key={num}
                      className="relative w-[280px] h-[115px] bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden shadow-xl border border-gray-700 mx-2"
                    >
                      <img
                        src={`/Imagenes/testimonios/Testimonio${num}.png`}
                        alt={`Testimonio ${num}`}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.src = `https://via.placeholder.com/280x115/1a1a1a/ffffff?text=Testimonio+${num}`;
                        }}
                      />
                      <div className="absolute top-2 right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        Instagram
                      </div>
                    </div>
                  ))}
                </Marquee>

                {/* Segunda fila - de derecha a izquierda */}
                <Marquee speed={30} direction="right" pauseOnHover gradient={false} className="mb-3">
                  {[ 7, 6, 5, 4, 3, 2, 1].map((num) => (
                    <div
                      key={num}
                      className="relative w-[280px] h-[115px] bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden shadow-xl border border-gray-700 mx-2"
                    >
                      <img
                        src={`/Imagenes/testimonios/Testimonio${num}.png`}
                        alt={`Testimonio ${num}`}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.src = `https://via.placeholder.com/280x115/1a1a1a/ffffff?text=Testimonio+${num}`;
                        }}
                      />
                      <div className="absolute top-2 right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        Instagram
                      </div>
                    </div>
                  ))}
                </Marquee>

                {/* Tercera fila - de izquierda a derecha */}
                <Marquee speed={30} pauseOnHover gradient={false}>
                  {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                    <div
                      key={num}
                      className="relative w-[280px] h-[115px] bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden shadow-xl border border-gray-700 mx-2"
                    >
                      <img
                        src={`/Imagenes/testimonios/Testimonio${num}.png`}
                        alt={`Testimonio ${num}`}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.src = `https://via.placeholder.com/280x115/1a1a1a/ffffff?text=Testimonio+${num}`;
                        }}
                      />
                      <div className="absolute top-2 right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        Instagram
                      </div>
                    </div>
                  ))}
                </Marquee>
              </div>

              <p className="text-gray-300 text-lg mb-6">
                Opinando sobre nuestro servicio
              </p>
              <a 
                href="https://www.instagram.com/tioflashstore" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-2xl hover:transform hover:scale-105 transition-all duration-300"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                Ir a Instagram
              </a>
            </div>
          </div>
        </div>
      </section>

      
        {/* Hero, Fortnite Pesadillas, etc */}
      {/* <Testimonios /> */}
      {/* Secciones siguientes */}
      {/* ❓ Cómo funciona - Diseño moderno */}
      <section className="py-16 bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <span className="bg-blue-600/20 text-blue-400 px-4 py-2 rounded-full text-sm font-semibold tracking-wider uppercase">
                Proceso de compra
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Compra skins de Fortnite con
              <br />
              <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                entrega garantizada 24/7
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Proceso seguro y rápido con especialistas dedicados a tu pedido
            </p>
          </div>

          {/* Content Grid */}
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left side - Steps */}
            <div className="space-y-6">
              {/* Paso 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    1
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Selecciona tu paquete</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Asegúrate de haber agregado nuestras cuentas 48 hrs antes de realizar una compra.
                    <br />
                    <span className="text-sm text-gray-500 mt-1 inline-block">
                      Usuario: <span className="text-white font-semibold">1. Reydelosvbucks</span> | <span className="text-white font-semibold">2. pavostioflash2</span>
                    </span>
                  </p>
                </div>
              </div>

              {/* Paso 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    2
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Completa tu compra</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Elige la skin que quieras de la rotación diaria de la tienda. Agrega al carrito y termina el proceso de compra de forma segura.
                  </p>
                </div>
              </div>

              {/* Paso 3 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-600 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    3
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Recibe tu pedido</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Recibe las skins y/o lotes que hayas elegido directamente en tu cuenta enviadas por nuestro equipo especializado.
                  </p>
                </div>
              </div>
            </div>

            {/* Right side - Highlights */}
            <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700 shadow-xl">
              <h3 className="text-2xl font-bold text-white mb-6">Por qué elegirnos</h3>
              
              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center mt-1">
                    <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-semibold">Monitoreo 24/7 con actualizaciones en tiempo real</p>
                    <p className="text-gray-400 text-sm">Seguimiento constante de tu pedido</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center mt-1">
                    <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-semibold">Todas las regiones soportadas</p>
                    <p className="text-gray-400 text-sm">Con instrucciones personalizadas de entrega</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-pink-500/20 flex items-center justify-center mt-1">
                    <svg className="w-4 h-4 text-pink-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-semibold">Checkout seguro en cada paso</p>
                    <p className="text-gray-400 text-sm">Y manejo de credenciales confiable</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center mt-1">
                    <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-semibold">Gerentes de éxito dedicados</p>
                    <p className="text-gray-400 text-sm">Para pedidos grandes y soporte personalizado</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-700">
                <div className="flex items-center justify-center gap-2 text-green-400">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span className="font-semibold">Proceso 100% seguro y confiable</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

          {/* 🎮 Juegos de Steam */}
          <section className="py-10 bg-gradient-to-b from-gray-900 to-gray-800">
            <div className="container mx-auto px-4 max-w-6xl">
              <div className="bg-gray-800/60 border border-gray-700 rounded-2xl overflow-hidden shadow-2xl">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="h-[280px] lg:h-full relative">
                    <img
                      src="/Imagenes/resident-evil-requiem.jpg"
                      alt="Resident Evil Requiem"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/Imagenes/og-s2-line-up-1920x1080-1114b1e89809.webp";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-black/35 to-black/85"></div>
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/80 to-transparent"></div>
                  </div>
    
                  <div className="p-6 sm:p-8">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white italic mb-2">
                      Juegos de Steam
                    </h2>
                    <p className="text-blue-400 font-semibold mb-4">
                      Instalacion remota, juegos locales (No online)
                    </p>
    
                    <div className="space-y-2 text-gray-200 mb-6">
                      <p className="font-semibold">Más de 100.000 juegos disponibles</p>
                      <p>1 juego: <span className="text-white font-bold text-xl">$6.000</span></p>
                      <p>3 juegos: <span className="text-white font-bold text-xl">$12.000</span></p>
                      <p>6 juegos: <span className="text-white font-bold text-xl">$18.000</span></p>
                      <p className="text-yellow-400 font-semibold pt-1">
                        Desde 3 juegos incluye 1 juego extra de regalo.
                      </p>
                    </div>
    
                    <Link
                      to="/juegos-pc"
                      className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-lg transition-colors"
                    >
                      Ver lista de juegos
                    </Link>
                  </div>
                </div>
              </div>
            </div><br />

        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">¿Buscando cuentas de streaming?</h2>
            <p className="text-gray-400 mt-2">
              También tenemos Crunchyroll, IPTV y activaciones de Windows con entrega rápida.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                name: "Crunchyroll",
                image: "/Imagenes/IPTV/Crunchyroll_Logo.png",
                desc: "Planes premium para disfrutar anime sin interrupciones.",
                href: "/streaming",
                cta: "Ir a Streaming",
              },
              {
                name: "IPTV",
                image: "/Imagenes/IPTV/Group-81-768x618.png",
                desc: "Acceso a canales y contenido en vivo para todos los gustos.",
                href: "/streaming",
                cta: "Ir a Streaming",
              },
              {
                name: "Activaciones de Windows",
                image: "/Imagenes/windows-11-professional.png",
                desc: "Licencias y activaciones para Windows de forma segura.",
                href: "/activaciones",
                cta: "Ir a Activaciones",
              },
            ].map((item) => (
              <div
                key={item.name}
                className="bg-gray-800/60 border border-gray-700 rounded-xl p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="mb-3 h-16 bg-white rounded-lg p-2 flex items-center justify-center overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-white">{item.name}</h3>
                  <p className="text-gray-400 mt-2">{item.desc}</p>
                </div>

                <Link
                  to={item.href}
                  className="mt-4 inline-flex items-center justify-center bg-white text-gray-900 font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {item.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
          </section>
      {/* 📺 Accesos rápidos */}
      

      

      {/* 💳 Métodos de pago - Diseño moderno */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-white">
            PAGOS SEGUROS PROCESADOS POR
          </h2>

          <div className="flex flex-wrap justify-center items-center gap-6 mb-8">
            {[
              "/Imagenes/Mercado_Pago.svg.png",
              "/Imagenes/Visa_Logo.png",
              "/Imagenes/MasterCard_early_1990s_logo.png",
              "/Imagenes/logo-web-pay-plus.png",
            ].map((img, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-300"
              >
                <img
                  src={img}
                  alt="Medio de pago"
                  className="h-12 w-auto object-contain"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <div className="inline-flex items-center gap-3 bg-green-600/20 text-green-400 px-6 py-3 rounded-full border border-green-600/30">
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

      {/* ❓ FAQ - Diseño moderno */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-white italic">
            Preguntas Frecuentes
          </h2>
          <p className="text-center text-gray-400 text-lg mb-12">
            Todo lo que necesitas saber sobre nuestro servicio
          </p>

          <div className="space-y-4">
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
              <div 
                key={i}
                className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-colors"
              >
                <h3 className="text-xl font-bold text-white mb-3">{item.q}</h3>
                <p className="text-gray-400 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

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
