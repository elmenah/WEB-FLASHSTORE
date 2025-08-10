import"./modulepreload-polyfill-3cfb730f.js";document.addEventListener("DOMContentLoaded",()=>{const y=document.querySelector("#proceed-to-payment"),c=document.querySelector("#email"),s=document.querySelector("#fortniteusername"),v=document.querySelector("#order-notes"),f=document.querySelector("#accept-terms"),b=document.getElementById("cart-items-container"),k=document.getElementById("subtotal"),S=document.getElementById("total"),l=document.getElementById("coupon"),g=document.getElementById("apply-coupon"),i=document.getElementById("coupon-feedback");let r=JSON.parse(localStorage.getItem("carrito"))||[],n={type:null,value:0,code:null};const m=new Intl.NumberFormat("es-CL",{style:"currency",currency:"CLP"}),I=/^[^\s@]+@[^\s@]+\.[^\s@]+$/,L=()=>localStorage.setItem("carrito",JSON.stringify(r)),C=()=>r.reduce((e,t)=>e+(Number(t.precio)||0)*(Number(t.cantidad)||1),0),N=e=>n.type?n.type==="percent"?Math.max(0,Math.round(e*(1-n.value))):n.type==="fixed"?Math.max(0,e-n.value):e:e,u=()=>{const e=C(),t=N(e);k.textContent=m.format(e),S.textContent=m.format(t)},$=()=>{if(b.innerHTML="",r.length===0){b.innerHTML='<p class="text-gray-400">No items in cart.</p>',u();return}r.forEach((e,t)=>{const o=document.createElement("div");o.className="flex items-center justify-between gap-3 py-3 border-b border-gray-700/50",o.innerHTML=`
        <img src="${e.imagen}" alt="${e.nombre}" class="w-16 h-16 rounded-md object-cover">
        <div class="flex-1">
          <h4 class="font-medium text-base">${e.nombre}</h4>
          <p class="text-sm text-gray-400">Cantidad: ${e.cantidad||1}</p>
          <p class="text-sm text-gray-400">${m.format(Number(e.precio)||0)}</p>
        </div>
        <button class="remove-item text-gray-400 hover:text-white" aria-label="Eliminar">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6L6 18M6 6l12 12"></path>
          </svg>
        </button>
      `,o.querySelector(".remove-item").addEventListener("click",()=>{r.splice(t,1),L(),$()}),b.appendChild(o)}),u()},E={FORTNITE10:{type:"percent",value:.1,label:"10% de descuento"}},w=()=>{const e=((l==null?void 0:l.value)||"").trim().toUpperCase(),t=E[e];if(!e){n={type:null,value:0,code:null},i&&(i.textContent=""),u();return}t?(n={type:t.type,value:t.value,code:e},i.textContent=`Cupón aplicado: ${t.label}`,i.className="text-xs mt-2 text-green-400"):(n={type:null,value:0,code:null},i.textContent="Cupón inválido.",i.className="text-xs mt-2 text-red-400"),u()},O=(e,t,o,x,p,d)=>{let a=`NUEVA ORDEN

`;a+=`Email: ${e}
`,a+=`Fortnite Username: ${t}
`,d!=null&&d.code&&(a+=`Cupón: ${d.code}
`),p&&(a+=`Notas: ${p}
`),a+=`
Total: ${o}

`,a+=`Productos:
`,x.forEach((h,P)=>{const q=m.format(Number(h.precio)||0),D=Number(h.cantidad)||1;a+=`${P+1}. ${h.nombre} - ${q} x${D}
`});const M=`https://wa.me/56930917730?text=${encodeURIComponent(a)}`;window.open(M,"_blank")};g==null||g.addEventListener("click",w),l==null||l.addEventListener("keydown",e=>{e.key==="Enter"&&(e.preventDefault(),w())}),y==null||y.addEventListener("click",e=>{e.preventDefault();const t=I.test(((c==null?void 0:c.value)||"").trim()),o=((s==null?void 0:s.value)||"").trim()!=="",x=!!(f!=null&&f.checked);if(!t){alert("Por favor introduce un email válido.");return}if(!o){alert("Por favor introduce tu nombre de Fortnite.");return}if(!x){alert("Debes aceptar los términos y condiciones.");return}if(r=JSON.parse(localStorage.getItem("carrito"))||[],r.length===0){alert("Tu carrito está vacío.");return}const p=N(C()),d=m.format(p);O(((c==null?void 0:c.value)||"").trim(),((s==null?void 0:s.value)||"").trim(),d,r,((v==null?void 0:v.value)||"").trim(),n.code?n:null),alert("Procesando tu pedido...")}),$()});
