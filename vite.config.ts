import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

const base = process.env.HERMESVJ2_BASE ?? '/hermesvj2/';

export default defineConfig({
  base,
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
  },
});
