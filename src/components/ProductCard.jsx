import React from 'react';

const ProductCard = ({ product, onAddToCart, onClick, isBundle = false }) => {
  const handleCartClick = (e) => {
    e.stopPropagation();
    onAddToCart(product);
  };

  const handleCardClick = () => {
    onClick(product);
  };

  return (
    <div 
      className={`product-card cursor-pointer ${isBundle ? 'big-product-card' : ''}`}
      onClick={handleCardClick}
    >
      {product.banner?.name && (
        <div className="discount-banner">{product.banner.name}</div>
      )}
      
      <div 
        className="product-image" 
        style={{ backgroundColor: product.colors?.color1 }}
      >
        <img 
          src={product.displayAssets?.[0]?.url || product.granted?.[0]?.images?.icon_background} 
          alt={product.displayName}
        />
      </div>
      
      <div className="product-info">
        <h3>{product.displayName}</h3>
        <p><strong>Rareza:</strong> {product.rarity?.name || "Sin rareza"}</p>
        <p><strong></strong> {product.granted?.[0]?.set?.partOf || ""}</p>
        <div className="price">
          <img 
            src="https://lh3.googleusercontent.com/d/1VGnO_T1S2sH-IqqD8TX6aHyQKD7rEYzH=s220?authuser=0" 
            alt="V-Bucks" 
            style={{ width: '20px' }}
          />
          <span className="old-price">{product.price.finalPrice}</span>
          <span className="new-price">
            {(product.price.finalPrice * 4.4).toLocaleString("es-CL")} CLP
          </span>
        </div>
      </div>
      
      <button 
        className="carrito" 
        onClick={handleCartClick}
      >
        <img 
          src="https://lh3.googleusercontent.com/d/1G3MVAV9knIYqiLI6cI7gwKob6Vuvo5MC=s220?authuser=0" 
          alt="Añadir al carrito"
        />
      </button>
    </div>
  );
};

export default ProductCard;