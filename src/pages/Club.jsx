import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

const Club = () => {
  const { addToCart } = useCart();
  const [notification, setNotification] = useState(false);

  let imagen = "https://cms-assets.unrealengine.com/cm6l5gfpm05kr07my04cqgy2x/output=format:webp/cmjboacji036807oed9uroy5r";
 const clubItems = [
    { 
      id: 1, 
      title: "1 Mes Fortnite Crew", 
      desc: "Actívalo hoy mismo!", 
      price: 6000, 
      image: imagen,
      duration: "1 mes"
    },
    { 
      id: 2, 
      title: "2 Meses Fortnite Crew", 
      desc: "Obtén 2 Meses del club de Fortnite!", 
      price: 10000, 
      image: imagen,
      duration: "2 meses"
    },
    { 
      id: 3, 
      title: "3 Meses Fortnite Crew", 
      desc: "Obtén 3 Meses del club de Fortnite!", 
      price: 15000, 
      image: imagen,
      duration: "3 meses"
    },
    { 
      id: 4, 
      title: "6 Meses Fortnite Crew", 
      desc: "Obtén 6 Meses del club de Fortnite!", 
      price: 26000, 
      image: imagen,
      duration: "6 meses"
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
    <div className="pt-14 bg-[#0a0e1a] min-h-screen">
      {/* Notificación */}
      <div
        className={`fixed top-20 right-5 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg transition-opacity duration-500 z-50 ${
          notification ? 'opacity-100' : 'opacity-0 hidden'
        }`}
      >
        Producto agregado al carrito
      </div>

      {/* HERO MODERNO CON IMAGEN */}
      <section 
        className="relative py-32 px-6 overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage: `url('${imagen}')`
        }}
      >
        <div className="absolute inset-0 bg-black/70"></div>
        
        <div className="relative max-w-6xl mx-auto z-10">
          <div className="mb-6">
            <span className="inline-block bg-blue-600/30 text-blue-300 px-4 py-2 rounded-full text-sm font-semibold tracking-wider uppercase border border-blue-600/50">
              FORTNITE CREW
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Membresía Fortnite Crew
            <br />
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              activada en 24 horas
            </span>
          </h1>
          
          <p className="text-xl text-gray-200 mb-8 max-w-3xl">
            Elige la mejor opción para habilitar tu suscripción de Fortnite Crew, comparte los detalles de inicio de sesión de forma segura y obtén tu membresía activa en menos de un día.
          </p>
        </div>
      </section>

      {/* BENEFICIOS DESTACADOS */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl p-8 md:p-12 border border-gray-700 shadow-2xl">
          <div className="mb-8">
            <span className="inline-block bg-purple-600/20 text-purple-400 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-4">
              DESTACADO DE MEMBRESÍA
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Beneficios exclusivos renovados mensualmente
            </h2>
            <p className="text-gray-400 text-lg">
              Paquetes de outfits seleccionados por artistas de Epic, desafíos extra y aumentos de XP llegan con cada ciclo de facturación.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
              <div>
                <p className="text-white font-semibold">1,000 Pavos agregados a tu saldo cada mes.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-2 h-2 rounded-full bg-cyan-500 mt-2"></div>
              <div>
                <p className="text-white font-semibold">Acceso instantáneo al Pase de Batalla y cosméticos exclusivos del Crew.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
              <div>
                <p className="text-white font-semibold">Pausa o cancela en cualquier momento, sin cargos ocultos.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFICIOS EN GRID */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Beneficios Incluidos</h2>
          <p className="text-gray-400 text-lg">Todo lo que obtienes con tu membresía mensual</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              img: "/Imagenes/paselego.jpg", title: "Pase de LEGO", desc: "Construcción creativa"
            },
            {
              img: "/Imagenes/pasemusical.jpg", title: "Pase Musical", desc: "Ritmos y melodías"
            },
            {
              img: "/Imagenes/vbucks.jpg", title: "1000 Pavos", desc: "Cada mes automáticamente"
            },
            {
              img: "/Imagenes/es-mx-15br-subs-followup-social-1920x1080-1920x1080-e7c9efe33d4f.jpg", title: "Pase de Batalla", desc: "Acceso completo incluido"
            },
            {
              img: imagen, title: "Paquete del Club", desc: "Contenido exclusivo mensual"
            },
            {
              img: "/Imagenes/paseog.jpg", title: "Pase de Orígenes", desc: "Experiencias únicas"
            },
          ].map((benefit, index) => (
            <div 
              key={index} 
              className="rounded-2xl overflow-hidden bg-gray-800/50 border border-gray-700 shadow-xl hover:border-blue-600/50 hover:scale-105 transition-all duration-300"
            >
              <img src={benefit.img} alt={benefit.title} className="w-full h-48 object-cover" />
              <div className="p-5 text-white">
                <h3 className="font-bold text-xl mb-2">{benefit.title}</h3>
                <p className="text-sm text-gray-400">{benefit.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* PLANES DEL CLUB - Diseño moderno con paso a paso */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="mb-12">
          <span className="inline-block bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-4">
            PROCESO PASO A PASO
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Configura tu membresía del Crew
          </h2>
          <p className="text-gray-400 text-lg">
            Elige entre nuestros paquetes disponibles de Fortnite Crew. Calcularemos el precio automáticamente y aseguraremos tu membresía en 24 horas.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {clubItems.map((item, index) => (
            <div 
              key={item.id} 
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700 shadow-xl overflow-hidden hover:border-blue-600/50 transition-all duration-300 group"
            >
              {/* Radio Button Visual */}
              <div className="p-4 border-b border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full border-2 border-gray-600 flex items-center justify-center group-hover:border-blue-500 transition-colors">
                    <div className="w-3 h-3 rounded-full bg-transparent group-hover:bg-blue-500 transition-colors"></div>
                  </div>
                  <span className="text-white font-semibold">{item.duration}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(item.price)}
                </h3>
                <p className="text-gray-400 text-sm mb-6">{item.desc}</p>

                <button 
                  onClick={() => handleAddToCart(item)} 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 group-hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Agregar al carrito
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CREW SUPPORT */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl p-8 md:p-12 border border-gray-700 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="inline-block bg-green-600/20 text-green-400 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">
              MENSUAL
            </span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Gestión guiada de Fortnite Crew
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-1 h-16 bg-gradient-to-b from-blue-500 to-transparent"></div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-2">
                  Especialistas activan o renuevan tu Crew
                </h3>
                <p className="text-gray-400">
                  en las 24 horas posteriores a recibir tu pedido.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-1 h-16 bg-gradient-to-b from-purple-500 to-transparent"></div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-2">
                  Recordatorios de pago y confirmaciones de renovación
                </h3>
                <p className="text-gray-400">
                  enviados automáticamente cada ciclo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Club;