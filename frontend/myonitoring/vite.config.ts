import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
      // PWA의 설치와 앱의 구성 정보를 담고 있는 설정
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
});
