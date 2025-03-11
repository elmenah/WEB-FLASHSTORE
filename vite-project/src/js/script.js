

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


function btnvertienda() {
  window.location.href = '../src/shop.html';
}


