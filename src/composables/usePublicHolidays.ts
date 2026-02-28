import { ref, watch } from 'vue'
import { useLeaveStore } from '../stores/leaveStore'

// Cache for holiday data per year
const holidayCache = new Map<number, any[]>()
const isLoading = ref(false)
const error = ref<string | null>(null)

export function usePublicHolidays() {
  const store = useLeaveStore()
  const holidays = ref<any[]>([])

  async function fetchHolidaysForYear(year: number) {
    const urlTemplate = store.settings.publicHolidayUrlTemplate
    if (!urlTemplate) {
      holidays.value = []
      return
    }

    if (holidayCache.has(year)) {
      holidays.value = holidayCache.get(year)!
      return
    }

    isLoading.value = true
    error.value = null
    try {
      const url = urlTemplate.replace('{year}', String(year))
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Failed to fetch public holidays: ${response.statusText}`)
      }
      const data = await response.json()
      
      // Basic validation
      if (!Array.isArray(data) || (data.length > 0 && typeof data[0].date !== 'string')) {
        throw new Error('Invalid holiday data format')
      }

      holidayCache.set(year, data)
      holidays.value = data
    } catch (e: any) {
      error.value = e.message
      console.error(e)
    } finally {
      isLoading.value = false
    }
  }

  // Watch for URL changes to clear cache
  watch(() => store.settings.publicHolidayUrlTemplate, () => {
    holidayCache.clear()
  })

  return {
    holidays,
    isLoading,
    error,
    fetchHolidaysForYear
  }
}
