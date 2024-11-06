import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Base relativa para la aplicación en producción
  build: {
    outDir: 'dist', // Carpeta donde se generarán los archivos del build
  },
});
