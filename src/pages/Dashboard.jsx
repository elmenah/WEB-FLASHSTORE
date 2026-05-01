import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseCliente';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  // Estados para paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const pedidosPorPagina = 20;

  // Estados para selección múltiple
  const [pedidosSeleccionados, setPedidosSeleccionados] = useState(new Set());
  const [seleccionarTodos, setSeleccionarTodos] = useState(false);

  // Estados para filtros
  const [filtros, setFiltros] = useState({
    cliente: '',
    productos: '',
    estado: 'todos',
    entregado: 'todos',
    fechaDesde: '',
    fechaHasta: ''
  });

  // Estados para ordenamiento
  const [ordenamiento, setOrdenamiento] = useState({
    campo: 'created_at',
    direccion: 'desc'
  });

  const [tabActivo, setTabActivo] = useState('pedidos');

  // Bot states
  const [botStats, setBotStats] = useState([]);
  const [botLoading, setBotLoading] = useState(false);
  const [botMsg, setBotMsg] = useState('');
  const [pavosInput, setPavosInput] = useState({});

  const [pavosGastados, setPavosGastados] = useState({
    total_pavos_gastados: 0,
    total_pedidos_entregados: 0,
    pavos_base_inicial: 0,
    fecha_ultima_actualizacion: null
  });

  const [ingresosTotales, setIngresosTotales] = useState({
    total_ingresos: 0,
    total_pedidos_pagados: 0,
    ingresos_base_inicial: 0, // ✅ Agregar base inicial
    fecha_ultima_actualizacion: null
  });

  const CLP = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
  });

  const BACKEND = 'https://backendflash.onrender.com';

  const getAdminToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || '';
  };

  const botFetch = async (path, options = {}) => {
    const token = await getAdminToken();
    const res = await fetch(`${BACKEND}${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', 'x-admin-token': token, ...(options.headers || {}) },
    });
    return res.json();
  };

  const cargarBotStats = async () => {
    setBotLoading(true);
    try {
      const data = await botFetch('/api/bot/stats');
      setBotStats(Array.isArray(data) ? data : []);
    } catch (e) {
      setBotMsg('Error conectando al bot');
    } finally {
      setBotLoading(false);
    }
  };

  const refreshBalances = async () => {
    setBotLoading(true);
    setBotMsg('');
    try {
      const data = await botFetch('/api/bot/refresh-balances', { method: 'POST' });
      setBotMsg('Saldos actualizados');
      cargarBotStats();
    } catch (e) {
      setBotMsg('Error actualizando saldos');
    } finally {
      setBotLoading(false);
    }
  };

  const reactivarBot = async (accountId, nombre) => {
    if (!confirm(`¿Reactivar bot ${nombre}?`)) return;
    try {
      await botFetch(`/api/bot/reactivar/${accountId}`, { method: 'POST' });
      setBotMsg(`${nombre} reactivado`);
      cargarBotStats();
    } catch (e) {
      setBotMsg('Error reactivando bot');
    }
  };

  const setPavos = async (accountId, nombre) => {
    const pavos = parseInt(pavosInput[accountId]);
    if (!pavos || isNaN(pavos)) { setBotMsg('Ingresá un número válido'); return; }
    try {
      await botFetch(`/api/bot/set-pavos/${accountId}`, {
        method: 'POST',
        body: JSON.stringify({ pavos }),
      });
      setBotMsg(`${nombre}: saldo actualizado a ${pavos} V-Bucks`);
      cargarBotStats();
    } catch (e) {
      setBotMsg('Error actualizando saldo');
    }
  };

  useEffect(() => {
    if (tabActivo === 'bot' && isAdmin) cargarBotStats();
  }, [tabActivo, isAdmin]);

  // Verificar si el usuario es administrador
  useEffect(() => {
    const verificarAdmin = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          navigate('/login');
          return;
        }

        // Verifica si el correo coincide con el del admin
        const correoAdmin = "menanicolas161@gmail.com";
        if (user.email !== correoAdmin) {
          alert('No tienes permisos de administrador');
          navigate('/');
          return;
        }

        setIsAdmin(true);
      } catch (error) {
        console.error('Error verificando admin:', error);
        navigate('/');
      }
    };

    verificarAdmin();
  }, [navigate]);

  // Cargar pedidos
  useEffect(() => {
    if (isAdmin) {
      cargarPedidos();
      cargarPavosGastados();
      cargarIngresosTotales();
    }
  }, [isAdmin]);

  const cargarPedidos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('pedidos')
        .select(`
          *,
          pedido_items (
            id,
            nombre_producto,
            precio_unitario,
            cantidad,
            imagen_url,
            pavos
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPedidos(data || []);
    } catch (error) {
      console.error('Error cargando pedidos:', error);
      alert('Error al cargar los pedidos');
    } finally {
      setLoading(false);
    }
  };

  // Nueva función para cargar pavos gastados
  const cargarPavosGastados = async () => {
    try {
      const { data, error } = await supabase
        .from('pavos_gastados')
        .select('*')
        .order('id', { ascending: false })
        .limit(1)
        .maybeSingle(); // ✅ Cambiar .single() por .maybeSingle()

      if (error && error.code !== 'PGRST116') {
        console.error('Error cargando pavos gastados:', error);
        return;
      }

      if (data) {
        setPavosGastados(data);
      }
    } catch (error) {
      console.error('Error cargando pavos gastados:', error);
    }
  };

  // Nueva función para cargar ingresos totales
  const cargarIngresosTotales = async () => {
    try {
      const { data, error } = await supabase
        .from('ingresos_totales')
        .select('*')
        .order('id', { ascending: false })
        .limit(1)
        .maybeSingle(); // ✅ Cambiar .single() por .maybeSingle()

      if (error && error.code !== 'PGRST116') {
        console.error('Error cargando ingresos totales:', error);
        return;
      }

      if (data) {
        setIngresosTotales(data);
      }
    } catch (error) {
      console.error('Error cargando ingresos totales:', error);
    }
  };

  const cambiarEstadoPedido = async (pedidoId, nuevoEstado) => {
    try {
      const { error } = await supabase
        .from('pedidos')
        .update({ estado: nuevoEstado })
        .eq('id', pedidoId);

      if (error) throw error;
      
      setPedidos(prev => prev.map(pedido => 
        pedido.id === pedidoId 
          ? { ...pedido, estado: nuevoEstado }
          : pedido
      ));

      // ✅ Recargar ingresos después de cambiar estado
      setTimeout(() => {
        cargarIngresosTotales();
      }, 1000);

    } catch (error) {
      console.error('Error actualizando estado:', error);
      alert('Error al actualizar el estado');
    }
  };

  const cambiarEntregado = async (pedidoId, entregado) => {
    try {
      const { error } = await supabase
        .from('pedidos')
        .update({ entregado: entregado === 'si' })
        .eq('id', pedidoId);

      if (error) throw error;
      
      setPedidos(prev => prev.map(pedido => 
        pedido.id === pedidoId 
          ? { ...pedido, entregado: entregado === 'si' }
          : pedido
      ));

      // ✅ Recargar pavos gastados después de cambiar entregado
      setTimeout(() => {
        cargarPavosGastados();
      }, 1000);

    } catch (error) {
      console.error('Error actualizando entrega:', error);
      alert('Error al actualizar el estado de entrega');
    }
  };

  // ✅ Función para actualizar pavos basándose en precios
  const actualizarPavosExistentes = async () => {
    if (!confirm('¿Estás seguro de que quieres actualizar los pavos de todos los pedidos existentes basándose en los precios?')) return;

    try {
      setLoading(true);
      
      // Actualizar pavos usando la fórmula precio / 4.4
      const { error } = await supabase.rpc('actualizar_pavos_pedidos');
      
      if (error) throw error;
      
      alert('Pavos actualizados correctamente');
      await cargarPedidos();
      
    } catch (error) {
      console.error('Error actualizando pavos:', error);
      alert(`Error al actualizar pavos: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const eliminarPedido = async (pedidoId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este pedido? Esta acción no se puede deshacer.')) return;

    try {
      const { error: errorItems } = await supabase
        .from('pedido_items')
        .delete()
        .eq('pedido_id', pedidoId);

      if (errorItems) throw errorItems;

      const { error: errorPedido } = await supabase
        .from('pedidos')
        .delete()
        .eq('id', pedidoId);

      if (errorPedido) throw errorPedido;

      setPedidos(prev => prev.filter(pedido => pedido.id !== pedidoId));
      alert('Pedido eliminado correctamente');
      
    } catch (error) {
      console.error('Error eliminando pedido:', error);
      alert(`Error al eliminar el pedido: ${error.message}`);
    }
  };

  const eliminarPedidosSeleccionados = async () => {
    if (pedidosSeleccionados.size === 0) {
      alert('No has seleccionado ningún pedido');
      return;
    }

    if (!confirm(`¿Estás seguro de que quieres eliminar ${pedidosSeleccionados.size} pedido(s)? Esta acción no se puede deshacer.`)) return;

    try {
      const pedidosIds = Array.from(pedidosSeleccionados);
      
      const { error: errorItems } = await supabase
        .from('pedido_items')
        .delete()
        .in('pedido_id', pedidosIds);

      if (errorItems) throw errorItems;

      const { error: errorPedidos } = await supabase
        .from('pedidos')
        .delete()
        .in('id', pedidosIds);

      if (errorPedidos) throw errorPedidos;

      setPedidos(prev => prev.filter(pedido => !pedidosSeleccionados.has(pedido.id)));
      setPedidosSeleccionados(new Set());
      setSeleccionarTodos(false);
      
      alert(`${pedidosIds.length} pedido(s) eliminado(s) correctamente`);
      
    } catch (error) {
      console.error('Error eliminando pedidos:', error);
      alert(`Error al eliminar los pedidos: ${error.message}`);
    }
  };

  const manejarSeleccionPedido = (pedidoId) => {
    setPedidosSeleccionados(prev => {
      const nuevaSeleccion = new Set(prev);
      if (nuevaSeleccion.has(pedidoId)) {
        nuevaSeleccion.delete(pedidoId);
      } else {
        nuevaSeleccion.add(pedidoId);
      }
      return nuevaSeleccion;
    });
  };

  const manejarSeleccionarTodos = () => {
    if (seleccionarTodos) {
      setPedidosSeleccionados(new Set());
    } else {
      setPedidosSeleccionados(new Set(pedidosPaginados.map(p => p.id)));
    }
    setSeleccionarTodos(!seleccionarTodos);
  };

  const manejarOrdenamiento = (campo) => {
    setOrdenamiento(prev => ({
      campo,
      direccion: prev.campo === campo && prev.direccion === 'asc' ? 'desc' : 'asc'
    }));
  };

  const calcularTotal = (items) => {
    return items.reduce((total, item) => total + (item.precio_unitario * item.cantidad), 0);
  };

  const calcularPavos = (items) => {
    return items.reduce((total, item) => {
      // ✅ Excluir "1 Mes Fortnite Crew" del cálculo de pavos
      if (item.nombre_producto.toLowerCase().includes('fortnite crew')) {
        return total;
      }
      return total + (item.pavos || 0);
    }, 0);
  };

  // Filtrar y ordenar pedidos
  const pedidosFiltrados = pedidos
    .filter(pedido => {
      const cumpleFiltros = 
        (pedido.correo.toLowerCase().includes(filtros.cliente.toLowerCase()) ||
         pedido.username_fortnite?.toLowerCase().includes(filtros.cliente.toLowerCase()) ||
         pedido.telefono?.toLowerCase().includes(filtros.cliente.toLowerCase())) && // ✅ Búsqueda por teléfono
        pedido.pedido_items.some(item => 
          item.nombre_producto.toLowerCase().includes(filtros.productos.toLowerCase())
        ) &&
        (filtros.estado === 'todos' || 
         pedido.estado.toLowerCase() === filtros.estado.toLowerCase() ||
         // ✅ Incluir compatibilidad con "No Pagado"
         (filtros.estado === 'pendiente de pago' && pedido.estado === 'No Pagado')
        ) &&
        (filtros.entregado === 'todos' || 
          (filtros.entregado === 'si' && pedido.entregado) ||
          (filtros.entregado === 'no' && !pedido.entregado)
        ) &&
        (!filtros.fechaDesde || new Date(pedido.created_at) >= new Date(filtros.fechaDesde)) &&
        (!filtros.fechaHasta || new Date(pedido.created_at) <= new Date(filtros.fechaHasta));
      
      return cumpleFiltros;
    })
    .sort((a, b) => {
      let valorA, valorB;
      
      switch (ordenamiento.campo) {
        case 'cliente':
          valorA = a.correo;
          valorB = b.correo;
          break;
        case 'productos':
          valorA = a.pedido_items.map(item => item.nombre_producto).join('');
          valorB = b.pedido_items.map(item => item.nombre_producto).join('');
          break;
        case 'pavos':
          valorA = calcularPavos(a.pedido_items);
          valorB = calcularPavos(b.pedido_items);
          break;
        case 'total':
          valorA = calcularTotal(a.pedido_items);
          valorB = calcularTotal(b.pedido_items);
          break;
        case 'estado':
          valorA = a.estado;
          valorB = b.estado;
          break;
        case 'created_at':
          valorA = new Date(a.created_at);
          valorB = new Date(b.created_at);
          break;
        default:
          valorA = a[ordenamiento.campo];
          valorB = b[ordenamiento.campo];
      }

      if (valorA < valorB) return ordenamiento.direccion === 'asc' ? -1 : 1;
      if (valorA > valorB) return ordenamiento.direccion === 'asc' ? 1 : -1;
      return 0;
    });

  // Paginación
  const totalPaginas = Math.ceil(pedidosFiltrados.length / pedidosPorPagina);
  const indiceInicio = (paginaActual - 1) * pedidosPorPagina;
  const indiceFin = indiceInicio + pedidosPorPagina;
  const pedidosPaginados = pedidosFiltrados.slice(indiceInicio, indiceFin);

  const resumen = {
    total: pedidos.length,
    pagados: pedidos.filter(p => p.estado === 'Pagado').length,
    // ✅ Incluir ambos estados posibles para pendientes
    pendientes: pedidos.filter(p => 
      p.estado === 'Pendiente de pago' || p.estado === 'No Pagado'
    ).length,
    entregados: pedidos.filter(p => p.entregado).length,
    // ✅ Usar ingresos de la tabla dedicada
    ingresoTotal: ingresosTotales.total_ingresos,
    // ✅ Usar directamente el total_pavos_gastados que YA incluye la base inicial
    pavosEnviados: pavosGastados.total_pavos_gastados
  };

  const IconoOrden = ({ campo }) => {
    if (ordenamiento.campo !== campo) {
      return <span className="text-gray-500">↕️</span>;
    }
    return <span>{ordenamiento.direccion === 'asc' ? '↑' : '↓'}</span>;
  };

  const recalcularPavosGastados = async () => {
    if (!confirm('¿Recalcular los pavos gastados totales?')) return;

    try {
      setLoading(true);
      const { error } = await supabase.rpc('recalcular_pavos_gastados');
      
      if (error) throw error;
      
      await cargarPavosGastados();
      alert('Pavos gastados recalculados correctamente');
      
    } catch (error) {
      console.error('Error recalculando pavos gastados:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const recalcularIngresosTotales = async () => {
    if (!confirm('¿Recalcular los ingresos totales?')) return;

    try {
      setLoading(true);
      const { error } = await supabase.rpc('recalcular_ingresos_totales');
      
      if (error) throw error;
      
      await cargarIngresosTotales();
      alert('Ingresos totales recalculados correctamente');
      
    } catch (error) {
      console.error('Error recalculando ingresos totales:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Función para cambiar la base inicial:
  const cambiarPavosBaseInicial = async () => {
    const nuevaBase = prompt('Ingresa la cantidad de pavos base inicial:', pavosGastados.pavos_base_inicial || 72300);
    
    if (nuevaBase === null) return; // Usuario canceló
    
    const baseNumerica = parseInt(nuevaBase);
    if (isNaN(baseNumerica) || baseNumerica < 0) {
      alert('Por favor ingresa un número válido');
      return;
    }

    if (!confirm(`¿Cambiar la base inicial a ${baseNumerica.toLocaleString()} pavos?`)) return;

    try {
      setLoading(true);
      const { error } = await supabase.rpc('actualizar_pavos_base_inicial', { nueva_base: baseNumerica });
      
      if (error) throw error;
      
      await cargarPavosGastados();
      alert(`Base inicial actualizada a ${baseNumerica.toLocaleString()} pavos`);
      
    } catch (error) {
      console.error('Error actualizando base inicial:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Función para cambiar la base inicial de ingresos:
  const cambiarIngresosBaseInicial = async () => {
    const nuevaBase = prompt('Ingresa la cantidad de ingresos base inicial:', ingresosTotales.ingresos_base_inicial || 245560);
    
    if (nuevaBase === null) return; // Usuario canceló
    
    const baseNumerica = parseInt(nuevaBase);
    if (isNaN(baseNumerica) || baseNumerica < 0) {
      alert('Por favor ingresa un número válido');
      return;
    }

    if (!confirm(`¿Cambiar la base inicial a $${baseNumerica.toLocaleString()}?`)) return;

    try {
      setLoading(true);
      const { error } = await supabase.rpc('actualizar_ingresos_base_inicial', { nueva_base: baseNumerica });
      
      if (error) throw error;
      
      await cargarIngresosTotales();
      alert(`Base inicial de ingresos actualizada a $${baseNumerica.toLocaleString()}`);
      
    } catch (error) {
      console.error('Error actualizando base inicial de ingresos:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 bg-gray-900 text-white">
      <div className="w-full px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard de Administración</h1>
          <p className="text-gray-400">Gestiona todos los pedidos de la tienda</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-700">
          <button
            onClick={() => setTabActivo('pedidos')}
            className={`px-6 py-3 font-semibold transition rounded-t-lg ${tabActivo === 'pedidos' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
          >
            Pedidos
          </button>
          <button
            onClick={() => setTabActivo('bot')}
            className={`px-6 py-3 font-semibold transition rounded-t-lg ${tabActivo === 'bot' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
          >
            Bot Manager
          </button>
        </div>

        {/* ===== BOT MANAGER TAB ===== */}
        {tabActivo === 'bot' && (
          <div>
            {/* Mensaje de estado */}
            {botMsg && (
              <div className="mb-4 px-4 py-3 bg-blue-900 border border-blue-500 rounded-lg text-blue-200">
                {botMsg}
              </div>
            )}

            {/* Acciones globales */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={cargarBotStats}
                disabled={botLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                Actualizar
              </button>
              <button
                onClick={refreshBalances}
                disabled={botLoading}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition disabled:opacity-50"
              >
                Sincronizar Saldos
              </button>
              <button
                onClick={async () => {
                  if (!confirm('¿Recargar todos los bots?')) return;
                  const data = await botFetch('/api/bot/reload', { method: 'POST' });
                  setBotMsg(data?.message || 'Recarga enviada');
                }}
                disabled={botLoading}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
              >
                Recargar Bots
              </button>
            </div>

            {/* Cargando */}
            {botLoading && (
              <div className="flex items-center gap-2 text-gray-400 mb-4">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                Cargando...
              </div>
            )}

            {/* Tarjetas de bots */}
            {!botLoading && botStats.length === 0 && (
              <div className="text-center py-16 text-gray-500">
                No hay bots registrados o no se pudo conectar al servidor.
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {botStats.map((bot) => (
                <div
                  key={bot.account_id}
                  className={`bg-gray-800 rounded-xl border p-6 ${bot.online ? 'border-green-500' : 'border-gray-600'}`}
                >
                  {/* Nombre + estado */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">{bot.display_name || bot.account_id}</h3>
                      <p className="text-xs text-gray-400 truncate max-w-[180px]">{bot.account_id}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${bot.online ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-400'}`}>
                      {bot.online ? 'Online' : 'Offline'}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div className="bg-gray-700 rounded-lg p-3">
                      <p className="text-gray-400 text-xs">V-Bucks</p>
                      <p className="text-yellow-400 font-bold text-lg">{(bot.vbucks ?? 0).toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-3">
                      <p className="text-gray-400 text-xs">Regalos enviados</p>
                      <p className="text-purple-400 font-bold text-lg">{bot.gifts_sent ?? 0}</p>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-3">
                      <p className="text-gray-400 text-xs">Amigos</p>
                      <p className="text-blue-400 font-bold text-lg">{bot.friends_count ?? 0}</p>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-3">
                      <p className="text-gray-400 text-xs">Pagado</p>
                      <p className={`font-bold text-lg ${bot.is_pagado ? 'text-green-400' : 'text-red-400'}`}>
                        {bot.is_pagado ? 'Sí' : 'No'}
                      </p>
                    </div>
                  </div>

                  {/* Reactivar si no está pagado */}
                  {!bot.is_pagado && (
                    <button
                      onClick={() => reactivarBot(bot.account_id, bot.display_name)}
                      className="w-full mb-3 px-3 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition"
                    >
                      Reactivar bot
                    </button>
                  )}

                  {/* Actualizar V-Bucks manualmente */}
                  <div className="flex gap-2 mt-2">
                    <input
                      type="number"
                      placeholder="V-Bucks"
                      value={pavosInput[bot.account_id] || ''}
                      onChange={(e) => setPavosInput(prev => ({ ...prev, [bot.account_id]: e.target.value }))}
                      className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                    />
                    <button
                      onClick={() => setPavos(bot.account_id, bot.display_name)}
                      className="px-3 py-2 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700 transition"
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== PEDIDOS TAB ===== */}
        {tabActivo === 'pedidos' && <>

        {/* Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-gray-300">Total Pedidos</h3>
            <p className="text-3xl font-bold text-blue-400">{resumen.total}</p>
          </div>
          <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-gray-300">Pagados</h3>
            <p className="text-3xl font-bold text-green-400">{resumen.pagados}</p>
          </div>
          <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-gray-300">Pendientes</h3>
            <p className="text-3xl font-bold text-yellow-400">{resumen.pendientes}</p>
          </div>
          <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-gray-300">Entregados</h3>
            <p className="text-3xl font-bold text-purple-400">{resumen.entregados}</p>
          </div>
          <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-gray-300">Ingresos</h3>
            <p className="text-2xl font-bold text-green-400">{CLP.format(resumen.ingresoTotal)}</p>
            
            
            
            {ingresosTotales.fecha_ultima_actualizacion && (
              <p className="text-xs text-gray-500 mt-1">
                Actualizado: {new Date(ingresosTotales.fecha_ultima_actualizacion).toLocaleString('es-CL')}
              </p>
            )}
          </div>
          
          {/* ✅ Card de Pavos Gastados */}
          <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-gray-300">Pavos Gastados</h3>
            <p className="text-2xl font-bold text-yellow-400">{resumen.pavosEnviados.toLocaleString()} </p>
            
            
            
            {pavosGastados.fecha_ultima_actualizacion && (
              <p className="text-xs text-gray-500 mt-1">
                Actualizado: {new Date(pavosGastados.fecha_ultima_actualizacion).toLocaleString('es-CL')}
              </p>
            )}
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-gray-800 rounded-lg shadow p-6 mb-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Filtros</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Cliente</label>
              <input
                type="text"
                value={filtros.cliente}
                onChange={(e) => setFiltros(prev => ({ ...prev, cliente: e.target.value }))}
                placeholder="Buscar por email o usuario de Fortnite..."
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Productos</label>
              <input
                type="text"
                value={filtros.productos}
                onChange={(e) => setFiltros(prev => ({ ...prev, productos: e.target.value }))}
                placeholder="Buscar productos..."
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Estado</label>
              <select
                value={filtros.estado}
                onChange={(e) => setFiltros(prev => ({ ...prev, estado: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="todos">Todos</option>
                <option value="pendiente de pago">Pendiente de pago</option>
                <option value="pagado">Pagado</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Entregado</label>
              <select
                value={filtros.entregado}
                onChange={(e) => setFiltros(prev => ({ ...prev, entregado: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="todos">Todos</option>
                <option value="si">Entregados</option>
                <option value="no">Sin entregar</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Desde</label>
              <input
                type="date"
                value={filtros.fechaDesde}
                onChange={(e) => setFiltros(prev => ({ ...prev, fechaDesde: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Hasta</label>
              <input
                type="date"
                value={filtros.fechaHasta}
                onChange={(e) => setFiltros(prev => ({ ...prev, fechaHasta: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={cargarPedidos}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              🔄 Actualizar
            </button>
            <button
              onClick={() => {
                setFiltros({
                  cliente: '',
                  productos: '',
                  estado: 'todos',
                  entregado: 'todos',
                  fechaDesde: '',
                  fechaHasta: ''
                });
                setPaginaActual(1);
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              🧹 Limpiar filtros
            </button>
            
            
            
            {/* ✅ Botón para eliminar seleccionados */}
            {pedidosSeleccionados.size > 0 && (
              <button
                onClick={eliminarPedidosSeleccionados}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                🗑️ Eliminar seleccionados ({pedidosSeleccionados.size})
              </button>
            )}
            
            {/* ✅ Botón para recalcular pavos gastados */}
            <button
              onClick={recalcularPavosGastados}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
              title="Recalcular pavos gastados totales"
            >
              Recalcular Pavos Gastados
            </button>

            {/* ✅ Botón para recalcular ingresos */}
            <button
              onClick={recalcularIngresosTotales}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              title="Recalcular ingresos totales"
            >
              💰 Recalcular Ingresos
            </button>

        
          </div>
        </div>

        {/* Información de paginación */}
        <div className="mb-4 text-gray-400">
          Mostrando {indiceInicio + 1}-{Math.min(indiceFin, pedidosFiltrados.length)} de {pedidosFiltrados.length} pedidos
        </div>

        {/* Tabla de pedidos */}
        <div className="bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-700">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={seleccionarTodos}
                      onChange={manejarSeleccionarTodos}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Pedido
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600"
                    onClick={() => manejarOrdenamiento('cliente')}
                  >
                    Cliente <IconoOrden campo="cliente" />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Teléfono
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600"
                    onClick={() => manejarOrdenamiento('productos')}
                  >
                    Productos <IconoOrden campo="productos" />
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600"
                    onClick={() => manejarOrdenamiento('pavos')}
                  >
                    Pavos <IconoOrden campo="pavos" />
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600"
                    onClick={() => manejarOrdenamiento('total')}
                  >
                    Total <IconoOrden campo="total" />
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600"
                    onClick={() => manejarOrdenamiento('estado')}
                  >
                    Estado <IconoOrden campo="estado" />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Entregado
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600"
                    onClick={() => manejarOrdenamiento('created_at')}
                  >
                    Fecha <IconoOrden campo="created_at" />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {pedidosPaginados.map((pedido) => (
                  <tr key={pedido.id} className="hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={pedidosSeleccionados.has(pedido.id)}
                        onChange={() => manejarSeleccionPedido(pedido.id)}
                        className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">#{pedido.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">{pedido.correo}</div>
                      <div className="text-sm text-gray-400">🎮 {pedido.username_fortnite}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">{pedido.telefono || '-'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        {pedido.pedido_items.map((item, idx) => (
                          <div key={idx} className="text-sm text-white mb-1">
                            • {item.nombre_producto} x{item.cantidad}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-purple-400">
                        {calcularPavos(pedido.pedido_items).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-green-400">
                        {CLP.format(calcularTotal(pedido.pedido_items))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={pedido.estado}
                        onChange={(e) => cambiarEstadoPedido(pedido.id, e.target.value)}
                        className="text-xs px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Pendiente de pago">Pendiente de pago</option>
                        <option value="Pagado">Pagado</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={pedido.entregado ? 'si' : 'no'}
                        onChange={(e) => cambiarEntregado(pedido.id, e.target.value)}
                        className="text-xs px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="no">No</option>
                        <option value="si">Sí</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {new Date(pedido.created_at).toLocaleDateString('es-CL')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => eliminarPedido(pedido.id)}
                        className="text-red-400 hover:text-red-300 transition"
                        title="Eliminar pedido"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pedidosPaginados.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No hay pedidos que mostrar</p>
            </div>
          )}
        </div>

        {/* Paginación */}
        {totalPaginas > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
                disabled={paginaActual === 1}
                className="px-3 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition"
              >
                ← Anterior
              </button>
              <span className="text-gray-400">
                Página {paginaActual} de {totalPaginas}
              </span>
              <button
                onClick={() => setPaginaActual(prev => Math.min(prev + 1, totalPaginas))}
                disabled={paginaActual === totalPaginas}
                className="px-3 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition"
              >
                Siguiente →
              </button>
            </div>
            <div className="text-gray-400 text-sm">
              {pedidosPorPagina} pedidos por página
            </div>
          </div>
        )}

        </>}
      </div>
    </div>
  );
};

export default Dashboard;
