import React from 'react';

const ProductCard = ({ product, onAddToCart, onClick }) => {
  const handleCartClick = (e) => {
    e.stopPropagation();
    onAddToCart(product);
  };

  const handleCardClick = () => {
    onClick(product);
  };

  // Verificar si el tipo contiene "Lote de"
  const isBundle = product.displayType?.toLowerCase().includes("lote de");

  return (
    <div 
      className={`relative bg-[#1e1e24] rounded-lg shadow-lg overflow-hidden transition-transform transform hover:translate-y-[-5px] hover:shadow-2xl hover:border-[#4f46e5] cursor-pointer ${
        isBundle ? 'w-[400px]' : 'w-[280px]'
      } h-[420px]`}
      onClick={handleCardClick}
    >
      {product.banner?.name && (
        <div className="absolute top-2 left-2 bg-[#4f46e5] text-white text-xs font-bold px-2 py-1 rounded-md shadow-md z-10">
          {product.banner.name}
        </div>
      )}
      
      <div 
        className="h-[65%] flex items-center justify-center bg-[#111115]"
        style={{ backgroundColor: product.colors?.color1 }}
      >
        <img 
          src={product.displayAssets?.[0]?.url || product.granted?.[0]?.images?.icon_background} 
          alt={product.displayName}
          className="object-contain w-full h-full transition-transform duration-300 hover:scale-105"
        />
      </div>
      
      <div className="absolute bottom-0 left-0 w-full p-4 bg-[#1e1e24] border-t border-[#33333a] text-white text-sm">
        <h3 className="font-bold text-lg mb-2">{product.displayName}</h3>
        <p className="text-[#999] text-xs"><strong>Rareza:</strong> {product.rarity?.name || "Sin rareza"}</p>
        <p className="text-[#999] text-xs"><strong>Parte del lote:</strong> {product.granted?.[0]?.set?.partOf || ""}</p>
        <div className="flex items-center gap-2 mt-2 bg-[#2b2b35] p-2 rounded-lg">
          <img 
            src="https://lh3.googleusercontent.com/d/1VGnO_T1S2sH-IqqD8TX6aHyQKD7rEYzH=s220?authuser=0" 
            alt="V-Bucks" 
            className="w-4 h-4"
          />
          <span className="text-[#999] text-xs line-through">{product.price.finalPrice}</span>
          <span className="text-[#4f46e5] font-bold text-sm">
            {(product.price.finalPrice * 4.4).toLocaleString("es-CL")} CLP
          </span>
        </div>
      </div>
      
      <button 
        className="absolute bottom-4 right-4 bg-[#4f46e5] text-white p-2 rounded-full shadow-md hover:bg-[#3b31c5] transition-transform transform hover:scale-110"
        onClick={handleCartClick}
      >
        <img 
          src="https://lh3.googleusercontent.com/d/1G3MVAV9knIYqiLI6cI7gwKob6Vuvo5MC=s220?authuser=0" 
          alt="Añadir al carrito"
          className="w-6 h-6"
        />
      </button>
    </div>
  );
};

export default ProductCard;