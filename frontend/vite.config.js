import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // Asegúrate de que sea '/'
  build: {
    outDir: 'dist', // Carpeta donde se generarán los archivos después del build
    assetsDir: 'assets', // Directorio para los archivos estáticos
  },
  server: {
    mimeTypes: {
      'text/css': ['css'], // Esta línea asegura que los archivos CSS se sirvan como 'text/css'
    },
  },
});
