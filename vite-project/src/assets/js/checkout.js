document.addEventListener("DOMContentLoaded", () => {
    // Función para manejar el envío del formulario de checkout
    const checkoutButton = document.querySelector('#proceed-to-payment'); // Usando el id del botón
    if (checkoutButton) {  // Verificar si el botón existe
      checkoutButton.addEventListener('click', (event) => {
        event.preventDefault(); // Evitar que recargue la página
  
        const email = document.querySelector('#email').value.trim();
        const discord = document.querySelector('#discord').value.trim();
        const fortniteUsername = document.querySelector('#fortniteusername').value.trim();
  
        // Validación de campos obligatorios
        if (!email || !discord || !fortniteUsername) {
          alert('Please fill in all the required fields.');
          return;
        }
  
        // Simulación de procesamiento de pago (puedes agregar más lógica aquí)
        alert('Processing your payment...');
  
        // Simulación de éxito en el pago
        setTimeout(() => {
          alert('Your payment was successful! Thank you for your purchase.');
          
        }, 2000); // Simular un retraso de 2 segundos antes de redirigir
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
  });
  