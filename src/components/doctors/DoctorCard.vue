<script setup lang="ts">
import { computed } from 'vue'
import type { Doctor } from '@/types/doctor.types'

const props = defineProps<{
  doctor: Doctor
}>()

defineEmits<{
  'view-availability': [doctorId: string]
}>()

const initials = computed(() =>
  props.doctor.fullName
    .replace(/^(Dr\.|Dra\.)\s*/i, '')
    .split(' ')
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join(''),
)
</script>

<template>
  <Card class="doctor-card">
    <template #content>
      <div class="doctor-card__body">
        <Avatar :label="initials" shape="circle" size="xlarge" style="background: #dbeafe; color: #1d4ed8" />
        <h3>{{ doctor.fullName }}</h3>
        <Tag :value="doctor.specialty" severity="info" />
        <p class="doctor-card__license">Colegiatura {{ doctor.licenseNumber }}</p>
        <Button
          label="Ver disponibilidad"
          icon="pi pi-calendar"
          class="doctor-card__button"
          @click="$emit('view-availability', doctor.id)"
        />
      </div>
    </template>
  </Card>
</template>

<style scoped>
.doctor-card__body {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.5rem;
  padding: 0.5rem 0 0.25rem;
}

.doctor-card__body h3 {
  margin: 0.25rem 0 0;
  font-size: 1rem;
  color: #1e293b;
}

.doctor-card__license {
  margin: 0;
  font-size: 0.8rem;
  color: #94a3b8;
}

.doctor-card__button {
  margin-top: 0.5rem;
  width: 100%;
}
</style>
