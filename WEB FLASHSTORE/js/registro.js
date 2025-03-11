// Importar Firebase desde la CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-analytics.js";
import {signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

const provider = new GoogleAuthProvider();
// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCkOwGHokpLUjo5c0YwCsGQKUBlRhAqrO0",
    authDomain: "web-flashstore.firebaseapp.com",
    projectId: "web-flashstore",
    storageBucket: "web-flashstore.appspot.com",
    messagingSenderId: "182381546526",
    appId: "1:182381546526:web:b87ab6845e6619de94b20f",
    measurementId: "G-WLX4QWES7Z"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

// Función para registrar usuarios
window.registrar = () => {
    // Obtener los valores de los campos
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const acceptTerms = document.getElementById("acceptTerms").checked; // Verificar si el checkbox está marcado

    // Validar si el checkbox está marcado
    if (!acceptTerms) {
        alert("Debes aceptar los términos y condiciones para registrarte.");
        return; // Si el checkbox no está marcado, no continuar con el registro
    }

    // Si el checkbox está marcado, proceder con el registro
    createUserWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
            alert("Usuario registrado correctamente");
        })
        .catch(error => {
            console.error(error.message);
            alert(error.message);
        });
};


document.getElementById("btn-google").addEventListener("click", (event) => {
    event.preventDefault(); // Evita recargar la página
    const acceptTerms = document.getElementById("acceptTerms").checked; // Verificar si el checkbox está marcado

    // Validar si el checkbox está marcado
    if (!acceptTerms) {
        alert("Debes aceptar los términos y condiciones para registrarte.");
        return; // Si el checkbox no está marcado, no continuar con el registro
    }

    

    // Ocultar formulario y mostrar loader
    document.getElementById("formulario-login").style.display = "none";
    document.getElementById("loader").style.display = "block";

    signInWithPopup(auth, provider)
        .then((result) => {
            // Ocultar loader y mostrar mensaje de bienvenida
            document.getElementById("loader").style.display = "none";
            alert(`Bienvenido, ${result.user.displayName}`);
            window.location.href = "index.html"; // Redirigir después del login
        })
        .catch((error) => {
            console.error("Error al iniciar sesión con Google:", error.message);
            alert(error.message);
            document.getElementById("formulario-login").style.display = "block";
            document.getElementById("loader").style.display = "none";
        });
});

// Función para cerrar sesión
window.logout = () => {
    signOut(auth)
        .then(() => {
            alert("Sesión cerrada");
        })
        .catch(error => {
            console.error(error.message);
            alert(error.message);
        });
};