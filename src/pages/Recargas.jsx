import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import useScrollToTop from '../hooks/useScrollToTop';

const Recargas = () => {
  useScrollToTop();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const paquetes = [
      {
        id: 1,
        nombre: '28000 V-Bucks',
        pavos: 2800,
        precio: 12500,
        precioOriginal: 17050,
        descuento: '26%',
        popular: false,
        imagen: '/Imagenes/2800.png'
      },
    {
      id: 2,
      nombre: '5,000 V-Bucks',
      pavos: 5000,
      precio: 20000,
      precioOriginal: 27300,
      descuento: '27%',
      popular: false,
      imagen: '/Imagenes/5000.png'
    },
    {
      id: 3,
      nombre: '13,500 V-Bucks',
      pavos: 13500,
      precio: 48000,
      precioOriginal: 68230,
      descuento: '30%',
      popular: true,
      imagen: '/Imagenes/13500.png'
    },
    
  ];

  const metodosEntrega = [
    {
      titulo: 'Vinculación a Epic',
      subtitulo: 'RECOMENDADO',
      descripcion: 'Conectamos nuestra consola Xbox a tu perfil de Epic y recargamos directamente.',
      icono: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
        </svg>
      ),
      color: 'from-purple-600 to-purple-800'
    },
    {
      titulo: 'Cuenta Xbox',
      subtitulo: 'DIRECTO',
      descripcion: 'Cargamos los V-Bucks directamente en tu cuenta de Xbox vinculada a Epic.',
      icono: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      ),
      color: 'from-green-600 to-green-800'
    },
    {
      titulo: 'Cuenta Precargada',
      subtitulo: 'MÁS RÁPIDO',
      descripcion: 'Recibes un login de Fortnite ya cargado con tu balance de V-Bucks.',
      icono: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      ),
      color: 'from-blue-600 to-blue-800'
    }
  ];

  const handleAddToCart = (paquete) => {
    const producto = {
      nombre: paquete.nombre,
      precio: paquete.precio,
      pavos: paquete.pavos,
      imagen: paquete.imagen || '/Imagenes/vbucks-icon.png'
    };
    addToCart(producto);
    navigate('/checkout');
  };

  const CLP = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-20">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-cyan-500/20 to-purple-600/20 blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block mb-4">
              <span className="bg-blue-600/20 text-blue-400 px-4 py-2 rounded-full text-sm font-semibold tracking-wider uppercase border border-blue-600/30">
                Recargas de V-Bucks
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600 bg-clip-text text-transparent">
              Recarga V-Bucks al Mejor Precio
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Obtén tus V-Bucks de forma rápida, segura. 
              Entrega gestionada por especialistas con soporte 24/7.
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-green-500/10 text-green-400 px-4 py-2 rounded-full border border-green-500/30">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span className="font-semibold">Entrega en 24 horas</span>
              </div>
              <div className="flex items-center gap-2 bg-blue-500/10 text-blue-400 px-4 py-2 rounded-full border border-blue-500/30">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span className="font-semibold">Pago 100% seguro</span>
              </div>
              <div className="flex items-center gap-2 bg-purple-500/10 text-purple-400 px-4 py-2 rounded-full border border-purple-500/30">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                </svg>
                <span className="font-semibold">Soporte dedicado</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Paquetes de V-Bucks */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Elige tu Paquete
          </h2>
          <p className="text-gray-400 text-lg">
            Todos los precios incluyen descuento. Pago con Mercado Pago.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {paquetes.map((paquete) => (
            <div
              key={paquete.id}
              className={`relative bg-gray-800/50 backdrop-blur-lg rounded-2xl border overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                paquete.popular
                  ? 'border-cyan-500/50 shadow-lg shadow-cyan-500/20'
                  : 'border-gray-700/50'
              }`}
            >
              {paquete.popular && (
                <div className="absolute top-4 right-4 z-10">
                  <span className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase">
                    Popular
                  </span>
                </div>
              )}

              <div className="p-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-32 h-32 flex items-center justify-center">
                    <img 
                      src={paquete.imagen} 
                      alt={paquete.nombre}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24" fill="none" stroke="%2306b6d4" stroke-width="2"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>';
                      }}
                    />
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-white text-center mb-2">
                  {paquete.pavos.toLocaleString()} V-Bucks
                </h3>

                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs font-bold border border-red-500/30">
                    -{paquete.descuento}
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    {CLP.format(paquete.precioOriginal)}
                  </span>
                </div>

                <div className="text-center mb-6">
                  <span className="text-sm text-gray-400">Desde</span>
                  <p className="text-3xl font-bold text-cyan-400">
                    {CLP.format(paquete.precio)}
                  </p>
                </div>

                <button
                  onClick={() => handleAddToCart(paquete)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold transition-all duration-300 shadow-lg hover:shadow-cyan-500/50"
                >
                  Comprar Ahora
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Métodos de Entrega */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Métodos de Entrega
          </h2>
          <p className="text-gray-400 text-lg">
            Elige cómo quieres recibir tus V-Bucks
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {metodosEntrega.map((metodo, index) => (
            <div
              key={index}
              className="bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700/50 p-8 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10"
            >
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${metodo.color} flex items-center justify-center mb-6 text-white`}>
                {metodo.icono}
              </div>

              <div className="mb-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  {metodo.subtitulo}
                </span>
              </div>

              <h3 className="text-2xl font-bold text-white mb-4">
                {metodo.titulo}
              </h3>

              <p className="text-gray-400 leading-relaxed">
                {metodo.descripcion}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Proceso de Compra */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gray-800/30 backdrop-blur-lg rounded-3xl border border-gray-700/50 p-8 md:p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              ¿Cómo Funciona?
            </h2>
            <p className="text-gray-400 text-lg">
              Proceso simple y seguro en 3 pasos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-2xl font-bold text-white mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Selecciona tu Paquete
              </h3>
              <p className="text-gray-400">
                Elige la cantidad de V-Bucks que deseas comprar
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center text-2xl font-bold text-white mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Completa tu Información
              </h3>
              <p className="text-gray-400">
                Proporciona tus datos y método de entrega preferido
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-2xl font-bold text-white mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Recibe tus V-Bucks
              </h3>
              <p className="text-gray-400">
                Nuestro equipo procesará tu pedido en menos de 24 horas
              </p>
            </div>
          </div>

          
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Preguntas Frecuentes
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700/50 p-6">
            <h3 className="text-lg font-bold text-white mb-3">
              ¿Cuánto tarda la entrega?
            </h3>
            <p className="text-gray-400 text-sm">
              Nuestros especialistas procesan todos los pedidos dentro de las 24 horas. La mayoría se completan en menos tiempo.
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700/50 p-6">
            <h3 className="text-lg font-bold text-white mb-3">
              ¿Es seguro el proceso?
            </h3>
            <p className="text-gray-400 text-sm">
              Sí, totalmente. Usamos métodos oficiales de Epic Games y nunca almacenamos tus credenciales.
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700/50 p-6">
            <h3 className="text-lg font-bold text-white mb-3">
              ¿Qué método de entrega es mejor?
            </h3>
            <p className="text-gray-400 text-sm">
              Recomendamos la vinculación a Epic para mayor seguridad. Si tienes prisa, la cuenta precargada es más rápida.
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700/50 p-6">
            <h3 className="text-lg font-bold text-white mb-3">
              ¿Puedo usar los V-Bucks en cualquier plataforma?
            </h3>
            <p className="text-gray-400 text-sm">
              Los V-Bucks están vinculados a tu cuenta de Epic Games y funcionan en todas las plataformas (Excepto en Nintendo Switch).
            </p>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600/20 via-cyan-500/20 to-purple-600/20 backdrop-blur-lg rounded-3xl border border-cyan-500/30 p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ¿Listo para Recargar tus V-Bucks?
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Ahorra hasta 30% en tus recargas con entrega rápida y segura
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 hover:from-blue-700 hover:via-cyan-600 hover:to-blue-700 text-white font-bold text-lg shadow-xl hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300"
          >
            Ver Paquetes
          </button>
        </div>
      </section>
    </div>
  );
};

export default Recargas;
