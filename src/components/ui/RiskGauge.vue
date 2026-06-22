<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ score: number }>()

const rotation = computed(() => (props.score / 100) * 180 - 90)

const color = computed(() => {
  if (props.score <= 30) return '#34d399'
  if (props.score <= 60) return '#fbbf24'
  if (props.score <= 80) return '#f97316'
  return '#f87171'
})

const label = computed(() => {
  if (props.score <= 30) return 'Low'
  if (props.score <= 60) return 'Medium'
  if (props.score <= 80) return 'High'
  return 'Critical'
})

const vuetifyColor = computed(() => {
  if (props.score <= 30) return 'success'
  if (props.score <= 60) return 'warning'
  if (props.score <= 80) return 'orange'
  return 'error'
})
</script>

<template>
  <div class="d-flex flex-column align-center">
    <svg viewBox="0 0 200 120" style="width: 220px;">
      <path
        d="M 20 100 A 80 80 0 0 1 180 100"
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        stroke-width="14"
        stroke-linecap="round"
      />
      <path
        d="M 20 100 A 80 80 0 0 1 46.1 41.7"
        fill="none" stroke="#34d399" stroke-width="14" stroke-linecap="round" opacity="0.25"
      />
      <path
        d="M 46.1 41.7 A 80 80 0 0 1 100 20"
        fill="none" stroke="#fbbf24" stroke-width="14" opacity="0.25"
      />
      <path
        d="M 100 20 A 80 80 0 0 1 153.9 41.7"
        fill="none" stroke="#f97316" stroke-width="14" opacity="0.25"
      />
      <path
        d="M 153.9 41.7 A 80 80 0 0 1 180 100"
        fill="none" stroke="#f87171" stroke-width="14" stroke-linecap="round" opacity="0.25"
      />
      <line
        x1="100" y1="100" x2="100" y2="32"
        :stroke="color" stroke-width="3" stroke-linecap="round"
        :transform="`rotate(${rotation}, 100, 100)`"
        style="transition: transform 0.7s ease;"
      />
      <circle cx="100" cy="100" r="6" :fill="color" />
    </svg>
    <div class="text-center mt-3">
      <div class="text-h3 font-weight-bold" :class="`text-${vuetifyColor}`">{{ score }}</div>
      <div class="text-body-2 text-medium-emphasis mt-1">{{ label }} Risk</div>
    </div>
  </div>
</template>
