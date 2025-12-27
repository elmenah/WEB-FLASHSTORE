import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import '../css/Shop.css';
import useScrollToTop from '../hooks/useScrollToTop';
import { VBUCK_TO_CLP_RATE } from '../config/prices';

const Shop2 = () => {
    useScrollToTop();
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
            precio: product.finalPrice * VBUCK_TO_CLP_RATE,
            imagen,
        };
        addToCart(cartProduct);
        showNotification();
    };

    const slugify = (text) =>
        text
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");

    const handleProductClick = (product) => {
        const isBundle = product.bundle?.name;

        // 🎨 OBTENER COLORES DINÁMICOS IGUAL QUE EN PRODUCTCARD
        let color1 = "#475569";
        let color2 = "#334155"; 
        let color3 = "#1e293b";

        if (product.colors) {
            let colorArray = [];
            
            if (typeof product.colors === 'object' && !Array.isArray(product.colors) && product.colors !== null) {
                colorArray = Object.values(product.colors);
            } else if (Array.isArray(product.colors)) {
                colorArray = product.colors;
            }

            if (colorArray.length > 0) {
                color1 = colorArray[0] ? `#${colorArray[0].slice(0, 6)}` : color1;
                color2 = colorArray[1] ? `#${colorArray[1].slice(0, 6)}` : color1;
                color3 = colorArray[2] ? `#${colorArray[2].slice(0, 6)}` : color2;
            }
        }

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
                color1,
                color2,
                color3,
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
                color1,
                color2,
                color3,
            };

        const slug = slugify(productData.nombre);

        navigate(`/product/${slug}`, {
            state: { product: productData }
        });
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
        if (categoria === "Pistas de improvisación") return;
        const layoutColor = item.layout?.background || item.colors?.color1 || '#111115';
        if (!categorias[categoria]) {
            categorias[categoria] = { color: layoutColor, productos: [] };
        }
        categorias[categoria].productos.push(item);
    });

    // ✅ Ordenar: lotes primero, luego el resto (PARA TODAS LAS PANTALLAS)
    Object.keys(categorias).forEach((cat) => {
        categorias[cat].productos.sort((a, b) => {
            const aEsLote = a.bundle?.name || 
                           (a.layout?.name?.toLowerCase().includes("lote")) ||
                           (a.brItems?.[0]?.name?.toLowerCase().includes("lote"));
            
            const bEsLote = b.bundle?.name || 
                           (b.layout?.name?.toLowerCase().includes("lote")) ||
                           (b.brItems?.[0]?.name?.toLowerCase().includes("lote"));
            
            // Si A es lote y B no, A va primero (-1)
            if (aEsLote && !bEsLote) return -1;
            // Si B es lote y A no, B va primero (1)
            if (!aEsLote && bEsLote) return 1;
            // Si ambos son lotes o ambos no son lotes, mantener orden original
            return 0;
        });
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

                <div className="text-center mt-6 mb-4">
                    <div className="inline-flex items-center gap-6 bg-gray-800/50 rounded-lg px-6 py-3 border border-gray-700">
                        {/* Epic Games Precio */}
                        <div className="text-center">
                            <p className="text-xs text-gray-400 mb-1">Epic Games:</p>
                            <p className="text-red-400 font-bold text-lg">$6.7 CLP/V-Buck</p>
                        </div>
                        
                        {/* VS */}
                        <div className="text-2xl text-gray-500 font-bold">VS</div>
                        
                        {/* Nuestros Precios */}
                        <div className="text-center">
                            <p className="text-xs text-gray-400 mb-1">Nosotros:</p>
                            <p className="text-green-400 font-bold text-lg">${VBUCK_TO_CLP_RATE} CLP/V-Buck</p>
                        </div>
                        
                        
                    </div>
                    
                    
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

                {/* Dropdown mejorado */}
                <div className="flex justify-center my-6">
                    <div className="relative w-full max-w-md">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full p-3 pr-10 rounded-lg bg-gray-800/50 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                        >
                            <option value="">🌟 Todas las categorías</option>
                            {Object.entries(categorizedProducts).map(([categoria, {productos}]) => (
                                <option key={categoria} value={categoria}>
                                    {categoria} ({productos.length})
                                </option>
                            ))}
                        </select>
                        <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                        </svg>
                    </div>
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
                                    const bundleName = product.bundle?.name || '';
                                    return (
                                        (mainItem?.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                                        (mainItem?.rarity?.displayValue?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                                        (bundleName.toLowerCase().includes(searchTerm.toLowerCase()))
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