import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { supabase } from "../supabaseCliente";

const Header = () => {
  const [session, setSession] = useState(null); // Estado para la sesión activa
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Estado para el menú hamburguesa
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para el modal de logout
  const [notification, setNotification] = useState(false); // Estado para la notificación de logout
  const { cart, openCart } = useCart(); // Obtener el carrito desde el contexto
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error al obtener sesión:", error.message);
        return;
      }
      setSession(data.session); // Actualiza el estado de la sesión
    };

    checkSession();
  }, []);

  const isActive = (path) => location.pathname === path;

  const handleAccountRedirect = () => {
    navigate("/micuenta"); // Redirige a la página MiCuenta
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen); // Alterna el estado del menú hamburguesa
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false); // Cierra el menú hamburguesa
  };

  const openModal = () => {
    closeMobileMenu();
    setIsModalOpen(true); // Abre el modal de logout
  };

  const closeModal = () => {
    setIsModalOpen(false); // Cierra el modal de logout
  };

  const showNotification = () => {
    setNotification(true); // Muestra la notificación
    setTimeout(() => {
      setNotification(false); // Oculta la notificación después de 2 segundos
      navigate("/login"); // Redirige al usuario a la página de login
    }, 2000);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setSession(null); // Actualiza el estado de la sesión
      setIsMobileMenuOpen(false); // Cierra el menú hamburguesa
      closeModal(); // Cierra el modal después de cerrar sesión
      showNotification(); // Muestra la notificación de logout
      
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message);
    }
  };

  return (
    <>
      {/* Notificación de logout */}
      {notification && (
        <div className="fixed top-20 right-5 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg transition-opacity duration-500 z-50">
          Sesión cerrada con éxito
        </div>
      )}

      <header className="fixed top-0 left-0 w-full z-40 bg-gray-900 bg-opacity-50 backdrop-blur-sm h-16 flex items-center px-6 border-b border-gray-900">
        <nav className="w-full flex items-center justify-between">
          {/* Vista móvil: Menú hamburguesa y carrito */}
          <div className="lg:hidden flex items-center justify-between w-full">
            <button className="text-white text-2xl" onClick={toggleMobileMenu}>
              <span className="material-icons">menu</span>
            </button>
            <button
              className="relative text-white text-2xl flex items-center gap-2"
              onClick={openCart}
            >
              <span className="material-icons">shopping_cart</span>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
          </div>

          {/* Vista escritorio */}
          <div className="hidden lg:flex w-full items-center justify-between">
            {/* Izquierda: Ícono de inicio */}
            <Link
              to="/"
              className={`nav-link text-xl font-bold flex items-center gap-2 ${
                isActive("/")
                  ? "text-yellow-500"
                  : "text-white hover:text-yellow-500"
              }`}
            >
              <span
                className={`material-icons ${
                  isActive("/") ? "text-yellow-500" : "text-white"
                }`}
              >
                home
              </span>
              Inicio
            </Link>

            {/* Centro: Íconos de tienda y club */}
            <ul className="flex items-center space-x-8">
              <li
                className={`nav-link ${
                  isActive("/shop")
                    ? "text-yellow-500"
                    : "text-white hover:text-yellow-500"
                }`}
              >
                <Link to="/shop" className="flex items-center gap-2">
                  <span className="material-icons">store</span>
                  Tienda
                </Link>
              </li>
              <li
                className={`nav-link ${
                  isActive("/club")
                    ? "text-yellow-500"
                    : "text-white hover:text-yellow-500"
                }`}
              >
                <Link to="/club" className="flex items-center gap-2">
                  <span className="material-icons">star</span>
                  Club
                </Link>
              </li>
            </ul>

            {/* Derecha: Opciones de usuario */}
            <ul className="flex items-center space-x-8">
              {session ? (
                <>
                  <li
                    className="icon cursor-pointer relative"
                    onClick={openCart}
                  >
                    <span className="flex items-center gap-2">
                      <span className="material-icons">shopping_cart</span>
                      Carrito
                    </span>
                    {cart.length > 0 && (
                      <span className="absolute -top-3 -right-3 bg-purple-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {cart.length}
                      </span>
                    )}
                  </li>
                  <li
                  className={`nav-link ${
                    isActive("/micuenta")
                      ? "text-yellow-500"
                      : "text-white hover:text-yellow-500"
                  }`}
                >
                  <Link to="/micuenta" className="flex items-center gap-2">
                    <span className="material-icons">person</span>
                    Mi Cuenta
                  </Link>
                </li>
                  <li className="nav-link text-white hover:text-red-500">
                    <button
                      onClick={openModal}
                      className="flex items-center gap-2"
                    >
                      <span className="material-icons">logout</span>
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <li
                  className={`nav-link ${
                    isActive("/login")
                      ? "text-yellow-500"
                      : "text-white hover:text-yellow-500"
                  }`}
                >
                  <Link to="/login" className="flex items-center gap-2">
                    <span className="material-icons">login</span>
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </nav>
      </header>

      {/* Modal de logout */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
          <div className="bg-black p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              ¿Estás seguro de que deseas cerrar sesión?
            </h2>
            <div className="flex justify-end gap-4">
              <button
                className="bg-white text-black px-4 py-2 rounded hover:bg-gray-400"
                onClick={closeModal}
              >
                Cancelar
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={handleLogout}
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Menú hamburguesa para móvil */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50">
          <div className="bg-gray-800 p-6 w-3/4 max-w-xs h-full">
            <button
              className="text-white text-2xl mb-4"
              onClick={closeMobileMenu}
            >
              <span className="material-icons">close</span>
            </button>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/shop"
                  className="text-white hover:text-yellow-500"
                  onClick={closeMobileMenu}
                >
                  Tienda
                </Link>
              </li>
              <li>
                <Link
                  to="/club"
                  className="text-white hover:text-yellow-500"
                  onClick={closeMobileMenu}
                >
                  Club
                </Link>
              </li>
              {session ? (
                <>
                  <li>
                    <button
                      onClick={() => {
                        closeMobileMenu();
                        handleAccountRedirect();
                      }}
                      className="text-white hover:text-yellow-500"
                    >
                      Perfil
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={openModal}
                      className="text-white hover:text-red-500"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link
                    to="/login"
                    className="text-white hover:text-yellow-500"
                    onClick={closeMobileMenu}
                  >
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;