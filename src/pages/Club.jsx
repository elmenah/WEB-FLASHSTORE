import React from 'react';

const Club = () => {
  return (
    <div className="pt-14">
      {/* HERO */}
      <section
        className="relative pt-20 pb-16 px-6 text-left h-screen bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: "url('https://cdn2.unrealengine.com/fneco-36-30-august-crew-web-header-1920x1080-1920x1080-f0d7a9c877f0.jpg?resize=1&w=1920')"
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-70"></div>

        <div className="relative max-w-6xl mx-auto z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            CLUB <span className="text-yellow-400">DE FORTNITE</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-6">
            Sé parte del club. <br /> Por solo <span className="font-bold text-green-400">$6.000 CLP</span> al mes,
            obtén acceso a todos los pases del juego, objetos exclusivos y 1.000 monedas V cada mes.
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            <span className="px-4 py-2 bg-gray-800 bg-opacity-70 rounded-full text-sm">🌟 A tu cuenta Personal</span>
            <span className="px-4 py-2 bg-gray-800 bg-opacity-70 rounded-full text-sm">💰 Renovable</span>
          </div>

          <div className="flex justify-center pt-20">
            <button className="px-4 py-2 bg-blue-900 rounded-full text-sm hover:bg-blue-800 transition-colors">
              Comprar Ahora
            </button>
          </div>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Beneficios Incluidos</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { img: "/Imagenes/clubagosto.jpg", title: "Paquete de Club", desc: "Contenido exclusivo mensual" },
            { img: "/Imagenes/pasebatalla.jpg", title: "Pase de Batalla", desc: "Acceso completo incluido" },
            { img: "/Imagenes/paseog.jpg", title: "Pase de Orígenes", desc: "Experiencias únicas" },
            { img: "/Imagenes/paselego.jpg", title: "Pase de LEGO", desc: "Construcción creativa" },
            { img: "/Imagenes/pasemusical.jpg", title: "Pase Musical", desc: "Ritmos y melodías" },
            { img: "/Imagenes/vbucks.jpg", title: "1000 Pavos", desc: "Cada mes automáticamente" }
          ].map((benefit, index) => (
            <div key={index} className="rounded-xl overflow-hidden relative">
              <img src={benefit.img} alt={benefit.title} className="w-full h-40 object-cover" />
              <div className="relative bottom-0 p-3 text-white">
                <h3 className="font-semibold">{benefit.title}</h3>
                <p className="text-sm text-gray-300">{benefit.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Club;