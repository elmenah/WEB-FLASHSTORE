import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-gray-400 py-8 mt-12 animate-fade-in">
      <div className="mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center md:items-start">
            <img src="/Imagenes/PNGLogo01.png" alt="Logo" className="w-32 mb-4" />
            <p className="text-sm text-center md:text-left">
              Tio Flashstore es tu tienda en línea preferida para comprar cosméticos de Fortnite al mejor precio!
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-semibold text-lg mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm hover:text-gray-400">Inicio</Link></li>
              <li><Link to="/shop" className="text-sm hover:text-gray-400">Tienda</Link></li>
              <li><Link to="/club" className="text-sm hover:text-gray-400">Club</Link></li>
            </ul>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-semibold text-lg mb-4">Síguenos</h4>
            <div className="flex space-x-4">
              <a href="http://instagram.com/tioflashstore" className="text-gray-400 hover:text-gray-200">
                <i className="fab fa-instagram text-2xl"></i>
              </a>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-semibold text-lg mb-4">Suscríbete</h4>
            <p className="text-sm mb-4">
              Recibe nuestras últimas novedades directamente en tu bandeja de entrada.
            </p>
            <div className="flex space-x-2">
              <input 
                type="email" 
                placeholder="Tu email" 
                className="p-2 rounded-lg text-black" 
              />
            </div>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all">
                Suscribirse
              </button>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-4 text-center">
          <p className="text-sm text-gray-400">© 2025 Tio Flashstore. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;