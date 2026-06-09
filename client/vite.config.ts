import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Proxy /api to the backend so the frontend can call it with relative URLs in dev.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
});
