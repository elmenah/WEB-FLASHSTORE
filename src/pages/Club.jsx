import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

const Club = () => {
  const { addToCart } = useCart();
  const [notification, setNotification] = useState(false);

 const clubItems = [
    { 
      id: 1, 
      title: "1 Mes Fortnite Crew", 
      desc: "Actívalo hoy mismo!", 
      price: 6000, 
      image: "https://cdn2.unrealengine.com/fortnite-september-2025-crew-pack-header-1920x1080-17d844e1d597.jpg?resize=1&w=1920" 
    },
    { 
      id: 2, 
      title: "2 Meses Fortnite Crew", 
      desc: "Obtén 2 Meses del club de Fortnite!", 
      price: 10000, 
      image: "https://cdn2.unrealengine.com/fortnite-september-2025-crew-pack-header-1920x1080-17d844e1d597.jpg?resize=1&w=1920" 
    },
    { 
      id: 3, 
      title: "3 Meses Fortnite Crew", 
      desc: "Obtén 3 Meses del club de Fortnite!", 
      price: 15000, 
      image: "https://cdn2.unrealengine.com/fortnite-september-2025-crew-pack-header-1920x1080-17d844e1d597.jpg?resize=1&w=1920" 
    },
    { 
      id: 4, 
      title: "6 Meses Fortnite Crew", 
      desc: "Obtén 6 Meses del club de Fortnite!", 
      price: 26000, 
      image: "https://cdn2.unrealengine.com/fortnite-september-2025-crew-pack-header-1920x1080-17d844e1d597.jpg?resize=1&w=1920" 
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
    setTimeout(() => setNotification(false), 2000); // Oculta la notificación después de 2 segundos
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
          backgroundImage: "url('https://cdn2.unrealengine.com/fortnite-september-2025-crew-pack-header-1920x1080-17d844e1d597.jpg?resize=1&w=1920')"
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-70"></div>

        <div className="relative max-w-6xl mx-auto z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            CLUB <span className="text-yellow-400">DE FORTNITE</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-6">
            Sé parte del club. <br /> Por solo <span className="font-bold text-green-400">$6.000 CLP</span> al mes,
            obtén acceso a todos los pases del juego, objetos exclusivos y 1.000 monedas V cada mes.
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            <span className="px-4 py-2 bg-gray-800 bg-opacity-70 rounded-full text-sm">🌟 A tu cuenta Personal</span>
            <span className="px-4 py-2 bg-gray-800 bg-opacity-70 rounded-full text-sm">💰 Renovable</span>
          </div>
        </div>
      </section>

      {/* BENEFICIOS - Carrusel animado */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Beneficios Incluidos</h2>

        <div className="relative overflow-x-hidden w-full">
          <div
            className="flex gap-6 animate-benefits-marquee"
            style={{
              width: 'max-content',
              animation: 'benefits-marquee 24s linear infinite',
            }}
          >
            {/* Duplicamos los beneficios para loop infinito visual */}
            {[
              {
                img: "/Imagenes/es-mx-15br-subs-followup-social-1920x1080-1920x1080-e7c9efe33d4f.jpg", title: "Paquete de Club", desc: "Contenido exclusivo mensual"
              },
              {
                img: "/Imagenes/pasebatalla.jpg", title: "Pase de Batalla", desc: "Acceso completo incluido"
              },
              {
                img: "/Imagenes/paseog.jpg", title: "Pase de Orígenes", desc: "Experiencias únicas"
              },
              {
                img: "/Imagenes/paselego.jpg", title: "Pase de LEGO", desc: "Construcción creativa"
              },
              {
                img: "/Imagenes/pasemusical.jpg", title: "Pase Musical", desc: "Ritmos y melodías"
              },
              {
                img: "/Imagenes/vbucks.jpg", title: "1000 Pavos", desc: "Cada mes automáticamente"
              },
            ].concat([
              {
                img: "/Imagenes/es-mx-15br-subs-followup-social-1920x1080-1920x1080-e7c9efe33d4f.jpg", title: "Paquete de Club", desc: "Contenido exclusivo mensual"
              },
              {
                img: "/Imagenes/pasebatalla.jpg", title: "Pase de Batalla", desc: "Acceso completo incluido"
              },
              {
                img: "/Imagenes/paseog.jpg", title: "Pase de Orígenes", desc: "Experiencias únicas"
              },
              {
                img: "/Imagenes/paselego.jpg", title: "Pase de LEGO", desc: "Construcción creativa"
              },
              {
                img: "/Imagenes/pasemusical.jpg", title: "Pase Musical", desc: "Ritmos y melodías"
              },
              {
                img: "/Imagenes/vbucks.jpg", title: "1000 Pavos", desc: "Cada mes automáticamente"
              },
            ]).map((benefit, index) => (
              <div key={index} className="rounded-xl overflow-hidden relative min-w-[220px] max-w-[220px] bg-gray-900 shadow-lg">
                <img src={benefit.img} alt={benefit.title} className="w-full h-40 object-cover" />
                <div className="relative bottom-0 p-3 text-white">
                  <h3 className="font-semibold">{benefit.title}</h3>
                  <p className="text-sm text-gray-300">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Animación CSS para el carrusel */}
        <style>{`
          @keyframes benefits-marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-benefits-marquee {
            will-change: transform;
          }
        `}</style>
      </section>
      {/* CLUB FORTNITE */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Planes del Club Fortnite</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {clubItems.map((item) => (
            <div key={item.id} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col">
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
                  <p className="text-gray-100 text-sm font-semibold">
                    {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(item.price)}
                  </p>
                  <button 
                    onClick={() => handleAddToCart(item)} 
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full transition-all"
                  >
                    <i className="fas fa-shopping-cart w-4 h-4"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Club;