import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Zap, UserRound, ShoppingCart, Menu, X, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { supabase } from '../supabaseCliente';
const services = [['Recargas', '/recargas'], ['Streaming', '/streaming'], ['Activaciones', '/activaciones'], ['Juegos PC', '/juegos-pc'], ['Métodos de pago', '/metodos-de-pago']];
export default function Header() {
  const [session, setSession] = useState(null);
  const [mobile, setMobile] = useState(false);
  const [error, setError] = useState('');
  const { cart, openCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const menuButton = useRef(null);
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, current) => setSession(current));
    return () => subscription.unsubscribe();
  }, []);
  useEffect(() => { setMobile(false); }, [location.pathname]);
  useEffect(() => {
    const close = e => { if (e.key === 'Escape') { setMobile(false); menuButton.current?.focus(); } };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, []);
  const logout = async () => {
    const { error: failure } = await supabase.auth.signOut();
    if (failure) { setError('No pudimos cerrar la sesión. Inténtalo de nuevo.'); return; }
    setError(''); setMobile(false); navigate('/login');
  };
  return <header className="flash-header">
    <a className="flash-skip" href="#main-content">Saltar al contenido</a>
    <nav className="flash-container flash-nav" aria-label="Navegación principal">
      <Link to="/" className="flash-brand" aria-label="Tío Flashstore, inicio"><Zap fill="currentColor" /><span>TIO <strong>FLASHSTORE</strong></span></Link>
      <div className="flash-desktop-nav"><NavLink to="/shop">Tienda</NavLink><NavLink to="/club">Club Fortnite</NavLink>{services.map(([name, to]) => <NavLink key={to} to={to}>{name}</NavLink>)}</div>
      <div className="flash-nav-actions"><Link className="flash-account" aria-label={session ? 'Mi cuenta' : 'Ingresar'} to={session ? '/micuenta' : '/login'}><UserRound size={21} /><span>{session ? 'Mi cuenta' : 'Ingresar'}</span></Link><button className="flash-icon-button" onClick={openCart} aria-label={'Abrir carrito, ' + cart.length + ' productos'}><ShoppingCart size={22} />{cart.length > 0 && <span className="flash-cart-count">{cart.length}</span>}</button>{session && <button className="flash-icon-button flash-logout" onClick={logout} aria-label="Cerrar sesión"><LogOut size={19} /></button>}<button ref={menuButton} className="flash-icon-button flash-menu-toggle" aria-label={mobile ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={mobile} aria-controls="flash-mobile-nav" onClick={() => setMobile(!mobile)}>{mobile ? <X /> : <Menu />}</button></div>
    </nav>
    {mobile && <nav id="flash-mobile-nav" className="flash-mobile-nav" aria-label="Navegación móvil"><NavLink to="/shop">Tienda</NavLink><NavLink to="/club">Club Fortnite</NavLink>{services.map(([name, to]) => <NavLink key={to} to={to}>{name}</NavLink>)}</nav>}
    {error && <p role="alert" className="flash-header-error">{error}</p>}
  </header>;
}


