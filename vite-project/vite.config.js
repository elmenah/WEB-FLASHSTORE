import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'src', // Define que la carpeta de trabajo es `src/`
  build: {
    outDir: '../dist', // La carpeta de salida `dist/` estará fuera de `src/`
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'src/index.html'), // Asegura que `index.html` está en `src/`
        login: resolve(__dirname, 'src/login.html'),
        shop: resolve(__dirname, 'src/shop.html'),
        registro: resolve(__dirname, 'src/registro.html'),
        detalleproducto: resolve(__dirname, 'src/detalleproducto.html'),
        club: resolve(__dirname, 'src/club.html'),
        checkout: resolve(__dirname, 'src/checkout.html')
      }
    }
  }
});
