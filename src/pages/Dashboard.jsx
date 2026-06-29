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
  const [friendInput, setFriendInput] = useState('');
  const [friendResult, setFriendResult] = useState(null);
  const [friendLoading, setFriendLoading] = useState(false);
  const [slotsInput, setSlotsInput] = useState({});
  const [tabComando, setTabComando] = useState('herramientas');
  const [selectedBotId, setSelectedBotId] = useState('');
  const [tiendaItems, setTiendaItems] = useState([]);
  const [tiendaLoading, setTiendaLoading] = useState(false);
  const [tiendaBusqueda, setTiendaBusqueda] = useState('');
  const [friendsList, setFriendsList] = useState([]);
  const [friendsLoading, setFriendsLoading] = useState(false);
  const [regaloEpicName, setRegaloEpicName] = useState('');
  const [regaloSelectedItem, setRegaloSelectedItem] = useState(null);
  const [regaloLoading, setRegaloLoading] = useState(false);
  const [giftHistory, setGiftHistory] = useState([]);
  const [pendingGifts, setPendingGifts] = useState([]);
  const [historialLoading, setHistorialLoading] = useState(false);
  const [pendientesLoading, setPendientesLoading] = useState(false);

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
      const stats = Array.isArray(data) ? data : [];
      setBotStats(stats);
      if (stats.length > 0) {
        setSelectedBotId(prev => prev || stats[0].account_id);
      }
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

  const verificarAmigo = async () => {
    if (!friendInput.trim()) { setBotMsg('Ingresa un nombre de usuario'); return; }
    setFriendLoading(true);
    setFriendResult(null);
    setBotMsg('');
    try {
      const data = await botFetch(`/api/bot/es-amigo/${encodeURIComponent(friendInput.trim())}`);
      setFriendResult(data);
    } catch (e) {
      setBotMsg('Error verificando amistad');
    } finally {
      setFriendLoading(false);
    }
  };

  const agregarAmigo = async () => {
    if (!friendInput.trim()) { setBotMsg('Ingresa un nombre de usuario'); return; }
    setBotMsg('');
    try {
      const data = await botFetch('/api/bot/agregar', {
        method: 'POST',
        body: JSON.stringify({ epic_name: friendInput.trim() }),
      });
      setBotMsg(data?.message || 'Solicitud programada');
    } catch (e) {
      setBotMsg('Error enviando solicitud');
    }
  };

  const sincronizarGifts = async (accountId, nombre) => {
    setBotMsg('');
    try {
      const data = await botFetch(`/api/bot/sync-gifts/${accountId}`, { method: 'POST' });
      if (data.error) {
        setBotMsg(`${nombre}: ${data.error}`);
      } else {
        setBotMsg(`${nombre}: sincronizado — ${data.gifts_today} usado(s) hoy, ${data.gifts_remaining} disponibles`);
        cargarBotStats();
      }
    } catch (e) {
      setBotMsg('Error sincronizando historial de gifts');
    }
  };

  const ajustarSlots = async (accountId, nombre) => {
    const slots = slotsInput[accountId];
    if (slots === undefined || slots === '') { setBotMsg('Selecciona un valor'); return; }
    try {
      await botFetch(`/api/bot/set-slots/${accountId}`, {
        method: 'POST',
        body: JSON.stringify({ slots_usados: parseInt(slots) }),
      });
      setBotMsg(`${nombre}: slots ajustados a ${slots} usados hoy`);
      cargarBotStats();
    } catch (e) {
      setBotMsg('Error ajustando slots');
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

  const cargarTienda = async () => {
    setTiendaLoading(true);
    try {
      const data = await botFetch('/api/bot/tienda');
      setTiendaItems(data.items || []);
    } catch (e) {
      setBotMsg('Error cargando tienda');
    } finally {
      setTiendaLoading(false);
    }
  };

  const cargarAmigos = async (accountId) => {
    if (!accountId) return;
    setFriendsLoading(true);
    setFriendsList([]);
    try {
      const data = await botFetch(`/api/bot/friends/${accountId}`);
      setFriendsList(data.friends || []);
    } catch (e) {
      setBotMsg('Error cargando amigos');
    } finally {
      setFriendsLoading(false);
    }
  };

  const eliminarAmigo = async (accountId, epicName) => {
    if (!confirm(`¿Eliminar a ${epicName} de la lista de amigos?`)) return;
    try {
      const data = await botFetch(`/api/bot/remove-friend/${accountId}`, {
        method: 'POST',
        body: JSON.stringify({ epic_name: epicName }),
      });
      setBotMsg(data.message || data.error || 'Amigo eliminado');
      cargarAmigos(accountId);
    } catch (e) {
      setBotMsg('Error eliminando amigo');
    }
  };

  const enviarRegaloManual = async () => {
    if (!regaloEpicName.trim()) { setBotMsg('Ingresa el nombre Epic del destinatario'); return; }
    if (!regaloSelectedItem) { setBotMsg('Selecciona un item de la tienda'); return; }
    if (!confirm(`¿Enviar "${regaloSelectedItem.nombre}" a ${regaloEpicName.trim()}?`)) return;
    setRegaloLoading(true);
    setBotMsg('');
    try {
      const data = await botFetch('/api/bot/regalar', {
        method: 'POST',
        body: JSON.stringify({
          epic_name: regaloEpicName.trim(),
          offer_id: regaloSelectedItem.offer_id,
          price_vbucks: regaloSelectedItem.precio_vbucks,
        }),
      });
      setBotMsg(data.message || data.error || 'Solicitud enviada');
      if (data.success) {
        cargarBotStats();
        setRegaloEpicName('');
        setRegaloSelectedItem(null);
      }
    } catch (e) {
      setBotMsg('Error enviando regalo');
    } finally {
      setRegaloLoading(false);
    }
  };

  const cargarHistorialGifts = async () => {
    setHistorialLoading(true);
    try {
      const { data, error } = await supabase
        .from('pedido_items')
        .select('id, nombre_producto, pedidos!inner(id, username_fortnite, estado)')
        .eq('entregado', true)
        .not('offer_id', 'is', null)
        .order('id', { ascending: false })
        .limit(30);
      if (!error) setGiftHistory(data || []);
    } catch (e) {
      console.error('Error cargando historial:', e);
    } finally {
      setHistorialLoading(false);
    }
  };

  const cargarPendientes = async () => {
    setPendientesLoading(true);
    try {
      const { data, error } = await supabase
        .from('pedido_items')
        .select('id, nombre_producto, bot_gift_attempts, offer_id, pedidos!inner(id, username_fortnite, estado)')
        .eq('entregado', false)
        .not('offer_id', 'is', null)
        .eq('pedidos.estado', 'Pagado');
      if (!error) setPendingGifts(data || []);
    } catch (e) {
      console.error('Error cargando pendientes:', e);
    } finally {
      setPendientesLoading(false);
    }
  };

  useEffect(() => {
    if (tabComando === 'amigos' && selectedBotId) cargarAmigos(selectedBotId);
    if (tabComando === 'tienda' && tiendaItems.length === 0) cargarTienda();
    if (tabComando === 'herramientas' && tiendaItems.length === 0) cargarTienda();
    if (tabComando === 'historial') cargarHistorialGifts();
    if (tabComando === 'pendientes') cargarPendientes();
  }, [tabComando, selectedBotId]);

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
        {tabActivo === 'bot' && (() => {
          const selectedBot = botStats.find(b => b.account_id === selectedBotId);
          const tiendaFiltrada = tiendaItems.filter(item =>
            !tiendaBusqueda || item.nombre.toLowerCase().includes(tiendaBusqueda.toLowerCase())
          );
          const botsOnline = botStats.filter(b => b.online).length;

          return (
            <div className="space-y-6">

              {/* Mensaje de estado */}
              {botMsg && (
                <div className="px-4 py-3 bg-blue-950 border border-blue-500/50 rounded-xl text-blue-200 flex items-center justify-between">
                  <span className="text-sm">{botMsg}</span>
                  <button onClick={() => setBotMsg('')} className="text-blue-400 hover:text-white ml-4 text-lg leading-none">×</button>
                </div>
              )}

              {/* Header */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">Bot Manager</h2>
                  <p className="text-sm text-gray-400 mt-0.5">
                    <span className={`inline-flex items-center gap-1.5 ${botsOnline > 0 ? 'text-green-400' : 'text-gray-500'}`}>
                      <span className={`w-2 h-2 rounded-full ${botsOnline > 0 ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} />
                      {botsOnline} bot{botsOnline !== 1 ? 's' : ''} online
                    </span>
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={cargarBotStats}
                    disabled={botLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-xl border border-gray-600 transition disabled:opacity-50"
                  >
                    <span className={botLoading ? 'animate-spin' : ''}>↻</span> Actualizar
                  </button>
                  <button
                    onClick={refreshBalances}
                    disabled={botLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-400 text-sm rounded-xl border border-yellow-600/40 transition disabled:opacity-50"
                  >
                    💰 Sincronizar Saldos
                  </button>
                  <button
                    onClick={async () => { if (!confirm('¿Recargar todos los bots?')) return; const d = await botFetch('/api/bot/reload', { method: 'POST' }); setBotMsg(d?.message || 'Recarga enviada'); }}
                    disabled={botLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 text-sm rounded-xl border border-purple-600/40 transition disabled:opacity-50"
                  >
                    ⟳ Recargar Bots
                  </button>
                </div>
              </div>

              {/* Bot cards */}
              {!botLoading && botStats.length === 0 && (
                <div className="text-center py-20 text-gray-500 bg-gray-800/30 rounded-2xl border border-gray-700/50">
                  <p className="text-4xl mb-3">🤖</p>
                  <p>No hay bots registrados o no se pudo conectar.</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {botStats.map((bot) => (
                  <div
                    key={bot.account_id}
                    className={`relative bg-gray-800/60 rounded-2xl border overflow-hidden transition-all
                      ${bot.online ? 'border-green-500/25' : 'border-gray-700/50'}
                      ${selectedBotId === bot.account_id ? 'ring-2 ring-blue-500 bg-gray-800' : 'hover:bg-gray-800/90'}
                    `}
                  >
                    {/* Top accent bar */}
                    <div className={`h-1 w-full ${bot.online ? 'bg-gradient-to-r from-green-500 to-emerald-400' : 'bg-gray-700'}`} />

                    <div className="p-5">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-white text-base truncate">{bot.display_name || bot.account_id}</h3>
                          <p className="text-xs text-gray-500 font-mono truncate">{bot.account_id}</p>
                        </div>
                        <div className="flex flex-col gap-1.5 items-end ml-3 shrink-0">
                          <span className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border
                            ${bot.online
                              ? 'bg-green-500/10 text-green-400 border-green-500/30'
                              : 'bg-gray-700/50 text-gray-400 border-gray-600/50'}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${bot.online ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} />
                            {bot.online ? 'Online' : 'Offline'}
                          </span>
                          <span className={`px-2.5 py-0.5 text-xs rounded-full border
                            ${bot.is_pagado
                              ? 'bg-red-500/10 text-red-400 border-red-500/30'
                              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'}`}
                          >
                            {bot.is_pagado ? 'Sin saldo' : 'Con saldo'}
                          </span>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        <div className="bg-gray-900/50 rounded-xl p-3 text-center border border-gray-700/30">
                          <p className="text-yellow-400 font-bold text-lg leading-tight">{(bot.pavos ?? 0).toLocaleString()}</p>
                          <p className="text-xs text-gray-500 mt-0.5">V-Bucks</p>
                        </div>
                        <div className="bg-gray-900/50 rounded-xl p-3 text-center border border-gray-700/30">
                          <p className="text-purple-400 font-bold text-lg leading-tight">{bot.gifts_sent ?? 0}</p>
                          <p className="text-xs text-gray-500 mt-0.5">Regalos</p>
                        </div>
                        <div className="bg-gray-900/50 rounded-xl p-3 text-center border border-gray-700/30">
                          <p className="text-blue-400 font-bold text-lg leading-tight">{bot.friends_count ?? 0}</p>
                          <p className="text-xs text-gray-500 mt-0.5">Amigos</p>
                        </div>
                      </div>

                      {/* Gift slots */}
                      <div className="bg-gray-900/40 rounded-xl p-3 mb-4 border border-gray-700/30">
                        <div className="flex items-center justify-between mb-2.5">
                          <p className="text-xs text-gray-400 font-medium">Slots de regalo hoy</p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">{bot.gifts_remaining ?? 5}/5</span>
                            <button
                              onClick={() => sincronizarGifts(bot.account_id, bot.display_name)}
                              className="text-xs text-blue-400 hover:text-blue-300 transition"
                              title="Sincronizar"
                            >
                              ↻
                            </button>
                          </div>
                        </div>
                        <div className="flex gap-1.5">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`flex-1 h-2 rounded-full transition-all ${i < (bot.gifts_remaining ?? 5) ? 'bg-green-400' : 'bg-gray-600'}`}
                            />
                          ))}
                        </div>
                        {bot.gift_timestamps?.length > 0 && (
                          <div className="mt-2.5 space-y-1 border-t border-gray-700/50 pt-2">
                            {bot.gift_timestamps.map((ts, i) => {
                              const env = new Date(ts);
                              const lib = new Date(env.getTime() + 86400000);
                              return (
                                <div key={i} className="flex justify-between text-xs">
                                  <span className="text-gray-400">Slot {i+1}: {env.toLocaleTimeString('es-CL', {hour:'2-digit', minute:'2-digit'})}</span>
                                  <span className="text-yellow-500">↺ {lib.toLocaleDateString('es-CL', {day:'2-digit', month:'2-digit'})} {lib.toLocaleTimeString('es-CL', {hour:'2-digit', minute:'2-digit'})}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedBotId(bot.account_id)}
                          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition
                            ${selectedBotId === bot.account_id
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-700/80 text-gray-300 hover:bg-gray-700'}`}
                        >
                          {selectedBotId === bot.account_id ? '✓ Seleccionado' : 'Seleccionar'}
                        </button>
                        {bot.is_pagado && (
                          <button
                            onClick={() => reactivarBot(bot.account_id, bot.display_name)}
                            className="flex-1 py-2 bg-orange-600/80 text-white text-xs font-semibold rounded-xl hover:bg-orange-600 transition"
                          >
                            Reactivar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Panel de comandos */}
              {botStats.length > 0 && (
                <div className="bg-gray-800/50 rounded-2xl border border-gray-700/50 overflow-hidden">

                  {/* Sub-tabs */}
                  <div className="flex items-center justify-between px-5 pt-1 pb-0 border-b border-gray-700/50 flex-wrap gap-2 overflow-x-auto">
                    <div className="flex gap-0.5">
                      {[
                        { id: 'herramientas', label: '🔧 Herramientas' },
                        { id: 'historial',    label: '📦 Historial' },
                        { id: 'pendientes',   label: `⏳ Pendientes${pendingGifts.length > 0 ? ` (${pendingGifts.length})` : ''}` },
                        { id: 'tienda',       label: '🛒 Tienda' },
                        { id: 'amigos',       label: `👥 Amigos${friendsList.length > 0 ? ` (${friendsList.length})` : ''}` },
                      ].map(t => (
                        <button
                          key={t.id}
                          onClick={() => setTabComando(t.id)}
                          className={`px-4 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap
                            ${tabComando === t.id
                              ? 'border-blue-500 text-white'
                              : 'border-transparent text-gray-400 hover:text-gray-200'}`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                    {botStats.length > 1 && (
                      <select
                        value={selectedBotId}
                        onChange={(e) => setSelectedBotId(e.target.value)}
                        className="px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none mb-1"
                      >
                        {botStats.map(b => (
                          <option key={b.account_id} value={b.account_id}>{b.display_name}</option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div className="p-6">

                    {/* === HERRAMIENTAS === */}
                    {tabComando === 'herramientas' && (
                      <div className="space-y-8">

                        {/* Verificar / Agregar amigo */}
                        <div>
                          <h4 className="text-sm font-semibold text-gray-200 mb-3">Verificar / Agregar amigo</h4>
                          <div className="flex flex-col sm:flex-row gap-3">
                            <input
                              type="text"
                              placeholder="Nombre de usuario Epic..."
                              value={friendInput}
                              onChange={(e) => { setFriendInput(e.target.value); setFriendResult(null); }}
                              onKeyDown={(e) => e.key === 'Enter' && verificarAmigo()}
                              className="flex-1 px-4 py-2.5 bg-gray-700/80 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                            />
                            <button onClick={verificarAmigo} disabled={friendLoading} className="px-4 py-2.5 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-700 transition disabled:opacity-50 whitespace-nowrap">
                              {friendLoading ? 'Buscando...' : 'Ver si es amigo'}
                            </button>
                            <button onClick={agregarAmigo} disabled={friendLoading} className="px-4 py-2.5 bg-green-600 text-white text-sm rounded-xl hover:bg-green-700 transition disabled:opacity-50 whitespace-nowrap">
                              Agregar amigo
                            </button>
                          </div>
                          {friendResult && (
                            <div className="mt-4 p-4 bg-gray-700/50 rounded-xl border border-gray-600/30">
                              <p className="text-white font-semibold mb-3">
                                {friendResult.display_name || friendInput}
                                <span className="text-gray-400 text-xs ml-2 font-mono">{friendResult.epic_id}</span>
                              </p>
                              <div className="flex flex-col gap-2">
                                {(friendResult.bots || []).map((b) => (
                                  <div key={b.bot_account_id} className="flex items-center justify-between bg-gray-600/50 rounded-lg px-4 py-2.5">
                                    <span className="text-white text-sm">{b.bot_display_name}</span>
                                    {b.es_amigo ? (
                                      <span className={`text-xs px-2.5 py-1 rounded-full ${b.tiempo_amistad_horas >= 48 ? 'bg-green-900/50 text-green-400' : 'bg-yellow-900/50 text-yellow-400'}`}>
                                        {b.tiempo_amistad_horas >= 48
                                          ? `${Math.floor(b.tiempo_amistad_horas / 24)}d — puede regalar`
                                          : `${b.tiempo_amistad_horas?.toFixed(0)}h — faltan ${(48 - b.tiempo_amistad_horas).toFixed(0)}h`}
                                      </span>
                                    ) : (
                                      <span className="text-xs px-2.5 py-1 rounded-full bg-red-900/50 text-red-400">No es amigo</span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {friendResult?.error && <p className="mt-3 text-red-400 text-sm">{friendResult.error}</p>}
                        </div>

                        <div className="border-t border-gray-700/50" />

                        {/* Enviar regalo manual */}
                        <div>
                          <h4 className="text-sm font-semibold text-gray-200 mb-3">Enviar regalo manualmente</h4>
                          <div className="flex gap-2 mb-3">
                            <input
                              type="text"
                              placeholder="Nombre Epic del destinatario..."
                              value={regaloEpicName}
                              onChange={(e) => setRegaloEpicName(e.target.value)}
                              className="flex-1 px-3 py-2.5 bg-gray-700/80 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:outline-none text-sm"
                            />
                            <input
                              type="text"
                              placeholder="Buscar item..."
                              value={tiendaBusqueda}
                              onChange={(e) => setTiendaBusqueda(e.target.value)}
                              className="flex-1 px-3 py-2.5 bg-gray-700/80 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:outline-none text-sm"
                            />
                          </div>
                          {tiendaLoading ? (
                            <p className="text-gray-400 text-sm">Cargando tienda...</p>
                          ) : (
                            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2 max-h-56 overflow-y-auto pr-1">
                              {tiendaFiltrada.slice(0, 80).map((item) => (
                                <div
                                  key={item.offer_id}
                                  onClick={() => setRegaloSelectedItem(item)}
                                  title={`${item.nombre} — ${item.precio_vbucks.toLocaleString()} V-Bucks`}
                                  className={`rounded-xl cursor-pointer border transition overflow-hidden
                                    ${regaloSelectedItem?.offer_id === item.offer_id
                                      ? 'border-purple-500 ring-2 ring-purple-500/50'
                                      : 'border-gray-600/50 hover:border-gray-400'}`}
                                >
                                  {item.imagen
                                    ? <img src={item.imagen} alt={item.nombre} className="w-full aspect-square object-cover" />
                                    : <div className="w-full aspect-square bg-gray-700 flex items-center justify-center"><span className="text-gray-500 text-xs text-center px-1 leading-tight">{item.nombre}</span></div>
                                  }
                                  <div className="px-1 py-0.5 bg-gray-800/80">
                                    <p className="text-yellow-400 text-xs font-bold text-center">{item.precio_vbucks.toLocaleString()}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          {regaloSelectedItem && (
                            <div className="mt-3 p-3.5 bg-purple-900/20 border border-purple-700/40 rounded-xl flex items-center justify-between gap-3">
                              <div>
                                <p className="text-white text-sm font-semibold">{regaloSelectedItem.nombre}</p>
                                <p className="text-yellow-400 text-xs mt-0.5">{regaloSelectedItem.precio_vbucks.toLocaleString()} V-Bucks</p>
                              </div>
                              <button
                                onClick={enviarRegaloManual}
                                disabled={regaloLoading || !regaloEpicName.trim()}
                                className="px-4 py-2 bg-purple-600 text-white text-sm rounded-xl hover:bg-purple-700 disabled:opacity-50 transition whitespace-nowrap"
                              >
                                {regaloLoading ? 'Enviando...' : 'Enviar Regalo'}
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="border-t border-gray-700/50" />

                        {/* Actualizar V-Bucks manualmente */}
                        <div>
                          <h4 className="text-sm font-semibold text-gray-200 mb-3">
                            Actualizar V-Bucks — <span className="text-yellow-400">{selectedBot?.display_name}</span>
                          </h4>
                          <div className="flex gap-3 max-w-sm">
                            <input
                              type="number"
                              placeholder="V-Bucks"
                              value={pavosInput[selectedBotId] || ''}
                              onChange={(e) => setPavosInput(prev => ({ ...prev, [selectedBotId]: e.target.value }))}
                              className="flex-1 px-3 py-2.5 bg-gray-700/80 border border-gray-600/50 rounded-xl text-white text-sm focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                            />
                            <button
                              onClick={() => setPavos(selectedBotId, selectedBot?.display_name)}
                              className="px-4 py-2 bg-yellow-600 text-white text-sm rounded-xl hover:bg-yellow-700 transition"
                            >
                              Guardar
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* === HISTORIAL === */}
                    {tabComando === 'historial' && (
                      <div>
                        <div className="flex items-center justify-between mb-5">
                          <div>
                            <h4 className="text-sm font-semibold text-white">Últimos regalos enviados</h4>
                            <p className="text-xs text-gray-400 mt-0.5">{giftHistory.length} registros</p>
                          </div>
                          <button
                            onClick={cargarHistorialGifts}
                            disabled={historialLoading}
                            className="px-3 py-1.5 bg-gray-700 text-white text-xs rounded-lg hover:bg-gray-600 transition disabled:opacity-50"
                          >
                            {historialLoading ? '...' : '↻ Actualizar'}
                          </button>
                        </div>
                        {historialLoading ? (
                          <div className="flex items-center gap-2 text-gray-400 py-8 justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500" />
                            Cargando historial...
                          </div>
                        ) : giftHistory.length === 0 ? (
                          <div className="text-center py-12 text-gray-500">
                            <p className="text-3xl mb-2">📦</p>
                            <p>No hay regalos entregados aún.</p>
                          </div>
                        ) : (
                          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                            {giftHistory.map((item) => (
                              <div key={item.id} className="flex items-center justify-between bg-gray-700/40 hover:bg-gray-700/60 rounded-xl px-4 py-3 border border-gray-600/20 transition">
                                <div className="min-w-0">
                                  <p className="text-white text-sm font-medium truncate">{item.nombre_producto}</p>
                                  <p className="text-xs text-gray-400 mt-0.5">
                                    🎮 <span className="text-gray-300">{item.pedidos?.username_fortnite || '—'}</span>
                                    <span className="text-gray-600 mx-1">·</span>
                                    Pedido <span className="text-gray-300">#{item.pedidos?.id}</span>
                                  </p>
                                </div>
                                <span className="text-xs px-2.5 py-1 rounded-full bg-green-900/40 text-green-400 border border-green-700/30 whitespace-nowrap ml-3">
                                  ✓ Entregado
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* === PENDIENTES === */}
                    {tabComando === 'pendientes' && (
                      <div>
                        <div className="flex items-center justify-between mb-5">
                          <div>
                            <h4 className="text-sm font-semibold text-white">Regalos pendientes por enviar</h4>
                            <p className="text-xs text-gray-400 mt-0.5">Pedidos pagados con items sin entregar</p>
                          </div>
                          <button
                            onClick={cargarPendientes}
                            disabled={pendientesLoading}
                            className="px-3 py-1.5 bg-gray-700 text-white text-xs rounded-lg hover:bg-gray-600 transition disabled:opacity-50"
                          >
                            {pendientesLoading ? '...' : '↻ Actualizar'}
                          </button>
                        </div>
                        {pendientesLoading ? (
                          <div className="flex items-center gap-2 text-gray-400 py-8 justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-500" />
                            Cargando pendientes...
                          </div>
                        ) : pendingGifts.length === 0 ? (
                          <div className="text-center py-12">
                            <p className="text-3xl mb-2">✅</p>
                            <p className="text-green-400 font-medium">¡Todo al día!</p>
                            <p className="text-gray-500 text-sm mt-1">No hay pedidos pendientes de entregar.</p>
                          </div>
                        ) : (
                          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                            {pendingGifts.map((item) => (
                              <div key={item.id} className="flex items-center justify-between bg-yellow-900/10 hover:bg-yellow-900/20 rounded-xl px-4 py-3 border border-yellow-700/20 transition">
                                <div className="min-w-0">
                                  <p className="text-white text-sm font-medium truncate">{item.nombre_producto}</p>
                                  <p className="text-xs text-gray-400 mt-0.5">
                                    🎮 <span className="text-gray-300">{item.pedidos?.username_fortnite || '—'}</span>
                                    <span className="text-gray-600 mx-1">·</span>
                                    Pedido <span className="text-gray-300">#{item.pedidos?.id}</span>
                                  </p>
                                  {item.bot_gift_attempts > 0 && (
                                    <p className="text-xs text-orange-400 mt-0.5">
                                      ⚠ {item.bot_gift_attempts} intento{item.bot_gift_attempts !== 1 ? 's' : ''} fallido{item.bot_gift_attempts !== 1 ? 's' : ''}
                                    </p>
                                  )}
                                </div>
                                <span className="text-xs px-2.5 py-1 rounded-full bg-yellow-900/40 text-yellow-400 border border-yellow-700/30 whitespace-nowrap ml-3">
                                  ⏳ Pendiente
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* === TIENDA === */}
                    {tabComando === 'tienda' && (
                      <div>
                        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                          <h4 className="text-sm font-semibold text-gray-200">
                            Tienda actual — <span className="text-white">{tiendaItems.length} items</span>
                          </h4>
                          <button onClick={cargarTienda} disabled={tiendaLoading} className="px-3 py-1.5 bg-gray-700 text-white text-sm rounded-lg hover:bg-gray-600 transition disabled:opacity-50">
                            {tiendaLoading ? 'Cargando...' : '↻ Actualizar'}
                          </button>
                        </div>
                        <input
                          type="text"
                          placeholder="Buscar item..."
                          value={tiendaBusqueda}
                          onChange={(e) => setTiendaBusqueda(e.target.value)}
                          className="w-full px-4 py-2.5 bg-gray-700/80 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none mb-4 text-sm"
                        />
                        {tiendaLoading ? (
                          <div className="flex items-center gap-2 text-gray-400">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500" /> Cargando tienda...
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 max-h-[500px] overflow-y-auto pr-1">
                            {tiendaFiltrada.map((item) => (
                              <div key={item.offer_id} className="bg-gray-700/60 rounded-xl border border-gray-600/40 flex flex-col justify-between overflow-hidden hover:border-gray-500 transition">
                                {item.imagen && (
                                  <img src={item.imagen} alt={item.nombre} className="w-full h-28 object-cover" />
                                )}
                                <div className="p-2.5 flex flex-col flex-1 justify-between">
                                  <div>
                                    <p className="text-white text-xs font-medium leading-tight mb-1">{item.nombre}</p>
                                    <p className="text-yellow-400 text-xs font-bold">{item.precio_vbucks.toLocaleString()} V-Bucks</p>
                                    {item.seccion && <p className="text-gray-500 text-xs mt-0.5 truncate">{item.seccion}</p>}
                                  </div>
                                  <button
                                    onClick={() => { setTabComando('herramientas'); setRegaloSelectedItem(item); setTiendaBusqueda(''); }}
                                    className="mt-2 w-full px-2 py-1.5 bg-purple-700/50 text-white text-xs rounded-lg hover:bg-purple-600 transition"
                                  >
                                    Regalar
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* === AMIGOS === */}
                    {tabComando === 'amigos' && (
                      <div>
                        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                          <h4 className="text-sm font-semibold text-gray-200">
                            Amigos de <span className="text-white">{selectedBot?.display_name}</span>
                            {friendsList.length > 0 && <span className="text-gray-400 ml-1">— {friendsList.length} amigos</span>}
                          </h4>
                          <button onClick={() => cargarAmigos(selectedBotId)} disabled={friendsLoading} className="px-3 py-1.5 bg-gray-700 text-white text-sm rounded-lg hover:bg-gray-600 transition disabled:opacity-50">
                            {friendsLoading ? 'Cargando...' : '↻ Actualizar'}
                          </button>
                        </div>
                        {friendsLoading ? (
                          <div className="flex items-center gap-2 text-gray-400 py-8 justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500" /> Cargando amigos...
                          </div>
                        ) : friendsList.length === 0 ? (
                          <p className="text-gray-500 text-sm text-center py-8">No hay amigos cargados.</p>
                        ) : (
                          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                            {friendsList.map((f) => (
                              <div key={f.id} className="flex items-center justify-between bg-gray-700/40 hover:bg-gray-700/60 rounded-xl px-4 py-2.5 border border-gray-600/20 transition">
                                <div>
                                  <p className="text-white text-sm font-medium">{f.display_name}</p>
                                  <p className="text-xs text-gray-400 mt-0.5">
                                    {f.hours !== null
                                      ? `${f.hours >= 24 ? Math.floor(f.hours / 24) + 'd ' : ''}${Math.floor(f.hours % 24)}h de amistad`
                                      : 'Tiempo desconocido'}
                                  </p>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className={`text-xs px-2.5 py-1 rounded-full border
                                    ${f.can_gift
                                      ? 'bg-green-900/40 text-green-400 border-green-700/30'
                                      : 'bg-yellow-900/40 text-yellow-400 border-yellow-700/30'}`}
                                  >
                                    {f.can_gift ? 'Puede regalar' : `Faltan ${Math.ceil(48 - (f.hours || 0))}h`}
                                  </span>
                                  <button
                                    onClick={() => eliminarAmigo(selectedBotId, f.display_name)}
                                    className="text-red-400 hover:text-red-300 text-xs transition"
                                    title="Eliminar amigo"
                                  >
                                    Eliminar
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                </div>
              )}
            </div>
          );
        })()}

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
