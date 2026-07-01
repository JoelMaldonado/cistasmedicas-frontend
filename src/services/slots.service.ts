import type { DoctorSlot } from '@/types/slot.types'
import { mockSlots } from '@/mocks/slots.mock'
import { mockDelay } from '@/services/mockDelay'

const SLOTS_PER_DAY = 6

export const slotsService = {
  getByDoctor(doctorId: string): Promise<DoctorSlot[]> {
    return mockDelay(mockSlots.filter((slot) => slot.doctorId === doctorId))
  },

  // El mock no persiste los horarios generados, solo simula el resultado del backend.
  generate(_doctorId: string, _startDate: string, days: number): Promise<{ createdCount: number }> {
    return mockDelay({ createdCount: days * SLOTS_PER_DAY }, 800)
  },
}
