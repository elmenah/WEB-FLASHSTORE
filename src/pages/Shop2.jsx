import { productPath, normalizeProduct, productName } from '../api/products';
import { fetchFortniteShop } from '../api/fortnite';
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";
import "../css/Shop.css";
import useScrollToTop from "../hooks/useScrollToTop";
import { VBUCK_TO_CLP_RATE } from "../config/prices";

const Shop2 = () => {
  useScrollToTop();
  const [products, setProducts] = useState([]);
  const [params, setParams] = useSearchParams();
  const location = useLocation();
  const searchTerm = params.get('q') || '';
  const searchInput = searchTerm;
  const selectedCategory = params.get('category') || '';
  const type = params.get('type') || '';
  const sort = params.get('sort') || '';
  const min = params.get('min') || '';
  const max = params.get('max') || '';
  const changeFilter = (key, value) => setParams(previous => { const next = new URLSearchParams(previous); value ? next.set(key, value) : next.delete(key); return next; }, { replace: true });
  const setSearchInput = value => changeFilter('q', value);
  const setSelectedCategory = value => changeFilter('category', value);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const fetchProducts = async (signal) => {
    setLoading(true);
    try { const entries = await fetchFortniteShop(signal); setProducts(entries.filter(p => p.offerId && p.giftable && p.finalPrice > 0)); }
    catch (error) { if (error.name !== 'AbortError') setProducts([]); }
    finally { if (!signal?.aborted) setLoading(false); }
  };
  useEffect(() => { const controller = new AbortController(); fetchProducts(controller.signal); return () => controller.abort(); }, []);
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

  const handleProductClick = product => navigate(productPath(product), { state: { product: normalizeProduct(product), shopSearch: location.search } });

  const showNotification = () => {
    setNotification(true);
    setTimeout(() => setNotification(false), 2000);
  };

  const categories = [...new Set(products.map(p => p.layout?.name || "Otros"))].filter(name => name !== "Pistas de improvisación");
  const matching = products.filter(p => {
    const category = p.layout?.name || "Otros";
    const name = productName(p);
    const price = p.finalPrice * VBUCK_TO_CLP_RATE;
    if (type === "bundles" && !p.bundle?.name || type === "skins" && (p.bundle?.name || p.brItems?.[0]?.type?.value !== "outfit")) return false;
    if (min !== "" && price < Number(min) || max !== "" && price > Number(max)) return false;
    return category !== "Pistas de improvisación" && (!selectedCategory || category === selectedCategory) && name.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase());
  });
  let groups = categories.filter(name => !selectedCategory || selectedCategory === name).map(name => ({
    name,
    items: matching.filter(p => (p.layout?.name || "Otros") === name).sort((a, b) => Number(!!b.bundle?.name) - Number(!!a.bundle?.name))
  })).filter(group => group.items.length);
  if (sort) groups = [{ name: 'Resultados', items: [...matching].sort((a,b) => sort === 'asc' ? a.finalPrice-b.finalPrice : sort === 'desc' ? b.finalPrice-a.finalPrice : productName(a).localeCompare(productName(b), 'es')) }].filter(g => g.items.length);
  return <div className="flash-shop">
    {notification && <div className="flash-toast" role="status">Producto agregado al carrito</div>}
    <div className="flash-container">
      <header className="flash-shop-heading"><div><p className="flash-eyebrow">FORTNITE · ROTACIÓN DIARIA</p><h1>Encuentra tu<br /><em>próximo estilo.</em></h1><p>Skins, lotes y accesorios. Elige cómo entrar a la partida.</p></div><div className="flash-shop-note"><span>ANTES DE COMPRAR</span><h2>Agrega nuestras cuentas</h2><p>Reydelosvbucks · pavostioflash2</p><small>Debes tenerlas agregadas al menos 48 horas antes.</small></div></header>
      <div className="flash-shop-toolbar"><label className="flash-search"><span>Buscar en la tienda</span><input type="search" value={searchInput} onChange={e => setSearchInput(e.target.value)} placeholder="Busca una skin o un lote…" /></label><label className="flash-category-select"><span>Categoría</span><select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}><option value="">Todas las categorías</option>{categories.map(c => <option key={c}>{c}</option>)}</select></label><p>{matching.length} productos</p></div>
      <div className="flash-shop-filters">
        <label>Tipo<select value={type} onChange={e => changeFilter('type', e.target.value)}><option value="">Todos</option><option value="bundles">Lotes</option><option value="skins">Skins</option></select></label>
        <label>Precio mínimo (CLP)<input type="number" min="0" value={min} onChange={e => changeFilter('min', e.target.value)} placeholder="Sin mínimo" /></label>
        <label>Precio máximo (CLP)<input type="number" min="0" value={max} onChange={e => changeFilter('max', e.target.value)} placeholder="Sin máximo" /></label>
        <label>Ordenar<select value={sort} onChange={e => changeFilter('sort', e.target.value)}><option value="">Destacados</option><option value="asc">Menor precio</option><option value="desc">Mayor precio</option><option value="name">Nombre A–Z</option></select></label>
        <button className="flash-button flash-button-secondary" onClick={() => setParams({})}>Limpiar filtros</button>
      </div>
      <div className="flash-shop-layout"><aside className="flash-shop-sidebar"><p className="flash-eyebrow">EXPLORA</p><button aria-pressed={!selectedCategory} onClick={() => setSelectedCategory("")}>Todas las categorías</button>{categories.map(c => <button key={c} aria-pressed={selectedCategory === c} onClick={() => setSelectedCategory(c)}>{c}</button>)}</aside><div className="flash-shop-results">
        {loading ? <div className="flash-product-grid" aria-label="Cargando tienda" aria-busy="true">{Array.from({length: 6}, (_,i) => <div className="flash-skeleton" key={i} />)}</div> : groups.length ? groups.map(group => <section className="flash-shop-group" key={group.name}><div className="flash-shop-group-title"><h2>{group.name}</h2><span>{group.items.length} productos</span></div><div className="flash-product-grid">{group.items.map(product => <ProductCard key={product.offerId} product={product} onAddToCart={handleAddToCart} onClick={handleProductClick} />)}</div></section>) : <div className="flash-empty"><h2>{products.length ? "No encontramos coincidencias" : "La tienda no está disponible por ahora"}</h2><p>{products.length ? "Prueba otro nombre o selecciona otra categoría." : "Vuelve a intentar cargar el catálogo."}</p><button className="flash-button" onClick={() => {setParams({});if(!products.length){setLoading(true);fetchProducts();}}}>{products.length ? "Limpiar filtros" : "Reintentar"}</button></div>}
      </div></div>
    </div>
  </div>;
};
export default Shop2;
