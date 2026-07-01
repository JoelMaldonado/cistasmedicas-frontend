import type { Appointment, AppointmentStatus } from '@/types/appointment.types'
import { mockAppointments } from '@/mocks/appointments.mock'
import { mockDelay } from '@/services/mockDelay'

export interface CreateAppointmentPayload {
  doctorId: string
  doctorName: string
  specialty: string
  date: string
  startTime: string
  endTime: string
  reason?: string
}

export const appointmentsService = {
  getAll(): Promise<Appointment[]> {
    return mockDelay([...mockAppointments])
  },

  create(payload: CreateAppointmentPayload): Promise<Appointment> {
    const appointment: Appointment = {
      id: `apt-${Date.now()}`,
      doctorId: payload.doctorId,
      patientId: 'pat-1',
      doctorName: payload.doctorName,
      patientName: 'Kevin Hurtado',
      specialty: payload.specialty,
      date: payload.date,
      startTime: payload.startTime,
      endTime: payload.endTime,
      status: 'pending',
      reason: payload.reason,
    }
    return mockDelay(appointment, 700)
  },

  updateStatus(id: string, status: AppointmentStatus): Promise<{ id: string; status: AppointmentStatus }> {
    return mockDelay({ id, status }, 500)
  },

  reschedule(
    id: string,
    slot: { date: string; startTime: string; endTime: string },
  ): Promise<{ id: string; date: string; startTime: string; endTime: string }> {
    return mockDelay({ id, ...slot }, 500)
  },
}
