import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const Testimonios = () => {
  // 🔸 Aquí colocas las imágenes recortadas desde tus publicaciones de Instagram
  const imagenes = [
    "/imagenes/testimonios/1.png",
    "/imagenes/testimonios/2.png",
    "/imagenes/testimonios/3.png",
    "/imagenes/testimonios/4.png",
    "/imagenes/testimonios/5.png",
    "/imagenes/testimonios/6.png",
    "/imagenes/testimonios/7.png",
    "/imagenes/testimonios/8.png",
  ];

  const sliderRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  // 🔁 Movimiento automático
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused && sliderRef.current) {
        const slider = sliderRef.current;
        const maxScroll = slider.scrollWidth - slider.clientWidth;
        if (slider.scrollLeft + 350 >= maxScroll) {
          slider.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          slider.scrollBy({ left: 350, behavior: "smooth" });
        }
      }
    }, 2500);
    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <section className="bg-[#0b1120] py-16 text-white relative overflow-hidden">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold mb-2">
          Lo que dicen nuestros clientes 💬
        </h2>
        <p className="text-gray-400">
          Testimonios reales de nuestra comunidad de gamers satisfechos
        </p>
      </div>

      {/* Slider de imágenes */}
      <div
        ref={sliderRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="flex gap-6 overflow-x-auto px-8 no-scrollbar scroll-smooth"
      >
        {imagenes.map((src, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            viewport={{ once: true }}
            className="min-w-[300px] rounded-2xl overflow-hidden bg-gray-800/60 shadow-xl hover:scale-105 transition-transform snap-center"
          >
            <img
              src={src}
              alt={`Testimonio ${i + 1}`}
              className="w-full h-full object-cover"
            />
          </motion.div>
        ))}
      </div>

      {/* CTA final */}
      <div className="text-center mt-14">
        <h3 className="text-xl font-semibold mb-4">
          ¿Listo para unirte a nuestra comunidad?
        </h3>
        <a
          href="/shop"
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-full font-semibold transition-colors"
        >
          Ir a la tienda 🔥
        </a>
      </div>
    </section>
  );
};

export default Testimonios;
