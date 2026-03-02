<script setup lang="ts">
import { useLeaveStore, type LeavePlannerData } from '../stores/leaveStore'
import { ref, watch, onMounted } from 'vue'

const store = useLeaveStore()

// Local state for form to avoid direct mutation/reactivity issues during editing
const form = ref({ ...store.settings })

// Country data
const countries = ref([])
const counties = ref([])
const loadingCountries = ref(false)
const loadingCounties = ref(false)
const countryError = ref(null)
const countyError = ref(null)

async function fetchCountries() {
  loadingCountries.value = true
  countryError.value = null
  try {
    const response = await fetch('https://date.nager.at/api/v3/AvailableCountries')
    if (!response.ok) {
      throw new Error(`Failed to fetch countries: ${response.statusText}`)
    }
    countries.value = await response.json()
  } catch (error: any) {
    countryError.value = error.message
    console.error(error)
  } finally {
    loadingCountries.value = false
  }
}

async function fetchCounties(countryCode: string) {
  loadingCounties.value = true
  countyError.value = null
  counties.value = [] // Clear previous counties
  try {
    const year = new Date().getFullYear()
    const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`)

    if (!response.ok) {
       throw new Error(`Failed to fetch holidays: ${response.statusText}`)
    }

    const holidays = await response.json()

    // Extract unique counties
    const countySet = new Set<string>()
    if (Array.isArray(holidays)) {
      holidays.forEach((h: any) => {
        if (Array.isArray(h.counties)) {
          h.counties.forEach((c: string) => countySet.add(c))
        }
      })
    }

    // Convert to array for dropdown
    // We don't have names, so we use the code as the name
    counties.value = Array.from(countySet).sort().map(c => ({
      countyCode: c,
      name: c
    }))

  } catch (error: any) {
    countyError.value = error.message
    console.error(error)
  } finally {
    loadingCounties.value = false
  }
}

// Watch for country changes to load counties
watch(() => form.value.holidayCountry, (newCountry) => {
  if (newCountry) {
    fetchCounties(newCountry)
  } else {
    counties.value = [] // Clear counties if no country is selected
  }
})

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

// --- Import Logic ---
const fileInput = ref<HTMLInputElement | null>(null)

function triggerImport() {
  if (confirm('Importing a file will overwrite all current data. Are you sure you want to continue?')) {
    fileInput.value?.click()
  }
}

function handleFileImport(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const text = e.target?.result
      if (typeof text !== 'string') {
        throw new Error('File content is not valid text.')
      }
      const data = JSON.parse(text) as LeavePlannerAta

      // Basic validation to ensure the data looks correct
      if (data.settings && Array.isArray(data.leaveEntries) && Array.isArray(data.monthlyBalances)) {
        store.importData(data)
        alert('Data imported successfully!')
      } else {
        throw new Error('Invalid data structure in JSON file.')
      }
    } catch (error) {
      console.error('Failed to import data:', error)
      alert('Failed to import data. Please ensure you are using a valid JSON backup file.')
    } finally {
      // Reset the file input so the user can import the same file again if needed
      if (target) {
        target.value = ''
      }
    }
  }
  reader.readAsText(file)
}

const months = [
  { value: 1, name: 'January' },
  { value: 2, name: 'February' },
  { value: 3, name: 'March' },
  { value: 4, name: 'April' },
  { value: 5, name: 'May' },
  { value: 6, name: 'June' },
  { value: 7, name: 'July' },
  { value: 8, name: 'August' },
  { value: 9, name: 'September' },
  { value: 10, name: 'October' },
  { value: 11, name: 'November' },
  { value: 12, name: 'December' }
]

onMounted(() => {
  fetchCountries()
  if (form.value.holidayCountry) {
    fetchCounties(form.value.holidayCountry)
  }
})
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

      <div>
        <label for="financial-year-start" class="block text-sm font-medium text-gray-700">Financial Year Start</label>
        <select
          id="financial-year-start"
          v-model.number="form.financialYearStartMonth"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
        >
          <option v-for="month in months" :key="month.value" :value="month.value">
            {{ month.name }}
          </option>
        </select>
        <p class="text-xs text-gray-500 mt-1">The month your financial year begins. Used for calculating annual totals.</p>
      </div>

      <div>
        <label for="holiday-country" class="block text-sm font-medium text-gray-700">Holiday Country</label>
        <select
          id="holiday-country"
          v-model="form.holidayCountry"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
        >
          <option value="">Select a country</option>
          <option v-for="country in countries" :key="country.countryCode" :value="country.countryCode">
            {{ country.name }}
          </option>
        </select>
        <p v-if="countryError" class="text-red-500 text-sm mt-1">{{ countryError }}</p>
        <p v-if="loadingCountries" class="text-gray-500 text-sm mt-1">Loading countries...</p>
      </div>

      <div v-if="counties.length > 0">
        <label for="holiday-county" class="block text-sm font-medium text-gray-700">Holiday County</label>
        <select
          id="holiday-county"
          v-model="form.holidayCounty"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
        >
          <option value="">Select a county (optional)</option>
          <option v-for="county in counties" :key="county.countyCode" :value="county.countyCode">
            {{ county.name }}
          </option>
        </select>
        <p v-if="countyError" class="text-red-500 text-sm mt-1">{{ countyError }}</p>
        <p v-if="loadingCounties" class="text-gray-500 text-sm mt-1">Loading counties...</p>
      </div>

      <div class="pt-4 flex justify-between items-center">
        <div class="flex space-x-4">
          <button
            type="button"
            @click="triggerImport"
            class="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Import Data
          </button>
          <button
            type="button"
            @click="exportData"
            class="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Export Data
          </button>
        </div>

        <button
          type="submit"
          class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Save Settings
        </button>
      </div>
    </form>

    <!-- Hidden file input for the import -->
    <input
      type="file"
      ref="fileInput"
      @change="handleFileImport"
      class="hidden"
      accept=".json"
    >
  </div>
</template>
