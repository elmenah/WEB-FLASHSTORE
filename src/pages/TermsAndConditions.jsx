import React from 'react';

const TermsAndConditions = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-white mb-8">Términos y Condiciones</h1>
      <div className="space-y-6 text-gray-300">
        <p>
          Bienvenido a nuestra tienda. Al utilizar nuestros servicios, aceptas los siguientes términos y condiciones. Por favor, léelos detenidamente antes de realizar una compra.
        </p>

        <h2 className="text-2xl font-semibold text-white">1. Uso del servicio</h2>
        <p>
          Al realizar una compra, confirmas que toda la información proporcionada es precisa y completa. Nos reservamos el derecho de cancelar cualquier pedido si detectamos información falsa o sospechosa.
        </p>

        <h2 className="text-2xl font-semibold text-white">2. Entrega de productos</h2>
        <p>
          Los productos adquiridos serán entregados en el juego Fortnite mediante el nombre de usuario proporcionado en el proceso de compra. Es responsabilidad del cliente asegurarse de que el nombre de usuario sea correcto.
        </p>

        <h2 className="text-2xl font-semibold text-white">3. Política de reembolso</h2>
        <p>
          No se realizarán reembolsos parciales ni totales bajo ninguna circunstancia. Al realizar una compra, aceptas esta política y entiendes que no podrás solicitar devoluciones de dinero.
        </p>

        <h2 className="text-2xl font-semibold text-white">4. Uso de cupones</h2>
        <p>
          Los cupones de descuento son válidos únicamente para los productos especificados y dentro del período indicado. Nos reservamos el derecho de cancelar cualquier cupón en caso de uso indebido.
        </p>

        <h2 className="text-2xl font-semibold text-white">5. Modificaciones</h2>
        <p>
          Nos reservamos el derecho de modificar estos términos y condiciones en cualquier momento. Es responsabilidad del cliente revisar esta página regularmente para estar al tanto de los cambios.
        </p>

        <h2 className="text-2xl font-semibold text-white">6. Contacto</h2>
        <p>
          Si tienes preguntas sobre estos términos y condiciones, puedes contactarnos a través de nuestro correo electrónico o WhatsApp.
        </p>
      </div>
    </div>
  );
};

export default TermsAndConditions;