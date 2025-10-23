import React, { useEffect, useRef, useState } from "react";
import { fetchFortniteShop, filterFortnitemares } from "../api/fortnite";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const FortnitePesadillas = () => {
  const [productos, setProductos] = useState([]);
  const sliderRef = useRef(null);
  const { addToCart } = useCart();
  const [isPaused, setIsPaused] = useState(false);

  // ✅ Cargar productos
  useEffect(() => {
    const load = async () => {
      try {
        const entries = await fetchFortniteShop();
        setProductos(filterFortnitemares(entries).slice(0, 20));
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  // ✅ Función de desplazamiento
  const scroll = (dir) =>
    sliderRef.current?.scrollBy({ left: dir * 350, behavior: "smooth" });

  // ✅ Autoslide cada 2 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused && sliderRef.current) {
        const slider = sliderRef.current;
        const maxScroll = slider.scrollWidth - slider.clientWidth;
        if (slider.scrollLeft + 400 >= maxScroll) {
          slider.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          slider.scrollBy({ left: 350, behavior: "smooth" });
        }
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [isPaused]);

  if (productos.length === 0)
    return (
      <section className="py-12 bg-gray-900 text-center text-white">
        <h2 className="text-3xl font-bold mb-2">🎃 Fortnite Pesadillas</h2>
        <p className="text-orange-400">¡Pronto habrá pesadillas!</p>
        <Link
          to="/shop"
          className="mt-4 inline-block bg-orange-600 px-6 py-2 rounded-full font-semibold hover:bg-orange-700"
        >
          Ver tienda completa
        </Link>
      </section>
    );

  return (
    <section className="py-12 bg-gradient-to-b  to-black relative overflow-hidden">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white">🎃 Fortnite Pesadillas</h2>
        <p className="text-orange-400 font-semibold">
          Lotes y skins de terror en oferta
        </p>
      </div>

      <div
        className="relative max-w-7xl mx-auto"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Botón Izquierda */}
        <button
          onClick={() => scroll(-1)}
          className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 text-white rounded-full p-2"
        >
          ◀
        </button>

        {/* Slider */}
        <div
          ref={sliderRef}
          className="flex gap-6 overflow-x-auto no-scrollbar px-8 snap-x scroll-smooth"
        >
          {productos.map((p) => (
            <div
              key={p.id}
              className="min-w-[250px] bg-gray-800/90 rounded-2xl p-4 flex flex-col items-center hover:scale-105 transition-transform snap-center shadow-xl cursor-pointer"
            >
              <div className="relative w-40 h-40 rounded-xl overflow-hidden mb-3 bg-gradient-to-br from-orange-600 to-red-700 flex items-center justify-center">
                <img
                  src={p.imagen}
                  alt={p.nombre}
                  className="object-contain max-h-36 max-w-36 transition-transform duration-300 hover:scale-110"
                />
              </div>
              <h3 className="text-white font-semibold text-center">
                {p.nombre}
              </h3>
              <span className="text-orange-400 font-bold text-lg mt-1">
                ${p.precio.toLocaleString("es-CL")}
              </span>
              <button
                onClick={() => addToCart(p)}
                className="mt-3 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-full font-semibold transition-colors"
              >
                👻 Comprar
              </button>
            </div>
          ))}
        </div>

        {/* Botón Derecha */}
        <button
          onClick={() => scroll(1)}
          className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 text-white rounded-full p-2"
        >
          ▶
        </button>
      </div>
    </section>
  );
};

export default FortnitePesadillas;
