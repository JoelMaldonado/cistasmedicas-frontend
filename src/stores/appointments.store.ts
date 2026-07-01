import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Appointment, AppointmentStatus } from '@/types/appointment.types'
import {
  appointmentsService,
  type CreateAppointmentPayload,
} from '@/services/appointments.service'

export const useAppointmentsStore = defineStore('appointments', () => {
  const appointments = ref<Appointment[]>([])
  const isLoading = ref(false)
  const hasLoaded = ref(false)

  async function fetchAll() {
    isLoading.value = true
    try {
      appointments.value = await appointmentsService.getAll()
      hasLoaded.value = true
    } finally {
      isLoading.value = false
    }
  }

  async function ensureLoaded() {
    if (!hasLoaded.value) await fetchAll()
  }

  async function createAppointment(payload: CreateAppointmentPayload) {
    const appointment = await appointmentsService.create(payload)
    appointments.value.unshift(appointment)
    return appointment
  }

  async function updateStatus(id: string, status: AppointmentStatus) {
    await appointmentsService.updateStatus(id, status)
    const appointment = appointments.value.find((item) => item.id === id)
    if (appointment) appointment.status = status
  }

  async function reschedule(id: string, slot: { date: string; startTime: string; endTime: string }) {
    await appointmentsService.reschedule(id, slot)
    const appointment = appointments.value.find((item) => item.id === id)
    if (appointment) Object.assign(appointment, slot)
  }

  return {
    appointments,
    isLoading,
    hasLoaded,
    fetchAll,
    ensureLoaded,
    createAppointment,
    updateStatus,
    reschedule,
  }
})
