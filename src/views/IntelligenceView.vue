<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { IndicatorType } from '@/domain/threats'
import { useIndicators } from '@/composables/useIndicators'
import SeverityBadge from '@/components/ui/SeverityBadge.vue'
import type { SeverityLevel } from '@/domain/events'

const { indicators, loading, error, load } = useIndicators()
const filterType = ref<IndicatorType | ''>('')
const searchQuery = ref('')

onMounted(() => load())

function applyFilter() {
  load(filterType.value || undefined)
}

const filtered = computed(() => {
  if (!searchQuery.value.trim()) return indicators.value
  const q = searchQuery.value.toLowerCase()
  return indicators.value.filter(
    (i) =>
      i.indicator_value.toLowerCase().includes(q) ||
      i.source.toLowerCase().includes(q),
  )
})

function riskLevel(score: number): SeverityLevel {
  if (score >= 80) return 'critical'
  if (score >= 60) return 'high'
  if (score >= 30) return 'medium'
  return 'low'
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

const typeButtons: { value: IndicatorType | ''; label: string; icon: string }[] = [
  { value: '', label: 'All', icon: 'mdi-filter-off' },
  { value: 'ip', label: 'IP', icon: 'mdi-ip-network' },
  { value: 'domain', label: 'Domain', icon: 'mdi-web' },
  { value: 'hash', label: 'Hash', icon: 'mdi-file-key' },
]
</script>

<template>
  <v-container fluid class="pa-6 pa-md-8" style="max-width: 1280px;">
    <div class="d-flex align-center justify-space-between mb-8">
      <div>
        <h1 class="text-h5 text-md-h4 font-weight-bold">Threat Intelligence</h1>
        <p class="text-body-2 text-medium-emphasis mt-1">Browse and filter threat indicators</p>
      </div>
      <v-btn variant="tonal" color="primary" prepend-icon="mdi-refresh" :loading="loading" @click="applyFilter()">
        Refresh
      </v-btn>
    </div>

    <v-alert v-if="error" type="error" variant="tonal" density="compact" class="mb-6" rounded="lg">
      {{ error }}
    </v-alert>

    <!-- Filters -->
    <v-card class="pa-4 mb-6">
      <div class="d-flex flex-wrap ga-3 align-center">
        <v-text-field
          v-model="searchQuery"
          placeholder="Search by value or source…"
          prepend-inner-icon="mdi-magnify"
          hide-details
          density="compact"
          class="flex-grow-1"
          style="min-width: 200px; max-width: 420px;"
        />
        <v-btn-toggle
          v-model="filterType"
          mandatory
          color="primary"
          variant="outlined"
          density="compact"
          divided
          @update:model-value="applyFilter()"
        >
          <v-btn v-for="t in typeButtons" :key="t.value" :value="t.value" size="small">
            <v-icon :icon="t.icon" size="16" class="mr-1" />
            {{ t.label }}
          </v-btn>
        </v-btn-toggle>
        <v-spacer />
        <v-chip variant="tonal" size="small" color="primary">
          {{ filtered.length }} of {{ indicators.length }}
        </v-chip>
      </div>
    </v-card>

    <!-- Loading -->
    <v-skeleton-loader v-if="loading" type="table" />

    <!-- Table -->
    <v-card v-else>
      <v-table hover>
        <thead>
          <tr>
            <th class="text-uppercase text-caption font-weight-bold">Value</th>
            <th class="text-uppercase text-caption font-weight-bold">Type</th>
            <th class="text-uppercase text-caption font-weight-bold">Source</th>
            <th class="text-uppercase text-caption font-weight-bold">Risk</th>
            <th class="text-uppercase text-caption font-weight-bold">Status</th>
            <th class="text-uppercase text-caption font-weight-bold">First Seen</th>
            <th class="text-uppercase text-caption font-weight-bold">Last Seen</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ind in filtered" :key="ind.id">
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
            <td class="text-medium-emphasis">{{ ind.source }}</td>
            <td>
              <div class="d-flex align-center ga-2">
                <SeverityBadge :severity="riskLevel(ind.risk_score)" />
                <span class="text-caption text-medium-emphasis">{{ ind.risk_score }}</span>
              </div>
            </td>
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
            <td class="text-medium-emphasis text-body-2">{{ formatDate(ind.first_seen) }}</td>
            <td class="text-medium-emphasis text-body-2">{{ formatDate(ind.last_seen) }}</td>
          </tr>
          <tr v-if="filtered.length === 0">
            <td colspan="7" class="text-center pa-12">
              <v-icon icon="mdi-database-off-outline" size="48" color="medium-emphasis" class="mb-3 d-block mx-auto" style="opacity: 0.4;" />
              <p class="text-body-2 text-medium-emphasis">
                {{ searchQuery ? 'No indicators match your search' : 'No indicators found' }}
              </p>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
  </v-container>
</template>
