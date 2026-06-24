import type { HealthStatus, ReadinessCheck } from '@/domain/health'
import { API_BASE } from './client'

export async function fetchHealth(): Promise<HealthStatus> {
  const res = await fetch(`${API_BASE}/health`)
  if (!res.ok) throw new Error(`Health check failed: ${res.status}`)
  return res.json()
}

export async function fetchReadiness(): Promise<ReadinessCheck> {
  const res = await fetch(`${API_BASE}/health/ready`)
  const data: ReadinessCheck = await res.json()
  return data
}
