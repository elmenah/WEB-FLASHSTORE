// Función para agregar un producto al carrito
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const abrirCarritoBtnDesktop = document.getElementById("cart-desktop");
const abrirCarritoBtnMobile = document.getElementById("cart-mobile");
const carritoPopup = document.getElementById("carrito-popup");
const cerrarCarritoBtn = document.getElementById("cerrar-carrito");

// Evento para abrir el carrito (escritorio)
abrirCarritoBtnDesktop.addEventListener("click", () => {
  carritoPopup.classList.add("open");
  actualizarCarrito();
});

// Evento para abrir el carrito (móviles)
abrirCarritoBtnMobile.addEventListener("click", () => {
  carritoPopup.classList.add("open");
  actualizarCarrito();
});

// Evento para cerrar el carrito
cerrarCarritoBtn.addEventListener("click", () => {
  carritoPopup.classList.remove("open");
});
// Función para actualizar el carrito en localStorage y la vista
function actualizarCarrito() {
  const carritoContenido = document.getElementById("carrito-contenido");
  carritoContenido.innerHTML = "";
  if (carrito.length === 0) {
    carritoContenido.innerHTML = "<p>No hay productos en el carrito.</p>";
}
  let total = 0;

  carrito.forEach((producto, index) => {
    const itemCarrito = document.createElement("div");
    itemCarrito.classList.add("carrito-item");
    itemCarrito.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <div class="nombre">${producto.nombre}</div>
            <div class="precio">${producto.precio.toLocaleString(
              "es-CL"
            )} CLP</div>
            <div class="eliminar" data-index="${index}">❌</div>
        `;
    carritoContenido.appendChild(itemCarrito);

    total += producto.precio;
  });

  document.getElementById("total-precio").textContent =
    total.toLocaleString("es-CL");

  // Agregar eventos para eliminar productos
  const eliminarBtns = document.querySelectorAll(".carrito-item .eliminar");
  eliminarBtns.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const index = event.target.getAttribute("data-index");
      carrito.splice(index, 1); // Eliminar del carrito
      localStorage.setItem("carrito", JSON.stringify(carrito)); // Guardar el carrito actualizado en localStorage
      actualizarCarrito(); // Actualizar la vista del carrito
    });
  });
}

// Vaciar carrito
document.getElementById("vaciar-carrito").addEventListener("click", () => {
  carrito = [];
  localStorage.setItem("carrito", JSON.stringify(carrito)); // Guardar carrito vacío en localStorage
  actualizarCarrito();
});

function agregarAlCarrito(producto) {
  carrito.push(producto);
  localStorage.setItem("carrito", JSON.stringify(carrito)); // Guardar en localStorage
  actualizarCarrito();
}


// HAMBURGUER MENU
document.addEventListener("DOMContentLoaded", function () {
  const menuButton = document.getElementById("hamburguer-menu");
  const closeButton = document.getElementById("close-menu");
  const menuList = document.getElementById("hamburguer-menu-list");

  // Mostrar el menú al hacer clic en el icono de hamburguesa
  menuButton.addEventListener("click", function () {
      menuList.classList.remove("hidden");
  });

  // Ocultar el menú al hacer clic en el botón de cerrar
  closeButton.addEventListener("click", function () {
      menuList.classList.add("hidden");
  });

  // Cerrar el menú si se hace clic fuera de él
  menuList.addEventListener("click", function (event) {
      if (event.target === menuList) {
          menuList.classList.add("hidden");
      }
  });
});


// SLIDES
document.addEventListener("DOMContentLoaded", function () {
  const slides = document.querySelectorAll(".slide");
  let currentIndex = 0;

  function cambiarSlide() {
      slides[currentIndex].classList.remove("active");
      currentIndex = (currentIndex + 1) % slides.length;
      slides[currentIndex].classList.add("active");
  }

  setInterval(cambiarSlide, 2000);
});


document.addEventListener("DOMContentLoaded", () => {
  const btnvertienda = document.getElementById("btnvertienda");

  if (btnvertienda) {
    // Aquí vinculamos el evento de clic al botón
    btnvertienda.addEventListener("click", function() {
      // Redirigir a la tienda cuando se haga clic
      window.location.href = 'shop.html'; 
    });
  }
});

document.querySelector("#carrito-popup .total button").addEventListener("click", () => {
  window.location.href = "checkout.html"; // Asegúrate de que esta ruta sea correcta
});

