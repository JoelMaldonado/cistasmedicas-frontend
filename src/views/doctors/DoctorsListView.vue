<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDoctorsStore } from '@/stores/doctors.store'
import { usePagination } from '@/composables/usePagination'
import DoctorCard from '@/components/doctors/DoctorCard.vue'
import EmptyState from '@/components/common/EmptyState.vue'

const router = useRouter()
const doctorsStore = useDoctorsStore()

const doctors = computed(() => doctorsStore.doctors)
const { paginatedItems, page, totalPages, goToPage } = usePagination(doctors, 6)

onMounted(() => doctorsStore.ensureLoaded())

function handleViewAvailability(doctorId: string) {
  router.push(`/doctors/${doctorId}/slots`)
}
</script>

<template>
  <div class="page">
    <div class="page-header">
      <h1>Médicos disponibles</h1>
      <p>Elige un médico y revisa su disponibilidad de horarios.</p>
    </div>

    <div v-if="doctorsStore.isLoading" class="loading">Cargando médicos...</div>
    <EmptyState
      v-else-if="doctors.length === 0"
      icon="pi pi-users"
      title="No hay médicos disponibles"
      message="Vuelve a intentarlo más tarde."
    />
    <template v-else>
      <div class="card-grid">
        <DoctorCard
          v-for="doctor in paginatedItems"
          :key="doctor.id"
          :doctor="doctor"
          @view-availability="handleViewAvailability"
        />
      </div>

      <div v-if="totalPages > 1" class="pagination">
        <Button icon="pi pi-chevron-left" text :disabled="page === 1" @click="goToPage(page - 1)" />
        <span>Página {{ page }} de {{ totalPages }}</span>
        <Button icon="pi pi-chevron-right" text :disabled="page === totalPages" @click="goToPage(page + 1)" />
      </div>
    </template>
  </div>
</template>

<style scoped>
.loading {
  color: #64748b;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 1.5rem;
  color: #475569;
  font-size: 0.9rem;
}
</style>
