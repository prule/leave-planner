<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from 'vue'
import { useLeaveStore } from '../stores/leaveStore'
import { useLeaveCalculations, type CalculatedRow } from '../composables/useLeaveCalculations'
import LeaveModal from './LeaveModal.vue'
import WfhModal from './WfhModal.vue'
import BalanceChart from './BalanceChart.vue'

const store = useLeaveStore()
const { rows } = useLeaveCalculations()

// --- Financial Year Logic ---
const rowsWithTotals = computed(() => {
  const result: (CalculatedRow | { isTotal: true, year: string, totalAccrued: number, totalTaken: number, totalWfh: number })[] = []
  if (rows.value.length === 0) return []

  let fyAccrued = 0
  let fyTaken = 0
  let fyWfh = 0

  const startMonth = store.settings.financialYearStartMonth || 7

  rows.value.forEach((row, index) => {
    const [year, month] = row.monthKey.split('-').map(Number)

    // Add the current row
    result.push(row)

    fyAccrued += row.accrued
    fyTaken += row.taken
    fyWfh += row.wfhDays

    // Check if this is the last month of the financial year
    const isEndOfFy = month === (startMonth === 1 ? 12 : startMonth - 1)

    if (isEndOfFy) {
      // Since we are at the end of the financial year, the current year IS the end year.
      const fyEndYear = year
      const fyStartYear = fyEndYear - 1
      result.push({
        isTotal: true,
        year: `FY ${fyStartYear}/${String(fyEndYear).slice(2)}`,
        totalAccrued: fyAccrued,
        totalTaken: fyTaken,
        totalWfh: fyWfh
      })
      // Reset for next year
      fyAccrued = 0
      fyTaken = 0
      fyWfh = 0
    }
  })

  return result
})

// Handlers for inline editing
function updateAccrual(monthKey: string, value: string) {
  const numValue = value === '' ? null : parseFloat(value)
  store.setMonthlyBalance({ month: monthKey, accrual: numValue })
}

function updateClosingBalance(monthKey: string, value: string) {
  const numValue = value === '' ? null : parseFloat(value)
  store.setMonthlyBalance({ month: monthKey, balance: numValue })
}

// Helper to format numbers
function formatNumber(value: number | undefined | null): string {
  if (value === undefined || value === null) return '0.00'
  return (Math.round(value * 100) / 100).toFixed(2)
}

// Helper for past months
const now = new Date()
const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
function isPast(monthKey: string) {
  return monthKey < currentMonthKey
}

// Modal State
const isModalOpen = ref(false)
const isWfhModalOpen = ref(false)
const selectedMonthKey = ref('')

function openLeaveModal(monthKey: string) {
  selectedMonthKey.value = monthKey
  isModalOpen.value = true
}

function openWfhModal(monthKey: string) {
  selectedMonthKey.value = monthKey
  isWfhModalOpen.value = true
}

// Scrolling
const scrollContainer = ref<HTMLElement | null>(null)
onMounted(() => {
  nextTick(() => {
    if (!scrollContainer.value) return
    const el = scrollContainer.value.querySelector(`#month-${currentMonthKey}`) as HTMLElement
    if (el) {
      const containerTop = scrollContainer.value.getBoundingClientRect().top
      const elTop = el.getBoundingClientRect().top
      const offset = elTop - containerTop - (scrollContainer.value.clientHeight / 4)
      scrollContainer.value.scrollTop = offset
    } else {
      scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight
    }
  })
})
</script>

<template>
  <div class="flex flex-col" style="height: calc(100vh - 4rem - 3rem - 2px);">
    <div class="flex-shrink-0 mb-6">
      <BalanceChart />
    </div>

    <div class="flex-grow overflow-auto bg-white shadow rounded-lg">
      <div class="overflow-x-auto h-full" ref="scrollContainer">
        <table class="min-w-full divide-y divide-gray-200 relative">
          <thead class="bg-gray-50 sticky top-0 z-10 shadow-sm">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Opening</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Accrued</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Taken</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Closing (Hrs)</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Days</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">WFH Days</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <template v-for="(row, index) in rowsWithTotals" :key="index">
              <!-- Total Row -->
              <tr v-if="'isTotal' in row" class="bg-blue-50 font-bold">
                <td class="px-6 py-3 text-sm text-blue-900">{{ row.year }} Totals</td>
                <td class="px-6 py-3"></td> <!-- Empty cell for Opening -->
                <td class="px-6 py-3 text-right text-sm text-blue-900">{{ formatNumber(row.totalAccrued) }}</td>
                <td class="px-6 py-3 text-right text-sm text-blue-900">{{ formatNumber(row.totalTaken) }}</td>
                <td colspan="2" class="px-6 py-3"></td> <!-- Empty cells for Closing, Days -->
                <td class="px-6 py-3 text-right text-sm text-blue-900">{{ row.totalWfh }}</td>
                <td class="px-6 py-3"></td> <!-- Empty cell for Notes -->
              </tr>
              <!-- Regular Month Row -->
              <tr
                v-else
                :id="'month-' + row.monthKey"
                :class="[isPast(row.monthKey) ? 'bg-gray-50' : 'bg-white', 'hover:bg-gray-100']"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ row.displayMonth }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{{ formatNumber(row.openingBalance) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                  <input
                    :value="formatNumber(row.accrued)"
                    @change="e => updateAccrual(row.monthKey, (e.target as HTMLInputElement).value)"
                    type="number" step="0.01"
                    :class="['w-24 text-right bg-transparent p-0 border-0 border-b focus:ring-0', row.isAccrualOverridden ? 'font-bold text-blue-600 border-blue-200' : 'text-gray-500 border-transparent']"
                  >
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                  <button @click="openLeaveModal(row.monthKey)" class="hover:text-blue-600 hover:underline">{{ formatNumber(row.taken) }}</button>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                  <input
                    :value="formatNumber(row.closingBalance)"
                    @change="e => updateClosingBalance(row.monthKey, (e.target as HTMLInputElement).value)"
                    type="number" step="0.01"
                    :class="['w-24 text-right bg-transparent p-0 border-0 border-b focus:ring-0', row.isBalanceOverridden ? 'font-bold text-blue-600 border-blue-200' : 'text-gray-500 border-transparent']"
                  >
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right font-medium">{{ formatNumber(row.closingDays) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                  <button @click="openWfhModal(row.monthKey)" class="hover:text-blue-600 hover:underline">{{ row.wfhDays }}</button>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <input
                    :value="row.notes"
                    @change="e => store.setMonthlyBalance({ month: row.monthKey, notes: (e.target as HTMLInputElement).value })"
                    type="text" class="w-full bg-transparent p-0 border-0 border-b border-transparent focus:ring-0 focus:border-blue-500" placeholder="Add note..."
                  >
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <LeaveModal v-if="isModalOpen" :is-open="isModalOpen" :month-key="selectedMonthKey" @close="isModalOpen = false" />
      <WfhModal v-if="isWfhModalOpen" :is-open="isWfhModalOpen" :month-key="selectedMonthKey" @close="isWfhModalOpen = false" />
    </div>
  </div>
</template>
