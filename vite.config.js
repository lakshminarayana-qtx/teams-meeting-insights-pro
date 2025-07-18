import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/teams-meeting-insights-pro/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          graph: ['@microsoft/microsoft-graph-client', '@azure/msal-browser'],
          teams: ['@microsoft/teams-js']
        }
      }
    }
  },
  server: {
    port: 3000,
    host: true
  }
});
