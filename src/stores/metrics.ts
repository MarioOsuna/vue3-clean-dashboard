import { defineStore } from 'pinia'
import type { ChartDataPoint, Metric } from '@/domain/metrics'
import { MockMetricsRepository } from '@/infrastructure/metricsApi'

const repo = new MockMetricsRepository()

export const useMetricsStore = defineStore('metrics', {
  state: () => ({
    metrics: [] as Metric[],
    loading: false,
    error: null as string | null,
    chartData: {} as Record<string, ChartDataPoint[]>,
  }),

  actions: {
    async loadMetrics() {
      if (this.metrics.length > 0 || this.loading) return
      this.loading = true
      this.error = null
      try {
        this.metrics = await repo.fetchMetrics()
      } catch {
        this.error = 'Failed to load metrics'
      } finally {
        this.loading = false
      }
    },

    async loadChartData(metricId: string) {
      if (this.chartData[metricId]) return
      this.chartData[metricId] = await repo.fetchChartData(metricId)
    },
  },
})
