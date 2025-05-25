// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue2';

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3005',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm.js', // Ensures Vue 2 ESM build
    },
  },
});
