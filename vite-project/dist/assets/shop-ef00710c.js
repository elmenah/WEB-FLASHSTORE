import"./modulepreload-polyfill-3cfb730f.js";let u=JSON.parse(localStorage.getItem("carrito"))||[];const _=document.getElementById("cart-desktop"),F=document.getElementById("cart-mobile"),I=document.getElementById("carrito-popup"),V=document.getElementById("cerrar-carrito");_.addEventListener("click",()=>{I.classList.add("open"),b()});F.addEventListener("click",()=>{I.classList.add("open"),b()});V.addEventListener("click",()=>{I.classList.remove("open")});function b(){const n=document.getElementById("carrito-contenido");n.innerHTML="",u.length===0&&(n.innerHTML="<p>No hay productos en el carrito.</p>");let r=0;u.forEach((o,c)=>{const d=document.createElement("div");d.classList.add("carrito-item"),d.innerHTML=`
            <img src="${o.imagen}" alt="${o.nombre}">
            <div class="nombre">${o.nombre}</div>
            <div class="precio">${o.precio.toLocaleString("es-CL")} CLP</div>
            <div class="eliminar" data-index="${c}">❌</div>
        `,n.appendChild(d),r+=o.precio}),document.getElementById("total-precio").textContent=r.toLocaleString("es-CL"),document.querySelectorAll(".carrito-item .eliminar").forEach(o=>{o.addEventListener("click",c=>{const d=c.target.getAttribute("data-index");u.splice(d,1),localStorage.setItem("carrito",JSON.stringify(u)),b()})})}document.getElementById("vaciar-carrito").addEventListener("click",()=>{u=[],localStorage.setItem("carrito",JSON.stringify(u)),b()});function J(n){u.push(n),localStorage.setItem("carrito",JSON.stringify(u)),b()}document.addEventListener("DOMContentLoaded",function(){const n=document.getElementById("hamburguer-menu"),r=document.getElementById("close-menu"),a=document.getElementById("hamburguer-menu-list");n.addEventListener("click",function(){a.classList.remove("hidden")}),r.addEventListener("click",function(){a.classList.add("hidden")}),a.addEventListener("click",function(o){o.target===a&&a.classList.add("hidden")})});function Y(){const n=document.getElementById("notificacion-carrito");n.classList.remove("hidden"),n.classList.add("opacity-100"),setTimeout(()=>{n.classList.add("hidden"),n.classList.remove("opacity-100")},2e3)}document.addEventListener("DOMContentLoaded",()=>{const n=document.getElementById("productos");async function r(){try{const o=await fetch("https://fortniteapi.io/v2/shop?lang=es-419&includeRenderData=false",{headers:{Authorization:"11b1a0cd-5fdf5d92-62c4e04b-7356366c"}});if(!o.ok)throw new Error("Error al obtener los datos de la API");const c=await o.json();a(c.shop)}catch(o){console.error("❌ Error al cargar la API:",o)}}function a(o){n.innerHTML="";let c={};o.forEach(t=>{var y,h,E,l,g,f,L,C,v,S,$,k,B,P,R,w,A,U,D,O,q,H,M,N,T,z,x;let m=t.displayType||"No especificado";const i=((y=t.section)==null?void 0:y.name)||m||"Otros";c[i]||(c[i]=[]);const p=new Date((h=t.offerDates)==null?void 0:h.out),e=new Date;let s="";if(p<=e)s="Este producto está fuera de oferta";else{const j=Math.ceil((p-e)/864e5);j<=2&&(s=`¡Últimas horas! Sale en ${j} día(s)`)}c[i].push({nombre:t.displayName,precio:t.price.finalPrice,imagen:(E=t.displayAssets)!=null&&E.length?t.displayAssets[0].background||t.displayAssets[0].url:(f=(g=(l=t.granted)==null?void 0:l[0])==null?void 0:g.images)==null?void 0:f.icon_background,descripcion:t.displayDescription||t.description||"Sin descripción disponible",grupo:((L=t.series)==null?void 0:L.name)||((C=t.set)==null?void 0:C.name)||"Sin categoría",tipo:m,descuento:((v=t.banner)==null?void 0:v.name)||null,inicio:((S=t.offerDates)==null?void 0:S.in)||null,fin:(($=t.offerDates)==null?void 0:$.out)||null,mensajeSalida:s,partede:((P=(B=(k=t.granted)==null?void 0:k[0])==null?void 0:B.set)==null?void 0:P.partOf)||"",bundle:(A=(w=(R=t.granted)==null?void 0:R[0])==null?void 0:w.images)==null?void 0:A.icon_background,bundle2:(O=(D=(U=t.granted)==null?void 0:U[1])==null?void 0:D.images)==null?void 0:O.icon_background,bundle3:(M=(H=(q=t.granted)==null?void 0:q[2])==null?void 0:H.images)==null?void 0:M.icon_background,bundle4:(z=(T=(N=t.granted)==null?void 0:N[3])==null?void 0:T.images)==null?void 0:z.icon_background,rareza:((x=t.rarity)==null?void 0:x.name)||"Sin rareza"})}),Object.entries(c).sort(([t],[m])=>t==="Pistas de improvisación"?1:m==="Pistas de improvisación"?-1:0).forEach(([t,m])=>{const i=document.createElement("h2");i.textContent=t,i.className="category-title",n.appendChild(i);const p=document.createElement("div");p.className=t==="Pistas de improvisación"?"pistas-container":"product-container",m.slice(0,20).forEach(e=>{const s=document.createElement("div");s.classList.add("product-card"),e.tipo==="bundle"&&s.classList.add("big-product-card");const y=e.rareza,h=e.partede||"",E=h.substr(18);s.innerHTML=`
                  ${e.descuento?`<div class="discount-banner">${e.descuento}</div>`:""}
                  <img src="${e.imagen}" alt="${e.nombre}">
                  
                  <div class="product-info">
                      <h3>${e.nombre}</h3>
                       <p><strong>Rareza:</strong> ${y}</p>
                       <p><strong></strong> ${h}</p>
                      <div class="price">
                          <img src="https://lh3.googleusercontent.com/d/1VGnO_T1S2sH-IqqD8TX6aHyQKD7rEYzH=s220?authuser=0" alt="V-Bucks">
                          <span class="old-price">${e.precio}</span>
                          <span class="new-price">${(e.precio*4.8).toLocaleString("es-CL")} CLP</span>
                      </div>
                  </div>
                  <button class="carrito" data-product="${e.nombre}" data-price="${e.precio}" data-imagen="${e.imagen}" data-fecha="${e.fin}">
                      <img src="https://lh3.googleusercontent.com/d/1G3MVAV9knIYqiLI6cI7gwKob6Vuvo5MC=s220?authuser=0" alt="Añadir al carrito">
                  </button>
                  
              `,s.querySelector(".carrito").addEventListener("click",l=>{l.stopPropagation();const g=l.target.closest("button").dataset.product,f=l.target.closest("button").dataset.price*4.9,L=l.target.closest("button").dataset.imagen;J({nombre:g,precio:f,imagen:L}),Y()}),s.addEventListener("click",l=>{if(!l.target.closest(".carrito")){const g=e.descripcion||"Sin descripción disponible",f=e.fin||"Fecha no disponible";window.location.href=`detalleproducto.html?nombre=${encodeURIComponent(e.nombre)}&precio=${encodeURIComponent(e.precio)}&imagen=${encodeURIComponent(e.imagen)}&partOf=${encodeURIComponent(e.grupo)}&mainType=${encodeURIComponent(e.tipo)}&descripcion=${encodeURIComponent(g)}&fecha=${encodeURIComponent(e.inicio||"Fecha no disponible.")}&out=${encodeURIComponent(f)}&mensajeSalida=${encodeURIComponent(e.mensajeSalida)}&rareza=${encodeURIComponent(e.rareza)}&partede=${encodeURIComponent(E)}&imgbundle=${encodeURIComponent(e.bundle)}&imgbundle2=${encodeURIComponent(e.bundle2)}&imgbundle3=${encodeURIComponent(e.bundle3)}&imgbundle4=${encodeURIComponent(e.bundle4)}
            
            `}}),p.appendChild(s)}),n.appendChild(p)})}r()});function G(){const n=new Date,r={weekday:"long",year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:!0};return n.toLocaleString("es-ES",r)}document.getElementById("fecha-actual").textContent=G();document.querySelector("#carrito-popup .total button").addEventListener("click",()=>{window.location.href="checkout.html"});document.getElementById("buscador").addEventListener("input",function(){const n=this.value.toLowerCase(),r=document.querySelectorAll(".category-title");if(n===""){K();return}r.forEach(a=>{const o=a.nextElementSibling,c=o.querySelectorAll(".product-card");let d=!1;c.forEach(t=>{const i=t.querySelector("h3").textContent.toLowerCase().includes(n);t.style.display=i?"block":"none",i&&(d=!0)}),d?(a.style.display="block",o.style.display=""):(a.style.display="none",o.style.display="none")})});function K(){document.querySelectorAll(".category-title").forEach(r=>{const a=r.nextElementSibling,o=a.querySelectorAll(".product-card");r.style.display="block",a.style.display="",o.forEach(c=>{c.style.display="block"})})}
