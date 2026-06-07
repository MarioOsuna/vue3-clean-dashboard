import { ref, onMounted } from 'vue'
import type { ChartDataPoint, Metric } from '@/domain/metrics'
import { MockMetricsRepository } from '@/infrastructure/metricsApi'

const repo = new MockMetricsRepository()

export function useMetrics() {
  const metrics = ref<Metric[]>([])
  const loading = ref(true)
  const error = ref<string | null>(null)

  onMounted(async () => {
    try {
      metrics.value = await repo.fetchMetrics()
    } catch {
      error.value = 'Failed to load metrics'
    } finally {
      loading.value = false
    }
  })

  return { metrics, loading, error }
}

export function useMetricChart(metricId: string) {
  const data = ref<ChartDataPoint[]>([])
  const loading = ref(true)

  onMounted(async () => {
    data.value = await repo.fetchChartData(metricId)
    loading.value = false
  })

  return { data, loading }
}
