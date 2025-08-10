document.addEventListener("DOMContentLoaded", () => {
  // ---------- Elementos ----------
  const checkoutButton   = document.querySelector('#proceed-to-payment');
  const emailEl          = document.querySelector('#email');
  const fortniteEl       = document.querySelector('#fortniteusername');
  const notesEl          = document.querySelector('#order-notes');
  const acceptTermsEl    = document.querySelector('#accept-terms');
  const cartItemsWrap    = document.getElementById("cart-items-container");
  const subtotalEl       = document.getElementById("subtotal");
  const totalEl          = document.getElementById("total");
  const couponEl         = document.getElementById("coupon");
  const applyCouponBtn   = document.getElementById("apply-coupon");
  const couponFeedbackEl = document.getElementById("coupon-feedback");

  // Crear mensajes de error dinámicos
  const emailErrorMsg    = document.createElement("p");
  const fortniteErrorMsg = document.createElement("p");
  const termsErrorMsg    = document.createElement("p");

  [emailErrorMsg, fortniteErrorMsg, termsErrorMsg].forEach(msg => {
    msg.className = "text-xs mt-1 text-red-400";
    msg.style.display = "none";
  });

  emailEl.insertAdjacentElement("afterend", emailErrorMsg);
  fortniteEl.insertAdjacentElement("afterend", fortniteErrorMsg);
  acceptTermsEl.parentElement.insertAdjacentElement("afterend", termsErrorMsg);

  // ---------- Estado ----------
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  let discount = { type: null, value: 0, code: null };

  // ---------- Utilidades ----------
  const CLP = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' });
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const saveCart = () => localStorage.setItem("carrito", JSON.stringify(carrito));
  const cartSubtotal = () =>
    carrito.reduce((acc, p) => acc + ((Number(p.precio) || 0) * (Number(p.cantidad) || 1)), 0);

  const applyDiscount = (amount) => {
    if (!discount.type) return amount;
    if (discount.type === 'percent') return Math.max(0, Math.round(amount * (1 - discount.value)));
    if (discount.type === 'fixed')   return Math.max(0, amount - discount.value);
    return amount;
  };

  const refreshSummary = () => {
    const sub = cartSubtotal();
    const tot = applyDiscount(sub);
    subtotalEl.textContent = CLP.format(sub);
    totalEl.textContent    = CLP.format(tot);
  };

  const renderCart = () => {
    cartItemsWrap.innerHTML = "";
    if (carrito.length === 0) {
      cartItemsWrap.innerHTML = `<p class="text-gray-400">No items in cart.</p>`;
      refreshSummary();
      return;
    }

    carrito.forEach((p, idx) => {
      const row = document.createElement("div");
      row.className = "flex items-center justify-between gap-3 py-3 border-b border-gray-700/50";
      row.innerHTML = `
        <img src="${p.imagen}" alt="${p.nombre}" class="w-16 h-16 rounded-md object-cover">
        <div class="flex-1">
          <h4 class="font-medium text-base">${p.nombre}</h4>
          <p class="text-sm text-gray-400">Cantidad: ${p.cantidad || 1}</p>
          <p class="text-sm text-gray-400">${CLP.format(Number(p.precio) || 0)}</p>
        </div>
        <button class="remove-item text-gray-400 hover:text-white" aria-label="Eliminar">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6L6 18M6 6l12 12"></path>
          </svg>
        </button>
      `;

      row.querySelector(".remove-item").addEventListener("click", () => {
        carrito.splice(idx, 1);
        saveCart();
        renderCart();
      });

      cartItemsWrap.appendChild(row);
    });

    refreshSummary();
  };

  // ---------- Cupón ----------
  const COUPONS = {
    "FORTNITE10": { type: "percent", value: 0.10, label: "10% de descuento" },
  };

  const handleApplyCoupon = () => {
    const code = (couponEl?.value || "").trim().toUpperCase();
    const found = COUPONS[code];

    if (!code) {
      discount = { type: null, value: 0, code: null };
      if (couponFeedbackEl) couponFeedbackEl.textContent = "";
      refreshSummary();
      return;
    }

    if (found) {
      discount = { type: found.type, value: found.value, code };
      couponFeedbackEl.textContent = `Cupón aplicado: ${found.label}`;
      couponFeedbackEl.className = "text-xs mt-2 text-green-400";
    } else {
      discount = { type: null, value: 0, code: null };
      couponFeedbackEl.textContent = "Cupón inválido.";
      couponFeedbackEl.className = "text-xs mt-2 text-red-400";
    }
    refreshSummary();
  };

  // ---------- WhatsApp ----------
  const enviarwsp = (email, fortniteUsername, total, carrito, notes, coupon) => {
    let mensaje  = `NUEVA ORDEN\n\n`;
        mensaje += `Email: ${email}\n`;
        mensaje += `Fortnite Username: ${fortniteUsername}\n`;
    if (coupon?.code)  mensaje += `Cupón: ${coupon.code}\n`;
    if (notes)         mensaje += `Notas: ${notes}\n`;
        mensaje += `\nTotal: ${total}\n\n`;
        mensaje += `Productos:\n`;

    carrito.forEach((producto, i) => {
      const precio = CLP.format(Number(producto.precio) || 0);
      const cant   = Number(producto.cantidad) || 1;
      mensaje += `${i + 1}. ${producto.nombre} - ${precio} x${cant}\n`;
    });

    const url = `https://wa.me/56930917730?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
  };

  // ---------- Eventos ----------
  applyCouponBtn?.addEventListener("click", handleApplyCoupon);
  couponEl?.addEventListener("keydown", e => {
    if (e.key === "Enter") { e.preventDefault(); handleApplyCoupon(); }
  });

  checkoutButton?.addEventListener('click', (event) => {
    event.preventDefault();

    let valid = true;

    // Validación de email
    if (!emailRegex.test((emailEl?.value || "").trim())) {
      emailErrorMsg.textContent = "Por favor introduce un email válido.";
      emailErrorMsg.style.display = "block";
      valid = false;
    } else {
      emailErrorMsg.style.display = "none";
    }

    // Validación nombre Fortnite
    if ((fortniteEl?.value || "").trim() === "") {
      fortniteErrorMsg.textContent = "Por favor introduce tu nombre de Fortnite.";
      fortniteErrorMsg.style.display = "block";
      valid = false;
    } else {
      fortniteErrorMsg.style.display = "none";
    }

    // Validación términos
    if (!acceptTermsEl?.checked) {
      termsErrorMsg.textContent = "Debes aceptar los términos y condiciones.";
      termsErrorMsg.style.display = "block";
      valid = false;
    } else {
      termsErrorMsg.style.display = "none";
    }

    if (!valid) return;

    // Validación carrito vacío
    carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    if (carrito.length === 0) {
      alert('Tu carrito está vacío.');
      return;
    }

    const totalNumber = applyDiscount(cartSubtotal());
    const totalFmt    = CLP.format(totalNumber);

    enviarwsp(
      (emailEl?.value || "").trim(),
      (fortniteEl?.value || "").trim(),
      totalFmt,
      carrito,
      (notesEl?.value || "").trim(),
      discount.code ? discount : null
    );

    alert('Procesando tu pedido...');
  });

  // ---------- Init ----------
  renderCart();
});
