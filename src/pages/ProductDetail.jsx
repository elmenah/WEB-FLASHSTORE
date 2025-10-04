import React, { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
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
    colorfondo: searchParams.get('colorfondo') || '#ffffff'
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
      precio: productData.precio * 4.4,
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

  return (
    <div className="pt-20 pb-20">
      {/* Notification */}
      <div className={`fixed top-20 right-5 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg transition-opacity duration-500 z-50 ${notification ? 'opacity-100' : 'opacity-0 hidden'}`}>
        Producto agregado al carrito
      </div>

      <main className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Imagen del producto */}
          <div className="relative flex-shrink-0 w-full lg:w-1/2 rounded-lg overflow-hidden shadow-lg border border-gray-700">
            <img 
              src={productData.imagen} 
              alt={productData.nombre}
              className="w-full h-full object-cover"
              style={{ backgroundColor: productData.colorfondo }}
            />
            {productData.rareza && (
              <div className="absolute top-4 right-4 bg-gray-800 text-white py-1 px-3 rounded-md text-xs font-bold shadow-md">
                {productData.rareza.toUpperCase()}
              </div>
            )}
          </div>

          {/* Información del producto */}
          <div className="flex flex-col w-full lg:w-1/2 bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
            <h1 className="text-3xl font-bold text-white mb-4">{productData.nombre}</h1>
            <p className="text-gray-400 mb-6">{productData.descripcion}</p>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <h3 className="text-yellow-400 font-semibold flex items-center gap-2">
                  <i className="fas fa-tag"></i> Tipo:
                </h3>
                <span className="text-white">{productData.tipo}</span>
              </div>
              <div className="flex items-center gap-4">
                <h3 className="text-yellow-400 font-semibold flex items-center gap-2">
                  <i className="fas fa-star"></i> Rareza:
                </h3>
                <span className="text-white">{productData.rareza}</span>
              </div>
              <div className="flex items-center gap-4">
                <h3 className="text-yellow-400 font-semibold flex items-center gap-2">
                  <i className="fas fa-box"></i> Parte del lote:
                </h3>
                <span className="text-white">{productData.partede}</span>
              </div>
              <div className="flex items-center gap-4">
                <h3 className="text-yellow-400 font-semibold flex items-center gap-2">
                  <i class="fa-solid fa-coins"></i> Costo en pavos:
                </h3>
                <span className="text-white">{productData.precio}</span>
              </div>
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
                      className="w-full h-24 object-cover rounded-lg border border-gray-700"
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
            <div className="mt-6 text-center">
              <span className="text-2xl font-bold text-yellow-400">
                ${(productData.precio * 4.4).toLocaleString("es-CL")} CLP
              </span>
            </div>

            <button 
              onClick={handleAddToCart}
              className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-bold shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
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