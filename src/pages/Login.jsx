import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseCliente";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error al verificar la sesión:", error.message);
          return;
        }
        if (data?.session) {
          navigate("/"); // Redirige al inicio si hay una sesión activa
        }
      } catch (err) {
        console.error("Error inesperado al verificar la sesión:", err.message);
      }
    };

    checkSession();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError("Credenciales incorrectas. Intenta nuevamente.");
      } else if (data.session) {
        navigate("/"); // Redirige al inicio después del login exitoso
      }
    } catch (err) {
      setError("Ocurrió un error al iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: "https://tioflashstore.netlify.app/login",
        },
      });

      if (error) {
        setError("Ocurrió un error al iniciar sesión con Google.");
      }
    } catch (err) {
      setError("Ocurrió un error al iniciar sesión con Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="w-full max-w-4xl flex flex-col md:flex-row shadow-lg rounded-lg overflow-hidden">
        {/* Imagen de fondo */}
        <div className="w-full md:w-1/2 h-64 md:h-auto">
          <img
            src="/Imagenes/og-s2-line-up-1920x1080-1114b1e89809.webp"
            alt="Imagen de fondo"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Formulario */}
        <div className="w-full md:w-1/2 bg-gray-800 p-8 flex flex-col justify-center">
          <div className="w-full max-w-md mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              Login
            </h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm text-gray-300 mb-2"
                >
                  Correo Electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="tuemail@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg bg-gray-700 border border-gray-600 p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm text-gray-300 mb-2"
                >
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg bg-gray-700 border border-gray-600 p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-500 hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold transition disabled:opacity-50"
              >
                {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </button>
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full py-3 rounded-lg bg-white text-gray-800 font-semibold border border-gray-300 hover:bg-gray-200 transition disabled:opacity-50 flex items-center justify-center"
              >
                <img
                  src="https://img.icons8.com/?size=100&id=V5cGWnc9R4xj&format=png&color=000000"
                  alt="Google"
                  className="w-5 h-5 mr-2"
                />
                Iniciar sesión con Google
              </button>
              <p className="text-sm text-gray-400 text-center">
                ¿No tienes una cuenta?{" "}
                <Link to="/register" className="text-blue-500 underline">
                  Regístrate
                </Link>
              </p>
            </form>
            {error && (
              <p className="text-red-400 text-sm mt-4 text-center">{error}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
