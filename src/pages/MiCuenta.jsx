import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseCliente';
import { Link } from 'react-router-dom';

const MiCuenta = () => {
  const [user, setUser] = useState(null); // Información del usuario
  const [orders, setOrders] = useState([]); // Pedidos del usuario
  const [totalSpent, setTotalSpent] = useState(0); // Total gastado
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Obtener la sesión actual
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error('Error al obtener sesión:', sessionError.message);
          return;
        }

        if (sessionData.session) {
          // Obtener información del usuario
          const userEmail = sessionData.session.user.email;
          setUser({ email: userEmail });

          // Obtener los pedidos del usuario desde la tabla 'pedidos' y sus detalles desde 'pedido_items'
          const { data: pedidosData, error: pedidosError } = await supabase
            .from('pedidos')
            .select(`
              id,
              created_at,
              estado,
              pedido_items (
                nombre_producto,
                cantidad,
                precio_unitario,
                subtotal
              )
            `)
            .eq('correo', userEmail)
            .eq('estado', 'Pagado'); // Filtrar solo los pedidos con estado "Pagado"

          if (pedidosError) {
            console.error('Error al obtener pedidos:', pedidosError.message);
            return;
          }

          setOrders(pedidosData);

          // Calcular el total gastado
          const total = pedidosData.reduce((acc, pedido) => {
            const subtotal = pedido.pedido_items.reduce((subAcc, item) => subAcc + item.subtotal, 0);
            return acc + subtotal;
          }, 0);

          setTotalSpent(total);
        }
      } catch (error) {
        console.error('Error al obtener datos del usuario:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Cargando...</p>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-white drop-shadow">Mi Cuenta</h1>
        {/* Resumen superior */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800 rounded-xl p-5 flex flex-col items-center shadow-lg border border-gray-700">
            <span className="text-gray-400 text-xs mb-1">Correo</span>
            <span className="font-semibold text-white break-all">{user?.email}</span>
          </div>
          <div className="bg-gray-800 rounded-xl p-5 flex flex-col items-center shadow-lg border border-gray-700">
            <span className="text-gray-400 text-xs mb-1">Total gastado</span>
            <span className="font-bold text-green-400 text-lg">${totalSpent}</span>
          </div>
          <div className="bg-gray-800 rounded-xl p-5 flex flex-col items-center shadow-lg border border-gray-700">
            <span className="text-gray-400 text-xs mb-1">Pedidos</span>
            <span className="font-bold text-cyan-400 text-lg">{orders.length}</span>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-4 text-white text-center">Historial de Pedidos</h2>
        {orders.length > 0 ? (
          <div className="flex flex-col gap-6">
            {orders.map((pedido) => (
              <div key={pedido.id} className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 gap-2">
                  <div className="flex flex-col md:flex-row md:items-center gap-2">
                    <span className="text-sm text-gray-400">Pedido:</span>
                    <span className="font-semibold text-white">#{pedido.id.slice(0, 8)}</span>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-2">
                    <span className="text-sm text-gray-400">Fecha:</span>
                    <span className="text-white">{new Date(pedido.created_at).toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-2">
                    <span className="text-sm text-gray-400">Estado:</span>
                    <span className={`font-bold ${pedido.estado === 'Pagado' ? 'text-green-400' : 'text-yellow-400'}`}>{pedido.estado}</span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr>
                        <th className="border-b border-gray-700 py-2 text-gray-300">Producto</th>
                        <th className="border-b border-gray-700 py-2 text-gray-300">Cantidad</th>
                        <th className="border-b border-gray-700 py-2 text-gray-300">Precio Unitario</th>
                        <th className="border-b border-gray-700 py-2 text-gray-300">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pedido.pedido_items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="border-b border-gray-700 py-2 text-white">{item.nombre_producto}</td>
                          <td className="border-b border-gray-700 py-2 text-white">{item.cantidad}</td>
                          <td className="border-b border-gray-700 py-2 text-white">${item.precio_unitario}</td>
                          <td className="border-b border-gray-700 py-2 text-white">${item.subtotal}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-gray-300 mb-4 text-lg">No tienes pedidos registrados.</p>
            <Link to="/shop" className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-cyan-500 text-white font-bold shadow-lg hover:from-green-600 hover:to-cyan-600 transition">Ir a la tienda</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MiCuenta;