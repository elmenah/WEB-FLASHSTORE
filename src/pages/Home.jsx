import React from 'react';
import { Link } from 'react-router-dom';
import '../css/styles.css';

const Home = () => {
  return (
    <>
      {/* PORTADA */}
      <div className="slideshow relative flex items-center justify-center h-screen bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent z-10"></div>
        
        <div className="absolute left-1/2 transform -translate-x-1/2 sm:left-6 sm:transform-none sm:-translate-x-0 top-1/2 -translate-y-1/2 z-20 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 italic">
            Bienvenido a <span className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">Tio Flashstore</span>
          </h1>
          <Link 
            to="/shop"
            className="bg-white text-gray-900 px-4 py-2 rounded-lg text-lg font-semibold shadow-lg hover:bg-gray-100 transition-colors"
          >
            Ver la tienda de hoy
          </Link>
        </div>
        <img src="/Imagenes/1076581.jpg" className="slide w-full h-full object-cover z-0" alt="Hero" />
      </div>

      {/* NUESTROS SERVICIOS */}
      <div className="bg-gray-900 py-16 text-white">
        <div className="flex justify-center w-full">
          <article className="flex items-center gap-10 flex-col xl:flex-row max-w-7xl mx-auto px-6">
            <figure>
              <img 
                loading="lazy" 
                width="412" 
                height="200" 
                src="/Imagenes/Servicios IMG.png"
                className="w-full sm:w-[824px] sm:h-[400px] rounded-lg"
                alt="Servicios"
              />
            </figure>
            <div className="max-xl:w-full text-center xl:text-left">
              <header>
                <p className="text-sm bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-sky-400 to-fuchsia-400 bg-[length:200%_auto] animate-pulse">
                  SKINS
                </p>
                <h2 className="font-medium text-xl mt-2">Compra skins e items más baratos aquí</h2>
              </header>
              <p className="max-w-[400px] mt-2 text-sm text-gray-400 mx-auto">
                ¿<strong>Cansado de que las skins que te gustan desaparezcan de la tienda porque no tienes V-Bucks?</strong> 😩🎮
                ¡No te preocupes más! Con nuestro <strong>sistema exclusivo de envío por regalo</strong>, puedes
                comprar skins de Fortnite al <strong>mejor precio</strong> y recibirlas de manera segura. 🚀✨
                Solo agréganos como amigos, y después de <strong>48 horas</strong>, podrás recibir las skins que
                compres. <strong>¡No dejes pasar las mejores ofertas y consigue tus skins favoritas antes de que
                desaparezcan!</strong> 🔥💎
              </p>
              <footer>
                <div className="mt-4 flex flex-col md:flex-row items-center gap-4">
                  <div className="relative inline-block group w-[80%] md:w-[240px] h-[45px]">
                    <div className="absolute border group-hover:translate-x-1 transition-all border-gray-600 inset-0 bg-transparent transform -translate-x-1 translate-y-1 rounded-md"></div>
                    <Link 
                      className="w-full h-full flex items-center transition-all text-center justify-center relative text-sm bg-indigo-600 text-white hover:bg-indigo-700 rounded-md"
                      to="/shop"
                    >
                      Comprar Skins Ahora
                    </Link>
                  </div>
                </div>
              </footer>
            </div>
          </article>
        </div>
      </div>

      {/* CLUB FORTNITE */}
      <div className="container mx-auto p-4 text-white">
        <h2 className="text-4xl font-bold text-center mb-8 italic">Club Fortnite</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 justify-center place-items-center">
          {[
            { title: "1 Mes Fortnite Crew", desc: "Activalo hoy mismo!", price: "$6.000 CLP" },
            { title: "2 Meses Fortnite Crew", desc: "Obtén 2 Meses del club de fortnite!", price: "$10.000 CLP" },
            { title: "3 Meses Fortnite Crew", desc: "Obtén 3 Meses del club de fortnite!", price: "$15.000 CLP" },
            { title: "6 Meses Fortnite Crew", desc: "Obtén 6 Meses del club de fortnite!", price: "$26.000 CLP" }
          ].map((item, index) => (
            <div key={index} className="bg-gray-800 w-[160px] sm:w-[190px] md:w-[190px] rounded-lg overflow-hidden shadow-lg flex flex-col justify-between mx-auto">
              <img 
                alt={item.title} 
                loading="lazy" 
                width="160" 
                height="240" 
                className="object-cover object-bottom w-full" 
                src="/Imagenes/fn crew/fnmarzo.png"
              />
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm sm:text-lg font-semibold mb-2 truncate">{item.title}</h3>
                  <p className="text-gray-400 text-xs sm:text-sm truncate">{item.desc}</p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <p className="text-gray-100 text-xs sm:text-sm font-semibold">{item.price}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 hover:bg-gray-900 p-2 hover:cursor-pointer rounded-full transition-all">
                      <i className="fas fa-shopping-cart w-4 h-4 text-gray-400"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* COMO FUNCIONA */}
      <div className="flex flex-col lg:flex-row items-center justify-center bg-gray-900 py-16 text-white space-y-8 lg:space-y-0 lg:space-x-10">
        <img 
          src="/Imagenes/goku_ultra_instinto_2_0__fortnite__by_urielreyes05_dgo3i6b-414w-2x.png" 
          alt="Character"
          className="w-64 h-auto rounded-lg"
        />
        <div className="text-center lg:text-left">
          <h2 className="text-3xl font-bold mb-2">¿Cómo Funciona?</h2>
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-4 lg:space-y-0 lg:space-x-4">
              <div className="w-10 h-10 flex items-center justify-center bg-gray-700 text-lg font-bold rounded-md">1</div>
              <div>
                <h3 className="text-lg font-bold">PASO 1</h3>
                <p className="text-gray-400">
                  Asegúrate de haber agregado nuestras cuentas 48 hrs antes de realizar una compra.
                  <br />Usuario: Reydelosvbucks
                </p>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-4 lg:space-y-0 lg:space-x-4">
              <div className="w-10 h-10 flex items-center justify-center bg-gray-700 text-lg font-bold rounded-md">2</div>
              <div>
                <h3 className="text-lg font-bold">PASO 2</h3>
                <p className="text-gray-400">
                  Elige la skin que quieras de la rotación diaria de la tienda.
                  <br />Agrega al carrito y termina el proceso de compra
                </p>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-4 lg:space-y-0 lg:space-x-4">
              <div className="w-10 h-10 flex items-center justify-center bg-gray-700 text-lg font-bold rounded-md">3</div>
              <div>
                <h3 className="text-lg font-bold">PASO 3</h3>
                <p className="text-gray-400">
                  Recibe las skins y/o lotes que hayas elegido directamente en tu cuenta enviadas por nuestro equipo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="flex justify-center bg-gray-900 p-12 text-white">
        <div className="space-y-4 w-full max-w-4xl">
          {[
            {
              icon: "💲",
              title: "¿Por qué es tan barato?",
              content: "Al aprovechar los precios regionales favorables, podemos comprar productos de Epic Games a un mejor precio a través de tiendas en otros países. Siempre pagamos el precio completo que Epic Games establece en ese país, incluidos los impuestos. No utilizamos ningún tipo de exploits ni métodos fraudulentos."
            },
            {
              icon: "✅",
              title: "¿Esto es seguro?",
              content: "Llevamos años en la venta de servicios digitales, tenemos cientos de clientes en nuestro instagram @tioflashstore, sin riesgos para tu cuenta, todo el proceso se hace respetando las reglas de Epic Games, así que no hay peligro de baneos ni sanciones."
            },
            {
              icon: "💳",
              title: "¿Cuáles son los métodos de pago?",
              content: "Ofrecemos métodos de pagos locales para Chile y aceptamos también pagos con criptomonedas como USDT."
            }
          ].map((faq, index) => (
            <div key={index} className="bg-gray-800 p-6 rounded-lg flex items-start space-x-4 shadow-md">
              <div className="text-2xl">{faq.icon}</div>
              <div>
                <h3 className="text-lg font-bold">{faq.title}</h3>
                <p className="text-gray-400 text-sm">{faq.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;