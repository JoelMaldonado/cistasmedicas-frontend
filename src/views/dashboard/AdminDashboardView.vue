<script setup lang="ts">
import { onMounted } from 'vue'
import { useDoctorsStore } from '@/stores/doctors.store'
import { usePatientsStore } from '@/stores/patients.store'
import { useAppointments } from '@/composables/useAppointments'
import StatCard from '@/components/common/StatCard.vue'

const doctorsStore = useDoctorsStore()
const patientsStore = usePatientsStore()
const { stats: appointmentStats, ensureLoaded } = useAppointments()

onMounted(() => {
  doctorsStore.ensureLoaded()
  patientsStore.ensureLoaded()
  ensureLoaded()
})
</script>

<template>
  <div class="page">
    <div class="page-header">
      <h1>Panel de administración</h1>
      <p>Vista general del sistema de citas médicas.</p>
    </div>

    <div class="stat-grid">
      <StatCard icon="pi pi-user-plus" label="Total de médicos" :value="doctorsStore.doctors.length" color="#0284c7" />
      <StatCard icon="pi pi-users" label="Total de pacientes" :value="patientsStore.patients.length" color="#059669" />
      <StatCard icon="pi pi-calendar" label="Citas del sistema" :value="appointmentStats.total" color="#7c3aed" />
    </div>
  </div>
</template>
