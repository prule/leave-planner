<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLeaveStore, type LeaveEntry } from '../stores/leaveStore'

const props = defineProps<{
  monthKey: string // YYYY-MM
  isOpen: boolean
}>()

// const emit = defineEmits<{
//   (e: 'close'): void
// }>()

const store = useLeaveStore()

// Filter leave entries for this month
const monthEntries = computed(() => {
  return store.leaveEntries.filter(entry => entry.startDate.startsWith(props.monthKey))
})

// Form state for new/editing entry
const isEditing = ref(false)
const editingId = ref<string | null>(null)
const form = ref({
  startDate: '',
  endDate: '',
  hoursTaken: 0,
  description: ''
})

function resetForm() {
  // Default start date to the 1st of the current month
  const [year, month] = props.monthKey.split('-')
  const defaultDate = `${year}-${month}-01`

  form.value = {
    startDate: defaultDate,
    endDate: defaultDate,
    hoursTaken: 7.6, // Default standard day
    description: ''
  }
  isEditing.value = false
  editingId.value = null
}

function editEntry(entry: LeaveEntry) {
  form.value = {
    startDate: entry.startDate,
    endDate: entry.endDate,
    hoursTaken: entry.hoursTaken,
    description: entry.description
  }
  editingId.value = entry.id
  isEditing.value = true
}

function saveEntry() {
  if (isEditing.value && editingId.value) {
    store.updateLeaveEntry({
      id: editingId.value,
      ...form.value
    })
  } else {
    store.addLeaveEntry({
      ...form.value
    })
  }
  resetForm()
}

function deleteEntry(id: string) {
  if (confirm('Are you sure you want to delete this leave entry?')) {
    store.deleteLeaveEntry(id)
  }
}

// Initialize form when modal opens
// We can't easily watch props.isOpen here because the component might not be mounted yet or stays mounted.
// Instead, we'll rely on the parent to mount/unmount or use v-if.
// Let's assume the parent uses v-if, so onMounted works, or we watch props.monthKey.
import { watchEffect } from 'vue'
watchEffect(() => {
  if (props.isOpen && !isEditing.value) {
    resetForm()
  }
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
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                Manage Leave - {{ monthKey }}
              </h3>

              <!-- List of existing entries -->
              <div class="mt-4 mb-6">
                <h4 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Entries</h4>
                <ul class="divide-y divide-gray-200 border rounded-md">
                  <li v-for="entry in monthEntries" :key="entry.id" class="p-3 flex justify-between items-center hover:bg-gray-50">
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ entry.description }}</p>
                      <p class="text-xs text-gray-500">{{ entry.startDate }} ({{ entry.hoursTaken }} hrs)</p>
                    </div>
                    <div class="flex space-x-2">
                      <button @click="editEntry(entry)" class="text-blue-600 hover:text-blue-900 text-xs">Edit</button>
                      <button @click="deleteEntry(entry.id)" class="text-red-600 hover:text-red-900 text-xs">Delete</button>
                    </div>
                  </li>
                  <li v-if="monthEntries.length === 0" class="p-3 text-sm text-gray-500 text-center">
                    No leave entries for this month.
                  </li>
                </ul>
              </div>

              <!-- Add/Edit Form -->
              <div class="bg-gray-50 p-4 rounded-md border">
                <h4 class="text-sm font-medium text-gray-900 mb-3">{{ isEditing ? 'Edit Entry' : 'Add New Entry' }}</h4>
                <form @submit.prevent="saveEntry" class="space-y-3">
                  <div>
                    <label class="block text-xs font-medium text-gray-700">Description</label>
                    <input v-model="form.description" type="text" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2">
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-xs font-medium text-gray-700">Start Date</label>
                      <input v-model="form.startDate" type="date" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2">
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-gray-700">Hours Taken</label>
                      <input v-model.number="form.hoursTaken" type="number" step="0.01" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2">
                    </div>
                  </div>
                  <div class="flex justify-end space-x-2 pt-2">
                    <button v-if="isEditing" type="button" @click="resetForm" class="text-gray-600 hover:text-gray-800 text-sm">Cancel Edit</button>
                    <button type="submit" class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                      {{ isEditing ? 'Update' : 'Add' }}
                    </button>
                  </div>
                </form>
              </div>

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
