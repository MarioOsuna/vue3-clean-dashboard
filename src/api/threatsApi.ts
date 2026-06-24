import type { ThreatScore } from '@/domain/threats'
import type { IndicatorType } from '@/domain/threats'
import type { IndicatorsResponse } from '@/domain/threats'
import { API_BASE } from './client'

export async function fetchThreatScore(ip: string): Promise<ThreatScore> {
  const res = await fetch(`${API_BASE}/api/v1/threats/${encodeURIComponent(ip)}/score`)
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(JSON.stringify(error.detail ?? error))
  }
  return res.json()
}

export async function fetchIndicators(
  indicatorType?: IndicatorType,
  limit = 100,
): Promise<IndicatorsResponse> {
  const params = new URLSearchParams()
  if (indicatorType) params.set('indicator_type', indicatorType)
  params.set('limit', String(limit))

  const res = await fetch(`${API_BASE}/api/v1/threats/indicators?${params}`)
  if (!res.ok) throw new Error(`Failed to fetch indicators: ${res.status}`)
  return res.json()
}
