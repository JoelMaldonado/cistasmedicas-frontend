import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Doctor } from '@/types/doctor.types'
import { doctorsService, type CreateDoctorPayload } from '@/services/doctors.service'

export const useDoctorsStore = defineStore('doctors', () => {
  const doctors = ref<Doctor[]>([])
  const isLoading = ref(false)
  const hasLoaded = ref(false)

  async function fetchAll() {
    isLoading.value = true
    try {
      doctors.value = await doctorsService.getAll()
      hasLoaded.value = true
    } finally {
      isLoading.value = false
    }
  }

  async function ensureLoaded() {
    if (!hasLoaded.value) await fetchAll()
  }

  async function createDoctor(payload: CreateDoctorPayload) {
    const doctor = await doctorsService.create(payload)
    doctors.value.push(doctor)
    return doctor
  }

  return { doctors, isLoading, hasLoaded, fetchAll, ensureLoaded, createDoctor }
})
