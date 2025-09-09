import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { supabase } from '../supabaseCliente';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [session, setSession] = useState(null); // Estado para la sesión activa
  const [showLogoutModal, setShowLogoutModal] = useState(false); // Estado para el modal de confirmación
  const [logoutMessage, setLogoutMessage] = useState(""); // Estado para el mensaje de confirmación
  const { cart, openCart } = useCart(); // Obtener el carrito desde el contexto
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
      setLogoutMessage("Sesión cerrada exitosamente."); // Mensaje de confirmación
      setTimeout(() => {
        navigate('/login'); // Redirige al login después del logout
        setLogoutMessage(""); // Limpia el mensaje después de 3 segundos
      }, 3000);
    } catch (err) {
      console.error('Error al cerrar sesión:', err.message);
    }
  };

  const openLogoutModal = () => {
    setShowLogoutModal(true); // Muestra el modal de confirmación
  };

  const closeLogoutModal = () => {
    setShowLogoutModal(false); // Cierra el modal de confirmación
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
              <li
                className={`icon cursor-pointer relative ${cart.length > 0 ? 'text-yellow-500' : 'hover:text-blue-600'}`}
                onClick={openCart}
              >
                <span>Carrito</span>
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
                      onClick={openLogoutModal}
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
              className="material-symbols-outlined text-2xl cursor-pointer relative" 
              onClick={openCart}
            >
              shopping_cart
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </span>
          </div>
        </div>
      </header>

      {/* Modal de confirmación */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-black rounded-lg p-6 shadow-lg">
            <h2 className="text-lg font-bold mb-4">¿Estás seguro de que quieres cerrar sesión?</h2>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeLogoutModal}
                className="px-4 py-2 bg-white text-black rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  closeLogoutModal();
                  handleLogout();
                }}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mensaje de confirmación */}
      {logoutMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white py-2 px-4 rounded shadow-lg">
          {logoutMessage}
        </div>
      )}
    </>
  );
};

export default Header;