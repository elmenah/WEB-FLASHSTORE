import React from 'react';

const COLOR1 = '#47fdfe'; // celeste vibrante
const COLOR2 = '#2b6fa1'; // azul medio

const ProductCard = ({ product, onAddToCart, onClick }) => {
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
  const priceCLP = (price * 4.4).toLocaleString('es-CL');
  const handleCartClick = (e) => {
    e.stopPropagation();
    // Si es bundle, usa el nombre del bundle; si no, el del item principal
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
      className={`relative flex flex-col justify-end bg-gradient-to-br from-[${COLOR1}] to-[${COLOR2}] rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:scale-[1.01] transition-all min-h-[380px] ${isBundle ? 'max-w-[700px] w-[800px]' : 'max-w-[400px] w-[300px]'} cursor-pointer border border-[#33333a]`}
      onClick={handleCardClick}
    >
      {/* Imagen principal */}
      <div className="absolute inset-0 flex items-center justify-center z-0">
        <img
          src={isBundle ? bundleImage : itemImage}
          alt={isBundle ? bundleName : itemName}
          className="object-contain max-h-[260px] max-w-[90%] drop-shadow-xl"
        />
      </div>
      {/* Degradado negro inferior */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/90 to-transparent z-10" />
      {/* Info y precios */}
      <div className="relative z-20 p-5 flex flex-col gap-2">
        <h3 className="font-bold text-lg text-white drop-shadow-lg mb-1">{isBundle ? bundleName : itemName}</h3>
        <div className="flex items-center gap-2 mb-1">
          <img src="https://fortnite-api.com/images/vbuck.png" alt="V-Bucks" className="w-5 h-5 object-contain" />
          <span className="text-white text-base font-bold">{price}</span>
          {product.regularPrice && product.regularPrice > price && (
            <span className="text-[#bbbbbb] text-sm line-through">{product.regularPrice}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white text-base font-bold">${priceCLP}</span>
          {product.regularPrice && product.regularPrice > price && (
            <span className="text-[#bbbbbb] text-xs line-through">${(product.regularPrice * 4.4).toLocaleString('es-CL')} clp</span>
          )}
        </div>
      </div>
      {/* Botón carrito SVG Lucide */}
      <button
        className="absolute bottom-4 right-4 p-3 rounded-full transition-transform transform hover:scale-110 flex items-center justify-center z-30 bg-transparent border-none shadow-none"
        onClick={handleCartClick}
        aria-label="Añadir al carrito"
        style={{ background: 'transparent' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shopping-cart w-7 h-7 text-white"><circle cx="8" cy="21" r="1"></circle><circle cx="19" cy="21" r="1"></circle><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path></svg>
      </button>
    </div>
  );
};

export default ProductCard;

