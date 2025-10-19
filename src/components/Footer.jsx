import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Twitter, Facebook, ArrowUp } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Botón flotante para volver arriba */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-50"
        title="Volver arriba"
      >
        <ArrowUp size={20} />
      </button>

      <footer className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-300 relative overflow-hidden">
        {/* Efectos de fondo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            
            {/* Logo y descripción */}
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src="/Imagenes/PNGLogo01.png" 
                  alt="Tio Flashstore Logo" 
                  className="w-12 h-12 rounded-lg shadow-lg"
                />
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Tio Flashstore
                  </h3>
                  <p className="text-xs text-gray-500">Tu tienda Fortnite</p>
                </div>
              </div>
              <p className="text-sm text-center md:text-left text-gray-400 leading-relaxed">
                La mejor experiencia comprando cosméticos de Fortnite. Precios justos, entrega rápida y soporte 24/7.
              </p>
              
              {/* Stats */}
              <div className="flex gap-4 mt-4">
                
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-400">+3000</div>
                  <div className="text-xs text-gray-500">Clientes</div>
                </div>
              </div>
            </div>

            {/* Enlaces Rápidos */}
            <div className="flex flex-col items-center md:items-start">
              <h4 className="font-semibold text-lg mb-4 text-white flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Enlaces Rápidos
              </h4>
              <ul className="space-y-3">
                {[
                  { to: '/', label: 'Inicio', icon: '🏠' },
                  { to: '/shop', label: 'Tienda', icon: '🛒' },
                  { to: '/club', label: 'Club', icon: '👑' },
                 
                ].map((link) => (
                  <li key={link.to}>
                    <Link 
                      to={link.to} 
                      className="text-sm hover:text-blue-400 transition-colors duration-200 flex items-center gap-2 group"
                    >
                      <span className="group-hover:scale-110 transition-transform">{link.icon}</span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contacto y Redes Sociales */}
            <div className="flex flex-col items-center md:items-start">
              <h4 className="font-semibold text-lg mb-4 text-white flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                Contáctanos
              </h4>
              
              {/* Información de contacto */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-3 text-sm">
                  <Mail size={16} className="text-blue-400" />
                  <a href="mailto:soporte@tioflashstore.com" className="hover:text-blue-400 transition-colors">
                    soporte@centralflash.me
                  </a>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone size={16} className="text-green-400" />
                  <span>+56 9 30917730</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin size={16} className="text-red-400" />
                  <span>Santiago, Chile</span>
                </div>
              </div>

              {/* Redes sociales */}
              <h5 className="font-medium text-white mb-3">Síguenos</h5>
              <div className="flex space-x-3">
                {[
                  { href: 'http://instagram.com/tioflashstore', icon: Instagram, color: 'hover:text-pink-400', label: 'Instagram' },
                  
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className={`p-2 bg-gray-800 rounded-lg ${social.color} transition-all duration-200 transform hover:scale-110 hover:shadow-lg`}
                    title={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <social.icon size={20} />
                  </a>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="flex flex-col items-center md:items-start">
              <h4 className="font-semibold text-lg mb-4 text-white flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Newsletter
              </h4>
              <p className="text-sm mb-4 text-gray-400 text-center md:text-left">
                Sé el primero en conocer las nuevas ofertas y productos exclusivos.
              </p>
              
              <form onSubmit={handleSubscribe} className="w-full max-w-sm">
                <div className="flex flex-col gap-3">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com" 
                    className="p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    required
                  />
                  <button 
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 font-medium"
                  >
                    {isSubscribed ? '¡Suscrito! ✓' : 'Suscribirse'}
                  </button>
                </div>
              </form>

              {/* Beneficios */}
              <div className="mt-4 space-y-1">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="w-1 h-1 bg-green-400 rounded-full"></span>
                  Ofertas exclusivas
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                  Productos antes que nadie
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                  Sin spam, solo lo mejor
                </div>
              </div>
            </div>
          </div>

          {/* Separador */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-gray-500">
                <p>© 2025 Tio Flashstore. Todos los derechos reservados.</p>
                <div className="flex gap-4">
                  <Link to="/privacy" className="hover:text-gray-300 transition-colors">
                    Política de Privacidad
                  </Link>
                  <Link to="/terms" className="hover:text-gray-300 transition-colors">
                    Términos de Uso
                  </Link>
                </div>
              </div>
              
              {/* Métodos de pago */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500">Métodos de pago:</span>
                <div className="flex gap-2">
                  {['💳', '🏦', '📱'].map((icon, index) => (
                    <div key={index} className="w-8 h-6 bg-gray-800 rounded flex items-center justify-center text-sm">
                      {icon}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
