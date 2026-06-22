export type EventType =
  | 'login_failure'
  | 'port_scan'
  | 'brute_force'
  | 'suspicious_request'
  | 'malware_detected'

export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical'

export interface SecurityEvent {
  id: string
  source_ip: string
  event_type: EventType
  severity: SeverityLevel
  raw_payload?: Record<string, unknown>
  occurred_at?: string
  created_at: string
}

export interface CreateEventPayload {
  source_ip: string
  event_type: EventType
  severity: SeverityLevel
  raw_payload?: Record<string, unknown>
  occurred_at?: string
}
