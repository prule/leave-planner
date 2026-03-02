<script setup lang="ts">
import { ref } from 'vue'
import SettingsView from './components/SettingsView.vue'
import SpreadsheetView from './components/SpreadsheetView.vue'
import AboutView from './components/AboutView.vue'
import ReloadPrompt from './components/ReloadPrompt.vue'
import FeedbackModal from './components/FeedbackModal.vue'

const currentView = ref<'spreadsheet' | 'settings' | 'about'>('spreadsheet')
const isFeedbackModalOpen = ref(false)
</script>


<template>
  <div class="min-h-screen bg-gray-100 font-sans text-gray-900">
    <!-- Header -->
    <header class="bg-white shadow sticky top-0 z-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <h1 class="text-xl font-bold text-blue-600">Leave Planner</h1>
            </div>
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <button
                @click="currentView = 'spreadsheet'"
                :class="[
                  currentView === 'spreadsheet'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                  'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
                ]"
              >
                Planner
              </button>
              <button
                @click="currentView = 'settings'"
                :class="[
                  currentView === 'settings'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                  'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
                ]"
              >
                Settings
              </button>
              <button
                @click="currentView = 'about'"
                :class="[
                  currentView === 'about'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                  'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
                ]"
              >
                About
              </button>
            </div>
          </div>
          <div class="flex items-center">
            <button @click="isFeedbackModalOpen = true" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Feedback
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div v-if="currentView === 'settings'">
        <SettingsView />
      </div>
      <div v-else-if="currentView === 'spreadsheet'">
        <SpreadsheetView />
      </div>
      <div v-else-if="currentView === 'about'">
        <AboutView />
      </div>
    </main>

    <!-- PWA Reload Prompt -->
    <ReloadPrompt />
    <FeedbackModal :is-open="isFeedbackModalOpen" @close="isFeedbackModalOpen = false" />
  </div>
</template>
