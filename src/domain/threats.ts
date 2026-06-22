export interface ThreatScore {
  source_ip: string
  risk_score: number
  event_count: number
  ioc_match: boolean
  severity_points: number
  ioc_points: number
}

export type IndicatorType = 'ip' | 'domain' | 'hash'

export interface ThreatIndicator {
  id: string
  indicator_value: string
  indicator_type: IndicatorType
  source: string
  risk_score: number
  is_active: boolean
  first_seen: string
  last_seen: string
}

export interface IndicatorsResponse {
  items: ThreatIndicator[]
  count: number
}
