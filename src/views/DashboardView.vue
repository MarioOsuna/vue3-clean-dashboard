<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useIndicators } from '@/composables/useIndicators'
import { useHealthCheck } from '@/composables/useHealthCheck'
import SeverityBadge from '@/components/ui/SeverityBadge.vue'
import type { SeverityLevel } from '@/domain/events'

const router = useRouter()
const { indicators, loading, error, load } = useIndicators()
const { readiness } = useHealthCheck()

onMounted(() => load())

const activeIocs = computed(() => indicators.value.filter((i) => i.is_active).length)
const highRiskCount = computed(() => indicators.value.filter((i) => i.risk_score >= 70).length)

const avgRiskScore = computed(() => {
  if (indicators.value.length === 0) return 0
  const sum = indicators.value.reduce((acc, i) => acc + i.risk_score, 0)
  return Math.round(sum / indicators.value.length)
})

const systemStatus = computed(() => {
  if (!readiness.value) return 'unknown'
  return readiness.value.status === 'ok' ? 'operational' : 'degraded'
})

const recentIndicators = computed(() =>
  [...indicators.value]
    .sort((a, b) => new Date(b.last_seen).getTime() - new Date(a.last_seen).getTime())
    .slice(0, 10),
)

function riskLevel(score: number): SeverityLevel {
  if (score >= 80) return 'critical'
  if (score >= 60) return 'high'
  if (score >= 30) return 'medium'
  return 'low'
}

