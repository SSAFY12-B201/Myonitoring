import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
        type: 'module'
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        navigateFallback: "index.html",
        navigateFallbackAllowlist: [/^\/kakao-redirect(\?.*)?$/],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/firebasestorage\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'firebase-storage-cache',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
              },
            },
          },
        ],
      },
      manifest: {
        name: "묘니터링 Myonitoring Pet Care",
        short_name: "묘니터링",
        theme_color: "#000000",
        background_color: "#ffffff",
        display: "standalone",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "/logo_cat.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/logo_cat.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  //API 수정한 곳임임
  server: {
    proxy: {
      "/api": {
        target: "https://myonitoring.site",
        changeOrigin: true,
        secure: false, // HTTPS 인증서 검증 비활성화 (개발 환경용)
      },
    },
  },
  resolve: {
    alias: {
      '@heroicons/react/outline': '@heroicons/react/outline',
      '@heroicons/react': '@heroicons/react',
      '@': path.resolve(__dirname, './src')  // 절대 경로로 변경
    }
  }
});
