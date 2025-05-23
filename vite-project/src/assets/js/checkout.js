document.addEventListener("DOMContentLoaded", () => {
  const checkoutButton = document.querySelector('#proceed-to-payment');

  if (checkoutButton) {
      checkoutButton.addEventListener('click', (event) => {
          event.preventDefault();

          const email = document.querySelector('#email').value.trim();
          const discord = document.querySelector('#discord').value.trim();
          const fortniteUsername = document.querySelector('#fortniteusername').value.trim();

          // Validación de campos obligatorios
          if (!email || !discord || !fortniteUsername) {
              alert('Please fill in all the required fields.');
              return;
          }

          // Obtener productos del carrito
          let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
          if (carrito.length === 0) {
              alert('Your cart is empty.');
              return;
          }

          // Calcular total del carrito
          let total = carrito.reduce((acc, producto) => acc + (producto.precio * (producto.cantidad || 1)), 0);
          total = total.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });

          // Enviar mensaje por WhatsApp
          enviarwsp(email, discord, fortniteUsername, total, carrito);

          // Simulación de procesamiento de pago
          alert('Processing your payment...');
          setTimeout(() => {
             
          }, 2000);
      });
  }
});

  
  document.addEventListener("DOMContentLoaded", () => {
    // Recuperar el carrito de localStorage
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  
    // Función para renderizar los productos del carrito
    function mostrarProductosCarrito() {
      const cartItemsContainer = document.getElementById("cart-items-container");
      cartItemsContainer.innerHTML = ""; // Limpiar cualquier contenido previo
  
      if (carrito.length === 0) {
        cartItemsContainer.innerHTML = "<p>No items in cart.</p>"; // Mensaje si el carrito está vacío
        return;
      }
  
      // Recorrer los productos del carrito y mostrarlos
      carrito.forEach(producto => {
        const itemCarrito = document.createElement("div");
        itemCarrito.classList.add("flex", "items-center", "justify-between", "mb-4");
  
        itemCarrito.innerHTML = `
          <img src="${producto.imagen}" alt="${producto.nombre}" class="w-16 h-16 rounded-md">
          <div class="flex-1 ml-4">
            <h4 class="font-medium text-lg">${producto.nombre}</h4>
            <p class="text-sm text-gray-400">Quantity: ${producto.cantidad || 1}</p>
            <p class="text-sm text-gray-400">${producto.precio.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</p>
          </div>
          <button class="text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6L6 18M6 6l12 12"></path>
            </svg>
          </button>
        `;
        
        cartItemsContainer.appendChild(itemCarrito);
      });
    }
  
    // Llamar la función para mostrar los productos del carrito
    mostrarProductosCarrito();
    actualizarResumenCarrito(carrito);
  });
  
  
function enviarwsp(email, discord, fortniteUsername, total, carrito) {
  let mensaje = `NUEVA ORDEN\n\n`;
    mensaje += `Email: ${email}\n`;
    mensaje += `Discord: ${discord}\n`;
    mensaje += `Fortnite Username: ${fortniteUsername}\n\n`;
    mensaje += `Total: ${total}\n\n`;
    mensaje += `Productos:\n`;

    carrito.forEach((producto, index) => {
        mensaje += `${index + 1}. ${producto.nombre} - ${producto.precio.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })} x${producto.cantidad || 1}\n`;
    });

  // Codificar el mensaje para URL
  let mensajeCodificado = encodeURIComponent(mensaje);
  let numeroWhatsApp = "56930917730"; // Reemplaza con tu número en formato internacional sin "+"
  let url = `https://wa.me/${numeroWhatsApp}?text=${mensajeCodificado}`;

  // Abrir WhatsApp en una nueva pestaña
  window.open(url, '_blank');
}

function actualizarResumenCarrito(carrito) {
  const subtotalElement = document.getElementById("subtotal");
  const totalElement = document.getElementById("total");

  let subtotal = carrito.reduce((acc, p) => acc + (p.precio * (p.cantidad || 1)), 0);

  const formato = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
  });

  subtotalElement.textContent = formato.format(subtotal);
  totalElement.textContent = formato.format(subtotal); // Envío es gratis, así que total = subtotal
}