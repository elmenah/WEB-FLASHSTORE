import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";
import "../css/Shop.css";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
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

      // Retraso de 4 segundos antes de ocultar el loader
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    } catch (error) {
      console.error("❌ Error al cargar la API:", error);

      // Retraso de 4 segundos antes de ocultar el loader en caso de error
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    }
  };

  const handleAddToCart = (product) => {
    const cartProduct = {
      nombre: product.displayName,
      precio: product.price.finalPrice * 4.4,
      imagen:
        product.displayAssets?.[0]?.url ||
        product.granted?.[0]?.images?.icon_background,
    };

    addToCart(cartProduct);
    showNotification();
  };

  const handleProductClick = (product) => {
    const productData = {
      nombre: product.displayName,
      precio: product.price.finalPrice,
      imagen:
        product.displayAssets?.[0]?.url ||
        product.granted?.[0]?.images?.icon_background,
      descripcion:
        product.displayDescription ||
        product.description ||
        "Sin descripción disponible",
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
      colorfondo: product.colors?.color1,
      colorfondo2: product.colors?.color2,
    };

    const params = new URLSearchParams();
    Object.entries(productData).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });

    navigate(
      `/product/${encodeURIComponent(product.displayName)}?${params.toString()}`
    );
  };

  const showNotification = () => {
    setNotification(true);
    setTimeout(() => setNotification(false), 2000);
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
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.displayName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          product.rarity?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        (product) =>
          (product.section?.name || product.displayType || "Otros") ===
          selectedCategory
      );
    }

    return filtered;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="card">
          <div className="loader">
            <p>Cargando</p>
            <div className="words">
              <span className="word">Items</span>
              <span className="word">Skins</span>
              <span className="word">Lotes</span>
              <span className="word">Bailes</span>
              <span className="word">Canciones</span>
            </div>
          </div>
          <div>
            Codigo{" "}
            <span style={{ color: "gold", fontWeight: "bold" }}>TIOFLASH</span>{" "}
            en la tienda de fortnite
          </div>
        </div>
      </div>
    );
  }

  const categorizedProducts = organizeProductsByCategory();
  const filtered = filteredProducts();
  const TestAddProductButton = ({ addToCart, clearCart }) => {
    const addTestProduct = () => {
      clearCart(); // opcional: limpiar carrito antes
      addToCart({
        id: "test-100",
        nombre: "Producto de prueba $100",
        precio: 100,
        cantidad: 1,
        imagen: "https://via.placeholder.com/150",
      });
    };

    return (
      <button
        onClick={addTestProduct}
        className="p-2 bg-green-500 text-white rounded mt-4"
      >
        Agregar producto de prueba $100
      </button>
    );
  };
  return (
    <>
      {/* Notification */}
      <div
        className={`fixed top-20 right-5 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg transition-opacity duration-500 z-50 ${
          notification ? "opacity-100" : "opacity-0 hidden"
        }`}
      >
        Producto agregado al carrito
      </div>

      <div className="pt-20 pb-8">
        <div className="text-center mt-8">
          <h1 className="text-4xl font-bold">Tienda</h1>
          <p className="text-gray-400 mt-2">
            {new Date().toLocaleString("es-ES")}
          </p>
        </div>

        {/* Dropdown de categorías */}
        <div className="flex justify-center my-6">
          <button
            onClick={() => {
              clearCart();
              addToCart({
                id: "test-100",
                nombre: "Producto de prueba $100",
                precio: 100,
                cantidad: 1,
                imagen: "https://via.placeholder.com/150",
              });
            }}
            className="p-2 bg-green-500 text-white rounded mt-4"
          >
            Agregar producto de prueba $100
          </button>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-1/2 p-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="">Todas las categorías</option>
            {Object.keys(categorizedProducts).map((categoria) => (
              <option key={categoria} value={categoria}>
                {categoria}
              </option>
            ))}
          </select>
        </div>

        <section className="px-4">
          {selectedCategory ? (
            <div>
              <h2 className="text-2xl font-semibold text-white border-b-2 border-blue-500 pb-2 mb-4">
                {selectedCategory}
              </h2>
              <div className="flex flex-wrap gap-[25px] justify-center items-start p-5">
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
            Object.entries(categorizedProducts).map(
              ([categoria, productos]) => (
                <div key={categoria} className="mb-12">
                  <h2 className="text-2xl font-semibold text-white border-b-2 border-blue-500 pb-2 mb-4">
                    {categoria}
                  </h2>
                  <div className="flex flex-wrap gap-[25px] justify-center items-start p-5">
                    {productos.slice(0, 20).map((product, index) => (
                      <ProductCard
                        key={`${product.displayName}-${index}`}
                        product={product}
                        onAddToCart={handleAddToCart}
                        onClick={handleProductClick}
                      />
                    ))}
                  </div>
                </div>
              )
            )
          )}
        </section>
      </div>
    </>
  );
};

export default Shop;
