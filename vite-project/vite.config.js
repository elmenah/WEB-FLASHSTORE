import { defineConfig } from 'vite';

// Aquí definimos la configuración básica de Vite.
export default defineConfig({
  build: {
    outDir: 'dist', // Asegura que los archivos de salida vayan a la carpeta correcta
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
  },
});
