import type { SecurityEvent, CreateEventPayload } from '@/domain/events'
import { API_BASE } from './client'

export async function createEvent(payload: CreateEventPayload): Promise<SecurityEvent> {
  const res = await fetch(`${API_BASE}/api/v1/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(JSON.stringify(error.detail ?? error))
  }
  return res.json()
}
