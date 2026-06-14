<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMetrics, useMetricChart } from '@/application/useMetrics'
import MetricCard from '@/components/ui/MetricCard.vue'
import ChartCard from '@/components/ui/ChartCard.vue'

const { metrics, loading, error } = useMetrics()

const selectedId = ref('revenue')
const selectedMetric = computed(() => metrics.value.find((metric) => metric.id === selectedId.value))
const { data: chartData, loading: chartLoading } = useMetricChart(selectedId)
</script>

<template>
  <main class="mx-auto max-w-6xl px-6 py-12 sm:px-10 sm:py-16">
    <header class="mb-10">
      <h1 class="text-3xl font-semibold">Dashboard</h1>
      <p class="mt-2 text-sm text-muted">Overview of your key metrics</p>
    </header>

    <p v-if="error" class="mb-6 text-negative">{{ error }}</p>

    <div v-if="loading" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="n in 4" :key="n" class="h-32 animate-pulse rounded-xl bg-surface-2"></div>
    </div>

    <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <button v-for="metric in metrics" :key="metric.id" class="text-left" @click="selectedId = metric.id">
        <MetricCard :metric="metric" :active="selectedId === metric.id" />
      </button>
    </div>

    <div class="mt-10">
      <ChartCard
        v-if="selectedMetric"
        :title="`${selectedMetric.label} — last 7 months`"
        :data="chartData"
        :loading="chartLoading"
      />
    </div>
  </main>
</template>
