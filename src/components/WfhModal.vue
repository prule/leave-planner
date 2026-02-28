<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useLeaveStore } from '../stores/leaveStore'
import { usePublicHolidays } from '../composables/usePublicHolidays'

const props = defineProps<{
  monthKey: string // YYYY-MM
  isOpen: boolean
}>()

const store = useLeaveStore()
const { holidays, fetchHolidaysForYear, isLoading } = usePublicHolidays()

// Fetch holidays when month changes or modal opens
watchEffect(() => {
  if (props.isOpen && props.monthKey) {
    const [year] = props.monthKey.split('-').map(Number)
    fetchHolidaysForYear(year)
  }
})

// Generate days for the month
const daysInMonth = computed(() => {
  const [year, month] = props.monthKey.split('-').map(Number)
  const date = new Date(year, month - 1, 1)
  const days = []

  while (date.getMonth() === month - 1) {
    const dayString = `${year}-${String(month).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    days.push({
      date: dayString,
      dayOfMonth: date.getDate(),
      dayOfWeek: date.getDay(), // 0 = Sunday, 6 = Saturday
      isWeekend: date.getDay() === 0 || date.getDay() === 6
    })
    date.setDate(date.getDate() + 1)
  }
  return days
})

function isWfh(date: string) {
  return store.wfhDates.includes(date)
}

function getPublicHoliday(date: string) {
  return holidays.value.find((h: any) => h.date === date)
}

function toggleDay(date: string) {
  if (getPublicHoliday(date)) return // Prevent toggling on public holidays
  store.toggleWfhDate(date)
}

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// Calculate empty cells for the start of the month to align the grid
const startOffset = computed(() => {
  if (daysInMonth.value.length === 0) return 0
  return daysInMonth.value[0].dayOfWeek
})

</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-10 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">

      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="$emit('close')"></div>

      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4" id="modal-title">
                Work From Home Days - {{ monthKey }}
              </h3>

              <div v-if="isLoading" class="text-sm text-gray-500 mb-2">Loading public holidays...</div>

              <div class="grid grid-cols-7 gap-1 mb-2">
                <div v-for="day in weekDays" :key="day" class="text-center text-xs font-medium text-gray-500 py-1">
                  {{ day }}
                </div>
              </div>

              <div class="grid grid-cols-7 gap-1">
                <!-- Empty cells for offset -->
                <div v-for="n in startOffset" :key="'offset-' + n" class="p-2"></div>

                <!-- Days -->
                <button
                  v-for="day in daysInMonth"
                  :key="day.date"
                  @click="toggleDay(day.date)"
                  :disabled="!!getPublicHoliday(day.date)"
                  :title="getPublicHoliday(day.date)?.name"
                  :class="[
                    'p-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 relative',
                    getPublicHoliday(day.date) ? 'bg-red-100 text-red-800 cursor-not-allowed border border-red-200' :
                    isWfh(day.date) ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-900 hover:bg-gray-200',
                    day.isWeekend ? 'opacity-50' : ''
                  ]"
                >
                  {{ day.dayOfMonth }}
                  <!-- Holiday Indicator Dot -->
                  <span v-if="getPublicHoliday(day.date)" class="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                </button>
              </div>

              <p class="text-xs text-gray-500 mt-4">
                Click on a day to toggle "Work From Home" status. <br>
                <span class="inline-block w-3 h-3 bg-red-100 border border-red-200 rounded-sm mr-1 align-middle"></span> Public Holidays are disabled.
                <span class="inline-block w-3 h-3 bg-gray-100 rounded-sm mr-1 ml-2 align-middle opacity-50"></span> Weekends are dimmed.
              </p>

            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button type="button" @click="$emit('close')" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
