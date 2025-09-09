import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { supabase } from '../supabaseCliente';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [session, setSession] = useState(null); // Estado para la sesión activa
  const { openCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error al obtener sesión:', error.message);
        return;
      }
      setSession(data.session); // Actualiza el estado de la sesión
    };

    checkSession();
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleAccountRedirect = () => {
    navigate('/micuenta'); // Redirige a la página MiCuenta
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error al cerrar sesión:', error.message);
        return;
      }
      setSession(null); // Limpia el estado de la sesión
      navigate('/'); // Redirige al inicio después del logout
    } catch (err) {
      console.error('Error al cerrar sesión:', err.message);
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-40 bg-gray-900 bg-opacity-50 backdrop-blur-sm h-14 flex items-center px-6 border-b border-gray-900">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-4 lg:gap-8">
            <span 
              className="hamburger-menu material-symbols-outlined lg:hidden text-2xl cursor-pointer"
              onClick={toggleMobileMenu}
            >
              menu
            </span>

            <div className="absolute left-1/2 transform -translate-x-1/2 lg:static lg:translate-x-0">
              <Link to="/" className="logo text-xl font-bold text-gray-800">
                <img src="/Imagenes/PNGLogo01.png" alt="Logo" width="50px" height="50px" />
              </Link>
            </div>
          </div>

          <ul className="hidden lg:flex space-x-8 ml-4">
            <li className={`nav-link hover:text-blue-600 ${isActive('/') ? 'text-blue-600' : ''}`}>
              <Link to="/">Inicio</Link>
            </li>
            <li className={`nav-link hover:text-blue-600 ${isActive('/club') ? 'text-blue-600' : ''}`}>
              <Link to="/club">Club Fortnite</Link>
            </li>
            <li className={`nav-link hover:text-blue-600 ${isActive('/shop') ? 'text-blue-600' : ''}`}>
              <Link to="/shop">Tienda</Link>
            </li>
          </ul>

          <nav className="hidden lg:flex gap-8 ml-auto">
            <ul className="flex space-x-4">
              <li className="icon cursor-pointer" onClick={openCart}>
                <span className="hover:text-blue-600">Carrito</span>
              </li>
              {!session ? (
                <li className={`nav-link hover:text-blue-600 ${isActive('/login') ? 'text-blue-600' : ''}`}>
                  <Link to="/login">Login</Link>
                </li>
              ) : (
                <>
                  <li className="nav-link hover:text-blue-600">
                    <button
                      onClick={handleAccountRedirect}
                      className="text-white hover:text-blue-600"
                    >
                      Mi Cuenta
                    </button>
                  </li>
                  <li className="nav-link hover:text-blue-600">
                    <button
                      onClick={handleLogout}
                      className="text-white hover:text-red-600"
                    >
                      Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </nav>

          <div className="lg:hidden flex items-center">
            <span 
              className="material-symbols-outlined text-2xl cursor-pointer" 
              onClick={openCart}
            >
              shopping_cart
            </span>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`lg:hidden fixed inset-0 bg-gray-800 bg-opacity-70 z-40 ${isMobileMenuOpen ? '' : 'hidden'}`}>
        <div className="bg-gray-800 p-6 w-3/4 max-w-xs h-full">
          <span 
            className="material-symbols-outlined text-2xl cursor-pointer" 
            onClick={closeMobileMenu}
          >
            close
          </span>
          <ul className="mt-6 space-y-4">
            <li>
              <Link 
                to="/" 
                className="text-white hover:text-blue-600" 
                onClick={closeMobileMenu}
              >
                Inicio
              </Link>
            </li>
            <li>
              <Link 
                to="/shop" 
                className="text-white hover:text-blue-600" 
                onClick={closeMobileMenu}
              >
                Tienda
              </Link>
            </li>
            <li>
              <Link 
                to="/club" 
                className="text-white hover:text-blue-600" 
                onClick={closeMobileMenu}
              >
                Club Fortnite
              </Link>
            </li>
            {!session ? (
              <li>
                <Link 
                  to="/login" 
                  className="text-white hover:text-blue-600" 
                  onClick={closeMobileMenu}
                >
                  Login
                </Link>
              </li>
            ) : (
              <>
                <li>
                  <button
                    onClick={handleAccountRedirect}
                    className="text-white hover:text-blue-600"
                  >
                    Mi Cuenta
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="text-white hover:text-red-600"
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Header;