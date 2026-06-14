<script setup lang="ts">
import { computed } from 'vue'
import type { ChartDataPoint } from '@/domain/metrics'

const props = defineProps<{
  title: string
  data: ChartDataPoint[]
  loading?: boolean
}>()

const max = computed(() => Math.max(...props.data.map((point) => point.value), 1))
</script>

<template>
  <div class="rounded-xl border border-border bg-surface p-6 sm:p-8">
    <p class="text-sm text-muted">{{ title }}</p>

    <div v-if="loading" class="mt-8 h-48 animate-pulse rounded bg-surface-2"></div>

    <div v-else class="mt-8 flex h-48 items-end gap-4">
      <div v-for="point in data" :key="point.label" class="flex flex-1 flex-col items-center gap-3">
        <div
          class="w-full rounded-t bg-accent/70 transition-all duration-500"
          :style="{ height: `${(point.value / max) * 100}%` }"
        ></div>
        <span class="text-xs text-muted">{{ point.label }}</span>
      </div>
    </div>
  </div>
</template>
