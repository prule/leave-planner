<script setup lang="ts">
import { useLeaveStore } from '../stores/leaveStore'
import { ref, watch } from 'vue'

const store = useLeaveStore()

// Local state for form to avoid direct mutation/reactivity issues during editing
const form = ref({ ...store.settings })

// Watch for store changes (in case updated elsewhere)
watch(() => store.settings, (newSettings) => {
  form.value = { ...newSettings }
}, { deep: true })

function save() {
  store.updateSettings({ ...form.value })
  alert('Settings saved!')
}

function exportData() {
  const data = JSON.stringify({
    settings: store.settings,
    leaveEntries: store.leaveEntries,
    monthlyBalances: store.monthlyBalances
  }, null, 2)

  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `leave-planner-backup-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="bg-white shadow rounded-lg p-6 max-w-2xl mx-auto">
    <h2 class="text-2xl font-bold mb-6 text-gray-800">Settings</h2>

    <form @submit.prevent="save" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Start Date</label>
        <input
          v-model="form.startDate"
          type="date"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
          required
        >
        <p class="text-xs text-gray-500 mt-1">When does your leave tracking begin?</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Starting Balance (Hours)</label>
        <input
          v-model.number="form.startBalance"
          type="number"
          step="0.01"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
          required
        >
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Default Accrual Rate (Hours/Month)</label>
        <input
          v-model.number="form.defaultAccrualRate"
          type="number"
          step="0.01"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
          required
        >
        <p class="text-xs text-gray-500 mt-1">The default hours you accrue each month. This is used for future projections unless you manually override a month.</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Hours Per Day</label>
        <input
          v-model.number="form.hoursPerDay"
          type="number"
          step="0.01"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
          required
        >
        <p class="text-xs text-gray-500 mt-1">Used to calculate the "Days" column (e.g., 7.6 or 8).</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Projection Horizon (Months)</label>
        <input
          v-model.number="form.projectionHorizon"
          type="number"
          min="1"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
          required
        >
        <p class="text-xs text-gray-500 mt-1">How many months into the future to calculate?</p>
      </div>

      <div class="pt-4 flex justify-between items-center">
        <button
          type="button"
          @click="exportData"
          class="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Export Data
        </button>

        <button
          type="submit"
          class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Save Settings
        </button>
      </div>
    </form>
  </div>
</template>
