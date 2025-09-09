import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseCliente';

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
      <div className="max-w-4xl w-full p-6 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">Mi Cuenta</h1>
        {user && (
          <div className="mb-6 text-center">
            <p><strong>Correo:</strong> {user.email}</p>
          </div>
        )}
        <h2 className="text-xl font-semibold mb-4 text-center">Pedidos</h2>
        {orders.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border-b border-gray-700 py-2">Producto</th>
                <th className="border-b border-gray-700 py-2">Cantidad</th>
                <th className="border-b border-gray-700 py-2">Precio Unitario</th>
                <th className="border-b border-gray-700 py-2">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((pedido) =>
                pedido.pedido_items.map((item, index) => (
                  <tr key={`${pedido.id}-${index}`}>
                    <td className="border-b border-gray-700 py-2">{item.nombre_producto}</td>
                    <td className="border-b border-gray-700 py-2">{item.cantidad}</td>
                    <td className="border-b border-gray-700 py-2">${item.precio_unitario}</td>
                    <td className="border-b border-gray-700 py-2">${item.subtotal}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : (
          <p className="text-center">No tienes pedidos registrados.</p>
        )}
        <div className="mt-6 text-center">
          <p><strong>Total gastado:</strong> ${totalSpent}</p>
        </div>
      </div>
    </div>
  );
};

export default MiCuenta;