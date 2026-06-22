export interface HealthStatus {
  status: string
  version: string
  environment: string
  timestamp: string
}

export interface ReadinessCheck {
  status: 'ok' | 'degraded'
  checks: {
    database: string
  }
}
