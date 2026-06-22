<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { EventType, SeverityLevel, CreateEventPayload } from '@/domain/events'
import { createEvent } from '@/api/eventsApi'
import { useToast } from '@/composables/useToast'

const { show } = useToast()

const eventTypes: { title: string; value: EventType }[] = [
  { title: 'Login Failure', value: 'login_failure' },
  { title: 'Port Scan', value: 'port_scan' },
  { title: 'Brute Force', value: 'brute_force' },
  { title: 'Suspicious Request', value: 'suspicious_request' },
  { title: 'Malware Detected', value: 'malware_detected' },
]

const severityItems: { title: string; value: SeverityLevel; color: string }[] = [
  { title: 'Low', value: 'low', color: 'success' },
  { title: 'Medium', value: 'medium', color: 'warning' },
  { title: 'High', value: 'high', color: 'orange' },
  { title: 'Critical', value: 'critical', color: 'error' },
]

const form = reactive({
  source_ip: '',
  event_type: 'login_failure' as EventType,
  severity: 'medium' as SeverityLevel,
  raw_payload: '',
  occurred_at: '',
})

const submitting = ref(false)
const formRef = ref()

const ipRules = [
  (v: string) => !!v.trim() || 'IP address is required',
  (v: string) => /^(\d{1,3}\.){3}\d{1,3}$/.test(v) || 'Invalid IP format (e.g. 192.168.1.1)',
]

const jsonRules = [
  (v: string) => {
    if (!v.trim()) return true
    try { JSON.parse(v); return true } catch { return 'Must be valid JSON' }
  },
]

async function submit() {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  submitting.value = true
  try {
    const payload: CreateEventPayload = {
      source_ip: form.source_ip,
      event_type: form.event_type,
      severity: form.severity,
    }
    if (form.raw_payload.trim()) {
      payload.raw_payload = JSON.parse(form.raw_payload)
    }
    if (form.occurred_at) {
      payload.occurred_at = new Date(form.occurred_at).toISOString()
    }

    const created = await createEvent(payload)
    show(`Event created — ID: ${created.id}`)
    formRef.value.reset()
    form.event_type = 'login_failure'
    form.severity = 'medium'
  } catch (e) {
    show(e instanceof Error ? e.message : 'Failed to create event', 'error')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <v-container fluid class="pa-6 pa-md-8" style="max-width: 720px;">
    <div class="mb-8">
      <h1 class="text-h5 text-md-h4 font-weight-bold">Register Event</h1>
      <p class="text-body-2 text-medium-emphasis mt-1">Submit a new security event to the system</p>
    </div>

    <v-card class="pa-6 pa-md-8">
      <v-form ref="formRef" @submit.prevent="submit">
        <v-text-field
          v-model="form.source_ip"
          label="Source IP"
          placeholder="192.168.1.100"
          prepend-inner-icon="mdi-ip-network"
          :rules="ipRules"
          class="mb-1"
        />

        <v-select
          v-model="form.event_type"
          label="Event Type"
          :items="eventTypes"
          prepend-inner-icon="mdi-alert-outline"
          class="mb-1"
        />

        <div class="text-body-2 text-medium-emphasis mb-3">Severity</div>
        <v-btn-toggle
          v-model="form.severity"
          mandatory
          color="primary"
          variant="outlined"
          divided
          class="mb-6"
          style="width: 100%;"
        >
          <v-btn
            v-for="s in severityItems"
            :key="s.value"
            :value="s.value"
            style="flex: 1;"
          >
            <v-icon :color="s.color" icon="mdi-circle" size="10" class="mr-2" />
            {{ s.title }}
          </v-btn>
        </v-btn-toggle>

        <v-textarea
          v-model="form.raw_payload"
          label="Raw Payload (optional)"
          placeholder='{"key": "value"}'
          prepend-inner-icon="mdi-code-json"
          :rules="jsonRules"
          rows="3"
          auto-grow
          class="mb-1"
          style="font-family: 'JetBrains Mono', monospace;"
        />

        <v-text-field
          v-model="form.occurred_at"
          label="Occurred At (optional)"
          type="datetime-local"
          prepend-inner-icon="mdi-clock-outline"
          class="mb-4"
        />

        <v-btn
          type="submit"
          color="primary"
          size="large"
          block
          :loading="submitting"
          prepend-icon="mdi-send"
        >
          Submit Event
        </v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>
