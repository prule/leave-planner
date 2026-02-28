<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue'

const {
  offlineReady,
  needRefresh,
  updateServiceWorker,
} = useRegisterSW()

const close = async () => {
  offlineReady.value = false
  needRefresh.value = false
}
</script>

<template>
  <div
    v-if="offlineReady || needRefresh"
    class="fixed right-0 bottom-0 m-4 p-4 border rounded-lg shadow-lg bg-white z-20"
    role="alert"
  >
    <div class="flex items-start gap-4">
      <div class="flex-1">
        <p v-if="offlineReady" class="text-sm font-medium text-gray-900">
          App ready to work offline
        </p>
        <p v-else class="text-sm font-medium text-gray-900">
          New content available, click on reload button to update.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          v-if="needRefresh"
          @click="updateServiceWorker()"
          class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Reload
        </button>
        <button
          @click="close()"
          class="text-gray-400 hover:text-gray-500"
        >
          <span class="sr-only">Close</span>
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
