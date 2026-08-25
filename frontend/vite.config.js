import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt'],
      manifest: {
        name: 'Cổng Thông Tin Làng Giao Tác',
        short_name: 'Làng Giao Tác',
        description: 'Cổng thông tin kết nối cộng đồng Làng Giao Tác — TDP 9 Thuận Lộc, Phường Nam Hồng Lĩnh, tỉnh Hà Tĩnh.',
        theme_color: '#4A7C59',
        background_color: '#FBF6EC',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/images/village/484215892_9601885749870972_6761004858315934829_n.jpg',
            sizes: '192x192',
            type: 'image/jpeg',
          },
          {
            src: '/images/village/484215892_9601885749870972_6761004858315934829_n.jpg',
            sizes: '512x512',
            type: 'image/jpeg',
          },
        ],
      },
    }),
  ],
  server: {
    port: 5173,
    host: true,
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-editor': ['@tiptap/react', '@tiptap/starter-kit', '@tiptap/extension-image', '@tiptap/extension-link'],
          'vendor-ui': ['framer-motion', 'lucide-react', 'leaflet', 'react-leaflet', 'date-fns', 'axios'],
          'vendor-pdf': ['html2canvas', 'jspdf'],
          'vendor-360': ['three', '@photo-sphere-viewer/core'],
        },
      },
    },
  },
});
