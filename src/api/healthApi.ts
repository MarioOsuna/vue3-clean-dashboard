import type { HealthStatus, ReadinessCheck } from '@/domain/health'

export async function fetchHealth(): Promise<HealthStatus> {
  const res = await fetch('/health')
  if (!res.ok) throw new Error(`Health check failed: ${res.status}`)
  return res.json()
}

export async function fetchReadiness(): Promise<ReadinessCheck> {
  const res = await fetch('/health/ready')
  const data: ReadinessCheck = await res.json()
  return data
}
