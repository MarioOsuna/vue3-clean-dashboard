import { ref } from 'vue'
import type { ThreatScore } from '@/domain/threats'
import { fetchThreatScore } from '@/api/threatsApi'

export function useThreatScore() {
  const score = ref<ThreatScore | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function lookup(ip: string) {
    loading.value = true
    error.value = null
    score.value = null
    try {
      score.value = await fetchThreatScore(ip)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
    } finally {
      loading.value = false
    }
  }

  return { score, loading, error, lookup }
}
