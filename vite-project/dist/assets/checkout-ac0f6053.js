import"./modulepreload-polyfill-3cfb730f.js";document.addEventListener("DOMContentLoaded",()=>{const x=document.querySelector("#proceed-to-payment"),s=document.querySelector("#email"),c=document.querySelector("#fortniteusername"),b=document.querySelector("#order-notes"),y=document.querySelector("#accept-terms"),g=document.getElementById("cart-items-container"),I=document.getElementById("subtotal"),L=document.getElementById("total"),l=document.getElementById("coupon"),C=document.getElementById("apply-coupon"),d=document.getElementById("coupon-feedback"),i=document.createElement("p"),m=document.createElement("p"),u=document.createElement("p");[i,m,u].forEach(e=>{e.className="text-xs mt-1 text-red-400",e.style.display="none"}),s.insertAdjacentElement("afterend",i),c.insertAdjacentElement("afterend",m),y.parentElement.insertAdjacentElement("afterend",u);let r=JSON.parse(localStorage.getItem("carrito"))||[],n={type:null,value:0,code:null};const p=new Intl.NumberFormat("es-CL",{style:"currency",currency:"CLP"}),M=/^[^\s@]+@[^\s@]+\.[^\s@]+$/,O=()=>localStorage.setItem("carrito",JSON.stringify(r)),N=()=>r.reduce((e,t)=>e+(Number(t.precio)||0)*(Number(t.cantidad)||1),0),$=e=>n.type?n.type==="percent"?Math.max(0,Math.round(e*(1-n.value))):n.type==="fixed"?Math.max(0,e-n.value):e:e,f=()=>{const e=N(),t=$(e);I.textContent=p.format(e),L.textContent=p.format(t)},w=()=>{if(g.innerHTML="",r.length===0){g.innerHTML='<p class="text-gray-400">No items in cart.</p>',f();return}r.forEach((e,t)=>{const o=document.createElement("div");o.className="flex items-center justify-between gap-3 py-3 border-b border-gray-700/50",o.innerHTML=`
        <img src="${e.imagen}" alt="${e.nombre}" class="w-16 h-16 rounded-md object-cover">
        <div class="flex-1">
          <h4 class="font-medium text-base">${e.nombre}</h4>
          <p class="text-sm text-gray-400">Cantidad: ${e.cantidad||1}</p>
          <p class="text-sm text-gray-400">${p.format(Number(e.precio)||0)}</p>
        </div>
        <button class="remove-item text-gray-400 hover:text-white" aria-label="Eliminar">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6L6 18M6 6l12 12"></path>
          </svg>
        </button>
      `,o.querySelector(".remove-item").addEventListener("click",()=>{r.splice(t,1),O(),w()}),g.appendChild(o)}),f()},j={FORTNITE10:{type:"percent",value:.1,label:"10% de descuento"}},k=()=>{const e=((l==null?void 0:l.value)||"").trim().toUpperCase(),t=j[e];if(!e){n={type:null,value:0,code:null},d&&(d.textContent=""),f();return}t?(n={type:t.type,value:t.value,code:e},d.textContent=`Cupón aplicado: ${t.label}`,d.className="text-xs mt-2 text-green-400"):(n={type:null,value:0,code:null},d.textContent="Cupón inválido.",d.className="text-xs mt-2 text-red-400"),f()},P=(e,t,o,E,S,v)=>{let a=`NUEVA ORDEN

`;a+=`Email: ${e}
`,a+=`Fortnite Username: ${t}
`,v!=null&&v.code&&(a+=`Cupón: ${v.code}
`),S&&(a+=`Notas: ${S}
`),a+=`
Total: ${o}

`,a+=`Productos:
`,E.forEach((h,D)=>{const F=p.format(Number(h.precio)||0),T=Number(h.cantidad)||1;a+=`${D+1}. ${h.nombre} - ${F} x${T}
`});const q=`https://wa.me/56930917730?text=${encodeURIComponent(a)}`;window.open(q,"_blank")};C==null||C.addEventListener("click",k),l==null||l.addEventListener("keydown",e=>{e.key==="Enter"&&(e.preventDefault(),k())}),x==null||x.addEventListener("click",e=>{e.preventDefault();let t=!0;if(M.test(((s==null?void 0:s.value)||"").trim())?i.style.display="none":(i.textContent="Por favor introduce un email válido.",i.style.display="block",t=!1),((c==null?void 0:c.value)||"").trim()===""?(m.textContent="Por favor introduce tu nombre de Fortnite.",m.style.display="block",t=!1):m.style.display="none",y!=null&&y.checked?u.style.display="none":(u.textContent="Debes aceptar los términos y condiciones.",u.style.display="block",t=!1),!t)return;if(r=JSON.parse(localStorage.getItem("carrito"))||[],r.length===0){alert("Tu carrito está vacío.");return}const o=$(N()),E=p.format(o);P(((s==null?void 0:s.value)||"").trim(),((c==null?void 0:c.value)||"").trim(),E,r,((b==null?void 0:b.value)||"").trim(),n.code?n:null),alert("Procesando tu pedido...")}),w()});
