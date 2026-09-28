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

      setLoading(false);
    } catch (error) {
      console.error("❌ Error al cargar la API:", error);
      setProducts([]);
      setLoading(false);
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

  const categories = [...new Set(products.map(p => p.layout?.name || "Otros"))].filter(name => name !== "Pistas de improvisación");
  const matching = products.filter(p => {
    const category = p.layout?.name || "Otros";
    const name = p.bundle?.name || p.brItems?.[0]?.name || "";
    return category !== "Pistas de improvisación" && (!selectedCategory || category === selectedCategory) && name.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase());
  });
  const groups = categories.filter(name => !selectedCategory || selectedCategory === name).map(name => ({
    name,
    items: matching.filter(p => (p.layout?.name || "Otros") === name).sort((a, b) => Number(!!b.bundle?.name) - Number(!!a.bundle?.name))
  })).filter(group => group.items.length);
  return <div className="flash-shop">
    {notification && <div className="flash-toast" role="status">Producto agregado al carrito</div>}
    <div className="flash-container">
      <header className="flash-shop-heading"><div><p className="flash-eyebrow">FORTNITE · ROTACIÓN DIARIA</p><h1>Encuentra tu<br /><em>próximo estilo.</em></h1><p>Skins, lotes y accesorios. Elige cómo entrar a la partida.</p></div><div className="flash-shop-note"><span>ANTES DE COMPRAR</span><h2>Agrega nuestras cuentas</h2><p>Reydelosvbucks · pavostioflash2</p><small>Debes tenerlas agregadas al menos 48 horas antes.</small></div></header>
      <div className="flash-shop-toolbar"><label className="flash-search"><span>Buscar en la tienda</span><input type="search" value={searchInput} onChange={e => setSearchInput(e.target.value)} placeholder="Busca una skin o un lote…" /></label><label className="flash-category-select"><span>Categoría</span><select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}><option value="">Todas las categorías</option>{categories.map(c => <option key={c}>{c}</option>)}</select></label><p>{matching.length} productos</p></div>
      <div className="flash-shop-layout"><aside className="flash-shop-sidebar"><p className="flash-eyebrow">EXPLORA</p><button aria-pressed={!selectedCategory} onClick={() => setSelectedCategory("")}>Todas las categorías</button>{categories.map(c => <button key={c} aria-pressed={selectedCategory === c} onClick={() => setSelectedCategory(c)}>{c}</button>)}</aside><div className="flash-shop-results">
        {loading ? <div className="flash-product-grid" aria-label="Cargando tienda" aria-busy="true">{Array.from({length: 6}, (_,i) => <div className="flash-skeleton" key={i} />)}</div> : groups.length ? groups.map(group => <section className="flash-shop-group" key={group.name}><div className="flash-shop-group-title"><h2>{group.name}</h2><span>{group.items.length} productos</span></div><div className="flash-product-grid">{group.items.map(product => <ProductCard key={product.offerId} product={product} onAddToCart={handleAddToCart} onClick={handleProductClick} />)}</div></section>) : <div className="flash-empty"><h2>{products.length ? "No encontramos coincidencias" : "La tienda no está disponible por ahora"}</h2><p>{products.length ? "Prueba otro nombre o selecciona otra categoría." : "Vuelve a intentar cargar el catálogo."}</p><button className="flash-button" onClick={() => {setSearchInput("");setSearchTerm("");setSelectedCategory("");if(!products.length){setLoading(true);fetchProducts();}}}>{products.length ? "Limpiar filtros" : "Reintentar"}</button></div>}
      </div></div>
    </div>
  </div>;
};
export default Shop2;
