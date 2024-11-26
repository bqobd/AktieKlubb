import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/v8/finance': {
        target: 'https://query2.finance.yahoo.com',
        changeOrigin: true,
        secure: true,
      }
    }
  }
});