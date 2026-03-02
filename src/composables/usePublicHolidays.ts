import { ref, watch } from 'vue'
import { useLeaveStore } from '../stores/leaveStore'

// Cache for holiday data per year and country
const holidayCache = new Map<string, any[]>() // Key: `${year}-${countryCode}`
const isLoading = ref(false)
const error = ref<string | null>(null)

export function usePublicHolidays() {
  const store = useLeaveStore()
  const holidays = ref<any[]>([])

  async function fetchHolidaysForYear(year: number) {
    const countryCode = store.settings.holidayCountry
    const countyCode = store.settings.holidayCounty

    if (!countryCode) {
      holidays.value = []
      return
    }

    const cacheKey = `${year}-${countryCode}`
    let data: any[] = []

    if (holidayCache.has(cacheKey)) {
      data = holidayCache.get(cacheKey)!
    } else {
      isLoading.value = true
      error.value = null
      try {
        const url = `https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`Failed to fetch public holidays: ${response.statusText}`)
        }
        data = await response.json()
        
        // Basic validation
        if (!Array.isArray(data) || (data.length > 0 && typeof data[0].date !== 'string')) {
          throw new Error('Invalid holiday data format')
        }

        holidayCache.set(cacheKey, data)
      } catch (e: any) {
        error.value = e.message
        console.error(e)
        data = []
      } finally {
        isLoading.value = false
      }
    }

    // Filter by county if selected
    if (countyCode) {
      holidays.value = data.filter(h => {
        // Keep if global is true OR if counties list contains the selected county
        return h.global === true || (h.counties && h.counties.includes(countyCode))
      })
    } else {
      // If no county selected, maybe we should only show global ones? 
      // Or show all? Usually if no county is selected, showing all might be confusing if they are regional.
      // But for now, let's show all or maybe just global?
      // Let's assume if no county is selected, we show all (or maybe the user intends to see national holidays).
      // A safer bet for "Country" level selection is to show everything or just global. 
      // Let's show all for now, as the user can refine by selecting a county.
      holidays.value = data
    }
  }

  // Watch for country/county changes to clear cache or re-filter
  watch(() => [store.settings.holidayCountry, store.settings.holidayCounty], () => {
    // We don't necessarily need to clear the cache if only county changes, but it's simpler.
    // Actually, if we cache by year-country, we can reuse it when county changes.
    // But for simplicity, let's just re-fetch/re-filter.
    // The fetchHolidaysForYear is called by the component (WfhModal) when it opens or changes months.
    // So we might need to trigger a refetch if the settings change while the modal is open?
    // The WfhModal likely calls fetchHolidaysForYear on mount or watch.
  })

  return {
    holidays,
    isLoading,
    error,
    fetchHolidaysForYear
  }
}
