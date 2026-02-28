<script setup lang="ts">
import { computed } from 'vue'
import { useLeaveStore } from '../stores/leaveStore'

const props = defineProps<{
  monthKey: string // YYYY-MM
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const store = useLeaveStore()

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

function toggleDay(date: string) {
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
                  :class="[
                    'p-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
                    isWfh(day.date) ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-900 hover:bg-gray-200',
                    day.isWeekend ? 'opacity-50' : ''
                  ]"
                >
                  {{ day.dayOfMonth }}
                </button>
              </div>

              <p class="text-xs text-gray-500 mt-4">
                Click on a day to toggle "Work From Home" status. Weekends are shown dimmed.
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
