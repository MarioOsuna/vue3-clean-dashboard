export interface Metric {
  id: string
  label: string
  value: number
  unit: string
  change: number // percentage
  trend: 'up' | 'down' | 'stable'
}

export interface ChartDataPoint {
  label: string
  value: number
}

export interface MetricsRepository {
  fetchMetrics(): Promise<Metric[]>
  fetchChartData(metricId: string): Promise<ChartDataPoint[]>
}
