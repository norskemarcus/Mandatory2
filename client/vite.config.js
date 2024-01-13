import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  optimizeDeps: { exclude: ['svelte-navigator'] },
  server: {
    proxy: {
      '/api': 'http://localhost:8080',
      '/auth': 'http://localhost:8080',
      '/notifications': 'http://localhost:8080',
    },
  },
});

// OBS: only active during development, not for production builds
// automatically be proxied to http://localhost:8080/notifications by Vite's development server.
