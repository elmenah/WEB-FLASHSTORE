import"./modulepreload-polyfill-3cfb730f.js";document.addEventListener("DOMContentLoaded",()=>{const c=document.querySelector("#proceed-to-payment"),p=document.querySelector("#email"),y=document.querySelector("#fortniteusername"),v=document.querySelector("#order-notes"),d=document.querySelector("#accept-terms"),f=document.getElementById("cart-items-container"),S=document.getElementById("subtotal"),L=document.getElementById("total"),m=document.getElementById("coupon"),g=document.getElementById("apply-coupon"),l=document.getElementById("coupon-feedback");let r=JSON.parse(localStorage.getItem("carrito"))||[],n={type:null,value:0,code:null};const s=new Intl.NumberFormat("es-CL",{style:"currency",currency:"CLP"}),N=()=>localStorage.setItem("carrito",JSON.stringify(r)),E=()=>r.reduce((e,t)=>e+t.precio*(t.cantidad||1),0),h=e=>n.type?n.type==="percent"?Math.max(0,Math.round(e*(1-n.value))):n.type==="fixed"?Math.max(0,e-n.value):e:e,i=()=>{const e=E(),t=h(e);S.textContent=s.format(e),L.textContent=s.format(t)},C=()=>{if(f.innerHTML="",r.length===0){f.innerHTML='<p class="text-gray-400">No items in cart.</p>',i();return}r.forEach((e,t)=>{const o=document.createElement("div");o.className="flex items-center justify-between gap-3 py-3 border-b border-gray-700/50",o.innerHTML=`
        <img src="${e.imagen}" alt="${e.nombre}" class="w-16 h-16 rounded-md object-cover">
        <div class="flex-1">
          <h4 class="font-medium text-base">${e.nombre}</h4>
          <p class="text-sm text-gray-400">Cantidad: ${e.cantidad||1}</p>
          <p class="text-sm text-gray-400">${s.format(e.precio)}</p>
        </div>
        <button class="remove-item text-gray-400 hover:text-white" aria-label="Eliminar">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6L6 18M6 6l12 12"></path>
          </svg>
        </button>
      `,o.querySelector(".remove-item").addEventListener("click",()=>{r.splice(t,1),N(),C()}),f.appendChild(o)}),i()},x=()=>{const e=p.value.trim()!==""&&y.value.trim()!==""&&(d==null?void 0:d.checked);return c&&(c.disabled=!e),e},k={FORTNITE10:{type:"percent",value:.1,label:"10% de descuento"}},w=()=>{const e=(m.value||"").trim().toUpperCase(),t=k[e];if(!e){n={type:null,value:0,code:null},l.textContent="",i();return}t?(n={type:t.type,value:t.value,code:e},l.textContent=`Cupón aplicado: ${t.label}`,l.className="text-xs mt-2 text-green-400",i()):(n={type:null,value:0,code:null},l.textContent="Cupón inválido.",l.className="text-xs mt-2 text-red-400",i())},I=(e,t,o,M,$,u)=>{let a=`NUEVA ORDEN

`;a+=`Email: ${e}
`,a+=`Fortnite Username: ${t}
`,u!=null&&u.code&&(a+=`Cupón: ${u.code}
`),$&&(a+=`Notas: ${$}
`),a+=`
Total: ${o}

`,a+=`Productos:
`,M.forEach((b,q)=>{const F=s.format(b.precio),P=b.cantidad||1;a+=`${q+1}. ${b.nombre} - ${F} x${P}
`});const O=`https://wa.me/56930917730?text=${encodeURIComponent(a)}`;window.open(O,"_blank")};[p,y,d].forEach(e=>e==null?void 0:e.addEventListener("input",x)),g==null||g.addEventListener("click",w),m==null||m.addEventListener("keydown",e=>{e.key==="Enter"&&(e.preventDefault(),w())}),c==null||c.addEventListener("click",e=>{if(e.preventDefault(),!x()){alert("Por favor completa los campos requeridos y acepta los términos.");return}if(r=JSON.parse(localStorage.getItem("carrito"))||[],r.length===0){alert("Tu carrito está vacío.");return}const t=h(E()),o=s.format(t);I(p.value.trim(),y.value.trim(),o,r,((v==null?void 0:v.value)||"").trim(),n.code?n:null),alert("Procesando tu pedido...")}),C(),x()});
