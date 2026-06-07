import type { ChartDataPoint, Metric, MetricsRepository } from '@/domain/metrics'

const MOCK_METRICS: Metric[] = [
  { id: 'revenue', label: 'Revenue', value: 48350, unit: '€', change: 12.4, trend: 'up' },
  { id: 'users', label: 'Active Users', value: 2847, unit: '', change: 8.1, trend: 'up' },
  { id: 'orders', label: 'Orders', value: 1293, unit: '', change: -3.2, trend: 'down' },
  { id: 'conversion', label: 'Conversion', value: 3.8, unit: '%', change: 0.4, trend: 'up' },
]

function generateChartData(base: number): ChartDataPoint[] {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
  return months.map((label, i) => ({
    label,
    value: Math.round(base * (0.6 + Math.random() * 0.8) * (1 + i * 0.04)),
  }))
}

export class MockMetricsRepository implements MetricsRepository {
  async fetchMetrics(): Promise<Metric[]> {
    await new Promise((r) => setTimeout(r, 400)) // simulate latency
    return MOCK_METRICS
  }

  async fetchChartData(metricId: string): Promise<ChartDataPoint[]> {
    await new Promise((r) => setTimeout(r, 300))
    const metric = MOCK_METRICS.find((m) => m.id === metricId)
    return generateChartData(metric?.value ?? 1000)
  }
}
