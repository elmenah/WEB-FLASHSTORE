import"./modulepreload-polyfill-3cfb730f.js";document.addEventListener("DOMContentLoaded",()=>{const t=document.querySelector("#proceed-to-payment");t&&t.addEventListener("click",o=>{o.preventDefault();const r=document.querySelector("#email").value.trim(),e=document.querySelector("#discord").value.trim(),n=document.querySelector("#fortniteusername").value.trim();if(!r||!e||!n){alert("Please fill in all the required fields.");return}alert("Processing your payment..."),setTimeout(()=>{alert("Your payment was successful! Thank you for your purchase.")},2e3)})});document.addEventListener("DOMContentLoaded",()=>{let t=JSON.parse(localStorage.getItem("carrito"))||[];function o(){const r=document.getElementById("cart-items-container");if(r.innerHTML="",t.length===0){r.innerHTML="<p>No items in cart.</p>";return}t.forEach(e=>{const n=document.createElement("div");n.classList.add("flex","items-center","justify-between","mb-4"),n.innerHTML=`
          <img src="${e.imagen}" alt="${e.nombre}" class="w-16 h-16 rounded-md">
          <div class="flex-1 ml-4">
            <h4 class="font-medium text-lg">${e.nombre}</h4>
            <p class="text-sm text-gray-400">Quantity: ${e.cantidad||1}</p>
            <p class="text-sm text-gray-400">${e.precio.toLocaleString("es-CL",{style:"currency",currency:"CLP"})}</p>
          </div>
          <button class="text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6L6 18M6 6l12 12"></path>
            </svg>
          </button>
        `,r.appendChild(n)})}o()});
