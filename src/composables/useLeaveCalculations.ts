import { computed } from 'vue'
import { useLeaveStore } from '../stores/leaveStore'

export interface CalculatedRow {
  monthKey: string
  displayMonth: string
  openingBalance: number
  accrued: number
  taken: number
  closingBalance: number
  closingDays: number
  leaveDescriptions: string[] // New field
  isAccrualOverridden: boolean
  isBalanceOverridden: boolean
  notes: string
}

export function useLeaveCalculations() {
  const store = useLeaveStore()

  // Helper to format month as YYYY-MM
  const formatMonthKey = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
  }

  // Helper to format month for display (e.g., "Jan 2024")
  const formatMonthDisplay = (monthKey: string) => {
    const [year, month] = monthKey.split('-').map(Number)
    const date = new Date(year, month - 1)
    return date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
  }

  const rows = computed<CalculatedRow[]>(() => {
    const result: CalculatedRow[] = []
    
    // Safety check for settings
    if (!store.settings.startDate) return []
    
    const startDate = new Date(store.settings.startDate)
    // Normalize to 1st of month
    const currentDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1)
    
    const horizon = store.settings.projectionHorizon || 12
    const now = new Date()
    // Target end date: 1st of the month, 'horizon' months from now
    const targetEndDate = new Date(now.getFullYear(), now.getMonth() + horizon, 1)
    
    const hoursPerDay = store.settings.hoursPerDay || 7.6 // Default fallback
    
    // Loop until we pass the target end date
    let safetyCounter = 0
    const MAX_MONTHS = 600 // 50 years

    while (currentDate <= targetEndDate && safetyCounter < MAX_MONTHS) {
      const monthKey = formatMonthKey(currentDate)
      
      const storedMonth = store.monthlyBalances.find(m => m.month === monthKey)
      
      const previousRow = result.length > 0 ? result[result.length - 1] : null
      const openingBalance = previousRow ? previousRow.closingBalance : (store.settings.startBalance || 0)

      const isAccrualOverridden = storedMonth?.accrual != null
      const accrued = isAccrualOverridden
        ? storedMonth!.accrual!
        : (store.settings.defaultAccrualRate || 0)

      // Get leave entries for the month
      const leaveForMonth = store.leaveEntries.filter(entry => entry.startDate.startsWith(monthKey))
      const taken = leaveForMonth.reduce((sum, entry) => sum + entry.hoursTaken, 0)
      const leaveDescriptions = leaveForMonth.map(entry => entry.description).filter(Boolean) // Get non-empty descriptions

      const isBalanceOverridden = storedMonth?.balance != null
      let closingBalance: number
      
      if (isBalanceOverridden) {
        closingBalance = storedMonth!.balance!
      } else {
        closingBalance = openingBalance + accrued - taken
      }

      const closingDays = closingBalance / hoursPerDay

      result.push({
        monthKey,
        displayMonth: formatMonthDisplay(monthKey),
        openingBalance,
        accrued,
        taken,
        closingBalance,
        closingDays,
        leaveDescriptions,
        isAccrualOverridden,
        isBalanceOverridden,
        notes: storedMonth?.notes || ''
      })

      // Increment month
      currentDate.setMonth(currentDate.getMonth() + 1)
      safetyCounter++
    }

    return result
  })

  return {
    rows
  }
}
