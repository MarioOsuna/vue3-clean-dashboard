import { computed, isRef, watch, type Ref } from 'vue'
import { useMetricsStore } from '@/stores/metrics'

export function useMetrics() {
  const store = useMetricsStore()
  store.loadMetrics()

  return {
    metrics: computed(() => store.metrics),
    loading: computed(() => store.loading),
    error: computed(() => store.error),
  }
}

export function useMetricChart(metricId: string | Ref<string>) {
  const store = useMetricsStore()
  const id = isRef(metricId) ? metricId : computed(() => metricId)

  watch(id, (value) => store.loadChartData(value), { immediate: true })

  return {
    data: computed(() => store.chartData[id.value] ?? []),
    loading: computed(() => store.chartData[id.value] === undefined),
  }
}
