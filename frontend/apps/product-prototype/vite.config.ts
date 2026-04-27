import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return;
          }

          if (id.includes('react-dom') || id.includes('/react/')) {
            return 'react-vendor';
          }

          if (id.includes('lucide-react')) {
            return 'icon-vendor';
          }

          if (id.includes('/motion/')) {
            return 'motion-vendor';
          }

          if (id.includes('recharts')) {
            return 'chart-vendor';
          }

          return 'vendor';
        },
      },
    },
  },
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 5670,
  },
});
