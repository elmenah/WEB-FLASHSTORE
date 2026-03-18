import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "../supabaseCliente";
import useScrollToTop from "../hooks/useScrollToTop";

const JuegosPC = () => {
  useScrollToTop();
  const [juegos, setJuegos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [plataformaActiva, setPlataformaActiva] = useState("Todos");

  useEffect(() => {
    const fetchJuegos = async () => {
      const { data, error } = await supabase
        .from("juegos")
        .select("id, nombre, plataforma, precio, imagen")
        .order("nombre", { ascending: true });

      if (error) {
        console.error("Error al obtener juegos:", error.message);
      } else {
        setJuegos(data || []);
      }
      setLoading(false);
    };

    fetchJuegos();
  }, []);

  // Obtener plataformas únicas
  const plataformas = useMemo(() => {
    const set = new Set(juegos.map((j) => j.plataforma));
    return ["Todos", ...Array.from(set).sort()];
  }, [juegos]);

  // Filtrar juegos
  const juegosFiltrados = useMemo(() => {
    return juegos.filter((j) => {
      const coincidePlataforma =
        plataformaActiva === "Todos" || j.plataforma === plataformaActiva;
      const coincideBusqueda = j.nombre
        .toLowerCase()
        .includes(busqueda.toLowerCase());
      return coincidePlataforma && coincideBusqueda;
    });
  }, [juegos, plataformaActiva, busqueda]);

  // Agrupar por plataforma
  const juegosPorPlataforma = useMemo(() => {
    const grupos = {};
    juegosFiltrados.forEach((j) => {
      if (!grupos[j.plataforma]) grupos[j.plataforma] = [];
      grupos[j.plataforma].push(j);
    });
    return grupos;
  }, [juegosFiltrados]);

  // Colores por plataforma
  const coloresPlataforma = {
    Steam: { bg: "from-blue-900/40 to-blue-800/40", border: "border-blue-500/30", badge: "bg-blue-600/30 text-blue-300", icon: "🎮" },
    Ubisoft: { bg: "from-indigo-900/40 to-purple-800/40", border: "border-indigo-500/30", badge: "bg-indigo-600/30 text-indigo-300", icon: "🏰" },
    Epic: { bg: "from-gray-800/40 to-gray-700/40", border: "border-gray-500/30", badge: "bg-gray-600/30 text-gray-300", icon: "🎯" },
    EA: { bg: "from-orange-900/40 to-red-800/40", border: "border-orange-500/30", badge: "bg-orange-600/30 text-orange-300", icon: "⚽" },
  };

  const getColores = (plataforma) =>
    coloresPlataforma[plataforma] || {
      bg: "from-gray-800/40 to-gray-700/40",
      border: "border-gray-500/30",
      badge: "bg-gray-600/30 text-gray-300",
      icon: "🎮",
    };

  const formatPrice = (precio) =>
    new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(precio);

  return (
    <div className="pt-14">
      {/* HERO */}
      <section className="relative pt-20 pb-16 px-6 h-[400px] bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center overflow-hidden">
        {/* Decoración */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-500 rounded-full filter blur-3xl"></div>
        </div>

        <div className="relative max-w-6xl mx-auto z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            JUEGOS DE <span className="text-blue-400">PC</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-6">
            Instalación remota y segura — Juegos para un jugador y modo historia
            <br />
            <span className="font-bold text-green-400">Desde $6.000 CLP</span>{" "}
            por juego
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm border border-white/20">
              🎮 Steam
            </span>
            <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm border border-white/20">
              🏰 Ubisoft
            </span>
            <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm border border-white/20">
              ⚡ Instalación remota
            </span>
            <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm border border-white/20">
              🔒 No requiere acceso a tu cuenta
            </span>
          </div>
        </div>
      </section>

      {/* PRECIOS */}
      <section className="py-10 bg-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 border border-blue-500/30 rounded-xl p-6 text-center">
              <p className="text-gray-300 text-sm mb-1">1 Juego</p>
              <p className="text-3xl font-bold text-white">$6.000</p>
            </div>
            <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 border border-purple-500/30 rounded-xl p-6 text-center relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                POPULAR
              </span>
              <p className="text-gray-300 text-sm mb-1">3 Juegos</p>
              <p className="text-3xl font-bold text-white">$12.000</p>
              <p className="text-yellow-400 text-xs mt-1 font-semibold">
                + 1 juego de regalo
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-900/50 to-green-800/50 border border-green-500/30 rounded-xl p-6 text-center">
              <p className="text-gray-300 text-sm mb-1">6 Juegos</p>
              <p className="text-3xl font-bold text-white">$17.000</p>
              <p className="text-yellow-400 text-xs mt-1 font-semibold">
                + 1 juego de regalo
              </p>
            </div>
          </div>
          <p className="text-center text-gray-500 text-sm mt-4">
            Algunos juegos pueden tener un precio diferente según su categoría.
          </p>
        </div>
      </section>

      {/* BUSCADOR Y FILTROS */}
      <section className="py-8 bg-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          {/* Buscador */}
          <div className="relative mb-6">
            <span className="absolute inset-y-0 left-4 flex items-center text-gray-400">
              <span className="material-icons">search</span>
            </span>
            <input
              type="text"
              placeholder="Buscar juego por nombre..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
            {busqueda && (
              <button
                onClick={() => setBusqueda("")}
                className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-white"
              >
                <span className="material-icons">close</span>
              </button>
            )}
          </div>

          {/* Filtros por plataforma */}
          <div className="flex flex-wrap gap-2 mb-2">
            {plataformas.map((p) => (
              <button
                key={p}
                onClick={() => setPlataformaActiva(p)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  plataformaActiva === p
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white border border-gray-700"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <p className="text-gray-500 text-sm">
            {juegosFiltrados.length} juego{juegosFiltrados.length !== 1 && "s"}{" "}
            encontrado{juegosFiltrados.length !== 1 && "s"}
          </p>
        </div>
      </section>

      {/* LISTA DE JUEGOS */}
      <section className="pb-16 bg-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : juegosFiltrados.length === 0 ? (
            <div className="text-center py-20">
              <span className="material-icons text-6xl text-gray-600 mb-4 block">
                search_off
              </span>
              <p className="text-gray-400 text-lg">
                No se encontraron juegos con esos filtros.
              </p>
            </div>
          ) : (
            Object.entries(juegosPorPlataforma)
              .sort(([a], [b]) => {
                if (a.toUpperCase() === "STEAM") return -1;
                if (b.toUpperCase() === "STEAM") return 1;
                return a.localeCompare(b);
              })
              .map(([plataforma, lista]) => {
                const colores = getColores(plataforma);
                return (
                  <div key={plataforma} className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-3xl">{colores.icon}</span>
                      <h2 className="text-2xl sm:text-3xl font-bold text-white">
                        {plataforma}
                      </h2>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colores.badge}`}>
                        {lista.length} juego{lista.length !== 1 && "s"}
                      </span>
                    </div>

                    {/* Tabla de juegos */}
                    <div className={`bg-gradient-to-br ${colores.bg} rounded-xl border ${colores.border} overflow-hidden`}>
                      {/* Header de tabla - solo desktop */}
                      <div className="hidden sm:grid sm:grid-cols-12 gap-4 px-6 py-3 bg-black/20 border-b border-white/5">
                        <div className="col-span-1 text-gray-500 text-xs font-semibold uppercase">
                          #
                        </div>
                        <div className="col-span-8 text-gray-500 text-xs font-semibold uppercase">
                          Nombre
                        </div>
                        <div className="col-span-3 text-gray-500 text-xs font-semibold uppercase text-right">
                          Precio
                        </div>
                      </div>

                      {/* Filas */}
                      {lista.map((juego, idx) => (
                        <div
                          key={juego.id}
                          className={`grid grid-cols-12 gap-2 sm:gap-4 px-4 sm:px-6 py-3 items-center hover:bg-white/5 transition-colors ${
                            idx !== lista.length - 1
                              ? "border-b border-white/5"
                              : ""
                          }`}
                        >
                          <div className="col-span-1 text-gray-500 text-sm hidden sm:block">
                            {idx + 1}
                          </div>
                          <div className="col-span-9 sm:col-span-8 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
                              {juego.imagen ? (
                                <img
                                  src={juego.imagen}
                                  alt={juego.nombre}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-600 text-lg">
                                  🎮
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="text-white font-medium text-sm sm:text-base">
                                {juego.nombre}
                              </p>
                              <p className="text-xs text-gray-500 sm:hidden">
                                {juego.plataforma}
                              </p>
                            </div>
                          </div>
                          <div className="col-span-3 text-right">
                            <span
                              className={`font-bold text-sm sm:text-base ${
                                juego.precio >= 10000
                                  ? "text-yellow-400"
                                  : juego.precio >= 8000
                                  ? "text-green-400"
                                  : "text-white"
                              }`}
                            >
                              {formatPrice(juego.precio)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
          )}
        </div>
      </section>

      {/* CTA WhatsApp */}
      <section className="py-12 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            ¿Quieres comprar un juego?
          </h2>
          <p className="text-gray-400 mb-6">
            Contáctanos por WhatsApp y te ayudamos con la instalación remota
          </p>
          <a
            href="https://wa.me/56930917730?text=Hola%2C%20quiero%20comprar%20juegos%20de%20PC"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-4 rounded-full text-lg transition-colors shadow-xl"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Consultar por WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
};

export default JuegosPC;
