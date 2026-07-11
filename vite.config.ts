import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

const base = process.env.HERMESVJ2_BASE ?? (process.env.NODE_ENV === 'production' ? '/HermesVJ2/' : '/');

export default defineConfig({
  base,
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/postprocessing') || id.includes('@react-three/postprocessing')) return 'effects';
          if (id.includes('node_modules/three') || id.includes('@react-three/fiber') || id.includes('@react-three/drei')) return 'three';
          if (id.includes('node_modules/react') || id.includes('node_modules/zustand')) return 'react';
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
  },
});
