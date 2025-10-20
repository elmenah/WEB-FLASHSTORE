import React from "react";

const ProductCard = ({ product, onAddToCart, onClick, fallbackColor }) => {
  const isBundle = !!product.bundle;
  const bundleName = product.bundle?.name;
  const bundleImage = product.bundle?.image;
  const bundleInfo = product.bundle?.info;
  const mainItem = product.brItems?.[0];
  const itemName = mainItem?.name;
  const itemImage = mainItem?.images?.featured || mainItem?.images?.icon;
  const itemSet = mainItem?.set?.text;
  const itemRarity = mainItem?.rarity?.displayValue;
  const price = product.finalPrice;
  const priceCLP = (price * 4.4).toLocaleString("es-CL");

  // 🎨 LÓGICA DE COLORES DINÁMICOS PARA EL FONDO
  const getCardColors = () => {
    let cardColor = null;
    let cardColorSecondary = null;

    if (product.colors) {
      let colorArray = [];
      
      // Si colors es un objeto, convertir a array
      if (typeof product.colors === 'object' && !Array.isArray(product.colors) && product.colors !== null) {
        colorArray = Object.values(product.colors);
      } else if (Array.isArray(product.colors)) {
        colorArray = product.colors;
      }

      if (colorArray.length > 0) {
        cardColor = colorArray[0] || null;
        cardColorSecondary = colorArray[1] || cardColor;
      }

      // Asegurar formato hexadecimal correcto
      if (cardColor && !cardColor.startsWith('#')) {
        cardColor = `#${cardColor.slice(0, 6)}`;
      }
      if (cardColorSecondary && !cardColorSecondary.startsWith('#')) {
        cardColorSecondary = `#${cardColorSecondary.slice(0, 6)}`;
      }
    }

    // Fallbacks a los colores originales si no hay colores en la API
    return {
      primary: cardColor || fallbackColor || "#47fdfe",
      secondary: cardColorSecondary || cardColor || fallbackColor || "#2b6fa1"
    };
  };

  const colors = getCardColors();

  const handleCartClick = (e) => {
    e.stopPropagation();
    const cartProduct = {
      ...product,
      nombre: isBundle && bundleName ? bundleName : itemName,
      imagen: isBundle && bundleImage ? bundleImage : itemImage,
    };
    onAddToCart(cartProduct);
  };

  const handleCardClick = () => {
    onClick(product);
  };

  return (
    <div
      className={`relative flex flex-col justify-end rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:scale-[1.01] transition-all cursor-pointer border border-[#33333a]
        ${
          isBundle
            ? "min-h-[380px] w-auto  max-w-[600px]"
            : "w-1/2 min-h-[280px] max-w-[140px] sm:w-[350px] sm:min-h-[380px] sm:max-w-[350px]"
        }`}
      style={{
        background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
        ...(isBundle && { 
          aspectRatio: '16/9' // Forzar una proporción específica para bundles
        })
      }}
      onClick={handleCardClick}
    >
      {/* Imagen principal */}
      <div className="absolute inset-0 flex items-center justify-center z-0">
        <img
          src={isBundle ? bundleImage : itemImage}
          alt={isBundle ? bundleName : itemName}
          className={`drop-shadow-xl ${
            isBundle 
              ? "object-contain w-full h-full max-h-[300px]" 
              : "object-contain max-h-[260px] max-w-[90%]"
          }`}
        />
      </div>
      
      {/* Degradado negro inferior */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/90 to-transparent z-10" />
      
      {/* Info y precios */}
      <div className="relative z-20 p-5 flex flex-col gap-2">
        <h3
          className={`font-bold ${
            isBundle ? "text-lg" : "text-sm"
          } text-white drop-shadow-lg mb-1`}
        >
          {isBundle ? bundleName : itemName}
        </h3>
        <div className={`flex items-center ${!isBundle ? 'gap-1 mb-1' : 'gap-2 mb-1'}`}>
          <img 
            src="https://fortnite-api.com/images/vbuck.png" 
            alt="V-Bucks" 
            className={`${!isBundle ? 'w-3 h-3 sm:w-5 sm:h-5' : 'w-5 h-5'} object-contain`} 
          />
          <span className={`${!isBundle ? 'text-xs sm:text-base' : 'text-base'} text-white font-bold`}>
            {price}
          </span>
          {product.regularPrice && product.regularPrice > price && (
            <span className={`${!isBundle ? 'text-[10px] sm:text-sm' : 'text-sm'} text-[#bbbbbb] line-through`}>
              {product.regularPrice}
            </span>
          )}
        </div>

        <div className={`flex items-center ${!isBundle ? 'gap-1' : 'gap-2'}`}>
          <span className={`${!isBundle ? 'text-xs sm:text-base' : 'text-base'} text-white font-bold`}>
            ${priceCLP}
          </span>
          {product.regularPrice && product.regularPrice > price && (
            <span className={`${!isBundle ? 'text-[10px] sm:text-xs' : 'text-xs'} text-[#bbbbbb] line-through`}>
              ${(product.regularPrice * 4.4).toLocaleString("es-CL")} clp
            </span>
          )}
        </div>
      </div>
      
      {/* Botón carrito SVG Lucide */}
      <button
        className="absolute bottom-4 right-4 p-3 rounded-full transition-transform transform hover:scale-110 flex items-center justify-center z-30 bg-transparent border-none shadow-none"
        onClick={handleCartClick}
        aria-label="Añadir al carrito"
        style={{ background: "transparent" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-shopping-cart w-7 h-7 text-white"
        >
          <circle cx="8" cy="21" r="1"></circle>
          <circle cx="19" cy="21" r="1"></circle>
          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
        </svg>
      </button>
    </div>
  );
};

export default ProductCard;
