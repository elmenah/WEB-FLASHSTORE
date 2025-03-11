import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    outDir: 'dist', // Carpeta de salida
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'src/login.html'),
        shop: resolve(__dirname, 'src/shop.html'),
        registro: resolve(__dirname, 'src/registro.html'),
        detalleproducto: resolve(__dirname, 'src/detalleproducto.html'),
        club: resolve(__dirname, 'src/club.html'),
        // Agrega aquí cualquier otro HTML que tengas
      }
    }
  },
  define: {
    'process.env': {
      FIREBASE_API_KEY: process.env.VITE_FIREBASE_API_KEY,
      FIREBASE_AUTH_DOMAIN: process.env.VITE_FIREBASE_AUTH_DOMAIN,
      FIREBASE_PROJECT_ID: process.env.VITE_FIREBASE_PROJECT_ID,
      FIREBASE_STORAGE_BUCKET: process.env.VITE_FIREBASE_STORAGE_BUCKET,
      FIREBASE_MESSAGING_SENDER_ID: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      FIREBASE_APP_ID: process.env.VITE_FIREBASE_APP_ID,
      FIREBASE_MEASUREMENT_ID: process.env.VITE_FIREBASE_MEASUREMENT_ID,
    }
  }
});
