import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";
import "../css/Shop.css";
import useScrollToTop from "../hooks/useScrollToTop";
import { VBUCK_TO_CLP_RATE } from "../config/prices";

const Shop2 = () => {
  useScrollToTop();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  // Debounce para el buscador
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(searchInput);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchInput]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    // Si hay productos cacheados en sessionStorage, usarlos directamente sin animación
    const cached = sessionStorage.getItem("shopProducts");
    if (cached) {
      try {
        setProducts(JSON.parse(cached));
        setLoading(false);
        return;
      } catch {
        sessionStorage.removeItem("shopProducts");
      }
    }
    fetchProducts();
  }, []);

  // Scroll al top cuando cambie la categoría seleccionada
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedCategory]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        "https://fortnite-api.com/v2/shop?language=es"
      );

      if (!response.ok) throw new Error("Error al obtener los datos de la API");

      const data = await response.json();
      console.log("🔎 Respuesta API:", data);

      // La API ahora devuelve los productos en 'data.data.entries'
      if (data?.data?.entries && Array.isArray(data.data.entries)) {
        // Solo guardar items regalables: con offerId, giftable y precio > 0
        const validEntries = data.data.entries.filter(
          (e) => e.offerId && e.giftable === true && e.finalPrice && e.finalPrice > 0
        );
        setProducts(validEntries);
        sessionStorage.setItem("shopProducts", JSON.stringify(validEntries));
      } else {
        console.error("⚠️ La API no devolvió 'entries' como arreglo");
        setProducts([]);
      }

      setTimeout(() => setLoading(false), 3000);
    } catch (error) {
      console.error("❌ Error al cargar la API:", error);
      setProducts([]);
      setTimeout(() => setLoading(false), 3000);
    }
  };

  const handleAddToCart = (product) => {
    // Si es bundle, usa el nombre e imagen del bundle; si no, del item principal
    let nombre = "";
    let imagen = "";
    if (product.bundle && product.bundle.name) {
      nombre = product.bundle.name;
      imagen = product.bundle.image;
    } else if (product.brItems?.[0]) {
      nombre = product.brItems[0].name;
      imagen =
        product.brItems[0].images?.icon || product.brItems[0].images?.featured;
    } else {
      nombre = "Producto";
      imagen = "";
    }
    const cartProduct = {
      nombre,
      precio: product.finalPrice * VBUCK_TO_CLP_RATE,
      imagen,
      offer_id: product.offerId || null,
      pavos: product.finalPrice || 0,
    };
    addToCart(cartProduct);
    showNotification();
  };

  const slugify = (text) =>
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const handleProductClick = (product) => {
    const isBundle = !!product.bundle?.name;

    // 🎨 OBTENER COLORES DINÁMICOS IGUAL QUE EN PRODUCTCARD
    let color1 = "#475569";
    let color2 = "#334155";
    let color3 = "#1e293b";

    if (product.colors) {
      let colorArray = [];

      if (
        typeof product.colors === "object" &&
        !Array.isArray(product.colors) &&
        product.colors !== null
      ) {
        colorArray = Object.values(product.colors);
      } else if (Array.isArray(product.colors)) {
        colorArray = product.colors;
      }

      if (colorArray.length > 0) {
        color1 = colorArray[0] ? `#${colorArray[0].slice(0, 6)}` : color1;
        color2 = colorArray[1] ? `#${colorArray[1].slice(0, 6)}` : color1;
        color3 = colorArray[2] ? `#${colorArray[2].slice(0, 6)}` : color2;
      }
    }
    const contenidoLimpio = isBundle
      ? Array.from(
          new Map(
            (product.brItems || []).map((item) => [
              item.name.toLowerCase(), // 👈 deduplicar por nombre
              {
                nombre: item.name,
                imagen: item.images?.icon || item.images?.featured,
              },
            ])
          ).values()
        )
      : [];
    const productData = isBundle
      ? {
          nombre: product.bundle.name || "Lote sin nombre",
          precio: product.finalPrice,
          imagen: product.bundle.image || "URL_IMAGEN_DEFAULT",
          descripcion: product.bundle.info || "Sin descripción disponible",
          offer_id: product.offerId || null,
          pavos: product.finalPrice || 0,

          contenido: contenidoLimpio,
          partede: `Incluye ${contenidoLimpio.length} objetos`,

          grupo: "Lote",
          tipo: "Lote",
          rareza: product.rarity?.displayValue || "Sin rareza",
          banner: product.banner?.value || null,
          inicio: product.inDate || null,
          fin: product.outDate || null,
          color1,
          color2,
          color3,
        }
      : {
          // 👕 ITEM / SKIN
          nombre: product.brItems?.[0]?.name || "Sin nombre",
          precio: product.finalPrice,
          imagen:
            product.brItems?.[0]?.images?.featured ||
            product.brItems?.[0]?.images?.icon ||
            "URL_IMAGEN_DEFAULT",
          descripcion:
            product.brItems?.[0]?.description || "Sin descripción disponible",
          offer_id: product.offerId || null,
          pavos: product.finalPrice || 0,

          // ✅ ITEM → Parte del conjunto
          partede:
            product.brItems?.[0]?.set?.text || "No pertenece a ningún conjunto",

          grupo: product.brItems?.[0]?.set?.text || "Sin categoría",
          tipo: product.brItems?.[0]?.type?.displayValue || "No especificado",
          rareza: product.brItems?.[0]?.rarity?.displayValue || "Sin rareza",
          banner: product.banner?.value || null,
          inicio: product.inDate || null,
          fin: product.outDate || null,
          color1,
          color2,
          color3,
        };
    const slug = slugify(productData.nombre);

    navigate(`/product/${slug}`, {
      state: { product: productData },
    });
  };

  const showNotification = () => {
    setNotification(true);
    setTimeout(() => setNotification(false), 2000);
  };

  // Devuelve { categoria: { color: string, productos: [], layoutColor: string } }, omitiendo 'Pistas de improvisación'
  const organizeProductsByCategory = () => {
    const categorias = {};
    products.forEach((item) => {
      // Solo items regalables: offerId + giftable + precio > 0
      if (!item.offerId || item.giftable !== true || !item.finalPrice || item.finalPrice === 0) return;
      const categoria = item.layout?.name || "Otros";
      if (categoria === "Pistas de improvisación") return;
      const layoutColor =
        item.layout?.background || item.colors?.color1 || "#111115";
      if (!categorias[categoria]) {
        categorias[categoria] = { color: layoutColor, productos: [] };
      }
      categorias[categoria].productos.push(item);
    });

    // ✅ Ordenar: lotes primero, luego el resto (PARA TODAS LAS PANTALLAS)
    Object.keys(categorias).forEach((cat) => {
      categorias[cat].productos.sort((a, b) => {
        const aEsLote =
          a.bundle?.name ||
          a.layout?.name?.toLowerCase().includes("lote") ||
          a.brItems?.[0]?.name?.toLowerCase().includes("lote");

        const bEsLote =
          b.bundle?.name ||
          b.layout?.name?.toLowerCase().includes("lote") ||
          b.brItems?.[0]?.name?.toLowerCase().includes("lote");

        // Si A es lote y B no, A va primero (-1)
        if (aEsLote && !bEsLote) return -1;
        // Si B es lote y A no, B va primero (1)
        if (!aEsLote && bEsLote) return 1;
        // Si ambos son lotes o ambos no son lotes, mantener orden original
        return 0;
      });
    });

    return categorias;
  };

  const filteredProducts = () => {
    let filtered = products;

    // Solo items regalables: offerId + giftable + precio > 0
    filtered = filtered.filter(
      (product) => product.offerId && product.giftable === true && product.finalPrice && product.finalPrice > 0
    );

    // Filtrar productos cuya categoría sea 'Pistas de improvisación'
    filtered = filtered.filter(
      (product) =>
        (product.layout?.name || "Otros") !== "Pistas de improvisación"
    );

    if (searchTerm) {
      filtered = filtered.filter((product) => {
        const mainItem = product.brItems?.[0];
        return (
          mainItem?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mainItem?.rarity?.displayValue
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
        );
      });
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        (product) => (product.layout?.name || "Otros") === selectedCategory
      );
    }

    // ✅ Ordenar: lotes primero, luego el resto
    filtered.sort((a, b) => {
      const aEsLote =
        a.bundle?.name ||
        a.layout?.name?.toLowerCase().includes("lote") ||
        a.brItems?.[0]?.name?.toLowerCase().includes("lote");

      const bEsLote =
        b.bundle?.name ||
        b.layout?.name?.toLowerCase().includes("lote") ||
        b.brItems?.[0]?.name?.toLowerCase().includes("lote");

      // Si A es lote y B no, A va primero (-1)
      if (aEsLote && !bEsLote) return -1;
      // Si B es lote y A no, B va primero (1)
      if (!aEsLote && bEsLote) return 1;
      // Si ambos son lotes o ambos no son lotes, mantener orden original
      return 0;
    });

    return filtered;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="card">
          <div className="loader">
            <p>Cargando</p>
            <div className="words">
              <span className="word">Items</span>
              <span className="word">Skins</span>
              <span className="word">Lotes</span>
              <span className="word">Bailes</span>
              <span className="word">Canciones</span>
            </div>
          </div>
          <div>
            Codigo{" "}
            <span style={{ color: "gold", fontWeight: "bold" }}>TIOFLASH</span>{" "}
            en la tienda de fortnite
          </div>
        </div>
      </div>
    );
  }

  const categorizedProducts = organizeProductsByCategory();
  const filtered = filteredProducts();

  return (
    <>
      {/* Estilos personalizados para el scrollbar */}
      <style>{`
        .category-sidebar::-webkit-scrollbar {
          width: 10px;
        }

        .category-sidebar::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.5);
          border-radius: 10px;
          margin: 8px 0;
        }

        .category-sidebar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #3b82f6 0%, #2563eb 100%);
          border-radius: 10px;
          border: 2px solid rgba(31, 41, 55, 0.5);
        }

        .category-sidebar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #2563eb 0%, #1d4ed8 100%);
        }

        /* Firefox */
        .category-sidebar {
          scrollbar-width: thin;
          scrollbar-color: #3b82f6 rgba(31, 41, 55, 0.5);
        }
      `}</style>

      {/* Notification */}
      <div
        className={`fixed top-20 right-5 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg transition-opacity duration-500 z-50 ${
          notification ? "opacity-100" : "opacity-0 hidden"
        }`}
      >
        Producto agregado al carrito
      </div>

      <div className="pt-20 pb-8">
        {/* Header Moderno - Layout centrado */}
        <div className="px-4 max-w-[1400px] mx-auto mb-8">
          <div className="flex flex-col items-center gap-6">
            {/* Título y fecha centrados */}
            <div className="text-center">
              <div className="inline-block mb-4">
                
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600 bg-clip-text text-transparent">
                Rotación de la Tienda
              </h1>
              
              
            </div>

            {/* Badges y VS en la misma línea */}
            <div className="flex flex-col lg:flex-row items-center gap-6 w-full justify-center">
              {/* Badges informativos */}
              <div className="flex flex-col gap-3">
                <div className="inline-flex items-center gap-2 bg-yellow-600/20 text-yellow-400 px-4 py-2.5 rounded-full border border-yellow-600/30">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-sm font-semibold">Recuerda tenernos agregados 48hrs antes</span>
                </div>
                <div className="inline-flex items-center gap-2 bg-green-600/20 text-green-400 px-4 py-2.5 rounded-full border border-green-600/30">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-sm font-semibold">Usuarios: Reydelosvbucks | pavostioflash2</span>
                </div>
                <div className="inline-flex items-center gap-2 bg-blue-600/20 text-blue-300 px-4 py-2.5 rounded-full border border-blue-600/30">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse flex-shrink-0"></span>
                  <span className="text-sm font-semibold">🤖 Envío automático — tu skin llega sola tras el pago</span>
                </div>
              </div>

              {/* Comparación Epic vs Nosotros */}
              <div className="flex items-center gap-4">
                {/* Epic Games */}
                <div className="w-40">
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-center">
                    <div className="flex items-center justify-center gap-1.5 mb-1.5">
                      <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                      </svg>
                      <p className="text-xs font-semibold text-gray-300">Epic Games</p>
                    </div>
                    <p className="text-2xl font-bold text-red-400 leading-none">$6.7</p>
                    <p className="text-xs text-gray-400 mt-1">CLP/V-Buck</p>
                  </div>
                </div>

                {/* VS Divider */}
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full p-2.5 w-12 h-12 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg">VS</span>
                </div>

                {/* Nosotros */}
                <div className="w-40">
                  <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 text-center">
                    <div className="flex items-center justify-center gap-1.5 mb-1.5">
                      <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <p className="text-xs font-semibold text-gray-300">Nosotros</p>
                    </div>
                    <p className="text-2xl font-bold text-green-400 leading-none">${VBUCK_TO_CLP_RATE}</p>
                    <p className="text-xs text-gray-400 mt-1">CLP/V-Buck</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mensaje de ahorro */}
            <div className="text-center">
              <p className="text-sm text-gray-400">
                💰 Ahorra hasta un <span className="text-green-400 font-bold">{Math.round((1 - VBUCK_TO_CLP_RATE / 6.7) * 100)}%</span> comprando con nosotros
              </p>
            </div>
          </div>
        </div>

        {/* Layout con Sidebar */}
        <div className="flex gap-6 px-4 max-w-[1800px] mx-auto">
          {/* SIDEBAR IZQUIERDO - Categorías */}
          <aside className="w-64 flex-shrink-0 sticky top-24 h-fit hidden lg:block">
            <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700 max-h-[calc(100vh-120px)] overflow-y-auto category-sidebar">
              <h2 className="text-lg font-bold mb-4 text-white sticky top-0 bg-gray-800/50 pb-2 z-10">Categorías</h2>
              
              {/* Buscador dentro del sidebar */}
              <div className="mb-4 sticky top-12 bg-gray-800/50 pb-2 z-10">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Buscar items..."
                  className="w-full p-2.5 rounded-lg border border-gray-600 bg-gray-900/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
                />
              </div>

              {/* Todas las categorías */}
              <button
                onClick={() => setSelectedCategory("")}
                className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition-all ${
                  selectedCategory === ""
                    ? "bg-blue-600 text-white font-semibold"
                    : "text-gray-300 hover:bg-gray-700/50"
                }`}
              >
                <span className="mr-2">🌟</span>
                Todas las categorías
              </button>

              {/* Lista de categorías */}
              <div className="space-y-1">
                {Object.entries(categorizedProducts).map(
                  ([categoria, { productos }]) => (
                    <button
                      key={categoria}
                      onClick={() => setSelectedCategory(categoria)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                        selectedCategory === categoria
                          ? "bg-blue-600 text-white font-semibold"
                          : "text-gray-300 hover:bg-gray-700/50"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="truncate">{categoria}</span>
                        <span className="text-xs bg-gray-700 px-2 py-1 rounded-full ml-2">
                          {productos.length}
                        </span>
                      </div>
                    </button>
                  )
                )}
              </div>
            </div>
          </aside>

          {/* CONTENIDO PRINCIPAL - Derecha */}
          <main className="flex-1 min-w-0">
            {/* Buscador y Dropdown móvil */}
            <div className="flex flex-col gap-4 mb-6 lg:hidden">
              {/* Buscador móvil */}
              <div className="w-full max-w-md mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Buscar items..."
                    className="w-full p-3 pl-10 rounded-lg border border-gray-600 bg-gray-800/50 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                  />
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>

              {/* Dropdown de categorías móvil */}
              <div className="relative w-full max-w-md mx-auto">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-3 pr-10 rounded-lg bg-gray-800/50 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                >
                  <option value="">🌟 Todas las categorías</option>
                  {Object.entries(categorizedProducts).map(
                    ([categoria, { productos }]) => (
                      <option key={categoria} value={categoria}>
                        {categoria} ({productos.length})
                      </option>
                    )
                  )}
                </select>
                <svg
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* Productos */}
            <section>
              {selectedCategory ? (
                <div>
                  <h2 className="text-2xl font-semibold text-white border-b-2 border-blue-500 pb-2 mb-6">
                    {selectedCategory}
                  </h2>
                  <div className="flex flex-wrap gap-[20px] justify-center lg:justify-start items-start">
                    {filtered.slice(0, 20).map((product, index) => (
                      <ProductCard
                        key={product.offerId}
                        product={product}
                        onAddToCart={handleAddToCart}
                        onClick={handleProductClick}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                Object.entries(categorizedProducts).map(
                  ([categoria, { color, productos }]) => {
                    const productosFiltrados = searchTerm
                      ? productos.filter((product) => {
                          const mainItem = product.brItems?.[0];
                          const bundleName = product.bundle?.name || "";
                          return (
                            mainItem?.name
                              ?.toLowerCase()
                              .includes(searchTerm.toLowerCase()) ||
                            mainItem?.rarity?.displayValue
                              ?.toLowerCase()
                              .includes(searchTerm.toLowerCase()) ||
                            bundleName
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase())
                          );
                        })
                      : productos;

                    if (productosFiltrados.length === 0) return null;

                    return (
                      <div key={categoria} className="mb-12">
                        <h2 className="text-2xl font-semibold text-white border-b-2 border-blue-500 pb-2 mb-6">
                          {categoria}
                        </h2>
                        <div className="flex flex-wrap gap-[20px] justify-center lg:justify-start items-start">
                          {productosFiltrados.slice(0, 20).map((product) => (
                            <ProductCard
                              key={product.offerId}
                              product={product}
                              onAddToCart={handleAddToCart}
                              onClick={handleProductClick}
                              fallbackColor={color}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  }
                )
              )}
            </section>
          </main>
        </div>
      </div>
    </>
  );
};

export default Shop2;
