<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { useAppointments } from '@/composables/useAppointments'
import StatCard from '@/components/common/StatCard.vue'
import AppointmentCard from '@/components/appointments/AppointmentCard.vue'
import EmptyState from '@/components/common/EmptyState.vue'

const authStore = useAuthStore()
const { stats, upcomingAppointments, isLoading, ensureLoaded } = useAppointments()

onMounted(ensureLoaded)
</script>

<template>
  <div class="page">
    <div class="page-header">
      <h1>Hola, {{ authStore.user?.fullName }}</h1>
      <p>Este es el resumen de tus citas médicas.</p>
    </div>

    <div class="stat-grid">
      <StatCard icon="pi pi-calendar" label="Total de citas" :value="stats.total" color="#0284c7" />
      <StatCard icon="pi pi-clock" label="Próximas citas" :value="stats.upcoming" color="#059669" />
      <StatCard icon="pi pi-hourglass" label="Citas pendientes" :value="stats.pending" color="#d97706" />
    </div>

    <Card>
      <template #title>Próximas citas</template>
      <template #content>
        <div v-if="isLoading" class="loading">Cargando citas...</div>
        <div v-else-if="upcomingAppointments.length === 0">
          <EmptyState
            icon="pi pi-calendar-times"
            title="No tienes citas próximas"
            message="Agenda una cita con uno de nuestros médicos disponibles."
          />
        </div>
        <div v-else class="appointment-list">
          <AppointmentCard v-for="apt in upcomingAppointments.slice(0, 3)" :key="apt.id" :appointment="apt" />
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.appointment-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.loading {
  color: #64748b;
  padding: 1rem 0;
}
</style>
