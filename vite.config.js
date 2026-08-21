import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  build: {
    outDir: 'build',
    sourcemap: false,
    // ag-grid is ~1 MB on its own and is deliberately isolated in its own
    // lazily-loaded chunk, so the default 500 kB warning is just noise here.
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        // ag-grid and chart.js are large and only needed on the detail pages,
        // so keep them out of the entry chunk.
        manualChunks: {
          grid: ['ag-grid-community', 'ag-grid-react'],
          charts: ['chart.js', 'react-chartjs-2'],
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
    css: false,
  },
});
