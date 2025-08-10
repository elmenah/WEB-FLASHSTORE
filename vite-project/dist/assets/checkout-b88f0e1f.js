import"./modulepreload-polyfill-3cfb730f.js";document.addEventListener("DOMContentLoaded",()=>{const m=document.querySelector("#proceed-to-payment"),o=document.querySelector("#email"),a=document.querySelector("#fortniteusername"),f=document.querySelector("#order-notes"),l=document.querySelector("#accept-terms"),b=document.getElementById("cart-items-container"),L=document.getElementById("subtotal"),I=document.getElementById("total"),d=document.getElementById("coupon"),g=document.getElementById("apply-coupon"),c=document.getElementById("coupon-feedback");let i=JSON.parse(localStorage.getItem("carrito"))||[],s={type:null,value:0,code:null};const p=new Intl.NumberFormat("es-CL",{style:"currency",currency:"CLP"}),N=/^[^\s@]+@[^\s@]+\.[^\s@]+$/,O=()=>localStorage.setItem("carrito",JSON.stringify(i)),k=()=>i.reduce((e,t)=>e+(Number(t.precio)||0)*(Number(t.cantidad)||1),0),$=e=>s.type?s.type==="percent"?Math.max(0,Math.round(e*(1-s.value))):s.type==="fixed"?Math.max(0,e-s.value):e:e,v=()=>{const e=k(),t=$(e);L.textContent=p.format(e),I.textContent=p.format(t)},w=()=>{if(b.innerHTML="",i.length===0){b.innerHTML='<p class="text-gray-400">No items in cart.</p>',v();return}i.forEach((e,t)=>{const r=document.createElement("div");r.className="flex items-center justify-between gap-3 py-3 border-b border-gray-700/50",r.innerHTML=`
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
      `,r.querySelector(".remove-item").addEventListener("click",()=>{i.splice(t,1),O(),w()}),b.appendChild(r)}),v()},x=()=>{const e=N.test(((o==null?void 0:o.value)||"").trim()),t=((a==null?void 0:a.value)||"").trim()!=="",r=!!(l!=null&&l.checked);return m&&(m.disabled=!(e&&t&&r)),e&&t&&r},E={FORTNITE10:{type:"percent",value:.1,label:"10% de descuento"}},S=()=>{const e=((d==null?void 0:d.value)||"").trim().toUpperCase(),t=E[e];if(!e){s={type:null,value:0,code:null},c&&(c.textContent=""),v();return}t?(s={type:t.type,value:t.value,code:e},c&&(c.textContent=`Cupón aplicado: ${t.label}`,c.className="text-xs mt-2 text-green-400"),v()):(s={type:null,value:0,code:null},c&&(c.textContent="Cupón inválido.",c.className="text-xs mt-2 text-red-400"),v())},M=(e,t,r,h,y,u)=>{let n=`NUEVA ORDEN

`;n+=`Email: ${e}
`,n+=`Fortnite Username: ${t}
`,u!=null&&u.code&&(n+=`Cupón: ${u.code}
`),y&&(n+=`Notas: ${y}
`),n+=`
Total: ${r}

`,n+=`Productos:
`,h.forEach((C,F)=>{const D=p.format(Number(C.precio)||0),U=Number(C.cantidad)||1;n+=`${F+1}. ${C.nombre} - ${D} x${U}
`});const q=`https://wa.me/56930917730?text=${encodeURIComponent(n)}`;window.open(q,"_blank")};[o,a,l].forEach(e=>e==null?void 0:e.addEventListener("input",x)),g==null||g.addEventListener("click",S),d==null||d.addEventListener("keydown",e=>{e.key==="Enter"&&(e.preventDefault(),S())}),m==null||m.addEventListener("click",e=>{if(e.preventDefault(),!x()){const h=N.test(((o==null?void 0:o.value)||"").trim()),y=((a==null?void 0:a.value)||"").trim()!=="",u=!!(l!=null&&l.checked);let n=[];h||n.push("• Email inválido"),y||n.push("• Nombre de Fortnite requerido"),u||n.push("• Debes aceptar los términos"),alert(`Corrige lo siguiente:
${n.join(`
`)}`);return}if(i=JSON.parse(localStorage.getItem("carrito"))||[],i.length===0){alert("Tu carrito está vacío.");return}const t=$(k()),r=p.format(t);M(((o==null?void 0:o.value)||"").trim(),((a==null?void 0:a.value)||"").trim(),r,i,((f==null?void 0:f.value)||"").trim(),s.code?s:null),alert("Procesando tu pedido...")}),w(),x()});
