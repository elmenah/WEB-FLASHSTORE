import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../css/detalleproducto.css';


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
    tipo: searchParams.get('mainType') || 'No especificado',
    rareza: searchParams.get('rareza') || 'Sin rareza',
    partede: searchParams.get('partede') || '',
    inicio: searchParams.get('fecha') || null,
    fin: searchParams.get('out') || null,
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
    <div className="pt-14">
      {/* Notification */}
      <div className={`fixed top-20 right-20 bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-2xl shadow-lg font-semibold z-50 flex items-center gap-3 backdrop-blur-10 border border-white border-opacity-20 transition-all duration-300 ${notification ? 'opacity-100 visible translate-x-0' : 'opacity-0 invisible translate-x-full'}`}>
        <i className="fas fa-check-circle text-xl"></i>
        <span>Producto agregado al carrito</span>
      </div>

      <main>
        <div className="producto-detalle">
          <div className="producto-imagen">
            <img 
              src={productData.imagen} 
              alt={productData.nombre}
              style={{ backgroundColor: productData.colorfondo }}
            />
            {productData.rareza && (
              <div className="rareza-badge">
                {productData.rareza.toUpperCase()}
              </div>
            )}
          </div>

          <div className="producto-info">
            <h1>{productData.nombre}</h1>
            <p className="descripcion">{productData.descripcion}</p>

            <div className="producto-details">
              <div className="detail-item">
                <h3><i className="fas fa-tag"></i> Tipo:</h3>
                <span className="textdospuntos">{productData.tipo}</span>
              </div>
              <div className="detail-item">
                <h3><i className="fas fa-star"></i> Rareza:</h3>
                <span className="textdospuntos">{productData.rareza}</span>
              </div>
              <div className="detail-item">
                <h3><i className="fas fa-box"></i> Parte del lote:</h3>
                <span className="textdospuntos">{productData.partede}</span>
              </div>
            </div>

            <div className="precio-producto">
              <span>${(productData.precio * 4.4).toLocaleString("es-CL")} CLP</span>
            </div>

            {bundleImages.length > 0 && (
              <div className="bundle-section">
                <h3><i className="fas fa-gift"></i> Esta compra incluye:</h3>
                <div className="bundle-gallery">
                  {bundleImages.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Bundle ${index + 1}`}
                      className="producto-imagen-lote"
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="fechas-section">
              <div className="llegoseva">
                Llegó a la tienda: {formatDate(productData.inicio)}
              </div>
              <div className="llegoseva">
                Se va de la tienda: {formatDate(productData.fin)}
              </div>
            </div>

            {productData.mensajeSalida && (
              <p className="mensaje-salida">{productData.mensajeSalida}</p>
            )}

            <button 
              onClick={handleAddToCart}
              className="agregar-carrito"
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