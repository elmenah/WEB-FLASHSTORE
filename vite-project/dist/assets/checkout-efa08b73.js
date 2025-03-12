import"./modulepreload-polyfill-3cfb730f.js";document.addEventListener("DOMContentLoaded",()=>{const o=document.querySelector("#proceed-to-payment");o&&o.addEventListener("click",a=>{a.preventDefault();const n=document.querySelector("#email").value.trim(),t=document.querySelector("#discord").value.trim(),r=document.querySelector("#fortniteusername").value.trim();if(!n||!t||!r){alert("Please fill in all the required fields.");return}let e=JSON.parse(localStorage.getItem("carrito"))||[];if(e.length===0){alert("Your cart is empty.");return}let i=e.reduce((l,c)=>l+c.precio*(c.cantidad||1),0);i=i.toLocaleString("es-CL",{style:"currency",currency:"CLP"}),d(n,t,r,i,e),alert("Processing your payment..."),setTimeout(()=>{},2e3)})});document.addEventListener("DOMContentLoaded",()=>{let o=JSON.parse(localStorage.getItem("carrito"))||[];function a(){const n=document.getElementById("cart-items-container");if(n.innerHTML="",o.length===0){n.innerHTML="<p>No items in cart.</p>";return}o.forEach(t=>{const r=document.createElement("div");r.classList.add("flex","items-center","justify-between","mb-4"),r.innerHTML=`
          <img src="${t.imagen}" alt="${t.nombre}" class="w-16 h-16 rounded-md">
          <div class="flex-1 ml-4">
            <h4 class="font-medium text-lg">${t.nombre}</h4>
            <p class="text-sm text-gray-400">Quantity: ${t.cantidad||1}</p>
            <p class="text-sm text-gray-400">${t.precio.toLocaleString("es-CL",{style:"currency",currency:"CLP"})}</p>
          </div>
          <button class="text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6L6 18M6 6l12 12"></path>
            </svg>
          </button>
        `,n.appendChild(r)})}a()});function d(o,a,n,t,r){let e=`NUEVA ORDEN

`;e+=`Email: ${o}
`,e+=`Discord: ${a}
`,e+=`Fortnite Username: ${n}

`,e+=`Total: ${t}

`,e+=`Productos:
`,r.forEach((s,m)=>{e+=`${m+1}. ${s.nombre} - ${s.precio.toLocaleString("es-CL",{style:"currency",currency:"CLP"})} x${s.cantidad||1}
`});let c=`https://wa.me/56930917730?text=${encodeURIComponent(e)}`;window.open(c,"_blank")}
