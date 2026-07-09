import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Unit-test config. Kept separate from vite.config.ts so dev/build behavior is
// untouched. Only picks up src/**/*.test.* — Playwright specs under tests/ are
// out of scope for Vitest.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: ['./vitest.setup.ts'],
  },
});
