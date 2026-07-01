import type { DoctorSlot } from '@/types/slot.types'
import { mockDoctors } from '@/mocks/doctors.mock'

const TIME_RANGES: Array<[string, string]> = [
  ['09:00', '09:30'],
  ['09:30', '10:00'],
  ['10:00', '10:30'],
  ['10:30', '11:00'],
  ['11:30', '12:00'],
  ['12:00', '12:30'],
]

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

function generateSlotsForDoctor(doctorId: string, daysAhead = 5): DoctorSlot[] {
  const slots: DoctorSlot[] = []
  const today = new Date()

  for (let dayOffset = 1; dayOffset <= daysAhead; dayOffset++) {
    const date = new Date(today)
    date.setDate(date.getDate() + dayOffset)

    if (date.getDay() === 0 || date.getDay() === 6) continue

    const isoDate = toIsoDate(date)

    TIME_RANGES.forEach(([startTime, endTime], index) => {
      const booked = (dayOffset + index) % 4 === 0
      slots.push({
        id: `${doctorId}-${isoDate}-${startTime}`,
        doctorId,
        date: isoDate,
        startTime,
        endTime,
        status: booked ? 'booked' : 'available',
      })
    })
  }

  return slots
}

export const mockSlots: DoctorSlot[] = mockDoctors.flatMap((doctor) => generateSlotsForDoctor(doctor.id))
