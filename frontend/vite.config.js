import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', 
  publicDir: 'public', // Carpeta donde se colocan los archivos estáticos sin transformación
  build: {
    outDir: 'dist', // Carpeta donde se generarán los archivos después del build
    assetsDir: 'assets', // Directorio dentro de 'dist' donde se colocarán los recursos estáticos como CSS, JS, imágenes, etc.
  },
  server: {
    headers: {
      'Content-Type': 'text/css', // Esta línea puede ayudar, pero Vite ya debería configurarlo automáticamente
    },
    port: 4000, // Opcionalmente, puedes especificar un puerto para el entorno de desarrollo
    open: true, // Abrirá automáticamente el navegador cuando el servidor de desarrollo esté listo
  },
});
