import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../supabaseCliente';

const AuthGuard = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error al verificar la sesión:', error.message);
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(!!data.session); // Verifica si hay una sesión activa
      }
      setLoading(false);
    };

    checkSession();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Cargando...</p>; // Mostrar un indicador de carga mientras se verifica la sesión
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />; // Redirigir al login si no está autenticado
  }

  return children; // Renderizar el contenido protegido si está autenticado
};

export default AuthGuard;