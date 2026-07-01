export type AppointmentStatus = 'pending' | 'confirmed' | 'rejected' | 'cancelled' | 'completed'

export interface Appointment {
  id: string
  doctorId: string
  patientId: string
  doctorName: string
  patientName: string
  specialty: string
  date: string
  startTime: string
  endTime: string
  status: AppointmentStatus
  reason?: string
}
