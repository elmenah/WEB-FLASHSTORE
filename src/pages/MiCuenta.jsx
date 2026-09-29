import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseCliente';
import { Link } from 'react-router-dom';
import { formatCLP } from '../config/prices';

const MiCuenta = () => {
  const [user, setUser] = useState(null); // Información del usuario
  const [orders, setOrders] = useState([]); // Pedidos del usuario
  const [totalSpent, setTotalSpent] = useState(0); // Total gastado
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true); setError('');
      try {
        // Obtener la sesión actual
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          throw sessionError;
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
              entregado,
              pedido_items (
                nombre_producto,
                cantidad,
                precio_unitario,
                entregado,
                subtotal
              )
            `)
            .eq('user_id', sessionData.session.user.id).order('created_at', { ascending: false });

          if (pedidosError) {
            throw pedidosError;
          }

          setOrders(pedidosData);

          // Calcular el total gastado
          const total = pedidosData.filter(p => p.estado === 'Pagado').reduce((acc, pedido) => {
            const subtotal = pedido.pedido_items.reduce((subAcc, item) => subAcc + Number(item.subtotal || 0), 0);
            return acc + subtotal;
          }, 0);

          setTotalSpent(total);
        }
      } catch (error) {
        setError('No pudimos cargar tus pedidos. Vuelve a intentarlo.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [refresh]);

  if (loading) {
    return <p className="text-center text-gray-500">Cargando...</p>;
  }

  const getInitials = (name = '') => {
    const parts = name.split(' ').filter(Boolean);
    if (parts.length === 0) return '??';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6 text-center text-white drop-shadow">Mi Cuenta</h1>
        {/* Resumen superior */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800/60 backdrop-blur-sm ring-1 ring-white/5 rounded-xl p-6 flex flex-col items-center shadow-lg border border-gray-700 min-h-[88px]">
            <span className="text-gray-300 text-xs mb-1">Correo</span>
            <span className="font-semibold text-white break-all">{user?.email}</span>
          </div>
          <div className="bg-gray-800/60 backdrop-blur-sm ring-1 ring-white/5 rounded-xl p-6 flex flex-col items-center shadow-lg border border-gray-700 min-h-[88px]">
            <span className="text-gray-300 text-xs mb-1">Total gastado</span>
            <span className="font-bold text-green-400 text-lg">{formatCLP(totalSpent)}</span>
          </div>
          <div className="bg-gray-800/60 backdrop-blur-sm ring-1 ring-white/5 rounded-xl p-6 flex flex-col items-center shadow-lg border border-gray-700 min-h-[88px]">
            <span className="text-gray-300 text-xs mb-1">Pedidos</span>
            <span className="font-bold text-cyan-400 text-lg">{orders.length}</span>
          </div>
        </div>

        <div className="flex justify-center mb-4"><button className="flash-button flash-button-secondary" onClick={() => setRefresh(n => n+1)}>Actualizar pedidos</button></div>
        {error && <p role="alert" className="text-red-300 text-center mb-4">{error}</p>}
        <h2 className="text-2xl font-semibold mb-4 text-white text-center">Historial de Pedidos</h2>
        {error ? null : orders.length > 0 ? (
          <div className="flex flex-col gap-6">
            {orders.map((pedido) => (
              <div key={pedido.id} className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 gap-2">
                  <div className="flex flex-col md:flex-row md:items-center gap-2">
                    <span className="text-sm text-gray-400">Pedido:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">#{String(pedido.id).slice(0, 8)}</span>
                      <button
                        onClick={() => navigator.clipboard?.writeText(pedido.id)}
                        title="Copiar ID"
                        className="ml-1 text-xs text-gray-400 hover:text-gray-200"
                        aria-label={`Copiar ID pedido ${pedido.id}`}
                      >
                        📋
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-2">
                    <span className="text-sm text-gray-400">Fecha:</span>
                    <span className="text-white">{new Date(pedido.created_at).toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-2">
                    <span className="text-sm text-gray-400">Estado:</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${pedido.estado === 'Pagado' ? 'bg-green-600 text-white' : 'bg-yellow-600 text-white'}`}>{pedido.estado}</span>
                  </div>
                </div>

                <p className="flash-order-progress" role="status">{pedido.estado === 'Pagado' ? ((pedido.entregado || (pedido.pedido_items.length && pedido.pedido_items.every(item => item.entregado))) ? 'Entregado · Todos los productos tienen entrega confirmada.' : pedido.pedido_items.some(item => item.entregado) ? 'Entrega parcial · Quedan productos por entregar.' : 'Pago confirmado · Pendiente de entrega.') : pedido.estado === 'Rechazado' ? 'Pago rechazado · No se confirmó el cobro.' : pedido.estado === 'Anulado' ? 'Pedido anulado.' : 'Pendiente de pago · La entrega comienza tras la confirmación.'}</p>
                {/* Desktop / Tablet: table view */}
                <div className="overflow-x-auto hidden md:block">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr>
                        <th className="border-b border-gray-700 py-2 text-gray-300">Img</th>
                        <th className="border-b border-gray-700 py-2 text-gray-300">Producto</th>
                        <th className="border-b border-gray-700 py-2 text-gray-300">Cantidad</th>
                        <th className="border-b border-gray-700 py-2 text-gray-300">Precio</th>
                        <th className="border-b border-gray-700 py-2 text-gray-300">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pedido.pedido_items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-700 transition-colors">
                          <td className="border-b border-gray-700 py-2 text-white w-16">
                            <div className="w-10 h-10 bg-gray-700 rounded flex items-center justify-center text-sm text-white">{getInitials(item.nombre_producto)}</div>
                          </td>
                          <td className="border-b border-gray-700 py-2 text-white">{item.nombre_producto}<small className="block text-gray-400">{item.entregado ? 'Entregado' : 'Sin entrega confirmada'}</small></td>
                          <td className="border-b border-gray-700 py-2 text-white">{item.cantidad}</td>
                          <td className="border-b border-gray-700 py-2 text-white">{formatCLP(Number(item.precio_unitario) || 0)}</td>
                          <td className="border-b border-gray-700 py-2 text-white">{formatCLP(Number(item.subtotal) || 0)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile: card list view */}
                <div className="md:hidden mt-3">
                  {pedido.pedido_items.map((item, idx) => (
                    <div key={idx} className="bg-gray-800/50 rounded p-3 mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-700 rounded flex items-center justify-center text-sm text-white">{getInitials(item.nombre_producto)}</div>
                        <div className="flex-1">
                          <div className="font-semibold text-white">{item.nombre_producto}</div><small className="text-gray-400">{item.entregado ? 'Entregado' : 'Sin entrega confirmada'}</small>
                          <div className="text-sm text-gray-400">{item.cantidad} × {formatCLP(Number(item.precio_unitario) || 0)}</div>
                        </div>
                        <div className="font-bold text-white">{formatCLP(Number(item.subtotal) || 0)}</div>
                      </div>
                    </div>
                  ))}
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
