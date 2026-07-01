import { computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useAppointmentsStore } from '@/stores/appointments.store'
import type { CreateAppointmentPayload } from '@/services/appointments.service'

function sortKey(date: string, time: string): string {
  return `${date}T${time}`
}

export function useAppointments() {
  const store = useAppointmentsStore()
  const toast = useToast()

  const appointments = computed(() => store.appointments)
  const isLoading = computed(() => store.isLoading)

  const todayKey = new Date().toISOString().slice(0, 10)

  const upcomingAppointments = computed(() =>
    [...store.appointments]
      .filter((apt) => (apt.status === 'pending' || apt.status === 'confirmed') && apt.date >= todayKey)
      .sort((a, b) => sortKey(a.date, a.startTime).localeCompare(sortKey(b.date, b.startTime))),
  )

  const stats = computed(() => ({
    total: store.appointments.length,
    upcoming: upcomingAppointments.value.length,
    pending: store.appointments.filter((apt) => apt.status === 'pending').length,
  }))

  async function ensureLoaded() {
    await store.ensureLoaded()
  }

  async function requestAppointment(payload: CreateAppointmentPayload) {
    const appointment = await store.createAppointment(payload)
    toast.add({ severity: 'success', summary: 'Cita solicitada', detail: 'Tu cita quedó pendiente de confirmación.', life: 4000 })
    return appointment
  }

  async function cancelAppointment(id: string) {
    await store.updateStatus(id, 'cancelled')
    toast.add({ severity: 'info', summary: 'Cita cancelada', life: 3000 })
  }

  async function confirmAppointment(id: string) {
    await store.updateStatus(id, 'confirmed')
    toast.add({ severity: 'success', summary: 'Cita confirmada', life: 3000 })
  }

  async function rejectAppointment(id: string) {
    await store.updateStatus(id, 'rejected')
    toast.add({ severity: 'warn', summary: 'Cita rechazada', life: 3000 })
  }

  async function rescheduleAppointment(id: string, slot: { date: string; startTime: string; endTime: string }) {
    await store.reschedule(id, slot)
    toast.add({ severity: 'success', summary: 'Cita reagendada', life: 3000 })
  }

  return {
    appointments,
    isLoading,
    upcomingAppointments,
    stats,
    ensureLoaded,
    requestAppointment,
    cancelAppointment,
    confirmAppointment,
    rejectAppointment,
    rescheduleAppointment,
  }
}
