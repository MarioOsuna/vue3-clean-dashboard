<script setup lang="ts">
import { computed } from 'vue'
import type { Metric } from '@/domain/metrics'

const props = defineProps<{
  metric: Metric
  active?: boolean
}>()

const formattedValue = computed(() => {
  const value = props.metric.value.toLocaleString('en-US')
  if (props.metric.unit === '€') return `€${value}`
  if (props.metric.unit === '%') return `${value}%`
  return value
})
</script>

<template>
  <div
    class="rounded-xl border bg-surface p-6 transition-colors"
    :class="active ? 'border-accent' : 'border-border'"
  >
    <p class="text-sm text-muted">{{ metric.label }}</p>
    <p class="mt-3 text-3xl font-semibold text-text">{{ formattedValue }}</p>
    <p class="mt-2 text-sm font-medium" :class="metric.trend === 'down' ? 'text-negative' : 'text-positive'">
      {{ metric.change > 0 ? '+' : '' }}{{ metric.change }}%
      <span class="font-normal text-muted">vs last month</span>
    </p>
  </div>
</template>
