// Importar Firebase desde la CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-analytics.js";
import {signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

const provider = new GoogleAuthProvider();
// Configuración de Firebase
// Cargar las variables de entorno desde el archivo .env
const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
    measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

console.log("API Key:", process.env.VITE_FIREBASE_API_KEY);
// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

// Función para registrar usuarios
window.registrar = () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    createUserWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
            alert("Usuario registrado correctamente");
        })
        .catch(error => {
            console.error(error.message);
            alert(error.message);
        });
};

document.getElementById("btn-login").addEventListener("click", (event) => {
    event.preventDefault(); // Evita que el formulario se recargue

    // Ocultar formulario y mostrar loader
    document.getElementById("formulario-login").style.display = "none";
    document.getElementById("loader").style.display = "block";

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
            document.getElementById("loader").style.display = "none";
            
            window.location.href = "index.html"; // Redirige al usuario
        })
        .catch(error => {
            console.error("Error en login:", error.message);
            alert(error.message);
            window.location.href = "login.html"; // Redirige al usuario
        });
});


document.getElementById("btn-google").addEventListener("click", (event) => {
    event.preventDefault(); // Evita recargar la página

    // Ocultar formulario y mostrar loader
    document.getElementById("formulario-login").style.display = "none";
    document.getElementById("loader").style.display = "block";

    signInWithPopup(auth, provider)
        .then((result) => {
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