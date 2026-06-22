import { ref, onMounted, onUnmounted } from 'vue'
import type { ReadinessCheck } from '@/domain/health'
import { fetchReadiness } from '@/api/healthApi'

const POLL_INTERVAL = 30_000

export function useHealthCheck() {
  const readiness = ref<ReadinessCheck | null>(null)
  const error = ref(false)
  let timer: ReturnType<typeof setInterval> | null = null

  async function check() {
    try {
      readiness.value = await fetchReadiness()
      error.value = false
    } catch {
      error.value = true
      readiness.value = null
    }
  }

  onMounted(() => {
    check()
    timer = setInterval(check, POLL_INTERVAL)
  })

  onUnmounted(() => {
    if (timer) clearInterval(timer)
  })

  return { readiness, error, refresh: check }
}
