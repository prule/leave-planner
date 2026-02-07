import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export interface Settings {
  startBalance: number
  startDate: string // YYYY-MM-DD
  defaultAccrualRate: number
  projectionHorizon: number
  hoursPerDay: number
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

export const useLeaveStore = defineStore('leave', () => {
  // Default State
  const defaultSettings: Settings = {
    startBalance: 0,
    startDate: new Date().toISOString().split('T')[0],
    defaultAccrualRate: 10,
    projectionHorizon: 12,
    hoursPerDay: 7.6 // Default standard working day
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
      // Merge existing with new
      const existing = monthlyBalances.value[index]
      const updated = { ...existing, ...balance }
      
      // Clean up undefined/null values if we want to keep the object clean, 
      // but keeping them as null is fine for our logic (null = explicit "no override")
      // However, if we want to truly "unset", we can check:
      if (balance.accrual === undefined && existing.accrual !== undefined) updated.accrual = existing.accrual
      if (balance.balance === undefined && existing.balance !== undefined) updated.balance = existing.balance
      
      // Use splice to ensure reactivity triggers
      monthlyBalances.value.splice(index, 1, updated)
    } else {
      monthlyBalances.value.push(balance)
    }
  }

  function updateSettings(newSettings: Settings) {
    settings.value = newSettings
  }

  // Persistence
  const STORAGE_KEY = 'leave-planner-data'

  function load() {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const data = JSON.parse(stored)
        // Merge loaded settings with defaults to ensure all fields exist
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
    updateSettings
  }
})
