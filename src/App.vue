<script setup lang="ts">
import { useHealthCheck } from '@/composables/useHealthCheck'
import { useToast } from '@/composables/useToast'
import { useRoute, useRouter } from 'vue-router'

const { readiness, error: healthError } = useHealthCheck()
const { toasts } = useToast()
const route = useRoute()
const router = useRouter()

const navItems = [
  { title: 'Dashboard', to: '/', icon: 'mdi-view-dashboard' },
  { title: 'Investigate IP', to: '/investigate', icon: 'mdi-magnify' },
  { title: 'Register Event', to: '/events/new', icon: 'mdi-plus-circle-outline' },
  { title: 'Threat Intel', to: '/intelligence', icon: 'mdi-shield-search' },
] as const

function statusColor(val: string): string {
  return val === 'ok' ? 'success' : 'error'
}
</script>

<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar flat color="surface" elevation="0" style="border-bottom: 1px solid rgba(255,255,255,0.06);">
      <template #prepend>
        <div class="d-flex align-center ga-2 ml-4">
          <v-avatar color="primary" variant="tonal" size="32" rounded="lg">
            <v-icon icon="mdi-shield-lock" size="18" />
          </v-avatar>
          <span class="text-subtitle-1 font-weight-bold letter-spacing-tight">
            Threat Dashboard
          </span>
        </div>
      </template>

      <v-tabs
        :model-value="route.path"
        color="primary"
        density="compact"
        class="ml-6"
      >
        <v-tab
          v-for="item in navItems"
          :key="item.to"
          :value="item.to"
          :prepend-icon="item.icon"
          size="small"
          @click="router.push(item.to)"
        >
          {{ item.title }}
        </v-tab>
      </v-tabs>

      <v-spacer />

      <div class="d-flex align-center ga-2 mr-4">
        <template v-if="readiness">
          <v-chip
            size="small"
            :color="statusColor(readiness.checks.database)"
            variant="tonal"
            label
          >
            <v-icon icon="mdi-database" size="14" start />
            DB
          </v-chip>
        </template>
        <v-chip v-else-if="healthError" size="small" color="error" variant="tonal" label>
          <v-icon icon="mdi-connection" size="14" start />
          Offline
        </v-chip>
        <v-progress-circular v-else indeterminate size="18" width="2" color="primary" />
      </div>
    </v-app-bar>

    <!-- Degraded Banner -->
    <v-banner
      v-if="healthError || (readiness && readiness.status === 'degraded')"
      color="error"
      icon="mdi-alert-circle-outline"
      density="compact"
      lines="one"
      style="z-index: 1;"
    >
      <template v-if="healthError">Backend unreachable — data may be stale</template>
      <template v-else>System degraded — some services are down</template>
    </v-banner>

    <!-- Main Content -->
    <v-main>
      <RouterView />
    </v-main>

    <!-- Toast Snackbars -->
    <v-snackbar
      v-for="toast in toasts"
      :key="toast.id"
      :model-value="true"
      :color="toast.type === 'success' ? 'success' : 'error'"
      location="bottom end"
      timeout="-1"
      rounded="lg"
    >
      <div class="d-flex align-center ga-2">
        <v-icon :icon="toast.type === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle'" size="small" />
        {{ toast.message }}
      </div>
    </v-snackbar>
  </v-app>
</template>

<style scoped>
.letter-spacing-tight {
  letter-spacing: -0.02em;
}
</style>
