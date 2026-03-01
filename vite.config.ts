import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import { version } from './package.json'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      filename: `sw-${version}.js`, // Generates sw-1.0.0.js instead of sw.js
      registerType: 'prompt', // Changed from 'autoUpdate' to 'prompt'
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Leave Planner',
        short_name: 'LeavePlanner',
        description: 'Track and plan your leave balance',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'], // Ensure JSON data files are cached too
        // Optional: clear out older service worker versions from the cache
        cleanupOutdatedCaches: true,
        dontCacheBustURLsMatching: /^assets\//,
      }
    })
  ],
  base: '/leave-planner/'
})
