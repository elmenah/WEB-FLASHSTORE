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

          // Simular la obtención de pedidos desde la base de datos
          const { data: ordersData, error: ordersError } = await supabase
            .from('orders') // Reemplaza 'orders' con el nombre de tu tabla de pedidos
            .select('*')
            .eq('user_email', userEmail); // Filtrar por el correo del usuario

          if (ordersError) {
            console.error('Error al obtener pedidos:', ordersError.message);
            return;
          }

          setOrders(ordersData);

          // Calcular el total gastado
          const total = ordersData.reduce((acc, order) => acc + order.amount, 0);
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
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Mi Cuenta</h1>
      {user && (
        <div className="mb-6">
          <p><strong>Correo:</strong> {user.email}</p>
        </div>
      )}
      <h2 className="text-xl font-semibold mb-4">Pedidos</h2>
      {orders.length > 0 ? (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b border-gray-700 py-2">Producto</th>
              <th className="border-b border-gray-700 py-2">Cantidad</th>
              <th className="border-b border-gray-700 py-2">Monto</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="border-b border-gray-700 py-2">{order.product_name}</td>
                <td className="border-b border-gray-700 py-2">{order.quantity}</td>
                <td className="border-b border-gray-700 py-2">${order.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No tienes pedidos registrados.</p>
      )}
      <div className="mt-6">
        <p><strong>Total gastado:</strong> ${totalSpent.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default MiCuenta;