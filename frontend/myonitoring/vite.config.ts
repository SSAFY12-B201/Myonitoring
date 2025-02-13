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
  //API 수정한 곳임임
  server: {
    proxy: {
      '/api': {
        target: 'https://myonitoring.site',
        changeOrigin: true,
        rewrite: (path) => path, // 경로 재작성 제거
        secure: false, // HTTPS 인증서 검증 비활성화 (개발 환경용)
      },
    },
  },
});
