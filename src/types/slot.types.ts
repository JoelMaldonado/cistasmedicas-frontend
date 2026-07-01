export type SlotStatus = 'available' | 'booked'

export interface DoctorSlot {
  id: string
  doctorId: string
  date: string
  startTime: string
  endTime: string
  status: SlotStatus
}
