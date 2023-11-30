// vite.config.js
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        motionSystem: resolve(__dirname, 'sketches/motion-system/index.html'),
        splitters: resolve(__dirname, 'sketches/splitters/index.html'),
      },
    },
  },
});