function riskColor(score: number): string {
  if (score < 30) return 'success'
  if (score < 60) return 'warning'
  if (score < 80) return 'orange'
  return 'error'
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

function investigate(ip: string) {
  router.push({ path: '/investigate', query: { ip } })
}

const kpiCards = computed(() => [
  {
    label: 'Total Indicators',
    value: indicators.value.length,
    subtitle: 'All tracked IOCs',
    icon: 'mdi-shield-alert-outline',
    color: 'primary',
  },
  {
    label: 'Active IOCs',
    value: activeIocs.value,
    subtitle: 'Currently active',
    icon: 'mdi-alert-circle-outline',
    color: 'warning',
  },
  {
    label: 'High Risk',
    value: highRiskCount.value,
    subtitle: 'Score ≥ 70',
    icon: 'mdi-fire',
    color: 'error',
  },
  {
    label: 'System Status',
    value: systemStatus.value,
    subtitle: 'Backend services',
    icon: 'mdi-server',
    color: systemStatus.value === 'operational' ? 'success' : 'error',
    isStatus: true,
  },
])

const typeDistribution = computed(() => {
  const types = ['ip', 'domain', 'hash'] as const
  return types.map((t) => ({
    type: t,
    count: indicators.value.filter((i) => i.indicator_type === t).length,
    icon: t === 'ip' ? 'mdi-ip-network' : t === 'domain' ? 'mdi-web' : 'mdi-file-key',
  }))
})
</script>

<template>
  <v-container fluid class="pa-6 pa-md-8" style="max-width: 1280px;">
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-8">
      <div>
        <h1 class="text-h5 text-md-h4 font-weight-bold">Dashboard</h1>
        <p class="text-body-2 text-medium-emphasis mt-1">Threat intelligence overview</p>
      </div>
      <v-btn
        variant="tonal"
        color="primary"
        prepend-icon="mdi-refresh"
        :loading="loading"
        @click="load()"
      >
        Refresh
      </v-btn>
    </div>

    <v-alert v-if="error" type="error" variant="tonal" density="compact" class="mb-6" rounded="lg">
      {{ error }}
    </v-alert>

    <!-- KPI Cards -->
    <v-row v-if="loading">
      <v-col v-for="n in 4" :key="n" cols="12" sm="6" lg="3">
        <v-skeleton-loader type="card" height="140" />
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col v-for="kpi in kpiCards" :key="kpi.label" cols="12" sm="6" lg="3">
        <v-card class="pa-5 h-100">
          <div class="d-flex align-center ga-3 mb-4">
            <v-avatar :color="kpi.color" variant="tonal" size="42" rounded="lg">
              <v-icon :icon="kpi.icon" size="20" />
            </v-avatar>
            <span class="text-body-2 text-medium-emphasis">{{ kpi.label }}</span>
          </div>
          <div
            class="text-h4 font-weight-bold"
            :class="kpi.isStatus ? `text-${kpi.color} text-capitalize text-h5` : (kpi.color !== 'primary' && typeof kpi.value === 'number' && kpi.value > 0 ? `text-${kpi.color}` : '')"
          >
            {{ kpi.value }}
          </div>
          <div class="text-caption text-medium-emphasis mt-1">{{ kpi.subtitle }}</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Average Risk + Type Distribution -->
    <v-row class="mt-2">
      <v-col cols="12" md="8">
        <v-card class="pa-6">
          <div class="d-flex align-center justify-space-between mb-5">
            <div class="d-flex align-center ga-2">
              <v-icon icon="mdi-gauge" size="small" color="medium-emphasis" />
              <span class="text-body-2 text-medium-emphasis">Average Risk Score</span>
            </div>
            <div class="d-flex align-center ga-1">
              <span class="text-h5 font-weight-bold" :class="`text-${riskColor(avgRiskScore)}`">
                {{ avgRiskScore }}
              </span>
              <span class="text-body-2 text-medium-emphasis">/100</span>
            </div>
          </div>
          <v-progress-linear
            :model-value="avgRiskScore"
            :color="riskColor(avgRiskScore)"
            height="8"
            rounded
          />
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="pa-6 h-100">
          <div class="d-flex align-center ga-2 mb-5">
            <v-icon icon="mdi-chart-pie" size="small" color="medium-emphasis" />
            <span class="text-body-2 text-medium-emphasis">Indicators by Type</span>
          </div>
          <div class="d-flex ga-3">
            <v-card
              v-for="t in typeDistribution"
              :key="t.type"
              variant="flat"
              color="surface"
              class="flex-grow-1 text-center pa-3"
              rounded="lg"
            >
              <v-icon :icon="t.icon" size="18" class="mb-1" color="medium-emphasis" />
              <div class="text-h5 font-weight-bold">{{ t.count }}</div>
              <div class="text-caption text-uppercase text-medium-emphasis">{{ t.type }}</div>
            </v-card>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Recent Indicators Table -->
    <v-card class="mt-6">
      <v-card-title class="d-flex align-center ga-2 pa-5 pb-3">
        <v-icon icon="mdi-clock-outline" size="small" color="medium-emphasis" />
        <span class="text-body-1 font-weight-bold">Recent Indicators</span>
        <v-spacer />
        <v-chip size="small" variant="tonal" color="primary" v-if="recentIndicators.length">
          {{ recentIndicators.length }} shown
        </v-chip>
      </v-card-title>

      <v-divider />

      <v-table hover>
        <thead>
          <tr>
            <th class="text-uppercase text-caption font-weight-bold">Value</th>
            <th class="text-uppercase text-caption font-weight-bold">Type</th>
            <th class="text-uppercase text-caption font-weight-bold">Risk</th>
            <th class="text-uppercase text-caption font-weight-bold">Status</th>
            <th class="text-uppercase text-caption font-weight-bold">Last Seen</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="ind in recentIndicators"
            :key="ind.id"
            :class="ind.indicator_type === 'ip' ? 'cursor-pointer' : ''"
            @click="ind.indicator_type === 'ip' && investigate(ind.indicator_value)"
          >
            <td>
              <span class="font-weight-medium" style="font-family: 'JetBrains Mono', monospace; font-size: 0.8125rem;">
                {{ ind.indicator_value }}
              </span>
            </td>
            <td>
              <v-chip size="x-small" variant="outlined" class="text-uppercase" label>
                {{ ind.indicator_type }}
              </v-chip>
            </td>
            <td><SeverityBadge :severity="riskLevel(ind.risk_score)" /></td>
            <td>
              <div class="d-flex align-center ga-2">
                <v-icon
                  :icon="ind.is_active ? 'mdi-circle' : 'mdi-circle-outline'"
                  :color="ind.is_active ? 'success' : 'medium-emphasis'"
                  size="8"
                />
                <span class="text-body-2">{{ ind.is_active ? 'Active' : 'Inactive' }}</span>
              </div>
            </td>
            <td class="text-medium-emphasis text-body-2">{{ formatDate(ind.last_seen) }}</td>
          </tr>
          <tr v-if="recentIndicators.length === 0 && !loading">
            <td colspan="5" class="text-center pa-12">
              <v-icon icon="mdi-database-off-outline" size="48" color="medium-emphasis" class="mb-3 d-block mx-auto" style="opacity: 0.4;" />
              <p class="text-body-2 text-medium-emphasis">No indicators found</p>
              <p class="text-caption text-disabled mt-1">Register events or add threat intel to see data here</p>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
  </v-container>
</template>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
