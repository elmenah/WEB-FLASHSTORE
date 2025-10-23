import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Particles } from "@/components/magicui/particles";
import { AnimatedBeam } from "@/components/ui/animated-beam"
import { AnimatedBeamDemo } from "@/components/AnimatedBeamDemo"
const Home = () => {
  const { addToCart } = useCart();
  const [notification, setNotification] = useState(false);
  
  // Testimonios
  const testimonios = [
    { nombre: "@juanito", texto: "¡Me llegó todo súper rápido! 10/10" },
    { nombre: "@vale.gamer", texto: "Excelente atención y precios, recomendado." },
    { nombre: "@matifn", texto: "Ya he comprado varias veces y siempre cumplen." },
    { nombre: "@sofiaplayz", texto: "El mejor lugar para comprar skins sin riesgo." },
  ];
  // Referencia y función para el slider de destacados
  const sliderRef = useRef(null);
  const scrollSlider = (dir) => {
    if (!sliderRef.current) return;
    sliderRef.current.scrollBy({ left: dir * 350, behavior: 'smooth' });
  };
  // Auto-slide destacados
  useEffect(() => {
    const interval = setInterval(() => {
      if (sliderRef.current) {
        const slider = sliderRef.current;
        const maxScroll = slider.scrollWidth - slider.clientWidth;
        // Si está cerca del final, vuelve al inicio
        if (slider.scrollLeft + 400 >= maxScroll) {
          slider.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          slider.scrollBy({ left: 350, behavior: 'smooth' });
        }
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  // Productos que se van hoy de la tienda
  const [productosPesadillas, setProductosPesadillas] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://fortnite-api.com/v2/shop?language=es");
        if (!response.ok) throw new Error("Error al obtener los datos de la API");
        const data = await response.json();
        
        // ✅ NUEVA LÓGICA: Buscar TODOS los productos de Fortnite Pesadillas
        let productosPesadillas = (data?.data?.entries || [])
          .filter(entry => {
            // Verificar si tiene contenido válido
            const tieneContenido = (entry.bundle?.image && entry.bundle?.name) || 
                                  (entry.brItems?.[0]?.images?.icon && entry.brItems?.[0]?.name);
            
            if (!tieneContenido) return false;
            
            // ✅ Función para buscar "Fortnite Pesadillas" en CUALQUIER parte del objeto
            const buscarEnTexto = (texto) => {
              if (!texto) return false;
              const textoLower = texto.toLowerCase();
              return textoLower.includes('fortnite pesadillas') ||
                     textoLower.includes('pesadillas') ||
                     textoLower.includes('fortnitemares') ||
                     textoLower.includes('nightmare');
            };
            
            // Buscar en TODOS los campos posibles
            const esPesadillas = 
              // Section
              buscarEnTexto(entry.section?.name) ||
              buscarEnTexto(entry.section?.id) ||
              
              // Layout
              buscarEnTexto(entry.layout?.name) ||
              buscarEnTexto(entry.layout?.id) ||
              
              // DisplayAssetPath
              buscarEnTexto(entry.displayAssetPath?.name) ||
              buscarEnTexto(entry.displayAssetPath?.id) ||
              
              // Categories (si es array)
              (entry.categories && entry.categories.some(cat => buscarEnTexto(cat))) ||
              
              // Tags (si es array)
              (entry.tags && entry.tags.some(tag => buscarEnTexto(tag))) ||
              
              // ✅ NOMBRES ESPECÍFICOS que veo en las imágenes:
              entry.bundle?.name?.toLowerCase().includes("ravemello") ||
              entry.bundle?.name?.toLowerCase().includes("captor") ||
              entry.bundle?.name?.toLowerCase().includes("malhechor") ||
              entry.bundle?.name?.toLowerCase().includes("ghost face") ||
              entry.bundle?.name?.toLowerCase().includes("guiff") ||
              entry.bundle?.name?.toLowerCase().includes("jason") ||
              entry.bundle?.name?.toLowerCase().includes("fiesta espectral") ||
              entry.bundle?.name?.toLowerCase().includes("calabaza") ||
              entry.bundle?.name?.toLowerCase().includes("alas rojas") ||
              entry.bundle?.name?.toLowerCase().includes("maniocillas") ||
              entry.bundle?.name?.toLowerCase().includes("limpiaparabrisas") ||
              entry.bundle?.name?.toLowerCase().includes("garra de lucian") ||
              entry.bundle?.name?.toLowerCase().includes("crea classic") ||
              entry.bundle?.name?.toLowerCase().includes("roma mortal") ||
              
              // También buscar en brItems
              entry.brItems?.[0]?.name?.toLowerCase().includes("ravemello") ||
              entry.brItems?.[0]?.name?.toLowerCase().includes("captor") ||
              entry.brItems?.[0]?.name?.toLowerCase().includes("malhechor") ||
              entry.brItems?.[0]?.name?.toLowerCase().includes("ghost face") ||
              entry.brItems?.[0]?.name?.toLowerCase().includes("guiff") ||
              entry.brItems?.[0]?.name?.toLowerCase().includes("jason") ||
              entry.brItems?.[0]?.name?.toLowerCase().includes("fiesta espectral") ||
              entry.brItems?.[0]?.name?.toLowerCase().includes("calabaza") ||
              entry.brItems?.[0]?.name?.toLowerCase().includes("alas rojas") ||
              entry.brItems?.[0]?.name?.toLowerCase().includes("maniocillas") ||
              entry.brItems?.[0]?.name?.toLowerCase().includes("limpiaparabrisas") ||
              entry.brItems?.[0]?.name?.toLowerCase().includes("garra de lucian") ||
              entry.brItems?.[0]?.name?.toLowerCase().includes("crea classic") ||
              entry.brItems?.[0]?.name?.toLowerCase().includes("roma mortal");
            
            return esPesadillas;
          })
          .slice(0, 20) // ✅ Aumentar a 20 productos máximo
          .map(entry => {
            if (entry.bundle?.name) {
              return {
                id: entry.offerId,
                nombre: entry.bundle.name,
                precio: Math.round(entry.finalPrice * 4.4),
                imagen: entry.bundle.image,
                desc: entry.bundle.info || 'Lote especial de Fortnite Pesadillas',
                categoria: 'Fortnite Pesadillas',
              };
            } else {
              return {
                id: entry.offerId,
                nombre: entry.brItems[0].name,
                precio: Math.round(entry.finalPrice * 4.4),
                imagen: entry.brItems[0].images.icon || entry.brItems[0].images.featured,
                desc: entry.brItems[0].description || 'Skin especial de Fortnite Pesadillas',
                categoria: 'Fortnite Pesadillas',
              };
            }
          });

        // ✅ Log mejorado para debug
        console.log('Productos de Pesadillas encontrados:', productosPesadillas);
        console.log('Total de entries en la API:', data?.data?.entries?.length);
        
        // ✅ Log para ver TODAS las sections y layouts disponibles
        const sections = [...new Set(data?.data?.entries?.map(e => e.section?.name).filter(Boolean))];
        const layouts = [...new Set(data?.data?.entries?.map(e => e.layout?.name).filter(Boolean))];
        console.log('Sections disponibles:', sections);
        console.log('Layouts disponibles:', layouts);
        
        // ✅ Log específico para productos que contienen palabras clave
        const productosConPalabras = data?.data?.entries?.filter(e => {
          const nombreBundle = e.bundle?.name?.toLowerCase() || '';
          const nombreItem = e.brItems?.[0]?.name?.toLowerCase() || '';
          return nombreBundle.includes('ravemello') || nombreBundle.includes('captor') || 
                 nombreBundle.includes('malhechor') || nombreBundle.includes('ghost') ||
                 nombreItem.includes('ravemello') || nombreItem.includes('captor') || 
                 nombreItem.includes('malhechor') || nombreItem.includes('ghost');
        });
        console.log('Productos con palabras clave específicas:', productosConPalabras);
        
        setProductosPesadillas(productosPesadillas);
        
      } catch (e) {
        console.error('Error fetching products:', e);
        setProductosPesadillas([]);
      }
    };
    fetchProducts();
  }, []);

  // Beneficios rápidos
  const beneficios = [
    { icon: "💸", text: "Precios bajos garantizados" },
    { icon: "⚡", text: "Entrega rápida" },
    { icon: "🔒", text: "Compra 100% segura" },
    { icon: "📱", text: "Soporte personalizado" },
    { icon: "⭐", text: "Clientes felices" },
  ];



  const handleAddToCart = (item) => {
    // Soporta tanto productos destacados de la API como clubItems
    const cartItem = {
      nombre: item.nombre || item.title || 'Producto',
      precio: item.precio || item.price || 0,
      imagen: item.imagen || item.image || '',
      descripcion: item.desc || '',
    };
    addToCart(cartItem);
    showNotification();
  };

  const showNotification = () => {
    setNotification(true);
    setTimeout(() => setNotification(false), 2000); // Oculta la notificación después de 2 segundos
  };

  return (
    <>
      {/* Notificación */}
      <div
        className={`fixed top-20 right-5 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg transition-opacity duration-500 z-50 ${
          notification ? 'opacity-100' : 'opacity-0 hidden'
        }`}
      >
        Producto agregado al carrito
      </div>

      {/* HERO llamativo */}

      <div className="relative flex items-center justify-center h-[70vh] sm:h-screen bg-gray-900 text-white overflow-hidden animate-fade-in">
        <Particles 
          className="absolute inset-0 z-10 pointer-events-none" 
          quantity={250} 
          staticity={10} 
          ease={50} 
          size={1.5} 
          color="#ffffff" 
        />
        <img src="/Imagenes/HalloweenPortada.png" className="w-full h-full object-cover z-0" alt="Hero" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent z-10"></div>
  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20 w-11/12 sm:w-auto pl-4 sm:pl-10 pr-4 text-left animate-fade-in">
          <h1 className="text-2xl xs:text-3xl md:text-5xl font-bold mb-3 sm:mb-4 italic drop-shadow-xl leading-tight">
            Bienvenido a <span className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">Tio Flashstore</span>
          </h1>
          <p className="text-base xs:text-lg md:text-2xl mb-4 sm:mb-6 text-white/80 font-semibold">Tu tienda confiable de skins, lotes y pases de Fortnite</p>
          <Link 
            to="/shop"
            className="bg-white text-gray-900 px-4 py-2 sm:px-6 sm:py-3 rounded-lg text-base sm:text-lg font-semibold shadow-lg hover:bg-gray-100 transition-colors animate-bounce"
          >
            Ver la tienda de hoy
          </Link>
        </div>
      </div>

      {/* Beneficios rápidos */}
      <section className="py-6 sm:py-10 bg-gray-900">
        <div className="max-w-8xl mx-auto flex flex-wrap justify-center gap-4 sm:gap-6 px-2">
          {beneficios.map((b, i) => (
            <div key={i} className="flex flex-col items-center rounded-xl px-4 py-3 sm:px-6 sm:py-4 animate-fade-in min-w-[120px]">
              <span className="text-2xl sm:text-3xl mb-1 sm:mb-2">{b.icon}</span>
              <span className="text-white font-semibold text-xs sm:text-base text-center">{b.text}</span>
            </div>
          ))}
        </div>
        
      </section>
      
  {/* FORTNITE PESADILLAS - Slider */}
  <section className="py-8 sm:py-12 bg-gray-900">
  <div className="text-center mb-5 sm:mb-8">
    <h2 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg mb-2">
      🎃 Fortnite Pesadillas
    </h2>
    <p className="text-lg text-orange-400 font-semibold">
      Skins y lotes especiales de terror
    </p>
  </div>
  
  {productosPesadillas.length > 0 ? (
    <div className="relative max-w-full sm:max-w-7xl mx-auto">
      <button onClick={() => scrollSlider(-1)} className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/70 text-white rounded-full p-2 shadow-lg">
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>
      
      <div ref={sliderRef} className="flex gap-4 sm:gap-8 overflow-x-auto no-scrollbar scroll-smooth px-2 sm:px-10 py-2">
        {productosPesadillas.map((item) => (
          <div key={item.id} className="min-w-[50vw] max-w-[50vw] sm:min-w-[270px] sm:max-w-[270px] bg-gray-800/90 rounded-2xl shadow-xl p-3 sm:p-4 flex flex-col items-center hover:scale-105 transition-transform cursor-pointer animate-fade-in relative">
            
          
            
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-xl mb-2 sm:mb-3 shadow-lg flex items-center justify-center bg-gradient-to-br from-[#ff6b35] to-[#8b0000] overflow-hidden">
              <img src={item.imagen} alt={item.nombre} className="object-contain max-h-28 max-w-28 sm:max-h-36 sm:max-w-36" />
            </div>
            
            <h3 className="font-bold text-base sm:text-lg text-white mb-1 text-center">{item.nombre}</h3>
            
            <div className="text-center mb-2">
              <span className="text-orange-400 font-bold text-lg sm:text-xl">${item.precio.toLocaleString('es-CL')}</span>
              <p className="text-gray-400 text-xs mt-1">{item.desc}</p>
            </div>
            
            <button 
              onClick={() => handleAddToCart(item)} 
              className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-semibold shadow-md transition-all text-sm sm:text-base border border-orange-400"
            >
              👻 ¡Comprar Ahora!
            </button>
          </div>
        ))}
      </div>
      
      <button onClick={() => scrollSlider(1)} className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/70 text-white rounded-full p-2 shadow-lg">
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M9 6l6 6-6 6"/>
        </svg>
      </button>
    </div>
  ) : (
    <div className="text-center py-12">
      <div className="bg-gray-800/50 rounded-lg p-8 max-w-md mx-auto">
        <span className="text-4xl mb-4 block">🎃</span>
        <h3 className="text-xl font-bold text-white mb-2">¡Pronto habrá pesadillas!</h3>
        <p className="text-gray-400">
          No hay productos de Fortnite Pesadillas disponibles en este momento.
        </p>
        <Link 
          to="/shop" 
          className="inline-block mt-4 bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-full font-semibold transition-colors"
        >
          Ver tienda completa
        </Link>
      </div>
    </div>
  )}
</section>



      {/* Testimonios */}
      {/* 
      <section className="py-12 bg-gradient-to-br from-[#2b6fa1] to-[#47fdfe]">
        <h2 className="text-3xl font-bold text-center mb-8 text-white drop-shadow-lg">Lo que opinan nuestros clientes</h2>
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-8">
          {testimonios.map((t, i) => (
            <div key={i} className="bg-white/90 rounded-xl shadow-lg p-6 min-w-[220px] max-w-[260px] animate-fade-in">
              <p className="text-gray-700 italic mb-2">"{t.texto}"</p>
              <span className="text-indigo-700 font-bold">{t.nombre}</span>
            </div>
          ))}
        </div>
      </section>
      */}
      
      
      
      {/* Animaciones CSS */}
      <style>{`
        .animate-fade-in {
          animation: fadeIn 1.2s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: none; }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>

      {/* ¿CÓMO FUNCIONA? */}
      <div className="container mx-auto p-4 text-white">
        <h2 className="text-4xl font-bold text-center mb-8 italic">¿Cómo Funciona?</h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          {/* Imagen */}
          <div className="w-full md:w-1/3 flex justify-center">
            <img 
              src="/Imagenes/goku_ultra_instinto_2_0__fortnite__by_urielreyes05_dgo3i6b-414w-2x.png" 
              alt="Goku explicando cómo funciona" 
              className="w-64 h-auto object-contain"
            />
          </div>

          {/* Pasos */}
          <div className="w-full md:w-2/3 space-y-6">
            <div className="flex items-start gap-4">
              
              <div>
                <h3 className="text-xl font-semibold">PASO 1</h3>
                <p className="text-gray-400">
                  Asegúrate de haber agregado nuestras cuentas 48 hrs antes de realizar una compra. <br />
                  Usuario: <span className="font-bold text-white">Reydelosvbucks</span>
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              
              <div>
                <h3 className="text-xl font-semibold">PASO 2</h3>
                <p className="text-gray-400">
                  Elige la skin que quieras de la rotación diaria de la tienda. <br />
                  Agrega al carrito y termina el proceso de compra.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              
              <div>
                <h3 className="text-xl font-semibold">PASO 3</h3>
                <p className="text-gray-400">
                  Recibe las skins y/o lotes que hayas elegido directamente en tu cuenta enviadas por nuestro equipo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
        {/* MÉTODOS DE PAGO */}
        <section className="py-12 bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-2 text-white">PAGOS SEGUROS PROCESADOS POR</h2>
            
            
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-80 hover:opacity-100 transition-opacity">
              {/* MercadoPago */}
              <div className="bg-white rounded-lg p-4 shadow-lg hover:scale-105 transition-transform">
                <img 
                  src="/Imagenes/Mercado_Pago.svg.png" 
                  alt="MercadoPago" 
                  className="h-10 w-auto object-contain"
                />
              </div>
              
              {/* Visa */}
              <div className="bg-white rounded-lg p-4 shadow-lg hover:scale-105 transition-transform">
                <img 
                  src="/Imagenes/Visa_Logo.png" 
                  alt="Visa" 
                  className="h-10 w-auto object-contain"
                />
              </div>
              
              {/* Mastercard */}
              <div className="bg-white rounded-lg p-4 shadow-lg hover:scale-105 transition-transform">
                <img 
                  src="/Imagenes/MasterCard_early_1990s_logo.png" 
                  alt="Mastercard" 
                  className="h-10 w-auto object-contain"
                />
              </div>
              
              {/* Webpay */}
              
              <div className="bg-white rounded-lg p-4 shadow-lg hover:scale-105 transition-transform">
                <img 
                  src="/Imagenes/logo-web-pay-plus.png" 
                  alt="Transferecia bancaria" 
                  className="h-10 w-auto object-contain"
                />
              </div>
            </div>
            
            {/* Mensaje de seguridad */}
            <div className="text-center mt-8">
              <div className="inline-flex items-center gap-2 bg-green-600/20 text-green-400 px-4 py-2 rounded-full">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                </svg>
                <span className="font-semibold">Transacciones 100% seguras y cifradas</span>
              </div>
            </div>
          </div>
        </section>


      {/* FAQ */}
      <div className="container mx-auto p-4 text-white">
        <h2 className="text-4xl font-bold text-center mb-8 italic">Preguntas Frecuentes</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold">¿Cómo recibo los productos que compro?</h3>
            <p className="text-gray-400">
              Los productos adquiridos serán entregados directamente en tu cuenta de Fortnite mediante el nombre de usuario que proporciones al momento de la compra.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">¿Cuánto tiempo tarda la entrega?</h3>
            <p className="text-gray-400">
              La entrega se realiza en un plazo máximo de 24 horas después de confirmar tu compra. En la mayoría de los casos, la entrega es inmediata.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">¿Por qué es tan barato?</h3>
            <p className="text-gray-400">
              Al aprovechar los precios regionales favorables, podemos comprar productos de Epic Games a un mejor precio a través de tiendas en otros países. Siempre pagamos el precio completo que Epic Games establece en ese país, incluidos los impuestos. No utilizamos ningún tipo de exploits ni métodos fraudulentos.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">¿Esto es seguro?</h3>
            <p className="text-gray-400">
              Llevamos años en la venta de servicios digitales, tenemos cientos de clientes en nuestro Instagram @tioflashstore, sin riesgos para tu cuenta. Todo el proceso se hace respetando las reglas de Epic Games, así que no hay peligro de baneos ni sanciones.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">¿Cuáles son los métodos de pago?</h3>
            <p className="text-gray-400">
              Ofrecemos métodos de pagos locales para Chile y aceptamos también pagos con criptomonedas como USDT.
            </p>
          </div>
        </div>
      </div>

      
      

      
      
      

     
    </>
  );
};

export default Home;