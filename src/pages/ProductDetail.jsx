import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, ArrowRight, ShoppingCart, ShieldCheck, Gift, Clock } from "lucide-react";
import { useCart } from "../context/CartContext";
import useScrollToTop from "../hooks/useScrollToTop";
import { convertVBuckToCLP, formatPriceCLP } from "../config/prices";

export default function ProductDetail() {
  useScrollToTop();
  const { state } = useLocation();
  const { addToCart } = useCart();
  const [notification, setNotification] = useState(false);
  const notificationTimer = useRef(null);
  useEffect(() => () => clearTimeout(notificationTimer.current), []);
  const product = state?.product;
  if (!product) return <div className="flash-detail flash-empty"><h1>Producto no disponible</h1><p>Abre un producto desde la tienda para consultar sus detalles.</p><Link to="/shop" className="flash-button">Volver a la tienda <ArrowRight size={18} /></Link></div>;
  const isBundle = product.tipo === "Lote";
  const add = () => {
    addToCart({ nombre: product.nombre, precio: convertVBuckToCLP(product.precio), imagen: product.imagen, offer_id: product.offer_id || null, pavos: product.pavos || product.precio || 0 });
    clearTimeout(notificationTimer.current);
    setNotification(true);
    notificationTimer.current = setTimeout(() => setNotification(false), 3000);
  };
  const date = value => value && !Number.isNaN(Date.parse(value)) ? new Date(value).toLocaleString("es-CL", {dateStyle:"medium", timeStyle:"short"}) : null;
  return <div className="flash-detail"><div className="flash-container">
    {notification && <div className="flash-toast" role="status">Producto añadido al carrito</div>}
    <nav className="flash-breadcrumb" aria-label="Ruta de navegación"><Link to="/shop"><ArrowLeft size={16} /> Tienda</Link><span>/</span><span>{product.nombre}</span></nav>
    <div className="flash-detail-layout">
      <div className="flash-detail-art" style={{"--product-accent": /^#[a-f0-9]{6}$/i.test(product.color1) ? product.color1 : "#383c36"}}><span className="flash-detail-badge">{isBundle ? "LOTE DE FORTNITE" : product.tipo}</span><img src={product.imagen} alt={product.nombre} /><span className="flash-detail-art-caption">FORTNITE · ELIGE TU ESTILO</span></div>
      <section className="flash-detail-info"><p className="flash-eyebrow">{isBundle ? "MÁS ESTILO EN UN SOLO LOTE" : "DALE TU TOQUE A LA PARTIDA"}</p><h1>{product.nombre}</h1><p className="flash-detail-description">{product.descripcion}</p>
        <div className="flash-detail-tags">{product.rareza && product.rareza !== "Sin rareza" && <span>{product.rareza}</span>}{product.partede && <span>{product.partede}</span>}</div>
        <div className="flash-detail-price"><small>PRECIO TOTAL</small><strong>{formatPriceCLP(product.precio)}</strong><span>{product.precio.toLocaleString("es-CL")} paVos</span></div>
        <button className="flash-button flash-buy-button" onClick={add}><ShoppingCart size={20} /> Añadir al carrito <ArrowRight size={20} /></button>
        <div className="flash-detail-assurances"><span><Gift size={17} /> Entrega como regalo</span><Link to="/metodos-de-pago"><ShieldCheck size={17} /> Pagos seguros</Link></div>
        <div className="flash-detail-warning"><Clock size={20} /><div><strong>Antes de comprar</strong><p>Agrega a Reydelosvbucks y pavostioflash2 al menos 48 horas antes de tu compra.</p></div></div>
        {date(product.fin) && <p className="flash-detail-date">Disponible hasta: {date(product.fin)}</p>}{product.mensajeSalida && <p className="flash-detail-date">{product.mensajeSalida}</p>}
      </section>
    </div>
    {isBundle && product.contenido?.length > 0 && <section className="flash-bundle-contents"><div className="flash-section-heading"><div><p className="flash-eyebrow">TODO ESTO ES PARTE DEL LOTE</p><h2>¿Qué incluye?</h2></div><span>{product.contenido.length} objetos</span></div><div className="flash-included-grid">{product.contenido.map((item,i) => <article key={i}>{item.imagen && <img src={item.imagen} alt="" loading="lazy" />}<h3>{item.nombre}</h3></article>)}</div></section>}
  </div></div>;
}
