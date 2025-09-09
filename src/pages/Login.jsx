import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseCliente';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        console.log('Respuesta de getSession:', data); // Inspecciona la respuesta
        if (error) {
          console.error('Error al verificar la sesión:', error.message);
          return;
        }
        if (data?.session) {
          console.log('Sesión activa:', data.session);
          navigate('/'); // Redirige al inicio si hay una sesión activa
        }
      } catch (err) {
        console.error('Error inesperado al verificar la sesión:', err.message);
      }
    };

    checkSession();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError('Credenciales incorrectas. Intenta nuevamente.');
      } else if (data.session) {
        navigate('/'); // Redirige al inicio después del login exitoso
      }
    } catch (err) {
      setError('Ocurrió un error al iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: "https://tioflashstore.netlify.app/login",
        },
      });

      if (error) {
        setError('Ocurrió un error al iniciar sesión con Google.');
      }
    } catch (err) {
      setError('Ocurrió un error al iniciar sesión con Google.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900 pt-14">
      <div className="w-full max-w-4xl flex shadow-lg rounded-lg overflow-hidden">
        <div className="w-1/2 hidden md:block">
          <img 
            src="/Imagenes/og-s2-line-up-1920x1080-1114b1e89809.webp" 
            alt="Imagen de fondo"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="w-full md:w-1/2 bg-gray-800 p-8 flex flex-col justify-center">
          <div className="w-full max-w-md bg-gray-800 p-6">
            <h2 className="text-2xl font-bold text-gray-200 mb-4">Login</h2>
            <form className="flex flex-col" onSubmit={handleSubmit}>
              <input 
                type="email"
                placeholder="Correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                required
              />
              <input 
                type="password"
                placeholder="Clave"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                required
              />
              
              <div className="flex items-center justify-between flex-wrap">
                <label className="text-sm text-gray-200 cursor-pointer">
                  <input className="mr-2" type="checkbox" />
                  Recuérdame
                </label>
                <a className="text-sm text-blue-500 hover:underline mb-0.5" href="#">
                  ¿Olvidaste tu clave?
                </a>
              </div>

              <p className="text-white mt-4">
                ¿No tienes una cuenta? 
                <Link className="text-sm text-blue-500 hover:underline ml-1" to="/register">
                  Regístrate
                </Link>
              </p>

              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-indigo-600 hover:to-blue-600 transition ease-in-out duration-150 disabled:opacity-50"
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="bg-white text-gray-800 font-bold py-2 px-4 rounded-md mt-4 hover:bg-gray-200 transition ease-in-out duration-150 flex items-center justify-center border border-gray-300 shadow-md disabled:opacity-50"
              >
                <img 
                  src="https://img.icons8.com/?size=100&id=V5cGWnc9R4xj&format=png&color=000000" 
                  alt="Google"
                  className="w-5 h-5 mr-2"
                />
                Iniciar sesión con Google
              </button>
            </form>
            {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
