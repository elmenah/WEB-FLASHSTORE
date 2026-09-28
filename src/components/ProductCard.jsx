import React from 'react';
import { Plus } from 'lucide-react';
import { formatPriceCLP } from '../config/prices';
export default function ProductCard({ product, onAddToCart, onClick, fallbackColor }) {
  const item = product.brItems?.[0];
  const name = product.bundle?.name || item?.name || 'Producto Fortnite';
  const image = product.bundle?.image || item?.images?.featured || item?.images?.icon;
  const raw = Object.values(product.colors || {})[0];
  const hex = typeof raw === 'string' ? raw.replace('#', '').slice(0, 6) : '';
  const accent = /^[a-f0-9]{6}$/i.test(hex) ? '#' + hex : fallbackColor || '#354257';
  return <article className={product.bundle?.name ? "flash-product-card flash-product-bundle" : "flash-product-card"} style={{ '--product-accent': accent }}>
    <button className="flash-product-open" onClick={() => onClick(product)} aria-label={'Ver ' + name}><div className="flash-product-image">{image && <img src={image} alt="" loading="lazy" />}<span>{product.bundle ? 'Lote' : item?.type?.displayValue || 'Fortnite'}</span></div><div className="flash-product-copy"><h3>{name}</h3><p>{formatPriceCLP(product.finalPrice)}</p><small>{product.finalPrice.toLocaleString('es-CL')} paVos{product.regularPrice > product.finalPrice && <del>{product.regularPrice.toLocaleString('es-CL')}</del>}</small></div></button>
    <button className="flash-product-add" aria-label={'Añadir ' + name + ' al carrito'} onClick={() => onAddToCart({ ...product, nombre: name, imagen: image })}><Plus size={21} /></button>
  </article>;
}

