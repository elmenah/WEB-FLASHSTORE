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
            <div class="precio">${producto.precio.toLocaleString("es-CL", { maximumFractionDigits: 0 })} CLP</div>
            <div class="eliminar" data-index="${index}">❌</div>
        `;
        carritoContenido.appendChild(itemCarrito);

        total += producto.precio; // Asegúrate de que producto.precio sea un número
    });

    document.getElementById("total-precio").textContent = total.toLocaleString("es-CL", { maximumFractionDigits: 0 });
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
    mostrarNotificacion(); // Llamar a la función para mostrar la notificación
}

document.addEventListener("DOMContentLoaded", () => {
    const btnAgregarCarrito = document.getElementById("agregar-carrito");
    
    if (btnAgregarCarrito) {
        btnAgregarCarrito.addEventListener("click", btnaddcarrito);
    }
});

function btnaddcarrito() {
    // Obtener los valores del DOM
    const productoNombre = document.getElementById("nombre-producto").textContent;
    const productoPrecioTexto = document.getElementById("precio-producto").textContent;
    const productoImagen = document.getElementById("producto-imagen").src;
    console.log('', productoPrecioTexto);
    // Convertir el precio a número
    const productoPrecio = convertirPrecioANumero(productoPrecioTexto);
    
    // Crear un objeto para el producto
    const producto = {
        nombre: productoNombre,
        precio: productoPrecio, // Asegúrate de que este valor sea un número
        imagen: productoImagen,
    };

    // Agregar al carrito y actualizar la vista
    agregarAlCarrito(producto);
}

document.querySelector("#carrito-popup .total button").addEventListener("click", () => {
    window.location.href = "/checkout.html"; // Asegúrate de que esta ruta sea correcta
});

function convertirPrecioANumero(precioTexto) {
    // Eliminar cualquier cosa que no sea un número o un punto (por ejemplo, "$" o ",")
    const precioLimpio = precioTexto.replace(/[^\d]/g, '');
    
    // Convertir a número
    const precioNumero = parseFloat(precioLimpio);

    
    return precioNumero;
}

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

// fUNCIONES PARA MOSTRAR PRODUCTOS
document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
      // Verificar los parámetros de la URL
  console.log(urlParams.toString());
    const nombre = urlParams.get('nombre');
    const precio = urlParams.get('precio');
    const imagen = urlParams.get('imagen');
    const partOf = urlParams.get('partOf');
    const mainType = urlParams.get('mainType');
    const descripcion = urlParams.get('descripcion');
    const fechaInicio = urlParams.get('fecha');
    const fechaSalida = urlParams.get('out');
    const mensajeSalida = urlParams.get("mensajeSalida");
    const rareza = urlParams.get("rareza");
    const partede = urlParams.get("partede");
    const imgbundle = urlParams.get("imgbundle"); // Se espera que este parámetro sea una cadena separada por comas
    const imgbundle2 = urlParams.get("imgbundle2");
    const imgbundle3 = urlParams.get("imgbundle3");
    const imgbundle4 = urlParams.get("imgbundle4");

    // Asignar valores a los elementos del DOM
    const nombreProducto = document.getElementById('nombre-producto');
    const precioProducto = document.getElementById('precio-producto');
    const productoImagen = document.getElementById('producto-imagen');
    const descripcionProducto = document.getElementById('descripcion-producto');
    const partOfElement = document.getElementById('partOf');
    const mainTypeElement = document.getElementById('mainType');
    const rarezaitem = document.getElementById('rareza');
    const partedelote = document.getElementById('partede');
    const imglote = document.getElementById('producto-imagenes');

    const fechaInFormateada = formatearFecha(fechaInicio);
    document.getElementById('fecha-inicio').textContent = `Llegó a la tienda: ${fechaInFormateada}`;
    const fechaOutFormateada = formatearFecha(fechaSalida);
    document.getElementById('fecha-salida').textContent = `Se va de la tienda: ${fechaOutFormateada}`;

    // Mostrar el mensaje de salida, si existe
    if (mensajeSalida) {
        document.getElementById("mensaje-salida").textContent = mensajeSalida;
    }

    // Función para formatear la fecha en "día-mes-año hora:minuto:segundo"
    function formatearFecha(fechaStr) {
        const fecha = new Date(fechaStr);

        // Formato "día-mes-año"
        const dia = String(fecha.getDate()).padStart(2, '0');
        const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Los meses empiezan desde 0
        const año = fecha.getFullYear();

        // Formato "hora:minuto:segundo"
        const horas = String(fecha.getHours()).padStart(2, '0');
        const minutos = String(fecha.getMinutes()).padStart(2, '0');
        const segundos = String(fecha.getSeconds()).padStart(2, '0');

        // Formato final "día-mes-año hora:minuto:segundo"
        return `${dia}-${mes}-${año} ${horas}:${minutos}:${segundos}`;
    }

    if (nombreProducto) nombreProducto.textContent = nombre;
    if (precioProducto) precioProducto.innerHTML = `Precio: <span>$${(precio * 4.9).toLocaleString("es-CL")} CLP</span>`;
    if (productoImagen) productoImagen.src = imagen;
    if (descripcionProducto) descripcionProducto.textContent = descripcion || "Descripción no disponible.";
    if (partOfElement) partOfElement.textContent = partOf || "No especificado";
    if (mainTypeElement) mainTypeElement.textContent = mainType || "No especificado";
    if (rarezaitem) rarezaitem.textContent = rareza;
    if (partedelote) partedelote.textContent = partede;
    if (imglote) {
        // Limpiar cualquier imagen previamente agregada
        imglote.innerHTML = '';

        // Crear un array con las imágenes disponibles
        const imagenes = [];

        if (imgbundle) {
            const imagen1 = document.createElement('img');
            imagen1.id = "imagen1";
            imagen1.src = imgbundle; // Primera imagen
            imagen1.alt = 'Imagen del producto - Bundle 1';
            imagen1.classList.add('producto-imagen-lote'); // Añadir clase para estilo
            imagenes.push(imagen1); // Agregar la primera imagen al array
        }

        if (imgbundle2 && imgbundle2 !== "undefined" && imgbundle2 !== "") {
            const imagen2 = document.createElement('img');
            imagen2.id = "imagen2";
            imagen2.src = imgbundle2; // Segunda imagen
            imagen2.alt = 'Imagen del producto - Bundle 2';
            imagen2.classList.add('producto-imagen-lote'); // Añadir clase para estilo
            imagenes.push(imagen2); // Agregar la segunda imagen al array
        }

        if (imgbundle3 && imgbundle3 !== "undefined" && imgbundle3 !== "") {
            const imagen3 = document.createElement('img');
            imagen3.id = "imagen3";
            imagen3.src = imgbundle3; // Tercera imagen
            imagen3.alt = 'Imagen del producto - Bundle 3';
            imagen3.classList.add('producto-imagen-lote'); // Añadir clase para estilo
            imagenes.push(imagen3); // Agregar la tercera imagen al array
        }

        if (imgbundle4 && imgbundle4 !== "undefined" && imgbundle4 !== "") {
            const imagen4 = document.createElement('img');
            imagen4.id = "imagen4";
            imagen4.src = imgbundle4; // Cuarta imagen
            imagen4.alt = 'Imagen del producto - Bundle 4';
            imagen4.classList.add('producto-imagen-lote');
            imagenes.push(imagen4); // Agregar la cuarta imagen al array
        }

        // Agregar las imágenes al contenedor solo si hay imágenes disponibles
        if (imagenes.length > 0) {
            imagenes.forEach(imagen => {
                imglote.appendChild(imagen);
            });
        }
    }
    
});