import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

const Streaming = () => {
  const { addToCart } = useCart();
  const [notification, setNotification] = useState(false);

  // Productos de Crunchyroll
  const crunchyrollFan = [
    { 
      id: 'cr-fan-1', 
      title: "Crunchyroll Fan - 1 Mes", 
      desc: "Anime sin límites con calidad HD", 
      price: 2500, 
      image: "/Imagenes/IPTV/Crunchyroll_Logo.png",
      categoria: "Crunchyroll Fan"
    },
    { 
      id: 'cr-fan-12', 
      title: "Crunchyroll Fan - 12 Meses", 
      desc: "Un año completo de anime HD", 
      price: 23000, 
      image: "/Imagenes/IPTV/Crunchyroll_Logo.png",
      categoria: "Crunchyroll Fan"
    }
  ];

  const crunchyrollMegaFan = [
    { 
      id: 'cr-mega-1', 
      title: "Crunchyroll Mega Fan - 1 Mes", 
      desc: "Experiencia premium sin anuncios", 
      price: 3500, 
      image: "/Imagenes/IPTV/Crunchyroll_Logo.png",
      categoria: "Crunchyroll Mega Fan"
    },
    { 
      id: 'cr-mega-12', 
      title: "Crunchyroll Mega Fan - 12 Meses", 
      desc: "Acceso premium anual completo", 
      price: 27000, 
      image: "/Imagenes/IPTV/Crunchyroll_Logo.png",
      categoria: "Crunchyroll Mega Fan"
    }
  ];

  // Producto IPTV
  const iptvProducts = [
    { 
      id: 'iptv-1', 
      title: "IPTV Premium - 1 Mes", 
      desc: "3 Pantallas FULL", 
      price: 5000, 
      image: "/Imagenes/IPTV/643x0w.jpg",
      categoria: "IPTV",
      promo: false
    },
    { 
      id: 'iptv-3', 
      title: "IPTV Premium - 3 Meses", 
      desc: "3 Pantallas FULL", 
      price: 12000, 
      image: "/Imagenes/IPTV/643x0w.jpg",
      categoria: "IPTV",
      promo: true
    },
    { 
      id: 'iptv-4', 
      title: "IPTV Premium - 4 Meses", 
      desc: "3 Pantallas FULL", 
      price: 15000, 
      image: "/Imagenes/IPTV/643x0w.jpg",
      categoria: "IPTV",
      promo: true
    },
    { 
      id: 'iptv-6', 
      title: "IPTV Premium - 6 Meses", 
      desc: "3 Pantallas FULL", 
      price: 22000, 
      image: "/Imagenes/IPTV/643x0w.jpg",
      categoria: "IPTV",
      promo: true
    },
    { 
      id: 'iptv-12', 
      title: "IPTV Premium - 12 Meses", 
      desc: "3 Pantallas FULL", 
      price: 43000, 
      image: "/Imagenes/IPTV/643x0w.jpg",
      categoria: "IPTV",
      promo: true
    }
  ];

  const handleAddToCart = (item) => {
    const cartItem = {
      nombre: item.title,
      precio: item.price,
      imagen: item.image,
      descripcion: item.desc,
    };
    addToCart(cartItem);
    showNotification();
  };

  const showNotification = () => {
    setNotification(true);
    setTimeout(() => setNotification(false), 2000);
  };

  return (
    <div className="pt-14">
      {/* Notificación */}
      <div
        className={`fixed top-20 right-5 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg transition-opacity duration-500 z-50 ${
          notification ? 'opacity-100' : 'opacity-0 hidden'
        }`}
      >
        Producto agregado al carrito
      </div>

      {/* HERO */}
      <section
        className="relative pt-20 pb-16 px-6 text-left h-[500px] bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: "url('/Imagenes/IPTV/Group-81-768x618.png')",
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-70"></div>

        <div className="relative max-w-6xl mx-auto z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            PLATAFORMAS DE <span className="text-purple-400">STREAMING</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-6">
            Accede a las mejores plataformas de entretenimiento <br />
            a precios increíbles. <span className="font-bold text-green-400">100% garantizado</span>
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            <span className="px-4 py-2 bg-gray-800 bg-opacity-70 rounded-full text-sm">🎬 Anime Premium</span>
            <span className="px-4 py-2 bg-gray-800 bg-opacity-70 rounded-full text-sm">📺 TV en Vivo</span>
            <span className="px-4 py-2 bg-gray-800 bg-opacity-70 rounded-full text-sm">🎥 Películas & Series</span>
          </div>
        </div>
      </section>

      {/* CRUNCHYROLL FAN */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            <span className="text-orange-500">Crunchyroll</span> Fan
          </h2>
          <p className="text-gray-400">Disfruta del mejor anime en calidad HD</p>
          <div className="mt-3 flex flex-wrap gap-2 justify-start">
            <span className="px-3 py-1 bg-orange-600/20 text-orange-300 rounded-full text-sm">🆕 Cuenta nueva</span>
            <span className="px-3 py-1 bg-orange-600/20 text-orange-300 rounded-full text-sm">👤 O activación en tu cuenta</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {crunchyrollFan.map((item) => (
            <div key={item.id} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col hover:transform hover:scale-105 transition-all duration-300">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-40 object-cover"
              />
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <p className="text-gray-100 text-lg font-bold">
                    {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(item.price)}
                  </p>
                  <button 
                    onClick={() => handleAddToCart(item)} 
                    className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-full transition-all"
                  >
                    <i className="fas fa-shopping-cart"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CRUNCHYROLL MEGA FAN */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            <span className="text-orange-500">Crunchyroll</span> Mega Fan
          </h2>
          <p className="text-gray-400">Experiencia premium sin interrupciones</p>
          <div className="mt-3 flex flex-wrap gap-2 justify-start">
            <span className="px-3 py-1 bg-orange-600/20 text-orange-300 rounded-full text-sm">🆕 Cuenta nueva</span>
            <span className="px-3 py-1 bg-orange-600/20 text-orange-300 rounded-full text-sm">👤 O activación en tu cuenta</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {crunchyrollMegaFan.map((item) => (
            <div key={item.id} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col hover:transform hover:scale-105 transition-all duration-300 border-2 border-orange-500">
              <div className="bg-orange-500 text-white text-center py-1 text-sm font-bold">
                ⭐ PREMIUM
              </div>
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-40 object-cover"
              />
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <p className="text-gray-100 text-lg font-bold">
                    {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(item.price)}
                  </p>
                  <button 
                    onClick={() => handleAddToCart(item)} 
                    className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-full transition-all"
                  >
                    <i className="fas fa-shopping-cart"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      
      {/* IPTV */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold mb-2">
            <span className="text-blue-400">IPTV</span> Premium
          </h2>
          <p className="text-gray-400 mb-4">Miles de canales, películas y series en todos tus dispositivos</p>
          
          {/* Demo y compatibilidad */}
          <div className="flex flex-col items-center gap-4 mb-6">
            <div className="bg-green-600/20 border border-green-500/50 rounded-lg px-6 py-4 inline-block">
              <p className="text-green-400 font-semibold mb-3">🎁 Demo disponible por 3 horas - ¡Pruébalo gratis!</p>
              <a 
                href="https://wa.me/56930917730?text=Quiero%20una%20demo%20de%20iptv" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-full transition-all"
              >
                <i className="fab fa-whatsapp text-xl"></i>
                <span>Solicitar Demo</span>
              </a>
            </div>
            
            <div className="flex flex-wrap gap-3 justify-center">
              <span className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-xs">📱 Android</span>
              <span className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-xs">📺 Android TV</span>
              <span className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-xs">🖥️ Smart TV</span>
              <span className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-xs">💻 PC</span>
              <span className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-xs">📲 Tablet</span>
              <span className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-xs">🍎 iOS</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {iptvProducts.map((item) => (
            <div key={item.id} className="bg-gradient-to-br from-blue-900/40 to-blue-800/40 rounded-lg shadow-lg overflow-hidden flex flex-col hover:transform hover:scale-105 transition-all duration-300 border border-blue-500/30 relative">
              {item.promo && (
                <div className="absolute top-3 right-3 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full z-10">
                  🔥 PROMO
                </div>
              )}
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-40 object-cover"
              />
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm mb-3">{item.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-blue-600/30 text-blue-300 rounded text-xs">📺 TV</span>
                    <span className="px-2 py-1 bg-blue-600/30 text-blue-300 rounded text-xs">🎬 Películas</span>
                    <span className="px-2 py-1 bg-blue-600/30 text-blue-300 rounded text-xs">📺 Series</span>
                    <span className="px-2 py-1 bg-blue-600/30 text-blue-300 rounded text-xs">3 Pantallas</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <p className="text-gray-100 text-xl font-bold">
                    {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(item.price)}
                  </p>
                  <button 
                    onClick={() => handleAddToCart(item)} 
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full transition-all"
                  >
                    <i className="fas fa-shopping-cart"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Características generales */}
      <section className="py-12 px-6 max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-center mb-6">¿Por qué elegirnos?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">⚡</div>
              <h4 className="font-semibold mb-2">Entrega Inmediata</h4>
              <p className="text-sm text-gray-400">Activación rápida en minutos</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🔒</div>
              <h4 className="font-semibold mb-2">100% Seguro</h4>
              <p className="text-sm text-gray-400">Cuentas oficiales garantizadas</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">💬</div>
              <h4 className="font-semibold mb-2">Soporte 24/7</h4>
              <p className="text-sm text-gray-400">Asistencia cuando la necesites</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Streaming;
