import type { Patient } from '@/types/patient.types'
import { mockPatients } from '@/mocks/patients.mock'
import { mockDelay } from '@/services/mockDelay'

export const patientsService = {
  getAll(): Promise<Patient[]> {
    return mockDelay([...mockPatients])
  },

  getById(id: string): Promise<Patient | undefined> {
    return mockDelay(mockPatients.find((patient) => patient.id === id))
  },
}
