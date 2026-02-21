import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Clock, CheckCircle, HelpCircle, XCircle, CreditCard, Shield, ShoppingCart } from 'lucide-react';

const MetodosPago = () => {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const initialTab = tabParam === 'mercadopago' ? 'mercadopago' : tabParam === 'paypal' ? 'paypal' : 'cripto';
  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Botón volver */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors mb-8"
        >
          <ArrowLeft size={18} />
          Volver al inicio
        </Link>

        {/* Título principal */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Métodos de Pago
          </h1>
          <p className="text-gray-400 text-lg">Tío Flash Store</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="bg-gray-800/80 rounded-2xl p-1.5 flex gap-2">
            <button
              onClick={() => setActiveTab('cripto')}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all duration-200 text-sm md:text-base ${
                activeTab === 'cripto'
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              🪙 Criptomonedas (USDT)
            </button>
            <button
              onClick={() => setActiveTab('mercadopago')}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all duration-200 text-sm md:text-base ${
                activeTab === 'mercadopago'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              💳 Mercado Pago
            </button>
            <button
              onClick={() => setActiveTab('paypal')}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all duration-200 text-sm md:text-base ${
                activeTab === 'paypal'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              🅿️ PayPal
            </button>
          </div>
        </div>

        {/* ==================== TAB CRIPTO ==================== */}
        {activeTab === 'cripto' && (
          <div className="space-y-8">

            {/* Paso 1 */}
            <section className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 md:p-8 hover:border-blue-500/30 transition-colors">
              <div className="flex items-center gap-3 mb-5">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-lg">1</span>
                <h2 className="text-xl md:text-2xl font-semibold text-white">Comprar USDT en Binance</h2>
              </div>
              <ol className="space-y-3 text-gray-300 ml-4">
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold mt-0.5">•</span>
                  <span>Entra a tu cuenta de <strong className="text-white">Binance</strong>.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold mt-0.5">•</span>
                  <span>Ve a <strong className="text-white">Trade → P2P → Comprar → USDT</strong>.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold mt-0.5">•</span>
                  <span>Elige un vendedor con buena reputación.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold mt-0.5">•</span>
                  <span>Realiza el pago con el método que prefieras (transferencia, Mercado Pago, etc.).</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold mt-0.5">•</span>
                  <span>Marca como <strong className="text-green-400">Pagado</strong> y recibirás los USDT en tu wallet.</span>
                </li>
              </ol>
            </section>

            {/* Paso 2 */}
            <section className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 md:p-8 hover:border-blue-500/30 transition-colors">
              <div className="flex items-center gap-3 mb-5">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-lg">2</span>
                <h2 className="text-xl md:text-2xl font-semibold text-white">Iniciar el pago en la tienda</h2>
              </div>
              <div className="space-y-3 text-gray-300 ml-4">
                <p>En el checkout selecciona:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <span className="text-yellow-400 font-bold mt-0.5">💰</span>
                    <span><strong className="text-white">USDT</strong> como moneda</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-yellow-400 font-bold mt-0.5">🌐</span>
                    <span>Selecciona la <strong className="text-white">red indicada en pantalla</strong></span>
                  </li>
                </ul>
                <div className="bg-blue-900/30 border border-blue-700/40 rounded-xl p-4 mt-3">
                  <p className="text-blue-300 text-sm">
                    👉 En este ejemplo: <strong className="text-white">Binance Smart Chain (BEP-20)</strong>
                  </p>
                </div>
                <p className="mt-2">Presiona <strong className="text-white">Siguiente</strong></p>
              </div>
            </section>

            {/* Paso 3 - IMPORTANTE */}
            <section className="bg-red-950/40 backdrop-blur-sm border border-red-700/50 rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-5">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-red-600 text-white font-bold text-lg">3</span>
                <h2 className="text-xl md:text-2xl font-semibold text-white flex items-center gap-2">
                  <AlertTriangle className="text-red-400" size={24} />
                  IMPORTANTE — No usar wallet del navegador
                </h2>
              </div>
              <div className="space-y-4 text-gray-300 ml-4">
                <p>
                  Cuando aparezca la ventana de conectar wallet (MetaMask, Brave, etc.):
                </p>
                <div className="bg-red-900/30 border border-red-700/40 rounded-xl p-4 flex items-center gap-3">
                  <XCircle className="text-red-400 flex-shrink-0" size={24} />
                  <p className="text-red-300 font-semibold text-lg">
                    👉 CIÉRRALA
                  </p>
                </div>
                <p className="text-gray-400">
                  No necesitas conectar ninguna wallet.<br />
                  <strong className="text-white">El pago se hace enviando los USDT desde Binance.</strong>
                </p>
              </div>
            </section>

            {/* Paso 4 */}
            <section className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 md:p-8 hover:border-blue-500/30 transition-colors">
              <div className="flex items-center gap-3 mb-5">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-lg">4</span>
                <h2 className="text-xl md:text-2xl font-semibold text-white">Enviar el pago desde Binance</h2>
              </div>
              <div className="space-y-4 text-gray-300 ml-4">
                <p>En la pantalla verás:</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-gray-700/40 rounded-xl p-4 text-center">
                    <span className="text-2xl block mb-1">💰</span>
                    <span className="text-sm text-gray-400">Monto exacto</span>
                    <p className="text-white font-semibold">en USDT</p>
                  </div>
                  <div className="bg-gray-700/40 rounded-xl p-4 text-center">
                    <span className="text-2xl block mb-1">📋</span>
                    <span className="text-sm text-gray-400">Dirección</span>
                    <p className="text-white font-semibold">de pago</p>
                  </div>
                  <div className="bg-gray-700/40 rounded-xl p-4 text-center">
                    <span className="text-2xl block mb-1">📷</span>
                    <span className="text-sm text-gray-400">Código</span>
                    <p className="text-white font-semibold">QR</p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="font-semibold text-white mb-3">Ahora en Binance:</p>
                  <ol className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-yellow-600/80 text-white text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                      <span>Ve a <strong className="text-white">Wallet → Retirar → Cripto</strong></span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-yellow-600/80 text-white text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                      <span>Selecciona <strong className="text-white">USDT</strong></span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-yellow-600/80 text-white text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                      <span>Pega la <strong className="text-white">dirección</strong> que aparece en la tienda</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-yellow-600/80 text-white text-xs font-bold flex-shrink-0 mt-0.5">4</span>
                      <span>Selecciona la red correcta 👉 <strong className="text-yellow-400">BEP-20 (BSC)</strong></span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-yellow-600/80 text-white text-xs font-bold flex-shrink-0 mt-0.5">5</span>
                      <span>Ingresa el <strong className="text-white">monto exacto</strong></span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-yellow-600/80 text-white text-xs font-bold flex-shrink-0 mt-0.5">6</span>
                      <span>Confirma el retiro</span>
                    </li>
                  </ol>
                </div>
              </div>
            </section>

            {/* Paso 5 */}
            <section className="bg-green-950/30 backdrop-blur-sm border border-green-700/40 rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-5">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-green-600 text-white font-bold text-lg">5</span>
                <h2 className="text-xl md:text-2xl font-semibold text-white">Confirmación automática</h2>
              </div>
              <div className="space-y-3 text-gray-300 ml-4">
                <p>Una vez enviada la transacción:</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="text-green-400 flex-shrink-0" size={20} />
                    <span>El sistema detectará el pago <strong className="text-white">automáticamente</strong></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="text-green-400 flex-shrink-0" size={20} />
                    <span>Tu pedido se marcará como <strong className="text-green-400">pagado</strong></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="text-green-400 flex-shrink-0" size={20} />
                    <span>Procesaremos tu pedido y lo enviaremos</span>
                  </div>
                </div>
                <div className="bg-green-900/30 border border-green-700/40 rounded-xl p-4 mt-4 flex items-center gap-3">
                  <Clock className="text-green-400 flex-shrink-0" size={20} />
                  <p className="text-green-300">
                    <strong>Tiempo habitual:</strong> 1 a 3 minutos
                  </p>
                </div>
              </div>
            </section>

            {/* Reglas */}
            <section className="bg-yellow-950/30 backdrop-blur-sm border border-yellow-700/40 rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-5">
                <AlertTriangle className="text-yellow-400" size={24} />
                <h2 className="text-xl md:text-2xl font-semibold text-white">Reglas para que el pago se confirme</h2>
              </div>
              <ul className="space-y-3 text-gray-300 ml-4">
                <li className="flex items-start gap-3">
                  <span className="text-yellow-400 mt-1">⚠️</span>
                  <span>Enviar <strong className="text-white">solo USDT</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-400 mt-1">⚠️</span>
                  <span>Usar la <strong className="text-white">misma red</strong> indicada</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-400 mt-1">⚠️</span>
                  <span>Enviar el <strong className="text-white">monto exacto</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-400 mt-1">⚠️</span>
                  <span>No enviar desde exchanges que <strong className="text-white">cambien la red automáticamente</strong></span>
                </li>
              </ul>
            </section>

            {/* Si el pago no se confirma */}
            <section className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-5">
                <HelpCircle className="text-blue-400" size={24} />
                <h2 className="text-xl md:text-2xl font-semibold text-white">¿El pago no se confirma?</h2>
              </div>
              <div className="space-y-3 text-gray-300 ml-4">
                <p>Envíanos:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 font-bold mt-0.5">📝</span>
                    <span><strong className="text-white">TXID</strong> (hash de la transacción)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 font-bold mt-0.5">📧</span>
                    <span><strong className="text-white">Email</strong> de la compra</span>
                  </li>
                </ul>
                <div className="mt-4">
                  <a
                    href="https://wa.me/56930917730?text=Hola%2C%20necesito%20ayuda%20con%20mi%20pago%20en%20cripto"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
                  >
                    💬 Contactar por WhatsApp
                  </a>
                </div>
              </div>
            </section>

          </div>
        )}

        {/* ==================== TAB MERCADO PAGO ==================== */}
        {activeTab === 'mercadopago' && (
          <div className="space-y-8">

            {/* Intro */}
            <div className="text-center">
              <span className="text-5xl mb-4 block">💳</span>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Cómo pagar con Tarjeta de Crédito o Débito
              </h2>
              <p className="text-gray-400">vía Mercado Pago — rápido y seguro</p>
            </div>

            {/* Paso 1 */}
            <section className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 md:p-8 hover:border-blue-500/30 transition-colors">
              <div className="flex items-center gap-3 mb-5">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-lg">1</span>
                <h2 className="text-xl md:text-2xl font-semibold text-white flex items-center gap-2">
                  <ShoppingCart size={22} />
                  Agrega productos al carrito
                </h2>
              </div>
              <div className="space-y-3 text-gray-300 ml-4">
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold mt-0.5">•</span>
                  <span>Navega por la <strong className="text-white">Tienda</strong> y elige lo que quieras comprar.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold mt-0.5">•</span>
                  <span>Presiona <strong className="text-white">"Agregar al carrito"</strong> en cada producto.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold mt-0.5">•</span>
                  <span>Cuando estés listo, abre el carrito y presiona <strong className="text-white">"Ir al Checkout"</strong>.</span>
                </li>
              </div>
            </section>

            {/* Paso 2 */}
            <section className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 md:p-8 hover:border-blue-500/30 transition-colors">
              <div className="flex items-center gap-3 mb-5">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-lg">2</span>
                <h2 className="text-xl md:text-2xl font-semibold text-white">Completa tus datos</h2>
              </div>
              <div className="space-y-3 text-gray-300 ml-4">
                <p>En la página de checkout, completa:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 font-bold mt-0.5">📧</span>
                    <span>Tu <strong className="text-white">correo electrónico</strong></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 font-bold mt-0.5">🎮</span>
                    <span>Tu <strong className="text-white">nombre de usuario de Fortnite</strong> (o los datos del producto que estés comprando)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 font-bold mt-0.5">🆔</span>
                    <span>Tu <strong className="text-white">RUT</strong> (si es necesario)</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Paso 3 */}
            <section className="bg-blue-950/30 backdrop-blur-sm border border-blue-700/40 rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-5">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-lg">3</span>
                <h2 className="text-xl md:text-2xl font-semibold text-white flex items-center gap-2">
                  <CreditCard size={22} />
                  Selecciona Mercado Pago
                </h2>
              </div>
              <div className="space-y-3 text-gray-300 ml-4">
                <p>En la sección de <strong className="text-white">Método de pago</strong>:</p>
                <div className="bg-blue-900/30 border border-blue-700/40 rounded-xl p-4">
                  <p className="text-blue-300">
                    👉 Selecciona <strong className="text-white">💳 MercadoPago (Tarjeta de crédito o débito)</strong>
                  </p>
                </div>
                <p className="mt-2">Presiona el botón <strong className="text-white">"Pagar"</strong>.</p>
              </div>
            </section>

            {/* Paso 4 */}
            <section className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 md:p-8 hover:border-blue-500/30 transition-colors">
              <div className="flex items-center gap-3 mb-5">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-lg">4</span>
                <h2 className="text-xl md:text-2xl font-semibold text-white">Completa el pago en Mercado Pago</h2>
              </div>
              <div className="space-y-3 text-gray-300 ml-4">
                <p>Serás redirigido al formulario de pago de Mercado Pago donde podrás:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  <div className="bg-gray-700/40 rounded-xl p-4 flex items-center gap-3">
                    <span className="text-2xl">💳</span>
                    <div>
                      <p className="text-white font-semibold">Tarjeta de crédito</p>
                      <p className="text-sm text-gray-400">Visa, Mastercard, Amex</p>
                    </div>
                  </div>
                  <div className="bg-gray-700/40 rounded-xl p-4 flex items-center gap-3">
                    <span className="text-2xl">🏧</span>
                    <div>
                      <p className="text-white font-semibold">Tarjeta de débito</p>
                      <p className="text-sm text-gray-400">Redcompra, Visa Débito</p>
                    </div>
                  </div>
                </div>
                <ol className="space-y-3 mt-4">
                  <li className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600/80 text-white text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                    <span>Ingresa el <strong className="text-white">número de tu tarjeta</strong></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600/80 text-white text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                    <span>Completa la <strong className="text-white">fecha de vencimiento</strong> y <strong className="text-white">código de seguridad (CVV)</strong></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600/80 text-white text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                    <span>Ingresa tu <strong className="text-white">nombre</strong> como aparece en la tarjeta</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600/80 text-white text-xs font-bold flex-shrink-0 mt-0.5">4</span>
                    <span>Confirma el pago</span>
                  </li>
                </ol>
              </div>
            </section>

            {/* Paso 5 */}
            <section className="bg-green-950/30 backdrop-blur-sm border border-green-700/40 rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-5">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-green-600 text-white font-bold text-lg">5</span>
                <h2 className="text-xl md:text-2xl font-semibold text-white">Confirmación del pago</h2>
              </div>
              <div className="space-y-3 text-gray-300 ml-4">
                <p>Una vez confirmado el pago:</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="text-green-400 flex-shrink-0" size={20} />
                    <span>Mercado Pago procesará tu pago de forma <strong className="text-white">inmediata</strong></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="text-green-400 flex-shrink-0" size={20} />
                    <span>Serás redirigido a la <strong className="text-white">página de confirmación</strong></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="text-green-400 flex-shrink-0" size={20} />
                    <span>Se generará un <strong className="text-white">mensaje de WhatsApp</strong> con tu pedido</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="text-green-400 flex-shrink-0" size={20} />
                    <span>Procesaremos tu pedido y lo enviaremos</span>
                  </div>
                </div>
                <div className="bg-green-900/30 border border-green-700/40 rounded-xl p-4 mt-4 flex items-center gap-3">
                  <Clock className="text-green-400 flex-shrink-0" size={20} />
                  <p className="text-green-300">
                    <strong>Tiempo habitual:</strong> Pago instantáneo, entrega en minutos
                  </p>
                </div>
              </div>
            </section>

            {/* Seguridad */}
            <section className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-5">
                <Shield className="text-blue-400" size={24} />
                <h2 className="text-xl md:text-2xl font-semibold text-white">Seguridad del pago</h2>
              </div>
              <div className="space-y-3 text-gray-300 ml-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">🔒</span>
                    <span>Todos los pagos son procesados por <strong className="text-white">Mercado Pago</strong>, la plataforma de pagos más segura de Latinoamérica.</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">🛡️</span>
                    <span><strong className="text-white">No almacenamos</strong> los datos de tu tarjeta. Toda la información es manejada directamente por Mercado Pago.</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Problemas */}
            <section className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-5">
                <HelpCircle className="text-blue-400" size={24} />
                <h2 className="text-xl md:text-2xl font-semibold text-white">¿Problemas con el pago?</h2>
              </div>
              <div className="space-y-3 text-gray-300 ml-4">
                <p>Si tu pago fue <strong className="text-white">rechazado</strong>, verifica:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 font-bold mt-0.5">•</span>
                    <span>Que tu tarjeta tenga <strong className="text-white">saldo suficiente</strong></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 font-bold mt-0.5">•</span>
                    <span>Que los <strong className="text-white">datos ingresados</strong> sean correctos</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 font-bold mt-0.5">•</span>
                    <span>Que tu tarjeta tenga <strong className="text-white">habilitadas las compras online</strong></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400 font-bold mt-0.5">•</span>
                    <span>Intenta con <strong className="text-white">otra tarjeta</strong> si el problema persiste</span>
                  </li>
                </ul>
                <div className="mt-4">
                  <a
                    href="https://wa.me/56930917730?text=Hola%2C%20necesito%20ayuda%20con%20mi%20pago%20con%20tarjeta"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
                  >
                    💬 Contactar por WhatsApp
                  </a>
                </div>
              </div>
            </section>

          </div>
        )}

        {/* ==================== TAB PAYPAL ==================== */}
        {activeTab === 'paypal' && (
          <div className="space-y-8">

            {/* Intro */}
            <div className="text-center">
              <span className="text-5xl mb-4 block">🅿️</span>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Cómo pagar con PayPal
              </h2>
              <p className="text-gray-400">Paga desde cualquier parte del mundo</p>
            </div>

            {/* Paso 1 */}
            <section className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 md:p-8 hover:border-indigo-500/30 transition-colors">
              <div className="flex items-center gap-3 mb-5">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white font-bold text-lg">1</span>
                <h2 className="text-xl md:text-2xl font-semibold text-white flex items-center gap-2">
                  <ShoppingCart size={22} />
                  Agrega productos al carrito
                </h2>
              </div>
              <div className="space-y-3 text-gray-300 ml-4">
                <li className="flex items-start gap-3">
                  <span className="text-indigo-400 font-bold mt-0.5">•</span>
                  <span>Navega por la <strong className="text-white">Tienda</strong> y elige lo que quieras comprar.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-indigo-400 font-bold mt-0.5">•</span>
                  <span>Presiona <strong className="text-white">"Agregar al carrito"</strong> en cada producto.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-indigo-400 font-bold mt-0.5">•</span>
                  <span>Cuando estés listo, abre el carrito y presiona <strong className="text-white">"Ir al Checkout"</strong>.</span>
                </li>
              </div>
            </section>

            {/* Paso 2 */}
            <section className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 md:p-8 hover:border-indigo-500/30 transition-colors">
              <div className="flex items-center gap-3 mb-5">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white font-bold text-lg">2</span>
                <h2 className="text-xl md:text-2xl font-semibold text-white">Completa tus datos y selecciona PayPal</h2>
              </div>
              <div className="space-y-3 text-gray-300 ml-4">
                <p>En la página de checkout:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <span className="text-indigo-400 font-bold mt-0.5">📧</span>
                    <span>Completa tu <strong className="text-white">correo electrónico</strong> y datos del producto</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-indigo-400 font-bold mt-0.5">💳</span>
                    <span>En método de pago, selecciona <strong className="text-white">🅿️ PayPal (Internacional)</strong></span>
                  </li>
                </ul>
                <div className="bg-indigo-900/30 border border-indigo-700/40 rounded-xl p-4 mt-3">
                  <p className="text-indigo-300 text-sm">
                    💡 El precio se convierte automáticamente de <strong className="text-white">CLP a USD</strong>
                  </p>
                </div>
                <p className="mt-2">Presiona <strong className="text-white">"Pagar"</strong> para continuar.</p>
              </div>
            </section>

            {/* Paso 3 */}
            <section className="bg-indigo-950/30 backdrop-blur-sm border border-indigo-700/40 rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-5">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white font-bold text-lg">3</span>
                <h2 className="text-xl md:text-2xl font-semibold text-white">Paga con tu cuenta PayPal o tarjeta</h2>
              </div>
              <div className="space-y-4 text-gray-300 ml-4">
                <p>Aparecerán los <strong className="text-white">botones de PayPal</strong>. Tienes dos opciones:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-gray-700/40 rounded-xl p-4 flex items-center gap-3">
                    <span className="text-2xl">🅿️</span>
                    <div>
                      <p className="text-white font-semibold">Cuenta PayPal</p>
                      <p className="text-sm text-gray-400">Inicia sesión en tu PayPal y aprueba el pago</p>
                    </div>
                  </div>
                  <div className="bg-gray-700/40 rounded-xl p-4 flex items-center gap-3">
                    <span className="text-2xl">💳</span>
                    <div>
                      <p className="text-white font-semibold">Tarjeta internacional</p>
                      <p className="text-sm text-gray-400">Visa, Mastercard, Amex (sin cuenta PayPal)</p>
                    </div>
                  </div>
                </div>
                <div className="bg-indigo-900/30 border border-indigo-700/40 rounded-xl p-4 mt-3">
                  <p className="text-indigo-300 text-sm">
                    ✅ No necesitas tener cuenta en Chile ni tarjeta nacional. <strong className="text-white">Funciona desde cualquier país.</strong>
                  </p>
                </div>
              </div>
            </section>

            {/* Paso 4 */}
            <section className="bg-green-950/30 backdrop-blur-sm border border-green-700/40 rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-5">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-green-600 text-white font-bold text-lg">4</span>
                <h2 className="text-xl md:text-2xl font-semibold text-white">Confirmación del pago</h2>
              </div>
              <div className="space-y-3 text-gray-300 ml-4">
                <p>Una vez aprobado el pago:</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="text-green-400 flex-shrink-0" size={20} />
                    <span>PayPal procesará el cobro de forma <strong className="text-white">instantánea</strong></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="text-green-400 flex-shrink-0" size={20} />
                    <span>Tu pedido se marcará como <strong className="text-green-400">pagado</strong></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="text-green-400 flex-shrink-0" size={20} />
                    <span>Se generará un <strong className="text-white">mensaje de WhatsApp</strong> con tu pedido</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="text-green-400 flex-shrink-0" size={20} />
                    <span>Recibirás tu producto o activación</span>
                  </div>
                </div>
                <div className="bg-green-900/30 border border-green-700/40 rounded-xl p-4 mt-4 flex items-center gap-3">
                  <Clock className="text-green-400 flex-shrink-0" size={20} />
                  <p className="text-green-300">
                    <strong>Tiempo habitual:</strong> Pago instantáneo, entrega en minutos
                  </p>
                </div>
              </div>
            </section>

            {/* Ventajas */}
            <section className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-5">
                <Shield className="text-indigo-400" size={24} />
                <h2 className="text-xl md:text-2xl font-semibold text-white">Ventajas de pagar con PayPal</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-300 ml-4">
                <div className="flex items-start gap-3">
                  <span className="text-indigo-400 mt-1">🌎</span>
                  <span><strong className="text-white">Internacional</strong> — Paga desde cualquier país del mundo</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-indigo-400 mt-1">🔒</span>
                  <span><strong className="text-white">Seguro</strong> — Protección al comprador de PayPal</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-indigo-400 mt-1">⚡</span>
                  <span><strong className="text-white">Rápido</strong> — Pago instantáneo con un clic</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-indigo-400 mt-1">💳</span>
                  <span><strong className="text-white">Flexible</strong> — Usa saldo PayPal o tarjeta</span>
                </div>
              </div>
            </section>

            {/* Problemas */}
            <section className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-5">
                <HelpCircle className="text-indigo-400" size={24} />
                <h2 className="text-xl md:text-2xl font-semibold text-white">¿Problemas con el pago?</h2>
              </div>
              <div className="space-y-3 text-gray-300 ml-4">
                <p>Si tu pago fue rechazado o tienes dudas:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <span className="text-indigo-400 font-bold mt-0.5">•</span>
                    <span>Verifica que tu cuenta PayPal tenga <strong className="text-white">saldo o tarjeta vinculada</strong></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-indigo-400 font-bold mt-0.5">•</span>
                    <span>Si usas tarjeta directa, asegúrate que esté <strong className="text-white">habilitada para compras internacionales</strong></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-indigo-400 font-bold mt-0.5">•</span>
                    <span>El cargo aparecerá en <strong className="text-white">USD</strong> en tu estado de cuenta</span>
                  </li>
                </ul>
                <div className="mt-4">
                  <a
                    href="https://wa.me/56930917730?text=Hola%2C%20necesito%20ayuda%20con%20mi%20pago%20con%20PayPal"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
                  >
                    💬 Contactar por WhatsApp
                  </a>
                </div>
              </div>
            </section>

          </div>
        )}

      </div>
    </div>
  );
};

export default MetodosPago;
