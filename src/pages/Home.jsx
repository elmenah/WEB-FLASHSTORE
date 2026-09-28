import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, ShieldCheck, Headphones, UserPlus, ShoppingBag, Gift, Gamepad2, MonitorPlay, KeyRound } from 'lucide-react';
import { fetchFortniteShop } from '../api/fortnite';
import { formatPriceCLP } from '../config/prices';
import useScrollToTop from '../hooks/useScrollToTop';
const collections = [
  { name: 'Tienda de Fortnite', image: '/Imagenes/cap7.png', to: '/shop', label: 'Skins, lotes y accesorios' },
  { name: 'Club Fortnite', image: '/Imagenes/fn crew/fnmarzo.png', to: '/club', label: 'Descubre el club' },
  { name: 'Pases de Fortnite', image: '/Imagenes/pasebatalla.jpg', to: '/shop', label: 'Explora la tienda' },
  { name: 'Juegos para PC', image: '/Imagenes/minecraft-java-bedrock.webp', to: '/juegos-pc', label: 'Tu próxima aventura' },
];
export default function Home() {
  useScrollToTop();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    fetchFortniteShop(controller.signal).then(entries => {
      if (active) setProducts(entries.filter(p => p.offerId && p.giftable && p.finalPrice > 0 && p.bundle?.name && p.bundle?.image).slice(0, 4));
    }).catch(() => {}).finally(() => { clearTimeout(timeout); if (active) setLoading(false); });
    return () => { active = false; clearTimeout(timeout); controller.abort(); };
  }, []);
  return <div className="flash-home">
    <section className="flash-hero">
      <img className="flash-hero-art" src="/Imagenes/flash-hero.png" alt="" fetchPriority="high" />
      <div className="flash-container flash-hero-content">
        <p className="flash-eyebrow">FORTNITE · SKINS Y PASES</p>
        <h1>Bienvenido a<br /><em>Tio Flashstore</em></h1>
        <p className="flash-hero-description"><strong>Tu tienda confiable de skins, lotes y pases de Fortnite</strong></p>
        <div className="flash-actions"><Link className="flash-button" to="/shop">Explorar tienda <ArrowRight size={20} /></Link><a className="flash-button flash-button-secondary" href="#como-comprar">Cómo comprar</a></div>
        <p className="flash-hero-caption">TU ESTILO. TU SIGUIENTE NIVEL.</p>
      </div>
    </section>
    <div className="flash-trust"><div className="flash-container"><span><Zap /> Entrega automática</span><Link to="/metodos-de-pago"><ShieldCheck /> Métodos de pago seguros</Link><a href="https://instagram.com/tioflashstore" target="_blank" rel="noreferrer"><Headphones /> Soporte personalizado</a><small>JUEGA DIFERENTE.</small></div></div>
    <section className="flash-container flash-section" aria-busy={loading}>
      <div className="flash-section-heading"><div><p className="flash-eyebrow">ENCUENTRA TU ESTILO</p><h2>{loading || products.length ? 'Lotes destacados' : 'Explora Flashstore'}</h2></div><Link to="/shop">Ver tienda <ArrowRight size={18} /></Link></div>
      <div className="flash-featured-grid">
        {loading ? Array.from({length: 4}, (_, i) => <div key={i} className="flash-skeleton" aria-label="Cargando productos" />) : products.length ? products.map(p => {
          const item = p.brItems?.[0];
          const name = p.bundle?.name || item?.name;
          return <Link to="/shop" className="flash-featured-card" key={p.offerId}><div className="flash-featured-image"><img loading="lazy" src={p.bundle?.image || item?.images?.featured || item?.images?.icon} alt={name} /><span>Lote</span></div><div className="flash-featured-info"><div><h3>{name}</h3><p>{formatPriceCLP(p.finalPrice)}</p></div><span className="flash-card-arrow"><ArrowRight size={20} /></span></div></Link>;
        }) : collections.map(item => <Link to={item.to} className="flash-featured-card" key={item.name}><div className="flash-featured-image flash-collection-image"><img src={item.image} alt="" loading="lazy" /></div><div className="flash-featured-info"><div><h3>{item.name}</h3><p>{item.label}</p></div><span className="flash-card-arrow"><ArrowRight size={20} /></span></div></Link>)}
      </div>
    </section>
    <section id="como-comprar" className="flash-container flash-steps">
      <div><p className="flash-eyebrow">FÁCIL, DE PRINCIPIO A FIN</p><h2>Listo en 3 pasos</h2><p>Recuerda agregarnos al menos 48 horas antes de comprar.</p></div>
      <div className="flash-step"><UserPlus /><div><b>01</b><h3>Agrega nuestras cuentas</h3><p>Reydelosvbucks<br />pavostioflash2</p></div></div>
      <div className="flash-step"><ShoppingBag /><div><b>02</b><h3>Elige tu producto</h3><p>Explora la tienda y completa tu compra.</p></div></div>
      <div className="flash-step"><Gift /><div><b>03</b><h3>Recibe tu regalo</h3><p>Tras confirmar el pago y cumplir el requisito de amistad.</p></div></div>
    </section>
    <section className="flash-container flash-section"><div className="flash-section-heading"><div><p className="flash-eyebrow">MÁS FORMAS DE DISFRUTAR</p><h2>Tu mundo digital, aquí.</h2></div></div><div className="flash-services">
      {[[Gamepad2, 'Juegos PC', 'Encuentra tu próxima aventura.', '/juegos-pc'], [MonitorPlay, 'Streaming', 'Tus series y anime favoritos.', '/streaming'], [KeyRound, 'Activaciones', 'Herramientas para tu día a día.', '/activaciones']].map(([Icon, title, description, to]) => <Link key={to} to={to}><Icon /><h3>{title}</h3><p>{description}</p><ArrowRight className="flash-service-arrow" size={20} /></Link>)}
    </div></section>
    <section className="flash-container flash-payments" aria-labelledby="payments-title"><div><p className="flash-eyebrow">COMPRA CON CONFIANZA</p><h2 id="payments-title">Métodos de pago seguros</h2><Link to="/metodos-de-pago">Consulta las opciones disponibles <ArrowRight size={16} /></Link></div><div className="flash-payment-logos">{[['Mercado Pago', 'Mercado_Pago.svg.png'], ['Visa', 'Visa_Logo.png'], ['Mastercard', 'MasterCard_early_1990s_logo.png'], ['Webpay', 'logo-web-pay-plus.png']].map(([name, file]) => <div key={name}><img src={'/Imagenes/' + file} alt={name} loading="lazy" /></div>)}</div></section>
    <section className="flash-container flash-faq"><div><p className="flash-eyebrow">ANTES DE COMPRAR</p><h2>Todo claro.<br />A jugar.</h2></div><div>
      <details><summary>¿Cómo recibo mi compra?</summary><p>Los cosméticos se envían como regalo a la cuenta de Fortnite que indiques al comprar. Revisa tu nombre de usuario antes de completar el pedido.</p></details>
      <details><summary>¿Por qué debo agregar las cuentas antes?</summary><p>Debes tener agregadas nuestras cuentas Reydelosvbucks y pavostioflash2 al menos 48 horas antes de comprar para poder recibir regalos.</p></details>
      <details><summary>¿Dónde puedo pedir ayuda?</summary><p>Escríbenos a <a href="https://instagram.com/tioflashstore" target="_blank" rel="noreferrer">@tioflashstore en Instagram</a> para recibir asistencia con tu pedido.</p></details>
    </div></section>
  </div>;
}
