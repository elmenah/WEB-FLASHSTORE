import"./modulepreload-polyfill-3cfb730f.js";import{initializeApp as n}from"https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";import{GoogleAuthProvider as c,getAuth as i,createUserWithEmailAndPassword as l,signInWithPopup as d,signOut as m}from"https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";import{getAnalytics as p}from"https://www.gstatic.com/firebasejs/10.8.1/firebase-analytics.js";const g=new c,u={apiKey:"AIzaSyCkOwGHokpLUjo5c0YwCsGQKUBlRhAqrO0",authDomain:"web-flashstore.firebaseapp.com",projectId:"web-flashstore",storageBucket:"web-flashstore.firebasestorage.app",messagingSenderId:"182381546526",appId:"1:182381546526:web:032523efdc59360994b20f",measurementId:"G-NK1T26VG5G"},s=n(u),a=i(s);p(s);window.registrar=()=>{const e=document.getElementById("email").value,r=document.getElementById("password").value;if(!document.getElementById("acceptTerms").checked){alert("Debes aceptar los términos y condiciones para registrarte.");return}l(a,e,r).then(o=>{alert("Usuario registrado correctamente")}).catch(o=>{console.error(o.message),alert(o.message)})};document.getElementById("btn-google").addEventListener("click",e=>{if(e.preventDefault(),!document.getElementById("acceptTerms").checked){alert("Debes aceptar los términos y condiciones para registrarte.");return}document.getElementById("formulario-login").style.display="none",document.getElementById("loader").style.display="block",d(a,g).then(t=>{document.getElementById("loader").style.display="none",alert(`Bienvenido, ${t.user.displayName}`),window.location.href="index.html"}).catch(t=>{console.error("Error al iniciar sesión con Google:",t.message),alert(t.message),document.getElementById("formulario-login").style.display="block",document.getElementById("loader").style.display="none"})});window.logout=()=>{m(a).then(()=>{alert("Sesión cerrada")}).catch(e=>{console.error(e.message),alert(e.message)})};
