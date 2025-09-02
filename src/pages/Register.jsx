import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/css/registro.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!acceptTerms) {
      alert("Debes aceptar los términos y condiciones para registrarte.");
      return;
    }

    setLoading(true);

    // Simulate registration process
    setTimeout(() => {
      setLoading(false);
      alert('Usuario registrado correctamente');
      navigate('/login');
    }, 2000);
  };

  const handleGoogleRegister = () => {
    if (!acceptTerms) {
      alert("Debes aceptar los términos y condiciones para registrarte.");
      return;
    }

    setLoading(true);
    
    // Simulate Google registration
    setTimeout(() => {
      setLoading(false);
      alert('Registro con Google exitoso');
      navigate('/');
    }, 2000);
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
            <h2 className="text-2xl font-bold text-gray-200 mb-4">Registro</h2>
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

              <div className="mb-4">
                <label className="checkbox-wrapper">
                  <input 
                    type="checkbox" 
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                  />
                  <div className="checkmark">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M20 6L9 17L4 12" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                  </div>
                  <span className="label">Soy mayor de 18 años.</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-indigo-600 hover:to-blue-600 transition ease-in-out duration-150 disabled:opacity-50"
              >
                {loading ? 'Registrando...' : 'Registrarme'}
              </button>

              <button
                type="button"
                onClick={handleGoogleRegister}
                disabled={loading}
                className="bg-white text-gray-800 font-bold py-2 px-4 rounded-md mt-4 hover:bg-gray-200 transition ease-in-out duration-150 flex items-center justify-center border border-gray-300 shadow-md disabled:opacity-50"
              >
                <img 
                  src="https://img.icons8.com/?size=100&id=V5cGWnc9R4xj&format=png&color=000000" 
                  alt="Google"
                  className="w-5 h-5 mr-2"
                />
                Registro con Google
              </button>

              <Link to="/login" className="text-white mt-4 hover:text-blue-400 transition-colors">
                Ya tengo una cuenta
              </Link>
            </form>
          </div>
        </div>
      </div>

      {loading && (
        <div className="spinner">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      )}
    </div>
  );
};

export default Register;