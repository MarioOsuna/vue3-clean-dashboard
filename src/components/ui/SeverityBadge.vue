<script setup lang="ts">
import type { SeverityLevel } from '@/domain/events'

defineProps<{ severity: SeverityLevel }>()

const colorMap: Record<SeverityLevel, string> = {
  low: 'success',
  medium: 'warning',
  high: 'orange',
  critical: 'error',
}
</script>

<template>
  <v-chip
    :color="colorMap[severity]"
    size="small"
    variant="tonal"
    class="text-capitalize font-weight-medium"
  >
    {{ severity }}
  </v-chip>
</template>
