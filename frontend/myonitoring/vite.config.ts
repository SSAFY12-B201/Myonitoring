import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
      workbox: {
        navigateFallback: '/index.html',
        navigateFallbackAllowlist: [/^\/kakao-redirect(\?.*)?$/],
      },
      manifest: {
        name: 'Myonitoring',
        short_name: 'Myonitoring',
        description: 'Cat Health Management Automatic Feeder Application',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/logo_cat.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/logo_cat.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  build: {
    rollupOptions: {
      external: ['@heroicons/react', '@heroicons/react/24/outline']
    }
  },
  resolve: {
    preserveSymlinks: true,
    alias: {
      '@heroicons/react': '@heroicons/react',
      '@': path.resolve(__dirname, './src')  // 절대 경로로 변경
    }
  }
});