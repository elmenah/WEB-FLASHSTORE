import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseCliente"; // Asegúrate de tener configurado el cliente de Supabase

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!acceptTerms) {
      alert("Debes aceptar los términos y condiciones para registrarte.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setError("Ocurrió un error al registrarte. Intenta nuevamente.");
      } else {
        setSuccessMessage(
          "Registro exitoso. Redirigiendo al login después de 2 segundos..."
        );
        setTimeout(() => {
          navigate("/login"); // Redirige al login después de 2 segundos
        }, 2000);
      }
    } catch (err) {
      setError("Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="w-full max-w-4xl flex shadow-lg rounded-lg overflow-hidden">
        {/* Imagen de fondo */}
        <div className="hidden md:block w-1/2">
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
              Registro
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
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                />
                <label
                  htmlFor="acceptTerms"
                  className="ml-2 text-sm text-gray-300"
                >
                  Acepto los{" "}
                  <Link
                    to="/terms"
                    className="text-blue-500 underline"
                  >
                    términos y condiciones
                  </Link>
                  .
                </label>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold transition disabled:opacity-50"
              >
                {loading ? "Registrando..." : "Registrarme"}
              </button>
              <p className="text-sm text-gray-400 text-center">
                ¿Ya tienes una cuenta?{" "}
                <Link
                  to="/login"
                  className="text-blue-500 underline"
                >
                  Inicia sesión
                </Link>
              </p>
            </form>
            {error && (
              <p className="text-red-400 text-sm mt-4 text-center">{error}</p>
            )}
            {successMessage && (
              <p className="text-green-400 text-sm mt-4 text-center">
                {successMessage}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;