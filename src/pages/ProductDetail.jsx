import React, { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import useScrollToTop from '../hooks/useScrollToTop';

const ProductDetail = () => {
  useScrollToTop(); // ✅ Agregar esta línea
  
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { addToCart } = useCart();
  const [notification, setNotification] = useState(false);

  const productData = {
    nombre: searchParams.get('nombre') || id,
    precio: Number(searchParams.get('precio')) || 0,
    imagen: searchParams.get('imagen') || '',
    descripcion: searchParams.get('descripcion') || 'Descripción no disponible.',
    tipo: searchParams.get('tipo') || 'No especificado',
    rareza: searchParams.get('rareza') || 'Sin rareza',
    partede: searchParams.get('partede') || '',
    inicio: searchParams.get('inicio') || null,
    fin: searchParams.get('fin') || null,
    mensajeSalida: searchParams.get('mensajeSalida') || '',
    bundle: searchParams.get('bundle') || '',
    bundle2: searchParams.get('bundle2') || '',
    bundle3: searchParams.get('bundle3') || '',
    bundle4: searchParams.get('bundle4') || '',
    colorfondo: searchParams.get('colorfondo') || '#ffffff',
    // Nuevos parámetros para colores dinámicos
    color1: searchParams.get('color1') || '#475569',
    color2: searchParams.get('color2') || '#334155',
    color3: searchParams.get('color3') || '#1e293b'
  };

  // 🎨 Crear gradiente dinámico igual que en Shop2
  const gradientStyle = {
    background: `linear-gradient(135deg, ${productData.color1} 0%, ${productData.color2} 50%, ${productData.color3} 100%)`
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Fecha no disponible';
    const fecha = new Date(dateStr);
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const año = fecha.getFullYear();
    const horas = String(fecha.getHours()).padStart(2, '0');
    const minutos = String(fecha.getMinutes()).padStart(2, '0');
    const segundos = String(fecha.getSeconds()).padStart(2, '0');
    return `${dia}-${mes}-${año} ${horas}:${minutos}:${segundos}`;
  };

  const handleAddToCart = () => {
    const product = {
      nombre: productData.nombre,
      precio: productData.precio * 4.0,
      imagen: productData.imagen,
    };
    addToCart(product);
    showNotification();
  };

  const showNotification = () => {
    setNotification(true);
    setTimeout(() => setNotification(false), 3000);
  };

  const bundleImages = [
    productData.bundle,
    productData.bundle2,
    productData.bundle3,
    productData.bundle4
  ].filter(img => img && img !== "undefined" && img !== "");

  const InfoCard = ({ icon, label, value }) => (
    <div className="bg-gray-700/50 rounded-lg p-3 border border-gray-600/50">
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
        <span>{icon}</span>
        <span>{label}:</span>
      </div>
      <div className="text-white font-semibold">{value || 'No especificado'}</div>
    </div>
  );

  const getRarityColor = (rarity) => {
    const colors = {
      'legendario': 'bg-orange-500 text-white',
      'épico': 'bg-purple-500 text-white',
      'raro': 'bg-blue-500 text-white',
      'poco común': 'bg-green-500 text-white',
      'común': 'bg-gray-500 text-white'
    };
    return colors[rarity?.toLowerCase()] || 'bg-gray-600 text-white';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Notification */}
      <div className={`fixed top-20 right-5 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg transition-opacity duration-500 z-50 ${notification ? 'opacity-100' : 'opacity-0 hidden'}`}>
        Producto agregado al carrito
      </div>

      {/* Breadcrumbs */}
      <div className="pt-20 pb-4 px-4">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-gray-400">
            <a href="/" className="hover:text-white transition-colors">🏠 Inicio</a>
            <span>›</span>
            <a href="/shop" className="hover:text-white transition-colors">🛒 Tienda</a>
            <span>›</span>
            <span className="text-white">{productData.nombre}</span>
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Imagen del producto con gradiente dinámico */}
          <div className="relative flex-shrink-0 w-full lg:w-1/2">
            <div 
              className="relative w-full h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-xl border border-gray-700/50"
              style={gradientStyle}
            >
              {/* Imagen centrada y más pequeña */}
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <img 
                  src={productData.imagen} 
                  alt={productData.nombre}
                  className="max-w-[80%] max-h-[80%] object-contain drop-shadow-2xl"
                />
              </div>
              
              {/* Badge de rareza */}
              {productData.rareza && (
                <div className={`absolute top-4 right-4 py-2 px-3 rounded-lg text-xs font-bold shadow-lg ${getRarityColor(productData.rareza)}`}>
                  {productData.rareza.toUpperCase()}
                </div>
              )}

              {/* Degradado inferior para mejor legibilidad */}
              <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          </div>

          {/* Información del producto */}
          <div className="flex flex-col w-full lg:w-1/2 bg-gray-800/90 p-6 rounded-2xl shadow-xl border border-gray-700/50 backdrop-blur-sm">
            <h1 className="text-3xl font-bold text-white mb-4">{productData.nombre}</h1>
            <p className="text-gray-400 mb-6">{productData.descripcion}</p>

            <div className="space-y-4">
              <InfoCard 
                icon={<i className="fas fa-tag"></i>} 
                label="Tipo" 
                value={productData.tipo} 
              />
              <InfoCard 
                icon={<i className="fas fa-star"></i>} 
                label="Rareza" 
                value={productData.rareza} 
              />
              <InfoCard 
                icon={<i className="fas fa-box"></i>} 
                label="Parte del lote" 
                value={productData.partede} 
              />
              
            </div>

            {bundleImages.length > 0 && (
              <div className="mt-6">
                <h3 className="text-blue-400 font-semibold mb-4 flex items-center gap-2">
                  <i className="fas fa-gift"></i> Esta compra incluye:
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {bundleImages.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Bundle ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-gray-700 hover:scale-105 transition-transform"
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 space-y-2">
              <p className="text-gray-400">
                Llegó a la tienda: {formatDate(productData.inicio)}
              </p>
              <p className="text-gray-400">
                Se va de la tienda: {formatDate(productData.fin)}
              </p>
            </div>

            {productData.mensajeSalida && (
              <p className="mt-4 text-red-400 font-semibold text-center">
                {productData.mensajeSalida}
              </p>
            )}

            {/* Precio destacado */}
            <div className="mt-6 text-center bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
              <div className="flex items-center justify-center gap-2 mb-2">
                <img 
                  src="https://fortnite-api.com/images/vbuck.png" 
                  alt="V-Bucks" 
                  className="w-6 h-6"
                />
                <span className="text-2xl font-bold text-white">
                  {productData.precio.toLocaleString()}
                </span>
              </div>
              <span className="text-3xl font-bold text-yellow-400">
                ${(productData.precio * 4).toLocaleString("es-CL")} CLP
              </span>
            </div>

            <button 
              onClick={handleAddToCart}
              className="mt-6 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2 transform hover:scale-[1.02]"
            >
              <i className="fas fa-shopping-cart"></i>
              Añadir al Carrito
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;