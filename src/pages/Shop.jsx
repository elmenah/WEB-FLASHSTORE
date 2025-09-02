import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import '../assets/css/shop.css';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        "https://fortniteapi.io/v2/shop?lang=es-419&includeRenderData=false",
        {
          headers: {
            Authorization: "11b1a0cd-5fdf5d92-62c4e04b-7356366c",
          },
        }
      );
      
      if (!response.ok) throw new Error("Error al obtener los datos de la API");
      
      const data = await response.json();
      setProducts(data.shop);
      setLoading(false);
    } catch (error) {
      console.error("❌ Error al cargar la API:", error);
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    const cartProduct = {
      nombre: product.displayName,
      precio: product.price.finalPrice * 4.4,
      imagen: product.displayAssets?.[0]?.url || product.granted?.[0]?.images?.icon_background,
    };
    
    addToCart(cartProduct);
    showNotification();
  };

  const handleProductClick = (product) => {
    const productData = {
      nombre: product.displayName,
      precio: product.price.finalPrice,
      imagen: product.displayAssets?.[0]?.url || product.granted?.[0]?.images?.icon_background,
      descripcion: product.displayDescription || product.description || "Sin descripción disponible",
      grupo: product.series?.name || product.set?.name || "Sin categoría",
      tipo: product.displayType || "No especificado",
      descuento: product.banner?.name || null,
      inicio: product.offerDates?.in || null,
      fin: product.offerDates?.out || null,
      rareza: product.rarity?.name || "Sin rareza",
      partede: product.granted?.[0]?.set?.partOf || "",
      bundle: product.granted?.[0]?.images?.icon_background,
      bundle2: product.granted?.[1]?.images?.icon_background,
      bundle3: product.granted?.[2]?.images?.icon_background,
      bundle4: product.granted?.[3]?.images?.icon_background,
      colorfondo: product.colors?.color1
    };

    const params = new URLSearchParams();
    Object.entries(productData).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });

    navigate(`/product/${encodeURIComponent(product.displayName)}?${params.toString()}`);
  };

  const showNotification = () => {
    setNotification(true);
    setTimeout(() => setNotification(false), 2000);
  };

  const getCurrentDateTime = () => {
    const fecha = new Date();
    const opciones = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    };
    return fecha.toLocaleString("es-ES", opciones);
  };

  const organizeProductsByCategory = () => {
    const categorias = {};
    
    products.forEach((item) => {
      const categoria = item.section?.name || item.displayType || "Otros";
      if (!categorias[categoria]) categorias[categoria] = [];
      
      categorias[categoria].push(item);
    });

    return categorias;
  };

  const filteredProducts = () => {
    if (!searchTerm) return products;
    return products.filter(product => 
      product.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.rarity?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl">Cargando productos...</div>
      </div>
    );
  }

  const categorizedProducts = organizeProductsByCategory();
  const filtered = filteredProducts();

  return (
    <>
      {/* Notification */}
      <div className={`fixed top-20 right-5 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg transition-opacity duration-500 z-50 ${notification ? 'opacity-100' : 'opacity-0 hidden'}`}>
        Producto agregado al carrito
      </div>

      <div className="pt-20 pb-8">
        <div className="text-center mt-8">
          <h1 className="text-4xl font-bold">Tienda de Fortnite</h1>
          <p className="text-gray-400 mt-2">{getCurrentDateTime()}</p>
        </div>

        {/* Search */}
        <div className="flex justify-center my-6">
          <input 
            type="text" 
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-1/2 p-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600" 
          />
        </div>

        <section className="px-4">
          {searchTerm ? (
            // Show filtered results
            <div>
              <h2 className="category-title">Resultados de búsqueda</h2>
              <div className="product-container">
                {filtered.slice(0, 20).map((product, index) => (
                  <ProductCard
                    key={`${product.displayName}-${index}`}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onClick={handleProductClick}
                  />
                ))}
              </div>
            </div>
          ) : (
            // Show categorized products
            Object.entries(categorizedProducts)
              .sort(([a], [b]) => a === "Pistas de improvisación" ? 1 : b === "Pistas de improvisación" ? -1 : 0)
              .map(([categoria, productos]) => (
                <div key={categoria} className="mb-12">
                  <h2 className="category-title">{categoria}</h2>
                  <div className={categoria === "Pistas de improvisación" ? "pistas-container" : "product-container"}>
                    {productos.slice(0, 20).map((product, index) => (
                      <ProductCard
                        key={`${product.displayName}-${index}`}
                        product={product}
                        onAddToCart={handleAddToCart}
                        onClick={handleProductClick}
                        isBundle={product.displayType === "bundle"}
                      />
                    ))}
                  </div>
                </div>
              ))
          )}
        </section>
      </div>
    </>
  );
};

export default Shop;