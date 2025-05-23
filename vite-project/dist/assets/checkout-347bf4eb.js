import"./modulepreload-polyfill-3cfb730f.js";document.addEventListener("DOMContentLoaded",()=>{const r=document.querySelector("#proceed-to-payment");r&&r.addEventListener("click",a=>{a.preventDefault();const o=document.querySelector("#email").value.trim(),e=document.querySelector("#discord").value.trim(),n=document.querySelector("#fortniteusername").value.trim();if(!o||!e||!n){alert("Please fill in all the required fields.");return}let t=JSON.parse(localStorage.getItem("carrito"))||[];if(t.length===0){alert("Your cart is empty.");return}let c=t.reduce((l,i)=>l+i.precio*(i.cantidad||1),0);c=c.toLocaleString("es-CL",{style:"currency",currency:"CLP"}),d(o,e,n,c,t),alert("Processing your payment..."),setTimeout(()=>{},2e3)})});document.addEventListener("DOMContentLoaded",()=>{let r=JSON.parse(localStorage.getItem("carrito"))||[];function a(){const o=document.getElementById("cart-items-container");if(o.innerHTML="",r.length===0){o.innerHTML="<p>No items in cart.</p>";return}r.forEach(e=>{const n=document.createElement("div");n.classList.add("flex","items-center","justify-between","mb-4"),n.innerHTML=`
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
        `,o.appendChild(n)})}a(),u(r)});function d(r,a,o,e,n){let t=`NUEVA ORDEN

`;t+=`Email: ${r}
`,t+=`Discord: ${a}
`,t+=`Fortnite Username: ${o}

`,t+=`Total: ${e}

`,t+=`Productos:
`,n.forEach((s,m)=>{t+=`${m+1}. ${s.nombre} - ${s.precio.toLocaleString("es-CL",{style:"currency",currency:"CLP"})} x${s.cantidad||1}
`});let i=`https://wa.me/56930917730?text=${encodeURIComponent(t)}`;window.open(i,"_blank")}function u(r){const a=document.getElementById("subtotal"),o=document.getElementById("total");let e=r.reduce((t,c)=>t+c.precio*(c.cantidad||1),0);const n=new Intl.NumberFormat("es-CL",{style:"currency",currency:"CLP"});a.textContent=n.format(e),o.textContent=n.format(e)}
