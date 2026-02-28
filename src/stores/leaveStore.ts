import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export interface Settings {
  startBalance: number
  startDate: string // YYYY-MM-DD
  defaultAccrualRate: number
  projectionHorizon: number
  hoursPerDay: number
  financialYearStartMonth: number // 1 for Jan, 12 for Dec
}

export interface LeaveEntry {
  id: string
  startDate: string // YYYY-MM-DD
  endDate: string // YYYY-MM-DD
  hoursTaken: number
  description: string
}

export interface MonthlyBalance {
  month: string // YYYY-MM
  accrual?: number | null // null means "use default"
  balance?: number | null // null means "calculate automatically"
  notes?: string
}

// Define a type for the entire store's data for import/export
export type LeavePlannerData = {
  settings: Settings;
  leaveEntries: LeaveEntry[];
  monthlyBalances: MonthlyBalance[];
}

export const useLeaveStore = defineStore('leave', () => {
  // Default State
  const defaultSettings: Settings = {
    startBalance: 0,
    startDate: new Date().toISOString().split('T')[0],
    defaultAccrualRate: 10,
    projectionHorizon: 12,
    hoursPerDay: 7.6, // Default standard working day
    financialYearStartMonth: 7 // Default to July
  }

  const settings = ref<Settings>({ ...defaultSettings })
  const leaveEntries = ref<LeaveEntry[]>([])
  const monthlyBalances = ref<MonthlyBalance[]>([])

  // Actions
  function addLeaveEntry(entry: Omit<LeaveEntry, 'id'>) {
    leaveEntries.value.push({
      ...entry,
      id: crypto.randomUUID()
    })
  }

  function updateLeaveEntry(entry: LeaveEntry) {
    const index = leaveEntries.value.findIndex(e => e.id === entry.id)
    if (index !== -1) {
      leaveEntries.value[index] = entry
    }
  }

  function deleteLeaveEntry(id: string) {
    leaveEntries.value = leaveEntries.value.filter(e => e.id !== id)
  }

  function setMonthlyBalance(balance: MonthlyBalance) {
    const index = monthlyBalances.value.findIndex(b => b.month === balance.month)
    
    if (index !== -1) {
      const existing = monthlyBalances.value[index]
      const updated = { ...existing, ...balance }
      
      if (balance.accrual === undefined && existing.accrual !== undefined) updated.accrual = existing.accrual
      if (balance.balance === undefined && existing.balance !== undefined) updated.balance = existing.balance
      
      monthlyBalances.value.splice(index, 1, updated)
    } else {
      monthlyBalances.value.push(balance)
    }
  }

  function updateSettings(newSettings: Settings) {
    settings.value = newSettings
  }

  function importData(data: LeavePlannerData) {
    // Replace the current state with the imported data
    // Merge with defaults to ensure any new settings fields are present
    settings.value = { ...defaultSettings, ...data.settings }
    leaveEntries.value = data.leaveEntries || []
    monthlyBalances.value = data.monthlyBalances || []
  }

  // Persistence
  const STORAGE_KEY = 'leave-planner-data'

  function load() {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const data = JSON.parse(stored)
        if (data.settings) {
          settings.value = { ...defaultSettings, ...data.settings }
        }
        if (data.leaveEntries) leaveEntries.value = data.leaveEntries
        if (data.monthlyBalances) monthlyBalances.value = data.monthlyBalances
      } catch (e) {
        console.error('Failed to load data from local storage', e)
      }
    }
  }

  watch([settings, leaveEntries, monthlyBalances], () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      settings: settings.value,
      leaveEntries: leaveEntries.value,
      monthlyBalances: monthlyBalances.value
    }))
  }, { deep: true })

  // Initialize
  load()

  return {
    settings,
    leaveEntries,
    monthlyBalances,
    addLeaveEntry,
    updateLeaveEntry,
    deleteLeaveEntry,
    setMonthlyBalance,
    updateSettings,
    importData // Expose the new action
  }
})
