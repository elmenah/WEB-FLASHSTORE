import React from 'react';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
export default function Footer() {
  return <footer className="flash-footer"><div className="flash-container flash-footer-content"><div><Link to="/" className="flash-brand"><Zap fill="currentColor" /><span>TIO <strong>FLASHSTORE</strong></span></Link><p>Tu mundo digital, al siguiente nivel.</p><p>© {new Date().getFullYear()} Tío Flashstore</p></div><nav className="flash-footer-links" aria-label="Enlaces del pie de página"><Link to="/shop">Tienda</Link><Link to="/metodos-de-pago">Métodos de pago</Link><Link to="/terminos">Términos y condiciones</Link><a href="https://instagram.com/tioflashstore" target="_blank" rel="noreferrer">Instagram ↗</a></nav></div></footer>;
}
