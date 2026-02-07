<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useLeaveStore } from '../stores/leaveStore'
import { useLeaveCalculations } from '../composables/useLeaveCalculations'
import BalanceChart from './BalanceChart.vue'

const store = useLeaveStore()
const { rows } = useLeaveCalculations()

// Handlers for inline editing
function updateAccrual(monthKey: string, value: string) {
  // If empty string, treat as clearing the override (null)
  const numValue = value === '' ? null : parseFloat(value)

  store.setMonthlyBalance({
    month: monthKey,
    accrual: numValue
  })
}

function updateClosingBalance(monthKey: string, value: string) {
  // If empty string, treat as clearing the override (null)
  const numValue = value === '' ? null : parseFloat(value)

  store.setMonthlyBalance({
    month: monthKey,
    balance: numValue
  })
}

// Helper to format numbers to 2 decimal places safely
function formatNumber(value: number | undefined | null): string {
  if (value === undefined || value === null) return '0.00'
  // Round to 2 decimal places to avoid floating point artifacts
  return (Math.round(value * 100) / 100).toFixed(2)
}

// Helper to determine if a month is in the past
const now = new Date()
const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

function isPast(monthKey: string) {
  return monthKey < currentMonthKey
}

// Modal State
const isModalOpen = ref(false)
const selectedMonthKey = ref('')

function openLeaveModal(monthKey: string) {
  selectedMonthKey.value = monthKey
  isModalOpen.value = true
}

// Scrolling
const scrollContainer = ref<HTMLElement | null>(null)

onMounted(() => {
  nextTick(() => {
    if (!scrollContainer.value) return

    // Try to find the current month row
    const el = scrollContainer.value.querySelector(`#month-${currentMonthKey}`) as HTMLElement

    if (el) {
      // Scroll so current month is near the top/center
      const containerTop = scrollContainer.value.getBoundingClientRect().top
      const elTop = el.getBoundingClientRect().top
      const offset = elTop - containerTop - (scrollContainer.value.clientHeight / 4) // Scroll to 1/4 down
      scrollContainer.value.scrollTop = offset
    } else {
      // Fallback: Scroll to bottom if current month not found (e.g. all history or all future)
      scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight
    }
  })
})

</script>

<template>
  <div class="flex flex-col" style="height: calc(100vh - 4rem - 3rem - 2px);">
    <!-- Chart (doesn't shrink) -->
    <div class="flex-shrink-0 mb-6">
      <BalanceChart />
    </div>

    <!-- Table (takes remaining space and scrolls) -->
    <div class="flex-grow overflow-auto bg-white shadow rounded-lg">
      <div class="overflow-x-auto h-full" ref="scrollContainer">
        <table class="min-w-full divide-y divide-gray-200 relative">
          <thead class="bg-gray-50 sticky top-0 z-10 shadow-sm">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Month</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Opening</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Accrued</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Taken</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Closing (Hrs)</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Days</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Notes</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="row in rows"
              :key="row.monthKey"
              :id="'month-' + row.monthKey"
              :class="[
                isPast(row.monthKey) ? 'bg-gray-50' : 'bg-white',
                'hover:bg-gray-100 transition-colors duration-150'
              ]"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ row.displayMonth }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                {{ formatNumber(row.openingBalance) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right relative group">
                <input
                  :value="formatNumber(row.accrued)"
                  @change="e => updateAccrual(row.monthKey, (e.target as HTMLInputElement).value)"
                  type="number"
                  step="0.01"
                  :class="[
                    'w-24 text-right border-0 border-b border-transparent bg-transparent focus:ring-0 focus:border-blue-500 p-0',
                    row.isAccrualOverridden ? 'font-bold text-blue-600 border-blue-200' : 'text-gray-500'
                  ]"
                >
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                <button
                  @click="openLeaveModal(row.monthKey)"
                  class="hover:text-blue-600 hover:underline focus:outline-none"
                >
                  {{ formatNumber(row.taken) }}
                </button>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                <input
                  :value="formatNumber(row.closingBalance)"
                  @change="e => updateClosingBalance(row.monthKey, (e.target as HTMLInputElement).value)"
                  type="number"
                  step="0.01"
                  :class="[
                    'w-24 text-right border-0 border-b border-transparent bg-transparent focus:ring-0 focus:border-blue-500 p-0',
                    row.isBalanceOverridden ? 'font-bold text-blue-600 border-blue-200' : 'text-gray-500'
                  ]"
                >
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right font-medium">
                {{ formatNumber(row.closingDays) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <input
                  :value="row.notes"
                  @change="e => store.setMonthlyBalance({ month: row.monthKey, notes: (e.target as HTMLInputElement).value })"
                  type="text"
                  class="w-full border-0 border-b border-transparent bg-transparent focus:ring-0 focus:border-blue-500 p-0 text-sm"
                  placeholder="Add note..."
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
