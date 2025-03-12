// Función para agregar un producto al carrito

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


// MENU HAMBURGUESA

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
  

 // NOTIFICACION AGREGADO AL CARRITO
 function mostrarNotificacion() {
  const notificacion = document.getElementById("notificacion-carrito");
  notificacion.classList.remove("hidden");
  notificacion.classList.add("opacity-100");

  // Ocultar la notificación después de 2 segundos
  setTimeout(() => {
      notificacion.classList.add("hidden");
      notificacion.classList.remove("opacity-100");
  }, 2000);
}



document.addEventListener("DOMContentLoaded", () => {
  const productosContainer = document.getElementById("productos");

  async function fetchItems() {
    try {
      const response = await fetch(
        "https://fortniteapi.io/v2/shop?lang=es-419&includeRenderData=false",
        {
          headers: {
            Authorization: "11b1a0cd-5fdf5d92-62c4e04b-7356366c",
          },
        }
      );
      if (!response.ok) throw new Error("Error al obtener los datos de la API");
      const data = await response.json();
      mostrarProductos(data.shop);
    } catch (error) {
      console.error("❌ Error al cargar la API:", error);
    }
  }

  function mostrarProductos(productos) {
    productosContainer.innerHTML = "";
    let categorias = {};

    productos.forEach((item) => {
      let displayType = item.displayType || "No especificado";
      const categoria = item.section?.name || displayType || "Otros";
      if (!categorias[categoria]) categorias[categoria] = [];

      // Obtener la fecha 'out' y compararla con la fecha actual
      const fechaSalida = new Date(item.offerDates?.out);
      const fechaActual = new Date();
      let mensajeSalida = "";

      // Si el producto está a punto de salir
      if (fechaSalida <= fechaActual) {
        mensajeSalida = "Este producto está fuera de oferta";
      } else {
        const diferenciaDias = Math.ceil(
          (fechaSalida - fechaActual) / (1000 * 60 * 60 * 24)
        );
        if (diferenciaDias <= 2) {
          // Si falta 2 días o menos
          mensajeSalida = `¡Últimas horas! Sale en ${diferenciaDias} día(s)`;
        }
      }

      categorias[categoria].push({
        nombre: item.displayName,
        precio: item.price.finalPrice,
        imagen: item.displayAssets?.length
          ? item.displayAssets[0].background || item.displayAssets[0].url
          : item.granted?.[0]?.images?.icon_background,
        descripcion:
          item.displayDescription ||
          item.description ||
          "Sin descripción disponible",
        grupo: item.series?.name || item.set?.name || "Sin categoría",
        tipo: displayType,
        descuento: item.banner?.name || null,
        inicio: item.offerDates?.in || null,
        fin: item.offerDates?.out || null,
        mensajeSalida: mensajeSalida,
        partede: item.granted?.[0]?.set?.partOf || "",
        bundle: item.granted?.[0]?.images?.icon_background,
        bundle2: item.granted?.[1]?.images?.icon_background,
        bundle3: item.granted?.[2]?.images?.icon_background,
        bundle4: item.granted?.[3]?.images?.icon_background,

        rareza: item.rarity?.name || "Sin rareza", // Agregar la rareza // Agregar el mensaje de salida
      });
    });

    let categoriasOrdenadas = Object.entries(categorias).sort(([a], [b]) => {
      if (a === "Pistas de improvisación") return 1;
      if (b === "Pistas de improvisación") return -1;
      return 0;
    });

    categoriasOrdenadas.forEach(([categoria, productos]) => {
      const tituloCategoria = document.createElement("h2");
      tituloCategoria.textContent = categoria;
      tituloCategoria.className = "category-title";
      productosContainer.appendChild(tituloCategoria);

      const contenedorProductos = document.createElement("div");
      contenedorProductos.className =
        categoria === "Pistas de improvisación"
          ? "pistas-container"
          : "product-container";

      productos.slice(0, 20).forEach((producto) => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");
        if (producto.tipo === "bundle")
          productCard.classList.add("big-product-card");

        // Agregar la rareza del producto
        const rareza = producto.rareza;

        // Agregar la subcadena 'partedesubstr' correctamente
        const partede = producto.partede || "";
        const partedesubstr = partede.substr(18);
        // Comprobar si hay una imagen del bundle y agregarla a la tarjeta

        productCard.innerHTML = `
                  ${
                    producto.descuento
                      ? `<div class="discount-banner">${producto.descuento}</div>`
                      : ""
                  }
                  <img src="${producto.imagen}" alt="${producto.nombre}">
                  
                  <div class="product-info">
                      <h3>${producto.nombre}</h3>
                       <p><strong>Rareza:</strong> ${rareza}</p>
                       <p><strong></strong> ${partede}</p>
                      <div class="price">
                          <img src="https://lh3.googleusercontent.com/d/1VGnO_T1S2sH-IqqD8TX6aHyQKD7rEYzH=s220?authuser=0" alt="V-Bucks">
                          <span class="old-price">${producto.precio}</span>
                          <span class="new-price">${(
                            producto.precio * 4.9
                          ).toLocaleString("es-CL")} CLP</span>
                      </div>
                  </div>
                  <button class="carrito" data-product="${
                    producto.nombre
                  }" data-price="${producto.precio}" data-imagen="${
          producto.imagen
        }" data-fecha="${producto.fin}">
                      <img src="https://lh3.googleusercontent.com/d/1G3MVAV9knIYqiLI6cI7gwKob6Vuvo5MC=s220?authuser=0" alt="Añadir al carrito">
                  </button>
                  
              `;

        // Agregar el evento para añadir al carrito
        productCard
          .querySelector(".carrito")
          .addEventListener("click", (event) => {
            event.stopPropagation(); // Evitar la propagación del evento y la redirección

            const productoNombre =
              event.target.closest("button").dataset.product;
            const productoPrecio =
              event.target.closest("button").dataset.price * 4.9;
            const productoImagen =
              event.target.closest("button").dataset.imagen;

            // Crear un objeto para el producto
            const producto = {
              nombre: productoNombre,
              precio: productoPrecio,
              imagen: productoImagen,
            };

            // Agregar al carrito y actualizar la vista
            agregarAlCarrito(producto);
            mostrarNotificacion();
            
          });

        // Agregar el evento para redirigir al detalle del producto
        productCard.addEventListener("click", (event) => {
          if (!event.target.closest(".carrito")) {
            const descripcion =
              producto.descripcion || "Sin descripción disponible";
            const fechaOut = producto.fin || "Fecha no disponible";

            // Redirigir a la página de detalles del producto con todos los parámetros, incluyendo la fecha 'out'
            window.location.href = `detalleproducto.html?nombre=${encodeURIComponent(
              producto.nombre
            )}&precio=${encodeURIComponent(
              producto.precio
            )}&imagen=${encodeURIComponent(
              producto.imagen
            )}&partOf=${encodeURIComponent(
              producto.grupo
            )}&mainType=${encodeURIComponent(
              producto.tipo
            )}&descripcion=${encodeURIComponent(
              descripcion
            )}&fecha=${encodeURIComponent(
              producto.inicio || "Fecha no disponible."
            )}&out=${encodeURIComponent(
              fechaOut
            )}&mensajeSalida=${encodeURIComponent(
              producto.mensajeSalida
            )}&rareza=${encodeURIComponent(
              producto.rareza
            )}&partede=${encodeURIComponent(
              partedesubstr
            )}&imgbundle=${encodeURIComponent(
              producto.bundle
            )}&imgbundle2=${encodeURIComponent(
            producto.bundle2
            )}&imgbundle3=${encodeURIComponent(
            producto.bundle3
        )}&imgbundle4=${encodeURIComponent(
            producto.bundle4)}
            
            `;
          }
        });

        contenedorProductos.appendChild(productCard);
      });

      productosContainer.appendChild(contenedorProductos);
    });
  }

  fetchItems();
});

// Función para obtener la fecha y hora actual
function obtenerFechaYHora() {
  const fecha = new Date();
  const opciones = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };
  const fechaHoraFormateada = fecha.toLocaleString("es-ES", opciones);
  return fechaHoraFormateada;
}

// Mostrar la fecha y hora en el elemento con id "fecha-actual"
document.getElementById("fecha-actual").textContent = obtenerFechaYHora();
document.querySelector("#carrito-popup .total button").addEventListener("click", () => {
  window.location.href = "checkout.html"; // Asegúrate de que esta ruta sea correcta
});