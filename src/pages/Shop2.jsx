import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import '../css/Shop.css';

const Shop2 = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchInput, setSearchInput] = useState('');
    // Debounce para el buscador
    useEffect(() => {
        const handler = setTimeout(() => {
            setSearchTerm(searchInput);
        }, 400);
        return () => clearTimeout(handler);
    }, [searchInput]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(false);
    const { addToCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch("https://fortnite-api.com/v2/shop?language=es");

            if (!response.ok) throw new Error("Error al obtener los datos de la API");

            const data = await response.json();
            console.log("🔎 Respuesta API:", data);

            // La API ahora devuelve los productos en 'data.data.entries'
            if (data?.data?.entries && Array.isArray(data.data.entries)) {
                setProducts(data.data.entries); // Establece el array de entradas
            } else {
                console.error("⚠️ La API no devolvió 'entries' como arreglo");
                setProducts([]);
            }

            setTimeout(() => setLoading(false), 3000);
        } catch (error) {
            console.error("❌ Error al cargar la API:", error);
            setProducts([]);
            setTimeout(() => setLoading(false), 3000);
        }
    };

    const handleAddToCart = (product) => {
        // Si es bundle, usa el nombre e imagen del bundle; si no, del item principal
        let nombre = '';
        let imagen = '';
        if (product.bundle && product.bundle.name) {
            nombre = product.bundle.name;
            imagen = product.bundle.image;
        } else if (product.brItems?.[0]) {
            nombre = product.brItems[0].name;
            imagen = product.brItems[0].images?.icon || product.brItems[0].images?.featured;
        } else {
            nombre = 'Producto';
            imagen = '';
        }
        const cartProduct = {
            nombre,
            precio: product.finalPrice * 4.4,
            imagen,
        };
        addToCart(cartProduct);
        showNotification();
    };

    const handleProductClick = (product) => {
        const isBundle = product.bundle?.name;

        const colors = isBundle
            ? [
                product.colors?.color1 || "#111115",
                product.colors?.color2 || product.colors?.color1 || "#111115",
                product.colors?.color3 || product.colors?.color2 || product.colors?.color1 || "#111115",
            ]
            : product.brItems?.[0]?.series?.colors.map((color) => `#${color.slice(0, 6)}`) || ["#111115", "#111115"];

        const productData = isBundle
            ? {
                nombre: product.bundle.name || "Lote sin nombre",
                precio: product.finalPrice,
                imagen: product.bundle.image || "URL_IMAGEN_DEFAULT",
                descripcion: product.bundle.info || "Sin descripción disponible",
                
                grupo: "Lote",
                tipo: "Lote",
                rareza: product.rarity?.displayValue || "Sin rareza",
                banner: product.banner?.value || null,
                inicio: product.inDate || null,
                fin: product.outDate || null,
                color1: colors[0],
                color2: colors[1],
                color3: colors[2],
            }
            : {
                nombre: product.brItems?.[0]?.name || "Sin nombre",
                precio: product.finalPrice,
                imagen:
                    product.brItems?.[0]?.images?.featured ||
                    product.brItems?.[0]?.images?.icon ||
                    "URL_IMAGEN_DEFAULT",
                descripcion: product.brItems?.[0]?.description || "Sin descripción disponible",
                partede: product.brItems?.[0]?.set?.text || "", 
                grupo: product.brItems?.[0]?.set?.text || "Sin categoría",
                tipo: product.brItems?.[0]?.type?.displayValue || "No especificado",
                rareza: product.brItems?.[0]?.rarity?.displayValue || "Sin rareza",
                banner: product.banner?.value || null,
                inicio: product.inDate || null,
                fin: product.outDate || null,
                color1: colors[0],
                color2: colors[1],
                color3: colors[2],
            };

        const params = new URLSearchParams();
        Object.entries(productData).forEach(([key, value]) => {
            if (value) params.append(key, value);
        });

        navigate(`/product/${encodeURIComponent(productData.nombre)}?${params.toString()}`);
    };

    const showNotification = () => {
        setNotification(true);
        setTimeout(() => setNotification(false), 2000);
    };

    // Devuelve { categoria: { color: string, productos: [], layoutColor: string } }, omitiendo 'Pistas de improvisación'
    const organizeProductsByCategory = () => {
        const categorias = {};
        products.forEach((item) => {
            const categoria = item.layout?.name || "Otros";
            if (categoria === "Pistas de improvisación") return; // Omitir esa categoría
            // El color de layout puede venir en item.layout.background o item.colors.color1
            const layoutColor = item.layout?.background || item.colors?.color1 || '#111115';
            if (!categorias[categoria]) categorias[categoria] = { color: layoutColor, productos: [] };
            categorias[categoria].productos.push(item);
        });
        return categorias;
    };

    const filteredProducts = () => {
        let filtered = products;

        // Filtrar productos cuya categoría sea 'Pistas de improvisación'
        filtered = filtered.filter(product => (product.layout?.name || "Otros") !== "Pistas de improvisación");

        if (searchTerm) {
            filtered = filtered.filter(product => {
                const mainItem = product.brItems?.[0];
                return (
                    (mainItem?.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (mainItem?.rarity?.displayValue?.toLowerCase().includes(searchTerm.toLowerCase()))
                );
            });
        }

        if (selectedCategory) {
            filtered = filtered.filter(product =>
                (product.layout?.name || "Otros") === selectedCategory
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
                        Codigo <span style={{ color: 'gold', fontWeight: 'bold' }}>TIOFLASH</span> en la tienda de fortnite
                    </div>
                </div>
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
                <div className="text-center mt-4">
                    <h1 className="text-4xl font-bold">Tienda</h1>
                    <p className="text-gray-400 mt-2">{new Date().toLocaleString('es-ES')}</p>
                </div>
                {/* Buscador */}
                <div className="flex justify-center items-center mt-4 mb-2 px-4">
                    <input
                        type="text"
                        value={searchInput}
                        onChange={e => setSearchInput(e.target.value)}
                        placeholder="Buscar skins, lotes, rarezas..."
                        className="w-full max-w-md p-2 rounded-lg border border-gray-700 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                </div>

                {/* Dropdown de categorías */}
                <div className="flex justify-center my-6">
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
                            <div className="flex flex-wrap gap-[20px] justify-center items-start p-5">
                                {filtered.slice(0, 20).map((product, index) => (
                                    <ProductCard
                                        key={product.offerId}
                                        product={product}
                                        onAddToCart={handleAddToCart}
                                        onClick={handleProductClick}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : (
                        Object.entries(categorizedProducts).map(([categoria, { color, productos }]) => {
                            // Filtrar productos por el término de búsqueda
                            const productosFiltrados = searchTerm
                                ? productos.filter(product => {
                                    const mainItem = product.brItems?.[0];
                                    return (
                                        (mainItem?.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                                        (mainItem?.rarity?.displayValue?.toLowerCase().includes(searchTerm.toLowerCase()))
                                    );
                                })
                                : productos;
                            if (productosFiltrados.length === 0) return null;
                            return (
                                <div key={categoria} className="mb-12">
                                    <h2 className="text-2xl font-semibold text-white border-b-2 border-blue-500 pb-2 mb-4">
                                        {categoria}
                                    </h2>
                                    <div className="flex flex-wrap gap-[20px] justify-center items-start p-5">
                                        {productosFiltrados.slice(0, 20).map((product) => (
                                            <ProductCard
                                                key={product.offerId}
                                                product={product}
                                                onAddToCart={handleAddToCart}
                                                onClick={handleProductClick}
                                                fallbackColor={color}
                                            />
                                        ))}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </section>
            </div>
        </>
    );
};

export default Shop2;