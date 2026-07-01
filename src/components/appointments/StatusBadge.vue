<script setup lang="ts">
import { computed } from 'vue'
import type { AppointmentStatus } from '@/types/appointment.types'

const props = defineProps<{
  status: AppointmentStatus
}>()

const STATUS_MAP: Record<AppointmentStatus, { label: string; severity: string }> = {
  pending: { label: 'Pendiente', severity: 'warn' },
  confirmed: { label: 'Confirmada', severity: 'success' },
  rejected: { label: 'Rechazada', severity: 'danger' },
  cancelled: { label: 'Cancelada', severity: 'secondary' },
  completed: { label: 'Completada', severity: 'info' },
}

const config = computed(() => STATUS_MAP[props.status])
</script>

<template>
  <Tag :value="config.label" :severity="config.severity" />
</template>
