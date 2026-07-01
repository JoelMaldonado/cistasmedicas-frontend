<script setup lang="ts">
import type { Appointment } from '@/types/appointment.types'
import StatusBadge from '@/components/appointments/StatusBadge.vue'

defineProps<{
  appointment: Appointment
}>()

function formatDate(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString('es-PE', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  })
}
</script>

<template>
  <div class="appointment-card">
    <div class="appointment-card__date">
      <i class="pi pi-calendar" />
      <span>{{ formatDate(appointment.date) }}</span>
      <span class="appointment-card__time">{{ appointment.startTime }}</span>
    </div>
    <div class="appointment-card__info">
      <p class="appointment-card__doctor">{{ appointment.doctorName }}</p>
      <p class="appointment-card__specialty">{{ appointment.specialty }}</p>
    </div>
    <StatusBadge :status="appointment.status" />
  </div>
</template>

<style scoped>
.appointment-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.9rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #fff;
}

.appointment-card__date {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
  min-width: 70px;
  color: #0284c7;
  font-size: 0.8rem;
  text-transform: capitalize;
}

.appointment-card__time {
  font-weight: 700;
  font-size: 0.95rem;
  color: #0f172a;
}

.appointment-card__info {
  flex: 1;
}

.appointment-card__doctor {
  margin: 0;
  font-weight: 600;
  color: #1e293b;
}

.appointment-card__specialty {
  margin: 0.1rem 0 0;
  font-size: 0.85rem;
  color: #64748b;
}
</style>
