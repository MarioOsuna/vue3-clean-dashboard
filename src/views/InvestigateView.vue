<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useThreatScore } from '@/composables/useThreatScore'
import RiskGauge from '@/components/ui/RiskGauge.vue'

const route = useRoute()
const { score, loading, error, lookup } = useThreatScore()
const ipInput = ref('')

onMounted(() => {
  const queryIp = route.query.ip
  if (typeof queryIp === 'string' && queryIp) {
    ipInput.value = queryIp
    lookup(queryIp)
  }
})

const ipRules = [
  (v: string) => !!v.trim() || 'IP address is required',
  (v: string) => /^(\d{1,3}\.){3}\d{1,3}$/.test(v) || 'Invalid IP format',
]

function submit() {
  const ip = ipInput.value.trim()
  if (!ip || !/^(\d{1,3}\.){3}\d{1,3}$/.test(ip)) return
  lookup(ip)
}

function iocColor(match: boolean): string {
  return match ? 'error' : 'success'
}
</script>

<template>
  <v-container fluid class="pa-6 pa-md-8" style="max-width: 1024px;">
    <div class="mb-8">
      <h1 class="text-h5 text-md-h4 font-weight-bold">Investigate IP</h1>
      <p class="text-body-2 text-medium-emphasis mt-1">Look up threat score for any IP address</p>
    </div>

    <!-- Search -->
    <v-card class="pa-5 mb-6">
      <v-form @submit.prevent="submit">
        <div class="d-flex ga-3 align-start">
          <v-text-field
            v-model="ipInput"
            placeholder="e.g. 192.168.1.100"
            prepend-inner-icon="mdi-ip-network"
            :rules="ipRules"
            hide-details="auto"
            class="flex-grow-1"
          />
          <v-btn
            type="submit"
            color="primary"
            size="large"
            :loading="loading"
            :disabled="!ipInput.trim()"
            prepend-icon="mdi-magnify"
            min-width="120"
          >
            Search
          </v-btn>
        </div>
      </v-form>
    </v-card>

    <v-alert v-if="error" type="error" variant="tonal" density="compact" class="mb-6" rounded="lg">
      {{ error }}
    </v-alert>

    <!-- Results -->
    <v-row v-if="score">
      <v-col cols="12" md="5">
        <v-card class="pa-8 d-flex flex-column align-center h-100 justify-center">
          <RiskGauge :score="score.risk_score" />
        </v-card>
      </v-col>

      <v-col cols="12" md="7">
        <v-card class="pa-5 mb-4">
          <div class="d-flex align-center ga-2 mb-1">
            <v-icon icon="mdi-ip-network" size="small" color="medium-emphasis" />
            <span class="text-caption text-uppercase text-medium-emphasis">Source IP</span>
          </div>
          <div class="text-h6 font-weight-bold" style="font-family: 'JetBrains Mono', monospace;">
            {{ score.source_ip }}
          </div>
        </v-card>

        <v-row dense>
          <v-col cols="6">
            <v-card class="pa-5">
              <div class="d-flex align-center ga-2 mb-3">
                <v-icon icon="mdi-counter" size="18" color="primary" />
                <span class="text-caption text-uppercase text-medium-emphasis">Event Count</span>
              </div>
              <div class="text-h4 font-weight-bold">{{ score.event_count }}</div>
            </v-card>
          </v-col>
          <v-col cols="6">
            <v-card class="pa-5">
              <div class="d-flex align-center ga-2 mb-3">
                <v-icon icon="mdi-alert-decagram" size="18" :color="iocColor(score.ioc_match)" />
                <span class="text-caption text-uppercase text-medium-emphasis">IOC Match</span>
              </div>
              <div class="text-h4 font-weight-bold" :class="`text-${iocColor(score.ioc_match)}`">
                {{ score.ioc_match ? 'Yes' : 'No' }}
              </div>
            </v-card>
          </v-col>
          <v-col cols="6">
            <v-card class="pa-5">
              <div class="d-flex align-center ga-2 mb-3">
                <v-icon icon="mdi-alert" size="18" color="orange" />
                <span class="text-caption text-uppercase text-medium-emphasis">Severity Pts</span>
              </div>
              <div class="text-h4 font-weight-bold text-orange">{{ score.severity_points }}</div>
            </v-card>
          </v-col>
          <v-col cols="6">
            <v-card class="pa-5">
              <div class="d-flex align-center ga-2 mb-3">
                <v-icon icon="mdi-file-alert" size="18" color="warning" />
                <span class="text-caption text-uppercase text-medium-emphasis">IOC Points</span>
              </div>
              <div class="text-h4 font-weight-bold text-warning">{{ score.ioc_points }}</div>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- Empty State -->
    <v-card v-if="!score && !loading && !error" class="pa-16 text-center">
      <v-icon icon="mdi-magnify" size="64" color="primary" class="mb-4" style="opacity: 0.2;" />
      <p class="text-body-1 text-medium-emphasis">Enter an IP address to view its threat score</p>
    </v-card>
  </v-container>
</template>
