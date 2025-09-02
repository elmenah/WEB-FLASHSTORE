import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Home = () => {
  const { addToCart } = useCart();
  const [notification, setNotification] = useState(false);

  const clubItems = [
    { 
      id: 1, 
      title: "1 Mes Fortnite Crew", 
      desc: "Actívalo hoy mismo!", 
      price: 6000, 
      image: "/Imagenes/fn crew/fnmarzo.png" 
    },
    { 
      id: 2, 
      title: "2 Meses Fortnite Crew", 
      desc: "Obtén 2 Meses del club de Fortnite!", 
      price: 10000, 
      image: "/Imagenes/fn crew/fnmarzo.png" 
    },
    { 
      id: 3, 
      title: "3 Meses Fortnite Crew", 
      desc: "Obtén 3 Meses del club de Fortnite!", 
      price: 15000, 
      image: "/Imagenes/fn crew/fnmarzo.png" 
    },
    { 
      id: 4, 
      title: "6 Meses Fortnite Crew", 
      desc: "Obtén 6 Meses del club de Fortnite!", 
      price: 26000, 
      image: "/Imagenes/fn crew/fnmarzo.png" 
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
    <>
      {/* Notificación */}
      <div
        className={`fixed top-20 right-5 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg transition-opacity duration-500 z-50 ${
          notification ? 'opacity-100' : 'opacity-0 hidden'
        }`}
      >
        Producto agregado al carrito
      </div>

      {/* PORTADA */}
      <div className="relative flex items-center justify-center h-screen bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent z-10"></div>
        <div className="absolute left-1/2 transform -translate-x-1/2 sm:left-6 sm:transform-none sm:-translate-x-0 top-1/2 -translate-y-1/2 z-20 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 italic">
            Bienvenido a <span className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">Tio Flashstore</span>
          </h1>
          <Link 
            to="/shop"
            className="bg-white text-gray-900 px-4 py-2 rounded-lg text-lg font-semibold shadow-lg hover:bg-gray-100 transition-colors"
          >
            Ver la tienda de hoy
          </Link>
        </div>
        <img src="/Imagenes/1076581.jpg" className="w-full h-full object-cover z-0" alt="Hero" />
      </div>

      {/* CLUB FORTNITE */}
      <div className="container mx-auto p-4 text-white">
        <h2 className="text-4xl font-bold text-center mb-8 italic">Club Fortnite</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 justify-center place-items-center">
          {clubItems.map((item) => (
            <div key={item.id} className="bg-gray-800 w-[160px] sm:w-[190px] md:w-[190px] rounded-lg overflow-hidden shadow-lg flex flex-col justify-between mx-auto">
              <img 
                alt={item.title} 
                loading="lazy" 
                width="160" 
                height="240" 
                className="object-cover object-bottom w-full" 
                src={item.image}
              />
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm sm:text-lg font-semibold mb-2 truncate">{item.title}</h3>
                  <p className="text-gray-400 text-xs sm:text-sm truncate">{item.desc}</p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <p className="text-gray-100 text-xs sm:text-sm font-semibold">
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
      </div>

      {/* FAQ */}
      <div className="container mx-auto p-4 text-white">
        <h2 className="text-4xl font-bold text-center mb-8 italic">Preguntas Frecuentes</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold">¿Cómo recibo los productos que compro?</h3>
            <p className="text-gray-400">
              Los productos adquiridos serán entregados directamente en tu cuenta de Fortnite mediante el nombre de usuario que proporciones al momento de la compra.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">¿Cuánto tiempo tarda la entrega?</h3>
            <p className="text-gray-400">
              La entrega se realiza en un plazo máximo de 24 horas después de confirmar tu compra. En la mayoría de los casos, la entrega es inmediata.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">¿Por qué es tan barato?</h3>
            <p className="text-gray-400">
              Al aprovechar los precios regionales favorables, podemos comprar productos de Epic Games a un mejor precio a través de tiendas en otros países. Siempre pagamos el precio completo que Epic Games establece en ese país, incluidos los impuestos. No utilizamos ningún tipo de exploits ni métodos fraudulentos.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">¿Esto es seguro?</h3>
            <p className="text-gray-400">
              Llevamos años en la venta de servicios digitales, tenemos cientos de clientes en nuestro Instagram @tioflashstore, sin riesgos para tu cuenta. Todo el proceso se hace respetando las reglas de Epic Games, así que no hay peligro de baneos ni sanciones.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">¿Cuáles son los métodos de pago?</h3>
            <p className="text-gray-400">
              Ofrecemos métodos de pagos locales para Chile y aceptamos también pagos con criptomonedas como USDT.
            </p>
          </div>
        </div>
      </div>

      {/* SERVICIOS */}
      <div className="container mx-auto p-4 text-white">
        <h2 className="text-4xl font-bold text-center mb-8 italic">Servicios</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Venta de productos Fortnite</h3>
            <p className="text-gray-400">
              Ofrecemos una amplia variedad de productos de Fortnite, incluyendo skins, lotes y membresías del Club Fortnite.
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Entrega rápida</h3>
            <p className="text-gray-400">
              Garantizamos entregas rápidas y seguras directamente en tu cuenta de Fortnite.
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Soporte personalizado</h3>
            <p className="text-gray-400">
              Nuestro equipo está disponible para ayudarte con cualquier duda o problema relacionado con tu compra.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;