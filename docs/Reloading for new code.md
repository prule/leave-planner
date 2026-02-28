To make the app actually refresh when new code is deployed, you need to handle the Service Worker update logic.

In a PWA, the browser downloads the new code in the background but won't apply it immediately because it doesn't want to interrupt the user (and to ensure all tabs are in sync).

1. Configure the Plugin for "Prompt" or "Auto"
First, decide how you want the update to happen in your vite.config.ts.

Option A: The "Prompt" Strategy (Recommended)
This shows the user a "New version available! Reload?" button.

TypeScript
// vite.config.ts
export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'prompt', // This waits for user permission
      // ... other config
    })
  ]
})

Option B: The "Auto Update" Strategy
This forces the app to refresh as soon as it finds new code.
Warning: This can be jarring if the user is in the middle of a form.

TypeScript
// vite.config.ts
registerType: 'autoUpdate'

2. Implement the Logic in ReloadPrompt.vue
You need to use the useRegisterSW hook from the virtual module we fixed earlier. This hook gives you a flag (needRefresh) and a function (updateServiceWorker).

Code snippet
<template>
  <div v-if="needRefresh" class="fixed bottom-4 right-4 z-[100] p-4 bg-white border border-gray-100 shadow-xl rounded-2xl">
    <div class="mb-2 text-sm text-gray-700">
      New content available, click on reload button to update.
    </div>
    <button
      @click="updateServiceWorker()"
      class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
    >
      Reload
    </button>
    <button
      @click="needRefresh = false"
      class="ml-2 text-gray-500 text-sm"
    >
      Close
    </button>
  </div>
</template>

<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue'

const {
  needRefresh,
  updateServiceWorker,
} = useRegisterSW({
  onRegistered(r) {
    console.log('SW Registered: ', r)
    // Optional: Check for updates every hour
    r && setInterval(() => {
      r.update()
    }, 3600000)
  },
})
</script>

3. The "Gotcha" with GitHub Actions/CI
For this to work in production, your GitHub Action must ensure that the sw.js (Service Worker) file is not cached by the server (Nginx/Vercel/Cloudflare).

The Problem: If your server tells the browser to cache sw.js for a year, the browser will never check for your new code.

The Fix: Ensure your hosting provider sets Cache-Control: no-cache for the sw.js file.

4. Testing it Locally
You cannot test PWA updates easily with npm run dev. You must:

Run npm run build.

Run npm run preview.

Open the app in your browser.

Change a line of code in your project.

Build again (npm run build).

The ReloadPrompt should pop up in your already-open browser tab.
