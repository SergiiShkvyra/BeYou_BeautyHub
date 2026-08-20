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
    },
    // Without this, browsers can serve a stale disk-cached copy of the
    // dev bundle on a normal reload and only fetch fresh content on a
    // hard reload (Ctrl+Shift+R) — confusing during active development.
    headers: {
      'Cache-Control': 'no-store',
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
