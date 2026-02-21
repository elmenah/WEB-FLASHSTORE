import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

const Activaciones = () => {
  const { addToCart } = useCart();
  const [notification, setNotification] = useState(false);

  // Productos de Windows
  const windowsProducts = [
    { 
      id: 'win-10', 
      title: "Windows 10 PRO", 
      desc: "Activación permanente por 12 meses", 
      price: 10000, 
      image: "Imagenes/windows-10-professional.png",
      categoria: "Windows"
    },
    { 
      id: 'win-11', 
      title: "Windows 11 PRO", 
      desc: "Activación permanente por 12 meses", 
      price: 10000, 
      image: "Imagenes/windows-11-professional.png",
      categoria: "Windows"
    },
    
  ];

  // Productos de Office
  const officeProducts = [
    { 
      id: 'office-365', 
      title: "Office 365 PRO PLUS", 
      desc: "Suite completa por 12 meses", 
      price: 10000, 
      image: "Imagenes/office365.png?w=800",
      categoria: "Office"
    },
    { 
      id: 'office-2024', 
      title: "Office 2024 PRO PLUS", 
      desc: "Versión más reciente por 12 meses", 
      price: 10000, 
      image: "Imagenes/office2024pro.png?w=800",
      categoria: "Office"
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
        className="relative pt-20 pb-16 px-6 text-left h-[500px] bg-gradient-to-br from-purple-900 via-pink-900 to-purple-800 flex items-center justify-center overflow-hidden"
      >
        {/* Patrón de fondo decorativo */}
        <div className="absolute left-10 top-10 grid grid-cols-3 gap-2 opacity-30">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="w-2 h-2 bg-white rounded-full"></div>
          ))}
        </div>
        
        {/* Flechas decorativas derecha */}
        <div className="absolute right-10 top-1/4 space-y-3 opacity-40">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-pink-300"></div>
              <div className="w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-8 border-l-pink-300"></div>
            </div>
          ))}
        </div>

        <div className="relative max-w-6xl mx-auto z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            ACTIVACIONES <span className="text-pink-400">POR 12 MESES</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-6">
            Licencias oficiales de Windows, Office y herramientas premium <br />
            <span className="font-bold text-green-400">Desde $10.000 CLP</span> por 12 meses completos
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm border border-white/20">💻 Windows 10 / 11</span>
            <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm border border-white/20">📊 Office PRO</span>
            <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm border border-white/20">🤖 ChatGPT Plus</span>
          </div>
        </div>

        {/* Patrón inferior */}
        <div className="absolute bottom-10 left-10 grid grid-cols-3 gap-2 opacity-30">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="w-2 h-2 bg-white rounded-full"></div>
          ))}
        </div>
      </section>

      {/* WINDOWS */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            <span className="text-blue-400">Windows</span> Activaciones
          </h2>
          <p className="text-gray-400">Licencias oficiales permanentes para tu PC</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {windowsProducts.map((item) => (
            <div key={item.id} className="bg-gradient-to-br from-blue-900/40 to-blue-800/40 rounded-lg shadow-lg overflow-hidden flex flex-col hover:transform hover:scale-105 transition-all duration-300 border border-blue-500/30">
              <div className="w-full h-40 bg-white/5 flex items-center justify-center p-4">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🪟</span>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">{item.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-blue-600/30 text-blue-300 rounded text-xs">⏰ 12 Meses</span>
                    <span className="px-2 py-1 bg-blue-600/30 text-blue-300 rounded text-xs">✅ Original</span>
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

      {/* OFFICE */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            <span className="text-orange-500">Office</span> PRO PLUS
          </h2>
          <p className="text-gray-400">Suite completa de productividad de Microsoft</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {officeProducts.map((item) => (
            <div key={item.id} className="bg-gradient-to-br from-orange-900/40 to-red-900/40 rounded-lg shadow-lg overflow-hidden flex flex-col hover:transform hover:scale-105 transition-all duration-300 border border-orange-500/30">
              <div className="w-full h-40 bg-white/5 flex items-center justify-center p-4">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">📊</span>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">{item.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-orange-600/30 text-orange-300 rounded text-xs">📝 Word</span>
                    <span className="px-2 py-1 bg-orange-600/30 text-orange-300 rounded text-xs">📊 Excel</span>
                    <span className="px-2 py-1 bg-orange-600/30 text-orange-300 rounded text-xs">📽️ PowerPoint</span>
                    <span className="px-2 py-1 bg-orange-600/30 text-orange-300 rounded text-xs">➕ Más</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <p className="text-gray-100 text-xl font-bold">
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

      

      

      {/* FAQ Section */}
      <section className="py-12 px-6 max-w-4xl mx-auto">
        
      </section>

    </div>
  );
};

export default Activaciones;
