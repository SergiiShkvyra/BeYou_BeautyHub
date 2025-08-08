import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    strictPort: false,
    hmr: {
      port: 5173,
      clientPort: 5173
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
