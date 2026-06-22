import { ref } from 'vue'
import type { ThreatIndicator, IndicatorType } from '@/domain/threats'
import { fetchIndicators } from '@/api/threatsApi'

export function useIndicators() {
  const indicators = ref<ThreatIndicator[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function load(type?: IndicatorType) {
    loading.value = true
    error.value = null
    try {
      const res = await fetchIndicators(type)
      indicators.value = res.items
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
    } finally {
      loading.value = false
    }
  }

  return { indicators, loading, error, load }
}
